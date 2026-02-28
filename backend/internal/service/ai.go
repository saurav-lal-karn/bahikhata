package service

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
)

type AIService interface {
	AnalyzeDocument(ctx context.Context, fileHeader *multipart.FileHeader, familyID, userID uuid.UUID, documentType string) (interface{}, error)
	OCRClassify(ctx context.Context, fileHeader *multipart.FileHeader, familyID, userID uuid.UUID) (interface{}, uuid.UUID, error)
	ExtractStructured(ctx context.Context, ocrText, transactionType, category string) (interface{}, error)
	StoreDocument(ctx context.Context, fileID uuid.UUID, ocrText string, metadata map[string]interface{}) (interface{}, error)
}

type aiService struct {
	env      *config.Env
	repo     repository.AttachmentRepository
}

func NewAIService(env *config.Env, repo repository.AttachmentRepository) AIService {
	return &aiService{env: env, repo: repo}
}

// ValidateFile validates file size and type
func (s *aiService) ValidateFile(fileHeader *multipart.FileHeader) error {
	const maxFileSize = 10 * 1024 * 1024 // 10MB
	
	if fileHeader.Size > maxFileSize {
		return fmt.Errorf("file size exceeds maximum allowed size of 10MB")
	}
	
	// Check file type
	contentType := fileHeader.Header.Get("Content-Type")
	allowedTypes := []string{"image/jpeg", "image/png", "image/jpg", "image/webp", "application/pdf"}
	
	isAllowed := false
	for _, allowedType := range allowedTypes {
		if strings.HasPrefix(contentType, allowedType) {
			isAllowed = true
			break
		}
	}
	
	if !isAllowed {
		return fmt.Errorf("file type %s not allowed. Please upload images (JPEG, PNG, WebP) or PDF files", contentType)
	}
	
	return nil
}

// callAIServerWithRetry calls AI server with retry logic
func (s *aiService) callAIServerWithRetry(ctx context.Context, requestBody []byte, maxRetries int) ([]byte, error) {
	targetURL := fmt.Sprintf("%s/api/v1/analyzer/analyze", s.env.AIServerUrl)
	
	var lastErr error
	for attempt := 0; attempt <= maxRetries; attempt++ {
		if attempt > 0 {
			// Exponential backoff: 1s, 2s, 4s
			waitTime := time.Duration(1<<uint(attempt-1)) * time.Second
			select {
			case <-time.After(waitTime):
			case <-ctx.Done():
				return nil, ctx.Err()
			}
		}
		
		req, err := http.NewRequestWithContext(ctx, "POST", targetURL, bytes.NewBuffer(requestBody))
		if err != nil {
			lastErr = err
			continue
		}
		req.Header.Set("Content-Type", "application/json")
		
		client := &http.Client{Timeout: 60 * time.Second}
		resp, err := client.Do(req)
		if err != nil {
			lastErr = fmt.Errorf("attempt %d failed: %w", attempt+1, err)
			continue
		}
		defer resp.Body.Close()
		
		if resp.StatusCode == http.StatusOK {
			respData, err := io.ReadAll(resp.Body)
			if err != nil {
				return nil, err
			}
			return respData, nil
		}
		
		respBody, _ := io.ReadAll(resp.Body)
		lastErr = fmt.Errorf("AI server returned status %d: %s", resp.StatusCode, string(respBody))
	}

	return nil, fmt.Errorf("failed after %d attempts: %w", maxRetries+1, lastErr)
}

func (s *aiService) OCRClassify(ctx context.Context, fileHeader *multipart.FileHeader, familyID, userID uuid.UUID) (interface{}, uuid.UUID, error) {
	// 1. Save file locally
	file, err := fileHeader.Open()
	if err != nil {
		return nil, uuid.Nil, err
	}
	defer file.Close()

	uploadDir := "uploads"
	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		return nil, uuid.Nil, err
	}

	fileID := uuid.New()
	filename := fmt.Sprintf("%s%s", fileID.String(), filepath.Ext(fileHeader.Filename))
	filePath := filepath.Join(uploadDir, filename)

	dst, err := os.Create(filePath)
	if err != nil {
		return nil, uuid.Nil, err
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		return nil, uuid.Nil, err
	}

	// 2. Create Attachment in DB (AI_ANALYSIS type)
	attachment := &model.Attachment{
		ID:         fileID,
		FileName:   fileHeader.Filename,
		FilePath:   filePath,
		FileSize:   int(fileHeader.Size),
		FileType:   fileHeader.Header.Get("Content-Type"),
		FamilyID:   familyID,
		EntityType: "AI_ANALYSIS",
		EntityID:   fileID, // Use fileID as temporary EntityID
		UploadedBy: &userID,
	}

	if err := s.repo.Create(attachment); err != nil {
		return nil, uuid.Nil, err
	}

	// 3. Call AI Server
	fileURL := fmt.Sprintf("%s/uploads/%s", s.env.AppUrl, filename)
	requestBody, err := json.Marshal(map[string]interface{}{
		"file_url":  fileURL,
		"family_id": familyID,
	})
	if err != nil {
		return nil, uuid.Nil, err
	}

	targetURL := fmt.Sprintf("%s/api/v1/analyzer/ocr-classify", s.env.AIServerUrl)
	resp, err := s.callExternalAI(ctx, targetURL, requestBody)
	return resp, attachment.ID, err
}

