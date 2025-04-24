import { ethers } from 'ethers';
import { abi, bytecode, erc1155abi } from '@/web3/abi/collection';
import { Transaction } from '@mysten/sui/transactions';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { inputs } from '@/web3/abi/nftSuiInputs';
import { fromB64 } from '@mysten/bcs';
import AxiosService from '@/services/axiosService';
import axios from 'axios';
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
      '0x5CC9798C25528D3C972ECCaEde69A62b777f5798',
      erc1155abi,
      signer,
    );
    let url = `https://web2.formyfi.io/api/nft/collections/sign-1155`;

    // Get signature from backend
    const response = await axios.post(url, {
      contract_address: '0x5CC9798C25528D3C972ECCaEde69A62b777f5798',
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

      contractAddress = '0x5CC9798C25528D3C972ECCaEde69A62b777f5798';
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
    const signer = await provider.getSigner();
    const gasLimit = 1000000;
    const userAddress = await signer.getAddress();
    const balance = await provider.getBalance(userAddress);
    console.log(balance, 'balance');
    // Convert balance to BigNumber

    let url = `https://web2.formyfi.io/api/nft/collections/sign`;
    console.log(nft, 'nft');

    const { data } = await axios.post(url, {
      name: nft.name,
      wallet: userAddress,
      contractAddress: nft.contract_address,
      tokenId: Number(nft.tokenId),
      blockchain: chains.find((chain) => chain.id === Number(nft.blockchain_id))?.chainName,
      url: nft.file?.[0],
      description: nft.description,
      price: Number(nft.price),
    
    });

    const obj = data;
    console.log(obj, 'obj');
    // Convert obj.price to BigNumber
    const price = BigNumber.from(nft.price.toString());

    const ABI = nft.nftType === 'erc_721' ? abi : erc1155abi;
    const contract = new ethers.Contract(nft.contract_address, ABI, signer);

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
        nft_id: Number(nft.id),
      };
    } else {
      throw new Error('Transaction failed');
    }
  } catch (error) {
    console.error('Error during NFT claim:', error.message || error);
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
    id: 101,
    chainId: '101',
    rpcUrls: ['https://fullnode.mainnet.sui.io'],
    chainName: 'SUI',
    nativeCurrency: {
      name: 'SUI',
      symbol: 'SUI',
      decimals: 9,
    },
    blockExplorerUrls: ['https://explorer.sui.network/'],
  },
];
