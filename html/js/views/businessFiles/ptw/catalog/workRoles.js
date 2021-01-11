define(function (require) {
    var Vue = require("vue");
    var template = require("text!./workRoles.html");
    var LIB = require('lib');
    var commonApi = require("../api");
    var api = require("./vuex/api");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");

    _.extend(api,commonApi);

    var children = [{
        attr1: "ptw.enableWorkRole.enableIsolator",
        attr2: "1",
        attr5: "是否启用能量隔离人",
        children: [],
        compId: "9999999999",
        deleteFlag: "0",
        description: "",
        isDefault: "1",
        name: "enableIsolator",
        orgId: "9999999999",
        parentId: "",
        content: ""
    },
    {
        attr1: "ptw.enableWorkRole.enableGasInspector",
        attr2: "1",
        attr5: "是否启用气体检测人",
        children: [],
        compId: "9999999999",
        deleteFlag: "0",
        description: "",
        isDefault: "1",
        name: "enableGasInspector",
        orgId: "9999999999",
        parentId: "",
        content: ""
    }];

    var model=require('../model');
    return Vue.extend({
        template: template,
        mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        components:{
            "userSelectModal": userSelectModal
        },
        data: function () {
            return {
                isTop: false,
                isOnWork: false,
                checkVal:1,
                tableModel:LIB.Opts.extendMainTableOpt({
                    selectedDatas:[],
                    values:[],
                    columns: [
                        {

                            title : "姓名",
                            fieldName : "user.name",
                            width:"150px",
                        },
                        {
                            title: '所属部门',
                            render: LIB.tableMgr.column.dept.render,
                            width:"350px",
                        }
                    ]
                }),
                selectModel:{
                    user:{show:false}
                },
                type:1, // //作业角色类型 1:气体检测人员,2:能量隔离人
                filterData:{compId:'', 'criteria.intValue': {userWorkState: 1}},
                // filterData:{compId:''},

                ptw:null,
                enableWorkRole: null
            }
        },
        watch:{
            "filterData.compId": function () {
               this.loadTable();
               this.getSystemParam();
            }
        },

        init: function(){
            this.$api = api;
        },
        ready: function () {
            // this.getReadyType();
            this.enableWorkRole = LIB.getBusinessSetByNamePath("ptw.enableWorkRole", "9999999999");

            var state = LIB.getBusinessSetByNamePath("common.enableUserWorkState", "9999999999");
            if(state && state.result=='2'){
                this.filterData['criteria.intValue'].userWorkState = "1";
                this.isOnWork =  true;
            }else{
                this.filterData['criteria.intValue'].userWorkState = null;
                delete this.filterData['criteria.intValue'];

                this.isOnWork =  false;
            }
        },
        methods: {
            getCheckBoxObj:function () {
                if(this.type == '1') return children[1];
                else return children[0];
            },
            getSystemParam: function () {
                var enableGasInspector = LIB.getBusinessSetByNamePath("ptw.enableWorkRole.enableGasInspector", this.filterData.compId);
                var enableIsolator = LIB.getBusinessSetByNamePath("ptw.enableWorkRole.enableIsolator", this.filterData.compId);

                if(Object.keys(enableGasInspector).length!==0){
                    children[1].id = enableGasInspector.id;
                    children[1].result = enableGasInspector.result;
                    children[1].parentId = this.enableWorkRole.id;
                }else{
                    children[1].id = null;
                    children[1].result = '1';
                }
                if(Object.keys(enableIsolator).length!==0){
                    children[0].id = enableIsolator.id;
                    children[0].result = enableIsolator.result;
                    children[0].parentId = this.enableWorkRole.id;
                }else{
                    children[0].id = null;
                    children[0].result = '1';
                }
                if(this.type == 1){
                    this.checkVal = children[1].result;
                }else{
                    this.checkVal = children[0].result;
                }
            },

            changeType: function (val) {
                this.type = val;
                if(this.type=='1'){
                    // this.checkVal  = LIB.getBusinessSetStateByNamePath('ptw.enableWorkRole.enableGasInspector')?'2':'1';
                    this.checkVal = children[1].result;
                }else{
                    // this.checkVal = LIB.getBusinessSetStateByNamePath('ptw.enableWorkRole.enableIsolator')?'2':'1';
                    this.checkVal = children[0].result;
                }
                this.loadTable();
            },
            doSaveUser: function (datas) {
                var _this = this;
                var list = [];
                _.each(datas, function (item) {
                    if(datas && datas.length>0){
                        var obj = {
                            workerId : item.id,
                            compId : item.compId,
                            //部门Id
                            orgId : item.orgId,
                            type : _this.type,
                            //启用/禁用 0:启用,1:禁用
                            disable : "0",
                            //人员
                            user : {id:item.id, name:item.name},
                        }
                        list.push(obj);
                    }
                });

                if(list.length>0){
                    api.createPtwWorkRoles(null, list).then(function (res) {
                        _this.loadTable(); // 刷新
                    })
                }
            },
            doAddUser: function () {
                this.selectModel.user.show = true;
            },
            getReadyType:function () {
                this.getSystemParam();
                if(this.filterData.compId){
                    if(this.type=='1'){
                        this.checkVal  = LIB.getBusinessSetStateByNamePath('ptw.enableWorkRole.enableGasInspector')?'2':'1';
                        children[1].result = this.checkVal;

                    }else{
                        this.checkVal = LIB.getBusinessSetStateByNamePath('ptw.enableWorkRole.enableIsolator')?'2':'1';
                        children[0].result = this.checkVal;
                    }
                }
            },

            doDelItem:function (item) {
                var _this = this;
                LIB.Modal.confirm({
                    title: '确定删除数据?',
                    onOk: function() {
                        api.removePtwWorkRole(null, {id: item.id, compId: _this.filterData.compId, orgId: _this.filterData.compId}).then(function (res) {
                            _this.loadTable();
                            LIB.Msg.info("删除成功");
                        });
                    }
                });
            },

            changeCheck: function (val) {
                var _this = this;
                var param = this.getCheckBoxObj();
                param.compId = this.filterData.compId;
                param.orgId = this.filterData.compId;
                param.result = val;
                api.updatePtwWorkRoleStatus(null, param).then(function (res) {
                    if(!param.id){
                        setTimeout(function () {
                            _this.getSystemParam();
                        },200);
                    }
                });
            },

            loadTable:function(){
                var _this=this;
                if(this.isTop) return _this.tableModel.values = [];
                api.queryPtwWorkRoles(
                    {compId: this.filterData.compId, type: this.type}
                ).then(function(res){
                    if(res.data){
                        _this.tableModel.values=res.data.list;
                    }else{
                        _this.tableModel.values = []
                    }
                    _this.tableModel.selectedDatas=[];
                })
            },
        },
        events: {
            'do-org-category-change': function (orgId,isTop) {
                this.isTop = isTop;
                if(isTop){
                    this.tableModel.values = [];
                }
                this.filterData.compId = orgId;
            }
        }
    });
});
