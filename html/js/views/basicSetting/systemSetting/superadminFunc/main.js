define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    var dateUtils = require("views/reportManagement/tools/dateUtils");

    //数据模型
    var newVO = function () {
        return {
            compId: null,
            startDate: null,
            endDate:null
        }
    };
    var current = new Date();
    var currYear = current.getFullYear();
    var times = {
        prevWeek: new Date(currYear, current.getMonth(), current.getDate() - 7),
        prevMonth: new Date(currYear, current.getMonth() - 1),
        prevQuarter: new Date(currYear, current.getMonth() - 3),
        prevYear: new Date(currYear - 1, current.getMonth())
    };
    //初始化页面控件
    var dataModel = {
        moduleCode: LIB.ModuleCode.BS_BaC_ComI,
        mainModel: {
            vo: newVO(),
            title: null,
            today: new Date().Format(),
            dateRange:[]
            // showSuperAdminFunc: true,
            // showHistroy : false
        },
        isShowItem:true,
        isShowItem2:true,
        isShowUserSign:true,
        isShowItem3:true,
        isShowItem4:true,
        isShowItem5:true,
        isShowItem6:true,
        isShowItem7:true,
        isShowTrain: true,
        topSubMenu: 0,
        histories: [],
        historyModel: {
            columns: [
                {
                    title: '开始时间',
                    fieldName: 'createDate'
                },
                {
                    title: '结束时间',
                    fieldName: 'modifyDate'
                },
                {
                    title: '任务名称',
                    fieldName: 'name'
                },
                {
                    title: '任务内容',
                    fieldName: 'content'
                },
                {
                    title: '执行状态',
                    fieldName: 'pending',
                    render: function (data) {
                        var res = '';
                        switch(data.pending) {
                            case '1':
                                res = '执行中';
                                break;
                            case '0':
                                res= '执行完成';
                                break;
                        }
                        return res;
                    }
                },
                {
                    title: '执行结果',
                    fieldName: 'result',
                    render: function (data) {
                        var res = '';
                        switch(data.result) {
                            case '1':
                                res = '成功';
                                break;
                            case '0':
                                res= '失败';
                                break;
                        }
                        return res;
                    }
                },
            ]
        },
        questions: [],
        questionModel: {
            columns: [
                {
                    title: 'ID',
                    fieldName: 'id',
                    width: "120px"
                },
                {
                    title: '内容',
                    fieldName: 'modifyDate',
                    render:function (data) {
                        return JSON.stringify(data);
                    }
                }
            ]
        },
        datePickModel:{
            options:{
                shortcuts:[
                    {text: '本周',value: function() {return [dateUtils.getWeekFirstDay(current), dateUtils.getWeekLastDay(current)];}},
                    {text: '本月',value: function() {return [dateUtils.getMonthFirstDay(current), dateUtils.getMonthLastDay(current)];}},
                    {text: '本季度',value: function() {return [dateUtils.getQuarterFirstDay(current), dateUtils.getQuarterLastDay(current)];}},
                    {text: '本年',value: function() {return [dateUtils.getYearFirstDay(current), dateUtils.getYearLastDay(current)];}},
                    {text: '上周',value: function() {return [dateUtils.getWeekFirstDay(times.prevWeek), dateUtils.getWeekLastDay(times.prevWeek)];}},
                    {text: '上月',value: function() {return [dateUtils.getMonthFirstDay(times.prevMonth), dateUtils.getMonthLastDay(times.prevMonth)];}},
                    {text: '上季度',value: function() {return [dateUtils.getQuarterFirstDay(times.prevQuarter), dateUtils.getQuarterLastDay(times.prevQuarter)];}},
                    {text: '去年',value: function() {return [dateUtils.getYearFirstDay(times.prevYear), dateUtils.getYearLastDay(times.prevYear)];}}
                ]
            }
        },
        trainVO: {
            compId: '',
            dateRange: null,
            startDate: null,
            endDate: null,
            orgId:''
        }
    };
    //使用Vue方式，对页面进行事件和数据绑定
    var vm = LIB.Vue.extend({
        template: require("text!./main.html"),
        mixins : [LIB.VueMixin.mainPanel],
        data: function () {
            return dataModel
        },
        methods: {
            doTabs:function(data){
                var key = data.key;
                switch(key) {
                    case '1':
                        // console.log(1);
                        break;
                    case '2':
                        this.getHistory();
                        break;
                    case '3':
                        this.getQuestions();
                        break;
                }
            },
            // doShowSuperAdminFunc : function(){
            //     this.mainModel.showSuperAdminFunc = true;
            //     this.mainModel.showHistroy = false;
            // },
            // doShowHistroy : function(){
            //     this.mainModel.showSuperAdminFunc = false;
            //     this.mainModel.showHistroy = true;
            //     this.getHistory();
            // },
            //清除检查系列的业务数据
            clearCheckData: function(){
                var _this = this;
                var _vo = _this.mainModel.vo;

                if(!_vo) {
                    LIB.Msg.warning("请选择公司和日期");
                    return;
                }
                if(!_vo.compId) {
                    LIB.Msg.warning("请选择公司");
                    return;
                }
                if(!_this.mainModel.dateRange || _this.mainModel.dateRange.length === 0) {
                    LIB.Msg.warning("请选择日期");
                    return;
                } else {
                    _vo.startDate = _this.mainModel.dateRange[0].Format("yyyy-MM-dd 00:00:00");
                    _vo.endDate =  _this.mainModel.dateRange[1].Format("yyyy-MM-dd 23:59:59");
                }
                if (_vo.orgId && _vo.orgId !== _vo.compId) {
                    _vo.compId = _vo.orgId;
                }
                _this.$api.clearCheckData(null, _vo).then(function() {
                    _this.mainModel.vo = newVO();
                    _this.mainModel.dateRange = null;
                    LIB.Msg.info("删除正在执行中");
                });
            },
            //清除培训系列的业务数据
            clearTrainData: function(){
                var _this = this;
                var _vo = _this.trainVO;

                if(!_vo.compId) {
                    LIB.Msg.warning("请选择公司");
                    return;
                }
                if(!_vo.dateRange || _vo.dateRange.length === 0) {
                    LIB.Msg.warning("请选择日期");
                    return;
                } else {
                    _vo.startDate = _vo.dateRange[0].Format("yyyy-MM-dd 00:00:00");
                    _vo.endDate =  _vo.dateRange[1].Format("yyyy-MM-dd 23:59:59");
                }
                if (_vo.orgId && _vo.orgId !== _vo.compId) {
                    _vo.compId = _vo.orgId;
                }
                _this.$api.clearTrainData(null, _.omit(_vo, 'dateRange')).then(function() {
                    _vo.compId = null;
                    _vo.dateRange = null;
                    _vo.startDate= null;
                    _vo.endDate = null;
                    LIB.Msg.info("删除正在执行中");
                });
            },
            registerBatch:function() {
                var _this = this;
                api.registerbatch().then(function () {
                    LIB.Msg.info("正在注册!");
                });
            },
            removeBatch:function() {
                var _this = this;
                api.removeBatch().then(function () {
                    LIB.Msg.info("正在注销!");
                });
            },
            initMobileData:function () {
                var _this = this;
                var _vo = _this.mainModel.vo;
                if(!_vo.compId) {
                    LIB.Msg.warning("请选择公司");
                    return;
                }

                _this.$api.initMobileData(null, _vo).then(function() {
                    LIB.Msg.info("初始化完成");
                });
            },
            downLog: function() {
                window.open("/superadmin/serverlog");
            },
            relploginAllMobile:function () {
                var _this = this;

                _this.$api.mobileReloginAll().then(function() {
                    LIB.Msg.info("强制登录操作成功");
                });
            },
            syncForcedAppVersion:function () {
                this.$api.syncForcedAppVersion().then(function() {
                    LIB.Msg.info("同步成功");
                });

            },
            updateAllOrgAttr3:function () {
                this.$api.updateAllOrgAttr3().then(function() {
                    LIB.Msg.info("修改成功");
                });
            },
            getHistory: function () {
                var _this = this;
                this.$api.getHistory({type:1}).then(function (res) {
                    _this.histories = res.data;
                });
            },
            getQuestions: function (flag) {
                 var _this = this;
                this.$api.listQuestion().then(function (res) {
                    _this.questions = res.data;
                    if(flag) {
                        LIB.Msg.info("刷新成功");
                    }
                })
            },
            doFix: function (code) {
                var _this = this;
                var params = this.questions.filter(function (t) { return t.code === code });
                this.$api.fixQuestion(_.pick(params[0],"code")).then(function () {
                    LIB.Msg.info("已解决");
                    _this.getQuestions();
                })
            },
            updateRiskIdentificationEquipment: function () {
                this.$api.updateRiskIdentificationEquipment().then(function () {
                    LIB.Msg.info("修复成功");
                })
            }
        },
        ready: function () {
            this.$api = api;
        }
    });
    return vm;
});
