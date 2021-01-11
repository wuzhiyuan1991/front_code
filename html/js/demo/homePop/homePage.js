define(function(require){
	var LIB = require('lib');
 	//数据模型
	var api = require("../vuex/api");
	var tpl = require("text!./homePage.html");

	var selectDialog = LIB.Vue.extend({
		template: tpl,
		methods: {
			doSave: function () {
				this.$dispatch("ev_editCanceled");
			},
			doCancel: function () {
				this.$dispatch("ev_editCanceled");
			},
		},
		events : {}
	});
	
	return selectDialog;
});