define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
   // var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
	var detailPanel = require("./detail-xl");
    //编辑弹框页面bip (big-info-panel) Legacy模式
//  var detailPanel = require("./detail-tab-xl");
    //导入
    var importProgress = require("componentsEx/importProgress/main");
    //Legacy模式
//	var equipmentFormModal = require("componentsEx/formModal/equipmentFormModal");


    var initDataModel = function () {
        return {
            moduleCode: "equipment",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
   //             detailPanelClass : "middle-info-aside"
				detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "tpaequipment/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [{
                        title: "",
                        fieldName: "id",
                        fieldType: "cb",
                    },
                        {
                            //设备编号
                            title: this.$t("bd.hal.equipmentCode"),
                            fieldName: "code",
                            fieldType: "link",
                            filterType: "text"
                        },
                        {
                            //设备设施名称
                            title: this.$t("bd.hal.equipmentName"),
                            fieldName: "name",
                            filterType: "text",
                            filterName: "criteria.strValue.equipmentName"
                        },
                        {
                            title: this.$t("bd.hal.equipmentType"),
                            fieldName: "tpaEquipmentType.name",
                            filterType: "text",
                            filterName: "criteria.strValue.equipmentTypeName",
                            orderName : "equipmenttype.name"
                        },
                        {
                            title: this.$t("bd.hal.equipmentNumber"),
                            fieldName: "version",
                            filterType: "text"
                        },
                        {
                            title: "负责人",
                            fieldName: "user.username",
                            filterType: "text",
                            filterName: "criteria.strValue.userName"
                        },
                        {
                            //设备登记日期
                            title: "设备登记日期",
                            fieldName: "createDate",
                            filterType: "date"
                        },
                        /*LIB.tableMgr.column.company,
                         LIB.tableMgr.column.dept,*/

                        /*{
                         //是否禁用 0启用，1禁用
                         //title: "是否禁用",
                         title: this.$t("gb.common.state"),
                         fieldName: "disable",
                         filterType: "enum",
                         filterName: "criteria.intsValue.disable"
                         },
                         {
                         //报废日期
                         title: "报废日期",
                         fieldName: "retirementDate",
                         filterType: "date"
                         },*/
                        {
                            //保修期(月)
                            title: "保修期(月)",
                            fieldName: "warranty",
                            filterType: "text",
                        },
                        {
                            //设备设施状态 0再用,1停用,2报废
                            title: "设备状态",
                            fieldName: "state",
                            fieldType: "custom",
                            filterType: "enum",
                            filterName: "criteria.strsValue.state",
                            popFilterEnum : LIB.getDataDicList("stateData"),
                            render: function (data) {
                                return LIB.getDataDic("stateData",data.state);
                            }
                        },
                        /*{
                         //保修终止日期 根据保修期自动算出
                         title: "保修终止日期",
                         fieldName: "warrantyPeriod",
                         filterType: "date"
                         },*/
//					{
//						//设备更新日期
//						title: "设备更新日期",
//						fieldName: "modifyDate",
//						filterType: "date"
//					},
                    ]
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/tpaequipment/importExcel"
            },
            exportModel : {
                url: "/tpaequipment/exportExcel"
            },
            templete : {
                url: "/tpaequipment/file/down"
            },
            importProgress:{
                show: false
            }
            //Legacy模式
//			formModel : {
//				equipmentFormModel : {
//					show : false,
//				}
//			}

        };
    }

    var vm = LIB.VueEx.extend({
        mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        //Legacy模式
//		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainLegacyPanel],
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
            "importprogress":importProgress
            //Legacy模式
//			"equipmentFormModal":equipmentFormModal,

        },
        methods: {
            doImport:function(){
                var _this=this;
                _this.importProgress.show = true;
            },
            //Legacy模式
//			doAdd : function(data) {
//				this.formModel.equipmentFormModel.show = true;
//				this.$refs.equipmentFormModal.init("create");
//			},
//			doSaveEquipment : function(data) {
//				this.doSave(data);
//			}

        },
        events: {
        },
        ready: function(){
            this.$api = api;
        }
    });

    return vm;
});
