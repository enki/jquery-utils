/*
  jQuery ctrl.keynav - 0.1
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

  Dependencies 
  ¯¯¯¯¯¯¯¯¯¯¯¯
  - jquery.ui.js
  - jquery.utils.js

*/

$.widget('ctrl.keynav', {
    init: function(){
        var self = this;

        // try to guess format from class if none is specified
        if (!self.options.format) {
            var match = $(self.element).attr('class').match(/ctrl-keynav-(\w+)/i);
            self.options.format = match && match[1] || 'int';
        }
        else {
            $(self.element).addClass('ctrl-keynav ctrl-keynav-'+ self.options.format);
        }
        if ($.ctrl.keynav.formats[self.options.format]) {
            self.keynav = $.ctrl.keynav.formats[self.options.format];
            $.each(['focus', 'blur', 'keyup', 'keydown'], function(i, callback) {
                if (self.keynav[callback] && $(self.element)[callback]) {
                    self.observe(callback);
                }
            });
        }
    },
    observe: function(callback) {
        var self = this;
        // use delayed observer if available
        if (self.options.delayed && $.inArray(callback, ['keyup', 'keydown', 'keypress'])) {
            $(self.element).delayedObserver(function(e){ 
                return self.update.apply(self, [e]); }, {});
        }
        else {
            $(self.element)[callback](function(e){ 
                return self.update.apply(self, [e]); });
        }
    },
    update: function(e) {
        var key = $.inArray(e.which, this.keynav.capture) > -1 && e.which || 'all';
        if (this.keynav[e.type] && this.keynav[e.type][key]) {
            this.keynav[e.type][key].apply(this, [e]);
        }
    },
    val: function(v) {
        var self = this;
        if (self.keynav.val) {
            return self.keynav.val.apply(self, [v]);
        }
        else {
            return v && $(self.element).val(v) || $(self.element).val();
        }
    },
    chr: function (pos) {
        $(self.element).val()[pos || self.pos()];
    },
    pos: function() {
             console.log($(this.element).get(0).selectionStart);
         return $(this.element).get(0).selectionStart;
    },
    select: function(s, e) {
        return $(this.element).selectRange(s || 0, typeof(e) == 'undefined' && s+1 || e);
    },
});

$.ctrl.keynav.defaults = {
    format:  false,
    delayed: $.fn.delayedObserver || false,
    delay:   0.3
};

$.ctrl.keynav.formats  = {
    int: {
        capture: [38, 40], // top, bottom arrows
        val: function(v) {
            return v && $(this.element).val(v) || parseInt($(this.element).val(), 10);
        },
        keyup: {
            all: function() {
                var match = $(this.element).val().match(/\d+/g);
                $(this.element).val(match && !isNaN(match[0]) && parseInt(match[0], 10) || '');
            },
            38: function(e) { // top 
                if (e.ctrlKey)  this.val(this.val() + 100);
                if (e.shiftKey) this.val(this.val() + 10);
                else            this.val(this.val() + 1);
            },
            40: function(e) { // bottom
                if (e.ctrlKey)  this.val(this.val() - 100);
                if (e.shiftKey) this.val(this.val() - 10);
                else            this.val(this.val() - 1);
            }
        }
    },
    time: {
        capture: [38, 40], // top, bottom arrows
        format:  24,
        keyup: {
            all: function(e) {
                var self = this;
            },
            38: function(e) { // top 
                var self = this;
                var time = self.keynav.getTime($(self.element).val());
                var hour = parseInt(time[0], 10);
                var min  = parseInt(time[1], 10);
                
                if (e.altKey)        min  = min + 1;
                else if (e.ctrlKey)  min  = Math.round((min+30)/10)*10;
                else if (e.shiftKey) hour = hour + 1;
                else                 min  = Math.round((min+10)/10)*10;

                if (min  >= 59) { min  = 0; hour++; }
                if (hour >= 24) { hour = 1; }
                if (min  < 10)  { min  = '0'+min; }
                if (hour < 10)  { hour = '0'+hour; }

                self.val(hour +':'+ min);
            },
            40: function(e) { // bottom
                var self = this;
                var time = self.keynav.getTime($(self.element).val());
                var hour = parseInt(time[0], 10);
                var min  = parseInt(time[1], 10);
                
                if (e.altKey)        min  = min  - 1;
                else if (e.ctrlKey)  min  = Math.round((min-30)/10)*10;
                else if (e.shiftKey) hour = hour - 1;
                else                 min  = Math.round((min-10)/10)*10;

                if (min  < 0)   { min  = 59; hour--; }
                if (hour < 0)   { hour = 24; }
                if (min  < 10)  { min  = '0'+min; }
                if (hour < 10)  { hour = '0'+hour; }

                self.val(hour +':'+ min);
            }
        },
        getTime: function(str) {
            var o = str.split(':');
            var h = o[0] || 0;
            var m = o[1] || 0;
            return [isNaN(h) && 0 || h, isNaN(m) && 0 || m];
        }
    }
};

$.extend($.ctrl.keynav.formats, {
    alphabet: {
        capture: [37, 38, 39, 40], // left, top, right, bottom arrows
        chars: 'abcdefghijklmnopqrstuvwxyz',
        focus: function() {
            $(this.element).selectRange(1, 2);
        },
        keyup: {
            all: function(e) {
                var self = this;
                switch(e.which) {
                    case 35: 
                        self.select(self.val().length - 1);
                    break; 
                    case 36:
                        self.select(0)
                    break; 
                }
            },
            37: function(e) { // left
                var pos = (this.pos()-1 >= 0)? this.pos()-1: this.val().length-1;
                this.select(pos);
            },
            38: function(e) { // top 
                var self = this;
                var pos  = self.pos();
                var chr  = $(self.element).val()[pos];
                var idx  = self.keynav.chars.indexOf(chr);
                var nchr = self.keynav.chars[(self.keynav.chars[idx+1] && idx+1 || 0)];
                
                self.val(self.val().slice(0, pos) + nchr + self.val().slice(pos+1, self.val().length));
                self.select(pos);

                e.preventDefault();
                e.stopPropagation();
            },
            39: function(e) { // right
                var pos = (this.pos() <= this.val().length)? this.pos(): 1;
                //console.log('%s-%s-%s', this.pos(), this.val().length, pos);
                this.select((pos <= this.val().length) && pos-1 || pos);
            },
            40: function(e) { // bottom
                this.select(pos);
            }
        }
    }
})
