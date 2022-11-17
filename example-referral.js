"use strict";

/**
 * Example JavaScript code that interacts with the page and Web3 wallets
 */

// Unpkg imports
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const Fortmatic = window.Fortmatic;
const evmChains = window.evmChains;

// Web3modal instance
let web3Modal

// Chosen wallet provider given by the dialog window
let provider;

// Address of the selected account
let selectedAccount;

const abi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "approved",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "burner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Burn",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "burn",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "endContract",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getApproved",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "mintUsingSequentialTokenId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "_data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

const doorAbi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "approved",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "newScriptURI",
				"type": "string"
			}
		],
		"name": "ScriptUpdate",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "_tokenIdCounter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "burnToken",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "contractURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getApproved",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "mintUsingSequentialTokenId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owners",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "_data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "scriptURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "newScriptURI",
				"type": "string"
			}
		],
		"name": "updateScriptURI",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

const TSabi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "approved",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "newScriptURI",
				"type": "string"
			}
		],
		"name": "ScriptUpdate",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "_tokenIdCounter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "burnToken",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "contractURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getApproved",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "mintUsingSequentialTokenId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "_data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "scriptURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "selfDestruct",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "newTokenURI",
				"type": "string"
			}
		],
		"name": "setTokenURI",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "tokenByIndex",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "tokenOfOwnerByIndex",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "newScriptURI",
				"type": "string"
			}
		],
		"name": "updateScriptURI",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

