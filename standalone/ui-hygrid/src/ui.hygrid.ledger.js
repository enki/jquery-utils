/*
  jQuery ui.hygrid.ledger
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php
*/
(function($){

function applyLedger(ui) {
    ui._('tbody').find('tr')
        .filter(':odd').addClass('odd').end()
        .filter(':even').addClass('even');
}

$.ui.hygrid.defaults.ledger = true;
$.ui.plugin.add('hygrid', 'ledger', {
    initialized: function(e, ui) { 
        applyLedger(ui);
    },
    dataloaded: function(e, ui) { 
        applyLedger(ui);
    }
});

})(jQuery);
