/*
  jQuery valid - 0.1
  http://code.google.com/p/jquery-utils

  (c) Maxime Haineault <haineault@gmail.com>
  http://haineault.com   

  MIT License (http://www.opensource.org/licenses/mit-license.php)

*/

(function($){

    var isValid = {
        currency: function(i, args) {
        
        }
    };

    $.extend({ 
        
        isValid: function(i, validation, args) {
            return valid[validator](i, args);
        }
    }});
})(jQuery);

// API example
// $('.price').valid('currency', 'us')
// $.valid(price, 'currency')
// $('input').isValid('currency')
