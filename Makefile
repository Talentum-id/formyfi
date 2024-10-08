.PHONY: start stop

include .env

export $(shell grep -v '^#' .env | xargs)

start:
	@echo "Starting DFX..."
	dfx start --clean --background
	@echo "Deploying ic_siwe_provider canister with runtime configurations..."
	dfx deploy ic_siwe_provider --argument "( \
		record { \
			domain = \"127.0.0.1\"; \
			uri = \"http://127.0.0.1:3000\"; \
			salt = \"WjcIMw9vpXTcpSD/uGtOZmLLGbYCKVe6njceNLqKjt4=\"; \
			chain_id = opt 1; \
			scheme = opt \"http\"; \
			statement = opt \"Login to the app\"; \
			sign_in_expires_in = opt 2592000000000000; \
			session_expires_in = opt 2592000000000000; \
		}\
	)"
	@echo "Deploying ic_siws_provider canister with runtime configurations..."
	dfx deploy ic_siws_provider --argument "( \
		record { \
			domain = \"127.0.0.1\"; \
			uri = \"http://127.0.0.1:3000\"; \
			salt = \"WjcIMw9vpXTcpSD/uGtOZmLLGbYCKVe6njceNLqKjt4=\"; \
			chain_id = opt \"mainnet\"; \
			scheme = opt \"http\"; \
			statement = opt \"Login to the app\"; \
			sign_in_expires_in = opt 2592000000000000; \
			session_expires_in = opt 2592000000000000; \
		}\
	)"
	@echo "Deploying Internet Identity canister..."
	dfx deploy internet_identity --argument '(null)'
	@echo "Creating VetKeys API canister with hardcoded ID and Deploying..."
	dfx canister create vetkd_system_api --specified-id h6gim-oiaaa-aaaao-a3siq-cai
	dfx deploy vetkd_system_api
	@echo "Deploying and Generating canisters for Front-end..."
	dfx deploy && dfx generate
	@echo "Redeploying ic_siwe_provider canister with more configurations..."
	dfx deploy ic_siwe_provider --argument "( \
		record { \
			domain = \"127.0.0.1\"; \
			uri = \"http://127.0.0.1:3000\"; \
			salt = \"WjcIMw9vpXTcpSD/uGtOZmLLGbYCKVe6njceNLqKjt4=\"; \
			chain_id = opt 1; \
			scheme = opt \"http\"; \
			statement = opt \"Login to the app\"; \
			sign_in_expires_in = opt 2592000000000000; \
			session_expires_in = opt 2592000000000000; \
			targets = opt vec { \
				\"$$(dfx canister id ic_siwe_provider)\"; \
				\"$$(dfx canister id assets)\"; \
			}; \
		}\
	)"
	@echo "Redeploying ic_siws_provider canister with more configurations..."
	dfx deploy ic_siws_provider --argument "( \
		record { \
			domain = \"127.0.0.1\"; \
			uri = \"http://127.0.0.1:3000\"; \
			salt = \"WjcIMw9vpXTcpSD/uGtOZmLLGbYCKVe6njceNLqKjt4=\"; \
			chain_id = opt \"mainnet\"; \
			scheme = opt \"http\"; \
			statement = opt \"Login to the app\"; \
			sign_in_expires_in = opt 2592000000000000; \
			session_expires_in = opt 2592000000000000; \
			targets = opt vec { \
				\"$$(dfx canister id ic_siws_provider)\"; \
				\"$$(dfx canister id assets)\"; \
			}; \
		}\
	)"
	@echo "Generating canisters for Front-end..."
	dfx generate

stop:
	@echo "Stopping DFX..."
	dfx stop
