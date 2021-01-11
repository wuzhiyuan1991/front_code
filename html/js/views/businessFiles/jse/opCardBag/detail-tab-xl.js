define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-tab-xl.html");
	var opCardSelectModal = require("componentsEx/selectTableModal/opCardSelectModal");
	var opCardBagFormModal = require("componentsEx/formModal/opCardBagFormModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//唯一标识
			code : null,
			//文件夹名
			name : null,
			//禁用标识 0未禁用，1已禁用
			disable : null,
			//序号
			orderNo : null,
			//类型 1:文件夹,2:卡票
			type : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//卡票
			opCard : {id:'', name:''},
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
				"code" : [LIB.formRuleMgr.require("唯一标识"),
						  LIB.formRuleMgr.length()
				],
				"name" : [LIB.formRuleMgr.length()],
				"disable" :LIB.formRuleMgr.require("状态"),
				"orderNo" : LIB.formRuleMgr.range(1, 100).concat(LIB.formRuleMgr.require("序号")),
				"type" : LIB.formRuleMgr.range(1, 100).concat(LIB.formRuleMgr.require("类型")),
	        }
		},
		tableModel : {
		},
		formModel : {
			opCardBagFormModel : {
				show : false,
				queryUrl : "opcardbag/{id}"
			}
		},
		cardModel : {
		},
		selectModel : {
			opCardSelectModel : {
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
			"opcardSelectModal":opCardSelectModal,
			"opcardbagFormModal":opCardBagFormModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowOpCardSelectModal : function() {
				this.selectModel.opCardSelectModel.visible = true;
				//this.selectModel.opCardSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveOpCard : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.opCard = selectedDatas[0];
				}
			},
			doShowOpCardBagFormModal4Update : function(data) {
				this.formModel.opCardBagFormModel.show = true;
				this.$refs.opcardbagFormModal.init("update", {id: this.mainModel.vo.id});
			},
			doUpdateOpCardBag : function(data) {
				this.doUpdate(data);
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