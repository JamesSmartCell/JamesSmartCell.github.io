//var http = require('https');

var bitcore = require('bitcore-lib');
// Set the network to testnet
//bitcore.Networks.defaultNetwork = bitcore.Networks.testnet;
var Mnemonic = require('bitcore-mnemonic');
var explorers = require('bitcore-explorers');
var insight = new explorers.Insight();

//var Buffer = bitcore.Buffer;
var Buffer = bitcore.deps.Buffer;
var Script = bitcore.Script;
var Opcode = bitcore.Opcode;

var xmlHttp = new XMLHttpRequest();

/**
 * Get transaction by txid
 * @param {string} txid
 * @param {GetTransactionCallback} callback
 */
/*
insight.prototype.getTransaction = function (txid, callback) {
    $.checkArgument(_.isFunction(callback));
    $.checkArgument(_.isString(txid));
    $.checkArgument(txid.length === 64);

    this.requestGet('/api/tx/' + txid, function (err, res, body) {
        if (err || res.statusCode !== 200) {
            return callback(err || res);
        }
        var tx = JSON.parse(body);

        return callback(null, tx);
    });
};*/



var HttpClient = function () {
    this.get = function (txid, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function () {
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }

        var fullURL = 'https://test-insight.bitpay.com/api/tx/' + txid;

        anHttpRequest.open("GET", fullURL, true);
        anHttpRequest.send(null);
    }
}

function getTx(txId)
{
    var aClient = new HttpClient();

    aClient.get(txId, function (response) {
        processTxData(response, txId);
    });
}

function processTxData(response, txId)
{
    var tx = JSON.parse(response);
    
    console.log(tx.txid);

    //find output scripts
    var voutArray = tx.vout;
    for (i = 0; i < voutArray.length; i++)
    {
        var output = voutArray[i];
        var scriptPubKey = output.scriptPubKey;
        var transHex = scriptPubKey.hex;

        var raw_script = new Buffer(transHex, 'hex');
        var s = new Script(raw_script);
        console.log(s.toString());

        substring = "1 0x79 OP_SHA256 OP_EQUALVERIFY OP_DUP OP_HASH160"; ////TODO: perform actual detection of ante - this is sufficient for now
        if (s.toString().includes(substring))
        {
            //found Ante coin
            spendStrange2(output, txId, i);
        }
    }
}

function assert(condition, message) {
    if (!condition) {
        message = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message; // Fallback
    }
}

function getUTXO(userID, anteAmount) {
    var privateKey = getPrivateKey(userID);
    var address = privateKey.toAddress();

    fundingUTXO = null;
    var satoshis = 0;
    var bitcoinAmount = 0;


    //see how many bitcoins are in our storage area, find first utxo that has available funds
    insight.getUnspentUtxos(address, function (error, utxos) {
        satoshis += getFundsAtAddress(utxos, 0);  //100000  == 1mBTC
        createScriptInner(userID, utxos, anteAmount, satoshis);
    });
}

function unlockStrangeBitcoin()
{
    'a0d163fa3b2902075ba3d5a7f1297623e615e0c308cc335da59559cdcf40a8f3'
}

function spendStrange1(txId)
{
    var aClient = new HttpClient();

    aClient.get(txId, function (response) {
        spendStrange2(response);
    });
}

