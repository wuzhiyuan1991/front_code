define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
//	var detailPanel = require("./detail-xl");


    var initDataModel = function () {
        return {
            moduleCode: "riCheckPointTpl",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass: "middle-info-aside",
                showTempSetting: true
//				detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "richeckpointtpl/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                        {
                            //巡检区域名称
                            title: "巡检点名称",
                            fieldName: "name",
                            filterType: "text",
                            width: 300
                        },
                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.dept,
                        {
                            title: "属地",
                            fieldName: "dominationArea.name",
                            filterType: "text",
                            width: 200
                        },
                        {
                            title: "所属巡检区域",
                            fieldName: "riCheckAreaTpl.name",
                            filterType: "text",
                            width: 200
                        },
                        LIB.tableMgr.column.disable,
                        {
                            //备注
                            title: "备注",
                            fieldName: "remarks",
                            filterType: "text"
                        },
                        // LIB.tableMgr.column.modifyDate,
                        // LIB.tableMgr.column.createDate,

                    ],
                    defaultFilterValue : {"orgId" : LIB.user.orgId}
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/riCheckPointTpl/importExcel"
            },
            exportModel: {
                url: "/riCheckPointTpl/exportExcel"
            }

        };
    }

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel
        },
        methods: {

        },
        ready: function () {
            this.$refs.categorySelector.setDisplayTitle({type: "org", value: LIB.user.orgId});
            if (!LIB.user.compId) {
                this.mainModel.showTempSetting = false;
            }
        },
        events: {},
        init: function () {
            this.$api = api;
        }
    });

    return vm;
});
