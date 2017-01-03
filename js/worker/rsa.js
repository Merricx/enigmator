importScripts("../enigmator.js","../lib/jsencrypt/jsencrypt.js");

var key = {};

function genKey(size){
	key = Enigmator.rsa.generateKeys(size);
}

self.addEventListener('message', function(e){
	var data = e.data;
	genKey(data);
	postMessage(key);
})