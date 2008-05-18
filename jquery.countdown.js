/*
  jQuery countdown - 0.1a
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com>
  http://haineault.com   

  MIT License (http://www.opensource.org/licenses/mit-license.php)
*/

(function() {
    var date    = null;
    var remain  = null;
    var el      = null;
    var days    = 0;
    var hours   = 0;
    var mins    = 0;
    var secs    = 0;
    var format  = '%d day(s), %hh %mm %ss';
    var now     = 'Now !'

    function startCount() {
        el   = this;
        date = new Date(arguments[0], arguments[1]-1, arguments[2], arguments[3], arguments[4], arguments[5]);
        if (arguments[6]) format = arguments[6]
        if (arguments[7]) now    = arguments[7]
        setInterval(updateCount, 1000);
    }

    function updateCount() {
        remain = Math.floor((date.getTime() - (new Date()).getTime())/1000);
        if(remain < 0) return $(el).html(now);

        days   = Math.floor(remain/86400);//days
        remain = remain%86400;
        hours  = Math.floor(remain/3600);//hours
        remain = remain%3600;
        mins   = Math.floor(remain/60);//minutes
        remain = remain%60;
        secs   = Math.floor(remain);//seconds
        
        $(el).text(format.replace('%d', days).replace('%h', hours).replace('%m', mins).replace('%s', secs));
    }

    jQuery.fn.extend({
        countdown: function() {
            args = arguments;
            this.each(function() { startCount.apply(this, args); });
        }
    });
})();
