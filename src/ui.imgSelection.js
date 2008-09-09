/* jQuery ui.imgSelection.js - 0.1
 *
 * (c) Maxime Haineault <haineault@gmail.com>
 * http://haineault.com 
 * 
 * MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * */

if ($.ui) {
$.ui.log = (typeof(console) != 'undefined')? console.log: function(){};

$.widget('ui.imgSelection', {
	init: function(){
		var self = this;
            
        $(document).bind('click.imgSelection', function(e){
            if (!$(e.target).hasClass('ui-imgSelection-area') 
                && !$(e.target).hasClass('ui-resizable-handle')) {
                self.blur();
            }
        });

        self.coords   = (self.element).position();
        self.coords.w = $(self.element).width();
        self.coords.h = $(self.element).height();
        self.canevas  = $(self.element).wrap('<div class="ui-imgSelection" />').parent()
            .css({width: self.coords.w, height: self.coords.h })
            .hover(function(){ $(this).addClass('hover'); }, function(){ $(this).removeClass('hover'); });
        
        self.createSelections(self.options.initials);
        self.propagate('init', {}, self);
        self.focus();
    },
    plugins: {},
    ui: function(inst) {
        return {
            canevas:   (inst || this)["canevas"] || $([]),
            areas:     (inst || this)['areas']   || $([]),
            options:   (inst || this)['options'],
            element:   (inst || this)['element'],
            plugins:   (inst || this)['plugins'],
            coords:    (inst || this)['coords'],
            area:      (inst || this)['area']
        };
    },
    
    propagate: function(n, e, inst, noPropagation) {
        $.ui.plugin.call(this, n, [e || {}, this.ui(inst)]);
        if(!noPropagation) this.element.triggerHandler(n == "sort" ? n : "sort"+n, [e || {}, this.ui(inst)], this.options[n]);
    },    

    serialize: function() {
        var self = this;
        var wrap = function(str) {
            return '{%s}'.replace('%s', str);
        };
        var parse = function(area) {
            var o = [];
            for (k in area) {
                switch(typeof(area[k])) {
                    case 'object': o.push('"'+k+'": '+ parse(area[k])); break;
                    case 'number': o.push('"'+k+'":'+ area[k]); break;
                    case 'string': o.push('"'+k+'": "'+ escape(area[k]) +""); break;
                }
            }
            return wrap(o.join(', '));
        };
        return parse(self.getSelections()[0]);
    },
    
    focus: function(area, e, ui) {
        var e  = {target: $(area).get(0) };
        var ui = ui || this;
        if (!area) {
            var area = $('.ui-imgSelection-area', this.canevas).eq(0);
        }
        else if ($(area).get(0)) {
            var area = (typeof(area) == 'number')? $('.ui-imgSelection-area', this.canevas).eq(area): $(area);
        }
        this.blur();
        $(area).addClass('ui-imgSelection-focused ui-resizable');
        this.propagate('areaFocus', e, ui);
        return area;
    },
    blur: function(area, e, ui) {
        var area = area || $('.ui-imgSelection-area', this.canevas);
        var e    = e || {target: $(area).get(0) };
        var ui   = ui || this;
        if ($(area).get(0)) {
            $(area).removeClass('ui-imgSelection-focused ui-resizable');
            this.propagate('areaBlur', e, ui);
            this.area = false;
        }
    },
    getSelections: function(){
        var self = this;
        return $.map($('.ui-imgSelection-area', self.canevas), function(area, i){
            return self.getArea(area, self);
        });
    },

    createSelections: function(selections) {
        var self = this;
        var s = self.options.multiple && selections || selections.slice(0, 1);
        $.each(s, function(i, sel){
            var w = sel.w == -1 && self.coords.w || sel.w;
            var h = sel.h == -1 && self.coords.h || sel.h;
            var x = self.coords.left + sel.x;
            var y = self.coords.top  + sel.y;
            var c = {top:y, left:x, width: w, height: h, position: 'absolute'};
            var area = $('<div class="ui-imgSelection-area"></a>').data('imgSelection.initial', sel).hide();

            $(area).bind('click.imgSelection', function(e){
                if (!$(this).hasClass('ui-imgSelection-focused')) {
                    self.focus(this);
                }
            })
            .hover(function(){ $(this).addClass('hover'); }, function(){ $(this).removeClass('hover'); })
            .insertAfter(self.element);

            if (self.options.draggable) {
                $(area).draggable($.extend(self.options.draggable, { 
                    containment: self.element,
                    drag:  function(e, ui) { self.propagate('drag',  e, self); },
                    start: function(e, ui) { self.propagate('start', e, self); },
                    stop:  function(e, ui) { 
                        self.options.onSelect.apply(self, [e, ui]);
                        self.propagate('stop',  e, self); } })).addClass('ui-draggable');
            }
            if (self.options.resizable) {
                $(area).resizable($.extend(self.options.resizable, { 
                    //containment: self.element, // TODO: fix..
                    resize: function(e, ui) { self.propagate('resize', e, self); },
                    start:  function(e, ui) { self.propagate('start',  e, self); },
                    stop:   function(e, ui) {
                        self.options.onSelect.apply(self, [e, ui]);
                        self.propagate('stop',   e, self); } }));
            }
            if (self.options.multiple) {
                $(self.canevas).addClass('ui-imgSelection-multiple');
            }
            $(area).css(c).show('slow');
        });
    },

    getArea: function(area, ui) {
        var a = area || $('.ui-imgSelection-area', this.canevas).eq(0);
        var p = $(area).position();

        return {
            element: area,
            initial: $(area).data('imgSelection.initial'),
            y: p.top  - ui.coords.top,
            x: p.left - ui.coords.left,
            w: $(area).width(),
            h: $(area).height()
        };
    },
    destroy: function() {
        var self = this;
        $(self.element).insertAfter(self.canevas);
        $(self.canevas).remove();
    }
});


$.extend($.ui.imgSelection, {
    getter: 'serialize getArea createSelections getSelections focus blur',
    defaults: {
        multiple: false,
        initials: [{x:0, y:0, w:100, h:100}],
        grid:     0, // 0: none, 1: x, 2: y, 3: x/y
        guide:    0, // 0: none, 1: x, 2: y, 3: x/y 
        plugin:    {},
        draggable: {},
        resizable: { knobHandles:true },
        // events
        onSelect: function(e, ui) {},
        // plugins
        areaInfos: false,
        overlay:   false,
        comments:  false,
        autofocus: true
    }
});

/*
 * imgSelection plugins
 */

$.ui.plugin.add('imgSelection', 'autofocus', {
    init: function(e, ui){
        setTimeout(function(){
            $(ui.element).imgSelection('focus');
        }, 200);
    }
});

$.ui.plugin.add('imgSelection', 'input', {
    init: function(e, ui){
        input = $(ui.options.input);
        ui.options.onSelect = function(e, ui) {
            $(input).val($(this.element).imgSelection('serialize', e.target));
        };
    }
});

$.ui.imgSelection.defaults.plugin.overlay = {
    opacity: 0.4,
    color:   '#000'
};

$.ui.plugin.add('imgSelection', 'overlay', {
    init: function(e, ui){
        $(ui.canevas).css({background: ui.options.plugin.overlay.color });
        ui.options._overlay =  $('<div class="ui-imgSelection-overlay">');
        ui.options._areaCSS = {
            backgroundImage: 'url(/jquery-utils-img-tools/demo/%s)'.replace('%s', $(ui.element).attr('src')),
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '0 0',
            border: 0
        };

        ui.options._overlayUpdate = function(e, ui) {
            var overlay = ui.options._overlay;
            var area    = $('.ui-imgSelection-focused, .ui-imgSelection-area', ui.canevas).eq(0);
            
            if ($(area).get(0)) {
                var p = $(area).position();
                var b = $(area);
                ui.options._areaCSS.backgroundPosition = '%lpx %tpx'
                    .replace('%t', ui.coords.top  - p.top)
                    .replace('%l', ui.coords.left - p.left);

                $(area).css(ui.options._areaCSS);
            }
            $(ui.canevas).append(ui.options._overlay);
        };
        $(ui.canevas).addClass('ui-imgSelection-overlay');
        $(ui.element).fadeTo('slow', ui.options.plugin.overlay.opacity);
        ui.options._overlayUpdate(e, ui);
    },
    areaFocus: function(e, ui){
        $('.ui-imgSelection-overlay:visible', ui.canevas).hide();
        ui.options._overlayUpdate(e, ui);
    },
    areaBlur: function(e, ui){
        $('.ui-imgSelection-overlay:visible', ui.canevas).hide();
    },
    start: function(e, ui){
        $('.ui-imgSelection-focused', ui.canevas).addClass('ui-imgSelection-overlay-active');
    },
    stop: function(e, ui){
        ui.options._overlayUpdate(e, ui);
        $('.ui-imgSelection-focused', ui.canevas).removeClass('ui-imgSelection-overlay-active');
    }
});


$.ui.plugin.add('imgSelection', 'comments', {
    init: function(e, ui){
        ui.options._setComment = function(e, ui, area) {
            var s = $(ui.element).imgSelection('getArea', area, ui);
            if (s) {
                $('.ui-imgSelection-comments', ui.canevas).text(s.initial.comment);
            }
        }
        if (!$('.ui-imgSelection-comments', ui.canevas).get(0)) {
            $('<div class="ui-imgSelection-comments" />').text('Click on areas to see comments').insertAfter(ui.element).hide();
        }
    },
    areaFocus: function(e, ui){
        ui.options._setComment(e, ui, e.target);
        $('.ui-imgSelection-comments:hidden', ui.canevas).slideDown('slow');
    },
    areaBlur: function(e, ui){
//        $('.ui-imgSelection-comments:visible', ui.canevas).slideUp('slow');
    }
});

$.ui.plugin.add('imgSelection', 'areaInfos', {
    init: function(e, ui){
        ui.options._setAreaStatus = function(e, ui, area) {
            var s = $(ui.element).imgSelection('getArea', area, ui);
            if (s) {
                $('.ui-imgSelection-infos', ui.canevas).text('T: %y, L: %x / W: %w, H: %h'
                  .replace('%y', s.y)
                  .replace('%x', s.x)
                  .replace('%w', s.w)
                  .replace('%h', s.h));
            }
        }
        if (!$('.ui-imgSelection-infos', ui.canevas).get(0)) {
            $('<div class="ui-imgSelection-infos" />').insertAfter(ui.element).text('Select the cropping area');
        }
    },
    areaFocus: function(e, ui){
        ui.options._setAreaStatus(e, ui, e.target);
    },
    areaBlur: function(e, ui){
    },
    start: function(e, ui){
        ui.options._setAreaStatus(e, ui, e.target);
    },
    stop: function(e, ui){
        ui.options._setAreaStatus(e, ui, e.target);
    },
    resize: function(e, ui){
        ui.options._setAreaStatus(e, ui, $('.ui-imgSelection-area.ui-imgSelection-focused', ui.canevas).get(0));
    },
    drag: function(e, ui){
        ui.options._setAreaStatus(e, ui, e.target);
    }
});
}
