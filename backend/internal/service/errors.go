package service

import "fmt"

// ErrorType represents the category of service error
type ErrorType string

const (
	ErrNotFound      ErrorType = "NOT_FOUND"
	ErrUnauthorized  ErrorType = "UNAUTHORIZED"
	ErrValidation    ErrorType = "VALIDATION"
	ErrConflict      ErrorType = "CONFLICT"
	ErrInternal      ErrorType = "INTERNAL"
)

// ServiceError represents a domain-specific service error
type ServiceError struct {
	Type    ErrorType
	Message string
	Err     error // wrapped original error
}

func (e *ServiceError) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("%s: %s: %v", e.Type, e.Message, e.Err)
	}
	return fmt.Sprintf("%s: %s", e.Type, e.Message)
}

func (e *ServiceError) Unwrap() error {
	return e.Err
}

// NewNotFoundError creates a not found error
func NewNotFoundError(resource string, id interface{}) *ServiceError {
	return &ServiceError{
		Type:    ErrNotFound,
		Message: fmt.Sprintf("%s %v not found", resource, id),
	}
}

// NewUnauthorizedError creates an unauthorized error
func NewUnauthorizedError(message string) *ServiceError {
	return &ServiceError{
		Type:    ErrUnauthorized,
		Message: message,
	}
}

// NewValidationError creates a validation error
func NewValidationError(message string) *ServiceError {
	return &ServiceError{
		Type:    ErrValidation,
		Message: message,
	}
}

// NewConflictError creates a conflict error
func NewConflictError(message string) *ServiceError {
	return &ServiceError{
		Type:    ErrConflict,
		Message: message,
	}
}

// NewInternalError creates an internal error
func NewInternalError(operation string, err error) *ServiceError {
	return &ServiceError{
		Type:    ErrInternal,
		Message: fmt.Sprintf("internal error during %s", operation),
		Err:     err,
	}
}
