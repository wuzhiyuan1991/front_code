define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	var tpaBoatEquipmentTypeSelectModal = require("componentsEx/selectTableModal/tpaBoatEquipmentTypeSelectModal");
	var tpaBoatEquipmentItemFormModal = require("componentsEx/formModal/tpaBoatEquipmentItemFormModal");
    //负责人
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	//初始化数据模型
	var newVO = function() {
		return {
			//id
			id : null,
            //船舶编号
            code:null,
            //船舶名称
            name:null,
            //船舶型号
            version:null,
            //船舶类型
            tpaBoatEquipmentType : {id:'', name:''},
            //登记日期
            createDate:null,
            //保修期
            warranty:null,
            //报废日期
            retirementDate:null,
            //负责人
            user:{id:'', name:''},
            //所属公司
            compId:null,
            //所属部门
            orgId:null,
            //状态
            state: "0",
            ownerId:null,
			type:null
		}
	};
	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:"",
            showUserSelectModal : false,
			//验证规则
	        rules:{
				"code" : [LIB.formRuleMgr.require("设备编号"),
						  LIB.formRuleMgr.length()
				],
                "tpaBoatEquipmentType.id" : [{required: true, message: '请选择船舶类型'},
                    LIB.formRuleMgr.length()
                ],
                "name": [LIB.formRuleMgr.require("船舶名称"),
                    LIB.formRuleMgr.length()],
                "version": [LIB.formRuleMgr.require("船舶型号"),
                    LIB.formRuleMgr.length()],
                "compId" : [
                    {required: true, message: '请选择所属公司'},
                    LIB.formRuleMgr.length()],
                "orgId" : [{required: true, message: '请选择所属部门'},
                    LIB.formRuleMgr.length()],
                type:[LIB.formRuleMgr.require("设备分类"), LIB.formRuleMgr.length() ]
	        },
	        emptyRules:{}
		},
		tableModel : {
			tpaBoatEquipmentItemTableModel : {
				url : "tpaboatequipment/tpaboatequipmentitems/list/{curPage}/{pageSize}",
                columns : [{
                    title : "编码",
                    fieldName : "code",
                    width : "180px"
                },{
                    title : "子件名称",
                    fieldName : "name",
                },{
                    title : "序列号",
                    fieldName : "serialNumber"
                },{
                    title : "保修期(月)",
                    fieldName : "warranty",
                    width : "100px"
                },{
                    title : "保修终止日期",
                    fieldName : "warrantyPeriod",
                    width : "154px"
                },{
                    title : "报废日期",
                    fieldName : "retirementDate",
                    width : "154px"
                },{
                    title : "",
                    fieldType : "tool",
                    toolType : "edit,del"
                }]
			},
		},
		formModel : {
			tpaBoatEquipmentItemFormModel : {
				show : false,
				queryUrl : "tpaboatequipment/{id}/tpaboatequipmentitem/{tpaBoatEquipmentItemId}"
			},
		},
		cardModel : {
			tpaBoatEquipmentItemCardModel : {
				showContent : true
			},
		},
		selectModel : {
			tpaBoatEquipmentTypeSelectModel : {
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
			"tpaboatequipmenttypeSelectModal":tpaBoatEquipmentTypeSelectModal,
           // "equipmentitemFormModal":equipmentitemFormModal,
			"tpaboatequipmentitemFormModal":tpaBoatEquipmentItemFormModal,
            "userSelectModal":userSelectModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
            doClearInput:function(){
                this.mainModel.vo.ownerId = "";
                //this.mainModel.vo.user = {id:null,name:null};
            },
            doShowUserSelectModal:function(){
                this.mainModel.showUserSelectModal = true;
            },
            doSaveUser:function(selectedDatas){
                if (selectedDatas) {
                    var user = selectedDatas[0];
                    this.mainModel.vo.ownerId = user.id;
                    this.mainModel.vo.user.id = user.id;
                    this.mainModel.vo.user.name = user.name;
                }
            },
			doShowTpaBoatEquipmentTypeSelectModal : function() {
				this.selectModel.tpaBoatEquipmentTypeSelectModel.visible = true;
				//this.selectModel.tpaBoatEquipmentTypeSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveTpaBoatEquipmentType : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.tpaBoatEquipmentType = selectedDatas[0];
				}
			},
			doShowTpaBoatEquipmentItemFormModal4Update : function(param) {
				this.formModel.tpaBoatEquipmentItemFormModel.show = true;
				this.$refs.tpaboatequipmentitemFormModal.init("update", {id: this.mainModel.vo.id, tpaBoatEquipmentItemId: param.entry.data.id});
			},
			doShowTpaBoatEquipmentItemFormModal4Create : function(param) {
				this.formModel.tpaBoatEquipmentItemFormModel.show = true;
				this.$refs.tpaboatequipmentitemFormModal.init("create");
			},
			doSaveTpaBoatEquipmentItem : function(data) {
				if (data) {
					var _this = this;
					api.saveTpaBoatEquipmentItem({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.tpaboatequipmentitemTable);
					});
				}
			},
			doUpdateTpaBoatEquipmentItem : function(data) {
				if (data) {
					var _this = this;
					api.updateTpaBoatEquipmentItem({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.tpaboatequipmentitemTable);
					});
				}
			},
			doRemoveTpaBoatEquipmentItems : function(item) {
				var _this = this;
				var data = item.entry.data;
				api.removeTpaBoatEquipmentItems({id : this.mainModel.vo.id}, [{id : data.id}]).then(function() {
					_this.$refs.tpaboatequipmentitemTable.doRefresh();
				});
			},
			afterInitData : function() {
				this.$refs.tpaboatequipmentitemTable.doQuery({id : this.mainModel.vo.id});
			},
			beforeInit : function() {
				this.$refs.tpaboatequipmentitemTable.doClearData();
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