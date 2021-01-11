define(function(require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail.html");
    var userSelect = require("componentsEx/userSelect/userSelect");
    var auditTableSelectModal = require("componentsEx/selectTableModal/isaAuditTableSelectModal");
    var setWeightModal=require("./set_weight_dialog");
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
            status: null,
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
            //审核表
            auditTable: { id: '', name: '' },
            //负责人
            user: { id: '', name: '', username: '' },
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
                    LIB.formRuleMgr.require("审核表"),
                    LIB.formRuleMgr.length()
                ],
                "user.name": [
                    LIB.formRuleMgr.require("负责人"),
                    LIB.formRuleMgr.length()
                ],
                "startDate": [
                    LIB.formRuleMgr.require("开始时间"),
                    LIB.formRuleMgr.length(),
                    {
                        validator: function(rule, value, callback) {
                            var currentDate = new Date().Format("yyyy-MM-dd 00:00:00");
                            return value < currentDate ? callback(new Error('开始时间必须大于当前时间')) : callback();
                        }
                    }
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
                "orgId": [{ required: true, message: '请选择所属部门' }, LIB.formRuleMgr.length() ]
            },
            emptyRules: {}
        },
        tableModel: {},
        formModel: {},
        selectModel: {
            auditTableSelectModel: {
                filterData: {
                    disable: 0,
                    "criteria.strValue.selectWithExistCheckItem": "true"
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
            "userSelect": userSelect,
            "auditTableSelectModal": auditTableSelectModal,
            "setWeightModal":setWeightModal
        },
        data: function() {
            return dataModel;
        },
        computed: {
            notPublished: function () {
                return this.mainModel.vo.status != 2;
            },
            isSetWeight:function () {
                if(this.factors && this.factors.length > 0){
                    var presentAll = this.factors.reduce(function (a,b) {
                        return a + parseFloat(parseFloat(b.weight).toFixed(2));
                    }, 0);
                    return presentAll === 100;
                }
                return false;
            }
        },
        methods: {
            newVO: newVO,
            doSaveUser: function(selectedDatas) {
                if (selectedDatas) {
                    this.mainModel.vo.user = selectedDatas[0];
                }
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
                //this.afterInitData();
            },
            afterInit: function() {
                this.factors = null;
            },
            getFactors: function(flag) {
                var _this = this;
                this.$api.queryAuditWeights({id:this.mainModel.vo.id}).then(function(data) {
                    _this.factors =data;
                    if(flag) {
                        LIB.Msg.info("刷新成功");
                    }
                })
            },
            afterInitData: function() {
                this.getFactors();
                this.currentUserId = _.get(this.mainModel.vo, "user.id", '');
                if(this.mainModel.action==='copy'){
                    this.mainModel.vo.name+="复制";
                    this.mainModel.vo.status=0;
                }
            },
            afterDoSave: function () {
                this.currentUserId = _.get(this.mainModel.vo, "user.id", '');
                if(this.mainModel.action==="create"){
                    this.getFactors();
                }
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
            },
            /*点击分配权重，打开弹框分配*/
            doSetWeight:function () {
                this.$refs.setWeight.init(this.mainModel.vo.id,this.factors);
            }
        },
        events: {},
        init: function() {
            this.$api = api;
        }
    });

    return detail;
});
