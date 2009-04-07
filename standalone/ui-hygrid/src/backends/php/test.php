<?php
$list = <<<EOF
AD,Andorra;AE,United Arab Emirates;AF,Afghanistan;AG,Antigua & Barbuda;AI,Anguilla;AL,Albania;AM,Armenia;AN,Netherlands Antilles;AO,Angola;AQ,Antarctica;AR,Argentina;AS,American Samoa;AT,Austria;AU,Australia;AW,Aruba;AZ,Azerbaijan;BA,Bosnia and Herzegovina;BB,Barbados;BD,Bangladesh;BE,Belgium;BF,Burkina Faso;BG,Bulgaria;BH,Bahrain;BI,Burundi;BJ,Benin;BM,Bermuda;BN,Brunei Darussalam;BO,Bolivia;BR,Brazil;BS,Bahama;BT,Bhutan;BU,Burma (no longer exists);BV,Bouvet Island;BW,Botswana;BY,Belarus;BZ,Belize;CA,Canada;CC,Cocos (Keeling) Islands;CF,Central African Republic;CG,Congo;CH,Switzerland;CI,Côte D'ivoire (Ivory Coast);CK,Cook Iislands;CL,Chile;CM,Cameroon;CN,China;CO,Colombia;CR,Costa Rica;CS,Czechoslovakia (no longer exists);CU,Cuba;CV,Cape Verde;CX,Christmas Island;CY,Cyprus;CZ,Czech Republic;DD,German Democratic Republic (no longer exists);DE,Germany;DJ,Djibouti;DK,Denmark;DM,Dominica;DO,Dominican Republic;DZ,Algeria;EC,Ecuador;EE,Estonia;EG,Egypt;EH,Western Sahara;ER,Eritrea;ES,Spain;ET,Ethiopia;FI,Finland;FJ,Fiji;FK,Falkland Islands (Malvinas);FM,Micronesia;FO,Faroe Islands;FR,France;FX,France, Metropolitan;GA,Gabon;GB,United Kingdom (Great Britain);GD,Grenada;GE,Georgia;GF,French Guiana;GH,Ghana;GI,Gibraltar;GL,Greenland;GM,Gambia;GN,Guinea;GP,Guadeloupe;GQ,Equatorial Guinea;GR,Greece;GS,South Georgia and the South Sandwich Islands;GT,Guatemala;GU,Guam;GW,Guinea-Bissau;GY,Guyana;HK,Hong Kong;HM,Heard & McDonald Islands;HN,Honduras;HR,Croatia;HT,Haiti;HU,Hungary;ID,Indonesia;IE,Ireland;IL,Israel;IN,India;IO,British Indian Ocean Territory;IQ,Iraq;IR,Islamic Republic of Iran;IS,Iceland;IT,Italy;JM,Jamaica;JO,Jordan;JP,Japan;KE,Kenya;KG,Kyrgyzstan;KH,Cambodia;KI,Kiribati;KM,Comoros;KN,St. Kitts and Nevis;KP,Korea, Democratic People's Republic of;KR,Korea, Republic of;KW,Kuwait;KY,Cayman Islands;KZ,Kazakhstan;LA,Lao People's Democratic Republic;LB,Lebanon;LC,Saint Lucia;LI,Liechtenstein;LK,Sri Lanka;LR,Liberia;LS,Lesotho;LT,Lithuania;LU,Luxembourg;LV,Latvia;LY,Libyan Arab Jamahiriya;MA,Morocco;MC,Monaco;MD,Moldova, Republic of;MG,Madagascar;MH,Marshall Islands;ML,Mali;MN,Mongolia;MM,Myanmar;MO,Macau;MP,Northern Mariana Islands;MQ,Martinique;MR,Mauritania;MS,Monserrat;MT,Malta;MU,Mauritius;MV,Maldives;MW,Malawi;MX,Mexico;MY,Malaysia;MZ,Mozambique;NA,Namibia;NC,New Caledonia;NE,Niger;NF,Norfolk Island;NG,Nigeria;NI,Nicaragua;NL,Netherlands;NO,Norway;NP,Nepal;NR,Nauru;NT,Neutral Zone (no longer exists);NU,Niue;NZ,New Zealand;OM,Oman;PA,Panama;PE,Peru;PF,French Polynesia;PG,Papua New Guinea;PH,Philippines;PK,Pakistan;PL,Poland;PM,St. Pierre & Miquelon;PN,Pitcairn;PR,Puerto Rico;PT,Portugal;PW,Palau;PY,Paraguay;QA,Qatar;RE,Réunion;RO,Romania;RU,Russian Federation;RW,Rwanda;SA,Saudi Arabia;SB,Solomon Islands;SC,Seychelles;SD,Sudan;SE,Sweden;SG,Singapore;SH,St. Helena;SI,Slovenia;SJ,Svalbard & Jan Mayen Islands;SK,Slovakia;SL,Sierra Leone;SM,San Marino;SN,Senegal;SO,Somalia;SR,Suriname;ST,Sao Tome & Principe;SU,Union of Soviet Socialist Republics (no longer exists);SV,El Salvador;SY,Syrian Arab Republic;SZ,Swaziland;TC,Turks & Caicos Islands;TD,Chad;TF,French Southern Territories;TG,Togo;TH,Thailand;TJ,Tajikistan;TK,Tokelau;TM,Turkmenistan;TN,Tunisia;TO,Tonga;TP,East Timor;TR,Turkey;TT,Trinidad & Tobago;TV,Tuvalu;TW,Taiwan, Province of China;TZ,Tanzania, United Republic of;UA,Ukraine;UG,Uganda;UM,United States Minor Outlying Islands;US,United States of America;UY,Uruguay;UZ,Uzbekistan;VA,Vatican City State (Holy See);VC,St. Vincent & the Grenadines;VE,Venezuela;VG,British Virgin Islands;VI,United States Virgin Islands;VN,Viet Nam;VU,Vanuatu;WF,Wallis & Futuna Islands;WS,Samoa;YD,Democratic Yemen (no longer exists);YE,Yemen;YT,Mayotte;YU,Yugoslavia;ZA,South Africa;ZM,Zambia;ZR,Zaire;ZW,Zimbabwe;ZZ,Unknown or unspecified country
EOF;
?>
<?php
if ($db = new SQLiteDatabase('test.db')) {
    $q = @$db->query('SELECT * FROM countries LIMIT 0,1;');
    if ($q === false) {
        $l = split(';', $list);
        $db->queryExec('CREATE TABLE countries (id int, code char, name char, PRIMARY KEY (id));');
        foreach ($l as $k => $v) {
            $tmp = split(',', $v);
            $db->queryExec(sprintf('INSERT INTO countries VALUES (%s, "%s", "%s");', $k, $tmp[0], $tmp[1]));
        }
    } 
} else {
    die($err);
}

