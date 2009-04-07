/*
  jQuery ui.hygrid.search
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php
*/

$.extend($.ui.hygrid.defaults, {
    search: true,
});

$.tpl('hygrid.searchInput', '<input class="ui-hygrid-search ui-corner-all" type="text" value="" />');

$.ui.plugin.add('hygrid', 'search', {
    initialize: function(e, ui) {
        ui._('search.input', $.tpl('hygrid.searchInput'));
    },

    initialized: function(e, ui) {
        ui._('search.input')
            .delayedObserver(function(){
                ui.searchString = this.val();
                ui._trigger('startsearch');
            }, 0.5)
            .prependTo(ui._('toolbarBottom'));
    },
    searchstart: function(e, ui) {
        $td = ui._('tbody').find('td');
        $td.css('font-weight', 'normal').parent().removeClass('ui-highlight');
        ui.searchResult = $td.filter(':icontains('+ ui.searchString +')').css('font-weight', 'bold').parent().addClass('ui-highlight');
        ui._('tbody').find('tr.ui-highlight:first').prevAll().hide();
        ui._trigger('searchend');
    },
    searchend: function(e, ui) {
    
    }

});