const byteCodeTS721 =
	"60806040523480156200001157600080fd5b506040518060400160405280600b81526020016a29aa26102428902237b7b960a91b815250604051806040016040528060068152602001654f464649434560d01b81525081600090816200006691906200042d565b5060016200007582826200042d565b505050620000926200008c620000e460201b60201c565b620000e8565b620000a960076200013a60201b62000e501760201c565b6040518060600160405280603581526020016200218360359139600a90620000d290826200042d565b50620000dd62000143565b5062000521565b3390565b600680546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b80546001019055565b6006546000906001600160a01b03163314620001a65760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064015b60405180910390fd5b620001bd60076200023860201b62000e591760201c565b90506127108110620002125760405162461bcd60e51b815260206004820152601460248201527f486974207570706572206d696e74206c696d697400000000000000000000000060448201526064016200019d565b6200021e33826200023c565b6200023560076200013a60201b62000e501760201c565b90565b5490565b6001600160a01b038216620002945760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f206164647265737360448201526064016200019d565b6000818152600260205260409020546001600160a01b031615620002fb5760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e7465640000000060448201526064016200019d565b6001600160a01b038216600090815260036020526040812080546001929062000326908490620004f9565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b505050565b634e487b7160e01b600052604160045260246000fd5b600181811c90821680620003b457607f821691505b602082108103620003d557634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200038457600081815260208120601f850160051c81016020861015620004045750805b601f850160051c820191505b81811015620004255782815560010162000410565b505050505050565b81516001600160401b0381111562000449576200044962000389565b62000461816200045a84546200039f565b84620003db565b602080601f831160018114620004995760008415620004805750858301515b600019600386901b1c1916600185901b17855562000425565b600085815260208120601f198616915b82811015620004ca57888601518255948401946001909101908401620004a9565b5085821015620004e95787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b808201808211156200051b57634e487b7160e01b600052601160045260246000fd5b92915050565b611c5280620005316000396000f3fe60806040526004361061019c5760003560e01c806384c4bd4b116100ec578063a740fc871161008a578063e67876fe11610064578063e67876fe14610452578063e8a3d48514610469578063e985e9c51461047e578063f2fde38b1461049e57600080fd5b8063a740fc87146103fb578063b88d4fde14610412578063c87b56dd1461043257600080fd5b8063985e49f4116100c6578063985e49f4146103a95780639cb8a26a146103be578063a22cb465146103c6578063a49ff5b2146103e657600080fd5b806384c4bd4b1461035f5780638da5cb5b1461037657806395d89b411461039457600080fd5b80634bb309121161015957806370a082311161013357806370a08231146102e7578063715018a6146103155780637b47ec1a1461032a57806382345f991461034a57600080fd5b80634bb30912146102925780636352211e146102a75780636f3bffd2146102c757600080fd5b806301ffc9a7146101a157806306fdde03146101d6578063081812fc146101f8578063095ea7b31461023057806323b872dd1461025257806342842e0e14610272575b600080fd5b3480156101ad57600080fd5b506101c16101bc366004611585565b6104be565b60405190151581526020015b60405180910390f35b3480156101e257600080fd5b506101eb610510565b6040516101cd91906115ef565b34801561020457600080fd5b50610218610213366004611602565b6105a2565b6040516001600160a01b0390911681526020016101cd565b34801561023c57600080fd5b5061025061024b366004611632565b61063c565b005b34801561025e57600080fd5b5061025061026d36600461165c565b610751565b34801561027e57600080fd5b5061025061028d36600461165c565b6107ac565b34801561029e57600080fd5b506101eb6107c7565b3480156102b357600080fd5b506102186102c2366004611602565b6107d6565b3480156102d357600080fd5b506102506102e2366004611724565b61084d565b3480156102f357600080fd5b5061030761030236600461176d565b6108be565b6040519081526020016101cd565b34801561032157600080fd5b50610250610945565b34801561033657600080fd5b50610250610345366004611602565b61097b565b34801561035657600080fd5b50610307610a15565b34801561036b57600080fd5b506007546103079081565b34801561038257600080fd5b506006546001600160a01b0316610218565b3480156103a057600080fd5b506101eb610ac7565b3480156103b557600080fd5b50610307610ad6565b610250610b67565b3480156103d257600080fd5b506102506103e1366004611788565b610b9f565b3480156103f257600080fd5b50610307610bae565b34801561040757600080fd5b506009546103079081565b34801561041e57600080fd5b5061025061042d3660046117c4565b610c0f565b34801561043e57600080fd5b506101eb61044d366004611602565b610c71565b34801561045e57600080fd5b506008546103079081565b34801561047557600080fd5b506101eb610d6a565b34801561048a57600080fd5b506101c1610499366004611840565b610d8a565b3480156104aa57600080fd5b506102506104b936600461176d565b610db8565b60006001600160e01b031982166380ac58cd60e01b14806104ef57506001600160e01b03198216635b5e139f60e01b145b8061050a57506301ffc9a760e01b6001600160e01b03198316145b92915050565b60606000805461051f90611873565b80601f016020809104026020016040519081016040528092919081815260200182805461054b90611873565b80156105985780601f1061056d57610100808354040283529160200191610598565b820191906000526020600020905b81548152906001019060200180831161057b57829003601f168201915b5050505050905090565b6000818152600260205260408120546001600160a01b03166106205760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084015b60405180910390fd5b506000908152600460205260409020546001600160a01b031690565b6000610647826107d6565b9050806001600160a01b0316836001600160a01b0316036106b45760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b6064820152608401610617565b336001600160a01b03821614806106d057506106d08133610d8a565b6107425760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760448201527f6e6572206e6f7220617070726f76656420666f7220616c6c00000000000000006064820152608401610617565b61074c8383610e5d565b505050565b6006546001600160a01b0316331461077b5760405162461bcd60e51b8152600401610617906118ad565b6107853382610ecb565b6107a15760405162461bcd60e51b8152600401610617906118e2565b61074c838383610fa2565b61074c83838360405180602001604052806000815250610c0f565b6060600a805461051f90611873565b6000818152600260205260408120546001600160a01b03168061050a5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b6064820152608401610617565b6006546001600160a01b031633146108775760405162461bcd60e51b8152600401610617906118ad565b600a6108838282611981565b507fd6666840ba3b0939cf78131cb173315c425a3385a30b8921494500ca2b49f34a816040516108b391906115ef565b60405180910390a150565b60006001600160a01b0382166109295760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b6064820152608401610617565b506001600160a01b031660009081526003602052604090205490565b6006546001600160a01b0316331461096f5760405162461bcd60e51b8152600401610617906118ad565b610979600061113e565b565b6006546001600160a01b031633146109a55760405162461bcd60e51b8152600401610617906118ad565b6000818152600260205260409020546001600160a01b0316610a095760405162461bcd60e51b815260206004820152601760248201527f6275726e3a206e6f6e6578697374656e7420746f6b656e0000000000000000006044820152606401610617565b610a1281611190565b50565b6006546000906001600160a01b03163314610a425760405162461bcd60e51b8152600401610617906118ad565b612710610a4e60085490565b610a589190611a57565b9050610a676127106002611a6a565b8110610aac5760405162461bcd60e51b8152602060048201526014602482015273121a5d081d5c1c195c881b5a5b9d081b1a5b5a5d60621b6044820152606401610617565b610ab6338261122b565b610ac4600880546001019055565b90565b60606001805461051f90611873565b6006546000906001600160a01b03163314610b035760405162461bcd60e51b8152600401610617906118ad565b506007546127108110610b4f5760405162461bcd60e51b8152602060048201526014602482015273121a5d081d5c1c195c881b5a5b9d081b1a5b5a5d60621b6044820152606401610617565b610b59338261122b565b610ac4600780546001019055565b6006546001600160a01b03163314610b915760405162461bcd60e51b8152600401610617906118ad565b6006546001600160a01b0316ff5b610baa33838361136d565b5050565b6006546000906001600160a01b03163314610bdb5760405162461bcd60e51b8152600401610617906118ad565b610be86127106002611a6a565b600954610bf59190611a57565b9050610c01338261122b565b610ac4600980546001019055565b6006546001600160a01b03163314610c395760405162461bcd60e51b8152600401610617906118ad565b610c433383610ecb565b610c5f5760405162461bcd60e51b8152600401610617906118e2565b610c6b8484848461143b565b50505050565b6000818152600260205260409020546060906001600160a01b0316610cea5760405162461bcd60e51b815260206004820152602960248201527f746f6b656e5552493a2055524920717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b6064820152608401610617565b612710821015610d1357604051806060016040528060358152602001611b496035913992915050565b610d206127106002611a6a565b821015610d4657604051806060016040528060358152602001611b7e6035913992915050565b604051806060016040528060358152602001611bb36035913992915050565b919050565b6060604051806060016040528060358152602001611be860359139905090565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b6006546001600160a01b03163314610de25760405162461bcd60e51b8152600401610617906118ad565b6001600160a01b038116610e475760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610617565b610a128161113e565b80546001019055565b5490565b600081815260046020526040902080546001600160a01b0319166001600160a01b0384169081179091558190610e92826107d6565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6000818152600260205260408120546001600160a01b0316610f445760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b6064820152608401610617565b6000610f4f836107d6565b9050806001600160a01b0316846001600160a01b03161480610f765750610f768185610d8a565b80610f9a5750836001600160a01b0316610f8f846105a2565b6001600160a01b0316145b949350505050565b826001600160a01b0316610fb5826107d6565b6001600160a01b0316146110195760405162461bcd60e51b815260206004820152602560248201527f4552433732313a207472616e736665722066726f6d20696e636f72726563742060448201526437bbb732b960d91b6064820152608401610617565b6001600160a01b03821661107b5760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b6064820152608401610617565b611086600082610e5d565b6001600160a01b03831660009081526003602052604081208054600192906110af908490611a89565b90915550506001600160a01b03821660009081526003602052604081208054600192906110dd908490611a57565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b600680546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b600061119b826107d6565b90506111a8600083610e5d565b6001600160a01b03811660009081526003602052604081208054600192906111d1908490611a89565b909155505060008281526002602052604080822080546001600160a01b0319169055518391906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b6001600160a01b0382166112815760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f20616464726573736044820152606401610617565b6000818152600260205260409020546001600160a01b0316156112e65760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401610617565b6001600160a01b038216600090815260036020526040812080546001929061130f908490611a57565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b816001600160a01b0316836001600160a01b0316036113ce5760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c6572000000000000006044820152606401610617565b6001600160a01b03838116600081815260056020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b611446848484610fa2565b6114528484848461146e565b610c6b5760405162461bcd60e51b815260040161061790611a9c565b60006001600160a01b0384163b1561156457604051630a85bd0160e11b81526001600160a01b0385169063150b7a02906114b2903390899088908890600401611aee565b6020604051808303816000875af19250505080156114ed575060408051601f3d908101601f191682019092526114ea91810190611b2b565b60015b61154a573d80801561151b576040519150601f19603f3d011682016040523d82523d6000602084013e611520565b606091505b5080516000036115425760405162461bcd60e51b815260040161061790611a9c565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050610f9a565b506001949350505050565b6001600160e01b031981168114610a1257600080fd5b60006020828403121561159757600080fd5b81356115a28161156f565b9392505050565b6000815180845260005b818110156115cf576020818501810151868301820152016115b3565b506000602082860101526020601f19601f83011685010191505092915050565b6020815260006115a260208301846115a9565b60006020828403121561161457600080fd5b5035919050565b80356001600160a01b0381168114610d6557600080fd5b6000806040838503121561164557600080fd5b61164e8361161b565b946020939093013593505050565b60008060006060848603121561167157600080fd5b61167a8461161b565b92506116886020850161161b565b9150604084013590509250925092565b634e487b7160e01b600052604160045260246000fd5b600067ffffffffffffffff808411156116c9576116c9611698565b604051601f8501601f19908116603f011681019082821181831017156116f1576116f1611698565b8160405280935085815286868601111561170a57600080fd5b858560208301376000602087830101525050509392505050565b60006020828403121561173657600080fd5b813567ffffffffffffffff81111561174d57600080fd5b8201601f8101841361175e57600080fd5b610f9a848235602084016116ae565b60006020828403121561177f57600080fd5b6115a28261161b565b6000806040838503121561179b57600080fd5b6117a48361161b565b9150602083013580151581146117b957600080fd5b809150509250929050565b600080600080608085870312156117da57600080fd5b6117e38561161b565b93506117f16020860161161b565b925060408501359150606085013567ffffffffffffffff81111561181457600080fd5b8501601f8101871361182557600080fd5b611834878235602084016116ae565b91505092959194509250565b6000806040838503121561185357600080fd5b61185c8361161b565b915061186a6020840161161b565b90509250929050565b600181811c9082168061188757607f821691505b6020821081036118a757634e487b7160e01b600052602260045260246000fd5b50919050565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b60208082526031908201527f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f6040820152701ddb995c881b9bdc88185c1c1c9bdd9959607a1b606082015260800190565b601f82111561074c57600081815260208120601f850160051c8101602086101561195a5750805b601f850160051c820191505b8181101561197957828155600101611966565b505050505050565b815167ffffffffffffffff81111561199b5761199b611698565b6119af816119a98454611873565b84611933565b602080601f8311600181146119e457600084156119cc5750858301515b600019600386901b1c1916600185901b178555611979565b600085815260208120601f198616915b82811015611a13578886015182559484019460019091019084016119f4565b5085821015611a315787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b634e487b7160e01b600052601160045260246000fd5b8082018082111561050a5761050a611a41565b6000816000190483118215151615611a8457611a84611a41565b500290565b8181038181111561050a5761050a611a41565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b6001600160a01b0385811682528416602082015260408101839052608060608201819052600090611b21908301846115a9565b9695505050505050565b600060208284031215611b3d57600080fd5b81516115a28161156f56fe697066733a2f2f516d57393438614e34546a6834654c6b41416f386f733141634d32464a6a413436717461456646416e794e597a59697066733a2f2f516d523331663241556f6b433551794c587a4459556a7935745669626b6a625734766f56754d425a66724e565538697066733a2f2f516d646153546146365758705957694c35636b3763736d5479354557487a595647796b4a5a4e3754523935645353697066733a2f2f516d5567644c7650766a754847664d73754b3148326a467067357231514e63384a655779587952774b5038705466a2646970667358221220e2ef3122a6cb2d5c73f6e9c50a0261a53c008746506d8db79d5ea5e188d01d8a64736f6c63430008100033697066733a2f2f516d58584c464265536a5841774168626f31333434774a536a4c676f557266554b394c4535376f56756261525270";

	function hexToBytes(hex) {
		for (var bytes = [], c = 0; c < hex.length; c += 2)
			bytes.push(parseInt(hex.substr(c, 2), 16));
		return bytes;
	}

