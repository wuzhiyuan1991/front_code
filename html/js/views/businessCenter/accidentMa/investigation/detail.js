define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
			id : null,
			//唯一标识
			code : null,
			//作业类别 1:勘探,2:钻井,3:工程,4:其他
			jobClass : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//所属公司id
			compId : null,
			//所属部门id
			orgId : null,
			//事故类型 1:死亡,2:误工伤害,3:工作受限或转移,4:可记录事故,5:简单医疗处理,6:火灾,7:财产损失,8:溢油,9:气体泄漏,10:未遂事故,11:其他
			accidentType : null,
			//详细说明
			specify : null,
			//事件背景及事件发生经过的详细描述
			details : null,
			//直接原因
			immediateCause : null,
			//整改行动
			rectification : null,
			//系统原因
			systemReason : null,
			accidentId: null,
			//事故信息
			accident : {
				id : null,
				compId: null,
				orgId: null,
				//卡票名称
				name : null,
				//发生时间
				accidentTime : null,
				//所属公司id
				compId : null,
				//事故简要经过
				description : null,
				//事故单位负责人
				unitPrincipal : {id:'', name:'', mobile:''},
				//事故现场负责人
				scenePrincipal : {id:'', name:'', mobile:''},
			},
			//调查人
			investigators : [],
		}
	};
	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:"补充信息",
			
			//验证规则
	        rules:{
				"code" : [LIB.formRuleMgr.require("报告编码"),
						  LIB.formRuleMgr.length(100)
				],
				"jobClass" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("作业类别")),
				"accidentType" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("事故类型")),
				"specify" : [LIB.formRuleMgr.require("详细说明"),
						  LIB.formRuleMgr.length(65535)
				],
				"details" : [LIB.formRuleMgr.length(65535)],
				"immediateCause" : [LIB.formRuleMgr.length(65535)],
				"rectification" : [LIB.formRuleMgr.length(65535)],
				"systemReason" : [LIB.formRuleMgr.length(65535)],
	        }
		},
		tableModel : {
			investigatorTableModel : LIB.Opts.extendDetailTableOpt({
				url : "investigation/investigators/list/{curPage}/{pageSize}",
				columns : [
					{
						title: "调查人",
						fieldName: "username",
						width: 200
					},
					_.extend(_.extend({}, LIB.tableMgr.column.company), {filterType: null}),
					_.extend(_.extend({}, LIB.tableMgr.column.dept), {filterType: null}),
					{
						title: "手机",
						fieldName: "mobile",
						width: 220
					}, {
					title : "",
					fieldType : "tool",
					toolType : "del"
				}]
			}),
		},
		formModel : {
		},
		selectModel : {
			investigatorSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},
		showEditBtn:{
			details: true,
			immediateCause: true,
			systemReason: true,
			rectification: true,
		},

		fileModel:{
			file : {
				cfg: {
					params: {
						recordId: null,
						dataType: 'AD1', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
						fileType: 'AD'    // 文件类型标识，需要根据数据库的注释进行对应的修改
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
						dataType: 'AD2', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
						fileType: 'AD'    // 文件类型标识，需要根据数据库的注释进行对应的修改
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
						dataType: 'AD3', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
						fileType: 'AD'    // 文件类型标识，需要根据数据库的注释进行对应的修改
					},
					filters: {
						max_file_size: '10mb',
						mime_types: [{title: "files", extensions: "mp4,avi,flv,3gp"}]
					}
				},
				data : []
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
			"userSelectModal":userSelectModal,
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowInvestigatorSelectModal : function() {
				this.selectModel.investigatorSelectModel.visible = true;
				//this.selectModel.investigatorSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveInvestigators : function(selectedDatas) {
				if (selectedDatas) {
					dataModel.mainModel.vo.investigators = selectedDatas;
					var param = _.map(selectedDatas, function(data){return {id : data.id}});
					var _this = this;
					api.saveInvestigators({id : dataModel.mainModel.vo.id}, param).then(function() {
						_this.refreshTableData(_this.$refs.investigatorTable);
					});
				}
			},
			buildSaveData: function() {
				var vo = _.cloneDeep(this.mainModel.vo);
				vo.accident = {id : vo.accident.id};
				return vo;
			},
			doSaveText: function(key) {
				this.showEditBtn[key] = !this.showEditBtn[key];
				var _this = this;
				var param = {};
				param.id = this.mainModel.vo.id;
				param.orgId = this.mainModel.vo.orgId;
				param[key] = this.mainModel.vo[key];
				api.update(param).then(function() {
					_this.$dispatch("ev_dtUpdate");
				});
			},
			doRemoveInvestigators : function(item) {
				var _this = this;
				var data = item.entry.data;
				api.removeInvestigators({id : this.mainModel.vo.id}, [{id : data.id}]).then(function() {
					_this.$refs.investigatorTable.doRefresh();
				});
			},
			afterInit: function() {
				if (this.mainModel.opType === "create" && !!this.$route.query.accidentId) {
					var _this = this;
					api.getAccident({id:this.$route.query.accidentId}).then(function(res){
						if(res.data){
							_.deepExtend(_this.mainModel.vo.accident, res.data);
							_this.mainModel.vo.compId = res.data.compId;
							_this.mainModel.vo.orgId = res.data.orgId;
						}
					});
				}
			},
			afterInitData : function() {
				var _this = this;
				api.getAccident({id:this.mainModel.vo.accidentId}).then(function(res){
					if(res.data){
						_.deepExtend(_this.mainModel.vo.accident, res.data);
					}
				});
				this.$refs.investigatorTable.doQuery({id : this.mainModel.vo.id});
			},
			beforeInit : function() {
				this.$refs.investigatorTable.doClearData();
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