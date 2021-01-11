define(function(require){
	var api = require("../vuex/api");
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./model-valveparam-add-edit.html");
	// var maintainSelectModal = require("componentsEx/selectTableModal/userSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			id: null,
			number: null,
			weather: null,
			reportTime: null,
			temperature: null,
			pressure: null,
			cylinderPressure: null,
			batteryPressure: null,
			directVoltage: null,
			dutyRecordId: null,
			valveNum: null
		}
	};

	//Vue数据
	var dataModel = {
		mainModel: {
			number: null,
			vo: newVO(),
			opType: 'create',
			isReadOnly: false,
			title: "添加",
			showSelect: true,
			valveNum: [],
			// 表单校验
	        rules: {
				// "number": [
				// 	{ required: true, message: "请选择或输入" }
				// ],
				"reportTime": [
					{ required: true, message: "请选择" }
				],
				"temperature": [
					{ validator: LIB.formRuleMgr.checkNumPotNotReq },					
				],
				"pressure": [
					{ required: true, message: "不能为空，请输入" },
					{ validator: LIB.formRuleMgr.checkNumPot2 },					
				],
				"cylinderPressure": [
					{ required: true, message: "不能为空，请输入" },
					{ validator: LIB.formRuleMgr.checkNumPot2 },					
				],
				"batteryPressure": [
					{ validator: LIB.formRuleMgr.checkNumPot2NotReq },					
				],
				"directVoltage": [
					{ validator: LIB.formRuleMgr.checkNumPot2NotReq },					
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
			// "maintainSelectModal": maintainSelectModal
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO: newVO,
			init: function(data, duty_record_id, recordsNums) {
				this.mainModel.vo = new newVO();
				this.mainModel.opType = 'create';
				this.mainModel.title = '添加';
				this.mainModel.showSelect = true;
				if(data) {
					_.extend(this.mainModel.vo, data.entry.data);
					this.mainModel.opType = 'update';
					this.mainModel.title = '编辑';
					this.mainModel.showSelect = false;
				}
				if(duty_record_id){
					this.mainModel.vo.dutyRecordId = duty_record_id;
				}
				this.mainModel.valveNum = recordsNums || [];
				this.mainModel.number = this.mainModel.vo.number;
			},
			getUUID: function() {
				var _this = this;
				api.getUUID().then(function (res) {
					var data = res.data;
					 _this.mainModel.vo.id = data;
				});
			},
			doSave: function () {
				var _this = this;
				this.$refs.ruleform.validate(function(valid) {
					if (valid) {
						if(_this.mainModel.vo.reportTime) {
							var timeDelSec = _this.mainModel.vo.reportTime.slice(0, 16) + ":00";
							_this.mainModel.vo.reportTime = timeDelSec;
						}
						_this.showAddVeparam(_this.mainModel.vo);
						_this.visible = false;
					}
				})
			},
			showAddVeparam: function(data) {
				var _this = this;
				// var data = item.entry.data;
				if(this.mainModel.number != "newAdd") {
					this.mainModel.vo.number = this.mainModel.number
				}
				if(this.mainModel.opType == "create") {
					api.addVeparamApi(null, data).then(function(res) {
						_this.$emit("create-refresh")
					});
				} else if (this.mainModel.opType == "update") {
					api.editVeparamApi(null, data).then(function(res) {
						_this.$emit("update-refresh")
					})
				}
			},
			doClose: function () {
			    this.visible = false;
			}
		}
	});
	return detail;
});