define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
//	var detailPanel = require("./detail-xl");
    //编辑弹框页面bip (big-info-panel) Legacy模式
//  var detailPanel = require("./detail-tab-xl");
    
	//Legacy模式
//	var equipmentItemFormModal = require("componentsEx/formModal/equipmentItemFormModal");

    
    var initDataModel = function () {
        return {
            moduleCode: "equipmentItem",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass : "middle-info-aside"
//				detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
	            {
	                url: "equipmentitem/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [{
	                    title: "",
	                    fieldName: "id",
	                    fieldType: "cb",
	                }, 
					{
						//编码
						title: "编码",
						fieldName: "code",
						fieldType: "link",
						filterType: "text"
					},
					{
						//设备设施子件名称
						title: "设备设施子件名称",
						fieldName: "name",
						filterType: "text"
					},
					{
						//序列号
						title: "序列号",
						fieldName: "serialNumber",
						filterType: "text"
					},
					{
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
					},
					{
						//保修期(月)
						title: "保修期(月)",
						fieldName: "warranty",
						filterType: "text"
					},
					{
						//保修终止日期 根据保修期自动算出保修终止日期
						title: "保修终止日期",
						fieldName: "warrantyPeriod",
						filterType: "date"
					}
	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/equipmentItem/importExcel"
            },
            exportModel : {
            	 url: "/equipmentItem/exportExcel"
            },
			//Legacy模式
//			formModel : {
//				equipmentItemFormModel : {
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
			//Legacy模式
//			"equipmentitemFormModal":equipmentItemFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.equipmentItemFormModel.show = true;
//				this.$refs.equipmentitemFormModal.init("create");
//			},
//			doSaveEquipmentItem : function(data) {
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
