/*
  api.youtube.js - 0.1a
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com>
  http://haineault.com   

  MIT License (http://www.opensource.org/licenses/mit-license.php)

  Usage
  =========

  <a href="http://www.youtube.com/v/VIDEO_ID" class="api-youtube">Video title</a>

  Changelog
  =========

*/

// Sadly we must keep this global..
function onYouTubePlayerReady(playerID) {
    console.log('test');
};

(function($){
    var player   = false;

    $.extend($.fn, {
        youtube: function() {
            $.each(this, function(){
                var href = $(this).attr('href');
                if (!href.match('enablejsapi')) {
                    href += '&enablejsapi=1&playerapiid=ytplayer';
                }
                $(this).flash({
                    id: 'ytplayer',
                    src: href,
                    width:  320,
                    height: 240
                });
            });
        }
    });

})(jQuery);
