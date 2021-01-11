define(function(require) {
	var Vue = require("vue");
	Vue.directive('loadscroll', {
		bind: function () {
			var _this = this;
				this.documentHandler = function () {
					if (_this.expression) {
						_this.vm[_this.expression](_this.el);
					}
				};
			 _this.el.addEventListener('scroll', _this.documentHandler);
		}
	});
});