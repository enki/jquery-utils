var css = false;
$(function($){
    css = (new function(){
        try {
          this.httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
        } 
        catch (e) {
            this.httpRequest = new XMLHttpRequest(); // Mozilla
        } // ActiveX disabled

        this.cache = {};

        // Thanks Dean Edwards :D
        this.loadFiles = function() {
            for (var i = 0; i < document.styleSheets.length; i++) {
                var ss = document.styleSheets[i];
                // cache only remote stylesheet
                if (ss.href != '' && !this.cache[ss.href]) {
                    try {
                        // easy to load a file huh?
                        this.httpRequest.open('GET', ss.href, false);
                        this.httpRequest.send(null);
                        if (this.httpRequest.status == 0 || this.httpRequest.status == 200) {
                            console.log(this.httpRequest.responseText);
                          this.cache[ss.href] = this.httpRequest.responseText;
                        }
                    }
                    catch (e) {} // ignore errors 
                }
            }
        };

        this.getCssText = function(ss) {
            // inline styles
            if (ss.href == '' && ss.owningElement.nodeName.toLowerCase() == 'style') { 
                return ss.owningElement.innerHTML;
            }
            else if (this.cache[ss.href]) {
                return this.cache[ss.href];
            }
        };

        // Cache stylesheets (because IE's cssText property is unusable)
        this.loadFiles();
    });
});
/*
var css = false;
$(function(){
    // http://www.javascriptkit.com/dhtmltutors/externalcss2.shtml
    css = (new function() {
        this.stylesheets = document.styleSheets;
        this.cache = {}

        // Thanks Dean Edwards
        this.loadCSS = function(href, path) {
            var RELATIVE = /^[\w\.]+[^:]*$/;
            function makePath(href, path) {
              if (RELATIVE.test(href)) href = (path || "") + href;
              return href;
            };

            try {
              href = makePath(href, path);
              if (!this.cache[href]) {
                // easy to load a file huh?
                httpRequest.open("GET", href, false);
                httpRequest.send();
                if (httpRequest.status == 0 || httpRequest.status == 200) {
                  this.cache[href] = httpRequest.responseText;
                }
              }
            } catch (e) {
              // ignore errors
            } finally {
              return this.cache[href] || "";
            };
        };

        // find all rules matching a givin selector
        this.findRules = function(selector) {
            var matches = [];
            for (var i = 0; i < this.stylesheets.length; i++) {
                var ss = this.stylesheets[i];
                if (ss.rules && ss.rules.length > 0) {
                    console.log(ss);
                    for (var x = 0; x< ss.rules.length; x++) {
                        var r = ss.rules[x];
                        if (typeof(r) == 'object' && r.selectorText.match(selector)) {
                            matches.push(r);
                        }
                    }
                    //callback.apply(ss, [i, ss]);
                   // for (i in ss.rules) {
                   //     var r = ss.rules[i];
                   //     if (typeof(r) == 'object' && r.selectorText.match(selector)) {
                   //         console.log('CCC', r);
                   //         matches.push(r);
                   //     }
                   // }
                }
            }
            return matches;
        };
        this.getOriginalStyles = function(selector, styles) {
            o = {};
            for (property in styles) {
                o[property] = $(selector).css(property) || '';
            }
            return o;
        };
        this.getCssText = function(ss) {
            console.log('test')
            // IE 6
            //
            // I really hesitated to use Ajax to achieve this, 
            // I did not want to, but I had no other alternatives.
            //
            // In my first attempt I used IE's native cssText property.
            // Unfortunately, a zealot fucktard at Microsoft had the 
            // brillant idea to replace unsuported pseudo-selectors 
            // like :first-child by .. ":unknown". Thus rendering 
            // impossible any attempt to patch their mess, 
            // thanks asshole(s).
            //
            // My conclusion was: Yes, a minority of users will 
            // suffer from a slight performance decrease because
            // I use Ajax. But on the other hand, the price of
            // using an old outdated browser is shifted toward 
            // the user instead of the developer, and that my 
            // friends it's priceless.
            //
            // ~ h

            for (var i = 0; i < this.stylesheets.length ; i++) {
                var ss = this.stylesheets[i];
                console.log(ss);
                // inline style
                if (ss.href == '' && ss.owningElement.nodeName == 'STYLE') { 
                    var cssText = ss.owningElement.innerHTML;
                }
                // remote style
                else {
                    console.log('test');
                    $.get(ss.href, function(responseText, success) {
                        var cssText  = responseText.toLowerCase();
                        var pos      = cssText.indexOf(rule.selectorText.toLowerCase());
                        console.log('test', responseText);
                    });
                }
            }
        },
        // get style (as object) associated with a rule
        this.getStyles = function(rule) {
            var s = false;
            for (var i = 0; i < this.stylesheets.length ; i++) {
                var ss = this.stylesheets[i];
                this.getCssText(ss);
                if (typeof(ss) == 'object') { // TODO: not foolproof
                    try {
                        
                        // IE
                        if (ss.href == '') {
                            var cssText = ss.cssTex;
                            var pos = cssText.indexOf(rule.selectorText);
                            if (pos > -1) {
                                var part1 = cssText.slice(pos, -1);
                                var part2 = part1.slice(rule.selectorText.length, part1.indexOf('}'));
                                s = part2.replace(/\{|\s+|\n/gi, '');
                            }
                        }
                        else {
                            $.get(ss.href, function(responseText, success) {
                                var cssText  = responseText.toLowerCase();
                                var pos      = cssText.indexOf(rule.selectorText.toLowerCase());
                                console.log(pos, rule.selectorText);
                                if (pos > -1) {
                                    var part1 = cssText.slice(pos, -1);
                                    var part2 = part1.slice(rule.selectorText.length, part1.indexOf('}'));
                                    s = part2.replace(/\{|\s+|\n/gi, '');
                                }
                            });
                        }
                    }
                    catch(e) {}; // painful
                }
            }
            o = {};
            s = s.toLowerCase().split(';');
            $.each(s, function(i, obj){
                var tmp = obj.split(':');
                o[tmp[0]] = tmp[1];
            });
            return o;
        };



    });

    var rules = [];
    var applyRules = function() {
        $.each(rules, function(i, rule){
            for (selector in this) {
                $.each(css.findRules(selector), function(){
                    console.log('~~ ',rule, selector);
                    rule[selector].apply(css, [this, rule]);
                });
            }
        }); // my head spins
    };
    $.extend({
        'extendCSS': function(i) {
            return i && rules.push(i) || applyRules(); 
        }
    });

//if ($.browser.msie) {
    $.extendCSS({
        ':hover': function(rule) {
            var selector = rule.selectorText.replace(':hover', '');
            var styles2  = this.getStyles(rule); // new styles
            var styles1  = this.getOriginalStyles(selector, styles2); // original styles
            $(selector).hover(function(){
                $(this).css(styles2); // apply :hover styles
            }, function(){
                $(this).css(styles1); // restore original styles
            });
            },
        ':first-child': function(rule) {
            console.log('first-child: ', rule);
            var selector = rule.selectorText.replace(':first-child', '');
            var styles   = this.getStyles(rule);
            $(selector).filter(':first').css(styles);
        }
    });
//}
    $.extendCSS();
});
*/
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
