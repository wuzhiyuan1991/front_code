define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	//初始化数据模型
	var newVO = function() {
		return {
			id:null,
			name :null,
			level :null
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
	            "code":[{ required: true, message: '请输入编码'}],
	        },
	        emptyRules:{},
            useMainData:true
		}
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
		mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth,LIB.VueMixin.detailPanel],
		template: tpl,
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO
		},
		events : {
		},
        ready: function(){
        	this.$api = api;
        }
	});

	return detail;
});