function tests_valid(a) {
    $(a).each(function(){ equals(jQuery.isValid(this[1], this[0]), this[2], this[3], this[4]||{}); });
}
module('jquery.valid.js');
test('Generic data types', function() {
    tests_valid([
        // Integer
        [0,     'integer', true,  '0 is valid integer'],
        [1,     'integer', true,  '1 is valid integer'],
        ['1',   'integer', true,  '"1" is valid integer'],
        [-1,    'integer', true,  '-1 is valid integer'],
        ['1.1', 'integer', false, '1.1 is valid integer'],
        ['a',   'integer', false, 'a is invalid integer'],
        [true,  'integer', false, 'true is invalid integer'],
        [false, 'integer', false, 'false is invalid integer'],
        ['',    'integer', false, '"" is invalid integer'],
        // Numeric
        [0,     'numeric', true,  '0 is valid numeric'],
        [1,     'numeric', true,  '1 is valid numeric'],
        ['0',   'numeric', true,  '"0" is valid numeric'],
        ['1',   'numeric', true,  '"1" is valid numeric'],
        [1.1,   'numeric', true,  '1.1 is valid numeric'],
        [-1,    'numeric', true,  '-1 is valid numeric'],
        [-1.1,  'numeric', true,  '-1.1 is valid numeric'],
        ['a',   'numeric', false, 'a is invalid numeric'],
        [true,  'numeric', false, 'true is invalid numeric'],
        [false, 'numeric', false, 'false is invalid numeric'],
        ['',    'numeric', false, '"" is invalid numeric'],
        // Boolean
        [0,       'boolean', true,  '0 is valid boolean'],
        [1,       'boolean', true,  '1 is valid boolean'],
        ['0',     'boolean', true,  '"0" is valid boolean'],
        ['1',     'boolean', true,  '"1" is valid boolean'],
        [true,    'boolean', false, 'true is invalid boolean'],
        [false,   'boolean', false, 'false is invalid boolean'],
// wtf    ['true',  'boolean', true,  '"true" is valid boolean (strict mode)', {strict:true}],
//        ['false', 'boolean', true,  '"false" is valid boolean (strict mode)', {strict:true}],
        ['',      'boolean', false, '"" is invalid boolean'],
        ['a',     'boolean', false, '"" is invalid boolean'],
        ['.',     'boolean', false, '"" is invalid boolean'],
        // Alphanum
        ['a',     'alphanum', true,  'a is alid alphanumeric'],
        [1,       'alphanum', true,  '1 is alid alphanumeric'],
        ['1',     'alphanum', true,  '"1" is alid alphanumeric'],
        ['abc',   'alphanum', true,  'abc is valid alphanumeric'],
        ['1.5',   'alphanum', true,  '"1.5" is valid alphanumeric'],
        [1.5,     'alphanum', true,  '1.5 is valid alphanumeric'],
        ['a1.5b', 'alphanum', true,  'a1.5b is valid alphanumeric'],
        ['a-b',   'alphanum', true,  'a-b is valid alphanumeric'],
        ['a_b',   'alphanum', true,  'a_b is valid alphanumeric'],
        ['a.b',   'alphanum', true,  'a.b is valid alphanumeric'],
        ['a@b',    'alphanum', false, 'a@b is invalid alphanumeric'],
        ['',      'alphanum', false, '"" is invalid alphanumeric']
    ]);
});
test('Networking', function(){
    tests_valid([
        // Net.email
        ['abc@def.com',      'net.email', true,  'abc@def.com is valid email'],
        ['a.bc@def.com',     'net.email', true,  'a.bc@def.co is valid email'],
        ['a-bc@def.com',     'net.email', true,  'a-bc@def.co is valid email'],
        ['a_bc@def.com',     'net.email', true,  'a_bc@def.co is valid email'],
        ['abc@def-ghi.com',  'net.email', true,  'abc@def-ghi.com is valid email'],
        ['abc@def.ghi.com',  'net.email', true,  'abc@def.ghi.com is valid email'],
        ['ab.c@def.ghi.com', 'net.email', true,  'ab.c@def.ghi.com is valid email'],
        ['ab.c@def.ghi.com', 'net.email', true,  'ab.c@def.ghi.com is valid email'],
        ['ab-c@def.ghi.com', 'net.email', true,  'ab-c@def.ghi.com is valid email'],
        ['ab_c@def.ghi.com', 'net.email', true,  'ab_c@def.ghi.com is valid email'],
        ['ab+c@def.ghi.com', 'net.email', true,  'ab+c@def.ghi.com is valid email'],
        ['ab.c@def-ghi.com', 'net.email', true,  'ab.c@def-ghi.com is valid email'],
        ['ab-c@def-ghi.com', 'net.email', true,  'ab-c@def-ghi.com is valid email'],
        ['ab_c@def-ghi.com', 'net.email', true,  'ab_c@def-ghi.com is valid email'],
        ['ab+c@def-ghi.com', 'net.email', true,  'ab+c@def-ghi.com is valid email'],
        ['ab.c@def.com',     'net.email', true,  'ab.c@def.com is valid email'],
        ['ab-c@def.com',     'net.email', true,  'ab-c@def.com is valid email'],
        ['ab_c@def.com',     'net.email', true,  'ab_c@def.com is valid email'],
        ['ab+c@def.com',     'net.email', true,  'ab+c@def.com is valid email'],
        ['abc@def_ghi.com',  'net.email', false,  'abc@def_ghi.com is invalid email'],
        ['abc@def+ghi.com',  'net.email', false,  'abc@def+ghi.com is invalid email'],
        ['abc@_def.com',     'net.email', false,  'abc@_def.com is invalid email'],
        ['a~bc@_def.com',    'net.email', false,  'a~bc@_def.com is invalid email'],
        ['@_def.com',        'net.email', false,  '@_def.com is invalid email'],
        ['1',                'net.email', false,  '1 is invalid email'],
        ['a@b',              'net.email', false,  'a@b is invalid email'],
        ['',                 'net.email', false,  '"" is invalid email'],
        // Net.ip
        ['0.0.0.0',          'net.ip',    true,   '0.0.0.0 is valid ip'],
        ['1.1.1.1',          'net.ip',    true,   '1.1.1.1 is valid ip'],
        ['12.12.12.12',      'net.ip',    true,   '12.12.12.12 is valid ip'],
        ['123.123.123.123',  'net.ip',    true,   '123.123.123.123 is valid ip'],
        ['255.255.255.255',  'net.ip',    true,   '255.255.255.255 is valid ip'],
        ['256.256.256.256',  'net.ip',    false,  '256.256.256.256 is invalid ip'],
        ['256.256.256',      'net.ip',    false,  '256.256.256 is invalid ip'],
        ['256.256',          'net.ip',    false,  '256.256 is invalid ip'],
        ['256',              'net.ip',    false,  '256 is invalid ip'],
        ['',                 'net.ip',    false,  '"" is invalid ip'],
        // mac address
        // uri (http || ftp || svn|) 

    ]);
});

