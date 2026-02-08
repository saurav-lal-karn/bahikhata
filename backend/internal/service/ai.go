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

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
)

type AIService interface {
	AnalyzeDocument(ctx context.Context, fileHeader *multipart.FileHeader, familyID, userID uuid.UUID) (interface{}, error)
}

type aiService struct {
	env      *config.Env
	repo     repository.AttachmentRepository
}

func NewAIService(env *config.Env, repo repository.AttachmentRepository) AIService {
	return &aiService{env: env, repo: repo}
}

func (s *aiService) AnalyzeDocument(ctx context.Context, fileHeader *multipart.FileHeader, familyID, userID uuid.UUID) (interface{}, error) {
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

	// 3. Prepare AI server call
	// Construct a "public" URL (internal networking or absolute path)
	fileURL := fmt.Sprintf("%s/uploads/%s", s.env.AppUrl, filename)

	requestBody, err := json.Marshal(map[string]interface{}{
		"file_id":   attachment.ID,
		"file_url":  fileURL,
		"user_id":   userID,
		"family_id": familyID,
	})
	if err != nil {
		return nil, err
	}

	targetURL := fmt.Sprintf("%s/api/v1/analyzer/analyze", s.env.AIServerUrl)
	req, err := http.NewRequestWithContext(ctx, "POST", targetURL, bytes.NewBuffer(requestBody))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		respBody, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("AI server returned status %d: %s", resp.StatusCode, string(respBody))
	}

	// For simplicity, we just return the raw response from AI server
	// We could decode into a struct but returning interface{} is fine for proxying a mock response
	// The frontend will handle the specific structure
	respData, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	
	return respData, nil
}
