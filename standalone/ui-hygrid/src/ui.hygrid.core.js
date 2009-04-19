/*
  jQuery ui.hygrid.htmltable
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

$.extend($.ui.hygrid.defaults, {
    core: true,
    toolbar: true,
    total: 0
});

$.tpl('hygrid.button',        '<button class="ui-state-default ui-corner-all">{label:s}</button>');
$.tpl('hygrid.toolbarTop',    '<thead class="ui-hygrid-toolbar top ui-widget-header"><tr><td></td></tr></thead>');
$.tpl('hygrid.toolbarBottom', '<tfoot class="ui-hygrid-toolbar bottom ui-widget-header"><tr><td></td></tr></tfoot>');

$.ui.plugin.add('hygrid', 'core', {
    initialize: function(e, ui) {
        if (ui.element.get(0).nodeName != 'TABLE') {
            throw('hygrid: Node must be a table element');
        }
        else {
            $.extend($.ui.hygrid.cellModifiers, {
                label: function(el, cell){ 
                    if (cell.isTH) {
                        el.find('div').text(cell.label)
                    }
                },
                align: function(el, cell){ 
                    el.find('div').andSelf().css('text-align', cell.align); 
                },
                width: function(el, cell, col){ 
                    if (cell.isTH && (this.options.width == 'auto' || col < this.options.cols.length)) { 
                        el.find('div').andSelf().width(cell.width);
                    }
                },
                format:  function(el, cell){ 
                    if (cell.isTD && cell.text && cell.text.length) {
                        var f = (cell.format.indexOf('{') == -1)? '{0:'+ cell.format +'}': cell.format;
                        el.text($.format(f, cell.text)); 
                    }
                }
            });

            ui._('table',   ui.element);
            ui._('wrapper', ui.element.wrap('<div class="ui-hygrid" />').parent());
            ui.hasFocus = false;
            ui._('wrapper').bind('click.focusHandler', function() {
                if (!ui.hasFocus) {
                    ui.hasFocus = true;
                    ui._trigger('focus');
                }
            });
            $('html').bind('click.focusHandler', function(e) {
                if (ui.hasFocus && !$(e.originalTarget).parents('div.ui-hygrid').length) {
                    ui.hasFocus = false;
                    ui._trigger('blur');
                }
            });
        }
    },

    initialized: function(e, ui) {
        var cols = ui.options.colhider && ui.cols()+1 || ui.cols();
        if (ui.options.toolbarTop) {
            var tbt = ui._('table').find('thead');
            if (tbt.length == 0) {
                tbt = $.tpl('hygrid.toolbarTop').prependTo(ui._('table'));
            }
            ui._('toolbarTop', tbt.find('td:first').attr('colspan', cols));
        }
        if (ui.options.toolbarBottom) {
            ui._('toolbarBottom', $.tpl('hygrid.toolbarBottom').appendTo(ui._('table')).find('td:first').attr('colspan', cols));
        }
    },
    destroy: function(e, ui) {
        ui._('wrapper').unbind('click.focusHandler');
        $('html').unbind('click.focusHandler');
        ui._('toolbarBottom').remove();
        ui._('table').removeClass('ui-widget').insertAfter(ui._('wrapper'));
        ui.element.prev().remove();
        ui.element.data('hygrid', false);
    },
    refresh: function(e, ui) {
        ui._('thead').find('th.ui-hygrid-header')
            .each(function(x){
                if (ui.options.cols[x]) {
                    // apply modifiers to column header
                    ui.options.cols[x].isTH = !(ui.options.cols[x].isTD = false);
                    ui._applyCellModifiers(this, ui.options.cols[x], x);
                    // apply modifiers to column cells, cell.text/isTD/isTH are used as a temporary buffer (hackish but straight forward)
                    ui.col(x, true).each(function(){
                        ui.options.cols[x].text = $(this).text();
                        ui.options.cols[x].isTH = !(ui.options.cols[x].isTD = true);
                        ui._applyCellModifiers(this, ui.options.cols[x], x);
                    });
                }
            });
        ui._setGridWidth();
        var cols = ui.options.colhider && ui.cols()+1 || ui.cols();
        if (ui.options.toolbarTop) {
            ui._('toolbarTop').find('td:first').attr('colspan', cols);
        }
        if (ui.options.toolbarBottom) {
            ui._('toolbarBottom').find('td:first').attr('colspan', cols);
        }
    }
});

