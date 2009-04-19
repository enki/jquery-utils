/*
  jQuery ui.hygrid.htmltable
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

$.extend($.ui.hygrid.defaults, {
    htmltable: true,
});

$.ui.plugin.add('hygrid', 'htmltable', {
    initialize: function(e, ui) {
        var table = ui._('table');
        ui._('thead', table.find('thead'));
        ui._('tbody', table.find('tbody'));
        table.addClass('ui-widget')
            .attr({cellpadding:0, cellspacing:0});
    },
    initialized: function(e, ui) {
        ui._('thead').find('th')
                .disableSelection()
                .addClass('ui-state-default ui-hygrid-header')
                .each(function(x){
                    if (!ui.options.cols[x]) {
                        ui.options.cols[x] = {};
                    }
                    if ($('div', this).length == 0) {
                        var th = $('<div />').text($(this).text());
                        $(this).html(th);
                    }
                });
        ui.options.total = ui._('tbody').find('tr').length;
    },
    destroy: function(e, ui) {
        ui._('thead').find('th')
                .enableSelection()
                .removeClass('ui-state-default ui-hygrid-header');
    }
});

