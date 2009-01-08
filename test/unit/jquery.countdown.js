$(function(){
    for (var x=1;x<7;x++) { $('<span id="countdown'+x+'"></span>').appendTo('#fixtures'); }
    module('jquery.countdown.js');

    test('Countdown tests', function() {
        var d = new Date();
        // begin tests
        expect(6);
        $('#countdown1').countdown({msgFormat: '%d days', date: new Date(d.getTime() + 36 * 60 * 60 * 1000)});
        equals($('#countdown1').text(), '1 days', 'Basic countdown');
        $('#countdown1').data('countdown').stop();

        $('#countdown2').countdown({msgFormat: '%d [day|days]', date: new Date(d.getTime() + 36 * 60 * 60 * 1000)});
        equals($('#countdown2').text(), '1 day', 'Plural handling');
        $('#countdown2').data('countdown').stop();

        $('#countdown3').countdown({msgNow: 'Now!'});
        equals($('#countdown3').text(), 'Now!', 'Custom now message');
        $('#countdown3').data('countdown').stop();

        /* 1 minute added to all modifiers to avoid race condition */
        $('#countdown4').countdown({msgFormat: '%d', modifiers: ['+1y', '+1m']});
        equals($('#countdown4').show().text(), '365', 'Modifiers (year)');
        $('#countdown4').data('countdown').stop();

        $('#countdown5').countdown({msgFormat: '%M', modifiers: ['+2M', '+1m']});
        equals($('#countdown5').text(), '2', 'Modifiers (month)');
        $('#countdown5').data('countdown').stop();

       $('#countdown6').countdown({msgFormat: '%d', modifiers: ['+1d', '+1m']});
       equals($('#countdown6').text(), '1', 'Modifier (day)');
    });
});
