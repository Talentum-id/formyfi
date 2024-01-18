import { defineStore } from 'pinia';
import { HttpAgent } from '@dfinity/agent';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import { AssetManager } from '@dfinity/assets';

export const useAssetsStore = defineStore('assets', {
  id: 'assets',
  state: () => {
    return {
      actor: null,
      assetManager: null,
      identity: null,
    };
  },
  actions: {
    async init() {
      // This is temporary solution for authorizing assets canister: 535yc-uxytb-gfk7h-tny7p-vjkoe-i4krp-3qmcl-uqfgr-cpgej-yqtjq-rqe
      const identity = Ed25519KeyIdentity.generate(new Uint8Array(Array.from({ length: 32 }).fill(0)));
      const canisterId = process.env.ASSETS_CANISTER_ID;
      const agent = new HttpAgent({ identity });

      if (process.env.NODE_ENV === 'development') {
        await agent.fetchRootKey();
      }

      this.assetManager = new AssetManager({ canisterId, agent });
    },
  },
  getters: {
    getAssetManager: ({ assetManager }) => assetManager,
  },
});
