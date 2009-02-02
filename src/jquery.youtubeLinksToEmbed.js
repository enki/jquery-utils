/*
  jQuery youtubeLinksToEmbed - 0.3
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com>
  http://haineault.com   

  MIT License (http://www.opensource.org/licenses/mit-license.php)

*/

(function($){
    var youtubeURL = 'http://www.youtube.com/v/';

    var yl2e = {
        onclick: function() {
            if ($(this).next().hasClass('youtubeLinksToEmbed')) { return false; }

            href    =  youtubeURL + this.href.match(/[a-zA-Z0-9-_]+$/) + '&rel=1';
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
    };

    $.fn.youtubeLinksToEmbed = function(options){
        var opt = $.extend({autoOpen: false}, options);
        $(this).find('a[href*=youtube.com/watch?v=]')
            .addClass('youtubeLinksToEmbed')
            .each(function(){ 
                $(this).click(yl2e.onclick);
                if (opt.autoOpen) {
                    $(this).trigger('click');
                }});
    };

    $.fn.youtubeInputsToEmbed = function(options) {
        $(this).find('input[value*=youtube.com/watch?v=]')
            .addClass('youtubeLinksToEmbed')
            .each(function(){ 
                $('<a href="'+ $(this).val() +'">watch</a>')
                    .insertAfter(this);});
        $(this).youtubeLinksToEmbed(options);
    };
})(jQuery);

$(document).ready(function(){
    $('body').youtubeLinksToEmbed();
});
