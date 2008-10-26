var css = false;
$(function($){

    $.cssExt = {
        'pseudo-class': {}
        //'selector': {},
        //'property': {},
        //'style': {},
    };

    try { // IE
        httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
    } 
    catch (e) { // Mozilla
        httpRequest = new XMLHttpRequest();
    } 

    css = (new function(){
        this.cache = { style: '' };

        // Thanks Dean Edwards
        this.load = function() {
            if ($('#extCssBuff').get(0)) {
                $('#extCssBuff').text('');
            }
            else {
                $('<span id="extCssBuff" style="display:none;position:absolute;top:-100px;left:-100px;height:0;width:0;" />')
                    .appendTo('body');
            }
            for (var i = 0; i < document.styleSheets.length; i++) {
                var ss    = document.styleSheets[i];
                var key   = false;
                var href  = false;
                var clean = false;
                var out   = false;
                // cache only remote stylesheet
                if (ss.href && ss.href != '') {
                    if (!ss.href.match('http://') || ss.href.match(document.location.host)) {
                        key  = ss.href;
                        href = ss.href;
                    }
                }
                else if (ss.href == '' || (ss.owningElement 
                         && ss.owningElement.nodeName.toLowerCase())) {
                    key  = 'style';
                    href = document.location.href;
                }
                if (key && !this.cache[key])  {
                    try {
                        // easy to load a file huh?
                        httpRequest.open('GET', href, false);
                        httpRequest.send(null);
                        if (httpRequest.status == 0 || httpRequest.status == 200) {
                            if (key == 'style') {
                                var tmp   = $('#extCssBuff').text(httpRequest.responseText)
                                var fixed = tmp.text().replace(/\n|\r|\t/g, '');
                                var match = fixed.match(/<style(?:\s+\w+="[a-z\/]+")?>(.*)<\/style>/i);
                                
                                if (match && match[1]) {
                                    out = $.trim(match[1]);
                                }
                            }
                            else {
                                out = httpRequest.responseText
                                // Remove the comments to simplify the parser
                                .replace(/(\/\/.*$)|(\/\*.*\*\/)/igm, '');
                            }
                        }
                    }
                    catch (e) {} // ignore errors 
                    // Remove the comments to simplify the parser
                    this.cache[key] = out.replace(/\n|\t|(\/\/.*$)|(\/\*.*\*\/)/ig, '');
                }
            }
        };

        // this method is not reliable yet for complex stylesheets..
        this.getText = function(ss, selector, index) {
            if (typeof(ss.cssRules) != 'undefined') {
                var o = [];
                $.each(ss.cssRules, function() { 
                    var rule = this;
                    if (rule.selectorText.match(selector)) { 
                        o.push(rule.cssText.match(/\{(.*)\}/)[1].replace(/\s+/g, ''));
                    } 
                });
                return (o.length > 0)? o.join(''): false;
            }
            else {
                var ssk  = (ss.href && ss.href != '') ? ss.href : 'style';
                var idx  = typeof(index) != 'undefined' && index || 0;
                var text = this.cache[ssk] || '';
                var pos1 = text.indexOf(selector, idx);
                if (pos1 > -1) {
                    var pos2 = text.indexOf('{', pos1);
                    var pos3 = text.indexOf('}', pos2);
                    var out  = text.slice(pos2+1, pos3).replace(/\n|\s|\t/gi, '');
                    // recurse for duplicates
                    if (text.indexOf(selector, pos3) > -1) {
                        return  out + this.getText(ss, selector, pos3);
                    }
                    else {
                        return out;
                    }
                }
                return false;
            }
        };
        // "color:#c30;" -> {color: '#c30'}
        this.text2object = function(cssText) {
            var o   = {};
            var txt = cssText.toLowerCase().split(';');
            $.each(txt, function(idx, obj){
                var tmp = obj.split(':');
                if (tmp[0]) {
                    o[tmp[0]] = tmp[1] || '';
                }
            });
            return o;
        };

        this.getInitialStyles = function(selector, styles) {
            o = {};
            for (property in styles) {
                o[property] = $(selector).css(property) || '';
            }
            return o;
        };

        this.getStyles = function(selector) {
            var o = [];
            this.eachStyleSheets(function(ss) {
                var txt = this.getText(ss, selector);
                if (txt && txt != '') {
                    o.push(txt);
                }
            });
            return this.text2object(o.join(';'));
        };

        this.eachStyleSheets = function(callback, args) {
            for (var i = 0; i < document.styleSheets.length; i++) {
                var ss = document.styleSheets[i];
                callback.apply(this, [ss]);
            }
            
        };

        this.grep = function(regx, ss) {
            if (typeof(ss.cssRules) != 'undefined') {
                var text = $.map(ss.cssRules, function(a){ return a.cssText || ''; }).join('');
            }
            else {
                var text = this.cache[ss.href || 'style'];
            }
            if (text) {
                var match = text.match(regx);
                if (match) {
                    var o = {};
                    $.each(match, function(i, obj) {
                        o[obj] = regx; // get rid of duplicates
                    });
                    return o;
                }
            }
            return false;
        };

        this.attach = {
            'pseudo-class': function(objs) {
                this.eachStyleSheets(function(ss){
                    for (var i in objs) {
                        var r = new RegExp('([a-z0-9.\\-_#~>+=\\[\\]"]|\\s)+:'+i, 'gi');
                        var match = this.grep(r, ss);
                        if (match) {
                            var callback = objs[i];
                            $.each(match, function(selector, regx){
                                callback.apply(css, [selector, regx])
                            });
                        }
                    }
                });
            }
        };
        // Cache stylesheets (because IE6's cssText property is unusable)
        if ($.browser.msie && parseInt($.browser.version, 10) < 7) {
            this.load();
        }
    });

    $.extend({
        extendCSS: function(type, obj) {
            if (!type) {
                $.each($.cssExt, function(type, obj){
                    css.attach[type].apply(css, [obj]);
                });
            }
            else {
                $.extend($.cssExt[type], obj);
                $.extendCSS();
            }
        },
        extendCSSif: function(condition, type, obj) {
            if (condition) {
                return $.extendCSS.apply(this, [type, obj]);
            }
        }
    });
});
$(function(){
    /*
     * Implementing -moz-border-radius in non-mozilla browsers
     * with jQuery.corner:
     *
    $extendCSSif(($.fn.corner && !$.browser.mozilla), 'property', {
        '-moz-border-radius': 
          function(selector, value) { $(selector).corner(value); },
        '-moz-border-radius-topLeft': 
          function(selector, value) { $(selector).corner('tl '+ value); },
        '-moz-border-radius-bottomLeft': 
          function(selector, value) { $(selector).corner('bl '+ value); },
        '-moz-border-radius-topRight': 
          function(selector, value) { $(selector).corner('tr '+value); },
        '-moz-border-radius-topRight': 
          function(selector, value) { $(selector).corner('br '+value); }
    });
    */
    $.extendCSSif(($.browser.msie 
        && parseInt($.browser.version, 10) < 7),
        'pseudo-class', {
            'hover': function(selector) {
                var selector2 = selector.replace(':hover', '');
                var styles2 = this.getStyles(selector); // new styles
                var styles1 = this.getInitialStyles(selector2, styles2); // original styles
                $(selector2).hover(function(){
                    $(this).css(styles2); // apply :hover styles
                }, function(){
                    $(this).css(styles1); // restore original styles
                });
            },
            'first-child': function(selector) {
                var sel = selector.replace(':first-child', '');
                $(sel).filter(':first').css(this.getStyles(sel));
            }
    });
});
