/*
  jQuery query.jpath - 0.1
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php


    obj = {
        a: 'A',
        b: [1,2,4]
        c: {
            a: 'A',
            b: [1,2,3]
            c: { test: 'blah' }
        }
    }

    $.jpath('a')
    $.jpath('b:first')
    $.jpath('c > a')
    $.jpath('c > b:contains(2)')
    $.jpath('c c > test')


*/

(function($){
    $.jpath = {
        getPaths: function(selector) {
            return selector.replace(/\s+/g, ' ').split(/\s?,\s?/g);
        },
        getObj: function(scope, str) {
            if (str.indexOf(':') == -1) {
                return scope[str] || false;
            }
            else {
                var match = str.match(/(\w+):(\w+)(\(?.*\)?)/);
                var raw   = match[0];
                var str   = match[1]
                var expr  = match[2];
                var param = match[3] && match[3].slice(1,-1) || false;
                if ($.jpath.isExpr(expr)) {
                    return $.jpath.expr[expr](scope, str, param);
                }
            }
        },
        isExpr: function(str) {
            return !!this.expr[str];
        },
        isAxis: function(str) {
            return !!this.axis[str];
        },
        // a: element, i: index, m: [selector, epr, param, ?]
        axis: {
            // descendant
            ' ': function(scope, str) {
                return $.jpath.getObj(scope, str);
            },
        },
        expr: { // s: scope, k: key, p: param

            'first': function(s, k, p) {
                return s[k] && s[k][0] || false;
            },

            'eq': function(s, k, p) {
                return s[k] && s[str][p] || false;
            },

            'is': function(s, k, p) {
                return s[k] && (s[k] == p);
            },

            'nth': function(s, k, p) {
                return s[k] && s[k][p || 0] || false;
            },

            'contains': function(s, k, p) {
                var p = p.match(/^\d+$/) && parseInt(p.match(/^\d+$/)[0], 10) || p;
                return s[k] && s[k].indexOf(p) > -1 && true || false;
            },
        }
    }; 
    $.extend($.fn, {
        jpath: function(selector, a) {
            var str   = false;
            var axis  = false;
            var scope = $(this).get(0);

            $.each($.jpath.getPaths(selector), function() {
                var path = this.split(/(\s[<>+]?\s?)/);
                $.each(path, function(i){
                    var str = $.trim(this) || ' ';

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
