/*
  jQuery valid - 0.1
  (c) 2008 ~ Maxime Haineault (haineault@gmail.com)
  http://haineault.com   

  MIT License (http://www.opensource.org/licenses/mit-license.php)

*/

(function($){

    var valid = {

    };

    $.extend({ 
        
        valid: function(i, validator) {
            return valid[validator](i);
        }
    }});
})(jQuery);

// API example
// $('.price').valid('currency', 'us')
// $.valid(price, 'currency')
