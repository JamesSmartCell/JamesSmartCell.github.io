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

window.addEventListener('load', async () => {
  init();
  
});

function init() {

  console.log("Initializing example");
  console.log("WalletConnectProvider is", WalletConnectProvider);
  console.log("Fortmatic is", Fortmatic);
  console.log("window.web3 is", window.web3, "window.ethereum is", window.ethereum);

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
  
  try {
    provider = await web3Modal.connect();
  } catch(e) {
    console.log("Could not get a wallet connection", e);
    return;
  }
  
  await mainFunction();
}


/**
 * Kick in the UI action after Web3modal dialog has chosen a provider
 */
async function mainFunction() {
	
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

  // Get a Web3 instance for the wallet
  const web3 = new Web3(provider);

  console.log("Web3 instance is", web3);

  // Get connected chain id from Ethereum node
  const chainId = await web3.eth.getChainId();
  // Load chain information over an HTTP API
  const chainData = evmChains.getChain(chainId);

  // Get list of accounts of the connected wallet
  const accounts = await web3.eth.getAccounts();

  
  // MetaMask does not give you all accounts, only the selected account
  console.log("Got accounts", accounts);
  selectedAccount = accounts[0];
  
  const msg = 0x48656c6c6f20416c7068612057616c6c6574;

  //pull sig out of args
  var sigHex = getUrlVars()["signature"];
  
  console.log('recovering...')
  const msgParams = { data: msg }
  msgParams.sig = sigHex
  console.dir({ msgParams })
  
  const recovered = web3.eth.accounts.recover(msg, sigHex);
  
  //const recovered2 = sigUtil.recoverPersonalSignature(msgParams)
  
  if (recovered == selectedAccount)
  {
	  document.querySelector("#signature-result").textContent = "Pass!";
  }
  else
  {
	  document.querySelector("#signature-result").textContent = "Fail: " + recovered;
  }
  
  
  //Now populate the link API
  
  /*var signLinkURL = "https://aw.app/wallet/v1/signpersonalmessage?redirecturl=https://jamessmartcell.github.io/collectsig&metadata=%7B%22name%22:%22Some%20app%22,%22iconurl%22:%22https://img.icons8.com/nolan/344/ethereum.png%22,%22appurl%22:%22https://google.com%22%7D&address=";
  
  signLinkURL += selectedAccount;
  signLinkURL += "&message=0x48656c6c6f20416c7068612057616c6c6574";
  
  //"https://myapp.com?call=signpersonalmessage&signature=0x186802b877cc37e6550d96e5b18afd15dfef24cef1865b3f7280a6698b0de500595898b297d288d1fc881826984245bdb8b85b9df4d04c190643017e02878c0c1c"
  
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
  document.querySelector("#connected").style.display = "block";*/
}


function hexToBytes(hex) {
  for (var bytes = [], c = 0; c < hex.length; c += 2)
      bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}