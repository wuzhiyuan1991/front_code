define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	var dominationAreaSelectModal = require("componentsEx/selectTableModal/dominationAreaSelectModal");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");

	var now = new Date().Format("yyyy-MM-dd hh:mm:ss");
	var operationLevelRiskLevel = {
		"3":"10",
		"2":"20",
		"1":"30",
	}
	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//状态0-待执行；1-已结束
			status : "0",
			//禁用标识 0:未禁用,1:已禁用
			disable : "0",
			//风险研判内容
			content : null,
			//作业区域
			operationArea : null,
			//作业结束时间
			operationEndDate : null,
			//作业名称
			operationName : null,
			//作业开始时间
			operationStartDate : null,
			//作业分类
			operationType : null,
			compId:"",
			orgId:"",
			operationLevel:"3",
			riskLevel:null,
			// dominationArea: {id: '', name: ''},
			changeReason:null,
			iraRiskJudgmentOptypeVos:[],
			dominationAreas:[],
			supervisorsId:null,
			supervisorsName:null,
			responsibleId:null,
			responsibleName:null,
			directOrgName:null,
			supervisors:{id:"",name:""},
			responsible:{id:"",name:""},
			controls:null
		}
	};
	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			optypes:[],
			opType : 'view',
			isReadOnly : true,
			title:"",
			operationLevelList:[{id:"1",name:'一级'},{id:"2",name:'二级'},{id:"3",name:'三级'}],
			//riskLevelList:[{id:"1",name:'高'},{id:"2",name:'中'},{id:"3",name:'低'}],
			//验证规则
	        rules:{
				"status" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.require("状态")),
				"disable" :LIB.formRuleMgr.require("状态"),
				"content" : [LIB.formRuleMgr.length(500), LIB.formRuleMgr.require("存在风险")],
				"controls": [LIB.formRuleMgr.length(500), LIB.formRuleMgr.require("管控措施")],
				//"operationArea" : [LIB.formRuleMgr.length(100), LIB.formRuleMgr.require("作业区域")],
				// "dominationArea.id": [
				// 	LIB.formRuleMgr.require("作业区域")
				// ],
				"operationEndDate" : [LIB.formRuleMgr.require("作业结束时间"),
					LIB.formRuleMgr.length(),
					{
						validator: function (rule, value, callback) {
							var currentDate = new Date().Format("yyyy-MM-dd 00:00:00");
							if (value < currentDate) {
								return callback(new Error('作业结束时间必须大于当前时间'))
							}
							if (dataModel.mainModel.vo.operationStartDate && value < dataModel.mainModel.vo.operationStartDate) {
								return callback(new Error('作业结束时间必须大于作业开始时间'))
							}
							return callback();
						}
					}],
				"operationName" : [LIB.formRuleMgr.length(100), LIB.formRuleMgr.require("作业名称")],
				"operationStartDate" : [LIB.formRuleMgr.allowStrEmpty, LIB.formRuleMgr.require("作业开始时间")],
				"operationType" : [LIB.formRuleMgr.require("作业分类")],
				"operationLevel":[LIB.formRuleMgr.require("作业级别")],
				"orgId":[{required: true, message: '请选择所属部门'}, LIB.formRuleMgr.length()],
				"compId":[{required: true, message: '请选择所属公司'}, LIB.formRuleMgr.length()],
				"riskLevel":[LIB.formRuleMgr.allowIntEmpty],
				"changeReason" : [LIB.formRuleMgr.length(500), LIB.formRuleMgr.require("变更原因")],
				"dominationAreas":[{type:'array', required:true, message: '作业区域'}],
				"iraRiskJudgmentOptypeVos":[{type:'array', required:true, message: '风险管控单位'}],
	        }
		},

		selectModel: {
			dominationAreaSelectModel: {
				visible: false,
				filterData: {orgId: null}
			},
			supervisorsUserSelectModel:{
				visible: false,
			},
			responsibleUserSelectModel:{
				visible: false,
			}
		},
		tableModel:{
			changeRecordTableModel : LIB.Opts.extendDetailTableOpt({
				url : "irariskjudgment/changeRecords/list/{curPage}/{pageSize}",
				columns : [
					{
						title: "变更人",
						fieldName : "userName",
						keywordFilterName: "criteria.strValue.keyWordValue_userName",
						width:200
					},

					{
						title : "变更时间",
						fieldName : "createDate",
						keywordFilterName: "criteria.strValue.keyWordValue_createDate",
						width:200
					},
					{
						title : "变更原因",
						fieldName : "reason",
						keywordFilterName: "criteria.strValue.keyWordValue_operateName",
						'renderClass': "textarea",
					},
				],
				//defaultFilterValue: {"criteria.orderValue": {fieldName: "createDate", orderType: "1"}}
			}),
		},
		cardModel : {
			changeRecordCardModel:{
				showContent : true
			}
		},
		importProgress:{
			show: false
		},


