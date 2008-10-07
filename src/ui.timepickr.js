/*
  jQuery ui.timepickr - 0.1
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

$.widget('ui.timepickr', {
    init: function() {
        var self     = this;
        var pos      = self.element.position();
        var hours    = self.getRange('hour');
        var minutes  = self.getRange('minute');
        self.current = {hour:1, minute:0, second:0, amPm: 'am' };

        self.ui = {
            wrapper: $('<div class="ui-timepickr" />').css({left: pos.left}),
            hour:   $('<ol class="ui-timepickr-hour" style="display:none;" />'),
            minute: $('<ol class="ui-timepickr-minute" style="display:none;" />'),
            second: $('<ol class="ui-timepickr-second" style="display:none;" />'),
            amPm:   $('<ol class="ui-timepickr-amPm" style="display:none;" />'),
            clear:  function(){ return $('<div style="clear:both;">'); }
        };

        $(self.ui.wrapper)
            .append(self.ui.hour)
            .append(self.ui.clear())
            .append(self.ui.minute)
            .append(self.ui.clear())
            .append(self.ui.second)
            .append(self.ui.clear())
            .append(self.ui.amPm)
            .insertAfter(self.element);
        for (i in self.options.types) {
            self.populateList(self.options.types[i]);
        }
        self.element
            .addClass('ui-timepickr-field ')
            .focus(function(){ self.show(); });

        if (self.options.val && !self.element.val()) {
             self.element.val(self.options.val)
        }
        //self.element.blur(function(){ self.hide();});
    },
    populateList: function(type) {
        var self   = this;
        var range  = self.getRange(type);
        for (i in range) {
            console.log(range[i]);
            $('<li>')
                .mouseover(function(e){ self.events.mouseover.apply(this, [e, self]); })
                .click(function(e){ self.hide(); })
                .appendTo(self.ui[type])
                .text($.format(self.options.formats[type] ||  '', range[i]));
        }

    },
    hover: function() {
        var self = this;
        // type, value
        if (arguments.length < 3 && typeof(arguments[0]) == 'string') {
            self.current[arguments[0]] = arguments[1];
        }
        // hour, min, sec
        else {
            self.current['hour']   = arguments[0];
            self.current['minute'] = arguments[1];
            self.current['second'] = arguments[2];
            self.current['amPm']   = (arguments[3] && arguments[3] == 'pm') ? 'pm' : 'am';
        }
        self.update();
    },
    update: function() {
        var self = this;
        self.element.val($.format(self.options.formats['field'], {
                    hour:parseInt(self.current.hour, 10), 
                    min: parseInt(self.current.minute || 0, 10),
                    sec: parseInt(self.current.second || 0, 10),
                    amPm: self.current.amPm || 'am'}));
    },
    events: {
        mouseover: function(e, timepickr) {
            var type = $(this).parent().attr('class').match(/ui-timepickr-(hour|minute|second|amPm)/)[1];
            var idx  = timepickr.options.types.indexOf(type);
            $(this).parent().find('li').removeClass('hover');
            $(this).addClass('hover');
            timepickr.hover(type, $(this).text());
            timepickr.reposition.apply(timepickr, [this]);
            console.log(timepickr.options.types[idx+1]);
            if (timepickr.options.types[idx+1]) {
                timepickr.show(timepickr.options.types[idx+1]);
            }
        },
        hour: {
            mouseover: function(e, timepickr) {
                $(this).parent().find('li').removeClass('hover');
                $(this).addClass('hover');
                timepickr.hover('hour', $(this).text());
                timepickr.reposition.apply(timepickr, [this]);
                timepickr.show('minute');
            } 
        },
        minute: {
            mouseover: function(e, timepickr) {
                $(this).parent().find('li').removeClass('hover');
                $(this).addClass('hover');
                timepickr.hover('minute', $(this).text());
                timepickr.reposition.apply(timepickr, [this]);
                timepickr.show('amPm');
            } 
        },
        amPm: {
            mouseover: function(e, timepickr) {
                $(this).parent().find('li').removeClass('hover');
                $(this).addClass('hover');
                timepickr.hover('amPm', $(this).text());
            },
            click: function() {
                
            }
        }
    },
    propagate: function(func, args) {
        var self = this;
        for (i in self.options.types) {
                console.log(self.ui[self.options.types[i]])

        //  ex: self.ui.hour.slideUp
            if (self.ui[self.options.types[i]][func]) {
                self.ui[self.options.types[i]][func].call(args);
            }
        }
        
    },
    reposition: function(pickr) {
        var self      = this;
        var pickr1    = $(pickr);
        var pickr2    = $(pickr).parent().nextAll('ol:visible');
        if (pickr2.length > 0) {
            var pickr1Pos = pickr1.position();
            var pickr2Pos = pickr2.position();
            var method    = self.options.repSpeed > 10 && 'animate' || 'css';
            var offsetL   = 0;
            // cummulative offset plz 
            $(pickr).parent().prevAll('ol:visible').each(function(){
                offsetL = offsetL + $('li.hover, li:first',  this).eq(0).position().left;
            });
            setTimeout(function(){
                console.log('TTTTTTTTTEEEEEEEST',pickr2)
                pickr2[method]({left:pickr1Pos.left + offsetL + 1}, self.options.repSpeed);
            }, self.options.repTimeout);
        }
    },
    show: function(pickr) {
        var self  = this;
        var pickr = pickr || 'hour';
        self.ui[pickr].slideDown('fast');
        timepickr.reposition.apply(self, [self.ui[pickr].filter('li.selected, li:first').eq(0)]);
    },
    hide: function() {
        var self = this;
        //self.propagate('slideUp', ['slow']);
        self.ui.hour.hide('fast');
        self.ui.minute.hide('fast');
        self.ui.second.hide('fast');
        self.ui.amPm.hide('fast');
    },
    getRange: function(type) {
        var self = this;
        if (typeof(self.options[type]) ==  'string') {
            var r = self.options[type].split('-');
            return $.range(r[0], r[1]);
        }
        else {
            return self.options[type];
        }
    }
});

$.ui.timepickr.defaults = {
    types:       ['hour', 'minute', 'amPm'],
    formats: {
        field:  '{hour:02d}:{min:02d} {amPm:s}',
        hour:   '{0:02d}',
        minute: '{0:02d}',
        second: '{0:02d}',
        amPm:   '{0}'
    },
    hour:        [1,2,3,4,5,6,7,8,9,10,11,12],
    minute:      [0, 15, 30, 45],
    seconds:     [0, 15, 30, 45],
    amPm:        ['am', 'pm'],
	delay:       0,              // delay before showing (seconds)
	timeout:     3,              // time before hiding (seconds)
	speed:       'slow',         // animations speed
	closable:    true,           // allow user to close it
	sticky:      false,          // show until user close it
	onClose:     false,          // callback before closing
	onClosed:    false,          // callback after closing
	onOpen:      false,          // callback before opening
	onOpened:    false,          // callback after opening
	onHide:      false,          // callback when closed by user
	show:	     $.fn.slideDown, // showing effect
	hide:	     $.fn.fadeOut,   // closing effect (by user)
	close:       $.fn.slideUp,   // hiding effect (timeout)
    repSpeed:    50,             // reposition speed
    repTimeout:  10,             // reposition speed
    val:         false           // default value
    
};
