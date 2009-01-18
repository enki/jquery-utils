/*
  jQuery awesomebar - 0.2
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com>
  http://haineault.com   

  MIT License (http://www.opensource.org/licenses/mit-license.php)

  Changelog
  =========
  0.1

*/

if ($.ui) {
$.widget('ui.awesomebar', {
	_init: function(){
		var self = this;
        self.preventUpdate = false;

        // same as :contains but case insensitive
        if (typeof($.expr[':']['icontains']) == 'undefined') {
            $.expr[':']['icontains'] = function(a,i,m){
                return (a.textContent||a.innerText||$(a).text()||'').toLowerCase().indexOf(m[3].toLowerCase())>=0;}
        }

        // create action bar
        if ($(self.element).parent().hasClass('ui-awesomebar')) {
            self.awesomebar = $(self.element).parent().width(self.options.width);
            if ($(self.awesomebar).find('ul').get(0)) {
                self.list = $(self.awesomebar).find('ul').width(self.options.width).hide().get(0)
            }
            else {
                self.list = $('<ul />').width(self.options.width).hide();
                $(self.awesomebar).append(self.list);
            }
        }
        else {
            self.awesomebar = $('<div class="ui-awesomebar" />').width(self.options.width);
            self.list       = $('<ul />').width(self.options.width).hide();
            $(self.element).wrap($(self.awesomebar));
            $(self.list).insertAfter(self.element);
        }

        $(self.element).blur(function(){ self.hide(); });

        $('li:first', self.list).addClass('first');
        $('li:last', self.list).addClass('last');
        
        $(self.element).bind('keyup.awesomebar', function(e){
            if ($.inArray(e.keyCode, [13, 27, 37, 38, 39, 40]) > -1) {
                self.preventUpdate = true;
                self.handleKeyEvents(e.keyCode); 
            }
            else {
                self.preventUpdate = ($(self.element).val().replace(/\s/g, '')=='')? true: false;
            }
        }).width(self.options.width);

        if (self.options.dataSource) {
            if ($.fn.delayedObserver) {
                $(self.element).delayedObserver(function(){ 
                    if (!self.preventUpdate) self.options.update.apply(self);
                }, 0.5);
            }
            else {
                $(self.element).keyup(function(){
                    if (!self.preventUpdate) self.options.update.apply(self);
                });
            }
            
        }
	},

    handleKeyEvents: function(keyCode){
        var self = this;
        switch(keyCode) {
            case 13: self.select();       break; // enter
            case 27: self.hide();         break; // escape
            case 37: self.hide();         break; // left
            case 38: self.select('prev'); break; // up
            case 39: self.hide();         break; // right
            case 40: self.select('next'); break; // down
        }
    },

    handleHTMLresponse: function(data) {
        var newList = $(data).width(self.options.width);
        var oldList = $(self.element).next('ul');
        $(self.element).removeClass('match no-match');
        if ($(self.element).val().length > 0) {
            $(self.element).addClass(($(' > li', newList).length > 0)? 'match': 'no-match');
        }
        $(oldList).replaceWith(newList);
        self.list = newList;
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
            $(self.element).removeClass('no-match match');
            self.hide();
        }
    },

    refresh: function() {
        if (self.list.length < 1) $(self.list).hide();
        else {
            $(self.list).show();
            if (self.options.maxHeight && $(self.awesomebar).height() > self.options.maxHeight) {
                $(self.awesomebar).height(self.options.maxHeight);
            }
        }
        $(self.list).find('li')
            .hover(function(){ $(this).addClass('hover'); }, function(){ $(this).removeClass('hover'); })
            .click(function(){ self.select(this); });
    },

	show: function() {
		this.options.show.apply(this.awesomebar);
	},

	hide: function(){
		this.options.hide.apply($(this.list), [this.options.speed]);
	}
});

$.ui.awesomebar.defaults = {
	width:      200,    // width in pixel
    maxHeight:  200,   // maximum height in pixel
	speed:      'fast', // animations speed
	show:	    $.fn.slideDown, // showing effect
	hide:	    $.fn.slideUp,   // hiding effect
    maxResults: 0, // 0 = infinite
    dataSource: false,
    dataType:   'html',
    onData:     function(data, status){
        if (status == 'success') {
            switch(self.options.dataType) {
                case 'html': self.handleHTMLresponse.apply(self, [data]); break;
                // TODO: other dataTypes support
            }
            self.refresh.apply(self);
        }
    },
    onSelect:   function() {
        $(this.element).val($(this.list).find('.selected').removeClass('selected').text());
    },
    onSelected: function(){},
    update: function() {
        self = this;
        if ($(self.element).val() == '') return;
        // Ajax
        if (self.options.dataSource) {
            $.get(self.options.dataSource.replace('%s', $(self.element).val()), self.options.onData);
        }
    }
};
}
