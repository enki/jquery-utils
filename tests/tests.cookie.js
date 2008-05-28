$(document).ready(function(){
    module('jquery.cookie.js');
    test('Set/unset tests', function() {
        expect(2);
        $.cookie('test', 'abc');
        equals($.cookie('test'), 'abc', 'Set cookie');
        $.cookie('test', null);
        equals($.cookie('test'), null, 'Unset cookie');
    });
});
