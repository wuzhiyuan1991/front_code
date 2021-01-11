define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail.html");
    var templateModel = require('./template/main');

    //初始化数据模型
    var newVO = function () {
        return {
            //用户id
            id: null,
            //用户编码
            code: null,
            //工作流名称
            name: null,
            //
            compId: null,
            //企业id
            orgId: null,
            //工作流描述
            description: null,
            //是否禁用，0启用，1禁用
            disable: null,
            //工作流key
            modelerKey: null,
            //更新日期
            modifyDate: null,
            //创建日期
            createDate: null,
            // 流程id
            modeId: null,
            // 流程类型
            type: null,
            status: ''
        }
    };
    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            opType: 'view',
            isReadOnly: true,
            title: "",

            //验证规则
            rules: {
                //"code":[LIB.formRuleMgr.require("编码")]
                "code": [LIB.formRuleMgr.require("工作流编码"),
                    LIB.formRuleMgr.length()
                ],
                "name": [LIB.formRuleMgr.require("工作流名称"), LIB.formRuleMgr.length()],
                "type": [LIB.formRuleMgr.require("工作流类型")],
                "description": [LIB.formRuleMgr.length()],
                "disable": [LIB.formRuleMgr.length()],
                "modelerKey": [LIB.formRuleMgr.length(20)],
                "modifyDate": [LIB.formRuleMgr.length()],
                "createDate": [LIB.formRuleMgr.length()],
                "compId": [{required: true, message: '请选择所属公司'}, LIB.formRuleMgr.length()]
            },
            emptyRules: {}
        },
        templateModel: {
            visible: false,
            url: 'activitimodeler/template/list/{curPage}/{pageSize}',
            treeData: [],
            columns: []
        },
        copyModel: {
            id: '',
            mode: false
        }
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
            templateModel: templateModel
        },
        data: function () {
            return dataModel;
        },
        watch: {
            
        },
        methods: {
            newVO: newVO,
            doSave: function () {

                var _this = this;
                var _data = this.mainModel;
                var _vo = _data.vo;

                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        if (_data.vo.id == null) {
                            if(_this.copyModel.mode) {
                                _vo.beCopiedAModelerId = _this.copyModel.id;
                                _this.$api.copyProcess(_vo).then(function (res) {
                                    LIB.Msg.info("保存成功");
                                    _this.$dispatch("ev_dtUpdate");
                                    _data.vo.id = res.data.id;
                                    _data.vo.modeId = res.data.modeId;
                                    _this.changeView("view");
                                    _this.initCopyModel();
                                })
                            } else {
                                api.createProcess(_vo).then(function (res) {
                                    LIB.Msg.info("保存成功");
                                    _this.$dispatch("ev_dtUpdate");
                                    _data.vo.id = res.data.id;
                                    _this.changeView("view")
                                })
                            }
                        } else {
                            _this.$api.update(_vo).then(function (res) {
                                LIB.Msg.info("保存成功");
                                _this.$dispatch("ev_dtUpdate");
                                _this.changeView("view")
                            });
                        }
                    } else {
                        // console.log('error submit!!');
                    }
                });
            },
            doSearchBpmn: function () {
                window.open("/activiti-modeler/modeler.html?modelId=" + this.mainModel.vo.modeId);
            },
            doDeploy: function () {
                var _this = this;
                if (this.mainModel.vo.status === "1") {
                    LIB.Msg.warning("已发布!");
                    return false;
                }
                api.deploy({id: this.mainModel.vo.modeId}).then(function () {
                    _this.$dispatch("ev_dtUpdate");
                    LIB.Msg.info("发布成功!");
                    _this.mainModel.vo.status = "1";
                })
            },
            chooseTemplate: function () {
                this.templateModel.visible = true;
            },
            setTemplate: function (data) {
                if(this.mainModel.isReadOnly){
                    return;
                }
                this.copyInfo(data);
                this.copyModel.id = data.id;
                this.copyModel.mode = true;
            },
            copyInfo: function (data) {
                this.mainModel.vo.name = data.name;
                this.mainModel.vo.type = data.type;
                this.mainModel.vo.description = data.description;
                this.mainModel.vo.compId = '';
            },
            initCopyModel: function () {
                this.copyModel = {
                    id: '',
                    mode: false
                };
            },
            beforeInit: function (data, opt) {
                this.initCopyModel();
                if (opt.opType === 'copy') {
                    var _vo = dataModel.mainModel.vo;
                    _.extend(_vo,newVO());
                    this.copyModel.id = data.id;
                    this.copyModel.mode = true;
                    this.copyInfo(data);
                    this.mainModel.isReadOnly = false;
                    this.mainModel.title = this.$t("ori.rolm.copy");
                }
            }
        },
        events: {},
        init: function () {
            this.$api = api;
        }
    });

    return detail;
});