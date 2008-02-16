/*
  jQuery utils - 0.1
  (c) 2008 ~ Maxime Haineault (haineault@gmail.com)
  http://haineault.com   

  MIT License (http://www.opensource.org/licenses/mit-license.php)

*/

(function($){
	$.extend({ 
		isRegExp: function(o) {
			return o.constructor.toString().indexOf('RegExp()') != -1);
		},
		isArray: function(o) {
			return o.constructor.toString().indexOf('Array()') != -1);
		}
	});
})(jQuery);
