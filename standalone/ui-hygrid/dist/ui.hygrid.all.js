/*
  jQuery utils - 0.0.1
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

    $.iterators = {
        getText:  function() { return $(this).text(); },
        parseInt: function(v){ return parseInt(v, 10); }
    };

	$.extend({ 

        // Taken from ui.core.js. 
        // Why are you keeping this gem for yourself guys ? :|
        keyCode: {
            BACKSPACE: 8, CAPS_LOCK: 20, COMMA: 188, CONTROL: 17, DELETE: 46, DOWN: 40,
            END: 35, ENTER: 13, ESCAPE: 27, HOME: 36, INSERT:  45, LEFT: 37,
            NUMPAD_ADD: 107, NUMPAD_DECIMAL: 110, NUMPAD_DIVIDE: 111, NUMPAD_ENTER: 108, 
            NUMPAD_MULTIPLY: 106, NUMPAD_SUBTRACT: 109, PAGE_DOWN: 34, PAGE_UP: 33, 
            PERIOD: 190, RIGHT: 39, SHIFT: 16, SPACE: 32, TAB: 9, UP: 38
        },
        
        // Takes a keyboard event and return true if the keycode match the specified keycode
        keyIs: function(k, e) {
            return parseInt($.keyCode[k.toUpperCase()], 10) == parseInt((typeof(e) == 'number' )? e: e.keyCode, 10);
        },
        
        // Returns the key of an array
        keys: function(arr) {
            var o = [];
            for (k in arr) { o.push(k); }
            return o;
        },

        // Redirect to a specified url
        redirect: function(url) {
            window.location.href = url;
            return url;
        },

        // Stop event shorthand
        stop: function(e, preventDefault, stopPropagation) {
            if (preventDefault)  { e.preventDefault(); }
            if (stopPropagation) { e.stopPropagation(); }
            return preventDefault && false || true;
        },

        // Returns the basename of a path
        basename: function(path) {
            var t = path.split('/');
            return t[t.length] === '' && s || t.slice(0, t.length).join('/');
        },

        // Returns the filename of a path
        filename: function(path) {
            return path.split('/').pop();
        }, 

        // Returns a formated file size
        filesizeformat: function(bytes, suffixes){
            var b = parseInt(bytes, 10);
            var s = suffixes || ['byte', 'bytes', 'KB', 'MB', 'GB'];
            if (isNaN(b) || b === 0) { return '0 ' + s[0]; }
            if (b == 1)              { return '1 ' + s[0]; }
            if (b < 1024)            { return  b.toFixed(2) + ' ' + s[1]; }
            if (b < 1048576)         { return (b / 1024).toFixed(2) + ' ' + s[2]; }
            if (b < 1073741824)      { return (b / 1048576).toFixed(2) + ' '+ s[3]; }
            else                     { return (b / 1073741824).toFixed(2) + ' '+ s[4]; }
        },

        fileExtension: function(s) {
            var tokens = s.split('.');
            return tokens[tokens.length-1] || false;
        },
        
        // Returns true if an object is a String
        isString: function(o) {
            return typeof(o) == 'string' && true || false;
        },
        
        // Returns true if an object is a RegExp
		isRegExp: function(o) {
			return o && o.constructor.toString().indexOf('RegExp()') != -1 || false;
		},
        
        // Returns true if an object is an array
        // Mark Miller - http://blog.360.yahoo.com/blog-TBPekxc1dLNy5DOloPfzVvFIVOWMB0li?p=916
		isArray: function(o) {
            if (!o) { return false; }
            return Object.prototype.toString.apply(o.constructor.prototype) === '[object Array]';
		},

        isObject: function(o) {
            return (typeof(o) == 'object');
        },
        
        // Convert input to currency (two decimal fixed number)
		toCurrency: function(i) {
			i = parseFloat(i, 10).toFixed(2);
			return (i=='NaN') ? '0.00' : i;
		},

        /*-------------------------------------------------------------------- 
         * javascript method: "pxToEm"
         * by:
           Scott Jehl (scott@filamentgroup.com) 
           Maggie Wachs (maggie@filamentgroup.com)
           http://www.filamentgroup.com
         *
         * Copyright (c) 2008 Filament Group
         * Dual licensed under the MIT (filamentgroup.com/examples/mit-license.txt) and GPL (filamentgroup.com/examples/gpl-license.txt) licenses.
         *
         * Description: pxToEm converts a pixel value to ems depending on inherited font size.  
         * Article: http://www.filamentgroup.com/lab/retaining_scalable_interfaces_with_pixel_to_em_conversion/
         * Demo: http://www.filamentgroup.com/examples/pxToEm/	 	
         *							
         * Options:  	 								
                scope: string or jQuery selector for font-size scoping
                reverse: Boolean, true reverses the conversion to em-px
         * Dependencies: jQuery library						  
         * Usage Example: myPixelValue.pxToEm(); or myPixelValue.pxToEm({'scope':'#navigation', reverse: true});
         *
         * Version: 2.1, 18.12.2008
         * Changelog:
         *		08.02.2007 initial Version 1.0
         *		08.01.2008 - fixed font-size calculation for IE
         *		18.12.2008 - removed native object prototyping to stay in jQuery's spirit, jsLinted (Maxime Haineault <haineault@gmail.com>)
        --------------------------------------------------------------------*/

        pxToEm: function(i, settings){
            //set defaults
            settings = jQuery.extend({
                scope: 'body',
                reverse: false
            }, settings);
            
            var pxVal = (i === '') ? 0 : parseFloat(i);
            var scopeVal;
            var getWindowWidth = function(){
                var de = document.documentElement;
                return self.innerWidth || (de && de.clientWidth) || document.body.clientWidth;
            };	
            
            /* When a percentage-based font-size is set on the body, IE returns that percent of the window width as the font-size. 
                For example, if the body font-size is 62.5% and the window width is 1000px, IE will return 625px as the font-size. 	
                When this happens, we calculate the correct body font-size (%) and multiply it by 16 (the standard browser font size) 
                to get an accurate em value. */
                        
            if (settings.scope == 'body' && $.browser.msie && (parseFloat($('body').css('font-size')) / getWindowWidth()).toFixed(1) > 0.0) {
                var calcFontSize = function(){		
                    return (parseFloat($('body').css('font-size'))/getWindowWidth()).toFixed(3) * 16;
                };
                scopeVal = calcFontSize();
            }
            else { scopeVal = parseFloat(jQuery(settings.scope).css("font-size")); }
                    
            var result = (settings.reverse === true) ? (pxVal * scopeVal).toFixed(2) + 'px' : (pxVal / scopeVal).toFixed(2) + 'em';
            return result;
        }
	});

	$.extend($.fn, { 
        // Select a text range in a textarea
        selectRange: function(start, end){
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
        },

        /*-------------------------------------------------------------------- 
         * JQuery Plugin: "EqualHeights"
         * by:	Scott Jehl, Todd Parker, Maggie Costello Wachs (http://www.filamentgroup.com)
         *
         * Copyright (c) 2008 Filament Group
         * Licensed under GPL (http://www.opensource.org/licenses/gpl-license.php)
         *
         * Description: Compares the heights or widths of the top-level children of a provided element 
                and sets their min-height to the tallest height (or width to widest width). Sets in em units 
                by default if pxToEm() method is available.
         * Dependencies: jQuery library, pxToEm method	(article: 
                http://www.filamentgroup.com/lab/retaining_scalable_interfaces_with_pixel_to_em_conversion/)							  
         * Usage Example: $(element).equalHeights();
                Optional: to set min-height in px, pass a true argument: $(element).equalHeights(true);
         * Version: 2.1, 18.12.2008
         *
         * Note: Changed pxToEm call to call $.pxToEm instead, jsLinted (Maxime Haineault <haineault@gmail.com>)
        --------------------------------------------------------------------*/

        equalHeights: function(px){
            $(this).each(function(){
                var currentTallest = 0;
                $(this).children().each(function(i){
                    if ($(this).height() > currentTallest) { currentTallest = $(this).height(); }
                });
                if (!px || !$.pxToEm) { currentTallest = $.pxToEm(currentTallest); } //use ems unless px is specified
                // for ie6, set height since min-height isn't supported
                if ($.browser.msie && $.browser.version == 6.0) { $(this).children().css({'height': currentTallest}); }
                $(this).children().css({'min-height': currentTallest}); 
            });
            return this;
        },

        // Copyright (c) 2009 James Padolsey
        // http://james.padolsey.com/javascript/jquery-delay-plugin/
        delay: function(time, callback){
            jQuery.fx.step.delay = function(){};
            return this.animate({delay:1}, time, callback);
        }        
	});
})(jQuery);
/*
  jQuery strings - 0.2
  http://code.google.com/p/jquery-utils/
  
  (c) Maxime Haineault <haineault@gmail.com>
  http://haineault.com   

  MIT License (http://www.opensource.org/licenses/mit-license.php)

  Implementation of Python3K advanced string formatting
  http://www.python.org/dev/peps/pep-3101/

  Documentation: http://code.google.com/p/jquery-utils/wiki/StringFormat
  
*/
(function($){
    var strings = {
        strConversion: {
            // tries to translate any objects type into string gracefully
            __repr: function(i){
                switch(this.__getType(i)) {
                    case 'array':case 'date':case 'number':
                        return i.toString();
                    case 'object': 
                        var o = [];
                        for (x=0; x<i.length; i++) { o.push(i+': '+ this.__repr(i[x])); }
                        return o.join(', ');
                    case 'string': 
                        return i;
                    default: 
                        return i;
                }
            },
            // like typeof but less vague
            __getType: function(i) {
                if (!i || !i.constructor) { return typeof(i); }
                var match = i.constructor.toString().match(/Array|Number|String|Object|Date/);
                return match && match[0].toLowerCase() || typeof(i);
            },
            //+ Jonas Raoni Soares Silva
            //@ http://jsfromhell.com/string/pad [v1.0]
            __pad: function(str, l, s, t){
                var p = s || ' ';
                var o = str;
                if (l - str.length > 0) {
                    o = new Array(Math.ceil(l / p.length)).join(p).substr(0, t = !t ? l : t == 1 ? 0 : Math.ceil(l / 2)) + str + p.substr(0, l - t);
                }
                return o;
            },
            __getInput: function(arg, args) {
                 var key = arg.getKey();
                switch(this.__getType(args)){
                    case 'object': // Thanks to Jonathan Works for the patch
                        var keys = key.split('.');
                        var obj = args;
                        for(var subkey = 0; subkey < keys.length; subkey++){
                            obj = obj[keys[subkey]];
                        }
                        if (typeof(obj) != 'undefined') {
                            if (strings.strConversion.__getType(obj) == 'array') {
                                return arg.getFormat().match(/\.\*/) && obj[1] || obj;
                            }
                            return obj;
                        }
                        else {
                            // TODO: try by numerical index                    
                        }
                    break;
                    case 'array': 
                        key = parseInt(key, 10);
                        if (arg.getFormat().match(/\.\*/) && typeof args[key+1] != 'undefined') { return args[key+1]; }
                        else if (typeof args[key] != 'undefined') { return args[key]; }
                        else { return key; }
                    break;
                }
                return '{'+key+'}';
            },
            __formatToken: function(token, args) {
                var arg   = new Argument(token, args);
                return strings.strConversion[arg.getFormat().slice(-1)](this.__getInput(arg, args), arg);
            },

            // Signed integer decimal.
            d: function(input, arg){
                var o = parseInt(input, 10); // enforce base 10
                var p = arg.getPaddingLength();
                if (p) { return this.__pad(o.toString(), p, arg.getPaddingString(), 0); }
                else   { return o; }
            },
            // Signed integer decimal.
            i: function(input, args){ 
                return this.d(input, args);
            },
            // Unsigned octal
            o: function(input, arg){ 
                var o = input.toString(8);
                if (arg.isAlternate()) { o = this.__pad(o, o.length+1, '0', 0); }
                return this.__pad(o, arg.getPaddingLength(), arg.getPaddingString(), 0);
            },
            // Unsigned decimal
            u: function(input, args) {
                return Math.abs(this.d(input, args));
            },
            // Unsigned hexadecimal (lowercase)
            x: function(input, arg){
                var o = parseInt(input, 10).toString(16);
                o = this.__pad(o, arg.getPaddingLength(), arg.getPaddingString(),0);
                return arg.isAlternate() ? '0x'+o : o;
            },
            // Unsigned hexadecimal (uppercase)
            X: function(input, arg){
                return this.x(input, arg).toUpperCase();
            },
            // Floating point exponential format (lowercase)
            e: function(input, arg){
                return parseFloat(input, 10).toExponential(arg.getPrecision());
            },
            // Floating point exponential format (uppercase)
            E: function(input, arg){
                return this.e(input, arg).toUpperCase();
            },
            // Floating point decimal format
            f: function(input, arg){
                return this.__pad(parseFloat(input, 10).toFixed(arg.getPrecision()), arg.getPaddingLength(), arg.getPaddingString(),0);
            },
            // Floating point decimal format (alias)
            F: function(input, args){
                return this.f(input, args);
            },
            // Floating point format. Uses exponential format if exponent is greater than -4 or less than precision, decimal format otherwise
            g: function(input, arg){
                var o = parseFloat(input, 10);
                return (o.toString().length > 6) ? Math.round(o.toExponential(arg.getPrecision())): o;
            },
            // Floating point format. Uses exponential format if exponent is greater than -4 or less than precision, decimal format otherwise
            G: function(input, args){
                return this.g(input, args);
            },
            // Single character (accepts integer or single character string). 	
            c: function(input, args) {
                var match = input.match(/\w|\d/);
                return match && match[0] || '';
            },
            // String (converts any JavaScript object to anotated format)
            r: function(input, args) {
                return this.__repr(input);
            },
            // String (converts any JavaScript object using object.toString())
            s: function(input, args) {
                return input.toString && input.toString() || ''+input;
            }
        },

        format: function(str, args) {
            var end    = 0;
            var start  = 0;
            var match  = false;
            var buffer = [];
            var token  = '';
            var tmp    = (str||'').split('');
            for(start=0; start < tmp.length; start++) {
                if (tmp[start] == '{' && tmp[start+1] !='{') {
                    end   = str.indexOf('}', start);
                    token = tmp.slice(start+1, end).join('');
                    buffer.push(strings.strConversion.__formatToken(token, (typeof arguments[1] != 'object')? arguments2Array(arguments, 2): args || []));
                }
                else if (start > end || buffer.length < 1) { buffer.push(tmp[start]); }
            }
            return (buffer.length > 1)? buffer.join(''): buffer[0];
        },

        calc: function(str, args) {
            return eval(format(str, args));
        },

        repeat: function(s, n) { 
            return new Array(n+1).join(s); 
        },

        UTF8encode: function(s) { 
            return unescape(encodeURIComponent(s)); 
        },

        UTF8decode: function(s) { 
            return decodeURIComponent(escape(s)); 
        },

        tpl: function() {
            var out = '', render = true;
            // Set
            // $.tpl('ui.test', ['<span>', helloWorld ,'</span>']);
            if (arguments.length == 2 && $.isArray(arguments[1])) {
                this[arguments[0]] = arguments[1].join('');
                return jQuery;
            }
            // $.tpl('ui.test', '<span>hello world</span>');
            if (arguments.length == 2 && $.isString(arguments[1])) {
                this[arguments[0]] = arguments[1];
                return jQuery;
            }
            // Call
            // $.tpl('ui.test');
            if (arguments.length == 1) {
                return $(this[arguments[0]]);
            }
            // $.tpl('ui.test', false);
            if (arguments.length == 2 && arguments[1] == false) {
                return this[arguments[0]];
            }
            // $.tpl('ui.test', {value:blah});
            if (arguments.length == 2 && $.isObject(arguments[1])) {
                return $($.format(this[arguments[0]], arguments[1]));
            }
            // $.tpl('ui.test', {value:blah}, false);
            if (arguments.length == 3 && $.isObject(arguments[1])) {
                return (arguments[2] == true) 
                    ? $.format(this[arguments[0]], arguments[1])
                    : $($.format(this[arguments[0]], arguments[1]));
            }
        }
};

    var Argument = function(arg, args) {
        this.__arg  = arg;
        this.__args = args;
        this.__max_precision = parseFloat('1.'+ (new Array(32)).join('1'), 10).toString().length-3;
        this.__def_precision = 6;
        this.getString = function(){
            return this.__arg;
        };
        this.getKey = function(){
            return this.__arg.split(':')[0];
        };
        this.getFormat = function(){
            var match = this.getString().split(':');
            return (match && match[1])? match[1]: 's';
        };
        this.getPrecision = function(){
            var match = this.getFormat().match(/\.(\d+|\*)/g);
            if (!match) { return this.__def_precision; }
            else {
                match = match[0].slice(1);
                if (match != '*') { return parseInt(match, 10); }
                else if(strings.strConversion.__getType(this.__args) == 'array') {
                    return this.__args[1] && this.__args[0] || this.__def_precision;
                }
                else if(strings.strConversion.__getType(this.__args) == 'object') {
                    return this.__args[this.getKey()] && this.__args[this.getKey()][0] || this.__def_precision;
                }
                else { return this.__def_precision; }
            }
        };
        this.getPaddingLength = function(){
            var match = false;
            if (this.isAlternate()) {
                match = this.getString().match(/0?#0?(\d+)/);
                if (match && match[1]) { return parseInt(match[1], 10); }
            }
            match = this.getString().match(/(0|\.)(\d+|\*)/g);
            return match && parseInt(match[0].slice(1), 10) || 0;
        };
        this.getPaddingString = function(){
            var o = '';
            if (this.isAlternate()) { o = ' '; }
            // 0 take precedence on alternate format
            if (this.getFormat().match(/#0|0#|^0|\.\d+/)) { o = '0'; }
            return o;
        };
        this.getFlags = function(){
            var match = this.getString().matc(/^(0|\#|\-|\+|\s)+/);
            return match && match[0].split('') || [];
        };
        this.isAlternate = function() {
            return !!this.getFormat().match(/^0?#/);
        };
    };

    var arguments2Array = function(args, shift) {
        var o = [];
        for (l=args.length, x=(shift || 0)-1; x<l;x++) { o.push(args[x]); }
        return o;
    };

    $.extend(strings);
})(jQuery);
/*
 jQuery delayed observer - 0.7
 http://code.google.com/p/jquery-utils/

 (c) Maxime Haineault <haineault@gmail.com>
 http://haineault.com
 
 MIT License (http://www.opensource.org/licenses/mit-license.php)
 
*/

(function($){
    $.extend($.fn, {
        delayedObserver: function(callback, delay, options){
            return this.each(function(){
                var el = $(this);
                var op = op || {};
                el.data('oldval', el.val())
                    .data('delay', delay || 0.5)
                    .data('condition', op.condition || function() { return ($(this).data('oldval') == $(this).val()); })
                    .data('callback', callback)
                    [(op.event||'keyup')](function(){
                        if (el.data('condition').apply(el)) { return }
                        else {
                            if (el.data('timer')) { clearTimeout(el.data('timer')); }
                            el.data('timer', setTimeout(function(){
                                el.data('callback').apply(el);
                            }, el.data('delay') * 1000));
                            el.data('oldval', el.val());
                        }
                    });
            });
        }
    });
})(jQuery);
/*
  jQuery ui.hygrid.colhider
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

$.tpl('colhider.menu',     '<ul class="ui-hygrid-p-colhider-menu ui-helper-hidden ui-helper-reset ui-widget-content" />');
$.tpl('colhider.menuItem', '<li class="ui-corner-all ui-helper-reset"><label><input type="checkbox" /> {label:s}</label></li>');

$.ui.plugin.add('hygrid', 'colhider', {
    rowinserted: function(e, ui) {
        ui.insertedRow.append('<td class="ui-hygrid-blank">&nbsp;</td>');
    },
    coltoggled: function(e, ui) {
        if (ui.options.width == 'auto') {
            ui._trigger('gridupdated');
        }
    },
    initialize: function(e, ui) {
        $.extend($.ui.hygrid.cellModifiers, {
            hide:  function(el, cell, type){ 
                if (cell.hide) { el.hide(); } 
            }
        });
    },
    initialized: function(e, ui) {
        ui.options = $.extend({colhider: true}, ui.options);
        
        if (ui.options.colhider) {
            ui._('colhidermenu ', $.tpl('colhider.menu').prependTo(ui._('wrapper')));
            var thead = ui._('thead');
            var tbody = ui._('tbody');
            var menu  = ui._('colhidermenu ');
            ui._fixCellIndex = ui._fixCellIndex + 1;
            $th = thead.find('th');

            // create menu
            // TODO: when input:checked.length == 1 disable clicking
            $th.slice(0, $th.length).each(function(i){
                var e   = $.Event();
                var lbl = $(this).find('div:first-child').text();
                $.tpl('colhider.menuItem', {label: lbl})
                    .data('colindex', i)
                    .bind('click.colhider', function(){
                        var $self = $(this);
                        var menu  = $self.parents('ul');
                        var index = $self.data('colindex');
                        ui.toggledCol = ui.col(index);
                        if ($self.find('input:checked').length > 0) {
                            ui.toggledCol.show();
                        }
                        else {
                            ui.toggledCol.hide();
                        }
                        ui._setColOption(index, 'hide', ui.toggledCol.is(':hidden'));
                        setTimeout(function() {
                            menu.hide();
                            ui._trigger('coltoggled');
                        }, 100); // let the user see the check mark before hiding
                    })
                    .find('input')
                        .attr('checked', !ui._getColOptions(i, 'hide')).end()
                    .appendTo(menu);
            });
            // create button
            $('<th class="ui-hygrid-p-colhider ui-state-default"><span class="ui-icon ui-icon-gridmenu" />').width(16)
                .bind('click.colhider', function() {
                    menu.css({
                        top: tbody.position().top,
                        left: $(this).position().left
                    }).toggle();
                })
                .hover(function(){ $(this).addClass('ui-state-hover');}, 
                       function(){ $(this).removeClass('ui-state-hover'); 
                }).appendTo(thead.find('tr'));
        }
    }
});
/*
  jQuery ui.hygrid.ledger
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php
*/
(function($){

function applyLedger(ui) {
    ui._('tbody').find('tr')
        .filter(':odd').addClass('odd').end()
        .filter(':even').addClass('even');
}

$.ui.hygrid.defaults.ledger = true;
$.ui.plugin.add('hygrid', 'ledger', {
    initialized: function(e, ui) { 
        applyLedger(ui);
    },
    dataloaded: function(e, ui) { 
        applyLedger(ui);
    }
});

})(jQuery);
/*
  jQuery ui.hygrid.resizable - 0.0.1
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

(function($) {if ($.ui.hygrid) {
    $.ui.hygrid.plugins.resizable = {
        _init: function() {
            this.options = $.extend({resizable: true}, this.options);
        },
        _ready: function() {
            var widget = this;
            if (widget.options.resizable) {
                widget.ui.wrapper.resizable({
                    ghost: true,
                    minWidth:  widget.options.width,
                    stop: function() {
                        $('table', this).width($(this).width()).height($(this).height());
                    }
                });
            }
        }
    };
}})(jQuery);
/*
  jQuery ui.hygrid.selectable
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

$.extend($.ui.hygrid.defaults, {
    selectable: 2,
});

$.ui.plugin.add('hygrid', 'selectable', {
    initialized: function(e, ui) {
        if (!ui.options.ajax) {
            ui._('tbody').addClass('ui-clickable').find('tr').bind('click.selectable', function(){
                if ($(this).hasClass('ui-selected')) {
                    ui.unselectedRow = $(this);
                    ui._trigger('rowunselect');
                }
                else {
                    ui.selectedRow = $(this);
                    ui._trigger('rowselect');
                }
            });
        }
    },
    
    gridupdated: function(e, ui) {
        if (ui.options.ajax) {
            ui._('tbody').addClass('ui-clickable').find('tr').bind('click.selectable', function(){
                if ($(this).hasClass('ui-selected')) {
                    ui.unselectedRow = $(this);
                    ui._trigger('rowunselect');
                }
                else {
                    ui.selectedRow = $(this);
                    ui._trigger('rowselect');
                }
            });
        }
    },

    rowselect: function(e, ui) {
        if (ui.options.selectable != 2) {
            ui.selectedRow.siblings().removeClass('ui-selected');
        }
        ui.selectedRow.addClass('ui-selected');
        ui._trigger('rowselected');
    },

    rowunselect: function(e, ui) {
        ui.unselectedRow.removeClass('ui-selected');
        ui._trigger('rowunselected');
    },

    rowselected: function(e, ui) {},
    rowunselected: function(e, ui) {}
});
/*
  jQuery ui.hygrid.sortable
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php
*/

$.extend($.ui.hygrid.defaults, {
    sortable: true,
});

$.ui.plugin.add('hygrid', 'sortable', {
    initialize: function(e, ui) {
        $.extend($.ui.hygrid.cellModifiers, {
            sortable:  function(el, cell, type){ 
                if (type == 'th' && !el.hasClass('ui-sortable')) {
                    el.addClass('ui-sortable')
                        .prepend('<span class="ui-unsorted ui-icon ui-icon-triangle-2-n-s" />');
                }
            }
        });
    }
});
/*
(function($) {if ($.ui.hygrid) {
    $.ui.hygrid.plugins.sortable = {
        _init: function() {
            widget = this;
            widget.options = $.extend({sortable: true}, widget.options);
            widget.params  = $.extend({sortname: '', sortorder: 'asc'});
            $.ui.hygrid.cellModifiers.sortable = function(el, cell, type){ 
                if (type == 'th' && cell.sortable) { 
                    el.addClass('ui-sortable')
                        .hover(function(){ $(this).addClass('ui-state-hover');}, 
                               function(){ $(this).removeClass('ui-state-hover'); })
                        .bind('click.sortable', function() {
                            $(this).removeClass('ui-state-default').addClass('ui-tabs-selected ui-state-active')
                                .siblings().removeClass('ui-tabs-selected ui-state-active').addClass('ui-state-default');

                        });
                    $('<span class="ui-unsorted ui-icon ui-icon-triangle-2-n-s" />').prependTo(el); 
                }
            }
        },
        _params: function() {
            
        }
    };
}})(jQuery);
*/
/*
  jQuery ui.hygrid - 0.0.1
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

(function($) {

$.log = function() {
    try {
        var args = $.map(arguments, function(v) { return v; });
        args[0] = $.format('hygrid: {0:s}', args[0]);
        console.log.apply(this, args);
    } catch(e) {};
};

$.widget('ui.hygrid', {
    plugins:  {},
    _init: function() {
        this._trigger('initialize');
        this._trigger('initialized');
    },

    params: function() {
        o = {};
        for (x in this.options.params) {
            var param = this.options.params[x];
            if (this.options[param]) {
                o[param] = this.options[param];
            }
        }
        return o;
    },

    '_': function() {
        if (arguments.length == 1) {
            return this._getData(arguments[0]);
        }
        else {
            return this._setData(arguments[0], arguments[1]);
        }
    },

    cols: function(visible) {
        var length = this._('tbody').find('tr:eq(0) td').length
        return this.options.cols > length && this.options.length || length;
    },
    
    // Returns all element from a given column index
    col: function(index, excludeHeader) {
        var tbody = this._('tbody');
        var thead = this._('thead');
        return excludeHeader && tbody.find('td:nth-child('+ (index+1) +')')
                             || thead.find('th:nth-child('+ (index+1) +')')
                                    .add(tbody.find('td:nth-child('+ (index+1) +')'));
    },

    row: function(i) {
        return $.isArray(i) && this._createRow(i) 
                            || this._('tbody').find('tr').eq(i);
    },

    cell: function(x, y, visible) {
        var tbody = this._('tbody');
        return visible && tbody.find('tr:visible').eq(y).find('td:visible').eq(x)
                       || tbody.find('tr').eq(y).find('td').eq(x);
    },

    cells: function(visibleOnly) {
        var tbody = this._('tbody');
        return visibleOnly && tbody.find('td') || tbody.find('td:visible');
    },
    

    _setGridWidth: function(){
        var wrapper = this._('wrapper');
        var table   = this._('table');
        switch (this.options.width || 'auto') {
            case 'auto':
                wrapper.width(table.width());
            break;
            case 'fill':
                var w = wrapper.parent().width();
                wrapper.width(w)
                table.width(w);
            break;
            default:
                wrapper.width(this.options.width);
                table.width(this.options.width);
            break;
        };
    },

    _createRow: function(cells) {
        var e  = $.Event();
        this.insertedRow = $('<tr />');
        for (i in cells) {
            var cell = this.options.cols && this.options.cols[i] || {}; 
            var label = cell.label; 
            cell.label = cells[i];
            this.insertedRow.append(this._createCell(cell, 'td'));
            cell.label = label; // I manually cache/restore the object's label to avoid having to clone it for each cells
        }
        this._trigger('rowinsert');
        this.insertedRow.appendTo(this._('tbody'));
        this._trigger('rowinserted');
    },

    _createCell: function(cell, type) {
        var tpl = (type == 'th')? '<{0:s} class="ui-hygrid-header"><div /></{0:s}>': '<{0:s} />';
        var el  = $($.format(tpl, type || 'td'));
        return this._applyCellModifiers(el, cell);
    },

    _applyCellModifiers: function(el, cell, col){
        var $el = $(el);
        var mod = $.keys($.ui.hygrid.cellModifiers);
        if ($el.get(0)) {
            var type = $el.get(0).nodeName;
            for (x in mod) {
                if (cell[mod[x]]) {
                    try {
                        $.ui.hygrid.cellModifiers[mod[x]]
                            .apply(this, [$el, cell, type && type.toLowerCase() || 'td', col]);
                    } catch(e) {}
                }
            }
        }
        return el;
    },
    
    _setColOption: function(i, o, v) {
        try {
            return this.options.cols[i][o] = v;
        }
        catch(e) {
            return false;
        }
    },

    _getColOptions: function(i, o) {
        try {
            return this.options.cols[i][o];
        }
        catch(e) {
            return false;
        }
    },

    _trigger: function(type, e, ui) {
        var ui = ui || this;
        var ev = e  || $.Event(type);
        if (ui.options.debug === true || ($.isArray(ui.options.debug) && ui.options.debug.indexOf(type) > -1)) {
            $.log('%s (e: %o, ui: %o)', type, ev, ui); 
        }
        $.ui.plugin.call(this, type, [ev, ui]);
        return $.widget.prototype._trigger.call(this, type, [ev, ui]);
    }
});

// These properties are shared accross every hygrid instances
$.extend($.ui.hygrid, {
    version:     '0.0.1',
    eventPrefix: 'grid',
    getter:      'col cells cell row',
    defaults: {
        width:   'auto', 
        params:  [],
        debug:   false
    },
    cellModifiers: {},
    parsers: {}
});

})(jQuery);
