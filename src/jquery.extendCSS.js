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

        // Thanks Dean Edwards :D
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
            var text = this.cache[ss.href || 'style'];
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
                        var callback = objs[i];
                        if (match) {
                            $.each(match, function(selector, regx){
                                callback.apply(css, [selector, regx])
                            });
                        }
                    }
                });
            }
        };
        // Cache stylesheets (because IE's cssText property is unusable)
        this.load();
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
                var selector2 = selector.replace(':first-child', '');
                $(selector2).filter(':first').css(this.getStyles(selector2));
            }
    });
});

/*
 * Original Firefox prototype

$(function(){
    var fixes = {
        ':hover': function() {
            var selector = this.selectorText.replace(/:hover/g, '');
            var styles   = getStyles(this);
            $(selector).hover(function(){
                $(this).css(styles[1]);
            }, function(){
                $(this).css(styles[0]);
            });
        },
        ':focus': function() {
            //console.log('fixing :focus - ', this);
        }
    };
    var getStyles = function(rule) {
        var n = {}; // new styles
        var o = {}; // original styles
        return ['a','b'];
        var styles = rule.cssText.replace(rule.selectorText, '').replace(/{|}|\s/gi, '').split(';')
        var selector = rule.selectorText.replace(/:hover/g, '');
        $.each(styles, function(i, style){
            var s = style.split(':')
            if (s[0] && s[1]) {
                o[s[0]] = $(selector).css(s[0]);
                n[s[0]] = s[1];
            }
        });
        o['border'] = '';
        n['border'] = '1px solid #c30';
        return [o, n]; 
    };
    var fix = function(rule) {
        $.each(fixes, function(k, callback) {
            if (rule.selectorText.match(k)) {
                callback.apply(rule, []);
            }
        });
    };
    
    var re = [];
    $.each(fixes, function(k){ re.push(k); });
    re = new RegExp(re.join('|'), 'i'); 
   
    for (var i in document.styleSheets) { 
        var ss = document.styleSheets[i];
        if (typeof(ss) == 'object') { 
            for (var i in ss.rules) {
                var rule = ss.rules[i];
                // could be done more efficiently
                // http://msdn.microsoft.com/en-us/library/ms531199(VS.85).aspx#
                if (typeof(rule) == 'object') { 
                    if (re.test(rule.selectorText)) { 
                        document.write(dumpObj(rule.style));
                        //fix(rule);
                    } 
                }
            }
        }
    }

    //$.each(document.styleSheets, function() { 
    //   var ss = this;
    //   $.each(ss.cssRules, function() { 
    //       var rule = this;
    //       if (re.test(rule.selectorText)) { 
    //           fix(rule);
    //       } 
    //   });
    //}); 
});
*/
