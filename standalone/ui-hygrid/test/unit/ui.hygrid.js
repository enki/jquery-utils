(function($){
    module("hygrid");
    test("Basic requirements", function() {
        expect(5);
        // jQuery dependencies 
        ok( jQuery, "jQuery" );
        ok( jQuery.ui, "jQuery.ui" );
        ok( jQuery.widget, "jQuery.widget");
        // jQuery utils dependencies
        ok( jQuery.format, "jQuery.format()" );
        ok( jQuery.tpl, "jQuery.tpl()" );
    });
    
    test("Static initialization", function() {
        expect(10);
        var grid = $(testtable).appendTo('#main')
                .bind('gridinitialized.test', function(){
                    ok(true, 'gridinitialized event is called upon init');
                })
                .hygrid({colhider:false, pagination: false});
        equals(grid.find('thead').length, 1, "thead");
        equals(grid.find('tbody').length, 1, "tbody");
        equals(grid.find('tr').length, 4, "tr length");
        equals(grid.find('th').length, 2, "th length");
        equals(grid.find('td').length, 5, "td length");
        equals(grid.parent().get(0).nodeName, 'DIV', "Table has been wrapped with a div");
        equals(grid.text(), 'ABA1B2', "Data integrity");
        equals(grid.width(), grid.parent().width(), "Table width == parent width");
        ok(grid.parent().hasClass('ui-hygrid'), "Parent div has ui-hygrid class");
        grid.remove();
    });


    test("Core methods", function() {
        expect(15);
        var grid = $(testtable).appendTo('#main').hygrid();
        grid.hygrid('col', 0).data('test', 'abc');
        equals($('thead th:eq(0)', grid).data('test'), 'abc', "hygrid.col: OK (0)");
        equals($('thead th:eq(0)', grid).data('test'), 'abc', "hygrid.col: OK (1)");
        equals($('tbody td:eq(0)', grid).data('test'), 'abc', "hygrid.col: OK (2)");
        grid.hygrid('col', 1, true).data('test', 'def')
        ok(typeof($('thead th:eq(1)', grid).data('test') == 'undefined'), "hygrid.col: thead second col OK (exlude header)");
        equals($('tbody td:eq(1)', grid).data('test'), 'def', "hygrid.col: tbody second col OK (exlude header)");
        grid.one('click', function(e){ ok(e, "hygrid.trigger: OK"); }).trigger('click');
        grid.bind('click.test', function(e){ ok(e, "hygrid.bind: OK"); }).trigger('click');
        equals(grid.hygrid('row', 0).text(), 'A1', "hygrid.row: OK (0)");
        equals(grid.hygrid('row', 1).text(), 'B2', "hygrid.row: OK (1)");
        grid.hygrid('insertRow', ['C','3']);
        equals(grid.hygrid('row', 2).text(), 'C3', "hygrid.row: insert OK (2)");
        equals(grid.hygrid('cells').text(), 'A1B2C3', "hygrid.cells: OK");
        equals(grid.hygrid('cell', 0, 0).text(), 'A', "hygrid.cell: OK (0)");
        equals(grid.hygrid('cell', 1, 0).text(), '1', "hygrid.cell: OK (1)");
        equals(grid.hygrid('cell', 0, 1).text(), 'B', "hygrid.cell: OK (2)");
        equals(grid.hygrid('cell', 1, 1).text(), '2', "hygrid.cell: OK (3)");
        grid.remove();
    });

    test("Core options", function() {
        expect(4);
        var grid = $(testtable).appendTo('#main').hygrid({width: 500});
        ok(grid.width() == 500, "hygrid.options.width: 500 OK");
        grid.hygrid('destroy')

        var div = $('<div>').appendTo('#main').width(500);
        var grid = $(testtable).appendTo(div).hygrid({width: 'fill'});
        ok(grid.width() == div.width(), "hygrid.options.width: fill OK");
        grid.remove();

        var grid = $(testtable).appendTo('#main').hygrid({caption: 'ABC123'});
        ok(grid.find('caption').get(0), "hygrid.options.caption: OK (0)");
        equals(grid.find('caption').text(), 'ABC123', "hygrid.options.caption: OK (1)");
        grid.remove();
    });

    test("Core cell modifiers", function() {
        expect(10);
        var grid = $(testtable).appendTo('#main').hygrid({cols: [{label: 'Y'}]});
        equals(grid.find('thead th:eq(0)').text(), 'Y', 'hygrid.cellModifiers.label (0)');
        equals(grid.find('thead th').text(), 'YB', 'Cell modifiers works if partially specified');
        grid.remove();
        var grid = $(testtable).appendTo('#main').hygrid({a:'b',cols: [{label: 'Y'}, {label: 'Z'}]});
        equals(grid.find('thead th').text(), 'YZ', 'hygrid.cellModifiers.label (1):');
        grid.remove();
        var grid = $(testtable).appendTo('#main').hygrid({cols: [{width: 100}, {width: 200}]});
        equals(grid.find('thead th:eq(0)').width(), 100, 'hygrid.cellModifiers.width (0)');
        equals(grid.find('thead th:eq(1)').width(), 200, 'hygrid.cellModifiers.width (1)');
        grid.remove();
        var grid = $(testtable).appendTo('#main').hygrid({colhider:false,width: 500, cols: [{width: 200}, {width: 200}]});
        console.log(grid.find('thead th:eq(0)').width(), grid.find('thead th:eq(1)').width());
        equals(grid.find('thead th:eq(0)').width(), 200, 'hygrid.cellModifiers.width: conflicking widths OK (0)');
        ok(grid.find('thead th:eq(1)').width() != 300,   'hygrid.cellModifiers.width: conflicking widths OK (1)');
        equals(grid.width(),                        500, 'hygrid.cellModifiers.width: conflicking widths OK (2)');
        grid.remove();
        var grid = $(testtable).appendTo('#main').hygrid({cols: [{align: 'left'}, {align: 'center'}]});
        equals(grid.find('thead th:eq(0)').css('text-align'), 'left', 'hygrid.cellModifiers.align: OK (0)');
        equals(grid.find('thead th:eq(1)').css('text-align'), 'center', 'hygrid.cellModifiers.align: OK (1)');
        grid.remove();
    });
})(jQuery);

