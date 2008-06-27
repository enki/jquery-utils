/*
  jQuery ctrl.datetime - 0.1
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

$.widget('ctrl.datetime', {
    init: function(){
        var self = this;
                var id   = $(self.element).attr('id');
                var dt   = $(self.element).val().split(/\s/);
                var date = dt[0];
                var time = dt[1];
                var id_t = 'ctrl-datetime-t-'+ id;
                var id_d = 'ctrl-datetime-d-'+ id;

        $(self.element).hide();

        $('<input type="text" class="ctrl-datetime ctrl-time ctrl-keynav ctrl-keynav-time" />')
            .attr('id', id_t).val(time).insertAfter(self.element);
        $('<input type="text" class="ctrl-datetime ctrl-date" />')
            .attr('id', id_d).val(date).insertAfter(self.element)
            .datepicker({mandatory:true, dateFormat: 'yy-mm-dd'});
    }
});

$.ctrl.datetime.defaults = {
    format: '{year:d}-{month:d}-{day:d} {hour:d}:{minute:d}:{second:d}'
};

