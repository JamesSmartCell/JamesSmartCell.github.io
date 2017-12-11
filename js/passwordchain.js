//var http = require('https');
var bitcore = require('bitcore-lib');
// Set the network to testnet
bitcore.Networks.defaultNetwork = bitcore.Networks.testnet;
var Mnemonic = require('bitcore-mnemonic');
var explorers = require('bitcore-explorers');
var insight = new explorers.Insight();

var xmlHttp = new XMLHttpRequest();

var HttpClient = function () {
    this.get = function (txid, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function () {
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }

        var fullURL = 'https://api.biteasy.com/blockchain/v1/transactions/' + txid;

        anHttpRequest.open("GET", fullURL, true);
        anHttpRequest.send(null);
    }
}

var speakerAddrs = ["mzZhpwWwsUJbmfsepK5TFnaRKhU42DShKW"
        , "mvPjn22Zrz3n7JhU2zZ5vpGEccJBpTNMqZ"
        , "mnnYkVrNsJnQg1ytyqa9JGbgpeYCJuM9Kh"
        , "mnDWPpwE9sbNcRq3bcrkdGW9TN5XpLvAX9"
        , "mqASPHQU6iWAn8Z7HCsXFHGLQzeXGPPrm1"
        , "mxUN8EKFifP223ZTrEG5d4SbnNMAUe3KSY"];


var aClient;
var txids = [];
var cryptos = [];
var txIndex = 0;
var keyDeriv = 1;

var nominalTransactionAmount = 6000;
var seed;
var fundingUTXO;
var remainingFunds = 0;

var minerFee = 6000; //6000 satoshis for miner fee
var initialWalletFill = 100000 * 10; // Amount we fill the wallet with on creation, 500 mBTC
var voteAmount = 100000 * 5; //100 mBTC per vote
var speakerDebitAmt = 100000 * 1; //1 mBTC per 10 seconds


function getPrivateKey(modulus) {
    var newHDPriv;
    if (xprv != null) {
        var derivedByNumber = xprv.derive(modulus);
        newHDPriv = derivedByNumber.privateKey;
    }
    return newHDPriv;
}

$(document).ready(function () {
    loadStartData();
});

var hdCode;
var xpriv;

function initAddrs()
{
    var secretStr = "how about this for a private key";
    var wordList2 = tokenise(secretStr);

    hdCode = new Mnemonic(wordList2);
    xprv = hdCode.toHDPrivateKey(secretStr);
}

function getPrivateKey(modulus)
{
    var newHDPriv;
    if (xprv != null)
    {
        var derivedByNumber = xprv.derive(modulus);
        newHDPriv = derivedByNumber.privateKey;
    }
    return newHDPriv;
}

function getSpeakerPriv(speakerID)
{
    var speakerKey = getPrivateKey(speakerID + 10000);
    return speakerKey;
}

function getSpeakerAddr(speakerID)
{
    var speakerKey = getSpeakerPriv(speakerID);
    return speakerKey.toAddress();
}

function loadStartData()
{
    //get word list
    var secretStr = "how about this for a private key";
    var balance = document.getElementById('bitcoinBalance');

    //tokenise
    var wordList2 = tokenise(secretStr);

    if (wordList2.length < 5)
    {
        balance.innerHTML = '<h2>Please use at least 5 words in your passphrase</h2>';
        return;
    }

    hdCode = new Mnemonic(wordList2);
    xprv = hdCode.toHDPrivateKey(secretStr);
    var privateKey0 = getPrivateKey(userIDVal);
    var address = privateKey0.toAddress();

    console.log("hi");

    //displayRemainingBitcoins(userIDVal, 1);
}

function updateBalance(display)
{
    var balance = document.getElementById('bitcoinBalance');
    var userID = document.getElementById('readID');
    var userIDStr = userID.innerHTML;
    var userIDVal = parseInt(userIDStr);

    if (display != null) {
        balance.innerHTML = display;
    }
    else {
        balance.innerHTML = '...... refreshing wallet balance .......';
    }

    setTimeout(function () {
        displayRemainingBitcoins(userIDVal, 0);
    }, 5000);
}

