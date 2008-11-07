$(function(){
    $('#fixtures').show();
    $('#fixtures').html($('<input id="timepickr-test" type="text">'));

    var tp = $('#timepickr-test').timepickr({
        convention:12, 
        seconds: true, 
        format12: '{h:02.d}:{m:02.d}:{s:02.d} {suffix:s}'
    }).focus();
    var ds = tp.next();
    var to = function(){ // incremental delay
        this._to = this._to && this._to +10 || 50;
        return this._to;
    };

    test('12h: Picker inputs', function(){
        expect(23); stop();

        tp.focus();
        // Hours
        setTimeout(function(){
            var range = $.range(0,12);
            for (var i in range) {
                console.log(i);
                var time = $.format('{0:02.d}:00:00 am', (range[i] + 1));
                var msg  = $.format('span.ui-dropslide > ol:eq(0) li:eq({0:d}):hover', i);
                ds.find('ol:eq(0) li:eq('+ range[i] +')').mouseover();
                equals(tp.val(), time, msg);
            }
        }, to());
        
        // Minutes
        setTimeout(function(){
            var range = $.ui.timepickr.defaults.rangeMin;
            ds.find('ol:eq(0) li:first').mouseover();
            for (var i in range) {
                var time = $.format('01:{0:02.d}:00 am', range[i]);
                var msg  = $.format('span.ui-dropslide > ol:eq(1) li:eq({0:d}):hover', i);
                ds.find('ol:eq(1) li:eq('+ i +')').mouseover();
                equals(tp.val(), time, msg);
            }
        }, to());
        
        // Seconds 
        setTimeout(function(){
            var range = $.ui.timepickr.defaults.rangeMin;
            ds.find('ol:eq(0) li:first').mouseover();
            ds.find('ol:eq(1) li:first').mouseover();
            for (var i in range) {
                var time = $.format('01:00:{0:02.d} am', range[i]);
                var msg  = $.format('span.ui-dropslide > ol:eq(1) li:eq({0:d}):hover', i);
                ds.find('ol:eq(2) li:eq('+ i +')').mouseover();
                equals(tp.val(), time, msg);
            }
        }, to());
        
        // apm/pm 
        setTimeout(function(){
            var range = $.ui.timepickr.defaults.suffix;
            ds.find('ol:eq(0) li:first').mouseover();
            ds.find('ol:eq(1) li:first').mouseover();
            ds.find('ol:eq(2) li:first').mouseover();
            for (var i in range) {
                var time = $.format('01:00:00 {0:s}', range[i]);
                var msg  = $.format('span.ui-dropslide > ol:eq(1) li:eq({0:d}):hover', i);
                ds.find('ol:eq(3) li:eq('+ i +')').mouseover();
                equals(tp.val(), time, msg);
            }
        }, to());

        setTimeout(function(){
            equals(tp.val(), '01:00:00 pm', 'value stick after blur');
            start();
            tp.blur();
        }, to());

    });

    test('12h: Picker behaviour', function(){
        expect(6); stop();
        var m  = '';

        m = 'ol.ui-dropslide > ol:first is hidden before input:focus';
        ok(ds.find('ol:first').is(':hidden'),  m);
        
        tp.focus();
        setTimeout(function(){
            m = 'input:focus shows up hours picker';
            ok(ds.find('ol:eq(0), ol:eq(0) li').is(':visible'), m);
            console.log(tp.val());
            ds.find('ol:eq(0) li:first').mouseover();
        }, to());

        setTimeout(function(){
            m = 'ol.ui-dropslide > ol:eq(0) li:first:hover shows up minutes picker';
            ok(ds.find('ol:eq(1), ol:eq(0) li').is(':visible'), m);
            console.log(tp.val());
            ds.find('ol:eq(1) li:eq(3)').mouseover();
        }, to());

        setTimeout(function(){
            m = 'ol.ui-dropslide > ol:eq(2) li:first:hover shows up seconds picker';
            ok(ds.find('ol:eq(2), ol:eq(2) li').is(':visible'), m);
            console.log(tp.val());
            ds.find('ol:eq(2) li:first').mouseover();
        }, to());

        setTimeout(function(){
            m = 'ol.ui-dropslide > ol:eq(3) li:first:hover shows up am/pm picker';
            ok(ds.find('ol:eq(3), ol:eq(3) li').is(':visible'), m);
            console.log(tp.val());
            tp.blur();
        }, to());

        setTimeout(function(){
            m = 'ol.ui-dropslide > ol is hidden after input:blur';
            ok(ds.find('ol').is(':visible'), m);
            start();
        }, to());

    });

    /*
    test('24h: Hour appear on focus', function(){
        expect(1);
        var tp = $('#timepickr-test');
        var ds = tp.next();
        tp.timepickr({convention:24}).focus();
        ok(ds.eq(0).is(':hidden'), 'ol.ui-dropslide > ol:first is hidden before focus');
        tp.focus();
        ok(ds.eq(0).is(':visible'), 'ol.ui-dropslide > ol:first is visible after focus');
        tp.blur().timepickr('destroy');

    });
   /* 
    test('Basic behavioural tests (12h mode)', function() {
        expect(6);
        stop();
        var tp = $('#timepickr-test-12');
        var ds = tp.next();

        // focus
        tp.focus();
        setTimeout(function(){
            ok(ds.find('ol:eq(0)').is(':visible'), 'prefix pickr appear with trigger');
            tp.blur();
        }, 100);

        tp.focus();
        setTimeout(function(){
            console.log(ds.find('ol:eq(0)').get(0));
            ok(ds.find('ol:eq(0)').is(':visible'), 'Hour appear on focus');
            ds.find('ol:eq(0) li').mouseover();
            setTimeout(function(){
                ok(ds.find('ol:eq(1)').is(':visible'), 'Minute pickr appear on hour mouseover');
                ds.find('ol:eq(1) li').mouseover();
                setTimeout(function(){
                    ok(ds.find('ol:eq(2)').is(':visible'), 'Seconds pickr appear on minute mouseover');
                    ds.find('ol:eq(2) li').mouseover();
                    setTimeout(function(){
                        ok(ds.find('ol:eq(3)').is(':visible'), 'suffix pickr appear on seconds mouseover');
                        setTimeout(function(){
                            ok(ds.find('ol').not(':visible'), 'Pickrs are hidden on blur');
                            start();
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        }, 500);
    });
    test('Basic behavioural tests (24h mode)', function() {
        expect(6);
        stop();
        var tp = $('#timepickr-test-24');
        var ds = tp.next();

        // focus
        tp.focus();
        setTimeout(function(){
            ok(ds.find('ol:eq(0)').is(':visible'), 'prefix pickr appear with trigger');
            tp.blur();
        }, 100);

        tp.focus();
        setTimeout(function(){
            ok(ds.find('ol:eq(0)').is(':visible'), 'Prefix appear on focus');
            ds.find('ol:eq(0) li').mouseover();
            setTimeout(function(){
                ok(ds.find('ol:eq(1)').is(':visible'), 'Hour pickr appear on prefix mouseover');
                ds.find('ol:eq(1) li').mouseover();
                setTimeout(function(){
                    ok(ds.find('ol:eq(2)').is(':visible'), 'Minute pickr appear on hour mouseover');
                    ds.find('ol:eq(2) li').mouseover();
                    setTimeout(function(){
                        ok(ds.find('ol:eq(3)').is(':visible'), 'Second pickr appear on minute mouseover');
                        tp.blur();
                        setTimeout(function(){
                            ok(ds.find('ol').not(':visible'), 'Pickrs are hidden on blur');
                            start();
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        }, 100);
    });

*/
});
