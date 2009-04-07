/*
  jQuery ui.hygrid.resizable - @VERSION
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

(function($) {if ($.ui.hygrid) {
    $.ui.hygrid.plugins.resizable = {
        _init: function() {
            this.options = $.extend({resizable: true}, this.options);
        },
        _ready: function() {
            var widget = this;
            if (widget.options.resizable) {
                widget.ui.wrapper.resizable({
                    ghost: true,
                    minWidth:  widget.options.width,
                    stop: function() {
                        $('table', this).width($(this).width()).height($(this).height());
                    }
                });
            }
        }
    };
}})(jQuery);