function spendStrange2(output, txId, index)
{
    var AliceNumber = 12345678;
    var AliceKey = getPrivateKey(3);
    var AliceAddr = AliceKey.toAddress();
    var satoshis2 = output.value;
    var satoshis = bitcore.Unit.fromBTC(satoshis2).toSatoshis();

    var scriptPubKey = output.scriptPubKey;
    var transHex = scriptPubKey.hex;
    var raw_script = new Buffer(transHex, 'hex');
    var s = new Script(raw_script);

    //this output is effectively a UTXO, try to spend it!
    //we have to formulate our own custom UTXO
    var utxo = {
        "txId": txId,
        "outputIndex": index,
        "address": AliceAddr,
        "script": s,
        "satoshis": satoshis
    };

    var sequenceNumber = 4294967295;
    var param = {};
    param.prevTxId = txId;
    param.outputIndex = index;
    param.sequenceNumber = sequenceNumber;
    param.script = s;
    var input = new bitcore.Transaction.Input(param);
    var txFee = bitcore.Unit.fromBTC(0.0006).toSatoshis();


    var tx = new bitcore.Transaction()
        .from(utxo)
        .to(AliceAddr, 9000)

    var AliceNumberHex = AliceNumber.toString(16);

    unlockingScript = new Script();   
    unlockingScript.add(new Buffer(AliceKey.toPublicKey().toString(), 'hex')); //public key
    unlockingScript.add(new Buffer(AliceNumberHex.toString(), 'hex'));
    console.log(unlockingScript.toString());
    console.log(unlockingScript);

    //var s = unlockingScript.toScriptHashOut();

    var input0 = tx.inputs[0];
    var script5 = input0._script;
    input0._script = unlockingScript;

    tx.inputs[0]._script = unlockingScript;
    tx.inputs[0]._scriptBuffer = unlockingScript.toBuffer();

    console.log(tx.toJSON());

    var sTx = tx.uncheckedSerialize();
    
    //try to push the transaction - currently this fails, for unknown reason. There shouldn't be any need to sign anything given the script unlock doesn't call for a signature.
    insight.broadcast(tx, function (error, body) {
        if (error) {
            console.log(error);
        }
        else {
            //get new balance
            displayRemainingBitcoins(userID, defaultCallback);
        }
    });

    //ok we got the relevant tx
}

function getTxA()
{
    getTx('47e5f3e89091c99d5b554e8249c8e4bc04ffdb5c209b3bbf8af66eb934c59f49');
}

function createScriptInner(userID, utxos, anteAmount, satoshis)
{
    var balance = document.getElementById('bitcoinBalance');
    var AliceNumber = 12345678;
    //var BobNumber = 123456789;

    var AliceHex = AliceNumber.toString(16);
    var hexbuf = new Buffer(AliceHex.toString(), 'hex');

    var AliceHash = bitcore.crypto.Hash.sha256(hexbuf);

    var AliceKey = getPrivateKey(3);
    var BobKey = getPrivateKey(2);

    var AliceAddr = AliceKey.toAddress();
    var BobAddr = BobKey.toAddress();

   
    var utxo = utxos[0];

    var BobPub = BobKey.toPublicKey();
    var BobAddrHash2 = BobKey.toAddress();
    var AliceCompressAddr = AliceKey.toPublicKey().toAddress();

    var scriptAliceNorm = bitcore.Script.buildPublicKeyHashOut(AliceAddr);
    var scriptBobNorm = bitcore.Script.buildPublicKeyHashOut(BobAddr);

    //standard pay to public key hash - for reference
    var scriptBob = Script()
        .add(Opcode.OP_DUP)
        .add(Opcode.OP_HASH160)
        .add(BobAddrHash2.hashBuffer) 
        .add(Opcode.OP_EQUALVERIFY)
        .add(Opcode.OP_CHECKSIG)

    //Ante locking script. Only unlocks when the encoder provides their actual secret (which will be written to blockchain).
    var scriptAliceAnte = Script()
        .add(new Buffer(AliceHash.toString(), 'hex'))  //load Alice Hash (previously recorded in the transaction) on stack
        .add(1)                             //load the real value of the secret when unlocking (we write this value after sig and Alice Key)
        .add(Opcode.OP_PICK)                //load real value (now there are 4 values on the stack, first is signature, second is Alice public key, third is Alice's secret hash and now we have Alice's secret value)
        .add(Opcode.OP_SHA256)              //Take SHA256 of Alice Secret value
        .add(Opcode.OP_EQUALVERIFY)         //Check if hash of Alice Secret and previously recorded Alice Hash match - removes both Alice Hashes from stack
        .add(Opcode.OP_DUP)                 //Next value on stack is Alice Public Key, duplicate it
        .add(Opcode.OP_HASH160)             //Hash to 160 (bitcoin addr)
        .add(AliceCompressAddr.hashBuffer)  //Load Alice Addr (previously recorded)
        .add(Opcode.OP_EQUALVERIFY)         //Check if they're equal - remove both
        .add(Opcode.OP_CHECKSIG)            //Finally check signature (TODO: when we understand more!)

    var output1 = new bitcore.Transaction.Output({
        script: scriptAliceAnte,
        satoshis: 10000
    });

    var transaction5 = new bitcore.Transaction()
      .from(utxo)
      .to(AliceAddr, satoshis - (10000 + minerFee))
      .change(AliceAddr)
      .addOutput(output1)
      .sign(AliceKey);

    var verify = transaction5.verify();

    console.log(AliceAddr.toString());

    var verify = transaction5.verify();

    var txSerialized = transaction5.serialize();

    insight.broadcast(txSerialized, function (error, body) {
        if (error) {
            console.log(error);
        }
        else {
            //get new balance
            displayRemainingBitcoins(userID, defaultCallback);
        }
    });

    balance.innerHTML = transaction5.toString();
}

