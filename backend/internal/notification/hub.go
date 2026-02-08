package notification

import (
	"encoding/json"
	"sync"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/sirupsen/logrus"
)

// Message represents a notification message sent over WebSocket
type Message struct {
	UserID   uuid.UUID `json:"user_id"`
	FamilyID uuid.UUID `json:"family_id"`
	Data     interface{} `json:"data"`
}

// Client represents a single WebSocket connection
type Client struct {
	Hub      *Hub
	Conn     *websocket.Conn
	UserID   uuid.UUID
	FamilyID uuid.UUID
	Send     chan []byte
}

// Hub maintains the set of active clients and broadcasts messages
type Hub struct {
	clients    map[*Client]bool
	broadcast  chan Message
	register   chan *Client
	unregister chan *Client
	mu         sync.RWMutex
}

func NewHub() *Hub {
	return &Hub{
		clients:    make(map[*Client]bool),
		broadcast:  make(chan Message),
		register:   make(chan *Client),
		unregister: make(chan *Client),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.mu.Lock()
			h.clients[client] = true
			h.mu.Unlock()
			logrus.Infof("Client registered: %s", client.UserID)

		case client := <-h.unregister:
			h.mu.Lock()
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.Send)
			}
			h.mu.Unlock()
			logrus.Infof("Client unregistered: %s", client.UserID)

		case message := <-h.broadcast:
			h.mu.RLock()
			for client := range h.clients {
				// Send to specific user or all members of a family
				if client.UserID == message.UserID || (message.UserID == uuid.Nil && client.FamilyID == message.FamilyID) {
					data, err := json.Marshal(message.Data)
					if err != nil {
						logrus.Errorf("Error marshaling message: %v", err)
						continue
					}
					select {
					case client.Send <- data:
					default:
						h.mu.RUnlock()
						h.mu.Lock()
						delete(h.clients, client)
						close(client.Send)
						h.mu.Unlock()
						h.mu.RLock()
					}
				}
			}
			h.mu.RUnlock()
		}
	}
}

func (h *Hub) Broadcast(msg Message) {
	h.broadcast <- msg
}

func (h *Hub) Register(c *Client) {
	h.register <- c
}

func (h *Hub) Unregister(c *Client) {
	h.unregister <- c
}
