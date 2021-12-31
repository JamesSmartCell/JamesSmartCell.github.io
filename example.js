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
				"name": "addr",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "GenerateCommitment",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "addr",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "GenerateTokenId",
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
				"name": "newPrinter",
				"type": "address"
			}
		],
		"name": "addMintPermission",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
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
		"inputs": [],
		"name": "getTokenId",
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
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "commitmentId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "baseURI",
				"type": "string"
			}
		],
		"name": "mintUsingCommitmentId",
		"outputs": [],
		"stateMutability": "nonpayable",
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
	}
];

const bytecode = "60806040523480156200001157600080fd5b5060408051808201909152600f8082526e109bdc995908105c195cc815195cdd608a1b60209092019182526200004a9160019162000169565b506040805180820190915260038082526210905560ea1b6020909201918252620000779160029162000169565b50600080546001600160a01b031916331790556001600355620000a16301ffc9a760e01b620000e5565b620000b3635b5e139f60e01b620000e5565b620000c56380ac58cd60e01b620000e5565b336000908152600860205260409020805460ff191660011790556200024c565b6001600160e01b03198082161415620001445760405162461bcd60e51b815260206004820152601c60248201527f4552433136353a20696e76616c696420696e7465726661636520696400000000604482015260640160405180910390fd5b6001600160e01b0319166000908152600960205260409020805460ff19166001179055565b82805462000177906200020f565b90600052602060002090601f0160209004810192826200019b5760008555620001e6565b82601f10620001b657805160ff1916838001178555620001e6565b82800160010185558215620001e6579182015b82811115620001e6578251825591602001919060010190620001c9565b50620001f4929150620001f8565b5090565b5b80821115620001f45760008155600101620001f9565b600181811c908216806200022457607f821691505b602082108114156200024657634e487b7160e01b600052602260045260246000fd5b50919050565b611a96806200025c6000396000f3fe6080604052600436106101145760003560e01c80636352211e116100a0578063a22cb46511610064578063a22cb4651461030d578063b88d4fde1461032d578063bb6e7de91461034d578063c87b56dd14610355578063e985e9c51461037557600080fd5b80636352211e1461028357806370a08231146102a35780637b47ec1a146102c357806395d89b41146102e3578063985e49f4146102f857600080fd5b8063095ea7b3116100e7578063095ea7b3146101e15780631e61ecd31461020357806323b872dd1461022357806342842e0e14610243578063527e54031461026357600080fd5b8063010a38f51461011957806301ffc9a71461013d57806306fdde0314610187578063081812fc146101a9575b600080fd5b34801561012557600080fd5b506003545b6040519081526020015b60405180910390f35b34801561014957600080fd5b50610177610158366004611530565b6001600160e01b03191660009081526009602052604090205460ff1690565b6040519015158152602001610134565b34801561019357600080fd5b5061019c6103be565b60405161013491906115a1565b3480156101b557600080fd5b506101c96101c43660046115b4565b610450565b6040516001600160a01b039091168152602001610134565b3480156101ed57600080fd5b506102016101fc3660046115e9565b6104ea565b005b34801561020f57600080fd5b5061017761021e366004611613565b610600565b34801561022f57600080fd5b5061020161023e36600461162e565b610692565b34801561024f57600080fd5b5061020161025e36600461162e565b6106c3565b34801561026f57600080fd5b5061020161027e3660046116f6565b6106de565b34801561028f57600080fd5b506101c961029e3660046115b4565b610792565b3480156102af57600080fd5b5061012a6102be366004611613565b61080f565b3480156102cf57600080fd5b506102016102de3660046115b4565b610896565b3480156102ef57600080fd5b5061019c610948565b34801561030457600080fd5b5061012a610957565b34801561031957600080fd5b50610201610328366004611761565b6109ab565b34801561033957600080fd5b5061020161034836600461179d565b610a70565b610201610aa8565b34801561036157600080fd5b5061019c6103703660046115b4565b610ac9565b34801561038157600080fd5b50610177610390366004611819565b6001600160a01b03918216600090815260076020908152604080832093909416825291909152205460ff1690565b6060600180546103cd9061184c565b80601f01602080910402602001604051908101604052809291908181526020018280546103f99061184c565b80156104465780601f1061041b57610100808354040283529160200191610446565b820191906000526020600020905b81548152906001019060200180831161042957829003601f168201915b5050505050905090565b6000818152600460205260408120546001600160a01b03166104ce5760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084015b60405180910390fd5b506000908152600660205260409020546001600160a01b031690565b60006104f582610792565b9050806001600160a01b0316836001600160a01b031614156105635760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b60648201526084016104c5565b336001600160a01b038216148061057f575061057f8133610390565b6105f15760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760448201527f6e6572206e6f7220617070726f76656420666f7220616c6c000000000000000060648201526084016104c5565b6105fb8383610be6565b505050565b600080546001600160a01b031633146106695760405162461bcd60e51b815260206004820152602560248201527f4f6e6c7920636f6e74726163742063726561746f722063616e20616464206d69604482015264373a32b91760d91b60648201526084016104c5565b506001600160a01b03166000908152600860205260409020805460ff1916600190811790915590565b61069c3382610c54565b6106b85760405162461bcd60e51b81526004016104c590611887565b6105fb838383610d4b565b6105fb83838360405180602001604052806000815250610a70565b3360009081526008602052604090205460ff16151560011461073a5760405162461bcd60e51b8152602060048201526015602482015274135a5b9d1a5b99c81b9bdd081c195c9b5a5d1d1959605a1b60448201526064016104c5565b6107448383610eeb565b61075782610752838561102d565b6110f1565b60405182906001600160a01b038516907f5a416ca5c8383e0ce4fd2e6a78ebbebc6a3e4e3a331e1b8139a34cf0ebe7f57690600090a3505050565b6000818152600460205260408120546001600160a01b0316806108095760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b60648201526084016104c5565b92915050565b60006001600160a01b03821661087a5760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b60648201526084016104c5565b506001600160a01b031660009081526005602052604090205490565b6000546001600160a01b03163314806108bf5750336108b482610792565b6001600160a01b0316145b6109035760405162461bcd60e51b8152602060048201526015602482015274135a5b9d1a5b99c81b9bdd081c195c9b5a5d1d1959605a1b60448201526064016104c5565b61090c81611189565b60408051338152602081018390527fcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca5910160405180910390a150565b6060600280546103cd9061184c565b6003805460009182610968836118ee565b9190505550600354905061097c3382610eeb565b6109a881610752604051806040016040528060068152602001656c616c616c6160d01b8152508461102d565b90565b6001600160a01b038216331415610a045760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c65720000000000000060448201526064016104c5565b3360008181526007602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b610a7a3383610c54565b610a965760405162461bcd60e51b81526004016104c590611887565b610aa284848484611224565b50505050565b6000546001600160a01b0316331415610114576000546001600160a01b0316ff5b6000818152600460205260409020546060906001600160a01b0316610b485760405162461bcd60e51b815260206004820152602f60248201527f4552433732314d657461646174613a2055524920717565727920666f72206e6f60448201526e3732bc34b9ba32b73a103a37b5b2b760891b60648201526084016104c5565b6000828152600a602052604090208054610b619061184c565b80601f0160208091040260200160405190810160405280929190818152602001828054610b8d9061184c565b8015610bda5780601f10610baf57610100808354040283529160200191610bda565b820191906000526020600020905b815481529060010190602001808311610bbd57829003601f168201915b50505050509050919050565b600081815260066020526040902080546001600160a01b0319166001600160a01b0384169081179091558190610c1b82610792565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6000818152600460205260408120546001600160a01b0316610ccd5760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084016104c5565b6000610cd883610792565b9050806001600160a01b0316846001600160a01b03161480610d135750836001600160a01b0316610d0884610450565b6001600160a01b0316145b80610d4357506001600160a01b0380821660009081526007602090815260408083209388168352929052205460ff165b949350505050565b826001600160a01b0316610d5e82610792565b6001600160a01b031614610dc65760405162461bcd60e51b815260206004820152602960248201527f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960448201526839903737ba1037bbb760b91b60648201526084016104c5565b6001600160a01b038216610e285760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b60648201526084016104c5565b610e33600082610be6565b6001600160a01b0383166000908152600560205260408120805460019290610e5c908490611909565b90915550506001600160a01b0382166000908152600560205260408120805460019290610e8a908490611920565b909155505060008181526004602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b6001600160a01b038216610f415760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f206164647265737360448201526064016104c5565b6000818152600460205260409020546001600160a01b031615610fa65760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e7465640000000060448201526064016104c5565b6001600160a01b0382166000908152600560205260408120805460019290610fcf908490611920565b909155505060008181526004602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b6060600061103a83611257565b8451815191925090810161104f816020611920565b67ffffffffffffffff8111156110675761106761166a565b6040519080825280601f01601f191660200182016040528015611091576020820181803683370190505b50935060006110a1602083611938565b6110ac906001611920565b9050602085016000602089015b838210156110d8578051835260209283019260019290920191016110b9565b5050505060209283015191840190920152815292915050565b6000828152600460205260409020546001600160a01b031661116a5760405162461bcd60e51b815260206004820152602c60248201527f4552433732314d657461646174613a2055524920736574206f66206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084016104c5565b6000828152600a6020908152604090912082516105fb9284019061147e565b600061119482610792565b90506111a1600083610be6565b6001600160a01b03811660009081526005602052604081208054600192906111ca908490611909565b909155505060008281526004602052604080822080546001600160a01b0319169055518391906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b61122f848484610d4b565b61123b84848484611380565b610aa25760405162461bcd60e51b81526004016104c59061195a565b60608161127b5750506040805180820190915260018152600360fc1b602082015290565b8160005b81156112a5578061128f816118ee565b915061129e9050600a83611938565b915061127f565b60008167ffffffffffffffff8111156112c0576112c061166a565b6040519080825280601f01601f1916602001820160405280156112ea576020820181803683370190505b509050815b851561137757611300600182611909565b9050600061130f600a88611938565b61131a90600a6119ac565b6113249088611909565b61132f9060306119cb565b905060008160f81b90508084848151811061134c5761134c6119f0565b60200101906001600160f81b031916908160001a90535061136e600a89611938565b975050506112ef565b50949350505050565b60006001600160a01b0384163b1561147357604051630a85bd0160e11b81526001600160a01b0385169063150b7a02906113c4903390899088908890600401611a06565b6020604051808303816000875af19250505080156113ff575060408051601f3d908101601f191682019092526113fc91810190611a43565b60015b611459573d80801561142d576040519150601f19603f3d011682016040523d82523d6000602084013e611432565b606091505b5080516114515760405162461bcd60e51b81526004016104c59061195a565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050610d43565b506001949350505050565b82805461148a9061184c565b90600052602060002090601f0160209004810192826114ac57600085556114f2565b82601f106114c557805160ff19168380011785556114f2565b828001600101855582156114f2579182015b828111156114f25782518255916020019190600101906114d7565b506114fe929150611502565b5090565b5b808211156114fe5760008155600101611503565b6001600160e01b03198116811461152d57600080fd5b50565b60006020828403121561154257600080fd5b813561154d81611517565b9392505050565b6000815180845260005b8181101561157a5760208185018101518683018201520161155e565b8181111561158c576000602083870101525b50601f01601f19169290920160200192915050565b60208152600061154d6020830184611554565b6000602082840312156115c657600080fd5b5035919050565b80356001600160a01b03811681146115e457600080fd5b919050565b600080604083850312156115fc57600080fd5b611605836115cd565b946020939093013593505050565b60006020828403121561162557600080fd5b61154d826115cd565b60008060006060848603121561164357600080fd5b61164c846115cd565b925061165a602085016115cd565b9150604084013590509250925092565b634e487b7160e01b600052604160045260246000fd5b600067ffffffffffffffff8084111561169b5761169b61166a565b604051601f8501601f19908116603f011681019082821181831017156116c3576116c361166a565b816040528093508581528686860111156116dc57600080fd5b858560208301376000602087830101525050509392505050565b60008060006060848603121561170b57600080fd5b611714846115cd565b925060208401359150604084013567ffffffffffffffff81111561173757600080fd5b8401601f8101861361174857600080fd5b61175786823560208401611680565b9150509250925092565b6000806040838503121561177457600080fd5b61177d836115cd565b91506020830135801515811461179257600080fd5b809150509250929050565b600080600080608085870312156117b357600080fd5b6117bc856115cd565b93506117ca602086016115cd565b925060408501359150606085013567ffffffffffffffff8111156117ed57600080fd5b8501601f810187136117fe57600080fd5b61180d87823560208401611680565b91505092959194509250565b6000806040838503121561182c57600080fd5b611835836115cd565b9150611843602084016115cd565b90509250929050565b600181811c9082168061186057607f821691505b6020821081141561188157634e487b7160e01b600052602260045260246000fd5b50919050565b60208082526031908201527f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f6040820152701ddb995c881b9bdc88185c1c1c9bdd9959607a1b606082015260800190565b634e487b7160e01b600052601160045260246000fd5b6000600019821415611902576119026118d8565b5060010190565b60008282101561191b5761191b6118d8565b500390565b60008219821115611933576119336118d8565b500190565b60008261195557634e487b7160e01b600052601260045260246000fd5b500490565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b60008160001904831182151516156119c6576119c66118d8565b500290565b600060ff821660ff84168060ff038211156119e8576119e86118d8565b019392505050565b634e487b7160e01b600052603260045260246000fd5b6001600160a01b0385811682528416602082015260408101839052608060608201819052600090611a3990830184611554565b9695505050505050565b600060208284031215611a5557600080fd5b815161154d8161151756fea2646970667358221220d858589ef7f4582d7ea95b1a21eeb43e0dccc754a069d9f8c7b6254464e6471364736f6c634300080a0033"
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
        infuraId: "da3717f25f824cc1baa32d812386d93f",
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
  if(provider.close) {
    await provider.close();

    // If the cached provider is not cleared,
    // WalletConnect will default to the existing session
    // and does not allow to re-scan the QR code with a new wallet.
    // Depending on your use case you may want or want not his behavir.
    await web3Modal.clearCachedProvider();
    provider = null;
  }

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

