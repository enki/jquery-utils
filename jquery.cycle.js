(function($) {
    var index    = 0;
    var img      = new Image();
    var images   = [];
    var element  = null;

    var callback = function(image) {
                if ($.browser.mozilla) window.scrollTo(window.pageXOffset, window.pageYOffset); // scrollfix
        $(element).hide().css({backgroundImage:'url("'+ images[index] +'")'});
        $(element).fadeIn('slow');
    };

    function shuffle (b) {
        for(var j, x, i = b.length; i; j = parseInt(Math.random() * i, 10), x = b[--i], b[i] = b[j], b[j] = x);
        return b;
    }

    function cycle() {
        callback.apply(this, [element, images[index]]);
        if (index < images.length-1) index++;
        else index = 0;
    }

    $.extend($.fn, {
        cycleImages: function (imgs, delay, cb) {
            images   = shuffle(imgs), element = $(this).get(0), callback =  cb || callback;
            for (id in images) { img.src = images[id]; } // preload
            setInterval(cycle, delay);
            cycle();
        }
    });
})(jQuery);

