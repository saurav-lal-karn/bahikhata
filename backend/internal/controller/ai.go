package controller

import (
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/helper"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

type AIController struct {
	svc service.AIService
}

func NewAIController(svc service.AIService) *AIController {
	return &AIController{svc: svc}
}

func (ctrl *AIController) Analyze(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, "No file uploaded")
		return
	}

	userID, err := getUserIDFromContext(c)
	if err != nil {
		helper.ErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}

	familyID, err := parseUUIDQuery(c, "family_id")
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	resp, err := ctrl.svc.AnalyzeDocument(c.Request.Context(), file, familyID, userID, "")
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	// Since AIService returns []byte (raw JSON from AI server), we unmarshal it to extract the data part
	var aiResp struct {
		Success bool        `json:"success"`
		Data    interface{} `json:"data"`
		Message string      `json:"message"`
		Error   string      `json:"error"`
	}
	if err := json.Unmarshal(resp.([]byte), &aiResp); err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, "Failed to parse AI server response")
		return
	}

	if !aiResp.Success {
		helper.ErrorResponse(c, http.StatusInternalServerError, aiResp.Error)
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "File analyzed successfully", aiResp.Data)
}

func (ctrl *AIController) AnalyzeExpense(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, "No file uploaded")
		return
	}

	userID, err := getUserIDFromContext(c)
	if err != nil {
		helper.ErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}

	familyID, err := parseUUIDQuery(c, "family_id")
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	resp, err := ctrl.svc.AnalyzeDocument(c.Request.Context(), file, familyID, userID, "EXPENSE")
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	// Since AIService returns []byte (raw JSON from AI server), we unmarshal it to extract the data part
	var aiResp struct {
		Success bool        `json:"success"`
		Data    interface{} `json:"data"`
		Message string      `json:"message"`
		Error   string      `json:"error"`
	}
	if err := json.Unmarshal(resp.([]byte), &aiResp); err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, "Failed to parse AI server response")
		return
	}

	if !aiResp.Success {
		helper.ErrorResponse(c, http.StatusInternalServerError, aiResp.Error)
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "File analyzed successfully", aiResp.Data)
}

func (ctrl *AIController) OCRClassify(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, "No file uploaded")
		return
	}

	userID, err := getUserIDFromContext(c)
	if err != nil {
		helper.ErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}

	familyID, err := parseUUIDQuery(c, "family_id")
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	resp, fileID, err := ctrl.svc.OCRClassify(c.Request.Context(), file, familyID, userID)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	var aiResp struct {
		Success bool                   `json:"success"`
		Data    map[string]interface{} `json:"data"`
		Message string                 `json:"message"`
		Error   string                 `json:"error"`
	}
	if err := json.Unmarshal(resp.([]byte), &aiResp); err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, "Failed to parse AI server response")
		return
	}

	if !aiResp.Success {
		helper.ErrorResponse(c, http.StatusInternalServerError, aiResp.Error)
		return
	}

	// Inject file_id into data
	if aiResp.Data == nil {
		aiResp.Data = make(map[string]interface{})
	}
	aiResp.Data["file_id"] = fileID

	helper.SuccessResponse(c, http.StatusOK, "File classified successfully", aiResp.Data)
}

func (ctrl *AIController) ExtractStructured(c *gin.Context) {
	var req struct {
		OCRText         string `json:"ocr_text"`
		TransactionType string `json:"transaction_type"`
		Category        string `json:"category"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, "Invalid request payload")
		return
	}

	resp, err := ctrl.svc.ExtractStructured(c.Request.Context(), req.OCRText, req.TransactionType, req.Category)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	var aiResp struct {
		Success bool        `json:"success"`
		Data    interface{} `json:"data"`
		Message string      `json:"message"`
		Error   string      `json:"error"`
	}
	if err := json.Unmarshal(resp.([]byte), &aiResp); err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, "Failed to parse AI server response")
		return
	}

	if !aiResp.Success {
		helper.ErrorResponse(c, http.StatusInternalServerError, aiResp.Error)
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Data extracted successfully", aiResp.Data)
}

func (ctrl *AIController) StoreDocument(c *gin.Context) {
	var req struct {
		FileID   uuid.UUID              `json:"file_id"`
		OCRText  string                 `json:"ocr_text"`
		Metadata map[string]interface{} `json:"metadata"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, "Invalid request payload")
		return
	}

	resp, err := ctrl.svc.StoreDocument(c.Request.Context(), req.FileID, req.OCRText, req.Metadata)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	var aiResp struct {
		Success bool        `json:"success"`
		Data    interface{} `json:"data"`
		Message string      `json:"message"`
		Error   string      `json:"error"`
	}
	if err := json.Unmarshal(resp.([]byte), &aiResp); err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, "Failed to parse AI server response")
		return
	}

	if !aiResp.Success {
		helper.ErrorResponse(c, http.StatusInternalServerError, aiResp.Error)
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Document stored in Vector DB", aiResp.Data)
}

func (ctrl *AIController) GetDetails(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, "Invalid ID")
		return
	}

	// This is a minimal implementation to show the AI server can call back
	// In a real app, we'd use a service method to fetch attachment metadata
	helper.SuccessResponse(c, http.StatusOK, "File details retrieved", gin.H{
		"id": id,
		"status": "stored",
		"storage": "local",
	})
}
