/* jQuery ui.window.js - 0.1
 *
 * (c) Maxime Haineault <haineault@gmail.com>
 * http://haineault.com 
 * 
 * MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * */

if ($.ui) {
$.ui.log = (typeof(console) != 'undefined')? console.log: function(){};

$.widget('ui.window', {
    plugins: {},
	init: function(){
        this.propagate('init');
        this.open(this.options.target, this.options.name, this.options);
    },
    ui: function(inst) {
        return {
            options: (inst || this)['options'],
            element: (inst || this)['element'],
            plugins: (inst || this)['plugins'],
            window:  (inst || this)['window']
        };
    },
    propagate: function(n, inst, noPropagation) {
        $.ui.plugin.call(inst || this, n, [this.ui(inst)]);
    },    
    open: function(target, name, options) {
        options     = options || this.options;
        this.window = window.open(target || '', 
                   name || 'ui-window-%t'.replace('%t',(new Date()).getTime()), 
                   this.serializeOptions(options));
        if ($(this.element).get(0).nodeType != 9) {
            $('html', this.window.document).append($(this.element).wrap($('<body />')));
        }
        this.propagate('open', this);
        return this.window;
    },
    // returns the options string passed to the window.open method
    serializeOptions: function() {
        var self = this;
        var val  = function(v) {
            switch(typeof(v)) {
                default: 
                case 'string':  return v;
                case 'number':  return parseInt(v, 10);
                case 'boolean': return v && 'yes' || 'no';
            };
        };
        var parse = function(area) {
            var o = [];
            var d = ['width', 'height', 'top', 'left', 'directories', 'location', 
                     'resizable', 'menubar', 'toolbar', 'scrollbars', 'status'];
            for (k in self.options) {
                if (d.indexOf(k) > -1) {
                    o.push(k +'='+ val(self.options[k]));
                }
            }
            return o.join(', ');
        };
        return parse(self.options);
    },
});
$.extend($.ui.window, {
    getter: 'open',
    defaults: {
        width:       'auto', // width of the new window in pixels
        height:      'auto', // height of the window in pixels
        top: 	     'auto', // window top position
        left:        'auto', // specifies left window position
        directories: false,  // should the directories bar be shown? (Links bar)
        location:    false,  // location bar
        resizable:   false,  // window can be resized.
        menubar:     false,  // show menu bar
        toolbar:     false,  // show the toolbar
        scrollbars:  false,  // show the scrollbars
        status:      false,  // show the statusbar        
        // plugins 
        fullstreen:  false,  // make window fullscreen
        center:      false,  // center window in the middle of the screen
        // options not sent to window.open
        target:      '',
        name:        false,
        title:       false
    }
});

$.ui.plugin.add('window', 'center', {
    init: function(ui){
        if (ui.options.center) {
        console.log(ui.options.center);
            if(ui.options.width != 'auto')  { ui.options.left = (screen.width  - ui.options.width)  / 2; }
            if(ui.options.height != 'auto') { ui.options.top = (screen.height  - ui.options.height) / 2; }
        }
    },
    open: function(ui) {
        if (ui.options.center) {
            if(ui.options.width == 'auto')  { ui.window.screenX = (screen.width  - ui.window.outerWidth)  / 2; }
            if(ui.options.height == 'auto') { ui.window.screenY = (screen.height - ui.window.outerHeight) / 2; }
        }
    }
});
}
