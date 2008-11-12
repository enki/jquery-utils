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

*/

(function($) {
    function createButton(i, format, className) {
        var o  = format && $.format(format, i) || i;
        var cn = className && 'ui-timepickr '+ className || 'ui-timepickr';
        return $('<li />').addClass(cn).data('id', i).append($('<span />').text(o));
    }

    function createRow(obj, format, className) {
        var row = $('<ol />');
        for (var x in obj) {
            row.append(createButton(obj[x], format || false, className || false));
        }
        return row;
    }
    
    function getTimeRanges(options) {
        var o = [];
        if (options.prefix && options.convention === 24) {
            o.push(createRow(options.prefix, false, 'prefix'));
        }
        if (options.hours) {
            var h = (options.convention === 24) && $.range(0, 24) || $.range(1, 13);

            o.push(createRow(h, '{0:0.2d}', 'hour'));
        }
        if (options.minutes) {
            o.push(createRow(options.rangeMin, '{0:0.2d}', 'minute'));
        }
        if (options.seconds) {
            o.push(createRow(options.rangeSec, '{0:0.2d}', 'second'));
        }
        if (options.suffix && options.convention === 12) {
            o.push(createRow(options.suffix, false, 'suffix'));
        }
        return o;
    }

    function buildMenu (options) {
        var ranges = getTimeRanges(options);
        var menu   = $('<span class="ui-dropslide">');
        //if () {options.convention}
        for (var x in ranges) {
            menu.append(ranges[x]);
        }
        return menu;
    }

    $.widget('ui.timepickr', {
        init: function() {
            var menu    = buildMenu(this.options);
            var element = this.element;
            element.data('timepickr.initialValue', element.val());
            menu.insertAfter(this.element);
            element
                .addClass('ui-timepickr')
                .dropslide(this.options.dropslide)
                .bind('select', this.select);
            
            this.element.blur(function(e) {
                var timepickr = $(this);
                timepickr.dropslide('hide')
                         .val(timepickr.data('timepickr.initialValue'));
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

            // TODO: remember selection
            var hrs = menu.find('ol:eq(1)').find('li:first, li:first span').addClass('hover').end();
            var min = menu.find('ol:eq(2)').find('li:first, li:first span').addClass('hover').end();
            var sec = menu.find('ol:eq(3)').find('li:first, li:first span').addClass('hover').end();

            if (this.options.convention === 24) {
                var day        = menu.find('ol:eq(0) li:eq(0)');
                var night      = menu.find('ol:eq(0) li:eq(1)');
                var dayHours   = hrs.find('li').slice(0, 12);
                var nightHours = hrs.find('li').slice(12, 24);
                var index      = 0;
                var selectHr   = function(id) {
                    hrs.find('li, span').removeClass('hover')
                        .filter('li').eq(id).find('span').andSelf().addClass('hover');
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

        select: function(e, dropslide) {
            $(dropslide.element).timepickr('update');
            e.stopPropagation();
        },

        getHour: function(selection) {
            return this.getValue('hour');
        },

        getMinute: function(selection) {
            return this.getValue('minute');
        },

        getSecond: function(selection) {
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
        }
        
    });

    //$.ui.timepickr.getter = '';

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
