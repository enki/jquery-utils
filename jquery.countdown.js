/*
  jQuery countdown - 0.1
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com>
  http://haineault.com   

  MIT License (http://www.opensource.org/licenses/mit-license.php)
  
  Todo
  ====
  - functional argument (ex: {year:+1})
  - unit tests (?)
  - pause/start method
  - clear interval when now
  - optimize regexp
*/

(function() {

    function countdown(el, args) {
        var now = new Date();
        var cd  = {
            remain: null, el: el, days: 0, hours: 0, mins: 0, secs: 0,
            format: args.format || '%d [day|days] %hh %mm %ss',  
            now: 'Now !',
            date: new Date(
                args.year || now.getFullYear(), 
                args.month && args.month || now.getMonth()-1, 
                args.day  || now.getDay(), 
                args.hour || 23, 
                args.min  || 59, 
                args.sec  || 59)
        };
        var formatToken = function(str, token, val) {
            if (!str) { return ''; }
            else {
                if (!str.match(/\[|\]/g)) { return str.replace('%'+token, val); }
                else {
                    var r = new RegExp ('\\%'+token+'(\\s+|\\w+)\\[(\\w+)\\|(\\w+)\\]', 'ig');
                    return str.replace(r, val+'$1'+ ((parseInt(val, 10)<2)?'$2':'$3'));
                }
            }
        };

        var update = function() {
            cd.remain = Math.floor((cd.date.getTime() - (new Date()).getTime())/1000);
            if(cd.remain < 0) return $(el).html(cd.now);
            cd.days   = Math.floor(cd.remain/86400);//days
            cd.remain = cd.remain%86400;
            cd.hours  = Math.floor(cd.remain/3600)-1; //hours
            cd.remain = cd.remain%3600;
            cd.mins   = Math.floor(cd.remain/60);   //minutes
            cd.remain = cd.remain%60;
            cd.secs   = Math.floor(cd.remain);      //seconds
            
            var o = cd.format;
            o = formatToken(o, 'd', cd.days);
            o = formatToken(o, 'h', cd.hours);
            o = formatToken(o, 'm', cd.mins);
            o = formatToken(o, 's', cd.secs);
            $(cd.el).text(o);
        };

        update();
        setInterval(update, 1000);
    }

    jQuery.fn.extend({
        countdown: function(args) { this.each(function() { new countdown(this, args); }); }
    });
})();
