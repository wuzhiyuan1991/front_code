define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	var checkTableSelectModal = require("componentsEx/selectTableModal/checkTableSelectModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
			//id
			id : null,
			//
			code : null,
			//对象名称
			name : null,
			//
			compId : null,
			//组织id
			orgId : null,
			//是否禁用，0启用，1禁用
			disable : null,
			//排序
			orderNo : null,
			//备注
			remarks : null,
			//类型 0 对象   1 对象类型
			type : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//检查表
			checkTables : [],
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
				"code" : [LIB.formRuleMgr.require(""),
						  LIB.formRuleMgr.length()
				],
				"name" : [LIB.formRuleMgr.require("对象名称"),
						  LIB.formRuleMgr.length()
				],
				"disable" : [LIB.formRuleMgr.length()],
				"orderNo" : [LIB.formRuleMgr.length()],
				"remarks" : [LIB.formRuleMgr.length()],
				"type" : [LIB.formRuleMgr.length()],
				"modifyDate" : [LIB.formRuleMgr.length()],
				"createDate" : [LIB.formRuleMgr.length()],	
	        },
	        emptyRules:{}
		},
		tableModel : {
			checkTableTableModel : {
				url : "checkobject/checktables/list/{curPage}/{pageSize}",
				columns : [{
					title : "编码",
					fieldName : "code"
				},{
					title : "名称",
					fieldName : "name",
				},{
					title : "",
					fieldType : "tool",
					toolType : "del"
				}]
			},
		},
		formModel : {
		},
		selectModel:{
			checkTableSelectModel:{
				visible:false
			}
		}
		//showCheckTableSelectModal : false,
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
		components : {
			"checktableSelectModal":checkTableSelectModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,

			doShowCheckTableSelectModel:function(){
				this.selectModel.checkTableSelectModel.visible = true;
			},
			doSaveCheckTables : function(selectedDatas) {
				if (selectedDatas) {
					dataModel.mainModel.vo.checkTables = selectedDatas;
					var _this = this;
					api.saveCheckTables({id : dataModel.mainModel.vo.id}, selectedDatas).then(function() {
						_this.refreshTableData(_this.$refs.checktableTable);
					});
				}
			},
			doRemoveCheckTables : function(item) {
				var _this = this;
				var data = item.entry.data;
				api.removeCheckTables({id : this.mainModel.vo.id}, [{id : data.id}]).then(function() {
					_this.$refs.checktableTable.doRefresh();
				});
			},
			afterInitData : function() {
				this.$refs.checktableTable.doQuery({id : this.mainModel.vo.id});
			},
			beforeInit : function() {
				this.$refs.checktableTable.doClearData();
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