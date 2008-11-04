$(function(){
    $('#fixtures').show();
    $('<input id="timepickr-test" type="text">').appendTo('#fixtures');
    $('<img src="data/clock.png" alt="Time" border="0" style="position:absolute;margin:4px 0 0 6px;" id="timetriggr-test-1" />').appendTo('#fixtures');

    var tp = $('#timepickr-test');
    module('ui.timepickr.js');

    test('Focus test (activation)', function(){
        expect(1);
        stop();
        tp.timepickr({format: 12});
        tp.one('focus', function(e, ui){
            setTimeout(function(){
                ok(tp.next().find('ol:first').is(':visible'), '12h mode: apm/pm shows up upon focus');
                start();
            }, 100);
        }).timepickr('activate');
         
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
    /*

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
