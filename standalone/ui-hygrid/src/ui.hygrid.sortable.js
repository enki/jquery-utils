/*
  jQuery ui.hygrid.sortable
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php
*/

$.extend($.ui.hygrid.defaults, {
    sortable: true,
});

$.ui.plugin.add('hygrid', 'sortable', {
    initialize: function(e, ui) {
        $.extend($.ui.hygrid.cellModifiers, {
            sortable:  function(el, cell, type){ 
                if (type == 'th' && !el.hasClass('ui-sortable')) {
                    el.addClass('ui-sortable')
                        .prepend('<span class="ui-unsorted ui-icon ui-icon-triangle-2-n-s" />');
                }
            }
        });
    }
});
/*
(function($) {if ($.ui.hygrid) {
    $.ui.hygrid.plugins.sortable = {
        _init: function() {
            widget = this;
            widget.options = $.extend({sortable: true}, widget.options);
            widget.params  = $.extend({sortname: '', sortorder: 'asc'});
            $.ui.hygrid.cellModifiers.sortable = function(el, cell, type){ 
                if (type == 'th' && cell.sortable) { 
                    el.addClass('ui-sortable')
                        .hover(function(){ $(this).addClass('ui-state-hover');}, 
                               function(){ $(this).removeClass('ui-state-hover'); })
                        .bind('click.sortable', function() {
                            $(this).removeClass('ui-state-default').addClass('ui-tabs-selected ui-state-active')
                                .siblings().removeClass('ui-tabs-selected ui-state-active').addClass('ui-state-default');

                        });
                    $('<span class="ui-unsorted ui-icon ui-icon-triangle-2-n-s" />').prependTo(el); 
                }
            }
        },
        _params: function() {
            
        }
    };
}})(jQuery);
*/
