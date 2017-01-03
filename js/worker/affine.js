importScripts("../enigmator.js","../lib/qgr.js");

var result = [];

function start(input, alphabet){
	
	if(!alphabet) 
		alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

	for(var a=1; a <= 25; a+=2){
		if(a == 13)
			continue;
		for(var b=1; b <= 26; b++){
			var plain = Enigmator.affine.dec(input, a, b, alphabet);	
			var score = Enigmator.cryptanalysis.scoreText(plain);
			result.push([a, b, plain, score]);
		}
	}
	result.sort(function(a, b){ return b[3] - a[3] });
}

self.addEventListener('message', function(e){
	var data = e.data;
	start(data.input, data.alphabet);
	postMessage(result);
})