define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");

    //Vue数据模型
    var dataModel = function () {
        return {
            moduleCode: "IllegalSetting",
            editResult: false,
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "checktable/list{/curPage}{/pageSize}?_bizModule=illegal",
                    selectedDatas: [],
                    isSingleCheck:false,
                    columns: [
                        LIB.tableMgr.column.cb,
                         {
                            //title : "检查表名称",
                            title: this.$t("gb.common.CheckTableName"),
                            orderName: "name",
                            fieldName: "name",
                            filterType: "text",
                            width: 200
                        }, {
                            //title : "分类",
                            title: this.$t("bd.hal.checkTableClass"),
                            orderName: "checktabletype.name",
                            fieldName: "checkTableType.name",
                            filterType: "text",
                            filterName: "criteria.strValue.checkTableTypeName",
                            width: 160
                        },
                        {
                            title: "最短检查时长",
                            orderName: "tableillegalsetting.checkMin",
                            fieldName: "tableIllegalSetting.checkMin",
                            filterType: "text",
                            fieldType:"custom",
                            render: function (data) {
                                if (data.tableIllegalSetting && data.tableIllegalSetting.checkMin  && data.tableIllegalSetting.checkMin > 0) {
                                    return data.tableIllegalSetting.checkMin + "(分钟)";
                                }
                                return "";
                            },
                            filterName: "criteria.intValue.checkMin",
                            width: 160
                        },
                        {
                            title: "最长检查时长",
                            orderName: "tableillegalsetting.checkMax",
                            fieldName: "tableIllegalSetting.checkMax",
                            filterType: "text",
                            fieldType:"custom",
                            render: function (data) {
                                if (data.tableIllegalSetting && data.tableIllegalSetting.checkMax && data.tableIllegalSetting.checkMax > 0) {
                                    return data.tableIllegalSetting.checkMax + "(分钟)";
                                }
                                return "";
                            },
                            filterName: "criteria.intValue.checkMax",
                            width: 160
                        },
                        {
                            title: "最小GPS偏移",
                            orderName: "tableillegalsetting.checkMinGps",
                            fieldName: "tableIllegalSetting.checkMinGps",
                            filterType: "text",
                            fieldType:"custom",
                            render: function (data) {
                                if (data.tableIllegalSetting && data.tableIllegalSetting.checkMinGps && data.tableIllegalSetting.checkMinGps > 0) {
                                    return data.tableIllegalSetting.checkMinGps + "(米)";
                                }
                                return "";
                            },
                            filterName: "criteria.intValue.checkMinGps",
                            width: 160
                        },
                        LIB.tableMgr.column.company,
                    ],
                    defaultFilterValue : {"disable":0}
                }
            ),
            //控制全部分类组件显示
            mainModel: {
            },
            batchIllegalModel: {
                title: "异常设置",
                show: false,
                checkMin: null,
                checkMax: null,
                checkMinGps:null,
                rules: {
                    "checkMin": [
                        {
                            required: false,
                            validator: function (rule, value, callback) {
                                if (value === '' || value == null) {//可以不设置
                                    return callback();
                                } else if (value < 0) {
                                    return callback(new Error("请输入正数"));
                                } else {
                                    return callback();
                                }
                            }
                        }
                    ],
                    "checkMax": [
                        {
                            required: true,
                            validator: function (rule, value, callback) {
                                if (value === '' || value == null) {
                                    return callback(new Error("请输入最长检查时长"));
                                } else if (value < 0) {
                                    return callback(new Error("请输入正数"));
                                } else if (this.checkMin != '' && this.checkMin != null  && this.checkMin > 0 && parseInt(value) <= parseInt(this.checkMin)+1) {
                                        return callback(new Error('最长检查时长必须大于等于最短检查时长,且最小相差2'));
                                } else {
                                    return callback();
                                }
                            }
                        }
                    ],
                    "checkMinGps": [
                        {
                            required: false,
                            validator: function (rule, value, callback) {
                                if (value === '' || value == null) {//可以不设置
                                    return callback();
                                } else if (value < 0) {
                                    return callback(new Error("请输入正数"));
                                } else {
                                    return callback();
                                }
                            }
                        }
                    ],
                }
            },
        }
    };

    //使用Vue方式，对页面进行事件和数据绑定
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
    var tpl = LIB.renderHTML(require("text!./main.html"));
    var vm = LIB.VueEx.extend({
        template: tpl,
        data: dataModel,
        methods: {
            doSetCheckMinutes:function () {
                this.batchIllegalModel.show = true;
                this.batchIllegalModel.checkMax = null;
                this.batchIllegalModel.checkMin = null;
                this.batchIllegalModel.checkMinGps = null;
            },
            doSaveIllegalBatch:function () {
                var _this = this;
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        var rows = _this.tableModel.selectedDatas;
                        var checkMax = _this.batchIllegalModel.checkMax;
                        var checkMin = _this.batchIllegalModel.checkMin == null ? 0 : _this.batchIllegalModel.checkMin;
                        var checkMinGps = _this.batchIllegalModel.checkMinGps == null ? 0 : _this.batchIllegalModel.checkMinGps;
                        var data = _.map(rows, function(table){
                            return {checkTableId: table.id,checkMin: checkMin,checkMax:checkMax,checkMinGps: checkMinGps,id:table.tableIllegalSetting == null ? null : table.tableIllegalSetting.id};
                        });
                        api.batch(null,data).then(function (res) {
                            LIB.Msg.info("设置成功！");
                            _this.refreshMainTable();
                        });
                        _this.batchIllegalModel.show = false;
                    }
                })
            },
            initData: function () {
                this.mainModel.bizType = this.$route.query.bizType;
                var params = [];
                //大类型
                params.push({
                    value : {
                        columnFilterName : "bizType",
                        columnFilterValue : this.mainModel.bizType
                    },
                    type : "save"
                });
                this.$refs.mainTable.doQueryByFilter(params);
            }
        },
        //响应子组件$dispatch的event
        events: {},
        init: function () {
            this.$api = api;
        },
    });

    return vm;
});