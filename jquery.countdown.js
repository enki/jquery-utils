/*
  jQuery countdown - 0.1
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com>
  http://haineault.com   

  MIT License (http://www.opensource.org/licenses/mit-license.php)
  
*/

(function($) {
    function countdown(el, options) {
        var o       = '';
        var timer   = false;
        var now     = new Date();

        var getWeek = function(date) { 
            var onejan = new Date(date.getFullYear(),0,1);
            return Math.ceil((((date - onejan) / 86400000) + onejan.getDay())/7); };

        var options = $.extend({
                year : now.getFullYear(), month: now.getMonth(), day: now.getDay(),
                week: getWeek(now), hour: now.getHours(), min: now.getMinutes(), sec: now.getSeconds(),
                msgFormat: '%d [day|days] %hh %mm %ss', msgNow: 'Now !',
                interval:  1000 }, options); 

        var tokens = {
            y: new RegExp ('\\%y(\\s+|\\w+)\\[(\\w+)\\|(\\w+)\\]', 'g'), // years 
            M: new RegExp ('\\%y(\\s+|\\w+)\\[(\\w+)\\|(\\w+)\\]', 'g'), // months 
            w: new RegExp ('\\%w(\\s+|\\w+)\\[(\\w+)\\|(\\w+)\\]', 'g'), // weeks
            d: new RegExp ('\\%d(\\s+|\\w+)\\[(\\w+)\\|(\\w+)\\]', 'g'), // days
            h: new RegExp ('\\%h(\\s+|\\w+)\\[(\\w+)\\|(\\w+)\\]', 'g'), // hours
            m: new RegExp ('\\%m(\\s+|\\w+)\\[(\\w+)\\|(\\w+)\\]', 'g'), // minutes
            s: new RegExp ('\\%s(\\s+|\\w+)\\[(\\w+)\\|(\\w+)\\]', 'g')  // seconds
        };

        var formatToken = function(str, token, val) {
            return (!tokens[token])? '': str.match(/\[|\]/g) 
                    && (str.replace(tokens[token], val+'$1'+ ((parseInt(val, 10)<2)?'$2':'$3')) || '')
                    || str.replace('%'+token, val);
        };

        var update = function() {
            cd.remain = Math.floor((cd.date.getTime() - (new Date()).getTime())/1000);
            if(cd.remain < 0) return $(cd.el).html(options.msgNow).data('countdown').stop();

            cd.days   = Math.floor(cd.remain/86400);  // days
            cd.remain = cd.remain%86400;
            cd.hours  = Math.floor(cd.remain/3600); // hours
            cd.remain = cd.remain%3600;
            cd.mins   = Math.floor(cd.remain/60);     // minutes
            cd.remain = cd.remain%60;
            cd.secs   = Math.floor(cd.remain);        // seconds
            cd.weeks  = Math.floor(cd.days/7);        // weeks 
            cd.years  = Math.floor(cd.days/365);      // years
            cd.months = Math.floor(cd.days/30);       // months, TODO: find a more precise way to calculate months

            o = options.msgFormat;
            o = formatToken(o, 'y', cd.years);
            o = formatToken(o, 'M', cd.months);
            o = formatToken(o, 'w', cd.weeks);
            o = formatToken(o, 'd', cd.days);
            o = formatToken(o, 'h', cd.hours);
            o = formatToken(o, 'm', cd.mins);
            o = formatToken(o, 's', cd.secs);

            $(cd.el).text(o);
        };
        var parse = function(type, val) {
           function calc(str, i) {
               if (str.slice(0,1) == '+') return i + parseInt(str.match(/\d+/)||0, 10)+1;
               else return i - parseInt(str.match(/\d+/)||0, 10)+1;
           }
           if (typeof(val)=='number') return val;
           else {
               switch(type) {
                   case 'year':  return calc(val, (new Date()).getFullYear());
                   case 'month': return calc(val, (new Date()).getMonth());
                   //case 'day':   return calc(val, (new Date()).getDate());
                   //case 'hour':  return calc(val, (new Date()).getHours());
                   //case 'min':   return calc(val, (new Date()).getMinutes());
                   //case 'sec':   return calc(val, (new Date()).getSeconds());
               }
           }
        };
        var cd = {
            id:     setInterval(update, options.interval), el: el,
            remain: null, el: el, days: 0, hours: 0, mins: 0, secs: 0,
            start:  function(){ return new countdown($(this.el), options); },
            stop:   function(){ return clearTimeout($(this.el).data('countdown').id)},
            date:   new Date(parse('year', options.year), parse('month', options.month), parse('day', options.day), 
                             parse('hour', options.hour), parse('min', options.min),     parse('sec', options.sec)) 
        };
        $(el).data('countdown', cd);
        return  update(), $(el).data('countdown');
    };
    $.fn.countdown = function(args) { if(this.get(0)) return new countdown(this.get(0), args); };
})(jQuery);
