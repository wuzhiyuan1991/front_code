define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
    var detailPanel = require("./detail-xl");
    //编辑弹框页面bip (big-info-panel) Legacy模式
//  var detailPanel = require("./detail-tab-xl");
    var previewModal = require("./dialog/preview");
    //导入
    var importProgress = require("componentsEx/importProgress/main");
    //var sumMixin = require("../mixin/sumMixin");
    //LIB.registerDataDic("jse_op_card_type", [
    //    ["1", "操作票"],
    //    ["2", "维检修作业卡"],
    //    ["3", "应急处置卡"]
    //]);

    LIB.registerDataDic("jse_op_card_status", [
        ["0", "待提交"],
        ["1", "待审核"],
        ["2", "已审核"]
    ]);

    LIB.registerDataDic("jse_op_task_disable", [
        ["1", "未发布"],
        ["0", "待执行"],
        ["2", "已执行"],
        ["3", "已中止"],
    ]);


    var initDataModel = function () {
        return {
            moduleCode: "opTask",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                // detailPanelClass : "middle-info-aside"
                detailPanelClass: "large-info-aside",
                showTempSetting: true,
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "optask/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                        {
                            //卡票名称
                            title: "操作任务名称",
                            fieldName: "name",
                            filterType: "text",
                            width: 250
                        },
                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.dept,
                        {
                            //操作人
                            title: "操作人",
                            fieldName: "operators",
                            filterName: "criteria.strValue.operators",
                            fieldType: "custom",
                            filterType: "text",
                            render: function (data) {
                                if(data && data.operators){
                                    return _.map(data.operators, _.iteratee('name'));
                                }
                                return "";
                            }
                        },
                        {
                            //监护人
                            title: "监护人",
                            fieldName: "operators",
                            filterName: "criteria.strValue.supervisors",
                            fieldType: "custom",
                            filterType: "text",
                            render: function (data) {
                                if(data && data.supervisors){
                                    return _.map(data.supervisors, _.iteratee('name'));
                                }
                                return "";
                            }
                        },
                        {
                            //审核人
                            title: "审核人",
                            fieldName: "auditors",
                            filterName: "criteria.strValue.auditors",
                            fieldType: "custom",
                            filterType: "text",
                            render: function (data) {
                                if(data && data.auditors){
                                    return _.map(data.auditors, _.iteratee('name'));
                                }
                                return "";
                            }
                        },
                        {
                            //审核人
                            title: "操作时间",
                            fieldName: "publishTime",
                            filterType: "date",
                        },
                        // {
                        //     //审核状态 0:待提交,1:待审核,2:已审核
                        //     title: "审核状态",
                        //     fieldName: "status",
                        //     orderName: "status",
                        //     filterName: "criteria.intsValue.status",
                        //     filterType: "enum",
                        //     fieldType: "custom",
                        //     popFilterEnum: LIB.getDataDicList("jse_op_card_status"),
                        //     render: function (data) {
                        //         return LIB.getDataDic("jse_op_card_status", data.status);
                        //     }
                        // },
                        // {
                        //     //任务状态
                        //     title: "任务状态",
                        //     fieldName: "disable",
                        //     filterName: "criteria.intsValue.disable",
                        //     filterType: "enum",
                        //     fieldType: "custom",
                        //     popFilterEnum: LIB.getDataDicList("jse_op_task_disable"),
                        //     render: function (data) {
                        //         return LIB.getDataDic("jse_op_task_disable", data.disable);
                        //     }
                        // },
                        // {
                        //     title: "创建时间",
                        //     fieldName: "createDate",
                        //     filterType: "date"
                        // },
                        // {
                        //     title: "编制时间",
                        //     fieldName: "compileTime",
                        //     filterType: "date"
                        // },
                        // {
                        //     title: "审核时间",
                        //     fieldName: "auditDate",
                        //     filterType: "date"
                        // },
                        // {
                        //     title: "发布时间",
                        //     fieldName: "publishTime",
                        //     filterType: "date"
                        // }
                    ],
                    defaultFilterValue : {"orgId" : LIB.user.orgId,"bizType":"crafts","disable":2}
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/opstdcard/importExcel"
            },
            exportModel: {
                url: "/opstdcard/exportExcel",
                withColumnCfgParam: true
            },
            templete: {
                url: "/opstdcard/file/down"
            },
            importHelperUrl: '/opcard/helper/down',
            auditObj: {
                visible: false,
                status:"2",//审核结果
                remarks:null,//审核意见
                signatures:[]//签名文件
            },
            //验证规则
            auditRules: {
                "status" : [
                    LIB.formRuleMgr.require("审核结果"),
                ],
                "signatures" : [
                    {   required: true,
                        validator: function (rule, value, callback) {
                            if(_.isEmpty(value)) {
                                return callback(new Error('请上传签名'));
                            }
                            return callback();
                        }
                    }
                ],
            },
            signatureModel: {
                params: {
                    recordId: null,
                    fileType: 'U',
                    dataType: 'U1'
                },
                filters: {
                    max_file_size: '10mb',
                    mime_types: [{title: "files", extensions: "png,jpg,jpeg"}]
                }
            },
            previewModel: {
                visible: false,
                id: ''
            },
            importProgress: {
                show: false
            },
            filterTabId: 'todo1',
            undoCount: 0
        };
    };

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
            "previewModal": previewModal
        },
        computed: {
            showSubmit: function () {
                return _.get(this.tableModel.selectedDatas, '[0].status') === '0';
            },
            showAudit: function () {
                return _.get(this.tableModel.selectedDatas, '[0].status') === '1';
            },
            showPublish: function () {
                var status = _.get(this.tableModel.selectedDatas, '[0].status');
                var disable = _.get(this.tableModel.selectedDatas, '[0].disable')
                return status === '2' && disable == '1';
            },
        },
        methods: {
            doUploadSignature: function (param) {
                var rs = param.rs;
                this.auditObj.signatures.push({fileId: rs.content.id});
            },
            doImport: function () {
                this.importProgress.show = true;
            },
            doSubmit: function () {
                var _this = this;
                var id = _.get(this.tableModel.selectedDatas, '[0].id');
                api.saveSubmit({id: id}).then(function (res) {
                    _this.refreshMainTable();
                    LIB.Msg.success("提交成功");
                })

            },
            doPublish: function () {
                var _this = this;
                var id = _.get(this.tableModel.selectedDatas, '[0].id');
                api.savePublish({id: id}).then(function (res) {
                    _this.refreshMainTable();
                    LIB.Msg.success("发布成功");
                })
            },
            doDeleteFile: function (fileId, index, arrays) {
                var ids = [];
                ids[0] = fileId;

                LIB.Modal.confirm({
                    title: '删除选中数据?',
                    onOk: function () {
                        api._deleteFile(null, ids).then(function (data) {
                            if (data.data && data.error != '0') {
                                LIB.Msg.warning("删除失败");
                            } else {
                                arrays.splice(index, 1);
                                LIB.Msg.success("删除成功");
                            }
                        });
                    }
                });
            },
            doAudit: function (id) {
                var _this = this;
                this.auditObj.id = id || _.get(this.tableModel.selectedDatas, '[0].id');
                this.auditObj.visible = true;
                this.auditObj.signatures = [];
                this.signatureModel.params.recordId = LIB.user.id;
                api.listFile({recordId:LIB.user.id, dataType:"U1"}).then(function(res){
                    if(!_.isEmpty(res.data)) {
                        _this.auditObj.signatures.push({fileId: res.data[0].id});
                    }
                });
            },
            doPass: function () {
                var _this = this;
                var obj = this.auditObj;
                this.$refs.auditform.validate(function(valid) {
                    if (valid) {
                        var fileId = obj.signatures[0].fileId;
                        api.saveAudit({id: obj.id, status: obj.status, remarks:obj.remarks, file:{id:fileId}}).then(function (res) {
                            _this.refreshMainTable();
                            LIB.Msg.success("审核操作成功");
                            _this.$broadcast('ev_dtAudit');
                            _this.auditObj.visible = false;
                        })
                    }
                });
            },
            doPreview: function (id) {
                var _id = id || _.get(this.tableModel.selectedDatas, '[0].id');
                this.previewModel.id= _id;
                this.previewModel.visible = true;
            },
            showDetail: function(row, opts) {
                var opType = (opts && opts.opType) ? opts.opType : "view";
                this.$broadcast('ev_dtReload', opType, row.id, row, opts);
                this.detailModel.show = true;
            },
            //doFilterBySpecial: function (v) {
            //    this.filterTabId = 'todo' + (v || '');
            //    this._normalizeFilterParam(v);
            //},
            //_normalizeFilterParam: function (v) {
            //    var params = [];
            //    var name = 'criteria.strValue.todo';
            //    if (v) {
            //        params.push({
            //            value : {
            //                columnFilterName : name,
            //                columnFilterValue : v
            //            },
            //            type : "save"
            //        })
            //    } else {
            //        params.push({
            //            type: "remove",
            //            value: {
            //                columnFilterName: name
            //            }
            //        })
            //    }
            //    this.$refs.mainTable.doQueryByFilter(params);
            //},
            //_getUndoCount: function () {
            //    var _this = this;
            //    api.getUndoCount().then(function (res) {
            //        _this.undoCount = _.get(res.data, '1', 0);
            //    })
            //},
            //afterDoDetailUpdate: function () {
            //    this.onTableDataLoaded();
            //    this._getUndoCount();
            //},
            initData: function () {
                this.mainModel.bizType = this.$route.query.bizType;
                var params = [];
                //大类型
                params.push({
                    value : {
                        columnFilterName : "specialityType",
                        columnFilterValue : this.mainModel.bizType
                    },
                    type : "save"
                });
                this.$refs.mainTable.doQueryByFilter(params);
            },
        },
        events: {
        },
        init: function () {
            this.$api = api;
        },
        // created: function () {
        //     this._getUndoCount();
        // },
        // ready: function () {
        //     this.$refs.categorySelector.setDisplayTitle({type: "org", value: LIB.user.orgId});
        //     if (!LIB.user.compId) {
        //         this.mainModel.showTempSetting = false;
        //     }
        //     if (this.$route.query.method === "filterByUser") {//首页跳转时根据首页对应搜索条件查询
        //             this.doFilterBySpecial("1");
        //     }else{
        //         this.doFilterBySpecial();
        //     }
        // }
    });

    return vm;
});