var generatedPrivateKey = null;

function genKeyPair()
{
    //generate random number (note: this is NOT cryptographic random number, only JavaScript generator
    var rand = Math.random() * 1000000;
    generatedPrivateKey = getPrivateKey(rand);

    var address = generatedPrivateKey.toAddress().toString();
    var wif = generatedPrivateKey.toWIF();
    var publicKey = generatedPrivateKey.toPublicKey();

    var balance = document.getElementById('bitcoinAddr');
    balance.innerHTML = 'Address: ' + address + '<br>PrivateKey: ' + generatedPrivateKey.toString() + '<br>Public Key: ' + publicKey.toString() + '<br>WIF: ' + wif.toString();
}

function checkBalance() {
    var balance = document.getElementById('bitcoinBalance');
    balance.innerHTML = ' ... Summing UTXOs ... ';

    //1. get repository bitcoins
    var address = generatedPrivateKey.toAddress();

    fundingUTXO = null;
    var satoshis = 0;
    var bitcoinAmount = 0;

    //see how many bitcoins are in our storage area, find first utxo that has available funds
    insight.getUnspentUtxos(address, function (error, utxos) {
        satoshis += getFundsAtAddress(utxos, 0);  //100000  == 1mBTC
        var bitcoinAmount = satoshis / 100000.0;
        displayBitcoinAmount(bitcoinAmount);
    });
}

function displayBitcoinAmount(amount)
{
    var balance = document.getElementById('bitcoinBalance');
    balance.innerHTML = 'Current total of UTXOs: ' + amount;
}


function createBobTransaction(userID, utxos, anteAmount, satoshis) {
    var balance = document.getElementById('bitcoinBalance');
    //var AliceNumber = 12345678;
    var BobNumber = 123456789;

    var BobHex = BobNumber.toString(16);
    var hexbuf = new Buffer(BobHex.toString(), 'hex');

    var BobHash = bitcore.crypto.Hash.sha256(hexbuf);

    var AliceKey = getPrivateKey(3);
    var BobKey = getPrivateKey(2);

    var AliceAddr = AliceKey.toAddress();
    var BobAddr = BobKey.toAddress();


    var utxo = utxos[0];

    var BobPub = BobKey.toPublicKey();
    var BobAddrHash2 = BobKey.toAddress();
    var BobCompressAddr = BobKey.toPublicKey().toAddress();

    var scriptAliceNorm = bitcore.Script.buildPublicKeyHashOut(AliceAddr);
    var scriptBobNorm = bitcore.Script.buildPublicKeyHashOut(BobAddr);

    //standard pay to public key hash - for reference
    var scriptBob = Script()
        .add(Opcode.OP_DUP)
        .add(Opcode.OP_HASH160)
        .add(BobAddrHash2.hashBuffer)
        .add(Opcode.OP_EQUALVERIFY)
        .add(Opcode.OP_CHECKSIG)

    //Ante locking script. Only unlocks when the encoder provides their actual secret (which will be written to blockchain).
    var scriptBobAnte = Script()
        .add(new Buffer(BobHash.toString(), 'hex'))  //load Bob Hash (previously recorded in the transaction) on stack
        .add(1)                             //load the real value of the secret when unlocking (we write this value after sig and Bob Key)
        .add(Opcode.OP_PICK)                //load real value (now there are 4 values on the stack, first is signature, second is Bob public key, third is Bob's secret hash and now we have Bob's secret value)
        .add(Opcode.OP_SHA256)              //Take SHA256 of Bob Secret value
        .add(Opcode.OP_EQUALVERIFY)         //Check if hash of Bob Secret and previously recorded Bob Hash match - removes both Bob Hashes from stack
        .add(Opcode.OP_DUP)                 //Next value on stack is Bob Public Key, duplicate it
        .add(Opcode.OP_HASH160)             //Hash to 160 (bitcoin addr)
        .add(BobCompressAddr.hashBuffer)  //Load Bob Addr (previously recorded)
        .add(Opcode.OP_EQUALVERIFY)         //Check if they're equal - remove both
        .add(Opcode.OP_CHECKSIG)            //Finally check signature (TODO: when we understand more!)

    var output1 = new bitcore.Transaction.Output({
        script: scriptBobAnte,
        satoshis: 10000
    });

    var transaction5 = new bitcore.Transaction()
      .from(utxo)
      .to(BobAddr, satoshis - (10000 + minerFee))
      .change(BobAddr)
      .addOutput(output1)
      .sign(BobKey);

    var verify = transaction5.verify();

    console.log(BobAddr.toString());

    var verify = transaction5.verify();

    var txSerialized = transaction5.serialize();

    insight.broadcast(txSerialized, function (error, body) {
        if (error) {
            console.log(error);
        }
        else {
            //get new balance
            displayRemainingBitcoins(userID, defaultCallback);
        }
    });

    balance.innerHTML = transaction5.toString();
}

