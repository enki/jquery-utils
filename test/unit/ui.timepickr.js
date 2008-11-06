$(function(){
    $('#fixtures').show();
    $('<input id="timepickr-test" type="text">').appendTo('#fixtures');
    $('<img src="data/clock.png" alt="Time" border="0" style="position:absolute;margin:4px 0 0 6px;" id="timetriggr-test-1" />').appendTo('#fixtures');

    var tp = $('#timepickr-test');
    module('ui.timepickr.js');
    
    var sequentialTests = function() {
        var suite     = this;
        suite.timeout = 150;
        suite.locked  = false;
        suite.tests   = [];

        suite.test = function() { // [testFunction]
            if (arguments[0]) {
                suite.tests.push({callback: arguments[0], expect: arguments[1] || 0})
            }
            return suite;
        };

        suite.pass = function(message) {
            if (message) {
                console.info('Test passed: %s', message);
            }
            suite.locked = false;
        };
        
        suite.fail = function(message) {
            if (message) {
                console.error('Test failed: %s', message);
            }
            suite.locked = false;
        };

        suite.run = function() {
            /*
            test('', function() {
                stop();
                expect(suite.expect);
            });
            */
            // just to be sure that start is
            // executed at the very end.
            suite.tests.push({expect:0, callback: function(){ 
                start();
                this.pass(); }});

            var execute = function(idx, t) {
                if (!suite.locked) {
                    suite.locked = true;
                    t.callback.apply(suite);
                }
                else {
                    setTimeout(function(){
                        execute.apply(this, [idx, t]);
                    }, suite.timeout);
                }
            };

            $.each(tests, execute);
            return suite;
        };
        
        return suite;
    };

    sequentialTests('Focus test (activaion)')
        .test(function(){
            var suite = this;
            /*
            tp.timepickr({format: 12})
              .one('focus', function(e, ui){
                setTimeout(function(){
                    ok(tp.next().find('ol:first').is(':visible'), '12h mode: apm/pm shows up upon focus');
                    tp.timepickr('destroy');
                }, 100);
            }).timepickr('activate');
            */
            setTimeout(function(){
            suite.pass('test1');
                }, 5000);
        })
        .test(function(){
            this.pass('test2');
        })
        .run();

    test('Focus test (activation)', function(){
        stop();
        expect(2);
        // 12h
        tp.timepickr({format: 12})
          .one('focus', function(e, ui){
            setTimeout(function(){
                ok(tp.next().find('ol:first').is(':visible'), '12h mode: apm/pm shows up upon focus');
                tp.timepickr('destroy');
            }, 100);
        }).timepickr('activate');

        // 24h
        setTimeout(function(){
            tp.timepickr({format: 24})
              .one('focus', function(e, ui){
                setTimeout(function(){
                    ok(tp.next().find('ol:first').is(':visible'), '24h mode: apm/pm shows up upon focus');
                    tp.timepickr('destroy');
                    start();
                }, 100);
            }).timepickr('activate');
        }, 150);
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
