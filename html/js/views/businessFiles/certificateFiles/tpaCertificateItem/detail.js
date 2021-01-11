define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	var tpaEquipmentSelectModal = require("componentsEx/selectTableModal/tpaEquipmentSelectModal");
	var accidentCaseSelectModal = require("componentsEx/selectTableModal/accidentCaseSelectModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
			//ID
			id : null,
			//角色编码
			code : null,
			//检查项名称
			name : null,
			//
			compId : null,
			//组织id
			orgId : null,
			//发证日期
			awardDate : null,
			//检查项来源标识 0转隐患生成,1危害辨识生成,2手动生成
			category : null,
			//是否禁用 0启用,1禁用
			disable : null,
			//是否被使用 0未使用,1已使用
			isUse : null,
			//证书类别 10船舶证书类 20人员证书类 30资料类
			itemType : null,
			//中间校验
			periodDate : null,
			//备注
			remarks : null,
			//类型 0行为类,1状态类,2管理类
			type : null,
			//有效日期
			validDate : null,
			//年度检验
			yearDate : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//设备设施
			tpaEquipment : {id:'', name:''},
			//事故案例
			accidentCases : [],
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
				"name" : [LIB.formRuleMgr.require("检查项名称"),
						  LIB.formRuleMgr.length(500)
				],
				"awardDate" : [LIB.formRuleMgr.length()],
				"category" : [LIB.formRuleMgr.length()],
				"disable" : [LIB.formRuleMgr.length()],
				"isUse" : [LIB.formRuleMgr.length()],
				"itemType" : [LIB.formRuleMgr.length()],
				"periodDate" : [LIB.formRuleMgr.length()],
				"remarks" : [LIB.formRuleMgr.length()],
				"type" : [LIB.formRuleMgr.length()],
				"validDate" : [LIB.formRuleMgr.length()],
				"yearDate" : [LIB.formRuleMgr.length()],
				"modifyDate" : [LIB.formRuleMgr.length()],
				"createDate" : [LIB.formRuleMgr.length()],	
	        },
	        emptyRules:{}
		},
		tableModel : {
			accidentCaseTableModel : {
				url : "tpacheckitem/accidentcases/list/{curPage}/{pageSize}",
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
		selectModel : {
			tpaEquipmentSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			accidentCaseSelectModel : {
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
		mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth,LIB.VueMixin.detailPanel],
		template: tpl,
		components : {
			"tpaequipmentSelectModal":tpaEquipmentSelectModal,
			"accidentcaseSelectModal":accidentCaseSelectModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowTpaEquipmentSelectModal : function() {
				this.selectModel.tpaEquipmentSelectModel.visible = true;
				//this.selectModel.tpaEquipmentSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveTpaEquipment : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.tpaEquipment = selectedDatas[0];
				}
			},
			doShowAccidentCaseSelectModal : function() {
				this.selectModel.accidentCaseSelectModel.visible = true;
				//this.selectModel.accidentCaseSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveAccidentCases : function(selectedDatas) {
				if (selectedDatas) {
					dataModel.mainModel.vo.accidentCases = selectedDatas;
					var param = _.map(selectedDatas, function(data){return {id : data.id}});
					var _this = this;
					api.saveAccidentCases({id : dataModel.mainModel.vo.id}, param).then(function() {
						_this.refreshTableData(_this.$refs.accidentcaseTable);
					});
				}
			},
			doRemoveAccidentCases : function(item) {
				var _this = this;
				var data = item.entry.data;
				api.removeAccidentCases({id : this.mainModel.vo.id}, [{id : data.id}]).then(function() {
					_this.$refs.accidentcaseTable.doRefresh();
				});
			},
			afterInitData : function() {
				this.$refs.accidentcaseTable.doQuery({id : this.mainModel.vo.id});
			},
			beforeInit : function() {
				this.$refs.accidentcaseTable.doClearData();
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