define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	var systemBusinessSetSelectModal = require("componentsEx/selectTableModal/systemBusinessSetSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			id : null,
			//唯一标识
			code : null,
			//配置名称
			name : null,
			//是否为默认配置
			isDefault : null,
			//所属公司id
			compId : null,
			//所属部门id
			orgId : null,
			//描述
			description : null,
			//配置值
			result : null,
			//是否可以修改
			unmodified : null,
			//应急职务
			systemBusinessSet : {id:null, name:null, attr1:null},
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
				// "code" : [LIB.formRuleMgr.length(100)],
				"name" : [LIB.formRuleMgr.require("名称"),LIB.formRuleMgr.length(100)],
				// "isDefault" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.require("是否为默认配置")),
				// "compId" : [LIB.formRuleMgr.require("所属公司")],
				// "orgId" : [LIB.formRuleMgr.length(10)],
				"description" : [LIB.formRuleMgr.require("描述"),LIB.formRuleMgr.length(65535)],
				// "result" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				// "unmodified" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				// "systemBusinessSet.id" : [LIB.formRuleMgr.require("父级配置")],
			}
		},
		tableModel : {
		},
		formModel : {
		},
		selectModel : {
			systemBusinessSetSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
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
			"systembusinesssetSelectModal":systemBusinessSetSelectModal,

		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowSystemBusinessSetSelectModal : function() {
				if(!this.mainModel.vo.name){
					LIB.Msg.info("请先输入名称");
					return;
				}
				this.selectModel.systemBusinessSetSelectModel.visible = true;
				//this.selectModel.systemBusinessSetSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveSystemBusinessSet : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.systemBusinessSet = selectedDatas[0];
					this.mainModel.vo.attr1 = selectedDatas[0].attr1;
					this.mainModel.vo.attr5 = selectedDatas[0].attr5;
				}
			},
			beforeDoSave: function() {
				var _this = this;
				_this.mainModel.vo.compId = '9999999999';
				_this.mainModel.vo.orgId = '9999999999';
				if(!this.mainModel.vo.systemBusinessSet.id){//没选父级配置
					this.mainModel.vo.attr1 = this.mainModel.vo.name;
					this.mainModel.vo.attr5 = this.mainModel.vo.description;
					this.mainModel.vo.systemBusinessSet.id = '';
				}else {
					this.mainModel.vo.attr1 = this.mainModel.vo.systemBusinessSet.attr1 +'.'+this.mainModel.vo.name;
					this.mainModel.vo.attr2 = 1;
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