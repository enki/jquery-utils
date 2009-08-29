/*
  jQuery ui.keynav - 0.4
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

  Dependencies 
  ¯¯¯¯¯¯¯¯¯¯¯¯
  - jquery.ui.js
  - jquery.utils.js
  - jquery.strings.js
  - jquery.mousewheel.js
*/

$.widget('ui.keynav', {
    _init: function(){
        var $elf = this;
        var type = $.ui.keynav.types[this.options.type];
        if (type) {
            if (type._init) {
                type._init.apply(this.element, [this]);
            }
            if (type.constraints) {
                this._applyConstraints(type);
            }
        }
    },
    _bindArrows: function(el, type, ev) {
        var $elf = this;
        $(el).bind(ev || 'keyup.keynavArrows', function(e){
            if ($.keyIs('up', e))  {
                $.ui.keynav.types[type].increment.apply(this, [e, $elf]);
            }
            if ($.keyIs('down', e))  {
                $.ui.keynav.types[type].decrement.apply(this, [e, $elf]);
            }
        });
    },
    _bindMouseWheel: function(el, type) {
        var $elf = this;
        $(el).mousewheel(function(e, delta){
            var action = delta < 0 && 'decrement' || 'increment';
            $.ui.keynav.types[type][action].apply(this, [e, $elf]);
            $(this).trigger('keyup');
            return false;
        });
    },
    _applyConstraints: function(type) {
        for (var x in type.constraints) {
            if ($.ui.keynav.constraints[x]) {
                var constraint = this.options[x] || type.constraints[x];
                if ($.isFunction($.ui.keynav.constraints[x])) {
                    $.ui.keynav.constraints[x].apply(this, [constraint]);
                }
            }
        }
    }
});

$.ui.keynav.types = {
    integer: {
        constraints: {
            max: 100,
            max_length: 5,
            allow_keyCodes: [
                0, 13, 16, 17, 18, 20, 27, 33, 34, 35, 36, 
                37, 38, 39, 40, 45, 46, 48, 49, 50, 51, 52, 
                53, 54, 55, 56, 57, 8, 9, 96, 97, 98, 99, 100, 
                101, 102, 103, 104, 105]
        },
        _init: function(ui) {
            if (ui.options.mousewheel) { ui._bindMouseWheel(this, 'integer'); }
            if (ui.options.arrows)     { ui._bindArrows(this,     'integer'); }
        },
        increment: function(e, ui){
            var val = parseInt($(this).val(), 10);
            var inc = (ui.options.shiftModifier && e.shiftKey)
                        ? ui.options.shiftModifierVal: 1;
            $(this).val(parseInt(val + inc, 10));
        },
        decrement: function(e, ui){
            var val = parseInt($(this).val(), 10);
            var inc = (ui.options.shiftModifier && e.shiftKey)
                        ? ui.options.shiftModifierVal: 1;
            $(this).val(parseInt(val - inc, 10));
        }
    },
    fixed: {
        constraints: {
            max: 100,
            max_length: 5, // max length apply to the digit *before* the dot 
            max_digits: 2, // max length apply to the digit *after* the dot
            allow_keyCodes: [
                0, 13, 16, 17, 18, 20, 27, 33, 34, 35, 36, 
                37, 38, 39, 40, 45, 46, 48, 49, 50, 51, 52, 
                53, 54, 55, 56, 57, 8, 9, 96, 97, 98, 99, 100, 
                101, 102, 103, 104, 105, 110, 190]
        },
        _init: function(ui) {
            if (ui.options.mousewheel) { ui._bindMouseWheel(this, 'fixed'); }
            if (ui.options.arrows)     { ui._bindArrows(this,     'fixed'); }
        },
        increment: function(e, ui){
            var val = parseFloat($(this).val(), 10);
            var inc = (ui.options.shiftModifier && e.shiftKey)
                        ? ui.options.shiftModifierVal: 1;
            if (!e.altKey) { inc = inc/100; }
            $(this).val($.format(ui.options.fixedFormat, val + inc));
        },
        decrement: function(e, ui){
            var val = parseFloat($(this).val(), 10);
            var inc = (ui.options.shiftModifier && e.shiftKey)
                        ? ui.options.shiftModifierVal: 1;
            if (!e.altKey) { inc = inc/100; }
            $(this).val($.format(ui.options.fixedFormat, val - inc));
        }
    }
};

$.ui.keynav.constraints = {
    max: function(max) {
        var el  = this.element;
        max = this.options.max || max;
        $(el).bind('keyup.max', function(){
                var val = parseFloat($(this).val(), 10);
                if (val > max) {
                    try { /* IE FIX */
                        $(this).val(max);
                    } catch(e) {}
                }
        });
    },
    max_digits: function(maxLength) {
        var el = this.element;
        $(el).bind('keyup.max_digits', function(){
            var val = $(el).val();
            var pfx = '';
            var sfx = '';
            if (val.indexOf('.') > 0) {
                pfx = val.split('.')[0] + '.';
                sfx = val.split('.')[1];

                if (sfx.length > maxLength) {
                    try { /* IE FIX */
                        $(this).val(pfx + sfx.slice(0, maxLength));
                    } catch(e) {}
                }
            }
        });
    },
    max_length: function(maxlength) {
        $(this.element).attr('maxlength', maxlength);
    },
    allow_keyCodes: function(keyCodes) {
        var el = this.element;
        $(el).bind('keydown.allow_keyCodes', function(e){
            if ($.inArray(e.keyCode, keyCodes) < 0) {
                return false;
            }
        });
    }
};

$.ui.keynav.defaults = {
    type: 'integer',
    mousewheel: true,
    arrows: true,
    shiftModifier: true,
    shiftModifierVal: 10,
    fixedFormat: '{0:02.f}'
};
