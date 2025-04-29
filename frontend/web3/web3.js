import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { CHAIN_IDS_TO_NAMES, CHAIN_INFO } from './constants';
import { getMetamaskProvider } from '@/util/web3';

export const calculateCommissionFee = (value, percent = 0) =>
  value
    .mul(ethers.BigNumber.from(10000).add(ethers.BigNumber.from(percent)))
    .div(ethers.BigNumber.from(10000));

export function getExponentValue(decimals) {
  return new BigNumber(10).pow(decimals);
}

export function getHumanValue(value, decimals = 18) {
  return new BigNumber(value).div(getExponentValue(decimals));
}

export function getNonHumanValue(value, decimals) {
  if (typeof value !== 'string') {
    value = value.toString();
  }
  return ethers.utils.parseUnits(value.toString(), decimals);
}

export function getNonHumanValueSumm(amounts) {
  return amounts.reduce((acc, amount) => {
    return ethers.BigNumber.from(acc).add(ethers.BigNumber.from(amount));
  }, ethers.BigNumber.from(0));
}

export function isSupportedChain(chainId) {
  const supportedChainsIds = Object.keys(CHAIN_INFO);
  return !!chainId && supportedChainsIds.includes(String(chainId));
  // return !!chainId && SUPPORTED_CHAIN_ID.includes(+chainId);
}

export const calculateDecimalsPlaces = (value, decimals) => {
  let decimalPart = value.split('.')[1];
  let decimalPlaces = decimalPart ? decimalPart.length : 0;
  return decimalPlaces > decimals;
};

export function getChainInfo(chainId) {
  if (!CHAIN_INFO[chainId]) return '';
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

export async function switchNetwork(chainId) {
  const hexChainId = ethers.utils.hexValue(chainId);

  if (typeof window !== 'undefined' && getMetamaskProvider()) {
    try {
      await getMetamaskProvider().request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChainId }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902 || switchError.code === -32603) {
        try {
          await getMetamaskProvider().request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: hexChainId,
                chainName: CHAIN_IDS_TO_NAMES[chainId],
                nativeCurrency: getChainInfo(chainId).nativeCurrency,
                rpcUrls: RPC_URLS[chainId],
                blockExplorerUrls: [getChainInfo(chainId).explorer],
              },
            ],
          });
        } catch (addError) {
          console.error('addError', addError);
        }
      }
    }
  }
}

export const FALLBACK_URLS = {
  10143: ['https://testnet-rpc.monad.xyz'],
};

/**
 * Known JSON-RPC endpoints.
 * These are the URLs used by the interface when there is not another available source of chain data.
 */
export const RPC_URLS = {
  10143: FALLBACK_URLS[10143],
};

export class Uint128 {
  constructor(value) {}

  static fromString(value) {
    return new Uint128(value);
  }
}
