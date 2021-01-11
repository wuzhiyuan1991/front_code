define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	var risktypeSelectModal = require("componentsEx/selectTableModal/risktypeSelectModal");
	var checkMethodSelectModal = require("componentsEx/selectTableModal/checkMethodSelectModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
			//ID
			id : null,
			//
			code : null,
			//检查项名称
			name : null,
			//类型 0 行为类   1 状态类  2 管理类
			type : null,
			//
			compId : null,
			//组织id
			orgId : null,
			//检查项来源标识 0转隐患生成 1危害辨识生成  2手动生成
			category : null,
			//是否禁用，0启用，1禁用
			disable : null,
			//是否被使用 0：未使用 1已使用
			isUse : null,
			//备注
			remarks : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//检查分类
			riskType : {id:'', name:''},
		}
	};
	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:"",
			showRisktypeSelectModal : false,
			showCheckMethodSelectModal : false,
			
			//验证规则
	        rules:{
	        	//"code":[LIB.formRuleMgr.require("编码")]
				"code" : [LIB.formRuleMgr.require(""),
						  LIB.formRuleMgr.length()
				],
				"name" : [LIB.formRuleMgr.require("检查项名称"),
						  LIB.formRuleMgr.length()
				],
				"type" : [LIB.formRuleMgr.require("类型"),
						  LIB.formRuleMgr.length()
				],
				"category" : [LIB.formRuleMgr.length()],
				"disable" : [LIB.formRuleMgr.length()],
				"isUse" : [LIB.formRuleMgr.length()],
				"remarks" : [LIB.formRuleMgr.length()],
				"modifyDate" : [LIB.formRuleMgr.length()],
				"createDate" : [LIB.formRuleMgr.length()],	
	        },
	        emptyRules:{}
		},
		tableModel : {
			checkMethodTableModel : {
				url : "checkitem/checkmethods/list/{curPage}/{pageSize}",
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
			"risktypeSelectModal":risktypeSelectModal,
			"checkmethodSelectModal":checkMethodSelectModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doSaveRisktype : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.riskType = selectedDatas[0];
				}
			},
			doSaveCheckMethods : function(selectedDatas) {
				if (selectedDatas) {
					dataModel.mainModel.vo.checkMethods = selectedDatas;
					var _this = this;
					api.saveCheckMethods({id : dataModel.mainModel.vo.id}, selectedDatas).then(function() {
						_this.refreshTableData(_this.$refs.checkmethodTable);
					});
				}
			},
			doRemoveCheckMethods : function(item) {
				var _this = this;
				var data = item.entry.data;
				api.removeCheckMethods({id : this.mainModel.vo.id}, [{id : data.id}]).then(function() {
					_this.$refs.checkmethodTable.doRefresh();
				});
			},
			afterInitData : function() {
				this.$refs.checkmethodTable.doQuery({id : this.mainModel.vo.id});
			},
			beforeInit : function() {
				this.$refs.checkmethodTable.doClearData();
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