async function onPushTx() {
  console.log("Push TX");
  const providerNew = new ethers.providers.Web3Provider(provider); console.log('providernew:', providerNew);
  let factory = new ethers.ContractFactory(abi, hexToBytes(bytecode), providerNew.getSigner());
  let contract = await factory.deploy(); console.log('contract:',contract);
  let data = await contract.deployed();

  console.log("Data:", data);
}

async function onPushTxSend() {
	console.log("Push TX");
	const deployedRinkebyContract = '0xe42d1FE5097e906169CDCfeBA8d0b5050EF30189'; 
	const providerNew = new ethers.providers.Web3Provider(provider); console.log('providernew:', providerNew);
	let factory = new ethers.ContractFactory(abi, hexToBytes(bytecode), providerNew.getSigner());
	let mintableTokens = await factory.attach(deployedRinkebyContract);

	let txResult = await mintableTokens.mintUsingSequentialTokenId();

	console.log("Data:", mintableTokens.address);
	console.log("TX: ", txResult);

  }

/**
 * Main entry point.
 */
window.addEventListener('load', async () => {
  init();
  document.querySelector("#btn-connect").addEventListener("click", onConnect);
  document.querySelector("#btn-disconnect").addEventListener("click", onDisconnect);
  document.querySelector("#btn-disconnect2").addEventListener("click", onDisconnect);
  document.querySelector("#btn-pushTx").addEventListener("click", onPushTx);
  document.querySelector("#btn-pushTxSend").addEventListener("click", onPushTxSend);
  
});
