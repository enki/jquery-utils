module('jquery.i18n.js');

$.i18n('fr.test', {
    'a':'b', '1':'2', '':'c', 'b':'', ' e':'e ',  'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa': $.repeat('b', 300),
    '{m:d}/{d:d}/{y:d}': '{d:d}/{m:d}/{y:d}',
    '|!"/$%?&*()': ')(*&?%$/"!|',
    'aioue': 'àîöûé',
    'Hello': 'Allo',
    'jp': 'ハロー世界',
    'kr': '여러분, 안녕하세요',
    'gr': 'Γεια σας κόσμο',
    'ar': 'مرحبا العالم',
    'ru': 'Привет мир',
    'hi': 'नमस्कार दुनिया'
});
$.i18n('ch.test', {
    'Hello': '世界您好'
});

test('Basic translation tests', function() {
    function _(str, args) { return $.i18n('test', str, args); }

    $.i18n('fr');
    expect(16);
    equals(_('a'), 'b', 'a == b');
    equals(_('1'), '2', '1 == 2');
    equals(_(''),  'c', '"" == c');
    equals(_('b'), 'b', 'b == b (trans not set)');
    equals(_(' e'),  'e ', '" e" == "e "');
    equals(_('Hello'),  'Allo', 'Hello == Allo');
    equals(_($.repeat('a', 300)), $.repeat('b', 300), 'very long key');
    equals(_('{m:d}/{d:d}/{y:d}'), '{d:d}/{m:d}/{y:d}', '{m:d}/{d:d}/{y:d} == {d:d}/{m:d}/{y:d}');
    equals(_('aioue'), 'àîöûé', 'aioue == àîöûé');
    equals(_('jp'), 'ハロー世界',         'Japneese');
    equals(_('kr'), '여러분, 안녕하세요', 'Korean');
    equals(_('gr'), 'Γεια σας κόσμο',     'Greece');
    equals(_('ar'), 'مرحبا العالم',       'Arabic');
    equals(_('ru'), 'Привет мир',         'Russian');
    equals(_('hi'), 'नमस्कार दुनिया',          'Hindy');
    
    $.i18n('ch');
    equals(_('Hello'), '世界您好', 'Hello == 世界您好 (language switching test)');
});
