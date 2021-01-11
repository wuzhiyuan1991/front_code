define(function (require) {
    var Vue = require("vue");
    var template = require("text!./workDisclose.html");
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
                orgId:'',
                vo:null,
                content: null,
                isReadOnly: true
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
                // this.$refs.according.doSelectItem(parseInt(val));
            }
        },

        init: function(){
            this.$api = api;
        },
        ready: function () {
            // this.getReadyType();
        },
        methods: {
            onSelectedType: function (val) {
                var item = this.workTypeList[parseInt(val)];
                if(item){
                    this.getList(item.id, item.attr2);
                }
            },
            doCancel: function () {
                this.isReadOnly = true;
                this.vo.name = this.content ;
            },
            doEdit: function () {
                this.isReadOnly = false;
                this.content = this.vo.name;
            },
            doSave: function () {
                var _this = this;
                if(!this.vo.name){
                    LIB.Msg.info("请填写内容")
                   return ;
                }
                if(this.vo.name.length>2000){
                    LIB.Msg.info("最大输入字符数 2000")
                   return ;
                }
                if(!this.vo.id){
                    api.create(this.vo).then(function (res) {
                        LIB.Msg.info("保存成功");
                        _this.vo.id = res.data.id;
                        _this.isReadOnly = true;
                    })
                }else{
                    api.update(this.vo).then(function (res) {
                        _this.isReadOnly = true;
                        LIB.Msg.info("保存成功");
                    })
                }
            },

            getList : function (pid, attr2) {
                var _this = this;
                api.list({compId: this.orgId, type:11, parentId:pid, attr2:attr2}).then(function (res) {
                    if(res.data && res.data.length>0){
                        _this.vo = res.data[0];
                    }else{
                        _this.vo = {
                            id: null,
                            name: null,
                            type: 11,
                            parentId:pid,
                            attr2:attr2,
                            compId: _this.orgId,
                            orgId: _this.orgId
                        }
                    }
                })
            },
            queryWorkcatalogtree: function () {
                var _this = this;
                if(!this.orgId) return ;
                api.queryWorkcatalogtree({compId: this.orgId}).then(function (res) {
                    _this.workTypeList = [];
                    var arr = res.data;
                    _.each(arr, function (arrItem) {
                        var obj = {id: arrItem.id, name: arrItem.name, attr2:null, arr2Name: null};
                        if(arrItem.children && arrItem.children.length>0){
                            _.each(arrItem.children, function (item) {
                                var temp = _.clone(obj);
                                temp.name += '(' + item.name + ')';
                                temp.arr2Name = item.name;
                                temp.attr2 = item.id;
                                _this.workTypeList.push(temp);
                            })
                        }else{
                            _this.workTypeList.push(obj);
                        }
                    });
                    _this.workTypeSelectedIndex = 0;
                    if(_this.workTypeList && _this.workTypeList.length>0){
                        var item = _this.workTypeList[0];
                        _this.getList(item.id, item.attr2)
                    }
                })
            },

        },
        events: {
            'do-org-category-change': function (orgId, isTop) {
                this.orgId = orgId || LIB.user.compId;
                this.isTop = isTop;
                this.queryWorkcatalogtree();
                // this.getReadyType(orgId);
            }
        }
    })
})
