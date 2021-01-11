define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    //var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
    var detailPanel = require("./detail-xl");

    //导入
    var importProgress = require("componentsEx/importProgress/main");
    //编辑弹框页面bip (big-info-panel) Legacy模式
//  var detailPanel = require("./detail-tab-xl");

    //Legacy模式
//	var tpaBoatEquipmentFormModal = require("componentsEx/formModal/tpaBoatEquipmentFormModal");


    var initDataModel = function () {
        return {
            moduleCode: "tpaBoatEquipment",
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
                    url: "tpaboatequipment/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [{
                        title: "",
                        fieldName: "id",
                        fieldType: "cb",
                    },
                        {
                            //设备编号
                            title: "设备编码",
                            fieldName: "code",
                            fieldType: "link",
                            filterType: "text"
                        },
                        {
                            //设备设施名称
                            title: "设备名称",
                            fieldName: "name",
                            filterType: "text"
                        },
                        // LIB.tableMgr.column.company,
                        // LIB.tableMgr.column.company,
                        //{
                        //	//是否禁用 0启用，1禁用
                        //	title: "是否禁用",
                        //	fieldName: "disable",
                        //	filterType: "text"
                        //},
                        //{
                        //	//报废日期
                        //	title: "报废日期",
                        //	fieldName: "retirementDate",
                        //	filterType: "date"
                        //},

                        {
                            //设备型号
                            title: "设备型号",
                            fieldName: "version",
                            filterType: "text"
                        },
                        {
                            title: "设备分类",
                            orderName: "type",
                            fieldType: "custom",
                            render: function (data) {
                                return LIB.getDataDic("boat_equipment_type", data.type);
                            },
                            popFilterEnum: LIB.getDataDicList("boat_equipment_type"),
                            filterType: "enum",
                            filterName: "criteria.intsValue.type"
                        },
                        {
                            title: "负责人",
                            fieldName: "user.username",
                            filterType: "text",
                            filterName: "criteria.strValue.userName"
                        },
                        {
                            //设备登记日期
                            title: "登记日期",
                            fieldName: "createDate",
                            filterType: "date"
                        },
                        {
                            //保修期(月)
                            title: "报废日期",
                            fieldName: "retirementDate",
                            filterType: "date",
                            render: function (data) {
                                if (!data.retirementDate) {
                                    return '';
                                }
                                var now = new Date().Format("yyyy-MM-dd 00:00:00");
                                if (now >= data.retirementDate) {
                                    return '<div style="color: #f00;">' + data.retirementDate + '</div>';
                                }
                                return data.retirementDate;
                            }
                        },
                        {
                            //设备设施状态 0再用,1停用,2报废
                            title: "设备状态",
                            fieldName: "state",
                            fieldType: "custom",
                            filterType: "enum",
                            filterName: "criteria.strsValue.state",
                            popFilterEnum: LIB.getDataDicList("stateData"),
                            render: function (data) {
                                return LIB.getDataDic("stateData", data.state);
                            }
                        },
//					{
//						//保修终止日期 根据保修期自动算出
//						title: "保修终止日期",
//						fieldName: "warrantyPeriod",
//						filterType: "date"
//					},
//					{
//						//设备更新日期
//						title: "设备更新日期",
//						fieldName: "modifyDate",
//						filterType: "date"
//					},
//					{
//						//设备登记日期
//						title: "设备登记日期",
//						fieldName: "createDate",
//						filterType: "date"
//					},
                    ]
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/tpaboatequipment/importExcel"
            },
            exportModel: {
                url: "/tpaboatequipment/exportExcel"
            },
            templete: {
                url: "/tpaboatequipment/file/down"
            },
            importProgress: {
                show: false
            }
            //Legacy模式
//			formModel : {
//				tpaBoatEquipmentFormModel : {
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
//			"tpaboatequipmentFormModal":tpaBoatEquipmentFormModal,

        },
        methods: {
            doImport: function () {
                var _this = this;
                _this.importProgress.show = true;
            },
            //Legacy模式
//			doAdd : function(data) {
//				this.formModel.tpaBoatEquipmentFormModel.show = true;
//				this.$refs.tpaboatequipmentFormModal.init("create");
//			},
//			doSaveTpaBoatEquipment : function(data) {
//				this.doSave(data);
//			}

        },
        events: {},
        ready: function () {
            this.$api = api;
        }
    });

    return vm;
});
