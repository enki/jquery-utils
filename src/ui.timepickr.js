/*
  jQuery ui.timepickr - 0.4
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

  Note: if you want the original experimental plugin checkout the rev 224 

  To fix/do
  ---------
  - when activated, timepickr should pre-select the right h,m,s
  - labels
  - optional keyboard navigation
  - optional live input update
  - themes support
  - unit tests
  - positioning problem on first activation

*/

(function($){
    var getTimeRanges = function(options) {
        var o = [];
        if (options.convention == 24) {
            o.push(createRow(['day', 'night']));
        }
        if (options.hours) {
            var h = (options.convention == 24) 
                    && $.range(0, 24)
                    || $.range(1, 13);

            o.push(createRow(h, '{0:0.2d}'));
        }
        if (options.minutes) {
            o.push(createRow(options.rangeMin, '{0:0.2d}'));
        }
        if (options.seconds) {
            o.push(createRow(options.rangeSec, '{0:0.2d}'));
        }
        if (options.apm && options.convention == 12) {
            o.push(createRow(options.apm));
        }
        return o;
    };

    var createButton = function(i, format) {
        var o = format && $.format(format, i) || i;
        return $('<li />').data('id', i).append($('<span />').text(o));
    }

    var createRow = function(obj, format) {
        var row = $('<ol />')
        for (var x in obj) {
            row.append(createButton(obj[x], format || false));
        }
        return row;
    }

    var buildMenu = function(options) {
        var ranges = getTimeRanges(options);
        var menu   = $('<span class="ui-dropslide">');
        for (var x in ranges) {
            menu.append(ranges[x]);
        }
        return menu;
    };

    $.widget('ui.timepickr', {
        init: function() {
            var menu    = buildMenu(this.options);
            var element = this.element;
            menu.insertAfter(this.element);
            element
                .addClass('ui-timepickr')
                .dropslide(this.options.dropslide)
                .bind('select', this.options.select);
            if (this.options.val) {
                element.val(this.options.val)
            }
            if (this.options.handle) {
                $(this.options.handle).click(function(){
                    $(element).dropslide('show');
                });
            }  

            // TODO: remember selection
            var hrs   = menu.find('ol:eq(1)');
            hrs.filter('li:first, li:first span').addClass('hover');

            if (this.options.convention = 24) {
                var day   = hrs.find('li').slice(0, 12);
                var night = hrs.find('li').slice(12, 24);
                // TODO: refactor
                menu.find('ol:eq(0) li:eq(0), ol:eq(0) li:eq(1)').mouseover(function(){
                    var index  = hrs.find('li span.hover').parent().data('id');
                    var li     = hrs.eq(index);

                    if (index > 11) {
                        var index2 = index -12;
                        night.hide();
                        day.show();
                    }
                    else {
                        var index2 = index + 12;
                        day.hide();
                        night.show();
                    }

                    hrs.find('li, span').removeClass('hover');
                    hrs.find('li')
                        .eq(index2).find('span')
                        .andSelf().addClass('hover');
                    element.dropslide('redraw');
                });
            }
            else {
                element.dropslide('redraw');
            }
        }
    });

    $.ui.timepickr.defaults = {
        val:        false,
        handle:     false,
        hours:      true,
        minutes:    true,
        seconds:    false,
        format12:   '{h:02.d}:{m:02.d} {apm:s}',
        format24:   '{h:02.d}:{m:02.d}h',
        rangeMin:   ['00', '15', '30', '45'],
        rangeSec:   ['00', '15', '30', '45'],
        apm:        ['am', 'pm'],
        convention: 24, // 24, 12
        select: function(e, dropslide){
            var sel  = dropslide.getSelection();
            var frmt = dropslide.options.convention == 24 
                        && 'format24' || 'format12';
            var val  = {
                    h: sel[1], 
                    m: sel[2] || 0, 
                    s: sel[3] || 0 };

            $(this).val($.format(dropslide.options[frmt], val));
            e.stopPropagation();
        },
        dropslide: {
            trigger: 'focus',
        }
    };
 })(jQuery);
