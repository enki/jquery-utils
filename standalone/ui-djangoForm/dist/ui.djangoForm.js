/*
  jQuery strings - 0.3
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
                    if (tmp[start-1] != '{' && tmp[end+1] != '}') {
                        var tokenArgs = (typeof arguments[1] != 'object')? arguments2Array(arguments, 2): args || [];
                        buffer.push(strings.strConversion.__formatToken(token, tokenArgs));
                    }
                    else {
                        buffer.push(token);
                    }
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
            var out = '';
            var render = true;
            // Set
            // $.tpl('ui.test', ['<span>', helloWorld ,'</span>']);
            if (arguments.length == 2 && $.isArray(arguments[1])) {
                this[arguments[0]] = arguments[1].join('');
                return $(this[arguments[0]]);
            }
            // $.tpl('ui.test', '<span>hello world</span>');
            if (arguments.length == 2 && $.isString(arguments[1])) {
                this[arguments[0]] = arguments[1];
                return $(this[arguments[0]]);
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
/* jQuery ui.djangoForm.js - 0.1
 *
 * (c) Maxime Haineault <haineault@gmail.com>
 * http://haineault.com 
 * 
 * MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * */

if (!$.fn.type) {
$.extend($.fn, {
    type: function() {
        try { return $(this).get(0).nodeName.toLowerCase(); }
        catch(e) { return false; }
    }         
});
}

$.widget('ui.djangoForm', {
    _init: function(fields) {
        var ui = this;
        if (ui.options.fields) {
            if (ui.options.url && ui.element.type() != 'form') {
                ui._url = ui.options.url;
                $(this.element).load(ui._url, function(){
                    ui.form_type = $(this).find('form:first-child').type();
                    $(this).find('form').djangoForm(ui.options);
                }).djangoForm('destroy');
                if (ui.options.mode == 'dialog') {
                    $(this.element).dialog({
                        width:  ui.options.width  || false,
                        height: ui.options.height || false,
                        title:  ui.options.title  || false,
                    });
                }
                return false;
            }
            else {
                ui.form_type = ui.element.children(0).type();
                ui.element.bind('submit', function(e){
                    $(this).removeClass('ui-djangoForm-error').find('ul.'+ ui.options.errorListClass).remove();
                    $.each(ui.options.fields, function(name, field){
                        ui._applyRules(field, true);
                    });
                    return !ui._hasErrors; // don't submit if it has errors
                });

                if (ui.form_type == 'ul') {
                    $('input[type=checkbox]').prev().css('float', 'left');
                }
                $.each(ui.options.fields, function(name, field){
                    var id = $.format('#{0:s}{1:s}', ui.options.idPrefix, name);
                    field.id = id;
                    field.name = name;
                    field.element = $(id, ui.element).data('validation.field', field);
                    if (field.required != false) {
                        if (ui.form_type == 'table') {
                            field.element.parents('tr').andSelf().addClass(ui.options.requiredClass);
                        }
                        else {
                            field.element.parent().andSelf().addClass(ui.options.requiredClass);
                        }
                    }
                    if (ui.options.smart_field_width && field.rules['max_length']) {
                        if (ui.form_type == 'ul') {
                            var pw = field.element.parent().width() - field.element.parent().find('label').width() - 30;
                        }
                        else {
                            var pw = field.element.parent().width();
                        }
                        var nw = parseInt(field.rules['max_length'], 10) * 10;
                        if (pw < nw) { nw = pw; } // do not go wider than the parent
                        field.element.width(nw);
                    }
                });
            }
        }
    },

    _applyRules: function(field, applyRequired) {
        if (applyRequired) {
            field.rule = 'required';
            $.ui.djangoForm.defaults.rules['required'].apply(this, [field]);
        }
        for (x in $.ui.djangoForm.defaults.rules) {
            field.rule = x; // I know.. it's ugly.
            if (x != 'required' && field[x]) {
                try {
                    $.ui.djangoForm.defaults.rules[x].apply(this, [field]);
                } catch(e){};
            }
        };
    },
    _error: function(field, data) {
        var data = data || {};
        var msg = this.getErrorMessage(field, data);
        this._hasErrors = true;
        this.options.error.apply(this, [field, msg, data]);
        this.element.addClass('ui-djangoForm-error');
    },
    getErrorMessage: function(field, tokens) {
        return !field.msgs[field.rule] && '' 
                || $.format(field.msgs[field.rule].replace(/%\((\w+)\)(\w)/g, '{$1:$2}'), tokens || {});
    },
});

$.tpl('djangoForm.errorList', '<ul></ul>');
$.tpl('djangoForm.error',     '<li></li>');

$.ui.djangoForm.defaults = {
    rules: {},
    form_type: 'auto',
    mode: 'inline', // inline, dialog
    requiredClass: 'ui-djangoForm-required',
    errorListClass: 'errorlist', // use the same as Django
    idPrefix: 'id_',
    error: function(field, message, data) {
        if (!field.element.next().is('ul')) {
            console.log(this.options.errorListClass, field.element);
            $.tpl('djangoForm.errorList')
                .addClass(this.options.errorListClass)
                .insertAfter(field.element);
            console.log('test');
        }
        console.log(field.element.next(), message, data);
        $.tpl('djangoForm.error')
            .appendTo(field.element.next())
            .text(message);
    }
};

$.extend($.ui.djangoForm.defaults.rules, {
    
    required: function(field) {
        if (field.required && field.element.val() == '') {
            this._error(field);
        }
    },

    max_length: function(field) {
        var cl  = field.element.val().length;
        var ml = field.rules.max_length || false;
        if (ml < cl) {
            this._error(field, { max: ml, length: cl });
        }
    },

    min_length: function(field) {
        var cl  = field.element.val().length;
        var ml = field.rules.min_length || false;
        if (ml > cl) {
            this._error(field, { min: ml, length: cl });
        }
    },

    decimal_length: function(field) {
        
        var value = field.element.val();
        var match = /^[-\s0]*(\d*).?(\d*)\s*$/.exec(value);
        /*
        if (match) {
            var max_digits = field.rules.max_digits;
            if (max_digits !== null && (match[1].length + match[2].length) > max_digits) {
                this._error(field, {max_digits: max_digits}, 'max_digits');
            }

            var max_decimal_places = field.rules.max_decimal_places;
            if (max_decimal_places !== null && match[2].length > max_decimal_places) {
                this._error(field, {max_decimal_places: max_decimal_places}, 'max_decimal_places');
            }

            if (max_digits !== null && max_decimal_places !== null) {
                var max_whole_digits = max_digits - max_decimal_places;
                if (match[1].length > max_whole_digits) {
                    this._error(field, {max_whole_digits: max_digits}, 'max_whole_digits');
                }
            }
        }
        */
    }

});


