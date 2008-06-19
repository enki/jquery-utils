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
        console.log($(self.element).parent().find('.ui-awesomebar'));
        if ($(self.element).next().hasClass('ui-awesomebar')) {
            self.awesomebar =  $(self.element).next().hide();
        }
        else {
            self.awesomebar =  $('<span class="ui-awesomebar" />').hide();
            $('body').append(self.awesomebar);
        }


	},

    insert: function() {},

	show: function() {
		this.options.show.apply(this.awesomebar);
	},

	hide: function(){
		if (this.options.onHide) this.options.onHide.apply(this.awesomebar);
		this.close(this.options.hide);
	},
});

$.ui.awesomebar.defaults = {
	delay:    0,      // delay before showing (seconds)
	timeout:  3,      // time before hiding (seconds)
	width:    200,    // width in pixel
    maxHeight: 200,   // maximum height in pixel
	speed:    'slow', // animations speed
	closable: true,   // allow user to close it
	onClose:  false,  // callback before closing
	onClosed: false,  // callback after closing
	onOpen:   false,  // callback before opening
	onOpened: false,  // callback after opening
	onHide:   false,  // callback when closed by user
	show:	  $.fn.slideDown, // showing effect
	hide:	  $.fn.fadeOut,   // closing effect (by user)
	close:    $.fn.slideUp    // hiding effect (timeout)
};

