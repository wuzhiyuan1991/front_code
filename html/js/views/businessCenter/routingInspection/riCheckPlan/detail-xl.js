define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail-xl.html");
    var routeSelectModal = require("./dialog/routeSelect");
    var routeViewModal = require("./dialog/routeView");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");

    //初始化数据模型
    var newVO = function () {
        return {
            //id
            id: null,
            attr1: '1',//是否按顺序执行检查
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
            //备注
            remarks: null,
            //创建人id
            createBy: null,
            //创建人
            creater: {},
            //检查任务
            // checkTasks : [],
            //检查人
            //  users : [],
            // checkerId:null,
            checkTableId: null,
            checkType: "0", //类型 0:执行一次,1:执行多次
            planSettingId: null,
            planSetting: {
                id: null,
                unit: 1, //间隔
                isWeekendInculed: null, //是否包含周末  0不包含 1包含
                frequencyType: "1", //频率类型 1天 2周 3月 4季度 5自定义 6年
                period: null, //时间间隔
                isRepeatable: null, //是否重复 0:执行一次,1:执行多次（旧）,2:执行多次（新）
                startTime: null, //开始时间
                endTime: null, //结束时间
            },
            status: '0',
            auditDate: null,
            auditUser: null,
            typeId: null,
            bizType: '0',
        }
    };
    //初始化频率设置
    var newFrequencyModel = function () {
        return {
            planSetting: {
                unit: 1, //间隔
                isWeekendInculed: null, //是否包含周末  0不包含 1包含
                frequencyType: "1", //频率类型 1天 2周 3月 4季度 5自定义
                period: null, //时间间隔
                isRepeatable: null, //是否重复 0:执行一次,1:执行多次（旧）,2:执行多次（新）
                startTime: null, //开始时间
                endTime: null, //结束时间
                timeSettings:[
                    {
                        startMonth:null,//起始月
                        startDay:null,//起始天
                        startTime: null, //起始时间
                        endMonth:null,//结束月
                        endDay:null,//结束天
                        endTime: null, //结束时间
                    }
                ]
            },
            common: { //新增和详情
                isNoRepeat: false, //选择执行一次
                isRepeat: false, //多次执行
                frequencyName: '频率设置', //根据执行频率显示频率选项
            },
            add: { //新增
                isWeekendInculedFlag: true, //是否包含周六日
                isShowMy: false, //是否显示自定义频率设置
                isShowCommon: true, //是否显示非自定义的频率设置
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
            // 1分钟 2小时 3天 4周 5月 6季度
            unitList: [
                {
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
                },
                {
                    id: "7",
                    name: "年"
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
                    id: "6",
                    name: "年"
                },
                {
                    id: "5",
                    name: "自定义"
                }
            ],
            monthList:{
                'quarter':[
                    {id:'1', name:'第1月'},
                    {id:'2', name:'第2月'},
                    {id:'3', name:'第3月'},
                ],
                'year':[{id:'1', name:'1月'},
                    {id:'2', name:'2月'},
                    {id:'3', name:'3月'},
                    {id:'4', name:'4月'},
                    {id:'5', name:'5月'},
                    {id:'6', name:'6月'},
                    {id:'7', name:'7月'},
                    {id:'8', name:'8月'},
                    {id:'9', name:'9月'},
                    {id:'10', name:'10月'},
                    {id:'11', name:'11月'},
                    {id:'12', name:'12月'},
                ]
            },
            dayList:{
                'week':[
                    {id:'1', name:'周一'},
                    {id:'2', name:'周二'},
                    {id:'3', name:'周三'},
                    {id:'4', name:'周四'},
                    {id:'5', name:'周五'},
                    {id:'6', name:'周六'},
                    {id:'7', name:'周日'},
                ],
                'common':[{id:'1', name:'第1天'},
                    {id:'2', name:'第2天'},
                    {id:'3', name:'第3天'},
                    {id:'4', name:'第4天'},
                    {id:'5', name:'第5天'},
                    {id:'6', name:'第6天'},
                    {id:'7', name:'第7天'},
                    {id:'8', name:'第8天'},
                    {id:'9', name:'第9天'},
                    {id:'10', name:'第10天'},
                    {id:'11', name:'第11天'},
                    {id:'12', name:'第12天'},
                    {id:'13', name:'第13天'},
                    {id:'14', name:'第14天'},
                    {id:'15', name:'第15天'},
                    {id:'16', name:'第16天'},
                    {id:'17', name:'第17天'},
                    {id:'18', name:'第18天'},
                    {id:'19', name:'第19天'},
                    {id:'20', name:'第20天'},
                    {id:'21', name:'第21天'},
                    {id:'22', name:'第22天'},
                    {id:'23', name:'第23天'},
                    {id:'24', name:'第24天'},
                    {id:'25', name:'第25天'},
                    {id:'26', name:'第26天'},
                    {id:'27', name:'第27天'},
                    {id:'28', name:'第28天'},
                    {id:'29', name:'第29天'},
                    {id:'30', name:'第30天'},
                    //{id:'31', name:'第31天'},
                    {id:'-1', name:'最后一天'},
                ],
                'month':[{id:'1', name:'1日'},
                    {id:'2', name:'2日'},
                    {id:'3', name:'3日'},
                    {id:'4', name:'4日'},
                    {id:'5', name:'5日'},
                    {id:'6', name:'6日'},
                    {id:'7', name:'7日'},
                    {id:'8', name:'8日'},
                    {id:'9', name:'9日'},
                    {id:'10', name:'10日'},
                    {id:'11', name:'11日'},
                    {id:'12', name:'12日'},
                    {id:'13', name:'13日'},
                    {id:'14', name:'14日'},
                    {id:'15', name:'15日'},
                    {id:'16', name:'16日'},
                    {id:'17', name:'17日'},
                    {id:'18', name:'18日'},
                    {id:'19', name:'19日'},
                    {id:'20', name:'20日'},
                    {id:'21', name:'21日'},
                    {id:'22', name:'22日'},
                    {id:'23', name:'23日'},
                    {id:'24', name:'24日'},
                    {id:'25', name:'25日'},
                    {id:'26', name:'26日'},
                    {id:'27', name:'27日'},
                    {id:'28', name:'28日'},
                    {id:'29', name:'29日'},
                    {id:'30', name:'30日'},
                    {id:'31', name:'31日'},
                    {id:'-1', name:'最后一天'},
                ]
            },
            //验证规则
            rules: {
                "code": [LIB.formRuleMgr.require(""),
                    LIB.formRuleMgr.length()
                ],
                "name": [LIB.formRuleMgr.require("计划名"),
                    LIB.formRuleMgr.length(100)
                ],
                "endDate": [LIB.formRuleMgr.require("结束时间"),
                    LIB.formRuleMgr.length(),
                    {
                        validator: function (rule, value, callback) {
                            var currentDate = new Date().Format("yyyy-MM-dd 00:00:00");
                            return value < currentDate ? callback(new Error('结束时间必须大于当前时间')) : callback();
                        }
                    }
                ],
                "startDate": [LIB.formRuleMgr.require("开始时间"),
                    LIB.formRuleMgr.length(),
                    {
                        validator: function (rule, value, callback) {
                            var currentDate = new Date().Format("yyyy-MM-dd 00:00:00");
                            return value < currentDate ? callback(new Error('开始时间必须大于当前时间')) : callback();
                        }
                    }
                ],
                "checkTable.name": [LIB.formRuleMgr.require("检查表"), LIB.formRuleMgr.length()],
                "compId": [{required: true, message: '请选择所属公司'}, LIB.formRuleMgr.length()],
                "orgId": [{required: true, message: '请选择所属部门'}, LIB.formRuleMgr.length()],
                // "checkType": [LIB.formRuleMgr.require("类型"), LIB.formRuleMgr.length() ],
                "disable": [LIB.formRuleMgr.length()],
                "remarks": [LIB.formRuleMgr.length(500)],
                typeId: [LIB.formRuleMgr.require("巡检类型")]
            },
            //"0": "未到期", "1": "待执行", "2":"按期执行", "3":"超期执行","4":"未执行"};
            emptyRules: {},
            initialOrgId:null
        },
        tableModel: {
            checkTaskTableModel: {
                url: "richeckplan/richecktasks/list/{curPage}/{pageSize}",
                columns: [{
                    title: "检查任务序号",
                    fieldName: "num",
                }, {
                    title: "执行人",
                    fieldName: "user.name"
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
                    render: function (data) {
                        return LIB.getDataDic("check_status", data.status);
                    }
                }],
                // defaultFilterValue : {"criteria.orderValue" : {checkerId : "5f96de9045"}}
            },
            preCheckTaskTableModel: {
                url: "richeckplan/richecktasks/view/{curPage}/{pageSize}",
                columns: [{
                    title: "检查任务序号",
                    fieldName: "num",
                }, {
                    title: "执行人",
                    fieldName: "user.name"
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
                    render: function (data) {
                        return LIB.getDataDic("check_status", data.status);
                    }
                }],
                // defaultFilterValue : {"criteria.orderValue" : {checkerId : "5f96de9045"}}
            },
            userTableModel: {

                url: "richeckplan/users/list/{curPage}/{pageSize}",
                columns: [{
                    title: "姓名",
                    fieldName: "username"
                },
                    //LIB.tableMgr.column.company,
                    _.extend(_.extend({}, LIB.tableMgr.column.company), {filterType: null}),
                    _.extend(_.extend({}, LIB.tableMgr.column.dept), {filterType: null}),
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
                queryUrl: "richeckplan/{id}/richecktask/{checkTaskId}"
            },
        },
        selectModel: {
            routeSelectModel: {
                visible: false
            },
            routeViewModel: {
                visible: false
            },
            userSelectModel: {
                visible: false,
                filterData:{}
            }
        },
        cardModel: {
            checkTaskCardModel: {
                showContent: true
            },
            userCardModel: {
                showContent: true
            },
        },

        //检查任务模块
        inspectTaskModel: {
            taskUsers: [], //检查人员
            taskUser: null, //下拉框选择的检查人员
            selectType: "1", //选择的任务状态
            isShow: false, //控制检查人员和任务状态下拉框显示
            taskShow: false, //控制显示预览任务列表
        },
        //频率设置模块
        frequencyModel: newFrequencyModel(),
        //userSelectModel : false,//选择人员显示

        showSpecialty: false,

        routeAreas: [], // 巡检线路
        auditObj: {
            visible: false
        },
        tabs: [
            {
                name: '未到期',
                id: "0"
            },
            {
                name: '待执行',
                id: "1"
            },
            {
                name: '按期执行',
                id: "2"
            },
            {
                name: '超期执行',
                id: "3"
            },
            {
                name: '未执行',
                id: "4"
            },
            {
                name: '已失效',
                id: "5"
            }
        ],
        timeSettingAction: {
            timeColumn: null,
            index: 0,
        },
        checkTypes: null,
        hasUnboundArea:false,//是否有未绑定rfid的区域
        enableDeptFilter: false,//是否启用部门过滤
        isCanSetExecuteOrder : false,//是否显示：按顺序执行检查checkbox
        isExcuteOrder : true,//顺序执行检查checkbox是否勾选
        isShowMajorRiskSourceSelect:false,
        isMajorRiskSourceMenu:false,
    };
    //Vue组件
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
    var detail = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.detailPanel],
        template: tpl,
        components: {
            "routeSelectModal": routeSelectModal,
            "userSelectModal": userSelectModal,
            "routeViewModal": routeViewModal
        },
        data: function () {
            return dataModel;
        },
        computed: {
            showFrequencyText: function () {
                return this.mainModel.vo.checkType == 1 && this.mainModel.isReadOnly && (this.mainModel.vo.planSetting.isRepeatable != 2 || this.mainModel.vo.planSetting.frequencyType == 5);
            },
            showFrequencyInput: function () {
                return this.mainModel.vo.checkType == 1 && (!this.mainModel.isReadOnly || (this.mainModel.vo.planSetting.isRepeatable == 2 && this.mainModel.vo.planSetting.frequencyType != 5));
            },
            typeName: function () {
                return _.get(_.find(this.checkTypes, "id", this.mainModel.vo.typeId), "name", "")
            }
        },
        watch: {
            'mainModel.vo.orgId':function () {
                var _this = this;
                var opType = _this.mainModel.opType;
                var _vo = _this.mainModel.vo;
                if (opType === 'update' && _this.enableDeptFilter && _this.mainModel.initialOrgId !== _vo.orgId) {
                    if((_this.routeAreas && _this.routeAreas.length > 0) || (_this.inspectTaskModel.taskUsers && _this.inspectTaskModel.taskUsers.length > 0)) {
                        LIB.Msg.warning("已经设置的巡检线路和巡检人员都会清空，需要重新设置",3);
                    }
                }
            },
            'mainModel.vo.checkType': function(val) {
                if(!this.mainModel.isReadOnly ) {
                    if(val == 0 && !_.isEmpty(this.frequencyModel.planSetting.timeSettings)) {
                        this.frequencyModel.planSetting.timeSettings = [];
                    }
                    if(val == 1) {
                        this.resetTimeSettings();
                    }
                }
            }
        },
        methods: {
            newVO: newVO,
            doTabClick: function(tabId) {
                this.inspectTaskModel.selectType = tabId;
                var columns = this.tableModel.checkTaskTableModel.columns;
                if (columns.length === 7) {
                    columns.splice(5,1);
                }
                if (tabId === '5') {
                    var column = {
                        title: "取消理由",
                        fieldName: "attr1"
                    }
                    columns.splice(5,0,column);
                }
                this.doChangeStatus();
            },
            // 处理巡检区域数据
            _convertCheckAreaArray: function (items) {
                if (!_.isArray(items)) {
                    return;
                }
                var _this = this;
                _this.hasUnboundArea = false;
                var splitLength = 6,
                    total = items.length;

                var arr = _.map(items, function (item, index) {
                    if(!item.isBond) {
                        _this.hasUnboundArea = true;
                    }
                    return {
                        index: index + 1,
                        total: total,
                        name: item.name,
                        isBond: item.isBond
                    }
                });

                arr = _.chunk(arr, splitLength);

                arr = _.forEach(arr, function (item, index) {
                    if (index % 2 !== 0) {
                        item.reverse();
                    }
                });

                this.routeAreas = arr;

            },
            /**
             *
             * @param gi groupIndex 6个为一组，组的序号，从0开始
             * @param item 每一个检查点
             * @return {Array}
             */
            calcClass: function (gi, item) {
                var splitLength = 6;

                var res = [];
                var _cls;

                // 1.长度为1时去掉线
                if (item.total === 1) {
                    res.push('line-zero');
                    return res;
                }
                // 2.第一个去掉左半边的线
                if (item.index === 1) {
                    res.push('half-right');
                    return res;
                }
                // 3.最后一项 根据行数判断去掉左半边还是右半边的线
                if (item.index === item.total) {
                    _cls = gi % 2 === 0 ? 'half-left' : 'half-right';
                    res.push(_cls);
                    return res;
                }
                // 4. 其他不是行首或者行尾的
                if (item.index % splitLength !== 0) {
                    return res;
                }
                // 5. 其他事行首或者行尾的需要加转折线
                var results = {
                    "0": 'odd-end', // 奇数行最后一个
                    "1": "even-end" // 偶数行最后一个
                };
                var key = '' + (gi % 2);
                if (item.index < item.total) {
                    res.push(results[key]);
                }
                return res;
            },
            calcItemClass: function (item) {
                if(item.isBond) {
                    return ['sq'];
                }else{
                    return ['unbound','sq'];
                }
            },
            getTitle : function (item) {
                if(!item.isBond) {
                    return "该巡检区域未绑定电子标签";
                }
            },
            // 保存操作
            //beforeDoSave: function () {
            //    var _this = this;
            //    if ((Date.parse(_this.mainModel.vo.endDate) - Date.parse(_this.mainModel.vo.startDate)) > 31536000000) {
            //        LIB.Msg.warning("总的计划时间跨度不能超过一年!");
            //        return false;
            //    }
            //    return true;
            //},
            afterFormValidate: function () {
                var _this = this;
                var _data = this.mainModel;
                var _vo = _data.vo;

                //判断是否类型选择执行一次还是多次 ，此当为执行多次时
                if (_this.mainModel.vo.checkType == 1) {
                    if(_this.frequencyModel.planSetting.frequencyType != 5) {//禅道任务2851，新的计划频率逻辑
                        _vo.planSetting = {
                            isWeekendInculed: _this.frequencyModel.add.isWeekendInculedFlag ? 1 : 0,
                            isRepeatable: 2,
                            frequencyType: _this.frequencyModel.planSetting.frequencyType,
                            period: "1",
                            unit: 1,
                            startTime: null,
                            endTime: null,
                            id: null,
                            timeSettings: _this.frequencyModel.planSetting.timeSettings
                        }
                        if (!_this.frequencyModel.planSetting.timeSettings || _this.frequencyModel.planSetting.timeSettings.length == 0) {
                            LIB.Msg.warning("请添加频率设置");
                            return false;
                        }
                        var isCompleted = true;//时间设置是否填写完整
                        var isStartBeforeEnd = true;//开始时间是否小于结束时间
                        var timeSettings = _.sortBy(_this.frequencyModel.planSetting.timeSettings, function (item) {
                            //校验是否填写完整
                            if (!item.startTime || !item.endTime) {
                                isCompleted = false;
                                return;
                            }
                            if (_this.frequencyModel.planSetting.frequencyType != 1 && (!item.startDay || !item.endDay)) {
                                isCompleted = false;
                                return;
                            }
                            if ((_this.frequencyModel.planSetting.frequencyType == 4 || _this.frequencyModel.planSetting.frequencyType == 6 ) && (!item.startMonth || !item.endMonth)) {
                                isCompleted = false;
                                return;
                            }
                            //校验每一条设置开始时间是否小于结束时间
                            if (_this.frequencyModel.planSetting.frequencyType == 1 && item.startTime >= item.endTime) {
                                isStartBeforeEnd = false;
                                return;
                            }

                            var startDay = parseInt(item.startDay);
                            var endDay = parseInt(item.endDay);
                            if (startDay == -1) {//最后一天比较大小时当做31号
                                startDay = 31;
                            }
                            if (endDay == -1) {//最后一天比较大小时当做31号
                                endDay = 31;
                            }

                            if (_this.frequencyModel.planSetting.frequencyType == 2 || _this.frequencyModel.planSetting.frequencyType == 3) {
                                if (startDay > endDay || (startDay == endDay && item.startTime >= item.endTime)) {
                                    isStartBeforeEnd = false;
                                    return;
                                }
                            }
                            if (_this.frequencyModel.planSetting.frequencyType == 4 || _this.frequencyModel.planSetting.frequencyType == 6) {
                                if (parseInt(item.startMonth) > parseInt(item.endMonth)) {
                                    isStartBeforeEnd = false;
                                    return;
                                }
                                if (item.startMonth == item.endMonth) {
                                    if (startDay > endDay || (startDay == endDay && item.startTime >= item.endTime)) {
                                        isStartBeforeEnd = false;
                                        return;
                                    }
                                }
                            }
                            //将全部设置按开始时间排序
                            var startTimeStrs = item.startTime.split(":");
                            var endTimeStrs = item.endTime.split(":");
                            var start = startTimeStrs[0] / 24 + startTimeStrs[1] / 60 / 24 + startTimeStrs[2] / 3600 / 24;//开始时间转换为以天为单位的数值
                            var end = endTimeStrs[0] / 24 + endTimeStrs[1] / 60 / 24 + endTimeStrs[2] / 3600 / 24;//开始时间转换为以天为单位的数值
                            if (_this.frequencyModel.planSetting.frequencyType == 2 || _this.frequencyModel.planSetting.frequencyType == 3) {
                                start += parseInt(startDay);
                                end += parseInt(endDay);
                            } else if (_this.frequencyModel.planSetting.frequencyType == 4 || _this.frequencyModel.planSetting.frequencyType == 6) {
                                start += 31 * parseInt(item.startMonth) + parseInt(startDay);//月份换算成天时，按每月31天计算，可以保证时间大小顺序不变
                                end += 31 * parseInt(item.endMonth) + parseInt(endDay);
                            }
                            item.start = start;
                            item.end = end;
                            return start;
                        });
                        if (!isCompleted) {
                            LIB.Msg.warning("有未填写完整的频率设置");
                            return false;
                        }
                        if (!isStartBeforeEnd) {
                            LIB.Msg.warning("每一条频率设置的起始时间必须小于结束时间");
                            return false;
                        }
                        //校验不同设置的时间是否交叉
                        var isCrossed = false;
                        var prevStart, prevEnd;//用于记录遍历设置时记录上一设置的起始结束时间
                        _.each(timeSettings, function (item) {
                            if (!prevStart) {
                                prevStart = item.start;
                                prevEnd = item.end;
                            } else {
                                if (item.start < prevEnd) {
                                    isCrossed = true;
                                    return;
                                }
                                prevStart = item.start;
                                prevEnd = item.end;
                            }
                        });
                        if (isCrossed) {
                            LIB.Msg.warning("不同频率设置的时间不能交叉");
                            return false;
                        }
                    }else{
                        //执行频率选择自定义
                        if (_this.frequencyModel.planSetting.period && !isNaN(_this.frequencyModel.planSetting.period) && (Number(_this.frequencyModel.planSetting.period) > 0)) {
                            var period = _this.frequencyModel.planSetting.period;
                            var unit = _this.frequencyModel.planSetting.unit;
                            if (parseInt(period) == period) {
                                if (unit == 1) {
                                    if (period < 30) {
                                        LIB.Msg.warning("间隔单位为分钟时，间隔时间必须>=30");
                                        return;
                                    }
                                }
                                else if (unit == 2) {
                                    if (period < 1) {
                                        LIB.Msg.warning("间隔单位为小时时，间隔时间必须>=1");
                                        return;
                                    }
                                }
                                else {
                                    if (period < 1) {
                                        LIB.Msg.warning("间隔时间必须>=1");
                                        return false;
                                    }
                                }
                            } else {
                                LIB.Msg.warning("请输入间隔，且间隔必须是整数");
                                return;
                            }
                            _vo.planSetting = {
                                isWeekendInculed: _this.frequencyModel.add.isWeekendInculedFlag ? 1 : 0,
                                isRepeatable: 2,
                                frequencyType: _this.frequencyModel.planSetting.frequencyType,
                                unit: _this.frequencyModel.planSetting.unit,
                                period: _this.frequencyModel.planSetting.period,
                                startTime: null,
                                endTime: null,
                                id: null
                            }
                        } else {
                            LIB.Msg.warning("请输入间隔，且间隔必须是整数");
                            return false;
                        }
                    }
                } else {
                    //判断是否类型选择执行一次还是多次 ，此当为执行一次时
                    _vo.planSettingId = null;
                    _vo.planSetting = {
                        unit: 1, //间隔
                        isWeekendInculed: "1", //是否包含周末  0不包含 1包含
                        frequencyType: "1", //频率类型 1天 2周 3月 4季度 5自定义
                        period: "1", //时间间隔
                        isRepeatable: "0", //是否重复 0:执行一次,1:执行多次（旧）,2:执行多次（新）
                        startTime: null, //开始时间
                        endTime: null, //结束时间
                        id: null,
                    };
                }
                ;

                //只有选择每天执行频率才有是否包含周六日的选择
                if (_this.frequencyModel.planSetting.frequencyType == 1) {
                    _this.frequencyModel.planSetting.isWeekendInculed == _this.frequencyModel.add.isWeekendInculedFlag ? 1 : 0;
                } else {
                    _this.frequencyModel.planSetting.isWeekendInculed == 1;
                }
                return true;
            },
            buildSaveData: function () {
                var _this = this;
                var _vo = this.mainModel.vo;
                _vo.planSetting.id = _vo.planSettingId;
                var resultDate = null;
                if (_vo.checkType != 1) {
                    resultDate = _.pick(_this.mainModel.vo, "planSettingId", "attr1", "createDate", "modifyDate", "specialty", "remarks", "disable", "checkType", "id", "orgId", "code", "endDate", "startDate", "compId", "name", "typeId","bizType");
                } else {
                    resultDate = _.pick(_this.mainModel.vo, "planSetting","attr1", "planSettingId", "createDate", "modifyDate", "specialty", "remarks", "disable", "checkType", "id", "orgId", "code", "endDate", "startDate", "compId", "name", "typeId","bizType");
                }
                return resultDate;
            },
            afterDoSave: function (opt, res) {
                var _this = this;
                _.last(this.tableModel.userTableModel.columns).visible = (this.mainModel.vo.status == "0");
                this.$refs.userTable.refreshColumns();
                var _data = this.mainModel;
                var _vo = _data.vo;
                _this.mainModel.initialOrgId = _vo.orgId;
                this.isExcuteOrder = this.mainModel.vo.attr1 == '1';
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
                    // 当修改 所属部门时， 关联的巡检路线、巡检表需要清空
                    if(this.enableDeptFilter && this.mainModel.vo.orgId != this.mainModel.beforeEditVo.orgId) {
                        this.mainModel.vo.checkTableId = null;
                        this.mainModel.vo.riCheckTable = {id:null, name:null};
                    }


                    _this.refreshTableData(_this.$refs.userTable);
                    api.getUsers({id: _this.mainModel.vo.id}).then(function (res) {
                        //初始化数据
                        var _taskModel = _this.inspectTaskModel;
                        if (res.body.length > 0) { //判断是否有任务人的数据
                            _taskModel.isShow = true;
                            _taskModel.taskUsers = [];
                            _.each(res.body, function (val, index) {
                                _taskModel.taskUsers.push(val);
                            });
                            _this.mainModel.vo.checkerId = res.data[0].id;
                            _taskModel.taskUser = res.data[0].id;
                            _taskModel.selectType = "1";
                            if (_this.mainModel.vo.disable == 1) {
                                _taskModel.taskShow = true;
                                _this.$refs.checktaskTable.doQuery({
                                    id: _this.mainModel.vo.id,
                                    "criteria.strValue.checkerId": _this.mainModel.vo.checkerId,
                                    "criteria.intValue.status": _this.inspectTaskModel.selectType
                                });
                            } else {
                                _taskModel.taskShow = false;
                                _this.$refs.preChecktaskTable.doQuery({
                                    id: _this.mainModel.vo.id,
                                    "criteria.strValue.checkerId": _this.mainModel.vo.checkerId,
                                    "criteria.intValue.status": _this.inspectTaskModel.selectType
                                });
                            }

                        } else {
                            _taskModel.taskUsers = [];
                            _this.refreshTableData(_this.$refs.preChecktaskTable);
                            if (_this.mainModel.vo.disable == 1) {
                                _taskModel.taskShow = true;
                            } else {
                                _taskModel.taskShow = false;
                            }
                            _taskModel.isShow = false;
                        }
                    });
                    this._getRoute();
                    _this.mainModel.isReadOnly = true;
                }
                //保存之后页面渲染的判断
                var _detail = _this.frequencyModel.detail,
                    _common = _this.frequencyModel.common;
                if (_this.mainModel.vo.checkType == 0) {
                    _this.mainModel.isReadOnly = true;
                } else {
                    _this.mainModel.isReadOnly = true;
                    if (_vo.planSetting.isWeekendInculed == 1) {
                        _detail.isIncludeWeek = true
                    } else {
                        _detail.isIncludeWeek = false
                    }

                    if (_this.frequencyModel.planSetting.frequencyType == 1) {
                        _detail.frequencyTypeName = "天";
                        _common.frequencyName = "频率设置";
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
                        } else if (_this.frequencyModel.planSetting.unit == 7) {
                            _detail.unitName = "年";
                        }
                    } else if (_this.frequencyModel.planSetting.frequencyType == 2) {
                        _detail.definedTime = false;
                        _common.isNoRepeat = true;
                        _common.isRepeat = false;
                        _detail.frequencyTypeName = "周";
                        _common.frequencyName = "频率设置";
                    } else if (_this.frequencyModel.planSetting.frequencyType == 3) {
                        _detail.definedTime = false;
                        _common.isNoRepeat = true;
                        _common.isRepeat = false;
                        _detail.frequencyTypeName = "月";
                        _common.frequencyName = "频率设置"
                    } else if (_this.frequencyModel.planSetting.frequencyType == 4) {
                        _detail.definedTime = false;
                        _common.isNoRepeat = true;
                        _common.isRepeat = false;
                        _detail.frequencyTypeName = "季";
                        _common.frequencyName = "频率设置"
                    } else if (_this.frequencyModel.planSetting.frequencyType == 6) {
                        _detail.definedTime = false;
                        _common.isNoRepeat = true;
                        _common.isRepeat = false;
                        _detail.frequencyTypeName = "年";
                        _common.frequencyName = "频率设置"
                    }
                }
            },

            //点击保存检查人员
            doSaveUsers: function (selectedDatas) {
                var _this = this;
                if (selectedDatas) {
                    // dataModel.mainModel.users = selectedDatas;
                    var param = _.map(selectedDatas, function (data) {
                        return {id: data.id}
                    });
                    api.saveUsers({id: _this.mainModel.vo.id}, param).then(function () {
                        _this.refreshTableData(_this.$refs.userTable);
                        // _this.afterInitData();
                        _this.inspectTaskModel.taskUsers = [];
                        //对应刷新任务列表
                        api.getUsers({id: _this.mainModel.vo.id}).then(function (res) {
                            //初始化数据
                            _this.inspectTaskModel.isShow = true;
                            _this.inspectTaskModel.taskUsers = [];
                            _.each(res.body, function (val, index) {
                                _this.inspectTaskModel.taskUsers.push(val);
                            });
                            _this.inspectTaskModel.selectType = "1";
                            _this.mainModel.vo.checkerId = res.data[0].id;
                            _this.inspectTaskModel.taskUser = res.data[0].id;
                            var _disable = _this.mainModel.vo.disable;
                            if (_this.mainModel.vo.disable == 1 || _disable == 2) {
                                _this.inspectTaskModel.taskShow = true;
                                _this.$refs.checktaskTable.doQuery({
                                    id: _this.mainModel.vo.id,
                                    "criteria.strValue.checkerId": _this.mainModel.vo.checkerId,
                                    "criteria.intValue.status": _this.inspectTaskModel.selectType
                                });
                            } else {
                                _this.inspectTaskModel.taskShow = false;
                                _this.$refs.preChecktaskTable.doQuery({
                                    id: _this.mainModel.vo.id,
                                    "criteria.strValue.checkerId": _this.mainModel.vo.checkerId,
                                    "criteria.intValue.status": _this.inspectTaskModel.selectType
                                });
                            }
                        });
                    });
                }
            },
            //点击删除检查人员
            doRemoveUsers: function (item) {
                var _this = this;
                var data = item.entry.data;
                if (_this.mainModel.vo.disable == 1) {
                    LIB.Msg.warning("已发布的检查计划不能删除检查人员");
                    return;
                } else {
                    api.removeUsers({id: this.mainModel.vo.id}, [{id: data.id}]).then(function () {
                        _this.$refs.userTable.doRefresh();
                        // _this.afterInitData();
                        api.getUsers({id: _this.mainModel.vo.id}).then(function (res) {
                            //初始化数据
                            if (res.body.length > 0) {
                                _this.inspectTaskModel.isShow = true;
                                _this.inspectTaskModel.taskUsers = [];
                                _.each(res.body, function (val, index) {
                                    _this.inspectTaskModel.taskUsers.push(val);
                                });
                                _this.mainModel.vo.checkerId = res.data[0].id;
                                _this.inspectTaskModel.taskUser = res.data[0].id;
                                _this.inspectTaskModel.selectType = "1";
                                var _disable = _this.mainModel.vo.disable;
                                if (_this.mainModel.vo.disable == 1 || _disable == 2) {
                                    _this.inspectTaskModel.taskShow = true;
                                    _this.$refs.checktaskTable.doQuery({
                                        id: _this.mainModel.vo.id,
                                        "criteria.strValue.checkerId": _this.mainModel.vo.checkerId,
                                        "criteria.intValue.status": _this.inspectTaskModel.selectType
                                    });
                                } else {
                                    _this.inspectTaskModel.taskShow = false;
                                    _this.$refs.preChecktaskTable.doQuery({
                                        id: _this.mainModel.vo.id,
                                        "criteria.strValue.checkerId": _this.mainModel.vo.checkerId,
                                        "criteria.intValue.status": _this.inspectTaskModel.selectType
                                    });
                                }

                            } else {
                                _this.inspectTaskModel.taskUsers = [];
                                var _disable = _this.mainModel.vo.disable;
                                if (_this.mainModel.vo.disable == 1 || _disable == 2) {
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
            doAppend: function () {
                if (this.mainModel.vo.disable == 1) {
                    LIB.Msg.warning("已发布的检查计划不能添加检查人员");
                    return;
                } else {
                    this.selectModel.userSelectModel.visible = true;
                    this.selectModel.userSelectModel.filterData = {orgId : (this.enableDeptFilter ? this.mainModel.vo.orgId : null)};
                }
            },

            beforeInit: function () {
                var bizType = this.$route.query.bizType;
                if(bizType === '1'){
                    this.isMajorRiskSourceMenu = true;
                }else{
                    this.isMajorRiskSourceMenu = false;
                }
                var _disable = this.mainModel.vo.disable;
                var columns = this.tableModel.checkTaskTableModel.columns;
                if (columns.length === 7) {
                    columns.splice(5,1);
                }
                if (this.mainModel.vo.disable == 1 || _disable == 2) {
                    this.inspectTaskModel.taskShow = true;
                    this.$refs.checktaskTable.doClearData();
                } else {
                    this.inspectTaskModel.taskShow = false;
                    this.$refs.preChecktaskTable.doClearData();
                }
                this.routeAreas = [];
                this.mainModel.initialOrgId = null;
                this.showSpecialty = LIB.setting.fieldSetting["BC_Hal_InsP"] ? true : false;
                this.$refs.userTable.doClearData();
            },
            afterInitData: function () {
                this._getRoute();
                //如果计划已发布隐藏最后一列tool操作列
                {
                    _.last(this.tableModel.userTableModel.columns).visible = (this.mainModel.vo.status == "0");
                    this.$refs.userTable.refreshColumns();
                }
                var _this = this;
                _vo = _this.mainModel.vo;
                this.isExcuteOrder = this.mainModel.vo.attr1 == '1';
                _this.mainModel.initialOrgId = _vo.orgId;
                _this.frequencySetting();
                if (_vo.createBy) {
                    api.getUser({id: _vo.createBy}).then(function (res) {
                        _vo.creater = res.body;
                    });
                }
                api.getUsers({id: _vo.id}).then(function (res) {
                    //初始化数据
                    if (res.body.length > 0) {
                        _this.inspectTaskModel.isShow = true;
                        _this.inspectTaskModel.taskUsers = [];
                        _.each(res.body, function (val, index) {
                            _this.inspectTaskModel.taskUsers.push(val);
                        });
                        _vo.checkerId = res.data[0].id;
                        _this.inspectTaskModel.taskUser = res.data[0].id;
                        _this.inspectTaskModel.selectType = "1";
                        if (_vo.disable != 0) {
                            _this.inspectTaskModel.taskShow = true;
                            _this.$refs.checktaskTable.doQuery({
                                id: _this.mainModel.vo.id,
                                "criteria.strValue.checkerId": _this.mainModel.vo.checkerId,
                                "criteria.intValue.status": _this.inspectTaskModel.selectType
                            });
                        } else {
                            _this.inspectTaskModel.taskShow = false;
                            _this.$refs.preChecktaskTable.doQuery({
                                id: _this.mainModel.vo.id,
                                "criteria.strValue.checkerId": _this.mainModel.vo.checkerId,
                                "criteria.intValue.status": _this.inspectTaskModel.selectType
                            });
                        }

                    } else {
                        _this.inspectTaskModel.isShow = false;
                        _this.inspectTaskModel.taskUsers = [];
                    }
                });
                this.$refs.userTable.doQuery({id: this.mainModel.vo.id});

                //编辑时频率设置模块
                if (_this.mainModel.opType == 'update') {
                    _this.doEdit();
                }

            },

            //切换任务对应的人
            doChooseUser: function (index) {
                var _this = this,
                    index = index.key;
                _this.inspectTaskModel.selectType = "1";
                _this.mainModel.vo.checkerId = _this.inspectTaskModel.taskUser;
                var _disable = _this.mainModel.vo.disable;
                if (_disable != 0) {
                    var columns = this.tableModel.checkTaskTableModel.columns;
                    if (columns.length === 7) {
                        columns.splice(5,1);
                    }
                    _this.inspectTaskModel.taskShow = true;
                    _this.$refs.checktaskTable.doQuery({
                        id: _this.mainModel.vo.id,
                        "criteria.strValue.checkerId": _this.mainModel.vo.checkerId,
                        "criteria.intValue.status": _this.inspectTaskModel.selectType
                    });
                } else {
                    _this.inspectTaskModel.taskShow = false;
                    _this.$refs.preChecktaskTable.doQuery({
                        id: _this.mainModel.vo.id,
                        "criteria.strValue.checkerId": _this.mainModel.vo.checkerId,
                        "criteria.intValue.status": _this.inspectTaskModel.selectType
                    });
                }

            },
            //发布
            doPublish: function () {
                var _this = this;
                if (this.mainModel.vo.disable == 1) {
                    LIB.Msg.warning("已发布!");
                    return false;
                }
                if (this.mainModel.vo.status !== '2') {
                    LIB.Msg.warning("只能发布审核通过的数据");
                    return false;
                }
                api.publish([_this.mainModel.vo.id]).then(function (res) {
                    _this.$dispatch("ev_dtPublish");
                    LIB.Msg.info("已发布!");
                });
            },
            beforeDoDelete: function () {
                if (this.mainModel.vo.disable == 1) {
                    LIB.Msg.warning("已发布不能删除,请重新选择!");
                    return false;
                }
            },
            //筛选任务状态
            doChangeStatus: function () {
                var _this = this;
                var _disable = _this.mainModel.vo.disable;
                if (_disable != 0) {
                    _this.inspectTaskModel.taskShow = true;
                    _this.$refs.checktaskTable.doQuery({
                        id: _this.mainModel.vo.id,
                        "criteria.strValue.checkerId": _this.mainModel.vo.checkerId,
                        "criteria.intValue.status": _this.inspectTaskModel.selectType
                    });
                } else {
                    _this.inspectTaskModel.taskShow = false;
                    _this.$refs.preChecktaskTable.doQuery({
                        id: _this.mainModel.vo.id,
                        "criteria.strValue.checkerId": _this.mainModel.vo.checkerId,
                        "criteria.intValue.status": _this.inspectTaskModel.selectType
                    });
                }

            },
            resetTimeSettings: function() {
                var timeSetting = {
                    startMonth:null,//起始月
                    startDay:null,//起始天
                    startTime: null, //起始时间
                    endMonth:null,//结束月
                    endDay:null,//结束天
                    endTime: null, //结束时间
                };
                if(this.frequencyModel.planSetting.frequencyType != 1 && this.frequencyModel.planSetting.frequencyType != 5) {
                    timeSetting.startTime = '00:00:00';
                    timeSetting.endTime = '23:59:59';
                }
                this.frequencyModel.planSetting.timeSettings = [timeSetting];
            },
            //改变频率
            dochangefrequencyType: function (frequencyType) {
                var _this = this;
                var _common = _this.frequencyModel.common,
                    _add = _this.frequencyModel.add;
                if(!this.mainModel.isReadOnly ) {
                    this.resetTimeSettings();
                }
                //频率类型 1天 2周 3月 4季度 5自定义 6年
                if (frequencyType == 5) {
                    _common.frequencyName = "自定义频率";
                    _add.isShowMy = true;
                    _add.isShowCommon = false;
                    _common.isNoRepeat = false;
                    _common.isRepeat = true;
                    _this.frequencyModel.planSetting.unit = "1";
                } else {
                    _common.frequencyName = "频率设置";
                    _add.isShowMy = false;
                    _add.isShowCommon = true;
                    _common.isNoRepeat = true;
                    _common.isRepeat = false;
                }
            },
            //执行一次
            doOnce: function () {
                var _this = this;
                _this.frequencyModel.common.isNoRepeat = true;
                _this.frequencyModel.common.isRepeat = false;
            },
            //执行多次
            doMuch: function () {
                var _this = this;
                _this.frequencyModel.common.isNoRepeat = false;
                _this.frequencyModel.common.isRepeat = true;
            },
            //执行多次
            doSetTime: function() {
                var _this = this;
                _this.frequencyModel.common.isNoRepeat = false;
                _this.frequencyModel.common.isRepeat = false;
            },
            //设置开始时间
            startTime: function (data) {
                this.frequencyModel.planSetting.startTime = data;
            },
            //设置结束时间
            endTime: function (data) {
                var _this = this;
                _this.frequencyModel.planSetting.endTime = data;
            },
            doAddTimeSetting: function() {
                var timeSetting = {
                    startMonth:null,//起始月
                    startDay:null,//起始天
                    startTime: null, //起始时间
                    endMonth:null,//结束月
                    endDay:null,//结束天
                    endTime: null, //结束时间
                };
                if(this.frequencyModel.planSetting.frequencyType != 1 && this.frequencyModel.planSetting.frequencyType != 5) {
                    timeSetting.startTime = '00:00:00';
                    timeSetting.endTime = '23:59:59';
                }
                this.frequencyModel.planSetting.timeSettings.push(timeSetting);
            },
            doTimeSetting: function(date) {
                if(!!this.timeSettingAction.timeColumn) {
                    this.frequencyModel.planSetting.timeSettings[this.timeSettingAction.index][this.timeSettingAction.timeColumn] = date;
                }
            },
            beforeSetTime: function(timeColumn, index) {
                this.timeSettingAction.timeColumn = timeColumn;
                this.timeSettingAction.index = index;
            },
            removeTimeSetting: function(index) {
                this.frequencyModel.planSetting.timeSettings.splice(index, 1);
            },
            doChangeMonth: function(flag, index) {//flag:1表示起始时间，2表示结束时间
                //切换月份时，将天数清空，因为每个月的天数可能不一样
                this.frequencyModel.planSetting.timeSettings[index][flag == 1 ? "startDay" : "endDay"] = null;
            },
            showMonthDay: function(month, day) {
                if(day == 31 && (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12)) {
                    return true;
                }
                if(day < 31 && day > 28 && month != 2) {//除了2月其他月都显示28~30日
                    return true;
                }
                if(day == -1 && month == 2) {//除了2月的天数不确定，其他月都不显示最后一天选项
                    return true;
                }
                if(day <= 28 && day > 0) {
                    return true;
                }
                return false;
            },
            afterDoEdit: function () {
                var _this = this;
                var _add = _this.frequencyModel.add;
                _common = _this.frequencyModel.common;
                // this.mainModel.beforeEditVo = {};
                // _.deepExtend(this.mainModel.beforeEditVo, this.mainModel.vo);
                _this.mainModel.isReadOnly = false;
                _this.mainModel.opType = "update";
                if (_this.mainModel.vo.checkType == 1) {
                    if (_this.mainModel.vo.planSetting.isRepeatable == 1) {
                        _common.isRepeat = true;
                        _common.isNoRepeat = false;
                    } else {
                        _common.isRepeat = false;
                        _common.isNoRepeat = true;
                        if (_this.mainModel.vo.planSetting.frequencyType == 1) {
                            _this.frequencyModel.planSetting.unit = 1;
                        }
                    }
                    //
                    if (_this.mainModel.vo.planSetting.frequencyType == 1) {
                        _add.isShowMy = false;
                        _add.isShowCommon = true;
                        _add.isWeekendInculedFlag = _this.mainModel.vo.planSetting.isWeekendInculed == 1 ? true : false
                    } else if (_this.mainModel.vo.planSetting.frequencyType == 5) {
                        _add.isShowMy = true;
                        _add.isShowCommon = false;
                    } else {
                        _add.isShowMy = false;
                        _add.isShowCommon = true;
                    }
                } else {
                }
            },
            afterInit: function (_pass, obj) {
                if (obj.opType === 'create') {
                    this.mainModel.vo.orgId = LIB.user.orgId;
                    this.mainModel.vo.bizType = this.$route.query.bizType == null ? '0' : this.$route.query.bizType ;
                }
                var _data = this.mainModel;
                var _vo = _data.vo;
                var _frequencyModel = this.frequencyModel;
                //清空数据
                _.deepExtend(_frequencyModel, newFrequencyModel());
                this.frequencyModel.planSetting = {
                    unit: 1, //间隔
                    isWeekendInculed: null, //是否包含周末  0不包含 1包含
                    frequencyType: "1", //频率类型 1天 2周 3月 4季度 5自定义 6年
                    period: null, //时间间隔
                    isRepeatable: null, //是否重复 0:执行一次,1:执行多次（旧）,2:执行多次（新）
                    startTime: null, //开始时间
                    endTime: null, //结束时间
                    timeSettings:[
                        {
                            startMonth:null,//起始月
                            startDay:null,//起始天
                            startTime: null, //起始时间
                            endMonth:null,//结束月
                            endDay:null,//结束天
                            endTime: null, //结束时间
                        }
                    ]
                };
                this.frequencyModel.add.isWeekendInculedFlag = true;
                this.hasUnboundArea = false;
            },
            afterDoCancel: function () {
                this.frequencySetting();
            },
            //初始化频率设置显示
            frequencySetting: function () {
                var _this = this;
                var _vo = _this.mainModel.vo,
                    _common = _this.frequencyModel.common,
                    _detail = _this.frequencyModel.detail;
                //初始化频率设置
                if (_vo.checkType == 0) {
                } else {
                    if (_vo.planSetting.isWeekendInculed == 1) {
                        _detail.isIncludeWeek = true
                    } else {
                        _detail.isIncludeWeek = false;
                    }
                    _this.frequencyModel.add.isWeekendInculedFlag = (_vo.planSetting.isWeekendInculed == 1);
                    _this.frequencyModel.planSetting = {
                        id: _vo.planSetting.id,
                        unit: _vo.planSetting.unit, //间隔
                        isWeekendInculed: _vo.planSetting.isWeekendInculed ? 1 : 0, //是否包含周末  0不包含 1包含
                        frequencyType: _vo.planSetting.frequencyType, //频率类型 1天 2周 3月 4季度 5自定义 6年
                        period: _vo.planSetting.period, //时间间隔
                        isRepeatable: _vo.planSetting.isRepeatable, //是否重复 0:执行一次,1:执行多次（旧）,2:执行多次（新）
                        startTime: _vo.planSetting.startTime, //开始时间
                        endTime: _vo.planSetting.endTime, //结束时间
                        timeSettings: _vo.planSetting.timeSettings || []
                    };
                    if (_this.frequencyModel.planSetting.frequencyType == 1) {
                        _detail.frequencyTypeName = "天";
                        _common.frequencyName = "频率设置";
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
                        } else if(_this.frequencyModel.planSetting.isRepeatable == 0){
                            _common.isRepeat = false;
                            _common.isNoRepeat = true;
                        } else{
                            _common.isRepeat = false;
                            _common.isNoRepeat = false;
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
                        } else if (_this.frequencyModel.planSetting.unit == 7) {
                            _detail.unitName = "年";
                        }
                    } else if (_this.frequencyModel.planSetting.frequencyType == 2) {
                        _detail.definedTime = false;
                        _common.isNoRepeat = true;
                        _common.isRepeat = false;
                        _detail.frequencyTypeName = "周";
                        _common.frequencyName = "频率设置";
                    } else if (_this.frequencyModel.planSetting.frequencyType == 3) {
                        _detail.definedTime = false;
                        _common.isNoRepeat = true;
                        _common.isRepeat = false;
                        _detail.frequencyTypeName = "月";
                        _common.frequencyName = "频率设置"
                    } else if (_this.frequencyModel.planSetting.frequencyType == 4) {
                        _detail.definedTime = false;
                        _common.isNoRepeat = true;
                        _common.isRepeat = false;
                        _detail.frequencyTypeName = "季";
                        _common.frequencyName = "频率设置"
                    } else if (_this.frequencyModel.planSetting.frequencyType == 6) {
                        _detail.definedTime = false;
                        _common.isNoRepeat = true;
                        _common.isRepeat = false;
                        _detail.frequencyTypeName = "年";
                        _common.frequencyName = "频率设置"
                    }
                }
            },

            // 巡检线路设置
            doSetRoute: function () {
                this.$broadcast("do-select-ri-table", this.mainModel.vo.checkTableId, _.get(this.mainModel.vo, "riCheckTable.name"))
                this.selectModel.routeSelectModel.visible = true;
            },
            doSeeRoute: function () {
                this.$broadcast("do-view-ri-table");
                this.selectModel.routeViewModel.visible = true;
            },
            doSaveRoute: function (param) {
                this._getRoute();
                this.selectModel.routeSelectModel.visible = false;

                //更新关联的 checkTable
                this.mainModel.vo.checkTableId = param.checkTable.id;
                this.mainModel.vo.riCheckTable = {id: param.checkTable.id, name: param.checkTable.name};
                this.mainModel.vo.beforeEditVo = param.checkTable.id;
                this.mainModel.vo.beforeEditVo = {id: param.checkTable.id, name: param.checkTable.name};

                this.$dispatch("ev_dtUpdate");
            },
            _getRoute: function () {
                var _this = this;
                // _this.routeAreas
                api.queryPlanRoute({id: this.mainModel.vo.id}).then(function (res) {
                    var items = [];
                    _.each(res.data, function (item) {
                        if(!_this.enableDeptFilter || item.orgId == _this.mainModel.vo.orgId) {
                            items.push({
                                id: item.id,
                                name: item.name,
                                isBond: item.riCheckAreaTplRfid && item.riCheckAreaTplRfid.isBind == 1
                            })
                        }
                    });
                    _this._convertCheckAreaArray(items)
                })
            },

            doSubmit: function () {
                var _this = this;
                if (this.mainModel.vo.disable !== '0') {
                    LIB.Msg.warning("只能提交未发布的数据");
                    return false;
                }

                if(this.hasUnboundArea) {
                    LIB.Msg.warning("巡检计划包含的巡检区域有未绑定电子标签的情况，请先绑定电子标签之后再提交审核");
                    return false;
                }
                LIB.Modal.confirm({
                    title: '确定修改完毕，提交审核?',
                    onOk: function () {
                        api.submitRiCheckPlan({id: _this.mainModel.vo.id}).then(function () {
                            _this.mainModel.vo.status = '1';
                            _this.$dispatch("ev_dtUpdate");
                            LIB.Msg.success("提交成功");
                            _this._changeLastColumnVisibility();
                        })
                    }
                });
            },
            doAudit: function () {
                if (this.mainModel.vo.disable !== '0') {
                    LIB.Msg.warning("只能审核未发布的数据");
                    return false;
                }
                this.auditObj.visible = true;
            },
            _getVOData: function () {
                var _this = this;
                _this.$api.get({id: _this.mainModel.vo.id}).then(function(res) {
                    _.deepExtend(_this.mainModel.vo, res.data);
                    _this.storeBeforeEditVo();
                });
            },
            doPass: function (val) {
                var _this = this;
                api.auditRiCheckPlan({id: this.mainModel.vo.id, status: val}).then(function (res) {
                    _this.mainModel.vo.status = val === 200 ? '2' : '0';
                    _this.$dispatch("ev_dtUpdate");
                    LIB.Msg.success("审核操作成功");
                    _this._getVOData();
                    _this.auditObj.visible = false;
                    _this._changeLastColumnVisibility();
                })
            },
            doQuit: function () {
                var _this = this;
                if (this.mainModel.vo.disable !== '0') {
                    LIB.Msg.warning("只能弃审未发布的数据");
                    return false;
                }
                ;
                api.quitRiCheckPlan({id: this.mainModel.vo.id}).then(function (res) {
                    _this.mainModel.vo.status = '0';
                    _this.$dispatch("ev_dtUpdate");
                    _this._getVOData();
                    LIB.Msg.success("弃审成功");
                    _this._changeLastColumnVisibility();
                })
            },
            _changeLastColumnVisibility: function () {
                var lastColumn = _.last(this.tableModel.userTableModel.columns);
                var lastIndex = this.tableModel.userTableModel.columns.length - 1;
                lastColumn.visible = (this.mainModel.vo.status == "0");
                this.tableModel.userTableModel.columns.splice(lastIndex, 1, lastColumn);
            },
            excuteOrder: function(){
                var attr1 = this.isExcuteOrder ? 1 : 0 ;
                api.excuteOrder({id:this.mainModel.vo.id,attr1:attr1,orgId:this.mainModel.vo.orgId}).then(function (res) {

                });


            }
        },
        init: function () {
            this.$api = api;
        },
        ready: function () {
            var _this = this;
            api.queryCheckTypes({curPage:1, pageSize: 100, disable: 0}).then(function (res) {
                _this.checkTypes = res.data.list;
            })
            var enableDeptFilter = LIB.getBusinessSetByNamePath("routingInspection.enableDeptFilter");
            this.enableDeptFilter = (!!enableDeptFilter && enableDeptFilter.result == 2);
            this.isCanSetExecuteOrder = LIB.getBusinessSetByNamePath("routingInspection.isCanSetExecuteOrder").result == 2;
            this.isShowMajorRiskSourceSelect = LIB.getBusinessSetByNamePath('routingInspection.isShowMajorRiskSourceSelect').result === '2';
        }
    });

    return detail;
});