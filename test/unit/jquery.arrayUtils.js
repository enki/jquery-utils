$(function(){

    module('jquery.arrayUtils.js');
    test('array.merge', function() {
        expect(2);
        equals($a([1,2]).merge([3,4]).end().join(''), '1234', 'Simple merge');
        equals($a([1,2]).merge([1,2]).end().join(''), '1212', 'Merge does not remove duplicate by default');
    });

    test('array.pluck', function() {
        expect(2);
        equals($a([['a','b'],['c', 'd']]).pluck(0).end().join(''), 'ac', 'pluck by index');
        equals($a(['a','b']).pluck(0).end().join(''), 'ab', 'Invalid array return correctly')
    });
    
    test('array.zip', function() {
        expect(3);
        equals($a([1,2,3]).zip([1,2,3]).end().join(''), "1,12,23,3", 'basic zip');
        equals($a([1,2,3,4]).zip([1,2,3]).end().join(''), "1,12,23,3", 'basic zip with arr1 longer');
        equals($a([1,2,3]).zip([1,2,3,4]).end().join(''), "1,12,23,3", 'basic zip with arr2 longer');
    });


});
