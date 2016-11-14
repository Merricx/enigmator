/************************
Crypto Identifier
Use for Enigmator

Written by : Merricx
************************/

var result = {};

function startIdentify(text, type){

	type = type || "cipher";
	result = {};

	if(type == "encoding"){
		detectEncoding(text);
	}

	else if(type == "hash"){
		detectHash(text);
	}

	else if(type == "cipher"){
		detectUniqueCipher(text);
		if(result.possibleCipher.length < 1){
			detectClassicCipher(text);
		}
	}

	return result;
}

function detectHash(hash){

	hash = hash.replace(/\s+/g, "");

	var possibleHashType = [];

	var len = hash.length;
	var commonHash = ["MD5","SHA-1","SHA-256","RIPEMD-160","MD4","CRC-32"];

	if(/^[0-9a-f]+$/gi.test(hash)){

		if(len == 4){
			possibleHashType = ["CRC-16","fletcher-16"];
		}
		else if(len == 8){
			possibleHashType = ["CRC-32","fletcher-32","Adler32"];
		}
		else if(len == 16){
			possibleHashType = ["CRC-64","MySQL323 / old_password()"];
		}
		else if(len == 32){
			possibleHashType = ["MD5","MD4","MD2","LM/NTLM","HAVAL-128","RIPEMD-128","SNEFRU","Tiger-128"];
		}
		else if(len == 40){
			possibleHashType = ["SHA-1","RIPEMD-160","HAVAL-160","Tiger-160"];
		}
		else if(len == 48){
			possibleHashType = ["Tiger-192"];
		}
		else if(len == 56){
			possibleHashType = ["SHA-224","SHA-3 (Keccak-224)"];
		}
		else if(len == 60){
			possibleHashType = ["Oracle11"];
		}
		else if(len == 64){
			possibleHashType = ["SHA-256","SHA-3 (Keccak-256)","BLAKE-256","GOST","HAVAL-256","SNEFRU"];
		}
		else if(len == 70){
			possibleHashType = ["hMailServer"];
		}
		else if(len == 80){
			possibleHashType = ["RIPEMD-320"];
		}
		else if(len == 96){
			possibleHashType = ["SHA-384","SHA-3 (Keccak-384)"];
		}
		else if(len == 128){
			possibleHashType = ["SHA-512","SHA-3 (Keccak-512)","BLAKE-512","MD6","Whirlpool","JH"];
		}
	}
	else if(/^\*[A-F0-9]{40}$/g.test(hash)){
		possibleHashType = ["MySQL5 password()"];
	}
	else if(/^\$NT\$[a-f0-9]{32}$/g.test(hash)){
		possibleHashType = ["NTLM"];
	}
	else if(/^[A-F0-9]{32}\:[A-F0-9]{32}$/gi.test(hash)){
		possibleHashType = ["SAM (LM:NTLM)"];
	}
	else if(/^\$P\$[a-z0-9\/\.]+$/gi.test(hash)){
		possibleHashType = ["Wordpress PasswordHash()"];
	}
	else if(/^\$H\$[a-z0-9\/\.]+$/gi.test(hash)){
		possibleHashType = ["phpBB3 MD5()"];
	}
	else if(/^\$S\$[a-zA-Z0-9\/\.]+$/g.test(hash)){
		possibleHashType = ["Drupal7"];
	}
	else if(/^\$episerver\$\*0\*/gi.test(hash)){
		possibleHashType = ["Episerver"];
	}
	else if(/^[a-f0-9]{32}:[a-zA-Z0-9]{31}$/g.test(hash)){
		possibleHashType = ["Joomla"];
	}
	else if(/^\$(?:2y|2a)\$[0-9]{2}\$[a-zA-Z0-9\/\.]{53}$/g.test(hash)){
		possibleHashType = ["bcrypt()"];
	}
	else if(/^\$apr1\$/g.test(hash)){
		possibleHashType = ["MD5(APR)"];
	}
	else if(/^[a-zA-Z0-9\/\.]{13}$/g.test(hash)){
		possibleHashType = ["DES crypt()"];
	}
	else if(/^_J9\.\./g.test(hash)){
		possibleHashType = ["BSDI crypt()"];
	}
	else if(/^\$1\$[a-z0-9\.\/]{8}\$[a-z0-9\.\/]+$/gi.test(hash)){
		possibleHashType = ["MD5 crypt()"];
	}
	else if(/^\$5\$[a-z0-9\.\/]{8}\$[a-z0-9\.\/]+$/gi.test(hash)){
		possibleHashType = ["SHA-256 crypt()"];
	}
	else if(/^\$6\$[a-z0-9\.\/]{8}\$[a-z0-9\.\/]+$/gi.test(hash)){
		possibleHashType = ["SHA-512 crypt()"];
	}
	else if(/^0x[A-F0-9]{32}$/gi.test(hash)){
		possibleHashType = ["SQL Server HASHBYTES(MD5)"];
	}
	else if(/^0x[A-F0-9]{40}$/gi.test(hash)){
		possibleHashType = ["SQL Server HASHBYTES(SHA1)"];
	}
	else if(/^0x[A-F0-9]{64}$/gi.test(hash)){
		possibleHashType = ["SQL Server HASHBYTES(SHA256)"];
	}
	else if(/^0x[A-F0-9]{128}$/gi.test(hash)){
		possibleHashType = ["SQL Server HASHBYTES(SHA512)"];
	}
	else if(/^\$ml\$/gi.test(hash)){
		possibleHashType = ["OS X v10.8 / v10.9"];
	}
	else if(/^:B:[a-f0-9]{8}:[a-f0-9]{32}$/g.test(hash)){
		possibleHashType = ["MediaWiki B type"];
	}
	else if(/^:A:[a-f0-9]{32}$/g.test(hash)){
		possibleHashType = ["MediaWiki A type"];
	}
	else if(/^\$K4\$/g.test(hash)){
		possibleHashType = ["Kerberos AFS"];
	}
	else if(/^\$af\$/g.test(hash)){
		possibleHashType = ["Kerberos v4"];
	}
	else if(/^\$krb5\$/g.test(hash)){
		possibleHashType = ["Kerberos v5"];
	}
	else if(/^\$mskrb5\$/g.test(hash)){
		possibleHashType = ["MS Kerberos 5"];
	}
	else if(/^\+[a-zA-Z0-9\/\.]{12}$/g.test(hash)){
		possibleHashType = ["Eggdrop"];
	}
	else if(/^\$IPB2\$/g.test(hash)){
		possibleHashType = ["IPB2"];
	}
	
	//NEW HASH
	else if(/^\$argon2(?:i|d)\$/g.test(hash)){
		possibleHashType = ["Argon2"];
	}

	result.possibleHash = possibleHashType;

}