function createScriptA()
{
    //allocateInitialFunds(3, 100, defaultCallback);

    var rootKey = getPrivateKey(0);
    var balance = document.getElementById('bitcoinBalance');

    //transfer to accounts 1 and 2
    var bal1;
    var bal2;

    //allocateInitialFunds(2, 1000, defaultCallback);
    //allocateInitialFunds(userID, topUpAmount, defaultCallback);

    //get Alice UTXO
    var anteAmount = 50 * 100000;
    var aliceUTXO = getUTXO(3, anteAmount);
}


//0xecae7d092947b7ee4998e254aa48900d26d2ce1d
//0x6fb5da0b98cdfbf8c467ef41bef69edd5c43cd6336
//0x6FB5DA0B98CDFBF8C467EF41BEF69EDD5C43CD6336B8667227
//0x6fa2e3e3c57704708d345ca1dca75b4e2b0608c288
//0x6fae6bfcde342863b5bbce9b5b93ca06a2d7fabfd7


var xprv;
var seed;
var fundingUTXO;
var remainingFunds = 0;

var minerFee = 6000; //6000 satoshis for miner fee
var initialWalletFill = 100000 * 10; // Amount we fill the wallet with on creation, 500 mBTC
var voteAmount = 100000 * 5; //100 mBTC per vote
var speakerDebitAmt = 100000 * 1; //1 mBTC per 10 seconds


function getPrivateKey(modulus) {
    var newHDPriv;
    if (xprv == null) {
        var secretStr = "how about this for a private key";
        var wordList2 = tokenise(secretStr);

        hdCode = new Mnemonic(wordList2);
        xprv = hdCode.toHDPrivateKey(secretStr);
    }

    var derivedByNumber = xprv.derive(modulus);
    newHDPriv = derivedByNumber.privateKey;

    return newHDPriv;
}

$(document).ready(function () {
    loadStartData();
});

var hdCode;
var xpriv;

function initAddrs() {
    var secretStr = "how about this for a private key";
    var wordList2 = tokenise(secretStr);

    hdCode = new Mnemonic(wordList2);
    xprv = hdCode.toHDPrivateKey(secretStr);
}

function getSpeakerPriv(speakerID) {
    var speakerKey = getPrivateKey(speakerID + 10000);
    return speakerKey;
}

function getSpeakerAddr(speakerID) {
    var speakerKey = getSpeakerPriv(speakerID);
    return speakerKey.toAddress();
}

var QueryString = function () {
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = decodeURIComponent(pair[1]);
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
            query_string[pair[0]] = arr;
        } else {
            query_string[pair[0]].push(decodeURIComponent(pair[1]));
        }
    }
    return query_string;
}();

function defaultCallback(text) {
    console.log(text);
}

