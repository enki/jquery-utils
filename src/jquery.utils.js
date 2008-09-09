/*
  jQuery utils - 0.2
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

(function($){
    // I use the ui widget api for controls
    if ($.ui) { $.ctrl  = { widget: $.ui.widget, plugins: $.ui.plugins }; }

	$.extend({ 
		isRegExp: function(o) {
			return o && o.constructor.toString().indexOf('RegExp()') != -1 || false;
		},
		isArray: function(o) {
			return o && o.constructor.toString().indexOf('Array()') != -1 || false;
		},
		toCurrency: function(o) {
			o = parseFloat(o, 10).toFixed(2);
			return (o=='NaN') ? '0.00' : o;
		}
	});

	$.extend($.fn, { 
        selectRange: function(start, end) {
            // use only the first one since only one input can be focused
            if ($(this).get(0).createTextRange) {
                var range = $(this).get(0).createTextRange();
                range.collapse(true);
                range.moveEnd('character',   end);
                range.moveStart('character', start);
                range.select();
            }
            else if ($(this).get(0).setSelectionRange) {
                $(this).bind('focus', function(e){
                    e.preventDefault();
                }).get(0).setSelectionRange(start, end);
            }
            return $(this);
        }
	});
})(jQuery);
