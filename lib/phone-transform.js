/**
 * Created with JetBrains PhpStorm.
 * User: mihailkuzin
 * Date: 09.07.14
 * Time: 16:24
 * To change this template use File | Settings | File Templates.
 */

i18n.phonenumbers.PhoneNumberUtil.prototype.transformPhoneNumber = function (val, userCountry) {
    var phone;
    var swe = val.replace(/\D/g,'');
    if (swe.substr(0, 3) == '999' && swe.length > 3 && swe.length <= 15) {
        return {
            country: 'ZZ',
            isValid: true,
            number : '+' + swe
        }
    }

    if (swe.substr(0, 3) == '315' && swe.length == 10) {
        return {
            country: 'NL',
            isValid: true,
            number: '+' + swe
        }
    }

    if (swe.substr(0, 5) == '49152' && swe.length == 15) {
        return {
            country: 'DE',
            isValid: true,
            number: '+' + swe
        }
    }
    if (swe.substr(0, 2) == '49' && swe.length == 14) {
        var infixes = ['13', '55', '99', '00', '50', '33'];
        if (infixes.indexOf(swe.substr(5, 2)) > 0) {
            return {
                country: 'DE',
                isValid: true,
                number: '+' + swe
            }
        }
    }

    if (swe.substr(0, 5) == '22897' && swe.length == 11) {
        return {
            country: 'TG',
            isValid: true,
            number: '+' + swe
        }
    }
    
    if ((swe.substr(0, 5) == '46719' || swe.substr(0, 5) == '46710') && swe.length == 15) {
        return {
            country: 'SE',
            isValid: true,
            number: '+' + swe
        }
    }
    
    if (swe.substr(0, 4) == '4758' && swe.length == 14) {
        return {
            country: 'NO',
            isValid: true,
            number: '+' + swe
        }
    }

    if (swe.substr(0, 3) == '237' && swe.length == 12) {
        return {
            country: 'CM',
            isValid: true,
            number: '+' + swe
        }
    }

    if (swe.substr(0, 4) == '9597' && swe.length == 12) {
        return {
            country: 'MM',
            isValid: true,
            number: '+' + swe
        }
    }

    if (swe.substr(0, 4) == '2349' && swe.length == 13) {
        return {
            country: 'NG',
            isValid: true,
            number: '+' + swe
        }
    }

    if (swe.substr(0, 3) == '614' && swe.length == 11) {
        return {
            country: 'AU',
            isValid: true,
            number: '+' + swe
        }
    }

    if (swe.substr(0, 3) == '230' && swe.length >= 10 && swe.length <= 11) {
        return {
            country: 'MU',
            isValid: true,
            number: '+' + swe
        }
    }

    if (swe.substr(0, 3) == '337' && swe.length >= 14 && swe.length <= 16) {
        return {
            country: 'FR',
            isValid: true,
            number: '+' + swe
        }
    }
    
    if (swe.substr(0, 5) == '34590' && swe.length == 15) {
        return {
            country: 'ES',
            isValid: true,
            number: '+' + swe
        }
    }

    if (swe.substr(0, 4) == '1945' && swe.length == 11) {
        return {
            country: 'US',
            isValid: true,
            number: '+' + swe
        }
    }

    try {
        phone = this.parse(val, userCountry);
    } catch(e) {
        return {
            country: null,
            isValid: false,
            number: ''
        }
    }
    var country = this.getRegionCodeForNumber(phone);
    if (country != null) {
        try {
            phone = this.parse(val, country);
        } catch(e) {
            return {
                country: null,
                isValid: false,
                number: ''
            }
        }
    }
    var isValid = this.isValidNumberForRegion(phone, country);
    var phoneFull = this.format(phone, i18n.phonenumbers.PhoneNumberFormat.E164);
    return {
        country: country,
        isValid: isValid,
        number: phoneFull
    }
}
