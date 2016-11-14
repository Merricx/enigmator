window.method = null;

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

$(document).ready(function(){

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