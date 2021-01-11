define(function(require) {
	var formatRegExp = /%[sdj%]/g;
	
	var warning2 = function() {
	};
	//环境切换
//	if (process.env.NODE_ENV !== 'production') {
		warning2 = function(type, message) {
			if (typeof console !== 'undefined' && console.warn) {
				console.warn(type, message);
			}
		};
//	}
	
	var warning = function (type, errors) {
		// only warn native warning, default type is string, confuses many people...
		if (errors.every(function(e){typeof e === 'string'})) {
			warning2(type, errors);
		}
	}
	
	var format = function () {
		var args = arguments;
		var i = 1;
		var f = args[0];
		var len = args.length;
		if (typeof f === 'function') {
			return f.apply(null, args.slice(1));
		}
		if (typeof f === 'string') {
			var str = String(f).replace(formatRegExp, function(x) {
				if (x === '%%') {
					return '%';
				}
				if (i >= len) {
					return x;
				}
				switch (x) {
				case '%s':
					return String(args[i++]);
				case '%d':
					return Number(args[i++]);
				case '%j':
					try {
						return JSON.stringify(args[i++]);
					} catch (_) {
						return '[Circular]';
					}
					break;
				default:
					return x;
				}
			});
			for (var arg = args[i]; i < len; arg = args[++i]) {
//				str += ` ${arg}`;
				str += ' ${arg}';
			}
			return str;
		}
		return f;
	}
	
	function isNativeStringType(type) {
		return type === 'string' || type === 'url' || type === 'hex' || type === 'email';
	}
	
	var isEmptyValue = function(value, type) {
		type = type || 'string';
		if (value === undefined || value === null) {
			return true;
		}
		if (type === 'array' && Array.isArray(value) && !_.compact(value).length) {
			return true;
		}
		if (isNativeStringType(type) && typeof value === 'string' && !value) {
			return true;
		}
		return false;
	}
	
	var isEmptyObject =  function (obj) {
		return Object.keys(obj).length === 0;
	}
	
	function asyncParallelArray(arr, func, callback) {
		var results = [];
		var total = 0;
		var arrLength = arr.length;
		
		function count(errors) {
			results.push.apply(results, errors);
			total++;
			if (total === arrLength) {
				callback(results);
			}
		}
		
		arr.forEach(function(a) {
			func(a, count);
		});
	}
	
	function asyncSerialArray(arr, func, callback) {
		var index = 0;
		var arrLength = arr.length;
		
		function next(errors) {
			if (errors && errors.length) {
				callback(errors);
				return;
			}
			var original = index;
			index = index + 1;
			if (original < arrLength) {
				func(arr[original], next);
			} else {
				callback([]);
			}
		}
		
		next([]);
	}
	
	function flattenObjArr(objArr) {
		var ret = [];
		Object.keys(objArr).forEach(function(k) {
			ret.push.apply(ret, objArr[k]);
		});
		return ret;
	}
	
	var asyncMap =  function (objArr, option, func, callback) {
		if (option.first) {
			var flattenArr = flattenObjArr(objArr);
			return asyncSerialArray(flattenArr, func, callback);
		}
		var firstFields = option.firstFields || [];
		if (firstFields === true) {
			firstFields = Object.keys(objArr);
		}
		var objArrKeys = Object.keys(objArr);
		var objArrLength = objArrKeys.length;
		var total = 0;
		var results = [];
		var next = function(errors) {
			results.push.apply(results, errors);
			total++;
			if (total === objArrLength) {
				callback(results);
			}
		};
		objArrKeys.forEach(function(key) {
			var arr = objArr[key];
			if (firstFields.indexOf(key) !== -1) {
				asyncSerialArray(arr, func, next);
			} else {
				asyncParallelArray(arr, func, next);
			}
		});
	}
	
	var complementError = function (rule) {
		return function(oe) {
			if (oe && oe.message) {
				oe.field = oe.field || rule.fullField;
				return oe;
			}
			return {
				message: oe,
				field: oe.field || rule.fullField,
			};
		};
	}
	
	var deepMerge = function (target, source) {
		if (source) {
			for (var s in source) {
				if (source.hasOwnProperty(s)) {
					var value = source[s];
					if (typeof value === 'object' && typeof target[s] === 'object') {
//						target[s] = {
//								...target[s],
//								...value,
//						};
					} else {
						target[s] = value;
					}
				}
			}
		}
		return target;
	}
	return {
		warning : warning,
		format : format,
		isEmptyValue : isEmptyValue,
		isEmptyObject : isEmptyObject,
		asyncMap : asyncMap,
		complementError:complementError,
		deepMerge:deepMerge
	}
});
