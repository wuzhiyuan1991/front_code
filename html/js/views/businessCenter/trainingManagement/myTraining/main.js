define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
//    var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
    var detailPanel = require("./detail-xl");

    var initDataModel = function () {
        return {
            moduleCode: "trainTask",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass: "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "traintask/mine/list{/curPage}{/pageSize}",
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
                            //课程名称
                            title: "课程名称",
                            fieldName: "course.name",
                            filterType: "text",
                            orderName: "courseId",
                            width: 240
                        },
                        {
                            //课程类型
                            title: "课程类型",
                            fieldName: "course.attr1",
                            filterType: "text",
                            orderName: "course.attr1",
                            width: 200
                        },
                        {
                            //title : "任务类型",
                            title: "任务类型",
                            fieldType: "custom",
                            render: function (data) {
                                return LIB.getDataDic("train_task_type", data.source);
                            },
                            filterType: "enum",
                            filterName: "criteria.intsValue.source",
                            orderName: "source",
                            popFilterEnum: LIB.getDataDicList("train_task_type"),
                            width: 120
                        },
                        {
                            //title : "培训方式",
                            title: this.$t("bd.trm.trainingMode"),
                            fieldType: "custom",
                            render: function (data) {
                                return LIB.getDataDic("course_type", _.propertyOf(data.course)("type"));
                            },
                            filterType: "enum",
                            filterName: "criteria.intsValue.type",
                            orderName: "course.type",
                            popFilterEnum: LIB.getDataDicList("course_type"),
                            width: 120
                        },
                        {
                            //复培周期
                            title: "复培周期",
                            filterType: "text",
                            fieldType: "custom",
                            render: function (data) {
                                //if (data.source == 1) {
                                	if(data.matrix && data.attr2 != 1) {
	                                	var frequence = data.matrix.frequence == null ? 0 : data.matrix.frequence;
	                                	if (frequence == 0) {
	                                        return "无需复培";
	                                	}else{
	                                		return parseFloat(frequence) + "个月";
	                                	}
                                	}else{
                                		return "无需复培";
                                	}
                                //} else {
                                //    return "无需复培";
                                //}
                                /*return LIB.getDataDic("course_frequency",parseFloat(data.course.frequence)+"");*/
                            },
                            filterName: "criteria.strValue.frequence",
                            orderName: "course.frequence",
                            width: 120
                        },



                        {
                            title: "培训开始时间",
                            fieldName: "startTime",
                            filterType: "date",
                            filterName: "startTime",
                            width: 180
                        },
                        {
                            title: "培训结束时间",
                            fieldName: "endTime",
                            filterType: "date",
                            filterName: "endTime",
                            width: 180
                        },
                        {
                            title: "允许考试时间（开始）",
                            fieldName: "examSchedule.entryStartTime",
                            filterType: "date",
                            filterName: "entryStartTime",
                            width: 180
                        },
                        {
                            title: "允许考试时间（结束）",
                            fieldName: "examSchedule.entryDeadline",
                            filterType: "date",
                            filterName: "entryDeadline",
                            orderName: "examschedule.entry_deadline",
                            width: 180
                        },
                        {
                            //学习进度
                            title: "完成进度",
                            fieldType: "custom",
                            filterType: "text",
                            render: function (data) {
                                return data.percent + "%";
                            },
                            filterName: "percent",
                            orderName: "percent",
                            width: 120
                        },
                        {
                            title: "考试得分",
                            fieldName: "score",
                            fieldType: "custom",
                            render: function (data) {
                                if (data.score) {
                                    return parseInt(data.score) + "分";
                                }
                            },
                            filterType: "number",
                            width: 120
                        },
                        {
                            //title : "培训状态",
                            title: "培训结果",
                            fieldName: "status",
                            fieldType: "custom",
                            showTip: false,
                            render: function (data) {
                                var status = data.status;
                                if (data.course.type == 1 && data.status == 2 && data.endTime < data.trainDate) {
                                	status = '7';
                                }
                                if(data.course.type == 1 && data.status == 0 && new Date(data.endTime).getTime() < new Date().getTime()) {
                                	status = '6';
                            	}
                                
                                var item = LIB.getDataDic('train_task_result', status);
                                
                                if (status == 2 || status == 7) {
                                    return "<span style='color:#009900'>" + item + "</span>"
                                } else if (status == 1 || status == 3) {
                                    return "<span style='color:red'>" + item + "</span>"
                                } else {
                                    return "<span style='color:#8c6666'>" + item + "</span>"
                                }

                            },
                            filterType: "enum",
                            filterName: "criteria.intsValue.status",
                            orderName: "status",
                            popFilterEnum: LIB.getDataDicList("train_task_result"),
                            width: 120
                        },
                        {
                            title: "通过时间",
                            fieldName: "trainDate",
                            filterType: "date",
                            fieldType: "custom",
                            render: function (data) {
                                if (data.status == 2 || data.status == 3) {
                                    return data.trainDate;
                                }
                            },
                            filterName: "trainDate",
                            width: 180
                        },
                        //{
                        //	//培训开始时间
                        //	title: "完成时间",
                        //	fieldName: "createDate",
                        //	filterType: "date"
                        //},
                    ],
                    defaultFilterValue: { "criteria.orderValue": { fieldName: "endTime", orderType: "1" } }
                }
            ),
            detailModel: {
                show: false,
                id: null
            },
            uploadModel: {
                url: "/trainTask/importExcel"
            },
            exportModel: {
                url: "/trainTask/exportExcel"
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

        },
        events: {},
        ready: function () {
            this.$api = api;
            if (!!window.isClickTrainingTaskExecutBtn) {
                this.detailModel.show = true;
                this.$broadcast('ev_dtReload', null, this.detailModel.id);
                window.isClickTrainingTaskExecutBtn = false;
            }

            //首页跳转时根据首页对应搜索条件查询
            if(!!this.$route.query.state) {
                var statusColumn = _.find(this.tableModel.columns, function (item) {
                    return item.fieldName === "status";
                });
                if(!!statusColumn) {
                    if(this.$route.query.state == 1) {
                        this.$refs.mainTable.doOkActionInFilterPoptip(null, statusColumn, ['0']);
                    }else if(this.$route.query.state == 2) {
                        this.$refs.mainTable.doOkActionInFilterPoptip(null, statusColumn, ['5']);
                    }
                }
            }
        },
        route: {
            activate: function (transition) {
                var queryObj = transition.to.query;
                if (queryObj.id && queryObj.method == "detail") {
                    this.detailModel.id = queryObj.id;
                }
                transition.next();
            }
        }
    });

    return vm;
});
