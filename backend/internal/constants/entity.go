package constants

type EntityType string

const (
	EntityTransaction EntityType = "transaction"
	EntityProject     EntityType = "project"
	EntityNote        EntityType = "note"
	EntityBill        EntityType = "bill"
)