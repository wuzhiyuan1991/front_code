define(function (require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    var api = require("./vuex/api");
    var workTable = require("./table");
    var actions = require("app/vuex/actions");

    var today = new Date();
    var dataModel = function () {
        return {
            tasks: {
            	riCheckTask:[],
                radomObser: [],
                checkTask: [],
                pool: [],
                myTraining: [],
                testCenter: [],
                auditScore: [],
                asmtTask: [],
                secureMeetingTask: [],
                jsaMaster:[],
                isaAuditScore:[],
                equipment:[],
                riskJudgmentTask:[],
            },
            columns: {
                equipment:[
                    {
                        //设备设施名称
                        title: this.$t("bd.hal.equipmentName"),
                        fieldName: "name",
                        fieldType: "link",
                        pathCode: "BS_BaS_EqU",
                        width: 200
                    },
                    {
                        title: this.$t("bd.hal.equipmentType"),
                        fieldName: "equipmentType.name",
                        width: 160
                    },
                    {
                        //报废日期
                        title: "报废日期",
                        fieldName: "retirementDate",
                        filterType: "date"
                    },
                    {
                        //设备设施状态 0再用,1停用,2报废
                        title: "设备状态",
                        fieldName: "state",
                        fieldType: "custom",
                        render: function (data) {
                            return LIB.getDataDic("stateData",data.state);
                        },
                        width: 100
                    },

                ],
                radomObser: [
                    {
                        title: this.$t("gb.common.content"),
                        fieldType: "link",
                        fieldName: "content",
                        filterType: "text",
                        pathCode: "BC_RO_TD"
                    },
                    {
                        title: "检查对象",
                        // fieldName: "checkObj.name",
                        render:function (data) {
                            if(data && data.checkObj){
                                console.log(checkObj.name)
                                if(data.checkObj.name && (data.checkObj.name.indexOf(',')>-1)){
                                    var arr = _.union(data.checkObj.split(","));
                                    return arr.join(",")
                                } else{
                                    return data.checkObj.name;
                                }
                            }
                        }
                    },
                    {
                        title: this.$t("gb.common.checkTime"),
                        fieldName: "checkDate",
                        filterType: "date",
                        // width: 180
                    },  {
                        title: this.$t("bc.hal.source"),
                        fieldName: "checkSource",
                        render: function (data) {
                            return data.checkSource === '1' ? 'web录入' : '手机检查';
                        }
                    }, {
                        title: this.$t("gb.common.state"),
                        fieldName: "status",
                        render: function (data) {
                            return LIB.getDataDic("randomObservation_status", data.status);
                        }
                        // width: 100
                    }
                ],
                checkTask: [
                    {
                        title: "检查任务",
                        fieldName: "groupName",
                        render: function (data) {
                            return data.groupName + "#" + data.num;
                        },
                        fieldType: "link",
                        pathCode: "BC_HD_IT",
                    },
                    {
                        //检查对象
                        title: "检查对象",
                        render: function (data) {
                            if (data.checkPlan) {
                                var obj = _.union(_.pluck(data.checkPlan.checkObjects, 'name'));
                                return obj.join(', ')
                            }
                        },
                    },
                    {
                        //开始时间
                        title: this.$t("gb.common.startTime"),
                        fieldName: "startDate",
                        filterType: "date",
                        // width: 180
                    },
                    {
                        //结束时间
                        title: this.$t("gb.common.endTime"),
                        fieldName: "endDate",
                        filterType: "date",
                        // width: 180
                    }
                ],
                riTmpCheckTask: [
                    {
                        title: "临时工作任务",
                        fieldName:"groupName",
                        render: function (data) {
                            return data.groupName + "#" + data.num;
                        },
                        fieldType: "link",
                        pathCode: "BC_RI_TiT"
                    },
                    {
                        //开始时间
                        title: '任务开始时间',
                        fieldName: "startDate",
                    },
                    {
                        //结束时间
                        title: '任务结束时间',
                        fieldName: "endDate",
                    },
                ],
                opStdCard: [
                    {
                        title: "操作票",
                        fieldName: "name",
                        filterType: "text",
                        fieldType: "link",
                        pathCode: "BF_JsE_OsC"
                    },
                    {
                        title: "流程操作名称",
                        fieldName: "content",
                        filterType: "text",
                    },
                    LIB.tableMgr.column.dept,
                ],
                opMaintCard: [
                    {
                        title: "维修卡",
                        fieldName: "name",
                        filterType: "text",
                        fieldType: "link",
                        pathCode: "BF_JsE_OmC"
                    },
                    {
                        title: "检修内容",
                        fieldName: "content",
                        filterType: "text",
                    },
                    LIB.tableMgr.column.dept,
                ],
                opEmerCard: [
                    {
                        title: "应急处置卡",
                        fieldName: "name",
                        filterType: "text",
                        fieldType: "link",
                        pathCode: "BF_JsE_OeC"
                    },
                    LIB.tableMgr.column.dept,
                ],
                riCheckTask: [
	                  {
	                      title: "巡检任务",
	                      fieldName: "name",
                          fieldType: "link",
                          pathCode: "BC_RI_RcT"
	                  },
	                  {
	                      title: "巡检表",
	                      filedName:"riCheckTable.name",
	                      render: function (data) {
	                          if (data.riCheckTable) {
	                              return data.riCheckTable.name;
	                          }
	                      },
	                  },
	                  {
	                      //开始时间
	                      title: this.$t("gb.common.startTime"),
	                      fieldName: "startDate",
	                      filterType: "date",
	                      // width: 180
	                  },
	                  {
	                      //结束时间
	                      title: this.$t("gb.common.endTime"),
	                      fieldName: "endDate",
	                      filterType: "date",
	                      // width: 180
	                  }
	              ],
                jsaMaster: [
                    {
						title: "票/卡名称",
						fieldName: "opCard.name",
						orderName: "opCard.name",
                        fieldType: "link",
                        pathCode: "BC_JsE_JM",
                        render: function (data) {
                            return _.get(data, "opCard.attr1", "") + " - " + _.get(data, "opCard.name", "")
                        }
					},
					{
						title: "作业单位",
						fieldName: "construction"
					},
					{
						//作业内容
						title: "作业内容",
						fieldName: "taskContent"
					},
					{
						//分析小组组长
						title: "分析组长",
						fieldName: "analyseLeader"
					},
                    {
						title: "分析人员",
						fieldName: "analysePerson"
					},
                    {
						//作业日期
						title: "作业日期",
						fieldName: "workDate",
                        render: function (data) {
                            var d = _.get(data, "workDate", "");
                            return d.substr(0, 10)
                        }
					},
                ],
                pool: [
                    {
                        //title: "问题描述",
                        title: this.$t("gb.common.problemDesc"),
                        fieldName: "problem",
                        filterName: "criteria.strValue.problem",
                        filterType: "text",
                        fieldType: "link",
                        pathCode: "BC_HG_T"
                        // width: 320
                    },
                    {
                        //title: "建议措施",
                        title: this.$t("gb.common.recMeasure"),
                        fieldName: "danger",
                        filterName: "criteria.strValue.danger",
                        filterType: "text",
                        // width: 320
                    }, {
                        //title: "登记日期",
                        title: this.$t("bc.hal.registratDate"),
                        fieldName: "registerDate",
                        filterType: "date",
                        // width: 180
                    },
                    {
                        //title: "风险等级",
                        title: this.$t("gb.common.riskGrade"),
                        orderName: "riskLevel",
                        fieldType: "custom",
                        filterType: "text",
                        hideTip: true,
                        filterName: "criteria.strValue.riskLevel",
                        render: function (data) {
                            if (data.riskLevel) {
                                var riskLevel = JSON.parse(data.riskLevel);
                                var resultColor = _.propertyOf(JSON.parse(data.riskModel))("resultColor");
                                if (riskLevel && riskLevel.result) {
                                    //return riskLevel.result;
                                    if (resultColor) {
                                        return "<span style='background:\#" + resultColor + ";color:\#" + resultColor + ";margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" + riskLevel.result;
                                    } else {
                                        return "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" + riskLevel.result;
                                    }
                                } else {
                                    return "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" + "无";
                                    //return "无";
                                }
                            } else {
                                return "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" + "无";
                                //return "无";
                            }
                        },
                        // width: 120
                    }, {
                        title: this.$t("gb.common.state"),
                        orderName: "status",
                        fieldType: "custom",
                        filterType: "enum",
                        filterName: "criteria.intsValue.status",
                        popFilterEnum: LIB.getDataDicList("pool_status"),
                        render: function (data) {
                            return LIB.getDataDic("pool_status", data.status);
                        },
                        // width: 120
                    }
                ],
                myTraining: [
                    {
                        //课程名称
                        title: "课程名称",
                        fieldName: "course.name",
                        filterType: "text",
                        orderName: "courseId",
                        fieldType: "link",
                        pathCode: "BC_TM_MT"
                        // width: 240
                    },
                    {
                        //title : "培训方式",
                        title: this.$t("bd.trm.trainingMode"),
                        fieldType: "custom",
                        render: function (data) {
                            return LIB.getDataDic("course_type", data.course.type);
                        },
                        // width: 120
                    },
                    {
                        //title : "任务类型",
                        title: "任务类型",
                        fieldType: "custom",
                        render: function (data) {
                            return LIB.getDataDic("train_task_type", data.source);
                        },
                        // width: 120
                    },
                    {
                        title: "开始时间",
                        fieldName: "startTime",
                    },
                    {
                        //学习进度
                        title: "完成进度",
                        fieldType: "custom",
                        filterType: "text",
                        render: function (data) {
                            return data.percent + "%";
                        },
                    }
                ],
                testCenter: [
                    {
                        //唯一标识
                        title: "试卷名称",
                        fieldType: "link",
                        fieldName: "examPaper.name",
                        pathCode: "BC_TM_TC",
                        width: 240
                    },
                    {
                        //试卷总分
                        title: "试卷总分",
                        fieldName: "examPaper.score",
                        fieldType: "custom",
                        render: function (data) {
                            return data.examPaper.score + "分";
                        }
                    },
                    {
                        //考试开始时间
                        title: "考试时间",
                        fieldName: "startTime",
                        filterType: "date",
                        // width: 180
                    },
                    {
                        // title : "测试时间",
                        title: "考试时长",
                        fieldName: "examPaper.replyTime",
                        render: function (data) {
                            return data.examPaper.replyTime + "分钟";
                        },
                    }
                ],
                auditScore: [
                    {
                        //名称
                        title: this.$t("gb.common.reviewPlan"),
                        fieldName: "name",
                        filterType: "text",
                        fieldType: "link",
                        pathCode: "BC_SA_AS"
                        // width: 240
                    },
                    {
                        //名称
                        title: this.$t("gb.common.reviewTable"),
                        fieldName: "auditTable.name",
                        orderName: "audittable.name",
                        filterType: "text",
                        // width: 220
                    },
                    {
                        //开始时间
                        title: this.$t("gb.common.startTime"),
                        fieldName: "startDate",
                        filterType: "date",
                        // width: 180
                    },
                    {
                        //结束时间
                        title: this.$t("gb.common.endTime"),
                        fieldName: "endDate",
                        filterType: "date",
                        // width: 180
                    }
                ],
                isaAuditScore: [
                    {
                        //名称
                        title: this.$t("gb.common.reviewPlan"),
                        fieldName: "name",
                        fieldType: "link",
                        filterType: "text",
                        pathCode: "BC_SA_IAS"
                        // width: 240
                    },
                    {
                        //名称
                        title: this.$t("gb.isa.reviewTable"),
                        fieldName: "auditTable.name",
                        orderName: "audittable.name",
                        filterType: "text",
                        // width: 220
                    },
                    {
                        //开始时间
                        title: this.$t("gb.common.startTime"),
                        fieldName: "startDate",
                        filterType: "date",
                        // width: 180
                    },
                    {
                        //结束时间
                        title: this.$t("gb.common.endTime"),
                        fieldName: "endDate",
                        filterType: "date",
                        // width: 180
                    }
                ],
                asmtTask: [
                    {
                        title: '计划名称',
                        fieldName: 'asmtPlan.name',
                        fieldType: "link",
                        pathCode: "BC_LS_AT",

                    },
                    {
                        title: '自评表名称',
                        fieldName: 'asmtTable.name'
                    },
                    {
                        title: '开始时间',
                        fieldName: 'startDate'
                    },
                    {
                        title: '结束时间',
                        fieldName: 'endDate'
                    }
                ],
                secureMeetingTask: [
                    
                    {
                        title: '会议名称',
                        fieldName: 'meetingName',
                        fieldType: "link",
                        pathCode: "S_METTING"
                    },
                    {
                        title: '开始时间',
                        fieldName: 'startDate'
                    },
                    {
                        title: '结束时间',
                        fieldName: 'endDate'
                    }
                ],
                riskJudgmentTask:[
                    {
                        title: '研判日期',
                        fieldName: 'ratedCompleteDate',
                        fieldType: "link",
                        render: function (data) {
                            var d = _.get(data, "ratedCompleteDate", "");
                            return d.substr(0, 10)
                        },
                        pathCode: "BC_ISA_RJT"
                    },
                    {
                        title: '研判负责单位',
                        fieldName: 'unitName'
                    },
                    {
                        title: '研判层级',
                        fieldName: 'levelName'
                    },
                    {
                        title: '额定完成时间',
                        fieldName: 'ratedCompleteDate',
                        render: function (data) {
                            var d = _.get(data, "ratedCompleteDate", "");
                            return d.substr(11,5);
                        },
                    },
                ],
                inspectionCheckTask: [
                    {
                        title: "巡检任务",
                        fieldName: "groupName",
                        render: function (data) {
                            return data.groupName + "#" + data.num;
                        },
                        fieldType: "link",
                        pathCode: "BC_HD_IT_INSPECTION",
                    },
                    {
                        //检查对象
                        title: "检查对象",
                        render: function (data) {
                            if (data.checkPlan) {
                                var obj = _.union(_.pluck(data.checkPlan.checkObjects, 'name'));
                                return obj.join(', ')
                            }
                        },
                    },
                    {
                        //开始时间
                        title: this.$t("gb.common.startTime"),
                        fieldName: "startDate",
                        filterType: "date",
                        // width: 180
                    },
                    {
                        //结束时间
                        title: this.$t("gb.common.endTime"),
                        fieldName: "endDate",
                        filterType: "date",
                        // width: 180
                    }
                ],
                jobCheckTask: [
                    {
                        title: "周期性工作任务",
                        fieldName: "groupName",
                        render: function (data) {
                            return data.groupName + "#" + data.num;
                        },
                        fieldType: "link",
                        pathCode: "BC_HD_IT_JOB",
                    },
                    {
                        //开始时间
                        title: this.$t("gb.common.startTime"),
                        fieldName: "startDate",
                        filterType: "date",
                        // width: 180
                    },
                    {
                        //结束时间
                        title: this.$t("gb.common.endTime"),
                        fieldName: "endDate",
                        filterType: "date",
                        // width: 180
                    }
                ],
            },
            titles: {
            	jsaMaster:"票卡任务",
            	riCheckTask:"巡检任务",
                radomObser: '随机观察',
                checkTask: '检查任务',
                pool: '隐患治理',
                myTraining: '我的培训',
                testCenter: '我的考试',
                auditScore: '安全体系管理',
                asmtTask: '自评任务',
                secureMeetingTask: '安全会议',
                isaAuditScore: '审核评分',
                equipment:"即将过期设备",
                riTmpCheckTask:"临时工作任务",
                opStdCard:"操作票审核任务",
                opMaintCard:"维检修作业卡审核任务",
                opEmerCard:"应急处置卡审核任务",
                riskJudgmentTask:"风险研判任务",
                inspectionCheckTask:"巡检任务",
                jobCheckTask:"周期性工作任务"
            },
            newTitles:{
                jsaMaster:"票卡任务",
                riCheckTask:"巡检任务",
                radomObser: '随机观察',
                checkTask: '检查任务',
                pool: '隐患治理',
                myTraining: '我的培训',
                testCenter: '我的考试',
                auditScore: '安全体系管理',
                asmtTask: '自评任务',
                secureMeetingTask: '安全会议',
                isaAuditScore: '审核评分',
                equipment:"即将过期设备",
                riTmpCheckTask:"临时工作任务",
                opStdCard:"操作票审核任务",
                opMaintCard:"维检修作业卡审核任务",
                opEmerCard:"应急处置卡审核任务",
                riskJudgmentTask:"风险研判任务",
                inspectionCheckTask:"巡检任务",
                jobCheckTask:"周期性工作任务"
            },
            types: {
            	jsaMaster:"票卡任务",
            	riCheckTask:"巡检任务",
                radomObser: '随机观察',
                checkTask: '检查任务',
                pool: {
                    '0': '隐患登记',
                    '1': '任务分配',
                    '11': '任务分配',
                    '2': '隐患整改',
                    '3': '整改验证'
                },
                myTraining: '我的培训',
                testCenter: '我的考试',
                auditScore: '安全体系管理',
                asmtTask: '自评任务',
                secureMeetingTask: '安全会议',
                isaAuditScore: '审核评分',
                equipment:"即将过期设备",
                riTmpCheckTask:"临时工作任务",
                opStdCard:"操作票审核任务",
                opMaintCard:"维检修作业卡审核任务",
                opEmerCard:"应急处置卡审核任务",
                riskJudgmentTask:"风险研判任务",
                inspectionCheckTask:"巡检任务",
                jobCheckTask:"周期性工作任务"
            },
            actions: {
            	jsaMaster:"去作业",
            	riCheckTask: '去巡检',
                radomObser: '去完成',
                checkTask: '去检查',
                pool: {
                    '0': '去提交',
                    '1': '去处理',
                    '11': '去处理',
                    '2': '去整改',
                    '3': '去验证'
                },
                myTraining: '去培训',
                testCenter: '去考试',
                auditScore: '去评分',
                asmtTask: '去自评',
                secureMeetingTask: '安全会议',
                isaAuditScore: '去评分',
                equipment:"即将过期设备",
                riTmpCheckTask:"临时工作任务",
                opStdCard:"操作票审核任务",
                opMaintCard:"维检修作业卡审核任务",
                opEmerCard:"应急处置卡审核任务",
                riskJudgmentTask:"风险研判任务",
                inspectionCheckTask:"巡检任务",
                jobCheckTask:"周期性工作任务"
            },
            routes: {
            	jsaMaster: '/jse/businessCenter/jsaMasterNew?method=filterByUser&state=1',
            	riCheckTask: '/routingInspection/businessCenter/riCheckTask?method=filterByUser&state=1',
                radomObser: '/randomObserve/businessCenter/todo',
                checkTask: '/hiddenDanger/businessCenter/inspectionTask?method=filterByUser&state=1',
                pool: '/hiddenGovernance/businessCenter/regist',
                myTraining: '/trainingManagement/businessCenter/myTraining?state=1',
                testCenter: '/trainingManagement/businessCenter/testCenter?state=1',
                auditScore: '/safetyAudit/businessCenter/auditScore?state=1',
                asmtTask: '/leadership/businessCenter/asmtTask?method=filterByUser&state=1',
                secureMeetingTask: '/secureMeeting/businessFiles/Meeting?criteria.orderValue.fieldName=modifyDate&criteria.orderValue.orderType=1',
                isaAuditScore: '/isaSafetyAudit/businessCenter/auditScore?state=1',
                equipment:"/basicSetting/basicFile/equipment?expiring=1",
                riTmpCheckTask:"/routingInspection/businessCenter/tmpInspectionTask?method=filterByUser&state=1",
                opStdCard:"/jse/businessFiles/opStdCard?method=filterByUser",
                opMaintCard:"/jse/businessFiles/opMaintCard?method=filterByUser",
                opEmerCard:"/jse/businessFiles/opEmerCard?method=filterByUser",
                riskJudgmentTask:"/riskJudgment/businessFiles/personRiskJudgTask",
                inspectionCheckTask:"/hiddenDanger/businessCenter/inspectionTask?method=filterByUser&state=1&bizType=inspect&keepUrlParam=true",
                jobCheckTask:"/periodicWork/mgr/periodicask?method=filterByUser&state=1&bizType=job&keepUrlParam=true"
            },
            monthEvents: [],
            weekNames: ['日', '一', '二', '三', '四', '五', '六'],
            dateList: [],
            isShowDeadline: true,
            isBegin: true,
            qryModel: {
                date: today.Format(),
                taskState: 1,
                month: today.Format("yyyy-MM"),
                beginState: 1
            },
            isQuerying: false,
            isDateQuerying: false,
            auditFileTasks: null
        };
    };

    var pathCodeMap = {
        equipment:"BS_BaS_EqU",
    	jsaMaster:'BC_JsE_JM',
    	riCheckTask: 'BC_RI_RcT',
        radomObser: 'BC_RO_TD',
        checkTask: 'BC_HD_IT',
        pool: {
            '0': 'BC_HG_RG',
            '1': 'BC_HG_AG',
            '11': 'BC_HG_AG',
            '2': 'BC_HG_RF',
            '3': 'BC_HG_VF'
        },
        myTraining: 'BC_TM_MT',
        testCenter: 'BC_TM_TC',
        auditScore: 'BC_SA_AS',
        asmtTask: 'BC_LS_AT',
        secureMeetingTask: 'BC_LS_AT',
        isaAuditScore: 'BC_SA_IAS',
        riTmpCheckTask:"BC_RI_TiT",
        opStdCard:"BF_JsE_OsC",
        opMaintCard:"BF_JsE_OmC",
        opEmerCard:"BF_JsE_OeC",
        riskJudgmentTask:"BC_ISA_RJT",
        inspectionCheckTask: 'BC_HD_IT_INSPECTION',
        jobCheckTask: 'BC_HD_IT_JOB',

    };
    //首页效果
    var home = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic],
        template: template,
        components: {
            workTable: workTable
        },
        data: dataModel,
        computed: {
            hideEmptyTip: function () {
                var res = _.find(this.tasks, function (task) {
                    return task && task.list && task.list.length;
                });
                return !!res;
            }
        },
        methods: {
            changeMonth: function (first, end, current) {
                this.qryModel.month = current.substr(0, 7);
                this.getMonthEvent();
            },
            doDayClick: function (date) {
                this.qryModel.date = date.Format();
                this.getDateList();
            },
            doRefresh: function (t) {
                var _this = this;
                var params = {
                    type: t,
                    state: this.qryModel.beginState
                };
                this.$api.getTasks(params).then(function (res) {
                    _this.tasks[t] = res.data[t];
                    LIB.Msg.info("刷新成功");
                })
            },
            toggleTasks: function (toggle) {
                this.isBegin = toggle === 1;
                this.qryModel.beginState = toggle;
                this.getTasks();
                this.refreshUrls(toggle);
            },
            refreshUrls: function(toggle) {
                var _this = this;
                _.each(this.routes, function(url, key){
                    if(toggle == 1) {
                        _this.routes[key] = url.replace("state=2","state=1");
                    }else{
                        _this.routes[key] = url.replace("state=1","state=2");
                    }
                   
                })
            },
            setTitles: function(){
                var _this = this;
                _.each(this.titles, function(value, key){
                    if(_this.tasks[key]) {
                        _this.newTitles[key] = _this.titles[key] + "（" + _this.tasks[key].total + "）";
                    }
                });
            },
            // 左侧
            getTasks: function () {
                var _this = this;
                this.tasks = {
                	riCheckTask:[],
                	jsaMaster:[],
                    radomObser: [],
                    checkTask: [],
                    pool: [],
                    myTraining: [],
                    testCenter: [],
                    auditScore: [],
                    asmtTask: [],
                    secureMeetingTask:[],
                    isaAuditScore: [],
                    equipment:[],
                    riskJudgmentTask:[],
                    inspectionCheckTask:[],
                    jobCheckTask:[]
                };
                this.isQuerying = true;
                var params = {
                    state: this.qryModel.beginState
                };
                this.$api.getTasks(params).then(function (res) {
                    _this.tasks = res.data;
                    _this.setTitles();
                    _this.isQuerying = false;
                })
            },
            // 右下
            getDateList: function () {
                this.dateList = [];
                this.isDateQuerying = true;
                var _this = this;
                var params = {
                    state: this.qryModel.taskState,
                    qryDate: this.qryModel.date
                };
                this.$api.getDateList(params).then(function (res) {
                    _this.dateList = res.data;
                    _this.isDateQuerying = false;
                })
            },
            getMonthEvent: function () {
                var _this = this;
                var params = {
                    qryDate: this.qryModel.month
                };
                api.getMonthEvent(params).then(function (res) {
                    _this.monthEvents = res.data;
                })
            },
            toggleDateList: function (toggle) {
                this.isShowDeadline = toggle === 1;
                this.qryModel.taskState = toggle;
                this.getDateList();
            },
            doTaskClick: function (item) {
                var pathCode;
                if(item.type === 'pool') {
                    pathCode = pathCodeMap.pool[item.status];
                } else {
                    pathCode = pathCodeMap[item.type];
                }

                this.setGoToInfoData({
                    opt: {
                        path: LIB.PathCode[pathCode],
                        method: 'select'
                    },
                    vo: {
                        id: item.id,
                        code: item.code
                    }
                });
            },
            showTypes: function (item) {
                if(item.type === 'pool') {
                    return this.types.pool[item.status];
                }else {
                    return this.types[item.type];
                }
            },
            showActions: function (item) {
                if(item.type === 'pool') {
                    return this.actions.pool[item.status];
                }else {
                    return this.actions[item.type];
                }
            }
        },
        events: {},
        //初始化
        ready: function () {
            this.$api = api;
            this.getTasks();
            this.getDateList();
            // this.getMonthEvent();
        },
        vuex: {
            actions: {
                setGoToInfoData: actions.updateGoToInfoData
            }
        }
    });
    return home;
});
