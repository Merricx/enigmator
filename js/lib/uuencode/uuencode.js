function rtrim(str, charlist) {
  //  discuss at: http://phpjs.org/functions/rtrim/
  // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  //    input by: Erkekjetter
  //    input by: rem
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // bugfixed by: Onno Marsman
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //   example 1: rtrim('    Kevin van Zonneveld    ');
  //   returns 1: '    Kevin van Zonneveld'

  charlist = !charlist ? ' \\s\u00A0' : (charlist + '')
    .replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\\$1');
  var re = new RegExp('[' + charlist + ']+$', 'g');
  return (str + '')
    .replace(re, '');
}

function is_scalar(mixed_var) {
  //  discuss at: http://phpjs.org/functions/is_scalar/
  // original by: Paulo Freitas
  //   example 1: is_scalar(186.31);
  //   returns 1: true
  //   example 2: is_scalar({0: 'Kevin van Zonneveld'});
  //   returns 2: false

  return (/boolean|number|string/)
    .test(typeof mixed_var);
}

function convert_uuencode(str) {
  //       discuss at: http://phpjs.org/functions/convert_uuencode/
  //      original by: Ole Vrijenhoek
  //      bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  //      bugfixed by: Brett Zamir (http://brett-zamir.me)
  // reimplemented by: Ole Vrijenhoek
  //       depends on: is_scalar
  //        example 1: convert_uuencode("test\ntext text\r\n");
  //        returns 1: "0=&5S=`IT97AT('1E>'0-\"@``"

  var chr = function(c) {
    return String.fromCharCode(c);
  };

  if (!str || str === '') {
    return chr(0);
  } else if (!this.is_scalar(str)) {
    return false;
  }

  var c = 0,
    u = 0,
    i = 0,
    a = 0;
  var encoded = '',
    tmp1 = '',
    tmp2 = '',
    bytes = {};

  // divide string into chunks of 45 characters
  var chunk = function() {
    bytes = str.substr(u, 45);
    for (i in bytes) {
      bytes[i] = bytes[i].charCodeAt(0);
    }
    if (bytes.length != 0) {
      return bytes.length;
    } else {
      return 0;
    }
  };

  while (chunk() !== 0) {
    c = chunk();
    u += 45;

    // New line encoded data starts with number of bytes encoded.
    encoded += chr(c + 32);

    // Convert each char in bytes[] to a byte
    for (i in bytes) {
      tmp1 = bytes[i].charCodeAt(0)
        .toString(2);
      while (tmp1.length < 8) {
        tmp1 = '0' + tmp1;
      }
      tmp2 += tmp1;
    }

    while (tmp2.length % 6) {
      tmp2 = tmp2 + '0';
    }

    for (i = 0; i <= (tmp2.length / 6) - 1; i++) {
      tmp1 = tmp2.substr(a, 6);
      if (tmp1 == '000000') {
        encoded += chr(96);
      } else {
        encoded += chr(parseInt(tmp1, 2) + 32);
      }
      a += 6;
    }
    a = 0;
    tmp2 = '';
    encoded += '\n';
  }

  // Add termination characters
  encoded += chr(96) + '\n';

  return encoded;
}


function convert_uudecode(str) {
  // http://kevin.vanzonneveld.net
  // +   original by: Ole Vrijenhoek
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: is_scalar
  // -    depends on: rtrim
  // *     example 1: convert_uudecode('+22!L;W9E(%!(4\"$`\n`');
  // *     returns 1: 'I love PHP'

  // Not working perfectly

  // shortcut
  var chr = function(c) {
    return String.fromCharCode(c);
  };

  if (!str || str === '') {
    return chr(0);
  } else if (!this.is_scalar(str)) {
    return false;
  } else if (str.length < 8) {
    return false;
  }

  var decoded = '', tmp1 = '', tmp2 = '';
  var c = 0, i = 0, j = 0, a = 0;
  var line = str.split('\n');
  var bytes = [];

  for (i in line) {
    c = line[i].charCodeAt(0);
    bytes = line[i].substr(1);

    // Convert each char in bytes[] to a 6-bit
    for (j in bytes) {
      tmp1 = bytes[j].charCodeAt(0) - 32;
      tmp1 = tmp1.toString(2);
      while (tmp1.length < 6) {
        tmp1 = '0' + tmp1;
      }
      tmp2 += tmp1;
    }

    for (i = 0; i <= (tmp2.length / 8) - 1; i++) {
      tmp1 = tmp2.substr(a, 8);
      if (tmp1 == '01100000') {
        decoded += chr(0);
      } else {
        decoded += chr(parseInt(tmp1, 2));
      }
      a += 8;
    }
    a = 0;
    tmp2 = '';
  }
  return this.rtrim(decoded, '\0');
}