function detectClassicCipher(text){

	var possibleCipher = [];
	var cipherAlgo = [];
	var textNoSpace = text.replace(/\s+/g, "");

	var ic = getIC(textNoSpace);
	var freq = getFrequency(textNoSpace);
	var len = textNoSpace.length;

	var charE = freq.E;
	var charT = freq.T;
	var charA = freq.A;
	var charO = freq.O;
	var charI = freq.I;

	var substitutionCipher = false;
	var transpositionCipher = false;

	//console.log(charE/len);console.log(charT/len);console.log(charA/len);console.log(charO/len);console.log(charI/len);

	if((ic >= 0.06 && len >= 50) || (ic >= 0.055 && len < 50)){
		if((charE/len) >= 0.10 && (charT/len) >= 0.07 && ((charA/len) >= 0.065 || (charO/len) >= 0.065 || (charI/len) >= 0.06)){
			transpositionCipher = true;
		}
		else {
			substitutionCipher = true;
		}
	}

	if(substitutionCipher){
		possibleCipher.push("Monoalphabetic Substitution");
		cipherAlgo.push("Simple Substitution Cipher");
		cipherAlgo.push("Caesar Cipher");
		cipherAlgo.push("Affine Cipher");
		cipherAlgo.push("Atbash Cipher");
	}
	else if(transpositionCipher){
		possibleCipher.push("Transposition Cipher");
		cipherAlgo.push("Columnar Transposition");
		cipherAlgo.push("Double Transposition");
		cipherAlgo.push("Scytale");
		cipherAlgo.push("Railfence");
	}
	else {

		var playfair = false;
		//Test for possible Playfair Cipher
		if((textNoSpace.length % 2 == 0) && (Object.size(freq) <= 25) && (/^[A-Z]+$/gi.test(textNoSpace))){
			var tryTxt = textNoSpace.match(/.{1,2}/g);
			playfair = true;
			for(var i=0; i < tryTxt.length; i++){
				if(tryTxt[i].charAt(0) == tryTxt[i].charAt(1)){
					playfair = false;
					break;
				}
			}
		}

		if(playfair) possibleCipher.push("Playfair Cipher");

		//Test for possible Vigenere and its variants
		else if(ic < 0.05 && ic >= 0.035){
			possibleCipher.push("Polyalphabetic Substitution");
			cipherAlgo.push("Vigenère");
			cipherAlgo.push("Autokey");
			cipherAlgo.push("Beaufort");
			cipherAlgo.push("Gronsfeld");

			/*if(/^[ABCDEFGHIKLMNOPQRSTVXYZ&\s]+$/gi.test(text) && cipherAlgo.length < 1){
				possibleCipher = "Alberti Cipher";
			}*/
		}

		else if(Object.size(freq) == 5){
			possibleCipher.push("Polybius Cipher");
		}

		else if(/^[02-9]+$/.test(textNoSpace) && textNoSpace.length % 2 == 0){
			possibleCipher.push("Nihilist Cipher (Substitution)");
		}

		else if(Object.size(freq) > 26){
			possibleCipher.push("Homophonic Cipher");
		}

		else if(text.length % 3 == 0 && ic < 0.05){
			possibleCipher.push("Hill Cipher (3x3)");
		}
	}

	result.possibleCipher = possibleCipher;
	if(cipherAlgo.length > 0) result.cipherAlgo = cipherAlgo;
	if(!isNaN(ic)) result.ic = ic;
}