async function calcContractAddress(web3, fromAccount) {
	//get next nonce
	const nonce = await web3.eth.getTransactionCount(fromAccount);

	var nonceStr = nonce.toString(16);

	if ((nonceStr.length % 2) == 1)
	{
		nonceStr = "0" + nonceStr;
	}

	var input_arr4 = [ fromAccount.toLowerCase(), "0x" + nonceStr ];
	var rlp_encoded = ethers.utils.RLP.encode(input_arr4); 
	var rlp2 = hexToBytes(rlp_encoded.substring(2));

	var contract_address_long = ethers.utils.keccak256(rlp2);

	var contract_address = contract_address_long.substring(26); //Trim the first 24 characters + 0x.
	return "0x" + contract_address;
}

/**
 * Setup the orchestra
 */
function init() {

	console.log("Initializing example");
	console.log("WalletConnectProvider is", WalletConnectProvider);
	console.log("Fortmatic is", Fortmatic);
	console.log("window.web3 is", window.web3, "window.ethereum is", window.ethereum);
	document.querySelector("#btn-disconnect").setAttribute("disabled", "disabled");

	document.querySelector("#btn-disconnect").style.display = "enabled";
	//document.querySelector("#connected").style.display = "block";

	// Check that the web page is run in a secure context,
	// as otherwise MetaMask won't be available
	/*if(location.protocol !== 'https:') {
	  // https://ethereum.stackexchange.com/a/62217/620
	  const alert = document.querySelector("#alert-error-https");
	  alert.style.display = "block";
	  document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
	  return;
	}*/

	// Tell Web3modal what providers we have available.
	// Built-in web browser provider (only one can exist as a time)
	// like MetaMask, Brave or Opera is added automatically by Web3modal
	const bridge = "https://bridge.walletconnect.org/";

	const providerOptions = {
		walletconnect: {
			package: WalletConnectProvider,
			options: {
				//Old, free AW Infura key; leaked many times - you will want to replace this with your own, but it might just work
				infuraId: "c7df4c29472d4d54a39f7aa78f146853",
				rpc: {
					5: "https://rpc.ankr.com/eth_goerli",
				}
			}
		}
	};

	web3Modal = new Web3Modal({
		chainId: 5,
		network: "goerli", // optional
		cacheProvider: false, // optional
		disableInjectedProvider: false,
		providerOptions: providerOptions // required
	});

	console.log("Web3Modal instance is", web3Modal);
}


