/* jQuery ui.djangoForm.js - 0.1
 *
 * (c) Maxime Haineault <haineault@gmail.com>
 * http://haineault.com 
 * 
 * MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * */

if (!$.fn.type) {
$.extend($.fn, {
    type: function() {
        try { return $(this).get(0).nodeName.toLowerCase(); }
        catch(e) { return false; }
    }         
});
}

$.widget('ui.djangoForm', {
    _init: function(fields) {
        var ui = this;
        if (ui.options.fields) {
            if (ui.options.url && ui.element.type() != 'form') {
                ui._url = ui.options.url;
                $(this.element).load(ui._url, function(){
                    ui.form_type = $(this).find('form:first-child').type();
                    $(this).find('form').djangoForm(ui.options);
                }).djangoForm('destroy');
                if (ui.options.mode == 'dialog') {
                    $(this.element).dialog({
                        width:  ui.options.width  || false,
                        height: ui.options.height || false,
                        title:  ui.options.title  || false,
                    });
                }
                return false;
            }
            else {
                ui.form_type = ui.element.children(0).type();
                ui.element.bind('submit', function(e){
                    $(this).removeClass('ui-djangoForm-error').find('ul.'+ ui.options.errorListClass).remove();
                    $.each(ui.options.fields, function(name, field){
                        ui._applyRules(field, true);
                    });
                    return !ui._hasErrors; // don't submit if it has errors
                });

                if (ui.form_type == 'ul') {
                    $('input[type=checkbox]').prev().css('float', 'left');
                }
                $.each(ui.options.fields, function(name, field){
                    var id = $.format('#{0:s}{1:s}', ui.options.idPrefix, name);
                    field.id = id;
                    field.name = name;
                    field.element = $(id, ui.element).data('validation.field', field);
                    if (field.required != false) {
                        if (ui.form_type == 'table') {
                            field.element.parents('tr').andSelf().addClass(ui.options.requiredClass);
                        }
                        else {
                            field.element.parent().andSelf().addClass(ui.options.requiredClass);
                        }
                    }
                    if (ui.options.smart_field_width && field.rules['max_length']) {
                        if (ui.form_type == 'ul') {
                            var pw = field.element.parent().width() - field.element.parent().find('label').width() - 30;
                        }
                        else {
                            var pw = field.element.parent().width();
                        }
                        var nw = parseInt(field.rules['max_length'], 10) * 10;
                        if (pw < nw) { nw = pw; } // do not go wider than the parent
                        field.element.width(nw);
                    }
                });
            }
        }
    },

    _applyRules: function(field, applyRequired) {
        if (applyRequired) {
            field.rule = 'required';
            $.ui.djangoForm.defaults.rules['required'].apply(this, [field]);
        }
        for (x in $.ui.djangoForm.defaults.rules) {
            field.rule = x; // I know.. it's ugly.
            if (x != 'required' && field[x]) {
                try {
                    $.ui.djangoForm.defaults.rules[x].apply(this, [field]);
                } catch(e){};
            }
        };
    },
    _error: function(field, data) {
        var data = data || {};
        var msg = this.getErrorMessage(field, data);
        this._hasErrors = true;
        this.options.error.apply(this, [field, msg, data]);
        this.element.addClass('ui-djangoForm-error');
    },
    getErrorMessage: function(field, tokens) {
        return !field.msgs[field.rule] && '' 
                || $.format(field.msgs[field.rule].replace(/%\((\w+)\)(\w)/g, '{$1:$2}'), tokens || {});
    },
});

$.tpl('djangoForm.errorList', '<ul></ul>');
$.tpl('djangoForm.error',     '<li></li>');

$.ui.djangoForm.defaults = {
    rules: {},
    form_type: 'auto',
    mode: 'inline', // inline, dialog
    requiredClass: 'ui-djangoForm-required',
    errorListClass: 'errorlist', // use the same as Django
    idPrefix: 'id_',
    error: function(field, message, data) {
        if (!field.element.next().is('ul')) {
            console.log(this.options.errorListClass, field.element);
            $.tpl('djangoForm.errorList')
                .addClass(this.options.errorListClass)
                .insertAfter(field.element);
            console.log('test');
        }
        console.log(field.element.next(), message, data);
        $.tpl('djangoForm.error')
            .appendTo(field.element.next())
            .text(message);
    }
};

$.extend($.ui.djangoForm.defaults.rules, {
    
    required: function(field) {
        if (field.required && field.element.val() == '') {
            this._error(field);
        }
    },

    max_length: function(field) {
        var cl  = field.element.val().length;
        var ml = field.rules.max_length || false;
        if (ml < cl) {
            this._error(field, { max: ml, length: cl });
        }
    },

    min_length: function(field) {
        var cl  = field.element.val().length;
        var ml = field.rules.min_length || false;
        if (ml > cl) {
            this._error(field, { min: ml, length: cl });
        }
    },

    decimal_length: function(field) {
        
        var value = field.element.val();
        var match = /^[-\s0]*(\d*).?(\d*)\s*$/.exec(value);
        /*
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
        */
    }

});


