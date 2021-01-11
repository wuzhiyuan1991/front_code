define(function (require) {
    var Vue = require("vue");
    var template = require("text!./main-gascheck.html");
    var LIB = require('lib');
    var api = require("./vuex/api");
    var detailPanel = require("./detail");
    var model=require('../model');
    return Vue.extend({
        template: template,
        mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        components:{
           "detailPanel": detailPanel,
        },
        data: function () {
            return {
                gasTypeSelectedIndex:0,
                gasTypeList:[],
                tableModel:LIB.Opts.extendMainTableOpt({
                    selectedDatas:[],
                    values:[],
                    columns: [
                        // LIB.tableMgr.column.cb,
                        {
                            title: '指标名称',
                            fieldName: "name",
                            width: 150,
                        },
                        {
                            title: '单位',
                            fieldName: "unit",
                            type:'text',
                            width: 80
                        },
                        {
                            title: '检测结果精准匹配',
                            fieldName: "attr1",
                            width:150,
                            render:function (data) {
                                return '<span class="ivu-checkbox  '+(data.attr1=='1'?'ivu-checkbox-checked':'')+'" disabled  ><span class="ivu-checkbox-inner"></span><input disabled type="checkbox" class="ivu-checkbox-input"></span>'
                            },
                            tipRender: function (data) {
                                if(data.attr1 == '1'){
                                    return '是';
                                }
                                return '否';
                            }
                        },
                        {
                            title: '标准范围',
                            fieldName: "content",
                            render: function(data) {
                                if(data.attr1!='1') {
                                    return data.content;
                                }
                                var content = "";
                                if(data.gasMinValue != undefined && data.gasMinCase) {
                                    content += data.gasMinValue + LIB.getDataDic('iptw_catalog_gas_value_case', data.gasMinCase) + "检测值";
                                }
                                if(data.gasMaxValue && data.gasMaxCase) {
                                    if(_.isEmpty(content)) {
                                        content += "检测值";
                                    }
                                    content += LIB.getDataDic('iptw_catalog_gas_value_case', data.gasMaxCase) + data.gasMaxValue;
                                }
                                return content;
                            }
                        },
                        {
                            title : "",
                            fieldType : "tool",
                            toolType : "edit,del",
                            width:80
                        }
                    ]
                }),
                detailModel: {
                    show: false
                },
                lookUpItem:{},//是否启用标准监听 0:未启用：1:启用
                orgId:'',
                isTop: false
            }
        },
        computed:{
            currentGasType:function () {
                return this.gasTypeList[this.gasTypeSelectedIndex];
            }
        },
        init: function(){
            this.$api = api;
        },
        ready: function () {
            var _this=this;
            this.gasTypeList=LIB.getDataDicList('iptw_catalog_gas_type');

            if(this.$route.query.gastype){
                this.gasTypeSelectedIndex = this.$route.query.gastype-1;
            }
            this.setEnableLookUp();
            this.loadTable();
        },
        created:function(){

        },
        methods: {
            setEnableLookUp:function(){
                var _this=this;
               api.queryLookupItem().then(function (res) {
                _this.lookUpItem=res.data;
               })
            },
            doChangeEnableLookUp:function(){
                api.updateLookupItem({id:this.lookUpItem.lookupId},this.lookUpItem).then(function (item) {
                    LIB.Msg.info("模式切换成功")
                });
            },
            doUpdateInfoBefore:function (obj) {
                var rows = obj.entry.data;
                if (!_.isEmpty(rows)) {
                    this.showDetail(rows, { opType: "update" });
                }
            },
            doDeleteVarious:function () {
                var _this = this;
                LIB.Modal.confirm({
                    title: '确定删除数据?',
                    onOk: function() {
                        _this.$api.removeVarious(null, _this.tableModel.selectedDatas).then(function() {
                            // _this.afterDoDelete(_vo);
                            _this.loadTable();
                            LIB.Msg.info("删除成功");
                        });
                    }
                });
            },
            //删除table的数据
            doDeleteInfo: function(obj) {
                var _this = this;
                var _vo = obj.entry.data;
                LIB.Modal.confirm({
                    title: '确定删除数据?',
                    onOk: function() {
                        _this.$api.remove(null, _vo).then(function() {
                            _this.afterDoDelete(_vo);
                            _this.loadTable();
                            LIB.Msg.info("删除成功");
                        });
                    }
                });
            },
            onSelectedType:function(){
                this.loadTable();
            },
            loadTable:function(){
                var _this=this;
                api.list({
                    type:4,
                    gasType:_this.currentGasType.id,
                    compId: _this.orgId,
                    // orgId: _this.orgId
                }).then(function(res){
                    _this.tableModel.values=res.data;
                    _this.tableModel.selectedDatas=[];
                    _this.$refs.tableGasCheck.checkAll = false;
                })
            },
            doAdd:function(){
                this.$broadcast('ev_dtReload', "create",null,model.gasCheckItem(this.currentGasType.id));
                this.detailModel.show = true;
            },
            doDelete:function () {
                var _this=this;
                LIB.Modal.confirm({
                    title: '删除当前数据?',
                    onOk: function() {
                        api.removeSingle(null,_this.tableModel.selectedDatas[0]).then(function () {
                            _this.loadTable();
                        })
                    }
                });
            },
            afterDoDetailCreate:function(){
                this.detailModel.show=false;
                this.loadTable();
            },
            afterDoDetailUpdate:function () {
                this.loadTable();
            }
        },
        events: {
            'do-org-category-change': function (orgId, isTop) {
                this.orgId = orgId || null;
                this.isTop  = isTop;
                this.loadTable();
            }
        }
    })
})
