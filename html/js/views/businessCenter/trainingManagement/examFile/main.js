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
            moduleCode: "examSchedules",
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
                    url: "examschedule/list{/curPage}{/pageSize}",
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
                            title: "姓名",
                            fieldName: "user.name",
                            filterType: "text",
                            orderName: "user.username",
                            width: 120
                        },
                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.dept,
                        //{
                        //	title:"岗位",
                        //	fieldType:"custom",
                        //	render: function(data) {
                        //		if (data.user) {
                        //			if (data.user.positionList) {
                        //				var posNames = "";
                        //				data.user.positionList.forEach(function (e) {
                        //					if (e.postType == 0 && e.name) {
                        //						posNames += (e.name + "/");
                        //					}
                        //				});
                        //				posNames = posNames.substr(0, posNames.length - 1);
                        //				return posNames;
                        //
                        //			}
                        //		}
                        //	}
                        //},
                        //{
                        //	title:"安全角色",
                        //	fieldType:"custom",
                        //	render: function(data) {
                        //		if (data.user) {
                        //			if (data.user.positionList) {
                        //				var roleNames = "";
                        //				data.user.positionList.forEach(function (e) {
                        //					if (e.postType == 1 && e.name) {
                        //						roleNames += (e.name + "/");
                        //					}
                        //				});
                        //				roleNames = roleNames.substr(0, roleNames.length - 1);
                        //				return roleNames;
                        //
                        //			}
                        //		}
                        //	}
                        //},
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
                                return LIB.getDataDic("paper_create_type", _.propertyOf(data.examPaper)("attr2"));
                            },
                            filterType: "enum",
                            filterName: "criteria.strsValue.createType",
                            orderName: "exampaper.attr2",
                            popFilterEnum: LIB.getDataDicList("paper_create_type"),
                            width: 120
                        },
                        {
                            //状态 0待开始 1已开始 2已结束
                            title: "状态",
                            fieldName: "status",
                            fieldType: "custom",
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
                            width: 100
                        },
//					{
//						//考试结束时间
//						title: "考试结束时间",
//						fieldName: "endTime",
//						filterType: "date"
//					},
//					{
//						//考试开始时间
//						title: "考试开始时间",
//						fieldName: "startTime",
//						filterType: "date"
//					},
                        {
                            // title : "考试时间",
                            title: "交卷时间",
                            fieldName: "paperRecord.createDate",
                            filterType: "date",
                            filterName: "recordTime",
                            orderName: "paperrecord.create_date",
                            width: 180
                        },
                        {
                            // title : "测试时间",
                            title: "考试时长",
                            fieldName: "examPaper.replyTime",
                            fieldType: "custom",
                            render: function (data) {
                                var t = _.propertyOf(data.examPaper)("replyTime")
                                return t ? t + "分钟" : "";
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
                                return _.propertyOf(data.examPaper)("score") + "分";
                            },
                            orderName: "exampaper.score",
                            filterType: "number",
                            width: 120
                        },
                        {
                            title: "得分",
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
                            orderName: "paperrecord.user_score",
                            filterType: "number",
                            width: 120
                        },
                        {
                            title: "评估人",
                            fieldName: "attr1",
                            filterType: "text",
                            width: 120
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
                    defaultFilterValue: {"criteria.orderValue": {fieldName: "e.create_date", orderType: "1"}},
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/examSchedule/importExcel"
            },
            exportModel: {
                url: "/examschedule/exportExcel"
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
            //默认点击列为Code时,显示该列的详情
            doTableCellClick: function (data) {
                var val = data.entry.data;
                if (!!this.showDetail && data.cell.fieldName == "code") {
                    //&& val.paperRecord
                    if (val.status == "1" || val.status == "2") {
                        this.showDetail(data.entry.data);
                    }
                } else {
                    (!!this.detailModel) && (this.detailModel.show = false);
                }
            },
        },
        events: {},
        init: function () {
            this.$api = api;
        }
    });

    return vm;
});
