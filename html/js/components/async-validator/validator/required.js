define(function (require) {
    var rules = require("../rule/index");

    function required(rule, value, callback, source, options) {

        var errors = [];
        var type = Array.isArray(value) ? 'array' : typeof value;
        rules.required(rule, value, source, errors, options, type);
        callback(errors);
    }

    return required;
});