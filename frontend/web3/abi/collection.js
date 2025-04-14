export const abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'nonce',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'sig',
        type: 'bytes',
      },
    ],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'nonce',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'price',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'args',
        type: 'string',
      },
      {
        internalType: 'bytes',
        name: 'sig',
        type: 'bytes',
      },
    ],
    name: 'create',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_symbol',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'uri_',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'maxSupply',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'isTokenTransfer',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'ERC721EnumerableForbiddenBatchMint',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'ERC721IncorrectOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'ERC721InsufficientApproval',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'approver',
        type: 'address',
      },
    ],
    name: 'ERC721InvalidApprover',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
    ],
    name: 'ERC721InvalidOperator',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'ERC721InvalidOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
    ],
    name: 'ERC721InvalidReceiver',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'ERC721InvalidSender',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'ERC721NonexistentToken',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'ERC721OutOfBoundsIndex',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidNonce',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MaxTotalSupply',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'OwnableInvalidOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_newuri',
        type: 'string',
      },
    ],
    name: 'setBaseURI',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'SigExpired',
    type: 'error',
  },
  {
    inputs: [],
    name: 'TokenNonTransferable',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'approved',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'ApprovalForAll',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'creator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'args',
        type: 'string',
      },
    ],
    name: 'Create',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'verifier',
        type: 'address',
      },
    ],
    name: 'setVerifier',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'withdrawOwner',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: '_deployer',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: '_isTokenTransfer',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: '_maxSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: '_verifier',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getApproved',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
    ],
    name: 'isApprovedForAll',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'ownerOf',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'message',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: 'sig',
        type: 'bytes',
      },
    ],
    name: 'recoverSigner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'sig',
        type: 'bytes',
      },
    ],
    name: 'splitSignature',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'tokenByIndex',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'tokenOfOwnerByIndex',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'tokenURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
export const erc1155abi = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'nonce',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'sig',
        type: 'bytes',
      },
    ],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'nonce',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'price',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'args',
        type: 'string',
      },
      {
        internalType: 'bytes',
        name: 'sig',
        type: 'bytes',
      },
    ],
    name: 'create',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'nonce',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'args',
        type: 'string',
      },
      {
        internalType: 'bytes',
        name: 'sig',
        type: 'bytes',
      },
    ],
    name: 'createNewTokenId',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'name_',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'symbol_',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'uri_',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'maxSupply',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'isTokenTransfer',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'balance',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'needed',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'ERC1155InsufficientBalance',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'approver',
        type: 'address',
      },
    ],
    name: 'ERC1155InvalidApprover',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'idsLength',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'valuesLength',
        type: 'uint256',
      },
    ],
    name: 'ERC1155InvalidArrayLength',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
    ],
    name: 'ERC1155InvalidOperator',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
    ],
    name: 'ERC1155InvalidReceiver',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'ERC1155InvalidSender',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'ERC1155MissingApprovalForAll',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidNonce',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MaxTotalSupply',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'OwnableInvalidOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    inputs: [],
    name: 'SigExpired',
    type: 'error',
  },
  {
    inputs: [],
    name: 'TokenNonTransferable',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'ApprovalForAll',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'creator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'args',
        type: 'string',
      },
    ],
    name: 'Create',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256[]',
        name: 'ids',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'safeBatchTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_newuri',
        type: 'string',
      },
    ],
    name: 'setBaseURI',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'verifier',
        type: 'address',
      },
    ],
    name: 'setVerifier',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'ids',
        type: 'uint256[]',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'values',
        type: 'uint256[]',
      },
    ],
    name: 'TransferBatch',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'TransferSingle',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'value',
        type: 'string',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'URI',
    type: 'event',
  },
  {
    inputs: [],
    name: 'withdrawOwner',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: '_deployer',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: '_isTokenTransfer',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: '_maxSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: '_verifier',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'accounts',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: 'ids',
        type: 'uint256[]',
      },
    ],
    name: 'balanceOfBatch',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'exists',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
    ],
    name: 'isApprovedForAll',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'message',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: 'sig',
        type: 'bytes',
      },
    ],
    name: 'recoverSigner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'sig',
        type: 'bytes',
      },
    ],
    name: 'splitSignature',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'uri',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