function displayRemainingBitcoins(userID, checkAllocate)
{
    //1. get repository bitcoins
    var privateKey = getPrivateKey(userID);
    var address = privateKey.toAddress();

    fundingUTXO = null;
    var satoshis = 0;
    var bitcoinAmount = 0;

    //see how many bitcoins are in our storage area, find first utxo that has available funds
    insight.getUnspentUtxos(address, function (error, utxos)
    {
        var balance = document.getElementById('bitcoinBalance');
        satoshis += getFundsAtAddress(utxos, 0);  //100000  == 1mBTC
        if (satoshis < (voteAmount + minerFee) && checkAllocate == 1)
        {
            bitcoinAmount = satoshis / 100000.0;
            balance.innerHTML = 'Available credits = ' + bitcoinAmount + 'mBTC' + ' Insufficient for vote';
            //check if we need to allocate funds
            allocateInitialFunds(userID);
        }
        else
        {
            var voteCount = satoshis / (voteAmount + minerFee);
            var ctx = voteCount.toFixedDown(0);
            bitcoinAmount = satoshis / 100000.0;
            balance.innerHTML = 'Available credits = ' + bitcoinAmount + 'mBTC' + ' [' + ctx + ' votes]';
        }
    });
}

function getFundsAtAddress(utxos, level)
{
    var satoshis = 0;
    if (utxos.length > 0)
    {
        for (var i = 0; i < utxos.length; i++)
        {
            if (utxos[i] != null)
            {
                var amount = bitcore.Unit.fromBTC(utxos[i].toObject().amount).toSatoshis();
                satoshis += amount;

                fundingUTXO = utxos[i];
            }
        }
    }

    return satoshis;
}

function topUp()
{
    var newUser = document.getElementById('newUser');
    newUser.innerHTML = "1";
    var userID = document.getElementById('readID');
    var userIDStr = userID.innerHTML;
    var userIDVal = parseInt(userIDStr);

    allocateInitialFunds(userIDVal);
}

function allocateInitialFunds(userID)
{
    var newUser = document.getElementById('newUser');
    var newUserStr = newUser.innerHTML;
    var newUserVal = parseInt(newUserStr);

    if (newUserVal == 1)
    {
        newUser.innerHTML = '0';

        //1. get repository bitcoins
        var privateKey = getPrivateKey(0);
        var address = privateKey.toAddress();

        fundingUTXO = null;
        var satoshis = 0;
        var bitcoinAmount = 0;

        //see how many bitcoins are in our storage area, find first utxo that has available funds
        insight.getUnspentUtxos(address, function (error, utxos) {
            var balance = document.getElementById('bitcoinBalance');
            satoshis += getFundsAtAddress(utxos, 0);  //100000  == 1mBTC
            if (satoshis > initialWalletFill) {
                //issue spend
                issueSpend(utxos, userID, satoshis);
            }
        });
    }
}

function issueSpend(utxos, userID, satoshis)
{
    var privateKey = getPrivateKey(userID);
    var addressUser = privateKey.toAddress();

    var privateKeyFunds = getPrivateKey(0);
    var addressFunds = privateKeyFunds.toAddress();

    var tx = new bitcore.Transaction()
            .from(utxos)                     // funding pool UTXOs
            .to(addressUser, initialWalletFill)  // send to new wallet instance
            .to(addressFunds, satoshis - (initialWalletFill + minerFee)) //send remaining back to main pool
            .change(addressFunds)                    // Send change back to funding pool
            .sign(privateKeyFunds);                 // Signs the transaction

    var txSerialized = tx.serialize();

    insight.broadcast(txSerialized, function (error, body) {
        if (error) {
            balance.innerHTML = 'Error in broadcast: ' + error;
        }
        else {
            //refresh page
            updateBalance();
        }
    });
}

