define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面
    var detailPanel = require("./detail");
    //Vue数据模型
    var dataModel = function () {
        return {
            moduleCode: LIB.ModuleCode.BS_DaS_MaiL,
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "logmail/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "cb"
                        }, {
                            title: this.$t("das.oniu.recipient"),
                            fieldName: "email",
                            fieldType: "link",
                            filterType: "text",
                            filterName: "email",
                            width: 220
                        }, {
                            title: this.$t("das.oniu.title"),
                            fieldName: "title",
                            filterType: "text",
                            filterName: "title",
                            width: 160

                        }, {
                            title: this.$t("gb.common.content"),
                            fieldName: "content",
                            filterType: "text",
                            filterName: "content",
                            width: 480

                        }, {
                            title: this.$t("das.oniu.sendTime"),
                            fieldName: "createDate",
                            filterType: "date",
                            filterName: "createDate",
                            width: 180

                        }, {
                            title: this.$t("das.oniu.sendStatus"),
                            fieldName: "status",
                            fieldType: "custom",
                            filterType: "enum",
                            filterName: "criteria.intsValue.status",
                            popFilterEnum: LIB.getDataDicList("mail_status"),
                            render: function (data) {
                                return LIB.getDataDic("mail_status", data.status);
                                // if (data.status == '0') {
                                //     return "失败";
                                // } else if (data.status == "1") {
                                //     return "成功";
                                // } else {
                                //     return "";
                                // }
                            },
                            width: 100
                        }, {
                            title: this.$t("das.oniu.errorLog"),
                            fieldName: "errorlog",
                            filterType: "text",
                            filterName: "errorlog",
                            width: 480
                        }]
                }
            ),
            //控制全部分类组件显示
            mainModel: {
                //显示分类
                showCategory: false,
                showHeaderTools: false,
            },
            editModel: {
                //控制编辑组件显示
                title: "新增",
                //显示编辑弹框
                show: false,
                //编辑模式操作类型
                type: "create",
                id: null
            },
            //控制右侧滑出组件显示
            detailModel: {
                show: false
            },
            exportModel : {
                url: "/logmail/exportExcel",
                withColumnCfgParam: true
            },
        }
    };
    var vm = LIB.VueEx.extend({
        template: tpl,
        data: dataModel,
        components: {
            "detailPanel": detailPanel
        },
        methods: {
            //显示详情
            showDetail: function (row) {
                this.detailModel.show = true;
                this.$broadcast('ev_detailReload', row);
            },
            doTableCellClick: function (data) {
                if (!!this.showDetail && data.cell.fieldName == "email") {
                    this.showDetail(data.entry.data);
                } else {
                    (!!this.detailModel) && (this.detailModel.show = false);
                }
            },
            //显示全部分类
            doShowCategory: function () {
                this.mainModel.showCategory = !this.mainModel.showCategory;
            },
            //新增方法
            doAdd: function () {
                this.editModel.show = true;
                this.editModel.title = "新增";
                this.editModel.opType = "create";
                this.editModel.id = null;
                this.$broadcast('ev_editReload', null);
            },
            //修改方法
            doUpdate: function () {
                var rows = this.tableModel.selectedDatas;

                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量修改数据");
                    return;
                }
                var row = rows[0];
                this.editModel.show = true;
                this.editModel.title = "修改";
                this.editModel.opType = "update";
                this.editModel.id = row.id;
                this.$broadcast('ev_editReload', row.id);
            }
        },
        //响应子组件$dispatch的event
        //events : {
        //    //edit框点击保存后事件处理
        //    "ev_editFinshed" : function(data) {
        //        this.emitMainTableEvent("do_update_row_data", {opType:"update", value: data});
        //        this.editModel.show = false;
        //    },
        //    //edit框点击取消后事件处理
        //    "ev_editCanceled" : function() {
        //        this.editModel.show = false;
        //    }
        //}
    });
    return vm;
});
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