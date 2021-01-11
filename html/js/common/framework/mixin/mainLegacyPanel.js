define(function(require) {

	var defaults = require('./mainPanel');
	
	var mixin = {
		methods : {
			doSave : function(data) {
				var _this = this;
				this.$api.create({}, data).then(function(res) {
					_this.refreshMainTable();
				});
			}
		}
	};
	
	mixin.methods = _.extend({}, defaults.methods, mixin.methods);
	
	_.extend(mixin, _.omit(defaults, "methods"));
	
	return mixin;
});