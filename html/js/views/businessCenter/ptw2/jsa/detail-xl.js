define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	var ptwJsaDetailFormModal = require("componentsEx/formModal/ptwJsaDetailFormModal");
	var ptwworkcardSelectTableModal  = require("componentsEx/selectTableModal/ptwWorkCardSelectModal");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	var contractorSelectModal = require("componentsEx/selectTableModal/contractorSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//编码
			code : null,
			//分析小组组长
			analyseLeader : null,
			//启用/禁用 0:启用,1:禁用
			disable : "1",
			//作业内容
			taskContent : null,
			//作业日期
			workDate : null,
			//分析人员，可以以逗号或者是其他字符分割
			analysePerson : null,
			//公司Id
			compId : null,
			//部门Id
			orgId : null,
			//施工单位，可手填
			construction : null,
			//是否有特种作业人员资质证明 0:否,1:是
			hasQualification : null,
			//是否有相关操作规程 0:否,1:是
			hasSpecification : null,
			//是否承包商作业 0:否,1:是
			isContractor : null,
			//是否为交叉作业 0:否,1:是
			isCrossOperat : null,
			//是否为新的工作任务 0:已做过的任务,1:新任务
			isNewTask : null,
			//是否需要许可证 0:否,1:是
			isPermitRequired : null,
			//关联的档案类型
			relType : null,
			//备注
			remark : null,
			//许可证编号
			taskLicense : null,
			//步骤分析
			ptwJsaDetails : [],
			isSubmit: "0",
			isShare: "0",
			name : null,
			leaderUsers:[],
			teamUsers:[],
			type:'1',
			constructionOrgId:null,
			constructionOrgName:null
		}
	};
	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			workCard:{id:"",code:""},
			opType : 'view',
			isReadOnly : true,
			title:"",
			isEnablePtwWporCard: false,
			//验证规则
	        rules:{
				"code": [LIB.formRuleMgr.length(255)],
				// "analysePerson": [LIB.formRuleMgr.require("分析人员"),
				// 	LIB.formRuleMgr.length(100)
				// ],
				"workDate": [LIB.formRuleMgr.require("作业日期")],
				"disable": LIB.formRuleMgr.require("状态"),
				// "analyseLeader": [LIB.formRuleMgr.require("分析小组组长"),
				// 	LIB.formRuleMgr.length(100)
				// ],
				"taskContent": [LIB.formRuleMgr.require("作业内容"),
					LIB.formRuleMgr.length(255)
				],
				"compId": [LIB.formRuleMgr.require("公司")],
				"orgId": [LIB.formRuleMgr.require("部门")],
				// "construction": [LIB.formRuleMgr.require("作业单位"), LIB.formRuleMgr.length(100)],
				"contractor": [LIB.formRuleMgr.length(0)],
				"crossTask": [LIB.formRuleMgr.length(0)],
				"newTask": [LIB.formRuleMgr.length(0)],
				"qualification": [LIB.formRuleMgr.length(0)],
				"specification": [LIB.formRuleMgr.length(0)],
				"taskLicense": [LIB.formRuleMgr.length(50)],
				"name":[LIB.formRuleMgr.require("名称"),
					LIB.formRuleMgr.length(50)],
				"leaderUsers": [
					{   required: true,
						validator: function (rule, value, callback) {
							if(_.isEmpty(value)) {
								return callback(new Error('分析小组组长'));
							}
							return callback();
						}
					}
				],
				"teamUsers": [
					{   required: true,
						validator: function (rule, value, callback) {
							if(_.isEmpty(value)) {
								return callback(new Error('分析人员'));
							}
							return callback();
						}
					}
				],
				"constructionOrgId":[
					LIB.formRuleMgr.require("作业单位")
				],
				type:[
					LIB.formRuleMgr.require("作业单位类型")
				]
	        }
		},
		tableModel : {
			ptwJsaDetailTableModel : LIB.Opts.extendDetailTableOpt({
				url : "ptwjsamaster/ptwjsadetails/list/{curPage}/{pageSize}?criteria.orderValue.fieldName=orderNo&criteria.orderValue.orderType=0",
				columns : [
					{
						title: "步骤",
						fieldName: "stepDesc",
						width: "200px"
					},
					{
						title: "危害描述",
						// width: "200px",
						fieldName: "harmDesc"
					},
					{
						title: "后果及影响",
						// width: "180px",
						fieldName: "result"
					},
					{
						title: "风险值",
						width: "80px",
						fieldName: "riskScore",
						render: function (data) {
							var riskModel = data.riskModel;
							if (!riskModel) {
								return ""
							}
							riskModel = JSON.parse(riskModel);
							return riskModel.result;
						}
					},
					{
						title: "现有控制措施",
						// width: "180px",
						fieldName: "currentControl"
					},
					{
						title: "建议改进措施",
						// width: "180px",
						fieldName: "improveControl"
					},
					{
						title: "残余风险是否可接受",
						width: "126px",
						fieldName: "riskAccept",
						render: function (data) {
							if(data.riskAccept != undefined) {
								var text = data.riskAccept === '1' ? '是' : '否';
								return '<div class="text-center">' + text + '</div>'
							}
							return "";
						}
					},
					]
			}),
		},
		formModel : {
			ptwJsaDetailFormModel : {
				show : false,
				hiddenFields : ["jsaMasterId"],
				queryUrl : "ptwjsamaster/{id}/ptwjsadetail/{ptwJsaDetailId}"
			},
		},
		cardModel : {
			ptwJsaDetailCardModel : {
				showContent : true
			},
		},
		selectModel : {
			ptwWorkCardSelectModel : {
				visible:false,
				filterData:{orgId : null}

			},
			leaderUserSelectModel: {
				visible: false
			},
			teamUserSelectModel: {
				visible: false
			},
			contractorSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},
		beforeValues: [],
		afterValues: [],
		middleValues: [],
		fileModel: {
			default: {
				cfg: {
					params: {
						recordId: null,
						dataType: 'JSA1', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
						fileType: 'JSA'    // 文件类型标识，需要根据数据库的注释进行对应的修改
					}
				},
				data: []
			}
		},
		//是否有特种作业人员资质证明
		hasQualification : false,
		//是否有相关操作规程
		hasSpecification : false,
		//是否承包商作业
		isContractor : false,
		//是否为交叉作业
		isCrossOperat : false,
		//是否为新的工作任务
		isNewTask : false,
		//是否需要许可证
		isPermitRequired : false,
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
		components : {
			"ptwjsadetailFormModal":ptwJsaDetailFormModal,
			"ptwworkcardSelectTableModal":ptwworkcardSelectTableModal,
			"leaderUserSelectModal":userSelectModal,
			"teamUserSelectModal":userSelectModal,
			"contractorSelectModal":contractorSelectModal,
        },
		computed: {
			tableTools: function () {
				if (this.mainModel.vo.id && this.mainModel.isReadOnly) {
					return ['del', 'update', 'move'];
				}
				return []
			},
			workDateText: function () {
				return this.mainModel.vo.workDate.substr(0, 10);
			},
			shareIconStyle: function () {
				return {
					"backgroundColor": this.mainModel.vo.isShare === '0' ? '#999' : 'green'
				}
			},
			shareIconTitle: function () {
				return this.mainModel.vo.isShare === '0' ? '未分享' : '已分享';
			},
			submitButtonStyle: function () {
				return {
					"backgroundColor": this.mainModel.vo.isSubmit === '0' ? 'red' : 'green'
				}
			},
			submitButtonTitle: function () {
				return this.mainModel.vo.isSubmit === '0' ? '未提交' : '已提交';
			},
		},
		data:function(){
			return dataModel;
		},
		watch: {
			"isNewTask": function (val) {
				this.mainModel.vo.isNewTask = val ? 1 : 0;
			},
			"isCrossOperat": function (val) {
				this.mainModel.vo.isCrossOperat = val ? 1 : 0;
			},
			"isContractor": function (val) {
				this.mainModel.vo.isContractor = val ? 1 : 0;
			},
			"hasSpecification": function (val) {
				this.mainModel.vo.hasSpecification = val ? 1 : 0;
			},
			"hasQualification": function (val) {
				this.mainModel.vo.hasQualification = val ? 1 : 0;
			}
		},
		methods:{
			newVO : newVO,
			buildSaveData: function () {
				var workDate = this.mainModel.vo.workDate;
				return _.assign({}, this.mainModel.vo, {workDate: workDate + " 00:00:00"});
			},
			doShowPtwJsaDetailFormModal4Update : function(param) {
				this.formModel.ptwJsaDetailFormModel.show = true;
				this.$refs.ptwjsadetailFormModal.init("update", {id: this.mainModel.vo.id, ptwJsaDetailId: param.id});
			},
			doShowPtwJsaDetailFormModal4Create : function(phase) {
				this.formModel.ptwJsaDetailFormModel.show = true;
				this.$refs.ptwjsadetailFormModal.init("create", {phase: phase});
			},
			doSavePtwJsaDetail : function(data) {
				if (data) {
					var _this = this;
					api.savePtwJsaDetail({id : this.mainModel.vo.id}, data).then(function() {
						_this._queryPtwJsaDetails();
					});
				}
			},
			doUpdatePtwJsaDetail : function(data) {
				if (data) {
					var _this = this;
					api.updatePtwJsaDetail({id : this.mainModel.vo.id}, data).then(function() {
						_this._queryPtwJsaDetails();
					});
				}
			},
			doRemovePtwJsaDetail : function(item) {
				var _this = this;
				var data = item;
				LIB.Modal.confirm({
					title: '删除当前数据?',
					onOk: function () {
						api.removePtwJsaDetails({id : _this.mainModel.vo.id}, [{id : data.id}]).then(function() {
							_this._queryPtwJsaDetails();
						});
					}
				});
			},
			doMovePtwJsaDetail : function(item) {
				var _this = this;
				var data = item.item;
				var param = {
					id : data.id,
					jsaMasterId : dataModel.mainModel.vo.id,
					phase:data.phase
				};
				_.set(param, "criteria.intValue.offset", item.offset);
				api.movePtwJsaDetails({id : this.mainModel.vo.id}, param).then(function() {
					_this._queryPtwJsaDetails();
				});
			},
			doAdd4Copy: function() {
				var data = _.cloneDeep(this.mainModel.vo);
				// if(data.orgId != LIB.user.orgId) {
				// 	LIB.Msg.warning("当前登录人不允许复制使用其他部门的JSA记录");
				// 	return;
				// }
				var opts = { opType: "update", action: "copy" };
				this.init("update", data.id, data, opts)
			},
			_queryPtwJsaDetails: function () {
				var _this = this;
				api.queryPtwJsaDetails({id: this.mainModel.vo.id}).then(function (res) {
					var data = res.data;
					_this._normalizeTableValues(data);
				})
			},
			_normalizeTableValues: function (data) {
				this.beforeValues = _.sortBy(_.filter(data, function (v) {
					return v.phase === '0'
				}), "orderNo");
				this.middleValues = _.sortBy(_.filter(data, function (v) {
					return v.phase === '1'
				}), "orderNo");
				this.afterValues = _.sortBy(_.filter(data, function (v) {
					return v.phase === '2'
				}), "orderNo");
			},
			afterInitData : function() {
				var _vo = this.mainModel.vo;

				this._queryPtwJsaDetails();
				this.isNewTask = this.mainModel.vo.isNewTask == 1;
				this.isCrossOperat = this.mainModel.vo.isCrossOperat == 1;
				this.isContractor = this.mainModel.vo.isContractor == 1;
				this.hasSpecification = this.mainModel.vo.hasSpecification == 1;
				this.hasQualification = this.mainModel.vo.hasQualification == 1;
				this.mainModel.workCard.code = this.mainModel.vo.taskLicense;

                if (LIB.user.orgId !== '9999999999' && this.mainModel.action === 'copy') {
                    _vo.compId = LIB.user.compId;
                    _vo.orgId = LIB.user.orgId;
                }
			},
			beforeInit : function() {
                this.mainModel.vo = this.newVO();
				this.beforeValues = [];
				this.middleValues = [];
				this.afterValues = [];
				this.isNewTask = false;
				this.isCrossOperat = false;
				this.isContractor = false;
				this.hasSpecification = false;
				this.hasQualification = false;
				this.mainModel.workCard = {id:"",code:""};
			},
			doExportDetail : function(){
				var id = this.mainModel.vo.id;
				LIB.Modal.confirm({
					title: '导出数据?',
					onOk: function () {
						window.open('/ptwjsamaster/' + id + '/ptwjsadetails/export');
					}
				});
			},
			doShare: function() {
				// if (!this.hasAuth('share')) {
				// 	return LIB.Msg.warning("权限不足");
				// }
				var _this = this;
				var data = _this.mainModel.vo;
				var params = {
					id: data.id,
					isShare: data.isShare === "0" ? "1" : "0"
				};
				if (data.isSubmit === "0") {
					return LIB.Msg.warning("该数据未提交,不能进行分享操作");
				}
				api.updateShare(params).then(function (res) {
					data.isShare = (data.isShare === "0") ? "1" : "0";
					LIB.Msg.info((data.isShare === "0") ? "未分享" : "已分享");
					_this.$dispatch("ev_dtUpdate");
				});
			},
			doSubmit:function () {
				var _this = this;
				var data = _this.mainModel.vo;
				var params = {
					id: data.id,
					isSubmit: data.isSubmit === "0" ? "1" : "0"
				};
				api.updateSubmit(params).then(function (res) {
					data.isSubmit = (data.isSubmit === "0") ? "1" : "0";
					LIB.Msg.info((data.isSubmit === "0") ? "未提交" : "已提交");
					_this.$dispatch("ev_dtUpdate");
				});
			},
			doShowPtwWorkCardSelectModal : function() {
				this.selectModel.ptwWorkCardSelectModel.visible = true;
				//this.selectModel.ptwWorkCardSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSavePtwWorkCard : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.workCard = selectedDatas[0];
					this.mainModel.vo.taskLicense = selectedDatas[0].code;
				}
			},
			doClearInput:function(){
				this.mainModel.vo.taskLicense = '';
			},
			doDelete: function() {
				//当beforeDoDelete方法明确返回false时,不继续执行doDelete方法, 返回undefine和true都会执行后续方法
				if (this.beforeDoDelete() === false) {
					return;
				}
				var _vo = this.mainModel.vo;
				var _this = this;
				LIB.Modal.confirm({
					title: '删除当前数据?',
					onOk: function() {
						_this.$api.remove(null, {id:_vo.id, orgId: _vo.orgId}).then(function() {
							_this.afterDoDelete(_vo);
							_this.$dispatch("ev_dtDelete");
							LIB.Msg.info("删除成功");
						});
					}
				});
			},
			doShowLeaderUserSelectModal: function () {
				this.selectModel.leaderUserSelectModel.visible = true;
			},
			doShowTeamUserSelectModal: function () {
				this.selectModel.teamUserSelectModel.visible = true;
			},
			doRemoveLeaderUsers: function (index) {
				this.mainModel.vo.leaderUsers.splice(index, 1);
			},
			doRemoveTeamUsers: function (index) {
				this.mainModel.vo.teamUsers.splice(index, 1);
			},
			doSaveLeaderUsers: function (selectedDatas) {
				var _this = this;
				if (selectedDatas) {
					//两数组去重
					if (_this.mainModel.vo.leaderUsers.length > 0) {
						_.each(_this.mainModel.vo.leaderUsers, function (data) {
							_.each(selectedDatas, function (item, index) {
								if (item.id == data.id) {
									selectedDatas.splice(index, 1);
									return false
								}
							})
						})
					}
					_this.mainModel.vo.leaderUsers = _this.mainModel.vo.leaderUsers.concat(selectedDatas);
				}
			},
			doSaveTeamUsers: function (selectedDatas) {
				var _this = this;
				if (selectedDatas) {
					//两数组去重
					if (_this.mainModel.vo.teamUsers.length > 0) {
						_.each(_this.mainModel.vo.teamUsers, function (data) {
							_.each(selectedDatas, function (item, index) {
								if (item.id == data.id) {
									selectedDatas.splice(index, 1);
									return false
								}
							})
						})
					}
					_this.mainModel.vo.teamUsers = _this.mainModel.vo.teamUsers.concat(selectedDatas);
				}
			},
			doShowContractorSelectModal : function() {
				this.selectModel.contractorSelectModel.visible = true;
			},
			doSaveContractor : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.constructionOrgId = selectedDatas[0].id;
					this.mainModel.vo.constructionOrgName= selectedDatas[0].deptName;
				}
			},
			changeType:function () {
				if (this.mainModel.action != 'copy') {
					this.mainModel.vo.constructionOrgId = null;
					this.mainModel.vo.constructionOrgName = null;
				}
			}
		},
		events : {
		},
    	init: function(){
        	this.$api = api;
        },
		ready: function(){
			if(LIB.getBusinessSetByNamePath("common.enablePtwRecord").result === '2'){
				this.mainModel.isEnablePtwWporCard = true;
			}
		}
	});

	return detail;
});