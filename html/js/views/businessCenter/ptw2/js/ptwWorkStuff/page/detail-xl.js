define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	var ptwWorkPermitSelectModal = require("componentsEx/selectTableModal/ptwWorkPermitSelectModal");
	var ptwStuffSelectModal = require("componentsEx/selectTableModal/ptwStuffSelectModal");
	var ptwCatalogSelectModal = require("componentsEx/selectTableModal/ptwCatalogSelectModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//编码
			code : null,
			//类型 1:作业工具/设备,2:作业资格证书,3:危害辨识,4:控制措施,5:工艺隔离-方法,6:个人防护设备,7:作业取消原因,8:气体检测指标
			stuffType : null,
			//启用/禁用 0:启用,1:禁用
			disable : "0",
			//现场核对结果 0:未核对,1:不勾选,2:勾选
			checkResult : null,
			//其他的内容/资格证名称
			content : null,
			//是否为其他 0:否,1是
			isExtra : null,
			//作业许可
			workPermit : {id:'', name:''},
			//风险库
			ptwStuff : {id:'', name:''},
			//气体类型
			gasCatalog : {id:'', name:''},
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
				"stuffType" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("类型")),
				"disable" :LIB.formRuleMgr.require("状态"),
				"checkResult" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"content" : [LIB.formRuleMgr.length(500)],
				"isExtra" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"workPermit.id" : [LIB.formRuleMgr.require("作业许可")],
				"ptwStuff.id" : [LIB.formRuleMgr.require("风险库")],
				"gasCatalog.id" : [LIB.formRuleMgr.require("气体类型")],
	        }
		},
		tableModel : {
		},
		formModel : {
		},
		cardModel : {
		},
		selectModel : {
			workPermitSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			ptwStuffSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			gasCatalogSelectModel : {
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
			"ptwworkpermitSelectModal":ptwWorkPermitSelectModal,
			"ptwstuffSelectModal":ptwStuffSelectModal,
			"ptwcatalogSelectModal":ptwCatalogSelectModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowWorkPermitSelectModal : function() {
				this.selectModel.workPermitSelectModel.visible = true;
				//this.selectModel.workPermitSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveWorkPermit : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.workPermit = selectedDatas[0];
				}
			},
			doShowPtwStuffSelectModal : function() {
				this.selectModel.ptwStuffSelectModel.visible = true;
				//this.selectModel.ptwStuffSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSavePtwStuff : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.ptwStuff = selectedDatas[0];
				}
			},
			doShowGasCatalogSelectModal : function() {
				this.selectModel.gasCatalogSelectModel.visible = true;
				//this.selectModel.gasCatalogSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveGasCatalog : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.gasCatalog = selectedDatas[0];
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