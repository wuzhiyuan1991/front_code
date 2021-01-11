define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");      //修改 detailPanelClass : "middle-info-aside"
    //编辑弹框页面bip (big-info-panel)
    var detailPanel = require("./detail-xl");   //修改 detailPanelClass : "large-info-aside"
    var previewModal = require("./dialog/preview");
    LIB.registerDataDic("ipec_change_type", [
        ["1", "工艺"],
        ["2", "设备"]
    ]);
    LIB.registerDataDic("ipec_application_applicant_type", [
        ["0", "基层站队人员"],
        ["1", "基层站队长"],
        ["2", "管理处机关业务人员"],
        ["3", "管理处机关科室长"],
        ["4", "管理处机关主管领导"],
        ["5", "公司业务处室业务人员"],
        ["6", "公司业务处室科室长"],
        ["7", "公司业务处室主管领导"]
    ]);

    LIB.registerDataDic("ipec_application_audit_status", [
        ["0", "未审核"],
        ["1", "科室长审批"],
        ["2", "管理处机关主管领导审批"],
        ["3", "公司业务处室业务人员审批"],
        ["4", "公司业务处室主管领导审批"]
    ]);

    LIB.registerDataDic("ipec_application_level", [
        ["0", "未评估"],
        ["1", "一般变更"],
        ["2", "重大变更"]
    ]);
    LIB.registerDataDic("ipec_profession", [
        ["1", "电气"],
        ["2", "设备"],
        ["3", "水利"],
        ["4", "车辆"],
    ]);
    LIB.registerDataDic("ipec_timeType", [
        ["1", "临时变更"],
        ["2", "永久变更"],

    ]);

    LIB.registerDataDic("ipec_bizType", [
        ["0", "站队"],
        ["1", "管理处"],
        ["2", "公司业务处"],
    ]);
    LIB.registerDataDic("ipec_application_status", [
        ["0", "待申请提交"],
        ["1", "待评估"],
        ["2", "待审批"],
        ["3", "待填写变更实施"],
        ["4", "待验收"],
        ["5", "待评估范围"],
        ["6", "已评估范围"],
        ["7", "线下执行"]
    ]);

    var initDataModel = function () {
        return {
            moduleCode: "processequipmentchange",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                // detailPanelClass : "middle-info-aside"
                detailPanelClass: "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "pecapplication/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,

                        {
                            title: "申请单位",
                            fieldType: "custom",
                            filterType: "text",
                            render: function (data) {
                                if (data.orgId) {
                                    return LIB.tableMgr.rebuildOrgName(data.orgId, 'dept');
                                }
                            },
                            filterName: "criteria.strValue.deptName",
                            fieldName: "parentId",
                            width: 200
                        },
                        {

                            title: "变更项目",
                            fieldName: "projectName",
                            filterType: "text",
                            width: 180
                        },
                        {

                            title: "变更所在功能区",
                            fieldName: "functionalZone",
                            filterType: "text",
                            width: 180
                        },
                        {

                            title: "申请日期",
                            fieldName: "applyDate",
                            filterType: "date",
                            render: function (data) {
                                return LIB.formatYMD(data.applyDate);
                            }
                        },
                        {
                            //变更开始时间
                            title: "变更开始时间",
                            fieldName: "startTime",
                            filterType: "date",
                            //						fieldType: "custom",
                            render: function (data) {
                                return LIB.formatYMD(data.startTime);
                            }
                        },
                        {
                            //变更结束时间
                            title: "变更结束时间",
                            fieldName: "endTime",
                            filterType: "date",
                            //						fieldType: "custom",
                            render: function (data) {
                                return LIB.formatYMD(data.endTime);
                            }
                        },
                        {
                            title: "变更期限",
                            fieldName: "changeDeadline",
                            filterType: "date",

                            render: function (data) {
                                if (data.changeMode==2) {
                                    return '永久期限' 
                                 }
                                return LIB.formatYMD(data.changeDeadline);
                            }
                        },
                        {

                            title: "变更申请人",
                            fieldName: "user.name",
                            orderName: "user.username",
                            filterType: "text"
                        },
                        {

                            title: "变更事由",
                            fieldName: "changeReason",
                            filterType: "text",
                            width: 180
                        },

                    ],
                    // defaultFilterValue: {
                    //     "criteria.intValue": { todo: 1 },

                    // },
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/iratmpwork/importExcel"
            },
            exportModel: {
                url: "/iratmpwork/exportExcel",
                withColumnCfgParam: true
            },
            previewModel: {
                visible: false,
                id: ''
            },
            todoType: '7',
            previewdata:null,
            typeList: [
                { id: "7", value: "全部", num: 0 },
                { id: "0", value: "待申请提交", num: 0 },
                { id: "1", value: "待评估", num: 0 },
                { id: "2", value: "待审批", num: 0 },
                { id: "3", value: "待填写变更实施", num: 0 },
                { id: "4", value: "待验收", num: 0 },
                { id: "5", value: "待评估范围", num: 0 },
                { id: "6", value: "已评估范围", num: 0 },

            ]
            //Legacy模式
            //			formModel : {
            //				iraTmpWorkFormModel : {
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
            //			"iratmpworkFormModal":iraTmpWorkFormModal,

        },
        watch: {
            todoType: function (val) {
                if (val == 7) {
                    this.$refs.mainTable.doQuery({ status: null })
                   
                }else{
                    this.$refs.mainTable.doQuery({ status: val })
                }

            }
        },
        methods: {
            doPreview: function (data) {
                // this.previewModel.id= _id;
                this.previewModel.visible = true;
                this.previewdata = data

            },
            doTodoNum: function () {
                var _this = this
                this.$api.queryTodoNum({ id: LIB.user.id }).then(function (res) {
                    var total = 0

                    for (var key in res.data) {

                        _.each(_this.typeList,function(item){
                            if (item.id==key) {
                              item.num=res.data[key]
                              return false
                            }
                            
                        }) 
                        
                        total += parseInt(res.data[key])
                    }
                   
                    _this.typeList[0].num = total
                })
            },


        },
        events: {
        },
        init: function () {
            this.$api = api;
        },
        ready: function () {
            // this.doTodoNum()
        }
    });

    return vm;
});
