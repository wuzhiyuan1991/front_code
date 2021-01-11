define(function(require) {
    //基础js
    var LIB = require('lib');
    var API = require('./vuex/api');
    var tpl = LIB.renderHTML(require("text!./main.html"))
        //数据模型
        //右侧滑出详细页
    var detailPanel = require("./detail");
    //新增滑窗
    // var editComponent = require("./edit");
    //编辑弹框页面
    //var editComponent = require("./dialog/edit");

    //Vue数据模型
    //var dataModel = function{
    var dataModel = function() {
        return {
            moduleCode: LIB.ModuleCode.BS_BaC_RemS,
            mainModel: {
                //显示分类
                showCategory: false,
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass: "middle-info-aside"
            },
            detailModel: {
                //控制右侧滑出组件显示
                show: false
            },
            tableModel: LIB.Opts.extendMainTableOpt({
                url: "remind/list{/curPage}{/pageSize}",
                selectedDatas: [],
                columns: [{
                        title: "",
                        fieldName: "id",
                        fieldType: "cb",
                    },
                    {
                        //title: "编码",
                        title: this.$t("gb.common.code"),
                        fieldName: "code",
                        width: 161,
                        fieldType: "link",
                        filterType: "text"
                    },
                    {
                        title: this.$t("bs.bac.remindName"),
                        fieldName: "remindName",
                        filterType: "text",
                        width: 240
                    },
                    _.extend(_.extend({}, LIB.tableMgr.column.company), { fieldName: "orgId" }), //为了排序时兼容没有compId的页面
                    {
                        title: this.$t("gb.common.type"),
                        fieldName: "remindType",
                        fieldType: "custom",
                        filterType: "enum",
                        filterName: "criteria.intsValue.remindType",
                        popFilterEnum: LIB.getDataDicList("remindType"),
                        render: function(data) {
                            return LIB.getDataDic("remindType", data.remindType);
                        },
                        width: 100
                    },
                    {
                        title: this.$t("bd.hal.objectName"),
                        fieldName: "lookup.attr1",
                        filterType: "text",
                        filterName: "criteria.strValue.lookupName",
                        orderName: "remindlookup.attr1",
                        width: 180
                    },
                    {
                        title: this.$t("gb.common.mode"),
                        fieldName: "remindWay",
                        fieldType: "custom",
                        render: function(data) {
                            var str = "";
                            if (data.remindWay) {
                                var t = data.remindWay.split(',');
                                for (var i = 0; i < t.length; i++) {
                                    if (t[i] == "0") {
                                        str = str + "系统,";
                                    } else if (t[i] == "1") {
                                        str = str + "邮箱,";
                                    } else if (t[i] == "2") {
                                        str = str + "短信,";
                                    } else if (t[i] == "3") {
                                        str = str + "短信,";
                                    }
                                }
                                str = str.substring(0, str.length - 1);
                            }
                            return str;
                        },
                        width: 100
                    },
                    {
                        title: this.$t("gb.common.createTime"),
                        fieldName: "createDate",
                        filterType: "date",
                        width: 180
                    }
                ]
            }),
            editModel: {
                //控制编辑组件显示
                title: "新增提醒",
                //显示编辑弹框
                show: false,
                //编辑模式操作类型
                type: "create",
                id: null
            },
            uploadModel: {
                url: "/checkmethod/importExcel"
            },
            exportModel: {
                url: "/remind/exportExcel",
                withColumnCfgParam: true
            }
        }

    };


    //使用Vue方式，对页面进行事件和数据绑定
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
    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        template: tpl,
        components: {
            "detailPanel": detailPanel
        },
        data: dataModel,
        methods: {
            doCategoryChange: function(obj) {

            },
            doDetailClose: function() {
                this.editModel.show = false;
                this.detailModel.show = false;
            },
            doDelete: function() {
                var _this = this;

                var deleteIds = _.map(_this.tableModel.selectedDatas, function(row) {
                    return row.id
                });
                API.delete(null, deleteIds).then(function(res) {
                    if (res.data && res.data.error != "0") {
                        LIB.Msg.warning(res.data.message);
                    } else {
                        LIB.Msg.info("删除成功!");
                        _this.emitMainTableEvent("do_update_row_data", {
                            opType: "remove",
                            value: _this.tableModel.selectedDatas
                        });
                    }
                });
            },
            doUpdate: function() {
                var rows = this.tableModel.selectedDatas;
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量修改数据");
                    return;
                }
                this.showDetail(rows[0], { opType: "update" });
            }
        },
        init: function () {
            this.$api = API;
        }
    });

    return vm;
});