define('_HYGRID_TABLE_', 'countries');
define('_HYGRID_ALLOWED_TABLES', 'countries');

class hygrid {
    static $page, $rpp, $rows;

    function __construct() {
        $this->total = 0;
        $this->table = $_REQUEST['table'] ? $_REQUEST['table']: _HYGRID_TABLE_;
        $this->page  = $_REQUEST['page']  ? $_REQUEST['page']: 1;
        $this->rpp   = $_REQUEST['rpp']   ? $_REQUEST['rpp'] : false;
        // total
    }

    function vals($array) {
        $o = array();
        for ($x=0; $x < count($array)/2; $x++) {
            array_push($o, $array[$x]);
        }
        return $o;
    }

    function __toString() {
        $rows = array();
        foreach($this->rows as $k => $v) {
            array_push($rows, array('id'=> $v['id'], 'cell'=> $this->vals($v)));
        }
        $o = array(
            'page'  => $this->page,
            'total' => $this->total(),
            'rows'  => $rows
        );
        return json_encode($o);
    }
}


class hygridSqlLite extends hygrid {
    protected $db;

    function __construct($db) {
        $this->db = $db;
        parent::__construct();
        $this->rows = $this->fetch();
    }

    function total() {
        $rs = @$this->db->query(sprintf('SELECT COUNT(*) FROM %s', $this->table))->fetchAll();
        return $rs[0][0];
    }

    function fetch() {
        $q = 'SELECT * FROM '. $this->table;
        if ($this->page && $this->rpp) {
            $start = ($this->page * $this->rpp) - $this->rpp;
            $q .= sprintf(' LIMIT %d,%d', $start, $this->rpp);
        }
        $rs = @$this->db->query($q)->fetchAll();
        return $rs;
    }
}

if ($db = new SQLiteDatabase('test.db')) {
    print new hygridSqlLite($db);
}
?>
