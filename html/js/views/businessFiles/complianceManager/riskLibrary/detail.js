define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	// var icmRiskTypeSelectModal = require("componentsEx/selectTableModal/icmRiskTypeSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			id : null,
			//角色编码
			code : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//检查项内容
			checkItemName : null,
			//管控等级
			controlLevel : null,
			//控制措施
			controlMeasures : null,
			//危害因素分类
			hazardFactorType : null,
			//发生可能性
			possibility : null,
			//风险等级(场景)
			riskLevelScene : null,
			//风险点
			riskPoint : null,
			//风险点分类
			riskPointType : null,
			//风险场景
			scene : null,
			//风险得分
			score : null,
			//后果严重性
			severity : null,
			//类型
			type : null,
			//风险分类
			icmRiskType : {id:'', name:''},
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
				"code" : [LIB.formRuleMgr.length(100)],
				"disable" :LIB.formRuleMgr.require("状态"),
				"checkItemName" : [LIB.formRuleMgr.length(300)],
				"controlLevel" : [LIB.formRuleMgr.length(20)],
				"controlMeasures" : [LIB.formRuleMgr.length(500)],
				"hazardFactorType" : [LIB.formRuleMgr.length(50)],
				"possibility" : [LIB.formRuleMgr.length(20)],
				"riskLevelScene" : [LIB.formRuleMgr.length(20)],
				"riskPoint" : [LIB.formRuleMgr.length(100)],
				"riskPointType" : [LIB.formRuleMgr.length(100)],
				"scene" : [LIB.formRuleMgr.length(300)],
				"score" : [LIB.formRuleMgr.length(20)],
				"severity" : [LIB.formRuleMgr.length(20)],
				"type" : [LIB.formRuleMgr.length(10)],
				"icmRiskType.id" : [LIB.formRuleMgr.allowStrEmpty],
	        }
		},
		tableModel : {
		},
		formModel : {
		},
		selectModel : {
			icmRiskTypeSelectModel : {
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
			// "icmrisktypeSelectModal":icmRiskTypeSelectModal,

        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowIcmRiskTypeSelectModal : function() {
				this.selectModel.icmRiskTypeSelectModel.visible = true;
				//this.selectModel.icmRiskTypeSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveIcmRiskType : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.icmRiskType = selectedDatas[0];
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