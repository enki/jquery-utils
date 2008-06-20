/*
  jQuery awesomebar - 0.1
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com>
  http://haineault.com   

  MIT License (http://www.opensource.org/licenses/mit-license.php)

  Changelog
  =========
  0.1

*/

$.widget('ui.awesomebar', {
	init: function(){
		var self = this;
        self.preventUpdate = false;

        if (typeof($.expr[':']['icontains']) == 'undefined') {
            $.expr[':']['icontains'] = function(a,i,m){
                return (a.textContent||a.innerText||$(a).text()||"").toLowerCase().indexOf(m[3].toLowerCase())>=0;}
        }

        if ($(self.element).parent().hasClass('ui-awesomebar')) {
            self.awesomebar = $(self.element).parent();
            if ($(self.awesomebar).find('ul').get(0)) {
                self.list = $(self.awesomebar).find('ul').hide().get(0)
            }
            else {
                self.list = $('<ul />').hide();
                $(self.awesomebar).append(self.list);
            }
        }
        else {
            self.awesomebar = $('<div class="ui-awesomebar" />');
            self.list       = $('<ul />').hide();
            $(self.element).wrap($(self.awesomebar));
            $(self.list).insertAfter(self.element);
        }

        $(self.element).blur(function(){ self.hide(); });

        $('li:first', self.list).addClass('first');
        $('li:last', self.list).addClass('last');
        $(self.awesomebar).width(self.options.width);

        $(self.element).bind('keyup.awesomebar', function(e){ //console.log(e.keyCode);
            if ($.inArray(e.keyCode, [13, 27, 37, 38, 39, 40]) == -1) {
                self.preventUpdate = false;
                self.filter();
            }
            else {
                self.preventUpdate = true;
                self.onKeydown(e.keyCode); 
            }
        });

        if (self.options.update) {
            if ($.fn.delayedObserver) {
                $(self.element).delayedObserver(function(){ 
                    if (!self.preventUpdate) self.options.update.apply(self);
                }, 0.5);
           }
        }
	},
    onKeydown: function(keyCode){
        switch(keyCode) {
            case 13: self.select();       break; // enter
            case 27: self.hide();         break; // escape
            case 37: self.hide();         break; // left
            case 38: self.select('prev'); break; // up
            case 39: self.hide();         break; // right
            case 40: self.select('next'); break; // down
        }
    },
    select: function(which) {
        self = this;
        if (typeof(which) == 'string') {
            var def   = (which == 'next')? 'li:first': 'li:last';
            var match = $(self.list).find('.selected').removeClass('selected');
            if (!$(match).get(0) || !$(match)[which]().get(0)) {
                $(self.list).find(def).addClass('selected');
            }
            else $(match)[which]().addClass('selected');
        }
        else {
            if (typeof(which) == 'object') {
                $(self.list).find('li').removeClass('selected');
                $(which).addClass('selected');
                var selected = $(which);
            }
            else {
                var selected = $(self.list).find('.selected');
            }
            self.options.onSelect.apply(self,   [selected]);
            self.options.onSelected.apply(self, [selected]);
        }
    },

    filter: function() {
        self = this;
        var val = $(self.element).val();
        if (val == '') return self.hide();
        var match = $(self.list).find('li:icontains('+ val  +')');
        
        if (!self.options.update) $(self.list).find('li').hide();
        else $(self.list).find('li:not(:icontains('+ val  +'))').remove();

        if (match.length > 0) {
            $.each(match, function(){
                //$.each($(this).children(), function() {
                //    $(this).html($(this).text());
                //});
                var el = $(this).find(':icontains('+ val +')');
                if ($(el).get(0)) {
                    //var str = $(el).eq(0).text();
                    //$(el).eq(0).html(str.replace((new RegExp('('+val+')', 'gi')), "<b>$1</b>"));
                    if (!self.options.update) $(this).show();
                }
            });
            $(self.list).show();
        }
        else {
            $(self.list).hide();
        }
    },

	show: function() {
		this.options.show.apply(this.awesomebar);
	},

	hide: function(){
		this.options.hide.apply($(this.list), [this.options.speed]);
	},
});

$.ui.awesomebar.defaults = {
	width:      200,    // width in pixel
//  maxHeight:  200,   // maximum height in pixel
	speed:      'fast', // animations speed
	show:	    $.fn.slideDown, // showing effect
	hide:	    $.fn.slideUp,   // hiding effect
    update:     false,
    onSelected: false,
    onSelect:   function() {
        $(this.element).val($(this.list).find('.selected').removeClass('selected').children(':first').text());
        this.hide();
    }
};

