function mappingName(name) {
    var mapper = {
        'william cowper temple baron mount temple': 'William Cowper-Temple, Baron Mount Temple',
        'christies': 'Christie\'s',
        'henry beecham': 'Henry Beecham',
        'sothebys': 'Sotheby\'s',
        'a e anderson': 'A. E. Anderson',
        'gertrude marchioness of rmanby': 'Gertrude,  Marchioness of Normanby',
        'lady gertrude elizabeth davis': 'Lady Gertrude Elizabeth Davis (Phipps)',
        'andrew lloyd webber': 'Andrew Lloyd-Webber',
        'charles w dyson perrins': 'Charles W. Dyson Perrins',
        'hon mrs o\'brien lady inchiquin': 'Hon.Mrs.O\'Brien Lady Inchiquin',
        'martina b. lawrence': 'Martina B. Lawrence',
        'rochester gallery': 'Rochester Gallery, U of Rochester',
        'william r moss': 'William.R.Moss',
        'mrs w r moss': 'Mrs. W. R. Moss',
        'colonel w e moss': 'Colonel W. E. Moss',
        'f g stephens': 'F. G. Stephens',
        'lt-col h f stephens': 'Lt-Col. H. F. Stephenss',
        'mrs robin carver': 'Mrs. Robin Carver'
    };
    if (name.toLowerCase() in mapper) {
        return mapper[name.toLowerCase()]
    } else {
        return name;
    }
}