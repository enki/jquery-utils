
$(function(){
    $('<div id="cycle-test"><img id="A" src="../demo/data/exclamation.png" width="16" height="16" /><img id="B" src="../demo/data/accept.png" width="16" height="16" /></div>').appendTo('#fixtures2');
    $('<div id="cycle-test2"><img id="C" src="../demo/data/exclamation.png" width="16" height="16" /><img id="D" src="../demo/data/accept.png" width="16" height="16" /><a id="cycle-next">next</a><a id="cycle-prev">prev</a></div>').appendTo('#fixtures2');
    
    module('jquery.cycle.js');
    test('Basic tests', function() {
        expect(3);
        stop();
        // simple image swap
        $('#cycle-test').cycle({fx:'fade', speed: 1, timeout: 1, autostop: true });
        setTimeout(function(){
            equals($('#cycle-test > img:visible').attr('id'), 'B', 'Base image transition');
        }, 300);
        
        // on click binding
        stop();
        $('#cycle-test2').cycle({fx:'fade', speed: 1, timeout: 1, autostop: true, next: '#cycle-next', prev: '#cycle-prev', prevNextClick: function(a, b, c){
            if ($(c).attr('id') == 'D' && !this.D) {
                this.D = true;
                equals($(c).attr('id'), 'D', 'Next button onclick event');
            }
            else if ($(c).attr('id') == 'C' && !this.C) {
                this.C = true;
                equals($(c).attr('id'), 'C', 'Prev button onclick event');
            }
        }});
        $('#cycle-next').click();
        $('#cycle-prev').click();
        // OK .. that's fairly ugly.
        setTimeout(function(){ start(); }, 500);

    });
    //$('#fixtures').html('');
    $('#fixtures2').show();
});
