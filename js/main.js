window.method = null;

var loadTimer = null;
var url = window.location.pathname;
var filename = url.substring(url.lastIndexOf('/')+1);
var menureg = new RegExp("/"+filename,"g");
var menu = {

	encoding: "<a href='../encoding/base64.html'><li>Base64</li></a>\
			   <a href='../encoding/base32.html'><li>Base32</li></a>\
			   <a href='../encoding/base16.html'><li>Base16</li></a>\
			   <div class='space'></div>\
			   <a href='../encoding/uuencoding.html'><li>UUencoding</li></a>\
			   <a href='../encoding/ascii85.html'><li>Ascii85</li></a>",

	cipher: "<a href='../cipher/rsa.html'><li>RSA Encryption</li></a>\
			<a href='../cipher/rsa_keygen.html'><li>RSA Key Generator</li></a>\
			<div class='space'></div>\
			<a href='../cipher/aes.html'><li>AES</li></a>\
			<a href='../cipher/des.html'><li>DES</li></a>\
			<a href='../cipher/tripledes.html'><li>TripleDES</li></a>\
			<a href='../cipher/blowfish.html'><li>Blowfish</li></a>\
			<div class='hide'>\
			<a href='../cipher/rc4.html'><li>RC4</li></a>\
			<a href='../cipher/rabbit.html'><li>Rabbit</li></a>\
			</div>\
			<a id='btn-more-1' class='more' href='javascript:void();'><li>More <span>&#x25BC;</span></li></a>\
			<div class='space'></div>\
			<a href='../cipher/caesar_shift.html'><li>Caesar Shift</li></a>\
			<a href='../cipher/vigenere.html'><li>Vigenere</li></a>\
			<a href='../cipher/simple_substitution.html'><li>Simple Substitution</li></a>\
			<a href='../cipher/xor.html'><li>XOR</li></a>\
			<div class='hide'>\
			<a href='../cipher/affine.html'><li>Affine</li></a>\
			<a href='../cipher/atbash.html'><li>Atbash</li></a>\
			<a href='../cipher/autokey.html'><li>Autokey</li></a>\
			<a href='../cipher/beaufort.html'><li>Beaufort</li></a>\
			<a href='../cipher/bacon.html'><li>Bacon</li></a>\
			<a href='../cipher/bifid.html'><li>Bifid</li></a>\
			<a href='../cipher/trifid.html'><li>Trifid</li></a>\
			<a href='../cipher/hill.html'><li>Hill</li></a>\
			<a href='../cipher/grille.html'><li>Grille</li></a>\
			<a href='../cipher/playfair.html'><li>Playfair</li></a>\
			<a href='../cipher/railfence.html'><li>Railfence</li></a>\
			<a href='../cipher/adfgvx.html'><li>ADFGVX</li></a>\
			<a href='../cipher/morse_code.html'><li>Morse Code</li></a>\
			<a href='../cipher/pigpen.html'><li>Pigpen</li></a>\
			<a href='../cipher/dancing_men.html'><li>Dancing Men</li></a>\
			<a href='../cipher/gold_bug.html'><li>Gold Bug</li></a>\
			</div>\
			<a id='btn-more-2' class='more' href='javascript:void();'><li>More <span>&#x25BC;</span></li></a>\
			<div class='space'></div>",

	hash: "<a href='../hash/md4.html'><li>MD4</li></a>\
			<a href='../hash/md5.html'><li>MD5</li></a>\
			<div class='space'></div>\
			<a href='../hash/sha-1.html'><li>SHA-1</li></a>\
			<a href='../hash/sha-256.html'><li>SHA-256</li></a>\
			<a href='../hash/sha-512.html'><li>SHA-512</li></a>\
			<a href='../hash/sha-3.html'><li>SHA-3</li></a>\
			<div class='space'></div>\
			<a href='../hash/ripemd-160.html'><li>RIPEMD-160</li></a>\
			<div class='space'></div>",

	cryptanalysis: "<a href='../cryptanalysis/crypto_identifier.html'><li>Crypto Identifier</li></a>\
			<a href='../cryptanalysis/massive_decrypter.html'><li>Massive Decrypter</li></a>\
			<a href='../cryptanalysis/rsa_key_analysis.html'><li>RSA Key Analysis</li></a>\
			<div class='space'></div>\
			<a href='../cryptanalysis/frequency_analysis.html'><li>Frequency Analysis</li></a>\
			<a href='../cryptanalysis/cryptogram_solver.html'><li>Cryptogram Solver</li></a>\
			<div class='space'></div>\
			<a href='../cryptanalysis/string_converter.html'><li>String Converter</li></a>\
			<a href='../cryptanalysis/string_manipulation.html'><li>String Manipulation</li></a>\
			<div class='space'></div>",

	about: "<a href='../about/about.html'><li>About</li></a>\
			<a href='../about/license.html'><li>License</li></a>\
			<a href='../about/download.html'><li>Download</li></a>"
}

