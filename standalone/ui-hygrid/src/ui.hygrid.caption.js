/*
  jQuery ui.hygrid.caption
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php
*/
(function($){

 $.ui.hygrid.defaults.caption = false;
$.tpl('hygrid.caption', '<caption class="ui-hygrid-caption ui-widget-header">{caption:s}</caption>');

$.ui.plugin.add('hygrid', 'caption', {
    initialized: function(e, ui) { 
        ui._('caption', $.tpl('hygrid.caption', {caption: ui.options.caption}).prependTo(ui._('table')));
    },
    destroy: function(e, ui) {
        if (ui._('caption')) { ui._('caption').remove(); }
    }
});

})(jQuery);
