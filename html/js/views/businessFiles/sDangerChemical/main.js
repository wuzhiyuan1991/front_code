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

    //Legacy模式
    //	var ltLpSupFormModal = require("componentsEx/formModal/ltLpSupFormModal");
    var date = new Date()
    var month = parseInt( date.getMonth())+1
    if (month<10) {
        var year = date.getFullYear() + '-0' + month + ''

    }else{
        var year = date.getFullYear() + '-' + month + ''

    }

    LIB.registerDataDic("danger-attr3", [
        ["0", "否"],
        ["1", "是"]
        
    ]);
                               
    LIB.registerDataDic("danger-attr4", [
        ["0", "否"],
        ["1", "是"]
        
    ]);
    var initDataModel = function () {
        return {
            moduleCode: "msD",
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
                    url: "deliverypandect/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                        {
                            title: "名称",
                            width: 100,
                            fieldName: "name",
                            filterType: "text"
                        },
                        {
                            title: "用量",
                            width: 100,
                            fieldName: "dosage",
                            render:function(data){
                                return  (data.dosage||'-') +' '+data.attr1
                            },
                            filterType: "text"
                        },
                        {
                            title: "剩余贮量",
                            width: 100,
                            fieldName: "residue",
                            render:function(data){
                                return ( data.residue||'-') +' '+data.attr1
                            },
                            filterType: "text"
                        },

                        {
                            title: "核定存量",
                            width: 100,
                            fieldName: "checkStock",
                            render:function(data){
                                return  data.attr2 +' '+data.attr1
                            },
                            filterType: "text"
                        },
                        {
                            title: "易制爆",
                            fieldName: "attr3",
                            renderClass: "textarea text-center",
                            width: 100,
                            render: function (data) {
                                if(data.attr3 == 1) {
                                    return '<i class="ivu-icon ivu-icon-checkmark-round" style="font-weight: bold;color: #aacd03;margin-right: 5px;"></i>' + '是';
                                } else {
                                    return '<i class="ivu-icon ivu-icon-close-round" style="font-weight: bold;color: #f03;margin-right: 5px;"></i>' + '否';
                                }
                            },
                            filterType: "enum",
                            fieldType: "custom",
                            filterName: "criteria.intsValue.attr3",
                            popFilterEnum: LIB.getDataDicList("danger-attr3"),
                        },
                        {
                            title: "易制毒",
                            fieldName: "attr4",
                            renderClass: "textarea text-center",
                            width: 100,
                            render: function (data) {
                                if(data.attr4 == 1) {
                                    return '<i class="ivu-icon ivu-icon-checkmark-round" style="font-weight: bold;color: #aacd03;margin-right: 5px;"></i>' + '是';
                                } else {
                                    return '<i class="ivu-icon ivu-icon-close-round" style="font-weight: bold;color: #f03;margin-right: 5px;"></i>' + '否';
                                }
                                // if (data.attr4 == 1) {
                                //     return '<label class="ivu-checkbox-wrapper"><span  class="ivu-checkbox ivu-checkbox-checked"><span class="ivu-checkbox-inner"></span></span><span></span></label>'
                                // } else {
                                //     return '<label class="ivu-checkbox-wrapper"><span class="ivu-checkbox"><span class="ivu-checkbox-inner"></span></span><span></span></label>';
                                // }
                            },
                            filterType: "enum",
                            fieldType: "custom",
                            filterName: "criteria.intsValue.attr4",
                            popFilterEnum: LIB.getDataDicList("danger-attr4"),
                        },
                        {
                            title: "月份",
                            width: 100,
                            fieldName: "month",
                            filterType: "text"
                        },
                        {
                            title: "存放部位",
                            width: 200,
                            fieldName: "location",
                            filterType: "text",
                            'renderClass': "textarea"
                        },
                        {
                            title: "专管人员",
                            fieldName: "userName",
                            filterType: "text"
                        },
                        {
                            title: "主要用途",
                            width: 250,
                            fieldName: "purpose",
                            filterType: "text",
                            'renderClass': "textarea"
                        },
                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.dept,
                        // LIB.tableMgr.column.disable,
                        // LIB.tableMgr.column.company,
                        // LIB.tableMgr.column.dept,
                        // LIB.tableMgr.column.modifyDate,
                        // LIB.tableMgr.column.createDate,
                    ],
                    defaultFilterValue: {
                        month: year
                    }
                }
            ),
            detailModel: {
                show: false
            },
            importModel: {
                url: "/deliverypandect/importExcel",
                templeteUrl: "/deliverypandect/file4Import",
                importProgressShow: false
            },
            exportModel: {
                url: "/deliverypandect/exportExcel",
                withColumnCfgParam: true
            },
            month: year


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
            //Legacy模式
            //			"ltlpsupFormModal":ltLpSupFormModal,

        },
        methods: {
            //Legacy模式
            //			doAdd : function(data) {
            //				this.formModel.ltLpSupFormModel.show = true;
            //				this.$refs.ltlpsupFormModal.init("create");
            //			},
            //			doSaveLtLpSup : function(data) {
            //				this.doSave(data);
            //			}
            changeQryYear: function (val) {
                this.$refs.mainTable.doQuery({ month: val })
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
