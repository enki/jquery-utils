/*
    How it should work:

    Via string prototype:
    =====================

    Inspiration
    ~~~~~~~~~~~
    http://www.python.org/dev/peps/pep-3101/

    named arguments
    ~~~~~~~~~~~~~~~

*/

(function(){
    var formatToken = function(token) {
        return token;
    };

    var format =  function(str, args) {
        var end        = 0;
        var start      = 0;
        var buffer     = [];
        var token      = '';
        var args       = args || {};
        var getFormat  = function(str) { return 'd'; }; // TODO

        for(index in str.split('')) {
            start = parseInt(index);
            if (str[start] == '{' && str[start+1] !='{') {
                end   = str.indexOf('}', start);
                token = str.slice(start+1, end);

                if (!args[token]) buffer.push('{'+token+'}');
                else buffer.push(format(args[token], formatToken(args[token])));
            }
            else if (start > end || buffer.length < 1)  buffer.push(str[start]);
        }
        console.log('Buffer: %s', buffer.join(''));
        return buffer.join('');
    };

    $.extend({
        format: format,
        // This code is in the public domain. Feel free to link back to http://jan.moesen.nu/
        // ---
        // Changes made by Maxime Haineault (2007):
        // - The function is now extended to Strings
        // - The function now accept arrays as arguments, much easier to handle
        sprintf: function() {
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
        }
        });

})();
