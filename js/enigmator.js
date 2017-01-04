/*******************************************	
*	Enigmator v0.1.23
*	Written by : Merricx
*
/********************************************/

var Enigmator = {

	/*-----------------------------------------------
		Base64
		Require : 
		- CryptoJS components/core-min.js
		- CryptoJS components/enc-base64-min.js
	-----------------------------------------------*/
	base64: {
		//enc Base64
		enc: function(text){
			var wordArray = CryptoJS.enc.Latin1.parse(text);
			var base64 = CryptoJS.enc.Base64.stringify(wordArray);
			return base64;
		},
		//dec Base64
		dec: function(text){
			var base64 = CryptoJS.enc.Base64.parse(text);
			var str = base64.toString(CryptoJS.enc.Latin1);
			return str;
		}
	},

	/*-----------------------------------------------
		Base32
		Require : 
		- base32.js
	-----------------------------------------------*/
	base32: {
		//enc Base32
		enc: function(text){
			var base32 = Base32.encode(text);
			return base32;
		},
		//dec Base32
		dec: function(text){
			var base32 = Base32.decode(text);
			return base32;
		}
	},

	/*-----------------------------------------------
		Base16 (Hexadecimal)
	-----------------------------------------------*/
	base16: {
		
		enc: function(text){
			var result = "";

			for(var i=0; i < text.length; i++){
				var ascii = text.charCodeAt(i).toString(16);
				result += ("0" + ascii).slice(-2);
			}

			return result;
		},
		
		dec: function(text){

			hex = text.toLowerCase().replace(/^[0x]|[^a-f0-9]/g, "").match(/.{1,2}/g) || [];
			var result = "";

			for(var i=0; i < hex.length; i++){
				result += String.fromCharCode(parseInt(hex[i], 16));
			}

			return result;
		}
	},

	/*-----------------------------------------------
		ROT-n
		-Source adapted from rot.js by @mathias (https://mths.be/rot)

		This included ROT-5, ROT-13, ROT-18, and ROT-47.
	-----------------------------------------------*/
	rot: function(text, n){

		n = n || 13;
		n = Number(n);

		var number = '0123456789';
		var lowercase = 'abcdefghijklmnopqrstuvwxyz';
		var uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		var ascii = "!\"#$%&\'()*+,-./"+number+":;<=>?@"+uppercase+"[\\]^_`"+lowercase+"{|}~";
		var regexNumber = /[0-9]/;
		var regexLowercase = /[a-z]/;
		var regexUppercase = /[A-Z]/;
		var regexAscii = /^[\x21-\x7E]+$/;

		var length = text.length;
		var result = "";
		var character, currentPosition, shiftedPosition;
		for(var i = 0; i < length; i++)
		{
			character = text.charAt(i);
			if(regexNumber.test(character) && (n == 5))
			{
				currentPosition = number.indexOf(character);
				shiftedPosition = (currentPosition + n) % 10;
				result += number.charAt(shiftedPosition);
			}
			else if(regexLowercase.test(character) && (n == 13))
			{
				currentPosition = lowercase.indexOf(character);
				shiftedPosition = (currentPosition + n) % 26;
				result += lowercase.charAt(shiftedPosition);
			}
			else if(regexUppercase.test(character) && (n == 13))
			{
				currentPosition = uppercase.indexOf(character);
				shiftedPosition = (currentPosition + n) % 26;
				result += uppercase.charAt(shiftedPosition);
			}
			else if(regexAscii.test(character) && (n == 47))
			{
				currentPosition = ascii.indexOf(character);
				shiftedPosition = (currentPosition + n) % 94;
				result += ascii.charAt(shiftedPosition);
			}
			else
			{
				result += character;
			}
		}
		return result;
	},

	/*-----------------------------------------------
		UUencode
		Require :
		- uuencode.js
	-----------------------------------------------*/
	uuencoding: {

		enc: function(text){
			return convert_uuencode(text);
		},

		//Decoding is not working perfectly yet
		dec: function(text){
			return convert_uudecode(text);
		}
	},

	/*-----------------------------------------------
		Ascii85
		I found this implementation at stackoverflow
	-----------------------------------------------*/
	ascii85: {

		enc: function(a){
			var b, c, d, e, f, g, h, i, j, k;
			var regex = /[^\x00-\xFF]/;

  			for (!regex.test(a), b = "\x00\x00\x00\x00".slice(a.length % 4 || 4), a += b, 
  			c = [], d = 0, e = a.length; e > d; d += 4)
  			f = (a.charCodeAt(d) << 24) + (a.charCodeAt(d + 1) << 16) + (a.charCodeAt(d + 2) << 8) + a.charCodeAt(d + 3), 
  			0 !== f ? (k = f % 85, f = (f - k) / 85, j = f % 85, f = (f - j) / 85, i = f % 85, 
  			f = (f - i) / 85, h = f % 85, f = (f - h) / 85, g = f % 85, c.push(g + 33, h + 33, i + 33, j + 33, k + 33)) :c.push(122);
  			return function(a, b) {
    		for (var c = b; c > 0; c--) a.pop();
  			}(c, b.length), "<~" + String.fromCharCode.apply(String, c) + "~>";
		},

		dec: function(a){
			var c, d, e, f, g, h = String, l = "length", w = 255, x = "charCodeAt", y = "slice", z = "replace";
  			for ("<~" === a[y](0, 2) && "~>" === a[y](-2), a = a[y](2, -2)[z](/\s/g, "")[z]("z", "!!!!!"), 
  			c = "uuuuu"[y](a[l] % 5 || 5), a += c, e = [], f = 0, g = a[l]; g > f; f += 5) d = 52200625 * (a[x](f) - 33) + 614125 * (a[x](f + 1) - 33) + 7225 * (a[x](f + 2) - 33) + 85 * (a[x](f + 3) - 33) + (a[x](f + 4) - 33), 
  			e.push(w & d >> 24, w & d >> 16, w & d >> 8, w & d);
  			return function(a, b) {
    		for (var c = b; c > 0; c--) a.pop();
  			}(e, c[l]), h.fromCharCode.apply(h, e);
		}
	},

	/*-----------------------------------------------
		AES (Rijndael)
		Require : 
		- CryptoJS rollups/aes.js
	-----------------------------------------------*/
	aes: {

		enc: function(text, key, cipherMode, iv){

			cipherMode = cipherMode || "CBC";

			if(cipherMode == "CBC")
				var mode = CryptoJS.mode.CBC;
			else if(cipherMode == "ECB")
				var mode = CryptoJS.mode.ECB;
			else if(cipherMode == "CFB")
				var mode = CryptoJS.mode.CFB;
			else if(cipherMode == "CTR")
				var mode = CryptoJS.mode.CTR;
			else if(cipherMode == "OFB")
				var mode = CryptoJS.mode.OFB;

			if(iv !== undefined)
			{
				key = CryptoJS.enc.Hex.parse(padKey(key));
				iv = CryptoJS.enc.Hex.parse(padIV(iv));

				var str = CryptoJS.AES.encrypt(text, key, {iv : iv, mode : mode});
			}
			else
			{
				var str = CryptoJS.AES.encrypt(text, key, {mode : mode});
			}

			return str;
		},

		dec: function(text, key, cipherMode, iv){
			if(cipherMode == "CBC")
				var mode = CryptoJS.mode.CBC;
			else if(cipherMode == "ECB")
				var mode = CryptoJS.mode.ECB;
			else if(cipherMode == "CFB")
				var mode = CryptoJS.mode.CFB;
			else if(cipherMode == "CTR")
				var mode = CryptoJS.mode.CTR;
			else if(cipherMode == "OFB")
				var mode = CryptoJS.mode.OFB;
			else
				var mode = CryptoJS.mode.CBC;

			if(iv !== undefined)
			{
				key = CryptoJS.enc.Hex.parse(padKey(key));
				iv = CryptoJS.enc.Hex.parse(padIV(iv));
				var str = CryptoJS.AES.decrypt(text, key, {iv : iv, mode : mode});
			}
			else
			{
				var str = CryptoJS.AES.decrypt(text, key, {mode : mode});
			}
			
			return str.toString(CryptoJS.enc.Latin1);
		}
	},

	/*-----------------------------------------------
		RSA
		Require : 
		- jsencrypt.js
	-----------------------------------------------*/
	rsa: {

		generateKeys: function(keySize){
			var keySize = parseInt(keySize);
			var rsa = new JSEncrypt({default_key_size: keySize});

			rsa.getKey();
			key = {privKey:null,pubKey:null}
			key.privKey = rsa.getPrivateKey();
			key.pubKey = rsa.getPublicKey();
			return key;
		},

		setKey: function(p, q, e){
			var rsa = new JSEncrypt();
			var key = {};
			if(rsa.setManualKey(p,q,e)){
				key.pubKey = rsa.getPublicKey();
				key.privKey = rsa.getPrivateKey();
			}
			return key;
		},

		getPublicKey: function(privKey){
			var rsa = new JSEncrypt();
			return rsa.getPublicKey();
		},

		getRawKey: function(key, radix){
			var rsa = new JSEncrypt();
			rsa.setKey(key);
			return rsa.getRawKey();
		},

		enc: function(text, key){
			var rsa = new JSEncrypt();
			rsa.setKey(key);
			
			return rsa.encrypt(text);
		},

		dec: function(text, privKey){
			var rsa = new JSEncrypt();
			rsa.setPrivateKey(privKey);

			return rsa.decrypt(text);
		}
	},

	/*-----------------------------------------------
		DES
		Require : 
		- CryptoJS rollups/tripledes.js
	-----------------------------------------------*/
	des: {
		enc: function(text, key, cipherMode, iv){

			cipherMode = cipherMode || "CBC";

			if(cipherMode == "CBC")
				var mode = CryptoJS.mode.CBC;
			else if(cipherMode == "ECB")
				var mode = CryptoJS.mode.ECB;
			else if(cipherMode == "CFB")
				var mode = CryptoJS.mode.CFB;
			else if(cipherMode == "CTR")
				var mode = CryptoJS.mode.CTR;
			else if(cipherMode == "OFB")
				var mode = CryptoJS.mode.OFB;

			if(iv !== undefined)
			{
				key = CryptoJS.enc.Latin1.parse(key);
				iv = CryptoJS.enc.Hex.parse(iv);
				var str = CryptoJS.DES.encrypt(text, key, {iv : iv, mode : mode});
			}
			else
			{
				var str = CryptoJS.DES.encrypt(text, key, {mode : mode});
			}
			
			return str;
		},

		dec: function(text, key, cipherMode, iv){
			if(cipherMode == "CBC")
				var mode = CryptoJS.mode.CBC;
			else if(cipherMode == "ECB")
				var mode = CryptoJS.mode.ECB;
			else if(cipherMode == "CFB")
				var mode = CryptoJS.mode.CFB;
			else if(cipherMode == "CTR")
				var mode = CryptoJS.mode.CTR;
			else if(cipherMode == "OFB")
				var mode = CryptoJS.mode.OFB;
			else
				var mode = CryptoJS.mode.CBC;

			if(iv !== undefined)
			{
				key = CryptoJS.enc.Latin1.parse(key);
				iv = CryptoJS.enc.Hex.parse(iv);
				var str = CryptoJS.DES.decrypt(text, key, {iv : iv, mode : mode});
			}
			else
			{
				var str = CryptoJS.DES.decrypt(text, key, {mode : mode});
			}
			
			return str.toString(CryptoJS.enc.Latin1);
		}
	},

	/*-----------------------------------------------
		TripleDES
		Require : 
		- CryptoJS rollups/tripledes.js
	-----------------------------------------------*/
	tripledes: {

		enc: function(text, key, cipherMode, iv){

			cipherMode = cipherMode || "CBC";

			if(cipherMode == "CBC")
				var mode = CryptoJS.mode.CBC;
			else if(cipherMode == "ECB")
				var mode = CryptoJS.mode.ECB;
			else if(cipherMode == "CFB")
				var mode = CryptoJS.mode.CFB;
			else if(cipherMode == "CTR")
				var mode = CryptoJS.mode.CTR;
			else if(cipherMode == "OFB")
				var mode = CryptoJS.mode.OFB;

			if(iv !== undefined)
			{
				key = CryptoJS.enc.Latin1.parse(key);
				iv = CryptoJS.enc.Hex.parse(iv);
				var str = CryptoJS.TripleDES.encrypt(text, key, {iv : iv, mode : mode});
			}
			else
			{
				var str = CryptoJS.TripleDES.encrypt(text, key, {mode : mode});
			}
			
			return str;
		},

		dec: function(text, key, cipherMode, iv){
			if(cipherMode == "CBC")
				var mode = CryptoJS.mode.CBC;
			else if(cipherMode == "ECB")
				var mode = CryptoJS.mode.ECB;
			else if(cipherMode == "CFB")
				var mode = CryptoJS.mode.CFB;
			else if(cipherMode == "CTR")
				var mode = CryptoJS.mode.CTR;
			else if(cipherMode == "OFB")
				var mode = CryptoJS.mode.OFB;
			else
				var mode = CryptoJS.mode.CBC;

			if(iv !== undefined)
			{
				key = CryptoJS.enc.Latin1.parse(key);
				iv = CryptoJS.enc.Hex.parse(iv);
				var str = CryptoJS.TripleDES.decrypt(text, key, {iv : iv, mode : mode});
			}
			else
			{
				var str = CryptoJS.TripleDES.decrypt(text, key, {mode : mode});
			}
			
			return str.toString(CryptoJS.enc.Latin1);
		}
	},

	/*-----------------------------------------------
		Blowfish
		Require : 
		- blowfish.js
	-----------------------------------------------*/
	blowfish: {
		enc: function(text, key, iv, cipherMode){

			if(iv == undefined)
				iv = 0;

			if(cipherMode == "CBC")
				var mode = 1;
			else if(cipherMode == "ECB")
				var mode = 0;
			else if(cipherMode == "CFB")
				var mode = 3;
			else if(cipherMode == "CTR")
				var mode = 5;
			else if(cipherMode == "OFB")
				var mode = 4;
			else
				var mode = 1;

			blowfish.setIV(iv, 1);
			var str = blowfish.encrypt(text, key, {outputType: 4, cipherMode: mode});
			return str;
		},

		dec: function(text, key, iv, cipherMode){

			if(iv == undefined)
				iv = 0;

			if(cipherMode == "CBC")
				var mode = 1;
			else if(cipherMode == "ECB")
				var mode = 0;
			else if(cipherMode == "CFB")
				var mode = 3;
			else if(cipherMode == "CTR")
				var mode = 5;
			else if(cipherMode == "OFB")
				var mode = 4;
			else
				var mode = 1;

			blowfish.setIV(iv, 1);
			var str = blowfish.decrypt(text, key, {outputType: 4, cipherMode: mode});
			return str;
		}
	},

	/*-----------------------------------------------
		RC4
		Require : 
		- CryptoJS rollups/rc4.js
	-----------------------------------------------*/
	rc4: {
		enc: function(text, key, cipherMode, iv){

			cipherMode = cipherMode || "CBC";

			if(cipherMode == "CBC")
				var mode = CryptoJS.mode.CBC;
			else if(cipherMode == "ECB")
				var mode = CryptoJS.mode.ECB;
			else if(cipherMode == "CFB")
				var mode = CryptoJS.mode.CFB;
			else if(cipherMode == "CTR")
				var mode = CryptoJS.mode.CTR;
			else if(cipherMode == "OFB")
				var mode = CryptoJS.mode.OFB;

			if(iv !== undefined)
			{
				key = CryptoJS.enc.Latin1.parse(key);
				iv = CryptoJS.enc.Hex.parse(iv);
				var str = CryptoJS.RC4.encrypt(text, key, {iv : iv, mode : mode});
			}
			else
			{
				var str = CryptoJS.RC4.encrypt(text, key);
			}

			return str;
		},

		dec: function(text, key, cipherMode, iv){
			cipherMode = cipherMode || "CBC";

			if(cipherMode == "CBC")
				var mode = CryptoJS.mode.CBC;
			else if(cipherMode == "ECB")
				var mode = CryptoJS.mode.ECB;
			else if(cipherMode == "CFB")
				var mode = CryptoJS.mode.CFB;
			else if(cipherMode == "CTR")
				var mode = CryptoJS.mode.CTR;
			else if(cipherMode == "OFB")
				var mode = CryptoJS.mode.OFB;

			if(iv !== undefined)
			{
				key = CryptoJS.enc.Latin1.parse(key);
				iv = CryptoJS.enc.Hex.parse(iv);
				var str = CryptoJS.RC4.decrypt(text, key, {iv : iv, mode : mode});
			}
			else
			{
				var str = CryptoJS.RC4.decrypt(text, key);
			}

			return str.toString(CryptoJS.enc.Latin1);
		}
	},

	rc4drop: {
		enc: function(text, key, cipherMode, dropBytes, iv){

			cipherMode = cipherMode || "CBC";

			if(cipherMode == "CBC")
				var mode = CryptoJS.mode.CBC;
			else if(cipherMode == "ECB")
				var mode = CryptoJS.mode.ECB;
			else if(cipherMode == "CFB")
				var mode = CryptoJS.mode.CFB;
			else if(cipherMode == "CTR")
				var mode = CryptoJS.mode.CTR;
			else if(cipherMode == "OFB")
				var mode = CryptoJS.mode.OFB;

			if(iv !== undefined)
			{
				key = CryptoJS.enc.Latin1.parse(key);
				iv = CryptoJS.enc.Hex.parse(iv);
				var str = CryptoJS.RC4Drop.encrypt(text, key, {drop: dropBytes, iv : iv, mode : mode});
			}
			else
			{
				var str = CryptoJS.RC4Drop.encrypt(text, key, {drop: dropBytes});
			}

			return str;
		},

		dec: function(text, key, cipherMode, dropBytes, iv){
			cipherMode = cipherMode || "CBC";

			if(cipherMode == "CBC")
				var mode = CryptoJS.mode.CBC;
			else if(cipherMode == "ECB")
				var mode = CryptoJS.mode.ECB;
			else if(cipherMode == "CFB")
				var mode = CryptoJS.mode.CFB;
			else if(cipherMode == "CTR")
				var mode = CryptoJS.mode.CTR;
			else if(cipherMode == "OFB")
				var mode = CryptoJS.mode.OFB;

			if(iv !== undefined)
			{
				key = CryptoJS.enc.Latin1.parse(key);
				iv = CryptoJS.enc.Hex.parse(iv);
				var str = CryptoJS.RC4Drop.decrypt(text, key, {drop: dropBytes, iv : iv, mode : mode});
			}
			else
			{
				var str = CryptoJS.RC4Drop.decrypt(text, key, {drop: dropBytes});
			}

			return str.toString(CryptoJS.enc.Latin1);
		}
	},

	/*-----------------------------------------------
		Rabbit
		Require : 
		- CryptoJS	rollups/rabbit.js
	-----------------------------------------------*/
	rabbit: {
		enc: function(text, key, cipherMode, iv){

			cipherMode = cipherMode || "CBC";

			if(cipherMode == "CBC")
				var mode = CryptoJS.mode.CBC;
			else if(cipherMode == "ECB")
				var mode = CryptoJS.mode.ECB;
			else if(cipherMode == "CFB")
				var mode = CryptoJS.mode.CFB;
			else if(cipherMode == "CTR")
				var mode = CryptoJS.mode.CTR;
			else if(cipherMode == "OFB")
				var mode = CryptoJS.mode.OFB;

			if(iv !== undefined)
			{
				key = CryptoJS.enc.Latin1.parse(key);
				iv = CryptoJS.enc.Hex.parse(iv);
				var str = CryptoJS.Rabbit.encrypt(text, key, {iv : iv, mode : mode});
			}
			else
			{
				var str = CryptoJS.Rabbit.encrypt(text, key, {mode : mode});
			}
			
			return str;
		},

		dec: function(text, key, cipherMode, iv){
			if(cipherMode == "CBC")
				var mode = CryptoJS.mode.CBC;
			else if(cipherMode == "ECB")
				var mode = CryptoJS.mode.ECB;
			else if(cipherMode == "CFB")
				var mode = CryptoJS.mode.CFB;
			else if(cipherMode == "CTR")
				var mode = CryptoJS.mode.CTR;
			else if(cipherMode == "OFB")
				var mode = CryptoJS.mode.OFB;
			else
				var mode = CryptoJS.mode.CBC;

			if(iv !== undefined)
			{
				key = CryptoJS.enc.Latin1.parse(key);
				iv = CryptoJS.enc.Hex.parse(iv);
				var str = CryptoJS.Rabbit.decrypt(text, key, {iv : iv, mode : mode});
			}
			else
			{
				var str = CryptoJS.Rabbit.decrypt(text, key, {mode : mode});
			}
			
			return str.toString(CryptoJS.enc.Latin1);
		}
	},

	/*-----------------------------------------------
		XOR
		Require : 
		- Utils		underscore.js
		- XORChipher.js
	-----------------------------------------------*/
	xor: {
		enc: function(text, key){
			var str = XORCipher.encode(key, text);
			return str;
		},

		dec: function(text, key){
			var str = XORCipher.decode(key, text);
			return str;
		}
	},

	/*-----------------------------------------------
		MD4
		Require : 
		- md4.js
	-----------------------------------------------*/
	md4: function(text, hmac){
		hmac = hmac || null;

		if(hmac == null)
			var hash = hex_md4(text);
		else
			var hash = hex_hmac_md4(hmac, text);
		return hash;
	},

	/*-----------------------------------------------
		MD5
		Require : 
		- CryptoJS rollups/md5.js
		- CryptoJS rollups/hmac-md5.js
	-----------------------------------------------*/
	md5: function(text, hmac){
		hmac = hmac || null;

		var str = CryptoJS.enc.Latin1.parse(text);

		if(hmac == null)
			var hash = CryptoJS.MD5(str);
		else
			var hash = CryptoJS.HmacMD5(str, hmac);
		return hash.toString(CryptoJS.enc.Hex);
	},

	/*-----------------------------------------------
		SHA-1
		Require : 
		- CryptoJS rollups/sha1.js
		- CryptoJS rollups/hmac-sha1.js
	-----------------------------------------------*/
	sha1: function(text, hmac){
		hmac = hmac || null;
		
		var str = CryptoJS.enc.Latin1.parse(text);

		if(hmac == null)
			var hash = CryptoJS.SHA1(str);
		else
			var hash = CryptoJS.HmacSHA1(str, hmac);
		return hash.toString(CryptoJS.enc.Hex);
	},

	/*-----------------------------------------------
		SHA-256
		Require : 
		- CryptoJS rollups/sha256.js
		- CryptoJS rollups/hmac-sha256.js
	-----------------------------------------------*/
	sha256: function(text, hmac){
		hmac = hmac || null;

		var str = CryptoJS.enc.Latin1.parse(text);
		
		if(hmac == null)
			var hash = CryptoJS.SHA256(str);
		else
			var hash = CryptoJS.HmacSHA256(str, hmac);
		return hash.toString(CryptoJS.enc.Hex);
	},

	/*-----------------------------------------------
		SHA-512
		Require : 
		- CryptoJS rollups/sha512.js
		- CryptoJS rollups/hmac-sha512.js
	-----------------------------------------------*/
	sha512: function(text, hmac){
		hmac = hmac || null;
		
		var str = CryptoJS.enc.Latin1.parse(text);

		if(hmac == null)
			var hash = CryptoJS.SHA512(str);
		else
			var hash = CryptoJS.HmacSHA512(str, hmac);
		return hash.toString(CryptoJS.enc.Hex);
	},

	/*-----------------------------------------------
		SHA-3
		Require : 
		- CryptoJS rollups/sha3.js
		- CryptoJS rollups/hmac-sha3.js
	-----------------------------------------------*/
	sha3: function(text, length, hmac){
		hmac = hmac || null;
		length = length || 512;

		var str = CryptoJS.enc.Latin1.parse(text);
		
		if(hmac == null)
			var hash = CryptoJS.SHA3(str, {outputLength: length});
		else
			var hash = CryptoJS.HmacSHA3(str, hmac, {outputLength: length});
		return hash.toString(CryptoJS.enc.Hex);
	},

	/*-----------------------------------------------
		RIPEMD-160
		Require : 
		- CryptoJS rollups/ripemd160.js
		- CryptoJS rollups/hmac-ripemd160.js
	-----------------------------------------------*/
	ripemd160: function(text, hmac){
		hmac = hmac || null;
		
		var str = CryptoJS.enc.Latin1.parse(text);

		if(hmac == null)
			var hash = CryptoJS.RIPEMD160(str);
		else
			var hash = CryptoJS.HmacRIPEMD160(str, hmac);
		return hash.toString(CryptoJS.enc.Hex);
	},

	/*-----------------------------------------------
		CAESAR SHIFT (rot-n)
		-Source adapted from rot.js by @mathias (https://mths.be/rot)
	-----------------------------------------------*/
	caesar: function(text, n){

		var lowercase = 'abcdefghijklmnopqrstuvwxyz';
		var uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		var regexLowercase = /[a-z]/;
		var regexUppercase = /[A-Z]/;

		n = Number(n);
		var length = text.length;
		var result = "";
		var character, currentPosition, shiftedPosition;
		for(var i = 0; i < length; i++)
		{
			character = text.charAt(i);
			if(regexLowercase.test(character))
			{
				currentPosition = lowercase.indexOf(character);
				shiftedPosition = (currentPosition + n) % 26;
				result += lowercase.charAt(shiftedPosition);
			}
			else if(regexUppercase.test(character))
			{
				currentPosition = uppercase.indexOf(character);
				shiftedPosition = (currentPosition + n) % 26;
				result += uppercase.charAt(shiftedPosition);
			}
			else
			{
				result += character;
			}
		}
		return result;
	},

	/*------------------------------------------------
		Simple Substitution Cipher
	------------------------------------------------*/
	substitution: {

		enc: function(text, key){

			text = text.toUpperCase();
			key = Enigmator.substitution.generateKey(key);

			var character, replaced;
			var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			var result = "";

			for(var i=0; i < text.length; i++){
				character = text.charAt(i);
				if(/[A-Z]/.test(character)){
					replaced = key.charAt(alpha.indexOf(character));
					result += replaced;
				} else {
					result += character;
				}
			}

			return result;
		},

		dec: function(text, key){

			text = text.toUpperCase();
			key = Enigmator.substitution.generateKey(key);

			var character, replaced;
			var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			var result = "";

			for(var i=0; i < text.length; i++){
				character = text.charAt(i);
				if(/[A-Z]/.test(character)){
					replaced = alpha.charAt(key.indexOf(character));
					result += replaced;
				} else {
					result += character;
				}
			}

			return result;
		},

		generateKey: function(key){
			
			key = key.toUpperCase().replace(/[^A-Z]/g, "");
			var alphabet =  key+"ABCDEFGHIJKLMNOPQRSTUVWXYZ";

			var result = [];
			var character;
			var index = 0;
			for(var i=0; i < alphabet.length; i++){
				character = alphabet.charAt(i);
				if(result.indexOf(character) == -1){
					result[index] = character;
					index++;
				}
			}
			
			return result.join("");
		}
	},

	/*-----------------------------------------------
		Vigenere Cipher	
	-----------------------------------------------*/
	vigenere: {

		enc: function(text, key){

			key = key.replace(/[^A-Z]/gi, "");

			if(!key){
				return text;
			}

			var character, ciphertext, shift;
			var alpha = "abcdefghijklmnopqrstuvwxyz";

			key = key.toLowerCase().split("");

            ciphertext = "";
            for (var i = 0; i < text.length; i++) {
            	character = text.charAt(i);
            	if(/[A-Z]/gi.test(character)){
            		shift = alpha.indexOf(key[0]);
            		ciphertext += Enigmator.caesar(character, shift);
            		key.push(key.shift());
            	}
            	else {
            		ciphertext += character;
            	}
            }

            return ciphertext;
		},

		dec: function(text, key){

			key = key.replace(/[^A-Z]/gi, "");

			if(!key){
				return text;
			}
			var character, plaintext, shift;
			var alpha = "abcdefghijklmnopqrstuvwxyz";

			key = key.toLowerCase().split("");

            plaintext = "";
            for (var i = 0; i < text.length; i++) {
            	character = text.charAt(i);
            	if(/[A-Z]/gi.test(character)){
            		shift = alpha.indexOf(key[0]);
					plaintext += Enigmator.caesar(character, 26-shift);
					key.push(key.shift());
            	}
            	else {
            		plaintext += character;
            	}
            }

            return plaintext;
		},

		crack: {

			findKeyLength: function(text, maxKeyLength){

				text = text.toUpperCase().replace(/[^A-Z]/g, "");

				maxKeyLength = maxKeyLength || 30;

				var possibleKeyLength = [];
				var averageIC = {};

				for(var i=1; i <= maxKeyLength; i++){
					var totalIC = 0;
					for(var j=0; j < i; j++){
						var k = j;
						var sequence = "";
						while(k <= text.length){
							sequence += text.charAt(k);
							k += i;
						}
						totalIC += Enigmator.cryptanalysis.getIndexOfCoincidence(sequence);
					}
					averageIC = totalIC / i;
					if(averageIC >= 0.055){
						possibleKeyLength.push(i);
					}
				}

				return possibleKeyLength;
			},

			findKey: function(text, keyLength){

				text = text.toUpperCase().replace(/[^A-Z]/g, "");

				var sequence = [];
				var possibleKey = [];
				var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

				for(var i=0; i < keyLength; i++){
					var j = i;
					sequence[i] = "";
					while(j <= text.length){
						sequence[i] += text.charAt(j);
						j += keyLength;
					}
				}

				for(var i=0; i < sequence.length; i++){
					var chiSquared = [];
					for(var j=0; j < 26; j++){
						var caesar = Enigmator.caesar(sequence[i], 26-j);
						chiSquared[j] = [];
						chiSquared[j][0] = j;
						chiSquared[j][1] = Enigmator.cryptanalysis.getChiSquared(caesar);
					}
					chiSquared.sort(function(a, b){ return a[1] - b[1]});
					possibleKey[i] = [];
					for(var j=0; j < 5; j++){
						possibleKey[i].push(alpha.charAt(chiSquared[j][0]));
					}
				}
				console.log(possibleKey);
				return possibleKey;

			}
		}
	},

	/*-----------------------------------------------
		Autokey Cipher
		Implementation from Practical Cryptography
	-----------------------------------------------*/
	autokey: {

		enc: function(text, key){

			text = text.toLowerCase().replace(/[^a-z]/g, "");
			key = key.toLowerCase().replace(/[^a-z]/g, "");

			var result = "";
			for(i=0; i<text.length; i++){ 
        		if(i < key.length){
            		result += String.fromCharCode((((text.charCodeAt(i)-97) + (key.charCodeAt(i)-97)+26)%26)+97); 
        		}
        		else {
            		result += String.fromCharCode((((text.charCodeAt(i)-97) + (text.charCodeAt(i-key.length)-97)+26)%26)+97);
        		}    
    		}

    		return result.toUpperCase();
		},

		dec: function(text, key){

			if(!key){
				return "";
			}

			text = text.toLowerCase().replace(/[^a-z]/g, "");
			key = key.toLowerCase().replace(/[^a-z]/g, "");

			var result = "";
			for(i=0; i<text.length; i++){ 
        		if(i < key.length){
            		result += String.fromCharCode((((text.charCodeAt(i)-97) - (key.charCodeAt(i)-97)+26)%26)+97); 
        		}
        		else {
            		result += String.fromCharCode((((text.charCodeAt(i)-97) - (result.charCodeAt(i-key.length)-97)+26)%26)+97);
        		}
    		}

    		return result.toUpperCase();
		}
	},

	/*-----------------------------------------------
		Beaufort Cipher

		Encrypting and Decrypting use same Algorithm
	-----------------------------------------------*/
	beaufort: {

		enc: function(text, key){

			textNoSpace = text.toUpperCase().replace(/[^A-Z]/g, "");
			key = key.toUpperCase().replace(/[^A-Z]/g, "");

			var result = "";
			for(i=0; i<textNoSpace.length; i++){ 
				if(key.length < textNoSpace.length)
        			key += key.charAt(i);
    		}

    		return Enigmator.vigenere.dec(key, text);
		}
	},

	/*-----------------------------------------------
		MORSE CODE
	-----------------------------------------------*/
	morse: {
		symbol: [
			".-", 
			"-...", 
			"-.-.", 
			"-..", 
			".", 
			"..-.", 
			"--.", 
			"....", 
			"..", 
			".---", 
			"-.-", 
			".-..", 
			"--", 
			"-.", 
			"---", 
			".--.", 
			"--.-", 
			".-.", 
			"...", 
			"-", 
			"..-", 
			"...-", 
			".--", 
			"-..-", 
			"-.--", 
			"--..",
			".----",
			"..---",
			"...--",
			"....-",
			".....",
			"-....",
			"--...",
			"---..",
			"----.",
			"-----",
			"/"
		],

		enc: function(text){
			
			var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ";

			text = text.toUpperCase().replace(/[^A-Z0-9\s]/g, "").replace(/\s+/g, " ");
			var result = "";

			for(var i=0; i < text.length; i++){
				var charIndex = alpha.indexOf(text.charAt(i));
				result += " " + Enigmator.morse.symbol[charIndex];
			}

			return result.slice(1);

		},

		dec: function(text){

			var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ";

			var cipher = text.replace(/[^.\-\/\s]/g, "").split(" ");
			var result = "";
			console.log(cipher);

			for(var i=0; i < cipher.length; i++){
				var morseIndex = Enigmator.morse.symbol.indexOf(cipher[i]);
				result += alpha.charAt(morseIndex);
			}

			return result;

		}
	},

	/*-----------------------------------------------
		Affine Cipher
	-----------------------------------------------*/
	affine: {
		enc: function(text, a, b, alphabet){

			alphabet = alphabet || "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			a = Number(a);
			if(a % 2 != 1)
			{
				throw "Input must be coprime with 26.";
			}
			b = Number(b);
			alphabet = alphabet.toUpperCase();

			var text = text.toUpperCase();
			var len = text.length;
			var result = "";
			var character, currentPosition, encryptedPosition;
			for(var i = 0; i < len;i++){
				character = text.charAt(i);
				currentPosition = alphabet.indexOf(character);
				if(currentPosition >= 0){
					encryptedPosition = (a * currentPosition + b) % 26;
					result += alphabet.charAt(encryptedPosition);
				}
				else
					result += character;
			}

			return result;
		}, 

		dec: function(text, a, b, alphabet){

			alphabet = alphabet || "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			a = Number(a);
			if(a % 2 != 1)
			{
				throw "Input must be coprime with 26.";
			}

			b = Number(b);
			alphabet = alphabet.toUpperCase();

			var text = text.toUpperCase();
			var len = text.length;
			var result = "";
			var character, currentPosition, decryptedPosition, inv_a;

			//find Modular Inverse of Coefficient A
			for(var i=1; i <= 25;i+=2){
				if((a*i) % 26 == 1)
					inv_a = i;
			}

			for(var i = 0; i < len;i++){
				character = text.charAt(i);
				currentPosition = alphabet.indexOf(character);
				if(currentPosition >= 0){
					decryptedPosition = (inv_a * (currentPosition - b));
					//Javascript Modulo doesn't behave negative number
					decryptedPosition = ((decryptedPosition % 26)+26) % 26;
					result += alphabet.charAt(decryptedPosition);
				}
				else
					result += character;
			}

			return result;
		}
	},

	/*-----------------------------------------------
		ATBASH (Mirror Alphabet)
	-----------------------------------------------*/
	atbash: function(text){
		var lowercase = 'abcdefghijklmnopqrstuvwxyz';
		var mirrorLowercase = 'zyxwvutsrqponmlkjihgfedcba';

		var uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		var mirrorUppercase = 'ZYXWVUTSRQPONMLKJIHGFEDCBA';

		var regexLowercase = /[a-z]/;
		var regexUppercase = /[A-Z]/;

		var length = text.length;
		var result = "";
		var character, position;

		for(var i = 0; i < length; i++)
		{
			character = text.charAt(i);
			if(regexLowercase.test(character))
			{
				position = lowercase.indexOf(character);
				result += mirrorLowercase.charAt(position);
			}
			else if(regexUppercase.test(character))
			{
				position = uppercase.indexOf(character);
				result += mirrorUppercase.charAt(position);
			}
			else
			{
				result += character;
			}
		}
		return result;
	},

	/*-----------------------------------------------
		Baconian Cipher
	-----------------------------------------------*/
	baconian: {
		enc: function(text, version){

			version = version || 1;

			var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			var bacon1 = ["AAAAA","AAAAB","AAABA","AAABB","AABAA","AABAB","AABBA","AABBB","ABAAA","ABAAA",
			"ABAAB","ABABA","ABABB","ABBAA","ABBAB","ABBBA","ABBBB","BAAAA","BAAAB","BAABA",
			"BAABB","BAABB","BABAA","BABAB","BABBA","BABBB"];
			var bacon2 = ["AAAAA","AAAAB","AAABA","AAABB","AABAA","AABAB","AABBA","AABBB","ABAAA","ABAAB",
			"ABABA","ABABB","ABBAA","ABBAB","ABBBA","ABBBB","BAAAA","BAAAB","BAABA","BAABB",
			"BABAA","BABAB","BABBA","BABBB","BBAAA","BBAAB"];

			if(version == 1)
				var bacon = bacon1;
			else
				var bacon = bacon2;

			text = text.toUpperCase().replace(/[^A-Z]/g, "");
			var len = text.length;
			var result = "";
			var character, position;

			for(var i=0; i < len;i++){
				character = text.charAt(i);
				position = alphabet.indexOf(character);
				result += bacon[position];
			}

			return result.match(/.{1,5}/g).join(" ");
		},

		dec: function(text, version){

			version = version || 1;

			var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			var bacon1 = ["AAAAA","AAAAB","AAABA","AAABB","AABAA","AABAB","AABBA","AABBB","ABAAA","ABAAA",
			"ABAAB","ABABA","ABABB","ABBAA","ABBAB","ABBBA","ABBBB","BAAAA","BAAAB","BAABA",
			"BAABB","BAABB","BABAA","BABAB","BABBA","BABBB"];
			var bacon2 = ["AAAAA","AAAAB","AAABA","AAABB","AABAA","AABAB","AABBA","AABBB","ABAAA","ABAAB",
			"ABABA","ABABB","ABBAA","ABBAB","ABBBA","ABBBB","BAAAA","BAAAB","BAABA","BAABB",
			"BABAA","BABAB","BABBA","BABBB","BBAAA","BBAAB"];

			if(version == 1)
				var bacon = bacon1;
			else
				var bacon = bacon2;

			text = text.toUpperCase().replace(/[^AB]/g, "").match(/.{1,5}/g);
			var len = text.length;
			var result = "";
			var character, position;

			for(var i=0; i < len;i++){
				character = text[i];
				position = bacon.indexOf(character);
				result += alphabet.charAt(position);
			}

			return result;
		}
	},

	/*----------------------------------------------
		Bifid Cipher
	----------------------------------------------*/
	bifid: {

		enc: function(text, keysquare, period){

			var num = "12345";

			keysquare = keysquare.toUpperCase().replace(/[^A-Z]/g, "");
			text = text.toUpperCase().replace(/[^A-Z]/g, "").replace(/[J]/g, "I");
			if(isNaN(period))
				throw "Period must be an Integer";

			var index;
			var result = "", row = "", col = "", sequence = "";
			//Step 1: Subtitute each plain char into equivalent numbers in keysquare
			for(var i=0; i < text.length; i++){
				index = keysquare.indexOf(text.charAt(i));
				row += num.charAt(index / 5);
				col += num.charAt(index % 5);
			}
			//Step 2: Grouping into certain number of blocks (Using period to determine block size)
			var reg = new RegExp(".{1,"+period+"}","g");
			row = row.match(reg);
			col = col.match(reg);
			//Step 3: Create new number sequence by read row and col blocks from top-bottom then left-right
			for(var i=0; i < row.length; i++){
				sequence += row[i] + col[i];
			}
			//Step 4: re-subtitute new number sequence against keysquare and produce final Ciphertext
			for(var i=0; i < sequence.length; i+=2){
				position1 = (parseInt(sequence.charAt(i)) - 1) * 5;
				position2 = parseInt(sequence.charAt(i+1) - 1);
				result += keysquare.charAt(position1 + position2);
			}

			return result;
		},

		dec: function(text, keysquare, period){

			var num = "12345";

			keysquare = keysquare.toUpperCase().replace(/[^A-Z]/g, "");
			text = text.toUpperCase().replace(/[^A-Z]/g, "").replace(/[J]/g, "I");
			if(isNaN(period))
				throw "Period must be an Integer";

			var index;
			var result = "", row = "", col = "", sequence = "";
			//Step 1: Subtitute each plain char into equivalent numbers in keysquare
			for(var i=0; i < text.length; i++){
				index = keysquare.indexOf(text.charAt(i));
				sequence += num.charAt(index / 5) + num.charAt(index % 5);
			}

			var reg = new RegExp(".{1,"+period*2+"}","g");
			sequence = sequence.match(reg);

			for(var i=0; i < sequence.length; i++){
				var halfLen = Math.ceil(sequence[i].length / 2);
				reg = new RegExp(".{1,"+halfLen+"}","g");
				sequence[i] = sequence[i].match(reg);

				row += sequence[i][0];
				col += sequence[i][1];
			}

			for(var i=0; i < row.length; i++){
				position1 = (parseInt(row.charAt(i)) - 1) * 5;
				position2 = parseInt(col.charAt(i) - 1);
				result += keysquare.charAt(position1 + position2);
			}

			return result;
		},

		generateKey: function(){
			var alpha = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
    		var chars = alpha.split("");
    		result = "";
    		len = alpha.length
    		for(var i=0; i<len; i++){
        		index = Math.floor(chars.length*Math.random());
        		result += chars[index];
        		chars.splice(index,1);
			}
			return result;
		}
	},

	/*----------------------------------------------
		Trifid Cipher
	----------------------------------------------*/
	trifid: {

		enc: function(text, keysquare, period){

			var num = "123";

			keysquare = keysquare.toUpperCase().replace(/[^A-Z\.]/g, "").match(/.{1,9}/g);
			text = text.toUpperCase().replace(/[^A-Z\.]/g, "");
			if(isNaN(period))
				throw "Period must be an Integer";

			var index, squareIndex, tempIndex;
			var result = "", square = "", row = "", col = "", sequence = "";
			for(var i=0; i < text.length; i++){
				for(var j=0; j < keysquare.length; j++){
					squareIndex = keysquare[j].indexOf(text.charAt(i));
					if(squareIndex > -1){
						square += j+1;
						tempIndex = j;
						break;
					}
				}
				index = keysquare[tempIndex].indexOf(text.charAt(i));
				row += num.charAt(index / 3);
				col += num.charAt(index % 3);
			}

			var reg = new RegExp(".{1,"+period+"}","g");
			square = square.match(reg);
			row = row.match(reg);
			col = col.match(reg);
			console.log(square);
			console.log(row);
			console.log(col);

			for(var i=0; i < square.length; i++){
				sequence += square[i] + row[i] + col[i];
			}

			for(var i=0; i < sequence.length; i+=3){
				squareIndex = parseInt(sequence.charAt(i));
				rowPos = (parseInt(sequence.charAt(i+1)) - 1) * 3;
				colPos = parseInt(sequence.charAt(i+2) - 1);
				result += keysquare[squareIndex-1].charAt(rowPos + colPos);
			}

			return result.match(reg).join(" ");
		},

		dec: function(text, keysquare, period){

			var num = "123";

			keysquare = keysquare.toUpperCase().replace(/[^A-Z\.]/g, "").match(/.{1,9}/g);
			text = text.toUpperCase().replace(/[^A-Z\.]/g, "");
			if(isNaN(period))
				throw "Period must be an Integer";

			var index, squareIndex, tempIndex;
			var result = "", square = "", row = "", col = "", sequence = "";
			for(var i=0; i < text.length; i++){
				for(var j=0; j < keysquare.length; j++){
					squareIndex = keysquare[j].indexOf(text.charAt(i));
					if(squareIndex > -1){
						tempIndex = j;
						break;
					}
				}
				index = keysquare[tempIndex].indexOf(text.charAt(i));
				sequence += (tempIndex+1) + num.charAt(index / 3) + num.charAt(index % 3);
			}

			var reg = new RegExp(".{1,"+period*3+"}","g");
			sequence = sequence.match(reg);

			for(var i=0; i < sequence.length; i++){
				var halfLen = Math.ceil(sequence[i].length / 3);
				reg = new RegExp(".{1,"+halfLen+"}","g");
				sequence[i] = sequence[i].match(reg);

				square += sequence[i][0];
				row += sequence[i][1];
				col += sequence[i][2];
			}

			for(var i=0; i < square.length; i++){
				squareIndex = parseInt(square.charAt(i)) - 1;
				rowPos = (parseInt(row.charAt(i)) - 1) * 3;
				colPos = parseInt(col.charAt(i) - 1);
				result += keysquare[squareIndex].charAt(rowPos + colPos);
			}

			return result;
		},

		generateKey: function(){
			var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ.";
    		var chars = alpha.split("");
    		result = "";
    		len = alpha.length
    		for(var i=0; i<len; i++){
        		index = Math.floor(chars.length*Math.random());
        		result += chars[index];
        		chars.splice(index,1);
			}
			return result;
		}
	},

	/*----------------------------------------------
		Playfair Cipher
	----------------------------------------------*/
	playfair: {

		enc: function(text, key, omitChar){

			omitChar = omitChar || "J";

			var regOmit = new RegExp("["+omitChar+"]","g");
			var table = Enigmator.playfair.generateTable(key, omitChar).match(/.{1,5}/g);
			for(var i=0; i < table.length; i++){
				table[i] = table[i].split("");
			}

			text = text.toUpperCase().replace(/[^A-Z]/g, "").replace(regOmit, "");
			var cipher = [];
			var j = 0;
			for(var i=0; i < text.length; i+=2){
				if(text.charAt(i) != text.charAt(i+1) && text.charAt(i+1) != ""){
					cipher[j] = text.charAt(i) + text.charAt(i+1);
				}
				else {
					cipher[j] = text.charAt(i) + "X";
					i--;
				}
				j++;
			}

			var result = "";
			var first, second, firstShift, secondShift;
			for(var i=0; i < cipher.length; i++){
				first = getIndexOf(table, cipher[i].charAt(0));
				second = getIndexOf(table, cipher[i].charAt(1));

				if(first[0] == second[0]){
					if(first[1] != 4)
						firstShift = table[first[0]][first[1]+1];
					else
						firstShift = table[first[0]][0];
					if(second[1] != 4)
						secondShift = table[second[0]][second[1]+1];
					else
						secondShift = table[second[0]][0];

					result += firstShift + secondShift;
				}
				else if(first[1] == second[1]){
					if(first[0] != 4)
						firstShift = table[first[0]+1][first[1]];
					else
						firstShift = table[0][first[1]];
					if(second[0] != 4)
						secondShift = table[second[0]+1][second[1]];
					else
						secondShift = table[0][second[1]];

					result += firstShift + secondShift;
				}
				else {
					result += table[first[0]][second[1]] + table[second[0]][first[1]];
				}
			}

			return result.match(/.{1,5}/g).join(" ");
		},

		dec: function(text, key, omitChar){

			omitChar = omitChar || "J";

			var reg = new RegExp("["+omitChar+"]","g");

			var table = Enigmator.playfair.generateTable(key, omitChar).match(/.{1,5}/g);
			for(var i=0; i < table.length; i++){
				table[i] = table[i].split("");
			}

			text = text.toUpperCase().replace(/[^A-Z]/g, "");
			var cipher = text.match(/.{1,2}/g);
			var j = 0;

			if(reg.test(text) || text.length % 2 != 0)
				return "";

			var result = "";
			var first, second, firstShift, secondShift;
			for(var i=0; i < cipher.length; i++){
				first = getIndexOf(table, cipher[i].charAt(0));
				second = getIndexOf(table, cipher[i].charAt(1));

				if(first[0] == second[0]){
					if(first[1] != 0)
						firstShift = table[first[0]][first[1]-1];
					else
						firstShift = table[first[0]][4];
					if(second[1] != 0)
						secondShift = table[second[0]][second[1]-1];
					else
						secondShift = table[second[0]][4];
					result += firstShift + secondShift;
				}
				else if(first[1] == second[1]){
					if(first[0] != 0)
						firstShift = table[first[0]-1][first[1]];
					else
						firstShift = table[4][first[1]];
					if(second[0] != 0)
						secondShift = table[second[0]-1][second[1]];
					else
						secondShift = table[4][second[1]];
					result += firstShift + secondShift;
				}
				else {
					result += table[first[0]][second[1]] + table[second[0]][first[1]];
				}
			}

			return result;
		},

		generateTable: function(key, omitChar){
			
			key = key.toUpperCase().replace(/[^A-Z]/g, "");
			var alphabet =  key+"ABCDEFGHIJKLMNOPQRSTUVWXYZ";

			var regex = new RegExp("["+omitChar+"]", "g");
			alphabet = alphabet.replace(regex, "");

			var table = [];
			var character;
			var index = 0;
			for(var i=0; i < alphabet.length; i++){
				character = alphabet.charAt(i);
				if(table.indexOf(character) == -1){
					table[index] = character;
					index++;
				}
			}
			
			return table.join("");
		},

		randomKey: function(omitChar){

			omitChar = omitChar || "J";

			var regOmit = new RegExp("["+omitChar+"]","g");

			var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".replace(regOmit, "");
    		var chars = alpha.split("");

    		result = "";
    		len = alpha.length;
    		for(var i=0; i<len; i++){
        		index = Math.floor(chars.length*Math.random());
        		result += chars[index];
        		chars.splice(index,1);
			}
			return result;
		}

		
	},

	/*-----------------------------------------------
		Rail Fence (Zig-Zag) Cipher
	-----------------------------------------------*/
	railfence: {

		enc: function(text, n){

			n= Number(n);
			text = text.replace(/[\n\r]/g, " ");
			if(n < 2){
				return text;
			}

			var len = text.length;
			var result = [];
			for(var i=0; i<n; i++){
				result[i] = text.replace(/[^]/g, "").split("");
			}
			
			var i = 0;
			var j = 0;
			while(i < len){
				for(; j<n; j++){
					result[j][i] = text.charAt(i);
					i++;
				}

				for(var j=n-2; j>0; j--){
					result[j][i] = text.charAt(i);
					i++;
				}
			}

			var ciphertext = "";
			for(i=0; i < result.length; i++){
				ciphertext += result[i].join("");
			}

			return ciphertext;
		},

		dec: function(text, n){

			n= Number(n);
			text = text.replace(/[\n\r]/g, " ");
			if(n < 2){
				return text;
			}

			var len = text.length;
			var result = [];
			for(var i=0; i<n; i++){
				result[i] = text.replace(/[^]/g, "").split("");
			}

			var i = 0;
			var j = 0;
			while(i < len){
				for(; j<n; j++){
					if(i < len)
						result[j][i] = "X";
					i++;
				}

				for(var j=n-2; j>0; j--){
					if(i < len)
						result[j][i] = "X";
					i++;
				}
			}
			
			var index = 0;
			for(i=0; i < result.length; i++){
				for(j=0; j < result[i].length; j++){
					if(result[i][j] == "X"){
						result[i][j] = text.charAt(index);
						index++;
					}
				}
			}
			
			i=0;j=0;
			var plain = "";
			while(i < len){
				for(; j<n; j++){
					if(i < len)
						plain += result[j][i];
					i++;
				}

				for(var j=n-2; j>0; j--){
					if(i < len)
						plain += result[j][i];
					i++;
				}
			}

			return plain;

		}
	},

	/*-----------------------------------------------
		ADFGVX Cipher
	-----------------------------------------------*/
	adfgvx: {

		enc: function(text, key, gridChar){

			gridChar = gridChar || "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
			key = key || "A";
			key = key.replace(/[^A-Za-z0-9]/g, "");
			key = key.toUpperCase().split("");
			
			var alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			var adfgvx = "ADFGVX";
			//Create ADFGVX Square Grid String (e.g : AAADAFAG...XVXX)
			var grid = "";
				for(var j=0; j < 6; j++){
					for(var k=0; k < 6;k++){
						grid += adfgvx.charAt(j) + adfgvx.charAt(k);
					}
				}
			
			grid = grid.match(/.{1,2}/g);

			var str = text.toUpperCase();
			var keySize = key.length;
			var len = str.length;
			var result = "";
			var character, replaced, position, transpos, finalKey;

			//Subtitute Plaintext with ADFGVX Square Grid
			for(var i=0; i < len;i++){
				character = str.charAt(i);
				position = gridChar.indexOf(character);
				if(position >= 0){
					replaced = grid[position];
					result += replaced;
				}
			}

			//Perform Columnar Transposition on Result against Key
			//(Adapted from 'Practical Cryptography')
			var column = result.length / key.length;
    		ciphertext = "";
    		var k=0;
    		for(var i=0; i < key.length; i++){
        		while(k<36){
            		transpos = key.indexOf(alphabet.charAt(k));
            		key[transpos] = "_";
            		finalKey = key.join("");
            		if(transpos >= 0)
            			break;
            		else
            			k++;
        		}
        		for(j=0; j < column; j++)
            		ciphertext += result.charAt(j*finalKey.length + transpos);
    		}

    		return ciphertext.match(/.{1,5}/g).join(" ");

		},

		dec: function(text, key, gridChar){

			gridChar = gridChar || "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
			key = key || "A";
			key = key.replace(/[^A-Za-z0-9]/g, '');
			key = key.toUpperCase();
			text = text.toUpperCase().replace(/[^ADFGVX]/g, "");
			
			var alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			var adfgvx = "ADFGVX";

			var keyLen = key.length;

			var numLongCols = text.length % keyLen;
    		var cols = new Array(keyLen);
    		var colLength = Math.floor(text.length / keyLen);
    		
    		var i=0
    		var upto=0;
    		for(j=0; j < keyLen ;){
        		t=key.indexOf(alphabet.charAt(i));        
        		if(t >= 0){
            		if(t<numLongCols) cl = colLength+1;
            		else cl = colLength;
            		cols[t] = text.substr(upto,cl);
            		upto = upto+cl;
            		arrKey = key.split(""); arrKey[t] = "_"; key = arrKey.join("");
            		j++;
        		}else {
        			i++;         
        		}
    		}    
    		
    		result = "";
    		for(j=0; j < colLength+1; j++){
    		for(i=0; i < keyLen; i++){
         		result += cols[i].charAt(j);
    		}}
    		
    		var plaintext = "";
    		for(i=0; i < result.length; i+=2){
        		keyindex = adfgvx.indexOf(result.charAt(i))*6 + adfgvx.indexOf(result.charAt(i+1));
        		plaintext += gridChar.charAt(keyindex);
    		}

    		return plaintext;

		},

		generateKey: function(){
			var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    		var chars = alpha.split("");
    		result = "";
    		len = alpha.length
    		for(var i=0; i<len; i++){
        		index = Math.floor(chars.length*Math.random());
        		result += chars[index];
        		chars.splice(index,1);
			}
			return result;

		}
	},

	/*-----------------------------------------------
		Grille Cipher (Cardan Grille)

		How this cipher works :
		https://en.wikipedia.org/wiki/Grille_(cryptography)

		Require :
		- grille.js
	-----------------------------------------------*/
	grille: {

		dec: function(text, grille, rotation){

			return grille_decrypt(text, grille, rotation);
		}
	},

	hill: {

		enc: function(text, key, padChar){

			padChar = padChar || "X";

			text = text.toUpperCase().replace(/[^A-Z]/g, "");
			var size = key.length;
			var cipherArr = [];
			var result = "";

			var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			var remain = text.length % size;
			if(remain != 0){
				for(var i=0; i < size-remain; i++){
					text += padChar.toUpperCase();
					console.log(text);
				}
			}

			var determinant = findDet(key);
			if(determinant % 2 == 0 || determinant == 13){
				alert("Matrix key is not valid! Try other key.");
				return;
			}

			for(var i=0; i < size; i++){
				for(var j=0; j < size;j++){
					key[i][j] = key[i][j] % 26;
				}
			}
			for(var i=0; i < text.length; i+=size){
				for(var j=0; j < size; j++){
					cipherArr[j] = 0;
					for(var k=0; k < size; k++){
						char = alpha.indexOf(text.charAt(i+k));
						cipherArr[j] += key[j][k]*char;
					}
					result += alpha.charAt((cipherArr[j]) % 26);
				}
					
			}

			return result;

		},

		dec: function(text, key, padChar){

			padChar = padChar || "X";

			text = text.toUpperCase().replace(/[^A-Z]/g, "");
			var inv_key = [];
			var size = key.length;
			if(text.length % size != 0){
				alert("Ciphertext length isn't divisible with the Key size");
				return;
			}
			var plainArr = [];
			var result = "";

			var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

			var determinant = findDet(key);
			key = adj(key);
			var inv_determinant = 0;

			for(var i=0; i < size; i++){
				for(var j=0; j < size;j++){
					key[i][j] = key[i][j] % 26;
					if(key[i][j] < 0)
						key[i][j] += 26;
				}
			}

			if(determinant % 2 == 0 || determinant == 13){
				alert("Matrix key is incorrect!");
				return;
			}

			//find Modular Multiplicative Inverse of Determinant
			for(var i=1; i <= 25;i+=2){
				if((determinant*i) % 26 == 1)
					inv_determinant = i;
			}

			for(var i=0; i < size; i++){
				inv_key[i] = [];
				for(var j=0; j < size; j++){
					inv_key[i][j] = (inv_determinant*key[i][j]) % 26;
					if(inv_key[i][j] < 0)
						inv_key[i][j] += 26;
				}
			}

			//console.log(determinant, inv_determinant, key, inv_key);

			result = Enigmator.hill.enc(text, inv_key);
			return result;

		}
	},


	/*-----------------------------------------------
		DANCING MEN CIPHER
		Based on the short story of "The Return of Sherlock Holmes - The Dancing Men"
		by Sir Arthur Conan Doyle

		Require :
		-Font "GL-DancingMen.ttf" (define in css)
	-----------------------------------------------*/
	dancingmen: {

		enc: function(text){
			var alpha = "abcdefghijklmnopqrstuvwxyz ";
			var newline = /[\n\r]/g;

			var str = text.toLowerCase();
			var len = str.length;
			var result = "";
			var position, character, nextChar;
			for(var i=0; i < len; i++){
				character = str.charAt(i);
				nextChar = str.charAt(i+1);
				position = alpha.indexOf(character);
				if(position < 0)
					continue;
				else if(position != 26)
				{
					if(alpha.indexOf(nextChar) == 26 || newline.test(nextChar))
					{
						result += character.toUpperCase();
					}
					else
					{
						result += character;
					}
				}
				else
					continue;
			}
			
			return result;
		},

		dec: function(text){
			var alpha = "abcdefghijklmnopqrstuvwxyz";
			var regexLowercase = /[a-z]/;
			var regexUppercase = /[A-Z]/;

			var str = text;
			var len = str.length;
			var result = "";
			var character;
			for(var i=0; i < len; i++){
				character = str.charAt(i);
				if(regexUppercase.test(character)){
					result += (character + " ");
				}
				else if(regexLowercase.test(character)){
					result += character;
				}
				else {
					continue;
				}
			}

			return result.toUpperCase();
		}
	},

	/*-----------------------------------------------
		Gold Bug
		Based on the short story of "The Gold-Bug"
		by Edgar Allan Poe
	-----------------------------------------------*/
	goldbug: {

		enc: function(text){
			var alpha  = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			var symbol = "52-†81346JK09*‡.Q();?¶]X:Z";
			var regex = /[A-Z]/;

			var str = text.toUpperCase();
			var len = str.length;
			var result = "";
			var character, encrypted;
			for(var i=0; i < len;i++){
				character = str.charAt(i);
				if(regex.test(character)){
					encrypted = symbol.charAt(alpha.indexOf(character));
					result += encrypted;
				}
			}

			return result;
		},

		dec: function(text){
			var alpha  = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			var symbol = "52-†81346JK09*‡.Q();?¶]X:Z";

			var str = text.toUpperCase();
			var len = str.length;
			var result = "";
			var character, decrypted;
			for(var i=0; i < len;i++){
				character = str.charAt(i);
				if(symbol.indexOf(character) >= 0){
					decrypted = alpha.charAt(symbol.indexOf(character));
					result += decrypted;
				}
			}

			return result;
		}
	},

	cryptanalysis: {

		/*----------------------------
		require : crypto-identifier.js
		------------------------------*/
		identify: function(text, type){

			return startIdentify(text, type);
		},

		getFrequency: function(text, n){

			n = n || 1;
			n = Number(n);
			text = text.toUpperCase();

			var freq = {};
    		for (var i=0; i <= text.length-n; i++) {

        		var character = text.charAt(i);
        		for(var j=1; j < n; j++){
        			character += text.charAt(i+j);
        		}
        		if(/\s+/g.test(character)) continue;

        		if (freq[character]) {
           			freq[character]++;
        		} else {
           			freq[character] = 1;
        		}
    		}

    		return freq;
		},

		getIndexOfCoincidence: function(text){
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
		},

		getChiSquared: function(text){

			text = text.toLowerCase().replace(/[^a-z]/g, "");
			var counts = new Array(26);
			var expected = [0.08167,0.01492,0.02782,0.04253,0.12702,0.02228,0.02015,0.06094,0.06966,0.00153,0.00772,
							0.04025,0.02406,0.06749,0.07507,0.01929,0.00095,0.05987,0.06327,0.09056,0.02758,0.00978,
							0.02360,0.00150,0.01974,0.00074];
			var totcount = 0;
			var result = 0;
			for(i=0; i < 26; i++){
				counts[i] = 0;
			}

			for(i=0; i < text.length; i++){
				counts[text.charCodeAt(i) - 97]++;
				totcount++;
			}
			
			for(i=0; i<26; i++){
				result = result + Math.pow((counts[i] - totcount * expected[i]), 2) / (totcount * expected[i]);
			}

			return result;
		},

		/*----------------------------
		Calculate "how similar text is to English" (Fitness Measure)
		With Quadgram Statistics
		(Imported from C implementation of practicalcryptography.com)

		Required :
		-	lib/qgr.js
		--------------------------------*/

		scoreText: function(text){

			text = text.replace(/[^A-Z]/gi, "").toUpperCase();

			var len = text.length;
			var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			var temp = [];
			var score = 0;

			for(var i=0; i < len-3; i++){
				temp[0] = alpha.indexOf(text.charAt(i));
				temp[1] = alpha.indexOf(text.charAt(i+1));
				temp[2] = alpha.indexOf(text.charAt(i+2));
				temp[3] = alpha.indexOf(text.charAt(i+3));
				score += qgram[17576*temp[0] + 676*temp[1] + 26*temp[2] + temp[3]];
			}

			return score;

		},

		stringConvert: {

			/*--------------------------------------------
				require : 
				- Utils		BigInt.js
			----------------------------------------------*/
			convertBase: function (num) {
				num = num.replace(/^0x/g, "");
        		return {
            		from : function (baseFrom) {
                		return {
                    		to : function (baseTo) {
                        		var bigInt = str2bigInt(num, baseFrom, 1, 1);
    							return bigInt2str(bigInt, baseTo);
                    		}
                		};
            		}
        		};
    		},

			toAscii: function(n, base){

				var regReplace = new RegExp("[^0-9]","g");
				var regMatch = new RegExp(".{1,3}","g");

				if(base == 16){
					regReplace = new RegExp("^[0x]|[^a-f0-9]","g");
					regMatch = new RegExp(".{1,2}","g");
				}
				else if(base == 8){
					regReplace = new RegExp("[^0-7]","g");
				}
				else if(base == 2){
					regReplace = new RegExp("[^01]","g");
					regMatch = new RegExp(".{1,8}","g");
				}

				num = n.replace(regReplace, "").match(regMatch) || [];
				var result = "";

				for(var i=0; i < num.length; i++){
					result += String.fromCharCode(parseInt(num[i], base));
				}

				return result;
			},

			fromAscii: function(n, base){

				var result = "";
				var pad = -3; 
				var zero = "00";

				if(base == 16){
					pad = -2;
					zero = "0";
				}
				else if(base == 2){
					pad = -8;
					zero = "0000000";
				}
				
				for(var i=0; i < n.length; i++){
					var ascii = n.charCodeAt(i).toString(base);
					result += " " + (zero+ascii).slice(pad);
				}

				return result.slice(1);
			}
		}
	},

	version: "0.5.2"
};

