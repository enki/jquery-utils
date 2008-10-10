/*
  jQuery ui.dropslide - 0.1
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

(function($){
    $.widget('ui.dropslide', $.extend({}, $.ui.mouse, {
        getter: 'activate',
        init: function(){
            var next     = this.element.next();
            this.wrapper = next.hasClass('ui-dropslide') && next || this.options.tree || false;

            if (this.wrapper) {
                this.element.bind(this.options.trigger +'.dropslide', onActivate);
                this.wrapper
                    .data('dropslide', this)
                    .css({width:this.options.width})
                    .find('li').bind('mouseover.dropslide', onLiMouseover)
                               .bind('mouseout.dropslide', onLiMouseout).end()
                    .find('ol').bind('mousemove.dropslide', onOlMousemove).hide();
            }
        },
        showLevel: function(id) {
           this.wrapper.find('ol').removeClass('active').eq(id).addClass('active').show();
        },
        showNextLevel: function(id) {
           this.wrapper.find('ol.active').removeClass('active').next('ol').addClass('active').show();
        }
            
    }));

    $.ui.dropslide.defaults = {
        enabled:  true,
        tree:    false,
        mode:    '2d',
        trigger: 'mouseover',
        clear:   function() {
            return $('<span style="clear:both;" />');
        },
        top: 6,
    };

    function onActivate(e){
        var dropslide = getDropSlide(this);
        dropslide.showLevel(0);
    };

    function onLiMouseover(e){
        var dropslide = getDropSlide(this);
        $(this).parent()
            .find('li').removeClass('hover').end().end()
            .addClass('hover');
        dropslide.showNextLevel();
    };

    function onLiMouseout(e){
        var dropslide = getDropSlide(this);
    };

    function onOlMousemove(e) {
        var dropslide = getDropSlide(this);
        var prevLI = false;
        var prevOL = false;
        var nextOL = false;
        var pos    = false;
        var offset = dropslide.element.position().left;
        dropslide.wrapper.find('ol').each(function(){
            prevOL = $(this).prevAll('ol:visible:first');
            if (prevOL.get(0)) {
                prevLI = prevOL.find('li.hover, li:first').eq(0);
                $(this).css({top: prevOL.position().top + prevLI.height() + dropslide.options.top, left: prevLI.position().left + offset});
                offset = offset + prevLI.position().left;
            }
        });
    }

    function getDropSlide(el) {
        if (!this.cache) {
            this.cache = $(el).data('dropslide')
                         || $(el).parents('.ui-dropslide').data('dropslide');
        }
        return this.cache;
    };
})(jQuery);

