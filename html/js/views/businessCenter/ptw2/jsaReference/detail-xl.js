define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	var ptwJsaReferenceDetailFormModal = require("componentsEx/formModal/ptwJsaReferenceDetailFormModal");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");

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
			//分析人员，可以以逗号或者是其他字符分割
			analysePerson : null,
			//公司Id
			compId : null,
			//部门Id
			orgId : null,
			//步骤分析
			ptwJsaReferenceDetails : [],
			leaderUsers:[],
			teamUsers:[]
		}
	};
	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:"",
			
			//验证规则
	        rules:{
				"code" : [LIB.formRuleMgr.length(255)],
				"disable" :LIB.formRuleMgr.require("状态"),
				"taskContent" : [LIB.formRuleMgr.require("作业内容"),
						  LIB.formRuleMgr.length(255)
				],
				"compId" : [LIB.formRuleMgr.require("公司")],
				"orgId" : [LIB.formRuleMgr.length(10)],
	        }
		},
		tableModel : {
			ptwJsaReferenceDetailTableModel : LIB.Opts.extendDetailTableOpt({
				url : "ptwjsareference/ptwjsareferencedetails/list/{curPage}/{pageSize}?criteria.orderValue.fieldName=orderNo&criteria.orderValue.orderType=0",
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
			ptwJsaReferenceDetailFormModel : {
				show : false,
				hiddenFields : ["jsaReferenceId"],
				queryUrl : "ptwjsareference/{id}/ptwjsareferencedetail/{ptwJsaReferenceDetailId}"
			},
		},
		cardModel : {
			ptwJsaReferenceDetailCardModel : {
				showContent : true
			},
		},
		selectModel : {
			leaderUserSelectModel: {
				visible: false
			},
			teamUserSelectModel: {
				visible: false
			},
		},
		beforeValues: [],
		afterValues: [],
		middleValues: [],
		fileModel:{
			default: {
				cfg: {
					params: {
						recordId: null,
						dataType: 'JSAR1', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
						fileType: 'JSAR'    // 文件类型标识，需要根据数据库的注释进行对应的修改
					}
				},
				data: []
			}
		}
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
			"ptwjsareferencedetailFormModal":ptwJsaReferenceDetailFormModal,
			"leaderUserSelectModal":userSelectModal,
			"teamUserSelectModal":userSelectModal,
        },
		computed: {
			tableTools: function () {
				if (this.mainModel.vo.id && this.mainModel.isReadOnly) {
					return ['del', 'update', 'move'];
				}
				return []
			},
			disableButtonStyle: function () {
				return {
					"backgroundColor": this.mainModel.vo.disable === '0' ? 'green' : 'red'
				}
			},
			disableButtonTitle: function () {
				return this.mainModel.vo.disable === '0' ? '已启用' : '已停用';
			},
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowPtwJsaReferenceDetailFormModal4Update : function(param) {
				this.formModel.ptwJsaReferenceDetailFormModel.show = true;
				this.$refs.ptwjsareferencedetailFormModal.init("update", {id: this.mainModel.vo.id, ptwJsaReferenceDetailId: param.id});
			},
			doShowPtwJsaReferenceDetailFormModal4Create : function(phase) {
				this.formModel.ptwJsaReferenceDetailFormModel.show = true;
				this.$refs.ptwjsareferencedetailFormModal.init("create", {phase: phase});
			},
			doSavePtwJsaReferenceDetail : function(data) {
				if (data) {
					var _this = this;
					api.savePtwJsaReferenceDetail({id : this.mainModel.vo.id}, data).then(function() {
						_this._queryPtwJsaDetails();
					});
				}
			},
			doUpdatePtwJsaReferenceDetail : function(data) {
				if (data) {
					var _this = this;
					api.updatePtwJsaReferenceDetail({id : this.mainModel.vo.id}, data).then(function() {
						_this._queryPtwJsaDetails();
					});
				}
			},
			doRemovePtwJsaReferenceDetail : function(item) {
				var _this = this;
				var data = item;
				LIB.Modal.confirm({
					title: '删除当前数据?',
					onOk: function () {
						api.removePtwJsaReferenceDetails({id : _this.mainModel.vo.id}, [{id : data.id}]).then(function() {
							_this._queryPtwJsaDetails();
						});
					}
				});
			},
			doMovePtwJsaReferenceDetail : function(item) {
				var _this = this;
				var data = item.item;
				var param = {
					id : data.id,
					jsaReferenceId : dataModel.mainModel.vo.id,
					phase:data.phase
				};
				_.set(param, "criteria.intValue.offset", item.offset);
				api.movePtwJsaReferenceDetails({id : this.mainModel.vo.id}, param).then(function() {
					_this._queryPtwJsaDetails();
				});
			},
			_queryPtwJsaDetails: function () {
				var _this = this;
				api.queryPtwJsaReferenceDetails({id: this.mainModel.vo.id}).then(function (res) {
					var data = res.data;
					_this._normalizeTableValues(data);
				})
			},
			afterInitData : function() {
				var _vo = this.mainModel.vo;
				if (LIB.user.orgId !== '9999999999' && this.mainModel.action === 'copy') {
					_vo.compId = LIB.user.compId;
					_vo.orgId = LIB.user.orgId;
				}
				this._queryPtwJsaDetails();
			},
			beforeInit : function() {
				this.beforeValues = [];
				this.middleValues = [];
				this.afterValues = [];
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
			beforeDoSave:function () {
				this.mainModel.vo.orgId = this.mainModel.vo.compId;
			},
			doExportDetail : function(){
				var id = this.mainModel.vo.id;
				LIB.Modal.confirm({
					title: '导出数据?',
					onOk: function () {
						window.open('/ptwjsareference/' + id + '/ptwjsareferencedetails/export');
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
		},
		events : {
		},
    	init: function(){
        	this.$api = api;
        }
	});

	return detail;
});