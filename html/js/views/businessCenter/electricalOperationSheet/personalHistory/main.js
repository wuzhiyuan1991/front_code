define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
    var detailPanel = require("../personTodo/detail-xl");
    //编辑弹框页面bip (big-info-panel) Legacy模式
    //  var detailPanel = require("./detail-tab-xl");
    var previewModal = require("../personTodo/dialog/preview");
    // var electricPreviewModal = require("./dialog/electricPreview");
    //导入
    // var importProgress = require("componentsEx/importProgress/main");
    // var approvalPanel = require("../../auditProcess/approvalSetting");
    // var sumMixin = require("../mixin/sumMixin");

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
            moduleCode: "elehistory",
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
                    url: "ewworkcard/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    defaultFilterValue : {'criteria.intValue': {"dealt":1}},

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
                            popFilterEnum: LIB.getDataDicList("iew_work_card_type"),
                            render: function (data) {
                                return LIB.getDataDic("iew_work_card_type", data.type);
                            }
                        },
                        {
                            //工作内容
                            title: "操作任务",
                            fieldName: "attr1",
                            filterType: "text",
                            renderClass: "textarea",

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
                            title: "工作任务-工作地点及设备双重名称",
                            fieldName: "place",
                            filterType: "text",
                            renderClass: "textarea",
                            width:270
                        },
                        {
                            //工作内容
                            title: "工作任务-工作内容",
                            fieldName: "content",
                            filterType: "text",
                            renderClass: "textarea",
                            width:270
                        },
                        // {
                        //     //未拆除或未拉开的接地线编号
                        //     title: "未拆除或未拉开的接地线编号",
                        //     fieldName: "groundLeadNumber",
                        //     filterType: "text"
                        // },
                        // {
                        //     //未拆除或未拉开的接地线组数
                        //     title: "未拆除或未拉开的接地线组数",
                        //     fieldName: "groundLeadQuantity",
                        //     filterType: "text"
                        // },
                        // {
                        //     //未拆除或未拉开的接地刀闸数量
                        //     title: "未拆除或未拉开的接地刀闸数量",
                        //     fieldName: "groundSwitchQuantity",
                        //     filterType: "text"
                        // },
                        // {
                        //     title: "工作负责人",
                        //     fieldName: "user.name",
                        //     orderName: "user.username",
                        //     filterType: "text",
                        // },
                        // {
                        //     title: "电气票模板",
                        //     fieldName: "ewCardTpl.name",
                        //     orderName: "ewCardTpl.name",
                        //     filterType: "text",
                        // },
                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.dept,
                        // LIB.tableMgr.column.disable,
                        {
                            //状态 0:待提交,1:待签发,2:待移交,3:待核对,4:待开工,5:作业中,6:待关闭,7:已关闭
                            title: "审核状态",
                            fieldName: "status",
                            orderName: "status",
                            filterName: "criteria.intsValue.status",
                            filterType: "enum",
                            fieldType: "custom",
                            popFilterEnum: LIB.getDataDicList("iew_work_card_status"),
                            render: function (data) {
                                return LIB.getDataDic("iew_work_card_status", data.status);
                            }
                        },
                        LIB.tableMgr.column.modifyDate,
					    LIB.tableMgr.column.createDate,

//					{
//						//通知站场人员方式 1:线下,2:线上
//						title: "通知站场人员方式",
//						fieldName: "noticeMode",
//						orderName: "noticeMode",
//						filterName: "criteria.intsValue.noticeMode",
//						filterType: "enum",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iew_work_card_notice_mode"),
//						render: function (data) {
//							return LIB.getDataDic("iew_work_card_notice_mode", data.noticeMode);
//						}
//					},
//					{
//						//通知时间
//						title: "通知时间",
//						fieldName: "noticeTime",
//						filterType: "date"
////						fieldType: "custom",
////						render: function (data) {
////							return LIB.formatYMD(data.noticeTime);
////						}
//					},
//					{
//						//工作地点及设备双重名称
//						title: "工作地点及设备双重名称",
//						fieldName: "place",
//						filterType: "text"
//					},
//					{
//						//计划结束时间
//						title: "计划结束时间",
//						fieldName: "planEndTime",
//						filterType: "date"
////						fieldType: "custom",
////						render: function (data) {
////							return LIB.formatYMD(data.planEndTime);
////						}
//					},
//					{
//						//计划开始时间
//						title: "计划开始时间",
//						fieldName: "planStartTime",
//						filterType: "date"
////						fieldType: "custom",
////						render: function (data) {
////							return LIB.formatYMD(data.planStartTime);
////						}
//					},
//					{
//						//实际结束时间
//						title: "实际结束时间",
//						fieldName: "realEndTime",
//						filterType: "date"
////						fieldType: "custom",
////						render: function (data) {
////							return LIB.formatYMD(data.realEndTime);
////						}
//					},
//					{
//						//实际开始时间
//						title: "实际开始时间",
//						fieldName: "realStartTime",
//						filterType: "date"
////						fieldType: "custom",
////						render: function (data) {
////							return LIB.formatYMD(data.realStartTime);
////						}
//					},
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
//						popFilterEnum: LIB.getDataDicList("iew_work_card_require_outage"),
//						render: function (data) {
//							return LIB.getDataDic("iew_work_card_require_outage", data.requireOutage);
//						}
//					},
//					{
//						//签发意见
//						title: "签发意见",
//						fieldName: "signOpinion",
//						filterType: "text"
//					},
//					{
//						//签发结果 0:未签发,1:通过,2:不通过
//						title: "签发结果",
//						fieldName: "signResult",
//						orderName: "signResult",
//						filterName: "criteria.intsValue.signResult",
//						filterType: "enum",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iew_work_card_sign_result"),
//						render: function (data) {
//							return LIB.getDataDic("iew_work_card_sign_result", data.signResult);
//						}
//					},
//					{
//						//签发时间
//						title: "签发时间",
//						fieldName: "signTime",
//						filterType: "date"
////						fieldType: "custom",
////						render: function (data) {
////							return LIB.formatYMD(data.signTime);
////						}
//					},
//					{
//						//状态 0:待提交,1:待签发,2:待移交,3:待核对,4:待开工,5:作业中,6:待关闭,7:已关闭
//						title: "状态",
//						fieldName: "status",
//						orderName: "status",
//						filterName: "criteria.intsValue.status",
//						filterType: "enum",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iew_work_card_status"),
//						render: function (data) {
//							return LIB.getDataDic("iew_work_card_status", data.status);
//						}
//					},

