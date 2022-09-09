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

	const bytecodePunks = "60806040523480156200001157600080fd5b506040805180820190915260148082527f4d6573736167652057726974657220546f6b656e0000000000000000000000006020909201918252620000589160019162000131565b50604080518082019091526003808252624d534760e81b6020909201918252620000859160029162000131565b50600080546001600160a01b0319163390811782558152600560205260409020600a905560015b600a81116200012557600080548282526004602052604080832080546001600160a01b0319166001600160a01b0393841617905582549051849391909216917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a4806200011c81620001d7565b915050620000ac565b50600b6003556200023e565b8280546200013f9062000201565b90600052602060002090601f016020900481019282620001635760008555620001ae565b82601f106200017e57805160ff1916838001178555620001ae565b82800160010185558215620001ae579182015b82811115620001ae57825182559160200191906001019062000191565b50620001bc929150620001c0565b5090565b5b80821115620001bc5760008155600101620001c1565b6000600019821415620001fa57634e487b7160e01b600052601160045260246000fd5b5060010190565b600181811c908216806200021657607f821691505b602082108114156200023857634e487b7160e01b600052602260045260246000fd5b50919050565b6117d1806200024e6000396000f3fe6080604052600436106100f35760003560e01c806370a082311161008a578063b88d4fde11610059578063b88d4fde146102a1578063bb6e7de9146102c1578063c87b56dd146102c9578063e985e9c5146102e957600080fd5b806370a082311461022957806395d89b4114610257578063985e49f41461026c578063a22cb4651461028157600080fd5b806323b872dd116100c657806323b872dd146101a957806342842e0e146101c957806342966c68146101e95780636352211e1461020957600080fd5b806301ffc9a7146100f857806306fdde031461012d578063081812fc1461014f578063095ea7b314610187575b600080fd5b34801561010457600080fd5b5061011861011336600461122b565b610332565b60405190151581526020015b60405180910390f35b34801561013957600080fd5b50610142610384565b60405161012491906112a7565b34801561015b57600080fd5b5061016f61016a3660046112ba565b610416565b6040516001600160a01b039091168152602001610124565b34801561019357600080fd5b506101a76101a23660046112ef565b6104bd565b005b3480156101b557600080fd5b506101a76101c4366004611319565b6105ee565b3480156101d557600080fd5b506101a76101e4366004611319565b610620565b3480156101f557600080fd5b506101a76102043660046112ba565b61063b565b34801561021557600080fd5b5061016f6102243660046112ba565b61072f565b34801561023557600080fd5b50610249610244366004611355565b6107b3565b604051908152602001610124565b34801561026357600080fd5b5061014261084d565b34801561027857600080fd5b5061024961085c565b34801561028d57600080fd5b506101a761029c366004611370565b6108f5565b3480156102ad57600080fd5b506101a76102bc3660046113c2565b6109c9565b6101a7610a01565b3480156102d557600080fd5b506101426102e43660046112ba565b610a22565b3480156102f557600080fd5b5061011861030436600461149e565b6001600160a01b03918216600090815260076020908152604080832093909416825291909152205460ff1690565b60006001600160e01b031982166301ffc9a760e01b148061036357506001600160e01b03198216635b5e139f60e01b145b8061037e57506001600160e01b031982166380ac58cd60e01b145b92915050565b606060018054610393906114d1565b80601f01602080910402602001604051908101604052809291908181526020018280546103bf906114d1565b801561040c5780601f106103e15761010080835404028352916020019161040c565b820191906000526020600020905b8154815290600101906020018083116103ef57829003601f168201915b5050505050905090565b6000818152600460205260408120546001600160a01b03166104a15760405162461bcd60e51b815260206004820152603960248201527f4174746573746174696f6e4d696e7461626c653a20617070726f76656420717560448201527832b93c903337b9103737b732bc34b9ba32b73a103a37b5b2b760391b60648201526084015b60405180910390fd5b506000908152600660205260409020546001600160a01b031690565b60006104c88261072f565b9050806001600160a01b0316836001600160a01b031614156105435760405162461bcd60e51b815260206004820152602e60248201527f4174746573746174696f6e4d696e7461626c653a20617070726f76616c20746f60448201526d1031bab93932b73a1037bbb732b960911b6064820152608401610498565b336001600160a01b038216148061055f575061055f8133610304565b6105df5760405162461bcd60e51b815260206004820152604560248201527f4174746573746174696f6e4d696e7461626c653a20617070726f76652063616c60448201527f6c6572206973206e6f74206f776e6572206e6f7220617070726f76656420666f6064820152641c88185b1b60da1b608482015260a401610498565b6105e98383610aa2565b505050565b6105f9335b82610b10565b6106155760405162461bcd60e51b81526004016104989061150c565b6105e9838383610c14565b6105e9838383604051806020016040528060008152506109c9565b6000818152600460205260409020546001600160a01b031661066f5760405162461bcd60e51b815260040161049890611569565b610678336105f3565b6106ea5760405162461bcd60e51b815260206004820152603a60248201527f4174746573746174696f6e4d696e7461626c653a204275726e2063616c6c657260448201527f206973206e6f74206f776e6572206e6f7220617070726f7665640000000000006064820152608401610498565b6106f381610dcf565b60408051338152602081018390527fcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca5910160405180910390a150565b6000818152600460205260408120546001600160a01b03168061037e5760405162461bcd60e51b815260206004820152603660248201527f4174746573746174696f6e4d696e7461626c653a206f776e6572207175657279604482015275103337b9103737b732bc34b9ba32b73a103a37b5b2b760511b6064820152608401610498565b60006001600160a01b0382166108315760405162461bcd60e51b815260206004820152603760248201527f4174746573746174696f6e4d696e7461626c653a2062616c616e63652071756560448201527f727920666f7220746865207a65726f20616464726573730000000000000000006064820152608401610498565b506001600160a01b031660009081526005602052604090205490565b606060028054610393906114d1565b600080546001600160a01b031633148061088457503360009081526005602052604090205415155b6108d05760405162461bcd60e51b815260206004820152601b60248201527f4e65656420746f206f776e206120746f6b656e20746f206d696e7400000000006044820152606401610498565b506003805490819060006108e3836115d3565b91905055506108f23382610e6a565b90565b6001600160a01b03821633141561095d5760405162461bcd60e51b815260206004820152602660248201527f4174746573746174696f6e4d696e7461626c653a20617070726f766520746f2060448201526531b0b63632b960d11b6064820152608401610498565b3360008181526007602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b6109d33383610b10565b6109ef5760405162461bcd60e51b81526004016104989061150c565b6109fb84848484610fd4565b50505050565b6000546001600160a01b03163314156100f3576000546001600160a01b0316ff5b6000818152600460205260409020546060906001600160a01b0316610a595760405162461bcd60e51b815260040161049890611569565b60405180608001604052806044815260200161175860449139610a7b83611007565b604051602001610a8c9291906115ee565b6040516020818303038152906040529050919050565b600081815260066020526040902080546001600160a01b0319166001600160a01b0384169081179091558190610ad78261072f565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6000818152600460205260408120546001600160a01b0316610b965760405162461bcd60e51b815260206004820152603960248201527f4174746573746174696f6e4d696e7461626c653a206f70657261746f7220717560448201527832b93c903337b9103737b732bc34b9ba32b73a103a37b5b2b760391b6064820152608401610498565b6000610ba18361072f565b9050806001600160a01b0316846001600160a01b03161480610bdc5750836001600160a01b0316610bd184610416565b6001600160a01b0316145b80610c0c57506001600160a01b0380821660009081526007602090815260408083209388168352929052205460ff165b949350505050565b826001600160a01b0316610c278261072f565b6001600160a01b031614610c9c5760405162461bcd60e51b815260206004820152603660248201527f4174746573746174696f6e4d696e7461626c653a207472616e73666572206f66604482015275103a37b5b2b7103a3430ba1034b9903737ba1037bbb760511b6064820152608401610498565b6001600160a01b038216610d0c5760405162461bcd60e51b815260206004820152603160248201527f4174746573746174696f6e4d696e7461626c653a207472616e7366657220746f60448201527020746865207a65726f206164647265737360781b6064820152608401610498565b610d17600082610aa2565b6001600160a01b0383166000908152600560205260408120805460019290610d4090849061161d565b90915550506001600160a01b0382166000908152600560205260408120805460019290610d6e908490611634565b909155505060008181526004602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b6000610dda8261072f565b9050610de7600083610aa2565b6001600160a01b0381166000908152600560205260408120805460019290610e1090849061161d565b909155505060008281526004602052604080822080546001600160a01b0319169055518391906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b6001600160a01b038216610ed65760405162461bcd60e51b815260206004820152602d60248201527f4174746573746174696f6e4d696e7461626c653a206d696e7420746f2074686560448201526c207a65726f206164647265737360981b6064820152608401610498565b6000818152600460205260409020546001600160a01b031615610f4d5760405162461bcd60e51b815260206004820152602960248201527f4174746573746174696f6e4d696e7461626c653a20746f6b656e20616c726561604482015268191e481b5a5b9d195960ba1b6064820152608401610498565b6001600160a01b0382166000908152600560205260408120805460019290610f76908490611634565b909155505060008181526004602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b610fdf848484610c14565b610feb84848484611105565b6109fb5760405162461bcd60e51b81526004016104989061164c565b60608161102b5750506040805180820190915260018152600360fc1b602082015290565b8160005b8115611055578061103f816115d3565b915061104e9050600a836116bf565b915061102f565b60008167ffffffffffffffff811115611070576110706113ac565b6040519080825280601f01601f19166020018201604052801561109a576020820181803683370190505b5090505b8415610c0c576110af60018361161d565b91506110bc600a866116d3565b6110c7906030611634565b60f81b8183815181106110dc576110dc6116e7565b60200101906001600160f81b031916908160001a9053506110fe600a866116bf565b945061109e565b60006001600160a01b0384163b1561120757604051630a85bd0160e11b81526001600160a01b0385169063150b7a02906111499033908990889088906004016116fd565b602060405180830381600087803b15801561116357600080fd5b505af1925050508015611193575060408051601f3d908101601f191682019092526111909181019061173a565b60015b6111ed573d8080156111c1576040519150601f19603f3d011682016040523d82523d6000602084013e6111c6565b606091505b5080516111e55760405162461bcd60e51b81526004016104989061164c565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050610c0c565b506001949350505050565b6001600160e01b03198116811461122857600080fd5b50565b60006020828403121561123d57600080fd5b813561124881611212565b9392505050565b60005b8381101561126a578181015183820152602001611252565b838111156109fb5750506000910152565b6000815180845261129381602086016020860161124f565b601f01601f19169290920160200192915050565b602081526000611248602083018461127b565b6000602082840312156112cc57600080fd5b5035919050565b80356001600160a01b03811681146112ea57600080fd5b919050565b6000806040838503121561130257600080fd5b61130b836112d3565b946020939093013593505050565b60008060006060848603121561132e57600080fd5b611337846112d3565b9250611345602085016112d3565b9150604084013590509250925092565b60006020828403121561136757600080fd5b611248826112d3565b6000806040838503121561138357600080fd5b61138c836112d3565b9150602083013580151581146113a157600080fd5b809150509250929050565b634e487b7160e01b600052604160045260246000fd5b600080600080608085870312156113d857600080fd5b6113e1856112d3565b93506113ef602086016112d3565b925060408501359150606085013567ffffffffffffffff8082111561141357600080fd5b818701915087601f83011261142757600080fd5b813581811115611439576114396113ac565b604051601f8201601f19908116603f01168101908382118183101715611461576114616113ac565b816040528281528a602084870101111561147a57600080fd5b82602086016020830137600060208483010152809550505050505092959194509250565b600080604083850312156114b157600080fd5b6114ba836112d3565b91506114c8602084016112d3565b90509250929050565b600181811c908216806114e557607f821691505b6020821081141561150657634e487b7160e01b600052602260045260246000fd5b50919050565b6020808252603e908201527f4174746573746174696f6e4d696e7461626c653a207472616e7366657220636160408201527f6c6c6572206973206e6f74206f776e6572206e6f7220617070726f7665640000606082015260800190565b60208082526034908201527f4174746573746174696f6e4d696e7461626c653a20555249207175657279206660408201527337b9103737b732bc34b9ba32b73a103a37b5b2b760611b606082015260800190565b634e487b7160e01b600052601160045260246000fd5b60006000198214156115e7576115e76115bd565b5060010190565b6000835161160081846020880161124f565b83519083019061161481836020880161124f565b01949350505050565b60008282101561162f5761162f6115bd565b500390565b60008219821115611647576116476115bd565b500190565b6020808252603f908201527f4174746573746174696f6e4d696e7461626c653a207472616e7366657220746f60408201527f206e6f6e20455243373231526563656976657220696d706c656d656e74657200606082015260800190565b634e487b7160e01b600052601260045260246000fd5b6000826116ce576116ce6116a9565b500490565b6000826116e2576116e26116a9565b500690565b634e487b7160e01b600052603260045260246000fd5b6001600160a01b03858116825284166020820152604081018390526080606082018190526000906117309083018461127b565b9695505050505050565b60006020828403121561174c57600080fd5b81516112488161121256fe68747470733a2f2f697066732e696f2f697066732f516d65536a53696e4870506e6d586d73704d6a776958794e367a533445397a63636172694752336a7863615774712fa2646970667358221220ac54eab8ddc9ed0309ee5e22a8386ea3123058adf2c0b4557cc148888b94030d64736f6c63430008090033"

	const bytecodeMeks = "60806040523480156200001157600080fd5b506040805180820190915260148082527f4d6573736167652057726974657220546f6b656e0000000000000000000000006020909201918252620000589160019162000131565b50604080518082019091526003808252624d534760e81b6020909201918252620000859160029162000131565b50600080546001600160a01b0319163390811782558152600560205260409020600a905560015b600a81116200012557600080548282526004602052604080832080546001600160a01b0319166001600160a01b0393841617905582549051849391909216917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a4806200011c81620001d7565b915050620000ac565b50600b6003556200023e565b8280546200013f9062000201565b90600052602060002090601f016020900481019282620001635760008555620001ae565b82601f106200017e57805160ff1916838001178555620001ae565b82800160010185558215620001ae579182015b82811115620001ae57825182559160200191906001019062000191565b50620001bc929150620001c0565b5090565b5b80821115620001bc5760008155600101620001c1565b6000600019821415620001fa57634e487b7160e01b600052601160045260246000fd5b5060010190565b600181811c908216806200021657607f821691505b602082108114156200023857634e487b7160e01b600052602260045260246000fd5b50919050565b6117d6806200024e6000396000f3fe6080604052600436106100f35760003560e01c806370a082311161008a578063b88d4fde11610059578063b88d4fde146102a1578063bb6e7de9146102c1578063c87b56dd146102c9578063e985e9c5146102e957600080fd5b806370a082311461022957806395d89b4114610257578063985e49f41461026c578063a22cb4651461028157600080fd5b806323b872dd116100c657806323b872dd146101a957806342842e0e146101c957806342966c68146101e95780636352211e1461020957600080fd5b806301ffc9a7146100f857806306fdde031461012d578063081812fc1461014f578063095ea7b314610187575b600080fd5b34801561010457600080fd5b5061011861011336600461122b565b610332565b60405190151581526020015b60405180910390f35b34801561013957600080fd5b50610142610384565b60405161012491906112a7565b34801561015b57600080fd5b5061016f61016a3660046112ba565b610416565b6040516001600160a01b039091168152602001610124565b34801561019357600080fd5b506101a76101a23660046112ef565b6104bd565b005b3480156101b557600080fd5b506101a76101c4366004611319565b6105ee565b3480156101d557600080fd5b506101a76101e4366004611319565b610620565b3480156101f557600080fd5b506101a76102043660046112ba565b61063b565b34801561021557600080fd5b5061016f6102243660046112ba565b61072f565b34801561023557600080fd5b50610249610244366004611355565b6107b3565b604051908152602001610124565b34801561026357600080fd5b5061014261084d565b34801561027857600080fd5b5061024961085c565b34801561028d57600080fd5b506101a761029c366004611370565b6108f5565b3480156102ad57600080fd5b506101a76102bc3660046113c2565b6109c9565b6101a7610a01565b3480156102d557600080fd5b506101426102e43660046112ba565b610a22565b3480156102f557600080fd5b5061011861030436600461149e565b6001600160a01b03918216600090815260076020908152604080832093909416825291909152205460ff1690565b60006001600160e01b031982166301ffc9a760e01b148061036357506001600160e01b03198216635b5e139f60e01b145b8061037e57506001600160e01b031982166380ac58cd60e01b145b92915050565b606060018054610393906114d1565b80601f01602080910402602001604051908101604052809291908181526020018280546103bf906114d1565b801561040c5780601f106103e15761010080835404028352916020019161040c565b820191906000526020600020905b8154815290600101906020018083116103ef57829003601f168201915b5050505050905090565b6000818152600460205260408120546001600160a01b03166104a15760405162461bcd60e51b815260206004820152603960248201527f4174746573746174696f6e4d696e7461626c653a20617070726f76656420717560448201527832b93c903337b9103737b732bc34b9ba32b73a103a37b5b2b760391b60648201526084015b60405180910390fd5b506000908152600660205260409020546001600160a01b031690565b60006104c88261072f565b9050806001600160a01b0316836001600160a01b031614156105435760405162461bcd60e51b815260206004820152602e60248201527f4174746573746174696f6e4d696e7461626c653a20617070726f76616c20746f60448201526d1031bab93932b73a1037bbb732b960911b6064820152608401610498565b336001600160a01b038216148061055f575061055f8133610304565b6105df5760405162461bcd60e51b815260206004820152604560248201527f4174746573746174696f6e4d696e7461626c653a20617070726f76652063616c60448201527f6c6572206973206e6f74206f776e6572206e6f7220617070726f76656420666f6064820152641c88185b1b60da1b608482015260a401610498565b6105e98383610aa2565b505050565b6105f9335b82610b10565b6106155760405162461bcd60e51b81526004016104989061150c565b6105e9838383610c14565b6105e9838383604051806020016040528060008152506109c9565b6000818152600460205260409020546001600160a01b031661066f5760405162461bcd60e51b815260040161049890611569565b610678336105f3565b6106ea5760405162461bcd60e51b815260206004820152603a60248201527f4174746573746174696f6e4d696e7461626c653a204275726e2063616c6c657260448201527f206973206e6f74206f776e6572206e6f7220617070726f7665640000000000006064820152608401610498565b6106f381610dcf565b60408051338152602081018390527fcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca5910160405180910390a150565b6000818152600460205260408120546001600160a01b03168061037e5760405162461bcd60e51b815260206004820152603660248201527f4174746573746174696f6e4d696e7461626c653a206f776e6572207175657279604482015275103337b9103737b732bc34b9ba32b73a103a37b5b2b760511b6064820152608401610498565b60006001600160a01b0382166108315760405162461bcd60e51b815260206004820152603760248201527f4174746573746174696f6e4d696e7461626c653a2062616c616e63652071756560448201527f727920666f7220746865207a65726f20616464726573730000000000000000006064820152608401610498565b506001600160a01b031660009081526005602052604090205490565b606060028054610393906114d1565b600080546001600160a01b031633148061088457503360009081526005602052604090205415155b6108d05760405162461bcd60e51b815260206004820152601b60248201527f4e65656420746f206f776e206120746f6b656e20746f206d696e7400000000006044820152606401610498565b506003805490819060006108e3836115d3565b91905055506108f23382610e6a565b90565b6001600160a01b03821633141561095d5760405162461bcd60e51b815260206004820152602660248201527f4174746573746174696f6e4d696e7461626c653a20617070726f766520746f2060448201526531b0b63632b960d11b6064820152608401610498565b3360008181526007602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b6109d33383610b10565b6109ef5760405162461bcd60e51b81526004016104989061150c565b6109fb84848484610fd4565b50505050565b6000546001600160a01b03163314156100f3576000546001600160a01b0316ff5b6000818152600460205260409020546060906001600160a01b0316610a595760405162461bcd60e51b815260040161049890611569565b60405180608001604052806049815260200161175860499139610a7b83611007565b604051602001610a8c9291906115ee565b6040516020818303038152906040529050919050565b600081815260066020526040902080546001600160a01b0319166001600160a01b0384169081179091558190610ad78261072f565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6000818152600460205260408120546001600160a01b0316610b965760405162461bcd60e51b815260206004820152603960248201527f4174746573746174696f6e4d696e7461626c653a206f70657261746f7220717560448201527832b93c903337b9103737b732bc34b9ba32b73a103a37b5b2b760391b6064820152608401610498565b6000610ba18361072f565b9050806001600160a01b0316846001600160a01b03161480610bdc5750836001600160a01b0316610bd184610416565b6001600160a01b0316145b80610c0c57506001600160a01b0380821660009081526007602090815260408083209388168352929052205460ff165b949350505050565b826001600160a01b0316610c278261072f565b6001600160a01b031614610c9c5760405162461bcd60e51b815260206004820152603660248201527f4174746573746174696f6e4d696e7461626c653a207472616e73666572206f66604482015275103a37b5b2b7103a3430ba1034b9903737ba1037bbb760511b6064820152608401610498565b6001600160a01b038216610d0c5760405162461bcd60e51b815260206004820152603160248201527f4174746573746174696f6e4d696e7461626c653a207472616e7366657220746f60448201527020746865207a65726f206164647265737360781b6064820152608401610498565b610d17600082610aa2565b6001600160a01b0383166000908152600560205260408120805460019290610d4090849061161d565b90915550506001600160a01b0382166000908152600560205260408120805460019290610d6e908490611634565b909155505060008181526004602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b6000610dda8261072f565b9050610de7600083610aa2565b6001600160a01b0381166000908152600560205260408120805460019290610e1090849061161d565b909155505060008281526004602052604080822080546001600160a01b0319169055518391906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b6001600160a01b038216610ed65760405162461bcd60e51b815260206004820152602d60248201527f4174746573746174696f6e4d696e7461626c653a206d696e7420746f2074686560448201526c207a65726f206164647265737360981b6064820152608401610498565b6000818152600460205260409020546001600160a01b031615610f4d5760405162461bcd60e51b815260206004820152602960248201527f4174746573746174696f6e4d696e7461626c653a20746f6b656e20616c726561604482015268191e481b5a5b9d195960ba1b6064820152608401610498565b6001600160a01b0382166000908152600560205260408120805460019290610f76908490611634565b909155505060008181526004602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b610fdf848484610c14565b610feb84848484611105565b6109fb5760405162461bcd60e51b81526004016104989061164c565b60608161102b5750506040805180820190915260018152600360fc1b602082015290565b8160005b8115611055578061103f816115d3565b915061104e9050600a836116bf565b915061102f565b60008167ffffffffffffffff811115611070576110706113ac565b6040519080825280601f01601f19166020018201604052801561109a576020820181803683370190505b5090505b8415610c0c576110af60018361161d565b91506110bc600a866116d3565b6110c7906030611634565b60f81b8183815181106110dc576110dc6116e7565b60200101906001600160f81b031916908160001a9053506110fe600a866116bf565b945061109e565b60006001600160a01b0384163b1561120757604051630a85bd0160e11b81526001600160a01b0385169063150b7a02906111499033908990889088906004016116fd565b602060405180830381600087803b15801561116357600080fd5b505af1925050508015611193575060408051601f3d908101601f191682019092526111909181019061173a565b60015b6111ed573d8080156111c1576040519150601f19603f3d011682016040523d82523d6000602084013e6111c6565b606091505b5080516111e55760405162461bcd60e51b81526004016104989061164c565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050610c0c565b506001949350505050565b6001600160e01b03198116811461122857600080fd5b50565b60006020828403121561123d57600080fd5b813561124881611212565b9392505050565b60005b8381101561126a578181015183820152602001611252565b838111156109fb5750506000910152565b6000815180845261129381602086016020860161124f565b601f01601f19169290920160200192915050565b602081526000611248602083018461127b565b6000602082840312156112cc57600080fd5b5035919050565b80356001600160a01b03811681146112ea57600080fd5b919050565b6000806040838503121561130257600080fd5b61130b836112d3565b946020939093013593505050565b60008060006060848603121561132e57600080fd5b611337846112d3565b9250611345602085016112d3565b9150604084013590509250925092565b60006020828403121561136757600080fd5b611248826112d3565b6000806040838503121561138357600080fd5b61138c836112d3565b9150602083013580151581146113a157600080fd5b809150509250929050565b634e487b7160e01b600052604160045260246000fd5b600080600080608085870312156113d857600080fd5b6113e1856112d3565b93506113ef602086016112d3565b925060408501359150606085013567ffffffffffffffff8082111561141357600080fd5b818701915087601f83011261142757600080fd5b813581811115611439576114396113ac565b604051601f8201601f19908116603f01168101908382118183101715611461576114616113ac565b816040528281528a602084870101111561147a57600080fd5b82602086016020830137600060208483010152809550505050505092959194509250565b600080604083850312156114b157600080fd5b6114ba836112d3565b91506114c8602084016112d3565b90509250929050565b600181811c908216806114e557607f821691505b6020821081141561150657634e487b7160e01b600052602260045260246000fd5b50919050565b6020808252603e908201527f4174746573746174696f6e4d696e7461626c653a207472616e7366657220636160408201527f6c6c6572206973206e6f74206f776e6572206e6f7220617070726f7665640000606082015260800190565b60208082526034908201527f4174746573746174696f6e4d696e7461626c653a20555249207175657279206660408201527337b9103737b732bc34b9ba32b73a103a37b5b2b760611b606082015260800190565b634e487b7160e01b600052601160045260246000fd5b60006000198214156115e7576115e76115bd565b5060010190565b6000835161160081846020880161124f565b83519083019061161481836020880161124f565b01949350505050565b60008282101561162f5761162f6115bd565b500390565b60008219821115611647576116476115bd565b500190565b6020808252603f908201527f4174746573746174696f6e4d696e7461626c653a207472616e7366657220746f60408201527f206e6f6e20455243373231526563656976657220696d706c656d656e74657200606082015260800190565b634e487b7160e01b600052601260045260246000fd5b6000826116ce576116ce6116a9565b500490565b6000826116e2576116e26116a9565b500690565b634e487b7160e01b600052603260045260246000fd5b6001600160a01b03858116825284166020820152604081018390526080606082018190526000906117309083018461127b565b9695505050505050565b60006020828403121561174c57600080fd5b81516112488161121256fe68747470733a2f2f697066732e696f2f697066732f516d636f62314d61505458555a74354d7a744845677359687266375236473777563868706377654c386e456667552f6d656b612fa2646970667358221220e6771a37a6d43523033910d60cd77c64f528bef57ffb0375efed7082bac68f4b64736f6c63430008090033"

	const byteCodeDoor = 
	"60806040523480156200001157600080fd5b50604080518082018252600b81526a29aa26102428902237b7b960a91b6020808301918252835180850190945260068452654f464649434560d01b9084015281519192916200006391600091620003d8565b50805162000079906001906020840190620003d8565b50506040805160808101825273bc8dafeaca658ae0857c80d8aa6de4d487577c63815273fcabe3451ac8edfb8fb6b9274c2e095d9ccc8082602082015273c067a53c91258ba513059919e03b81cf93f57ac791810191909152336060820152620000e99150600690600462000463565b506200010160076200014360201b62000ccf1760201c565b60405180606001604052806035815260200162001fc26035913980516200013191600891602090910190620003d8565b506200013c6200014c565b5062000574565b80546001019055565b600080805b600654811015620001f85760006001600160a01b0316600682815481106200017d576200017d6200055e565b6000918252602090912001546001600160a01b031614801590620001d35750336001600160a01b031660068281548110620001bc57620001bc6200055e565b6000918252602090912001546001600160a01b0316145b15620001e35760019150620001f8565b80620001ef816200052a565b91505062000151565b50806200024c5760405162461bcd60e51b815260206004820152601f60248201527f4f776e61626c653a2063616c6c6572206973206e6f7420616e206f776e65720060448201526064015b60405180910390fd5b6200026360076200028c60201b62000cd81760201c565b915062000271338362000290565b6200028860076200014360201b62000ccf1760201c565b5090565b5490565b6001600160a01b038216620002e85760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f2061646472657373604482015260640162000243565b6000818152600260205260409020546001600160a01b0316156200034f5760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e74656400000000604482015260640162000243565b6001600160a01b03821660009081526003602052604081208054600192906200037a908490620004d2565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b828054620003e690620004ed565b90600052602060002090601f0160209004810192826200040a576000855562000455565b82601f106200042557805160ff191683800117855562000455565b8280016001018555821562000455579182015b828111156200045557825182559160200191906001019062000438565b5062000288929150620004bb565b82805482825590600052602060002090810192821562000455579160200282015b828111156200045557825182546001600160a01b0319166001600160a01b0390911617825560209092019160019091019062000484565b5b80821115620002885760008155600101620004bc565b60008219821115620004e857620004e862000548565b500190565b600181811c908216806200050257607f821691505b602082108114156200052457634e487b7160e01b600052602260045260246000fd5b50919050565b600060001982141562000541576200054162000548565b5060010190565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b611a3e80620005846000396000f3fe608060405234801561001057600080fd5b506004361061012c5760003560e01c80637b47ec1a116100ad578063affe39c111610071578063affe39c114610263578063b88d4fde14610278578063c87b56dd1461028b578063e8a3d4851461029e578063e985e9c5146102a657600080fd5b80637b47ec1a1461022357806384c4bd4b1461023657806395d89b4114610240578063985e49f414610248578063a22cb4651461025057600080fd5b806342842e0e116100f457806342842e0e146101c15780634bb30912146101d45780636352211e146101dc5780636f3bffd2146101ef57806370a082311461020257600080fd5b806301ffc9a71461013157806306fdde0314610159578063081812fc1461016e578063095ea7b31461019957806323b872dd146101ae575b600080fd5b61014461013f36600461165e565b6102e2565b60405190151581526020015b60405180910390f35b610161610334565b60405161015091906117d1565b61018161017c3660046116e1565b6103c6565b6040516001600160a01b039091168152602001610150565b6101ac6101a7366004611634565b610460565b005b6101ac6101bc366004611540565b610576565b6101ac6101cf366004611540565b610669565b610161610684565b6101816101ea3660046116e1565b610693565b6101ac6101fd366004611698565b61070a565b6102156102103660046114eb565b610815565b604051908152602001610150565b6101ac6102313660046116e1565b61089c565b6007546102159081565b6101616109c9565b6102156109d8565b6101ac61025e3660046115f8565b610ab6565b61026b610ac1565b6040516101509190611784565b6101ac61028636600461157c565b610b22565b6101616102993660046116e1565b610c17565b610161610caf565b6101446102b436600461150d565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b60006001600160e01b031982166380ac58cd60e01b148061031357506001600160e01b03198216635b5e139f60e01b145b8061032e57506301ffc9a760e01b6001600160e01b03198316145b92915050565b606060008054610343906118ed565b80601f016020809104026020016040519081016040528092919081815260200182805461036f906118ed565b80156103bc5780601f10610391576101008083540402835291602001916103bc565b820191906000526020600020905b81548152906001019060200180831161039f57829003601f168201915b5050505050905090565b6000818152600260205260408120546001600160a01b03166104445760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084015b60405180910390fd5b506000908152600460205260409020546001600160a01b031690565b600061046b82610693565b9050806001600160a01b0316836001600160a01b031614156104d95760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b606482015260840161043b565b336001600160a01b03821614806104f557506104f581336102b4565b6105675760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760448201527f6e6572206e6f7220617070726f76656420666f7220616c6c0000000000000000606482015260840161043b565b6105718383610cdc565b505050565b6000805b6006548110156106145760006001600160a01b0316600682815481106105a2576105a2611959565b6000918252602090912001546001600160a01b0316148015906105f45750336001600160a01b0316600682815481106105dd576105dd611959565b6000918252602090912001546001600160a01b0316145b156106025760019150610614565b8061060c81611928565b91505061057a565b50806106325760405162461bcd60e51b815260040161043b90611836565b61063c3383610d4a565b6106585760405162461bcd60e51b815260040161043b9061186d565b610663848484610e41565b50505050565b61057183838360405180602001604052806000815250610b22565b606060088054610343906118ed565b6000818152600260205260408120546001600160a01b03168061032e5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b606482015260840161043b565b6000805b6006548110156107a85760006001600160a01b03166006828154811061073657610736611959565b6000918252602090912001546001600160a01b0316148015906107885750336001600160a01b03166006828154811061077157610771611959565b6000918252602090912001546001600160a01b0316145b1561079657600191506107a8565b806107a081611928565b91505061070e565b50806107c65760405162461bcd60e51b815260040161043b90611836565b81516107d99060089060208501906113c9565b507fd6666840ba3b0939cf78131cb173315c425a3385a30b8921494500ca2b49f34a8260405161080991906117d1565b60405180910390a15050565b60006001600160a01b0382166108805760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b606482015260840161043b565b506001600160a01b031660009081526003602052604090205490565b6000805b60065481101561093a5760006001600160a01b0316600682815481106108c8576108c8611959565b6000918252602090912001546001600160a01b03161480159061091a5750336001600160a01b03166006828154811061090357610903611959565b6000918252602090912001546001600160a01b0316145b15610928576001915061093a565b8061093281611928565b9150506108a0565b50806109585760405162461bcd60e51b815260040161043b90611836565b6000828152600260205260409020546001600160a01b03166109bc5760405162461bcd60e51b815260206004820152601760248201527f6275726e3a206e6f6e6578697374656e7420746f6b656e000000000000000000604482015260640161043b565b6109c582610fdd565b5050565b606060018054610343906118ed565b600080805b600654811015610a775760006001600160a01b031660068281548110610a0557610a05611959565b6000918252602090912001546001600160a01b031614801590610a575750336001600160a01b031660068281548110610a4057610a40611959565b6000918252602090912001546001600160a01b0316145b15610a655760019150610a77565b80610a6f81611928565b9150506109dd565b5080610a955760405162461bcd60e51b815260040161043b90611836565b6007549150610aa43383611078565b610ab2600780546001019055565b5090565b6109c53383836111ba565b606060068054806020026020016040519081016040528092919081815260200182805480156103bc57602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311610afb575050505050905090565b6000805b600654811015610bc05760006001600160a01b031660068281548110610b4e57610b4e611959565b6000918252602090912001546001600160a01b031614801590610ba05750336001600160a01b031660068281548110610b8957610b89611959565b6000918252602090912001546001600160a01b0316145b15610bae5760019150610bc0565b80610bb881611928565b915050610b26565b5080610bde5760405162461bcd60e51b815260040161043b90611836565b610be83384610d4a565b610c045760405162461bcd60e51b815260040161043b9061186d565b610c1085858585611289565b5050505050565b6000818152600260205260409020546060906001600160a01b0316610c905760405162461bcd60e51b815260206004820152602960248201527f746f6b656e5552493a2055524920717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b606482015260840161043b565b60405180606001604052806035815260200161199f6035913992915050565b60606040518060600160405280603581526020016119d460359139905090565b80546001019055565b5490565b600081815260046020526040902080546001600160a01b0319166001600160a01b0384169081179091558190610d1182610693565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6000818152600260205260408120546001600160a01b0316610dc35760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b606482015260840161043b565b6000610dce83610693565b9050806001600160a01b0316846001600160a01b03161480610e095750836001600160a01b0316610dfe846103c6565b6001600160a01b0316145b80610e3957506001600160a01b0380821660009081526005602090815260408083209388168352929052205460ff165b949350505050565b826001600160a01b0316610e5482610693565b6001600160a01b031614610eb85760405162461bcd60e51b815260206004820152602560248201527f4552433732313a207472616e736665722066726f6d20696e636f72726563742060448201526437bbb732b960d91b606482015260840161043b565b6001600160a01b038216610f1a5760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b606482015260840161043b565b610f25600082610cdc565b6001600160a01b0383166000908152600360205260408120805460019290610f4e9084906118d6565b90915550506001600160a01b0382166000908152600360205260408120805460019290610f7c9084906118be565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b6000610fe882610693565b9050610ff5600083610cdc565b6001600160a01b038116600090815260036020526040812080546001929061101e9084906118d6565b909155505060008281526002602052604080822080546001600160a01b0319169055518391906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b6001600160a01b0382166110ce5760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f2061646472657373604482015260640161043b565b6000818152600260205260409020546001600160a01b0316156111335760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e74656400000000604482015260640161043b565b6001600160a01b038216600090815260036020526040812080546001929061115c9084906118be565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b816001600160a01b0316836001600160a01b0316141561121c5760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c657200000000000000604482015260640161043b565b6001600160a01b03838116600081815260056020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b611294848484610e41565b6112a0848484846112bc565b6106635760405162461bcd60e51b815260040161043b906117e4565b60006001600160a01b0384163b156113be57604051630a85bd0160e11b81526001600160a01b0385169063150b7a0290611300903390899088908890600401611747565b602060405180830381600087803b15801561131a57600080fd5b505af192505050801561134a575060408051601f3d908101601f191682019092526113479181019061167b565b60015b6113a4573d808015611378576040519150601f19603f3d011682016040523d82523d6000602084013e61137d565b606091505b50805161139c5760405162461bcd60e51b815260040161043b906117e4565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050610e39565b506001949350505050565b8280546113d5906118ed565b90600052602060002090601f0160209004810192826113f7576000855561143d565b82601f1061141057805160ff191683800117855561143d565b8280016001018555821561143d579182015b8281111561143d578251825591602001919060010190611422565b50610ab29291505b80821115610ab25760008155600101611445565b600067ffffffffffffffff808411156114745761147461196f565b604051601f8501601f19908116603f0116810190828211818310171561149c5761149c61196f565b816040528093508581528686860111156114b557600080fd5b858560208301376000602087830101525050509392505050565b80356001600160a01b03811681146114e657600080fd5b919050565b6000602082840312156114fd57600080fd5b611506826114cf565b9392505050565b6000806040838503121561152057600080fd5b611529836114cf565b9150611537602084016114cf565b90509250929050565b60008060006060848603121561155557600080fd5b61155e846114cf565b925061156c602085016114cf565b9150604084013590509250925092565b6000806000806080858703121561159257600080fd5b61159b856114cf565b93506115a9602086016114cf565b925060408501359150606085013567ffffffffffffffff8111156115cc57600080fd5b8501601f810187136115dd57600080fd5b6115ec87823560208401611459565b91505092959194509250565b6000806040838503121561160b57600080fd5b611614836114cf565b91506020830135801515811461162957600080fd5b809150509250929050565b6000806040838503121561164757600080fd5b611650836114cf565b946020939093013593505050565b60006020828403121561167057600080fd5b813561150681611985565b60006020828403121561168d57600080fd5b815161150681611985565b6000602082840312156116aa57600080fd5b813567ffffffffffffffff8111156116c157600080fd5b8201601f810184136116d257600080fd5b610e3984823560208401611459565b6000602082840312156116f357600080fd5b5035919050565b6000815180845260005b8181101561172057602081850181015186830182015201611704565b81811115611732576000602083870101525b50601f01601f19169290920160200192915050565b6001600160a01b038581168252841660208201526040810183905260806060820181905260009061177a908301846116fa565b9695505050505050565b6020808252825182820181905260009190848201906040850190845b818110156117c55783516001600160a01b0316835292840192918401916001016117a0565b50909695505050505050565b60208152600061150660208301846116fa565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b6020808252601f908201527f4f776e61626c653a2063616c6c6572206973206e6f7420616e206f776e657200604082015260600190565b60208082526031908201527f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f6040820152701ddb995c881b9bdc88185c1c1c9bdd9959607a1b606082015260800190565b600082198211156118d1576118d1611943565b500190565b6000828210156118e8576118e8611943565b500390565b600181811c9082168061190157607f821691505b6020821081141561192257634e487b7160e01b600052602260045260246000fd5b50919050565b600060001982141561193c5761193c611943565b5060010190565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6001600160e01b03198116811461199b57600080fd5b5056fe697066733a2f2f516d57393438614e34546a6834654c6b41416f386f733141634d32464a6a413436717461456646416e794e597a59697066733a2f2f516d5567644c7650766a754847664d73754b3148326a467067357231514e63384a655779587952774b5038705466a26469706673582212202eac377a856f38a1f31abe00b2c773c27ae1dd50b74c9b5ec760f36740fedbef64736f6c63430008070033697066733a2f2f516d6156586a5358486b795257335355366d7943483267656f6768346278367854585556387a6a34386e61356738"

	const byteCodeTS721 = 
	"60e060405260356080818152906200271d60a039600d9062000022908262000711565b503480156200003057600080fd5b506040518060400160405280600d81526020016c26b2b9b9b0b3b2902a37b5b2b760991b815250604051806040016040528060038152602001624d534760e81b815250816000908162000084919062000711565b50600162000093828262000711565b505050620000b0620000aa620000d860201b60201c565b620000dc565b620000c7600b6200012e60201b62000e3c1760201c565b620000d162000137565b5062000851565b3390565b600a80546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b80546001019055565b600a546000906001600160a01b031633146200019a5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064015b60405180910390fd5b620001b1600b620001d960201b62000e451760201c565b9050620001bf3382620001dd565b620001d6600b6200012e60201b62000e3c1760201c565b90565b5490565b6001600160a01b038216620002355760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f2061646472657373604482015260640162000191565b6000818152600260205260409020546001600160a01b0316156200029c5760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e74656400000000604482015260640162000191565b620002aa6000838362000333565b6001600160a01b0382166000908152600360205260408120805460019290620002d5908490620007f3565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b6200034b8383836200035060201b62000e491760201c565b505050565b620003688383836200034b60201b6200074d1760201c565b6001600160a01b038316620003c657620003c081600880546000838152600960205260408120829055600182018355919091527ff3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee30155565b620003ec565b816001600160a01b0316836001600160a01b031614620003ec57620003ec83826200042c565b6001600160a01b03821662000406576200034b81620004d9565b826001600160a01b0316826001600160a01b0316146200034b576200034b828262000593565b600060016200044684620005e460201b620009e81760201c565b6200045291906200080f565b600083815260076020526040902054909150808214620004a6576001600160a01b03841660009081526006602090815260408083208584528252808320548484528184208190558352600790915290208190555b5060009182526007602090815260408084208490556001600160a01b039094168352600681528383209183525290812055565b600854600090620004ed906001906200080f565b6000838152600960205260408120546008805493945090928490811062000518576200051862000825565b9060005260206000200154905080600883815481106200053c576200053c62000825565b60009182526020808320909101929092558281526009909152604080822084905585825281205560088054806200057757620005776200083b565b6001900381819060005260206000200160009055905550505050565b6000620005ab83620005e460201b620009e81760201c565b6001600160a01b039093166000908152600660209081526040808320868452825280832085905593825260079052919091209190915550565b60006001600160a01b038216620006515760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b606482015260840162000191565b506001600160a01b031660009081526003602052604090205490565b634e487b7160e01b600052604160045260246000fd5b600181811c908216806200069857607f821691505b602082108103620006b957634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200034b57600081815260208120601f850160051c81016020861015620006e85750805b601f850160051c820191505b818110156200070957828155600101620006f4565b505050505050565b81516001600160401b038111156200072d576200072d6200066d565b62000745816200073e845462000683565b84620006bf565b602080601f8311600181146200077d5760008415620007645750858301515b600019600386901b1c1916600185901b17855562000709565b600085815260208120601f198616915b82811015620007ae578886015182559484019460019091019084016200078d565b5085821015620007cd5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b634e487b7160e01b600052601160045260246000fd5b80820180821115620008095762000809620007dd565b92915050565b81810381811115620008095762000809620007dd565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052603160045260246000fd5b611ebc80620008616000396000f3fe60806040526004361061019c5760003560e01c8063715018a6116100ec578063a22cb4651161008a578063e0df5b6f11610064578063e0df5b6f14610462578063e8a3d48514610482578063e985e9c514610497578063f2fde38b146104e057600080fd5b8063a22cb46514610402578063b88d4fde14610422578063c87b56dd1461044257600080fd5b80638da5cb5b116100c65780638da5cb5b146103b257806395d89b41146103d0578063985e49f4146103e55780639cb8a26a146103fa57600080fd5b8063715018a6146103665780637b47ec1a1461037b57806384c4bd4b1461039b57600080fd5b80632f745c59116101595780634f6ccce7116101335780634f6ccce7146102e65780636352211e146103065780636f3bffd21461032657806370a082311461034657600080fd5b80632f745c591461029157806342842e0e146102b15780634bb30912146102d157600080fd5b806301ffc9a7146101a157806306fdde03146101d6578063081812fc146101f8578063095ea7b31461023057806318160ddd1461025257806323b872dd14610271575b600080fd5b3480156101ad57600080fd5b506101c16101bc36600461187c565b610500565b60405190151581526020015b60405180910390f35b3480156101e257600080fd5b506101eb610511565b6040516101cd91906118e6565b34801561020457600080fd5b506102186102133660046118f9565b6105a3565b6040516001600160a01b0390911681526020016101cd565b34801561023c57600080fd5b5061025061024b36600461192e565b61063d565b005b34801561025e57600080fd5b506008545b6040519081526020016101cd565b34801561027d57600080fd5b5061025061028c366004611958565b610752565b34801561029d57600080fd5b506102636102ac36600461192e565b6107ad565b3480156102bd57600080fd5b506102506102cc366004611958565b610843565b3480156102dd57600080fd5b506101eb61085e565b3480156102f257600080fd5b506102636103013660046118f9565b61086d565b34801561031257600080fd5b506102186103213660046118f9565b610900565b34801561033257600080fd5b50610250610341366004611a20565b610977565b34801561035257600080fd5b50610263610361366004611a69565b6109e8565b34801561037257600080fd5b50610250610a6f565b34801561038757600080fd5b506102506103963660046118f9565b610aa5565b3480156103a757600080fd5b50600b546102639081565b3480156103be57600080fd5b50600a546001600160a01b0316610218565b3480156103dc57600080fd5b506101eb610b3f565b3480156103f157600080fd5b50610263610b4e565b610250610b9a565b34801561040e57600080fd5b5061025061041d366004611a84565b610bd2565b34801561042e57600080fd5b5061025061043d366004611ac0565b610be1565b34801561044e57600080fd5b506101eb61045d3660046118f9565b610c43565b34801561046e57600080fd5b5061025061047d366004611a20565b610d4e565b34801561048e57600080fd5b506101eb610d84565b3480156104a357600080fd5b506101c16104b2366004611b3c565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b3480156104ec57600080fd5b506102506104fb366004611a69565b610da4565b600061050b82610f01565b92915050565b60606000805461052090611b6f565b80601f016020809104026020016040519081016040528092919081815260200182805461054c90611b6f565b80156105995780601f1061056e57610100808354040283529160200191610599565b820191906000526020600020905b81548152906001019060200180831161057c57829003601f168201915b5050505050905090565b6000818152600260205260408120546001600160a01b03166106215760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084015b60405180910390fd5b506000908152600460205260409020546001600160a01b031690565b600061064882610900565b9050806001600160a01b0316836001600160a01b0316036106b55760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b6064820152608401610618565b336001600160a01b03821614806106d157506106d181336104b2565b6107435760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760448201527f6e6572206e6f7220617070726f76656420666f7220616c6c00000000000000006064820152608401610618565b61074d8383610f26565b505050565b600a546001600160a01b0316331461077c5760405162461bcd60e51b815260040161061890611ba9565b6107863382610f94565b6107a25760405162461bcd60e51b815260040161061890611bde565b61074d83838361108b565b60006107b8836109e8565b821061081a5760405162461bcd60e51b815260206004820152602b60248201527f455243373231456e756d657261626c653a206f776e657220696e646578206f7560448201526a74206f6620626f756e647360a81b6064820152608401610618565b506001600160a01b03919091166000908152600660209081526040808320938352929052205490565b61074d83838360405180602001604052806000815250610be1565b6060600c805461052090611b6f565b600061087860085490565b82106108db5760405162461bcd60e51b815260206004820152602c60248201527f455243373231456e756d657261626c653a20676c6f62616c20696e646578206f60448201526b7574206f6620626f756e647360a01b6064820152608401610618565b600882815481106108ee576108ee611c2f565b90600052602060002001549050919050565b6000818152600260205260408120546001600160a01b03168061050b5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b6064820152608401610618565b600a546001600160a01b031633146109a15760405162461bcd60e51b815260040161061890611ba9565b600c6109ad8282611c93565b507fd6666840ba3b0939cf78131cb173315c425a3385a30b8921494500ca2b49f34a816040516109dd91906118e6565b60405180910390a150565b60006001600160a01b038216610a535760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b6064820152608401610618565b506001600160a01b031660009081526003602052604090205490565b600a546001600160a01b03163314610a995760405162461bcd60e51b815260040161061890611ba9565b610aa36000611232565b565b600a546001600160a01b03163314610acf5760405162461bcd60e51b815260040161061890611ba9565b6000818152600260205260409020546001600160a01b0316610b335760405162461bcd60e51b815260206004820152601760248201527f6275726e3a206e6f6e6578697374656e7420746f6b656e0000000000000000006044820152606401610618565b610b3c81611284565b50565b60606001805461052090611b6f565b600a546000906001600160a01b03163314610b7b5760405162461bcd60e51b815260040161061890611ba9565b50600b54610b89338261132b565b610b97600b80546001019055565b90565b600a546001600160a01b03163314610bc45760405162461bcd60e51b815260040161061890611ba9565b600a546001600160a01b0316ff5b610bdd338383611479565b5050565b600a546001600160a01b03163314610c0b5760405162461bcd60e51b815260040161061890611ba9565b610c153383610f94565b610c315760405162461bcd60e51b815260040161061890611bde565b610c3d84848484611547565b50505050565b6000818152600260205260409020546060906001600160a01b0316610cbc5760405162461bcd60e51b815260206004820152602960248201527f746f6b656e5552493a2055524920717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b6064820152608401610618565b600d8054610cc990611b6f565b80601f0160208091040260200160405190810160405280929190818152602001828054610cf590611b6f565b8015610d425780601f10610d1757610100808354040283529160200191610d42565b820191906000526020600020905b815481529060010190602001808311610d2557829003601f168201915b50505050509050919050565b600a546001600160a01b03163314610d785760405162461bcd60e51b815260040161061890611ba9565b600d610bdd8282611c93565b6060604051806060016040528060358152602001611e5260359139905090565b600a546001600160a01b03163314610dce5760405162461bcd60e51b815260040161061890611ba9565b6001600160a01b038116610e335760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610618565b610b3c81611232565b80546001019055565b5490565b6001600160a01b038316610ea457610e9f81600880546000838152600960205260408120829055600182018355919091527ff3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee30155565b610ec7565b816001600160a01b0316836001600160a01b031614610ec757610ec7838261157a565b6001600160a01b038216610ede5761074d81611617565b826001600160a01b0316826001600160a01b03161461074d5761074d82826116c6565b60006001600160e01b0319821663780e9d6360e01b148061050b575061050b8261170a565b600081815260046020526040902080546001600160a01b0319166001600160a01b0384169081179091558190610f5b82610900565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6000818152600260205260408120546001600160a01b031661100d5760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b6064820152608401610618565b600061101883610900565b9050806001600160a01b0316846001600160a01b0316148061105f57506001600160a01b0380821660009081526005602090815260408083209388168352929052205460ff165b806110835750836001600160a01b0316611078846105a3565b6001600160a01b0316145b949350505050565b826001600160a01b031661109e82610900565b6001600160a01b0316146111025760405162461bcd60e51b815260206004820152602560248201527f4552433732313a207472616e736665722066726f6d20696e636f72726563742060448201526437bbb732b960d91b6064820152608401610618565b6001600160a01b0382166111645760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b6064820152608401610618565b61116f83838361175a565b61117a600082610f26565b6001600160a01b03831660009081526003602052604081208054600192906111a3908490611d69565b90915550506001600160a01b03821660009081526003602052604081208054600192906111d1908490611d7c565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b600a80546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b600061128f82610900565b905061129d8160008461175a565b6112a8600083610f26565b6001600160a01b03811660009081526003602052604081208054600192906112d1908490611d69565b909155505060008281526002602052604080822080546001600160a01b0319169055518391906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b6001600160a01b0382166113815760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f20616464726573736044820152606401610618565b6000818152600260205260409020546001600160a01b0316156113e65760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401610618565b6113f26000838361175a565b6001600160a01b038216600090815260036020526040812080546001929061141b908490611d7c565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b816001600160a01b0316836001600160a01b0316036114da5760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c6572000000000000006044820152606401610618565b6001600160a01b03838116600081815260056020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b61155284848461108b565b61155e84848484611765565b610c3d5760405162461bcd60e51b815260040161061890611d8f565b60006001611587846109e8565b6115919190611d69565b6000838152600760205260409020549091508082146115e4576001600160a01b03841660009081526006602090815260408083208584528252808320548484528184208190558352600790915290208190555b5060009182526007602090815260408084208490556001600160a01b039094168352600681528383209183525290812055565b60085460009061162990600190611d69565b6000838152600960205260408120546008805493945090928490811061165157611651611c2f565b90600052602060002001549050806008838154811061167257611672611c2f565b60009182526020808320909101929092558281526009909152604080822084905585825281205560088054806116aa576116aa611de1565b6001900381819060005260206000200160009055905550505050565b60006116d1836109e8565b6001600160a01b039093166000908152600660209081526040808320868452825280832085905593825260079052919091209190915550565b60006001600160e01b031982166380ac58cd60e01b148061173b57506001600160e01b03198216635b5e139f60e01b145b8061050b57506301ffc9a760e01b6001600160e01b031983161461050b565b61074d838383610e49565b60006001600160a01b0384163b1561185b57604051630a85bd0160e11b81526001600160a01b0385169063150b7a02906117a9903390899088908890600401611df7565b6020604051808303816000875af19250505080156117e4575060408051601f3d908101601f191682019092526117e191810190611e34565b60015b611841573d808015611812576040519150601f19603f3d011682016040523d82523d6000602084013e611817565b606091505b5080516000036118395760405162461bcd60e51b815260040161061890611d8f565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050611083565b506001949350505050565b6001600160e01b031981168114610b3c57600080fd5b60006020828403121561188e57600080fd5b813561189981611866565b9392505050565b6000815180845260005b818110156118c6576020818501810151868301820152016118aa565b506000602082860101526020601f19601f83011685010191505092915050565b60208152600061189960208301846118a0565b60006020828403121561190b57600080fd5b5035919050565b80356001600160a01b038116811461192957600080fd5b919050565b6000806040838503121561194157600080fd5b61194a83611912565b946020939093013593505050565b60008060006060848603121561196d57600080fd5b61197684611912565b925061198460208501611912565b9150604084013590509250925092565b634e487b7160e01b600052604160045260246000fd5b600067ffffffffffffffff808411156119c5576119c5611994565b604051601f8501601f19908116603f011681019082821181831017156119ed576119ed611994565b81604052809350858152868686011115611a0657600080fd5b858560208301376000602087830101525050509392505050565b600060208284031215611a3257600080fd5b813567ffffffffffffffff811115611a4957600080fd5b8201601f81018413611a5a57600080fd5b611083848235602084016119aa565b600060208284031215611a7b57600080fd5b61189982611912565b60008060408385031215611a9757600080fd5b611aa083611912565b915060208301358015158114611ab557600080fd5b809150509250929050565b60008060008060808587031215611ad657600080fd5b611adf85611912565b9350611aed60208601611912565b925060408501359150606085013567ffffffffffffffff811115611b1057600080fd5b8501601f81018713611b2157600080fd5b611b30878235602084016119aa565b91505092959194509250565b60008060408385031215611b4f57600080fd5b611b5883611912565b9150611b6660208401611912565b90509250929050565b600181811c90821680611b8357607f821691505b602082108103611ba357634e487b7160e01b600052602260045260246000fd5b50919050565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b60208082526031908201527f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f6040820152701ddb995c881b9bdc88185c1c1c9bdd9959607a1b606082015260800190565b634e487b7160e01b600052603260045260246000fd5b601f82111561074d57600081815260208120601f850160051c81016020861015611c6c5750805b601f850160051c820191505b81811015611c8b57828155600101611c78565b505050505050565b815167ffffffffffffffff811115611cad57611cad611994565b611cc181611cbb8454611b6f565b84611c45565b602080601f831160018114611cf65760008415611cde5750858301515b600019600386901b1c1916600185901b178555611c8b565b600085815260208120601f198616915b82811015611d2557888601518255948401946001909101908401611d06565b5085821015611d435787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b634e487b7160e01b600052601160045260246000fd5b8181038181111561050b5761050b611d53565b8082018082111561050b5761050b611d53565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b634e487b7160e01b600052603160045260246000fd5b6001600160a01b0385811682528416602082015260408101839052608060608201819052600090611e2a908301846118a0565b9695505050505050565b600060208284031215611e4657600080fd5b81516118998161186656fe697066733a2f2f516d5631744b4a464c727833527865375534615975487877425478386775725155776143726f3574434a464a7638a2646970667358221220baa373ad5f7bc2a65dc05b647dfc22fecbe18c73c4c1b33b8761445e6132623664736f6c63430008100033697066733a2f2f516d5a666d5075347269773942716d55653853656a684a524b773578527537384a68765945447559714271654675";

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
			4: "https://rinkeby-light.eth.linkpool.io",
		  }
      }
    }
  };

  web3Modal = new Web3Modal({
    network: "rinkeby", // optional
    cacheProvider: false, // optional
    disableInjectedProvider: false,
    providerOptions:providerOptions // required
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

  //window.ethereum

  let web3Provider = web3._provider;

  if (web3Provider.isWalletConnect)
  {
	let walletMeta = web3Provider.walletMeta;
	if (walletMeta != null)
	{
		document.querySelector("#detected-wallet").textContent = walletMeta.name;
	}
	else
	{
		document.querySelector("#detected-wallet").textContent = "Unknown WalletConnect provider";
	}
  }
  else if (web3Provider.isAlphaWallet)
  {
	document.querySelector("#detected-wallet").textContent = "Alpha Wallet";
  }
  else if (web3Provider.isTrust)
  {
	document.querySelector("#detected-wallet").textContent = "Trust Wallet";
  }
  else if (web3Provider.isMetaMask)
  {
	document.querySelector("#detected-wallet").textContent = "MetaMask";
  }
  
  // MetaMask does not give you all accounts, only the selected account
  console.log("Got accounts", accounts);
  selectedAccount = accounts[0];
  document.querySelector("#selected-account").textContent = selectedAccount;
  
  //Now populate the link API
  
  var signLinkURL = "https://aw.app/wallet/v1/signpersonalmessage?redirecturl=https://jamessmartcell.github.io/collectsig%3F &metadata=%7B%22name%22:%22Some%20app%22,%22iconurl%22:%22https://img.icons8.com/nolan/344/ethereum.png%22,%22appurl%22:%22https://google.com%22%7D&address=";
  
  //var signLinkURL = "https://aw.app/wallet/v1/signpersonalmessage?redirecturl=http://192.168.1.115/collectsig&metadata=%7B%22name%22:%22Some%20app%22,%22iconurl%22:%22https://img.icons8.com/nolan/344/ethereum.png%22,%22appurl%22:%22https://google.com%22%7D&address=";


  signLinkURL += selectedAccount;
  signLinkURL += "&message=0x48656c6c6f20416c7068612057616c6c6574";
  
  //"http://jamessmartcell.github.io/collectsig?addr=0x48656c6c6f20416c7068612057616c6c6574?call=signpersonalmessage&signature=0x186802b877cc37e6550d96e5b18afd15dfef24cef1865b3f7280a6698b0de500595898b297d288d1fc881826984245bdb8b85b9df4d04c190643017e02878c0c1c"
  
  document.getElementById("signLink").href = signLinkURL; 
  
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
  } catch(e) {
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
  if(provider != null && provider.close) {
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

async function onPushPunks() {
  console.log("Push Punks");
  const providerNew = new ethers.providers.Web3Provider(provider); console.log('providernew:', providerNew);
  let factory = new ethers.ContractFactory(abi, hexToBytes(bytecodePunks), providerNew.getSigner());
  let contract = await factory.deploy(); console.log('contract:',contract);
  let data = await contract.deployed();

  console.log("Data:", data);
}

async function onPushMeks() {
	console.log("Push Meks");
	const providerNew = new ethers.providers.Web3Provider(provider); console.log('providernew:', providerNew);
	let factory = new ethers.ContractFactory(abi, hexToBytes(bytecodeMeks), providerNew.getSigner());
	let contract = await factory.deploy(); console.log('contract:',contract);
	let data = await contract.deployed();
  
	console.log("Data:", data);
}

async function onPushSTLDoor() {
	console.log("Push Door");
	const providerNew = new ethers.providers.Web3Provider(provider); console.log('providernew:', providerNew);
	let factory = new ethers.ContractFactory(doorAbi, hexToBytes(byteCodeDoor), providerNew.getSigner());
	let contract = await factory.deploy(); console.log('contract:',contract);
	let data = await contract.deployed();
  
	console.log("Data:", data);
}

async function onPushTS721() {
	console.log("Push TS721");
	const providerNew = new ethers.providers.Web3Provider(provider); console.log('providernew:', providerNew);
	let factory = new ethers.ContractFactory(TSabi, hexToBytes(byteCodeTS721), providerNew.getSigner());
	let contract = await factory.deploy(); console.log('contract:',contract);
	let data = await contract.deployed();
  
	console.log("Data:", data);
}

async function onSwitch2Polygon() {
	console.log("onSwitch2Polygon: ")
	let request = {
		method: "wallet_switchEthereumChain",
		params: [{chainId:"0x3E9"}]
	}

	const response = provider.request(request);
	response.then(
		function(value) { console.log("success: "+value) },
		function(error) { console.log("error: "+error) }
	)
	console.log("response: " + response);
}

async function onSwitch2Aurora() {
	console.log("onSwitch2Aurora: ")
	let request = {
		method: "wallet_switchEthereumChain",
		params: [{chainId:"0x4E454153"}]
	}

	const response = provider.request(request);
	response.then(
		function(value) { console.log("success: "+value) },
		function(error) { console.log("error: "+error) }
	)
	console.log("response: " + response);
}

async function onSwitch2ADA() {
	console.log("onSwitch2ADA: ")
	let request = {
		method: "wallet_switchEthereumChain",
		params: [{chainId:"0x30DA5"}]
	}

	const response = provider.request(request);
	response.then(
		function(value) { console.log("success: "+value) },
		function(error) { console.log("error: "+error) }
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
		function(value) { console.log("success: "+value) },
		function(error) { console.log("error: "+error) }
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
  document.querySelector("#btn-pushPunks").addEventListener("click", onPushPunks);
  document.querySelector("#btn-pushMeks").addEventListener("click", onPushMeks);
  document.querySelector("#btn-pushSTLDoor").addEventListener("click", onPushSTLDoor);
  document.querySelector("#btn-switch2Eth").addEventListener("click", onSwitch2Polygon); 
  document.querySelector("#btn-switch2Aurora").addEventListener("click", onSwitch2Aurora);
  document.querySelector("#btn-switch2ADA").addEventListener("click", onSwitch2ADA);
  document.querySelector("#btn-addChain").addEventListener("click", onAddChain);
  document.querySelector("#btn-pushTS721").addEventListener("click", onPushTS721);
  
});
