/*
  jQuery countdown - 0.2
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com>
  http://haineault.com   

  MIT License (http://www.opensource.org/licenses/mit-license.php)
  
*/

(function($) {
    function countdown(el, options) {
        var calc = function (target, current) {
            /* Return true if the target date has arrived,
             * an object of the time left otherwise.
             */
            var current = current || new Date();
            if (current >= target) { return true; }

            var o = {};
            var remain = Math.floor((target.getTime() - current.getTime()) / 1000);

            o.days = Math.floor(remain / 86400);
            remain %= 86400;
            o.hours = Math.floor(remain / 3600);
            remain %= 3600;
            o.minutes = Math.floor(remain / 60);
            remain %= 60;
            o.seconds = remain;
            o.years = Math.floor(o.days / 365);
            o.months = Math.floor(o.days / 30);
            o.weeks = Math.floor(o.days / 7);

            return o;
        };

        var getWeek = function(date) { 
            var onejan = new Date(date.getFullYear(),0,1);
            return Math.ceil((((date - onejan) / 86400000) + onejan.getDay())/7);
        };

        var options = $.extend({
            date: new Date(),
            modifiers: [],
            interval: 1000,
            msgFormat: '%d [day|days] %hh %mm %ss',
            msgNow: 'Now !'
        }, options);

        var tokens = {
            y: new RegExp ('\\%y(.+?)\\[(\\w+)\\|(\\w+)\\]', 'g'), // years 
            M: new RegExp ('\\%M(.+?)\\[(\\w+)\\|(\\w+)\\]', 'g'), // months 
            w: new RegExp ('\\%w(.+?)\\[(\\w+)\\|(\\w+)\\]', 'g'), // weeks
            d: new RegExp ('\\%d(.+?)\\[(\\w+)\\|(\\w+)\\]', 'g'), // days
            h: new RegExp ('\\%h(.+?)\\[(\\w+)\\|(\\w+)\\]', 'g'), // hours
            m: new RegExp ('\\%m(.+?)\\[(\\w+)\\|(\\w+)\\]', 'g'), // minutes
            s: new RegExp ('\\%s(.+?)\\[(\\w+)\\|(\\w+)\\]', 'g')  // seconds
        };

        var formatToken = function(str, token, val) {
            return (!tokens[token])? '': str.match(/\[|\]/g) 
                    && (str.replace(tokens[token], val+'$1'+ ((parseInt(val, 10)<2)?'$2':'$3')) || '')
                    || str.replace('%'+token, val);
        };

        var format = function(str, obj) {
            var o = str;
            o = formatToken(o, 'y', obj.years);
            o = formatToken(o, 'M', obj.months);
            o = formatToken(o, 'w', obj.weeks);
            o = formatToken(o, 'd', obj.days);
            o = formatToken(o, 'h', obj.hours);
            o = formatToken(o, 'm', obj.minutes);
            o = formatToken(o, 's', obj.seconds);
            return o;
        };

        var update = function() {
            var date_obj = calc(cd.date);
            if (date_obj === true) {
                cd.stop(); clearInterval(cd.id);
                $(cd.el).html(options.msgNow);
                return true;
            }
            else {
                $(cd.el).text(format(options.msgFormat, date_obj));
            }
        };

        var apply_modifiers = function (modifiers, date) {
            if (modifiers.length === 0) {
                return date;
            }

            var modifier_re = /^([+-]\d+)([yMdhms])$/;
            var conversions = {
                s: 1000,
                m: 60 * 1000,
                h: 60 * 60 * 1000,
                d: 24 * 60 * 60 * 1000,
                M: 30 * 24 * 60 * 60 * 1000,
                y: 365 * 24 * 60 * 60 * 1000
            };

            var displacement = 0;
            for (var i = 0, n = modifiers.length; i < n; ++i) {
                var match = modifiers[i].match(modifier_re);
                if (match !== null) {
                    displacement += parseInt(match[1], 10) * conversions[match[2]];
                }
            }
            return new Date(date.getTime() + displacement);
        };

        var cd = {
            id    : setInterval(update, options.interval),
            el    : el,
            start : function(){ return new countdown($(this.el), options); },
            stop  : function(){ return clearInterval(this.id); },
            date  : apply_modifiers(options.modifiers, options.date)
        };
        $(el).data('countdown', cd);
        update();
        return $(el).data('countdown');
    }
    $.fn.countdown = function(args) { if(this.get(0)) return new countdown(this.get(0), args); };
})(jQuery);
