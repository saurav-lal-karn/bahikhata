package controller

import (
	"fmt"
	"net/http"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
)

type AttachmentController struct {
	repo repository.AttachmentRepository
}

func NewAttachmentController(repo repository.AttachmentRepository) *AttachmentController {
	return &AttachmentController{repo: repo}
}

func (c *AttachmentController) Upload(ctx *gin.Context) {
	familyID, _ := ctx.Get("family_id")
	fid := familyID.(uuid.UUID)

	file, err := ctx.FormFile("file")
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}

	entityType := ctx.PostForm("entity_type")
	entityIDStr := ctx.PostForm("entity_id")
	entityID, err := uuid.Parse(entityIDStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Entity ID"})
		return
	}

	// Save file locally (for demo purposes)
	filename := fmt.Sprintf("%d_%s", uuid.New().ID(), file.Filename)
	savePath := filepath.Join("uploads", filename)
	if err := ctx.SaveUploadedFile(file, savePath); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	attachment := &model.Attachment{
		FamilyID:   fid,
		FileName:   file.Filename,
		FilePath:   savePath,
		FileType:   file.Header.Get("Content-Type"),
		FileSize:   int(file.Size),
		EntityType: entityType,
		EntityID:   entityID,
	}

	if err := c.repo.Create(attachment); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, attachment)
}

func (c *AttachmentController) GetByEntity(ctx *gin.Context) {
	entityType := ctx.Query("type")
	entityID, err := uuid.Parse(ctx.Query("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Entity ID"})
		return
	}

	attachments, err := c.repo.GetByEntity(entityType, entityID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, attachments)
}

func (c *AttachmentController) GetByID(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	attachment, err := c.repo.GetByID(id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Attachment not found"})
		return
	}

	ctx.JSON(http.StatusOK, attachment)
}

func (c *AttachmentController) Delete(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := c.repo.Delete(id); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Attachment deleted"})
}
