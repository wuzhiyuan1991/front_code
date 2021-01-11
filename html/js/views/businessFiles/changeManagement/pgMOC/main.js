define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    // 编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");      //修改 detailPanelClass : "middle-info-aside"
    //编辑弹框页面bip (big-info-panel)
    var detailPanel = require("./detail-xl");   //修改 detailPanelClass : "large-info-aside"
    //编辑弹框页面bip (big-info-panel) Legacy模式
    //  var detailPanel = require("./detail-tab-xl");//修改 detailPanelClass : "large-info-aside"

    //Legacy模式
    //	var ltLpSupFormModal = require("componentsEx/formModal/ltLpSupFormModal");

    LIB.registerDataDic("smoc_change_management_nature", [
        ["0", "增加"],
        ["1", "删减"],
        ["2", "更改"]
    ]);

    LIB.registerDataDic("smoc_change_management_change_mode", [
        ["0", "设备设施"],
        ["1", "原料"],
        ["2", "作业方式"],
        ["3", "技术工艺"],
        ["4", "其他"]
    ]);

    LIB.registerDataDic("smoc_change_management_scope", [
        ["0", "永久变更"],
        ["1", "紧急变更"],
        ["2", "临时变更"]
    ]);

    LIB.registerDataDic("smoc_change_management_status", [
        ["0", "待提交"],
        ["1", "待评估"],
        ["2", "待审批"],
        ["3", "待实施"],
        ["4", "待培训"],
        ["5", "待验收"],
        ["6", "已完成"]
    ]);

    var initDataModel = function () {
        return {
            moduleCode: "pgsM",
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
                    url: "changemanagement/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                        {
                            title: "项目名称",
                            width: 300,
                            fieldName: "name",
                            filterType: "text"
                        },
                        {
                            //变更性质 0:增加,1:删减,2:更改
                            title: "变更性质",
                            fieldName: "nature",
                            orderName: "nature",
                            filterName: "criteria.intsValue.nature",
                            filterType: "enum",
                            fieldType: "custom",
                            popFilterEnum: LIB.getDataDicList("smoc_change_management_nature"),
                            render: function (data) {
                                return LIB.getDataDic("smoc_change_management_nature", data.nature);
                            }
                        },
                        {
                            //变更范围 0:永久变更,1:紧急变更,2:临时变更
                            title: "变更范围",
                            fieldName: "scope",
                            orderName: "scope",
                            filterName: "criteria.intsValue.scope",
                            filterType: "enum",
                            fieldType: "custom",
                            popFilterEnum: LIB.getDataDicList("smoc_change_management_scope"),
                            render: function (data) {
                                return LIB.getDataDic("smoc_change_management_scope", data.scope);
                            }
                        },
                        {
                            //变更开始时间
                            title: "变更开始时间",
                            fieldName: "startTime",
                            filterType: "date"
                            //						fieldType: "custom",
                            //						render: function (data) {
                            //							return LIB.formatYMD(data.startTime);
                            //						}
                        },
                        {
                            //变更结束时间
                            title: "变更结束时间",
                            fieldName: "endTime",
                            filterType: "date"
                            //						fieldType: "custom",
                            //						render: function (data) {
                            //							return LIB.formatYMD(data.endTime);
                            //						}
                        },
                        {
                            //变更类型 0:设备设施,1:原料,2:作业方式,3:技术工艺,4:其他
                            title: "变更类型",
                            fieldName: "changeMode",
                            orderName: "changeMode",
                            filterName: "criteria.intsValue.changeMode",
                            filterType: "enum",
                            fieldType: "custom",
                            popFilterEnum: LIB.getDataDicList("smoc_change_management_change_mode"),
                            render: function (data) {
                                return LIB.getDataDic("smoc_change_management_change_mode", data.changeMode);
                            }
                        },
                        {
                            title: "申请人",
                            width: 100,
                            render:function(data){
                                if (data.applicant) {
                                    return data.applicant.name
                                }
                               
                            },
                            filterName: "criteria.strValue.applicant_name",
                            // keywordFilterName: "criteria.strValue.keyWordValue_approver_name",
                            filterType: "text",
                        },
                        {
                            title: "申请部门",
                            width: 100,
                            render:function(data){
                                if (data.applicant) {
                                    return LIB.tableMgr.rebuildOrgName(data.applicant.orgId, 'dept');
                                }
                               
                            },
                            filterName: "appDep",
                            // keywordFilterName: "criteria.strValue.approver_name",
                            filterType: "text"
                        },
                   
                        // LIB.tableMgr.column.disable,
                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.dept,
                        // LIB.tableMgr.column.modifyDate,
                        // LIB.tableMgr.column.createDate,
                    ],
                    defaultFilterValue:{'criteria.intsValue':{mobiletype:[2]},'criteria.strValue':{mobileUserFilter:LIB.user.id},status:1}
                }
            ),
            detailModel: {
                show: false
            },
            importModel: {
                url: "/changemanagement/importExcel",
                templeteUrl: "/changemanagement/file4Import",
                importProgressShow: false
            },
            exportModel: {
                url: "/changemanagement/exportExcel",
                withColumnCfgParam: true
            },
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
