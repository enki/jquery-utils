/*
  jQuery strings - 0.1a
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com>
  http://haineault.com   

  MIT License (http://www.opensource.org/licenses/mit-license.php)

  How it should work:

  Inspiration
  ~~~~~~~~~~~
  http://www.python.org/dev/peps/pep-3101/

  named arguments
  ~~~~~~~~~~~~~~~
  $.format('{a}bc', {a:'A'}) -> Abc

  conversion 
  ~~~~~~~~~~
  $.format('{a:s}bc', {a:[1,2,3]}) -> 123bc
  $.format('{a:d}bc', {a:1.5})     -> 1bc
  
  Note: for conversion types see: http://docs.python.org/lib/typesseq-strings.html

  extensible conversions
  ~~~~~~~~~~~~~~~~~~~~~~
  jQuery.extend(jQuery.strConversion, 
      {'u': function(arg){ return arg.toUpperCase(); }
  });
  $.format('{a:u}bc', {a:'a'})     -> Abc
*/

(function(){
    
    //+ Jonas Raoni Soares Silva
    //@ http://jsfromhell.com/string/pad [v1.0]
    var pad = function(str, l, s, t){
        return s || (s = " "), (l -= str.length) > 0 ? (s = new Array(Math.ceil(l / s.length)
            + 1).join(s)).substr(0, t = !t ? l : t == 1 ? 0 : Math.ceil(l / 2))
            + str + s.substr(0, l - t) : str;
    };

    var conversion = {
        // Signed integer decimal.
        'd': function(input, args) {
            var out = parseInt(input, 10); // enforce base 10
            if (args && args[0] == 0 && args.length > 1) { // zero padding
                out = pad(out.toString(), parseInt(args.slice(1, args.length)), '0', 0);
            }
            return out;
        },
        // Signed integer decimal.
        'i': function(input, args){ 
            return this.d(input, args);
        },
        // Unsigned octal
        'o': function(input, args){ 
            return input.toString(8);
        },

        // Unsigned decimal
        'u': function(input, args) {
            return Math.abs(this.d(input, args));
        },
        // Unsigned hexadecimal (lowercase)
        'x': function(input, args) {
            return parseInt(input, 10).toString(16);
        },
        // Unsigned hexadecimal (uppercase)
        'X': function(input, args) {
            return this.x(input, args).toUpperCase();
        },
        // e 	Floating point exponential format (lowercase)
        // E 	Floating point exponential format (uppercase)
        // Floating point decimal format
        'f': function(input, args) {
            // TODO: precision & padding
            return parseFloat(input, 10);
        },
        // Floating point decimal format
        'F': function(input, args) {
            return this.f(input, args);
        },
        // g 	Floating point format. Uses exponential format if exponent is greater than -4 or less than precision, decimal format otherwise
        // G 	Floating point format. Uses exponential format if exponent is greater than -4 or less than precision, decimal format otherwise
        // Single character (accepts integer or single character string). 	
        'c': function(input, args) {
            var match = input.match(/\w|\d/);
            return match && match[0] || '';
        },
        // r 	String (converts any python object using repr())
        'r': function(input, args) {
            return (typeof(input) == 'string')? input: input.join('');
        },
        // s 	String (converts any python object using str())
        's': function(input, args) {
            return (typeof(input) == 'string')? input: input.join('');
        },
    };

    var formatToken = function(token, input) {
        var match  = token.split(':');
        var token  = match[0];
        var format = match[1] && match[1].slice(-1, match[1].length) || 's';
        var args   = match[1] && match[1].slice(0, match[1].length-1) || '';
        //console.log('Format: %s -> %o (%s)', input, token, args);
        return conversion[format](input, args);
    };

    var format = function(str, args) {
        var end        = 0;
        var start      = 0;
        var match      = false;
        var buffer     = [];
        var token      = '';
        var args       = args || {};
        var star       = str.split('');
        for(index in str) {
            start = parseInt(index);
            if (str[start] == '{' && str[start+1] !='{') {
                end   = str.indexOf('}', start);
                token = str.slice(start+1, end);
                match = token.match(/^\w+/)[0] || token;
                if (!args[match]) buffer.push('{'+token+'}');
                else buffer.push(formatToken(token, args[match]));
            }
            else if (start > end || buffer.length < 1)  buffer.push(str[start]);
        }
        //console.log('Formatted: %s -> %a -> %s (%d)', str, buffer, buffer.join(''), buffer.length);
        return (buffer.length > 1)? buffer.join(''): buffer[0];
    };

    var sprintf = function() {
        // This code is in the public domain. Feel free to link back to http://jan.moesen.nu/
        // ---
        // Changes made by Maxime Haineault (2007):
        // - The function is now extended to Strings
        // - The function now accept arrays as arguments, much easier to handle
        if (!arguments || !RegExp) return;
        var str = this;
        var re  = /([^%]*)%('.|0|\x20)?(-)?(\d+)?(\.\d+)?(%|b|c|d|u|f|o|s|x|X)(.*)/; //'
        var a   = b = [], i = 0, numMatches = 0;

        if (typeof arguments[0] == 'object') arguments = $A(arguments[0]);
        while (a = re.exec(str)) {
            var leftpart   = a[1], pPad  = a[2], pJustify  = a[3], pMinLength = a[4];
            var pPrecision = a[5], pType = a[6], rightPart = a[7];
            numMatches++;
            if (pType == '%') subst = '%';
            else {
                var param = arguments[i];
                var pad   = '';
                if (pPad && pPad.substr(0,1) == "'") pad = leftpart.substr(1,1);
                else if (pPad) pad = pPad;
                var justifyRight = true;
                if (pJustify && pJustify === "-") justifyRight = false;
                var minLength = -1;
                if (pMinLength) minLength = parseInt(pMinLength);
                var precision = -1;
                if (pPrecision && pType == 'f') precision = parseInt(pPrecision.substring(1));
                var subst = param;
                if (pType == 'b')      subst = parseInt(param).toString(2);
                else if (pType == 'c') subst = String.fromCharCode(parseInt(param));
                else if (pType == 'd') subst = parseInt(param) ? parseInt(param) : 0;
                else if (pType == 'u') subst = Math.abs(param);
                else if (pType == 'f') subst = (precision > -1) ? Math.round(parseFloat(param) * Math.pow(10, precision)) / Math.pow(10, precision): parseFloat(param);
                else if (pType == 'o') subst = parseInt(param).toString(8);
                else if (pType == 's') subst = param;
                else if (pType == 'x') subst = ('' + parseInt(param).toString(16)).toLowerCase();
                else if (pType == 'X') subst = ('' + parseInt(param).toString(16)).toUpperCase();
            }
            str = leftpart + subst + rightPart;
            i++;
        }
        return str;
    };
    $.extend({format: format, sprintf: sprintf, strConversion: conversion});
})();
