/*
  jQuery ui.hygrid.pagination
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php
*/

(function($){

var initialized = false;

$.extend($.ui.hygrid.defaults, {
    pagination: true,
    page: 1,
    rpp: 5,
    rppSelect: [5, 10, 15, 20],
    pager: '{start:d}-{end:d}/{total:d}, page: {page:d} of {pagetotal:d}'
});

$.ui.plugin.add('hygrid', 'pagination', {
    initialize: function(e, ui) {
        ui.options.toolbarTop = true;
        ui.options.toolbarBottom = true;
        ui.options.params.push('page', 'rpp');
        
        ui._('pager.first', $.tpl('hygrid.button', {label: 'first'}));
        ui._('pager.next',  $.tpl('hygrid.button', {label: 'next'}));
        ui._('pager.prev',  $.tpl('hygrid.button', {label: 'prev'}));
        ui._('pager.last',  $.tpl('hygrid.button', {label: 'last'}));

        if (ui.options.pager) {
            ui._('pager.pager', $('<span class="ui-hygrid-pager" />'));
        }
        
        if ($.isArray(ui.options.rppSelect)) {
            var rppSelect = [];
            for (x in ui.options.rppSelect) {
                rppSelect.push($.format('<option value="{0:s}">{0:s}</option>', ui.options.rppSelect[x]));
            }
            ui._('pager.rppSelect', $('<select class="ui-hygrid-rppSelect"/>').append(rppSelect.join('')));
        }
    },

    initialized: function(e, ui) {
        if (ui._('pager.rppSelect')) {
            ui._('pager.rppSelect').bind('change.pagination', function(){
                ui.options.rpp = parseInt($(this).val(), 10);
                ui._trigger('refresh');
            }).appendTo(ui._('toolbarBottom'));
        }

        ui._('pager.first').bind('click.pagination', function(){
            ui.options.page = 1;
            ui._trigger('refresh');
        }).appendTo(ui._('toolbarBottom'));

        ui._('pager.prev').bind('click.pagination', function(){
            ui.options.page = parseInt(ui.options.page, 10) > 1 && parseInt(ui.options.page, 10) - 1 || 1;
            ui._trigger('refresh');
        }).appendTo(ui._('toolbarBottom'));

        ui._('pager.next').bind('click.pagination', function(){
            ui.options.page = parseInt(ui.options.page, 10) + 1;
            ui._trigger('refresh');
        }).appendTo(ui._('toolbarBottom'));
        
        ui._('pager.last').bind('click.pagination', function(){
            ui.options.page = Math.max(ui.options.total/ui.options.rpp, 2);
            ui._trigger('refresh');
        }).appendTo(ui._('toolbarBottom'));

        if (ui.options.pager) {
            ui._('pager.pager').appendTo(ui._('toolbarBottom'));
        }
        initialized = true;
    },
    
    dataloaded: function(e, ui) {
        if (ui.options.pager) {
            ui._('pager.pager').text($.format(ui.options.pager, {
                page: ui.options.page,
                pagetotal: Math.max(ui.options.total/ui.options.rpp, 2),
                start: (ui.options.page *  ui.options.rpp) - ui.options.rpp,
                end: ui.options.page * ui.options.rpp,
                total: ui.options.total
            }));
        }
    },

    refresh: function(e, ui) {
        if(ui.options.rpp && ui.options.page) {
            var end   = ui.options.page * ui.options.rpp;
            var start = (ui.options.page *  ui.options.rpp) - ui.options.rpp;
            var $tr = ui._('tbody').find('tr');
            
            ui._('pager.next').attr('disabled', false);
            ui._('pager.prev').attr('disabled', false);
            ui._('pager.first').attr('disabled', false);
            ui._('pager.last').attr('disabled', false);

            if (start == 0) {
                ui._('pager.prev').attr('disabled', true);
                ui._('pager.first').attr('disabled', true);
            }
            else if ((ui.options.htmltable && end > ui.options.total) || end >= ui.options.total) {
                ui._('pager.next').attr('disabled', true);
                ui._('pager.last').attr('disabled', true);
                start = ui.options.total - ui.options.rpp;
                end = ui.options.total;
            }
            if (ui.options.pager) {
                ui._('pager.pager').text($.format(ui.options.pager, {
                    page: ui.options.page,
                    pagetotal: Math.max(ui.options.total/ui.options.rpp, 2),
                    start: start,
                    end: end,
                    total: ui.options.total
                }));
            }
            if (ui.options.htmltable) {
                $tr.hide().slice(start, end).show();
            }
        }
    },

    coltoggled: function(e, ui) {
        var $ths = $('th:visible', ui._('thead'));
        $ths.eq($ths.length - 2).css('width', 'auto');
    },

    destroy: function(e, ui) {
        if (ui._('pager.next'))      { ui._('pager.next').remove(); }
        if (ui._('pager.prev'))      { ui._('pager.prev').remove(); }
        if (ui._('pager.first'))     { ui._('pager.first').remove(); }
        if (ui._('pager.last'))      { ui._('pager.last').remove(); }
        if (ui._('pager.pager'))     { ui._('pager.pager').remove(); }
        if (ui._('pager.rppSelect')) { ui._('pager.rppSelect').remove(); }
    }
});
})(jQuery);
