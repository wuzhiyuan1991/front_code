define(function (require) {
    var BASE = require('base');
    return lang = function (val) {
        var i18n = BASE.i18nLang
        return i18n[_.findIndex(i18n, function (o) {
            return o.code == val;
        })].zhValue
    }

})