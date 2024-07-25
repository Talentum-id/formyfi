.PHONY: start stop

start:
	@echo "Starting DFX..."
	dfx start --clean --background
	@echo "Deploying and generating canisters..."
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
