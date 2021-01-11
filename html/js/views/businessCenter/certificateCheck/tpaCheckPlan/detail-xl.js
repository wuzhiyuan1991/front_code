define(function(require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail-xl.html");
    var tpaCheckTableSelectModal = require("componentsEx/selectTableModal/tpaCheckTableSelectModal");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var tpaBoatEquipmentSelectModal = require("componentsEx/selectTableModal/boatSelectModal");
    //初始化数据模型
    var newVO = function() {
        return {
            //id
            id: null,
            //
            code: null,
            //计划名
            name: null,
            //结束时间
            endDate: null,
            //开始时间
            startDate: null,
            //
            compId: null,
            //组织id
            orgId: null,
            //类型 0执行一次 1重复执行
            // checkType : null,
            //是否禁用，0未发布，1发布
            disable: "0",
            //检查频率
            frequency: null,
            //备注
            remarks: null,
            //专业：1设备工艺 2自控 3通信 4压缩机 5安全环保 6综合文控 7物资 8应急 9车辆 10电气 11线路 12阴保
            specialty: null,
            //修改日期
            modifyDate: null,
            //创建日期
            createDate: null,
            //创建人id
            createBy: null,
            //创建人
            creater: {},
            //检查表
            tpaCheckTable: { id: '', name: '' },
            tpaBoatEquipment:{id:'',name:''},
            //检查任务
            // checkTasks : [],
            //检查人
            //  users : [],
            // checkerId:null,
            checkType: "0", //类型 0执行一次 1执行多次
            planSettingId: null,
            planSetting: {
                id: null,
                unit: "1", //间隔
                isWeekendInculed: null, //是否包含周末  0不包含 1包含
                frequencyType: "1", //频率类型 1天 2周 3月 4季度 5自定义
                period: null, //时间间隔
                isRepeatable: null, //是否重复 0执行一次 1执行多次
                startTime: null, //开始时间
                endTime: null, //结束时间
            },
            //计划类型 0:无意义，1::工作计划 ，2:巡检计划
            planType: 0,
            type:"",
        }
    };
    //初始化频率设置
    var newFrequencyModel = function() {
        return {
            planSetting: {
                unit: "1", //间隔
                isWeekendInculed: null, //是否包含周末  0不包含 1包含
                frequencyType: "1", //频率类型 1天 2周 3月 4季度 5自定义
                period: null, //时间间隔
                isRepeatable: null, //是否重复 0执行一次 1执行多次
                startTime: null, //开始时间
                endTime: null, //结束时间
            },
            common: { //新增和详情
                isNoRepeat: true, //选择执行一次
                isRepeat: false, //重复执行
                frequencyName: '每天频率', //根据执行频率显示频率选项
            },
            add: { //新增
                isWeekendInculedFlag: true, //是否包含周六日
                isShowDay: true, //是否显示天频率设置
                isShowMy: false, //是否显示自定义频率设置
                isShowOnce: true, //是否显示执行频率这一行
            },
            detail: { //详情
                isIncludeWeek: true, //是否包含周六日
                unitName: null, //间隔单位
                definedTime: false, //自定义显示频率设置
                frequencyTypeName: null, //执行频率 的类型 -- 天、周、月、季、自定义
            }
        }
    };
    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            opType: 'view',
            isReadOnly: true,
            title: "",
            isBoatEquipment:false,
            //控制检查表的disabled
            checkPlanChange:true,
            checkTableChange:true,
            checkTypeList: [{
                id: "0",
                name: "执行一次"
            },
                {
                    id: "1",
                    name: "执行多次"
                }
            ],
            // 1分钟 2小时 3天 4周 5月 6季度
            unitList: [{
                id: "1",
                name: "分钟"
            },
                {
                    id: "2",
                    name: "小时"
                },
                {
                    id: "3",
                    name: "天"
                },
                {
                    id: "4",
                    name: "周"
                },
                {
                    id: "5",
                    name: "月"
                },
                {
                    id: "6",
                    name: "季度"
                }
            ],
            unitList1: [{
                id: "1",
                name: "分钟"
            },
                {
                    id: "2",
                    name: "小时"
                }
            ],
            //频率类型 1天 2周 3月 4季度 5自定义
            frequencyTypeList: [{
                id: "1",
                name: "天"
            },
                {
                    id: "2",
                    name: "周"
                },
                {
                    id: "3",
                    name: "月"
                },
                {
                    id: "4",
                    name: "季度"
                },
                {
                    id: "5",
                    name: "自定义"
                }
            ],
            //验证规则
            rules: {
                //"code":[LIB.formRuleMgr.require("编码")]
                "code": [LIB.formRuleMgr.require(""),
                    LIB.formRuleMgr.length()
                ],
                "name": [LIB.formRuleMgr.require("计划名"),
                    LIB.formRuleMgr.length()
                ],
                "endDate": [LIB.formRuleMgr.require("结束时间"),
                    LIB.formRuleMgr.length(),
                    {
                        validator: function(rule, value, callback) {
                            var currentDate = new Date().Format("yyyy-MM-dd 00:00:00");
                            return value < currentDate ? callback(new Error('结束时间必须大于当前时间')) : callback();
                        }
                    }
                ],
                "startDate": [LIB.formRuleMgr.require("开始时间"),
                    LIB.formRuleMgr.length(),
                    {
                        validator: function(rule, value, callback) {
                            var currentDate = new Date().Format("yyyy-MM-dd 00:00:00");
                            return value < currentDate ? callback(new Error('开始时间必须大于当前时间')) : callback();
                        }
                    }
                ],
                "tpaCheckTable.name": [LIB.formRuleMgr.require("检查表"), LIB.formRuleMgr.length() ],
                "compId": [{ required: true, message: '请选择所属公司' }, LIB.formRuleMgr.length() ],
                "orgId": [{ required: true, message: '请选择所属部门' }, LIB.formRuleMgr.length() ],
                "specialty": [LIB.formRuleMgr.require("专业"), LIB.formRuleMgr.length() ],
                "checkType": [LIB.formRuleMgr.require("类型"), LIB.formRuleMgr.length() ],
                "disable": [LIB.formRuleMgr.length()],
                "remarks": [LIB.formRuleMgr.length()],
                "modifyDate": [LIB.formRuleMgr.length()],
                "createDate": [LIB.formRuleMgr.length()],
                "planType": [{ required: true, message: '请选择计划类型' }, LIB.formRuleMgr.length()],
                "type": [{ required: true, message: '请选择计划类型' }, LIB.formRuleMgr.length()],
                "tpaBoatEquipment.name":[{ required: true, message: '请选择设备设施' }, LIB.formRuleMgr.length()],
            },
            //"0": "未到期", "1": "待执行", "2":"按期执行", "3":"超期执行","4":"未执行"};
            emptyRules: {},
            typeList: [{
                name: '未到期',
                id: "0"
            }, {
                name: '待执行',
                id: "1"
            }, {
                name: '按期执行',
                id: "2"
            }, {
                name: '超期执行',
                id: "3"
            }, {
                name: '未执行',
                id: "4"
            }],
            specialtyList: [
                { id: "1", name: "设备工艺" },
                { id: "2", name: "自控" },
                { id: "3", name: "通信" },
                { id: "4", name: "压缩机" },
                { id: "5", name: "安全环保" },
                { id: "6", name: "生产运行" },
                { id: "7", name: "财务资产" },
                { id: "8", name: "综合" },
                { id: "9", name: "政工" },
                { id: "10", name: "电气" },
                { id: "11", name: "线路" },
                { id: "12", name: "防腐" },
            ]
        },
        tableModel: {
            checkTaskTableModel: {
                url: "tpacheckplan/tpachecktasks/list/{curPage}/{pageSize}",
                columns: [{
                    title: "检查任务序号",
                    fieldName: "num",
                }, {
                    title: "执行人",
                    fieldName: "checkUser.name"
                }, {
                    title: "任务开始时间",
                    fieldName: "startDate"
                }, {
                    title: "任务结束时间",
                    fieldName: "endDate"
                }, {
                    title: "任务完成时间",
                    fieldName: "checkDate"
                }, {
                    title: "状态",
                    fieldType: "custom",
                    fieldName: "status",
                    render: function(data) {
                        return LIB.getDataDic("check_status", data.status);
                    }
                }],
                // defaultFilterValue : {"criteria.orderValue" : {checkerId : "5f96de9045"}}
            },
            preCheckTaskTableModel: {
                url: "tpacheckplan/tpachecktask/view/{curPage}/{pageSize}",
                columns: [{
                    title: "检查任务序号",
                    fieldName: "num",
                }, {
                    title: "执行人",
                    fieldName: "checkUser.name"
                }, {
                    title: "任务开始时间",
                    fieldName: "startDate"
                }, {
                    title: "任务结束时间",
                    fieldName: "endDate"
                }, {
                    title: "任务完成时间",
                    fieldName: "checkDate"
                }, {
                    title: "状态",
                    fieldType: "custom",
                    fieldName: "status",
                    render: function(data) {
                        return LIB.getDataDic("check_status", data.status);
                    }
                }],
                // defaultFilterValue : {"criteria.orderValue" : {checkerId : "5f96de9045"}}
            },
            userTableModel: {

                url: "tpacheckplan/users/list/{curPage}/{pageSize}", //
                columns: [{
                    title: "姓名",
                    fieldName: "username"
                },
                    //LIB.tableMgr.column.company,
                    _.extend(_.extend({}, LIB.tableMgr.column.company), { filterType: null }),
                    _.extend(_.extend({}, LIB.tableMgr.column.dept), { filterType: null }),
                    {
                        title: "手机",
                        fieldName: "mobile"
                    }, {
                        title: "",
                        fieldType: "tool",
                        toolType: "del"
                    }
                ]
            },
        },
        formModel: {
            checkTaskFormModel: {
                show: false,
                queryUrl: "tpacheckplan/{id}/tpachecktask/{checkTaskId}"
            },
        },
        selectModel: {
            tpaCheckTableSelectModel: {
                filterData: {
                    type: 1,
                    disable: 0,
                    "criteria.strValue.selectWithExistCheckItem": "true",
                    tableType:null
                },
                visible: false
            },
            userSelectModel: {
                visible: false
            },
            tpaBoatEquipmentSelectModel : {
                visible : false,
                filterData : {type:null}
            },
        },
        cardModel: {
            checkTaskCardModel: {
                showContent: true
            },
            userCardModel: {
                showContent: true
            },
        },
        isLateCheckAllowed: false,

        //检查任务模块
        inspectTaskModel: {
            taskUsers: [], //检查人员
            taskUser: null, //下拉框选择的检查人员
            selectType: "1", //选择的任务状态
            isShow: false, //控制检查人员和任务状态下拉框显示
            taskShow: false, //控制显示预览任务列表
        },
        //频率设置模块
        frequencyModelShow: false, //频率设置
        frequencyModel: newFrequencyModel(),
        //userSelectModel : false,//选择人员显示

        showPlanType: false,
        showSpecialty :false
    };
    //Vue组件
    /**
     *  请统一使用以下顺序配置Vue参数，方便codeview
     *	el
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
    var detail = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.detailPanel],
        template: tpl,
        components: {
            "tpachecktableSelectModal":tpaCheckTableSelectModal,
            "userSelectModal": userSelectModal,
            "boatSelectModal":tpaBoatEquipmentSelectModal,

        },
        data: function() {
            return dataModel;
        },
        watch:{
            "mainModel.vo.type":function(val) {
                if (this.mainModel.opType != 'view') {
                    if (val == 100) {
                        //显示船舶设备设施字段
                        this.mainModel.isBoatEquipment = false;
                        //控制检查表是否只读
                        this.mainModel.checkPlanChange = false;
                        this.mainModel.checkTableChange = false;
                        //检查表modal filterDate
                        this.selectModel.tpaCheckTableSelectModel.filterData.tableType = "10";
                        this.mainModel.vo.tpaBoatEquipment = {id: "", name: ""};
                    } else if (val == 200) {
                        this.mainModel.isBoatEquipment = true;
                        this.mainModel.checkPlanChange = false;
                        this.mainModel.checkTableChange = true;
                        this.mainModel.vo.tpaBoatEquipment = {id: "", name: ""};
                        this.selectModel.tpaCheckTableSelectModel.filterData.tableType = "20";
                    } else if (val == "") {
                        this.mainModel.isBoatEquipment = false;
                        this.mainModel.checkPlanChange = true;
                        this.selectModel.tpaCheckTableSelectModel.filterData.tableType = null;
                    }
                    this.mainModel.vo.tpaCheckTable = {id: '', name: ''};
                }
            }
        },
        methods: {
            newVO: newVO,
            //检查表 filter-data
            doShowCheckTableSelectModal: function() {
                this.selectModel.tpaCheckTableSelectModel.visible = true;
            },
            doShowTpaBoatEquipmentSelectModal : function() {
                this.selectModel.tpaBoatEquipmentSelectModel.visible = true;
            },
            doSaveTpaBoatEquipment : function(selectedDatas) {
                var _this = this;
                if (selectedDatas) {
                    _this.mainModel.vo.tpaBoatEquipment = selectedDatas[0];
                }
            },
            beforeDoSave: function() {
                var retirementDate = _.get(this.mainModel.vo, "tpaBoatEquipment.retirementDate");
                if (retirementDate) {
                    var now = new Date().Format("yyyy-MM-dd 00:00:00");
                    if (now >= retirementDate) {
                        LIB.Msg.error("该设备已过期，请维护设备报废日期", 5);
                        return false;
                    }
                }

                var _this = this;
                if ((Date.parse(_this.mainModel.vo.endDate) - Date.parse(_this.mainModel.vo.startDate)) > 31536000000) {
                    LIB.Msg.warning("总的计划时间跨度不能超过一年!");
                    return false;
                };
            },
            afterFormValidate: function() {
                var _this = this;
                var _data = this.mainModel;
                var _vo = _data.vo;

                //判断是否类型选择执行一次还是多次 ，此当为执行多次时
                if (_this.mainModel.vo.checkType == 1) {
                    if (_this.frequencyModel.common.isNoRepeat) {
                        //频率选择执行一次
                        _vo.planSetting = {
                            isWeekendInculed: _this.frequencyModel.add.isWeekendInculedFlag ? 1 : 0,
                            isRepeatable: 0,
                            frequencyType: _this.frequencyModel.planSetting.frequencyType,
                            period: "1",
                            startTime: null,
                            endTime: null,
                            id: null
                        }
                        //  _vo.planSetting.isWeekendInculed = _this.frequencyModel.add.isWeekendInculedFlag ? 1 :0;
                        //  _vo.planSetting.isRepeatable = 0;
                        // // 执行频率：1天 2周 3月 4季度 5自定义
                        //  _vo.planSetting.frequencyType = _this.frequencyModel.planSetting.frequencyType ;
                        //间隔单位 1分钟 2小时 3天 4周 5月 6季度
                        //当频率执行一次时，间隔单位也要进行相应的判断
                        var setting = _vo.planSetting;
                        if (setting.frequencyType == 1) {
                            _vo.planSetting.unit = 3;
                        } else if (setting.frequencyType == 2) {
                            _vo.planSetting.unit = 4;
                        } else if (setting.frequencyType == 3) {
                            _vo.planSetting.unit = 5;
                        } else if (setting.frequencyType == 4) {
                            _vo.planSetting.unit = 6;
                        }
                    } else {
                        //频率选择执行多次
                        // _this.mainModel.frequencyModleShow = true;
                        // _this.mainModel.isReadOnly = true;
                        //执行频率选择每天
                        if (_this.frequencyModel.planSetting.frequencyType == 1) {
                            if (_this.frequencyModel.planSetting.period && !isNaN(_this.frequencyModel.planSetting.period) && (Number(_this.frequencyModel.planSetting.period) > 0)) {
                                //时间间隔的限制
                                var period = _this.frequencyModel.planSetting.period;
                                if (parseInt(period) == period) {
                                    if (_this.frequencyModel.planSetting.unit == 1) {
                                        if (period < 30 || period > 1440) {
                                            LIB.Msg.warning("间隔单位为分钟时，间隔时间必须>=30且<=1440");
                                            return;
                                        }
                                    } else if (_this.frequencyModel.planSetting.unit == 2) {
                                        if (period < 1 || period > 24) {
                                            LIB.Msg.warning("间隔单位为小时时，间隔时间必须>=1且<=24");
                                            return;
                                        }
                                    }
                                } else {
                                    LIB.Msg.warning("请输入间隔，且间隔必须是整数");
                                    return;
                                };
                                //开始时间和结束时间的限制
                                if (_this.frequencyModel.planSetting.startTime) {
                                    if (!_this.frequencyModel.planSetting.endTime) {
                                        LIB.Msg.warning("请输入结束时间");
                                        return false;
                                    } else {
                                        _vo.planSetting = {
                                            isWeekendInculed: _this.frequencyModel.add.isWeekendInculedFlag ? 1 : 0,
                                            isRepeatable: 1,
                                            frequencyType: _this.frequencyModel.planSetting.frequencyType,
                                            unit: _this.frequencyModel.planSetting.unit,
                                            period: _this.frequencyModel.planSetting.period,
                                            startTime: _this.frequencyModel.planSetting.startTime,
                                            endTime: _this.frequencyModel.planSetting.endTime,
                                            id: null,
                                        }
                                    }
                                } else {
                                    LIB.Msg.warning("请输入开始时间");
                                    return false;
                                }
                            } else {
                                LIB.Msg.warning("请输入间隔，且间隔必须是整数");
                                return false;
                            }
                        } else if (_this.frequencyModel.planSetting.frequencyType == 5) {
                            //执行频率选择自定义
                            if (_this.frequencyModel.planSetting.period && !isNaN(_this.frequencyModel.planSetting.period) && (Number(_this.frequencyModel.planSetting.period) > 0)) {
                                var period = _this.frequencyModel.planSetting.period;
                                if (parseInt(period) == period) {
                                    if (_this.frequencyModel.planSetting.unit == 1) {
                                        if (period < 30) {
                                            LIB.Msg.warning("间隔单位为分钟时，间隔时间必须>=30");
                                            return;
                                        }
                                    }
                                } else {
                                    LIB.Msg.warning("请输入间隔，且间隔必须是整数");
                                    return;
                                };
                                _vo.planSetting = {
                                    isWeekendInculed: _this.frequencyModel.add.isWeekendInculedFlag ? 1 : 0,
                                    isRepeatable: 1,
                                    frequencyType: _this.frequencyModel.planSetting.frequencyType,
                                    unit: _this.frequencyModel.planSetting.unit,
                                    period: _this.frequencyModel.planSetting.period,
                                    startTime: null,
                                    endTime: null,
                                    id: null,
                                }
                            } else {
                                LIB.Msg.warning("请输入间隔，且间隔必须是整数");
                                return false;
                            }
                        }
                    };
                } else {
                    //判断是否类型选择执行一次还是多次 ，此当为执行一次时
                    _vo.planSetting = {
                        unit: "1", //间隔
                        isWeekendInculed: "1", //是否包含周末  0不包含 1包含
                        frequencyType: "1", //频率类型 1天 2周 3月 4季度 5自定义
                        period: "1", //时间间隔
                        isRepeatable: "0", //是否重复 0执行一次 1执行多次
                        startTime: null, //开始时间
                        endTime: null, //结束时间
                        id: null, //结束时间
                    };
                };

                //只有选择每天执行频率才有是否包含周六日的选择
                if (_this.frequencyModel.planSetting.frequencyType == 1) {
                    _this.frequencyModel.planSetting.isWeekendInculed == _this.frequencyModel.add.isWeekendInculedFlag ? 1 : 0;
                } else {
                    _this.frequencyModel.planSetting.isWeekendInculed == 1;
                }
                return true;
            },
            buildSaveData: function() {
                var _this = this;
                var _vo = this.mainModel.vo;
                _vo.planSetting.id = _vo.planSettingId;
                var resultDate = null;
                if (_vo.checkType != 1) {
                    resultDate = _.pick(_this.mainModel.vo, "planSettingId", "tpaCheckTable", "createDate", "modifyDate", "specialty", "remarks", "frequency", "disable", "checkType", "id", "orgId", "code", "endDate", "startDate", "compId", "name", "planType","type","tpaBoatEquipment");
                } else {
                    resultDate = _.pick(_this.mainModel.vo, "planSetting", "planSettingId", "tpaCheckTable", "createDate", "modifyDate", "specialty", "remarks", "frequency", "disable", "checkType", "id", "orgId", "code", "endDate", "startDate", "compId", "name", "planType","type","tpaBoatEquipment");
                }
                return resultDate;
            },
            afterDoSave: function(opt, res) {
                var _this = this;

                var _data = this.mainModel;
                var _vo = _data.vo;
                if (res && res.planSettingId) {
                    _vo.planSettingId = res.planSettingId;
                }
                if (opt.type === "C") {
                    _data.vo.creater = LIB.user;
                    _this.inspectTaskModel = {
                        taskUsers: [],
                        taskUser: _this.inspectTaskModel.taskUser,
                        selectType: _this.inspectTaskModel.selectType,
                        isShow: false,
                        taskShow: false,
                    }
                } else {
                    api.getUsers({ id: _this.mainModel.vo.id }).then(function(res) {
                        //初始化数据
                        var _taskModel = _this.inspectTaskModel;
                        if (res.body.length > 0) { //判断是否有任务人的数据
                            _taskModel.isShow = true;
                            _taskModel.taskUsers = [];
                            _.each(res.body, function(val, index) {
                                _taskModel.taskUsers.push(val);
                            });
                            _this.mainModel.vo.checkerId = res.data[0].id;
                            _taskModel.taskUser = res.data[0].id;
                            _taskModel.selectType = "1";
                            if (_this.mainModel.vo.disable == 1) {
                                _taskModel.taskShow = true;
                                _this.$refs.checktaskTable.doQuery({ id: _this.mainModel.vo.id, "criteria.strValue.checkerId": _this.mainModel.vo.checkerId, "criteria.intValue.status": _this.inspectTaskModel.selectType });
                            } else {
                                _taskModel.taskShow = false;
                                _this.$refs.preChecktaskTable.doQuery({ id: _this.mainModel.vo.id, "criteria.strValue.checkerId": _this.mainModel.vo.checkerId, "criteria.intValue.status": _this.inspectTaskModel.selectType });
                            }

                        } else {
                            _taskModel.taskUsers = [];
                            if (_this.mainModel.vo.disable == 1) {
                                _taskModel.taskShow = true;
                            } else {
                                _taskModel.taskShow = false;
                            }
                            _taskModel.isShow = false;
                        }
                    });

                    _this.frequencyModelShow = true;
                    _this.mainModel.isReadOnly = true;
                }

                //保存之后页面渲染的判断
                var _detail = _this.frequencyModel.detail,
                    _common = _this.frequencyModel.common;
                if (_this.mainModel.vo.checkType == 0) {
                    _this.frequencyModelShow = true;
                    _this.mainModel.isReadOnly = true;
                } else {
                    _this.frequencyModelShow = false;
                    _this.mainModel.isReadOnly = true;
                    if (_vo.planSetting.isWeekendInculed == 1) {
                        _detail.isIncludeWeek = true
                    } else {
                        _detail.isIncludeWeek = false
                    }
                    if (_this.frequencyModel.planSetting.frequencyType == 1) {
                        _detail.frequencyTypeName = "天";
                        _common.frequencyName = "每天频率";
                        _detail.definedTime = false;
                        if (_this.mainModel.vo.planSetting.isRepeatable == 1) {
                            _common.isRepeat = true;
                            _common.isNoRepeat = false;
                            //1分钟 2小时 3天 4周 5月 6季度
                            if (_this.frequencyModel.planSetting.unit == 1) {
                                _detail.unitName = "分钟";
                            } else if (_this.frequencyModel.planSetting.unit == 2) {
                                _detail.unitName = "小时";
                            }
                        } else {
                            _common.isRepeat = false;
                            _common.isNoRepeat = true;
                        }
                    } else if (_this.frequencyModel.planSetting.frequencyType == 5) {
                        _detail.frequencyTypeName = "自定义";
                        _common.frequencyName = "自定义频率";
                        _detail.definedTime = true;
                        _common.isNoRepeat = false;
                        if (_this.frequencyModel.planSetting.unit == 1) {
                            _detail.unitName = "分钟";
                        } else if (_this.frequencyModel.planSetting.unit == 2) {
                            _detail.unitName = "小时";
                        } else if (_this.frequencyModel.planSetting.unit == 3) {
                            _detail.unitName = "天";
                        } else if (_this.frequencyModel.planSetting.unit == 4) {
                            _detail.unitName = "周";
                        } else if (_this.frequencyModel.planSetting.unit == 5) {
                            _detail.unitName = "月";
                        } else if (_this.frequencyModel.planSetting.unit == 6) {
                            _detail.unitName = "季";
                        }
                    } else if (_this.frequencyModel.planSetting.frequencyType == 2) {
                        _detail.definedTime = false;
                        _common.isNoRepeat = true;
                        _common.isRepeat = false;
                        _detail.frequencyTypeName = "周";
                        _common.frequencyName = "每周频率";
                    } else if (_this.frequencyModel.planSetting.frequencyType == 3) {
                        _detail.definedTime = false;
                        _common.isNoRepeat = true;
                        _common.isRepeat = false;
                        _detail.frequencyTypeName = "月";
                        _common.frequencyName = "每月频率"
                    } else if (_this.frequencyModel.planSetting.frequencyType == 4) {
                        _detail.definedTime = false;
                        _common.isNoRepeat = true;
                        _common.isRepeat = false;
                        _detail.frequencyTypeName = "季";
                        _common.frequencyName = "每季频率"
                    };
                }
            },
            doSaveCheckTable: function(obj) {
                var _vo = this.mainModel.vo;
                this.selectModel.tpaCheckTableSelectModel.visible = false;
                _vo.tpaCheckTable.id = obj[0].id;
                _vo.tpaCheckTable.name = obj[0].name;
                _vo.compId = null;
                _vo.compId = obj[0].compId;
                this.mainModel.checkTableChange = false;
                if (obj[0].attr1) {
                    if (obj[0].attr1 > 2) {
                        this.selectModel.tpaBoatEquipmentSelectModel.filterData.type = 2;
                    } else {
                        this.selectModel.tpaBoatEquipmentSelectModel.filterData.type = 1;
                    }
                }
                _vo.tpaBoatEquipment = {id:'',name:''};
                //_vo.orgId = obj[0].orgId;
            },
            doShowCheckTaskFormModal4Update: function(param) {
                this.formModel.checkTaskFormModel.show = true;
                this.$refs.checktaskFormModal.init("update", { id: this.mainModel.vo.id, checkTaskId: param.entry.data.id });
            },
            doShowCheckTaskFormModal4Create: function(param) {
                this.formModel.checkTaskFormModel.show = true;
                this.$refs.checktaskFormModal.init("create");
            },
            doSaveCheckTask: function(data) {
                if (data) {
                    var _this = this;
                    api.saveCheckTask({ id: this.mainModel.vo.id }, data).then(function() {
                        _this.refreshTableData(_this.$refs.checktaskTable);
                    });
                }
            },
            doUpdateCheckTask: function(data) {
                if (data) {
                    var _this = this;
                    api.updateCheckTask({ id: this.mainModel.vo.id }, data).then(function() {
                        _this.refreshTableData(_this.$refs.checktaskTable);
                    });
                }
            },
            doRemoveCheckTasks: function(item) {
                var _this = this;
                var data = item.entry.data;
                api.removeCheckTasks({ id: this.mainModel.vo.id }, [{ id: data.id }]).then(function() {
                    _this.$refs.checktaskTable.doRefresh();
                });
            },
            //点击保存检查人员
            doSaveUsers: function(selectedDatas) {
                var _this = this;
                if (selectedDatas) {
                    // dataModel.mainModel.users = selectedDatas;
                    var param = _.map(selectedDatas, function(data) { return { id: data.id } });
                    api.saveUsers({ id: _this.mainModel.vo.id }, param).then(function() {
                        _this.refreshTableData(_this.$refs.userTable);
                        // _this.afterInitData();
                        _this.inspectTaskModel.taskUsers = [];
                        //对应刷新任务列表
                        api.getUsers({ id: _this.mainModel.vo.id }).then(function(res) {
                            //初始化数据
                            _this.inspectTaskModel.isShow = true;
                            _this.inspectTaskModel.taskUsers = [];
                            _.each(res.body, function(val, index) {
                                _this.inspectTaskModel.taskUsers.push(val);
                            });
                            _this.inspectTaskModel.selectType = "1";
                            _this.mainModel.vo.checkerId = res.data[0].id;
                            _this.inspectTaskModel.taskUser = res.data[0].id;
                            if (_this.mainModel.vo.disable == 1) {
                                _this.inspectTaskModel.taskShow = true;
                                _this.$refs.checktaskTable.doQuery({ id: _this.mainModel.vo.id, "criteria.strValue.checkerId": _this.mainModel.vo.checkerId, "criteria.intValue.status": _this.inspectTaskModel.selectType });
                            } else {
                                _this.inspectTaskModel.taskShow = false;
                                _this.$refs.preChecktaskTable.doQuery({ id: _this.mainModel.vo.id, "criteria.strValue.checkerId": _this.mainModel.vo.checkerId, "criteria.intValue.status": _this.inspectTaskModel.selectType });
                            }
                        });
                    });
                }
            },
            //点击删除检查人员
            doRemoveUsers: function(item) {
                var _this = this;
                var data = item.entry.data;
                if (_this.mainModel.vo.disable == 1) {
                    LIB.Msg.warning("已发布的检查计划不能删除检查人员");
                    return;
                } else {
                    api.removeUsers({ id: this.mainModel.vo.id }, [{ id: data.id }]).then(function() {
                        _this.$refs.userTable.doRefresh();
                        // _this.afterInitData();
                        api.getUsers({ id: _this.mainModel.vo.id }).then(function(res) {
                            //初始化数据
                            if (res.body.length > 0) {
                                _this.inspectTaskModel.isShow = true;
                                _this.inspectTaskModel.taskUsers = [];
                                _.each(res.body, function(val, index) {
                                    _this.inspectTaskModel.taskUsers.push(val);
                                });
                                _this.mainModel.vo.checkerId = res.data[0].id;
                                _this.inspectTaskModel.taskUser = res.data[0].id;
                                _this.inspectTaskModel.selectType = "1";
                                if (_this.mainModel.vo.disable == 1) {
                                    _this.inspectTaskModel.taskShow = true;
                                    _this.$refs.checktaskTable.doQuery({ id: _this.mainModel.vo.id, "criteria.strValue.checkerId": _this.mainModel.vo.checkerId, "criteria.intValue.status": _this.inspectTaskModel.selectType });
                                } else {
                                    _this.inspectTaskModel.taskShow = false;
                                    _this.$refs.preChecktaskTable.doQuery({ id: _this.mainModel.vo.id, "criteria.strValue.checkerId": _this.mainModel.vo.checkerId, "criteria.intValue.status": _this.inspectTaskModel.selectType });
                                }

                            } else {
                                _this.inspectTaskModel.taskUsers = [];
                                if (_this.mainModel.vo.disable == 1) {
                                    _this.inspectTaskModel.taskShow = true;
                                } else {
                                    _this.inspectTaskModel.taskShow = false;
                                }
                                _this.inspectTaskModel.isShow = false;
                            }
                        });

                    });
                }
            },
            //点击添加
            doAppend: function() {
                if (this.mainModel.vo.disable == 1) {
                    LIB.Msg.warning("已发布的检查计划不能添加检查人员");
                    return;
                } else {
                    this.selectModel.userSelectModel.visible = true;
                }
            },
            afterInitData: function() {

                //如果计划已发布隐藏最后一列tool操作列
                {
                    _.last(this.tableModel.userTableModel.columns).visible = (this.mainModel.vo.disable == "0");
                    this.$refs.userTable.refreshColumns();
                }


                var _this = this,
                    _vo = _this.mainModel.vo;
                _this.frequencySetting();
                if (_vo.createBy) {
                    api.getUser({ id: _vo.createBy }).then(function(res) {
                        _vo.creater = res.body;
                    });
                }
                api.getUsers({ id: _vo.id }).then(function(res) {
                    //初始化数据
                    if (res.body.length > 0) {
                        _this.inspectTaskModel.isShow = true;
                        _this.inspectTaskModel.taskUsers = [];
                        _.each(res.body, function(val, index) {
                            _this.inspectTaskModel.taskUsers.push(val);
                        });
                        _vo.checkerId = res.data[0].id;
                        _this.inspectTaskModel.taskUser = res.data[0].id;
                        _this.inspectTaskModel.selectType = "1";
                        if (_vo.disable == 1) {
                            _this.inspectTaskModel.taskShow = true;
                            _this.$refs.checktaskTable.doQuery({ id: _this.mainModel.vo.id, "criteria.strValue.checkerId": _this.mainModel.vo.checkerId, "criteria.intValue.status": _this.inspectTaskModel.selectType });
                        } else {
                            _this.inspectTaskModel.taskShow = false;
                            _this.$refs.preChecktaskTable.doQuery({ id: _this.mainModel.vo.id, "criteria.strValue.checkerId": _this.mainModel.vo.checkerId, "criteria.intValue.status": _this.inspectTaskModel.selectType });
                        }

                    } else {
                        _this.inspectTaskModel.isShow = false;
                        _this.inspectTaskModel.taskUsers = [];
                    }
                });
                this.$refs.userTable.doQuery({ id: this.mainModel.vo.id });
                api.getEnvconfig({ type: "BUSINESS_SET" }).then(function(res) {
                    if (res.body != 'E30000' && res.body.checkTaskSet) {
                        _this.isLateCheckAllowed = res.body.checkTaskSet.isLateCheckAllowed ? true : false;
                    }
                });
                //编辑时频率设置模块
                if (_this.mainModel.opType == 'update') {
                    _this.doEdit();
                };

            },
            beforeInit: function() {
                if (this.mainModel.vo.disable == 1) {
                    this.inspectTaskModel.taskShow = true;
                    this.$refs.checktaskTable.doClearData();
                } else {
                    this.inspectTaskModel.taskShow = false;
                    this.$refs.preChecktaskTable.doClearData();
                }

                this.showPlanType = LIB.setting.fieldSetting["BC_Hal_InsP"] ? true : false;
                this.showSpecialty = LIB.setting.fieldSetting["BC_Hal_InsP"] ? true : false;
                this.$refs.userTable.doClearData();
            },
            //切换任务对应的人
            doChooseUser: function(index) {
                var _this = this,
                    index = index.key;
                _this.inspectTaskModel.selectType = "1";
                _this.mainModel.vo.checkerId = _this.inspectTaskModel.taskUser;
                if (_this.mainModel.vo.disable == 1) {
                    _this.inspectTaskModel.taskShow = true;
                    _this.$refs.checktaskTable.doQuery({ id: _this.mainModel.vo.id, "criteria.strValue.checkerId": _this.mainModel.vo.checkerId, "criteria.intValue.status": _this.inspectTaskModel.selectType });
                } else {
                    _this.inspectTaskModel.taskShow = false;
                    _this.$refs.preChecktaskTable.doQuery({ id: _this.mainModel.vo.id, "criteria.strValue.checkerId": _this.mainModel.vo.checkerId, "criteria.intValue.status": _this.inspectTaskModel.selectType });
                }

            },
            //发布
            doPublish: function() {

                var retirementDate = _.get(this.mainModel.vo, "tpaBoatEquipment.retirementDate");
                if (retirementDate) {
                    var now = new Date().Format("yyyy-MM-dd 00:00:00");
                    if (now >= retirementDate) {
                        return LIB.Msg.error("该设备已过期，请维护设备报废日期", 5);
                    }
                }

                var _this = this;
                if (this.mainModel.vo.disable == 1) {
                    LIB.Msg.warning("已发布!");
                    return false;
                };
                api.publish([_this.mainModel.vo.id]).then(function(res) {
                    _this.$dispatch("ev_dtPublish");
                    LIB.Msg.info("已发布!");
                });
            },
            doTableCellClick: function(data) {
                var _this = this;
                if (data.cell.fieldName == "status") {
                    var status = data.entry.data.status;
                    if (status == 1 || (status == 4 && this.isLateCheckAllowed)) {
                        var routerPart = "/businessCenter/hiddenDanger/checkRecord?method=check&checkTaskId=" + data.entry.data.id;
                        _this.$router.go(routerPart);
                    }
                    if (status == 2 || status == 3) {
                        api.getCheckRecords({ checkTaskId: data.entry.data.id }).then(function(res) {
                            if (res.body.length > 0) {
                                var routerPart = "/businessCenter/hiddenDanger/checkRecord?method=detail&id=" + res.body[0].id;
                                _this.$router.go(routerPart);
                            }
                        });

                    }
                }
            },
            beforeDoDelete: function() {
                if (this.mainModel.vo.disable == 1) {
                    LIB.Msg.warning("已发布不能删除,请重新选择!");
                    return false;
                }
            },
            //筛选任务状态
            doChangeStatus: function() {
                var _this = this;
                if (_this.mainModel.vo.disable == 1) {
                    _this.inspectTaskModel.taskShow = true;
                    _this.$refs.checktaskTable.doQuery({ id: _this.mainModel.vo.id, "criteria.strValue.checkerId": _this.mainModel.vo.checkerId, "criteria.intValue.status": _this.inspectTaskModel.selectType });
                } else {
                    _this.inspectTaskModel.taskShow = false;
                    _this.$refs.preChecktaskTable.doQuery({ id: _this.mainModel.vo.id, "criteria.strValue.checkerId": _this.mainModel.vo.checkerId, "criteria.intValue.status": _this.inspectTaskModel.selectType });
                }

            },
            //改变类型
            dochangeCheckType: function() {
                var _this = this;
                //frequencyModleShow
                if (_this.mainModel.vo.checkType == 1) {
                    _this.frequencyModelShow = true;

                } else {
                    _this.frequencyModelShow = false;
                }
            },
            //改变频率
            dochangefrequencyType: function() {
                var _this = this;
                var _common = _this.frequencyModel.common,
                    _add = _this.frequencyModel.add;
                //频率类型 1天 2周 3月 4季度 5自定义
                if (_this.frequencyModel.planSetting.frequencyType == 1) {
                    _common.frequencyName = "每天频率";
                    _add.isShowDay = true;
                    _add.isShowMy = false;
                    _add.isShowOnce = true;
                    _common.isNoRepeat = true;
                    _common.isRepeat = false;
                    _this.frequencyModel.planSetting.unit = "1";
                } else if (_this.frequencyModel.planSetting.frequencyType == 2) {
                    _common.frequencyName = "每周频率";
                    _add.isShowDay = false;
                    _add.isShowMy = false;
                    _add.isShowOnce = true;
                    _common.isNoRepeat = true;
                    _common.isRepeat = false;
                } else if (_this.frequencyModel.planSetting.frequencyType == 3) {
                    _common.frequencyName = "每月频率";
                    _add.isShowDay = false;
                    _add.isShowMy = false;
                    _add.isShowOnce = true;
                    _common.isNoRepeat = true;
                    _common.isRepeat = false;
                } else if (_this.frequencyModel.planSetting.frequencyType == 4) {
                    _common.frequencyName = "每季频率";
                    _add.isShowDay = false;
                    _add.isShowMy = false;
                    _add.isShowOnce = true;
                    _common.isNoRepeat = true;
                    _common.isRepeat = false;
                } else if (_this.frequencyModel.planSetting.frequencyType == 5) {
                    _common.frequencyName = "自定义频率";
                    _add.isShowDay = false;
                    _add.isShowMy = true;
                    _add.isShowOnce = false;
                    _common.isNoRepeat = false;
                    _common.isRepeat = true;
                }
            },
            //执行一次
            doOnce: function() {
                var _this = this;
                _this.frequencyModel.common.isNoRepeat = true;
                _this.frequencyModel.common.isRepeat = false;
            },
            //执行多次
            doMuch: function() {
                var _this = this;
                _this.frequencyModel.common.isNoRepeat = false;
                _this.frequencyModel.common.isRepeat = true;
            },
            //设置开始时间
            startTime: function(data) {
                this.frequencyModel.planSetting.startTime = data;
            },
            //设置结束时间
            endTime: function(data) {
                var _this = this;
                _this.frequencyModel.planSetting.endTime = data;
            },
            //编辑页面
            // doEdit:function(){
            //
            // },
            afterDoEdit: function() {
                var _this = this;
                var _add = _this.frequencyModel.add,
                    _common = _this.frequencyModel.common;
                // this.mainModel.beforeEditVo = {};
                // _.deepExtend(this.mainModel.beforeEditVo, this.mainModel.vo);
                _this.mainModel.isReadOnly = false;
                _this.mainModel.opType = "update";
                if (_this.mainModel.vo.checkType == 1) {
                    _this.frequencyModelShow = true;
                    if (_this.mainModel.vo.planSetting.isRepeatable == 1) {
                        _common.isRepeat = true;
                        _common.isNoRepeat = false;
                    } else {
                        _common.isRepeat = false;
                        _common.isNoRepeat = true;
                        if (_this.mainModel.vo.planSetting.frequencyType == 1) {
                            _this.frequencyModel.planSetting.unit = "1";
                        }
                    };
                    // debugger
                    if (_this.mainModel.vo.planSetting.frequencyType == 1) {
                        _add.isShowDay = true;
                        _add.isShowMy = false;
                        _add.isShowOnce = true;
                        _add.isWeekendInculedFlag = _this.mainModel.vo.planSetting.isWeekendInculed == 1 ? true : false
                    } else if (_this.mainModel.vo.planSetting.frequencyType == 5) {
                        _add.isShowDay = false;
                        _add.isShowMy = true;
                        _add.isShowOnce = false;
                    } else {
                        _add.isShowDay = false;
                        _add.isShowMy = false;
                        _add.isShowOnce = true;
                    }
                } else {
                    _this.frequencyModelShow = false;
                };
            },
            //查看/更新 记录前先初始化视图
            // init: function(opType, nVal) {
            //     this.beforeInit && this.beforeInit();
            //     var _data = this.mainModel;
            //     _data.opType = opType;
            //     var _vo = _data.vo;
            //     var _frequencyModel = this.frequencyModel;
            //     //清空数据
            //     _.deepExtend(_frequencyModel, newFrequencyModel());
            //
            //     for (var key in _vo) {
            //         if (!Object.getOwnPropertyDescriptor(_vo, key).get) {
            //             _vo[key] = null;
            //         }
            //     };
            //
            //     if (_data.opType == "create") {
            //         //设置newVO的默认值
            //         _.deepExtend(_vo, this.newVO());
            //     }
            //
            //     this.frequencyModel.planSetting = {
            //         unit: "1", //间隔
            //         isWeekendInculed: null, //是否包含周末  0不包含 1包含
            //         frequencyType: "1", //频率类型 1天 2周 3月 4季度 5自定义
            //         period: null, //时间间隔
            //         isRepeatable: null, //是否重复 0执行一次 1执行多次
            //         startTime: null, //开始时间
            //         endTime: null, //结束时间
            //     };
            //     this.frequencyModel.add.isWeekendInculedFlag = true;
            //     this.frequencyModelShow = false;
            //     //重置表单校验
            //     this.$refs.ruleform.resetFields();
            //
            //     this.changeView(_data.opType);
            //     if (_.contains(["view", "update"], _data.opType)) {
            //         this.initData({ id: nVal });
            //     };
            // },
            afterInit : function(){
                var _data = this.mainModel;
                var _vo = _data.vo;
                var _frequencyModel = this.frequencyModel;
                //清空数据
                _.deepExtend(_frequencyModel, newFrequencyModel());
                this.frequencyModel.planSetting = {
                    unit: "1", //间隔
                    isWeekendInculed: null, //是否包含周末  0不包含 1包含
                    frequencyType: "1", //频率类型 1天 2周 3月 4季度 5自定义
                    period: null, //时间间隔
                    isRepeatable: null, //是否重复 0执行一次 1执行多次
                    startTime: null, //开始时间
                    endTime: null, //结束时间
                };
                this.frequencyModel.add.isWeekendInculedFlag = true;
                this.frequencyModelShow = false;
                _data.checkTableChange = true;
            },
            afterDoCancel: function() {
                this.frequencySetting();
            },
            //初始化频率设置显示
            frequencySetting: function() {
                var _this = this;
                var _vo = _this.mainModel.vo,
                    _common = _this.frequencyModel.common,
                    _detail = _this.frequencyModel.detail;
                //初始化频率设置
                if (_vo.checkType == 0) {
                    _this.frequencyModelShow = true;
                    //_this.mainModel.isReadOnly = true;
                } else {
                    if (_vo.planSetting.isWeekendInculed == 1) {
                        _detail.isIncludeWeek = true
                    } else {
                        _detail.isIncludeWeek = false;
                    }
                    _this.frequencyModelShow = false;
                    //_this.mainModel.isReadOnly = true;
                    _this.frequencyModel.planSetting = {
                        id: _vo.planSetting.id,
                        unit: _vo.planSetting.unit, //间隔
                        isWeekendInculed: _vo.planSetting.isWeekendInculed ? 1 : 0, //是否包含周末  0不包含 1包含
                        frequencyType: _vo.planSetting.frequencyType, //频率类型 1天 2周 3月 4季度 5自定义
                        period: _vo.planSetting.period, //时间间隔
                        isRepeatable: _vo.planSetting.isRepeatable, //是否重复 0执行一次 1执行多次
                        startTime: _vo.planSetting.startTime, //开始时间
                        endTime: _vo.planSetting.endTime //结束时间
                    };
                    if (_this.frequencyModel.planSetting.frequencyType == 1) {
                        _detail.frequencyTypeName = "天";
                        _common.frequencyName = "每天频率";
                        _detail.definedTime = false;
                        if (_this.frequencyModel.planSetting.isRepeatable == 1) {
                            _common.isRepeat = true;
                            _common.isNoRepeat = false;
                            //1分钟 2小时 3天 4周 5月 6季度
                            if (_this.frequencyModel.planSetting.unit == 1) {
                                _detail.unitName = "分钟";
                            } else if (_this.frequencyModel.planSetting.unit == 2) {
                                _detail.unitName = "小时";
                            }
                        } else {
                            _common.isRepeat = false;
                            _common.isNoRepeat = true;
                        }
                    } else if (_this.frequencyModel.planSetting.frequencyType == 5) {
                        _detail.frequencyTypeName = "自定义";
                        _common.frequencyName = "自定义频率";
                        _detail.definedTime = true;
                        _common.isNoRepeat = false;
                        if (_this.frequencyModel.planSetting.unit == 1) {
                            _detail.unitName = "分钟";
                        } else if (_this.frequencyModel.planSetting.unit == 2) {
                            _detail.unitName = "小时";
                        } else if (_this.frequencyModel.planSetting.unit == 3) {
                            _detail.unitName = "天";
                        } else if (_this.frequencyModel.planSetting.unit == 4) {
                            _detail.unitName = "周";
                        } else if (_this.frequencyModel.planSetting.unit == 5) {
                            _detail.unitName = "月";
                        } else if (_this.frequencyModel.planSetting.unit == 6) {
                            _detail.unitName = "季";
                        }
                    } else if (_this.frequencyModel.planSetting.frequencyType == 2) {
                        _detail.definedTime = false;
                        _common.isNoRepeat = true;
                        _common.isRepeat = false;
                        _detail.frequencyTypeName = "周";
                        _common.frequencyName = "每周频率";
                    } else if (_this.frequencyModel.planSetting.frequencyType == 3) {
                        _detail.definedTime = false;
                        _common.isNoRepeat = true;
                        _common.isRepeat = false;
                        _detail.frequencyTypeName = "月";
                        _common.frequencyName = "每月频率"
                    } else if (_this.frequencyModel.planSetting.frequencyType == 4) {
                        _detail.definedTime = false;
                        _common.isNoRepeat = true;
                        _common.isRepeat = false;
                        _detail.frequencyTypeName = "季";
                        _common.frequencyName = "每季频率"
                    }
                };
            }
        },
        ready: function() {
            this.$api = api;
        }
    });

    return detail;
});