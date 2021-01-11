define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
//	var detailPanel = require("./detail-xl");

    var initDataModel = function () {
        return {
            moduleCode: "exam",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass: "middle-info-aside"
//				detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "exam/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "cb",
                        },
                        {
                            //唯一标识
                            title: "编码",
                            fieldName: "code",
                            fieldType: "link",
                            filterType: "text",
                            width: 220
                        },
                        {
                            //唯一标识
                            title: "试卷名称",
                            fieldName: "examPaper.name",
                            filterType: "text",
                            orderName: "exampaper.name",
                            width: 240
                        },
                        {
                            title: "组卷方式",
                            fieldType: "custom",
                            render: function (data) {
                                return LIB.getDataDic("paper_create_type", _.propertyOf(data.examPaper)('attr2'));
                            },
                            orderName: "exampaper.attr2",
                            filterType: "enum",
                            filterName: "criteria.strsValue.paperCreateType",
                            popFilterEnum: LIB.getDataDicList("paper_create_type"),
                            width: 120
                        },
                        {
                            // title : "测试时间",
                            title: "考试时长",
                            fieldName: "examPaper.replyTime",
                            //filterType: "text"
                            fieldType: "custom",
                            render: function (data) {
                                if (data.examPaper) {
                                    return data.examPaper.replyTime + "分钟";
                                }

                            },
                            filterType: "number",
                            orderName: "exampaper.reply_time",
                            width: 100
                        },
                        {
                            //试卷总分
                            title: "试卷总分",
                            fieldName: "examPaper.score",
                            fieldType: "custom",
                            render: function (data) {
                                if (data.examPaper) {
                                    return data.examPaper.score + "分";
                                }
                            },
                            filterType: "number",
                            orderName: "exampaper.score",
                            width: 100
                        },
                        // {
                        //     //考试开始时间
                        //     title: "允许考试时间（开始）",
                        //     fieldName: "examDate",
                        //     filterType: "date",
                        //     width: 180
                        // },
                        // {
                        //     //考试截止时间
                        //     title: "允许考试时间（结束）",
                        //     fieldName: "entryDeadline",
                        //     filterType: "date",
                        //     width: 180
                        // },
                        {
                            title: this.$t("gb.common.state"),
                            orderName: "disable",
                            fieldType: "custom",
                            render: function (data) {
                                return LIB.getDataDic("exam_Published", data.disable);
                            },
                            popFilterEnum: LIB.getDataDicList("exam_Published"),
                            filterName: "criteria.intsValue.disable",
                            filterType: "enum",
                            width: 100
                        },
                        {
                            //考试时间
                            title: "发布时间",
                            fieldName: "modifyDate",
                            filterType: "date",
                            fieldType: "custom",
                            render: function (data) {
                                if (data.disable == 0) {
                                    return data.modifyDate;
                                } else {
                                    return "";
                                }
                            },
                            width: 180
                        },
                        //{
                        //	//修改日期
                        //	title: "修改日期",
                        //	fieldName: "modifyDate",
                        //	filterType: "date"
                        //},
                        //{
                        //	//创建日期
                        //	title: "创建日期",
                        //	fieldName: "createDate",
                        //	filterType: "date"
                        //},
                    ],
                    defaultFilterValue : {"type":"1"},
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/exam/importExcel"
            },
            exportModel: {
                url: "/exam/exportExcel"
            }
        };
    }

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel
        },
        methods: {
            //修改方法,滑出编辑页面
            doUpdate: function () {
                var rows = this.tableModel.selectedDatas;
                var row = rows[0];

                if(row.disable === '0') {
                    LIB.Msg.warning("【已发布】状态不能编辑,请重新选择!");
                    return;
                }
                this.showDetail(row, {opType: "update"});

            },
            //发布
            doPublish: function () {
                var _this = this;
                var rows = this.tableModel.selectedDatas;
                if (rows.length == 0) {
                    LIB.Msg.warning("请选择数据!");
                    return;
                }
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量发布数据");
                    return;
                }
                if(rows[0].disable === '2') {
                    LIB.Msg.warning("【已取消】状态不能发布,请重新选择!");
                    return;
                }
                if(rows[0].disable === '0') {
                    LIB.Msg.warning("【已发布】状态不能发布,请重新选择!");
                    return;
                }
                
                var vo = rows[0];
                vo.users = null;
                vo.examSchedules = null;
                api.publish(vo).then(function (res) {
                    _.each(rows, function (row) {
                        row.disable = "0";
                    });
                    LIB.Msg.info("已发布!");
                    _this.refreshMainTable();
                });
            },
            //取消发布
            doCancelPublish: function () {
                var _this = this;
                var rows = this.tableModel.selectedDatas;
                if(rows[0].disable === '2') {
                    LIB.Msg.warning("【已取消】状态不能发布,请重新选择!");
                    return;
                }
                if (rows[0].disable === '1') {
                    LIB.Msg.warning("【未发布】状态不能取消,请重新选择!");
                    return;
                }

                var vo = rows[0];
                api.cancelPublish({
                    id: vo.id,
                    orgId: vo.orgId
                }).then(function (res) {
                    _.each(rows, function (row) {
                        row.disable = "1";
                    });
                    LIB.Msg.info("取消发布!");
                    _this.refreshMainTable();

                });

            },
            beforeDoDelete: function () {
                var row = this.tableModel.selectedDatas[0];
                if(row.disable !== '1') {
                    LIB.Msg.warning("当前状态不能删除");
                    return false;
                }
                row.examSchedules = [];
                return true
            }
        },
        events: {
            "ev_dtPublish": function () {
                this.refreshMainTable();
                this.detailModel.show = false;
            }
        },
        init: function () {
            this.$api = api;
        }
    });

    return vm;
});
