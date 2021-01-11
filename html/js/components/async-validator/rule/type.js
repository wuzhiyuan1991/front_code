define(function(require) {
	var util = require("../util");
	var required = require("./required");
	
	/* eslint max-len:0 */
	
	var pattern = {
			number: /(^-?[0-9]+\.{1}\d+$)|(^-?[1-9][0-9]*$)|(^0$)/,
			card:/(^\d{15}$)|(^\d{17}([0-9]|X)$)/,//身份证
			tel:/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/,//固话
			phone:/^1[34578]\d{9}$/,//手机
			email: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
			url: new RegExp('^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$', 'i'),
			hex: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i,
			positiveInteger:/^[1-9]*[1-9][0-9]*$/
	};{}
	
	var types = {
			integer: function(value) {
//				return types.number(value) && parseInt(value, 10) === value;
				//TODO 修改为也支持正常格式的字符串类型
				return types.number(value) && parseInt(value, 10) == value;
			},
			float: function(value) {
				return types.number(value) && !types.integer(value);
			},
			array: function(value) {
				return Array.isArray(value);
			},
			regexp: function(value) {
				if (value instanceof RegExp) {
					return true;
				}
				try {
					return !!new RegExp(value);
				} catch (e) {
					return false;
				}
			},
			date: function(value) {
				return typeof value.getTime === 'function' &&
				typeof value.getMonth === 'function' &&
				typeof value.getYear === 'function';
			},
			number: function(value) {
				if (isNaN(value)) {
					return false;
				}
				return typeof (value) === 'number' ? true : typeof (value) === 'string' ? !!value.match(pattern.number) : false;
				// TODO 修改为也支持正常格式的字符串类型
//				return typeof (value) === 'number';
			},
			object: function(value) {
				return typeof (value) === 'object' && !types.array(value);
			},
			method: function(value) {
				return typeof (value) === 'function';
			},
			card: function(value) {
				return typeof (value) === 'string' && !!value.match(pattern.card);
			},
			tel: function(value) {
				return typeof (value) === 'string' && !!value.match(pattern.tel);
			},
			phone: function(value) {
				return typeof (value) === 'string' && !!value.match(pattern.phone);
			},
			email: function(value) {
				return typeof (value) === 'string' && !!value.match(pattern.email);
			},
			url: function(value) {
				return typeof (value) === 'string' && !!value.match(pattern.url);
			},
			hex: function(value) {
				return typeof (value) === 'string' && !!value.match(pattern.hex);
			},
			positiveInteger: function(value) {
				return typeof (value) === 'string' && !!value.match(pattern.positiveInteger);
			}
	};
	
	/**
	 *  Rule for validating the type of a value.
	 *
	 *  @param rule The validation rule.
	 *  @param value The value of the field on the source object.
	 *  @param source The source object being validated.
	 *  @param errors An array of errors that this rule may add
	 *  validation errors to.
	 *  @param options The validation options.
	 *  @param options.messages The validation messages.
	 */
	function type(rule, value, source, errors, options) {
		if (rule.required && value === undefined) {
			required(rule, value, source, errors, options);
			return;
		}
		var custom = ['integer', 'float', 'array', 'regexp', 'object',
		                'method', 'card','tel','phone','email', 'number', 'date', 'url', 'hex','positiveInteger'];
		var ruleType = rule.type;
		if (custom.indexOf(ruleType) > -1) {
			if (!types[ruleType](value)) {
				errors.push(util.format(options.messages.types[ruleType], rule.fullField, rule.type));
			}
			// straight typeof check
		} else if (ruleType && typeof (value) !== rule.type) {
			errors.push(util.format(options.messages.types[ruleType], rule.fullField, rule.type));
		}
	}
	
	return type;
});
