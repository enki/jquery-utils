/*
  jQuery query.jpath - 0.1
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

(function($){
    $.jpath = {
        getPaths: function(selector) {
            return selector.replace(/\s+/g, ' ').split(/\s?,\s?/g);
        },
        getObj: function(s, k) {
            if (k.indexOf(':') == -1) {
                return s[k] || false;
            }
            else {
                var match = k.match(/(\w+):(\w+)(\(?.*\)?)/);
                var raw   = match[0];
                var k     = match[1];
                var expr  = match[2];
                var p     = match[3] && match[3].slice(1,-1) || false;
                if ($.jpath.isExpr(expr)) {
                    return $.jpath.expr[expr](s, k, p);
                }
            }
        },
        isExpr: function(k) {
            return !!this.expr[k];
        },
        isAxis: function(k) {
            return !!this.axis[k];
        },
        axis: {
            // descendant
            ' ': function(s, k) {
                return $.jpath.getObj(s, k);
            },
        },
        expr: { // s: scope, k: key, p: param

            'contains': function(s, k, p) {
                var p = p.match(/^\d+$/) && parseInt(p.match(/^\d+$/)[0], 10) || p;
                return s[k] && s[k].indexOf(p) > -1 && true || false;
            },

            'eq': function(s, k, p) {
                return s[k] && s[k][p] || false;
            },

            'first': function(s, k) {
                return s[k] && s[k][0] || false;
            },
            
            'last': function(s, k) {
                return s[k] && s[k][s[k].length-1] || false;
            },

            'is': function(s, k, p) {
                return s[k] && (s[k] == p);
            },
        }
    }; 
    $.extend($.fn, {
        jpath: function(selector, a) {
            var str   = false;
            var axis  = false;
            var path  = false;
            var scope = $(this).get(0);

            $.each($.jpath.getPaths(selector), function() {
                path = this.split(/(\s[<>+]?\s?)/);
                $.each(path, function(i){
                    str = $.trim(this) || ' ';
                    if ($.jpath.isAxis(str)) {
                        axis = $.jpath.axis[str];
                    }
                    else if (axis) {
                        scope = axis(scope, str, i);
                    }
                    else {
                        scope = $.jpath.getObj(scope, str);
                    }
                });
            });
            return scope;
        }
    });
 })(jQuery);
