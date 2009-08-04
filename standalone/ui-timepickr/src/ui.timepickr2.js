/*
  jQuery ui.timepickr - @VERSION
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

  Note: if you want the original experimental plugin checkout the rev 224 

  Dependencies
  ------------
  - jquery.utils.js
  - jquery.strings.js
  - jquery.ui.js
  
*/

(function($) {

$.tpl('timepickr.menu',   '<div class="ui-helper-reset ui-dropslide ui-timepickr ui-widget" />');
$.tpl('timepickr.row',    '<ol class="ui-timepickr-row ui-helper-clearfix" />');
$.tpl('timepickr.button', '<li class="{className:s} ui-state-default"><span>{label:s}</span></li>');

$.widget('ui.timepickr', {
    plugins: {},
    _init: function() {
        this._dom = {
            menu: $.tpl('timepickr.menu'),
            row:  $.tpl('timepickr.menu')
        };
        this._trigger('initialize');
        this._trigger('initialized');
    },

    _trigger: function(type, e, ui) {
        var ui = ui || this;
        $.ui.plugin.call(this, type, [e, ui]);
        return $.widget.prototype._trigger.call(this, type, e, ui);
    },

    _createButton: function(i, format, className) {
        var o  = format && $.format(format, i) || i;
        var cn = className && 'ui-timepickr-button '+ className || 'ui-timepickr-button';
        return $.tpl('timepickr.button', {className: cn, label: o}).data('id', i)
                .bind('mouseover', function(){
                    $(this).siblings()
                        .removeClass('ui-state-hover').end()
                        .addClass('ui-state-hover');
                });

    },

    _addRow: function(range, format, className, insertAfter) {
        var ui  = this;
        var btn = false;
        var row = $.tpl('timepickr.row').bind('mouseover', function(){
            $(this).next().show();
        });
        $.each(range, function(idx, val){
            ui._createButton(val, format || false).appendTo(row);
        });
        if (className) {
            $(row).addClass(className);
        }
        if (insertAfter) {
            row.insertAfter(insertAfter);
        }
        else {
            ui._dom.menu.append(row);
        }
        return row;
    },

    _setVal: function(val) {
        if (typeof(val) == 'string') {
            val = val.split(/:|\s/);
        }
        
        this.element.data('timepickr.initialValue', val);
        this.element.val(this._formatVal(val));
    },

    _getVal: function() {
        var ui = this;
        var tmp = $.makeArray(ui._dom.menu.find('ol').map(function(){
            var lis = $(this).find('li');
            if (lis.filter('.ui-state-hover').get(0)) {
                return lis.filter('.ui-state-hover').eq(0).text(); 
            }
            return lis.eq(0).text();
        }));
        return tmp;
    },

    _formatVal: function(ival) {
        var val = ival || this._getVal();

        var out = [];
        if (this.options.convention === 24) {
            if (this.options.prefixVal) {
                out.push(val[0]);
                out.push(val.slice(1).join(':'));
            }
            else {
                out.push(val.join(':'));
            }
        }
        
        if (this.options.convention === 12) {
            if (this.options.suffixVal) {
                out.push(val.slice(0, -1).join(':'));
                out.push(val.slice(-1));
            }
            else {
                out.push(val.join(':'));
            }
        }
        return out.join(' ');
    },

    blur: function() {
        return this.element.blur();      
    },

    focus: function() {
        return this.element.focus();      
    }

});

// These properties are shared accross every instances of timepickr 
$.extend($.ui.timepickr, {
    version:     '@VERSION',
    eventPrefix: '',
    getter:      '',
    defaults:    {
        convention:  24, // 24, 12
        dropslide:   { trigger: 'focus' },
        format12:    '{h:02.d}:{m:02.d} {suffix:s}',
        format24:    '{h:02.d}:{m:02.d}',
        handle:      false,
        hours:       true,
        minutes:     true,
        seconds:     false,
        prefix:      ['am', 'pm'],
        suffix:      ['am', 'pm'],
        prefixVal:   false,
        suffixVal:   true,
        rangeHour12: $.range(1, 13),
        rangeHour24: $.range(0, 24),
        rangeMin:    $.range(0, 60, 15),
        rangeSec:    $.range(0, 60, 15),
        updateLive:  true,
        resetOnBlur: true,
        val:         false,
        core:        true
    }
});


$.ui.plugin.add('timepickr', 'core', {
    initialized: function(e, ui) {
        var menu = ui._dom.menu;
        var pos  = ui.element.position();

        menu .insertAfter(ui.element).css('left', pos.left);

        if (!$.boxModel) { // IE alignement fix
            menu.css('margin-top', ui.element.height() + 8);
        }
        
        ui.element
            .bind('keydown', function(e) {
                if ($.keyIs('enter', e)) {
                    ui._setVal(ui._getVal());
                    ui._dom.menu.hide();
                    ui.blur();
                }
                else if ($.keyIs('escape', e)) {
                    ui._dom.menu.hide();
                    ui.blur();
                }
            })
            .bind('focus', function() {
                ui._dom.menu.show();
                ui._dom.menu.find('ol:first').show();
            })
            .bind('blur', function() {
                ui._dom.menu.hide();
                if (ui.options.resetOnBlur) {
                    ui.element.val(ui._formatVal(ui.element.data('timepickr.initialValue')));
                }
            });

        menu.find('li').bind('mouseover.timepickr', function() {
            ui._trigger('refresh');
        });
        
        if (ui.options.resetOnBlur) {
            ui.element.data('timepickr.initialValue', ui._getVal());
            menu.find('li > span').bind('mousedown.timepickr', function(){
                ui.element.data('timepickr.initialValue', ui._getVal()); 
            });
        }
        
        if (ui.options.val) {
            ui._setVal(ui.options.val);
        }

    },
    refresh: function(e, ui) {
        // Realign each menu layers
        ui._dom.menu.find('ol').each(function(){
            var p = $(this).prev('ol');
            try { // .. to not fuckup IE
                $(this).css('left', p.position().left + p.find('.ui-state-hover').position().left);
            } catch(e) {};
        });
        
        if (ui.options.updateLive) {
            ui.element.val(ui._formatVal());
        }
    }
});

$.ui.plugin.add('timepickr', 'hours', {
    initialize: function(e, ui) {
        if (ui.options.hours) {
            if (ui.options.convention === 24) {
                ui._dom.prefix = ui._addRow(ui.options.prefix, false, 'prefix'); // prefix is required in 24h mode
                ui._dom.hours  = ui._addRow(ui.options.rangeHour24, '{0:0.2d}', 'hours');
            }
            else {
                ui._dom.hours  = ui._addRow(ui.options.rangeHour12, '{0:0.2d}', 'hours');
                ui._dom.suffix = ui._addRow(ui.options.suffix, false, 'suffix'); // suffix is required in 12h mode
            }
        }
    }});

$.ui.plugin.add('timepickr', 'minutes', {
    initialize: function(e, ui) {
        if (ui.options.minutes) {
            ui._dom.minutes = ui._addRow(ui.options.rangeMin, '{0:0.2d}', 'minutes', ui._dom.hours && ui._dom.hours || false);
        }
    }
});

$.ui.plugin.add('timepickr', 'seconds', {
    initialize: function(e, ui) {
        if (ui.options.seconds) {
            ui._dom.seconds = ui._addRow(ui.options.rangeSec, '{0:0.2d}', 'seconds', ui._dom.minutes && ui._dom.minutes || false);
        }
    }
});

})(jQuery);
