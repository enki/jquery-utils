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
  - ui.dropslide.js

  // Could do something interesting with this..
  U+25F4  ◴  White circle with upper left quadrant
  U+25F5  ◵  White circle with lower left quadrant
  U+25F6  ◶  White circle with lower right quadrant
  U+25F7  ◷  White circle with upper right quadrant
  
*/

(function($) {
    $.widget('ui.timepickr', {
        // Backward compatibility for UI < 1.6 - will be removed in 0.5.0
        // TODO: remove in 0.5
        init:  function() { this._init.apply(this, arguments); },
        _init: function() {
            var menu    = this._buildMenu();
            var element = this.element;
            element.data('timepickr.initialValue', element.val());
            menu.insertAfter(this.element);
            element
                .addClass('ui-timepickr')
                .dropslide(this.options.dropslide)
                .bind('select', this.select);
            
            element.blur(function(e) {
                $(this).dropslide('hide');
                $(this).val($(this).data('timepickr.initialValue'));
            });

            if (this.options.val) {
                element.val(this.options.val);
            }

            if (this.options.handle) {
                $(this.options.handle).click(function() {
                    $(element).dropslide('show');
                });
            }

            if (this.options.resetOnBlur) {
                menu.find('li > span').bind('mousedown.timepickr', function(){
                    $(element).data('timepickr.initialValue', $(element).val()); 
                });
            }

            if (this.options.updateLive) {
                menu.find('li').bind('mouseover.timepickr', function() {
                    $(element).timepickr('update'); 
                });
            }

            var hrs = menu.find('ol:eq(1)').find('li:first').addClass('hover').find('span').addClass('ui-hover-state').end().end();
            var min = menu.find('ol:eq(2)').find('li:first').addClass('hover').find('span').addClass('ui-hover-state').end().end();
            var sec = menu.find('ol:eq(3)').find('li:first').addClass('hover').find('span').addClass('ui-hover-state').end().end();

            if (this.options.convention === 24) {
                var day        = menu.find('ol:eq(0) li:eq(0)');
                var night      = menu.find('ol:eq(0) li:eq(1)');
                var dayHours   = hrs.find('li').slice(0, 12);
                var nightHours = hrs.find('li').slice(12, 24);
                var index      = 0;
                var selectHr   = function(id) {
                    hrs.find('li').removeClass('hover');
                    hrs.find('span').removeClass('ui-hover-state');
                    hrs.find('li').eq(id).addClass('hover').find('span').addClass('ui-hover-state')
                };

                day.mouseover(function() {
                    nightHours.hide();
                    dayHours.show(0);
                    index = hrs.find('li.hover').data('id') || hrs.find('li:first').data('id');
                    selectHr(index > 11 && index - 12 || index);
                    element.dropslide('redraw');
                });

                night.mouseover(function() {
                    dayHours.hide();
                    nightHours.show(0);
                    index = hrs.find('li.hover').data('id') || hrs.find('li:first').data('id');
                    selectHr(index < 12 && index + 12 || index);
                    element.dropslide('redraw');
                });
            }
            element.dropslide('redraw');
            element.data('timepickr', this);
        },

        update: function() {
            var frmt = this.options.convention === 24 && 'format24' || 'format12';
            var val = {
                h: this.getValue('hour'),
                m: this.getValue('minute'),
                s: this.getValue('second'),
                prefix: this.getValue('prefix'),
                suffix: this.getValue('suffix')
            };
            var o = $.format(this.options[frmt], val);

            $(this.element).val(o);
        },

        select: function(e) {
            var dropslide = $(this).data('dropslide');
            $(dropslide.element).timepickr('update');
            e.stopPropagation();
        },

        getHour: function() {
            return this.getValue('hour');
        },

        getMinute: function() {
            return this.getValue('minute');
        },

        getSecond: function() {
            return this.getValue('second');
        },

        getValue: function(type) {
            return $('.ui-timepickr.'+ type +'.hover', this.element.next()).text();
        },
        
        activate: function() {
            this.element.dropslide('activate');
        },

        destroy: function() {
            this.element.dropslide('destroy');
        },
        
        /* UI private methods */
        
        _createButton: function(i, format, className) {
            var o  = format && $.format(format, i) || i;
            var cn = className && 'ui-timepickr '+ className || 'ui-timepickr';
            return $('<li class="ui-reset" />').addClass(cn).data('id', i).append($('<span class="ui-default-state" />').text(o));
        },

        _createRow: function(range, format, className) {
            var row = $('<ol class="ui-clearfix ui-reset" />');
            var button = this._createButton;
            // Thanks to Christoph Müller-Spengler for the bug report
            $.each(range, function(idx, val){
                row.append(button(val, format || false, className || false));
            });
            return row;
        },
        
        _getRanges12: function() {
            var o = [], opt = this.options;
            if (opt.hours)   { o.push(this._createRow($.range(1, 13), '{0:0.2d}', 'hour')); }
            if (opt.minutes) { o.push(this._createRow(opt.rangeMin,   '{0:0.2d}', 'minute')); }
            if (opt.seconds) { o.push(this._createRow(opt.rangeSec,   '{0:0.2d}', 'second')); }
            if (opt.suffix)  { o.push(this._createRow(opt.suffix,     false,      'suffix')); }
            return o;
        },

        _getRanges24: function() {
            var o = [], opt = this.options;
            o.push(this._createRow(opt.prefix, false, 'prefix')); // prefix is required in 24h mode
            if (opt.hours)   { o.push(this._createRow($.range(0, 24),   '{0:0.2d}', 'hour')); }
            if (opt.minutes) { o.push(this._createRow(opt.rangeMin, '{0:0.2d}', 'minute')); }
            if (opt.seconds) { o.push(this._createRow(opt.rangeSec, '{0:0.2d}', 'second')); }
            return o;
        },

        _buildMenu: function() {
            var menu   = $('<span class="ui-reset ui-dropslide ui-component" />');
            var ranges = this.options.convention === 24 
                         && this._getRanges24() || this._getRanges12();

            $.each(ranges, function(idx, val){
                menu.append(val);
            });
            return menu;
        }
    });

    $.ui.timepickr.defaults = {
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
        rangeMin:    ['00', '15', '30', '45'],
        rangeSec:    ['00', '15', '30', '45'],
        updateLive:  true,
        resetOnBlur: true,
        val:         false
    };

})(jQuery);
