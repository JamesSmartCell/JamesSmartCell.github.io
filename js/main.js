
//hi
// handles the click event for link 1, sends the query
function getOutput() {
    getRequest(
      'ajaxer.php', // URL for the PHP file
       drawOutput,  // handle successful request
       drawError    // handle error
  );
  return false;
}

// handles the click event for link 1, sends the query
function openGate() {
    var container = document.getElementById('output');
    container.innerHTML = '';
    gateOpening();

    document.getElementById('trekswoosh').play();

    getRequest(
      'openHandler.php', // URL for the PHP file
       drawOutput,  // handle successful request
       drawError    // handle error
  );
    return false;
}

// handles the click event for link 1, sends the query
function closeGate() {
    var container = document.getElementById('output');
    container.innerHTML = '';
    gateClosing();

    document.getElementById('click2').play(); 

    getRequest(
      'closeHandler.php', // URL for the PHP file
       drawOutputClosed,  // handle successful request
       drawError    // handle error
  );
    return false;
}

// handles drawing an error message
function drawError() {
    var container = document.getElementById('output');
    container.innerHTML = 'Bummer: there was an error!';
}

// handles the response, adds the html
function drawOutput(responseText) {
    var container = document.getElementById('output');
    container.innerHTML = '';

    if (responseText.indexOf("Gate Open") > 0) {
        document.getElementById('click1').play(); 
        gateOpen();
    }
    else {
        var str1 = 'Error connecting to Gate ';
        var res = str1.concat(responseText);
        container.innerHTML = res;
        gateClosed();
    }
}

// handles the response, adds the html
function drawOutputClosed(responseText) {
    var container = document.getElementById('output');
    container.innerHTML = '';

    if (responseText.indexOf("Gate Closed") > 0 || responseText == 'Gate Closed') {
        document.getElementById('click1').play(); 
        gateClosed();
    }
    else {
        var str1 = 'Error connecting to Gate ';
        var res = str1.concat(responseText);
        container.innerHTML = res;
        gateOpen();
    }
}

function gateOpening() {
    var openButton = document.getElementById('gateopen');
    var openingButton = document.getElementById('gateopening');
    var closingButton = document.getElementById('gateclosing');
    var closeButton = document.getElementById('gateclose');

    openButton.style.display = 'none';
    openingButton.style.display = '';
    closingButton.style.display = 'none';
    closeButton.style.display = 'none';
}

function gateClosed() {
    var openButton = document.getElementById('gateopen');
    var openingButton = document.getElementById('gateopening');
    var closingButton = document.getElementById('gateclosing');
    var closeButton = document.getElementById('gateclose');

    openButton.style.display = '';
    openingButton.style.display = 'none';
    closingButton.style.display = 'none';
    closeButton.style.display = 'none';
}

function gateOpen() {
    var openButton = document.getElementById('gateopen');
    var openingButton = document.getElementById('gateopening');
    var closingButton = document.getElementById('gateclosing');
    var closeButton = document.getElementById('gateclose');

    openButton.style.display = 'none';
    openingButton.style.display = 'none';
    closingButton.style.display = 'none';
    closeButton.style.display = '';
}

function gateClosing() {
    var openButton = document.getElementById('gateopen');
    var openingButton = document.getElementById('gateopening');
    var closingButton = document.getElementById('gateclosing');
    var closeButton = document.getElementById('gateclose');

    openButton.style.display = 'none';
    openingButton.style.display = 'none';
    closingButton.style.display = '';
    closeButton.style.display = 'none';
}


// helper function for cross-browser request object
function getRequest(url, success, error) {
    var req = false;
    try {
        // most browsers
        req = new XMLHttpRequest();
    } catch (e) {
        // IE
        try {
            req = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            // try an older version
            try {
                req = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
                return false;
            }
        }
    }
    if (!req) return false;
    if (typeof success != 'function') success = function () { };
    if (typeof error != 'function') error = function () { };
    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            return req.status === 200 ?
                success(req.responseText) : error(req.status);
        }
    }
    req.open("POST", url, true);
    req.send(null);
    return req;
}