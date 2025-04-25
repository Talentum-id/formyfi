import { ethers } from 'ethers';
import { ConnectionType } from '@/web3/connection';
import { CHAIN_INFO } from '@/web3/constants';
import { metamask, walletconnect, petra, tronlink, compass } from '@/constants/icons';

export function shortenAddress(address, chars = 4) {
  const parsed = ethers.utils.isAddress(address);
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${address.substring(0, chars + 5)}...${address.substring(42 - chars)}`;
}

export const makeShortenWalletAddress = (address = '') =>
  address.slice(0, 9) + '...' + address.slice(-4);

export const getChainName = (chainId) => {
  if (!CHAIN_INFO[chainId]) return '';
  if (chainId) {
    return CHAIN_INFO[chainId].nativeCurrency.symbol;
  } else return '';
};

export const getNativeCurrencyIcon = (currency) => {
  switch (currency) {
    case 'eth':
      return 'Ethereum-Circle';
    case 'bnb':
      return 'BNB-Circle';
    case 'aave':
      return 'Aave-Circle';
    default:
      return 'USDD-Default';
  }
};

export const getMetamaskProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum && window.ethereum.providers) {
    return window.ethereum.providers.find((item) => item.isMetaMask);
  } else if (typeof window !== 'undefined' && window.ethereum && !window.ethereum.providers) {
    return window.ethereum;
  }
};
export const getPhantomProvider = () => {
  return window.phantom.ethereum;
};

export const getAprosPetraProvider = () => {
  if (typeof window !== 'undefined' && window.aptos) {
    return window.aptos;
  } else {
    window.open('https://petra.app/', '_blank');
    return null;
  }
};

export const getCurrentWalletIcon = (type) => {
  switch (type) {
    case ConnectionType.METAMASK:
      return metamask;
    case ConnectionType.SUI:
      return sui;
    case ConnectionType.WALLET_CONNECT:
      return walletconnect;
    case ConnectionType.TRONLINK:
      return tronlink;
    case ConnectionType.APTOS_PETRA:
      return petra;
    case ConnectionType.COMPASS:
      return compass;
    case ConnectionType.RONIN:
      return ronin;
    case ConnectionType.PHANTOM:
      return phantom;

    default:
      return metamask;
  }
};
