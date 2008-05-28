$(document).ready(function(){
    module('jquery.anchorHandler.js');
    test('onclick event handling', function() {
         $('#fixtures')
            .append($('<a id="test-1" href="#test">test</a>'))
            .append($('<span id="test-results">false</a>'));

        $.anchorHandler.add(/#test/, function(){ $('#test-results').text('true'); }, true);

        expect(2);
        equals($('#test-results').text(), 'false', 'test');
        $('#test-1').trigger('click');
        equals($('#test-results').text(), 'true', 'test');
    });
    $('#fixtures').html('');
});
