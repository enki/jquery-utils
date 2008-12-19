/*
  jQuery array utils - 0.1
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

(function($){
    
    var dummy      = function(i) { return i; };
    var truthiness = function(i) { return !!i; };

    $.extend({

        all: function(object, iterator){
            var output   = true;
            var iterator = iterator || truthiness;
            $.each(object, function(idx, i){
                if (!iterator(i)) { output = false; }
            });
            return output;
        },

        any: function(object, iterator){
            var output   = false;
            var iterator = iterator || truthiness;
            $.each(object, function(idx, i){
                return iterator(i) && !(output = true) || true;
            });
            return output;
        },

        // equivalent of array.find
        detect: function(object, iterator){
            var output   = false;
            var iterator = iterator || truthiness;
            $.each(object, function(idx, i){
                //return iterator(i) && !(output = i) || true;
                if (iterator(i)) { 
                    output = i; 
                    return false;
                }
            });      
            return output;
        },

        eachSlice: function(object, size, iterator){
            var index = - size, slices = [];
            while ((index += size) < object.length){ 
                slices.push($.map(object.slice(index, index + size), iterator || dummy)); 
            } 
            return slices;
        },

        inject: function(object, acc, iterator){
            $.each(object, function (idx, val) {
                acc = iterator(acc, val, idx);
            }); 
            return acc;
        },

        invoke: function(object, method, args){
            $.each(object, function(){
                if ($.isFunction(method)){
                    method.apply(object, args);
                }
                else if ($.isFunction(window[method])){
                    window[method].apply(object, args);
                }
            });
            return object;
        },

        max: function(object, iterator) {
            var output = false; 
            $.each(object, function (idx, val) {
                var rs = (iterator || dummy)(val, idx);
                if (!output || rs > output) { output = rs; }
            }); 
            return output;
        },

        min: function(object, iterator) {
            var output = false; 
            $.each(object, function (idx, val) {
                var rs = (iterator || dummy)(val, idx);
                if (!output || rs < output) { output = rs; }
            }); 
            return output;
        },

        partition: function(object, iterator) {
            var trues = [], falses = []; 
            $.each(object, function (idx, val) {
                ((iterator || truthiness)(val, idx) ? trues : falses).push(val);
            }); 
            return [trues, falses];
        },
        
        pluck: function(object, property, iterator) {
            var output = [];
            var iterator = iterator || dummy;
            $.each(object, function(){
                output.push(iterator(this[property]));
            });
            return output;
        },

        reject: function(object, iterator){
            return $.select(object, (iterator || function(i){ return !i; }));
        },

        // findAll equivalent
        select: function(object, iterator){
            var output   = [];
            var iterator = iterator || truthiness;
            $.each(object, function(idx, i){
                if (iterator(i)) { 
                    output.push(i); 
                }
            });
            return output;
        },

        sum: function(object, iterator){
            var iterator = iterator || function(i) { return parseInt(i, 10) };
            var t = 0;
            $.each(object, function(){
                var v = iterator(this);
                if (!isNaN(v)) { t = t + v; }
            });
            return t;
        },

        zip: function(object, object2, iterator) {
            var output = [];
            var iterator = iterator || dummy;
            $.each(object, function(idx, i){
                if (object2[idx]) { output.push([i, object2[idx]]); }
            });
            return output;
        }
    });

    $.extend($.fn, {
        all:       function(iterator) { return $.all(this, iterator); },
        any:       function(iterator) { return $.any(this, iterator); },
        pluck:     function(property, iterator) { return $.pluck(this, property, iterator); },
        detect:    function(iterator) { return $($.detect(this, iterator)); },
        eachSlice: function(size, iterator) { return $.eachSlice(this, size, iterator); },
        select:    function(iterator) { return $.findAll(this, iterator); },
        sum: function(iterator) {
            var iterator = iterator || function(i) {
                return parseFloat($(i).val() || $(i).text(), 10);
            };
            return $.sum(this, iterator);
        }
    });
})(jQuery);
