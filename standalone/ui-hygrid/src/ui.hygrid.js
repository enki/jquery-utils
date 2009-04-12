/*
  jQuery ui.hygrid - @VERSION
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

(function($) {

$.widget('ui.hygrid', {
    plugins:  {},
    _fixCellInex: 1,
    _init: function() {
        this._trigger('initialize');
        this._trigger('initialized');
        this._trigger('gridrefresh');
    },

    params: function() {
        o = {};
        for (x in this.options.params) {
            var param = this.options.params[x];
            if (this.options[param]) {
                o[param] = this.options[param];
            }
        }
        return o;
    },

    '_': function() {
        if (arguments.length == 1) {
            return this._getData(arguments[0]);
        }
        else {
            return this._setData(arguments[0], arguments[1]);
        }
    },

    cols: function(visible) {
        // TODO: Got to find a more reliable/clean way to do this..
        if (this.options.htmltable) {
            var length = this._('tbody').find('tr:eq(0) td').length;
        }
        else {
            var length = this._('thead').find('th.ui-hygrid-header').length;
        }
        return this.options.cols > length && this.options.length || length;
    },
    
    // Returns all element from a given column index
    col: function(index, excludeHeader) {
        var tbody = this._('tbody');
        var thead = this._('thead');
        return excludeHeader && tbody.find('td:nth-child('+ (index+1) +')')
                             || thead.find('th:nth-child('+ (index+1) +')')
                                    .add(tbody.find('td:nth-child('+ (index+1) +')'));
    },

    row: function(i) {
        return this._('tbody').find('tr').eq(i);
    },

    cell: function(x, y, visible) {
        var tbody = this._('tbody');
        return visible && tbody.find('tr:visible').eq(y).find('td:visible').eq(x)
                       || tbody.find('tr').eq(y).find('td').eq(x);
    },

    cells: function(visibleOnly) {
        var tbody = this._('tbody');
        return visibleOnly && tbody.find('td') || tbody.find('td:visible');
    },
    

    _setGridWidth: function(){
        var wrapper = this._('wrapper');
        var table   = this._('table');
        switch (this.options.width || 'auto') {
            case 'auto':
                wrapper.width(table.width());
            break;
            case 'fill':
                var w = wrapper.parent().width();
                wrapper.width(w)
                table.width(w);
            break;
            default:
                wrapper.width(this.options.width);
                table.width(this.options.width);
            break;
        };
    },

    _createRow: function(cells) {
        var row = $('<tr />');
        for (i in cells) {
            var cell  = this.options.cols && this.options.cols[i] || {}; 
            cell.text = cells[i];
            cell.isTH = !(cell.isTD = true);
            cell.type = 'td';
            row.append(this._createCell(cell));
        }
        this._trigger({type: 'rowinsert', insertedRow: row});
        row.appendTo(this._('tbody'));
        this._trigger({type: 'rowinserted', insertedRow: row});
    },

    _createCell: function(cell) {
        cell.type = cell.type.toLowerCase() || 'td';
        cell.isTD = !(cell.isTH = (cell.type == 'th'));
        var el    = $(cell.isTH && '<th class="ui-hygrid-header"><div /></th>' || '<td />');
        if (cell.isTD) { el.text(cell.text); }
        return this._applyCellModifiers(el, cell);
    },

    _applyCellModifiers: function(el, cell, col){
        var $el = $(el);
        var mod = $.keys($.ui.hygrid.cellModifiers);
        if ($el.get(0)) {
            for (x in mod) {
                if (cell[mod[x]]) {
                    try {
                        $.ui.hygrid.cellModifiers[mod[x]]
                            .apply(this, [$el, cell, col]);
                    } catch(e) {}
                }
            }
        }
        return el;
    },
    
    _setColOption: function(i, o, v) {
        try {
            return this.options.cols[i][o] = v;
        }
        catch(e) {
            return false;
        }
    },

    _getColOptions: function(i, o) {
        try {
            return this.options.cols[i][o];
        }
        catch(e) {
            return false;
        }
    },
    // type, e, ui 
    // {type: }
    _trigger: function() {
        var ui = arguments[2] || this;
        var ev = $.isObject(arguments[0]) && $.Event(arguments[0]) || $.Event(arguments[0]);
        var type = $.isObject(arguments[0]) && arguments[0].type || arguments[0];
        if (ui.options.debug || ui.options.trace) {
            ui._debug.apply(this, [ev.type, ev, ui]);
        }
        $.ui.plugin.call(this, type, [ev, ui]);
        return $.widget.prototype._trigger.call(this, ev.type, [ev, ui]);
    },

    _debug: function(type, e, ui) {
        var debug = ui.options.debug;
        var trace = ui.options.trace;
        if (debug == true ||( $.isArray(debug) && debug.indexOf(type) > -1)) {
            try {
                console.groupCollapsed('hygrid: %s', type); 
                console.log('Event: %o', e); 
                console.log('Widget: %o', ui); 
                if (trace === true) {
                    console.log('Traceback:', ui._trigger.caller.toString());
                    console.trace();
                }
                console.groupEnd('hygrid: %s', type); 
            } catch(e) {};
        }
    }
});
// These properties are shared accross every hygrid instances
$.extend($.ui.hygrid, {
    version:     '@VERSION',
    eventPrefix: 'grid',
    getter:      'col cells cell row',
    defaults: {
        width:   'auto', 
        params:  [],
        cols:    [],
        debug:   false
    },
    cellModifiers: {},
    parsers: {}
});

})(jQuery);