//spends on a speaker
function generateSpend()
{
    //read speaker value
    var speakerE = document.getElementById("speakerSelect");
    var speakerStr = speakerE.innerHTML;
    var speaker = parseInt(speakerStr);

    var userIDm = document.getElementById('readID');
    var userIDStr = userIDm.innerHTML;
    var userID = parseInt(userIDStr);

    //issue spend if there are sufficient coins
    //1. get repository bitcoins
    var privateKey = getPrivateKey(userID);
    var address = privateKey.toAddress();

    fundingUTXO = null;
    var satoshis = 0;
    var bitcoinAmount = 0;

    //see how many bitcoins are in our storage area, find first utxo that has available funds
    insight.getUnspentUtxos(address, function (error, utxos) {
        var balance = document.getElementById('bitcoinBalance');
        satoshis += getFundsAtAddress(utxos, 0);  //100000  == 1mBTC
        if (satoshis < voteAmount && checkAllocate == 1) {
            balance.innerHTML = 'Available credits = ' + bitcoinAmount + 'mBTC' + ' Insufficient for vote';
        }
        else {
            spendOnSpeaker(speaker, userID, utxos, satoshis);
        }
    });
}

function spendSpeaker(speaker)
{
    var speakerAddress = speakerAddrs[speaker];
    var speakerWalletAddress = bitcore.Address.fromString(speakerAddress);

    var speakerPrivStr = speakerKey[speaker];
    var speakerPrivKey = new PrivateKey(speakerPrivStr);

    //see how many bitcoins are in our storage area, find first utxo that has available funds
    insight.getUnspentUtxos(speakerWalletAddress, function (error, utxos) {
        var satoshis = getFundsAtAddress(utxos, 0);  //100000  == 1mBTC
        speakerDebit(utxos, speakerPrivKey, speakerWalletAddress, satoshis);
    });
}

function speakerDebit(utxos, speakerPrivKey, speakerWalletAddress, satoshis)
{
    var poolAddrStr = "mxbadwXiZaCErKkhWTkEPKfG1xoCZDMSLd";
    var poolAddr = bitcore.Address(poolAddrStr);

    var speakerDebitReCalc = speakerDebitAmt;
    if (satoshis < (speakerDebitAmt + minerFee))
    {
        speakerDebitReCalc = satoshis - minerFee;
    }

    var tx = new bitcore.Transaction()
        .from(utxos)             
        .to(poolAddr, speakerDebitAmt)
        .to(speakerWalletAddress, satoshis - (speakerDebitAmt + minerFee))
        .change(speakerWalletAddress)
        .sign(speakerPrivKey);

    var txSerialized = tx.serialize();

    insight.broadcast(txSerialized, function (error, body) {
        if (error) {
            balance.innerHTML = 'Error in broadcast: ' + error;
        }
        else {
            //refresh page
        }
    });
}

function spendOnSpeaker(speaker, userID, utxos, satoshis)
{
    var speakerAddress = speakerAddrs[speaker];
    var speakerWalletAddress = bitcore.Address.fromString(speakerAddress);

    var privateKey = getPrivateKey(userID);
    var address = privateKey.toAddress();

    var tx = new bitcore.Transaction()
        .from(utxos)                     // user's utxos
        .to(speakerWalletAddress, voteAmount)  // send to speaker's address
        .to(address, satoshis - (voteAmount + minerFee)) //send remaining back to user's wallet
        .change(address)                    // Send change back to user's wallet
        .sign(privateKey);                 // Signs the transaction

    var txSerialized = tx.serialize();

    insight.broadcast(txSerialized, function (error, body) {
        if (error)
        {
            balance.innerHTML = 'Error in broadcast: ' + error;
        }
        else
        {
            //refresh page
            var speakerEnglish = speaker + 1;
            updateBalance(".. Sending " + voteAmount / 100000 + " mBTC to speaker " + speakerEnglish + " ..");
        }
    });
}

