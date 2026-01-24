package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/helper"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

type TaxController struct {
	service service.TaxService
}

func NewTaxController(service service.TaxService) *TaxController {
	return &TaxController{service: service}
}

// Documents
func (c *TaxController) CreateDocument(ctx *gin.Context) {
	userId, exists := ctx.Get("userId")
	if !exists {
		helper.ErrorResponse(ctx, http.StatusUnauthorized, "User ID not found in context")
		return
	}
	uid, err := uuid.Parse(userId.(string))
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusInternalServerError, "Invalid user ID format in context")
		return
	}

	var req dto.CreateTaxDocumentRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	doc := req.ToModel()
	doc.UserID = &uid

	if err := c.service.CreateDocument(ctx, doc); err != nil {
		helper.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to create tax document")
		return
	}

	helper.SuccessResponse(ctx, http.StatusCreated, "Tax document created successfully", doc)
}

func (c *TaxController) ListDocuments(ctx *gin.Context) {
	_, exists := ctx.Get("userId")
	if !exists {
		helper.ErrorResponse(ctx, http.StatusUnauthorized, "User ID not found in context")
		return
	}


	var familyID *uuid.UUID
	familyIdParam := ctx.Query("family_id")
	if familyIdParam != "" {
		if fid, err := uuid.Parse(familyIdParam); err == nil {
			familyID = &fid
		}
	}
    
    // Check if user is authorized for this family if familyID is provided
    // For now assuming if familyID provided, it's valid for user

	year := ctx.Query("year")

	docs, err := c.service.ListDocuments(ctx, familyID, year)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to fetch tax documents")
		return
	}

	helper.SuccessResponse(ctx, http.StatusOK, "Tax documents fetched successfully", docs)
}

func (c *TaxController) DeleteDocument(ctx *gin.Context) {
	idParam := ctx.Param("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, "Invalid ID format")
		return
	}

	if err := c.service.DeleteDocument(ctx, id); err != nil {
		helper.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to delete tax document")
		return
	}

	helper.SuccessResponse(ctx, http.StatusOK, "Tax document deleted successfully", nil)
}

// Deductions
func (c *TaxController) CreateDeduction(ctx *gin.Context) {
	userId, exists := ctx.Get("userId")
	if !exists {
		helper.ErrorResponse(ctx, http.StatusUnauthorized, "User ID not found in context")
		return
	}
	uid, err := uuid.Parse(userId.(string))
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusInternalServerError, "Invalid user ID format in context")
		return
	}

	var req dto.CreateTaxDeductionRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	ded := req.ToModel()
	ded.UserID = &uid

	if err := c.service.CreateDeduction(ctx, ded); err != nil {
		helper.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to create tax deduction")
		return
	}

	helper.SuccessResponse(ctx, http.StatusCreated, "Tax deduction created successfully", ded)
}

func (c *TaxController) ListDeductions(ctx *gin.Context) {
	var familyID *uuid.UUID
	familyIdParam := ctx.Query("family_id")
	if familyIdParam != "" {
		if fid, err := uuid.Parse(familyIdParam); err == nil {
			familyID = &fid
		}
	}

	year := ctx.Query("year")

	deds, err := c.service.ListDeductions(ctx, familyID, year)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to fetch tax deductions")
		return
	}

	helper.SuccessResponse(ctx, http.StatusOK, "Tax deductions fetched successfully", deds)
}

func (c *TaxController) DeleteDeduction(ctx *gin.Context) {
	idParam := ctx.Param("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, "Invalid ID format")
		return
	}

	if err := c.service.DeleteDeduction(ctx, id); err != nil {
		helper.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to delete tax deduction")
		return
	}

	helper.SuccessResponse(ctx, http.StatusOK, "Tax deduction deleted successfully", nil)
}
