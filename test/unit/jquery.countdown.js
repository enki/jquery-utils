if (typeof(isRhino)=='undefined') { // Automated test suite doesn't like timers :/

module('jquery.countdown.js');
test('Countdown tests', function() {
    var d = new Date();
    // begin tests
    expect(5);
    $('#countdown1').countdown({msgFormat: '%d days', year: d.getFullYear(), month: d.getMonth(), day: d.getDate()+2, hour:1,min:1,sec:1 });
    equals($('#countdown1').text(), '1 days', 'Basic countdown');
    $('#countdown1').data('countdown').stop();

    $('#countdown2').countdown({msgFormat: '%d [day|days]', year: d.getFullYear(), month: d.getMonth(), day: d.getDate()+2, hour:1,min:1,sec:1 });
    equals($('#countdown2').text(), '1 day', 'Plurarl handling');
    $('#countdown2').data('countdown').stop();

    $('#countdown3').countdown({msgNow: 'Now!', year: d.getFullYear(), month: d.getMonth(), day: d.getDate(), hour:d.getHours(),min:d.getMinutes(),sec:d.getSeconds() });
    equals($('#countdown3').text(), 'Now!', 'Custom now message');
    $('#countdown3').data('countdown').stop();

    $('#countdown4').countdown({msgFormat: '%d', year: '+1' });
    equals($('#countdown4').text(), '364', 'Functional argument (year)');
    $('#countdown4').data('countdown').stop();

    $('#countdown5').countdown({msgFormat: '%M', month: '+1' });
    equals($('#countdown5').text(), '2', 'Functional argument (month)');
    $('#countdown5').data('countdown').stop();
    // $('#countdown-5').countdown({msgFormat: '%d', day: '+1' });
    // equals($('#countdown-5').text(), '1', 'Functional argument (day)');
    // $('#fixtures').html('');
});
}