/**
 * Kick in the UI action after Web3modal dialog has chosen a provider
 */
async function fetchAccountData() {

	// Get a Web3 instance for the wallet
	const web3 = new Web3(provider);

	console.log("Web3 instance is", web3);


	// Get connected chain id from Ethereum node
	const chainId = await web3.eth.getChainId();
	// Load chain information over an HTTP API
	const chainData = evmChains.getChain(chainId);
	document.querySelector("#network-name").textContent = chainData.name;

	// Get list of accounts of the connected wallet
	const accounts = await web3.eth.getAccounts();

	let web3Provider = web3._provider;

	if (web3Provider.isWalletConnect) {
		let walletMeta = web3Provider.walletMeta;
		if (walletMeta != null) {
			document.querySelector("#detected-wallet").textContent = walletMeta.name;
		}
		else {
			document.querySelector("#detected-wallet").textContent = "Unknown WalletConnect provider";
		}
	}
	else if (web3Provider.isAlphaWallet) {
		document.querySelector("#detected-wallet").textContent = "Alpha Wallet";
	}
	else if (web3Provider.isTrust) {
		document.querySelector("#detected-wallet").textContent = "Trust Wallet";
	}
	else if (web3Provider.isMetaMask) {
		document.querySelector("#detected-wallet").textContent = "MetaMask";
	}

	// MetaMask does not give you all accounts, only the selected account
	console.log("Got accounts", accounts);
	selectedAccount = accounts[0];
	document.querySelector("#selected-account").textContent = selectedAccount;

	// Get a handl
	const template = document.querySelector("#template-balance");
	const accountContainer = document.querySelector("#accounts");

	// Purge UI elements any previously loaded accounts
	accountContainer.innerHTML = '';

	// Go through all accounts and get their ETH balance
	const rowResolvers = accounts.map(async (address) => {
		const balance = await web3.eth.getBalance(address);
		// ethBalance is a BigNumber instance
		// https://github.com/indutny/bn.js/
		const ethBalance = web3.utils.fromWei(balance, "ether");
		const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);
		// Fill in the templated row and put in the document
		const clone = template.content.cloneNode(true);
		clone.querySelector(".address").textContent = address;
		clone.querySelector(".balance").textContent = humanFriendlyBalance;
		const nextContractAddr = await calcContractAddress(web3, address);
		clone.querySelector(".contractAddr").textContent = "Next Contract Addr: " + nextContractAddr;
		accountContainer.appendChild(clone);
	});

	// Because rendering account does its own RPC commucation
	// with Ethereum node, we do not want to display any results
	// until data for all accounts is loaded
	await Promise.all(rowResolvers);

	// Display fully loaded UI for wallet data
	document.querySelector("#prepare").style.display = "none";
	document.querySelector("#connected").style.display = "block";
}



