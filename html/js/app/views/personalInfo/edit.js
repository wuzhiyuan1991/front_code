define(function(require){
	var LIB = require('lib');

 	//数据模型
	var tpl = require("text!./edit.html");
	var api = null;

	//初始化数据模型
	var newVO = function() {
		return {
			//name:null,
			//parent:{id:null},
			//compId:null,
			compId: null,
			createBy:null,
			createDate: null,
			deleteFlag:null,
			disable: null,
			id: null,
			isEditable:null,
			level:null,
			name: null,
			orgId: null,
			parent:{id:null},
			parentId:null,
			sort: null,
			type: null
		}
	};

	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
		},
		//文件数据
		folderData:null,
	};
	
	var detail = LIB.Vue.extend({
		template: tpl,
		components : {
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doSave: function () {
				var _this = this;
				api.updateFile(_this.mainModel.vo).then(function(res){
					_this.$emit("do-edit-finshed");
				})
			},
		},
		ready: function () {
			var _this = this;
			require(["./vuex/api"], function (data) {
				api = data;
			});
		},
		events:{
			"ev_editReload": function (data) {
				var _this = this;
				var _vo = _this.mainModel.vo;
				//清空数据
				_.extend(_vo, newVO());
				_.deepExtend(_vo, data);

			}
		},
	});
	
	return detail;
});