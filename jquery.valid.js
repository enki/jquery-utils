/*
  jQuery valid - 0.1
  http://code.google.com/p/jquery-utils

  (c) Maxime Haineault <haineault@gmail.com>
  http://haineault.com   

  MIT License (http://www.opensource.org/licenses/mit-license.php)

*/

(function($){
    var valid = {
        // Types
        integer:  function(i, args)  { return /(^-?\d\d*$)/.test(i); },
        numeric:  function(i, args)  { return /(^-?\d\d*\.\d*$)|(^-?\d\d*$)|(^-?\.\d\d*$)/.test(i); },
        boolean:  function(i, args)  { return (args && args.strict)? /^0|1|true|false$/.test(i): /^0|1$/.test(i); },
        alphanum: function(i, args)  { return /^[a-zA-Z0-9.\-_]+$/.test(i); },
        // Networking
        net: {
            email:    function(i, args)  { return /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b$/.test(i); }, // http://regular-expressions.info/email.html 
            ip: function(i){ return /(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/.test(i); },
            macaddress: function(){},
            uri: function(i, args){ $.extend({type:'http'});}
        },
        // MySQL
        mysql: {
            date: function() {},
            datetime: function() {},
            timestamp: function() {}, // default Mysql 5+
            time: function() {}
        },
        // Locals
        canadian: {
            date: function(i, args)  { return /^\d{4}(\-|\/|\.)\d{1,2}\1\d{1,2}$/.test(i); }, // (yyyy-mm-dd || yyyy/mm/dd || yyyy.mm.dd)
            time: function(i, args)  { return /^([0]?[1-9]|1[0-2]):[0-5]\d(:[0-5]\d(\.\d{1,3})?)?$/.test(i); }, // (HH:MM || HH:MM:SS || HH:MM:SS.mmm)
            currency: function() {},
            postalCode:  function() {},
            phoneNumber: function() {},
            ssn: function() {},
            sin: function() {}
        }
        
    };

    $.extend({ 
        validation: valid,
        isValid: function(i, validation, args) {
            var parts = validation.split('.');
            if (parts[1] && valid[parts[0]] && valid[parts[0]][parts[1]]) {
                 return valid[parts[0]][parts[1]](i, args);
            }
            else if ($.isFunction(valid[parts[0]])) {
                 return valid[parts[0]](i, args);
            }
        }
    });
})(jQuery);

// API example
// $('.price').valid('currency', 'us')
// $.valid(price, 'currency')
// $('input').isValid('currency')
