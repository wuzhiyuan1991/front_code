define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	//初始化数据模型
	var newVO = function() {
		return {
			id:null,
			recipient :null,
			title :null,
			content:null,
			sendTime:null,
			sendStatus:null,
			errorLog:null,
			createBy:null,
			createDate:null,
			status:null,
			email:null
		}
	};
	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:"",
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
			//edit框数据加载
			"ev_detailReload": function (nVal) {
				var _vo = dataModel.mainModel.vo;
				//清空数据
				_.extend(_vo, newVO());
				if (nVal != null) {
				//初始化数据
				//	console.log(nVal);
				_.deepExtend(_vo, nVal);
					//api.get({id: nVal}).then(function (res) {debugger;
					//	//初始化数据
					//	_.deepExtend(_vo, res.data);
                    //
					//});
				}
			}
		},
        ready: function(){
        }
	});

	return detail;
});