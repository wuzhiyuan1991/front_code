define(function(require) {
	var rules = require("../rule/index");
	var isEmptyValue = require("../util").isEmptyValue;
	var ENUM = 'enum';
	/**
	 *  Validates an enumerable list.
	 *
	 *  @param rule The validation rule.
	 *  @param value The value of the field on the source object.
	 *  @param callback The callback function.
	 *  @param source The source object being validated.
	 *  @param options The validation options.
	 *  @param options.messages The validation messages.
	 */
	function enumerable(rule, value, callback, source, options) {
		var errors = [];
		var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
		if (validate) {
			if (isEmptyValue(value) && !rule.required) {
				return callback();
			}
			rules.required(rule, value, source, errors, options);
			if (value) {
				rules[ENUM](rule, value, source, errors, options);
			}
		}
		callback(errors);
	}
	
	return enumerable;
});
