/*
  jQuery ui.builder - 0.1
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

  Dependencies
  ------------
  - jquery.utils.js
  - jquery.strings.js
  - jquery.ui.js
  
*/

(function($){
    var templates = {
        'ui.icon':     '<span class="ui-icon ui-icon-{icon:s}" />',
        'ui.input':    '<input type="{type:s}" class="ui-input ui-input-{type:s} ui-corner-{corner:s}" />',
        'ui.option':   '<option value="{value:s}" class="ui-input ui-input-option" selected="{selected:s}">{label:s}</option>',
        'ui.button':   '<a class="ui-state-default ui-corner-{corner:s} ui-button" href="#">{label:s}</a>',
        'ui.toolbar':  '<div class="ui-toolbar ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-{corner:s}" />',
        'ui.tabTitle': '<li class="ui-state-default ui-corner-{titleCorner:s}"><a href="#tabs-{id:s}">{title:s}</a></li>',
        'ui.tabBody':  '<div class="ui-tabs-panel ui-widget-content ui-corner-{panelCorner:s}" />',
        'ui.tabs': [
            '<div class="ui-tabs ui-widget-content ui-corner-{corner:s}">',
                '<ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-{navCorner:s}" />',
            '</div>'
        ],
        'ui.progressbar': [
            '<div class="ui-corder-{corners:s} ui-progressbar ui-widget ui-widget-content" role="{progressbar:s}" aria-valuemin="{valuemin:d}" aria-valuemax="{valuemax:d}" aria-valuenow="{valuenow:d}">',
                '<div class="ui-progressbar-value ui-widget-header ui-corner-{valCorner:s}" />',
            '</div>'
        ],
        'ui.message': [
            '<div class="ui-widget">',
                '<div class="ui-state-{state:s} ui-corner-{corner:s}">',
                    '<p><span style="float: left; margin-right: 0.3em;" class="ui-icon ui-icon-{icon:s}"/>',
                    '<strong>{title:s}:</strong> {body:s}.</p>',
                '</div>',
            '</div>'
        ]
    };
    
    for (i in templates) { $.tpl(i, templates[i]); }

    $.extend($.ui, {
        builder: {
            icon:    function(o, i) { return $.tpl('ui.icon',    $.extend({icon: 'bullet'}, o), i); },
            input:   function(o, i) { return $.tpl('ui.input',   $.extend({type: 'text', corner: 'none'}, o), i); },
            option:  function(o, i) { return $.tpl('ui.option',  $.extend({selected: 'false'}, o), i); },
            tabs:    function(o, i) { return $.tpl('ui.tabs',    $.extend({corner: 'all', navCorner: 'all'}, o), i); },
            toolbar: function(o, i) { return $.tpl('ui.toolbar', $.extend({corners: 'all'}, o), i); },
            message: function(o, i) { return $.tpl('ui.message', $.extend({corners: 'all', state: 'highlight', icon: 'false', title: '', body: ''}, o), i); },

            button:  function(o) {
                var tpl = $.tpl('ui.button', $.extend({icon: false, label: ''}, o));
                if (o.icon) { 
                    tpl.prepend($.tpl('ui.icon', {icon: o.icon})); 
                    tpl.addClass('ui-has-icon');
                }
                return tpl;
            },
 
            progressbar: function(o, i) {
                return $.tpl('ui.progressbar', $.extend({ 
                            valuemin: 0, valuemax: 100, valuenow: 
                            0, role: 'progressbar', valcorner: 'left' }, o), i);
            },

            tab: function(tabset, o) {
                var id    = $('.ui-tabs-nav li', tabset).length + 1;
                var opt   = $.extend({title: '', titleCorner: 'top', panelCorner: 'bottom', id: id}, o);
                var title = $.tpl('ui.tabTitle', opt);
                var body  = $.tpl('ui.tabBody',  opt).attr('id', 'tabs-'+ opt.id);
                $(tabset).find('ul.ui-tabs-nav').append(title).end().append(body);
                return body;
            }
        }         
    });
})(jQuery);
