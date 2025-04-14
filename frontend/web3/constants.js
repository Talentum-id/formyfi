export const MULTI_SEND_ADDRESSES = {
  10143: '0xD646ed71B83ae652E5C77B1a981fc1bcEbcf1533',
};
export const SUPPORTED_CHAIN_ID = [10143];

export const TOKENS = {
  10143: [
    {
      address: 'native',
      chainId: 10143,
      name: 'Monad',
      symbol: 'MON',
      decimals: 9,
    },
  ],
};

export const CHAIN_IDS_TO_NAMES = {
  10143: 'monad',
};

export const CHAIN_INFO = {
  10143: {
    explorer: 'https://testnet.monadexplorer.com/',
    label: 'Monad',
    nativeCurrency: { name: 'MONAD', symbol: 'MON', decimals: 9 },
  },
};

export const SupportedChainId = Object.keys(CHAIN_INFO);

export function getChainInfo(chainId) {
  if (chainId) {
    return (
      CHAIN_INFO[chainId] ?? {
        explorer: '',
        label: 'Undefined',
        nativeCurrency: { name: '', symbol: '', decimals: 0 },
      }
    );
  }
  return {
    explorer: '',
    label: 'Undefined',
    nativeCurrency: { name: '', symbol: '', decimals: 0 },
  };
}

export const APTOS_NATIVE_TOKEN = '0x1::aptos_coin::AptosCoin';
