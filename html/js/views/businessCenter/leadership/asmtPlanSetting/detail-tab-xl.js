define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-tab-xl.html");
	
	//初始化数据模型
	var newVO = function() {
		return {
			//
			id : null,
			//编码
			code : null,
			//是否禁用 0未发布，1发布
			disable : null,
			//结束时间
			endTime : null,
			//频率类型 5周 10半月 15月 20自定义
			frequencyType : null,
			//是否重复 0执行一次 1执行多次
			isRepeatable : null,
			//是否包含周末 0不包含 1包含（frequency_type=1时生效）
			isWeekendInculed : null,
			//时间间隔
			period : null,
			//开始时间
			startTime : null,
			//间隔单位 1分钟 2小时 3天 4周 5月 6季度
			unit : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
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
	        	//"code":[LIB.formRuleMgr.require("编码")]
				"code" : [LIB.formRuleMgr.length()],
				"disable" : [LIB.formRuleMgr.length()],
				"endTime" : [LIB.formRuleMgr.length()],
				"frequencyType" : [LIB.formRuleMgr.length()],
				"isRepeatable" : [LIB.formRuleMgr.length()],
				"isWeekendInculed" : [LIB.formRuleMgr.length()],
				"period" : [LIB.formRuleMgr.length()],
				"startTime" : [LIB.formRuleMgr.length()],
				"unit" : [LIB.formRuleMgr.length()],
				"modifyDate" : [LIB.formRuleMgr.length()],
				"createDate" : [LIB.formRuleMgr.length()],	
	        },
	        emptyRules:{}
		},

	};
	//Vue组件
	/**
	 *  请统一使用以下顺序配置Vue参数，方便codeview
	 *	el
	 template
	 components
	 componentName
	 props
	 data
	 computed
	 watch
	 methods
	 events
	 vue组件声明周期方法
	 created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
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
        ready: function(){
        	this.$api = api;
        }
	});

	return detail;
});