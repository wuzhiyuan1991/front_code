define(function (require) {
    var Vue = require("vue");
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail-xl.html");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var delegateRecordView = require("./dialog/delegateRecord");

    var checkItemFormModal = require("./dialog/itemFormModal");

    //初始化数据模型
    var newVO = function () {
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
            // checkerId:null,
            checkType: "0", //类型 0:执行一次,1:执行多次
            planSettingId: null,
            planSetting: {
                id: null,
                unit: "1", //间隔
                isWeekendInculed: null, //是否包含周末  0不包含 1包含
                frequencyType: "1", //频率类型 1天 2周 3月 4季度 5自定义 6年
                period: null, //时间间隔
                isRepeatable: null, //是否重复 0:执行一次,1:执行多次（旧）,2:执行多次（新）
                startTime: null, //开始时间
                endTime: null, //结束时间
            },
            //计划类型 0:无意义，1::工作计划 ，2:巡检计划
            planType: 0,
            checkTables: null
        }
    };
    //初始化频率设置
    var newFrequencyModel = function () {
        return {
            planSetting: {
                unit: "1", //间隔
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
                isNoRepeat: true, //选择执行一次
                isRepeat: false, //重复执行
                frequencyName: '频率设置', //根据执行频率显示频率选项
            },
            add: { //新增
                isWeekendInculedFlag: true, //是否包含周六日
                isShowMy: false, //是否显示自定义频率设置
                isShowCommon: true, //是否显示非自定义频率设置
            },
            detail: { //详情
                isIncludeWeek: true, //是否包含周六日
                unitName: null, //间隔单位
                definedTime: false, //自定义显示频率设置
                frequencyTypeName: null, //执行频率 的类型 -- 天、周、月、季、自定义
            }
        }
    };

    var checkItemColumns = [
        {
            title: '工作内容',
            fieldName: 'name'
        },
        {
            title: "",
            fieldType: "custom",
            width: 110,
            showTip: false,
            fieldName: "up",
            render: function (data) {
                return '<span  class="tableCustomIco_Up" title="上移" style="margin-left: 0;"><i class="ivu-icon ivu-icon-arrow-up-a"></i></span><span class="tableCustomIco_Down" title="下移"><i class="ivu-icon ivu-icon-arrow-down-a"></i></span>' +
                    '<span class="tableCustomIco_Edit" title="编辑"><i class="ivu-icon ivu-icon-edit"></i></span><span class="tableCustomIco_Del" title="删除"><i class="ivu-icon ivu-icon-trash-a"></i></span>'

            }
        }
    ];

    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            opType: 'view',
            isReadOnly: true,
            title: "",
            checkTypeList: [
                {
                    id: "0",
                    name: "执行一次"
                },
                {
                    id: "1",
                    name: "执行多次"
                }
            ],
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
            unitList1: [
                {
                    id: "1",
                    name: "分钟"
                },
                {
                    id: "2",
                    name: "小时"
                }
            ],
            //频率类型 1天 2周 3月 4季度 5自定义
            frequencyTypeList: [
                {
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
                "compId": [{required: true, message: '请选择所属公司'}, LIB.formRuleMgr.length()],
                "orgId": [{required: true, message: '请选择所属部门'}, LIB.formRuleMgr.length()],
                "specialty": [LIB.formRuleMgr.require("专业"), LIB.formRuleMgr.length()],
                "checkType": [LIB.formRuleMgr.require("类型"), LIB.formRuleMgr.length()],
                "disable": [LIB.formRuleMgr.length()],
                "remarks": [LIB.formRuleMgr.length()],
                "modifyDate": [LIB.formRuleMgr.length()],
                "createDate": [LIB.formRuleMgr.length()],
                "planType": [{required: true, message: '请选择计划类型'}, LIB.formRuleMgr.length()],
            },
            //"0": "未到期", "1": "待执行", "2":"按期执行", "3":"超期执行","4":"未执行"};
            emptyRules: {},
            typeList: [
                {
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
                }, {
                    name: '已失效',
                    id: "5"
                }
            ],
            specialtyList: [
                {id: "1", name: "设备工艺"},
                {id: "2", name: "自控"},
                {id: "3", name: "通信"},
                {id: "4", name: "压缩机"},
                {id: "5", name: "安全环保"},
                {id: "6", name: "生产运行"},
                {id: "7", name: "财务资产"},
                {id: "8", name: "综合"},
                {id: "9", name: "政工"},
                {id: "10", name: "电气"},
                {id: "11", name: "线路"},
                {id: "12", name: "防腐"},
            ]
        },
        tableModel: {
            checkTaskTableModel: {
                url: "ritmpcheckplan/checktasks/list/{curPage}/{pageSize}",
                columns: [{
                    title: "工作任务序号",
                    width: 150,
                    render: function (data) {
                        return data.num;
                    },
                }, {
                    title: "计划执行人",
                    width: 200,
                    render: function (data) {
                        if (data.firstChecker) {
                            return data.firstChecker.name;
                        } else if (data.checkUser) {
                            return data.checkUser.name;
                        }

                    },
                }, {
                    title: "任务开始时间",
                    fieldName: "startDate",
                    width: 150
                }, {
                    title: "任务结束时间",
                    fieldName: "endDate",
                    width: 150
                }, {
                    title: "任务完成时间",
                    fieldName: "checkDate",
                    width: 150
                }, {
                    title: "实际执行人",
                    fieldName: "checkUser.name",
                    render: function (data) {
                        if (data.firstChecker) {
                            return data.checkUser.name + '<i class="ivu-icon ivu-icon-document-text delegaterecord" style="font-size: 14px;margin-left: 5px;position: relative;top: 1px;cursor: pointer;"></i>';
                        } else if (data.checkUser) {
                            return data.checkUser.name;
                        }

                    },
                    width: 200
                }, {
                    title: "状态",
                    fieldType: "custom",
                    fieldName: "status",
                    render: function (data) {
                        return LIB.getDataDic("check_status", data.status);
                    },
                    width: 160
                }],
            },
            preCheckTaskTableModel: {
                url: "ritmpcheckplan/checktasks/view/{curPage}/{pageSize}",
                columns: [{
                    title: "工作任务序号",
                    render: function (data) {
                        return data.num;
                    },
                    width: 150
                }, {
                    title: "执行人",
                    fieldName: "checkUser.name",
                    width: 200
                }, {
                    title: "任务开始时间",
                    fieldName: "startDate",
                    width: 230
                }, {
                    title: "任务结束时间",
                    fieldName: "endDate",
                    width: 230
                }, {
                    title: "任务完成时间",
                    fieldName: "checkDate",
                    width: 230
                }, {
                    title: "状态",
                    fieldType: "custom",
                    fieldName: "status",
                    render: function (data) {
                        return LIB.getDataDic("check_status", data.status);
                    },
                    width: 160
                }],
                // defaultFilterValue : {"criteria.orderValue" : {checkerId : "5f96de9045"}}
            },
            userTableModel: {
                url: "ritmpcheckplan/users/list/{curPage}/{pageSize}",
                columns: [
                    {
                        title: "姓名",
                        fieldName: "username",
                        width: 200
                    },
                    //LIB.tableMgr.column.company,
                    _.extend(_.extend({}, LIB.tableMgr.column.company), {filterType: null}),
                    _.extend(_.extend({}, LIB.tableMgr.column.dept), {filterType: null}),
                    {
                        title: "手机",
                        fieldName: "mobile",
                        width: 220
                    }, {
                        title: "",
                        fieldType: "tool",
                        toolType: "del"
                    }
                ]
            }
        },
        formModel: {
            checkTaskFormModel: {
                show: false,
                queryUrl: "ritmpcheckplan/{id}/checktask/{checkTaskId}"
            },
            checkItemFormModel: {
                show: false,
                queryUrl: "ritmpcheckitem/{id}"
            }
        },
        selectModel: {
            userSelectModel: {
                visible: false
            }
        },
        delegateRecordModel: {
            visible: false,
            checkTaskGroupId: ''
        },
        cardModel: {
            checkTaskCardModel: {
                showContent: true
            },
            userCardModel: {
                showContent: true
            },
            taskDetailModel: {
                showContent: true
            }
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
        frequencyModel: newFrequencyModel(),
        //userSelectModel : false,//选择人员显示

        showPlanType: false,
        showSpecialty: false,
        groups: [],
        //检查表-检查项关联关系
        tableItemRel: {},
        isGroupNum: -1, //分组序号
        checkItemColumns: null,
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
            "userSelectModal": userSelectModal,
            delegateRecordView: delegateRecordView,
            checkItemFormModal: checkItemFormModal
        },
        computed: {},
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
        },
        filters: {
            itemFilter: function (value, k) {
                var _this = this;
                if (!k || _.isEmpty(value)) {
                    return value;
                }
                return _.filter(value, function (item) {
                    return _this.doItemFilter(item, k.trim());
                })
            }
        },
        watch: {
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
            doTabClick: function (tabId) {
                this.inspectTaskModel.selectType = tabId;
                this.doChangeStatus();
            },
            // ----------------------------------------- 任务明细 -------------------------------------------------
            _getCheckTables: function () {
                var _this = this;
                api.getCheckTables({id: this.checkTableId}).then(function (res) {
                    _this.groups = res.data.tirList;
                    dataModel.mainModel.selectedGroupItemMap = {};
                    if (_this.groups.length > 0) {
                        _.each(_this.groups, function (item) {
                            Vue.set(item, 'keyWord', '');
                            Vue.set(item, 'showInput', false);
                        })
                    }
                })
            },
            doItemFilter: function (item, k) {
                if (item.name.indexOf(k) > -1) {
                    return true;
                }
                return false;
            },
            toggleItemInput: function (tir, value) {
                tir.showInput = value;
                if (!value) {
                    tir.keyWord = '';
                    tir._keyWord = '';
                }
            },
            setFilterValue: function (val, index) {
                this.groups[index].keyWord = val;
            },
            //添加分组
            doAddGroup: function (mark) {
                var _this = this;
                //生成UUID
                api.getUUID().then(function (res) {
                    var group = {};
                    group.id = res.data;
                    var len = _this.groups.length + 1;
                    group.groupName = "分组" + len;
                    while (true) {
                        var isGroupNameExist = _this.groups.some(function (t) {
                            return t.groupName === group.groupName;
                        });
                        if (isGroupNameExist) {
                            len += 1;
                            group.groupName = "分组" + len;
                        } else {
                            break;
                        }
                    }
                    group.groupOrderNo = 0;
                    group.checkTableId = _this.checkTableId;
                    group.itemList = [];
                    _this.groups.push(group);
                    /*滚动条*/
                    _this.$nextTick(function () {
                        var scroll = document.getElementsByClassName('detail-large-container')[0];
                        scroll.scrollTop = scroll.scrollHeight;
                    })
                    if (mark === "open") {
                        _this.doNewCheckItem(_this.groups[0])
                    }
                });
            },
            //修改分组名称
            doUpdateGroupName: function (index, groupName, e) {
                var _this = this;
                _this.isGroupNum = index;
                _this.groupName = groupName;
                this.$nextTick(function () {
                    e.target.closest(".clearfix").querySelector('.left input').focus();
                })
            },
            //保存分组名称
            doSaveGroupName: function (tableId, name, groupOrderNo) {
                if (!name) {
                    LIB.Msg.warning("分组名称不能为空");
                    return;
                }
                if (name.length > 50) {
                    LIB.Msg.warning("分组名称长度不能超过50个字符");
                    return;
                }
                var group = {
                    checkTableId: tableId,
                    groupName: this.groupName,
                    groupOrderNo: groupOrderNo,
                    attr1: name
                };
                api.updateGroupName(null, group).then(function () {
                    LIB.Msg.success("修改分组名称成功");
                });
                this.isGroupNum = -1;
            },
            _doMoveGroup: function (direction, index) {
                var _this = this;
                var length = this.groups.length;
                if (length < 2) {
                    return;
                }
                if (direction === 'up' && index === 0) {
                    return;
                }
                if (direction === 'down' && index === length - 1) {
                    return;
                }
                var item = this.groups.splice(index, 1);
                if (direction === 'up') {
                    this.groups.splice(index - 1, 0, item[0]);
                } else {
                    this.groups.splice(index + 1, 0, item[0]);
                }
                var groupId = _.map(this.groups, 'groupId');
                api.sortGroup(groupId).then(function (res) {
                    _this._getCheckTables();
                })
            },
            doMoveGroup: function (direction, index) {
                var _this = this;
                setTimeout(function () {
                    _this._doMoveGroup(direction, index);
                }, 200)
            },
            //删除分组及分组下的关联检查项
            doDeleteGroup: function (tirId, groupName, index) {
                var _this = this;
                this.tableItemRel.groupName = groupName;
                this.tableItemRel.checkTableId = tirId;
                api.delTableGroup(null, this.tableItemRel).then(function (res) {
                    _this.groups.splice(index, 1);
                });
            },
            doNewCheckItem: function (tir) {
                this.formModel.checkItemFormModel.show = true;
                this.tableItemRel.checkTableId = tir.checkTableId;
                this.tableItemRel.groupName = tir.groupName;
                this.tableItemRel.groupOrderNo = tir.groupOrderNo;
                this.$refs.checkItemFormModal.init("create", '');
            },
            /**
             * 新增检查项
             * @param data
             */
            doSaveCheckItem: function (data) {
                var _this = this;
                var _vo = {
                    id: this.checkTableId,
                    checkItem: data,
                    tableItemRel: this.tableItemRel
                };
                if (_vo.tableItemRel.groupName && _vo.tableItemRel.groupName.length > 50) {
                    LIB.Msg.warning("分组名称长度不能超过50个字符");
                    return;
                }
                api.createItem({id: this.checkTableId}, _vo).then(function () {
                    _this._getCheckTables();
                    LIB.Msg.info("新增成功");
                    _this.formModel.checkItemFormModel.show = false;
                });
            },
            doClickCell: function (data) {
                this.checkItemId = data.entry.data.id;
                this.doCellIndex(data.entry.data.id);
                //分页数据
                var page = data.cell.rowId + 1 + (data.page.currentPage - 1) * data.page.pageSize,
                    target = data.event.target,
                    parentNode = target.parentNode;


                // 最后一列操作对象
                if (parentNode.className === "tableCustomIco_Up") {
                    this.doMoveItems(1, this.checkTableId, data.entry.data.id, this.rowIndex, page, this.columnIndex);
                }
                else if (parentNode.className === "tableCustomIco_Down") {
                    this.doMoveItems(2, this.checkTableId, data.entry.data.id, this.rowIndex, page, this.columnIndex);
                }
                else if (parentNode.className === "tableCustomIco_Del") {
                    this.delItemRelRowHandler(this.checkTableId, data.entry.data.id);
                }
                else if (parentNode.className === "tableCustomIco_Edit") {
                    this.editItemRelRowHandler(data.entry.data.id);
                }
            },
            doCellIndex: function (id) {
                var _this = this;
                _.each(_this.groups, function (item, index) {
                    if (item.itemList) {
                        _.each(item.itemList, function (date, columnIndex) {
                            if (id === date.id) {
                                _this.mainModel.selectedGroupItemMap[item.groupId] = date.itemOrderNo;
                                _this.rowIndex = index;
                                _this.columnIndex = columnIndex;
                                return false;
                            }
                        })
                    }

                })
            },
            // 修改检查项
            editItemRelRowHandler: function (param) {
                this.formModel.checkItemFormModel.show = true;
                this.$refs.checkItemFormModal.init("update", {id: param});
            },
            /**
             * 修改保存检查项
             * @param data
             */
            doUpdateCheckItem: function (data) {
                var _this = this;
                this.formModel.checkItemFormModel.show = false;
                api.updateItem(null, data).then(function () {
                    var item = _this.groups[_this.rowIndex].itemList[_this.columnIndex]
                    //前端更新数据
                    //name
                    item.name = data.name;
                    //风险类别
                    //类型
                    item.type = data.type;
                    //所属公司
                    item.compId = data.compId;
                    //检查项分类
                    item.riskType = data.riskType;
                    if (item.riskType) {
                        item.riskType.name = data.riskType.name;
                        item.riskType.id = data.riskType.id;
                    }
                    //备注
                    item.remarks = data.remarks;
                    LIB.Msg.info("保存成功");
                });
            },
            // 删除检查项
            delItemRelRowHandler: function (checkTableId, checkItemId) {
                var _this = this;
                var params = [];
                params.push({
                    checkItemId: checkItemId
                });
                api.delTableItem({id: checkTableId}, params).then(function () {
                    _.each(_this.groups, function (tir) {
                        _.some(tir.itemList, function (i, index) {
                            if (i.id === checkItemId) {
                                tir.itemList.splice(index, 1);
                                return true;
                            }
                        });
                    });

                });
            },
            // 移动检查项
            doMoveItems: function (flag, checkTableId, checkItemId, groupIndex, page, columnIndex) {
                var _this = this;
                var data = _this.groups[groupIndex].itemList[columnIndex];
                if (flag === 1) {
                    if (page === 1) {
                        return;
                    }
                    //上移
                    var tableItemRel1 = {checkItemId: "", checkTableId: ""};
                    tableItemRel1.checkItemId = checkItemId;
                    tableItemRel1.checkTableId = checkTableId;
                    //修改数据
                    api.updateItemOrderNo({type: "1"}, tableItemRel1).then(function (res) {
                        /*   _this.reloadRel("checkItem",checkTableId);*/
                        //前端更新修改数据
                        _this.groups[groupIndex].itemList.splice(columnIndex, 1);
                        _this.groups[groupIndex].itemList.splice(columnIndex - 1, 0, data);
                        LIB.Msg.info("移动成功");
                    });

                } else if (flag === 2) {
                    //var maxIndex = itemList.length-1;
                    if (page === this.groups[groupIndex].itemList.length) {
                        return;
                    }
                    var _tableItemRel1 = {
                        checkItemId: checkItemId,
                        checkTableId: checkTableId
                    };
                    //修改数据
                    api.updateItemOrderNo({type: "2"}, _tableItemRel1).then(function (res) {
                        /*   _this.reloadRel("checkItem",checkTableId);*/
                        //前端更新修改数据
                        _this.groups[groupIndex].itemList.splice(columnIndex, 1);
                        _this.groups[groupIndex].itemList.splice(columnIndex + 1, 0, data);
                        LIB.Msg.info("移动成功");
                    });

                }
            },
            // ----------------------------------------- 任务明细 end -------------------------------------------------

            // ----------------------------------------- 自定义流程钩子 -------------------------------------------------
            afterInitData: function () {
                var _vo = this.mainModel.vo;
                this.checkTableId = _.get(_vo, "checkTables[0].id");
                var _this = this;

                if (_vo.endDate != null && _vo.disable != null && _vo.disable == 1 && _vo.endDate < new Date().Format("yyyy-MM-dd hh:mm:ss")) {
                    _vo.disable = 3;
                }
                //如果计划已发布隐藏最后一列tool操作列
                {
                    var toolCol = _.last(this.tableModel.userTableModel.columns);
                    var isToolColShow = this.hasAuth("edit") && (this.mainModel.vo.disable === "0");
                    if (toolCol.visible !== isToolColShow) {
                        toolCol.visible = isToolColShow;
                        this.$refs.userTable.refreshColumns();
                    }

                    // 处理任务明细最后一列
                    var lastColumn = _.last(checkItemColumns);
                    if (lastColumn.visible !== isToolColShow) {
                        lastColumn.visible = isToolColShow;
                        this.checkItemColumns = checkItemColumns;
                    }

                }


                _this.frequencySetting();

                // 创建人
                if (_vo.createBy) {
                    api.getUser({id: _vo.createBy}).then(function (res) {
                        _vo.creater = res.body;
                    });
                }
                // 检查任务的检查人员
                api.getCheckers({id: _vo.id}).then(function (res) {
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

                // 检查人员表格
                this.$refs.userTable.doQuery({id: this.mainModel.vo.id});

                // 检查计划配置
                api.getCheckTaskConfig().then(function (res) {
                    if (res.data.result === '2') {
                        _this.isLateCheckAllowed = true;
                    } else {
                        _this.isLateCheckAllowed = false;
                    }
                });

                // 任务明细
                this._getCheckTables();

                //编辑时频率设置模块
                if (_this.mainModel.opType === 'update') {
                    _this.doEdit();
                }

            },
            beforeInit: function () {
                var _disable = this.mainModel.vo.disable;
                if (_disable == 1 || _disable == 2) { // 1发布 2失效
                    this.inspectTaskModel.taskShow = true;
                    this.$refs.checktaskTable.doClearData();
                } else {
                    this.inspectTaskModel.taskShow = false;
                    this.$refs.preChecktaskTable.doClearData();
                }

                this.showPlanType = LIB.setting.fieldSetting["BC_Hal_InsP"] ? true : false;
                this.showSpecialty = LIB.setting.fieldSetting["BC_Hal_InsP"] ? true : false;
                this.$refs.userTable.doClearData();

                // 处理任务明细最后一列
                var lastColumn = _.last(checkItemColumns);
                lastColumn.visible = true;
                this.checkItemColumns = checkItemColumns;

                this.groups = [];
                this.checkTableId = '';

            },
            //beforeDoSave: function () {
            //    var _this = this;
            //    if ((Date.parse(_this.mainModel.vo.endDate) - Date.parse(_this.mainModel.vo.startDate)) > 31536000000) {
            //        LIB.Msg.warning("总的计划时间跨度不能超过一年!");
            //        return false;
            //    }
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
                    resultDate = _.pick(_this.mainModel.vo, "planSettingId", "checkTable", "createDate", "modifyDate", "specialty", "remarks", "frequency", "disable", "checkType", "id", "orgId", "code", "endDate", "startDate", "compId", "name", "planType");
                } else {
                    resultDate = _.pick(_this.mainModel.vo, "planSetting", "planSettingId", "checkTable", "createDate", "modifyDate", "specialty", "remarks", "frequency", "disable", "checkType", "id", "orgId", "code", "endDate", "startDate", "compId", "name", "planType");
                }
                return resultDate;
            },
            afterDoSave: function (opt, res) {
                var _this = this;

                var toolCol = _.last(this.tableModel.userTableModel.columns);
                var isToolColShow = this.hasAuth("edit") && (this.mainModel.vo.disable == "0");
                if (toolCol.visible != isToolColShow) {
                    toolCol.visible = isToolColShow;
                    this.$refs.userTable.refreshColumns();
                }

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
                    this.checkTableId = res.checkTableId;
                    this.doAddGroup('open');
                } else {
                    api.getCheckers({id: _this.mainModel.vo.id}).then(function (res) {
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
                                _this.$refs.checktaskTable.doQuery({
                                    id: _this.mainModel.vo.id,
                                    "criteria.strValue.checkerId": _this.mainModel.vo.checkerId,
                                    "criteria.intValue.status": _this.inspectTaskModel.selectType
                                });
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
                    ;
                }
            },
            afterDoEdit: function () {
                var _this = this;
                var _add = _this.frequencyModel.add,
                    _common = _this.frequencyModel.common;
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
                            _this.frequencyModel.planSetting.unit = "1";
                        }
                    }
                    ;
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
                }
            },
            afterInit: function (vo, obj) {
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

                var toolCol = _.last(this.tableModel.userTableModel.columns);
                toolCol.visible = true;
                this.$refs.userTable.refreshColumns();

                if (obj.opType === 'create') {
                    this.mainModel.vo.orgId = LIB.user.orgId;
                }

            },
            afterDoCancel: function () {
                this.frequencySetting();
            },
            beforeDoDelete: function () {
                if (this.mainModel.vo.disable == 1) {
                    LIB.Msg.warning("已发布不能删除,请重新选择!");
                    return false;
                }
            },
            // ----------------------------------------- 自定义流程钩子 end -------------------------------------------------


            doShowCheckTaskFormModal4Update: function (param) {
                this.formModel.checkTaskFormModel.show = true;
                this.$refs.checktaskFormModal.init("update", {id: this.mainModel.vo.id, checkTaskId: param.entry.data.id});
            },
            doShowCheckTaskFormModal4Create: function (param) {
                this.formModel.checkTaskFormModel.show = true;
                this.$refs.checktaskFormModal.init("create");
            },
            doSaveCheckTask: function (data) {
                if (data) {
                    var _this = this;
                    api.saveCheckTask({id: this.mainModel.vo.id}, data).then(function () {
                        _this.refreshTableData(_this.$refs.checktaskTable);
                    });
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
                        api.getCheckers({id: _this.mainModel.vo.id}).then(function (res) {
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
                            if (_disable == 1 || _disable == 2) { // 1发布 2失效
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
                        api.getCheckers({id: _this.mainModel.vo.id}).then(function (res) {
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
                                if (_disable == 1 || _disable == 2) { // 1发布 2失效
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
                                if (_disable == 1 || _disable == 2) { // 1发布 2失效
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
                }
            },
            //切换任务对应的人
            doChooseUser: function (index) {
                var _this = this,
                    index = index.key;
                _this.inspectTaskModel.selectType = "1";
                _this.mainModel.vo.checkerId = _this.inspectTaskModel.taskUser;
                var _disable = _this.mainModel.vo.disable;
                if (_disable != 0) { // 1发布 2失效
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
                var hasCheckItem = false;
                _.forEach(this.groups, function (group) {
                    if (!_.isEmpty(group.itemList)) {
                        hasCheckItem = true;
                        return false;
                    }
                });
                if (!hasCheckItem) {
                    LIB.Msg.error("请在任务明细中设置工作内容");
                    return false;
                }
                api.publish([_this.mainModel.vo.id]).then(function (res) {
                    _this.$dispatch("ev_dtPublish");
                    LIB.Msg.info("已发布!");
                });
            },
            //筛选任务状态
            doChangeStatus: function () {
                var _this = this;
                var _disable = _this.mainModel.vo.disable;
                if (_disable != 0) { // 1发布 2失效
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
                        frequencyType: _vo.planSetting.frequencyType, //频率类型 1天 2周 3月 4季度 5自定义
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
        },
        init: function () {
            this.$api = api;
        }
    });

    return detail;
});