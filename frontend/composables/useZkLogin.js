import {
  generateNonce,
  generateRandomness, getExtendedEphemeralPublicKey,
  jwtToAddress,
} from '@mysten/sui/zklogin';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { jwtDecode } from 'jwt-decode';
import axiosService from '@/services/axiosService';
import { decodeSuiPrivateKey } from '@mysten/sui/cryptography';
import { Buffer } from 'buffer';

export const useZkLogin = () => {
  let nonce;
  let address;

  const SUI_NET_ENV = process.env.SUI_NET_ENV;
  const client = new SuiClient({
    url: getFullnodeUrl(SUI_NET_ENV),
  });

  window.Buffer = window.Buffer || Buffer;

  const GOOGLE_CLIENT_ID = process.env.CLIENT_ID;
  const REDIRECT_URI = `${window.location.origin}/login`;
  const ephemeralKeyPair = new Ed25519Keypair();

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
    } else {
      console.info('User has a zk identity, updating zero proof...');
    }

    const ephemeralKeyPair = JSON.parse(localStorage.getItem('zklogin_ephemeral_keypair'));
    const extendedEphemeralPublicKey = getExtendedEphemeralPublicKey(
      Ed25519Keypair.fromSecretKey(
        data.secret_key ? decodeSuiPrivateKey(data.secret_key).secretKey : ephemeralKeyPair.privateKey
      ).getPublicKey()
    );

    await axiosService.post(
      `${process.env.API_URL}zk-identities/update-zero-proof`,
      {
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
      },
    ).catch((errors) => {
      console.error('Failed update zero proof.', errors);

      throw new Error('Failed update zero proof.');
    });

    localStorage.removeItem('zklogin_ephemeral_keypair');
    localStorage.removeItem('max_epoch');
    localStorage.removeItem('randomness');

    return salt;
  };

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

  return {
    zkLoginAuthorize,
    connectZkLogin,
  };
};
