(function($){
    module("colhider");
    
    test("initialization", function() {
        expect(9);
        var testdiv = $('<div />').appendTo('#main');
        testdiv.html(testtable).hygrid({colhider:true});
        ok(testdiv.find('th:last').hasClass('ui-hygrid-p-colhider'), "th classes OK (1)");
        
        equals(testdiv.find('th').length, 3, "th has been inserted");
        equals(testdiv.find('tbody tr:eq(0) td').length, 3, "td.length = 3");
        equals(testdiv.find('.ui-hygrid-p-colhider-menu').length, 1, "dropdown ul as been inserted");
        equals(testdiv.find('.ui-hygrid-p-colhider-menu li').length, testdiv.find('th').length-1, "dropdown li.length == th length (minus colhider th)");
        ok(testdiv.find('th:last').hasClass('ui-hygrid-p-colhider'), "th classes OK (1)");
        ok(testdiv.find('th:last').hasClass('ui-state-default'), "th classes OK (2)");
        testdiv.remove();

        var testdiv = $('<div />').appendTo('#main');
        testdiv.html(testtable).hygrid({cols: [{hide: false}, {hide: true}]});
        ok(testdiv.find('thead th:eq(0)').is(':visible'), 'hygrid.cellModifiers.hide: true OK');
        ok(testdiv.find('thead th:eq(1)').is(':hidden'), 'hygrid.cellModifiers.hide: false OK');
        testdiv.remove();
    });

    test("ui interaction", function() {
        expect(13);
        var testdiv = $('<div />').appendTo('#main');
        testdiv.html(testtable).hygrid({colhider:true});
        
        ok(testdiv.find('th:last').trigger('mouseover').hasClass('ui-state-hover'), "th classe hover OK (3)"); // 1
        ok(testdiv.find('th:last').trigger('mouseleave').hasClass('ui-state-default'), "th classe hover OK (4)"); // 2
        ok(testdiv.find('.ui-hygrid-p-colhider-menu').is(':hidden'), "menu toggle (0)"); // 3

        $('.ui-hygrid-p-colhider', testdiv).trigger('click');
        ok(testdiv.find('.ui-hygrid-p-colhider-menu').is(':visible'), "menu toggle (1)"); // 4

        $('.ui-hygrid-p-colhider', testdiv).trigger('click');
        ok(testdiv.find('.ui-hygrid-p-colhider-menu').is(':hidden'), "menu toggle (2)"); // 5

        testdiv.find('.ui-hygrid-p-colhider').trigger('click');
        testdiv.find('.ui-hygrid-p-colhider-menu li:eq(0)').trigger('click');
        ok(testdiv.find('.ui-hygrid-p-colhider-menu li:eq(0) label input').is(':checked'), "input checked (0)"); // 6
        ok(testdiv.find('tbody tr:eq(0) td:eq(0)').is(':visible'), "show col OK (0)"); // 7

        testdiv.find('.ui-hygrid-p-colhider').trigger('click');
        testdiv.find('.ui-hygrid-p-colhider-menu li:eq(1)').trigger('click');
        ok(testdiv.find('tbody tr:eq(0) td:eq(1)').is(':visible'), "show col OK (1)"); // 8

        testdiv.one('gridcoltoggled', function(){
            ok(testdiv.find('tbody tr:eq(0) td:eq(0)').is(':hidden'), "hide col OK (0)"); // 9
            start();
        });
        testdiv.find('.ui-hygrid-p-colhider').trigger('click');
        testdiv.find('.ui-hygrid-p-colhider-menu li:eq(0) input').trigger('click');
        stop();

        testdiv.one('gridcoltoggled', function(){
            ok(testdiv.find('tbody tr:eq(0) td:eq(0)').is(':hidden'), "hide col OK (1)"); // 10
            start();
        });
        testdiv.find('.ui-hygrid-p-colhider').trigger('click');
        testdiv.find('.ui-hygrid-p-colhider-menu li:eq(0)').trigger('click');
        stop();


        testdiv.one('gridcoltoggled', function(){
            ok(testdiv.find('tbody tr:eq(0) td:eq(1)').is(':visible'), "show col OK (0)"); // 11
            start();
        });
        
        testdiv.find('.ui-hygrid-p-colhider').trigger('click');
        testdiv.find('.ui-hygrid-p-colhider-menu li:eq(1)').trigger('click');
        stop();

        testdiv.one('gridcoltoggled', function(){
            ok(testdiv.find('tbody tr:eq(0) td:eq(1)').is(':visible'), "show col OK (1)"); // 12
            start();
        });
        testdiv.find('.ui-hygrid-p-colhider').trigger('click');
        testdiv.find('.ui-hygrid-p-colhider-menu li:eq(0)').trigger('click');
        stop();
        
        setTimeout(function(){
            ok($('.ui-hygrid-p-colhider-menu', testdiv).is(':hidden'), 'menu hides after click');
            start();
            testdiv.remove();
        }, 150);
        stop();
    });
})(jQuery);