func (s *aiService) ExtractStructured(ctx context.Context, ocrText, transactionType, category string) (interface{}, error) {
	requestBody, err := json.Marshal(map[string]interface{}{
		"ocr_text":         ocrText,
		"transaction_type": transactionType,
		"category":        category,
	})
	if err != nil {
		return nil, err
	}

	targetURL := fmt.Sprintf("%s/api/v1/analyzer/extract-structured", s.env.AIServerUrl)
	return s.callExternalAI(ctx, targetURL, requestBody)
}

func (s *aiService) StoreDocument(ctx context.Context, fileID uuid.UUID, ocrText string, metadata map[string]interface{}) (interface{}, error) {
	requestBody, err := json.Marshal(map[string]interface{}{
		"file_id":  fileID,
		"ocr_text": ocrText,
		"metadata": metadata,
	})
	if err != nil {
		return nil, err
	}

	targetURL := fmt.Sprintf("%s/api/v1/analyzer/store-document", s.env.AIServerUrl)
	return s.callExternalAI(ctx, targetURL, requestBody)
}

func (s *aiService) callExternalAI(ctx context.Context, targetURL string, requestBody []byte) (interface{}, error) {
	req, err := http.NewRequestWithContext(ctx, "POST", targetURL, bytes.NewBuffer(requestBody))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 60 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	return io.ReadAll(resp.Body)
}

func (s *aiService) AnalyzeDocument(ctx context.Context, fileHeader *multipart.FileHeader, familyID, userID uuid.UUID, documentType string) (interface{}, error) {
	// 0. Validate file
	if err := s.ValidateFile(fileHeader); err != nil {
		return nil, fmt.Errorf("file validation failed: %w", err)
	}
	
	file, err := fileHeader.Open()
	if err != nil {
		return nil, err
	}
	defer file.Close()

	// 1. Save file locally
	filename := fmt.Sprintf("%d_%s", uuid.New().ID(), fileHeader.Filename)
	savePath := filepath.Join("uploads", filename)
	
	// Ensure uploads directory exists (usually handled at app start, but being safe)
	out, err := os.Create(savePath)
	if err != nil {
		return nil, fmt.Errorf("failed to create local file: %w", err)
	}
	defer out.Close()
	_, err = io.Copy(out, file)
	if err != nil {
		return nil, fmt.Errorf("failed to save file: %w", err)
	}

	// 2. Create Attachment in DB
	attachment := &model.Attachment{
		FamilyID:   familyID,
		FileName:   fileHeader.Filename,
		FilePath:   savePath,
		FileType:   fileHeader.Header.Get("Content-Type"),
		FileSize:   int(fileHeader.Size),
		EntityType: "AI_ANALYSIS",
		EntityID:   uuid.New(), // Placeholder or specific internal ID
		UploadedBy: &userID,
	}

	if err := s.repo.Create(attachment); err != nil {
		return nil, fmt.Errorf("failed to store attachment: %w", err)
	}

	// 3. Prepare request body for AI server
	fileURL := fmt.Sprintf("%s/uploads/%s", s.env.AppUrl, filename)
	requestBody, err := json.Marshal(map[string]interface{}{
		"file_id":   attachment.ID,
		"file_url":  fileURL,
		"user_id":   userID,
		"family_id": familyID,
		"document_type": documentType,
	})
	if err != nil {
		return nil, err
	}

	// 4. Call AI server with retry logic (max 3 retries)
	respData, err := s.callAIServerWithRetry(ctx, requestBody, 2)
	if err != nil {
		return nil, fmt.Errorf("AI analysis failed: %w", err)
	}
	
	return respData, nil
}
