package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/helper"
	"github.com/sauravkarn541/bahikhata/internal/service"
)


type TagController struct {
	tagService service.TagService		
}

func NewTagController(tagService service.TagService) *TagController {
	return &TagController{tagService: tagService}
}

func (ctrl *TagController) Create(c *gin.Context) {
	var req dto.CreateTagRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	resp, err := ctrl.tagService.Create(c.Request.Context(), req)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	helper.SuccessResponse(c, http.StatusCreated, "Tag created successfully", resp)
}

func (ctrl *TagController) List(c *gin.Context) {
	familyIDStr := c.Param("family_id")
	familyID, err := uuid.Parse(familyIDStr)
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, "Invalid family ID")
		return
	}

	resp, err := ctrl.tagService.List(c.Request.Context(), familyID)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Tags retrieved successfully", resp)
}

func (ctrl *TagController) Update(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, "Invalid tag ID")
		return
	}

	var req dto.UpdateTagRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	resp, err := ctrl.tagService.Update(c.Request.Context(), id, req)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Tag updated successfully", resp)
}

func (ctrl *TagController) Delete(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, "Invalid tag ID")
		return
	}

	if err := ctrl.tagService.Delete(c.Request.Context(), id); err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Tag deleted successfully", nil)
}

func (ctrl *TagController) GetByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, "Invalid tag ID")
		return
	}

	resp, err := ctrl.tagService.GetByID(c.Request.Context(), id)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Tag retrieved successfully", resp)
}