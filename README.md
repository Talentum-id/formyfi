# Formyfi

Formyfi is a robust Q&A application that runs entirely on the Internet Computer blockchain.

## Prerequisites

If you are using Windows, please ensure you
have <a href="https://learn.microsoft.com/en-us/windows/wsl/install" target="_blank">WSL</a> (Windows Subsystem for
Linux) installed, as all commands should be executed in the WSL terminal.

Before getting started, make sure you have the following tools installed:

#### DFX

To install DFX, run the following command:

```bash
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
```

#### NPM

Download and install NPM from [https://nodejs.org/en/download](https://nodejs.org/en/download).

#### Web2

There is some Web2 functionality implemented in this project. To see it, clone the repository with the following
command:

   ```bash
   git clone <path_to_this_repo> <your_local_dir> --recursive
   ```

---

## Running the Project

### I. Running Manually

1. Create an .env file by copying values from .env.example and setting appropriate values.
2. Navigate to the project directory and start DFX:
   ```bash
   dfx start --clean --background
   ```

   > **Note:** If you encounter an error, open dfx.json, remove "local" from "networks", and start DFX with:

   ```bash
   dfx start --clean --background --host 127.0.0.1:4943
   ```

3. Install project dependencies:

   ```bash
   npm install
   ```

4. Deploy the canisters:

   First, create vetkd_system_api canister with hardcoded ID:

   ```bash
   dfx canister create vetkd_system_api --specified-id h6gim-oiaaa-aaaao-a3siq-cai
   ```

   Second, create the remaining canisters:
   ```bash
   dfx canister create --all
   ```

   Third, deploy `ic_siwe_provider` and `ic_siws_provider` canisters with runtime arguments:

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
   dfx deploy ic_siws_provider --argument $'(
    record {
      domain = "127.0.0.1";
      uri = "http://127.0.0.1:3000";
      salt = "WjcIMw9vpXTcpSD/uGtOZmLLGbYCKVe6njceNLqKjt4=";
      chain_id = opt "mainnet"; 
      scheme = opt "http";
      statement = opt "Login to the app";
      sign_in_expires_in = opt 2592000000000000;
      session_expires_in = opt 2592000000000000;
      targets = opt vec {
        "'$(dfx canister id ic_siws_provider)'";
        "'$(dfx canister id assets)'";
      };
    }
   )'
   ```

   Fourth, deploy canisters and generate:
   ```bash
   dfx deploy internet_identity --argument '(null)'
   dfx generate
   dfx deploy && dfx generate
   ```

   After deployment, you’ll receive URIs for the canisters. Open the URI for the assets canister to view the local DApp
   in your browser.

5. If you are developing the front-end of the DApp and want to avoid running `dfx deploy` every time you make changes,
   run:
   ```bash
   npm run dev
   ```
   Access the DApp via the link provided by the Vite dev server.

## I. Stopping Manually

1. Ensure "local" is removed from the "networks" section in dfx.json if you did so during deployment, and then run:
   ```bash
   dfx stop
   ```
2. If you removed "local" earlier, add it back to the "networks" section in dfx.json.

***

## II. Automatic manual

1. To start the project with all commands being called automatically, run:

   ```bash
   make start
   ```

2. In case you started the project with Automatic Manual, you have to use following command to stop it:

   ```bash
   make stop
   ```