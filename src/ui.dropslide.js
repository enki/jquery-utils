/*
  jQuery ui.dropslide - 0.1
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

$.widget('ui.dropslide', {
    getter: 'activate',
    init: function(){
        var self = this;
        var ds   = self.element.parent();
        self.dropslide = ds.get(0) && ds || self.options.tree;

        if (self.dropslide) {
            self.active = self.options.active;
            self.element.bind(self.options.trigger, self.activate);
            console.log(self.dropslide);
            self.dropslide
                .find('ol').insertAfter(self.options.clear()).end();
        }
    },

    // -- public methods
        
    /* Shows up the first menu level
     * */
    activate: function() {
        console.log('boo');
    },

    /*  Enable the plugin
     * */
    enable: function() {
        return self.active = true;
    },

    /* Disable the plugin
     */
    disable: function() {
        return !(self.active = false);
    }
});
$.ui.dropslide.defaults = {
    active:  true,
    tree:    false,
    mode:    '2d',
    trigger: 'mouseover',
    clear:   function() {
        return $('<div style="clear:both;" />');
    }
};
$(function(){
    $('.ui-dropslide-trigger').dropslide();
});
