/*
  jQuery ui.hygrid.selectable
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

$.extend($.ui.hygrid.defaults, {
    selectable: 2,
});

$.ui.plugin.add('hygrid', 'selectable', {
    initialized: function(e, ui) {
        if (!ui.options.ajax) {
            ui._('tbody').addClass('ui-clickable').find('tr').bind('click.selectable', function(){
                if ($(this).hasClass('ui-selected')) {
                    ui.unselectedRow = $(this);
                    ui._trigger('rowunselect');
                }
                else {
                    ui.selectedRow = $(this);
                    ui._trigger('rowselect');
                }
            });
        }
    },
    
    gridupdated: function(e, ui) {
        if (ui.options.ajax) {
            ui._('tbody').addClass('ui-clickable').find('tr').bind('click.selectable', function(){
                if ($(this).hasClass('ui-selected')) {
                    ui.unselectedRow = $(this);
                    ui._trigger('rowunselect');
                }
                else {
                    ui.selectedRow = $(this);
                    ui._trigger('rowselect');
                }
            });
        }
    },

    rowselect: function(e, ui) {
        if (ui.options.selectable != 2) {
            ui.selectedRow.siblings().removeClass('ui-selected');
        }
        ui.selectedRow.addClass('ui-selected');
        ui._trigger('rowselected');
    },

    rowunselect: function(e, ui) {
        ui.unselectedRow.removeClass('ui-selected');
        ui._trigger('rowunselected');
    },

    rowselected: function(e, ui) {},
    rowunselected: function(e, ui) {}
});
