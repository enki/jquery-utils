/*
  jQuery ui.hygrid.colhider
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

$.extend($.ui.hygrid.defaults, {
    colhider: true
});

$.tpl('colhider.menu',     '<ul class="ui-hygrid-p-colhider-menu ui-helper-hidden ui-helper-reset ui-widget-content" />');
$.tpl('colhider.menuItem', '<li class="ui-corner-all ui-helper-reset"><label><input type="checkbox" /> {label:s}</label></li>');
$.tpl('colhider.button',   '<th class="ui-hygrid-p-colhider ui-state-default"><span class="ui-icon ui-icon-gridmenu" />');
$.ui.plugin.add('hygrid', 'colhider', {
    initialize: function(e, ui) {
        $.extend($.ui.hygrid.cellModifiers, {
            hide:  function(el, cell, type){ 
                el.hide();
            }
        });
    },
    initialized: function(e, ui) {
        ui._fixCellInex++;
        ui._('colhidermenu', $.tpl('colhider.menu').prependTo(ui._('wrapper')));
        var thead = ui._('thead');
        var tbody = ui._('tbody');
        var menu  = ui._('colhidermenu');
        $th = thead.find('th');
    
        if (ui.options.htmltable) {
            tbody.find('tr').append('<td />');
        }
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
                    var checked = $self.find('input').is(':checked');
                    ui.toggledCol = ui.col(index);
                    ui._setColOption(index, 'hide', !checked);
                    if (checked) {
                        ui.col(index).show();
                    }
                    ui._trigger('coltoggled');
                    ui.preventAjaxRefresh = true;
                    ui._trigger('refresh');
                    ui.preventAjaxRefresh = false;
                    setTimeout(function() {
                        menu.hide();
                    }, 100); // let the user see the check mark before hiding
                })
                .find('input')
                    .attr('checked', !ui._getColOptions(i, 'hide')).end()
                .appendTo(menu);
        });
        // create button
        ui._('colhiderButton', $.tpl('colhider.button').width(16)
            .bind('click.colhider', function() {
                if (menu.is(':visible')) {
                    menu.hide();
                }
                else {
                    menu.css({
                        top: tbody.position().top,
                        left: $(this).position().left
                    }).show();
                }
            })
            .hover(function(){ $(this).addClass('ui-state-hover');}, 
                   function(){ $(this).removeClass('ui-state-hover'); 
            }).appendTo(thead.find('tr')));
    },

    blur: function(e, ui) {
        ui._('colhidermenu').hide();
    },

    rowinserted: function(e, ui) {
        e.originalEvent.insertedRow.append('<td />');
    },
    destroy: function(e, ui) {
        ui._('colhidermenu').remove();
        ui._('colhiderButton').remove();
        ui._('tbody').find('tr td:last-child').remove();
    }
});
