//var http = require('https');
var bitcore = require('bitcore-lib');
var Mnemonic = require('bitcore-mnemonic');
var explorers = require('bitcore-explorers');
var Message = require('bitcore-message');
var insight = new explorers.Insight();
//var Buffer = bitcore.Buffer;
var Buffer = bitcore.deps.Buffer;

var xmlHttp = new XMLHttpRequest();

var HttpClient = function ()
{
    this.get = function (txid, aCallback)
    {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function ()
        {
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
            else if (anHttpRequest.readyState == 4)
                transactionFail();
        }

        var fullURL = 'https://api.biteasy.com/blockchain/v1/transactions/' + txid;

        anHttpRequest.open("GET", fullURL, true);
        anHttpRequest.send(null);
    }
}

var hdCode;
var xpriv;
var aClient;
var txids = [];
var cryptos = [];
var txIndex = 0;
var keyDeriv = 1;
var minerFee = 6000;
var nominalTransactionAmount = 6000;
var seed;
var fundingUTXO;

var privateKeyUse;

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

function hidePasswordBox()
{
    var passwordBox = document.getElementById('showHidePassword');
    passwordBox.style.display = 'none';
}

function showPasswordBox()
{
    var passwordBox = document.getElementById('showHidePassword');
    passwordBox.style.display = '';

    var plaintext = document.getElementById('plainText');
    var covered = document.getElementById('passwordText');

    plaintext.style.display = 'none';
    covered.style.display = '';
}

function togglePassword()
{
    var plaintext = document.getElementById('plainText');
    var covered = document.getElementById('passwordText');
    var btnText = document.getElementById('revealPw');

    if (plaintext.style.display == '')
    {
        plaintext.style.display = 'none';
        covered.style.display = '';
        btnText.innerHTML = 'Reveal Password';
    }
    else
    {
        plaintext.style.display = '';
        covered.style.display = 'none';
        btnText.innerHTML = 'Hide Password';
    }
}

function loadStartData()
{
    //get word list
    var secret = document.getElementById('secret');
    var secretStr = secret.value;
    var balance = document.getElementById('balance');
    var qr = document.getElementById('qrcodeTable');
    var storage = document.getElementById('storage');
    var generator = document.getElementById('generate'); 

    var outputTxt = document.getElementById('output');
    var locationTxt = document.getElementById('location');
    var storageBox = document.getElementById('storePassword');
    
    outputTxt.innerHTML = '';
    locationTxt.innerHTML = '';
    storageBox.style.display = 'none';

    hidePasswordBox();

    //secret is WIF
    privateKeyUse = bitcore.PrivateKey.fromWIF(secretStr);
    //var keyPair = bitcore.ECPair.fromWIF(secretStr);
    var message = 'This is an example of a signed message.';
    //var signature = bitcoin.message.sign(keyPair, message);
    var signature = Message(message).sign(privateKeyUse);

    var msg = new Message(message);
    msg.sign(privateKeyUse);

    //balance.innerHTML = signature.toString('base64');

    var address = privateKeyUse.toAddress();

    var verified = Message(message).verify(address, signature);

    storage.style.display = '';
    storage.innerHTML = '';

    var memorable = document.getElementById('entermemorable');
    memorable.style.display = 'none';
    memorable.innerHTML = '';
    generator.style.display = 'none';
    secret.innerHTML = '';
    secret.style.display = 'none';
    secret.value = '';

    /*if (verified == true) {
        storage.innerHTML = 'Verified';
    }
    else {
        storage.innerHTML = 'Fake';
    }*/

;

    //tokenise
    /*var wordList2 = tokenise(secretStr);

    if (wordList2.length < 5)
    {
        balance.innerHTML = '<h2>Please use at least 5 words in your passphrase</h2>';
        return;
    }

    hdCode = new Mnemonic(wordList2);
    xprv = hdCode.toHDPrivateKey(secretStr);
    var privateKey0 = getPrivateKey(0);
    var address = privateKey0.toAddress();

    aClient = new HttpClient();

    qr.innerHTML = '';

    var width = document.getElementById("maincontainer").offsetWidth;

    var qrWidth = 256;
    var qrHeight = 256;

    if (width < 750)
    {
        qrWidth = 150;
        qrHeight = 150;
    }

    balance.innerHTML = '...... getting data from blockchain .......';

    storage.style.display = '';

    jQuery('#qrcodeTable').qrcode({
        text: 'bitcoin:' + address,
        width		: qrWidth,
	    height		: qrHeight,
    });

    var numAddr = document.getElementById('bitcoinAddr');
    var numAddrStr = getBitcoinAddress(address.toString());
    numAddr.innerHTML = numAddrStr;

    displayRemainingBitcoins();*/

    updateQR();
}

