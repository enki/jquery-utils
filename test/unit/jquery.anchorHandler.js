if (typeof(isRhino)=='undefined') { // Automated test suite doesn't like timers :/

module('jquery.anchorHandler.js');
test('onclick event handling', function() {
    expect(1);
    var handler = function(){ 
        ok(true, 'onClick handling'); 
    };
    $.anchorHandler.add(/#test/, handler, true);
    $('#anchorHandler1').trigger('click');
});
}
