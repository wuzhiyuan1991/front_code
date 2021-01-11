define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	var lookupItemFormModal = require("componentsEx/formModal/lookupItemFormModal");

    LIB.registerDataDic("system_lookup_type_dic", [
        ["0","数据字典"],
        ["1","系统参数"],
        ["2","资源配置"],
		["3","业务分类"]
    ]);


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
	        	//"code":[LIB.formRuleMgr.require("编码")]
				"code" : [LIB.formRuleMgr.require("编码"),
						  LIB.formRuleMgr.length()
				],
				"name" : [LIB.formRuleMgr.length()],
				"disable" : [LIB.formRuleMgr.length()],
				"remarks" : [LIB.formRuleMgr.length()],
				"type" : [LIB.formRuleMgr.require("类型")],
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
					fieldName : "name"
				},{
					title : "状态",
					fieldType : "link",
					fieldName : "disable"
				},{
					title : "值",
					fieldName : "value"
				},{
					title : "",
					fieldType : "tool",
					toolType : "move,edit,del"
				}]
			},
		},
		formModel : {
			lookupItemFormModel : {
				show : false,
				queryUrl : "lookup/{id}/lookupitem/{lookupItemId}"
			},
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
		mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth,LIB.VueMixin.detailPanel],
		template: tpl,
		components : {
			"lookupitemFormModal":lookupItemFormModal,
			
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
			doTableCellClick : function(data){
				if (data.cell.colId == 2) {//状态单元格--修改状态
					var _this = this;
                    var _data = _.clone(data.entry.data);
					_data.disable = _.propertyOf(_data)("disable") == "0" ? 1 : "0";
					api.updateLookupItem({id : this.mainModel.vo.id}, _data).then(function() {
						_this.refreshTableData(_this.$refs.lookupitemTable);
						LIB.Msg.info(LIB.getDataDic("disable", _data.disable)+"成功");
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
            doMoveLookupItems : function(item) {
                var _this = this;
                var data = item.entry.data;
                var param = {
                    id : data.id,
                    lookupId : dataModel.mainModel.vo.id
                };
                _.set(param, "criteria.intValue.offset", item.offset);
                api.moveLookupItems({id : this.mainModel.vo.id}, param).then(function() {
                    _this.$refs.lookupitemTable.doRefresh();
                });
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