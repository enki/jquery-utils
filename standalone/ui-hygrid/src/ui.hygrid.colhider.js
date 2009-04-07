/*
  jQuery ui.hygrid.colhider
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

$.tpl('colhider.menu',     '<ul class="ui-hygrid-p-colhider-menu ui-helper-hidden ui-helper-reset ui-widget-content" />');
$.tpl('colhider.menuItem', '<li class="ui-corner-all ui-helper-reset"><label><input type="checkbox" /> {label:s}</label></li>');

$.ui.plugin.add('hygrid', 'colhider', {
    rowinserted: function(e, ui) {
        ui.insertedRow.append('<td class="ui-hygrid-blank">&nbsp;</td>');
    },
    initialize: function(e, ui) {
        $.extend($.ui.hygrid.cellModifiers, {
            hide:  function(el, cell, type){ 
                if (cell.hide) { el.hide(); } 
            }
        });
    },
    initialized: function(e, ui) {
        ui.options = $.extend({colhider: true}, ui.options);
        
        if (ui.options.colhider) {
            ui._('colhidermenu ', $.tpl('colhider.menu').prependTo(ui._('wrapper')));
            var thead = ui._('thead');
            var tbody = ui._('tbody');
            var menu  = ui._('colhidermenu ');
            ui._fixCellIndex = ui._fixCellIndex + 1;
            $th = thead.find('th');

            // create menu
            // TODO: when input:checked.length == 1 disable clicking
            $th.slice(0, $th.length).each(function(i){
                var e   = $.Event();
                var lbl = $(this).text();
                $.tpl('colhider.menuItem', {label: lbl})
                    .data('colindex', i)
                    .bind('click.colhider', function(){
                        var $self = $(this);
                        var menu  = $self.parents('ul');
                        var index = $self.data('colindex');
                        ui.toggledCol = ui.col(index);
                        //console.log(index, ui.col(index));
                        if ($self.find('input').is(':checked')) {
                            ui.toggledCol.hide();
                        }
                        else {
                            ui.toggledCol.show();
                        }
                        ui._setColOption(index, 'hide', ui.toggledCol.is(':hidden'));
                        setTimeout(function() {
                            menu.hide();
                            ui._trigger('coltoggled');
                        }, 100); // let the user see the check mark before hiding
                    })
                    .find('input')
                        .attr('checked', !ui._getColOptions(i, 'hide')).end()
                    .appendTo(menu);
            });
            // create button
            $('<th class="ui-hygrid-p-colhider ui-state-default"><span class="ui-icon ui-icon-gridmenu" />').width(16)
                .bind('click.colhider', function() {
                    menu.css({
                        top: tbody.position().top,
                        left: $(this).position().left
                    }).toggle();
                })
                .hover(function(){ $(this).addClass('ui-state-hover');}, 
                       function(){ $(this).removeClass('ui-state-hover'); 
                }).appendTo(thead.find('tr'));
        }
    }
});