function loadStartData() {
    //get word list
    var secretStr = "how about this for a private key";
    var balance = document.getElementById('bitcoinBalance');

    //tokenise
    var wordList2 = tokenise(secretStr);

    if (wordList2.length < 5) {
        balance.innerHTML = '<h2>Please use at least 5 words in your passphrase</h2>';
        return;
    }

    hdCode = new Mnemonic(wordList2);
    xprv = hdCode.toHDPrivateKey(secretStr);

    if (QueryString.userAddress != null) {
        var userID = parseInt(QueryString.userAddress);
        displayUserAddress(userID, defaultCallback);
    }
    else if (QueryString.user != null) {
        var userID = parseInt(QueryString.user);
        if (QueryString.topUp != null) {
            var topUpAmount = parseInt(QueryString.topUp);
            allocateInitialFunds(userID, topUpAmount, defaultCallback);
        }
        else if (QueryString.speakerSpend != null) {
            var speakerID = parseInt(QueryString.speakerSpend);
            var speakerSpendAmount = parseInt(QueryString.Amount);
            generateSpend(userID, speakerID, speakerSpendAmount, defaultCallback);
        }
        else {
            displayRemainingBitcoins(userID, defaultCallback);
        }
    }
    else if (QueryString.speaker != null) {
        var speakerID = parseInt(QueryString.speaker) + 10000;
        if (QueryString.debit != null) {
            var speakerDebitAmount = parseInt(QueryString.debit);
            spendSpeaker(speakerID, speakerDebitAmount, defaultCallback);
        }
        else {
            displayRemainingBitcoins(speakerID, defaultCallback);
        }
    }
    else if (QueryString.speakerAddress != null) {
        var speakerID = parseInt(QueryString.speakerAddress);
        displaySpeakerAddress(speakerID, defaultCallback);
    }
    else if (QueryString.getPoolBalance != null) {
        displayRemainingBitcoins(0, defaultCallback);
    }
}

//API functions
function displayUserAddress(userID, callback) {
    var privateKey = getPrivateKey(userID);
    var address = privateKey.toAddress();
    var addrString = getBitcoinAddress(address.toString());
    callback(addrString);
}

function displaySpeakerAddress(speakerID, callback) {
    var privateKey = getPrivateKey(speakerID + 10000);
    var address = privateKey.toAddress();
    var addrString = getBitcoinAddress(address.toString());
    callback(addrString);
}

function checkSpeakerBalance(speakerID, callback) {
    displayRemainingBitcoins(speakerID + 10000, callback);
}

function allocateInitialFunds(userID, topUpAmount, callback) {
    var privateKey = getPrivateKey(0);
    var address = privateKey.toAddress();

    fundingUTXO = null;
    var satoshis = 0;
    var bitcoinAmount = 0;

    if (topUpAmount <= 1) topUpAmount = 10;

    var topUpSatoshis = topUpAmount * 100000;

    //see how many bitcoins are in our storage area, find first utxo that has available funds
    insight.getUnspentUtxos(address, function (error, utxos) {
        satoshis += getFundsAtAddress(utxos, 0);  //100000  == 1mBTC
        if (satoshis > topUpSatoshis) {
            //issue spend
            issueSpend(utxos, userID, satoshis, topUpSatoshis, callback);
        }
    });
}

//spends on a speaker
function generateSpend(userID, speakerID, amount, callback) {
    //issue spend if there are sufficient coins
    //1. get repository bitcoins
    var privateKey = getPrivateKey(userID);
    var address = privateKey.toAddress();

    fundingUTXO = null;
    var satoshis = 0;
    var bitcoinAmount = 0;
    var satoshisVote = amount * 100000;

    //see how many bitcoins are in our storage area, find first utxo that has available funds
    insight.getUnspentUtxos(address, function (error, utxos) {
        satoshis += getFundsAtAddress(utxos, 0);  //100000  == 1mBTC
        spendOnSpeaker(speakerID, userID, utxos, satoshis, satoshisVote, callback);
    });
}

function displayRemainingBitcoins(userID, callback) {
    //1. get repository bitcoins
    var privateKey = getPrivateKey(userID);
    var address = privateKey.toAddress();

    fundingUTXO = null;
    var satoshis = 0;
    var bitcoinAmount = 0;

    //see how many bitcoins are in our storage area, find first utxo that has available funds
    insight.getUnspentUtxos(address, function (error, utxos) {
        satoshis += getFundsAtAddress(utxos, 0);  //100000  == 1mBTC
        var bitcoinAmount = satoshis / 100000.0;
        callback(bitcoinAmount);
    });
}

function spendSpeaker(speakerID, amount, callback) {
    var speakerKey = getPrivateKey(speakerID);
    var speakerAddress = speakerKey.toAddress();

    //see how many bitcoins are in our storage area, find first utxo that has available funds
    insight.getUnspentUtxos(speakerAddress, function (error, utxos) {
        var satoshis = getFundsAtAddress(utxos, 0);  //100000  == 1mBTC
        speakerDebit(utxos, speakerKey, speakerAddress, satoshis, amount, callback);
    });
}



