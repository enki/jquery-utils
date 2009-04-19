(function($){
    module("colhider");
    
    test("initialization", function() {
        expect(9);
        var grid = $(testtable).appendTo('#main').hygrid({colhider:true});
        ok(grid.find('th:last').hasClass('ui-hygrid-p-colhider'), "th classes OK (1)");
        
        equals(grid.find('th').length, 3, "th has been inserted");
        equals(grid.find('tbody tr:eq(0) td').length, 3, "td.length = 3");
        equals(grid.parent().find('.ui-hygrid-p-colhider-menu').length, 1, "dropdown ul as been inserted");
        equals(grid.parent().find('.ui-hygrid-p-colhider-menu li').length, grid.find('th').length-1, "dropdown li.length == th length (minus colhider th)");
        ok(grid.find('th:last').hasClass('ui-hygrid-p-colhider'), "th classes OK (1)");
        ok(grid.find('th:last').hasClass('ui-state-default'), "th classes OK (2)");
        grid.remove();

        var grid = $(testtable).appendTo('#main').hygrid({cols: [{hide: false}, {hide: true}]});
        ok(grid.find('thead th:eq(0)').is(':visible'), 'hygrid.cellModifiers.hide: true OK');
        ok(grid.find('thead th:eq(1)').is(':hidden'), 'hygrid.cellModifiers.hide: false OK');
        grid.remove();
    });

    test("ui interaction", function() {
        expect(12);
        var grid = $(testtable).appendTo('#main').hygrid({colhider:true});
        var menu = grid.parent().find('.ui-hygrid-p-colhider-menu');
        ok(grid.find('th:last').trigger('mouseover').hasClass('ui-state-hover'), "th classe hover OK (3)"); // 1
        ok(grid.find('th:last').trigger('mouseleave').hasClass('ui-state-default'), "th classe hover OK (4)"); // 2
        ok(menu.is(':hidden'), "menu toggle (0)"); // 3
        grid.find('.ui-hygrid-p-colhider').click();
        setTimeout(function(){
            ok(menu.is(':visible'), "menu toggle (1)"); // 4
            start();
        }, 200);
        stop();

        grid.find('.ui-hygrid-p-colhider').click();
        ok(menu.is(':hidden'), "menu toggle (2)"); // 5

        grid.find('.ui-hygrid-p-colhider').click();
        menu.find('li:eq(0)').trigger('click');
        ok(menu.find('li:eq(0) label input').is(':checked'), "input checked (0)"); // 6
        ok(grid.find('tbody tr:eq(0) td:eq(0)').is(':visible'), "show col OK (0)"); // 7

        grid.find('.ui-hygrid-p-colhider').click();
        menu.find('li:eq(1)').trigger('click');
        ok(grid.find('tbody tr:eq(0) td:eq(1)').is(':visible'), "show col OK (1)"); // 8

        grid.one('gridcoltoggled', function(){
            console.log(grid.find('tbody tr:eq(0) td:eq(0)'));
            ok(grid.find('tbody tr:eq(0) td:eq(0)').is(':hidden'), "hide col OK (0)"); // 9
            start();
        });
        grid.find('.ui-hygrid-p-colhider').click();
        menu.find('li:eq(0) input').click();
        stop();

        grid.one('gridcoltoggled', function(){
            ok(grid.find('tbody tr:eq(0) td:eq(0)').is(':hidden'), "hide col OK (1)"); // 10
            start();
        });
        grid.find('.ui-hygrid-p-colhider').click();
        menu.find('li:eq(0)').click();
        stop();


        grid.one('gridcoltoggled', function(){
            ok(grid.find('tbody tr:eq(0) td:eq(1)').is(':visible'), "show col OK (0)"); // 11
            start();
        });
        
        grid.find('.ui-hygrid-p-colhider').trigger('click');
        menu.find('li:eq(1)').trigger('click');
        stop();

        grid.one('gridcoltoggled', function(){
            ok(grid.find('tbody tr:eq(0) td:eq(1)').is(':visible'), "show col OK (1)"); // 12
            start();
        });
        grid.find('.ui-hygrid-p-colhider').trigger('click');
        menu.find('li:eq(0)').trigger('click');
        stop();
        
        setTimeout(function(){
            ok(menu.is(':hidden'), 'menu hides after click');
            start();
            grid.remove();
        }, 150);
        stop();
    });
})(jQuery);
