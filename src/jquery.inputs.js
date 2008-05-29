(function() {
    var keycodes = [];
    keycodes[37] = 'left';
    keycodes[38] = 'top';
    keycodes[39] = 'right';
    keycodes[40] = 'bottom';
    
	var keynav = {
	    int: function (e) { 
	    	buf = parseInt($(this).val(), 10);
	        switch (keycodes[e.keyCode]) {
	            case 'left':   buf = buf - (e.shiftKey ? 10 : 1); break;
	            case 'top':    buf = buf + (e.shiftKey ? 10 : 1); break;
	            case 'right':  buf = buf + (e.shiftKey ? 10 : 1); break;
	            case 'bottom': buf = buf - (e.shiftKey ? 10 : 1); break;
	        }
	    	$(this).val(buf);
	   	},
	    float: function (e) { 
	    	dot = $(this).val().match(/\d+(\.)$/);
	    	dot = (dot) ? dot[1] : '' ;
	    	buf = parseFloat($(this).val(), 10);
	        switch (keycodes[e.keyCode]) {
	            case 'left':   buf = buf - 0.5; break;
	            case 'top':    buf = buf + (e.shiftKey ? 10 : 1); break;
	            case 'right':  buf = buf + 0.5; break;
	            case 'bottom': buf = buf - (e.shiftKey ? 10 : 1); break;
	        }
	    	$(this).val(buf+dot);
	    },
	    datetime: function (e) { console.log(this); },
	    date: function (e) { console.log(this); },
	    day: function (e) {
	    	buf = parseInt($(this).val(), 10);
	        switch (keycodes[e.keyCode]) {
	            case 'left':   buf = buf - (e.shiftKey ? 10 : 1); break;
	            case 'top':    buf = buf + (e.shiftKey ? 10 : 1); break;
	            case 'right':  buf = buf + (e.shiftKey ? 10 : 1); break;
	            case 'bottom': buf = buf - (e.shiftKey ? 10 : 1); break;
	        }
	        if (buf < 0)  buf = '31';
	        if (buf > 31) buf = '0';
	    	$(this).val(buf);
	    },
	    month: function (e) {
	    	buf = parseInt($(this).val(), 10);
	        switch (keycodes[e.keyCode]) {
	            case 'left':   buf = buf - (e.shiftKey ? 10 : 1); break;
	            case 'top':    buf = buf + (e.shiftKey ? 10 : 1); break;
	            case 'right':  buf = buf + (e.shiftKey ? 10 : 1); break;
	            case 'bottom': buf = buf - (e.shiftKey ? 10 : 1); break;
	        }
	        if (buf < 0)  buf = '12';
	        if (buf > 12) buf = '01';
	    	$(this).val(buf);
	    },
	    time: function (e) { 
            buf    = $(this).val().split(':');
            buf[0] = parseInt(buf[0], 10);
            buf[1] = parseInt(buf[1], 10);
	        switch (keycodes[e.keyCode]) {
	            case 'left':   buf[0] = buf[0] - (e.shiftKey ? 10 : 1); break;
	            case 'top':    buf[1] = buf[1] + (e.shiftKey ? 10 : 1); break;
	            case 'right':  buf[0] = buf[0] + (e.shiftKey ? 10 : 1); break;
	            case 'bottom': buf[1] = buf[1] - (e.shiftKey ? 10 : 1); break;
	        }
	        if (buf[1] > 59) buf[1] = '0';
	        if (buf[1] < 0)  buf[1] = '59';
	        if (buf[0] > 23) buf[0] = '0';
	        if (buf[0] < 0)  buf[0] = '23';
	        if (buf[0] < 10) buf[0] = '0'+ buf[0];
	        if (buf[1] < 10) buf[1] = '0'+ buf[1];
	        $(this).val(buf.join(':'));
	    },
	    hour12: function (e) {
	    	buf = parseInt($(this).val(), 10);
	        switch (keycodes[e.keyCode]) {
	            case 'left':   buf = buf - (e.shiftKey ? 10 : 1); break;
	            case 'top':    buf = buf + (e.shiftKey ? 10 : 1); break;
	            case 'right':  buf = buf + (e.shiftKey ? 10 : 1); break;
	            case 'bottom': buf = buf - (e.shiftKey ? 10 : 1); break;
	        }
	        if (buf < 0)  buf = '11';
	        if (buf > 11) buf = '00';
	    	$(this).val(buf);
	    },
	    hour24: function (e) {
	    	buf = parseInt($(this).val(), 10);
	        switch (keycodes[e.keyCode]) {
	            case 'left':   buf = buf - (e.shiftKey ? 10 : 1); break;
	            case 'top':    buf = buf + (e.shiftKey ? 10 : 1); break;
	            case 'right':  buf = buf + (e.shiftKey ? 10 : 1); break;
	            case 'bottom': buf = buf - (e.shiftKey ? 10 : 1); break;
	        }
	        if (buf < 0)  buf = '23';
	        if (buf > 23) buf = '00';
	    	$(this).val(buf);
	    },
	    minute: function (e) { 
	    	buf = parseInt($(this).val(), 10);
	        switch (keycodes[e.keyCode]) {
	            case 'left':   buf = buf - (e.shiftKey ? 10 : 1); break;
	            case 'top':    buf = buf + (e.shiftKey ? 10 : 1); break;
	            case 'right':  buf = buf + (e.shiftKey ? 10 : 1); break;
	            case 'bottom': buf = buf - (e.shiftKey ? 10 : 1); break;
	        }
	        if (buf < 0)  buf = '59';
	        if (buf > 59) buf = '00';
	    	$(this).val(buf);	    	
	    },
	    second: function (e) { keynav.minute.apply(this, [e]); }
	}
	var loadkeynav = function(el, options) {
		el   = $(el);
		id   = el.attr('id');
		val  = el.val()
		type = $(el).attr('class').match(/int|float|datetime|date|month|day|time|hour\d{2}|minute|second/i);
		if ($().delayedObserver) $(el).keyup(keynav[type]);
		else                      $(el).delayedObserver(keynav[type]);
	}
	
	jQuery.fn.extend({
		keynav: function(options){
    		this.each(function(idx) {
    			loadkeynav($(this), options);
    		});

		}
	});
})();