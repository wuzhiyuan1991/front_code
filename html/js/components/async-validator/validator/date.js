define(function(require) {
	var rules = require("../rule/index");
	var isEmptyValue = require("../util").isEmptyValue;
	
	function date(rule, value, callback, source, options) {
		// console.log('integer rule called %j', rule);
		var errors = [];
		var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
		// console.log('validate on %s value', value);
		if (validate) {
			if (isEmptyValue(value) && !rule.required) {
				return callback();
			}
			rules.required(rule, value, source, errors, options);
			if (!isEmptyValue(value)) {
				rules.type(rule, value, source, errors, options);
				if (value) {
					rules.range(rule, value.getTime(), source, errors, options);
				}
			}
		}
		callback(errors);
	}
	
	return date;
});
