define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-tab-xl.html");
	
	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//编码
			code : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//所属公司
			compId : null,
			//所属部门
			orgId : null,
			//事故发生日期
			accidentDate : null,
			//人员伤亡
			casualties : null,
			//企业声誉
			corporateReputation : null,
			//对责任单位的处理建议
			deptSuggestions : null,
			//事故直接原因
			directCause : null,
			//事故启示和教训
			enlightenment : null,
			//环境影响
			envirImpact : null,
			//事故间接原因
			indirectCause : null,
			//整改和防范措施
			measures : null,
			//事故性质 1:责任事故,0:非责任事故
			nature : null,
			//对责任人员的处理建议
			personSuggestions : null,
			//事故地点
			place : null,
			//事故经过
			process : null,
			//财产损失
			propertyLoss : null,
			//事故启示和教训
			remark : null,
			//标题
			title : null,
			//事故类别
			type : null,
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
				"code" : [LIB.formRuleMgr.require("编码"),
						  LIB.formRuleMgr.length(100)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"compId" : [LIB.formRuleMgr.require("所属公司")],
				"orgId" : [LIB.formRuleMgr.length(10)],
				"accidentDate" : [LIB.formRuleMgr.allowStrEmpty],
				"casualties" : [LIB.formRuleMgr.length(65535)],
				"corporateReputation" : [LIB.formRuleMgr.length(65535)],
				"deptSuggestions" : [LIB.formRuleMgr.length(65535)],
				"directCause" : [LIB.formRuleMgr.length(65535)],
				"enlightenment" : [LIB.formRuleMgr.length(65535)],
				"envirImpact" : [LIB.formRuleMgr.length(65535)],
				"indirectCause" : [LIB.formRuleMgr.length(65535)],
				"measures" : [LIB.formRuleMgr.length(1000)],
				"nature" : [LIB.formRuleMgr.length(10)],
				"personSuggestions" : [LIB.formRuleMgr.length(65535)],
				"place" : [LIB.formRuleMgr.length(300)],
				"process" : [LIB.formRuleMgr.length(65535)],
				"propertyLoss" : [LIB.formRuleMgr.length(65535)],
				"remark" : [LIB.formRuleMgr.length(500)],
				"title" : [LIB.formRuleMgr.length(100)],
				"type" : [LIB.formRuleMgr.length(100)],
	        }
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
			beforeInit 			//初始化之前回调
			afterInit			//初始化之后回调
			afterInitData		//请求 查询 接口后回调
			afterInitFileData   //请求 查询文件列表 接口后回调
			beforeDoSave		//请求 新增/更新 接口前回调，返回false时不进行保存操作
			afterFormValidate	//表单rule的校验通过后回调，，返回false时不进行保存操作
			buildSaveData		//请求 新增/更新 接口前回调，重新构造接口的参数
			afterDoSave			//请求 新增/更新 接口后回调
			beforeDoDelete		//请求 删除 接口前回调
			afterDoDelete		//请求 删除 接口后回调
		 events
		 vue组件声明周期方法
		 init/created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
	 **/
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth,LIB.VueMixin.detailTabXlPanel],
		template: tpl,
		components : {
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,

		},
		events : {
		},
    	init: function(){
        	this.$api = api;
        }
	});

	return detail;
});