define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");      //修改 detailPanelClass : "middle-info-aside"

    var editPsdComponent = require("../../../basicSetting/organizationalInstitution/PersonnelFi/dialog/edit-psd");

    //编辑弹框页面bip (big-info-panel)
//	var detailPanel = require("./detail-xl");   //修改 detailPanelClass : "large-info-aside"
    //编辑弹框页面bip (big-info-panel) Legacy模式
//  var detailPanel = require("./detail-tab-xl");//修改 detailPanelClass : "large-info-aside"

    //Legacy模式
//	var contractorEmpFormModal = require("componentsEx/formModal/contractorEmpFormModal");

    LIB.registerDataDic("contractor_emp_disable", [
        ["0", "驻场"],
        ["1", "离场"],
    ]);
    var initDataModel = function () {
        return {
            moduleCode: "contractorEmp",
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
                    url: "contractoremp/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        // LIB.tableMgr.column.code,
                        {
                            //姓名
                            title: "姓名",
                            fieldName: "name",
                            orderName: "username",
                            filterType: "text",
                            width: 100,
                        },
                        {
                            title: '状态',
                            width: 80,
                            fieldName: "disable",
                            filterName: "criteria.intsValue.disable",
                            filterType: "enum",
                            popFilterEnum: LIB.getDataDicList("contractor_emp_disable"),
                            render: function (data) {
                                var text = LIB.getDataDic("contractor_emp_disable", data.disable);
                                if (data.disable === '0') {
                                    return '<i class="ivu-icon ivu-icon-checkmark-round" style="font-weight: bold;color: #aacd03;margin-right: 5px;"></i>' + text
                                } else {
                                    return '<i class="ivu-icon ivu-icon-close-round" style="font-weight: bold;color: #f03;margin-right: 5px;"></i>' + text
                                }
                            }
                        },
                        {
                            title: "承包商",
                            fieldName: "contractor.deptName",
                            orderName: "contractor.dept_name",
                            filterType: "text",
                            render: function (data) {
                                if (data && data.contractor) {
                                    return "<a target='_blank' href='/html/main.html#!/contractor/contractor?method=detail&code=" + data.contractor.code + "&id=" + data.contractor.id + "'>" + data.contractor.deptName + "</ a>";
                                }
                            },
                            tipRender: function (data) {
                                if (data.checkResult === '1') {
                                    return "合格";
                                } else if (data.checkResult === '0') {
                                    return "不合格";
                                } else if (data.checkResult === '2') {
                                    return "不涉及";
                                } else {
                                    return "选择";
                                }
                            }
                        },
                        LIB.tableMgr.column.company,
                        // LIB.tableMgr.column.disable,
                        {
                            //工种
                            title: "工种",
                            fieldName: "workTypeRel",
                            orderName: "workTypeRel.lookUpValue",
                            filterType: "enum",
                            filterName: "criteria.intsValue.workType",
                            popFilterEnum: LIB.getDataDicList("iptw_work_type"),
                            width: 200,
                            render: function (data) {
                                var name = [];
                                if (data && data.workTypeRel) {
                                    _.each(data.workTypeRel, function (item) {
                                        name.push(LIB.getDataDic("iptw_work_type", item.lookUpValue));
                                    })
                                }
                                return name.join(",");
                            },
                        },
                        {
                            //证书
                            title: "任职/资质证书",
                            fieldName: "certRel",
                            orderName: "certRel.lookUpValue",
                            filterType: "enum",
                            filterName: "criteria.intsValue.cert",
                            popFilterEnum: LIB.getDataDicList("iptw_cert"),
                            width: 200,
                            render: function (data) {
                                var name = [];
                                if (data && data.certRel) {
                                    _.each(data.certRel, function (item) {
                                        name.push(LIB.getDataDic("iptw_cert", item.lookUpValue));
                                    })
                                }
                                return name.join(",");
                            },
                        },
                        {
                            //年龄
                            title: "年龄",
                            fieldName: "userDetail.age",
                            orderName: "userDetail.age",
                            filterType: "number",
                            width: 80,
                        },
                        {
                            //性别
                            title: "性别",
                            fieldName: "userDetail.sex",
                            orderName: "userDetail.sex",
                            filterName: "criteria.intsValue.sex",
                            popFilterEnum: LIB.getDataDicList("sex"),
                            filterType: "enum",
                            width: 80,
                            render: function (data) {
                                if (data.userDetail) {
                                    return LIB.getDataDic("sex", data.userDetail.sex);
                                }
                                return "";
                            }
                        },
                        {
                            //身份证号
                            title: "身份证号",
                            fieldName: "userDetail.idcard",
                            orderName: "userDetail.idcard",
                            filterType: "text"
                        },
                        {
                            //联系电话
                            title: "联系电话",
                            fieldName: "telephone",
                            orderName: "mobile",
                            filterType: "text"
                        },
                        {
                            //联系电话
                            title: "系统登录名",
                            fieldName: "loginName",
                            filterType: "text"
                        },
                        {
                            //备注
                            title: "备注",
                            fieldName: "remark",
                            orderName: "remarks",
                            filterType: "text"
                        },

                        // {
                        // 	//证书编号
                        // 	title: "证书编号",
                        // 	fieldName: "certificateNo",
                        // 	filterType: "text"
                        // },
                        //
                        //  LIB.tableMgr.column.remark,
                        //
                        // {
//					 LIB.tableMgr.column.modifyDate,
////					 LIB.tableMgr.column.createDate,
//
                    ],
                    defaultFilterValue: {
                        "criteria.orderValue": {
                            fieldName: "default",
                            orderType: "0"
                        }
                    }
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/contractoremp/importExcel"
            },
            exportModel: {
                url: "/contractoremp/exportExcel",
                withColumnCfgParam: true
            },
            resetPsd: {
                title: "重置密码",
                //显示编辑弹框
                show: false,
                id: null
            },
            //Legacy模式
//			formModel : {
//				contractorEmpFormModel : {
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
            "editpsdcomponent": editPsdComponent,
            //Legacy模式
//			"contractorempFormModal":contractorEmpFormModal,

        },
        methods: {
            //Legacy模式
//			doAdd : function(data) {
//				this.formModel.contractorEmpFormModel.show = true;
//				this.$refs.contractorempFormModal.init("create");
//			},
//			doSaveContractorEmp : function(data) {
//				this.doSave(data);
//			}
            //批量重置密码
            doChangePsdBatch: function () {
                this.resetPsd.show = true;
                this.resetPsd.title = "重置所有用户密码";
                this.$broadcast('ev_editReload_psd_batch');
            },
            doPsdFinshed: function (data) {
                this.resetPsd.show = false;
            },
            doUpdatePassWord: function () {
                var contractorEmpTableModel = this.tableModel.selectedDatas[0];
                if (contractorEmpTableModel) {
                    this.resetPsd.show = true;
                    this.resetPsd.title = "重置密码";
                    this.resetPsd.id = contractorEmpTableModel.id;
                    this.$broadcast('ev_editReload_psd', contractorEmpTableModel.telephone);
                }
            },
            doUnLock: function () {
                var _this = this;
                if (this.tableModel.selectedDatas[0])
                    api.userUnlock(null, [this.tableModel.selectedDatas[0].id]).then(function (res) {
                        LIB.Msg.info("已解除锁定");
                    })
            }
        },
        events: {},
        init: function () {
            this.$api = api;
        },
        ready: function () {
            var column = _.find(this.tableModel.columns, function (c) {
                return c.fieldName === 'disable';
            });
            this.$refs.mainTable.doOkActionInFilterPoptip(null, column, ['0']);
        }
    });

    return vm;
});
