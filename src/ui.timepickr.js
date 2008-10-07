/*
  jQuery ui.timepickr - 0.2
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

$.widget('ui.timepickr', {
    init: function() {
        var self     = this;
        var pos      = self.element.position();
        self.types   = [];
        self.current = {hour:1, minute:0, second:0, amPm: 'am' };

        if (self.options.showHour)   { self.types.push('hour'); }
        if (self.options.showMinute) { self.types.push('minute'); }
        if (self.options.showSecond) { self.types.push('second'); }
        if (self.options.showAmPm)   { self.types.push('amPm'); }

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

        for (i in self.types) {
            self.populateList(self.types[i]);
        }
        self.element
            .addClass('ui-timepickr-field ')
            .focus(function(){ self.show(); });

        if (self.options.val && !self.element.val()) {
             self.element.val(self.options.val)
        }
    },
    populateList: function(type) {
        var self   = this;
        var range  = self.getRange(type);
        for (i in range) {
            $($.format('<li class="ui-timepickr-{0:s}-btn">', type))
                .mouseover(function(e){ self.events.mouseover.apply(this, [e, self]); })
                .click(function(e){ self.hide(); })
                .appendTo(self.ui[type])
                .text($.format(self.options.formats[type] ||  '', range[i]));
        }
    },
    hover: function() {
        var self = this;
        
        if (arguments.length < 3 && typeof(arguments[0]) == 'string') { // type, value
            self.current[arguments[0]] = arguments[1];
        }
        else { // hour, min, sec
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
            var idx  = timepickr.types.indexOf(type);
            $(this).parent().find('li').removeClass('hover');
            $(this).addClass('hover');
            timepickr.hover(type, $(this).text());
            timepickr.reposition.apply(timepickr, [this]);
            if (timepickr.types[idx+1]) {
                timepickr.show(timepickr.types[idx+1]);
            }
        }
    },
    propagate: function(func, args) {
        var self = this;
        for (i in self.types) {
            var type = self.types[i];
            if (self.ui[type][func]) {
                self.ui[type][func].apply(self.ui[type], args);
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
                pickr2[method]({left:pickr1Pos.left + offsetL + 1}, self.options.repSpeed);
            }, self.options.repDelay);
        }
    },
    show: function(pickr) {
        var self  = this;
        var pickr = pickr || 'hour';
        setTimeout(function(){
            self.reposition.apply(self, [self.ui[pickr].find('li.selected, li:first').eq(0).get(0)]);
            if (self.options.onOpen) { self.options.onOpen.apply(self); }
            self.ui[pickr].show(self.options.speed);
            if (self.options.onOpened) { self.options.onOpened.apply(self); }
        }, self.options.showDelay * 1000);
    },
    hide: function() {
        var self = this;
        setTimeout(function(){
            if (self.options.onClose) { self.options.onClose.apply(self); }
            self.propagate('hide', [self.options.speed]);
            if (self.options.onClosed) { self.options.onClosed.apply(self); }
        }, self.options.hideDelay * 1000);
    },
    getRange: function(type) {
        var self = this;
        if (typeof(self.options[type]) ==  'string') {
            var r = self.options[type].split('-');
            return $.range(r[0], r[1]);
        }
        return self.options[type];
    }
});

$.ui.timepickr.defaults = {
    hour:        [1,2,3,4,5,6,7,8,9,10,11,12], // available hours to pick
    minute:      [0, 15, 30, 45],  // available minutes to pick
    second:      [0, 15, 30, 45],  // available seconds to pick
    amPm:        ['am', 'pm'],     // AM/PM labels
    showHour:    true,
    showMinute:  true,
    showSecond:  false,
    showAmPm:    true,
	showDelay:   0,                // delay before showing (seconds)
	hideDelay:   0,                // delay before hide (seconds)
	timeout:     0,                // time before automatically hiding (seconds, 0 == never)
	speed:       'fast',           // animations speed
	onClose:     false,            // callback before closing
	onClosed:    false,            // callback after closing
	onOpen:      false,            // callback before opening
	onOpened:    false,            // callback after opening
	onHide:      false,            // callback when closed by user
	show:	     $.fn.slideDown,   // showing effect
	hide:	     $.fn.fadeOut,     // closing effect (by user)
	close:       $.fn.slideUp,     // hiding effect (timeout)
    repSpeed:    50,               // reposition speed
    repDelay:    10,               // reposition delay
    val:         false,            // default value
    formats: {
        field:  '{hour:02d}:{min:02d} {amPm:s}',
        hour:   '{0:02d}',
        minute: '{0:02d}',
        second: '{0:02d}',
        amPm:   '{0}'
    }
};
