define(function(require){
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail-xl.html");
    var risktypeSelectModal = require("componentsEx/selectTableModal/tpaRisktypeSelectModal");
    var checkMethodSelectModal = require("componentsEx/selectTableModal/checkMethodSelectModal");
    var accidentCaseSelectModal = require("componentsEx/selectTableModal/accidentCaseSelectModal");
    var checkBasisSelectModal = require("componentsEx/selectTableModal/checkBasisSelectModal");
    var tpaItemBoatEquipmentSelectModal = require("componentsEx/selectTableModal/tpaItemBoatEquipmentSelectModal");

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
            //是否禁用，0启用，1禁用
            disable : "0",
            //是否被使用 0：未使用 1已使用
            isUse : null,
            //备注
            remarks : null,
            //修改日期
            modifyDate : null,
            //创建日期
            createDate : null,
            //检查分类
            riskType : {},
            //设备设施
            tpaEquipment : {id:'', name:''},
            category:"2",
            equipmentId:null,
            itemType:30
        }
    };
    //Vue数据
    var dataModel = {
        mainModel : {
            vo : newVO(),
            opType : 'view',
            isReadOnly : true,
            title:"",
            typeList:[{id:"0",name:"行为类"},{id:"1",name:"状态类"},{id:"2",name:"管理类"}],
            //验证规则
            rules:{
                //"code":[LIB.formRuleMgr.require("编码")]
                "code" : [LIB.formRuleMgr.require("编码"),
                    LIB.formRuleMgr.length()
                ],
                "name" : [LIB.formRuleMgr.require("检查项内容"),
                    LIB.formRuleMgr.length(500)
                ],
                "type": [{required: true, message: '请选择类型'},
                    LIB.formRuleMgr.length()
                ],
                "disable" : [{required: true, message: '请选择状态'},
                    LIB.formRuleMgr.length()
                ],
                //"riskType.id": [{required: true, message: '请选择风险分类'},
                //	LIB.formRuleMgr.length()
                //],
                "compId" : [{required: true, message: '请选择所属公司'},
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
                url : "tpacheckitem/checkmethods/list/{curPage}/{pageSize}",
                columns : [{
                    title : "编码",
                    fieldName : "code"
                },{
                    title : "名称",
                    fieldName : "name",
                },{
                    title : "内容",
                    fieldName : "content",
                },{
                    title : "",
                    fieldType : "tool",
                    toolType : "del"
                }]
            },
            checkAccidentTableModel:{
                url : "tpacheckitem/checkaccidents/list/{curPage}/{pageSize}",
                columns : [{
                    title : "编码",
                    fieldName : "code"
                },{
                    title : "内容说明",
                    fieldName : "name",
                },{
                    title : "",
                    fieldType : "tool",
                    toolType : "del"
                }]
            },
            checkBasisTableModel:{
                url : "tpacheckitem/checkbases/list/{curPage}/{pageSize}",
                columns :[
                    {
                        title:"检查依据分类",
                        fieldType:"custom",
                        render: function(data){
                            if(data.checkBasisType){
                                return data.checkBasisType.name;
                            }

                        }

                    },
                    {
                        title:"章节名称",
                        fieldName:"name"

                    },
                    {
                        title:"内容说明",
                        fieldName:"content",
                    },
                    {
                        title:"",
                        fieldType:"tool",
                        toolType:"del"
                    }
                ],
            },
            checkAccidentcaseTableModel:{
                url : "tpacheckitem/accidentcases/list/{curPage}/{pageSize}",
            },
            checkEquipmentTableModel:{
                url : "tpacheckitem/equipments/list/{curPage}/{pageSize}",
            }
        },
        formModel : {
        },
        cardModel : {
            checkMethodCardModel : {
                showContent : true
            },
            checkBasisTableModel : {
                showContent : true
            },
            checkAccidentcaseTableModel: {
                showContent : true
            },
        },
        riskTypeList:null,
        selectedDatas:[],
        //riskTypeId:null,
        riskTypeName:null,
        selectModel:{
            risktypeSelectModel:{
                visible:false
            },
            checkMethodSelectModel:{
                visible:false
            },
            accidentCaseSelectModel:{
                visible:false
            },
            tpaBoatEquipmentSelectModel:{
                visible:false,
                filterData: {compId: null}
            },
            checkBasisSelectModel:{
                visible:false
            }
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
            "accidentCaseSelectModal":accidentCaseSelectModal,
            "checkBasisSelectModal":checkBasisSelectModal,
            "tpaItemBoatEquipmentSelectModal":tpaItemBoatEquipmentSelectModal
        },
        data:function(){
            return dataModel;
        },
        methods:{
            newVO : newVO,
            doClearInput:function(){
                this.mainModel.vo.tpaEquipment.id = "";
            },
            doShowRisktypeSelectModel : function(param) {
                this.selectModel.risktypeSelectModel.visible = true;
            },
            doShowCheckMethodSelectModel : function(param) {
                this.selectModel.checkMethodSelectModel.visible = true;
            },
            doShowAccidentCaseSelectModel : function(param) {
                this.selectModel.accidentCaseSelectModel.visible = true;
            },
            doShowCheckBasisSelectModel : function(param) {
                this.selectModel.checkBasisSelectModel.visible = true;
            },
            doShowTpaBoatEquipmentSelectModal : function() {
                this.selectModel.tpaBoatEquipmentSelectModel.visible = true;
                this.selectModel.tpaBoatEquipmentSelectModel.filterData = {compId : LIB.user.compId};
            },
            doSaveEquipment : function(selectedDatas) {
                if (selectedDatas) {
                    this.mainModel.vo.tpaEquipment = selectedDatas[0];
                    this.mainModel.vo.equipmentId = selectedDatas[0].id;
                }
            },
            doSaveRisktype : function(selectedDatas) {
                if (selectedDatas) {
                    this.mainModel.vo.riskType = selectedDatas[0];
                }
            },
            doSaveCheckMethods : function(selectedDatas) {
                if (selectedDatas) {
                    var _this = this;
                    api.saveCheckMethods({id : dataModel.mainModel.vo.id}, selectedDatas).then(function() {
                        _this.refreshTableData(_this.$refs.checkmethodTable);
                    });
                }
            },
            doSaveCheckBasis:function(selectedDatas){
                if (selectedDatas) {
                    var _this = this;
                    api.saveCheckBasis({id : dataModel.mainModel.vo.id}, selectedDatas).then(function() {
                        _this.refreshTableData(_this.$refs.checkbasisTable);
                    });
                }
            },
            doSaveAccident:function(selectedDatas){
                if (selectedDatas) {
                    var _this = this;
                    api.saveAccident({id : dataModel.mainModel.vo.id}, selectedDatas).then(function() {
                        _this.refreshTableData(_this.$refs.checkaccidentcaseTable);
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
                this.$refs.checkbasisTable.doQuery({id : this.mainModel.vo.id});
                this.$refs.checkaccidentcaseTable.doQuery({id : this.mainModel.vo.id});
                var _this = this;

                //todo 暂时性的优化
                _this.riskTypeName = "";
                if(_.isEmpty(_this.riskTypeList)) {
                    api.listTableType().then(function(res){
                        _this.riskTypeList = res.data;
                        _.each(_this.riskTypeList,function(item){
                            if(_this.mainModel.vo.riskType.id==item.id){
                                _this.riskTypeName = item.name;
                            }
                        });
                    });
                } else {
                    _.each(_this.riskTypeList,function(item){
                        if(_this.mainModel.vo.riskType.id==item.id){
                            _this.riskTypeName = item.name;
                        }
                    });
                }
            },
            beforeDoSave:function(){
                this.mainModel.vo.orgId = this.mainModel.vo.compId;
            },
            afterDoSave:function(type){
                if(type.type="C"){
                    this.mainModel.isReadOnly = false;
                    var _this = this;
                    _this.riskTypeName = "";
                    _.each(_this.riskTypeList,function(item){
                        if(_this.mainModel.vo.riskType.id==item.id){
                            _this.riskTypeName = item.name;
                        }
                    });
                }
            },
            doEnableDisable:function(){
                var _this = this;
                if(_this.mainModel.vo.disable=='0'){
                    _this.mainModel.vo.disable="1";
                    api.update(null,_this.mainModel.vo).then(function(data){
                        if(data.data && data.error != '0'){
                            return;
                        }else{
                            LIB.Msg.info("已停用");
                            //_this.$dispatch("ev_dtCreate");
                            _this.$emit("do-detail-finshed");
                        }
                    });
                }else{
                    _this.mainModel.vo.disable="0"
                    api.update(null,_this.mainModel.vo).then(function(data){
                        if(data.data && data.error != '0'){
                            return;
                        }else{
                            LIB.Msg.info("已启用");
                            //_this.$dispatch("ev_dtCreate");
                            _this.$emit("do-detail-finshed");
                        }
                    });
                }

            },
            delCheckMethod: function(item) {
                var _this = this;
                var data = item.entry.data;
                api.removeCheckMethods({id : this.mainModel.vo.id}, [{id : data.id}]).then(function (res) {
                    _this.$refs.checkmethodTable.doRefresh();
                });
            },
            delCheckBasis: function(item) {
                var _this = this;
                var data = item.entry.data;
                api.removeCheckBasis({id : this.mainModel.vo.id}, [{id : data.id}]).then(function (res1) {
                    _this.$refs.checkbasisTable.doRefresh();
                });
            },
            delAccidentCase: function(item) {
                var _this = this;
                var data = item.entry.data;
                api.removeAccidentCase({id : this.mainModel.vo.id}, [{id : data.id}]).then(function (res2) {
                    _this.$refs.checkaccidentcaseTable.doRefresh();
                });
            },
            delEquipment: function(item) {
                var _this = this;
                var data = item.entry.data;
                api.removeEquipment({id : this.mainModel.vo.id}, [{id : data.id}]).then(function (res2) {
                    _this.$refs.checkaccidentcaseTable.doRefresh();
                });
            },
            beforeInit : function(data,opType) {
                this.$refs.checkmethodTable.doClearData();
                this.$refs.checkbasisTable.doClearData();
                this.$refs.checkaccidentcaseTable.doClearData();
                this.selectedDatas=[];
                if(opType.opType == 'create') {
                    //api.listTableType().then(function (res) {
                    //	dataModel.riskTypeList = res.data;
                    //});
                    //todo 暂时性的优化
                    var _this = this;
                    var t = setTimeout(function (){
                        clearTimeout(t);
                        if(_this.$parent.show){
                            api.listTableType().then(function(res){
                                _this.riskTypeList = res.data;
                            });
                        }
                    }, 800);
                }
                if(opType.opType =="update"){
                    this.selectedDatas.push(this.mainModel.vo.riskType);
                }
            },
            //编辑
            afterDoEdit:function(){
                //检查项分类
                this.selectedDatas.push(this.mainModel.vo.riskType);

            },
        },
        ready: function(){
            this.$api = api;
        }
    });

    return detail;
});