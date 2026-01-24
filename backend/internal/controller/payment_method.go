package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/helper"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

type PaymentMethodController struct {
	service service.PaymentMethodService
}

func NewPaymentMethodController(service service.PaymentMethodService) PaymentMethodController {
	return PaymentMethodController{service: service}
}

func (c *PaymentMethodController) List(ctx *gin.Context){
	familyId := ctx.Param("family_id")
	if familyId == "" {
		helper.ErrorResponse(ctx, http.StatusBadRequest, "family_id is required")
		return
	}
	paymentMethods, err := c.service.List(ctx, familyId)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusInternalServerError, err.Error())
		return
	}
	helper.SuccessResponse(ctx, http.StatusOK, "Payment methods fetched successfully", paymentMethods)
}