function getFundsAtAddress(utxos, level) {
    var satoshis = 0;
    if (utxos.length > 0) {
        for (var i = 0; i < utxos.length; i++) {
            if (utxos[i] != null) {
                var amount = bitcore.Unit.fromBTC(utxos[i].toObject().amount).toSatoshis();
                satoshis += amount;
                fundingUTXO = utxos[i];
            }
        }
    }

    return satoshis;
}

function issueSpend(utxos, userID, satoshis, topUpSatoshis, callback) {
    var privateKey = getPrivateKey(userID);
    var addressUser = privateKey.toAddress();

    var privateKeyFunds = getPrivateKey(0);
    var addressFunds = privateKeyFunds.toAddress();

    var tx = new bitcore.Transaction()
            .from(utxos)                     // funding pool UTXOs
            .to(addressUser, topUpSatoshis)  // send to new wallet instance
            .to(addressFunds, satoshis - (topUpSatoshis + minerFee)) //send remaining back to main pool
            .change(addressFunds)                    // Send change back to funding pool
            .sign(privateKeyFunds);                 // Signs the transaction

    var txSerialized = tx.serialize();

    insight.broadcast(txSerialized, function (error, body) {
        if (error) {
            callback(0)
        }
        else {
            //get new balance
            displayRemainingBitcoins(userID, callback);
        }
    });
}


function spendOnSpeaker(speakerID, userID, utxos, satoshis, amount, callback) {
    var speakerKey = getPrivateKey(speakerID + 10000);
    var speakerAddress = speakerKey.toAddress();

    var privateKey = getPrivateKey(userID);
    var address = privateKey.toAddress();

    var allowableSpend = amount;
    if (satoshis < (allowableSpend + minerFee)) {
        allowableSpend = satoshis - minerFee;
    }

    var remains = satoshis - (allowableSpend + minerFee);

    var tx;

    if (allowableSpend > 0) {

        if (remains == 0) {
            tx = new bitcore.Transaction()
            .from(utxos)                     // user's utxos
            .to(speakerAddress, allowableSpend)  // send to speaker's address
            .sign(privateKey);                 // Signs the transaction
        }
        else {
            tx = new bitcore.Transaction()
            .from(utxos)                     // user's utxos
            .to(speakerAddress, allowableSpend)  // send to speaker's address
            .to(address, satoshis - (allowableSpend + minerFee)) //send remaining back to user's wallet
            .change(address)                    // Send change back to user's wallet
            .sign(privateKey);                 // Signs the transaction
        }

        var txSerialized = tx.serialize();

        insight.broadcast(txSerialized, function (error, body) {
            if (error) {
                callback(0);
            }
            else {
                callback(remains / 100000.0);
            }
        });
    }
    else {
        callback(satoshis / 100000.0);
    }
}





function speakerDebit(utxos, speakerPrivKey, speakerWalletAddress, satoshis, amount, callback) {
    var poolKey = getPrivateKey(0);
    var poolAddr = poolKey.toAddress();

    var speakerDebitReCalc = amount * 100000;
    if (satoshis < (speakerDebitReCalc + minerFee)) {
        speakerDebitReCalc = satoshis - minerFee;
    }

    var newBalance = satoshis - (speakerDebitReCalc + minerFee);

    if (speakerDebitReCalc > 0) {
        var tx;

        if (newBalance == 0) {
            tx = new bitcore.Transaction()
            .from(utxos)                     // user's utxos
            .to(poolAddr, speakerDebitReCalc)
            .sign(speakerPrivKey);
        }
        else {
            tx = new bitcore.Transaction()
            .from(utxos)                     // user's utxos
            .to(poolAddr, speakerDebitReCalc)
            .to(speakerWalletAddress, satoshis - (speakerDebitReCalc + minerFee))
            .change(speakerWalletAddress)
            .sign(speakerPrivKey);
        }

        var txSerialized = tx.serialize();

        insight.broadcast(txSerialized, function (error, body) {
            if (error) {
                callback(0);
            }
            else {
                //return new balance
                callback(newBalance / 100000.0);
            }
        });
    }
    else {
        callback(satoshis / 100000.0);
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

function getBitcoinAddress(addrStr) {
    var addrStrSpaced = '';
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