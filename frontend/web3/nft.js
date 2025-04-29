import { ethers } from 'ethers';
import { abi, bytecode } from '@/web3/abi/collection';
import AxiosService from '@/services/axiosService';
import axios from 'axios';

let contractAddress;
let contractMeta;
let tokenId;

const MIN_PRICE = 0.000001;
const GAS_LIMIT = 1000000;

async function setupProvider() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const userAddress = await signer.getAddress();
  const balance = await provider.getBalance(userAddress);

  return { provider, signer, userAddress, balance };
}

function generateRandomNumber() {
  // Generate a random number between 100000 and 999999
  const min = 100000;
  const max = 999999;
  const randomBuffer = new Uint32Array(1);
  crypto.getRandomValues(randomBuffer);

  // Scale to our desired range
  const randomNumber = Math.floor((randomBuffer[0] / (0xffffffff + 1)) * (max - min + 1) + min);
  return randomNumber.toString();
}

async function signNFTMint(nft, userAddress) {
  const url = `${process.env.API_URL}nft/collections/sign`;
  const priceNumber = Number(nft.price) === 0 ? MIN_PRICE : Number(nft.price);

  const payload = {
    name: nft.name,
    wallet: userAddress,
    contractAddress: nft.contract_address,
    blockchain: chains.find((chain) => chain.id === Number(nft.blockchain_id))?.chainName,
    url: nft.file?.[0],
    description: nft.description,
    price: priceNumber,
    nonce: generateRandomNumber(),
  };
  const { data } = await axios.post(url, payload);
  return { signature: data, priceInEther: ethers.parseEther(priceNumber.toString()) };
}

async function createNFTTransaction(contract, signatureData, price) {
  return await contract.create(
    signatureData.nonce?.toString(),
    signatureData.deadline?.toString(),
    price,
    signatureData.args,
    signatureData.signature,
    {
      value: price,
      gasLimit: GAS_LIMIT,
    },
  );
}

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

    contractAddress = receipt.contractAddress;

    return receipt.contractAddress;
  } catch (error) {
    console.error('Deployment error:', error);
    throw new Error("Can't create collection: " + error.message);
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
    // Setup provider and get user details
    const { signer, userAddress } = await setupProvider();

    // Get signature and price
    const { signature, priceInEther } = await signNFTMint(nft, userAddress);

    // Create and execute transaction
    const contract = new ethers.Contract(nft.contract_address, abi, signer);
    const tx = await createNFTTransaction(contract, signature, priceInEther);

    const receipt = await tx.wait();

    if (receipt.status !== 1) {
      throw new Error('Transaction failed');
    }

    return {
      hash: tx.hash,
      wallet: userAddress,
      nft_id: Number(nft.id),
    };
  } catch (error) {
    console.error('Error during NFT mint:', error.message || error);
    throw error;
  }
}
export const getMetaData = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return AxiosService.post(`${process.env.API_URL}nft/file`, formData).then(({ data }) => data);
};
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
