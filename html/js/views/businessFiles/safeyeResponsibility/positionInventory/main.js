define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
	var detailPanel = require("./detail-xl");

    LIB.registerDataDic("isr_position_inventory_status", [
        ["1", "制定中"],
        ["2", "已下发"],
        ["3", "已承诺"],
        ["4", "已发布"],
        ["5", "已取消"]
    ]);


    var initDataModel = function () {
        return {
            moduleCode: "positionInventory",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                // detailPanelClass: "middle-info-aside"
				detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "positioninventory/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                        {
                            //责任对象1:岗位,2:部门
                            title: "责任对象类型",
                            fieldName: "type",
                            orderName: "type",
                            filterName: "criteria.intsValue.type",
                            filterType: "enum",
                            fieldType: "custom",
                            popFilterEnum: LIB.getDataDicList("isr_responsibility_type"),
                            render: function (data) {
                                return LIB.getDataDic("isr_responsibility_type", data.type);
                            },
                            width: 150
                        },
                        {
                            title: "责任对象",
                            fieldName: "position.name",
                            filterType: "text",
                            render: function (data) {
                                if (data.type === '1') {
                                    return _.get(data, "position.name", "")
                                } else if (data.type === '2') {
                                    return LIB.getDataDic('org', data.orgId)['deptName']
                                }
                                return "";
                            }
                        },
                        LIB.tableMgr.column.company,
                        // LIB.tableMgr.column.dept,
                        {
                            //制定时间
                            title: "制定时间",
                            fieldName: "formulateDate",
                            filterType: "date",
                            render: function (data) {
                                return data.formulateDate ? data.formulateDate.substr(0, 10) : "";
                            }
                        },

                        {
                            title: "考核年份",
                            fieldName: "year",
                            filterType: "text",
                            render: function (data) {
                                return data.year ? data.year.substr(0, 4) + "年" : "";
                            },
                            filterCustom:function (pms,query) {
                                var obj={};
                                if('criteria.dateValue'  in query){
                                    obj=JSON.parse(query["criteria.dateValue"])
                                }
                                obj.startYear=pms+"-01-01";
                                obj.endYear= pms+"-12-31 23:59:59";
                                query["criteria.dateValue"]=JSON.stringify(obj);
                            },
                            filterCondition:function (pms,query) {
                                if(!/^\d{4}$/.test(pms)){
                                    return "请输入一个年份";
                                }
                            }
                        },
                        {
                            title: "制定部门",
                            fieldName: "formulateOrgId",
                            filterName:"criteria.strValue.formulateOrgName",
                            filterType: "text",
                            render: function (data) {
                                return LIB.getDataDic('org', data.formulateOrgId)['deptName']
                            }
                        },
                        LIB.tableMgr.column.remark,

                        {
                            //状态 1:制定中,2:已下发,3:已承诺,4:已发布,5:已取消
                            title: "状态",
                            fieldName: "status",
                            orderName: "status",
                            filterName: "criteria.intsValue.status",
                            filterType: "enum",
                            fieldType: "custom",
                            popFilterEnum: LIB.getDataDicList("isr_position_inventory_status"),
                            render: function (data) {
                                return LIB.getDataDic("isr_position_inventory_status", data.status);
                            }
                        },

                    ]
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/positioninventory/importExcel"
            },
            exportModel: {
                url: "/positioninventory/exportExcel",
                withColumnCfgParam: true
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
            isFormulate: function () {
                return _.get(this.tableModel, "selectedDatas[0].status") === '1';
            }
        },
        methods: {},
        events: {},
        init: function () {
            this.$api = api;
        }
    });

    return vm;
});
