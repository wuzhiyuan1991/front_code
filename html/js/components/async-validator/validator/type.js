define(function(require) {
	var rules = require("../rule/index");
	var isEmptyValue = require("../util").isEmptyValue;

	function type(rule, value, callback, source, options) {
	  var ruleType = rule.type;
	  var errors = [];
	  var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
	  if (validate) {
	    if (isEmptyValue(value, ruleType) && !rule.required) {
	      return callback();
	    }
	    rules.required(rule, value, source, errors, options, ruleType);
	    if (!isEmptyValue(value, ruleType)) {
	      rules.type(rule, value, source, errors, options);
	    }
	  }
	  callback(errors);
	}
	
	return type;
});