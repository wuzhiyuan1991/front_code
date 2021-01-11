define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./edit.html");
    //评定纬度弹出页面--编辑页
    var gradeLatEditComponent = require("./dialog/editGradeLat");
    //编辑规则弹出页面
    var rulesEditComponent = require("./dialog/editRules");
    //编辑模型结果范围页面
    var rangeEditComponent = require("./dialog/editRange");

    var refreshRiskModelComponent = require("./dialog/refreshRiskModel");

    //运算符号集合
    var operationSymbol = {
        '+': '+',
        '-': '-',
        '*': '×',
        '/': '÷'
    };
    //启用停用状态
    var states = {
        "0": "启用",
        "1": "停用"
    }
    //初始化数据模型
    var newVO = function () {
        return {
            id: null,
            code: null,
            disable: "1",
            name: null,
            orgId: null,
            calculatingFormula: null,
            description: null,
            compId: null,
        }
    };
    var clearData = function () {
        //清空数据
        _.deepExtend(dataModel.mainModel.vo, newVO());
    }
    //Vue数据
    var dataModel = {
        operationType: 'view',
        gradeLats: [],
        mainModel: {
            vo: newVO(),
            isDataReferenced: true,
            addeditshow: false,
            isReadOnly: true,
            opType: 'view',
        },
        formRules: {
            compId: [
                {required: true, message: '请选择所属公司'},
            ],
            name: [
                {required: true, message: '请输入模型名称'},
                LIB.formRuleMgr.length(20)
            ],
            description: [
                LIB.formRuleMgr.length(100)
            ]
        },
        emptyRules: {},
        gradeLatEditModel: {
            show: false,
            title: '编辑评定维度',
            riskGradeLats: []
        },
        gradeLatViewModel: {
            show: false,
            title: '查看评定维度',
        },
        rulesEditModel: {
            show: false,
            title: '编辑规则'
        },
        rangeEditModel: {
            show: false,
            title: '编辑结果范围',
            gradeLatRanges: []
        },
        refreshRiskModel: {
            show: false,
            title: '批量修正风险等级值',
            gradeLatRanges: []
        },
        tableModel: {
            gradeLatTableModel: {
                urlDelete: 'riskgradelat'
                // ,
                // columns: [
                // 	{
                // 		title:'维度项名称',
                // 		fieldName:'name'},
                // 	{
                // 		title:"操作",
                // 		fieldType:"tool",
                // 		width:"100px",
                // 		toolType:"view,edit,del"
                // 	}
                // ]
            }
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
        data: function () {
            return dataModel;
        },
        components: {
            "gradeLatEditComponent": gradeLatEditComponent,
            "rulesEditComponent": rulesEditComponent,
            "rangeEditComponent": rangeEditComponent,
            "refreshRiskModelComponent": refreshRiskModelComponent
        },
        computed: {
            //动态生成评定纬度配置
            "gradeLatTableModelColumns": function () {
                return [
                    {
                        title: '维度项名称',
                        fieldName: 'name'
                    },
                    {
                        title: "操作",
                        fieldType: "tool",
                        width: "100px",
                        toolType: (!this.hasAuth("edit") ? "view" : this.mainModel.isDataReferenced ? "view,edit" : "view,edit,del")
                    }
                ];
            },
            symbols: function () {
                return _.keys(operationSymbol);
            },
            ruleLabels: function () {
                var labels = [];
                var formula = this.mainModel.vo.calculatingFormula;
                if (formula) {
                    var _this = this;
                    var rules = formula.split(" ");
                    _.each(rules, function (rule) {
                        var label = _.trim(_this.getSignRule(rule));
                        if (label != "") {
                            labels.push(label);
                        }
                    });
                }
                return labels;
            },
            disableLabel: function () {
                return LIB.getDataDic("disable", this.mainModel.vo.disable == null ? 1 : this.mainModel.vo.disable);
            },
            disableLableIcon: function () {
                return this.mainModel.vo.disable == '1' ? 'ios-checkmark-outline' : 'ios-minus-outline';
            }
        },
        methods: {
            newVO: newVO,
            afterInitData: function () {
                //给评定维度跟结果赋值
                this.reloadRangeTable(this.mainModel.vo.id);
                this.reloadGradeLatTable(this.mainModel.vo.id);
            },
            //根据参数获取对应数学符号标示或者纬度名称
            getSignRule: function (rule) {
                var operation = _.propertyOf(operationSymbol)(rule);
                if (operation == null) {
                    _.each(this.gradeLatEditModel.riskGradeLats, function (lat) {
                        if (lat.id == rule) {
                            operation = lat.name;
                        }
                    });
                }
                return operation || '';
            },
            doEnableDisable: function () {
                var ids = [this.mainModel.vo.id];
                var _this = this;
                var disable = dataModel.mainModel.vo.disable;
                //0启用，1禁用
                if (disable == "0") {
                    api.disable({type: 1}, ids).then(function (res) {
                        var diable = "1";
                        LIB.Msg.info("已停用!");
                        _this.mainModel.vo.disable = diable;
                        //_this.$dispatch("ev_dtCreate");
                        _this.$emit("do-edit-finshed");
                    });
                } else {
                    api.enable(null, ids).then(function (res) {
                        var diable = "0";
                        LIB.Msg.info("已启用!");
                        _this.mainModel.vo.disable = diable;
                        _this.$emit("do-edit-finshed");
                    });

                    // api.queryHistoryRiskModel({
                    //     compId: _this.mainModel.vo.compId,
                    //     riskModelId: _this.mainModel.vo.id
                    // }).then(function (res) {
                    //     if (res.data && res.data.riskModel.length > 0 && res.data.listResult.length > 0) {
                    //         _this.refreshRiskModel.show = true;
                    //         _this.$broadcast('ev_loadHistoryRange', res.data, _this.mainModel.vo.id);
                    //     } else {
                    //         LIB.Msg.info("启用成功!");
                    //         var diable = "0";
                    //         _this.mainModel.vo.disable = diable;
                    //         _this.$emit("do-edit-finshed");
                    //     }
                    //     LIB.globalLoader.hide();
                    // });
                    // api.enable({type:0},ids).then(function(res){
                    // 	var diable ="0";
                    // 	LIB.Msg.info("已启用!");
                    // 	_this.mainModel.vo.disable = diable;
                    // 	//_this.$dispatch("ev_dtCreate");
                    // 	_this.$emit("do-edit-finshed");
                    // });
                }
            },
            beforeDoSave: function () {
                this.mainModel.vo.orgId = this.mainModel.vo.compId;
            },
            doEditGradeLat: function (data) {
                var param = {
                    latId: data.entry.data.id,
                    riskModelId: this.mainModel.vo.id,
                    isDataReferenced: this.mainModel.isDataReferenced
                };
                this.$broadcast('ev_loadGradeLat', "update", param);
                this.gradeLatEditModel.show = true;
                this.gradeLatEditModel.title = "编辑评定维度";
            },
            //查看纬度项详情
            doViewGradeLat: function (data) {
                var param = {latId: data.entry.data.id, riskModelId: this.mainModel.vo.id, isDataReferenced: true};
                this.$broadcast('ev_loadGradeLat', "view", param);
                this.gradeLatEditModel.show = true;
                this.gradeLatEditModel.title = "查看评定维度";
            },
            //删除纬度项后刷新table
            doDeleteGradeLat: function () {
                this.reloadGradeLatTable(this.mainModel.vo.id);
            },
            doAddGradeLat: function () {//编辑评定纬度信息
                var param = {riskModelId: this.mainModel.vo.id, isDataReferenced: false};
                this.$broadcast('ev_loadGradeLat', "create", param);
                this.gradeLatEditModel.show = true;
                this.gradeLatEditModel.title = "添加评定维度";
            },
            doEditRules: function () {//编辑计算规则信息
                var vo = this.mainModel.vo;
                var canPrompt = this.rangeEditModel.gradeLatRanges.length > 0;
                var param = {riskModelId: vo.id, calculatingFormula: vo.calculatingFormula, prompt: canPrompt};
                this.$broadcast('ev_loadRules', param);
                this.rulesEditModel.show = true;
            },
            doEditRange: function () {//编辑结果集范围
                this.rangeEditModel.show = true;
                var param = {riskModelId: this.mainModel.vo.id, isDataReferenced: this.mainModel.isDataReferenced};
                //获取结果集列表数据
                this.$broadcast('ev_loadRange', param);
            },
            //渲染结果色彩编码单元格
            rangeStyle: function (colorMark) {
                return {
                    'background-color': '#' + colorMark,
                    'border': 'none',
                    'color': '#' + colorMark,
                    'width': '60px'
                }
            },
            reloadRangeTable: function (riskModelId) {
                var _this = this;
                api.listGradeLatRange({'riskModel.id': riskModelId, deleteFlag: 0}).then(function (res) {
                    _this.rangeEditModel.gradeLatRanges = res.data;
                });
            },
            reloadGradeLatTable: function (riskModelId) {
                var _this = this;
                api.listGradeLat({'riskModel.id': riskModelId, deleteFlag: 0}).then(function (res) {
                    _this.gradeLatEditModel.riskGradeLats = res.data;
                });
            },
            reloadDetail: function () {
                var _data = this.mainModel;
                var _vo = _data.vo;
                api.get({id: _vo.id}).then(function (res) {
                    //清空数据
                    _.deepExtend(_vo, newVO());
                    //初始化数据
                    _.deepExtend(_vo, res.data);
                });
                this.reloadGradeLatTable(_vo.id);
            },
            getIsDataReferenced: function (riskModelId) {
                var _this = this;
                if (_.isUndefined(riskModelId)) {
                    this.mainModel.isDataReferenced = false;
                } else {
                    api.selectIsDataReferenced({id: riskModelId}).then(function (res) {
                        _this.mainModel.isDataReferenced = res.data;
                    });
                }
            },
            beforeInit: function (data, type) {
                this.getIsDataReferenced(_.propertyOf(data)("id"));
                //给评定维度跟结果赋值
                this.gradeLatEditModel.riskGradeLats = [];
                this.rangeEditModel.gradeLatRanges = [];
            },
            //刷新结果集列表
            doEditRangeFinshed: function () {
                this.rangeEditModel.show = false;
                //加载结果集范围列表数据
                this.reloadRangeTable(this.mainModel.vo.id);
            },
            doEditReferencedFinshed: function () {
                this.refreshRiskModel.show = false;
                this.mainModel.vo.disable = '0';
                //加载结果集范围列表数据
                this.$emit("do-edit-finshed");
            },
            //刷新评定纬度列表
            doEditGradeLatFinshed: function () {
                this.gradeLatEditModel.show = false;
                //加载结果集范围列表数据
                this.reloadGradeLatTable(this.mainModel.vo.id);
            },
            //刷新详情信息
            doEditRulesFinshed: function () {
                this.reloadDetail();
                this.rulesEditModel.show = false;
            },
        },
        init: function () {
            this.$api = api;
        }
        // ,
        // created: function () {
        //     _this = this;
        //     //获取tableModel中最后一个columns，这里暂时按默认标准处理（即只有最后一列为tool列）
        // var toolType = "view,edit,del";
        // if(!this.hasAuth("edit")) {
        //         toolType = "view";
        // } else if(this.mainModel.isDataReferenced) {
        //         toolType = "view,edit"
        // }
        // var toolCol = _.last(this.tableModel.gradeLatTableModel.columns);
        //     toolCol.toolType = toolType;
        //     //强制显示，避免detailPanel中重写
        //     toolCol.visible = true;
        // },
    });

    return detail;
});