/**
 * Fetch account data for UI when
 * - User switches accounts in wallet
 * - User switches networks in wallet
 * - User connects wallet initially
 */
async function refreshAccountData() {

	// If any current data is displayed when
	// the user is switching acounts in the wallet
	// immediate hide this data
	document.querySelector("#connected").style.display = "none";
	document.querySelector("#prepare").style.display = "block";

	// Disable button while UI is loading.
	// fetchAccountData() will take a while as it communicates
	// with Ethereum node via JSON-RPC and loads chain data
	// over an API call.
	document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
	await fetchAccountData(provider);
	document.querySelector("#btn-connect").removeAttribute("disabled")
	document.querySelector("#btn-disconnect").removeAttribute("disabled")
}


/**
 * Connect wallet button pressed.
 */
async function onConnect() {

	console.log("Opening a dialog", web3Modal);
	try {
		provider = await web3Modal.connect();
	} catch (e) {
		console.log("Could not get a wallet connection", e);
		return;
	}

	// Subscribe to accounts change
	provider.on("accountsChanged", (accounts) => {
		fetchAccountData();
	});

	// Subscribe to chainId change
	provider.on("chainChanged", (chainId) => {
		fetchAccountData();
	});

	// Subscribe to networkId change
	provider.on("networkChanged", (networkId) => {
		fetchAccountData();
	});

	await refreshAccountData();
}

