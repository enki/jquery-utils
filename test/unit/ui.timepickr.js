$(function(){
    $('#fixtures').show();
    $('<input id="timepickr-test-1" type="text">').appendTo('#fixtures');
    $('<img src="data/clock.png" alt="Time" border="0" style="position:absolute;margin:4px 0 0 6px;" id="timetriggr-test-1" />').appendTo('#fixtures');

    module('ui.timepickr.js');
    test('Basic behavioural tests', function() {
        expect(6);
        stop();
        // Initial value
        $('#timepickr-test-1').show().timepickr({val: '3:33' });
        equals($('#timepickr-test-1').val(), '3:33', 'Initial value');
        

        // Custom trigger
        $('#timetriggr-test-1').click();
        setTimeout(function(){
            ok($('#timepickr-test-1 + div').find('ol:eq(0)').is(':visible'), 'Hour pickr appear with trigger');
            $('#timepickr-test-1').blur();
        }, 100);

        // Focus
        $('#timepickr-test-1').focus();
        setTimeout(function(){
            // Hour mouseover
            ok($('#timepickr-test-1 + div').find('ol:eq(0)').is(':visible'), 'Hour pickr appear on focus');
            $('#timepickr-test-1 + div').find('ol:eq(0) li').mouseover();
            setTimeout(function(){
                // Minute mouseover
                ok($('#timepickr-test-1 + div').find('ol:eq(1)').is(':visible'), 'Minute pickr appear on hour mouseover');
                $('#timepickr-test-1 + div').find('ol:eq(1) li').mouseover();
                setTimeout(function(){
                    ok($('#timepickr-test-1 + div').find('ol:eq(2)').is(':visible'), 'am/pm pickr appear on minute mouseover');
                    $('#timepickr-test-1').blur();
                    setTimeout(function(){
                        ok($('#timepickr-test-1 + div').find('ol').not(':visible'), 'Pickrs are hidden on blur');
                        start();
                    }, 100);
                }, 100);
            }, 100);
        }, 100);
    });
});
