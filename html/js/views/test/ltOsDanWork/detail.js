define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	
	//初始化数据模型
	var newVO = function() {
		return {
			id : null,
			//编号
			code : null,
			//危险作业名称
			name : null,
			//作业前的准备
			preContent : null,
			//禁用标识 0未禁用,1已禁用
			disable : "0",
			//作业注意事项
			noticeContent : null,
			//危险因素
			factors : null,
			//防护措施
			protectMeasure : null,
			//设备/工艺/工序
			craft : null,
			//常见危险处理措施
			measureContent : null,
			//可能导致的伤害
			harm : null,
			//所属公司
			compId : null,
			//所属部门
			orgId : null,
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
				"code" : [LIB.formRuleMgr.require("编号"),
						  LIB.formRuleMgr.length(200)
				],
				"name" : [LIB.formRuleMgr.require("危险作业名称"),
						  LIB.formRuleMgr.length(100)
				],
				"preContent" : [LIB.formRuleMgr.require("作业前的准备"),
						  LIB.formRuleMgr.length(65535)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"noticeContent" : [LIB.formRuleMgr.require("作业注意事项"),
						  LIB.formRuleMgr.length(65535)
				],
				"factors" : [LIB.formRuleMgr.require("危险因素"),
						  LIB.formRuleMgr.length(100)
				],
				"protectMeasure" : [LIB.formRuleMgr.require("防护措施"),
						  LIB.formRuleMgr.length(100)
				],
				"craft" : [LIB.formRuleMgr.require("设备/工艺/工序"),
						  LIB.formRuleMgr.length(100)
				],
				"measureContent" : [LIB.formRuleMgr.require("常见危险处理措施"),
						  LIB.formRuleMgr.length(65535)
				],
				"harm" : [LIB.formRuleMgr.require("可能导致的伤害"),
						  LIB.formRuleMgr.length(100)
				],
				"compId" : [LIB.formRuleMgr.require("所属公司")],
				"orgId" : [LIB.formRuleMgr.length(10)],
	        }
		},

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