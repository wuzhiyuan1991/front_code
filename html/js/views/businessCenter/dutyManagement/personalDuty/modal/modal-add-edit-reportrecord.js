define(function(require){
	var api = require("../vuex/api");
	var LIB = require('lib');
	var tpl = require("text!./modal-add-edit-reportrecord.html");
	var productSelectModal = require("componentsEx/selectTableModal/userSelectModal");

	// 初始化数据
	var newVO = function() {
		return {
			id: null,
			recordId: null,
			date: null,
			eventContent: null
		}
	};

	// Vue数据
	var dataModel = {
		mainModel : {
			vo: newVO(),
			opType: 'create',
			isReadOnly: false,
			title: "添加",
			// 表单校验
	        rules: {
				"date": [
					{ required: true, message: "请选择" }
				],
				"eventContent": [
					{ required: true, message: "请输入" },
					LIB.formRuleMgr.length(500, 1) 
				]
	        },
	        emptyRules:{}
		},
		selectModel: {
			userSelectModel : {
				visible: false,
				filterData: {orgId : null}
			}
		},
	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components: {
			"productSelectModal": productSelectModal
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO: newVO,
			init: function(data, recordId) {
				this.mainModel.vo = new newVO();
				this.mainModel.opType = 'create';
				this.mainModel.title = '添加-阀室汇报记录';
				if(data) {
					// _.extend(this.mainModel.vo, data.entry.data);
					this.mainModel.opType = 'update';
					this.mainModel.title = '编辑-阀室汇报记录';
					_.extend(this.mainModel.vo, data);
				}
				if(recordId) {
					this.mainModel.vo.recordId = recordId;
				}
			},
			doSaveMaintain: function (arr) {
				this.mainModel.vo.users = arr;
			},
			doSave: function () {
				var _this = this;
				this.$refs.ruleform.validate(function(valid) {
					if (valid) {
						if(_this.mainModel.vo.date) {
							var tempDate = _this.mainModel.vo.date.slice(0, 16) + ":00";
							_this.mainModel.vo.date = tempDate;
						}
						_this.showAddReportrecord(_this.mainModel.vo);
						_this.visible = false;
					}
				})
			},
			showAddReportrecord: function(data) {
				var _this = this;
				// var data = item.entry.data;
				if(this.mainModel.opType == "create") {
					api.addReportRecordApi(null, data).then(function(res) {
						_this.$emit("refresh-duty-record")
					});
				} else if (this.mainModel.opType == "update") {
					api.editReportRecordApi(null, data).then(function(res) {
						_this.$emit("refresh-duty-record")
					})
				}
			},
			getUUID: function() {
				var _this = this;
				api.getUUID().then(function (res) {
					var data = res.data;
					 _this.mainModel.vo.id = data;
				});
			},
			doClose: function () {
			    this.visible = false;
			}
		}
	});
	return detail;
});