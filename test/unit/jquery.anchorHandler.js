if (typeof(isRhino)=='undefined') { // Automated test suite doesn't like timers :/

module('jquery.anchorHandler.js');
test('onclick event handling', function() {
    expect(1);
    $.anchorHandler.add(/#test/, function(){
        ok(true, 'simple onClick handling'); }, true);
    $('#anchorHandler1').trigger('click');
});
}
