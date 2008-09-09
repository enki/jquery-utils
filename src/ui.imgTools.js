/* jQuery ui.imgTools.js - 0.1a
 *
 * (c) Maxime Haineault <haineault@gmail.com>
 * http://haineault.com 
 * 
 * MIT License (http://www.opensource.org/licenses/mit-license.php)
 * 
 * Dependencies:
 *  - jquery.ui
 *  - jquery.i18n
 *
 * Ideas:
 *  - plugin: simplified css styles
 *  - plugin: edit alt text, title, border, longdesc
 *  - plugin: text overlay
 *  - plugin: free transform 
 *  - plugin: quality 
 *  - plugin: type
 *  - plugin: shapes
 *  - plugin: frames 
 *  - plugin: rounded corners 
 *
 * TODO:
 * - crop: initial area should be focused
 * - crop: add preview coordinate
 * - crop: selection containment isn't respected (possibly a bug in jQuery resizable)
 * - crop: when activated inline it becomes a block element, making the text jump
 * - crop: overlay doesn't play well with resize
 * - resize: when re-resizing if cancel is pressed the wrong "original" width is restored
 * - crop: scale.save -> crop -> crop.save = wrong offset
 * */

if ($.ui) {
// Translations 
/* English (UTF-8) initialisation for the jQuery UI imgTools plugin. *///{{{
/* Written by Maxime Haineault (haineault@gmail.com). */
$.i18n('fr.imgTools', {
    'Ok':     'Appliquer',
    'Cancel': 'Annuler',
    'Scale':  'Redimensioner',
    'Crop':   'Cadrer',
    'Text':   'Texte',

    'T: {x:d}, L: {y:d} - H: {h:d}, W: {w:d}':
    'T: {x:d}, L: {y:d} - H: {h:d}, W: {w:d}',

    'Select a portion of the image':
    'Selectionner une portion de l\'image',

    'Close toolbar':
    'Fermer la barre d\'outils'
});
(function($){

function _(str, args) {
    return $.i18n('imgTools', str, args);
}

// {{{
$.widget('ui.imgTools', {
    plugins: {},
	init: function(){
		var self = this;
        self.state = {};
        self.state.initial = self.state.actual = {
            width:  $(self.element).width(),
            height: $(self.element).height()
        };
        self.actions = {
            history: [],
            set: function(action, unique){
                var actions = self.actions.get(action.plugin);
                // if more than one action and unique true 
                if (actions.length >= 1 && unique) {
                    self.actions.history = $.map(self.actions.history, function(entry, i) {
                        if (entry.plugin == action.plugin) return action;
                        else return entry;
                    });
                }
                else {
                    self.actions.add(action);
                }
                self.propagate('updated', self);
            },
            get: function(plugin){
                return $.map(self.actions.history, function(entry, i) {
                    if (entry.plugin == plugin) return entry;
                });
            },
            add: function(action) {
                self.actions.history.push(action);
            }
        };

        self.interface = {
            wrapper: $('<div class="ui-imgTools" />'),
            menu:    $('<ul class="ui-imgTools-menu" />'),
            msg:    $('<div class="ui-imgTools-msg" />'),
            bar:     $('<div class="ui-imgTools-bar ui-imgTools-buttonpane" style="display:none;" />')
        };
        $(self.element).wrap(self.interface.wrapper)
            .hover(function(){ $(this).parent().addClass('hover'); }, function(){ $(this).parent().removeClass('hover'); });

        $(self.interface.msg).hide().appendTo(self.interface.bar);

        $('<a class="ui-imgTools-close" />').click(function(){
            self.close();
        }).appendTo(self.interface.bar);
        
        $('body').prepend($(self.interface.bar).append(self.interface.menu));
        $(self.element).data('imgTools', this);
        $(self.element).click(function(e){
            if (!$(self.element).hasClass('ui-imgTools-open')) {
                self.open();
            }
        });
        self.propagate('init', {}, self);
    },

    ui: function(inst) {
        return {
            options:     (inst || this)['options'],
            element:     (inst || this)['element'],
            plugins:     (inst || this)['plugins']
        };
    },

    refresh: function(original) {
        var self = this;
        var get  = self.getSearchString();
        var img  = self.getSearchHash().img;
        var src  = original && '?img='+img || (get && '?'+get+'&img=' || '?img=') + img;
        $(self.element).attr('src', self.options.url + src);
    },

    propagate: function(n, e, inst) {
        $.ui.plugin.call(this, n, [e || {}, this.ui(inst)]);
    },

    getSearchHash: function() {
        var self  = this;
        var out   = {};
        var match = $(self.element).attr('src').match(/\?(.*)$/);
        if (match[1]) {
            var tokens =  match[1].split('&');
            $.each(tokens, function(){
                var pair = this.split('=');
                out[pair[0]] = pair[1];
            });
        }
        return out;
    },

    getSearchString: function(){
        var self = this;
        return $.map(self.actions.history, function(entry, i) {
            return '%k=%v'.replace('%k', entry.plugin).replace('%v', entry.val);
        }).join('&');
    },

    open: function() {
        var self = this;
        $(self.interface.bar).slideDown();
        $(self.element).addClass('ui-imgTools-open');
        self.propagate('open', {}, self);
    },

    close: function() {
        var self = this;
        $(self.interface.bar).slideUp();
        $(self.element).removeClass('ui-imgTools-open');
        self.propagate('close', {}, self);
    },

    // same as $.ui.plugin.call but propagate only to the specified plugin
    callPlugin: function(plugin, name, args) {
        var self = this;
        var set = self.plugins[name];
        if (!set) { return; } 
        for (var i = 0; i < set.length; i++) { 
            if (self.options[set[i][0]] && set[i][0] == plugin) { 
                set[i][1].apply(self.element, args || []); 
            } 
        }
    },

    message: function(msg) {
        var self = this;
        if (!msg) {
            $(self.interface.msg).css('display','none').text('');
        }
        else {
            $(self.interface.msg).text(msg).css('display','block');
        }
    },

    addPlugin: function(ns, options){
        var self = this;
        var opt = $.extend({
            hide:  true,
            menu:  true,
            label: options && options.label || _(ns)
        }, options);
        self.interface[ns] = {
            wrapper: $('<div class="ui-imgTools-%ns ui-imgTools-plugin" />'.replace('%ns', ns))
        };
        self.addMenuItem(ns, {label: opt.label, callback: 'activate', desc: opt.desc || false });
        if (opt.buttonPane) {
            self.interface[ns].buttonPane = $('<div class="ui-imgTools-buttonPane" />').append(self.interface[ns].wrapper);
        }
        if (opt.hide) {
            $(self.interface[ns].wrapper).hide();
        }
        $(self.interface.bar).append(self.interface[ns].wrapper);
    },

    addWidget: function(ns, wdg) {
        var self = this;
        self.interface[ns][wdg.name] = wdg.element;
        if (self.interface[ns].wrapper) {
            $(self.interface[ns].wrapper).append(self.interface[ns][wdg.name]);
        }
        return self.interface[ns][wdg.name];
    },

    addButton: function(ns, btn) {
        var self = this;
        if (self.interface[ns]) {
            self.interface[ns][btn.name] = $('<button />').addClass('ui-imgTools-button-'+btn.name).html($('<span />').text(btn.label))
                .bind('click', function(e){
                    if (!self.plugins[btn.callback]) { return false; }
                    var rs = jQuery.grep(self.plugins[btn.callback], function(n){
                        return (n[0] && n[0] == ns);
                    }).shift();
                    if (rs && rs[1]) {
                        rs[1].apply(this, [e, self])
                    }
                }).appendTo(self.interface[ns].wrapper);
        }
    },

    addSeparator: function(plugin) {
        $('<span class="ui-imgTools-separator">')
            .appendTo(plugin && this.interface[ns].wrapper || this.interface.menu);
    },

    addMenuItem: function(ns, item) {
        var self = this;
        $(this.interface.menu).append($('<button />').addClass('ui-imgTools-button-'+ns).html($('<span />').text(item.label))
            .hover(function(){
                self.message(item.desc||'');
            }, function(){ 
                self.message();
            })
            .click(function(e){
                if (self.plugins[item.callback]) {
                    var rs = $.grep(self.plugins[item.callback], function(n){
                        return (n[0] && n[0] == ns);
                    }).shift();
                    if (rs && rs[1]) {
                        rs[1].apply(this, [e, self])
                    }
                }
                if (self.interface[ns] && self.interface[ns].wrapper) {
                    $(self.interface[ns].wrapper).show('fast');
                    $(self.interface.wrapper).addClass('ui-imgTools-active');
                    $(self.interface.menu).fadeOut('fast');
                    $(self.interface.bar).fadeIn('slow'); 
                }
            }));
    },
});
// }}}
$.extend($.ui.imgTools, {//{{{
    getter:   '',
    language: '',
    defaults: {
        url:     'data/ImgTools.php',
        history: true,
        crop:    true,
        scale:   true,
        text:    true,
        plugins: {
            crop: {
                areaInfo: true
            },
            scale: {}
        }
    }
});//}}}

// Plugins
$.ui.plugin.add('imgTools', 'crop', {//{{{
    init: function(e, ui){
        var self = $(ui.element).data('imgTools');
        self.interface.crop = {
            wrapper: $('<div class="ui-imgTools-crop ui-imgTools-plugin" />').hide('fast')
        };
        $(self.interface.bar).append(self.interface.crop.wrapper);

        self.addPlugin('crop', {label: _('Crop'),   desc: _('Select a portion of the image')});
        self.addButton('crop', {label: _('Save'),   name: 'save',   callback: 'save'});
        self.addButton('crop', {label: _('Cancel'), name: 'cancel', callback: 'deactivate'});
    },
    activate: function(e, ui) {
        var self = $(ui.element).data('imgTools');
        var img  = self.getSearchHash();
        var crop = function(img) {
            return {
                x: img && img.x || 0,
                y: img && img.y || 0,
                w: img && img.w || self.state.actual.width,
                h: img && img.h || self.state.actual.height };
        };
        var update = function(){
            var c = $($(self.element).imgSelection('getSelections'))[0];
            self.message(_('T: {x:d}, L: {y:d} - H: {h:d}, W: {w:d}', {
                x: c.x >= 2 && c.x - 2 || 0,
                y: c.y >= 2 && c.y - 2 || 0,
                h: c.h, w: c.w }));
        };
        $(self.interface.menu).hide('fast');
        $(self.interface.bar).slideDown('slow'); 
        $(self.interface.wrapper).addClass('ui-imgTools-active');

        self.options.plugins.crop.initials = [crop];
        self.options.plugins.crop.drag = self.options.plugins.crop.resize = update;

        setTimeout(function(){
            $(self.element).css({
                width:self.state.initial.width, 
                height:self.state.initial.height
            })
            .imgSelection(self.options.plugins.crop);
            crop(self.getSearchHash());
        }, 1000);
    },
    deactivate: function(e, ui){
        var self = $(ui.element).data('imgTools');
        $(self.interface.menu).fadeIn();
        $(self.interface.crop.wrapper).hide();
        $(self.element).imgSelection('destroy');
        $(self.element).css({width:self.state.actual.width, height:self.state.actual.height});
        self.refresh(false);
    },
    save: function (e, ui){
        var self = $(ui.element).data('imgTools');
        var s    = $(self.element).imgSelection('getSelections')[0];
//        var x    = s.x
        var v    = [-s.x, -s.y, s.w, s.h].join(',');
        self.state.actual.x = s.x;
        self.state.actual.y = s.y;
        self.state.actual.width  = s.w;
        self.state.actual.height = s.h;
        self.actions.set({label: 'Crop', plugin: 'crop', val: v}, true);
        self.callPlugin('crop', 'deactivate', [e, ui, true]);
    }
});//}}}
$.ui.plugin.add('imgTools', 'scale', {//{{{
    init: function(e, ui){
        var self = $(ui.element).data('imgTools');
        self.addPlugin('scale', {label: _('Scale'), desc: 'Change the image size proportionally'});
        self.addButton('scale', {name: 'save',   label: 'Ok',     callback: 'save'});
        self.addButton('scale', {name: 'cancel', label: 'Cancel', callback: 'deactivate'});
        self.addWidget('scale', {name:  'slider', 
            element: $('<div class="ui-slider"><div class="ui-slider-handle" /></div>')
                .slider()
                .bind('slide', function(e, ui){ 
                    $(self.element).css({
                        width:parseInt(self.state.actual.width * ui.value / 100, 10), 
                        height:'auto'
                    });
                    self.message('%d%'.replace('%d',ui.value));
                })});

    },
    activate: function(e, ui) {
        var self    = $(ui.element).data('imgTools');
        var img     = self.getSearchHash();
        var scale = {
            scale: self.state.actual.scale || 100,
            w: self.state.actual.width,
            h: self.state.actual.height
        };
        self.state.actual.scale = self.state.initial.scale = img && img.scale || 100;

        setTimeout(function(){
            $(self.interface.scale.slider).slider('moveTo', self.state.actual.scale, 0, true);
        }, 300);
    },
    deactivate: function(e, ui, noresize) {
        var self = $(ui.element).data('imgTools');
        $(self.interface.scale.wrapper).hide();
        $(self.interface.menu).fadeIn();
        self.state.actual.width  = parseInt(self.state.initial.width, 10);
        self.state.actual.height = parseInt(self.state.initial.height, 10);
        if (!noresize) {
            $(self.element).animate({
                width:  self.state.actual.width,
                height: self.state.actual.height
            });
        }
    },
    save: function (e, ui){
        var self = $(ui.element).data('imgTools');
        var getStr = self.getSearchString();

        self.actions.set({
            label: 'Scale', 
            plugin: 'scale', 
            val: $(self.interface.scale.slider).slider('value')}, true);

        $(self.element).attr('src', self.options.url + ((getStr && '?'+getStr+'&img=' || '?img=') + self.getSearchHash().img));
        self.callPlugin('scale', 'deactivate', [e, ui, true]);
    }
});//}}}
$.ui.plugin.add('imgTools', 'history', {//{{{
    init: function(e, ui){
        var self = $(ui.element).data('imgTools');
        self.interface.history = {
            wrapper: $('<ol class="ui-imgTools-history" />')
        };
        $(self.interface.history.wrapper).insertAfter(self.element);
    },
    updated: function(e, ui) {
        var self = $(ui.element).data('imgTools');
        $(self.interface.history.wrapper).empty();
        $.each(self.actions.history, function(i, entry){
            $('<li class="ui-imgTools-history-entry" />')
                .text('%l: %v'.replace('%l', entry.label).replace('%v', entry.val))
                .appendTo(self.interface.history.wrapper);
        });
    }
});//}}}

$.ui.plugin.add('imgTools', 'text', {//{{{
    init: function(e, ui){
        var self = $(ui.element).data('imgTools');
        self.addPlugin('text', {label: _('Text'), desc: 'Add text cation'});
        self.addButton('text', {name:  'save',   label: 'Ok',     callback: 'save'});
        self.addButton('text', {name:  'cancel', label: 'Cancel', callback: 'deactivate'});
        self.addSeparator();
        self.addWidget('text', {name:  'input', 
            element:  $('<input type="text" value="Enter text">')
        });
        self.addWidget('text', {name:  'slider', 
            element: $('<div class="ui-slider"><div class="ui-slider-handle" /></div>')
                .slider()
                .bind('slide', function(e, ui){ 
                    $(self.element).css({
                        width:  parseInt(self.state.actual.width * ui.value / 100, 10), 
                        height: 'auto'
                    });
                    self.message('%d%'.replace('%d',ui.value));
                })});
    },
});//}}}

//_('Ze image is %x pixels by %y pixels', {x:10, y:20});


})(jQuery);
}
