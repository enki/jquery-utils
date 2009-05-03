/* jQuery ui.djangoForm.js - 0.1
 *
 * (c) Maxime Haineault <haineault@gmail.com>
 * http://haineault.com 
 * 
 * MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * */

$.widget('ui.djangoForm', {
    _init: function(fields) {
        var ui = this;

        ui.element = $(ui.element).eq(0).bind('submit', function(e){
            $(this).removeClass('ui-djangoForm-error').find('ul.'+ ui.options.errorListClass).remove();
            $.each(ui.options.fields, function(name, field){
                ui._applyRules(field, true);
            });
            return !ui._hasErrors; // don't submit if it has errors
        });

        $.each(ui.options.fields, function(name, field){
            var id = $.format('#{0:s}{1:s}', ui.options.idPrefix, name);
            field.id = id;
            field.name = name;
            field.element = $(id).data('validation.field', field);
            if (field.required) {
                field.element.parent().andSelf().addClass(ui.options.requiredClass);
            }
        });
    },
    _applyRules: function(field, applyRequired) {
        for (x in $.ui.djangoForm.defaults.rules) {
            field.rule = x; // I know.. it's ugly.
            if (applyRequired || (!applyRequired && x != 'required' && field[x])) {
                try {
                    $.ui.djangoForm.defaults.rules[x].apply(this, [field]);
                } catch(e){};
            }
        };
    },
    _error: function(field, data, msgRule) {
        var data = data || {};
        var msg = this.options.formatMessage(msgRule || field.rule, field, data);
        this._hasErrors = true;
        this.options.error.apply(this, [field, msg, data]);
        this.element.addClass('ui-djangoForm-error');
    }
});

$.tpl('djangoForm.errorList', '<ul />');
$.tpl('djangoForm.error', '<li />');

$.ui.djangoForm.defaults = {
    rules: {},
    layout: 'table',
    requiredClass: 'ui-djangoForm-required',
    errorListClass: 'errorlist', // use the same as Django by default 
    idPrefix: 'id_',
    formatMessage: function(msg, field, tokens) {
        if(field.msgs[msg]) {
            return $.format(field.msgs[msg].replace(/%\((\w+)\)(\w)/g, '{$1:$2}'), tokens || {});
        }
    },
    error: function(field, msg, data) {
        if (!field.element.next().is('ul')) {
            $.tpl('djangoForm.errorList')
                .addClass(this.options.errorListClass)
                .insertAfter(field.element);
        }
        $.tpl('djangoForm.error')
            .appendTo(field.element.next())
            .text(msg);
    }
};

$.extend($.ui.djangoForm.defaults.rules, {
    
    required: function(field) {
        if (field.element.val() == '') {
            this._error(field);
        }
    },

    max_length: function(field) {
        var cl  = field.element.val().length;
        var ml = field.rules.max_length || false;
        if (ml <= cl) {
            this._error(field, { max: ml, length: cl });
        }
    },

    min_length: function(field) {
        var cl  = field.element.val().length;
        var ml = field.rules.min_length || false;
        if (ml >= cl) {
            this._error(field, { min: ml, length: cl });
        }
    },

    decimal_length: function(field) {

        var DECIMAL_LENGTHS = /^[-\s0]*(\d*).?(\d*)\s*$/;
        var value = field.element.val();
        var match = DECIMAL_LENGTHS.exec(value);
        if (match) {
            var max_digits = field.rules.max_digits;
            if (max_digits !== null && (match[1].length + match[2].length) > max_digits) {
                this._error(field, {max_digits: max_digits}, 'max_digits');
            }

            var max_decimal_places = field.rules.max_decimal_places;
            if (max_decimal_places !== null && match[2].length > max_decimal_places) {
                this._error(field, {max_decimal_places: max_decimal_places}, 'max_decimal_places');
            }

            if (max_digits !== null && max_decimal_places !== null) {
                var max_whole_digits = max_digits - max_decimal_places;
                if (match[1].length > max_whole_digits) {
                    this._error(field, {max_whole_digits: max_digits}, 'max_whole_digits');
                }
            }
        }
    }

});

$(function(){
    $('form').djangoForm({
        fields: {% render_ajax_fields form %},
        layout: 'ul',
        validation_events: ['blur'],
        add_required_indicators: true
    });
});

