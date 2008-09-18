$(function(){
    $('<a id="anchorHandler1" href="#test">test</a>').appendTo('#fixtures');

    module('jquery.anchorHandler.js');
    test('onclick event handling', function() {
        expect(2);
        $.anchorHandler.add(/#test/, function(){
            ok(true, 'simple onClick handling'); });
        $('#anchorHandler1').trigger('click');
        ok(window.location.hash == '#test', 'hanchor preservation');
    });
});
