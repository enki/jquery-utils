/*
  jQuery ui.datetime - 0.2
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

$.widget('ui.datetime', {
    init: function(){
        var self  = this;
        var id    = $(self.element).attr('id');
        var dt    = $(self.element).val().split(/\s/);
        var date  = dt[0];
        var time  = dt[1];
        var id_t  = 'ui-datetime-t-'+ id;
        var id_d  = 'ui-datetime-d-'+ id;
        
        self.options.datepicker.onClose = function(d) {
            var month = d.getMonth()+1 > 9 && d.getMonth()+1 || '0'+(d.getMonth()+1);
            var day   = d.getDate()    > 9 && d.getDate()    || '0'+d.getDate();
            $($('#'+$(this).attr('id').replace('ui-datetime-d-', '')))
                .val(d.getFullYear() +'-'+ month  +'-'+ day +' '+ $('#'+ id_t).val());
        }; 
        
        var d = $('<input type="text" class="ui-datetime ui-date ui-keynav ui-keynav-date" />')
            .attr('id', id_d).val(date).insertAfter(self.element)
            .datepicker(self.options.datepicker)
            .bind('keyup.datetime', function(){
                $(self.element).val($('#'+id_d).val() +' '+ $('#'+id_t).val()); });

        var t = $('<input type="text" class="ui-datetime ui-time ui-keynav ui-keynav-time" />')
            .attr('id', id_t).val(time).insertAfter(d)
            .bind('keyup.datetime', function(){
                $(self.element).val($('#'+id_d).val() +' '+ $('#'+id_t).val()); });

        $(self.element).get(0).type = 'hidden';
    }
});
$.ui.datetime.defaults = {
    format: '{year:d}-{month:d}-{day:d} {hour:d}:{minute:d}:{second:d}',
    datepicker: {
        mandatory:  true,
        dateFormat: 'yy-mm-dd'
    }
};
}
