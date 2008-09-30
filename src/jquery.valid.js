/*
  jQuery valid - 0.1
  http://code.google.com/p/jquery-utils

  (c) Maxime Haineault <haineault@gmail.com>
  http://haineault.com   

  MIT License (http://www.opensource.org/licenses/mit-license.php)

  +-----------------+---+---+-----------------------------------------------------------+
  | Validation      | I | T | Description                                               |
  +-----------------+---+---+-----------------------------------------------------------+
  | integer         | x | x | true if input is a valid integer                          |
  | numeric         | x | x | true if input is a valid numeric value (float or integer) |
  | boolean         | x | x | true if input is a valid boolean (1 or 0)                 |
  | alphanum        | x | x | true if input is a valid alphanumeric value               |
  | inrange         |   |   | true if input is within given range                       |
  | minlength       |   |   | true if input is at least or equal the specified length   |
  | maxlength       |   |   | true if input is less or equal than specified length      |
  | net.email       | x | x | true if input is a valid email address                    |
  | net.ip          | x | x | true if input is a valid IPv4 address                     |
  | net.mac         | x | x | true if input is a valid MAC address                      |
  | net.uri         |   |   | true if input is a valid URL (http, ftp, svn, ...)        |
  | date            |   |   | true if input is a valid date (ISO)                       |
  | creditcard      |   |   | true if input is a valid credit card number               |
  | mysql.date      | x |   | true if input is a valid MySQL date                       |
  | mysql.datetime  | x |   | true if input is a valid MySQL datetime                   |
  | mysql.time      | x |   | true if input is a valid MySQL time                       |
  | mysql.timestamp |   |   | true if input is a valid MySQL timestamp                  |
  | ca.date         | x |   | true if input is a valid Canadian date                    |
  | ca.time         |   |   | true if input is a valid Canadian time                    |
  | ca.currency     |   |   | true if input is a valid Canadian currency                |
  | ca postalCode   |   |   | true if input is a valid Canadian postalCode              |
  | ca.phoneNumber  |   |   | true if input is a valid Canadian phoneNumber             |
  | ca.ssn          |   |   | true if input is a valid Canadian Social Security Number  |
  | ca.sin          |   |   | true if input is a valid Canadian Social Insurange Number |
  +-----------------+---+---+-----------------------------------------------------------+
*/

(function($){
    $.extend({ 
        validator: {},
        isValid: function(validation, i, args) {
            var parts = validation.split('.');
            // namespaced
            if (parts[1] && $.validator[parts[0]] && $.validator[parts[0]][parts[1]]) {
                 return $.validator[parts[0]][parts[1]](i, args);
            }
            else if ($.isFunction($.validator[parts[0]])) {
                 return $.validator[parts[0]](i, args);
            }
        }
    });

    $.extend($.validator, {
        // Types
        integer:  function(i, args)  { return /(^-?\d\d*$)/.test(i); },
        numeric:  function(i, args)  { return /^[-+]?[0-9]\d*\.?[0-9]*$/.test(i); },
        'boolean':function(i, args)  { return (args && args.strict)? /^0|1|true|false$/.test(i): /^0|1$/.test(i); },
        alphanum: function(i, args)  { return /^[a-zA-Z0-9.\-_]+$/.test(i); },
        CSShex:   function(i, args)  { return /^#([a-fA-F0-9]){3}(([a-fA-F0-9]){3})?$/.test(i); },
        // Networking
        net: {
            // http://regular-expressions.info/email.html 
            email:      function(i, args)  { return /^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b$/.test(i); }, 
            ip:         function(i){ return /^(\d|[01]?\d\d|2[0-4]\d|25[0-5])\.(\d|[01]?\d\d|2[0-4] \d|25[0-5])\.(\d|[01]?\d\d|2[0-4]\d|25[0-5])\.(\d|[01]?\d\d|2[0-4] \d|25[0-5])$/.test(i); },
            MACaddress: function(i){ return /^([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}$/.test(i); }
        },
        // MySQL
        mysql: {
            'date':      function() { return /^\d{4}-\d{2}-\d{2}/.test(i); },
            datetime:    function() { return /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}/.test(i); },
            timestamp:   function() {}, // default Mysql 5+
            time:        function() { return /^\d{2}:\d{2}:\d{2}/.test(i); }
        },
        us: {
            ssn:         function(i, args)  { return /^\d{3}-\d{2}-\d{4}$/.test(i); }, 
            phoneNumber: function(i, args)  { return /^[01]?[- .]?(\([2-9]\d{2}\)|[2-9]\d{2})[- .]?\d{3}[- .]?\d{4}$/.test(i); },
            zipCode:     function(i, args)  { return /^(\d{5}-\d{4}|\d{5}|\d{9})$|^([a-zA-Z]\d[a-zA-Z] \d[a-zA-Z]\d)$/.test(i); }, 
            currency:    function(i, args)  { return /^\$(\d{1,3}(\,\d{3})*|(\d+))(\.\d{2})?$/.test(i); } 
        },
        // Locals
        ca: {
            // (yyyy-mm-dd || yyyy/mm/dd || yyyy.mm.dd)
            'date':      function(i, args)  { return /^\d{4}(\-|\/|\.)\d{1,2}\1\d{1,2}$/.test(i); }, 
            // (HH:MM || HH:MM:SS || HH:MM:SS.mmm)
            time:        function(i, args)  { return /^([0]?[1-9]|1[0-2]):[0-5]\d(:[0-5]\d(\.\d{1,3})?)?$/.test(i); }, 
            currency:    function() {},
            postalCode:  function() {},
            phoneNumber: function() {},
            ssn:         function() {},
            sin:         function() {}
        }
    });
})(jQuery);