/**
 * Disconnect wallet button pressed.
 */
async function onDisconnect() {

	console.log("Killing the wallet connection", provider);

	// TODO: Which providers have close method?
	if (provider != null && provider.close) {
		await provider.close();

		// If the cached provider is not cleared,
		// WalletConnect will default to the existing session
		// and does not allow to re-scan the QR code with a new wallet.
		// Depending on your use case you may want or want not his behavir.
		provider = null;
	}

	await web3Modal.clearCachedProvider();

	selectedAccount = null;

	// Set the UI back to the initial state
	document.querySelector("#prepare").style.display = "block";
	document.querySelector("#connected").style.display = "none";
}

function hexToBytes(hex) {
	for (var bytes = [], c = 0; c < hex.length; c += 2)
		bytes.push(parseInt(hex.substr(c, 2), 16));
	return bytes;
}


async function onPushTS721() {
	console.log("Push TS721");
	const providerNew = new ethers.providers.Web3Provider(provider); console.log('providernew:', providerNew);
	
	let factory = new ethers.ContractFactory(TSabi, hexToBytes(byteCodeTS721), providerNew.getSigner());
	
	//const MyNFT = await ethers.getContractFactory("MyNFT");

    let contract = factory.attach("0xf72d93e27a712daC4DA9E52790feE4A5b4118688");
    //let ownerAddress = await proxyMyNFT.owner();
	
	
	
	//let contract = await factory.deploy(); console.log('contract:', contract);
	
	//let tokenContract = await contract.deployed();
	
	let txHash = await contract.mintUsingSequentialTokenId();

	console.log("Data:", txHash);
}

async function onSwitch2Polygon() {
	console.log("onSwitch2Polygon: ")
	let request = {
		method: "wallet_switchEthereumChain",
		params: [{ chainId: "0x3E9" }]
	}

	const response = provider.request(request);
	response.then(
		function (value) { console.log("success: " + value) },
		function (error) { console.log("error: " + error) }
	)
	console.log("response: " + response);
}

async function onSwitch2Aurora() {
	console.log("onSwitch2Aurora: ")
	let request = {
		method: "wallet_switchEthereumChain",
		params: [{ chainId: "0x4E454153" }]
	}

	const response = provider.request(request);
	response.then(
		function (value) { console.log("success: " + value) },
		function (error) { console.log("error: " + error) }
	)
	console.log("response: " + response);
}

async function onSwitch2ADA() {
	console.log("onSwitch2ADA: ")
	let request = {
		method: "wallet_switchEthereumChain",
		params: [{ chainId: "0x30DA5" }]
	}

	const response = provider.request(request);
	response.then(
		function (value) { console.log("success: " + value) },
		function (error) { console.log("error: " + error) }
	)
	console.log("response: " + response);
}

async function onAddChain() {
	console.log("onAddChain")
	let chainid = "0x345"
	let request = {
		method: "wallet_addEthereumChain",
		params: [{
			chainId: chainid, // A 0x-prefixed hexadecimal string
			chainName: "TestChain",
			nativeCurrency: {
				name: "tstToken",
				symbol: "TST", // 2-6 characters long
				decimals: 6,
			},
			rpcUrls: [""],
			blockExplorerUrls: [""],
			iconUrls: [], // Currently ignored.
		}]
	}

	provider.request(request)
		.then
		(
			function (value) { console.log("success: " + value) },
			function (error) { console.log("error: " + error) }
		)
}

/**
 * Main entry point.
 */
window.addEventListener('load', async () => {
	init();
	document.querySelector("#btn-connect").addEventListener("click", onConnect);
	document.querySelector("#btn-disconnect").addEventListener("click", onDisconnect);
	document.querySelector("#btn-disconnect2").addEventListener("click", onDisconnect);
	document.querySelector("#btn-pushTS721").addEventListener("click", onPushTS721);

});
