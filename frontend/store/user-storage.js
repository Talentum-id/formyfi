import { defineStore } from 'pinia';
import { HttpAgent } from '@dfinity/agent';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import { AssetManager } from '@dfinity/assets';
import { generateUint8Array } from '@/util/helpers';

export const useUserStorageStore = defineStore('userStorage', {
  id: 'userStorage',
  state: () => {
    return {
      assetManager: null,
    };
  },
  actions: {
    async init() {
      const identity = Ed25519KeyIdentity.generate(
        generateUint8Array(process.env.DFX_ASSET_PRINCIPAL),
      );
      const canisterId = process.env.USER_STORAGE_CANISTER_ID;
      const agent = new HttpAgent({ identity });

      if (process.env.NODE_ENV === 'development') {
        await agent.fetchRootKey();
      }

      this.assetManager = new AssetManager({ canisterId, agent });
    },
    async getFile(link) {
      const asset = await this.assetManager.get(link);
      const blob = await asset.toBlob();

      return URL.createObjectURL(blob);
    },
  },
  getters: {
    getAssetManager: ({ assetManager }) => assetManager,
  },
});
