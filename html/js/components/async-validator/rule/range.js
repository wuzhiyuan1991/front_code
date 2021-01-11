define(function(require) {
	var util = require("../util");
	/**
	 * 判断是否数字类型
	 */
	function isNumberType(type){
		return _.contains(["number","float","integer"],type);
	}
	/**
	 *  Rule for validating minimum and maximum allowed values.
	 *
	 *  @param rule The validation rule.
	 *  @param value The value of the field on the source object.
	 *  @param source The source object being validated.
	 *  @param errors An array of errors that this rule may add
	 *  validation errors to.
	 *  @param options The validation options.
	 *  @param options.messages The validation messages.
	 */
	function range(rule, value, source, errors, options) {
		var len = typeof rule.len === 'number';
		var min = typeof rule.min === 'number';
		var max = typeof rule.max === 'number';
		var val = value;
		var key = null;
		var num = typeof (value) === 'number';
		var str = typeof (value) === 'string';
		var arr = Array.isArray(value);
		if (num || isNumberType(rule.type)) {
			key = 'number';
		} else if (str) {
			key = 'string';
		} else if (arr) {
			key = 'array';
		}
		// if the value is not of a supported type for range validation
		// the validation rule rule should use the
		// type property to also test for a particular type
		if (!key) {
			return false;
		}
		if (!isNumberType(rule.type) && (str || arr)) {
			val = value.length;
		}
		if (len) {
			if (val !== rule.len) {
				errors.push(util.format(options.messages[key].len, rule.fullField, rule.len));
			}
		} else if (min && !max && val < rule.min) {
			errors.push(util.format(options.messages[key].min, rule.fullField, rule.min));
		} else if (max && !min && val > rule.max) {
			errors.push(util.format(options.messages[key].max, rule.fullField, rule.max));
		} else if (min && max && (val < rule.min || val > rule.max)) {
			errors.push(util.format(options.messages[key].range,
					rule.fullField, rule.min, rule.max));
		}
	}
	
	return range;
})
