define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	var ptwWorkIsolationSelectModal = require("componentsEx/selectTableModal/ptwWorkIsolationSelectModal");
	var ptwWorkCardSelectModal = require("componentsEx/selectTableModal/ptwWorkCardSelectModal");
	var ptwWorkPermitSelectModal = require("componentsEx/selectTableModal/ptwWorkPermitSelectModal");
	var ptwWorkPersonnelSelectModal = require("componentsEx/selectTableModal/ptwWorkPersonnelSelectModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//编码
			code : null,
			//操作类型 1:作业预约,2:作业审核,3:填写作业票,4:能量隔离,5:作业前气体检测,6:措施落实,7:作业会签,8:作业批准,9:安全教育,10:作业中气体检测,11:作业监控,12:能量隔离解除,13:作业关闭签字,14:作业关闭
			operationType : null,
			//启用/禁用 0:启用,1:禁用
			disable : "0",
			//操作时间
			operateTime : null,
			//操作时作业状态  1:作业预约,2:待审核,3:待填报,4:待核对,5:待会签,6:待批准,7:作业中,8:待关闭,9:已取消,10:已完成,11:已否决
			workStatus : null,
			//隔离类型 1:工艺隔离,2:机械隔离,3:电气隔离,4:系统屏蔽
			isolationType : null,
			//作业结果 1:作业完成,2:作业取消,3:作业续签
			resultType : null,
			//会签类型 1:作业申请人,2:作业负责人,3:作业监护人,4:生产单位现场负责人,5:主管部门负责人,6:安全部门负责人,7:相关方负责人,8:许可批准人
			signType : null,
			//操作人
			operator : {id:'', name:''},
			//隔离信息
			workIsolation : {id:'', name:''},
			//作业票
			workCard : {id:'', name:''},
			//作业许可
			workPermit : {id:'', name:''},
			//会签信息
			workPersonnel : {id:'', name:''},
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
				"operationType" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("操作类型")),
				"disable" :LIB.formRuleMgr.require("状态"),
				"operateTime" : [LIB.formRuleMgr.require("操作时间")],
				"workStatus" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("操作时作业状态")),
				"isolationType" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"resultType" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"signType" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"operator.id" : [LIB.formRuleMgr.require("操作人")],
				"workIsolation.id" : [LIB.formRuleMgr.allowStrEmpty],
				"workCard.id" : [LIB.formRuleMgr.require("作业票")],
				"workPermit.id" : [LIB.formRuleMgr.allowStrEmpty],
				"workPersonnel.id" : [LIB.formRuleMgr.allowStrEmpty],
	        }
		},
		tableModel : {
		},
		formModel : {
		},
		cardModel : {
		},
		selectModel : {
			operatorSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			workIsolationSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			workCardSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			workPermitSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			workPersonnelSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
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
		components : {
			"userSelectModal":userSelectModal,
			"ptwworkisolationSelectModal":ptwWorkIsolationSelectModal,
			"ptwworkcardSelectModal":ptwWorkCardSelectModal,
			"ptwworkpermitSelectModal":ptwWorkPermitSelectModal,
			"ptwworkpersonnelSelectModal":ptwWorkPersonnelSelectModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowOperatorSelectModal : function() {
				this.selectModel.operatorSelectModel.visible = true;
				//this.selectModel.operatorSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveOperator : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.operator = selectedDatas[0];
				}
			},
			doShowWorkIsolationSelectModal : function() {
				this.selectModel.workIsolationSelectModel.visible = true;
				//this.selectModel.workIsolationSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveWorkIsolation : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.workIsolation = selectedDatas[0];
				}
			},
			doShowWorkCardSelectModal : function() {
				this.selectModel.workCardSelectModel.visible = true;
				//this.selectModel.workCardSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveWorkCard : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.workCard = selectedDatas[0];
				}
			},
			doShowWorkPermitSelectModal : function() {
				this.selectModel.workPermitSelectModel.visible = true;
				//this.selectModel.workPermitSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveWorkPermit : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.workPermit = selectedDatas[0];
				}
			},
			doShowWorkPersonnelSelectModal : function() {
				this.selectModel.workPersonnelSelectModel.visible = true;
				//this.selectModel.workPersonnelSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveWorkPersonnel : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.workPersonnel = selectedDatas[0];
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