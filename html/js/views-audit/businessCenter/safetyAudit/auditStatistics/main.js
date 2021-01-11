define(function(require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
    var detailPanel = require("./detail-xl");


    var initDataModel = function() {
        return {
            moduleCode: "auditStatistics",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass: "middle-info-aside"
                    // detailPanelClass: "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt({
                url: "auditplan/statis/list{/curPage}{/pageSize}",
                selectedDatas: [],
                columns: [
                    {
                        title: "",
                        fieldName: "id",
                        fieldType: "cb",
                    },
                    {
                        //唯一标识
                        title: this.$t("gb.common.code"),
                        fieldName: "code",
                        fieldType: "link",
                        filterType: "text",
                        width: 161
                    },
                    {
                        //名称
                        title: this.$t("gb.common.reviewPlan"),
                        fieldName: "name",
                        filterType: "text",
                        width: 240
                    },
                    {
                        //名称
                        title:this.$t("gb.common.reviewTable"),
                        fieldName: "auditTable.name",
                        orderName: "audittable.name",
                        filterType: "text",
                        width: 220
                    },
                    {
                        //名称
                        title: "结果评级",
                        fieldName: "rating",
                        width: 120
                    },
                    {
                        //开始时间
                        title:  this.$t("gb.common.startTime"),
                        fieldName: "startDate",
                        filterType: "date",
                        width: 180
                    },
                    {
                        //结束时间
                        title: this.$t("gb.common.endTime"),
                        fieldName: "endDate",
                        filterType: "date",
                        width: 180
                    }
                ]
            }),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/auditPlan/importExcel"
            },
            exportModel: {
                url: "/auditPlan/exportExcel"
            }

        };
    }

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
        },
        computed: {
            selectId: function(){
                return this.tableModel.selectedDatas.length && this.tableModel.selectedDatas[0].id;
            }
        },
        methods: {
        },
        events: {},
        init: function() {
            this.$api = api;
        }
    });

    return vm;
});