//					{
//						//班组
//						title: "班组",
//						fieldName: "workTeam",
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
                    url: "ewcardtpl/list{/curPage}{/pageSize}?type=1",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        {
                            title: "工作的变、配电站名称及设备名称",
                            fieldName: "substation",
                            width: 250
                        },
                        {
                            title: "工作任务 - 工作地点及设备双重名称",
                            fieldName: "place",
                            width: 280
                        },
                        {
                            title: "工作任务 - 工作内容",
                            fieldName: "content",
                            width: 180
                        },
                        _.extend(_.clone(LIB.tableMgr.column.company),{width:150,filterType:null}) ,
                        _.extend(_.clone(LIB.tableMgr.column.dept),{width:150,filterType:null}) ,
                    ],
                }
            ),
            secondeTypeTableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "ewcardtpl/list{/curPage}{/pageSize}?type=2",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        {
                            title: "工作的变、配电站名称及设备名称",
                            fieldName: "substation",
                            width: 250
                        },
                        {
                            title: "工作任务 - 工作地点及设备双重名称",
                            fieldName: "place",
                            width: 280
                        },
                        {
                            title: "工作任务 - 工作内容",
                            fieldName: "content",
                            width: 180
                        },
                       _.extend(_.clone(LIB.tableMgr.column.company),{width:150,filterType:null}) ,
                        _.extend(_.clone(LIB.tableMgr.column.dept),{width:150,filterType:null}) ,
                    ],
                }
            ),
            thirdTypeTableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "ewcardtpl/list{/curPage}{/pageSize}?type=3",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        {
                            title: "操作内容",
                            fieldName: "attr1",
                            width: 400
                        },
                        _.extend(_.clone(LIB.tableMgr.column.company),{width:150,filterType:null}) ,
                        _.extend(_.clone(LIB.tableMgr.column.dept),{width:150,filterType:null}) ,
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
                url: "/opstdcard/exportExcel",
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
            createCard: 0,
            type: '10',
            filterData:{
                type: null
            }
        };
    };

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
            "previewModal": previewModal,
            // "approvalPanel": approvalPanel,
            // "electricPreviewModal": electricPreviewModal,

        },
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
        computed: {
         
        },
        methods: {
            doPreview: function () {
                this.previewModel.id = this.tableModel.selectedDatas[0].id;
                this.previewModel.visible = true;
            },
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
                var _this = this;
                if (this.detailModel.show) {
                    
                }else{
                    this.selectType.show=false

                    var obj = null;
                    if(_this.cardType == '1') obj = this.firstTypeTableModel.selectedDatas;
                    if(_this.cardType == '2') obj = this.secondeTypeTableModel.selectedDatas;
                    if(_this.cardType == '3') obj = this.thirdTypeTableModel.selectedDatas;

                    if(!obj || !obj[0]) return LIB.Msg.info('请选择模板');

                    this.$broadcast('ev_dtReload_init', obj[0]);

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
                    $('.el-tabs__item').removeClass('is-active');
                    $('.el-tab-pane').each(function(index,item){
                        $(item).hide();
                        if (index==_this.cardType-1) {
                            $(item).show();
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
            doPreview: function (data) {
                // this.previewModel.id= _id;
                this.previewModel.id = data.id;
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
