function tests_valid(a) {
    
    $(a).each(function(){ equals(jQuery.isValid(this[1], this[0]), this[2], this[3].replace('%s', this[0]), this[4]||{}); });
}
module('jquery.valid.js');
test('Generic data types', function() {
    tests_valid([
        // Integer
        [0,     'integer', true,  '%s is valid integer'],
        [1,     'integer', true,  '%s is valid integer'],
        ['1',   'integer', true,  '"%s" is valid integer'],
        [-1,    'integer', true,  '%s is valid integer'],
        ['1.1', 'integer', false, '%s is valid integer'],
        ['a',   'integer', false, '%s is invalid integer'],
        [true,  'integer', false, '%s is invalid integer'],
        [false, 'integer', false, '%s is invalid integer'],
        ['',    'integer', false, '"" is invalid integer'],
        // Numeric
        [0,     'numeric', true,  '%s is valid numeric'],
        [1,     'numeric', true,  '%s is valid numeric'],
        ['0',   'numeric', true,  '"%s" is valid numeric'],
        ['1',   'numeric', true,  '"%s" is valid numeric'],
        [1.1,   'numeric', true,  '%s is valid numeric'],
        [-1,    'numeric', true,  '%s is valid numeric'],
        [-1.1,  'numeric', true,  '%s is valid numeric'],
        ['a',   'numeric', false, '%s is invalid numeric'],
        [true,  'numeric', false, '%s is invalid numeric'],
        [false, 'numeric', false, '%s is invalid numeric'],
        ['',    'numeric', false, '"" is invalid numeric'],
        // Boolean
        [0,       'boolean', true,  '%s is valid boolean'],
        [1,       'boolean', true,  '%s is valid boolean'],
        ['0',     'boolean', true,  '"%s" is valid boolean'],
        ['1',     'boolean', true,  '"%s" is valid boolean'],
        [true,    'boolean', false, '%s is invalid boolean'],
        [false,   'boolean', false, '%s is invalid boolean'],
// wtf    ['true',  'boolean', true,  '"true" is valid boolean (strict mode)', {strict:true}],
//        ['false', 'boolean', true,  '"false" is valid boolean (strict mode)', {strict:true}],
        ['',      'boolean', false, '"" is invalid boolean'],
        ['a',     'boolean', false, '"" is invalid boolean'],
        ['.',     'boolean', false, '"" is invalid boolean'],
        // Alphanum
        ['a',     'alphanum', true,  '%s is alid alphanumeric'],
        [1,       'alphanum', true,  '%s is alid alphanumeric'],
        ['1',     'alphanum', true,  '"%s" is alid alphanumeric'],
        ['abc',   'alphanum', true,  '%s is valid alphanumeric'],
        ['1.5',   'alphanum', true,  '"%s" is valid alphanumeric'],
        [1.5,     'alphanum', true,  '%s is valid alphanumeric'],
        ['a1.5b', 'alphanum', true,  '%s is valid alphanumeric'],
        ['a-b',   'alphanum', true,  '%s is valid alphanumeric'],
        ['a_b',   'alphanum', true,  '%s is valid alphanumeric'],
        ['a.b',   'alphanum', true,  '%s is valid alphanumeric'],
        ['a@b',   'alphanum', false, '%s is invalid alphanumeric'],
        ['',      'alphanum', false, '"" is invalid alphanumeric'],
        // CSShex
        ['#000',    'CSShex', true,  '%s is valid CSS hexadecimal'],
        ['#000000', 'CSShex', true,  '%s is valid CSS hexadecimal'],
        ['#fff',    'CSShex', true,  '%s is valid CSS hexadecimal'],
        ['#ffffff', 'CSShex', true,  '%s is valid CSS hexadecimal'],
        ['#0f0f0f', 'CSShex', true,  '%s is valid CSS hexadecimal'],
        ['#0f0f0',  'CSShex', false, '%s is invalid CSS hexadecimal'],
        ['#0f0f0z', 'CSShex', false, '%s is invalid CSS hexadecimal']
    ]);
});
test('Networking', function(){
    tests_valid([
        // Net.email
        ['abc@def.com',      'net.email', true,   '%s is valid email'],
        ['a.bc@def.com',     'net.email', true,   '%s is valid email'],
        ['a-bc@def.com',     'net.email', true,   '%s is valid email'],
        ['a_bc@def.com',     'net.email', true,   '%s is valid email'],
        ['abc@def-ghi.com',  'net.email', true,   '%s is valid email'],
        ['abc@def.ghi.com',  'net.email', true,   '%s is valid email'],
        ['ab.c@def.ghi.com', 'net.email', true,   '%s is valid email'],
        ['ab.c@def.ghi.com', 'net.email', true,   '%s is valid email'],
        ['ab-c@def.ghi.com', 'net.email', true,   '%s is valid email'],
        ['ab_c@def.ghi.com', 'net.email', true,   '%s is valid email'],
        ['ab+c@def.ghi.com', 'net.email', true,   '%s is valid email'],
        ['ab.c@def-ghi.com', 'net.email', true,   '%s is valid email'],
        ['ab-c@def-ghi.com', 'net.email', true,   '%s is valid email'],
        ['ab_c@def-ghi.com', 'net.email', true,   '%s is valid email'],
        ['ab+c@def-ghi.com', 'net.email', true,   '%s is valid email'],
        ['ab.c@def.com',     'net.email', true,   '%s is valid email'],
        ['ab-c@def.com',     'net.email', true,   '%s is valid email'],
        ['ab_c@def.com',     'net.email', true,   '%s is valid email'],
        ['ab+c@def.com',     'net.email', true,   '%s is valid email'],
        ['abc@def_ghi.com',  'net.email', false,  '%s is invalid email'],
        ['abc@def+ghi.com',  'net.email', false,  '%s is invalid email'],
        ['abc@_def.com',     'net.email', false,  '%s is invalid email'],
        ['a~bc@_def.com',    'net.email', false,  '%s is invalid email'],
        ['@_def.com',        'net.email', false,  '%s is invalid email'],
        ['1',                'net.email', false,  '%s is invalid email'],
        ['a@b',              'net.email', false,  '%s is invalid email'],
        ['',                 'net.email', false,  '"" is invalid email'],
        // Net.ip
        ['0.0.0.0',          'net.ip',    true,   '%s is valid ip'],
        ['1.1.1.1',          'net.ip',    true,   '%s is valid ip'],
        ['12.12.12.12',      'net.ip',    true,   '%s is valid ip'],
        ['123.123.123.123',  'net.ip',    true,   '%s is valid ip'],
        ['255.255.255.255',  'net.ip',    true,   '%s is valid ip'],
        ['256.256.256.256',  'net.ip',    false,  '%s is invalid ip'],
        ['256.256.256',      'net.ip',    false,  '%s is invalid ip'],
        ['256.256',          'net.ip',    false,  '%s is invalid ip'],
        ['256',              'net.ip',    false,  '%s is invalid ip'],
        ['',                 'net.ip',    false,  '"" is invalid ip'],
        // mac address
        ['00:14:f2:56:a2:1b','net.MACaddress', true,  '%s is valid MAC address'],
        ['08:00:69:02:01:FC','net.MACaddress', true,  '%s is valid MAC address'],
        ['00:00:00:00:00:00','net.MACaddress', true,  '%s is valid MAC address'],
        ['00:03:ba:26:01:b0','net.MACaddress', true,  '%s is valid MAC address'],
        ['fff:03:ba:26:01:b0','net.MACaddress', false,  '%s is invalid MAC address'],
        ['z1:03:ba:26:01:b0', 'net.MACaddress', false,  '%s is invalid MAC address'],
        ['03:ba:26:01:b0',    'net.MACaddress', false,  '%s is invalid MAC address'],
        
        // uri (http || ftp || svn|) 

    ]);
});

