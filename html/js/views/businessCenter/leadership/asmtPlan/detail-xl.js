define(function(require){
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail-xl.html");
    var asmtTableSelectModal = require("componentsEx/selectTableModal/asmtTableSelectModal");

    var taskList = require("./dialog/taskList");

    //初始化数据模型
    var newVO = function() {
        return {
            //id
            id : null,
            //编码
            code : null,
            //自评计划名名称
            name : null,
            //计划类型 0:无意义，1:工作计划 ，2:巡检计划 暂时不用
            planType : null,
            //结束时间
            endDate : null,
            //开始时间
            startDate : null,
            //公司id
            compId : null,
            //组织id
            orgId : null,
            //是否禁用 0启用,1禁用
            disable : null,
            //自评频率 暂时不用
            frequency : null,
            //自评频率类型 暂时不用
            frequencyType : null,
            //频率类型 0执行一次 1重复执行
            hzType : null,
            //专业 暂时不用
            specialty : null,
            //修改日期
            modifyDate : null,
            //创建日期
            createDate : null,
            remarks: '',
            //自评计划设置
            asmtPlanSetting : {
                frequencyType: ''
            },
            //自评表
            asmtTable : {id:'', name:''},
            //自评任务
            asmtTasks : [],
            //自评人
            users : [],
            asmtItemList: []
        }
    };
    //Vue数据
    var dataModel = {
        mainModel : {
            vo : newVO(),
            opType : 'view',
            isReadOnly : true,
            title:"",
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
                    id: "6",
                    name: "旬"
                },
                {
                    id: "3",
                    name: "半月"
                },
                {
                    id: "4",
                    name: "月"
                },
                {
                    id: "5",
                    name: "季度"
                },
                {
                    id: "7",
                    name: "半年"
                },
                {
                    id: "8",
                    name: "年"
                }
            ],
            //验证规则
            rules:{
                "name" : [
                    LIB.formRuleMgr.require("自评计划名称"),
                    LIB.formRuleMgr.length()
                ],
                "compId" : [
                    LIB.formRuleMgr.require("所属公司"),
                    LIB.formRuleMgr.length()
                ],
                "asmtTable.id": [
                    LIB.formRuleMgr.require("自评表"),
                    LIB.formRuleMgr.length()
                ],
                "asmtPlanSetting.frequencyType": [
                    LIB.formRuleMgr.require("周期"),
                    LIB.formRuleMgr.length()
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
                "endDate": [LIB.formRuleMgr.require("结束时间"),
                    LIB.formRuleMgr.length(),
                    {
                        validator: function(rule, value, callback) {
                            var currentDate = new Date(dataModel.mainModel.vo.startDate).Format("yyyy-MM-dd 00:00:00");
                            return value < currentDate ? callback(new Error('结束时间必须大于开始时间')) : callback();
                        }
                    }
                ]
            },
            emptyRules:{},
            now: new Date().Format("yyyy-MM-dd 00:00:00")
        },
        userTableModel : {
            url : "asmtplan/users/list/{curPage}/{pageSize}",
            columns : [
                {
                    title : "编码",
                    fieldName : "code"
                },
                {
                    title : "员工姓名",
                    fieldName : "name"
                },
                _.extend(_.extend({}, LIB.tableMgr.column.company), { filterType: null }),
                _.extend(_.extend({}, LIB.tableMgr.column.dept), { filterType: null }),
                {
                    title: "上级领导",
                    fieldName: 'leader.username'
                },
                {
                    title : "",
                    fieldType : "tool",
                    toolType : "del"
                }
            ]
        },
        dimensionModel: {
            columns: [
                {
                    title: '维度',
                    fieldName: 'dimension'
                },
                {
                    title: '与自评人关系',
                    fieldName: 'relationship'
                }
            ],
            values: [
                {
                    id: '1',
                    dimension: '自己',
                    relationship: '自己'
                },
                {
                    id: '2',
                    dimension: '上级',
                    relationship: '上级领导'
                }
            ]
        },
        taskModel: {
            url : "asmtplan/asmttasks/list/{curPage}/{pageSize}",
            columns : [
                {
                    title:"自评任务序号",
                    fieldName: "num",
                    width: 120
                },
                {
                    title : "自评人",
                    fieldName : "mbrea.username",
                    width: 150
                },
                {
                    title:'开始日期',
                    fieldName: 'startDate',
                    width: 180
                },
                {
                    title:'结束日期',
                    fieldName: 'endDate',
                    width: 180
                },
                {
                    title: '状态',
                    width: 120,
                    fieldName: 'status',
                    render: function(data) {
                        return LIB.getDataDic("asmt_task_status", data.status);
                    }
                }
            ]
        },
        preTaskModel: {
            url: 'asmtplan/asmttasks/view/{curPage}/{pageSize}',
            columns : [
                {
                    title:"自评任务序号",
                    fieldName: "num",
                    width: 120
                },
                {
                    title: "自评人名称",
                    fieldName: "mbrea.username",
                    width: 120
                },
                {
                    title : "开始时间",
                    fieldName : "startDate"
                },
                {
                    title: "结束时间",
                    fieldName: "endDate"
                }
            ]
        },
        formModel : {
            asmtTaskFormModel : {
                show : false,
                queryUrl : "asmtplan/{id}/asmttask/{asmtTaskId}"
            }
        },
        cardModel : {
            asmtTaskCardModel : {
                showContent : true
            },
            userCardModel : {
                showContent : true
            },
            dimensionModel: {
                showContent: true
            }
        },
        asmtTableSelectModel: {
            visible: false
        },
        userSelectModel : {
            visible : false,
            filterData : {orgId : null}
        },
        selectModel : {
            asmtPlanSettingSelectModel : {
                visible : false,
                filterData : {orgId : null}
            }
        },
        users: null
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
        mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth,LIB.VueMixin.detailPanel],
        template: tpl,
        components : {
            "asmtTableSelectModal": asmtTableSelectModal,
            "taskList": taskList
        },
        data:function(){
            return dataModel;
        },
        computed: {
            doshowAddUserModel: function () {
                return this.mainModel.vo.disable == "0" && this.mainModel.opType !== 'create';
            },
            endDate: function () {
                if(this.mainModel.vo.startDate) {
                    var d = new Date(this.mainModel.vo.startDate);
                    var nd = d.setDate(d.getDate() + 1);
                    return new Date(nd).Format("yyyy-MM-dd 00:00:00");
                }
                return '';
            },
            endDateLimit: function () {
                if (this.mainModel.vo.asmtPlanSetting.frequencyType !== '1') {
                    return ''
                }
                if (this.mainModel.vo.startDate) {
                    var d = new Date(this.mainModel.vo.startDate);
                    var nd = d.setFullYear(d.getFullYear() + 1, d.getMonth(), d.getDate() - 1);
                    return new Date(nd).Format("yyyy-MM-dd 00:00:00");
                }
            }
        },
        methods:{
            newVO : newVO,
            doShowAsmtTableSelectModal: function () {
                this.asmtTableSelectModel.visible = true;
            },
            doPublish: function () {
                var _this = this;
                var params = _.pick(this.mainModel.vo, ["id", "compId", "orgId"]);
                this.$api.publicPlan([params]).then(function () {
                    _this.$dispatch("ev_dtPublish");
                    _this.mainModel.vo.disable = "1";
                    LIB.Msg.info("发布成功");
                    _this.$nextTick(function () {
                        _this.onUsersChanged();
                    })
                })
            },
            displayFrequencyType: function (type) {
                var r = this.mainModel.frequencyTypeList.filter(function (t) { return t.id === type });
                if(r.length > 0) {
                    return r[0].name;
                }
            },
            doSaveAsmtTable: function (data) {
                this.mainModel.vo.asmtTable = _.pick(data[0], ['id','name']);
            },
            doShowUserSelectModal : function() {
                this.userSelectModel.visible = true;
            },
            doSaveUsers : function(users) {
                var _this = this;
                if (users.length > 0) {
                    var param = _.map(users, function(data){return {id : data.id}});
                    this.$api.saveUsers({id : dataModel.mainModel.vo.id}, param).then(function() {
                        _this.$refs.userTable.doQuery({ id: _this.mainModel.vo.id });
                        LIB.Msg.info("添加成功");
                        _this.$api.getUsers({ id: _this.mainModel.vo.id }).then(function (res) {
                            _this.users = res.data;
                            _this.onUsersChanged();
                        })
                    });
                }
            },
            doRemoveUsers: function (item) {
                var _this = this;
                var data = item.entry.data;
                if (_this.mainModel.vo.disable === '1') {
                    LIB.Msg.warning("已发布的自评计划不能删除自评人员");
                } else {
                    api.removeUsers({ id: this.mainModel.vo.id }, [{ id: data.id }]).then(function() {
                        _this.$refs.userTable.doRefresh();
                        LIB.Msg.info("删除成功");
                        _this.$api.getUsers({ id: _this.mainModel.vo.id }).then(function (res) {
                            _this.users = res.data;
                            _this.onUsersChanged();
                        })
                    });
                }
            },
            afterInitData: function () {
                var _vo = this.mainModel.vo;
                if(_vo.endDate != null && _vo.disable != null && _vo.disable == 1 && _vo.endDate < new Date().Format("yyyy-MM-dd hh:mm:ss")) {
                    _vo.disable = 3;
                }
                //如果计划已发布隐藏最后一列tool操作列
                _.last(this.userTableModel.columns).visible = (this.mainModel.vo.disable == "0");
                this.$refs.userTable.refreshColumns();

                var _this = this;
                this.$refs.userTable.doQuery({ id: this.mainModel.vo.id });
                this.$api.getUsers({ id: this.mainModel.vo.id }).then(function (res) {
                    _this.users = res.data;
                    _this.onUsersChanged();
                })
            },
            afterDoSave: function (obj, data) {
                if(obj.type === 'C') {
                    this.initData(data);
                } else {
                    this.onUsersChanged();
                }
            },
            buildSaveData: function () {
                return _.omit(this.mainModel.vo, 'asmtItemList');
            },
            beforeInit: function () {
                this.mainModel.vo.asmtItemList = null;
                this.$refs.userTable.doClearData();
                this.users = null;
                this.onUsersChanged();
                this.$els.container.scrollTop = 0;
            },
            onUsersChanged: function () {
                this.$broadcast('ev_users_changed', this.users);
            }
        },
        events : {
        },
        init: function(){
            this.$api = api;
        }
    });

    return detail;
});