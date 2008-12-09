/*
  jQuery array utils - 0.1
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

(function($){

    function arr(a) {
        this.a = a;
        return this;
    };

    $a = function(a) { 
        return new arr(a); 
    };

    // SUM
    arr.prototype.sum = function() {
        var t = 0;
        $.each(this.a, function(){
            t = t + parseFloat(this, 10);
        });
        return t;
    };

    // MERGE
    arr.prototype.merge = function(a2) {
        this.a = $.merge(this.a, a2);
        return this;
    };

    // PLUCK
    // Fetching the same property for all the elements. 
    // Returns a array of the property values.
    arr.prototype.pluck = function(property) {
        var rs = [];
        $.each(this.a, function(){
            rs.push(this[property]);
        });
        this.a = rs;
        return this;
    };

    // ZIP
    arr.prototype.zip = function(a2) {
        var o = [];
        $.each(this.a, function(idx, i){
            if (a2[idx]) { o.push([i, a2[idx]]); }
        });
        this.a = o;
        return this;
    };

    // OUTPUT RESULT(S) 
    arr.prototype.end = function() {
        return this.a;
    };
})(jQuery);
