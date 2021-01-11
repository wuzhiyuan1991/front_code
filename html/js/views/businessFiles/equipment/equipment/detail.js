define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	// var equipmentTypeSelectModal = require("componentsEx/selectTableModal/equipmentTypeSelectModal");
	var equipmentitemFormModal = require("componentsEx/formModal/equipmentItemFormModal");
  	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var dominationAreaSelectModal = require("componentsEx/selectTableModal/dominationAreaSelectModal");
	var equipmentTypeSelectModal = require("componentsEx/equipmentTypeSelectModal/equipmentTypeSelectModal");
    //初始化数据模型
	var newVO = function() {
		return {
			//id
			id : null,
			//设备编号
			code : null,
			//设备设施名称
			name : null,
			//所属公司
			compId : null,
			//所属部门
			orgId : null,
			//是否禁用 0启用，1禁用
			disable : "0",
			//报废日期
			retirementDate : null,
			//设备设施状态 0再用,1停用,2报废
			state : "0",
			//保修期(月)
			warranty : null,
			//保修终止日期 根据保修期自动算出
			warrantyPeriod : null,
			//设备更新日期
			modifyDate : null,
			//负责人
			ownerId : null,
			user : {id:null,name:null},
			//设备登记日期
			createDate : null,
			//设备设施类型
			equipmentType : {id:'', name:''},
			//检查项
			checkItems : [],
			//设备设施子件
			equipmentItems : [],
			version:null,
            dominationArea: {id: '',name: ''},
            nextCheckDate:null,
            notifyMonth:null,
            notifyUsers:[],
			technicsNo:null,//工艺编号
			isIdentification:null,

			//ERP设备编号
			erpEquipmentNo : null,
			//ERP站场编号
			erpStationNo : null,
			//失效模型
			failureModel : null,
			//是否完好 1:是,0:否
			intact : null,
			//是否辨识 0:未辨识,1:已辨识
			isIdentification : null,
			//ABC分级
			level : null,
			//设计寿命
			life : null,
			//长宽高
			lwh : null,
			//管理单元编码
			managementUnitCode : null,
			//管理单元类型
			managementUnitType : null,
			//制造国
			manufactureCountry : null,
			//制造日期
			manufactureDate : null,
			//投用日期
			applyDate : null,
			//出厂编号
			manufactureNo : null,
			//制造厂家
			manufacturer : null,
			//是否测量设备 1是,0否
			measure : null,
			//管理单位
			mgrUnit : null,
			//机型/规格
			modelSpecification : null,
			//修改信息
			modifyInfo : null,
			//下次检验日期
			nextCheckDate : null,
			//提前提醒月
			notifyMonth : null,
			//管线
			pipeline : null,
			//产品标准
			productStandard : null,
			//区域
			region : null,
			//备注
			remark : null,
			//报废日期
			retirementDate : null,
			//服务管线
			servicePipeline : null,
			//是否特种设备 1是,0否
			special : null,
			//专业
			speciality : null,
			//设备设施状态 0再用,1停用,2报废
			state : null,
			//3D站场编号
			stationNo : null,
			//工艺编号
			technicsNo : null,
			//设备型号
			version : null,
			//保修期(月)
			warranty : null,
			//保修终止日期 根据保修期自动算出
			warrantyPeriod : null,
			//设备重量
			weight : null,
			//工作能力
			workAbility : null,


		}
	};
	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:"",
			showUserSelectModal : false,
            showUsersSelectModal: false,
			//验证规则
	        rules:{
	        	//"code":[LIB.formRuleMgr.require("编码")]
				"code" : [LIB.formRuleMgr.require("设备编码"),
						  LIB.formRuleMgr.length()],
				"name": [LIB.formRuleMgr.require("设备设施名称"),
					LIB.formRuleMgr.length()],
				"version": [LIB.formRuleMgr.length(100)],
				"compId" : [
					{required: true, message: '请选择所属公司'},
					LIB.formRuleMgr.length()],
				"orgId" : [{required: true, message: '请选择所属部门'},
					LIB.formRuleMgr.length()],
				"equipmentType.id": [LIB.formRuleMgr.require("设备类型"),
					LIB.formRuleMgr.length()],
				"dominationArea.id":[{required: true, message: '请选择属地'},
                    LIB.formRuleMgr.length()],
				"retirementDate" : [LIB.formRuleMgr.length()],
				"state" : [LIB.formRuleMgr.length()],
				"warranty" : LIB.formRuleMgr.range(0, 1000),
				"warrantyPeriod" : [LIB.formRuleMgr.length()],
				"modifyDate" : [LIB.formRuleMgr.length()],
				"createDate" : [LIB.formRuleMgr.length()],
                nextCheckDate:[{
                	validator: function (rule, value, callback) {
                        var currentDate = new Date().Format("yyyy-MM-dd 00:00:00");
                        if (value) {
                        	if (value < currentDate) {
                                return callback(new Error('下次检验日期必须大于当前时间'));
							}
						}
                        return callback();
                    }}],
                notifyMonth: [
                    {
                        validator: function (rule, value, callback) {
                            if (dataModel.mainModel.vo.nextCheckDate && !value) {
                                return callback(new Error('请输入提前提醒时间'));
                            } else {
                            	if (value > 12) {
                                    return callback(new Error('提前提醒时间不能超过12个月'));
								}
                                return callback();
                            }
                        }
                    }
				]
	        },
	        emptyRules:{}
		},
		tableModel : {
			poolTableModel : LIB.Opts.extendDetailTableOpt({
				url : "equipment/pools/list/{curPage}/{pageSize}",
				columns : [
					{
						title: "编码",
						fieldName: "title",
						fieldType: "link",
						width: 180,
						pathCode: "BC_HG_T"
					},
					{
						//title: "问题描述",
						title: "问题描述",
						fieldName: "problem",
					},
					{
						//title: "建议措施",
						title: "建议措施",
						fieldName: "danger",
					}, {
						//title: "登记日期",
						title: "登记日期",
						fieldName: "registerDate",
					},
					{
						//title: "风险等级",
						title: "风险等级",
						fieldType: "custom",
						hideTip: true,
						render: function (data) {
							if (data.riskLevel) {
								var riskLevel = JSON.parse(data.riskLevel);
								var resultColor = _.propertyOf(JSON.parse(data.riskModel))("resultColor");
								if (riskLevel && riskLevel.result) {
									//return riskLevel.result;
									if (resultColor) {
										return "<span style='background:\#" + resultColor + ";color:\#" + resultColor + ";margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" + riskLevel.result;
									} else {
										return "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" + riskLevel.result;
									}
								} else {
									return "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" + "无";
									//return "无";
								}
							} else {
								return "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" + "无";
								//return "无";
							}
						},
						// width: 120
					}, {
						title: "状态",
						fieldType: "custom",
						render: function (data) {
							return LIB.getDataDic("pool_status", data.status);
						},
						// width: 120
					}
				]
			}),
			checkItemTableModel : {
				url : "equipment/checkitems/list/{curPage}/{pageSize}",
				columns : [{
					title : "编码",
					fieldName : "code"
				},{
					title : "名称",
					fieldName : "name",
				},{
					title : "",
					fieldType : "tool",
					toolType : "edit,del"
				}]
			},
			equipmentItemTableModel : {
				url : "equipment/equipmentitems/list/{curPage}/{pageSize}",
				columns : [{
					title : "编码",
					fieldName : "code",
					width : "180px"
				},{
					title : "子件名称",
					fieldName : "name",
				},{
					title : "序列号",
					fieldName : "serialNumber"
				},{
					title : "保修期",
					fieldName : "warranty",
					width : "100px"
				},{
					title : "保修终止日期",
					fieldName : "warrantyPeriod",
					width : "154px"
				},{
					title : "报废日期",
					fieldName : "retirementDate",
					width : "154px"
				},{
					title : "",
					fieldType : "tool",
					toolType : "edit,del"
				}]
			},
			riskIdentificationTableModel : LIB.Opts.extendDetailTableOpt({
				url : "equipment/riskidentifications/list/{curPage}/{pageSize}",
				columns : [
					{
						title: "编号",
						fieldName: "number",
						fieldType: "link",
						fieldType: "custom",
						width: 100,
						render: function (data) {
							return "<a target='_blank' href='/html/main.html#!/riskAssessment/businessFiles/riskIdentification?bizType="+data.bizType+"&keepUrlParam=true&method=detail&id="+data.id+"&code="+data.code+"'>"+data.number+"</a>"
						}
					},
					{
						title: "活动产品服务",
						fieldName: "activeProductService",
						'renderClass': "textarea",
						keywordFilterName: "criteria.strValue.keyWordValue_activeProductService"
					},
					{
						title: "危害因素种类",
						fieldName: "hazardType",
                        width:180,
						keywordFilterName: "criteria.strValue.keyWordValue_hazardType"
					},
					{
						title: "危害因素成因",
						fieldName: "hazardCause",
                        'renderClass': "textarea",
						keywordFilterName: "criteria.strValue.keyWordValue_hazardCause"
					},
					{
						//后果分析
						title: "后果分析",
						fieldName: "aftermathAnalyze",
						keywordFilterName: "criteria.strValue.keyWordValue_aftermathAnalyze"
					},
					{
						title: "风险评价",
						fieldName: "riskLevel",
						width: 120,
						fieldType: "custom",
						showTip: false,
						render: function (data) {
							var resultColor = _.propertyOf(JSON.parse(data.riskModel))("resultColor");
							if (resultColor) {
								return "<span style='background:\#" + resultColor + ";color:\#" + resultColor + ";margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" + data.riskLevel;
							} else {
								return "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" + data.riskLevel;
							}
						},
					},
					]
			}),
		},

		formModel : {
			checkItemFormModel : {
				show : false,
				queryUrl : "equipment/{id}/checkitem/{checkItemId}"
			},
			equipmentItemFormModel : {
				show : false,
				queryUrl : "equipment/{id}/equipmentitem/{equipmentItemId}"
			},
		},
		selectModel : {
			equipmentTypeSelectModel : {
				visible : false
			},
            dominationAreaSelectModel: {
                visible: false,
                filterData: {orgId: null}
            }
		},
        typeList: null,
		isXBGDRiskAssessment:false,

	};
	//Vue组件
	/**
	 *  请统一使用以下顺序配置Vue参数，方便codeview
	 *	el
	 template
	 components
	 componentName
	 props
	 data
	 computed
	 watch
	 methods
	 events
	 vue组件声明周期方法
	 created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
	 **/
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth,LIB.VueMixin.detailPanel],
		template: tpl,
		components : {
			// "equipmenttypeSelectModal":equipmentTypeSelectModal,
			"equipmentitemFormModal":equipmentitemFormModal,
			"userSelectModal":userSelectModal,
            "dominationareaSelectModal": dominationAreaSelectModal,
			'equipmentTypeSelectModal':equipmentTypeSelectModal,
        },
		data:function(){
			return dataModel;
		},
		computed:{
			state:function(){
				var state = this.mainModel.vo.state;
				if (state == '0') {
					return "在用";
				}
				else if (state == '1') {
					return "停用";
				}else if (state == '2'){
					return "报废"
				}
			},
			// displayTypeName: function () {
			//
			// 	var id = this.mainModel.vo.equipmentType.id;
			// 	if (!id) {
			// 		return ''
			// 	}
			// 	if(this.isXBGDRiskAssessment){
            //         return this.mainModel.vo.equipmentType.attr4 + "(" + this.mainModel.vo.equipmentType.code +")";
			//
			// 	}
			// 	return _.get(_.find(this.typeList, "id", id), "name", "");
            // },
			displayTypeName: function () {
				var id = this.mainModel.vo.equipmentType.id;
				if (!id) {
					return ''
				}
				if(this.mainModel.vo.equipmentType.attr4){
					return this.mainModel.vo.equipmentType.attr4;
				}else{
					return this.mainModel.vo.equipmentType.name;
				}
			},
            displayNextCheckDateText: function () {
                return this.mainModel.vo.nextCheckDate.substr(0, 10);
            },
		},
		methods:{
			newVO : newVO,

			doShowEquipmentTypeModal: function(){
				this.selectModel.equipmentTypeSelectModel.visible = true;
			},
			doSaveEquipmentType: function(data){
				this.mainModel.vo.equipmentType = data[0];
			},

			doShowEquipmentTypeSelectModal : function() {
				this.selectModel.equipmentTypeSelectModel.visible = true;
			},
			doSaveEquipmentType : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.equipmentType = selectedDatas[0];
				}
			},
			doClearInput:function(){
				this.mainModel.vo.ownerId = "";
				//this.mainModel.vo.user = {id:null,name:null};
			},
			doShowUserSelectModal:function(param){
				if (param === 1) {
                	return this.mainModel.showUsersSelectModal = true;
				}
				this.mainModel.showUserSelectModal = true;
			},
			doSaveCheckItem : function(data) {
				if (data) {
					var _this = this;
					api.saveCheckItem({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.checkitemTable);
					});
				}
			},
			doSaveUser:function(selectedDatas){
				if (selectedDatas) {
					var user = selectedDatas[0];
					this.mainModel.vo.ownerId = user.id;
                    this.mainModel.vo.user.id = user.id;
                    this.mainModel.vo.user.name = user.name;
	
				}
			},
            doSaveUsers: function (rows) {
				var users = this.mainModel.vo.notifyUsers || [];
				var existIds = _.pluck(users, "id");
				var newUsers = _.map(rows, function (row) {
					return {
						id: row.id,
						name: row.name
					}
                });
				newUsers = _.filter(newUsers, function (item) {
					return !_.includes(existIds, item.id)
                });
                this.mainModel.vo.notifyUsers = users.concat(newUsers);
            },
			doUpdateCheckItem : function(data) {
				if (data) {
					var _this = this;
					api.updateCheckItem({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.checkitemTable);
					});
				}
			},
			doRemoveCheckItems : function(item) {
				var _this = this;
				var data = item.entry.data;
				api.removeCheckItems({id : this.mainModel.vo.id}, [{id : data.id}]).then(function() {
					_this.$refs.checkitemTable.doRefresh();
				});
			},
			doShowEquipmentItemFormModal4Update : function(param) {
				this.formModel.equipmentItemFormModel.show = true;
				this.$refs.equipmentitemFormModal.init("update", {id: this.mainModel.vo.id, equipmentItemId: param.entry.data.id});
			},
			doShowEquipmentItemFormModal4Create : function(param) {
				this.formModel.equipmentItemFormModel.show = true;
				this.$refs.equipmentitemFormModal.init("create");
			},
			doSaveEquipmentItem : function(data) {
				if (data) {
					var _this = this;
					api.saveEquipmentItem({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.equipmentitemTable);
					});
				}
			},
			doUpdateEquipmentItem : function(data) {
				if (data) {
					var _this = this;
					api.updateEquipmentItem({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.equipmentitemTable);
					});
				}
			},
			doRemoveEquipmentItems : function(item) {
				var _this = this;
				var data = item.entry.data;
                LIB.Modal.confirm({
                    title: '删除当前数据?',
                    onOk: function() {
                        api.removeEquipmentItems({id : _this.mainModel.vo.id}, [{id : data.id}]).then(function() {
                            _this.$refs.equipmentitemTable.doRefresh();
                        });
                    }
                });
			},
			afterInitData : function() {
				//this.$refs.checkitemTable.doQuery({id : this.mainModel.vo.id});
				this.$refs.equipmentitemTable.doQuery({id : this.mainModel.vo.id});
				this.$refs.poolTable.doQuery({id : this.mainModel.vo.id});
				this.$refs.riskidentificationTable.doQuery({id : this.mainModel.vo.id});
			},
			beforeInit : function() {
				this.mainModel.isReadOnly = true;
				//this.$refs.checkitemTable.doClearData();
				this.$refs.equipmentitemTable.doClearData();
				this.$refs.poolTable.doClearData();
				this.$refs.riskidentificationTable.doClearData();

				var path = this.$route.path;
				//临时用这个区分西部管道
				if(path === '/riskAssessment/equip/equipment' || path === '/basicSetting/basicFile/xbgd/equipment'){
					this.isXBGDRiskAssessment = true;
				}else{
					this.isXBGDRiskAssessment = false;
				}
			},
			beforeDoSave:function() {
				var _this = this;
				if (parseInt(_this.mainModel.vo.warranty) < 0) {
					this.mainModel.vo.warranty = null;
					LIB.Msg.warning("保修期月份不能为负数");
					return false;
				}
			},
            buildSaveData: function () {
                var _intValue = {};
                if(!this.mainModel.vo.warranty) {
                    _intValue.warranty_empty = 1;
                }
                if(!_.isEmpty(_intValue)) {
                    this.mainModel.vo["criteria"] = {
                        intValue: _intValue
                    };
                }
                if (this.mainModel.vo.nextCheckDate && this.mainModel.vo.nextCheckDate.length === 10) {
                	this.mainModel.vo.nextCheckDate += ' 00:00:00';
				}
                return this.mainModel.vo;
            },
            doShowDominationAreaSelectModal: function () {
				if(this.mainModel.isReadOnly) {
					return;
				}
                if(!this.mainModel.vo.orgId) {
                    return LIB.Msg.warning("请先选中所属部门");
                }
                this.selectModel.dominationAreaSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
                this.selectModel.dominationAreaSelectModel.visible = true;
            },
            doSaveDominationArea: function (selectedDatas) {
                this.mainModel.vo.dominationArea = selectedDatas[0];
            },
			_getTypeList: function () {
				var _this = this;
				api.getTypeList().then(function (res) {
					_this.typeList = res.data;
                })
            },
			doAddRiskIdentification: function(){
				var router = LIB.ctxPath("/html/main.html#!");
				var routerPart = "/riskAssessment/businessFiles/riskIdentification?bizType=2&keepUrlParam=true&method=doAdd&equipmentTypeId="+this.mainModel.vo.equipmentType.id;
				window.open(router + routerPart);
			}

		},
		events : {
		},
        init: function () {
            this.$api = api;
        },
		created: function () {
			this._getTypeList();
        }
	});

	return detail;
});