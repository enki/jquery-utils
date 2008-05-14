module('jquery.strings.js');
test("Format (basic string replacement)", function() {
    expect(6);
    ok($.format('{a}bc', {a:'A'}) == 'Abc', 'Single character replacement (start)' );
    ok($.format('a{b}c', {b:'B'}) == 'aBc', 'Single character replacement (middle)' );
    ok($.format('ab{c}', {c:'C'}) == 'abC', 'Single character replacement (end)' );

    ok($.format('{abc}defghi', {abc:'ABC'}) == 'ABCdefghi', 'Multiple character replacement (start)' );
    ok($.format('abc{def}ghi', {def:'DEF'}) == 'abcDEFghi', 'Multiple character replacement (middle)' );
    ok($.format('abcdef{ghi}', {ghi:'GHI'}) == 'abcdefGHI', 'Multiple character replacement (end)' );
});

test("Format (types convertion)", function() {
    expect(1);
    ok($.format('{a:s}', {a:[1,2,3]})       == '123',    'Array to String convertion (s)' );
});
test("Format - DECIMAL (d)", function() {
    expect(5);
    ok($.format('{a:d}', {a:10.5})          == '10',     'Float to Integer convertion (d)' );
    ok($.format('{a:d}', {a:-10})           == '-10',    'Float to negative Integer convertion (d)' );
    ok($.format('{a:i}', {a:10.5})          == '10',     'Float to Integer convertion (i)' );
    ok(typeof($.format('{a:d}', {a:10.5}))  == 'number', 'Result type of float to Integer convertion (d)' );
    ok(typeof($.format('{a:i}', {a:10.5}))  == 'number', 'Result type of float to Integer convertion (i)' );
    
});
test("Format - UNSIGNED INT(u)", function() {
    ok($.format('{a:u}', {a:10})            == '10',     'Integer to Unsigned Integer convertion (d)' );
    ok($.format('{a:u}', {a:-10})           == '10',     'Negative Integer to Unsigned Integer convertion (d)' );
});

test("Format - OCTAL (u) ", function() {
    expect(4);
    ok($.format('{a:o}', {a:0377})           == '377',    '0377 -> 377' );
    ok($.format('{a:o}', {a:377})            == '571',    '377 -> 571' );
    ok($.format('{a:o}', {a:255})            == '377',    '255 -> 377' );
    ok($.format('{a:o}', {a:0255})           == '255',    '0255 -> 255' );
});

test("Format (zero padding)", function() {
    expect(2);
    ok($.format('a{a:03d}b', {a:1}) == 'a001b', 'Basic zero padding (03d)' );
    ok($.format('a{a:03i}b', {a:1}) == 'a001b', 'Basic zero padding (03i)' );
});