function detectUniqueCipher(text){

	var possibleCipher = [];
	var textNoSpace = text.replace(/\s+/g, "");

	if(/^[\.\-\/\|]+$/g.test(textNoSpace)){
		possibleCipher.push("Morse Code");
	}
	if(/^[ADFGVX]+$/gi.test(textNoSpace)){
		possibleCipher.push("ADFGVX Cipher");
	}
	if(/^(?:[AB]{5})+$/gi.test(text.replace(/\s+/g, ""))){
		possibleCipher.push("Baconian Cipher");
	}
	if(/\s(?:CHA\-GEE|TSE\-NILL|WOL\-LA\-CHEE|NE\-AHS\-JAH|THAN\-ZIE\-CHA|NI\-DAH\-THAN\-ZIE|GAH\-TSO|DZEH|SEIS|LIN)\s/g.test(text)){
		possibleCipher.push("Navajo Code");
	}
	if(/[†‡¶]/g.test(text)){
		possibleCipher.push("Gold-Bug");
	}

	result.possibleCipher = possibleCipher;
}

function detectEncoding(text){

	var possibleEnc = [];
	var textNoSpace = text.replace(/\s+/g, "");

	if(/^\x3c\x7e(?:[\x21-\x7e\n]+)\x7e\x3e$/g.test(text)){
		possibleEnc.push("Base85 (Ascii85)");
	}
	if(/^[0-9A-Za-z\!#\$%&\(\)\*\+\-\;<=>\?@\^_`\{\}\|~]{20}$/g.test(text)){
		possibleEnc.push("Base85 (IPv6)");
	}
	if(/^begin\s[0-9]+\s(?:[\x21-\x7e\n]+)`\send/gi.test(text) || /^[\x21-\x7e\n]+\n*\n`/g.test(text)){
		possibleEnc.push("UUencode");
	}
	if(/^begin\s[0-9]+\s[\w\x21-\x7e]+(?:[a-z0-9\-\+\n]+)\+\send/gi.test(text)){
		possibleEnc.push("XXencode");
	}
	if(/^\=ybegin[\u0000-\uffff]+\=yend/gi.test(text)){
		possibleEnc.push("yEnc");
	}
	if(/\:[\x21-\x7e\n]+\:\s*$/g.test(text)){
		possibleEnc.push("BinHex");
	}

	/* Browser will crash if use these regex's for very long text

	if(/[\x20-\x7e\s]*=[0-9a-f]{2}[\x20-\x7e\s]/gi.test(text)){
		possibleEnc.push("QP-encoding (Quoted-Printable)");
	}
	if(/[\x20-\x7e\s]*\?=[0-9A-F]{2}[\x20-\x7e\s]/g.test(text)){
		possibleEnc.push("Q-encoding");
	}
	if(/[\x20-\x7e\s]*%[0-9A-F]{2}[\x20-\x7e\s]/g.test(text)){
		possibleEnc.push("Percent-encoding (URL Encoding)");
	}*/
	
	if(/^(?:[\u0000-\u0029\u0040-\uffff][0-9]+)+$/g.test(text)){
		possibleEnc.push("Run-Length-Encoding");
	}
	if(/^\x23\x40\x7e\x5e[\u0000-\uffff]+\x5e\x23\x7e\x40$/g.test(text)){
		possibleEnc.push("Encoded VBScript (.vbe)");
	}
	if(/^\uff9f\u03c9\uff9f\uff89\x3d\x20\x2f\uff40\uff4d\xb4\uff09\uff89\x20\x7e\u253b\u2501\u253b[\u0000-\uffff]+\x28\uff9f\u0398\uff9f\x29\x29\x20\x28\x27\x5f\x27\x29\x3b$/g.test(text)){
		possibleEnc.push("AAencode");
	}
	if(/^[\x21-\x7e]+=~\[\];[\x21-\x7e]+\"\\\"\"\)\(\)\)\(\);$/.test(text)){
		possibleEnc.push("JJencode");
	}
	if(/^(?:(?:[bcdfghklmnprstvzx][aeiouy-]){3})+(?:(?:[bcdfghklmnprstvzx][aeiouy]){2})+[bcdfghklmnprstvzx]$/gi.test(textNoSpace)){
		possibleEnc.push("Bubble-Babble");
	}
	if(/^[-1]+$/g.test(textNoSpace.replace(/[^a-z0-9\-]+/gi, ""))){
		possibleEnc.push("Spirit DVD Code");
	}

	//Esoteric Programming Language
	if(/^[\<\>\+\-\.\,\[\]]+$/g.test(textNoSpace)){
		possibleEnc.push("Brainfuck");
	}
	if(/^[aceijops]+$/g.test(text)){
		possibleEnc.push("Alphuck");
	}
	if(/^[\(\)\+\[\]\!]+$/gi.test(text)){
		possibleEnc.push("JSFuck");
	}
	if(/^(?:Ook[\.\?\!])+$/g.test(textNoSpace)){
		possibleEnc.push("Ook!");
	}
	if(/^[\.\?\!]+$/g.test(textNoSpace)){
		possibleEnc.push("Short Ook!");
	}
	if(/^([0-9]+[\+\-\*\/\%\!\`\>\<\^v\?\_\|\"\:\;\\\$\.\,\#gp\&\~\@]+|[\+\-\*\/\%\!\`\>\<\^v\?\_\|\"\:\;\\\$\.\,\#gp\&\~\@]+[0-9]*)+$/g.test(textNoSpace.replace(/(?:\".+\")+/, "")) && /^@$/g.test(text.replace(/[^@]+/g, ""))){
		possibleEnc.push("Befunge");
	}
	if(/^[FBICRSEOQ\,\:\;\+\-0-9]+$/g.test(textNoSpace) && /,(?=[0-9])/g.test(textNoSpace)){
		possibleEnc.push("NVSPL2");
	}
	if(/^HAI.+KTHXBYE$/g.test(textNoSpace)){
		possibleEnc.push("LOLCODE");
	}
	if(/^[\x20\t\n\x0d]{10,}$/g.test(text)){
		possibleEnc.push("Whitespace (Esolang)");
	}
	if(/^['\(\<BQbcu]+[\&\'\=APabt]+/g.test(textNoSpace)){
		possibleEnc.push("Malbolge");
	}

	//Detect any File Compression
	if(/^\x1f\x8b/gi.test(text)){
		possibleEnc.push("gz compressed");
	}
	if(/^\x42\x5a\x68/gi.test(text)){
		possibleEnc.push("bz2 compressed");
	}
	if(/^\x1f(?:\x9d|\xa0)/gi.test(text)){
		possibleEnc.push("zlib compressed");
	}

	//Some secret and silly encoding (I'm not sure if these are called Encoding :D)
	if(/^(?:r[0-9A-F]{2}|\+[0-9A-F]{2}|u[0-9A-F]{2}|\-[0-9A-F]{2}|d[0-9A-F]{2})+$/gi.test(textNoSpace)){
		possibleEnc.push("HID Keyboard log");
	}
	if(/^Dear(?:Friend|E-Commerceprofessional|Businessperson|Professional|Cybercitizen|Colleague|DecisionMaker|Salaryman|WebSurfer|SirorMadam).+Senatebill.+Title.+Section/gi.test(textNoSpace)){
		possibleEnc.push("Spammimic");
	}
	if(/^[02-9]+$/.test(textNoSpace) && !/0{2,}|[2345678]{4,}|9{5,}/.test(text) && (/33/.test(text) || /666/.test(text) || /444/.test(text))){
		possibleEnc.push("T9");
	}


	//Detect for any possible Base-family
	if(/^[01]+$/g.test(textNoSpace)){
		if(textNoSpace.length % 5 == 0){
			possibleEnc.push("Baudot Code");
		}
		possibleEnc.push("Base2 (Binary)");
	}
	else if(/^[0-7]+$/g.test(textNoSpace)){
		possibleEnc.push("Base8 (Octal)");
	}
	else if(/^[0-9]+$/g.test(textNoSpace)){
		possibleEnc.push("Base10 (Decimal)");
	}
	else if(/^(?:0x[0-9a-f]+|[0-9a-f]+)$/gi.test(textNoSpace) || /^(?:(\\|0)x[0-9a-f]{2}|(\\|0)u[0-9a-f]{4})+$/gi.test(textNoSpace)){
		possibleEnc.push("Base16 (Hexadecimal)");
	}
	else if(/^[A-Z0-9]*=*$/g.test(textNoSpace)){
		possibleEnc.push("Base32");
	}
	else if(/^[A-Z0-9\+\/]*=*$/i.test(textNoSpace)){
		possibleEnc.push("Base64");
	}
	else if(/^[0-9A-Za-z\.\-\:\+=\^\!\/\*\?&<>\(\)\[\]\{\}@%\$#]+$/g.test(text)){
		possibleEnc.push("Base85 ZeroMQ (Z85)");
	}
	/*
	else if(/^[0-9A-Z\x21\x23\x24\x25\x5e\x26\x2a\x28\x29\x2b\x2c\x2e\x2f\x3a\x3b\x3c\x3d\x3e\x3f\x40\x5b\x5d\x5f\x60\x7b\x7c\x7d\x7e\x22]+$/gi.test(text)){
		possibleEnc.push("Base91");
	}
	*/

	result.possibleEnc = possibleEnc;
}

function getIC(text){
	text = text.toLowerCase().replace(/[^a-z]/g, "");

	var counts = new Array(26);
	var total = 0;
	for(var i=0; i < 26; i++)
		counts[i] = 0;

	for(var i=0; i < text.length; i++){
		counts[text.charCodeAt(i) - 97]++;
		total++;
	}
	var sum = 0;
	for(var i=0; i < 26; i++)
		sum += counts[i] * (counts[i]-1);

	var ic = sum / (total*(total-1));

	return ic;
}

function getFrequency(text, n){

	n = n || 1;
	n = Number(n);
	text = text.toUpperCase();

	var freq = {};
	for (var i=0; i <= text.length-n; i++) {
		var character = text.charAt(i);
		for(var j=1; j < n; j++)
			character += text.charAt(i+j);
        		
		if (freq[character]) {
			freq[character]++;
		} else {
			freq[character] = 1;
		}
	}

	return freq;
}

Object.size = function(obj) {
	var size = 0, key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
};
