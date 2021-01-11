define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var tpl = require("text!./checkObject.html");

    var newVO = function () {
        return {
            checkObjectId: null,
            checkObjectName: null,
            objectList: []
        }
    };

    //数据模型
    var dataModel = {
        mainModel: {
            vo: newVO()
        },
        resetTriggerFlag: false,
        checkObjectColumns: [
            {
                fieldName:"id",
                fieldType:"radio"
            },
            {
                title: "受检对象名称",
                fieldName: "name"
            },
            {
                title: "所属机构",
                fieldType: "custom",
                render: function (data) {
                    if (data.organization) {
                        return data.organization.name;
                    }
                }
            },
            {
                title: "负责人",
                fieldType: "custom",
                render: function (data) {
                    if (data.firstUser) {
                        return data.firstUser.username;
                    }
                }
            },
            {
                title: "状态",
                fieldType: "custom",
                render: function (data) {
                    if (data.disable == 0) {
                        return "启用";
                    } else if (data.disable == 1) {
                        return "停用";
                    }
                }
            }
        ],
        url: "checkobject/list{/curPage}{/pageSize}",
        selectedDatas: [],
        filterColumn: ["criteria.strValue.name", "criteria.strValue.orgName"]
    };

    //声明detail组件
    /**
     *  请统一使用以下顺序配置Vue参数，方便codeview
     *    el
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
    var selectDialog = LIB.Vue.extend({
        template: tpl,
        data: function () {
            return dataModel;
        },
        methods: {
            doSave: function () {
                var _this = this;
                if (dataModel.selectedDatas) {
                    dataModel.mainModel.vo.checkObjectId = dataModel.selectedDatas[0].id;
                    dataModel.mainModel.vo.checkObjectName = dataModel.selectedDatas[0].name;

                    _this.$dispatch("ev_editCheckObjectFinshed", dataModel.mainModel.vo);
                }
            },
            //双击关闭modal
            onDbClickCell:function(){
                   this.doSave();
            },
            doCancel: function () {
                this.$dispatch("ev_editCheckObjectCancel");
            },
            resetTable: function () {
                this.resetTriggerFlag = true;
            },
        },
        events: {
            //select框数据加载
            "ev_hdCheckObjectReload": function (data) {
                //注意！ events中使用 绑定的data， 需要通过全局对象直接引用， 而methods中可以直接通过this引用到data
                var _vo = dataModel.mainModel.vo;
                //清空数据
                _.extend(_vo, newVO());
                //赋值
                _vo.objectList = data.objectList;
                _vo.checkObjectId = data.id;

                //重置table
                this.resetTriggerFlag = !this.resetTriggerFlag;
            }
        }
    });

    return selectDialog;
});