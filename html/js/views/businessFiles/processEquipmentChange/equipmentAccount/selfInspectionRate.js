define(function (require) {
    var LIB = require('lib');
    var template = require("text!./selfInspectionRate.html");
    var objSelect = require("./objSelect")
    var dateUtils = require("./dateUtils");
    var multiInputSelect = require("componentsEx/multiInputSelector/main");
    var deptSelectModal = require("componentsEx/selectTableModal/deptSelectModal");
    var api = require('./vuex/api')
    var dataModel = function () {
        var current = new Date();
        var currYear = current.getFullYear();
        var times = {
            prevWeek: new Date(currYear, current.getMonth(), current.getDate() - 7),
            prevMonth: new Date(currYear, current.getMonth() - 1),
            prevQuarter: new Date(currYear, current.getMonth() - 3),
            prevYear: new Date(currYear - 1, current.getMonth())
        };
        return {
            datePickModel: {
                options: {
                    shortcuts: [
                        {
                            text: '本周', value: function () {
                            return [dateUtils.getWeekFirstDay(current), dateUtils.getWeekLastDay(current)];
                        }
                        },
                        {
                            text: '本月', value: function () {
                            return [dateUtils.getMonthFirstDay(current), dateUtils.getMonthLastDay(current)];
                        }
                        },
                        {
                            text: '本季度', value: function () {
                            return [dateUtils.getQuarterFirstDay(current), dateUtils.getQuarterLastDay(current)];
                        }
                        },
                        {
                            text: '本年', value: function () {
                            return [dateUtils.getYearFirstDay(current), dateUtils.getYearLastDay(current)];
                        }
                        },
                        {
                            text: '上周', value: function () {
                            return [dateUtils.getWeekFirstDay(times.prevWeek), dateUtils.getWeekLastDay(times.prevWeek)];
                        }
                        },
                        {
                            text: '上月', value: function () {
                            return [dateUtils.getMonthFirstDay(times.prevMonth), dateUtils.getMonthLastDay(times.prevMonth)];
                        }
                        },
                        {
                            text: '上季度', value: function () {
                            return [dateUtils.getQuarterFirstDay(times.prevQuarter), dateUtils.getQuarterLastDay(times.prevQuarter)];
                        }
                        },
                        {
                            text: '去年', value: function () {
                            return [dateUtils.getYearFirstDay(times.prevYear), dateUtils.getYearLastDay(times.prevYear)];
                        }
                        }
                    ]
                }
            },
            dateRange: [],
            objRange: [],
            tableModel:
                {
                    values: [],
                    columns: [
                        {
                            title: "编码",
                            fieldName: "code",
                            width:180,
                          
                        },
                        {

                            title: "变更项目",
                            fieldName: "projectName",
                           
                        },
                        {

                            title: "变更类别",
                            fieldName: "changeType",
                            render: function (data) {
                                if (data.useRangeEvaluation) {
                                    if (data.useRangeEvaluation.changeType == 1) {
                                        return '工艺'
                                    } else {
                                        return '设备'
                                    }
                                }
                            },
                            width:100,
                        },
                        {

                            title: "变更级别",
                            fieldName: "level",
                            render: function (data) {
                                if (data.level == 1) {

                                    return '一般变更'

                                } else if (data.level == 2) {
                                    return '重大变更'
                                } else {
                                    return '未评估'
                                }
                            },
                            width:100,
                        },
                        {

                            title: "主管部门",
                            render: function (data) {
                                if (data.competentDeptId) {
                                    return LIB.tableMgr.rebuildOrgName(data.competentDeptId, 'dept');
                                }
                            },
                          
                        },
                        {

                            title: "阶段性审批时间",
                            fieldName: "auditTime",
                         
                            width:150
                        },
                        {

                            title: "实施时间",
                            // fieldName: "applyDate",
                            render: function (data) {
                                return LIB.formatYMD(data.startTime)+'至'+LIB.formatYMD(data.endTime);
                            },
                           
                            width:170

                        },
                        {

                            title: "控制措施落实",
                            render: function (data) {
                                if (data.useRangeEvaluation) {
                                    return data.useRangeEvaluation.ctrlMeasureDesc
                                }
                            },
                          
                            width: 200

                        },
                        {

                            title: "资料更新落实",
                            fieldName: "content",
                            render: function (data) {
                                if (data.useRangeEvaluation) {
                                    return data.useRangeEvaluation.dataUpdateDesc
                                }
                            },
                           

                            width: 200
                        },

                    ]
                }
            ,
            tip: {
                show: false
            },
            depts: [],
            deptSelectModel: {
                visible: false,
                filterData: {
                    compId: null,
                    type: 2
                }
            },

        }
    };
    var opt = {
        template: template,
        components: {
            'objSelect': objSelect,
            'multiInputSelect': multiInputSelect,
            'deptSelectModal': deptSelectModal
        },
        data: function () {
            return new dataModel();
        },
        methods: {
            doSaveDepts: function (selectedDatas) {
                this.depts = selectedDatas

            },

            hasScrolled: function (element, direction) {
                if (direction === 'vertical') {
                    return element.scrollHeight > element.clientHeight;
                } else if (direction === 'horizontal') {
                    return element.scrollWidth > element.clientWidth;
                }
            },
            doSelectDept: function () {

                this.deptSelectModel.visible = true

            },
            doExport: function () {
                if (this.dateRange.length > 0 && this.depts.length > 0) {
                    var obj = {
                        'criteria.dateValue': JSON.stringify({ "startApplyDate": LIB.formatYMD(this.dateRange[0]), "endApplyDate": LIB.formatYMD(this.dateRange[1]) })
                    }
                    obj.orgId = this.depts[0].id
                    window.open("/pecapplication/exportLedger" + LIB.urlEncode(obj).replace("&", "?"));
                } else {
                    LIB.Msg.error('请选择查询条件')
                }

            },
            doQuery: function () {
                // criteria.dateValue: {"startApplyDate":"2020-11-12","endApplyDate":"2020-12-08 23:59:59"}
                var _this = this;
                
                if (this.dateRange.length > 0 && this.depts.length > 0) {
                    if (this.dateRange[0]==null) {
                        LIB.Msg.error('请选择查询条件')
                        return
                    }
                    var obj = {
                        'criteria.dateValue': JSON.stringify({ "startApplyDate": LIB.formatYMD(this.dateRange[0]), "endApplyDate": LIB.formatYMD(this.dateRange[1]) })
                    }
                    obj.orgId = this.depts[0].id

                    api.pecapplication(obj).then(function (res) {
                        if (res.data.length > 0) {
                            _this.tableModel.values = res.data
                            _this.$nextTick(function(){
                               
                            if ( _this.hasScrolled( $(".table-scroll-main-body").get(0),'vertical')  ) {
                                $("#changAccount .table-scroll-main-header").css('padding-right','17px')
                            }else{
                                $("#changAccount .table-scroll-main-header").css('padding-right','0px')
                            }
                            })
                        } else {
                            LIB.Msg.error('暂无数据')
                        }

                    })
                } else {
                    LIB.Msg.error('请选择查询条件')
                }

            },

        },
        ready: function () {
            // this.deptSelectModel.filterData.compId = LIB.user.compId
        }
    };
    return LIB.Vue.extend(opt);
});