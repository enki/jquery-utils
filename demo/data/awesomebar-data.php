<?php
$countries = array('Abkhazia','Afghanistan','United Kingdom Akrotiri and Dhekelia','Åland','Albania','Algeria','American Samoa',
'Andorra','Angola','Anguilla','Antigua and Barbuda','Argentina','Armenia','Aruba','the United Kingdom Ascension Island','Australia',
'Austria','Azerbaijan','the Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bermuda','Bhutan', 
'Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria','Burkina Faso','Burundi','Cambodia','Cameroon','Canada',
'Cape Verde','Cayman Islands','Central African Republic','Chad','Chile','People\'s Republic of China China','Christmas Island',
'Cocos (Keeling) Islands','Colombia','the Comoros','the Republic of the Congo','the Cook Islands','Costa Rica','Côte d\'Ivoire',
'Croatia','Cuba','Cyprus','the Czech Republic','Denmark','Djibouti','Dominica','the Dominican Republic','East Timor','Ecuador',
'Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia','Ethiopia','the Falkland Islands','the Faroe Islands','Fiji','Finland',
'France','French Polynesia','Gabon','The Gambia','Georgia','Germany','Ghana','Gibraltar','Greece','Greenland','Grenada','Guam',
'Guatemala','Guernsey','Guinea','Guinea-Bissau','Guyana','Haiti','Honduras','Hong Kong','Hungary','Iceland','India','Indonesia',
'Iran','Iraq','Ireland','the Isle of Man','Israel','Italy','Jamaica','Japan','Jersey','Jordan','Kazakhstan','Kenya','Kiribati',
'North Korea','South Korea','Kosovo','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein',
'Lithuania','Luxembourg','Macao','the Republic of Macedonia','Madagascar','Malawi','Malaysia','the Maldives','Mali','Malta',
'the Marshall Islands','Mauritania','Mauritius','Mayotte','Mexico','Federated States of Micronesia','Moldova','Monaco','Mongolia',
'Montenegro','Montserrat','Morocco','Mozambique','Myanmar','Nagorno-Karabakh','Namibia','Nauru','Nepal','the Netherlands',
'the Netherlands Antilles','New Caledonia','New Zealand','Nicaragua','Niger','Nigeria','Niue','Norfolk Island','Northern Cyprus',
'Northern Mariana Islands','Norway','Oman','Pakistan','Palau','Palestine','Panama','Papua New Guinea','Paraguay','Peru','Philippines',
'Pitcairn Islands','Poland','Portugal','Puerto Rico','Qatar','Romania','Russia','Rwanda','Saint Barthélemy','Saint Helena',
'Saint Kitts and Nevis','Saint Lucia','Saint Martin','Saint Pierre and Miquelon','Saint Vincent and the Grenadines','Samoa',
'San Marino','São Tomé and Príncipe','Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia',
'Solomon Islands','Somalia','Somaliland','South Africa','South Ossetia','Spain','Sri Lanka','Sudan','Suriname','Svalbard','Swaziland',
'Sweden','Switzerland','Syria','Taiwan','Tajikistan','Tanzania','Thailand','Togo','Tokelau','Tonga','Transnistria',
'Trinidad and Tobago','Tristan da Cunha','Tunisia','Turkey','Turkmenistan','Turks and Caicos Islands','Tuvalu','Uganda','Ukraine',
'United Arab Emirates','United Kingdom','United States','Uruguay','Uzbekistan','Vanuatu','the Vatican City Vatican City','Venezuela',
'Vietnam','Virgin Islands, British','Virgin Islands, United States','Wallis and Futuna','Western Sahara','Yemen','Zambia','Zimbabwe');
if (isset($_REQUEST['str'])) {
    $r = $_REQUEST['str'];
    $o = '';
    foreach($countries as $country) {
        if (stristr($country, $r)) $o .= '<li>'. str_ireplace($r, '<b>'.$r.'</b>', $country) .'</li>';
    }
    print "<ul>$o</ul>";
}
?>
