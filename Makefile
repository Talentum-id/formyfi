.PHONY: start stop

include .env

export $(shell grep -v '^#' .env | xargs)

start:
	@echo "Starting DFX..."
	dfx start --clean --background
	@echo "Deploying ic_siwe_provider canister with runtime configurations..."
	dfx deploy ic_siwe_provider --argument '$$(\
		record { \
			domain = "127.0.0.1"; \
			uri = "http://127.0.0.1:3000"; \
			salt = "WjcIMw9vpXTcpSD/uGtOZmLLGbYCKVe6njceNLqKjt4="; \
			chain_id = opt 1; \
			scheme = opt "http"; \
			statement = opt "Login to the app"; \
			sign_in_expires_in = opt 2592000000000000; \
			session_expires_in = opt 2592000000000000; \
		}\
	)'
	@echo "Deploying the rest of canisters..."
	dfx deploy
	@echo "Redeploying ic_siwe_provider canister with more configurations..."
	dfx deploy ic_siwe_provider --argument '$$(\
		record { \
			domain = "127.0.0.1"; \
			uri = "http://127.0.0.1:3000"; \
			salt = "WjcIMw9vpXTcpSD/uGtOZmLLGbYCKVe6njceNLqKjt4="; \
			chain_id = opt 1; \
			scheme = opt "http"; \
			statement = opt "Login to the app"; \
			sign_in_expires_in = opt 2592000000000000; \
			session_expires_in = opt 2592000000000000; \
			targets = opt vec { \
				"$$(dfx canister id ic_siwe_provider)"; \
				"$$(dfx canister id assets)"; \
			}; \
		}\
	)'
	@echo "Generating canister for Front-end..."
	dfx generate
	@echo "Installing npm dependencies and starting dev server..."
	npm install && npm run dev

stop:
	@echo "Stopping DFX..."
	dfx stop
