/*
 jQuery delayed observer - 0.5
 http://code.google.com/p/jquery-utils/

 (c) Maxime Haineault <haineault@gmail.com>
 http://haineault.com
 
 MIT License (http://www.opensource.org/licenses/mit-license.php)
 
 Changelog
 =========
 0.2 using closure, special thanks to Stephen Goguen & Tane Piper.
 0.3 now allow object chaining, added license
 0.4 code cleanup, added support for other events than keyup, fixed variable scope
 0.5 changed filename, included in jquery-utils 
 0.6 complete rewrite, same structure but more compact, 
     now using jquery's "data" method instead of a stack to store data
     it's now possible to change the condition, by default it's "if new this.val == this.oldval"
*/

(function($){
    $.extend($.fn, {
        delayedObserver: function(callback, delay, options){
            $obj    = $(this);
            options = options || {};
            $obj.data('oldval',    $obj.val())
                .data('delay',     delay || 0.5)
                .data('condition', options.condition || function() {
                    return ($(this).data('oldval') == $(this).val());
                })
                .data('callback',  callback)
                [(options.event||'keyup')](function(){
                    if ($obj.data('condition').apply($obj)) return;
                    else {
                        if ($obj.data('timer')) clearTimeout($obj.data('timer'));
                      
                        $obj.data('timer', setTimeout(function(){
                            $obj.data('callback').apply($obj);
                        }, $obj.data('delay') * 1000));
                      
                        $obj.data('oldval', $obj.val());
                    }i
                });
        }
    });
})(jQuery);
