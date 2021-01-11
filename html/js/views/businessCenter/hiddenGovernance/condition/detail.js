define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");

	//初始化数据模型
	var newVO = function() {
		return {
			//
			id : null,
			//编码
			code : null,
			//名称
			name : null,
			//公司id
			compId : null,
			//部门id
			orgId : null,
			//禁用标识
			disable : null,
			//表达式
			express : null,
			//修改时间
			modifyDate : null,
			//创建时间
			createDate : null,
			//工作流程
			activitiModeler : {id:'', name:''}
		}
	};
	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:"",
			showActivitiModelerSelectModal : false,
			
			//验证规则
	        rules:{
				"name": [
					LIB.formRuleMgr.require("名称"),
					LIB.formRuleMgr.length()
				],
				"activitiModeler.id" : [
					LIB.formRuleMgr.require("所属流程"),
					LIB.formRuleMgr.length()
				],
				"express" : [
					LIB.formRuleMgr.require("表达式"),
					LIB.formRuleMgr.length(255,1)
				]
	        },
	        emptyRules:{}
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
		components : {},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doSaveActivitiModeler : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.activitiModeler = selectedDatas[0];
					this.mainModel.vo.compId = selectedDatas[0].compId;
				}
			},
            afterInit: function () {
                if(this.mainModel.opType === 'create') {
                    this.mainModel.vo.activitiModeler = {
                        id: this.$route.query.id,
                        name: this.$route.query.name
                    };
                    this.mainModel.vo.compId = this.$route.query.compId;
                }
            }
		},
		events : {
		},
        init: function(){
        	this.$api = api;

        }
	});

	return detail;
});