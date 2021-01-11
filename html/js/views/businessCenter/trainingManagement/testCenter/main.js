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
            moduleCode: "examSchedule",
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
                    url: "examschedule/mine{/curPage}{/pageSize}",
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
                            width: 160
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
                            title: "允许考试时间（开始）",
                            fieldName: "entryStartTime",
                            filterType: "date",
                            width: 180
                        },
                        {
                            title: "允许考试时间（结束）",
                            fieldName: "entryDeadline",
                            filterType: "date",
                            width: 180
                        },
                        {
                            //状态 0待开始 1已开始 2已结束
                            title: "考试状态",
                            fieldName: "status",
                            fieldType: "custom",
                            showTip: false,
                            render: function (data) {
                            	if (data.disable == 1) {
                            		return "已取消";
                            	}else if (data.status == 0) {
                                    return '<span style="color: red">待开始</span>';
                                } else if (data.status == 1 && data.paperRecord) {
                                    return "已交卷";
                                } else if (data.status == 1 && !data.paperRecord) {
                                    return '<span style="color: red">已开始</span>';
                                } else if (data.status == 2 && data.paperRecord) {
                                    return "已结束";
                                } else if (data.status == 2 && !data.paperRecord) {
                                    return "缺考";
                                }
                            },
                            filterType: "enum",
                            filterName: "criteria.intsValue.status",
                            popFilterEnum: LIB.getDataDicList("exam_schedule_status"),
                            width: 120
                        },
                        {
                            // title : "测试时间",
                            title: "考试时长",
                            fieldName: "examPaper.replyTime",
                            fieldType: "custom",
                            render: function (data) {
                                var res  = _.propertyOf(data.examPaper)("replyTime");
                                return res ? res + "分钟" : "";
                            },
                            orderName: "exampaper.reply_time",
                            filterType: "number",
                            width: 120
                        },
                        {
                            // title : "测试时间",
                            title: "答题时长",
                            fieldName: "paperRecord.testTime",
                            fieldType: "custom",
                            render: function (data) {
                                if (data.paperRecord) {
                                    var seconds = parseInt(data.paperRecord.testTime);// 秒
                                    if(_.isNaN(seconds)) {
                                        return '';
                                    }
                                    var hours = Math.floor(seconds / 3600);
                                    seconds = seconds - hours * 3600;
                                    var minutes = Math.floor(seconds / 60);
                                    seconds = seconds - minutes * 60;

                                    var result = '';
                                    result += hours > 0 ? hours + '时' : '';
                                    result += minutes > 0 ? minutes + '分' : '';
                                    result += seconds > 0 ? seconds + '秒' : '';

                                    return result;
                                } else {
                                    return '';
                                }

                            },
                            orderName: "paperrecord.test_time",
                            filterType: "number",
                            width: 120
                        },


                        {
                            //试卷总分
                            title: "试卷总分",
                            fieldName: "examPaper.score",
                            fieldType: "custom",
                            render: function (data) {
                                var res = _.propertyOf(data.examPaper)("score");
                                return res ? res + "分" : "";
                            },
                            filterType: "number",
                            orderName: "exampaper.score",
                            width: 120
                        },
                        {
                            title: "通过分数",
                            fieldName: "exam.passLine",
                            fieldType: "custom",
                            render: function (data) {
                                if (data.exam && data.exam.passLine) {
                                    return data.exam.passLine + "分";
                                }
                            },
                            filterType: "number",
                            orderName: "exam.pass_line",
                            width: 120
                        },
                        {
                            title: "考试得分",
                            fieldName: "paperRecord.userScore",
                            fieldType: "custom",
                            render: function (data) {
                                if (data.paperRecord) {
                                	if (data.paperRecord.userScore) {
                                        return parseInt(data.paperRecord.userScore) + "分";
                                    }
                                }else if(data.status == 2){
        							return  "0分";
        						}
                            },
                            filterType: "number",
                            orderName: "paperrecord.user_score",
                            width: 120
                        },
                        {
                            title: "交卷时间",
                            fieldName: "paperRecord.createDate",
                            filterName: "recordTime",
                            filterType: "date",
                            width: 180
                        },
                        {
                            //考试结果
                            title: "考试结果",
                            fieldName: "result",
                            fieldType: "custom",
                            render: function (data) {
                                if (data.paperRecord || data.status == 2) {
                                    return LIB.getDataDic("exam_result", data.result);
                                }
                            },
                            filterType: "enum",
                            filterName: "criteria.intsValue.result",
                            popFilterEnum: LIB.getDataDicList("exam_result"),
                            width: 120
                        },
                    ],
                    defaultFilterValue: {"criteria.orderValue": {fieldName: "exam.examDate", orderType: "1"}},
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/examSchedule/importExcel"
            },
            exportModel: {
                url: "/examSchedule/exportExcel"
            },
            //Legacy模式
//			formModel : {
//				examScheduleFormModel : {
//					show : false,
//				}
//			}

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
        },
        events: {},
        init: function () {
            this.$api = api;
        },
        ready: function () {
            var _this = this;
            window.addEventListener("storage", function (e) {
                if (e.key === "examPaperHandTime") {
                    if (_this.detailModel.show) {
                        _this.$broadcast('ev_handed_paper');
                    }
                    _this.$refs.mainTable.doRefresh();
                }
            });

            //首页跳转时根据首页对应搜索条件查询
            if(!!this.$route.query.state) {
                var statusColumn = _.find(this.tableModel.columns, function (item) {
                    return item.fieldName === "status";
                });
                if(!!statusColumn) {
                    if(this.$route.query.state == 1) {
                        this.$refs.mainTable.doOkActionInFilterPoptip(null, statusColumn, ['1']);
                    }else if(this.$route.query.state == 2) {
                        this.$refs.mainTable.doOkActionInFilterPoptip(null, statusColumn, ['0']);
                    }
                }
            }
        }
    });

    return vm;
});
