define(function(require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail.html");

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
            //组织机构Id
            orgId: null,
            //评分方式 1五分制 2十分制 3百分制
            scoreMethod: null,
            // 总分
            score: 1000, // task 2254 修改默认值
            //状态 1未审核 2已审核
            status: '1',
            //所属公司Id
            compId: null,
            // 类型 1文本 2枚举
            type: '1',
            createBy: null
        }
    };
    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            opType: 'view',
            isReadOnly: true,
            title: "",
            typeList: [{ id: "1", name: "文本" }, { id: "2", name: "枚举" }],
            statusList: [{ id: "1", name: "未审核" }, { id: "2", name: "已审核" }],
            //验证规则
            rules: {
                "name": [
                    LIB.formRuleMgr.require("安全体系名称"),
                    LIB.formRuleMgr.length()
                ],
                "scoreMethod": [LIB.formRuleMgr.require("评分方式"),
                    LIB.formRuleMgr.length()
                ],
                "score": [
                    LIB.formRuleMgr.require("总分"),
                    LIB.formRuleMgr.length(),
                    {
                        validator: function(rule, value, callback) {
                            return value < 0 ? callback(new Error('总分必须大于0')) : value > 100000 ? callback(new Error('总分须小于10万')) : callback();
                        }
                    }
                ],
                "type": [
                    LIB.formRuleMgr.require("类型"),
                    LIB.formRuleMgr.length()
                ],
                compId: [
                    LIB.formRuleMgr.require("所属公司"),
                    LIB.formRuleMgr.length()
                ],
                orgId: [
                    LIB.formRuleMgr.require("所属部门"),
                    LIB.formRuleMgr.length()
                ]
            },
            emptyRules: {}
        },
        tableModel: {},
        formModel: {},
        cardModel: {
            showContent: true
        },
        selectModel: {
            organizationSelectModel: {
                visible: false,
                filterData: { orgId: null }
            },
            userSelectModel: {
                visible: false,
                filterData: { orgId: null }
            },
        },
        factors: []
    };
    //Vue组件
    var detail = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.detailPanel],
        template: tpl,
        data: function() {
            return dataModel;
        },
        computed: {
            type: function() {
                var type = this.mainModel.vo.type;
                return type === '1' ? '文本' : '枚举';
            },
            status: function() {
                var status = this.mainModel.vo.status;
                return status === '1' ? '未审核' : '已审核';
            },
            isCreator: function () {
                return LIB.user.id === this.mainModel.vo.createBy;
            }
        },
        methods: {
            newVO: newVO,
            doAudit: function() {
                var _this = this;
                if (this.mainModel.vo.status === '2') {
                    LIB.Msg.warning("已审核!");
                    return;
                }
                this.$api.audit({ id: this.mainModel.vo.id, status: '2' }).then(function() {
                    _this.$emit("do-modify-state");
                    LIB.Msg.info("审核成功!");
                })
            },
            doEnableDisable: function() {
                var _this = this;
                var vo = this.mainModel.vo;

                var disable = vo.disable;
                //0启用，1禁用
                if (disable == 0) {
                    api.updateDisable({ id: vo.id, disable: 1 }).then(function(res) {
                        vo.disable = 1;
                        _this.$emit("do-modify-state", { opType: "update" });
                        LIB.Msg.info("停用成功!");
                    });
                } else {
                    api.updateDisable({ id: vo.id, disable: 0 }).then(function(res) {
                        vo.disable = 0;
                        _this.$emit("do-modify-state", { opType: "update" });
                        LIB.Msg.info("启用成功!");
                    });
                }
            },
            beforeInit: function(vo, type) {
                if (type.opType === 'create') {
                    return;
                }
                this.getFactors(vo.id);
            },
            afterDoSave: function(obj, data) {
                var _this = this;
                if (obj.type === 'C') {
                    this.factors = null;
                    this.$api.get({ id: data.id }).then(function(res) {
                        _this.mainModel.vo = res.data;
                    })
                }
            },
            getFactors: function(id, flag) {
                var _this = this;
                this.$api.getFactorById({ id: id, types: [1] }).then(function(data) {
                    _this.factors = data.data;
                    if(flag) {
                        LIB.Msg.info("刷新成功");
                    }
                })
            },
            doOpenTabPage: function () {
                // 监听storage变化；改动巡检表后，会在localStorage中更新auditTableChangeTime的值
                window.addEventListener("storage", this._storageFn);
                window.open("/html/main.html#!/auditTableInfo?id=" + this.mainModel.vo.id)
            },
            _storageFn: function (e) {
                if(e.key === 'auditTableChangeTime') {
                    this.getFactors(this.mainModel.vo.id);
                }
            }
        },
        events: {},
        init: function () {
            this.$api = api;
        },
        detached: function () {
            window.removeEventListener("storage",  this._storageFn);
        }
    });

    return detail;
});
