// unsigned -> positive only
// http://svn.python.org/projects/python/trunk/Lib/test/test_format.py

function test_format(arr) {
    $(arr).each(function(a, b){
        equals($.format(this[0], this[1]), this[2], this[3]);
    });
}

module('jquery.strings.js');
test('Format - basic string replacement', function() {
//    expect(6);
    var tests = [
        ['{a}bc', {a:'A'},  'Abc',  'Single character replacement (start)']
        ['a{b}c', {b:'B'}, 'aBc',  'Single character replacement (middle)'],
        ['ab{c}', {c:'C'}, 'abC',  'Single character replacement (end)'],

        ['{abc}defghi', {abc:'ABC'}, 'ABCdefghi', 'Multiple character replacement (start)'],
        ['abc{def}ghi', {def:'DEF'}, 'abcDEFghi', 'Multiple character replacement (middle)'],
        ['abcdef{ghi}', {ghi:'GHI'}, 'abcdefGHI', 'Multiple character replacement (end)']
    ];
    expect(tests.length);
    test_format(tests);
    /*
    equals($.format('{a}bc', {a:'A'}),           'Abc',       'Single character replacement (start)' );
    equals($.format('a{b}c', {b:'B'}),           'aBc',       'Single character replacement (middle)' );
    equals($.format('ab{c}', {c:'C'}),           'abC',       'Single character replacement (end)' );
    equals($.format('{abc}defghi', {abc:'ABC'}), 'ABCdefghi', 'Multiple character replacement (start)' );
    equals($.format('abc{def}ghi', {def:'DEF'}), 'abcDEFghi', 'Multiple character replacement (middle)' );
    equals($.format('abcdef{ghi}', {ghi:'GHI'}), 'abcdefGHI', 'Multiple character replacement (end)' );
    */
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

test("Format - Complex formatting", function() {
    expect(1);
    equals($.format('{a:s}b{c:03d}d{e:o}f{g:u}hijklmnopqrstuvwxyz', {a:[1,2,3], c:8, e:255, g:-200}), '123b008d377f200hijklmnopqrstuvwxyz',    'complex string formatting' );
});
