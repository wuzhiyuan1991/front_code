define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-tab-xl.html");
	var lookupItemFormModal = require("componentsEx/formModal/lookupItemFormModal");
	var lookupFormModal = require("componentsEx/formModal/lookupFormModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
			//id
			id : null,
			//编码
			code : null,
			//字典名称名称
			name : null,
			//是否禁用，0启用，1禁用
			disable : null,
			//备注
			remarks : null,
			//类型
			type : null,
			//字典值
			value : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//数据字典辅表
			lookupItems : [],
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
						  LIB.formRuleMgr.length()
				],
				"name" : [LIB.formRuleMgr.length()],
				"disable" : [LIB.formRuleMgr.length()],
				"remarks" : [LIB.formRuleMgr.length()],
				"type" : [LIB.formRuleMgr.length()],
				"value" : [LIB.formRuleMgr.length()],
				"modifyDate" : [LIB.formRuleMgr.length()],
				"createDate" : [LIB.formRuleMgr.length()],	
	        },
	        emptyRules:{}
		},
		tableModel : {
			lookupItemTableModel : {
				url : "lookup/lookupitems/list/{curPage}/{pageSize}",
				columns : [{
					title : "编码",
					fieldName : "code"
				},{
					title : "键",
					fieldName : "name",
				},{
					title : "值",
					fieldName : "value",
				},{
					title : "",
					fieldType : "tool",
					toolType : "edit,del"
				}]
			},
		},
		formModel : {
			lookupItemFormModel : {
				show : false,
				queryUrl : "lookup/{id}/lookupitem/{lookupItemId}"
			},
			lookupFormModel : {
				show : false,
				queryUrl : "lookup/{id}"
			}
		},
		cardModel : {
			lookupItemCardModel : {
				showContent : true
			},
		},
		type:null
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
			"lookupitemFormModal":lookupItemFormModal,
			"lookupFormModal":lookupFormModal,
			
        },
		data:function(){
			return dataModel;
		},
		computed:{
			type:function () {
				var type = this.mainModel.vo.type;
				if(type == "0"){
					return "数据字典";
				}else if(type == "1"){
					return "系统参数";
				}else if(type == "2"){
					return "资源配置";
				}
			}
		},
		methods:{
			newVO : newVO,
			doShowLookupItemFormModal4Update : function(param) {
				this.formModel.lookupItemFormModel.show = true;
				this.$refs.lookupitemFormModal.init("update", {id: this.mainModel.vo.id, lookupItemId: param.entry.data.id});
			},
			doShowLookupItemFormModal4Create : function(param) {
				this.formModel.lookupItemFormModel.show = true;
				this.$refs.lookupitemFormModal.init("create");
			},
			doSaveLookupItem : function(data) {
				if (data) {
					var _this = this;
					api.saveLookupItem({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.lookupitemTable);
					});
				}
			},
			doUpdateLookupItem : function(data) {
				if (data) {
					var _this = this;
					api.updateLookupItem({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.lookupitemTable);
					});
				}
			},
			doRemoveLookupItems : function(item) {
				var _this = this;
				var data = item.entry.data;
				api.removeLookupItems({id : this.mainModel.vo.id}, [{id : data.id}]).then(function() {
					_this.$refs.lookupitemTable.doRefresh();
				});
			},
			doShowLookupFormModal4Update : function(data) {
				this.formModel.lookupFormModel.show = true;
				this.$refs.lookupFormModal.init("update", {id: this.mainModel.vo.id});
			},
			doUpdateLookup : function(data) {
				this.doUpdate(data);
			},
			afterInitData : function() {
				this.$refs.lookupitemTable.doQuery({id : this.mainModel.vo.id});
			},
			beforeInit : function() {
				this.$refs.lookupitemTable.doClearData();
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