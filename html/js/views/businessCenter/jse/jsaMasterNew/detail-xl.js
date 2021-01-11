define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail-xl.html");
    var jsaDetailNewFormModal = require("componentsEx/formModal/jsaDetailNewFormModal");
    var cardSelectModal = require("./dialog/cardSelectModal");


    //初始化数据模型
    var newVO = function () {
        return {
            id: null,
            //编码
            code: null,
            //分析人员，可以以逗号或者是其他字符分割
            analysePerson: null,
            //作业日期
            workDate: null,
            //禁用标识 0未禁用，1已禁用
            disable: "1",
            //分析小组组长
            analyseLeader: null,
            //作业内容
            taskContent: null,
            //公司Id
            compId: null,
            //部门Id
            orgId: null,
            //专家点评
            commentExpert: null,
            //管理处点评
            commentGlc: null,
            //公司点评
            commentGongsi: null,
            //施工单位，可手填
            construction: null,
            //是否承包商作业；0:否,1:是
            contractor: null,
            //表明是否复制页面传来的数据，非空时为复制页面传来的值
            copy: null,
            //是否为交叉作业
            crossTask: null,
            //
            isflag: null,
            //步骤json
            jsonstr: null,
            //是否为新的工作任务 0--已做过的任务；  1--新任务
            newTask: null,
            //是否需要许可证
            permit: null,
            //是否有特种作业人员资质证明
            qualification: null,
            //是否参考库
            reference: null,
            //备注
            remark: null,
            //步骤中最高风险级别的分值
            riskScore: null,
            //是否分享
            share: null,
            //是否有相关操作规程
            specification: null,
            //作业许可证号（如有）
            taskLicense: null,
            //提交类型
            updatetype: null,
            //作业位置
            workPlace: null,
            //票卡
            opCard: {id: '', name: '', type: '', orgId: ''},
            //步骤
            jsaDetails: [],
            status: null,
            type: '1',
            isPublish: '0'
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
                "code": [LIB.formRuleMgr.length(255)],
                "analysePerson": [LIB.formRuleMgr.require("分析人员"),
                    LIB.formRuleMgr.length(100)
                ],
                "workDate": [LIB.formRuleMgr.require("作业日期")],
                "disable": LIB.formRuleMgr.require("状态"),
                "analyseLeader": [LIB.formRuleMgr.require("分析小组组长"),
                    LIB.formRuleMgr.length(100)
                ],
                "taskContent": [LIB.formRuleMgr.require("作业内容"),
                    LIB.formRuleMgr.length(255)
                ],
                "compId": [LIB.formRuleMgr.require("公司")],
                "orgId": [LIB.formRuleMgr.require("部门")],
                "construction": [LIB.formRuleMgr.require("作业单位"), LIB.formRuleMgr.length(100)],
                "contractor": [LIB.formRuleMgr.length(0)],
                "crossTask": [LIB.formRuleMgr.length(0)],
                "newTask": [LIB.formRuleMgr.length(0)],
                "qualification": [LIB.formRuleMgr.length(0)],
                "specification": [LIB.formRuleMgr.length(0)],
                "taskLicense": [LIB.formRuleMgr.length(50)],
                "opCard.id": [
                    LIB.formRuleMgr.require("票卡")
                ]
            }
        },
        tableModel: {
            jsaDetailNewTableModel: LIB.Opts.extendDetailTableOpt({
                url: "jsamasternew/jsadetailnews/list/{curPage}/{pageSize}?criteria.orderValue.fieldName=orderNo&criteria.orderValue.orderType=0",

            }),
            columns: [
                {
                    title: "步骤",
                    fieldName: "stepDesc",
                    width: "200px"
                },
                {
                    title: "危害描述",
                    // width: "200px",
                    fieldName: "harmDesc"
                },
                {
                    title: "后果及影响",
                    // width: "180px",
                    fieldName: "result"
                },
                {
                    title: "风险值",
                    width: "80px",
                    fieldName: "riskScore",
                    render: function (data) {
                        var riskModel = data.riskModel;
                        if (!riskModel) {
                            return ""
                        }
                        riskModel = JSON.parse(riskModel);
                        return riskModel.result;
                    }
                },
                {
                    title: "现有控制措施",
                    // width: "180px",
                    fieldName: "currentControl"
                },
                {
                    title: "建议改进措施",
                    // width: "180px",
                    fieldName: "improveControl"
                },
                {
                    title: "残余风险是否可接受",
                    width: "126px",
                    fieldName: "riskAccept",
                    render: function (data) {
                        var text = data.riskAccept === '1' ? '是' : '否';
                        return '<div class="text-center">' + text + '</div>'
                    }
                }
            ]
        },
        formModel: {
            jsaDetailNewFormModel: {
                show: false,
                hiddenFields: ["jsaMasterNewId"],
                queryUrl: "jsamasternew/{id}/jsadetailnew/{jsaDetailNewId}"
            },
        },
        cardModel: {
            jsaDetailNewCardModel: {
                showContent: true
            },
        },
        selectModel: {
            cardSelectModel: {
                visible: false,
                filterData: {orgId: null}
            }
        },
        beforeValues: null,
        afterValues: null,
        middleValues: null,
        auditObj: {
            visible: false
        },

        //无需附件上传请删除此段代码
        fileModel: {
            default: {
                cfg: {
                    params: {
                        recordId: null,
                        dataType: 'Z1', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
                        fileType: 'Z'    // 文件类型标识，需要根据数据库的注释进行对应的修改
                    }
                },
                data: []
            }
        }
    };
    //Vue组件
    /**
     *  请统一使用以下顺序配置Vue参数，方便codeview
     *     el
     template
     components
     componentName
     props
     data
     computed
     watch
     methods
     _XXX                //内部方法
     doXXX                //事件响应方法
     beforeInit        //初始化之前回调
     afterInit            //初始化之后回调
     afterInitData        //请求 查询 接口后回调
     afterInitFileData  //请求 查询文件列表 接口后回调
     beforeDoSave        //请求 新增/更新 接口前回调，返回false时不进行保存操作
     afterFormValidate    //表单rule的校验通过后回调，，返回false时不进行保存操作
     buildSaveData        //请求 新增/更新 接口前回调，重新构造接口的参数
     afterDoSave        //请求 新增/更新 接口后回调
     beforeDoDelete        //请求 删除 接口前回调
     afterDoDelete        //请求 删除 接口后回调
     events
     vue组件声明周期方法
     init/created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
     **/
    var detail = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.detailPanel],
        template: tpl,
        components: {
            "jsadetailnewFormModal": jsaDetailNewFormModal,
            "cardSelectModal": cardSelectModal
        },
        computed: {
            tableTools: function () {
                if (this.mainModel.vo.id && this.mainModel.vo.status === '0' && this.mainModel.isReadOnly) {
                    return ['update'];
                }
                return []
            },
            workDateText: function () {
                return this.mainModel.vo.workDate.substr(0, 10);
            }
        },
        data: function () {
            return dataModel;
        },
        watch: {
            "mainModel.vo.orgId": function (val) {
                if (val !== this.mainModel.vo.opCard.orgId) {
                    this.mainModel.vo.opCard = {id: '', name: '', type: '', orgId: ''};
                    this._normalizeTableValues();
                }
            }
        },
        methods: {
            newVO: newVO,
            buildSaveData: function () {
                var workDate = this.mainModel.vo.workDate;
                return _.assign({}, this.mainModel.vo, {workDate: workDate + " 00:00:00"});
            },
            doShowOpCardSelectModal: function () {
                this.selectModel.cardSelectModel.filterData = {orgId: this.mainModel.vo.orgId};
                this.selectModel.cardSelectModel.visible = true;
            },
            doSaveOpCard: function (selectedDatas, type) {
                if (selectedDatas) {
                    var rows = _.map(selectedDatas, function (item) {
                        return {
                            attr1: item.attr1,
                            name: item.name,
                            id: item.id,
                            orgId: item.orgId
                        }
                    });
                    var row = rows[0];
                    this.mainModel.vo.opCard = row;
                    this.mainModel.vo.opCard.name = row.attr1 + "-" + row.name;
                    this._queryStepsByCardId();
                }
                this.mainModel.vo.type = type || '1';
            },
            _queryStepsByCardId: function () {
                var id = this.mainModel.vo.opCard.id;
                var _this = this;
                api.queryStepsByCardId({cardId: id}).then(function (res) {
                    var data = res.data;
                    _this._normalizeTableValues(data);
                })
            },
            _normalizeTableValues: function (data) {
                this.beforeValues = _.filter(data, function (v) {
                    return v.phase === '0'
                });
                this.middleValues = _.filter(data, function (v) {
                    return v.phase === '1'
                });
                this.afterValues = _.filter(data, function (v) {
                    return v.phase === '2'
                });
            },


            doShowJsaDetailNewFormModal4Update: function (param) {
                this.formModel.jsaDetailNewFormModel.show = true;
                this.$refs.jsadetailnewFormModal.init("update", {id: this.mainModel.vo.id, jsaDetailNewId: param.id});
            },
            doShowJsaDetailNewFormModal4Create: function (phase) {
                this.formModel.jsaDetailNewFormModel.show = true;
                this.$refs.jsadetailnewFormModal.init("create", '', phase);
            },
            doSaveJsaDetailNew: function (data) {
                if (!_.isPlainObject(data)) {
                    return;
                }
                var phase = data.phase;
                if (phase === '0') {
                    this.beforeValues.push(data);
                }
                var _this = this;
                api.saveJsaDetailNew({id: this.mainModel.vo.id}, data).then(function () {
                    _this.refreshTableData(_this.$refs.jsadetailnewTable);
                });
            },
            doUpdateJsaDetailNew: function (data) {
                if (!_.isPlainObject(data)) {
                    return;
                }
                var _this = this;
                api.updateJsaDetailNew({id: this.mainModel.vo.id}, data).then(function () {
                    api.get({id: _this.mainModel.vo.id}).then(function (res) {
                        _this._normalizeTableValues(res.data.jsaDetails);
                    })
                });

            },
            doRemoveJsaDetailNews: function (item) {
                var _this = this;
                var data = item.entry.data;
                api.removeJsaDetailNews({id: this.mainModel.vo.id}, [{id: data.id}]).then(function () {
                    _this.$refs.jsadetailnewTable.doRefresh();
                });
            },
            doMoveJsaDetailNews: function (item) {
                var _this = this;
                var data = item.entry.data;
                var param = {
                    id: data.id,
                    jsaMasterNewId: dataModel.mainModel.vo.id
                };
                _.set(param, "criteria.intValue.offset", item.offset);
                api.moveJsaDetailNews({id: this.mainModel.vo.id}, param).then(function () {
                    _this.$refs.jsadetailnewTable.doRefresh();
                });
            },


            doSubmit: function () {
                var _this = this;

                api.submit({id: _this.mainModel.vo.id}).then(function () {
                    _this.mainModel.vo.status = '1';
                    _this.$dispatch("ev_dtUpdate");
                    LIB.Msg.success("提交成功");
                })

            },
            doAdd4Copy: function() {
                var data = _.cloneDeep(this.mainModel.vo);
                if(data.orgId != LIB.user.orgId) {
                    LIB.Msg.warning("当前登录人不允许复制使用其他部门的JSA记录");
                    return;
                }
                var opts = { opType: "update", action: "copy" };
                this.init("update", data.id, data, opts)
            },
            doAudit: function () {
                this.auditObj.visible = true;
            },
            doPass: function (val) {
                var _this = this;
                api.audit({id: this.mainModel.vo.id, status: val}).then(function (res) {
                    _this.mainModel.vo.status = val === 200 ? '2' : '0';
                    _this.$dispatch("ev_dtUpdate");
                    LIB.Msg.success("审核操作成功");
                    _this.auditObj.visible = false;
                })
            },
            doQuit: function () {
                var _this = this;
                if (_this.mainModel.vo.isPublish === '1') {
                    LIB.Msg.warning("已派送的数据无法弃审");
                    return;
                }
                api.quit({id: this.mainModel.vo.id}).then(function (res) {
                    _this.mainModel.vo.status = '0';
                    _this.$dispatch("ev_dtUpdate");
                    LIB.Msg.success("弃审成功");
                })
            },

            beforeInit: function () {
                // this.$refs.jsadetailnewTable.doClearData();
                this.beforeValues = null;
                this.middleValues = null;
                this.afterValues = null;
                this.mainModel.vo.jsaDetails = null;
            },
            afterInit: function (c, o) {
                var _this = this;
                if (o.opType === "create") {
                    this.mainModel.vo.orgId = LIB.user.orgId;
                    var _this = this;
                    api.getUUID().then(function (res) {
                        _this.mainModel.vo.id = res.data;
                        _this.fileModel.default.cfg.params.recordId = res.data;
                    })
                }
            },
            afterInitData: function () {
                // this.$refs.jsadetailnewTable.doQuery({id: this.mainModel.vo.id});
                this._normalizeTableValues(this.mainModel.vo.jsaDetails);
                this.mainModel.vo.opCard.name = this.mainModel.vo.opCard.attr1 + " - " + this.mainModel.vo.opCard.name;
            },
            beforeDoSave: function () {
                if (this.mainModel.action === "copy") {
                    this.mainModel.vo.status = '0';
                }
                if (this.mainModel.vo.compId === this.mainModel.vo.orgId) {
                    this.mainModel.vo.orgId = ''
                }
            },
            afterDoSave: function (typeObj) {
                // 创建保存后请求一次数据
                if (typeObj.type === "C") {
                    this.initData({id: this.mainModel.vo.id})
                } else if (typeObj.type === "U") {
                    if (this.mainModel.beforeEditVo.opCard.id !== this.mainModel.vo.opCard.id) {
                        this.initData({id: this.mainModel.vo.id})
                    }
                }
            },
            doExportExcel: function () {
                var id = this.mainModel.vo.id;
                LIB.Modal.confirm({
                    title: '导出数据?',
                    onOk: function () {
                        window.open('/jsamasternew/' + id + '/exportExcel');
                    }
                });
            },
            // 派送任务
            doSendTask: function () {
                var _this = this;
                var isPublish = _this.mainModel.vo.isPublish;
                if (isPublish === '1') {
                    LIB.Msg.warning("该数据已派送过");
                    return;
                }
                var id = _this.mainModel.vo.id;
                api.sendTask({id:id}).then(function () {
                    _this.$dispatch("ev_dtUpdate");
                    LIB.Msg.success("派送成功");
                })
            },
            doInvalid:function () {
                var _this = this;
                var id = _this.mainModel.vo.id;
                api.invalid({id:id}).then(function () {
                    _this.$dispatch("ev_dtUpdate");
                    LIB.Msg.success("已失效!");
                })
            },
        },
        events: {
            "ev_create_by_card": function () {
                var c = window.__JSA_CARD__;
                if (this.mainModel.opType !== 'create' || !_.isPlainObject(c)) {
                    return;
                }
                this.mainModel.vo.compId = c.compId;
                this.mainModel.vo.orgId  = c.orgId;
                this.mainModel.vo.type   = c.type;
                this.mainModel.vo.opCard = {id: c.id, name: c.attr1 + " - " + c.name, type: c.type, orgId: c.orgId};
                this._queryStepsByCardId();
                window.__JSA_CARD__ = null;
                c = null;
            }
        },
        init: function () {
            this.$api = api;
        }
    });

    return detail;
});