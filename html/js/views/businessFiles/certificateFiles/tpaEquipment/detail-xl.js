define(function(require){
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail-xl.html");
    var equipmentTypeSelectModal = require("componentsEx/selectTableModal/tpaEquipmentTypeSelectModal");
    var equipmentitemFormModal = require("componentsEx/formModal/tpaEquipmentItemFormModal");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    //初始化数据模型
    var newVO = function() {
        return {
            //id
            id : null,
            //设备编号
            code : null,
            //设备设施名称
            name : null,
            //所属公司
            compId : null,
            //所属部门
            orgId : null,
            //是否禁用 0启用，1禁用
            disable : "0",
            //报废日期
            retirementDate : null,
            //设备设施状态 0再用,1停用,2报废
            state : "0",
            //保修期(月)
            warranty : null,
            //保修终止日期 根据保修期自动算出
            warrantyPeriod : null,
            //设备更新日期
            modifyDate : null,
            //负责人
            ownerId : null,
            user : {id:null,name:null},
            //设备登记日期
            createDate : null,
            //设备设施类型
            tpaEquipmentType : {id:'', name:''},
            //检查项
            checkItems : [],
            //设备设施子件
            equipmentItems : [],
            version:null
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
                //"code":[LIB.formRuleMgr.require("编码")]
                "code" : [LIB.formRuleMgr.require("设备编码"),
                    LIB.formRuleMgr.length()],
                "name": [LIB.formRuleMgr.require("设备设施名称"),
                    LIB.formRuleMgr.length()],
                "compId" : [
                    {required: true, message: '请选择所属公司'},
                    LIB.formRuleMgr.length()],
                "orgId" : [{required: true, message: '请选择所属部门'},
                    LIB.formRuleMgr.length()],
                "tpaEquipmentType.id": [LIB.formRuleMgr.require("设备类型"),
                    LIB.formRuleMgr.length()],
                "retirementDate" : [LIB.formRuleMgr.length()],
                "state" : [LIB.formRuleMgr.length()],
                "warranty" : [LIB.formRuleMgr.length()],
                "warrantyPeriod" : [LIB.formRuleMgr.length()],
                "modifyDate" : [LIB.formRuleMgr.length()],
                "createDate" : [LIB.formRuleMgr.length()]
            },
            emptyRules:{}
        },
        tableModel : {
            checkItemTableModel : {
                url : "tpaequipment/tpacheckitems/list/{curPage}/{pageSize}",
                columns : [{
                    title : "编码",
                    fieldName : "code"
                },{
                    title : "名称",
                    fieldName : "name",
                },{
                    title : "",
                    fieldType : "tool",
                    toolType : "edit,del"
                }]
            },
            equipmentItemTableModel : {
                url : "tpaequipment/tpaequipmentitems/list/{curPage}/{pageSize}",
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
            checkItemFormModel : {
                show : false,
                queryUrl : "tpaequipment/{id}/tpacheckitem/{checkItemId}"
            },
            equipmentItemFormModel : {
                show : false,
                queryUrl : "tpaequipment/{id}/tpaequipmentitem/{equipmentItemId}"
            },
        },
        selectModel : {
            equipmentTypeSelectModel : {
                visible : false
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
            "equipmenttypeSelectModal":equipmentTypeSelectModal,
            "equipmentitemFormModal":equipmentitemFormModal,
            "userSelectModal":userSelectModal

        },
        data:function(){
            return dataModel;
        },
        computed:{
            state:function(){
                var state = this.mainModel.vo.state;
                if (state == '0') {
                    return "在用";
                }
                else if (state == '1') {
                    return "停用";
                }else if (state == '2'){
                    return "报废"
                }
            }
        },
        methods:{
            newVO : newVO,
            doShowEquipmentTypeSelectModal : function() {
                this.selectModel.equipmentTypeSelectModel.visible = true;
            },
            doSaveEquipmentType : function(selectedDatas) {
                if (selectedDatas) {
                    this.mainModel.vo.tpaEquipmentType = selectedDatas[0];
                }
            },
            doClearInput:function(){
                this.mainModel.vo.ownerId = "";
                //this.mainModel.vo.user = {id:null,name:null};
            },
            doShowUserSelectModal:function(){
                this.mainModel.showUserSelectModal = true;
            },
            doShowCheckItemFormModal4Update : function(param) {
                this.formModel.checkItemFormModel.show = true;
                this.$refs.checkitemFormModal.init("update", {id: this.mainModel.vo.id, checkItemId: param.entry.data.id});
            },
            doShowCheckItemFormModal4Create : function(param) {
                this.formModel.checkItemFormModel.show = true;
                this.$refs.checkitemFormModal.init("create");
            },
            doSaveCheckItem : function(data) {
                if (data) {
                    var _this = this;
                    api.saveCheckItem({id : this.mainModel.vo.id}, data).then(function() {
                        _this.refreshTableData(_this.$refs.checkitemTable);
                    });
                }
            },
            doSaveUser:function(selectedDatas){
                if (selectedDatas) {
                    var user = selectedDatas[0];
                    this.mainModel.vo.ownerId = user.id;
                    this.mainModel.vo.user.id = user.id;
                    this.mainModel.vo.user.name = user.name;

                }
            },
            doUpdateCheckItem : function(data) {
                if (data) {
                    var _this = this;
                    api.updateCheckItem({id : this.mainModel.vo.id}, data).then(function() {
                        _this.refreshTableData(_this.$refs.checkitemTable);
                    });
                }
            },
            doRemoveCheckItems : function(item) {
                var _this = this;
                var data = item.entry.data;
                api.removeCheckItems({id : this.mainModel.vo.id}, [{id : data.id}]).then(function() {
                    _this.$refs.checkitemTable.doRefresh();
                });
            },
            doShowEquipmentItemFormModal4Update : function(param) {
                this.formModel.equipmentItemFormModel.show = true;
                this.$refs.equipmentitemFormModal.init("update", {id: this.mainModel.vo.id, equipmentItemId: param.entry.data.id});
            },
            doShowEquipmentItemFormModal4Create : function(param) {
                this.formModel.equipmentItemFormModel.show = true;
                this.$refs.equipmentitemFormModal.init("create");
            },
            doSaveEquipmentItem : function(data) {
                if (data) {
                    var _this = this;
                    api.saveTpaEquipmentItem({id : this.mainModel.vo.id}, data).then(function() {
                        _this.refreshTableData(_this.$refs.equipmentitemTable);
                    });
                }
            },
            doUpdateEquipmentItem : function(data) {
                if (data) {
                    var _this = this;
                    api.updateTpaEquipmentItem({id : this.mainModel.vo.id}, data).then(function() {
                        _this.refreshTableData(_this.$refs.equipmentitemTable);
                    });
                }
            },
            doRemoveEquipmentItems : function(item) {
                var _this = this;
                var data = item.entry.data;
                api.removeTpaEquipmentItems({id : this.mainModel.vo.id}, [{id : data.id}]).then(function() {
                    _this.$refs.equipmentitemTable.doRefresh();
                });
            },
            afterInitData : function() {
                //this.$refs.checkitemTable.doQuery({id : this.mainModel.vo.id});
                this.$refs.equipmentitemTable.doQuery({id : this.mainModel.vo.id});
            },
            beforeInit : function() {
                this.mainModel.isReadOnly = true;
                //this.$refs.checkitemTable.doClearData();
                this.$refs.equipmentitemTable.doClearData();
            },
            beforeDoSave:function() {
                var _this = this;
                if (parseInt(_this.mainModel.vo.warranty) < 0) {
                    this.mainModel.vo.warranty = null;
                    LIB.Msg.warning("保修期月份不能为负数");
                    return false;
                }
            }

        },
        events : {
        },
        ready: function(){
            this.$api = api;
        }
    });

    return detail;
});