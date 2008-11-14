/*
  jQuery utils - @VERSION
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

(function($){
     $.extend($.expr[':'], {
        // case insensitive version of :contains
        icontains: function(a,i,m){return (a.textContent||a.innerText||jQuery(a).text()||"").toLowerCase().indexOf(m[3].toLowerCase())>=0;}
    });
	$.extend({ 

        /* Redirect to a specified url
         * @url string  Url to redirect to
         */
        redirect: function(url) {
            return window.location.href = url;
        },

        /* Stop event shorthand
         * @e               object  Event object (required)
         * @preventDefault  bool    Prevent default action, default is true
         * @stopPropagation bool    Stop propagation, default is true
         */
        stop: function(e, preventDefault, stopPropagation) {
            preventDefault  && e.preventDefault();
            stopPropagation && e.stopPropagation();
            return preventDefault && false || true;
        },

        /* Returns the basename of a path
         * @path    string 
         */
        basename: function(path) {
            var t = path.split('/');
            return t[t.length] == '' && s || t.slice(0, t.length).join('/');
        },

        /* Returns the filename of a path
         * @path    string 
         */
        filename: function(path) {
            return path.split('/').pop();
        }, 
        
        /* Returns true if an object is a RegExp
         * @o  object 
         */
		isRegExp: function(o) {
			return o && o.constructor.toString().indexOf('RegExp()') != -1 || false;
		},
        
        /* Returns true if an object is an array
         * @o   object
         */
		isArray: function(o) {
			return o && o.constructor.toString().indexOf('Array()') != -1 || false;
		},
        
        /* Convert input to currency (two decimal fixed number)
         * @i   mixed
         */
		toCurrency: function(i) {
			i = parseFloat(i, 10).toFixed(2);
			return (i=='NaN') ? '0.00' : i;
		},

        /* Returns a range object
         * @1 start or length
         * @2 end
         *
         * Author: Matthias Miller
         * Site:   http://blog.outofhanwell.com/2006/03/29/javascript-range-function/
         */
        range:  function() {
            if (!arguments.length) { return []; }
            var min, max, step;
            if (arguments.length == 1) {
                min  = 0;
                max  = arguments[0]-1;
                step = 1;
            }
            else {
                // default step to 1 if it's zero or undefined
                min  = arguments[0];
                max  = arguments[1]-1;
                step = arguments[2] || 1;
            }
            // convert negative steps to positive and reverse min/max
            if (step < 0 && min >= max) {
                step *= -1;
                var tmp = min;
                min = max;
                max = tmp;
                min += ((max-min) % step);
            }
            var a = [];
            for (var i = min; i <= max; i += step) { 
                    a.push(i);
            }
            return a;
        }
	});

	$.extend($.fn, { 
        /* Select a text range in a textarea
         * @start   int     Where to start the selection
         * @stop    int     Where to stop the selection
         */
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
