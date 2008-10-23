var css = false;
;(function(){
    // http://www.javascriptkit.com/dhtmltutors/externalcss2.shtml
    css = (new function() {
        this.stylesheets = document.styleSheets;

        // find all rules matching a givin selector
        this.findRules = function(selector) {
            var matches = [];
            for (var i = 0; i < this.stylesheets.length; i++) {
                console.log(i);
                //console.log(i, this.stylesheets[i]);
                var ss = this.stylesheets[i];
                if (ss.rules) {
                console.log('ARGH', ss.rules);
                    for (var x = 0; x< ss.rules.length; i++) {
                        var r = ss.rules[i];
                        //if (typeof(r) == 'object' && r.selectorText.match(selector)) {
                        //    console.log('CCC', r);
                        //    matches.push(r);
                        //}
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
        // get style (as object) associated with a rule
        this.getStyles = function(rule) {
            var s = false;
            for (var i = 0; i < this.stylesheets.length ; i++) {
                var ss = this.stylesheets[i];
                if (typeof(ss) == 'object') { // TODO: not foolproof
                    try {
                        // IE
                        var pos = ss.cssText.indexOf(rule.selectorText);
                        if (pos > -1) {
                            var part1 = ss.cssText.slice(pos, -1);
                            var part2 = part1.slice(rule.selectorText.length, part1.indexOf('}'));
                            s = part2.replace(/\{|\s+|\n/gi, '');
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
        }
    });

    var rules = [];
    var applyRules = function() {
        $.each(rules, function(i, rule){
            for (k in rule) {
                //console.log(k, css.findRules(k));
                $.each(css.findRules(k), function(){
                    rule[k].apply(css, [this]);
                });
            }
        });
    };
    $.extend({
        'extendCSS': function(i) {
            return i && rules.push(i) || applyRules(); 
        }
    });
})(jQuery);
if ($.browser.msie) {
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
            //console.log(rule);
            var selector = rule.selectorText.replace(':first-child', '');
            var styles   = this.getStyles(rule);
            $(selector).filter(':first').css(styles);
        }
    });
}
$(function(){$.extendCSS();});
/*
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



var MAX_DUMP_DEPTH = 10;  
function dumpObj(obj, name, indent, depth) {
    if (depth > MAX_DUMP_DEPTH) {
           return indent + name + ": <Maximum Depth Reached>\n";
    }
    if (typeof obj == "object") {
           var child = null;
           var output = indent + name + "\n";
           indent += "\t";
           for (var item in obj)
           {
                 try {
                        child = obj[item];
                 } catch (e) {
                        child = "<Unable to Evaluate>";
                 }
                 if (typeof child == "object") {
                        output += dumpObj(child, item, indent, depth + 1);
                 } else {
                        output += indent + item + ": " + child + "\n";
                 }
           }
           return output;
    } else {
           return obj;
    }
}
*/
