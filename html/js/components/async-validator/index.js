/**
 * 转义第三方async-validator验证框架
 * 参考官网: https://github.com/yiminghe/async-validator
 * ES6语法
 * @param require
 * @returns
 */
define(function(require) {
	/***util工具类方法BEGIN****/
	var util = require("./util");
	var format = util.format;
	var complementError = util.complementError;
	var asyncMap = util.asyncMap;
	var warning = util.warning;
	var deepMerge = util.deepMerge;
	/***util工具类方法END****/
	var validators = require("./validator/index");
	/**********messages工具类方法BEGIN***********/
	var messages = require("./messages");
	var defaultMessages = messages.messages;
	var newMessages = messages.newMessages;
	/**********messages工具类方法END***********/
	var error = require("./rule/index");
	
	/**
	 *  Encapsulates a validation schema.
	 *
	 *  @param descriptor An object declaring validation rules
	 *  for this schema.
	 */
	function Schema(descriptor) {
	  this.rules = null;
	  this._messages = defaultMessages;
	  this.define(descriptor);
	}

	Schema.prototype = {
	  messages: function(messages) {
	    if (messages) {
	      this._messages = deepMerge(newMessages(), messages);
	    }
	    return this._messages;
	  },
	  define: function(rules) {
	    if (!rules) {
	      throw new Error(
	        'Cannot configure a schema with no rules');
	    }
	    if (typeof rules !== 'object' || Array.isArray(rules)) {
	      throw new Error('Rules must be an object');
	    }
	    this.rules = {};
	    var z;
	    var item;
	    for (z in rules) {
	      if (rules.hasOwnProperty(z)) {
	        item = rules[z];
	        this.rules[z] = Array.isArray(item) ? item : [item];
	      }
	    }
	  },
	  validate: function(source_, o, oc,formData) {
		    var source = source_;
		    var options = o || {};
		    var callback = oc;
		    if (typeof options === 'function') {
		      callback = options;
		      options = {};
		    }
		    if (!this.rules || Object.keys(this.rules).length === 0) {
		      if (callback) {
		        callback();
		      }
		      return;
		    }
		    function complete(results) {
		      var i;
		      var field;
		      var errors = [];
		      var fields = {};

		      function add(e) {
		        if (Array.isArray(e)) {
		          errors = errors.concat.apply(errors, e);
		        } else {
		          errors.push(e);
		        }
		      }

		      for (i = 0; i < results.length; i++) {
		        add(results[i]);
		      }
		      if (!errors.length) {
		        errors = null;
		        fields = null;
		      } else {
		        for (i = 0; i < errors.length; i++) {
		          field = errors[i].field;
		          fields[field] = fields[field] || [];
		          fields[field].push(errors[i]);
		        }
		      }
		      callback(errors, fields);
		    }

		    if (options.messages) {
		      var messages = this.messages();
		      if (messages === defaultMessages) {
		        messages = newMessages();
		      }
		      deepMerge(messages, options.messages);
		      options.messages = messages;
		    } else {
		      options.messages = this.messages();
		    }

		    options.error = error;
		    var arr;
		    var value;
		    var series = {};
		    var keys = options.keys || Object.keys(this.rules);
		    var _this = this;
		    keys.forEach(function(z){
		      arr = _this.rules[z];
		      value = source[z];
		      arr.forEach(function(r){
		        var rule = r;
		        if (typeof (rule.transform) === 'function') {
		          if (source === source_) {
//		            source = { ...source };
		          }
		          value = source[z] = rule.transform(value);
		        }
		        if (typeof (rule) === 'function') {
		          rule = {
		            validator: rule,
		          };
		        } else {
//		          rule = { ...rule };
		        }
		        rule.validator = _this.getValidationMethod(rule);
		        rule.field = z;
		        // rule.fullField = rule.fullField || z;
                rule.fullField = z;
		        rule.type = _this.getType(rule);
		        if (!rule.validator) {
		          return;
		        }
		        series[z] = series[z] || [];
		        series[z].push({
		          rule:rule,
		          value:value,
		          source:source,
		          field: z,
		        });
		      });
		    });
		    var errorFields = {};
		    asyncMap(series, options, function(data, doIt) {
		      var rule = data.rule;
		      var deep = (rule.type === 'object' || rule.type === 'array') &&
		        (typeof (rule.fields) === 'object' || typeof (rule.defaultField) === 'object');
		      deep = deep && (rule.required || (!rule.required && data.value));
		      rule.field = data.field;
		      function addFullfield(key, schema) {
		        return {
//		          ...schema,
//		          fullField: `${rule.fullField}.${key}`,
		        };
		      }

		      function cb(e) {
		        var errors = e || [];
		        if (!Array.isArray(errors)) {
		          errors = [errors];
		        }
		        if (errors.length) {
		          warning('async-validator:', errors);
		        }
		        if (errors.length && rule.message) {
		          errors = [].concat(rule.message);
		        }

		        errors = errors.map(complementError(rule));

		        if ((options.first || options.fieldFirst) && errors.length) {
		          errorFields[rule.field] = 1;
		          return doIt(errors);
		        }
		        if (!deep) {
		          doIt(errors);
		        } else {
		          // if rule is required but the target object
		          // does not exist fail at the rule level and don't
		          // go deeper
		          if (rule.required && !data.value) {
		            if (rule.message) {
		              errors = [].concat(rule.message).map(complementError(rule));
		            } else {
		              errors = [options.error(rule, format(options.messages.required, rule.field))];
		            }
		            return doIt(errors);
		          }

		          var fieldsSchema = {};
		          if (rule.defaultField) {
		            for (var k in data.value) {
		              if (data.value.hasOwnProperty(k)) {
		                fieldsSchema[k] = rule.defaultField;
		              }
		            }
		          }
		          fieldsSchema = {
//		            ...fieldsSchema,
//		            ...data.rule.fields,
		          };
		          for (var f in fieldsSchema) {
		            if (fieldsSchema.hasOwnProperty(f)) {
		              var fieldSchema = Array.isArray(fieldsSchema[f]) ?
		                fieldsSchema[f] : [fieldsSchema[f]];
		              fieldsSchema[f] = fieldSchema.map(addFullfield.bind(null, f));
		            }
		          }
		          var schema = new Schema(fieldsSchema);
		          schema.messages(options.messages);
		          if (data.rule.options) {
		            data.rule.options.messages = options.messages;
		            data.rule.options.error = options.error;
		          }
		          schema.validate(data.value, data.rule.options || options, function(errs) {
		            doIt(errs && errs.length ? errors.concat(errs) : errs);
		          });
		        }
		      }
		      rule.validator.call(
				  formData,rule, data.value, cb, data.source, options);
		    }, function(results) {
		      complete(results);
		    });
		  },
	  getType : function(rule) {
	    if (rule.type === undefined && (rule.pattern instanceof RegExp)) {
	      rule.type = 'pattern';
	    }
	    if (typeof (rule.validator) !== 'function' &&
	      (rule.type && !validators.hasOwnProperty(rule.type))) {
	      throw new Error(format('Unknown rule type %s', rule.type));
	    }
	    return rule.type || 'string';
	  },
	  getValidationMethod:function(rule) {
	    if (typeof rule.validator === 'function') {
	      return rule.validator;
	    }
	    var keys = Object.keys(rule);
	    if (keys.length === 1 && keys[0] === 'required') {
	      return validators.required;
	    }
	    return validators[this.getType(rule)] || false;
	  },
	};

	Schema.register = function register(type, validator) {
	  if (typeof validator !== 'function') {
	    throw new Error('Cannot register a validator by type, validator is not a function');
	  }
	  validators[type] = validator;
	};

	Schema.messages = defaultMessages;

	return Schema;
});