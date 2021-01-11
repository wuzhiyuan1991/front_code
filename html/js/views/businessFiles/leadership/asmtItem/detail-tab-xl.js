define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-tab-xl.html");
	var asmtBasisSelectModal = require("componentsEx/selectTableModal/asmtBasisSelectModal");
	var asmtTableSelectModal = require("componentsEx/selectTableModal/asmtTableSelectModal");
	var asmtItemFormModal = require("componentsEx/formModal/asmtItemFormModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
			//ID
			id : null,
			//编码
			code : null,
			//自评名称
			name : null,
			//类型 0行为类,1状态类,2管理类 暂时不用
			type : null,
			//自评分值
			score : null,
			//公司id
			compId : null,
			//组织id
			orgId : null,
			//自评项来源标识 2手动生成
			category : null,
			//是否禁用 0启用,1禁用
			disable : null,
			//分组名称
			groupName : null,
			//组排序
			groupOrderNo : null,
			//是否被使用 0未使用,1已使用 暂时不用
			isUse : null,
			//项排序
			itemOrderNo : null,
			//备注
			remarks : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//自评依据
			asmtBasis : {id:'', name:''},
			//自评表
			asmtTable : {id:'', name:''},
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
				"name" : [LIB.formRuleMgr.require("自评名称"),
						  LIB.formRuleMgr.length()
				],
				"type" : [LIB.formRuleMgr.require("类型"),
						  LIB.formRuleMgr.length()
				],
				"score" : [LIB.formRuleMgr.require("自评分值"),
						  LIB.formRuleMgr.length()
				],
				"category" : [LIB.formRuleMgr.length()],
				"disable" : [LIB.formRuleMgr.length()],
				"groupName" : [LIB.formRuleMgr.length()],
				"groupOrderNo" : [LIB.formRuleMgr.length()],
				"isUse" : [LIB.formRuleMgr.length()],
				"itemOrderNo" : [LIB.formRuleMgr.length()],
				"remarks" : [LIB.formRuleMgr.length()],
				"modifyDate" : [LIB.formRuleMgr.length()],
				"createDate" : [LIB.formRuleMgr.length()],	
	        },
	        emptyRules:{}
		},
		tableModel : {
		},
		formModel : {
			asmtItemFormModel : {
				show : false,
				queryUrl : "asmtitem/{id}"
			}
		},
		cardModel : {
		},
		selectModel : {
			asmtBasisSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			asmtTableSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
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
			"asmtbasisSelectModal":asmtBasisSelectModal,
			"asmttableSelectModal":asmtTableSelectModal,
			"asmtitemFormModal":asmtItemFormModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowAsmtBasisSelectModal : function() {
				this.selectModel.asmtBasisSelectModel.visible = true;
				//this.selectModel.asmtBasisSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveAsmtBasis : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.asmtBasis = selectedDatas[0];
				}
			},
			doShowAsmtTableSelectModal : function() {
				this.selectModel.asmtTableSelectModel.visible = true;
				//this.selectModel.asmtTableSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveAsmtTable : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.asmtTable = selectedDatas[0];
				}
			},
			doShowAsmtItemFormModal4Update : function(data) {
				this.formModel.asmtItemFormModel.show = true;
				this.$refs.asmtitemFormModal.init("update", {id: this.mainModel.vo.id});
			},
			doUpdateAsmtItem : function(data) {
				this.doUpdate(data);
			},

		},
		events : {
		},
        ready: function(){
        	this.$api = api;
        }
	});

	return detail;
});