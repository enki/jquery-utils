module('jquery.cookie.js');
test('Set/unset tests', function() {
    expect(2);
    $.cookie('test', 'abc');
    equals($.cookie('test'), 'abc', 'Set cookie');
    $.cookie('test', false);
    equals($.cookie('test'), 'false', 'Unset cookie');
});