function updateQR() 
{
    //update the QR code
    //current time
    var qr = document.getElementById('qrcodeTable');
    qr.innerHTML = '';

    var width = document.getElementById("maincontainer").offsetWidth;

    var qrWidth = 256;
    var qrHeight = 256;

    if (width < 750)
    {
        qrWidth = 150;
        qrHeight = 150;
    }

    var d = new Date();
    var n = d.getTime();
    n = Math.floor(n / (1000 * 60)); //convert to mins

    //var minutes = d.getMinutes();
    //minutes = Math.floor(minutes / 10);
    //minutes = minutes * 10;

    //now convert to closest 10 mins
    //var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());

    var balance = document.getElementById('balance');
    var timeStr = n.toString();

    var signature = Message(timeStr).sign(privateKeyUse);

    balance.innerHTML = '';// signature.toString('base64');

    var address = privateKeyUse.toAddress();

    var ticketID = 1024;

    var QRString = ticketID.toString() + signature.toString('base64');

    var QRdata = address.toString() + ',' + signature;

    var humanTimeStr  = d.getHours() + ":" + d.getMinutes();

    balance.innerHTML = n.toString();

    var qrcode = new QRCode("qrcodeTable", {
    text: QRdata,
    width: 350,
    height: 350,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.L
    });

    //now do QR
    /*.jQuery('#qrcodeTable').qrcode({
        text        : QRdata,
        width		: qrWidth,
	    height		: qrHeight,
	    correctLevel: QRCode.CorrectLevel.H,
    });*/

    setTimeout(function () { updateQR(); }, 30000);
}

function displayRemainingBitcoins()
{
    //1. get repository bitcoins
    var privateKey0 = getPrivateKey(0);
    var address0 = privateKey0.toAddress();
    var privateKey1 = getPrivateKey(1);
    var address1 = privateKey1.toAddress();

    fundingUTXO = null;
    var satoshis = 0;
    var bitcoinAmount = 0;

    //see how many bitcoins are in our storage area, find first utxo that has available funds
    insight.getUnspentUtxos(address0, function (error, utxos)
    {
        var newPasswordBtn = document.getElementById('enterPw');
        satoshis += getFundsAtAddress(utxos, 0);  //100000  == 1mBTC
        if (satoshis < (nominalTransactionAmount + minerFee))
        {
            balance.innerHTML = 'No available credit. Please store funds in your private funding address.';
            newPasswordBtn.style.display = 'none';
            var memorable = document.getElementById('entermemorable');
            memorable.style.display = '';
        }
        else
        {
            var passwordCount = satoshis / (nominalTransactionAmount + minerFee);
            var ctx = passwordCount.toFixedDown(0);
            bitcoinAmount = satoshis / 100000.0;
            balance.innerHTML = 'Available credits = ' + bitcoinAmount + 'mBTC' + ' [' + ctx + ' units of storage]';
            newPasswordBtn.style.display = '';

            var memorable = document.getElementById('entermemorable');
            memorable.style.display = 'none';
        }

        var website = document.getElementById('website');
        website.style.display = '';
        var loc = document.getElementById('location');
        loc.innerHTML = '';
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

                if (amount > (minerFee + nominalTransactionAmount) && fundingUTXO == null)
                {
                    fundingUTXO = utxos[i];
                }
            }
        }
    }

    return satoshis;
}