function writePassword()
{
    hidePasswordBox();
    var balance = document.getElementById('balance');
    //first check password not too long
    var password = password1.value;
    if (password.length > 35) {
        balance.innerHTML = 'Invalid Password - cannot be longer than 35 letters';
        return;
    }

    //storePassword();
    var encrypted = getEncryptedPassword();

    if (encrypted.length < 10) {
        balance.innerHTML = 'Invalid Password - must be ascii characters only';
        return;
    }

    //now attempt the write
    if (fundingUTXO == null) {
        balance.innerHTML = 'No available funds or funds too fragmented; deposit 1 mBTC into address at top right.';
        return;
    }

    //TODO: use multi-inputs to avoid fragmentation

    //ok we got our valid utxo
    var privateKey = getPrivateKey(0);
    var address = privateKey.toAddress();

    var privateKeyWrite = generateModulusKey();
    var addressWrite = privateKeyWrite.toAddress();

    var passwordUint = parseHexString(encrypted); //Uint8Array.from(encrypted);

    var testUint = Uint8Array.from(passwordUint);

    var buf = new Buffer(passwordUint);

    var satoshisInFragment = bitcore.Unit.fromBTC(fundingUTXO.toObject().amount).toSatoshis();

    var tx = new bitcore.Transaction()
                .from(fundingUTXO)                     // Feed information about what unspent outputs one can use
                .to(addressWrite, nominalTransactionAmount)  // Add an output to the address we need to write to
                .to(address, satoshisInFragment - (nominalTransactionAmount + minerFee)) //send remaining back to main pool
                .addData(buf)                 // Encrypted password
                .change(address)                    // Sets up a change address where the rest of the funds will go
                .sign(privateKey);                 // Signs all the inputs it can


    var txSerialized = tx.serialize();

    insight.broadcast(txSerialized, function (error, body) {
        if (error) {
            balance.innerHTML = 'Error in broadcast: ' + error;
        }
        else {
            //refresh page
            //TODO: confirm password stored
            var loc = document.getElementById('location');
            loc.innerHTML = 'Transaction successful. Password stored on blockchain.';
            loadStartData();
        }
    });
}

function enterPassword() {
    hidePasswordBox();
    //bring up new box
    var website = document.getElementById('storePassword');
    website.style.display = '';
}

function generateModulusKey() {
    //generate the data
    //generate new key
    //1. get website hash
    var website = urlSearch.value;
    //TODO: check UTF-8

    var hash = Sha256.hash(website.toString());

    //2. get modulus
    var subStr = hash.substring(hash.length - 8, hash.length);
    var value = parseInt(subStr, 16);
    var modulus = (value % 51581) + 1; //use a high value prime number, first address is used as bitcoin storage

    //3. Generate private key
    var container = document.getElementById('output');
    var loc = document.getElementById('location');
    var newPrivateKey = getPrivateKey(modulus);
    var newAddress = newPrivateKey.toAddress();

    //container.innerHTML = 'Priv: ' + newPrivateKey.toString();
    //loc.innerHTML = 'Addr: ' + newAddress.toString();


    return newPrivateKey;
}

function getEncryptedPassword() {
    var firstHash = hashWithWebhash();
    var secondHash = hashWithPrivKey(firstHash);

    return secondHash;
}

function storePassword() {
    var firstHash = hashWithWebhash();
    var secondHash = hashWithPrivKey(firstHash);
    var decrypt = document.getElementById('decrypt');
    decrypt.style.display = '';
    var decryptStr = document.getElementById('decryptStr');
    decryptStr.innerHTML = secondHash;
}

