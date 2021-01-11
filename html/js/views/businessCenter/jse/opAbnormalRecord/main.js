define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"))

    var sPreview = require("./dialog/s-preview");
    var mPreview = require("./dialog/m-preview");
    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
    var detailPanel = require("./detail-xl");
    LIB.registerDataDic("jse_op_record_type", [
        ["1", "操作票"],
        ["2", "维检修作业卡"]
    ]);


    var initDataModel = function () {
        return {
            moduleCode: "opRecord",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                // detailPanelClass : "middle-info-aside"
                detailPanelClass: "large-info-aside",
                showTempSetting: true
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "oprecord/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                        {
                            title: "票/卡名称",
                            fieldName: "opCard.name",
                            filterName: "criteria.strValue.opCardDisplayName",
                            orderName: "criteria.strValue.opCardDisplayName",
                            filterType: "text",
                            width: 300,
                            render: function (data) {
                                return _.get(data, "opCard.attr1", "") + " - " + _.get(data, "opCard.name", "")
                            }
                        },
                        {
                            title: "操作名称",
                            fieldName: "opCard.content",
                            orderName: "opCard.content",
                            filterType: "text",
                            width: 180,
                            render: function (data) {
                                return _.get(data, "opCard.content", "")
                            }
                        },
                        {
                            title: "设备名称",
                            fieldName: "equipName",
                            filterType: "text",
                            width: 150
                        },
                        {
                            title: "设备位号",
                            fieldName: "equipNos",
                            filterType: "text",
                            width: 100,
                            render: function (data) {
                                return data.equipNos ? data.equipNos.replace(/[\["\]]/g, "") : "";
                            }
                        },
                        {
                            //记录类型 1:操作票作业记录,2:维检修作业记录
                            title: "票/卡类型",
                            fieldName: "type",
                            orderName: "type",
                            filterName: "criteria.intsValue.type",
                            filterType: "enum",
                            fieldType: "custom",
                            popFilterEnum: LIB.getDataDicList("jse_op_record_type"),
                            render: function (data) {
                                return LIB.getDataDic("jse_op_record_type", data.type);
                            },
                            width: 120
                        },
                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.dept,
                        {
                            title: "操作日期",
                            fieldName: "startTime",
                            filterType: "date"
                        },
                    ],
                    defaultFilterValue : {"orgId" : LIB.user.orgId,"isAbnormal":2}
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/opRecord/importExcel"
            },
            exportModel: {
                url: "/opRecord/exportExcel"
            },
            sPreview: {
                visible: false
            },
            mPreview: {
                visible: false
            },
            previewId: null
        };
    };

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
            sPreview: sPreview,
            mPreview: mPreview
        },
        methods: {
            doPreview: function (id, type) {
                if (!_.isString(id)) {
                    var rows = this.tableModel.selectedDatas;
                    var vo = rows[0];
                    id = vo.id;
                    type = vo.type;
                }

                this.previewId = id;
                if (type === '1') {
                    this.sPreview.visible = true;
                } else if (type === '2') {
                    this.mPreview.visible = true;
                }
            },
        },
        events: {},
        ready: function () {
            this.$refs.categorySelector.setDisplayTitle({type: "org", value: LIB.user.orgId});
            if (!LIB.user.compId) {
                this.mainModel.showTempSetting = false;
            }
        },
        init: function () {
            this.$api = api;
        }
    });

    return vm;
});
