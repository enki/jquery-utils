/*
  jQuery api.googlechart - 0.1
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

  Dependencies
  ------------
  - jquery.utils.js
  - jquery.strings.js
  - jquery.builder.js
  - jquery.ui.js
  
*/

(function($){

    $.tpl('googlechart.panelOptionsColor', [
        '<ul class="ui-from ui-helper-reset">',
            '<li><label for="">Background color:</label> <input id="api-gc-bgcolor" type="text" style="width:110px;" /></li>',
            '<li><label for="">Foreground color:</label> <input id="api-gc-fgcolor" type="text" style="width:110px;" /></li>',
        '</ul>'
    ]);

    $.widget('ui.googleChart', {
        _init: function(){
            this._bindEvents();
            $('.ui-button').hover(function(){  $(this).addClass('ui-state-hover'); }, 
                                  function (){ $(this).removeClass('ui-state-hover'); });
        },

        _width:  function() { var s = this.options.chs.split('x'); return parseInt(s[0], 10); },
        _height: function() { var s = this.options.chs.split('x'); return parseInt(s[1], 10); },

        _bindEvents: function() {
            var widget = this;
            $.each(this._events, function(node, events){
                $.each(events, function(eventName, callback) {
                    try {
                        $(widget._ui[node]).bind(eventName, function(e) {
                            callback.apply(this, [e, widget]);
                        });
                        // not sure why, but I must trigger them manually
                        if (['load', 'ready'].indexOf(eventName) > -1) {
                            $(widget._ui[node]).trigger(eventName);
                        }
                    } catch(e) {};
                });
            });
        },

        _ui: {
            wrapper:    $('<div class="api-gc-wrapper" />'),
            viewport:   $('<div class="api-gc-viewport" />'),
            rightpanel: $('<div class="api-gc-panel" />'),
            toolbar:    $.ui.builder.toolbar().attr('id', 'api-gc-toolbar'),
            label:      $('<span id="api-gc-map-title">World</span>'),
            link:       $('<div id="api-gc-map-link" class="ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" style="display:none;"><input type="text" value="" class=" ui-corner-all" /></div>'),
            options:    $('<div id="api-gc-map-options" class="ui-helper-reset ui-widget-content ui-corner-all" style="display:none;" />')
        },

        _events: {
            wrapper: {
                load: function(e, widget) {
                    widget._ui.wrapper.append(widget._ui.rightpanel)
                                      .append(widget._ui.viewport)
                                      .append(widget._ui.toolbar.append(widget._ui.label))
                                      .appendTo(widget.element);

                    $.ui.googleChart.charts[widget.options.cht].call(widget);
                }
            }
        },

        _refresh: function(opt) {
            var url = this._get_url(opt || this.options, this.params);
            var css = $.format('#ddd url({0:s}) no-repeat 0 0', url);
            this._ui.link.find('input[type=text]').val(url);
            this._ui.viewport
                .width(this._width()).height(this._height())
                .css('background', css);
        },

        
        _get_area_list: function() {
            var o = ['<ul class="api-gc-area-list ui-reset">'];
            for (k in $.ui.googleChart.areas) {
                o.push($.format('<li id="{0:s}" class="ui-reset"><a href="#" class="ui-state-default"><span class="ui-icon ui-icon-triangle-1-e"></span>{1:s}</a></li>', k, $.ui.googleChart.areas[k]));
            }
            o.push('<li class="label ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-bottom">Area</li></ul>');
            return $(o.join('')).height(this._height());
        },

        _get_country_list: function() {
            var o = ['<div class="api-gc-countries ui-reset ui-clearfix">'];
            for (k in $.ui.googleChart.areasCountries) {
                o.push($.format('<select id="area-country-{0:s}" class="api-gc-country-list ui-reset" style="display:none;" multiple="true">', k));
                for (i in $.ui.googleChart.areasCountries[k]) {
                    var cc = $.ui.googleChart.areasCountries[k][i];
                    var label = (k == 'usa') ? $.ui.googleChart.usStates[cc]: $.ui.googleChart.countries[cc];
                    o.push($.format('<option value="{0:s}" class="ui-reset">{1:s}</option>', cc, label, cc));
                }
                o.push('</select>');
            }
            o.push(this._get_world_country_list());
            o.push('</div>');
            return o.join('');
        },

        _get_world_country_list: function() {
            var o = ['<select id="area-country-world" class="api-gc-country-list ui-reset" style="display:none;" multiple="true">'];
            for (k in $.ui.googleChart.countries) {
                var label = $.ui.googleChart.countries[k];
                o.push($.format('<option value="{0:s}" class="ui-reset">{1:s}</option>', k, label, k));
            }
            o.push('</select>');
            return o.join('');
        },

        _get_options_colors: function() {
    
            $.tpl('googlechart.panelOptionsColor').appendTo();
        },

        _get_url: function(options, params) {
            var o = [];
            for (k in params) {
                if (options[params[k]]) { o.push(params[k] +'='+ options[params[k]]); }
            }
            return options.url +'?'+ o.join('&');
        }
    });

    $.extend($.ui.googleChart, {
        charts: {},
        version: '0.0.1',
        defaults: {
            url: 'http://chart.apis.google.com/chart',
            cht: 't',
            chs: '440x220'
        },
        areas: {'africa':"Africa", 'asia':"Asia", 'europe':"Europe", 'middle_east':"Middle Eeast", 'south_america':"South America", 'usa':"USA", 'world':"World"},
        areasCountries: {
            'usa':    ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV',
                       'NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'],
            'africa': ['AF','DZ','AO','AR','BD','BJ','BO','BW','BR','BF','BI','CM','CF','TD','CN','CG','CD','CI','DJ','EG','ER','ET','GA','GH','GR','GN','GW','GY',
                       'IN','ID','IR','IQ','IL','IT','JO','KE','LA','LB','LR','LY','MG','MW','MY','ML','MR','MA','MZ','MM','NA','NE','NG','OM','PK','PY','PT','RW',
                       'SA','SN','SL','SO','ZA','ES','LK','SD','SR','SY','TJ','TZ','TH','TG','TN','TR','TM','UG','AE','UY','UZ','VE','EH','YE','ZM','ZW'],
            'asia':   ['AF','AM','AU','AZ','BD','BY','BT','BG','BF','BI','KH','CN','EG','ER','ET','GE','IN','ID','IR','IQ','JP','JO','KZ','KE','KP','KR','KW','KG',
                       'LA','MW','MY','MD','MN','MZ','MM','NP','OM','PK','PG','PH','RO','RU','RW','SA','SO','LK','SD','SY','TW','TJ','TZ','TH','TR','TM','UG','UA',
                       'AE','UZ','VN','YE','ZM'],
            'europe': ['AL','AM','AT','AZ','BY','BE','BA','HR','CZ','DK','EE','FI','FR','GE','DE','GR','GL','GD','HU','IR','IQ','IE','IT','KZ','LV','LB','LT','LU',
                       'MK','MD','MA','NL','NO','PL','PT','RO','RU','SK','SI','SB','ES','SE','CH','SY','TN','TR','TM','UA','GB','UZ'],
            'middle_east': ['AF','AL','DZ','AM','BJ','BA','BG','BF','CM','TD','CN','HR','DJ','EG','ER','ET','FR','GE','GR','HU','IN','IR','IQ','IL','IT','JO','KZ',
                            'KW','KG','LB','LY','MK','ML','NP','NE','NG','OM','PK','QA','RO','RU','SA','SN','SO','ES','SD','CH','SY','TJ','TO','TN','TR','TM','UA',
                            'AE','UZ','YE'],
            'south_america':    ['AO','AR','BJ','BO','BW','BV','BR','BF','CM','CF','TD','CL','CO','CG','CD','CR','CI','EC','GQ','FK','GF','GA','GH','GN','GW','GY',
                                 'LR','ML','NA','NI','NE','NG','PA','PY','PE','SN','SL','ZA','SR','TG','UY','VE']
        },
        countries: { 
            'AF':"Afghanistan",'AX':"Aland islands",'AL':"Albania",'DZ':"Algeria",'AS':"American samoa",'AD':"Andorra",'AO':"Angola",'AI':"Anguilla",'AQ':"Antarctica",'AG':"Antigua and Barbuda",
            'AR':"Argentina",'AM':"Armenia",'AW':"Aruba",'AU':"Australia",'AT':"Austria",'AZ':"Azerbaijan",'BS':"Bahamas",'BH':"Bahrain",'BD':"Bangladesh",'BB':"Barbados",'BY':"Belarus",
            'BE':"Belgium",'BZ':"Belize",'BJ':"Benin",'BM':"Bermuda",'BT':"Bhutan",'BO':"Bolivia",'BA':"Bosnia and Herzegovina",'BW':"Botswana",'BV':"Bouvet Island",'BR':"Brazil",
            'IO':"British Indian Ocean Territory",'BN':"Brunei Darussalam",'BG':"Bulgaria",'BF':"Burkina Faso",'BI':"Burundi",'KH':"Cambodia",'CM':"Cameroon",'CA':"Canada",'CV':"Cape verde",
            'KY':"Cayman Islands",'CF':"Central African Republic",'TD':"Chad",'CL':"Chile",'CN':"China",'CX':"Christmas Island",'CC':"Cocos (Keeling) Islands",'CO':"Colombia",'KM':"Comoros",
            'CG':"Congo",'CD':"Congoe",'CK':"Cook Islands",'CR':"Costa Rica",'CI':"Côte D'ivoire",'HR':"Croatia",'CU':"Cuba",'CY':"Cyprus",'CZ':"Czech Republic",
            'DK':"Denmark",'DJ':"Djibouti",'DM':"Dominica",'DO':"Dominican Republic",'EC':"Ecuador",'EG':"Egypt",'SV':"El Salvador",'GQ':"Equatorial Guinea",'ER':"Eritrea",'EE':"Estonia",
            'ET':"Ethiopia",'FK':"Falkland Islands (Malvinas)",'FO':"Faroe Islands",'FJ':"Fiji",'FI':"Finland",'FR':"France",'GF':"French Guiana",'PF':"French Polynesia",
            'TF':"French Southern Territories",'GA':"Gabon",'GM':"Gambia",'GE':"Georgia",'DE':"Germany",'GH':"Ghana",'GI':"Gibraltar",'GR':"Greece",'GL':"Greenland",'GD':"Grenada",
            'GP':"Guadeloupe",'GU':"Guam",'GT':"Guatemala",'GG':"Guernsey",'GN':"Guinea",'GW':"Guinea-BisKyrgyzstansau",'GY':"Guyana",'HT':"Haiti",'HM':"Heard Island and McDonald Islands",
            'VA':"Holy See (Vatican City State)",'HN':"Honduras",'HK':"Hong Kong",'HU':"Hungary",'IS':"Iceland",'IN':"India",'ID':"Indonesia",'IR':"Iran",'IQ':"Iraq",'IE':"Ireland",
            'IM':"Isle of Man",'IL':"Israel",'IT':"Italy",'JM':"Jamaica",'JP':"Japan",'JE':"Jersey",'JO':"Jordan",'KZ':"KazakhstanKyrgyzstan",'KE':"Kenya",'KI':"Kiribati",
            'KP':"North Korea",'KR':"South Korea",'KW':"Kuwait",'KG':"Kyrgyzstan",'LA':"Lao",'LV':"Latvia",'LB':"Lebanon",'LS':"Lesotho",
            'LR':"Liberia",'LY':"Libyan Arab Jamahiriya",'LI':"Liechtenstein",'LT':"Lithuania",'LU':"Luxembourg",'MO':"Macao",'MK':"Macedonia",'MG':"Madagascar",
            'MW':"Malawi",'MY':"Malaysia",'MV':"Maldives",'ML':"Mali",'MT':"Malta",'MH':"Marshall Islands",'MQ':"Martinique",'MR':"Mauritania",'MU':"Mauritius",'YT':"Mayotte",'MX':"Mexico",
            'FM':"Micronesia,Federated state of",'MD':"Moldova",'MC':"Monaco",'MN':"Mongolia",'ME':"Montenegro",'MS':"Montserrat",'MA':"Morocco",'MZ':"Mozambique",'MM':"Myanmar",
            'NA':"Namibia",'NR':"Nauru",'NP':"Nepal",'NL':"Netherlands",'AN':"Netherlands Antilles",'NC':"New Caledonia",'NZ':"New Zealand",'NI':"Nicaragua",'NE':"Niger",'NG':"Nigeria",'NU':"Niue",
            'NF':"Norfolk Island",'MP':"Northern Mariana Islands",'NO':"Norway",'OM':"Oman",'PK':"Pakistan",'PW':"Palau",'PS':"Palestinian Territory,occupied",'PA': "Panama",'PG':"Papua New Guinea",
            'PY':"Paraguay",'PE':"Peru",'PH':"Philippines",'PN':"Pitcairn",'PL':"Poland",'PT':"Portugal",'PR':"Puerto Rico",'QA':"Qatar",'RE':"Réunion",'RO':"Romania",'RU':"Russian Federation",
            'RW':"Rwanda",'BL':"Saint Barthélemy",'SH':"Saint Helena",'KN':"Saint Kitts and Nevis",'LC':"Saint Lucia",'MF':"Saint Martin",'PM':"Saint Pierre and Miquelon",
            'VC':"Saint Vincent and The Grenadines",'WS':"Samoa",'SM':"San Marino",'ST':"Sao Tome and Principe",'SA':"Saudi Arabia",'SN':"Senegal",'RS':"Serbia",'SC':"Seychelles",'SL':"Sierra Leone",
            'SG':"Singapore",'SK':"Slovakia",'SI':"Slovenia",'SB':"Solomon Islands",'SO':"Somalia",'ZA':"South Africa",'GS':"South Georgia and The South Sandwich Islands",'ES':"Spain",'LK':"Sri Lanka",
            'SD':"Sudan",'SR':"Suriname",'SJ':"Svalbard and Jan Mayen",'SZ':"Swaziland",'SE':"Sweden",'CH':"Switzerland",'SY':"Syrian Arab Republic",'TW':"Taiwan,Province of China",'TJ':"Tajikistan",
            'TZ':"Tanzania",'TH':"Thailand",'TL':"Timor-Leste",'TG':"Togo",'TK':"Tokelau",'TO':"Tonga",'TT':"Trinidad and Tobago",'TN':"Tunisia",'TR':"Turkey",'TM':"Turkmenistan",
            'TC':"Turks and Caicos Islands",'TV':"Tuvalu",'UG':"Uganda",'UA':"Ukraine",'AE':"United Arab Emirates",'GB':"United Kingdom",'US':"United state",'UM':"United state Minor Outlying Islands",
            'UY':"Uruguay",'UZ':"Uzbekistan",'VU':"Vanuatu",'VE':"Venezuela",'VN':"Viet nam",'VG':"Virgin Islands,British",'VI':"Virgin Islands,U.S.",'WF':"Wallis and Futuna",'EH':"Western Sahara",
            'YE':"Yemen",'ZM':"Zambia",'ZW':"Zimbabwe"
        },
        usStates: {'AL':"Alabama",'AK':"Alaska",'AZ':"Arizona",'AR':"Arkansas",'CA':"California",'CO':"Colorado",'CT':"Connecticut",'DE':"Delaware",'FL':"Florida",'GA':"Georgia",'HI':"Hawaii",
            'ID':"Idaho",'IL':"Illinois",'IN':"Indiana",'IA':"Iowa",'KS':"Kansas",'KY':"Kentucky",'LA':"Louisiana",'ME':"Maine",'MD':"Maryland",'MA':"Massachusetts",'MI':"Michigan",'MN':"Minnesota",
            'MS':"Mississippi", 'MO':"Missouri",'MT':"Montana",'NE':"Nebraska",'NV':"Nevada",'NH':"New Hampshire",'NJ':"New Jersey",'NM':"New Mexico",'NY':"New York",'NC':"North Carolina",
            'ND':"North Dakota",'OH':"Ohio",'OK':"Oklahoma",'OR':"Oregon",'PA':"Pennsylvania",'RI':"Rhode Island",'SC':"South Carolina",'SD':"South Dakota",'TN':"Tennessee",'TX':"Texas",'UT':"Utah",
            'VT':"Vermont",'VA':"Virginia",'WA':"Washington",'WV':"West Virginia",'WI':"Wisconsin",'WY':"Wyoming"}
    });
    
    $.extend($.ui.googleChart.charts, {
        // map
        t: function() {
            widget = this;
            this.params  = ['chs', 'cht', 'chd', 'chtm', 'chld', 'chco', 'chf'];
            this.options = $.extend({
                cht:       't',
                chd:       's:_',
                chtm:      'world', // area
                chld:      '',      // country(ies)
                chco:      'eeeeee,DFB5B5,DFDBB5,B7DFB5',
                chf:       'bg,s,cccccc',
                link:      true,
                areas:     true,
                options:   true,
                countries: true,
            }, this.options);
            
            if (this.options.areas) {
                this._ui.areaList = this._get_area_list()
                    .appendTo(this._ui.rightpanel)
                    .find('li')
                        .click(function(e){
                            var chtm = $(this).attr('id');
                            var lbl  = $(this).text();
                            var id   = $.format('#area-country-{0:s}', chtm);
                            widget.options.chtm = chtm;

                            widget._ui.label.fadeOut(1000, function(){
                                $(this).text(lbl).fadeIn(); 
                            });

                            widget._refresh();

                            if ($('.api-gc-countries select:visible').length == 0) {
                                $('.api-gc-countries select').filter(id).show('slide', {direction: 'left'});
                            }
                            else if ($(id).not(':visible')) {
                                $('.api-gc-countries select')
                                    .filter(':visible').hide('slide', {direction: 'left'}, 1000).end()
                                    .delay(1000)
                                    .filter(id).show('slide', {direction: 'left'});
                            }
                        });

                if (this.options.countries) {
                    this._ui.countryList = $(this._get_country_list())
                        .height(this._height())
                        .appendTo(this._ui.rightpanel)
                        .find('option')
                            .mouseup(function(e){
                                var chld = $(this).parent().val();
                                widget.options.chld = chld.join('');
                                widget.options.chd  = $.format('t:{0:s}', $.map($.range(0, 100, 100 / chld.length), $.iterators.parseInt).join(',')),
                                widget._refresh();
                            });
                }
            }
            if (this.options.options) {
                this._ui.options   = $.ui.builder.tabs().attr('id', 'api-gc-options');
                this._ui.colorsTab = $.ui.builder.tab(this._ui.options, {title: 'Colors'});
                $.ui.builder.tab(this._ui.options, {title: 'Gradient'})
                this._ui.options.hide().appendTo(this._ui.wrapper);
                this._ui.options.tabs();

                $.tpl('googlechart.panelOptionsColor')
                    .appendTo(this._ui.colorsTab)
                    .find('#api-gc-bgcolor')
                        .bind('mapRefresh.googleChart', function(){
                            widget.options.chf = 'bg,s,'+ $(this).val().replace('#','');
                            widget._refresh();
                        })
                        .bind('blur', function(){ $(this).trigger('mapRefresh.googleChart'); })
                        .val('#'+ widget.options.chf.split(',')[2])
                        .end()
                    .find('#api-gc-fgcolor')
                        .bind('mapRefresh.googleChart', function(){
                            var chco = widget.options.chco.split(',');
                            chco[0] = $(this).val().replace('#','');

                            widget.options.chco = chco.join(',');
                            widget._refresh();
                        })
                        .bind('blur', function(){ $(this).trigger('mapRefresh.googleChart'); })
                        .val('#'+widget.options.chco.split(',')[0]);
                
                $.ui.builder.button({label: 'Options', icon: 'gear'})
                    .bind('click.googlechart', function(e){
                        widget._ui.options.toggle();
                    })
                    .appendTo(this._ui.toolbar);
            }
            if (this.options.link) {
                this._ui.link.appendTo(this._ui.wrapper);
                $.ui.builder.button({label: 'Link', icon: 'link'})
                    .bind('click.googlechart', function(e){
                        widget._ui.link.toggle();
                    })
                    .appendTo(this._ui.toolbar);
            }
            //this._ui.toolbar.append($.ui.builder.button('Save', 'disk'));
            this._refresh(); // initial load
        }
    });

    $.extend($.ui.googleChart.cht, {
        lc: function() {
            console.log('building line chart');
        },
        ls: function() {
            console.log('building line chart');
        }
    });

})(jQuery);

