define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
    // var detailPanel = require("./detail-xl");


    var initDataModel = function () {
        return {
            moduleCode: "isaauditScore",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass: "middle-info-aside"
                // detailPanelClass: "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt({
                url: "isaauditplan/score/list{/curPage}{/pageSize}",
                selectedDatas: [],
                columns: [
                    {
                        title: "",
                        fieldName: "id",
                        fieldType: "cb"
                    },
                    {
                        //唯一标识
                        title: this.$t("gb.common.code"),
                        fieldName: "code",
                        fieldType: "link",
                        filterType: "text",
                        width: 160
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
                        title: this.$t("gb.isa.reviewTable"),
                        fieldName: "auditTable.name",
                        orderName: "audittable.name",
                        filterType: "text",
                        width: 220
                    },
                    {
                        //开始时间
                        title: this.$t("gb.common.startTime"),
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
                    },
                    {
                        title: this.$t("gb.common.performancePerson"),
                        fieldName: 'user.name',
                        orderName: "user.id",
                        filterName: "user.username",
                        filterType: "text",
                        width: 120
                    }
                ]
            }),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/isaauditPlan/importExcel"
            },
            exportModel: {
                url: "/isaauditPlan/exportExcel"
            },
            selectModel: {
                visible: false
            }
        };
    }

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        template: tpl,
        data: initDataModel,
        computed: {
            selectId: function () {
                return this.tableModel.selectedDatas.length ? this.tableModel.selectedDatas[0].id : '';
            },
            currentUserId: function () {
                return _.get(this.tableModel.selectedDatas, '[0].user.id');
            }
        },
        components: {
            "detailPanel": detailPanel,
        },
        methods: {
            doChange: function () {
            },

        },
        events: {},
        ready: function () {

            //首页跳转时根据首页对应搜索条件查询
            if(!!this.$route.query.state) {
                var startDateColumn = _.find(this.tableModel.columns, function (item) {
                    return item.fieldName === "startDate";
                });
                if(!!startDateColumn) {
                    if(this.$route.query.state == 1) {
                        this.$refs.mainTable.doOkActionInFilterPoptip(null, startDateColumn, [null, new Date()]);
                    }else if(this.$route.query.state == 2) {
                        this.$refs.mainTable.doOkActionInFilterPoptip(null, startDateColumn, [new Date(new Date().Format("yyyy-MM-dd 23:59:59")), null]);
                    }
                }
            }
        },
        init: function () {
            this.$api = api;
        }
    });

    return vm;
});
