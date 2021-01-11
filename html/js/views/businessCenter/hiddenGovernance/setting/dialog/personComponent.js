define(function (require) {
    var LIB = require('lib');

    //数据模型
    var api = require("../vuex/api");

    var template = require("text!./personComponent.html");
    var newVO=function(){
        return {
            id: null,
            name:null,
            attr1:null,
            conditionSeq:null,
            parentId:null
        }
    };


    var dataModel = {
        tableModel: {
            url: "user/list{/curPage}{/pageSize}",
            selectedDatas: [],
            resetTriggerFlag:false,
            columns: [
                {
                    title: "",
                    fieldName: "id",
                    fieldType: "radio",
                },
                {
                    title: "姓名",
                    fieldName: "username",
                    filterType: "text"
                },
                //{
                //    title: "所属岗位",
                //    fieldType: "custom",
                //    filterType: "text",
                //    render: function (data) {
                //        if (data.org) {
                //            return data.org.name;
                //        }
                //    }
                //
                //},
                {
                    title: "所属部门",
                    fieldType: "custom",
                    filterType: "text",
                    render: function (data) {
                        if (data.org) {
                            return data.org.name;
                        }
                    }
                },
                {
                    title: "手机",
                    fieldName: "mobile",
                    filterName: "criteria.strsValue.disable"
                    
                }]
        },
        //控制全部分类组件显示
        mainModel: {
            vo: newVO(),
            index:null
        }
    };


    var opts = {
        template: template,
        data: function () {
            return dataModel;
        },
        methods: {
            doSave: function () {
                var _this=this;
                var row = this.tableModel.selectedDatas[0];
                if (!row) {
                    LIB.Msg.warning("请选择人员");
                    return;
                }
                this.mainModel.vo.attr1=row.id;
                this.mainModel.vo.name=row.username;
                //保存条件分组
                api.saveFilterLookup(_.pick(this.mainModel.vo,"attr1", "name","conditionSeq",'parentId','id')).then(function (res) {
                    _this.$dispatch("ev_personSaved", _this.mainModel.vo,_this.mainModel.index);
                    LIB.Msg.info("添加人员成功");
                });
            }
        },
        events: {
            "ev_personReload": function (parentId,conditionSeq,index) {
                var _this=this;
                var _vo = dataModel.mainModel.vo;
                //清空数据
                _.extend(_vo, newVO());
                _vo.parentId=parentId;
                _vo.conditionSeq=conditionSeq;
                api.getUUID().then(function (res) {
                    _vo.id = res.data;
                });

                this.mainModel.index=index;

                //强制清空 select 组件的值， 避免异常情况的失效
                this.$nextTick(function () {
                    _this.tableModel.selectedDatas = [];
                });
            }
        }
    };
    var demo = LIB.Vue.extend(opts);
    return demo;
});