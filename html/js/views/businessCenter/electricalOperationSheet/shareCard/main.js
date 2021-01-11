define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
    var detailPanel = require("../cardTpl/detail-xl");
    //编辑弹框页面bip (big-info-panel) Legacy模式
    //  var detailPanel = require("./detail-tab-xl");
    var previewModal = require("../cardTpl/dialog/preview");
    // var electricPreviewModal = require("./dialog/electricPreview");
    //导入
    // var importProgress = require("componentsEx/importProgress/main");
    // var approvalPanel = require("../../auditProcess/approvalSetting");
    // var sumMixin = require("../mixin/sumMixin");
    LIB.registerDataDic("iew_card_tpl_is_share", [
        ["0","否"],
        ["1","是"]
    ]);

    LIB.registerDataDic("iew_card_tpl_type", [
        ["1","一类"],
        ["2","二类"],
        ["3","三类"]
    ]);

    LIB.registerDataDic("iew_card_tpl_require_outage", [
        ["0","否"],
        ["1","是"]
    ]);

    LIB.registerDataDic("iew_work_card_type", [
        ["1","一类"],
        ["2","二类"],
        ["3","三类"]
    ]);

    LIB.registerDataDic("iew_work_card_notice_mode", [
        ["1","线下"],
        ["2","线上"]
    ]);

    LIB.registerDataDic("iew_work_card_require_outage", [
        ["0","否"],
        ["1","是"]
    ]);

    LIB.registerDataDic("iew_work_card_sign_result", [
        ["0","未签发"],
        ["1","通过"],
        ["2","不通过"]
    ]);

    LIB.registerDataDic("iew_work_card_status", [
        ["0","待提交"],
        ["1","待签发"],
        ["2","待移交"],
        ["3","待核对"],
        ["4","待开工"],
        ["5","作业中"],
        ["6","待关闭"],
        ["7","已关闭"]
    ]);


    var initDataModel = function () {
        return {
            moduleCode: "eleshare",
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
                    url: "ewcardtpl/list{/curPage}{/pageSize}?isShare=1",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                        {
                            //类型 1:一类,2:二类,3:三类
                            title: "类型",
                            fieldName: "type",
                            orderName: "type",
                            filterName: "criteria.intsValue.type",
                            filterType: "enum",
                            fieldType: "custom",
                            popFilterEnum: LIB.getDataDicList("iew_card_tpl_type"),
                            render: function (data) {
                                var obj = LIB.getDataDic("iew_card_tpl_type", data.type);
                                return obj
                            }
                        },
                        {
                            //操作票模板名称
                            title: "操作票模板名称",
                            fieldName: "name",
                            filterType: "text"
                        },
                        {
                            //工作内容
                            title: "操作任务",
                            fieldName: "attr1",
                            filterType: "text"
                        },
                        {
                            //工作的变、配电站名称
                            title: "工作的变、配电站名称及设备名称",
                            fieldName: "substation",
                            filterType: "text",
                            width:270
                        },
                        {
                            //工作地点及设备双重名称
                            title: "工作任务 - 工作地点及设备双重名称",
                            fieldName: "place",
                            filterType: "text",
                            width:270
                        },
                        {
                            //工作内容
                            title: "工作内容",
                            fieldName: "content",
                            filterType: "text"
                        },
                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.dept,
                        LIB.tableMgr.column.disable,
                        {
                            //是否分享 0:否,1:是
                            title: "是否分享",
                            fieldName: "isShare",
                            orderName: "isShare",
                            filterName: "criteria.intsValue.isShare",
                            filterType: "enum",
                            fieldType: "custom",
                            popFilterEnum: LIB.getDataDicList("iew_card_tpl_is_share"),
                            render: function (data) {
                                return LIB.getDataDic("iew_card_tpl_is_share", data.isShare);
                            }
                        },
                        LIB.tableMgr.column.createDate,
                        LIB.tableMgr.column.modifyDate,
//					{
//						//备注
//						title: "备注",
//						fieldName: "remarks",
//						filterType: "text"
//					},
//					{
//						//是否需要断电 0:否,1:是
//						title: "是否需要断电",
//						fieldName: "requireOutage",
//						orderName: "requireOutage",
//						filterName: "criteria.intsValue.requireOutage",
//						filterType: "enum",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iew_card_tpl_require_outage"),
//						render: function (data) {
//							return LIB.getDataDic("iew_card_tpl_require_outage", data.requireOutage);
//						}
//					},
//					{
//						//工作的变、配电站名称
//						title: "工作的变、配电站名称",
//						fieldName: "substation",
//						filterType: "text"
//					},
//					 LIB.tableMgr.column.modifyDate,
////					 LIB.tableMgr.column.createDate,
//
                    ]
                }
            ),
            firstTypeTableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        {
                            title: "工作的变、配电站名称及设备名称",
                            // fieldName: "content",
                            filterType: "text",
                            width: 250
                        },
                        {
                            title: "工作任务 - 工作地点及设备双重名称",
                            // fieldName: "content",
                            filterType: "text",
                            width: 280
                        },
                        {
                            title: "工作任务 - 工作内容",
                            // fieldName: "content",
                            filterType: "text",
                            width: 180
                        },

                        _.extend(_.clone(LIB.tableMgr.column.company),{width:150}) ,
                        LIB.tableMgr.column.dept,


                    ],

                }
            ),
            secondeTypeTableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        {
                            title: "工作的变、配电站名称及设备名称",
                            // fieldName: "content",
                            filterType: "text",
                            width: 250
                        },
                        {
                            title: "工作任务 - 工作地点及设备双重名称",
                            // fieldName: "content",
                            filterType: "text",
                            width: 280
                        },
                        {
                            title: "工作任务 - 工作内容",
                            // fieldName: "content",
                            filterType: "text",
                            width: 180
                        },

                        _.extend(_.clone(LIB.tableMgr.column.company),{width:150}) ,
                        LIB.tableMgr.column.dept,


                    ],
                }
            ),
            thirdTypeTableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        {
                            title: "操作内容",
                            // fieldName: "content",
                            filterType: "text",
                            width: 400
                        },


                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.dept,


                    ],

                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/opstdcard/importExcel"
            },
            exportModel: {
                url: "/ewcardtpl/exportExcel?isShare=1",
                withColumnCfgParam: true
            },
            templete: {
                url: "/opstdcard/file/down"
            },
            importHelperUrl: '/opcard/helper/down',
            auditObj: {
                visible: false
            },
            previewModel: {
                visible: false,
                id: ''
            },
            electricPreviewModel: {
                visible: false,
                id: ''
            },
            shareModal: {
                visible: false,
                title: '批量共享',
                leftArray: null,
                rightArray: null
            },
            importProgress: {
                show: false
            },
            approvalModel: {
                show: false
            },
            selectCard: {
                show: false
            },
            selectType: {
                show: false
            },
            filterTabId: 'todo1',
            undoCount: 0,
            cardType: 1,
            createCard: 1,
            type: '10',
            filterData: {
                type:null
            },
            transform:{
                show:false
            },
        };
    };

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        template: tpl,
        data: initDataModel,
        watch: {
            type:function (val) {
                this.filterData.type = val;
                if(val == 10) this.filterData.type='';
                var tableFilterDatas = [];
                for (var key in this.filterData) {
                    var value = this.filterData[key];
                    if (value != undefined && value != null && value.toString().trim() != "") {
                        var tableFilterData = {
                            type: "save",
                            value: {
                                columnFilterName: key,
                                columnFilterValue: value
                            }
                        };
                        tableFilterDatas.push(tableFilterData);
                    }else{
                        var tableFilterData = {
                            type: "remove",
                            value: {
                                columnFilterName: key,
                                columnFilterValue: value
                            }
                        };
                        tableFilterDatas.push(tableFilterData);
                    }
                }
                this.$refs.mainTable.doQueryByFilter(tableFilterDatas);
            },
        },
        components: {
            "detailPanel": detailPanel,
            "previewModal": previewModal,
            // "approvalPanel": approvalPanel,
            // "electricPreviewModal": electricPreviewModal,

        },
        computed: {

        },
        methods: {
            userModel:function(){
                var _this =this
                this.selectType.show=true
                $('.el-tabs__item').removeClass('is-active')
                $('.el-tab-pane').each(function(index,item){
                    $(item).hide()
                    if (index==_this.cardType-1) {
                        $(item).show()
                        $('.el-tabs__item').eq(index).addClass('is-active')
                    }
                })
            },
            doCheckCard: function () {
                if (this.detailModel.show) {

                }else{
                    this.selectType.show=false
                    this.$broadcast('ev_dtReload', "create");
                    this.detailModel.show = true;
                }

            },
            doCloseCard: function () {
                this.selectCard.show = false

            },
            doSelectCard: function () {
                var _this =this
                this.selectCard.show = false
                if (this.createCard == 1) {
                    this.selectType.show = true
                    $('.el-tabs__item').removeClass('is-active')
                    $('.el-tab-pane').each(function(index,item){
                        $(item).hide()
                        if (index==_this.cardType-1) {
                            $(item).show()
                            $('.el-tabs__item').eq(index).addClass('is-active')
                        }
                    })
                } else {
                    this.$broadcast('ev_dtReload', "create");
                    this.detailModel.show = true;
                }
            },
            doAdd: function () {
                this.selectCard.show = true
                this.cardType = 1
                this.createCard = 0
            },
            doPreviewBefore :function(){
                this.doPreview(this.tableModel.selectedDatas[0])
            },
            doPreview: function (data) {
                this.previewModel.id= data.id;
                this.previewModel.visible = true;
            },
        },

        events: {
            "ev_dtClose2": function () {
                this.approvalModel.show = false;
            }
        },
        init: function () {
            this.$api = api;
        },
        created: function () {
            // this._getUndoCount();
        },
        ready: function () {
            // this.$refs.categorySelector.setDisplayTitle({type: "org", value: LIB.user.orgId});
            // if (!LIB.user.compId) {
            //     this.mainModel.showTempSetting = false;
            // }
            // if (this.$route.query.method === "filterByUser") {//首页跳转时根据首页对应搜索条件查询
            //         this.doFilterBySpecial("1");
            // }else{
            //     this.doFilterBySpecial();
            // }
        }
    });

    return vm;
});
