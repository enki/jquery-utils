$(document).ready(function(){
    module('jquery.countdown.js');
    test('Countdown tests', function() {
        var d = new Date();
        $('#fixtures').append($('<span id="countdown-1"></span>'))
                      .append($('<span id="countdown-2"></span>'))
                      .append($('<span id="countdown-3"></span>'));
        // begin tests
        expect(3);
        $('#countdown-1').countdown({msgFormat: '%d days', year: d.getFullYear(), month: d.getMonth(), day: d.getDate()+2, hour:1,min:1,sec:1 });
        equals($('#countdown-1').text(), '1 days', 'Basic countdown');
        $('#countdown-2').countdown({msgFormat: '%d [day|days]', year: d.getFullYear(), month: d.getMonth(), day: d.getDate()+2, hour:1,min:1,sec:1 });
        equals($('#countdown-2').text(), '1 day', 'Plurarl handling');
        $('#countdown-3').countdown({msgNow: 'Now!', year: d.getFullYear(), month: d.getMonth(), day: d.getDate(), hour:d.getHours(),min:d.getMinutes(),sec:d.getSeconds() });
        equals($('#countdown-3').text(), 'Now!', 'Custom now message');

        $('#fixtures').html('');
    });
});
