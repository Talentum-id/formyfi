import { get, set } from 'idb-keyval';
import * as vetKd from '../../vetkd_user/ic_vetkd_utils';

export class CryptoService {
  constructor(actor) {
    this.actor = actor;
  }

  async encrypt(key, owner, data) {
    await this.fetchNotKeyIfNeeded(key, owner);

    const cryptoKey = await get([key.toString(), owner]);
    const dataEncoded = Uint8Array.from([...data].map(item => item.charCodeAt(0))).buffer;
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const cipherText = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      cryptoKey,
      dataEncoded,
    );
    const ivDecoded = String.fromCharCode(...new Uint8Array(iv));
    const cipherDecoded = String.fromCharCode(...new Uint8Array(cipherText));

    return ivDecoded + cipherDecoded;
  }

  async decrypt(key, owner, data) {
    await this.fetchNotKeyIfNeeded(key, owner);

    const cryptoKey = await get([key.toString(), owner]);

    if (data.length < 13) {
      throw new Error('Wrong encoding, too short to contain iv');
    }

    const ivDecoded = data.slice(0, 12);
    const cipherDecoded = data.slice(12);
    const ivEncoded = Uint8Array.from([...ivDecoded].map(item => item.charCodeAt(0))).buffer;
    const cipherEncoded = Uint8Array.from([...cipherDecoded].map(item => item.charCodeAt(0))).buffer;

    let decryptedDataEncoded = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: ivEncoded,
      },
      cryptoKey,
      cipherEncoded,
    );

    return String.fromCharCode(...new Uint8Array(decryptedDataEncoded));
  }

  async fetchNotKeyIfNeeded(key, owner) {
    if (!await get([key.toString(), owner])) {
      const seed = window.crypto.getRandomValues(new Uint8Array(32));

      const tsk = new vetKd.TransportSecretKey(seed);
      const ekBytesHex = await this.actor.encryptedSymmetricKey(
        key,
        tsk.public_key(),
        {
          identity: process.env.DFX_ASSET_PRINCIPAL,
          character: localStorage.extraCharacter,
        },
      );
      const pkBytesHex = await this.actor.symmetricKeyVerification();
      const keyBytes = stringTo128BitBigEndianUint8Array(key);
      const ownerUTF8 = new TextEncoder().encode(owner);

      let derivationId = new Uint8Array(keyBytes.length + ownerUTF8.length);

      derivationId.set(keyBytes);
      derivationId.set(ownerUTF8, keyBytes.length);

      const aes256GcmKeyRaw = tsk.decrypt_and_hash(
        hexDecode(ekBytesHex),
        hexDecode(pkBytesHex),
        derivationId,
        32,
        new TextEncoder().encode('aes-256-gcm'),
      );

      const primaryKey = await window.crypto.subtle.importKey(
        'raw',
        aes256GcmKeyRaw,
        'AES-GCM',
        false,
        [
          'encrypt',
          'decrypt',
        ],
      );

      await set([key.toString(), owner], primaryKey);
    }
  }
}

const hexDecode = (hexString) => Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
const hexEncode = (bytes) => bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

function bigintTo128BitBigEndianUint8Array(bn) {
  let hex = BigInt(bn).toString(16);

  return generateUint8ArrayFromHex(hex);
}

function stringTo128BitBigEndianUint8Array(str) {
  let hex = Array.from(str).map(char => char.charCodeAt(0).toString(16)).join('');

  return generateUint8ArrayFromHex(hex);
}

const generateUint8ArrayFromHex = (hex) => {
  while (hex.length < 32) {
    hex = '0' + hex;
  }

  let len = hex.length / 2;
  let u8 = new Uint8Array(len);

  let i = 0;
  let j = 0;
  while (i < len) {
    u8[i] = parseInt(hex.slice(j, j + 2), 16);
    i += 1;
    j += 2;
  }

  return u8;
};