/*********************************************

	Some useful function used in Enigmator

**********************************************/

function padKey(key){

	key = key.replace(/[^0-9a-f]/gi, "");

	if(key.length == 32 || key.length == 48 || key.length == 64) {
		return key;
	}
	else if(key.length > 64){
		key = key.slice(0, 64);
	}
	else {
		while(key.length < 64)
			key += "0";
	}

	return key;
}

function padIV(iv, bf){

	iv = iv.replace(/[^0-9a-f]/gi, "");

	var len = 32;
	if(bf) len = 16;

	if(iv.length < len) {
		while(iv.length < len)
			iv += "0";
	}
	else if(iv.length > len){
		iv = iv.slice(0, len);
	}

	return iv;
}


//Get index of Multidimensional Array
function getIndexOf(array, c){
	for(var i=0; i < array.length; i++){
		var index = array[i].indexOf(c);
		if( index > -1){
			return [i, index];
		}
	}
}

//get Adjoint of given matrix
function adj(matrix){

	var size = matrix.length;
	var temp;

	if(size == 2){
		var new_matrix = [[],[]];
		new_matrix[0][1] = matrix[0][1]*-1;
		new_matrix[1][0] = matrix[1][0]*-1;
		new_matrix[0][0] = matrix[1][1];
		new_matrix[1][1] = matrix[0][0];
		return new_matrix;
	}
	else if(size == 3){
		var new_matrix = [[],[],[]];
		new_matrix[0][0] = (matrix[1][1]*matrix[2][2]-matrix[1][2]*matrix[2][1]);
		new_matrix[0][1] = (matrix[0][1]*matrix[2][2]-matrix[0][2]*matrix[2][1])*-1;
		new_matrix[0][2] = (matrix[0][1]*matrix[1][2]-matrix[0][2]*matrix[1][1]);
		new_matrix[1][0] = (matrix[1][0]*matrix[2][2]-matrix[1][2]*matrix[2][0])*-1;
		new_matrix[1][1] = (matrix[0][0]*matrix[2][2]-matrix[0][2]*matrix[2][0]);
		new_matrix[1][2] = (matrix[0][0]*matrix[1][2]-matrix[0][2]*matrix[1][0])*-1;
		new_matrix[2][0] = (matrix[1][0]*matrix[2][1]-matrix[1][1]*matrix[2][0]);
		new_matrix[2][1] = (matrix[0][0]*matrix[2][1]-matrix[0][1]*matrix[2][0])*-1;
		new_matrix[2][2] = (matrix[0][0]*matrix[1][1]-matrix[0][1]*matrix[1][0]);
		return new_matrix;
	}
}

//Find determinant for given matrix
function findDet(matrix){

	var size = matrix.length;
	var det = 0;

	if(size == 2){
		det = (matrix[0][0]*matrix[1][1])-(matrix[0][1]*matrix[1][0]);
		return ((det%26)+26)%26;
	}
	else if(size == 3){
		val1 = (matrix[0][0]*matrix[1][1]*matrix[2][2]+matrix[0][1]*matrix[1][2]*matrix[2][0]+matrix[0][2]*matrix[1][0]*matrix[2][1]);
		val2 = (matrix[0][2]*matrix[1][1]*matrix[2][0]+matrix[0][0]*matrix[1][2]*matrix[2][1]+matrix[0][1]*matrix[1][0]*matrix[2][2]);
		det = val1 - val2;
		return ((det%26)+26)%26;
	}
}