function execute(methodType){
	if(!$("#btn-input-file").hasClass("active")){
		input = $("#input").val();
		var str = methodType(input);
		if(methodType == method.dec && $("#btn-decodeFile").hasClass("active"))
			window.location = "data:application/octet-stream;base64,"+btoa(str);
		else
			$("#output").val(str);
	}
	else {
		readFile(file, function(e){
			input = arrayBufferToStr(e.target.result);
			var str = methodType(input);
			if(methodType == method.dec && $("#btn-decodeFile").hasClass("active"))
				window.location = "data:application/octet-stream;base64,"+btoa(str);
			else
				$("#output").val(str);
		});
	}
}

/*	File Reader for Base64	*/
	
var file;

function arrayBufferToStr(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return binary;
}

function fileEncode() {
	reader = new FileReader();
    reader.onload = function (event) {
    	try {
    		var result = arrayBufferToStr(event.target.result);
            $("#output").val(method.enc(result));
        } catch(e) {
            $("#output").val(e);
        }
    };
    reader.readAsArrayBuffer(file);
}

function readFile(file, onLoadCallback){
	var reader = new FileReader();
	reader.onload = onLoadCallback;
	reader.readAsArrayBuffer(file);
}

function fileChecksum(hmac, /* SHA-3 --> */ size) {
	reader = new FileReader();
    reader.onload = function (event) {
    	try {
    		var result = arrayBufferToStr(event.target.result);
    		if(hmac == undefined)
    			if(size == undefined)
            		$("#output").val(method(result));
            	else
            		$("#output").val(method(result, size));
            else
            	if(size == undefined)
            		$("#output").val(method(result, hmac));
            	else
            		$("#output").val(method(result, size, hmac));
        } catch(e) {
            $("#output").val(e);
        }
    };
    reader.readAsArrayBuffer(file);
}

function fileClear(){
	file = null;
	$(".input-upload h5").text("No file selected");
}

function showLoader(d){
	$(".loader").fadeIn("fast");
	//loadTimer = setInterval(animateLoader, 300);
}

function hideLoader(){
	$(".loader").fadeOut("fast");
	//clearInterval(loadTimer);
}

function animateLoader(){
	if($(".loader div").text() == "Processing..."){
		$(".loader div").text("Processing");
	}
	else {
		var text = $(".loader div").text();
		$(".loader div").text(text+".");
	}
}

