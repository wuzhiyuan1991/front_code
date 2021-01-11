define(function (require) {
    var Vue = require("vue");
    var template = require("text!./main-commenttype.html");
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
                tableModel:LIB.Opts.extendMainTableOpt({
                    selectedDatas:[],
                    values:[],
                    columns: [
                        LIB.tableMgr.column.cb,
                        {
                            title: '承诺岗位/节点',
                            fieldName: "name",
                            width:150,
                        },
                        {
                            title: '承诺内容',
                            fieldName: "content",
                        },
                        {
                            title: '是否应用承诺',
                            fieldType:"custom",
                            width:130,
                            render:function (data) {
                                return model.enum.enableCommitment[data.enableCommitment]
                            }
                        },
                    ],
                    pageSizeOpts:[20]
                }),
                detailModel: {
                    show: false
                },
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
            this.loadTable();
        },
        methods: {
            onSelectedType:function(){
                this.loadTable();
            },
            loadTable:function(){
                var _this=this;
                api.list({
                    'criteria.intsValue':JSON.stringify({type:[8,9,10]})
                }).then(function(res){
                    _this.tableModel.values=res.data;
                })
            },
            getDataByDic:function(){
                var data=LIB.getDataDicList(model.commitmentTypeDic.key);
                data=data.map(function (item) {

                });
                return data;
            },
            doAdd:function(){
                this.$broadcast('ev_dtReload', "create",null,model.commitmentTypeItem());
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
        }
    })
})
