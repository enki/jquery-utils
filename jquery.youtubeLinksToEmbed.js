/*
  jQuery youtubeLinksToEmbed - 0.1
  (c) 2008 ~ Maxime Haineault (haineault@gmail.com)
  http://haineault.com   

  MIT License (http://www.opensource.org/licenses/mit-license.php)

*/

(function($){
    // http://www.youtube.com/watch?v=_23TGMeYrgw   url
    // http://www.youtube.com/v/7K2Z8hFdM84&rel=1   embed

    var yl2e = {
        onclick: function() {
            if ($(this).next().hasClass('youtubeLinksToEmbed')) return true;

            href    = 'http://www.youtube.com/v/' + this.href.match(/[a-zA-Z0-9-_]+$/) + '&rel=1'
            wrapper = $('<div class="youtubeLinksToEmbed" style="display:none;"><span>Loading...</span><div style="display:none;"></div></div>');
            player  = $('div:first', wrapper);

            player.flash({src: href, width: 425, height: 355});
            $(this).after(wrapper);
            wrapper.queue(function(){
                $(this).css('height', 40);
                $(this).dequeue();
                $(this).slideDown();
                $(this).dequeue();
            });
    
            setTimeout(function(){
                wrapper.queue(function(){
                    $(this).find('span').hide().end();
                    $(this).dequeue();
                    $(this).animate({height: 375});
                    $(this).dequeue();
                });
                setTimeout(function(){
                    player.show();    
                }, 500);
            }, 1500);

            return false;
        }    
    }

    $.extend($.fn, {
        youtubeLinksToEmbed: function(options){
            $(this).find('a[href~=youtube.com/watch?v=]')
                .addClass('youtubeLinksToEmbed')
                .each(function(){ 
                    $(this).click(yl2e.onclick) });
        }
    });
})(jQuery);


$(document).ready(function(){
    $('body').youtubeLinksToEmbed();
});
