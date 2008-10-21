/*
  jQuery ui.timepickr - 0.3
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

  Note: if you want the original experimental plugin checkout the rev 224 

*/

(function($){
    var getTimeRanges = function(options) {
        var o = [];
        if (options.hours) {
            o.push((options.convention == 24) 
                    && options.range24h
                    || options.range12h);
        }
        if (options.minutes) {
            o.push(options.rangeMin);
        }
        if (options.seconds) {
            o.push(options.rangeSec);
        }
        if (options.convention ==12 && options.apm) {
            o.push(options.apm)
        }
        return o;
    };

    var createButton = function(i) {
        return $('<li />').append($('<span />').text(i));
    }

    var createRow = function(obj) {
        var row = $('<ol />')
        for (var x in obj) {
            row.append(createButton(obj[x]));
        }
        return row;
    }

    var buildMenu = function(i, root) {
        var menu = $('<span class="ui-dropslide">');
        for (var x in i) {
            menu.append(createRow(i[x]));
        }
        return menu;
    };

    $.widget('ui.timepickr', {
        init: function() {
            var ranges  = getTimeRanges(this.options);
            var menu    = buildMenu(ranges);
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
        }
    });

    $.ui.timepickr.defaults = {
        val:     false,
        handle:  false,
        hours:   true,
        minutes: true,
        seconds: false,
        range24h: $.range(0, 24),
        range12h: $.range(1, 13),
        rangeMin: ['00', '15', '30', '45'],
        rangeSec: ['00', '15', '30', '45'],
        apm:      ['am', 'pm'],
        convention: 12, // 24, 12
        select: function(e, dropslide){
            $(this).val(dropslide.getSelection().join(':'));
            e.stopPropagation();
        },
        dropslide: {
            trigger: 'focus',
        }
    };
 })(jQuery);