function writePassword()
{
    hidePasswordBox();
    var balance = document.getElementById('balance');
    //first check password not too long
    var password = password1.value;
    if (password.length > 35)
    {
        balance.innerHTML = 'Invalid Password - cannot be longer than 35 letters';
        return;
    }

    //storePassword();
    var encrypted = getEncryptedPassword();   

    if (encrypted.length < 10)
    {
        balance.innerHTML = 'Invalid Password - must be ascii characters only';
        return;
    }

    //now attempt the write
    if (fundingUTXO == null)
    {
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

    insight.broadcast(txSerialized, function (error, body)
    {
        if (error)
        {
            balance.innerHTML = 'Error in broadcast: ' + error;
        }
        else
        {
            //refresh page
            var loc = document.getElementById('location');
            loc.innerHTML = 'Transaction successful. Password stored on blockchain.';
            setTimeout(function() {displayRemainingBitcoins();},3000);
        }
    });
}

function enterPassword()
{
    hidePasswordBox();
    //bring up new box
    var website = document.getElementById('storePassword');
    website.style.display = '';
}

function generateModulusKey()
{
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

function getEncryptedPassword()
{
    var firstHash = hashWithWebhash();
    var secondHash = hashWithPrivKey(firstHash);

    return secondHash;
}

function storePassword()
{
    var firstHash = hashWithWebhash();
    var secondHash = hashWithPrivKey(firstHash);
    var decrypt = document.getElementById('decrypt');
    decrypt.style.display = '';
    var decryptStr = document.getElementById('decryptStr');
    decryptStr.innerHTML = secondHash;
}

function hashWithWebhash()
{
    var webHash = Sha256.hash(website.toString());
    var loc = document.getElementById('location');
    var crypto = window.crypto || window.msCrypto;
    var buf = new Uint8Array(2);
    
    var password = password1.value;
    //loc.innerHTML = 'NewHash: ' + webHash.toString() + 'p ' + password;
    
    var checkSum = 0;
    var encrypted = '';
    var passwordLength = password.length;
    var webhashIndex = 0;

    //now rotate password with webhash
    for (var i = 0; i < 36; i++)
    {
        var thisCh = 0;
        if (passwordLength > 0)
        {
            thisCh = password.charCodeAt(i);
        }
        else if (passwordLength < 0)
        {
            var randomVal;
            if (crypto == null)
            {
                randomVal = Math.round(Math.random()*0xff); //not perfect, but fallback for incompatible browsers, lastest builds of IE, Chrome and Firefox use the crypto value
            }
            else
            {
                crypto.getRandomValues(buf);
                randomVal = buf[0];
            }
            thisCh = randomVal;// //put garbage in after the null terminator
        }

        passwordLength--;

        var hashCh = webHash.substring(webhashIndex, webhashIndex + 2);
        var hashVal = parseInt(hashCh, 16);

        var newCh = (thisCh + hashVal) % 0xFF;
        checkSum += newCh;
        if (newCh < 16)
        {
            encrypted += "0";
        }
        encrypted += newCh.toString(16);

        webhashIndex += 2;
        if (webhashIndex >= webHash.length)
        {
            webhashIndex = 0;
        }
    }

    //calculate checksum and add to end
    var checkSumValue = 0xFFFF - (checkSum % 0xFFFF);
    var hexCheckSum = checkSumValue.toString(16);
    encrypted += hexCheckSum;

    return encrypted;
}

function hashWithPrivKey(firstHash)
{
    //privKey
    var privateKey = generateModulusKey();
    //take sha256 of priv
    var encryptHash = Sha256.hash(privateKey.toString());
    var privateKeyIndex = 0;
    var encrypted = '';

    //rotate with Private Key
    for (var i = 0; i < firstHash.length; i += 2)
    {
        var thisCh = firstHash.substring(i, i + 2);
        var pwVal = parseInt(thisCh, 16);
        var hashCh = encryptHash.substring(privateKeyIndex, privateKeyIndex + 2);
        var hashVal = parseInt(hashCh, 16);
        var newCh = (pwVal + hashVal) % 0xFF;

        if (newCh < 16)
        {
            encrypted += "0";
        }
        encrypted += newCh.toString(16);

        privateKeyIndex += 2;
        if (privateKeyIndex >= encryptHash.length)
        {
            privateKeyIndex = 0;
        }
    }

    return encrypted;
}

function decryptFirstStage(topCrypt)
{
    //privKey
    var privateKey = generateModulusKey();
    var decryptHash = Sha256.hash(privateKey.toString());
    var privateKeyIndex = 0;
    var decrypt = '';

    //unrotate from private Key
    for (var i = 0; i < topCrypt.length; i += 2)
    {
        var thisCh = topCrypt.substring(i, i + 2);
        var pwVal = parseInt(thisCh, 16);
        var hashCh = decryptHash.substring(privateKeyIndex, privateKeyIndex + 2);
        var hashVal = parseInt(hashCh, 16);
        var newCh = (pwVal - hashVal);
        if (newCh < 0) newCh += 0xFF;
        if (newCh < 16)
        {
            decrypt += "0";
        }
        decrypt += newCh.toString(16);

        privateKeyIndex += 2;
        if (privateKeyIndex >= decryptHash.length)
        {
            privateKeyIndex = 0;
        }
    }

    return decrypt;
}

//Debugging only
function decryptVal(value)
{
    //here we're receiving a raw hex value
    var topCrypt = createHexString(value);
    decryptString(topCrypt);
}

function decrypt()
{
    var hashId = document.getElementById('decryptStr');
    var topCrypt = hashId.innerHTML;
    var plainText = decryptString(topCrypt);
    hashId.innerHTML = 'PW: ' + decrypt;
}

function decryptString(encryptedString)
{
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
    for (var i = 0; i < (hashStr.length - 4); i+=2)
    {
        thisCh = hashStr.substring(i, i + 2);
        var pwVal = parseInt(thisCh, 16);
        var hashCh = webHash.substring(webhashIndex, webhashIndex + 2);
        var hashVal = parseInt(hashCh, 16);
        var newCh = (pwVal - hashVal);
        if (newCh < 0) newCh += 0xFF;
        total += pwVal;

        if (zeroTerm == 0)
        {
            decrypt += String.fromCharCode(newCh);
        }

        webhashIndex += 2;
        if (webhashIndex >= webHash.length)
        {
            webhashIndex = 0;
        }

        if (newCh == 0)
        {
            zeroTerm = 1;
        }
    }

    total = total % 0xFFFF;
    var checkSum = checkSumVal + total;
    if (checkSum != 0xFFFF)
    {
        decrypt = '!!!!NO PASSWORD';
    }

    return decrypt;
}

function getPassword()
{
    hidePasswordBox();
    var loc = document.getElementById('output');
    loc.innerHTML = '... Scanning for Password ...';
    //get relevant address
    var privateKeyRead = generateModulusKey();
    var addressRead = privateKeyRead.toAddress();
    txids = [];
    cryptos = [];
    

    //get all entries at this addr
    insight.address(addressRead, function (err, addressInfo)
    {
        for (i = 0; i < addressInfo.transactionIds.length; i++)
        {
            txids[i] = addressInfo.transactionIds[i];
        }

        if (txids.length > 0)
        {
            aClient.get(txids[0], function (response)
            {
                processTxData(response);
            });
        }
        else
        {
            outputStr = 'No stored passwords found for this website.';
            loc.innerHTML = outputStr;
        }
    });    //insight*/
}

function transactionFail()
{
    var loc = document.getElementById('output');
    loc.innerHTML = 'Transaction not yet written to blockchain. Wait for 30 seconds.';
}

function processCryptos()
{
    var loc = document.getElementById('output');
    var displayed = 0;
    for (i = 0; i < cryptos.length; i++)
    {
        //try to decrypt these cryptos
        var plainText = decryptString(cryptos[i]);
        if (plainText.indexOf("!!!!NO PASSWORD") < 0)
        {
            //found the password
            showPasswordBox();

            var plaintext = document.getElementById('plainText');
            plaintext.innerHTML = plainText;
            displayed = 1;
            loc.innerHTML = '';
        }
    }

    if (displayed == 0)
    {
        loc.innerHTML = 'No stored passwords found for this website.';
    }
}

function processTxData(response)
{
    var blockData = JSON.parse(response);
    var outputs = blockData.data.outputs;

    for (i = 0; i < outputs.length; i++)
    {
        var script_key = outputs[i].script_pub_key_string;

        var anal = script_key.indexOf("RETURN");

        if (anal >= 0)
        {
            var start = script_key.indexOf('[');
            var end = script_key.indexOf(']');
            var key_entry = script_key.substring(start + 1, end);
            cryptos.push(key_entry);
        }
    }

    //now get next set of data
    txIndex++;
    if (txIndex < txids.length)
    {
        aClient.get(txids[txIndex], function (response)
        {
            processTxData(response);
        }); 
    }
    else
    {
        processCryptos();
    }
}

function hex2a(hexx)
{
    var hex = hexx.toString(); //force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
    {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
}


Number.prototype.toFixedDown = function (digits)
{
    var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
        m = this.toString().match(re);
    return m ? parseFloat(m[1]) : this.valueOf();
};

function getBitcoinAddress(addrStr)
{
    var addrStrSpaced = '';
    var remain = addrStr.length;
    for (var i = 0; i < addrStr.length; i+=12)
    {
        var sz = Math.min(remain, 12);
        addrStrSpaced += addrStr.substring(i, i + sz);
        addrStrSpaced += '</br>';
        remain -= 12;
    }

    return addrStrSpaced;
}

function tokenise(wordlist)
{
    var splitStr = wordlist.split(" ");

    return splitStr;
}

function checkUTF8(input)
{
    for (var i = 0; i < input.length; i++)
    {
        if (input.charCodeAt(i) > 0xFF)
        {
            return false;
        }
    }

    return true;
}

function parseHexString(str)
{
    var result = [];
    while (str.length >= 2)
    {
        result.push(parseInt(str.substring(0, 2), 16));

        str = str.substring(2, str.length);
    }

    return result;
}

function createHexString(arr)
{
    var result = "";
    var z;

    for (var i = 0; i < arr.length; i++)
    {
        var str = arr[i].toString(16);
        if (arr[i] < 16)
        {
            str = "0" + str;
        }

        result += str;
    }

    return result;
}