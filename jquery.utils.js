/*
  jQuery utils - 0.1
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

(function($){
	$.extend({ 
		isRegExp: function(o) {
			return o.constructor.toString().indexOf('RegExp()') != -1;
		},
		isArray: function(o) {
			return o.constructor.toString().indexOf('Array()') != -1;
		},
		toCurrency: function() {
			o = parseFloat(this, 10).toFixed(2);
			return (o=='NaN') ? '0.00' : o;
		}
	});
})(jQuery);
