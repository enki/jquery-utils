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
    
    test("Static initialization from table", function() {
        expect(10);
        var testdiv = $('<div />').appendTo('#main');
        testdiv.html(testtable)
            .bind('gridinitialized.test', function(){
                ok(true, 'gridinitialized event is called upon init');
            })
            .hygrid({colhider:false});

        equals(testdiv.find('thead').length, 1, "thead");
        equals(testdiv.find('tbody').length, 1, "tbody");
        equals(testdiv.find('tr').length, 3, "tr length");
        equals(testdiv.find('th').length, 2, "th length");
        equals(testdiv.find('td').length, 4, "td length");
        equals(testdiv.find('table').parent().get(0).nodeName, 'DIV', "Table has been wrapped with a div");
        equals(testdiv.text(), 'ABA1B2', "Data integrity");
        equals(testdiv.find('table').width(), testdiv.width(), "Table width == parent width");
        ok(testdiv.hasClass('ui-hygrid'), "Parent div has ui-hygrid class");
        testdiv.remove();
    });

    test("Static initialization from div", function() {
        expect(10);
        var testdiv = $('<div />').appendTo('#main');
        testdiv.html(testtable).hygrid({colhider:false});

        equals(testdiv.data('hygrid').options.width, 'auto', "with is auto by default");
        equals(testdiv.data('hygrid').options.data,  false, "data is false by default");
        equals(testdiv.find('tbody').length, 1, "tbody length");
        equals(testdiv.find('tr').length, 3, "tr length");
        equals(testdiv.find('th').length, 2, "th length");
        equals(testdiv.find('td').length, 4, "td length");
        equals(testdiv.text(), 'ABA1B2', "Data integrity");
        ok(testdiv.find('thead th').hasClass('ui-state-default'), "TH have ui-state-default class");
        ok(testdiv.hasClass('ui-hygrid'), "Div has ui-hygrid class");
        equals(testdiv.width(), testdiv.find('table').width(), "Table width == parent width");
        testdiv.remove();
    });

    test("Core methods", function() {
        expect(15);
        var testdiv = $('<div />').appendTo('#main');
        testdiv.html(testtable).hygrid();
        testdiv.hygrid('col', 0).data('test', 'abc');
        equals($('thead th:eq(0)', testdiv).data('test'), 'abc', "hygrid.col: OK (0)");
        equals($('thead th:eq(0)', testdiv).data('test'), 'abc', "hygrid.col: OK (1)");
        equals($('tbody td:eq(0)', testdiv).data('test'), 'abc', "hygrid.col: OK (2)");
        testdiv.hygrid('col', 1, true).data('test', 'def')
        ok(typeof($('thead th:eq(1)', testdiv).data('test') == 'undefined'), "hygrid.col: thead second col OK (exlude header)");
        equals($('tbody td:eq(1)', testdiv).data('test'), 'def', "hygrid.col: tbody second col OK (exlude header)");
        testdiv.one('click', function(e){ ok(e, "hygrid.trigger: OK"); }).trigger('click');
        testdiv.bind('click.test', function(e){ ok(e, "hygrid.bind: OK"); }).trigger('click');
        equals(testdiv.hygrid('row', 0).text(), 'A1', "hygrid.row: OK (0)");
        equals(testdiv.hygrid('row', 1).text(), 'B2', "hygrid.row: OK (1)");
        testdiv.hygrid('row', ['C','3']);
        equals(testdiv.hygrid('row', 2).text(), 'C3', "hygrid.row: insert OK (2)");
        equals(testdiv.hygrid('cells').text(), 'A1B2C3', "hygrid.cells: OK");
        equals(testdiv.hygrid('cell', 0, 0).text(), 'A', "hygrid.cell: OK (0)");
        equals(testdiv.hygrid('cell', 1, 0).text(), '1', "hygrid.cell: OK (1)");
        equals(testdiv.hygrid('cell', 0, 1).text(), 'B', "hygrid.cell: OK (2)");
        equals(testdiv.hygrid('cell', 1, 1).text(), '2', "hygrid.cell: OK (3)");
        testdiv.remove();
    });

    test("Core options", function() {
        expect(4);
        var testdiv = $('<div />').appendTo('#main');
        testdiv.hygrid('destroy').html(testtable).hygrid({width: 500});
        ok(testdiv.width() == 500, "hygrid.options.width: 500 OK");
        testdiv.hygrid('destroy').html(testtable).hygrid({width: 'fill'});
        ok(testdiv.width() == testdiv.parent().width(), "hygrid.options.width: fill OK");
        testdiv.remove();
        var testdiv = $('<div />').appendTo('#main');
        testdiv.hygrid('destroy').html(testtable).hygrid({caption: 'ABC123'});
        ok(testdiv.find('table > caption').get(0), "hygrid.options.caption: OK (0)");
        equals(testdiv.find('table > caption').text(), 'ABC123', "hygrid.options.caption: OK (1)");
        testdiv.remove();
    });

    test("Core cell modifiers", function() {
        expect(10);
        var testdiv = $('<div />').appendTo('#main');
        testdiv.html(testtable).hygrid({cols: [{label: 'Y'}]});
        equals(testdiv.find('thead th:eq(0)').text(), 'Y', 'hygrid.cellModifiers.label (0)');
        equals(testdiv.find('thead th').text(), 'YB', 'Cell modifiers works if partially specified');
        testdiv.remove();
        var testdiv = $('<div />').appendTo('#main');
        testdiv.html(testtable).hygrid({a:'b',cols: [{label: 'Y'}, {label: 'Z'}]});
        equals(testdiv.find('thead th').text(), 'YZ', 'hygrid.cellModifiers.label (1):');
        testdiv.remove();
        var testdiv = $('<div />').appendTo('#main');
        testdiv.html(testtable).hygrid({cols: [{width: 100}, {width: 200}]});
        equals(testdiv.find('thead th:eq(0)').width(), 100, 'hygrid.cellModifiers.width (0)');
        equals(testdiv.find('thead th:eq(1)').width(), 200, 'hygrid.cellModifiers.width (1)');
        testdiv.remove();
        var testdiv = $('<div />').appendTo('#main');
        testdiv.html(testtable).hygrid({colhider:false,width: 500, cols: [{width: 200}, {width: 200}]});
        
        equals(testdiv.find('thead th:eq(0)').width(), 200, 'hygrid.cellModifiers.width: conflicking widths OK (0)');
        ok(testdiv.find('thead th:eq(1)').width() != 300,   'hygrid.cellModifiers.width: conflicking widths OK (1)');
        equals(testdiv.width(),                        500, 'hygrid.cellModifiers.width: conflicking widths OK (2)');
        testdiv.remove();
        var testdiv = $('<div />').appendTo('#main');
        testdiv.html(testtable).hygrid({cols: [{align: 'left'}, {align: 'center'}]});

        equals(testdiv.find('thead th:eq(0)').css('text-align'), 'left', 'hygrid.cellModifiers.align: OK (0)');
        equals(testdiv.find('thead th:eq(1)').css('text-align'), 'center', 'hygrid.cellModifiers.align: OK (1)');
        testdiv.remove();
    });
})(jQuery);

