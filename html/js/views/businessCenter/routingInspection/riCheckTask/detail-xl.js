define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	var riCheckPlanSelectModal = require("componentsEx/selectTableModal/riCheckPlanSelectModal");
	var riCheckTableSelectModal = require("componentsEx/selectTableModal/riCheckTableSelectModal");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//
			code : null,
			//巡检任务名称
			name : null,
			//禁用标识 0:未禁用,1:已禁用
			disable : null,
			//结束时间
			endDate : null,
			//开始时间
			startDate : null,
			//所属公司id
			compId : null,
			//所属部门id
			orgId : null,
			//实际完成时间
			checkDate : null,
			//任务序号
			num : null,
			//任务状态 0:未到期,1:,待执行,2:按期执行,3:超期执行,4:未执行,5:已失效
			status : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//巡检计划
			riCheckPlan : {id:'', name:''},
			//巡检表
			riCheckTable : {id:'', name:''},
			//检查人
			user : {id:'', name:''},
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
				"code" : [LIB.formRuleMgr.require(""),
						  LIB.formRuleMgr.length()
				],
				"name" : [LIB.formRuleMgr.length()],
				"disable" : LIB.formRuleMgr.range(1, 100).concat(LIB.formRuleMgr.require("状态")),
				"endDate" : [LIB.formRuleMgr.require("结束时间"),
						  LIB.formRuleMgr.length()
				],
				"startDate" : [LIB.formRuleMgr.require("开始时间"),
						  LIB.formRuleMgr.length()
				],
				"num" : LIB.formRuleMgr.range(1, 100),
				"status" : LIB.formRuleMgr.range(1, 100),
	        }
		},
		tableModel : {
		},
		formModel : {
		},
		cardModel : {
		},
		selectModel : {
			riCheckPlanSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			riCheckTableSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			userSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

        //无需附件上传请删除此段代码
		/*
		fileModel:{
			default : {
				cfg: {
					params: {
						recordId: null,
						dataType: 'XXX1', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
						fileType: 'XX'    // 文件类型标识，需要根据数据库的注释进行对应的修改
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
			"richeckplanSelectModal":riCheckPlanSelectModal,
			"richecktableSelectModal":riCheckTableSelectModal,
			"userSelectModal":userSelectModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowRiCheckPlanSelectModal : function() {
				this.selectModel.riCheckPlanSelectModel.visible = true;
				//this.selectModel.riCheckPlanSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveRiCheckPlan : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.riCheckPlan = selectedDatas[0];
				}
			},
			doShowRiCheckTableSelectModal : function() {
				this.selectModel.riCheckTableSelectModel.visible = true;
				//this.selectModel.riCheckTableSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveRiCheckTable : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.riCheckTable = selectedDatas[0];
				}
			},
			doShowUserSelectModal : function() {
				this.selectModel.userSelectModel.visible = true;
				//this.selectModel.userSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveUser : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.user = selectedDatas[0];
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