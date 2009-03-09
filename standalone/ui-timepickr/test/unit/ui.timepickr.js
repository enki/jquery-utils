$(function(){
    $('#main').hide().html($('<input id="timepickr-test12" type="text"><input id="timepickr-test24" type="text">'));
    
    var tp12 = $('#timepickr-test12').timepickr({
        convention:12, 
        seconds: true, 
        format12: '{h:02.d}:{m:02.d}:{s:02.d} {suffix:s}'
    }).focus();
    var ds12 = tp12.next();

    var tp24 = $('#timepickr-test24').timepickr('destroy').timepickr({
        convention:24, 
        seconds: true, 
        format24: '{h:02.d}:{m:02.d}:{s:02.d}'
    }).focus();
    var ds24 = tp24.next();

    var to = function(){ // incremental delay
        this._to = this._to && this._to +10 || 50;
        return this._to;
    };

    module('ui.timepickr.js');
    test('12h: Picker inputs', function(){
        expect(23); stop();
        tp12.focus();

        // Hours
        setTimeout(function(){
            var range = $.range(0,12);
            for (var i in range) {
                var time = $.format('{0:02.d}:00:00 am', (range[i] + 1));
                var msg  = $.format('span.ui-dropslide > ol:eq(0) li:eq({0:d}):hover', i);
                ds12.find('ol:eq(0) li:eq('+ range[i] +')').mouseover();
                equals(tp12.val(), time, msg);
            }
        }, to());
        
        // Minutes
        setTimeout(function(){
            var range = $.ui.timepickr.defaults.rangeMin;
            ds12.find('ol:eq(0) li:first').mouseover();
            for (var i in range) {
                var time = $.format('01:{0:02.d}:00 am', range[i]);
                var msg  = $.format('span.ui-dropslide > ol:eq(1) li:eq({0:d}):hover', i);
                ds12.find('ol:eq(1) li:eq('+ i +')').mouseover();
                equals(tp12.val(), time, msg);
            }
        }, to());
        
        // Seconds 
        setTimeout(function(){
            var range = $.ui.timepickr.defaults.rangeMin;
            ds12.find('ol:eq(0) li:first').mouseover();
            ds12.find('ol:eq(1) li:first').mouseover();
            for (var i in range) {
                var time = $.format('01:00:{0:02.d} am', range[i]);
                var msg  = $.format('span.ui-dropslide > ol:eq(1) li:eq({0:d}):hover', i);
                ds12.find('ol:eq(2) li:eq('+ i +')').mouseover();
                equals(tp12.val(), time, msg);
            }
        }, to());
        
        // apm/pm 
        setTimeout(function(){
            var range = $.ui.timepickr.defaults.suffix;
            ds12.find('ol:eq(0) li:first').mouseover();
            ds12.find('ol:eq(1) li:first').mouseover();
            ds12.find('ol:eq(2) li:first').mouseover();
            for (var i in range) {
                var time = $.format('01:00:00 {0:s}', range[i]);
                var msg  = $.format('span.ui-dropslide > ol:eq(1) li:eq({0:d}):hover', i);
                ds12.find('ol:eq(3) li:eq('+ i +')').mouseover();
                equals(tp12.val(), time, msg);
            }
        }, to());

        setTimeout(function(){
            equals(tp12.val(), '01:00:00 pm', 'value stick after blur');
            start();
            tp12.blur();
        }, to());

    });
    /*

    test('24h: Picker inputs', function(){
        expect(35); stop();
        tp24.focus();

        // apm / pm
        setTimeout(function(){
            var range = $.ui.timepickr.defaults.prefix;
            for (var i in range) {
                var time = '00:00:00';
                var msg  = $.format('span.ui-dropslide > ol:eq(0) li:eq({0:d}):hover', i);
                ds24.find('ol:eq(0) li:eq('+ i +')').mouseover();
                equals(tp24.val(), time, msg);
            }
        }, to());

        // Hours
        setTimeout(function(){
            var range = $.range(0,24);
            for (var i in range) {
                var time = $.format('{0:02.d}:00:00', range[i]);
                var msg  = $.format('span.ui-dropslide > ol:eq(1) li:eq({0:d}):hover', i);
                ds24.find('ol:eq(1) li:eq('+ range[i] +')').mouseover();
                equals(tp24.val(), time, msg);
            }
        }, to());

        // Minutes
        setTimeout(function(){
            var range = $.ui.timepickr.defaults.rangeMin;
            ds24.find('ol:eq(0) li:first').mouseover();
            ds24.find('ol:eq(1) li:first').mouseover();
            for (var i in range) {
                var time = $.format('00:{0:02.d}:00', range[i]);
                var msg  = $.format('span.ui-dropslide > ol:eq(2) li:eq({0:d}):hover', i);
                ds24.find('ol:eq(2) li:eq('+ i +')').mouseover();
                equals(tp24.val(), time, msg);
            }
        }, to());

        // Seconds 
        setTimeout(function(){
            var range = $.ui.timepickr.defaults.rangeMin;
            ds24.find('ol:eq(0) li:first').mouseover();
            ds24.find('ol:eq(1) li:first').mouseover();
            ds24.find('ol:eq(2) li:first').mouseover();
            for (var i in range) {
                var time = $.format('00:00:{0:02.d}', range[i]);
                var msg  = $.format('span.ui-dropslide > ol:eq(3) li:eq({0:d}):hover', i);
                ds24.find('ol:eq(3) li:eq('+ i +')').mouseover();
                equals(tp24.val(), time, msg);
            }
        }, to());
        
        setTimeout(function(){
            equals(tp24.val(), '00:00:45', 'value stick after blur');
            start();
            tp24.blur();
            start();
        }, to());

    });
    */
});
