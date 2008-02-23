/*
  jQuery cycle - 0.2
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com>
  http://haineault.com   

  MIT License (http://www.opensource.org/licenses/mit-license.php)

  Changelog
  =========
  -- 0.2 --
  - changed namespace to cycle
  - now allowing custom callback functions
  - fixed variable scope bug with multiple instances
  - added license
*/

(function($) {

    function def_callback(element, image) {
        if ($.browser.mozilla) window.scrollTo(window.pageXOffset, window.pageYOffset); // scrollfix
        $(element).hide().css({backgroundImage:'url("'+ image +'")'});
        $(element).fadeIn('slow');
    }

    function shuffle (b) {
        for(var j, x, i = b.length; i; j = parseInt(Math.random() * i, 10), x = b[--i], b[i] = b[j], b[j] = x);
        return b;
    }

    $.extend($.fn, {
        cycle: function (imgs, delay, cb) {
            var index    = 0;
            var img      = new Image();
            var images   = [];
            var element  = null;
            var images   = shuffle(imgs)
            var element  = $(this).get(0)
            var callback = cb || def_callback;

            function cycle() {
                callback.apply(this, [element, images[index]]);
                if (index < images.length-1) index++;
                else index = 0;
            }

            for (id in images) { img.src = images[id]; } // preload

            setInterval(cycle, delay);
            cycle();
        }
    });
})(jQuery);