function hashWithWebhash() {
    var webHash = Sha256.hash(website.toString());
    var loc = document.getElementById('location');
    var crypto = window.crypto || window.msCrypto;

    var password = password1.value;
    //loc.innerHTML = 'NewHash: ' + webHash.toString() + 'p ' + password;

    var checkSum = 0;
    var encrypted = '';
    var passwordLength = password.length;
    var webhashIndex = 0;

    //now rotate password with webhash
    for (var i = 0; i < 36; i++) {
        var thisCh = 0;
        if (passwordLength > 0) {
            thisCh = password.charCodeAt(i);
        }
        else if (passwordLength < 0) {
            thisCh = Math.round(Math.random() * 0xff); //put garbage in after the null terminator
        }

        passwordLength--;

        var hashCh = webHash.substring(webhashIndex, webhashIndex + 2);
        var hashVal = parseInt(hashCh, 16);

        var newCh = (thisCh + hashVal) % 0xFF;
        checkSum += newCh;
        if (newCh < 16) {
            encrypted += "0";
        }
        encrypted += newCh.toString(16);

        webhashIndex += 2;
        if (webhashIndex >= webHash.length) {
            webhashIndex = 0;
        }
    }

    //calculate checksum and add to end
    var checkSumValue = 0xFFFF - (checkSum % 0xFFFF);
    var hexCheckSum = checkSumValue.toString(16);
    encrypted += hexCheckSum;

    return encrypted;
}

function hashWithPrivKey(firstHash) {
    //privKey
    var privateKey = generateModulusKey();
    //take sha256 of priv
    var encryptHash = Sha256.hash(privateKey.toString());
    var privateKeyIndex = 0;
    var encrypted = '';

    //rotate with Private Key
    for (var i = 0; i < firstHash.length; i += 2) {
        var thisCh = firstHash.substring(i, i + 2);
        var pwVal = parseInt(thisCh, 16);
        var hashCh = encryptHash.substring(privateKeyIndex, privateKeyIndex + 2);
        var hashVal = parseInt(hashCh, 16);
        var newCh = (pwVal + hashVal) % 0xFF;

        if (newCh < 16) {
            encrypted += "0";
        }
        encrypted += newCh.toString(16);

        privateKeyIndex += 2;
        if (privateKeyIndex >= encryptHash.length) {
            privateKeyIndex = 0;
        }
    }

    return encrypted;
}

function decryptFirstStage(topCrypt) {
    //privKey
    var privateKey = generateModulusKey();
    var decryptHash = Sha256.hash(privateKey.toString());
    var privateKeyIndex = 0;
    var decrypt = '';

    //unrotate from private Key
    for (var i = 0; i < topCrypt.length; i += 2) {
        var thisCh = topCrypt.substring(i, i + 2);
        var pwVal = parseInt(thisCh, 16);
        var hashCh = decryptHash.substring(privateKeyIndex, privateKeyIndex + 2);
        var hashVal = parseInt(hashCh, 16);
        var newCh = (pwVal - hashVal);
        if (newCh < 0) newCh += 0xFF;
        if (newCh < 16) {
            decrypt += "0";
        }
        decrypt += newCh.toString(16);

        privateKeyIndex += 2;
        if (privateKeyIndex >= decryptHash.length) {
            privateKeyIndex = 0;
        }
    }

    return decrypt;
}

//Debugging only
function decryptVal(value) {
    //here we're receiving a raw hex value
    var topCrypt = createHexString(value);
    decryptString(topCrypt);
}

function decrypt() {
    var hashId = document.getElementById('decryptStr');
    var topCrypt = hashId.innerHTML;
    var plainText = decryptString(topCrypt);
    hashId.innerHTML = 'PW: ' + decrypt;
}

function decryptString(encryptedString) {
    //var hashId = document.getElementById('decryptStr');
    //var topCrypt = hashId.innerHTML;
    var topCrypt = encryptedString;
    var hashStr = decryptFirstStage(topCrypt);
    var webHash = Sha256.hash(website.toString());

    //first get the checksum value
    var checkSumStr = hashStr.substring(hashStr.length - 4, hashStr.length);
    var checkSumVal = parseInt(checkSumStr, 16);

    var total = 0;
    var decrypt = '';
    var thisCh = '';
    var webhashIndex = 0;
    var zeroTerm = 0;

    //now unrotate
    for (var i = 0; i < (hashStr.length - 4) ; i += 2) {
        thisCh = hashStr.substring(i, i + 2);
        var pwVal = parseInt(thisCh, 16);
        var hashCh = webHash.substring(webhashIndex, webhashIndex + 2);
        var hashVal = parseInt(hashCh, 16);
        var newCh = (pwVal - hashVal);
        if (newCh < 0) newCh += 0xFF;
        total += pwVal;

        if (zeroTerm == 0) {
            decrypt += String.fromCharCode(newCh);
        }

        webhashIndex += 2;
        if (webhashIndex >= webHash.length) {
            webhashIndex = 0;
        }

        if (newCh == 0) {
            zeroTerm = 1;
        }
    }

    total = total % 0xFFFF;
    var checkSum = checkSumVal + total;
    if (checkSum != 0xFFFF) {
        decrypt = '!!!!NO PASSWORD';
    }

    return decrypt;
}

