/*
 jQuery delayed observer 0.5 ~ http://code.google.com/p/jquery-utils/

 (c) 2007 ~ Maxime Haineault (haineault@gmail.com)
 
 MIT License (http://www.opensource.org/licenses/mit-license.php)
 
 changelog
 ---------
 0.2 using closure, special thanks to Stephen Goguen & Tane Piper.
 0.3 now allow object chaining, added license
 0.4 code cleanup, added support for other events than keyup, fixed variable scope
 0.5 changed filename, included in jquery-utils 
*/

(function() {
  var stack = [];var target;
 
  function callback(pos) {
    target = stack[pos];
    if (target.timer) clearTimeout(target.timer);
   
    target.timer = setTimeout(function(){
      target.timer = null;
      target.callback(target.obj.val(), target.obj);
    }, target.delay * 1000);

    target.oldVal = target.obj.val();
  } 
 
  $.fn.extend({
    delayedObserver:function(delay, callback, opt){
      var $this = $(this);
      var event = opt.event || 'keyup';
      var pos   = 0;
      
      stack.push({obj: $this, timer: null, delay: delay,
                  oldVal: $this.val(), callback: callback});
       
      pos = stack.length-1;
     
      $this[event](function() {
        target = stack[pos];
          if (target.obj.val() == target.obj.oldVal) return;
          else callback(pos);
      });
      return this;
    }
  });
})(jQuery);
