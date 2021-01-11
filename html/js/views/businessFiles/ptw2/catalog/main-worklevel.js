define(function (require) {
    var Vue = require("vue");
    var template = require("text!./main-worklevel.html");
    var LIB = require('lib');
    var commonApi = require("../api");
    var api = require("./vuex/api");
    _.extend(api,commonApi);
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
                workTypeItem:null,
                workTypeSelectedIndex:0,
                currentWorkType:{},
                workTypeList:[],
                tableModel:LIB.Opts.extendMainTableOpt({
                    selectedDatas:[],
                    values:[],
                    columns: [
                        // LIB.tableMgr.column.cb,
                        {

                            title : "序号",
                            fieldType : "sequence",
                            width:40,
                        },
                        // {
                        //     title: '级别',
                        //     fieldName: "level",
                        //     width: 60,
                        // },
                        {
                            title: '级别名称',
                            fieldName: "name",
                            type:'text',
                            width: 150
                        },
                        {
                            title: '分级依据',
                            fieldName: "content",
                            width: 350
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
            }
        },
        computed:{
            // currentWorkType:function () {
            //     return this.workTypeList[this.workTypeSelectedIndex];
            // }
        },
        watch:{
          "workTypeSelectedIndex":function (val) {
              if(this.workTypeList && this.workTypeList[val]){
                  this.currentWorkType =  this.workTypeList[val];
              }else{
                  this.currentWorkType = null;
              }
              this.$refs.according.doSelectItem(parseInt(val));
          }
        },

        init: function(){
            this.$api = api;
        },
        ready: function () {
           this.getReadyType();
        },
        methods: {
            getReadyType:function () {
                var _this=this;
                api.getWorkCatalogs().then(function (data) {
                    if(!data||data.length===0){return}
                    _this.workTypeList=data;
                    _this.workTypeSelectedIndex = 0;
                    _this.currentWorkType = _this.workTypeList[0];
                    for(var i=0; i<_this.workTypeList.length; i++){
                        if(_this.workTypeItem){
                        }
                        if(_this.workTypeItem && (_this.workTypeItem.id ==  _this.workTypeList[i].id)){
                            _this.workTypeSelectedIndex =  i;
                        }
                    }
                    _this.workTypeItem = _this.workTypeList[_this.workTypeSelectedIndex];
                    _this.currentWorkType = _this.workTypeList[_this.workTypeSelectedIndex];

                    _this.$nextTick(function () {
                        _this.loadTable();
                    });
                });
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
            doUpdateInfoBefore:function (obj) {
                var rows = obj.entry.data;
                if (!_.isEmpty(rows)) {
                    this.showDetail(rows, { opType: "update" });
                }
            },
            doMoveInfoBefore:function (obj) {

            },
            onSelectedType:function(obj){
                this.workTypeSelectedIndex = parseInt(obj);
                this.workTypeItem = this.workTypeList[this.workTypeSelectedIndex];
                this.currentWorkType = this.workTypeList[this.workTypeSelectedIndex];
                this.loadTable();
            },
            loadTable:function(){
                var _this=this;
                api.list({
                    type:2,
                    parentId:this.currentWorkType.id
                }).then(function(res){
                    _this.tableModel.values=res.data;
                    _this.tableModel.selectedDatas=[];
                    _this.$refs.tableTaskLevel.checkAll = false;
                })
            },
            doAdd:function(){
                this.$broadcast('ev_dtReload', "create",null,model.workCatalogLevel(this.currentWorkType.id,this.tableModel.values.length+1));
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
            },

        }
    })
})
