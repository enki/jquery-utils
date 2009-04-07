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

$.tpl('hygrid.table',   '<table class="ui-widget" cellpadding="0" cellspacing="0" summary=""><thead /><tbody /><tfoot /></table>');
$.ui.plugin.add('hygrid', 'htmltable', {
    initialize: function(e, ui) {
        var table = (ui._('wrapper').find('table').length > 0) ? ui._('wrapper').find('table') : $.tpl('hygrid.table');
        ui._('table', table);
        ui._('thead', table.find('thead'));
        ui._('tbody', table.find('tbody'));
        table.addClass('ui-widget')
            .attr({cellpadding:0, cellspacing:0})
            .appendTo(ui._('wrapper'));
    },
    initialized: function(e, ui) {
        var thead = ui._('thead');
        $th = thead.find('th')
                .disableSelection()
                .addClass('ui-state-default ui-hygrid-header')
                .each(function(x){
                    if ($('div', this).length == 0) {
                        var th = $('<div />').text($(this).text());
                        $(this).html(th);
                    }
                });
        ui.options.total = ui._('tbody').find('tr').length;
    }
});

