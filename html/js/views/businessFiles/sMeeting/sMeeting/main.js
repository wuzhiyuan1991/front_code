define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");      //修改 detailPanelClass : "middle-info-aside"
    //编辑弹框页面bip (big-info-panel)
    //	var detailPanel = require("./detail-xl");   //修改 detailPanelClass : "large-info-aside"
    //编辑弹框页面bip (big-info-panel) Legacy模式
    //  var detailPanel = require("./detail-tab-xl");//修改 detailPanelClass : "large-info-aside"
    var previewModal = require("./dialog/preview");
    //Legacy模式
    //	var ltLpSupFormModal = require("componentsEx/formModal/ltLpSupFormModal");
    LIB.registerDataDic('aqhy_type',[
        ['1','安全例会'],
        ['2','安委会会议'],
        ['3','其他安全会议']
    ])
    LIB.registerDataDic('aqhy_status',[
        ['1','待发布'],
        ['2','发布'],
        ['3','待审批'],
        ['4','完成']
    ])
    var initDataModel = function () {
        return {
            moduleCode: "securemeetingreword",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass: "middle-info-aside"
                //				detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "securemeeting/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                        {
                            //会议名称
                            title: "会议名称",
                            fieldName: "meetingName",
                            filterType: "text",
                            width: 200
                        },
                        {
                            //会议类型 1 安全例会  2 安委会会议 3 其他安全会议
                            title: "会议类型",
                            fieldName: "type",
                            render: function (data) {
                                if (data.type == 1) {
                                    return '安全例会'
                                } else if (data.type == 2) {
                                    return '安委会会议'
                                } else if (data.type == 3) {
                                    return '其他安全会议'
                                }

                            },
                            filterName: "criteria.intsValue.type",
                            popFilterEnum: LIB.getDataDicList("aqhy_type"),
                            filterType: "enum",
                        },
                        {
                            //开始时间
                            title: "开始时间",
                            fieldName: "startDate",
                            filterType: "date"
                            //						fieldType: "custom",
                            //						render: function (data) {
                            //							return LIB.formatYMD(data.startDate);
                            //						}
                        },
                        {
                            //结束时间
                            title: "结束时间",
                            fieldName: "endDate",
                            filterType: "date"
                            //						fieldType: "custom",
                            //						render: function (data) {
                            //							return LIB.formatYMD(data.endDate);
                            //						}
                        },
                        {
                            //会议状态 1 待发布  2 待提交 3 待审批
                            title: "会议状态",
                            fieldName: "status",
                            render: function (data) {
                              return  LIB.getDataDic("aqhy_status",data.status)

                            },
                            filterName: "criteria.intsValue.status",
                            popFilterEnum: LIB.getDataDicList("aqhy_status"),
                            filterType: "enum",
                        },
                        LIB.tableMgr.column.company,
                        // LIB.tableMgr.column.dept,
                        // LIB.tableMgr.column.disable,
                        // LIB.tableMgr.column.company,
                        // LIB.tableMgr.column.dept,
                        // LIB.tableMgr.column.modifyDate,
                        // LIB.tableMgr.column.createDate,
                    ]
                }
            ),
            detailModel: {
                show: false
            },
            canEdit:false,
            importModel: {
                url: "/securemeeting/importExcel",
                templeteUrl: "/securemeeting/file4Import",
                importProgressShow: false
            },
            exportModel: {
                url: "/securemeeting/exportExcel",
                withColumnCfgParam: true
            },
            previewdata: null,
         
            previewModel: {
                visible: false,
                id: ''
            },
            //Legacy模式
            //			formModel : {
            //				ltLpSupFormModel : {
            //					show : false,
            //				}
            //			}

        };
    }

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        //Legacy模式
        //		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainLegacyPanel],
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
            "previewModal": previewModal,
            //Legacy模式
            //			"ltlpsupFormModal":ltLpSupFormModal,

        },
        methods: {
            doPreview: function (data) {
                // this.previewModel.id= _id;
                this.previewModel.visible = true;
                this.previewdata = data
                
            },
            //Legacy模式
            //			doAdd : function(data) {
            //				this.formModel.ltLpSupFormModel.show = true;
            //				this.$refs.ltlpsupFormModal.init("create");
            //			},
            //			doSaveLtLpSup : function(data) {
            //				this.doSave(data);
            //			}
            doTableCellClick:function(data){
                if (data.entry.data.status>2) {
                    this.canEdit =false
                }else{
                    this.canEdit =true
                }
                if (!!this.showDetail && data.cell.fieldName == "code") {
                    this.showDetail(data.entry.data);
                } else {
                    (!!this.detailModel) && (this.detailModel.show = false);
                }
            },
            doImport: function () {
                this.importModel.importProgressShow = true;
            },
            doDownFile: function () {
                window.open(this.importModel.templeteUrl);
            },
        },
        events: {
        },
        init: function () {
            this.$api = api;
        }
    });

    return vm;
});
