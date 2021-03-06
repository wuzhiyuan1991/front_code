define(function(require) {
	var util = require("../util");
	/**
	 *  Rule for validating required fields.
	 *
	 *  @param rule The validation rule.
	 *  @param value The value of the field on the source object.
	 *  @param source The source object being validated.
	 *  @param errors An array of errors that this rule may add
	 *  validation errors to.
	 *  @param options The validation options.
	 *  @param options.messages The validation messages.
	 */
	function required(rule, value, source, errors, options, type) {
		if(_.isString(value)) {
            value = value.trim()
		}
		if (rule.required && (!source.hasOwnProperty(rule.field) || util.isEmptyValue(value, type))) {
			errors.push(util.format(options.messages.required, rule.fullField));
		}
	}
	
	return required;
});
