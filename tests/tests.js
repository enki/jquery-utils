// unsigned -> positive only
// http://svn.python.org/projects/python/trunk/Lib/test/test_format.py
function test_format(a) {
    expect(a.length);
    $(a).each(function(){ equals($.format(this[0], this[1]), this[2], this[3]); });
}

module('jquery.strings.js');
test('Format - basic string replacement', function() {
    test_format([
        ['{a}bc',       {a:'A'},     'Abc',       'Single character replacement (start)'],
        ['a{b}c',       {b:'B'},     'aBc',       'Single character replacement (middle)'],
        ['ab{c}',       {c:'C'},     'abC',       'Single character replacement (end)'],
        ['{abc}defghi', {abc:'ABC'}, 'ABCdefghi', 'Multiple character replacement (start)'],
        ['abc{def}ghi', {def:'DEF'}, 'abcDEFghi', 'Multiple character replacement (middle)'],
        ['abcdef{ghi}', {ghi:'GHI'}, 'abcdefGHI', 'Multiple character replacement (end)']
    ]);
    // TODO: escapinng
});

test('Format - DECIMAL (d)', function() {
    test_format([
        ['{a:d}',       {a:10.5},  '10',     '10.5 -> 10 (float to decimal)'],
        ['{a:d}',       {a:-10.5}, '-10',    '-10.5 -> -10 (negative float to negative decimal)'],
        ['{a:d}',       {a:-10},   '-10',    '-10 -> -10 (signed)'],
        ['a{a:03d}b',   {a:1},     'a001b',  '1 -> 001 (Zero padding)']
    ]);
});

test('Format - DECIMAL (i)', function() {
    test_format([
        ['{a:i}', {a:10.5},  '10',     '10.5 -> 10 (float to decimal)'],
        ['{a:i}', {a:-10.5}, '-10',    '-10.5 -> -10 (negative float to negative decimal)'],
        ['{a:d}', {a:-10},   '-10',    '-10 -> -10 (unsigned decimal)'],
        ['a{a:03i}b', {a:1}, 'a001b',  '1 -> 001 (Zero padding)']
    ]);
});

test("Format - OCTAL (o) ", function() {
    test_format([
        ['{a:o}', {a:0377}, '377', '0377 -> 377'],
        ['{a:o}', {a:377},  '571', '377 -> 571'],
        ['{a:o}', {a:255},  '377', '255 -> 377'],
        ['{a:o}', {a:0255}, '255', '0255 -> 255']
    ]);
});

test("Format - UNSIGNED INT (u)", function() {
    test_format([
        ['{a:u}', {a:10},    '10', '10 -> 10 (Integer to Unsigned Integer)'],
        ['{a:u}', {a:-10},   '10', '-10 -> 10 (Integer to Unsigned Integer)'],
        ['{a:u}', {a:10.5},  '10', '10.5 -> 10 (Float to Unsigned Integer)'],
        ['{a:u}', {a:-10.5}, '10', '-10.5 -> 10 (Float to Unsigned Integer)']
    ]);
});

test("Format - UNSIGNED HEXADECIMAL (x)", function() {
    test_format([
        ['{a:x}', {a:75}, '4b',    '75 -> 4b (Signed integer to hexadecimal)']
    ]);
});

test("Format - UNSIGNED UPPER CASE HEXADECIMAL (X)", function() {
    test_format([
        ['{a:X}', {a:75}, '4B',    '75 -> 4B (Signed integer to hexadecimal)']
    ]);
});

test("Format - SINGLE CHARACTER (c)", function() {
    test_format([
        ['{a:c}', {a:'abc'},    'a', 'abc -> a'],
        ['{a:c}', {a:'~@abc'},  'a', '~@abc -> a'],
        ['{a:c}', {a:'123'},    '1', '123 -> 1'],
        ['{a:c}', {a:'~@123'},  '1', '~@123 -> 1']
    ]);
});

test("Format - STRING (s)", function() {
    test_format([
        ['{a:s}', {a:[1,2,3]}, '123',    '[1,2,3] -> 123 (Array to string)']
    ]);
});

test("Format - Complex formatting", function() {
    test_format([
        ['{a:s}b{c:03d}d{e:o}f{g:u}hijklmnopqrstuvwxyz', {a:[1,2,3], c:8, e:255, g:-200}, '123b008d377f200hijklmnopqrstuvwxyz',    'complex string formatting' ]
    ]);
});



test("Format - tests from python format_tests.py", function() {
    test_format([
        ['{a:.1d}',  {a:1}, '1', '{.1d} -> 1'],
//        ['{a:.*1d}', {a:1}, '1', '{.1d} -> 1'],
//        ['{a:.100d}', {a:1}, '0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001', '{.1d} -> 1']
//        ['{a:.117x}', {a:1}, '0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001', '{.1d} -> 1']
//        ['{a:.118x}', {a:1}, '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001', '{.1d} -> 1']
        ['{a:f}',  {a:1.0}, '1.000000', '{.1d} -> 1'],

    ]);
});