function getPassword() {
    hidePasswordBox();
    var loc = document.getElementById('output');
    loc.innerHTML = '... Scanning for Password ...';
    //get relevant address
    var privateKeyRead = generateModulusKey();
    var addressRead = privateKeyRead.toAddress();
    txids = [];
    cryptos = [];


    //get all entries at this addr
    insight.address(addressRead, function (err, addressInfo) {
        for (i = 0; i < addressInfo.transactionIds.length; i++) {
            txids[i] = addressInfo.transactionIds[i];
        }

        if (txids.length > 0) {
            aClient.get(txids[0], function (response) {
                processTxData(response);
            });
        }
        else {
            outputStr = 'No stored passwords found for this website.';
            loc.innerHTML = outputStr;
        }
    });    //insight*/
}


function processCryptos() {
    var loc = document.getElementById('output');
    var displayed = 0;
    for (i = 0; i < cryptos.length; i++) {
        //try to decrypt these cryptos
        var plainText = decryptString(cryptos[i]);
        if (plainText.indexOf("!!!!NO PASSWORD") < 0) {
            //found the password
            showPasswordBox();

            var plaintext = document.getElementById('plainText');
            plaintext.innerHTML = plainText;
            displayed = 1;
            loc.innerHTML = '';
        }
    }

    if (displayed == 0) {
        loc.innerHTML = 'No stored passwords found for this website.';
    }
}

function processTxData(response) {
    var blockData = JSON.parse(response);
    var outputs = blockData.data.outputs;

    for (i = 0; i < outputs.length; i++) {
        var script_key = outputs[i].script_pub_key_string;

        var anal = script_key.indexOf("RETURN");

        if (anal >= 0) {
            var start = script_key.indexOf('[');
            var end = script_key.indexOf(']');
            var key_entry = script_key.substring(start + 1, end);
            cryptos.push(key_entry);
        }
    }

    //now get next set of data
    txIndex++;
    if (txIndex < txids.length) {
        aClient.get(txids[txIndex], function (response) {
            processTxData(response);
        });
    }
    else {
        processCryptos();
    }
}

function hex2a(hexx) {
    var hex = hexx.toString(); //force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
}


Number.prototype.toFixedDown = function (digits) {
    var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
        m = this.toString().match(re);
    return m ? parseFloat(m[1]) : this.valueOf();
};

function getBitcoinAddress(addrStr)
{
    var addrStrSpaced = 'Wallet Addr: ';
    var remain = addrStr.length;
    for (var i = 0; i < addrStr.length; i += 12) {
        var sz = Math.min(remain, 12);
        addrStrSpaced += addrStr.substring(i, i + sz);
        //addrStrSpaced += '</br>';
        remain -= 12;
    }

    return addrStrSpaced;
}

function tokenise(wordlist) {
    var splitStr = wordlist.split(" ");

    return splitStr;
}

function checkUTF8(input) {
    for (var i = 0; i < input.length; i++) {
        if (input.charCodeAt(i) > 0xFF) {
            return false;
        }
    }

    return true;
}

function parseHexString(str) {
    var result = [];
    while (str.length >= 2) {
        result.push(parseInt(str.substring(0, 2), 16));

        str = str.substring(2, str.length);
    }

    return result;
}

function createHexString(arr) {
    var result = "";
    var z;

    for (var i = 0; i < arr.length; i++) {
        var str = arr[i].toString(16);
        if (arr[i] < 16) {
            str = "0" + str;
        }

        result += str;
    }

    return result;
}