export const bytecode =
  '0x60806040526000600b5573ed8c1bf0090e58127e3d6c76a518ae6c354debd0600d60006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555073ba547c02ffea9be6d401a79b21f881e7a141a073600e60006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506000601155348015620000c557600080fd5b50604051620046d5380380620046d58339818101604052810190620000eb919062000524565b600e60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16858581600090816200012191906200084a565b5080600190816200013391906200084a565b505050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603620001ab5760006040517f1e4fbdf7000000000000000000000000000000000000000000000000000000008152600401620001a2919062000976565b60405180910390fd5b620001bc816200024b60201b60201c565b5082600c9081620001ce91906200084a565b50620001df6200031160201b60201c565b600f60006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508160118190555080601260006101000a81548160ff021916908315150217905550505050505062000993565b6000600a60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600a60006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600033905090565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620003828262000337565b810181811067ffffffffffffffff82111715620003a457620003a362000348565b5b80604052505050565b6000620003b962000319565b9050620003c7828262000377565b919050565b600067ffffffffffffffff821115620003ea57620003e962000348565b5b620003f58262000337565b9050602081019050919050565b60005b838110156200042257808201518184015260208101905062000405565b60008484015250505050565b6000620004456200043f84620003cc565b620003ad565b90508281526020810184848401111562000464576200046362000332565b5b6200047184828562000402565b509392505050565b600082601f8301126200049157620004906200032d565b5b8151620004a38482602086016200042e565b91505092915050565b6000819050919050565b620004c181620004ac565b8114620004cd57600080fd5b50565b600081519050620004e181620004b6565b92915050565b60008115159050919050565b620004fe81620004e7565b81146200050a57600080fd5b50565b6000815190506200051e81620004f3565b92915050565b600080600080600060a0868803121562000543576200054262000323565b5b600086015167ffffffffffffffff81111562000564576200056362000328565b5b620005728882890162000479565b955050602086015167ffffffffffffffff81111562000596576200059562000328565b5b620005a48882890162000479565b945050604086015167ffffffffffffffff811115620005c857620005c762000328565b5b620005d68882890162000479565b9350506060620005e988828901620004d0565b9250506080620005fc888289016200050d565b9150509295509295909350565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200065c57607f821691505b60208210810362000672576200067162000614565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302620006dc7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff826200069d565b620006e886836200069d565b95508019841693508086168417925050509392505050565b6000819050919050565b60006200072b620007256200071f84620004ac565b62000700565b620004ac565b9050919050565b6000819050919050565b62000747836200070a565b6200075f620007568262000732565b848454620006aa565b825550505050565b600090565b6200077662000767565b620007838184846200073c565b505050565b5b81811015620007ab576200079f6000826200076c565b60018101905062000789565b5050565b601f821115620007fa57620007c48162000678565b620007cf846200068d565b81016020851015620007df578190505b620007f7620007ee856200068d565b83018262000788565b50505b505050565b600082821c905092915050565b60006200081f60001984600802620007ff565b1980831691505092915050565b60006200083a83836200080c565b9150826002028217905092915050565b620008558262000609565b67ffffffffffffffff81111562000871576200087062000348565b5b6200087d825462000643565b6200088a828285620007af565b600060209050601f831160018114620008c25760008415620008ad578287015190505b620008b985826200082c565b86555062000929565b601f198416620008d28662000678565b60005b82811015620008fc57848901518255600182019150602085019450602081019050620008d5565b868310156200091c578489015162000918601f8916826200080c565b8355505b6001600288020188555050505b505050505050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006200095e8262000931565b9050919050565b620009708162000951565b82525050565b60006020820190506200098d600083018462000965565b92915050565b613d3280620009a36000396000f3fe6080604052600436106101cd5760003560e01c8063715018a6116100f7578063a7bb580311610095578063e61812b511610064578063e61812b5146106a1578063e8cc00ad146106cc578063e985e9c5146106e3578063f2fde38b14610720576101cd565b8063a7bb5803146105d1578063b88d4fde14610610578063c87b56dd14610639578063d310556b14610676576101cd565b80638da5cb5b116100d15780638da5cb5b1461051557806395d89b411461054057806397aba7f91461056b578063a22cb465146105a8576101cd565b8063715018a6146104aa57806380a5a371146104c15780638a172651146104ea576101cd565b80632f745c591161016f5780635437988d1161013e5780635437988d146103de57806355f804b3146104075780636352211e1461043057806370a082311461046d576101cd565b80632f745c591461031f57806342842e0e1461035c5780634698bf35146103855780634f6ccce7146103a1576101cd565b8063095ea7b3116101ab578063095ea7b31461027757806318160ddd146102a057806322f4596f146102cb57806323b872dd146102f6576101cd565b806301ffc9a7146101d257806306fdde031461020f578063081812fc1461023a575b600080fd5b3480156101de57600080fd5b506101f960048036038101906101f49190612aa8565b610749565b6040516102069190612af0565b60405180910390f35b34801561021b57600080fd5b506102246107c3565b6040516102319190612b9b565b60405180910390f35b34801561024657600080fd5b50610261600480360381019061025c9190612bf3565b610855565b60405161026e9190612c61565b60405180910390f35b34801561028357600080fd5b5061029e60048036038101906102999190612ca8565b610871565b005b3480156102ac57600080fd5b506102b5610887565b6040516102c29190612cf7565b60405180910390f35b3480156102d757600080fd5b506102e0610894565b6040516102ed9190612cf7565b60405180910390f35b34801561030257600080fd5b5061031d60048036038101906103189190612d12565b61089a565b005b34801561032b57600080fd5b5061034660048036038101906103419190612ca8565b6108b2565b6040516103539190612cf7565b60405180910390f35b34801561036857600080fd5b50610383600480360381019061037e9190612d12565b61095b565b005b61039f600480360381019061039a9190612f3b565b61097b565b005b3480156103ad57600080fd5b506103c860048036038101906103c39190612bf3565b610c13565b6040516103d59190612cf7565b60405180910390f35b3480156103ea57600080fd5b5061040560048036038101906104009190612fee565b610c89565b005b34801561041357600080fd5b5061042e6004803603810190610429919061301b565b610cd5565b005b34801561043c57600080fd5b5061045760048036038101906104529190612bf3565b610cf0565b6040516104649190612c61565b60405180910390f35b34801561047957600080fd5b50610494600480360381019061048f9190612fee565b610d02565b6040516104a19190612cf7565b60405180910390f35b3480156104b657600080fd5b506104bf610dbc565b005b3480156104cd57600080fd5b506104e860048036038101906104e39190613064565b610dd0565b005b3480156104f657600080fd5b506104ff610f87565b60405161050c9190612c61565b60405180910390f35b34801561052157600080fd5b5061052a610fad565b6040516105379190612c61565b60405180910390f35b34801561054c57600080fd5b50610555610fd7565b6040516105629190612b9b565b60405180910390f35b34801561057757600080fd5b50610592600480360381019061058d9190613109565b611069565b60405161059f9190612c61565b60405180910390f35b3480156105b457600080fd5b506105cf60048036038101906105ca9190613191565b6110de565b005b3480156105dd57600080fd5b506105f860048036038101906105f391906131d1565b6110f4565b60405161060793929190613245565b60405180910390f35b34801561061c57600080fd5b506106376004803603810190610632919061327c565b611137565b005b34801561064557600080fd5b50610660600480360381019061065b9190612bf3565b611154565b60405161066d9190612b9b565b60405180910390f35b34801561068257600080fd5b5061068b6111be565b6040516106989190612c61565b60405180910390f35b3480156106ad57600080fd5b506106b66111e4565b6040516106c39190612af0565b60405180910390f35b3480156106d857600080fd5b506106e16111f7565b005b3480156106ef57600080fd5b5061070a600480360381019061070591906132ff565b611255565b6040516107179190612af0565b60405180910390f35b34801561072c57600080fd5b5061074760048036038101906107429190612fee565b6112e9565b005b60007f780e9d63000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614806107bc57506107bb8261136f565b5b9050919050565b6060600080546107d29061336e565b80601f01602080910402602001604051908101604052809291908181526020018280546107fe9061336e565b801561084b5780601f106108205761010080835404028352916020019161084b565b820191906000526020600020905b81548152906001019060200180831161082e57829003601f168201915b5050505050905090565b600061086082611451565b5061086a826114d9565b9050919050565b610883828261087e611516565b61151e565b5050565b6000600880549050905090565b60115481565b6108a2611530565b6108ad838383611578565b505050565b60006108bd83610d02565b82106109025782826040517fa57d13dc0000000000000000000000000000000000000000000000000000000081526004016108f992919061339f565b60405180910390fd5b600660008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600083815260200190815260200160002054905092915050565b61097683838360405180602001604052806000815250611137565b505050565b610985858561167a565b60006109c7868686610995611516565b30886040516020016109ac9695949392919061346d565b60405160208183030381529060405280519060200120611761565b905060006109d58284611069565b9050600d60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614610a67576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a5e90613525565b60405180910390fd5b60016010600089815260200190815260200160002060006101000a81548160ff02191690831515021790555084341015610ad6576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610acd90613591565b60405180910390fd5b60008534610ae491906135e0565b90506000811115610b3e57610af7611516565b73ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050158015610b3c573d6000803e3d6000fd5b505b610b46610fad565b73ffffffffffffffffffffffffffffffffffffffff166108fc879081150290604051600060405180830381858888f19350505050158015610b8b573d6000803e3d6000fd5b506000610b96611791565b9050610ba9610ba3611516565b826117a7565b610bb16117c5565b610bb9611516565b73ffffffffffffffffffffffffffffffffffffffff167f06acdc615e0b6df2984444b78654ef89855fead2ca37b1d70464c0e7827590e28288604051610c00929190613614565b60405180910390a2505050505050505050565b6000610c1d610887565b8210610c63576000826040517fa57d13dc000000000000000000000000000000000000000000000000000000008152600401610c5a92919061339f565b60405180910390fd5b60088281548110610c7757610c76613644565b5b90600052602060002001549050919050565b610c916117df565b80600d60006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b610cdd6117df565b80600c9081610cec919061381f565b5050565b6000610cfb82611451565b9050919050565b60008073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610d755760006040517f89c62b64000000000000000000000000000000000000000000000000000000008152600401610d6c9190612c61565b60405180910390fd5b600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b610dc46117df565b610dce6000611866565b565b6010600083815260200190815260200160002060009054906101000a900460ff1615610dfb57600080fd5b6000610e2e8330604051602001610e139291906138f1565b60405160208183030381529060405280519060200120611761565b90506000610e3c8284611069565b9050600d60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614610ece576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ec590613525565b60405180910390fd5b60016010600086815260200190815260200160002060006101000a81548160ff021916908315150217905550610f02611516565b73ffffffffffffffffffffffffffffffffffffffff16610f2186610cf0565b73ffffffffffffffffffffffffffffffffffffffff1614610f77576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f6e90613969565b60405180910390fd5b610f808561192c565b5050505050565b600d60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600a60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b606060018054610fe69061336e565b80601f01602080910402602001604051908101604052809291908181526020018280546110129061336e565b801561105f5780601f106110345761010080835404028352916020019161105f565b820191906000526020600020905b81548152906001019060200180831161104257829003601f168201915b5050505050905090565b600080600080611078856110f4565b809350819450829550505050600186848484604051600081526020016040526040516110a79493929190613989565b6020604051602081039080840390855afa1580156110c9573d6000803e3d6000fd5b50505060206040510351935050505092915050565b6110f06110e9611516565b83836119b2565b5050565b6000806000604184511461110757600080fd5b60008060006020870151925060408701519150606087015160001a90508083839550955095505050509193909250565b61114284848461089a565b61114e84848484611b21565b50505050565b606061115f82611451565b506000600c805461116f9061336e565b90501161118b57604051806020016040528060008152506111b7565b600c61119683611cd8565b6040516020016111a7929190613a51565b6040516020818303038152906040525b9050919050565b600f60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b601260009054906101000a900460ff1681565b6111ff6117df565b600047905061120c611516565b73ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050158015611251573d6000803e3d6000fd5b5050565b6000600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b6112f16117df565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036113635760006040517f1e4fbdf700000000000000000000000000000000000000000000000000000000815260040161135a9190612c61565b60405180910390fd5b61136c81611866565b50565b60007f80ac58cd000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916148061143a57507f5b5e139f000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b8061144a575061144982611da6565b5b9050919050565b60008061145d83611e10565b9050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036114d057826040517f7e2732890000000000000000000000000000000000000000000000000000000081526004016114c79190612cf7565b60405180910390fd5b80915050919050565b60006004600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b600033905090565b61152b8383836001611e4d565b505050565b601260009054906101000a900460ff16611576576040517ffcd0178f00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036115ea5760006040517f64a0ae920000000000000000000000000000000000000000000000000000000081526004016115e19190612c61565b60405180910390fd5b60006115fe83836115f9611516565b612012565b90508373ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614611674578382826040517f64283d7b00000000000000000000000000000000000000000000000000000000815260040161166b93929190613a75565b60405180910390fd5b50505050565b6010600083815260200190815260200160002060009054906101000a900460ff16156116d2576040517f756688fe00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b4381101561170c576040517f3ba234a300000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60006011541180156117265750611721610887565b601154145b1561175d576040517fda0f039d00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5050565b6000816040516020016117749190613b19565b604051602081830303815290604052805190602001209050919050565b60006001600b546117a29190613b3f565b905090565b6117c182826040518060200160405280600081525061212f565b5050565b600b60008154809291906117d890613b73565b9190505550565b6117e7611516565b73ffffffffffffffffffffffffffffffffffffffff16611805610fad565b73ffffffffffffffffffffffffffffffffffffffff161461186457611828611516565b6040517f118cdaa700000000000000000000000000000000000000000000000000000000815260040161185b9190612c61565b60405180910390fd5b565b6000600a60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600a60006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600061193b6000836000612012565b9050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036119ae57816040517f7e2732890000000000000000000000000000000000000000000000000000000081526004016119a59190612cf7565b60405180910390fd5b5050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603611a2357816040517f5b08ba18000000000000000000000000000000000000000000000000000000008152600401611a1a9190612c61565b60405180910390fd5b80600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3183604051611b149190612af0565b60405180910390a3505050565b60008373ffffffffffffffffffffffffffffffffffffffff163b1115611cd2578273ffffffffffffffffffffffffffffffffffffffff1663150b7a02611b65611516565b8685856040518563ffffffff1660e01b8152600401611b879493929190613c10565b6020604051808303816000875af1925050508015611bc357506040513d601f19601f82011682018060405250810190611bc09190613c71565b60015b611c47573d8060008114611bf3576040519150601f19603f3d011682016040523d82523d6000602084013e611bf8565b606091505b506000815103611c3f57836040517f64a0ae92000000000000000000000000000000000000000000000000000000008152600401611c369190612c61565b60405180910390fd5b805181602001fd5b63150b7a0260e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614611cd057836040517f64a0ae92000000000000000000000000000000000000000000000000000000008152600401611cc79190612c61565b60405180910390fd5b505b50505050565b606060006001611ce78461214b565b01905060008167ffffffffffffffff811115611d0657611d05612d6f565b5b6040519080825280601f01601f191660200182016040528015611d385781602001600182028036833780820191505090505b509050600082602001820190505b600115611d9b578080600190039150507f3031323334353637383961626364656600000000000000000000000000000000600a86061a8153600a8581611d8f57611d8e613c9e565b5b04945060008503611d46575b819350505050919050565b60007f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b60006002600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b8080611e865750600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614155b15611fba576000611e9684611451565b9050600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614158015611f0157508273ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614155b8015611f145750611f128184611255565b155b15611f5657826040517fa9fbf51f000000000000000000000000000000000000000000000000000000008152600401611f4d9190612c61565b60405180910390fd5b8115611fb857838573ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45b505b836004600085815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050505050565b60008061202085858561229e565b9050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036120645761205f846124b8565b6120a3565b8473ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16146120a2576120a18185612501565b5b5b600073ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff16036120e5576120e084612662565b612124565b8473ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614612123576121228585612733565b5b5b809150509392505050565b61213983836127be565b6121466000848484611b21565b505050565b600080600090507a184f03e93ff9f4daa797ed6e38ed64bf6a1f01000000000000000083106121a9577a184f03e93ff9f4daa797ed6e38ed64bf6a1f010000000000000000838161219f5761219e613c9e565b5b0492506040810190505b6d04ee2d6d415b85acef810000000083106121e6576d04ee2d6d415b85acef810000000083816121dc576121db613c9e565b5b0492506020810190505b662386f26fc10000831061221557662386f26fc10000838161220b5761220a613c9e565b5b0492506010810190505b6305f5e100831061223e576305f5e100838161223457612233613c9e565b5b0492506008810190505b612710831061226357612710838161225957612258613c9e565b5b0492506004810190505b60648310612286576064838161227c5761227b613c9e565b5b0492506002810190505b600a8310612295576001810190505b80915050919050565b6000806122aa84611e10565b9050600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16146122ec576122eb8184866128b7565b5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161461237d5761232e600085600080611e4d565b6001600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055505b600073ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff1614612400576001600360008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055505b846002600086815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550838573ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4809150509392505050565b6008805490506009600083815260200190815260200160002081905550600881908060018154018082558091505060019003906000526020600020016000909190919091505550565b600061250c83610d02565b90506000600760008481526020019081526020016000205490508181146125f1576000600660008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600084815260200190815260200160002054905080600660008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600084815260200190815260200160002081905550816007600083815260200190815260200160002081905550505b6007600084815260200190815260200160002060009055600660008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008381526020019081526020016000206000905550505050565b6000600160088054905061267691906135e0565b90506000600960008481526020019081526020016000205490506000600883815481106126a6576126a5613644565b5b9060005260206000200154905080600883815481106126c8576126c7613644565b5b90600052602060002001819055508160096000838152602001908152602001600020819055506009600085815260200190815260200160002060009055600880548061271757612716613ccd565b5b6001900381819060005260206000200160009055905550505050565b6000600161274084610d02565b61274a91906135e0565b905081600660008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600083815260200190815260200160002081905550806007600084815260200190815260200160002081905550505050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036128305760006040517f64a0ae920000000000000000000000000000000000000000000000000000000081526004016128279190612c61565b60405180910390fd5b600061283e83836000612012565b9050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16146128b25760006040517f73c6ac6e0000000000000000000000000000000000000000000000000000000081526004016128a99190612c61565b60405180910390fd5b505050565b6128c283838361297b565b61297657600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff160361293757806040517f7e27328900000000000000000000000000000000000000000000000000000000815260040161292e9190612cf7565b60405180910390fd5b81816040517f177e802f00000000000000000000000000000000000000000000000000000000815260040161296d92919061339f565b60405180910390fd5b505050565b60008073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614158015612a3357508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1614806129f457506129f38484611255565b5b80612a3257508273ffffffffffffffffffffffffffffffffffffffff16612a1a836114d9565b73ffffffffffffffffffffffffffffffffffffffff16145b5b90509392505050565b6000604051905090565b600080fd5b600080fd5b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b612a8581612a50565b8114612a9057600080fd5b50565b600081359050612aa281612a7c565b92915050565b600060208284031215612abe57612abd612a46565b5b6000612acc84828501612a93565b91505092915050565b60008115159050919050565b612aea81612ad5565b82525050565b6000602082019050612b056000830184612ae1565b92915050565b600081519050919050565b600082825260208201905092915050565b60005b83811015612b45578082015181840152602081019050612b2a565b60008484015250505050565b6000601f19601f8301169050919050565b6000612b6d82612b0b565b612b778185612b16565b9350612b87818560208601612b27565b612b9081612b51565b840191505092915050565b60006020820190508181036000830152612bb58184612b62565b905092915050565b6000819050919050565b612bd081612bbd565b8114612bdb57600080fd5b50565b600081359050612bed81612bc7565b92915050565b600060208284031215612c0957612c08612a46565b5b6000612c1784828501612bde565b91505092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000612c4b82612c20565b9050919050565b612c5b81612c40565b82525050565b6000602082019050612c766000830184612c52565b92915050565b612c8581612c40565b8114612c9057600080fd5b50565b600081359050612ca281612c7c565b92915050565b60008060408385031215612cbf57612cbe612a46565b5b6000612ccd85828601612c93565b9250506020612cde85828601612bde565b9150509250929050565b612cf181612bbd565b82525050565b6000602082019050612d0c6000830184612ce8565b92915050565b600080600060608486031215612d2b57612d2a612a46565b5b6000612d3986828701612c93565b9350506020612d4a86828701612c93565b9250506040612d5b86828701612bde565b9150509250925092565b600080fd5b600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b612da782612b51565b810181811067ffffffffffffffff82111715612dc657612dc5612d6f565b5b80604052505050565b6000612dd9612a3c565b9050612de58282612d9e565b919050565b600067ffffffffffffffff821115612e0557612e04612d6f565b5b612e0e82612b51565b9050602081019050919050565b82818337600083830152505050565b6000612e3d612e3884612dea565b612dcf565b905082815260208101848484011115612e5957612e58612d6a565b5b612e64848285612e1b565b509392505050565b600082601f830112612e8157612e80612d65565b5b8135612e91848260208601612e2a565b91505092915050565b600067ffffffffffffffff821115612eb557612eb4612d6f565b5b612ebe82612b51565b9050602081019050919050565b6000612ede612ed984612e9a565b612dcf565b905082815260208101848484011115612efa57612ef9612d6a565b5b612f05848285612e1b565b509392505050565b600082601f830112612f2257612f21612d65565b5b8135612f32848260208601612ecb565b91505092915050565b600080600080600060a08688031215612f5757612f56612a46565b5b6000612f6588828901612bde565b9550506020612f7688828901612bde565b9450506040612f8788828901612bde565b935050606086013567ffffffffffffffff811115612fa857612fa7612a4b565b5b612fb488828901612e6c565b925050608086013567ffffffffffffffff811115612fd557612fd4612a4b565b5b612fe188828901612f0d565b9150509295509295909350565b60006020828403121561300457613003612a46565b5b600061301284828501612c93565b91505092915050565b60006020828403121561303157613030612a46565b5b600082013567ffffffffffffffff81111561304f5761304e612a4b565b5b61305b84828501612e6c565b91505092915050565b60008060006060848603121561307d5761307c612a46565b5b600061308b86828701612bde565b935050602061309c86828701612bde565b925050604084013567ffffffffffffffff8111156130bd576130bc612a4b565b5b6130c986828701612f0d565b9150509250925092565b6000819050919050565b6130e6816130d3565b81146130f157600080fd5b50565b600081359050613103816130dd565b92915050565b600080604083850312156131205761311f612a46565b5b600061312e858286016130f4565b925050602083013567ffffffffffffffff81111561314f5761314e612a4b565b5b61315b85828601612f0d565b9150509250929050565b61316e81612ad5565b811461317957600080fd5b50565b60008135905061318b81613165565b92915050565b600080604083850312156131a8576131a7612a46565b5b60006131b685828601612c93565b92505060206131c78582860161317c565b9150509250929050565b6000602082840312156131e7576131e6612a46565b5b600082013567ffffffffffffffff81111561320557613204612a4b565b5b61321184828501612f0d565b91505092915050565b600060ff82169050919050565b6132308161321a565b82525050565b61323f816130d3565b82525050565b600060608201905061325a6000830186613227565b6132676020830185613236565b6132746040830184613236565b949350505050565b6000806000806080858703121561329657613295612a46565b5b60006132a487828801612c93565b94505060206132b587828801612c93565b93505060406132c687828801612bde565b925050606085013567ffffffffffffffff8111156132e7576132e6612a4b565b5b6132f387828801612f0d565b91505092959194509250565b6000806040838503121561331657613315612a46565b5b600061332485828601612c93565b925050602061333585828601612c93565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061338657607f821691505b6020821081036133995761339861333f565b5b50919050565b60006040820190506133b46000830185612c52565b6133c16020830184612ce8565b9392505050565b6000819050919050565b6133e36133de82612bbd565b6133c8565b82525050565b60008160601b9050919050565b6000613401826133e9565b9050919050565b6000613413826133f6565b9050919050565b61342b61342682612c40565b613408565b82525050565b600081905092915050565b600061344782612b0b565b6134518185613431565b9350613461818560208601612b27565b80840191505092915050565b600061347982896133d2565b60208201915061348982886133d2565b60208201915061349982876133d2565b6020820191506134a9828661341a565b6014820191506134b9828561341a565b6014820191506134c9828461343c565b9150819050979650505050505050565b7f556e617574686f72697a6564207472616e73616374696f6e0000000000000000600082015250565b600061350f601883612b16565b915061351a826134d9565b602082019050919050565b6000602082019050818103600083015261353e81613502565b9050919050565b7f496e73756666696369656e7420746f206d696e7420746f6b656e000000000000600082015250565b600061357b601a83612b16565b915061358682613545565b602082019050919050565b600060208201905081810360008301526135aa8161356e565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006135eb82612bbd565b91506135f683612bbd565b925082820390508181111561360e5761360d6135b1565b5b92915050565b60006040820190506136296000830185612ce8565b818103602083015261363b8184612b62565b90509392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026136d57fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82613698565b6136df8683613698565b95508019841693508086168417925050509392505050565b6000819050919050565b600061371c61371761371284612bbd565b6136f7565b612bbd565b9050919050565b6000819050919050565b61373683613701565b61374a61374282613723565b8484546136a5565b825550505050565b600090565b61375f613752565b61376a81848461372d565b505050565b5b8181101561378e57613783600082613757565b600181019050613770565b5050565b601f8211156137d3576137a481613673565b6137ad84613688565b810160208510156137bc578190505b6137d06137c885613688565b83018261376f565b50505b505050565b600082821c905092915050565b60006137f6600019846008026137d8565b1980831691505092915050565b600061380f83836137e5565b9150826002028217905092915050565b61382882612b0b565b67ffffffffffffffff81111561384157613840612d6f565b5b61384b825461336e565b613856828285613792565b600060209050601f8311600181146138895760008415613877578287015190505b6138818582613803565b8655506138e9565b601f19841661389786613673565b60005b828110156138bf5784890151825560018201915060208501945060208101905061389a565b868310156138dc57848901516138d8601f8916826137e5565b8355505b6001600288020188555050505b505050505050565b60006138fd82856133d2565b60208201915061390d828461341a565b6014820191508190509392505050565b7f43616c6c6572206973206e6f7420616e206f776e6572206f6620746f6b656e00600082015250565b6000613953601f83612b16565b915061395e8261391d565b602082019050919050565b6000602082019050818103600083015261398281613946565b9050919050565b600060808201905061399e6000830187613236565b6139ab6020830186613227565b6139b86040830185613236565b6139c56060830184613236565b95945050505050565b600081546139db8161336e565b6139e58186613431565b94506001821660008114613a005760018114613a1557613a48565b60ff1983168652811515820286019350613a48565b613a1e85613673565b60005b83811015613a4057815481890152600182019150602081019050613a21565b838801955050505b50505092915050565b6000613a5d82856139ce565b9150613a69828461343c565b91508190509392505050565b6000606082019050613a8a6000830186612c52565b613a976020830185612ce8565b613aa46040830184612c52565b949350505050565b7f19457468657265756d205369676e6564204d6573736167653a0a333200000000600082015250565b6000613ae2601c83613431565b9150613aed82613aac565b601c82019050919050565b6000819050919050565b613b13613b0e826130d3565b613af8565b82525050565b6000613b2482613ad5565b9150613b308284613b02565b60208201915081905092915050565b6000613b4a82612bbd565b9150613b5583612bbd565b9250828201905080821115613b6d57613b6c6135b1565b5b92915050565b6000613b7e82612bbd565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8203613bb057613baf6135b1565b5b600182019050919050565b600081519050919050565b600082825260208201905092915050565b6000613be282613bbb565b613bec8185613bc6565b9350613bfc818560208601612b27565b613c0581612b51565b840191505092915050565b6000608082019050613c256000830187612c52565b613c326020830186612c52565b613c3f6040830185612ce8565b8181036060830152613c518184613bd7565b905095945050505050565b600081519050613c6b81612a7c565b92915050565b600060208284031215613c8757613c86612a46565b5b6000613c9584828501613c5c565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603160045260246000fdfea2646970667358221220f5ce2b0d0568c5d5f35744fba8e6149c9486b506a7eed5cfe8ec241d6a4533d264736f6c63430008140033';
