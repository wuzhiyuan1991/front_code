define(function (require) {
    //基础js
    var LIB = require('lib');
    var apiResult = require("./vuex/api-result");
    var apiType = require("./vuex/api-type");
    var tpl = LIB.renderHTML(require("text!./main.html"));

    var initDataModel = function () {
        return {
            moduleCode: "riCheckResult",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                resultRShow: true,
                resultEShow: true,
                typeShow: true
            },
            resultTableModel: {
                r_url: "richeckresult/list{/curPage}{/pageSize}?isRight=1",
                e_url: "richeckresult/list{/curPage}{/pageSize}?isRight=0",
                columns: [
                    LIB.tableMgr.column.code,
                    {
                        //巡检结果名称
                        title: "巡检结果名称",
                        fieldName: "name",
                        filterType: "text"
                    },
                    LIB.tableMgr.column.disable,
                    {
                        //是否正确 0:错误,1:正确
                        title: "是否正确",
                        fieldName: "isRight",
                        orderName: "isRight",
                        filterName: "criteria.intsValue.isRight",
                        filterType: "enum",
                        fieldType: "custom",
                        popFilterEnum: LIB.getDataDicList("iri_check_result_is_right"),
                        render: function (data) {
                            return LIB.getDataDic("iri_check_result_is_right", data.isRight);
                        }
                    },
                    {
                        //是否默认选项 0:否,1:是
                        title: "是否默认选项",
                        fieldName: "isDefault",
                        orderName: "isDefault",
                        filterName: "criteria.intsValue.isDefault",
                        filterType: "enum",
                        fieldType: "custom",
                        popFilterEnum: LIB.getDataDicList("iri_check_result_is_default"),
                        render: function (data) {
                            return LIB.getDataDic("iri_check_result_is_default", data.isDefault);
                        },
                        width: 200
                    },
                    {
                        title : "操作",
                        fieldType : "tool",
                        toolType : "move,edit,del"
                    }

                ]
            },
            typeTableModel: {
                url: 'richecktype/list{/curPage}{/pageSize}',
                columns: [
                    LIB.tableMgr.column.code,
                    {
                        //巡检结果名称
                        title: "巡检结果名称",
                        fieldName: "name",
                        filterType: "text"
                    },
                    LIB.tableMgr.column.disable,
                    {
                        //序号
                        title: "序号",
                        fieldName: "orderNo",
                        filterType: "number",
                        width: 100
                    },
                    LIB.tableMgr.column.modifyDate,
                    LIB.tableMgr.column.createDate,
                    {
                        title : "操作",
                        fieldType : "tool",
                        toolType : "move,edit,del"
                    }
                ]
            }
        }
    };

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
        template: tpl,
        data: initDataModel,
        components: {
        },
        methods: {
            toggleSetItem: function (key) {
                this.mainModel[key] = !this.mainModel[key]
            },

            // 巡检结果操作
            doAddResult: function (isRight) {

            },
            doMoveRResult : function(item) {
                var _this = this;
                var data = item.entry.data;
                var param = {
                    id : data.id
                };
                _.set(param, "criteria.intValue.offset", item.offset);
                apiResult.order(null, param).then(function() {
                    _this.$refs.rresultTable.doRefresh();
                });
            },
            doRemoveRResult: function(item) {
                var _this = this;
                var data = item.entry.data;
                apiResult.remove(null, {id: data.id}).then(function() {
                    _this.$refs.rresultTable.doRefresh();
                });
            },

            // 巡检类型操作
            doMoveType : function(item) {
                var _this = this;
                var data = item.entry.data;
                var param = {
                    id : data.id
                };
                _.set(param, "criteria.intValue.offset", item.offset);
                apiType.order(null, param).then(function() {
                    _this.$refs.typeTable.doRefresh();
                });
            },
            doRemoveType: function(item) {
                var _this = this;
                var data = item.entry.data;
                apiType.remove(null, {id: data.id}).then(function() {
                    _this.$refs.typeTable.doRefresh();
                });
            }
        },
        events: {},
        init: function () {
            // this.$api = api;
        }
    });

    return vm;
});