$(document).ready(function(){

	var filedir = /encoding|cipher|hash|cryptanalysis|about/g.exec(url);
	console.log(filedir);
	if(filedir != null){
		filedir = filedir[0].replace(/\/+/g, "");
		menu[filedir] = menu[filedir].replace(menureg, "/"+filename+"' class='selected'");

		$("#menu-cipher").html(menu.cipher);
		$("#menu-encoding").html(menu.encoding);
		$("#menu-hash").html(menu.hash);
		$("#menu-cryptanalysis").html(menu.cryptanalysis);
		$("#menu-about").html(menu.about);

		var includefile1 = ["rc4.html","rabbit.html"];
		var includefile2 = ["affine.html","atbash.html","autokey.html","beaufort.html","bacon.html","bifid.html","trifid.html","grille.html","railfence.html","playfair.html","adfgvx.html","morse_code.html","pigpen.html","dancing_men.html","gold_bug.html","hill.html"];

		if($.inArray(filename, includefile1) > -1){
			$("#btn-more-1").prev().show();
			$("#btn-more-1").find("li").html("Less <span>&#x25B2;</span>");
		}
		if($.inArray(filename, includefile2) > -1){
			$("#btn-more-2").prev().show();
			$("#btn-more-2").find("li").html("Less <span>&#x25B2;</span>");
		}
	}

	function showSubMenu(type){
		if(document.body.scrollWidth <= 640)
		{
			if(($("#sub-menu-title").html() == type) && ($(".sub-menu").css("display") == "block"))
			{
				$(".menubar").css("height","60px");
				$(".sub-menu").hide();
			}
			else if($(".sub-menu").css("display") == "none")
			{
				$(".menubar").css("height","100%");
				$(".sub-menu").show();
			}
		}
		else if(document.body.scrollWidth <= 900)
		{
			if(($("#sub-menu-title").html() == type) && ($(".sub-menu").css("display") == "block"))
			{
				$(".menubar").css("width","60px");
				$(".menubar .menu").css("width","100%");
				$(".sub-menu").hide();
			}
			else if($(".sub-menu").css("display") == "none")
			{
				$(".menubar").css("width","300px");
				$(".menubar .menu").css("width","20%");
				$(".sub-menu").show();
			}
		}

		$("#sub-menu-title").text(type);
		$(".menu li").removeClass("selected");
		$("#btn-"+type.toLowerCase()).addClass("selected");
		$(".sub-menu ul").hide();
		$("#menu-"+type.toLowerCase()).fadeIn("fast");
	}

	$("#btn-encoding").click(function(){
		showSubMenu("Encoding");
	});

	$("#btn-cipher").click(function(){
		showSubMenu("Cipher");
	});

	$("#btn-hash").click(function(){
		showSubMenu("Hash");
	});

	$("#btn-cryptanalysis").click(function(){
		showSubMenu("Cryptanalysis");
	});

	$("#btn-about").click(function(){
		showSubMenu("About");
	});

	$(".more").click(function(){
		if($(this).prev().css("display") == "none")
		{
			$(this).find("li").html("Less <span>&#x25B2;</span>");
			$(this).prev().show();
		}
		else
		{
			$(this).find("li").html("More <span>&#x25BC;</span>");
			$(this).prev().hide();
		}
	})

	$(window).resize(function(){
		if(document.body.clientWidth > 900)
		{
			$(".menubar").css({"width":"300px","height":"100%"});
			$(".menubar .menu").css("width","20%");
			$(".sub-menu").show();
		}	
		else if(document.body.scrollWidth > 640)
		{
			$(".menubar").css({"width":"60px","height":"100%"});
			$(".menubar .menu").css("width","100%");
			$(".sub-menu").hide();
		}
		else if(document.body.scrollWidth <= 640)
		{
			$(".menubar").css({"width":"100%","height":"60px"});
			$(".menubar .menu").css("width","100%");
			$(".sub-menu").hide();
		}
		
	})

	$(".select button").click(function(){
		if($(this).next().css("display") == "none"){
			$(".select .option").hide();
			$(this).next().show();
		}
		else {
			$(this).next().hide();
		}
	})

	
	$(document).keydown(function(e){
		if($(".select button").is(":focus")){
			if(e.keyCode == 40){
				e.preventDefault();
				$(".select button").show();
			}
		}
	
	})

	$(".select").click(function(){
		$(this).find($(".option")).width($(this).width());
	})

	$(".select .option li").click(function(){
		var val = $(this).text();
		$(this).parent().hide();
		$(this).parent().prev().find("span").text(val);
	})

	$(document).click(function(event) { 
    	if(!$(event.target).closest('.select').length) {
        	$(".select .option").hide();
    	}
	})

	$(".toggle-button button").click(function(){
		$(this).parent().find("button").removeClass("active");
		$(this).addClass("active");
	})

	$("textarea#output").on("focus", function(){
		$(this).select();
	});

	$("#btn-clear").click(function(){
		$("input, textarea").val("");
		fileClear();
	})

	$("#btn-enc").click(function(){
		execute(method.enc);
	})
		
	$("#btn-dec").click(function(){
		execute(method.dec);
	})

	var inputFile = $("#encodeFromFile, #checksum, #inputFile");

	inputFile.bind('change', function() {
		file = inputFile[0].files[0];
		$(".input-upload h5").text(file.name);
    });

})