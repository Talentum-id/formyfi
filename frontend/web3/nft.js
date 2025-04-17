import { ethers } from 'ethers';
import { abi, bytecode, erc1155abi } from '@/web3/abi/collection';
import { Transaction } from '@mysten/sui/transactions';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { inputs } from '@/web3/abi/nftSuiInputs';
import { fromB64 } from '@mysten/bcs';
import AxiosService from '@/services/axiosService';
const SUI_ADDRESS_LENGTH = 32;

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

let contractAddress;
let contractMeta;
let tokenId;
export async function deploy(data) {
  try {
    if (!window.ethereum) {
      throw new Error('No Ethereum provider found');
    }

    // Initialize provider and signer
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();

    // Create contract factory
    const factory = new ethers.ContractFactory(abi, bytecode, signer);

    // Calculate supply
    const supply = data.unlimited_supply ? 1000000 : data.max_supply;

    // Check balance
    const balance = await provider.getBalance(signer.address);
    if (balance === 0n) {
      throw new Error('Low balance');
    }

    // Prepare deployment transaction
    const deployTx = await factory.getDeployTransaction(
      data.name,
      data.symbol,
      data.uri,
      BigInt(supply),
      data.transferable,
    );

    // Send transaction and wait for deployment
    const tx = await signer.sendTransaction(deployTx);
    const receipt = await tx.wait();

    if (!receipt.contractAddress) {
      throw new Error('Contract deployment failed');
    }

    console.log('Contract deployed at address:', receipt.contractAddress);
    contractAddress = receipt.contractAddress;

    return receipt.contractAddress;
  } catch (error) {
    console.error('Deployment error:', error);
    throw new Error("Can't create collection: " + error.message);
  }
}
export async function createNFTId() {
  try {
    if (!window.ethereum) {
      throw new Error('No Ethereum provider found');
    }

    // Initialize provider and signer
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();

    // Get user address
    const userAddress = await signer.getAddress();

    // Initialize contract
    const contract = new ethers.Contract(
      useRuntimeConfig().public.erc1155Address,
      erc1155abi,
      signer,
    );

    // Get signature from backend
    const response = await AxiosService.post(useRuntimeConfig().public.apiBase + 'nft/sign-1155', {
      contract_address: useRuntimeConfig().public.erc1155Address,
      address: userAddress,
    });

    try {
      // Create new token ID
      const tx = await contract.createNewTokenId(
        response.data.nonce.toString(),
        response.data.deadline.toString(),
        response.data.args,
        response.data.signature,
      );

      console.log('Transaction hash:', tx.hash);
      const res = await tx.wait();
      const events = await decodeTransferSingle(res);

      contractAddress = useRuntimeConfig().public.erc1155Address;
      tokenId = events.id;

      return tokenId;
    } catch (e) {
      console.error('Token creation error:', e);
      throw new Error("Can't create collection: " + e.message);
    }
  } catch (error) {
    console.error('Create NFT ID error:', error);
    throw new Error("Can't create collection: " + error.message);
  }
}
function decodeTransferSingle(tx) {
  const iface = new ethers.utils.Interface(erc1155abi);
  const logs = tx.events;

  for (const log of logs) {
    try {
      const parsedLog = iface.parseLog(log);
      if ('id' in parsedLog.args) {
        return {
          event: parsedLog.name,
          id: parsedLog.args.id.toString(),
          fullArgs: parsedLog.args,
        };
      }
    } catch (err) {}
  }
}

export async function switchNetwork(blockchain_id) {
  const chain = chains.find((chain) => chain.id === blockchain_id);
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chain.chainId }],
    });
  } catch (switchError) {
    try {
      await addChainToWallet(chain);
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chain.chainId }],
      });
    } catch {
      console.error('Failed to add the chain:', switchError);
      throw switchError;
    }
  }
}

export function getContractAddress() {
  return contractAddress;
}

export function getTokenId() {
  return tokenId;
}
export function getContractMeta() {
  return contractMeta;
}
async function addChainToWallet(blockchain) {
  const chain = JSON.parse(JSON.stringify(blockchain));
  try {
    delete chain.id;
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [chain],
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function mint(nft) {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = provider.getSigner();
    const gasLimit = 1000000;
    const userAddress = await signer.getAddress();
    const balance = await provider.getBalance(userAddress);

    // Convert balance to BigNumber
    const balanceInWei = ethers.utils.parseEther(ethers.utils.formatEther(balance));

    let url = `WEB2URL`;

    console.log('Balance in Wei:', balanceInWei.toString());

    const { data } = await api.post(url, {
      wallet: userAddress,
    });

    const obj = data;

    // Convert obj.price to BigNumber
    const price = BigNumber.from(nft.price.toString());

    if (balanceInWei.lt(price)) {
      onErrorAlert('Low Balance for Claim');
      throw new Error('Low Balance for Claim');
    }

    const contract = new ethers.Contract(nft.address, abi, signer);

    const tx = await contract.create(
      obj.nonce.toString(),
      obj.deadline.toString(),
      price,
      obj.args,
      obj.signature,
      {
        value: price,
        gasLimit: gasLimit,
      },
    );

    console.log('Transaction hash:', tx.hash);

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      console.log('Transaction successful:', tx);
      return {
        tx: tx.hash,
        wallet: userAddress,
      }
    } else {
      throw new Error('Transaction failed');
    }
  } catch (error) {
    console.error('Error during NFT claim:', error.message || error);
    onErrorAlert(error?.response ? error?.response?.data?.error : 'Can’t claim NFT Reward');
    throw error;
  }
}

export const chains = [
  {
    id: 10143,
    chainId: '0x279F',
    chainName: 'Monad',
    nativeCurrency: {
      name: 'Monad',
      symbol: 'MON',
      decimals: 18,
    },
    rpcUrls: ['https://testnet-rpc.monad.xyz'],
    blockExplorerUrls: ['https://testnet.monadexplorer.com/'],
  },
  {
    id: 56,
    chainId: '0x38', // 56 in hexadecimal
    chainName: 'BNB',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed.bnbchain.org'],
    blockExplorerUrls: ['https://bscscan.com'],
  },
  {
    id: 59144,
    chainId: '0xe708', // 59144 in hexadecimal
    chainName: 'Linea',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.linea.build'],
    blockExplorerUrls: ['https://explorer.linea.build'],
  },
  {
    id: 1,
    chainId: '0x1', // 1 in hexadecimal
    chainName: 'Ethereum',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.infura.io/v3/'],
    blockExplorerUrls: ['https://etherscan.io'],
  },
  {
    id: 137,
    chainId: '0x89',
    rpcUrls: ['https://polygon-rpc.com/'],
    chainName: 'Polygon',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    blockExplorerUrls: ['https://polygonscan.com/'],
  },
  {
    id: 97,
    chainId: '0x61', // 97 in hexadecimal
    chainName: 'BSC Testnet',
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'], // Example RPC URL for BSC Testnet
    blockExplorerUrls: ['https://testnet.bscscan.com'],
  },
  {
    id: 8453,
    chainId: '0x2105',
    rpcUrls: ['https://1rpc.io/base'],
    chainName: 'Base',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorerUrls: ['https://basescan.org'],
  },

  {
    id: 911867,
    chainId: '0xDE9FB',
    rpcUrls: ['https://odyssey.ithaca.xyz'],
    chainName: 'Odyssey Testnet',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorerUrls: ['https://odyssey-explorer.ithaca.xyz'],
  },
];
