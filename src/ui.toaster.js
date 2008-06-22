(function($){
/* jQuery ui.toaster.js - 0.1rc1
 *
 * (c) Maxime Haineault <haineault@gmail.com>
 * http://haineault.com 
 * 
 * MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * Inspired by experimental ui.toaster.js by Miksago (miksago.wordpress.com)
 * Thanks a lot.
 *
 * */

$.widget('ui.toaster', {
    init: function(){
        var self = this;
        self.toaster = $('<div style="display:none;" />')
            .addClass('ui-toaster ui-toaster-'+ self.options.position)
            .append($('<span class="ui-toaster-border-tr" /><span class="ui-toaster-border-tl" /><span class="ui-toaster-border-tc" />'))
            .append($('<span class="ui-toaster-body" />').html($('<div />').append($(self.element).html())))
            .append($('<span class="ui-toaster-border-br" /><span class="ui-toaster-border-bl" /><span class="ui-toaster-border-bc" />'))
            .width(self.options.width)
            .appendTo('body');

        if (self.options.closable) {
            self.toaster.addClass('ui-toaster-closable');
            if ($(self.toaster).find('.ui-toaster-close').length > 0) {
                $('.ui-toaster-close', $(self.toaster)).click(function(){ self.hide.apply(self); });
            }
            else {
                $(self.toaster).click(function(){ self.hide.apply(self); });
            }
        }
        if (!self.options.sticky) {
            setTimeout(function(){
                self.options.close.apply(self.toaster);
            }, self.options.timeout * 1000 + self.options.delay * 1000);
        }
        else {
            $(self.toaster).addClass('ui-toaster-sticky');
        }

        if (!!self.options.delay) {
           setTimeout(function(){
                self.options.show.apply(self.toaster);
            }, self.options.delay * 1000);
        }
        else {
            self.options.show.apply(self.toaster);
        }
    },
    open: function() {
        this.options.show.apply(this.toaster);
    },
    hide: function(){
        if (this.options.onHide) this.options.onHide.apply(this.toaster);
        this.close(this.options.hide);
    },
    close: function(effect) {
        var self = this;
        var effect = effect || self.options.close;
        var onClose = function(){
            if (self.options.onClosed) self.options.onClosed.apply(self.toaster);
            $(self.toaster).remove();
        };
        if (self.options.onClose) effect.apply(self.toaster);
        effect.apply(self.toaster, [self.options.speed], onClose);
    }
});

$.ui.toaster.defaults = {
    delay:    0,
    timeout:  3,
    height:   'auto',
    width:    200,
    position: 'br',
    speed:    'slow',
    closable: true,
    sticky:   false,
    onClose:  false,
    onClosed: false,
    onOpen:   false,
    onOpened: false,
    onHide:   false,
    show:     $.fn.slideDown, 
    hide:     $.fn.fadeOut, // closed by user
    close:    $.fn.slideUp  // timeout
//  stack:    true, v0.2
};
 })(jQuery);
