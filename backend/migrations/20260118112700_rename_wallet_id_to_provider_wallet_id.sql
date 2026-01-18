-- +goose Up
-- +goose StatementBegin
ALTER TABLE public.wallets RENAME COLUMN wallet_id TO provider_wallet_id;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE public.wallets RENAME COLUMN provider_wallet_id TO wallet_id;
-- +goose StatementEnd
