$(function(){
    module('jquery.utils.js');

    test('jQuery utils core tests', function() {
        expect(33);
        
        // jquery.utils integrity check
        ok(typeof $.ui             == 'object',   'jQuery UI is defined')
        ok(typeof $.isRegExp       == 'function', 'jQuery isRegExp is defined')
        ok(typeof $.isArray        == 'function', 'jQuery isArray is defined')
        ok(typeof $.toCurrency     == 'function', 'jQuery toCurrency is defined')
        ok(typeof $.fn.selectRange == 'function', 'jQuery.fn selectRange is defined')
        ok(typeof $.fn.mousewheel  == 'function', 'jQuery.fn mousewheel is defined')

        // isRegExp
        ok(!$.isRegExp(''),    '"" !isRegExp');
        ok(!$.isRegExp('a'),   'a !isRegExp');
        ok(!$.isRegExp(1),     '1 !isRegExp');
        ok(!$.isRegExp(null),  'null !isRegExp');
        ok(!$.isRegExp(true),  'true !isRegExp');
        ok(!$.isRegExp(false), 'false !isRegExp');
        ok($.isRegExp(/a/),  '/a/ isRegExp');
        ok($.isRegExp((new RegExp("\\d+"))), 'new RegExp("\\d+") isRegExp');

        // isArray
        ok(!$.isArray(''),    '"" !isArray');
        ok(!$.isArray('a'),   'a !isArray');
        ok(!$.isArray(1),     '1 !isArray');
        ok(!$.isArray(null),  'null !isArray');
        ok(!$.isArray(true),  'true !isArray');
        ok(!$.isArray(false), 'false !isArray');
        ok($.isArray([]),  '[] isArray');
        ok($.isArray((new Array())), 'new Array() isArray');

        // toCurrency
        ok($.toCurrency(''),       '"" -> 0.00');
        ok($.toCurrency(null),     'null -> 0.00');
        ok($.toCurrency(true),     'true -> 0.00');
        ok($.toCurrency(false),    'false -> 0.00');
        ok($.toCurrency('-1'),     '-1 -> -1.00');
        ok($.toCurrency('0'),      '0 -> 0.00');
        ok($.toCurrency('.'),      '. -> 0.00');
        ok($.toCurrency('1.234'),  '1.234 -> 1.23');
        ok($.toCurrency('123.45'), '123.45 -> 123.45');
        
        // selectRange
        $('body').append($('<textarea id="select-range">abcdefg</textarea>')
            .css({position:'absolute',top:-1000, left:-1000})); // wont work on hidden elements
        $('#select-range').selectRange(0, 3);
        // Gotta love IE
        if( document.selection ){
            var range = document.selection.createRange();
            var stored_range = range.duplicate();
            stored_range.moveToElementText($('#select-range').get(0));
            stored_range.setEndPoint( 'EndToEnd', range );
            $('#select-range').get(0).selectionStart = stored_range.text.length - range.text.length;
            $('#select-range').get(0).selectionEnd = $('#select-range').get(0).selectionStart + range.text.length;
        }

        ok($('#select-range').get(0).selectionStart == 0, 'Range start == 0');
        ok($('#select-range').get(0).selectionEnd   == 3, 'Range end === 3');
        $('#select-range').remove();
    });

    test('jQuery utils plugin tests', function() {
        expect(13);
        // base plugins integrity check     
        ok(typeof jQuery.anchorHandler      == 'object',   'jQuery.anchorHandler is defined')
        ok(typeof jQuery.cookie             == 'function', 'jQuery.cookie is defined')
        ok(typeof jQuery.fn.countdown       == 'function', 'jQuery.fn.countdown is defined')
        ok(typeof jQuery.fn.cycle           == 'function', 'jQuery.fn.cycle is defined')
        ok(typeof jQuery.fn.delayedObserver == 'function', 'jQuery.fn.delayedObserver is defined')
        ok(typeof jQuery.ifixpng            == 'function', 'jQuery.ifixpng is defined')
        ok(typeof jQuery.format             == 'function', 'jQuery.format is defined')
        ok(typeof jQuery.calc               == 'function', 'jQuery.calc is defined')
        ok(typeof jQuery.repeat             == 'function', 'jQuery.repeat is defined')
        ok(typeof jQuery.UTF8encode         == 'function', 'jQuery.UTF8encode is defined')
        ok(typeof jQuery.UTF8decode         == 'function', 'jQuery.UTF8decode is defined')
        ok(typeof jQuery.strConversion      == 'object',   'jQuery.strConversion is defined')
        ok(typeof jQuery.fn.youtubeLinksToEmbed == 'function', 'jQuery.fn.youtubeLinksToEmbed is defined')
    });

    $('#fixtures').html('');
});