//无需附件上传请删除此段代码
/*
		fileModel:{
			file : {
				cfg: {
					params: {
						recordId: null,
						dataType: 'XXX1', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
						fileType: 'XX'    // 文件类型标识，需要根据数据库的注释进行对应的修改
					},
					filters: {
						max_file_size: '10mb',
					},
				},
				data : []
			},
			pic : {
				cfg: {
					params: {
						recordId: null,
						dataType: 'XXX2', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
						fileType: 'XX'    // 文件类型标识，需要根据数据库的注释进行对应的修改
					},
					filters: {
						max_file_size: '10mb',
						mime_types: [{title: "files", extensions: "png,jpg,jpeg"}]
					}
				},
				data : []
			},
			video : {
				cfg: {
					params: {
						recordId: null,
						dataType: 'XXX3', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
						fileType: 'XX'    // 文件类型标识，需要根据数据库的注释进行对应的修改
					},
					filters: {
						max_file_size: '10mb',
						mime_types: [{title: "files", extensions: "mp4,avi,flv,3gp"}]
					}
				},
				data : []
			}
		}
*/


	};
	//Vue组件
	/**
	 *  请统一使用以下顺序配置Vue参数，方便codeview
	 *	 el
		 template
		 components
		 componentName
		 props
		 data
		 computed
		 watch
		 methods
			 _XXX    			//内部方法
			 doXXX 				//事件响应方法
			 beforeInit 		//初始化之前回调
			 afterInit			//初始化之后回调
			 afterInitData		//请求 查询 接口后回调
			 afterInitFileData  //请求 查询文件列表 接口后回调
			 beforeDoSave		//请求 新增/更新 接口前回调，返回false时不进行保存操作
			 afterFormValidate	//表单rule的校验通过后回调，，返回false时不进行保存操作
			 buildSaveData		//请求 新增/更新 接口前回调，重新构造接口的参数
			 afterDoSave		//请求 新增/更新 接口后回调
			 beforeDoDelete		//请求 删除 接口前回调
			 afterDoDelete		//请求 删除 接口后回调
		 events
		 vue组件声明周期方法
		 init/created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
	 **/
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth,LIB.VueMixin.detailPanel],
		template: tpl,
		components: {
			"dominationareaSelectModal": dominationAreaSelectModal,
			"userSelectModal": userSelectModal,
		},
		computed: {
			// operationLevelLabel: function () {
			// 	var _this = this;
			// 	return _.find(this.mainModel.operationLevelList, function (item) {
			// 		return item.id === _this.mainModel.vo.operationLevel;
			// 	}).name;
			// },
			// riskLevelLabel:function () {
			// 	var _this = this;
			// 	return _.find(this.mainModel.riskLevelList, function (item) {
			// 		return item.id === _this.mainModel.vo.riskLevel;
			// 	}).name;
			// },
			statusLabel:function () {
				var _this = this;
				var _vo = _this.mainModel.vo;
				if(_vo.operationStartDate != null && _vo.operationEndDate != null && _vo.status != null){
					if (_vo.status == 0 && _vo.operationStartDate < now && _vo.operationEndDate > now) {
						return LIB.getDataDic("ira_risk_judgm_status",1);
					}
					if (_vo.operationEndDate < now) {
						return LIB.getDataDic("ira_risk_judgm_status",2);
					}
				}
				return LIB.getDataDic("ira_risk_judgm_status",_vo.status);
			},
			doOperationLevel:function () {
				var _this = this;
				return _.find(this.mainModel.operationLevelList, function (item) {
					return item.id === _this.mainModel.vo.operationLevel;
				}).name;
			},
			doDominationAreaVal:function () {
				return _.pluck(this.mainModel.vo.dominationAreas, "name").join("、")
			}
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowDominationAreaSelectModal: function () {
				this.selectModel.dominationAreaSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
				this.selectModel.dominationAreaSelectModel.visible = true;
			},
			doSaveDominationArea: function (selectedDatas) {
				var _this =this;
				if (selectedDatas) {
					// this.mainModel.vo.dominationArea = selectedDatas[0];
					// this.mainModel.vo.operationArea = selectedDatas[0].id;
					if (_this.mainModel.vo.dominationAreas.length > 0) {
						_.each(_this.mainModel.vo.dominationAreas, function (data) {
							_.each(selectedDatas, function (item, index) {
								if (item.id == data.id) {
									selectedDatas.splice(index, 1);
									return false
								}
							})
						})
					}
					_this.mainModel.vo.dominationAreas = _this.mainModel.vo.dominationAreas.concat(selectedDatas);
					this.mainModel.vo.dominationAreas = _.map(this.mainModel.vo.dominationAreas, function (item) {
						return {id: item.id, name: item.name}
					})
				}
			},
			changeOperationTypes:function (nVal) {
				this.mainModel.operationLevelList = [];
				if (nVal >= 100 && nVal < 200) {
					this.mainModel.operationLevelList = [{id:"3",name:'三级'}];
				} else if (nVal >= 200 && nVal < 300) {
					this.mainModel.operationLevelList = [{id:"1",name:'一级'},{id:"2",name:'二级'},{id:"3",name:'三级'}];
				} else if (nVal >= 300 && nVal < 400) {
					this.mainModel.operationLevelList = [{id:"2",name:'二级'},{id:"3",name:'三级'}];
				}
				//默认为三级
				this.mainModel.vo.operationLevel = "3";
				if (this.mainModel.opType !== "view") {
					this.changeOperationLevels("3");
				}
			},
			changeOperationLevels:function (nVal) {
				this.mainModel.vo.riskLevel = operationLevelRiskLevel[nVal];
			},
			beforeInit : function() {
				this.mainModel.optypes = [];
				this.$refs.recordTable.doClearData();
			},
			afterInitData:function () {
				var _this = this;
				// this.changeOperationTypes(this.mainModel.vo.operationType);
				this.$refs.recordTable.doQuery({id : this.mainModel.vo.id});
				this.mainModel.optypes = [];
				if (this.mainModel.vo.iraRiskJudgmentOptypeVos) {
					_.each(this.mainModel.vo.iraRiskJudgmentOptypeVos,function(type){
						_this.mainModel.optypes.push(type.operationType);
					});
				}
				if (_this.mainModel.vo.supervisorsId && _this.mainModel.vo.supervisorsName) {
					_this.mainModel.vo.supervisors = {id:_this.mainModel.vo.supervisorsId,name:_this.mainModel.vo.supervisorsName};
				}
				if (_this.mainModel.vo.responsibleId && _this.mainModel.vo.responsibleName) {
					_this.mainModel.vo.responsible = {id:_this.mainModel.vo.responsibleId,name:_this.mainModel.vo.responsibleName};
				}
			},
			beforeDoSave:function(){
				var _this = this;
				_this.mainModel.vo.iraRiskJudgmentOptypeVos = [];
				if (this.mainModel.optypes){
					_.each(this.mainModel.optypes,function (type) {
						_this.mainModel.vo.iraRiskJudgmentOptypeVos.push({operationType:type});
					})
				}
			},
			doClearInput: function () {
				this.mainModel.vo.dominationAreas = [];
			},
			afterDoSave: function() {
				this.mainModel.vo.changeReason = null;
				this.$refs.recordTable.doQuery({id : this.mainModel.vo.id});
			},
			doShowSupervisorsSelectModel:function () {
				this.selectModel.supervisorsUserSelectModel.visible = true;
			},
			doShowResponsibleSelectModel:function () {
				this.selectModel.responsibleUserSelectModel.visible = true;
			},
			doSaveSupervisorsUser:function (selectedDatas) {
				if (selectedDatas) {
					var user = selectedDatas[0];
					this.mainModel.vo.supervisorsId = user.id;
					this.mainModel.vo.supervisorsName = user.name;
					this.mainModel.vo.supervisors = user;
				}
			},
			doSaveResponsibleUser:function (selectedDatas) {
				if (selectedDatas) {
					var user = selectedDatas[0];
					this.mainModel.vo.responsibleId = user.id;
					this.mainModel.vo.responsibleName = user.name;
					this.mainModel.vo.responsible = user;
				}
			}
		},
		events : {
		},
    	init: function(){
        	this.$api = api;
        }
	});

	return detail;
});