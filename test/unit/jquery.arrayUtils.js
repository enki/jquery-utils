$(function(){

    module('jquery.arrayUtils.js');

    // ALL
    test('$.all', function() {
        expect(6);
        equals($.all([]),              true,  'empty array yield true');
        equals($.all([1,2,3]),         true,  'basic positive verification');
        equals($.all([1,2,'']),        false, 'empty string yield false');
        equals($.all([1,2,false]),     false, 'false yield false');
        equals($.all([1,2,undefined]), false, 'undefined yield false');
        equals($.all([1,2,null]),      false, 'undefined yield false');
    });
    test('$.fn.all', function() {
        expect(2);
        ok($('<b>a</b><b>a</b>').all(function(i){ return $(i).text() == 'a'; }), 'Positive test with iterator');
        ok(!$('<b>a</b><b>b</b>').all(function(i){ return $(i).text() == 'a'; }), 'Negative test with iterator');
    });

    // ANY
    test('$.any', function() {
        expect(7);
        equals($.any([]),                     false,'empty array yield false');
        equals($.any([false,null,undefined]), false,'test with all falsy values');
        equals($.any([1,2,3]),                true, 'basic positive verification');
        equals($.any([1,2,'']),               true, 'empty string yield true');
        equals($.any([1,2,false]),            true, 'false yield true');
        equals($.any([1,2,undefined]),        true, 'undefined yield true');
        equals($.any([1,2,null]),             true, 'undefined yield true');
    });
    test('$.fn.any', function() {
        expect(3);
        ok($('<b>a</b><b>a</b>').all(function(i){ return $(i).text() == 'a'; }), 'Positive test with iterator');
        ok(!$('<b>a</b><b>b</b>').all(function(i){ return $(i).text() == 'a'; }), 'Positive test (2) with iterator');
        ok(!$('<b>c</b><b>b</b>').all(function(i){ return $(i).text() == 'a'; }), 'Negative test with iterator');
    });

    // DETECT 
    test('$.detect', function() {
        expect(3);
        equals($.detect([1,2,3], function(i){return i/2==1;}), 2,'Positive detection');
        equals($.detect([1,2,3], function(i){return i==5;}), false,'No detection');
        equals($.detect([5,1,5], function(i){return i==5;}), 5,'Two matches');
    });
    test('$.fn.detect', function() {
        expect(1);
        ok($('<b>a</b><i>a</i>').detect(function(i){ return $(i).text() == 'a'; }).get(0).nodeName == 'B', 'detect with dom object');
    });

    // EACHSLICE
    test('$.eachSlice', function() {
        expect(1);
        equals($.eachSlice([1,2,3,4,5,6,7,8,9, 10], 3, function(i){ return i+'a';})[3], '10a', 'Slicing with iterator');
    });
    test('$.fn.eachSlice', function() {
        expect(2);
        equals($('<b>A</b><b>B</b><b>C</b><b>D</b><b>E</b><b>F</b>').eachSlice(2).length, 3, 'Slicing with DOM elements');
        equals($('<b>A</b><b>B</b><b>C</b><b>D</b><b>E</b><b>F</b>').eachSlice(2, function(i){return $(i).text().toLowerCase(); })[1][1], 'd', 'Slicing with DOM elements with iterator');
    });

    // INJECT
    test('$.inject', function() {
        expect(1);
        equals($.inject([1,2,3], 0, function(acc, i){ return acc+i; }), 6, 'Simple accumulation');
    });
    
    // MAX/MIN
    test('$.max/min', function() {
        expect(2);
        equals($.max([5,1,2,3]), 5, 'Simple max');
        equals($.min([5,1,2,3]), 1, 'Simple min');
    });

    // PARTITION
    test('$.partition', function() {
        expect(2);
        var part = $.partition([1,2,3,4,5,6], function(i){ return i%2==0;});
        equals(part[0].join(''), '246', 'Partition trues');
        equals(part[1].join(''), '135', 'Partition falses');
    });

    test('array.pluck', function() {
        expect(2);
        equals($.pluck([['a','b'],['c', 'd']], 0).join(''), 'ac', 'pluck by index');
        equals($.pluck(['a','b'], 0).join(''), 'ab', 'Invalid array return correctly')
    });

    test('array.select', function() {
        expect(1);
        equals($.select([1,2,3,4,5,6], function(i){ return i%2==0; }).join(''), '246', 'Simple select');
    });
    
    test('array.zip', function() {
        expect(3);
        equals($.zip([1,2,3], [1,2,3]).join(''), "1,12,23,3", 'basic zip');
        equals($.zip([1,2,3,4], [1,2,3]).join(''), "1,12,23,3", 'basic zip with arr1 longer');
        equals($.zip([1,2,3], [1,2,3,4]).join(''), "1,12,23,3", 'basic zip with arr2 longer');
    });
});
