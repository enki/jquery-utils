/*
  jQuery ui.dropslide - 0.2
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

(function($){
    $.widget('ui.dropslide', $.extend({}, $.ui.mouse, {
        getter: 'showLevel showNextLevel',
        init: function(){
            var next     = this.element.next();
            this.wrapper = next.hasClass('ui-dropslide') && next || this.options.tree || false;

            if (this.wrapper) {
                this.element.bind(this.options.trigger +'.dropslide', onActivate);
                this.wrapper
                    .data('dropslide', this)
                    .css({width:this.options.width})
                    .find('li, li ol li').bind('mouseover.dropslide', onLiMouseover)
                               .bind('click.dropslide',     onLiClick).end()
                    .find('ol').bind('mousemove.dropslide', onOlMousemove).hide();
            }
        },
        // show specified level, id is the DOM position
        showLevel: function(id) {
            var ols = this.wrapper.find('ol');
            if (id == 0) {            
                ols.eq(0).css('left', this.element.position().left);
            }
            setTimeout(function(){
                ols.removeClass('active').eq(id).addClass('active').show();
            }, this.options.showDelay);
        },
        // guess what it does
        showNextLevel: function() {
            if (this.is2d()) {
                this.wrapper.find('ol.active').removeClass('active').next('ol').addClass('active').show();
            }
            else {
                this.wrapper.find('ol.active').removeClass('active').find('li.hover > ol').addClass('active').show();
            }
        },
        getSelection: function() {
            return $.makeArray(this.wrapper.find('span.hover')
                .map(function(){ return $(this).text(); }));
        },
        // show level 0 (shortcut)
        show: function() {
              this.showLevel(0);
        },
        // hide all levels
        hide: function() {
            self = this;
            setTimeout(function(){
                self.wrapper.find('ol').hide();
            }, self.options.hideDelay);
        },
        // determine dropdown type
        is2d: function() {
            return !this.is3d();
        },
        is3d: function() {
            return !!this.wrapper.find('ol > li > ol').get(0);
        }
    }));

    $.ui.dropslide.defaults = {
        // options
        tree:    false,
        trigger: 'mouseover',
        top:     6,
        left:    0,
        showDelay: 0,
        hideDelay: 0,
        // events
        select:  function() {},
        click:   function(e, dropslide) {
            dropslide.hide();
        }
    };

    function onActivate(e){
        var dropslide = getDropSlide(this);
        dropslide.show();
    };

    function onLiMouseover(e){
        var dropslide = getDropSlide(this);
        $(this).siblings()
            .find('ol').hide().end()
            .find('span.hover').andSelf().removeClass('hover');
        $(this).find('ol').show().end().children(0).andSelf().addClass('hover');
        dropslide.showNextLevel();
    };

    function onLiClick(e){
        var dropslide = getDropSlide(this);
        $(dropslide.element).triggerHandler('dropslideclick',  [e, dropslide], dropslide.options.click); 
        $(dropslide.element).triggerHandler('select',          [e, dropslide], dropslide.options.select); 
    };

    function onOlMousemove(e) {
        var dropslide = getDropSlide(this);
        var prevLI = false;
        var prevOL = false;
        var nextOL = false;
        var pos    = false;
        var offset = dropslide.element.position().left + dropslide.options.left;
        var ols    = dropslide.wrapper.find('ol');

        // reposition each ol
        ols.each(function(i){
            prevOL = $(this).prevAll('ol:visible:first');
            if (prevOL.get(0)) {
                prevLI = prevOL.find('li.hover, li:first').eq(0);
                $(this).css({
                    top:  prevOL.position().top + prevLI.height() + dropslide.options.top, 
                    left: prevLI.position().left + offset
                });
                offset = offset + prevLI.position().left + dropslide.options.left;
            }
            else if (i > 0 && dropslide.is3d()) {
                $(this).css('margin-left', dropslide.options.left);
            }
        });
    }
    
    function getDropSlide(el) {
        return $(el).data('dropslide')
                || $(el).parents('.ui-dropslide').data('dropslide');
    };
})(jQuery);
