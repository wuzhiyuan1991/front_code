define(function(require) {
	var defaults = require('./detailPanel');
	
	var mixin = {
		methods : {
			doUpdate : function(data) {
				var _this = this;
				this.$api.update({}, data).then(function(res) {
					_.extend(_this.mainModel.vo, data);
					_this.$dispatch("ev_dtUpdate");
				});
			}
		}
	};
	
	mixin.methods = _.extend({}, defaults.methods, mixin.methods);
	
	_.extend(mixin, _.omit(defaults, "methods"));
	return mixin;
});