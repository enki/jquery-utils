// unsigned -> positive only

module('jquery.strings.js');
test('Format - basic string replacement', function() {
    expect(6);
    equals($.format('{a}bc', {a:'A'}),           'Abc',       'Single character replacement (start)' );
    equals($.format('a{b}c', {b:'B'}),           'aBc',       'Single character replacement (middle)' );
    equals($.format('ab{c}', {c:'C'}),           'abC',       'Single character replacement (end)' );
    equals($.format('{abc}defghi', {abc:'ABC'}), 'ABCdefghi', 'Multiple character replacement (start)' );
    equals($.format('abc{def}ghi', {def:'DEF'}), 'abcDEFghi', 'Multiple character replacement (middle)' );
    equals($.format('abcdef{ghi}', {ghi:'GHI'}), 'abcdefGHI', 'Multiple character replacement (end)' );
    // TODO: escapinng
});

test('Format - DECIMAL (d)', function() {
    expect(5);
    equals($.format('{a:d}', {a:10.5}),         '10',     '10.5 -> 10 (float to decimal)');
    equals($.format('{a:d}', {a:-10.5}),        '-10',    '-10.5 -> -10 (negative float to negative decimal)');
    equals($.format('{a:d}', {a:-10}),          '-10',    '-10 -> -10 (signed)');
    equals(typeof($.format('{a:d}', {a:10.5})), 'number', 'Result type is a number (when possible)');
    equals($.format('a{a:03d}b', {a:1}),        'a001b',  '1 -> 001 (Zero padding)');
});

test('Format - DECIMAL (i)', function() {
    expect(5);
    equals($.format('{a:i}', {a:10.5}),         '10',     '10.5 -> 10 (float to decimal)');
    equals($.format('{a:i}', {a:-10.5}),        '-10',    '-10.5 -> -10 (negative float to negative decimal)');
    equals($.format('{a:d}', {a:-10}),          '-10',    '-10 -> -10 (unsigned decimal)');
    equals(typeof($.format('{a:i}', {a:10.5})), 'number', 'Result type is a number (when applicable)');
    equals($.format('a{a:03i}b', {a:1}),        'a001b',  '1 -> 001 (Zero padding)');
});

test("Format - OCTAL (o) ", function() {
    expect(4);
    equals($.format('{a:o}', {a:0377}), '377', '0377 -> 377');
    equals($.format('{a:o}', {a:377}),  '571', '377 -> 571');
    equals($.format('{a:o}', {a:255}),  '377', '255 -> 377');
    equals($.format('{a:o}', {a:0255}), '255', '0255 -> 255');
});

test("Format - UNSIGNED INT (u)", function() {
    expect(4);
    equals($.format('{a:u}', {a:10}),    '10', '10 -> 10 (Integer to Unsigned Integer)');
    equals($.format('{a:u}', {a:-10}),   '10', '-10 -> 10 (Integer to Unsigned Integer)');
    equals($.format('{a:u}', {a:10.5}),  '10', '10.5 -> 10 (Float to Unsigned Integer)');
    equals($.format('{a:u}', {a:-10.5}), '10', '-10.5 -> 10 (Float to Unsigned Integer)');
});

test("Format - UNSIGNED HEXADECIMAL (x)", function() {
    expect(1);
    equals($.format('{a:x}', {a:75}), '4b',    '75 -> 4b (Signed integer to hexadecimal)' );
});

test("Format - UNSIGNED UPPER CASE HEXADECIMAL (X)", function() {
    expect(1);
    equals($.format('{a:X}', {a:75}), '4B',    '75 -> 4B (Signed integer to hexadecimal)' );
});

test("Format - SINGLE CHARACTER (c)", function() {
    expect(4);
    equals($.format('{a:c}', {a:'abc'}),    'a', 'abc -> a');
    equals($.format('{a:c}', {a:'~@abc'}),  'a', '~@abc -> a');
    equals($.format('{a:c}', {a:'123'}),    '1', '123 -> 1');
    equals($.format('{a:c}', {a:'~@123'}),  '1', '~@123 -> 1');
});

test("Format - STRING (s)", function() {
    expect(1);
    equals($.format('{a:s}', {a:[1,2,3]}), '123',    '[1,2,3] -> 123 (Array to string)' );
});
