/*
*	Grille Cipher (Cardan Grille)
*	Written by : Merricx
*	Implementation for Enigmator
*
*	Arguments :
*	text	: Ciphertext in String ("HDGDTEISKSLFAQPO")
*	grille 	: Grille in Array ( [[0,1,0,0][1,0,0,1][1,1,0,0][0,1,0,0]] ) 0 for close, 1 for open
*/

//Reverse the Grille (Rotate 180 degrees clockwise)
function rot180(result, original){
	result = Array.prototype.slice.call(original);
	for(i=0; i<result.length;i++){
		result[i] = Array.prototype.slice.call(original[i]);
		result[i].reverse();
	}
	return result.reverse();
}

//Read the cipher with 4 Grille
function readCipher(cipher, grille){
	var plain = "";
	var index = 0;
	for(var i=0; i < grille.length; i++){
		for(var j=0; j < grille[i].length; j++){
			if(grille[i][j] == 1){
				plain += cipher.charAt(index);
			}
			index++;
		}
	}
	return plain;
}


//Main function
function grille_decrypt(text, grille, rotation){

	text = text.replace(/[\s+]/g, '');

	var result = "";
	var index = 0;

	result += readCipher(text, grille);
	if(rotation){

		var grille2 = [];
		var grille3 = [];
		var grille4 = [];

		var len = grille.length;
		var i=0;
		var j=0;
		//Rotate grille 90 degrees clockwise (Create second grille)
		for(var k=len-1; k >= 0;k--){
			grille2[i] = [];
			for(var l=len-1; l >= 0;l--){
				j %= len;
				grille2[i][j] = grille[l][i];
				j++;
			}
			i++;
		}
	

		grille3 = rot180(grille3, grille);
		grille4 = rot180(grille4, grille2);

		result += readCipher(text, grille2);
		result += readCipher(text, grille3);
		result += readCipher(text, grille4);
	}

	return result;
}