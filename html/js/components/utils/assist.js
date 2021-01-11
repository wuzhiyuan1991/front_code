define(function(require){

	var cached ;

	var rs = {

		oneOf : function (value, validList) {
			for (var i = 0; i < validList.length; i++) {
				if (value === validList[i]) {
					return true;
				}
			}
			return false;
		},

		camelcaseToHyphen : function(str) {
			return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
		},

		// For Modal scrollBar hidden
//		let cached;
		getScrollBarSize : function (fresh) {
			if (fresh || cached === undefined) {
				var inner = document.createElement('div');
				inner.style.width = '100%';
				inner.style.height = '200px';

				var outer = document.createElement('div');
				var outerStyle = outer.style;

				outerStyle.position = 'absolute';
				outerStyle.top = 0;
				outerStyle.left = 0;
				outerStyle.pointerEvents = 'none';
				outerStyle.visibility = 'hidden';
				outerStyle.width = '200px';
				outerStyle.height = '150px';
				outerStyle.overflow = 'hidden';

				outer.appendChild(inner);

				document.body.appendChild(outer);

				var widthContained = inner.offsetWidth;
				outer.style.overflow = 'scroll';
				var widthScroll = inner.offsetWidth;

				if (widthContained === widthScroll) {
					widthScroll = outer.clientWidth;
				}

				document.body.removeChild(outer);

				cached = widthContained - widthScroll;
			}
			return cached;
		},
		typeOf :function (obj) {
			var toString = Object.prototype.toString;
			var map = {
				'[object Boolean]'  : 'boolean',
				'[object Number]'   : 'number',
				'[object String]'   : 'string',
				'[object Function]' : 'function',
				'[object Array]'    : 'array',
				'[object Date]'     : 'date',
				'[object RegExp]'   : 'regExp',
				'[object Undefined]': 'undefined',
				'[object Null]'     : 'null',
				'[object Object]'   : 'object'
			};
			return map[toString.call(obj)];
		},
		camelCase :function (name) {
			return name.replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
				return offset ? letter.toUpperCase() : letter;
			}).replace(MOZ_HACK_REGEXP, 'Moz$1');
		},
		camelcaseToHyphen :function  (str) {
			return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
		},
		getScrollBarSize :function (fresh) {
			if (fresh || cached === undefined) {
				var inner = document.createElement('div');
				inner.style.width = '100%';
				inner.style.height = '200px';

				var outer = document.createElement('div');
				var outerStyle = outer.style;

				outerStyle.position = 'absolute';
				outerStyle.top = 0;
				outerStyle.left = 0;
				outerStyle.pointerEvents = 'none';
				outerStyle.visibility = 'hidden';
				outerStyle.width = '200px';
				outerStyle.height = '150px';
				outerStyle.overflow = 'hidden';

				outer.appendChild(inner);

				document.body.appendChild(outer);

				var widthContained = inner.offsetWidth;
				outer.style.overflow = 'scroll';
				var widthScroll = inner.offsetWidth;

				if (widthContained === widthScroll) {
					widthScroll = outer.clientWidth;
				}

				document.body.removeChild(outer);

				cached = widthContained - widthScroll;
			}
			return cached;
		},
		MutationObserver :function(){
			var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || false;
		},
		getStyle :function  (element, styleName) {
			if (!element || !styleName) return null;
			styleName = camelCase(styleName);
			if (styleName === 'float') {
				styleName = 'cssFloat';
			}
			try {
				var computed = document.defaultView.getComputedStyle(element, '');
				return element.style[styleName] || computed ? computed[styleName] : null;
			} catch(e) {
				return element.style[styleName];
			}
		},
		// firstUpperCase
		firstUpperCase :function (str) {
			return str.toString()[0].toUpperCase() + str.toString().slice(1);
		},


// scrollTop animation
		scrollTop: function (el, to) {
			var from = 0;
			var duration = 500;
			if (!window.requestAnimationFrame) {
				window.requestAnimationFrame = (
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					window.msRequestAnimationFrame ||
					function (callback) {
						return window.setTimeout(callback, 1000/60);
					}
				);
			}
			var difference = Math.abs(from - to);
			var step = Math.ceil(difference / duration * 50);

			function scroll(start, end, step) {
				if (start === end) return;

				var d = (start + step > end) ? end : start + step;
				if (start > end) {
					d = (start - step < end) ? end : start - step;
				}

				if (el === window) {
					window.scrollTo(d, d);
				} else {
					el.scrollTop = d;
				}
				window.requestAnimationFrame(function(){
					scroll(d, end, step)
				});
			}
			scroll(from, to, step);
		},
		warnProp : function (component, prop, correctType, wrongType) {
			correctType = firstUpperCase(correctType);
			wrongType = firstUpperCase(wrongType);
			//console.error(`[iView warn]: Invalid prop: type check failed for prop ${prop}. Expected ${correctType}, got ${wrongType}. (found in component: ${component})`);    // eslint-disable-line
		}
	}
	rs.deepCopy =function (data) {
		var t = rs.typeOf(data);
		var o;

		if (t === 'array') {
			o = [];
		} else if ( t === 'object') {
			o = {};
		} else {
			return data;
		}

		if (t === 'array') {
			for (var i = 0; i < data.length; i++) {
				o.push(rs.deepCopy(data[i]));
			}
		} else if ( t === 'object') {
			for (var i in data) {
				o[i] = rs.deepCopy(data[i]);
			}
		}
		return o;
	}
	return rs;
});

//// watch DOM change
//export var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || false;
var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
var MOZ_HACK_REGEXP = /^moz([A-Z])/;
// getStyle
//export {firstUpperCase};

// deepCopy
//export {deepCopy};
