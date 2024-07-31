# Formyfi

Formyfi is a robust Q&A application fully running on the Internet Computer blockchain.

## Prerequisites

If you are using the Windows operating system, please ensure that you have <a href="https://learn.microsoft.com/en-us/windows/wsl/install" target="_blank">WSL</a>
(Windows Subsystem for Linux) installed on your machine, as all the code below should be executed in the WSL terminal.

Before getting started with Formyfi, ensure you have the following tools installed:

#### DFX 0.15.2

To install DFX 0.15.2, run the following command:

```bash
DFX_VERSION=0.15.2 sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"
```

#### NPM

Download and install NPM from [https://nodejs.org/en/download](https://nodejs.org/en/download).

#### Web2

There is certain functionality implemented in web2 for this project. If you are interested to see web2 part, run the following code:

   ```bash
   git clone <path_to_this_repo> <your_local_dir> --recursive
   ```
---

## There are 2 ways to run and stop the project locally - Manual (I) and Automatic (II)

## I. Running Manually

1. Navigate to the project directory and start DFX using the following command:

   ```bash
   dfx start --clean --background
   ```

   > **Note:** If starting DFX returns an error, open the `dfx.json` file, remove "local" from "networks," and run:

   ```bash
   dfx start --clean --background --host 127.0.0.1:4943
   ```

2. Install project dependencies by running:

   ```bash
   npm install
   ```

   Ensure to add "local" back to the "networks" section in `dfx.json` if you removed it while starting DFX.

3. Deploy the canisters locally with:
   
      ```bash
      dfx deploy
      ```

   Previous command may return an error, so don't worry about it, we will run it again later.
   Our project uses SIWE (Sign-In With Etherium), so for it to operate properly, run `ic_siwe_provider` canister individually with runtime configurations:

   ```bash
   dfx deploy ic_siwe_provider --argument $'(
    record {
        domain = "127.0.0.1";
        uri = "http://127.0.0.1:3000";
        salt = "WjcIMw9vpXTcpSD/uGtOZmLLGbYCKVe6njceNLqKjt4=";
        chain_id = opt 1;
        scheme = opt "http";
        statement = opt "Login to the app";
        sign_in_expires_in = opt 2592000000000000;
        session_expires_in = opt 2592000000000000;
        targets = opt vec {
            "'$(dfx canister id ic_siwe_provider)'";
            "'$(dfx canister id assets)'";
        };
    }
   )'
   ```

   Lastly, for completeness and Front-end to work with canisters, run:

   ```bash
   dfx deploy && dfx generate
   ```

   After deployment, you will receive URIs for the canisters. Click on the URI for the `assets` canister to open the local DApp in your browser.

4. Need to start assets canisters for uploading and reading files like images, run:
   ```bash
   dfx canister call user_storage authorize '(principal "m7ob5-xdzun-z3vt2-6oujc-gfm2t-2lt5p-bw5kn-2tatc-fjkti-eko6j-jqe")'
   dfx canister call qa_storage authorize '(principal "m7ob5-xdzun-z3vt2-6oujc-gfm2t-2lt5p-bw5kn-2tatc-fjkti-eko6j-jqe")'
   dfx canister call response_storage authorize '(principal "m7ob5-xdzun-z3vt2-6oujc-gfm2t-2lt5p-bw5kn-2tatc-fjkti-eko6j-jqe")'
   ```
   Open the DApp through the link provided by the Vite dev server.

5. If you are developing the front-end of the DApp and want to avoid running `dfx deploy` every time you make changes, run:
   ```bash
   npm run dev
   ```
   Open the DApp through the link provided by the Vite dev server.

## I. Stopping Manually

1. Before stopping canisters, ensure that the "local" is removed from the "networks" section in your `dfx.json` file, if you removed it while
   starting DFX and added it back during deployment, then run following command:
   ```bash
   dfx stop
   ```
2. After stopping the canisters, if you removed "local" earlier, make sure to add it back to the "networks" section in your `dfx.json` file:

***

## II. Running Automatically

1. ```bash
   make start
   ```

## II. Stopping Automatically

1. ```bash
   make stop
   ```