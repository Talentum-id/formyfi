.PHONY: start stop

include .env

export $(shell grep -v '^#' .env | xargs)

start:
	@echo "Starting DFX..."
	dfx start --clean --background
	@echo "Deploying canisters..."
	dfx deploy
	@echo "Deploying ic_siwe_provider canister with runtime configurations..."
	dfx deploy ic_siwe_provider --argument $'(\n\
		record {\n\
			domain = "127.0.0.1";\n\
			uri = "http://127.0.0.1:3000";\n\
			salt = "WjcIMw9vpXTcpSD/uGtOZmLLGbYCKVe6njceNLqKjt4=";\n\
			chain_id = opt 1;\n\
			scheme = opt "http";\n\
			statement = opt "Login to the app";\n\
			sign_in_expires_in = opt 2592000000000000;\n\
			session_expires_in = opt 2592000000000000;\n\
			targets = opt vec {\n\
				"'$(dfx canister id ic_siwe_provider)'";\n\
				"'$(dfx canister id assets)'";\n\
			};\n\
		}\n\
   	)'
	@echo "Redeploying and Generating canisters for Front-end..."
	dfx deploy && dfx generate
	@echo "Authorizing user_storage assets..."
	dfx canister call user_storage authorize '(principal "m7ob5-xdzun-z3vt2-6oujc-gfm2t-2lt5p-bw5kn-2tatc-fjkti-eko6j-jqe")'
	@echo "Authorizing qa_storage assets..."
	dfx canister call qa_storage authorize '(principal "m7ob5-xdzun-z3vt2-6oujc-gfm2t-2lt5p-bw5kn-2tatc-fjkti-eko6j-jqe")'
	@echo "Authorizing response_storage assets..."
	dfx canister call response_storage authorize '(principal "m7ob5-xdzun-z3vt2-6oujc-gfm2t-2lt5p-bw5kn-2tatc-fjkti-eko6j-jqe")'
	@echo "Installing npm dependencies and starting dev server..."
	npm install && npm run dev

stop:
	@echo "Stopping DFX..."
	dfx stop
