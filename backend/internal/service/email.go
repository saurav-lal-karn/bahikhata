package service

import (
	"fmt"

	"github.com/sirupsen/logrus"
)

type EmailService interface {
	SendInvitationEmail(to, firstName, role, inviteLink string) error
}

type emailService struct {
	logger *logrus.Logger
}

func NewEmailService() EmailService {
	return &emailService{
		logger: logrus.New(),
	}
}

func (s *emailService) SendInvitationEmail(to, firstName, role, inviteLink string) error {
	// For now, we just log the email content as per user request
	s.logger.Infof("Sending Invitation Email to: %s", to)
	s.logger.Infof("Content: Hi %s, you have been invited to join Bahikhata as a %s. Click here to join: %s", firstName, role, inviteLink)
	fmt.Printf("\n--- MOCK EMAIL START ---\nTo: %s\nSubject: Join Bahikhata\n\nHi %s,\n\nYou have been invited to join Bahikhata as a %s.\nClick the link below to accept the invitation:\n%s\n\nRegards,\nBahikhata Team\n--- MOCK EMAIL END ---\n\n", to, firstName, role, inviteLink)
	return nil
}
