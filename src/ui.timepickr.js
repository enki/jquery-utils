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
        self.locked  = false;
        self.types   = [];
        self.current = {hour:1, minute:0, second:0, amPm: 'am' };

        if (self.options.showHour)   { self.types.push('hour'); }
        if (self.options.showMinute) { self.types.push('minute'); }
        if (self.options.showSecond) { self.types.push('second'); }
        if (self.options.showAmPm)   { self.types.push('amPm'); }

        self.ui = {
            wrapper: $('<div class="ui-timepickr" />').css({left: pos.left}),
            clear:  function(){ return $('<div style="clear:both;">'); }
        };

        for (var i in self.types) {
            var type = self.types[i];
            self.ui[type] = $($.format('<ol class="ui-timepickr-{0:s}" style="display:none;" />', type))
                .mousemove(function(e){ self.events.mousemove.apply(this, [e, self]); })
                .appendTo(self.ui.wrapper);
            self.ui.wrapper.append(self.ui.clear());
            self.populateList(type);
        }

        self.element
            .addClass('ui-timepickr-field ')
            .blur(function(){  self.hide(); })
            .focus(function(){ 
                    self.locked = false;
                    self.show(); });

        $(self.options.trigger)
            .bind(self.options.triggerEvent, function(){ 
                  self.locked = false; 
                  self.show(); });

        if (self.options.val && !self.element.val()) {
             self.element.val(self.options.val)
        }

        $(self.ui.wrapper)
            .insertAfter(self.element);
    },
    populateList: function(type) {
        var self   = this;
        var range  = self.getRange(type);
        for (var i in range) {
            $($.format('<li class="ui-timepickr-{0:s}-btn">', type))
                .mouseover(function(e){ self.events.mouseover.apply(this, [e, self]); })
                .click(function(e){ self.select(); })
                .appendTo(self.ui[type])
                .text($.format(self.options.formats[type] || '', range[i]));
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
        mousemove: function(e, timepickr) {
            var type = $(this).attr('class').match(/ui-timepickr-(hour|minute|second|amPm)/)[1];
            var idx  = timepickr.types.indexOf(type);
            if (timepickr.types[idx+1]) {
                timepickr.reposition.apply(timepickr, [timepickr.types[idx+1]]);
            }
        },
        mouseover: function(e, timepickr) {
            if (!timepickr.locked) {
                var type = $(this).parent().attr('class').match(/ui-timepickr-(hour|minute|second|amPm)/)[1];
                var idx  = timepickr.types.indexOf(type);
                $(this).parent().find('li').removeClass('hover');
                $(this).addClass('hover');
                timepickr.hover(type, $(this).text());
                if (timepickr.types[idx+1]) {
                    timepickr.show(timepickr.types[idx+1]);
                }
            }
        }
    },
    propagate: function(func, args) {
        var self = this;
        for (i in self.types) {
            var type = self.types[i];
            func.apply(self.ui[type], args || []);
        }
    },
    reposition: function(pickr) {
        var self   = this;
        var prevOL = false;
        var nextOL = false;
        var method = self.options.repSpeed > 10 && 'animate' || 'css';
        var offset = 0;
        self.ui.wrapper.find('ol').each(function(){
            var prevOL = $(this).prevAll('ol:visible:last');
            var nextOL = $(this).nextAll('ol:visible:first');
            if (prevOL.get(0)) {
                var prevLI = prevOL.find('li.hover');
                if (!prevLI.get(0)) {
                    var prevLI = prevOL.find('li:first');
                }
                $(this).css({left: prevLI.position().left + offset});
            }
        });
    },
    select: function() {
        var self = this;
        self.locked = true;
        self.hide();
        self.update();
    },
    show: function(pickr) {
        var self  = this;
        var pickr = pickr || 'hour';
        setTimeout(function(){
            self.signals('onOpen');
            self.options.show.apply(self.ui[pickr], [self.options.speed])
            self.reposition.apply(self, [pickr]);
            self.signals('onOpened');
        }, self.options.showDelay * 1000);
    },
    hide: function() {
        var self = this;
        setTimeout(function(){
            self.signals('onClose');
            self.propagate(self.options.hide, [self.options.speed]);
            self.signals('onClosed');
        }, self.options.hideDelay * 1000);
    },
    signals: function(type, args) {
        var self = this;
        if (self.options[type] && $.isFunction(self.options[type])) {
            self.options[type].apply(self, args || []);
        }
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
    hour:         [1,2,3,4,5,6,7,8,9,10,11,12], // available hours to pick
    minute:       [0, 15, 30, 45],  // available minutes to pick
    second:       [0, 15, 30, 45],  // available seconds to pick
    amPm:         ['am', 'pm'],     // AM/PM labels
    showHour:     true,
    showMinute:   true,
    showSecond:   false,
    showAmPm:     true,
	showDelay:    0,                // delay before showing (seconds)
	hideDelay:    0.3,              // delay before hide (seconds)
	timeout:      0,                // time before automatically hiding (seconds, 0 == never)
	speed:        'fast',           // animations speed
	onClose:      false,            // callback before closing
	onClosed:     false,            // callback after closing
	onOpen:       false,            // callback before opening
	onOpened:     false,            // callback after opening
	onHide:       false,            // callback when closed by user
	show:	      $.fn.slideDown,   // showing effect
	hide:	      $.fn.fadeOut,     // closing effect (by user)
    repSpeed:     0,                // reposition speed
    repDelay:     0,                // reposition delay
    val:          false,            // default value
    trigger:      false,            // specify an element which will open the picker upon triggerEvent (click)
    triggerEvent: 'click',          // trigger's event
    formats: {
        field:  '{hour:02d}:{min:02d} {amPm:s}',
        hour:   '{0:02d}',
        minute: '{0:02d}',
        second: '{0:02d}',
        amPm:   '{0}'
    }
};
