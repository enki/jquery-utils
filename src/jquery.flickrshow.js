/*
  jQuery flickrshow - 0.1.0
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com>
  http://haineault.com   

  MIT License (http://www.opensource.org/licenses/mit-license.php)
  
  Largely inspired from this blog post:
  http://www.viget.com/inspire/pulling-your-flickr-feed-with-jquery/

*/

var jsonFlickrFeed = function() {};

(function($){
    $.tpl('flickrshow.wrapper',  '<div class="ui-flickrshow" />');
    $.tpl('flickrshow.titlebar', '<div class="ui-flickrshow-titlebar"><a href="{href:s}" title="{title:s}">{title:s}</a></div>');
    $.tpl('flickrshow.image',    '<a href="{href:s}" title="{title:s}"><img src="{src:s}" class="ui-flickrshow-image" alt="{alt:s}" border="{border:d}" /></a>');
    $.tpl('flickrshow.toolbar',  [
        '<div class="ui-flickrshow-toolbar">',
            '<a id="ui-flickrshow-prev"></a>',
            '<a id="ui-flickrshow-browse" href="{link:s}" target="{browseTarget:s}"></a>',
            '<a id="ui-flickrshow-next"></a>',
        '</div>']);

	$.extend($.fn, {
		flickrshow: function(options, json) {
            var el  = this;
            var opt = $.extend({ 
                imgBorder: 0, 
                toolbar: true,
                titlebar: true,
                browseTarget: '_self',
                cycle: {}
            }, options);
            $.getJSON(opt.url, function(data, textStatus){ 
                var tpl = ['<div class="ui-flickrshow-body ui-content">'];
                var wrapper  = $.tpl('flickrshow.wrapper');

                for (i in data.items) {
                    tpl.push($.tpl('flickrshow.image', {
                        href:   data.items[i].link,
                        title:  data.items[i].title,
                        src:    data.items[i].media.m,
                        border: opt.imgBorder
                    }, true));
                }
                tpl.push('</div>');
                el.append(wrapper);

                if (opt.titlebar) {
                    $.tpl('flickrshow.titlebar', {
                        href: data.link,
                        title: data.title,
                        modified: data.modified
                    }).appendTo(wrapper);
                }

                if (opt.toolbar) {
                    opt.cycle.next = '#ui-flickrshow-next';
                    opt.cycle.prev = '#ui-flickrshow-prev';
                    $.tpl('flickrshow.toolbar', {
                        link: data.link, 
                        browseTarget: opt.browseTarget
                    }).appendTo(wrapper);
                }

                wrapper.append($(tpl.join('')))
                    .find('.ui-flickrshow-body').cycle(opt.cycle);
            });
            return $(el);
		}
	});
})(jQuery);
