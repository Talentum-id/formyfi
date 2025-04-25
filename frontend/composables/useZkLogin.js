import {
  generateNonce,
  generateRandomness,
  getExtendedEphemeralPublicKey,
  jwtToAddress,
} from '@mysten/sui/zklogin';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { jwtDecode } from 'jwt-decode';
import axiosService from '@/services/axiosService';
import { decodeSuiPrivateKey } from '@mysten/sui/cryptography';
import { Buffer } from 'buffer';
import axios from 'axios';
import { inputs } from '@/web3/abi/nftSuiInputs';
import { inputsSBT } from '@/web3/abi/nftSuiInputsSBT';
import { Transaction } from '@mysten/sui/transactions';
import { bcs } from '@mysten/sui/bcs';
import { fromB64 } from '@mysten/bcs';
import { chains } from '@/web3/nft';

export const useZkLogin = () => {
  let nonce;
  let address;

  const SUI_NET_ENV = process.env.SUI_NET_ENV;
  const client = new SuiClient({
    url: getFullnodeUrl(SUI_NET_ENV),
  });
  const SUI_ADDRESS_LENGTH = 32;

  window.Buffer = window.Buffer || Buffer;

  const GOOGLE_CLIENT_ID = process.env.CLIENT_ID;
  const REDIRECT_URI = `${window.location.origin}/login`;
  const ephemeralKeyPair = new Ed25519Keypair();
  let contractAddress;
  let contractMeta;
  const init = async () => {
    const { epoch } = await client.getLatestSuiSystemState();
    const maxEpoch = Number(epoch) + 30;
    const randomness = generateRandomness();
    nonce = generateNonce(ephemeralKeyPair.getPublicKey(), maxEpoch, randomness);
    localStorage.setItem('max_epoch', maxEpoch.toString());
    localStorage.setItem('randomness', randomness);

    const privateKey = ephemeralKeyPair.getSecretKey().toString();
    const publicKey = ephemeralKeyPair.getPublicKey().toBase64();

    localStorage.setItem(
      'zklogin_ephemeral_keypair',
      JSON.stringify({
        privateKey: privateKey,
        publicKey: publicKey,
      }),
    );
  };

  const getLoginParamsByProvider = (provider, customPath = null) => {
    switch (provider) {
      case 'google': {
        return new URLSearchParams({
          client_id: GOOGLE_CLIENT_ID,
          redirect_uri: customPath || REDIRECT_URI,
          response_type: 'id_token',
          scope: 'openid profile email',
          nonce: nonce,
        });
      }
      default: {
        return new URLSearchParams({
          client_id: GOOGLE_CLIENT_ID,
          redirect_uri: REDIRECT_URI,
          response_type: 'id_token',
          scope: 'openid profile email',
          nonce: nonce,
        });
      }
    }
  };

  const getRedirectPath = (provider, customPath = null) => {
    const loginParams = getLoginParamsByProvider(provider, customPath);
    switch (provider) {
      case 'google': {
        return `https://accounts.google.com/o/oauth2/v2/auth?${loginParams}`;
      }
      default: {
        return `https://accounts.google.com/o/oauth2/v2/auth?${loginParams}`;
      }
    }
  };

  const zkLoginAuthorize = async (jwt, provider) => {
    const { sub, aud } = jwtDecode(jwt);

    const userSalt = await attachUserToProvider(provider, sub, aud, jwt);
    address = jwtToAddress(jwt, userSalt);

    const { data } = await axiosService.post(
      `${process.env.API_URL}auth/${provider}/authorize-with-token`,
      {
        address: address,
        token: jwt,
      },
    );

    return { email: data, address };
  };

  const connectZkLogin = async (provider, customPath = null) => {
    await init();
    localStorage.social = provider;
    window.location.href = getRedirectPath(provider, customPath);
  };

  const generateSalt = async () => {
    const randomBytes = new Uint8Array(16);
    crypto.getRandomValues(randomBytes);

    return Array.from(randomBytes).reduce((acc, byte, index) => {
      return acc + BigInt(byte) * 2n ** BigInt(8 * index);
    }, 0n);
  };

  const attachUserToProvider = async (provider, sub, aud, jwt) => {
    let salt;

    const { data } = await axiosService.get(
      `${process.env.API_URL}zk-identities/get-by-provider?provider=${provider}&provider_id=${sub}`,
    );

    salt = data?.salt;
    if (!salt) {
      console.info('User does not have a zk identity, attaching...');

      salt = await generateSalt();
    }

    const ephemeralKeyPair = JSON.parse(localStorage.getItem('zklogin_ephemeral_keypair'));
    const extendedEphemeralPublicKey = getExtendedEphemeralPublicKey(
      Ed25519Keypair.fromSecretKey(
        data.secret_key
          ? decodeSuiPrivateKey(data.secret_key).secretKey
          : ephemeralKeyPair.privateKey,
      ).getPublicKey(),
    );

    await axiosService
      .post(`${process.env.API_URL}zk-identities/update-zero-proof`, {
        jwt,
        jwtRandomness: localStorage.randomness,
        extendedEphemeralPublicKey: extendedEphemeralPublicKey.toString(),
        salt: salt.toString(),
        keyClaimName: 'sub',
        chain: process.env.SUI_NET_ENV,
        maxEpoch: localStorage.max_epoch,
        provider: provider,
        provider_id: sub,
        audience: aud,
        secret_key: ephemeralKeyPair.privateKey,
      })
      .catch((errors) => {
        console.error('Failed update zero proof.', errors);

        throw new Error('Failed update zero proof.');
      });

    localStorage.removeItem('zklogin_ephemeral_keypair');
    localStorage.removeItem('max_epoch');
    localStorage.removeItem('randomness');

    return salt;
  };
   function getContractAddressSui() {
    return contractAddress;
  }
   function getContractMetaSui() {
    return contractMeta;
  }
  async function getAddressObjects(userAddress, objectType) {
    try {
      const response = await client.getOwnedObjects({
        owner: userAddress,
        filter: {
          StructType: objectType,
        },
      });

      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  const getSuiProvider = (provider) => {
    const GlobalWallet = {
      walletList: [],
      register: (wallet) => {
        GlobalWallet.walletList.push(wallet);
      },
    };

    if (provider) {
      localStorage.SuiProvider = provider;
    }

    if (localStorage.SuiProvider || provider) {
      const event = new CustomEvent('wallet-standard:app-ready', { detail: GlobalWallet });
      window.dispatchEvent(event);
      const walletName = localStorage.SuiProvider || provider;
      return GlobalWallet.walletList.find((wallet) => wallet.name === walletName);
    }
  };
  function normalizeSuiAddress(value, forceAdd0x = false) {
    let address = value.toLowerCase();
    if (!forceAdd0x && address.startsWith('0x')) {
      address = address.slice(2);
    }
    return `0x${address.padStart(SUI_ADDRESS_LENGTH * 2, '0')}`;
  }
  function normalizeSuiObjectId(value, forceAdd0x = false) {
    return normalizeSuiAddress(value, forceAdd0x);
  }
  async function deploySui(item) {
    const suiWallet = getSuiProvider('Sui Wallet');
    if (!suiWallet) {
      return window.open('https://suiwallet.com/', '_blank');
    }

    try {
      const { accounts } = await suiWallet.features['standard:connect'].connect();
      const account = accounts[0].address;
      const tx = new Transaction();

      tx.setGasBudget(100000000);
      const modules = item.transferable ? inputs : inputsSBT;
      const payload = {
        modules: modules.modules.map((m) => Array.from(fromB64(m))),
        dependencies: modules.dependencies.map((addr) => normalizeSuiObjectId(addr)),
      };

      const [upgradeCap] = tx.publish(payload);
      tx.transferObjects([upgradeCap], tx.pure.address(account));
      const { digest } = await suiWallet.features[
        'sui:signAndExecuteTransactionBlock'
      ].signAndExecuteTransactionBlock({
        transactionBlock: tx,
        account: accounts[0],
        chain: `sui:mainnet`,
      });

      const client = new SuiClient({
        url: getFullnodeUrl('mainnet'),
      });

      await new Promise((res) => {
        setTimeout(res, 10000);
      });

      const transaction = await client.getTransactionBlock({
        digest: digest,
        options: {
          showInput: true,
          showEffects: true,
          showEvents: true,
          showObjectChanges: true,
        },
      });

      const pubKeyObjectID = transaction.objectChanges.find(
        (change) => change?.objectType && String(change.objectType).includes('PubKey'),
      ).objectId;
      const tokenDataObjectID = transaction.objectChanges.find(
        (change) => change?.objectType && String(change.objectType).includes('TokenData'),
      ).objectId;
      contractAddress = transaction.objectChanges.find((changes) => changes.packageId).packageId;
      contractMeta = {
        pubKeyObjectID,
        tokenDataObjectID,
      };
    } catch (e) {
      throw e;
    }
  }

  const mintSuiNft = async (nft) => {
    let suiProvider = getSuiProvider('Sui Wallet');

    if (!suiProvider) {
      window.open('https://suiwallet.com/', '_blank');
      throw 'Firstly you need to install Sui Wallet';
    }

    const clientMainnet = new SuiClient({
      url: getFullnodeUrl('mainnet'),
    });

    try {
      await suiProvider.features['standard:disconnect'].disconnect();
    } catch (e) {
      console.log(e);
    }

    try {
      const { accounts } = await suiProvider.features['standard:connect'].connect();

      if (accounts.length > 1) {
        throw 'You can select only one wallet that has been connected to your profile.';
      }

      const currentWallet = accounts[0].address;
      console.log(currentWallet, 'currentWallet');
      if (!currentWallet) {
        throw {
          message: "You didn't connect this wallet to your profile",
          status: 'connectWallet',
        };
      }

      const SUI_ADDRESS = currentWallet;

      let url = `https://web2.formyfi.io/api/nft/collections/sign`;

      const SUI_COIN_TYPE = '0x2::sui::SUI';
      console.log(SUI_ADDRESS, 'SUI_ADDRESS');
      const gasCoins = await clientMainnet.getCoins({
        owner: SUI_ADDRESS,
        coinType: SUI_COIN_TYPE,
      });

      const totalGasBalance = gasCoins.data.reduce(
        (acc, coin) => acc + parseInt(coin.balance, 10),
        0,
      );
      const GAS_BUDGET = 100000000;

      if (totalGasBalance < GAS_BUDGET) {
        throw new Error('You do not have enough SUI to pay for transaction fees.');
      }
      if (nft.price === 0) {
        nft.price = 0.00000000001;
      }
      await axios
        .post(url, {
          name: nft.name,
          wallet: SUI_ADDRESS,
          contractAddress: nft.contract_address,
          tokenId: Number(nft.token_id),
          blockchain: chains.find((chain) => chain.id === Number(nft.blockchain_id))?.chainName,
          url: nft.file[0],
          description: nft.description,
          price: Math.floor(Number(nft.price) * 1e9),
        })
        .then(async ({ data }) => {
          const obj = data[0];
          const tx = new Transaction();
          const taxCount = BigInt(obj.price) + BigInt(GAS_BUDGET);

          if (totalGasBalance < taxCount) {
            throw new Error('You do not have enough SUI to pay for transaction fees.');
          }

          tx.setGasPrice(1000);
          tx.setGasBudget(10000000);

          const message = `${obj.nftName}${obj.nftDesc}${obj.nftUrl}${obj.endTime}${obj.price}`;

          const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(obj.price)]);

          tx.moveCall({
            target: `${nft.address}::nft::mint`,
            arguments: [
              tx.object(obj.meta.pubKeyObjectID),
              bcs.vector(bcs.U8).serialize(Buffer.from(message)),
              bcs.vector(bcs.U8).serialize(Buffer.from(obj.signature, 'hex')),
              tx.pure.u8(0),
              tx.pure.u64(obj.endTime),
              tx.object('0x6'),
              bcs.vector(bcs.U8).serialize(Buffer.from(obj.nftName)),
              bcs.vector(bcs.U8).serialize(Buffer.from(obj.nftDesc)),
              bcs.vector(bcs.U8).serialize(Buffer.from(obj.nftUrl)),
              coin,
              tx.object(obj.meta.tokenDataObjectID),
            ],
          });

          const result = await suiProvider.features[
            'sui:signAndExecuteTransactionBlock'
          ].signAndExecuteTransactionBlock({
            transactionBlock: tx,
            account: userAccount,
            signer: userAccount,
            chain: `sui:mainnet`,
          });
          console.log('Wait tx: ', result);
          return result.digest;
        });
    } catch (e) {
      throw e;
    }
  };

  return {
    mintSuiNft,
    zkLoginAuthorize,
    connectZkLogin,
    deploySui,
    getContractAddressSui,
    getContractMetaSui,
  };
};
