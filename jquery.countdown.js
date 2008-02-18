(function() {
    var date, remain, el = null;
    var trans = " jour";

    function startCount() {
        el   = this;
        date = new Date(arguments[0], arguments[1]-1, arguments[2], arguments[3], arguments[4], arguments[5]);
        if (arguments[7] == 'en') {
            trans = " day"
        }
        setInterval(updateCount, 1000);
    }

    function updateCount() {
        var days, hours, mins, secs=0;out ='';
        remain = Math.floor((date.getTime() - (new Date()).getTime())/1000);
        if(remain < 0) return $(el).html('Now !');

        days   = Math.floor(remain/86400);//days
        remain = remain%86400;
        hours  = Math.floor(remain/3600);//hours
        remain = remain%3600;
        mins   = Math.floor(remain/60);//minutes
        remain = remain%60;
        secs   = Math.floor(remain);//seconds

        if(days != 0) {out += days + trans +((days!=1)?"s":"")+", ";}
        if(days != 0 || hours != 0) {out += hours +"h, ";}
        if(days != 0 || hours != 0 || mins != 0) {out += mins +"m, ";}
        out += secs +"s";
        $(el).text(out);
    }

    jQuery.fn.extend({
        countdown: function() {
            args = arguments;
            this.each(function() { startCount.apply(this, args); });
        }
    });
})();
