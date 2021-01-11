define(function(require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail.html");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var auditTableSelectModal = require("componentsEx/selectTableModal/auditTableSelectModal");
    //初始化数据模型
    var newVO = function() {
        return {
            //主键
            id: null,
            //唯一标识
            code: null,
            //名称
            name: null,
            //禁用标识 0未禁用，1已禁用
            disable: null,
            //发布状态 1未发布 2已发布
            status: '1',
            //结束时间
            endDate: null,
            //发布时间
            publishDate: null,
            //开始时间
            startDate: null,
            //修改日期
            modifyDate: null,
            //创建日期
            createDate: null,
            orgId: null,
            compId: null,
            //安全体系
            auditTable: { id: '', name: '' },
            //负责人
            user: { id: '', name: '', username: '' },
            scorePeople: {id: '', name: ''},
            createBy: LIB.user.id,
            compChargePersonList:[]
        }
    };
    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            opType: 'view',
            isReadOnly: true,
            title: "",
            today: new Date().Format(),
            //验证规则
            rules: {
                "name": [
                    LIB.formRuleMgr.require("计划名称"),
                    LIB.formRuleMgr.length()
                ],
                "auditTable.name": [
                    LIB.formRuleMgr.require("安全体系"),
                    LIB.formRuleMgr.length()
                ],
                // "user.name": [
                //     LIB.formRuleMgr.require("负责人"),
                //     LIB.formRuleMgr.length()
                // ],
                "scorePeople.name": [
                    LIB.formRuleMgr.require("评分人")
                ],
                "startDate": [
                    LIB.formRuleMgr.require("开始时间"),
                    // LIB.formRuleMgr.length(),
                    // {
                    //     validator: function(rule, value, callback) {
                    //         var currentDate = new Date().Format("yyyy-MM-dd 00:00:00");
                    //         return value < currentDate ? callback(new Error('开始时间必须大于当前时间')) : callback();
                    //     }
                    // }
                ],
                "endDate": [
                    LIB.formRuleMgr.require("结束时间"),
                    LIB.formRuleMgr.length(),
                    {
                        validator: function(rule, value, callback) {
                            var currentDate = new Date().Format("yyyy-MM-dd 00:00:00");
                            return value < currentDate ? callback(new Error('结束时间必须大于当前时间')) : callback();
                        }
                    }
                ],
                "compId": [{ required: true, message: '请选择所属公司' }, LIB.formRuleMgr.length() ],
                "orgId": [{ required: true, message: '请选择所属部门' }, LIB.formRuleMgr.length() ],
                "compChargePersonList": [{required: true, type: "array", message: '请选择企业管理员' }]
            },
            emptyRules: {}
        },
        tableModel: {},
        formModel: {},
        selectModel: {
            auditTableSelectModel: {
                filterData: {
                    disable: 0
                },
                visible: false
            },
            userSelectModel: {
                visible: false,
                filterData: { orgId: null }
            },
        },
        cardModel: {
            showFactorContent: true
        },
        factors: null,
        currentUserId: ''
    };
    //Vue组件
    var detail = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.detailPanel],
        template: tpl,
        components: {
            "userSelectModal": userSelectModal,
            "auditTableSelectModal": auditTableSelectModal
        },
        data: function() {
            return dataModel;
        },
        computed: {
            notPublished: function () {
                return this.mainModel.vo.status === '1';
            },
            isCreator: function () {
                return LIB.user.id === this.mainModel.vo.createBy;
            }
        },
        methods: {
            newVO: newVO,
            doShowUserSelectModal: function () {
                this.selectModel.userSelectModel.visible = true;
            },
            doFreeze: function () {
                var _this = this;
                this.$api.freeze({ id: this.mainModel.vo.id, status: 3 }).then(function(res) {
                    _this.$dispatch("ev_dtUpdate");
                    LIB.Msg.info("已冻结!");
                    _this.mainModel.vo.status = '3';
                });
            },
            doRecovery: function () {
                var _this = this;
                this.$api.recovery({ id: this.mainModel.vo.id, status: 2 }).then(function(res) {
                    _this.$dispatch("ev_dtUpdate");
                    LIB.Msg.info("已恢复!");
                    _this.mainModel.vo.status = '2';
                });
            },

            doSaveUser: function(selectedDatas) {
                if (selectedDatas) {
                    this.mainModel.vo.user = selectedDatas[0];
                }
            },
            doRemoveTeachers: function (index) {
                this.mainModel.vo.compChargePersonList.splice(index, 1);
            },
            doSaveScorePeople: function (selectedDatas) {
                
                var rows = _.map(selectedDatas, function (item) {
                    return {
                        id: item.id,
                        name: item.name
                    }
                });
                this.mainModel.vo.compChargePersonList = rows;
                //
                // var row = selectedDatas[0];
                // if (row) {
                //     this.mainModel.vo.scorePeople = row;
                //     this.mainModel.vo.compId = row.compId;
                //     this.mainModel.vo.orgId = row.orgId;
                // }
            },
            doShowAuditTableSelectModal: function() {
                this.selectModel.auditTableSelectModel.visible = true;
            },
            doSaveAuditTable: function(obj) {
                this.mainModel.vo.auditTable = {
                    id: obj[0].id,
                    name: obj[0].name
                }
                this.mainModel.vo.auditTableId = obj[0].id;
                this.afterInitData();
            },
            beforeInit: function () {
                this.mainModel.vo.compChargePersonList = null;
            },
            afterInit: function(vo, obj) {
                this.factors = null;
                if (obj.opType === 'create') {
                    this.mainModel.vo.user = {
                        id: LIB.user.id,
                        name: LIB.user.name
                    }
                    var today = new Date();
                    this.mainModel.vo.startDate = today.Format("yyyy-MM-dd 00:00:00");
                    var fiveYearsLater = new Date(today.getFullYear() + 5, 11, 31, 23, 59, 59);
                    this.mainModel.vo.endDate = fiveYearsLater.Format("yyyy-MM-dd 23:59:59");
                }
            },
            getFactors: function(flag) {
                var _this = this;
                this.$api.getTreeData({ id: this.mainModel.vo.auditTableId, types: [1] }).then(function(data) {
                    _this.factors = data.data;
                    if(flag) {
                        LIB.Msg.info("刷新成功");
                    }
                })
            },
            afterInitData: function() {
                this.getFactors();
                this.currentUserId = _.get(this.mainModel.vo, "user.id", '');
            },
            afterDoSave: function () {
                this.currentUserId = _.get(this.mainModel.vo, "user.id", '');
            },
            doPublish: function() {
                var _this = this;
                if (this.mainModel.vo.status == 2) {
                    LIB.Msg.warning("已发布!");
                    return false;
                }
                this.$api.publish({ id: this.mainModel.vo.id, status: 2 }).then(function(res) {
                    _this.$dispatch("ev_dtUpdate");
                    LIB.Msg.info("已发布!");
                    _this.mainModel.vo.status = 2
                });
            }
        },
        events: {},
        init: function() {
            this.$api = api;
        }
    });

    return detail;
});
