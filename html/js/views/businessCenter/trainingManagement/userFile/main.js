define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面bip (big-info-panel)
    var detailPanel = require("./detail-xl");

    var startUpList = [{id: "0", value: "否"}, {id: "1", value: "是"}];

    var isEmer = 0;

    var initDataModel = function () {
        return {
            moduleCode: "usertrainfile",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
//                detailPanelClass : "middle-info-aside"
                detailPanelClass: "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "traintask/statistic/user/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "cb",
                        },
                        {
                            //用户编码
                            title: "用户编码",
                            fieldName: "code",
                            fieldType: "link",
                            filterType: "text",
                            width: 160
                        },
                        {
                            //用户编码
                            title: "用户姓名",
                            fieldName: "username",
                            filterType: "text",
                            width: 120
                        },
                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.dept,
                        {
                            title: "岗位",
                            fieldType: "custom",
                            render: function (data) {
                                if (data.positionList) {
                                    var posNames = "";
                                    data.positionList.forEach(function (e) {
                                        if (e.postType == 0 && e.name) {
                                            posNames += (e.name + "/");
                                        }
                                    });
                                    posNames = posNames.substr(0, posNames.length - 1);
                                    return posNames;

                                }
                            },
                            filterType: "text",
                            sortable: false,
                            filterName: "criteria.strValue.positionName",
                            width: 220
                        },
                        {
                            title: "安全角色",
                            fieldType: "custom",
                            render: function (data) {
                                if (data.positionList) {
                                    var roleNames = "";
                                    data.positionList.forEach(function (e) {
                                        if (e.postType == 1 && e.name) {
                                            roleNames += (e.name + "/");
                                        }
                                    });
                                    roleNames = roleNames.substr(0, roleNames.length - 1);
                                    return roleNames;

                                }
                            },
                            filterType: "text",
                            sortable: false,
                            filterName: "criteria.strValue.hseroleName",
                            width: 220
                        },
                        {
                            title: "是否离职",
                            orderName: "disable",
                            fieldType: "custom",
                            filterType: "enum",
                            filterName: "criteria.intsValue.disable",
                            popFilterEnum : startUpList,
                            render: function (data) {
                                return data.disable == 0 ? '否' : '是';
                                // var text;
                                // if (data.disable == 0) {
                                //     text = "在职";
                                // }
                                // else {
                                //     text = "离职"
                                // }
                                // if(data.disable === '0') {
                                //     return '<i class="ivu-icon ivu-icon-checkmark-round" style="font-weight: bold;color: #aacd03;margin-right: 5px;"></i>' + text
                                // } else {
                                //     return '<i class="ivu-icon ivu-icon-close-round" style="font-weight: bold;color: #f03;margin-right: 5px;"></i>' + text
                                // }
                            },
                            width: 100
                        },
                        {
                            //课程数量
                            title: "培训次数",
                            fieldName: "total",
                            filterType: "number",
                            width: 120
                        },
                        {
                            //通过数量
                            title: "通过次数",
                            fieldName: "done",
                            filterType: "number",
                            width: 120
                        },
                        {
                            //通过率
                            title: "通过率",
                            fieldType: "custom",
                            render: function (data) {
                                if (data.total > 0) {
                                    return data.percent + "%";
                                } else {
                                    return "-";
                                }
                            },
                            filterType: "text",
                            filterName: "percent",
                            orderName: "percent",
                            width: 100
                        },
                    ],
                    defaultFilterValue: {"criteria.orderValue": {fieldName: "e.modify_date", orderType: "1"}, "criteria.intValue": {isEmer: isEmer}},
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: ""
            },
            exportModel: {
                url: "/traintask/exportExcel",
                singleUrl:"/traintask/{id}/exportExcel/usertraindetail"
            },
            isEmer: false

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
            doExportDetail: function () {
                var rows = this.tableModel.selectedDatas;
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量操作数据");
                    return;
                }
                window.open(this.exportModel.singleUrl.replace("\{id\}", rows[0].id) + "?isEmer=" + isEmer);
            },
        },
        events: {},
        init: function () {
            isEmer = 0;
            this.isEmer = false;
            if(this.$route.path.indexOf("/emer") == 0) {
                this.$api = require("../../emerMa/trainingUserFile/vuex/api");
                isEmer = 1;
                this.isEmer = true;
            } else{
                this.$api = api;
            }
        },
    });

    return vm;
});
