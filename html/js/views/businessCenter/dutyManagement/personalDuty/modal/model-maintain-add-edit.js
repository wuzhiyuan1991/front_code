define(function(require){
	var api = require("../vuex/api");
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./model-maintain-add-edit.html");
	var maintainSelectModal = require("componentsEx/selectTableModal/userSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			startTime: null,
			endTime: null,
			workRecord: null,
			users: null
		}
	};

	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'create',
			isReadOnly : false,
			title:"添加",
			// 表单校验
	        rules: {
				"startTime": [
					{ required: true, message: "不能为空，请选择" },
					{ validator: function(rule, val, cb) {
						var vo = dataModel.mainModel.vo;
						if (vo.startTime >= vo.endTime) {
							cb(new Error("开始时间应小于结束时间"))
						} else {
							cb()
						}
					}
				}],
				"endTime": [
					{ required: true, message: "不能为空，请选择" },			
				],
				"workRecord": [ 
					{ required: true, message: "不能为空，请输入" },	
					LIB.formRuleMgr.length(500, 1) 
				],
				"users": [
					{   
						required: true,
						validator: function (rule, val, cb) {
							if(_.isEmpty(val)) {
								return cb(new Error("不能为空，请选择"));
							}
							return cb();
						}
					}	
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
			"maintainSelectModal": maintainSelectModal
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			init: function(data, duty_record_id) {
				this.mainModel.vo = new newVO();
				this.mainModel.opType = 'create';
				this.mainModel.title = '添加';
				if(data) {
					_.extend(this.mainModel.vo, data.entry.data);
					this.mainModel.vo.users = _.cloneDeep(data.entry.data.users)
					this.mainModel.opType = 'update';
					this.mainModel.title = '编辑';
				}
				if(duty_record_id){
					this.mainModel.vo.dutyRecordId = duty_record_id;
				}
			},
			showAddMaintain: function(data) {
				var _this = this;
				// var data = item.entry.data;
				if(this.mainModel.opType == "create") {
					api.addMaintainApi(null, data).then(function(res) {
						_this.$emit("create-refresh-maintain")
					});
				} else if (this.mainModel.opType == "update") {
					api.editMaintainApi(null, data).then(function(res) {
						_this.$emit("update-refresh-maintain")
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
			doSaveMaintain: function (arr) {
				this.mainModel.vo.users = arr;
			},
			doSave: function () {
				var _this = this;
				this.$refs.ruleform.validate(function(valid) {
					if (valid) {
						if(_this.mainModel.vo.startTime) {
							var tempStartTime = _this.mainModel.vo.startTime.slice(0, 16) + ":00";
							_this.mainModel.vo.startTime = tempStartTime;
						}
						if(_this.mainModel.vo.endTime) {
							var tempEndTime = _this.mainModel.vo.endTime.slice(0, 16) + ":00";
							_this.mainModel.vo.endTime = tempEndTime;
						}
						_this.showAddMaintain(_this.mainModel.vo);
						_this.visible = false;
					}
				})
			},
			doClose: function () {
			    this.visible = false;
			},
			// 维检人员
			showMaintainSelectModal: function(val) {
				this.optType = val;
				this.selectModel.userSelectModel.visible = true;
				this.selectModel.userSelectModel.filterData = {orgId : this.orgId};
			}
		}
	});
	return detail;
});