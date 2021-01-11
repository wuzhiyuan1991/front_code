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
//	var equipmentTypeFormModal = require("componentsEx/formModal/equipmentTypeFormModal");

    
    var initDataModel = function () {
        return {
            moduleCode: "equipmentType",
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
	                url: "equipmenttype/list{/curPage}{/pageSize}",
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
						//设备设施类型名
						title: "设备设施类型名",
						fieldName: "name",
						filterType: "text"
					},
					{
						//是否禁用 0:正常,1:删除
						//title: "是否禁用",
                        title: this.$t('gb.common.state'),
						fieldName: "disable",
                        filterType: "enum",
                        filterName: "criteria.intsValue.disable"
					},
					{
						//修改日期
						title: "修改日期",
						fieldName: "modifyDate",
						filterType: "date"
					},
					{
						//创建日期
						title: "创建日期",
						fieldName: "createDate",
						filterType: "date"
					},
	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/equipmentType/importExcel"
            },
            exportModel : {
            	 url: "/equipmentType/exportExcel"
            },
			//Legacy模式
//			formModel : {
//				equipmentTypeFormModel : {
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
//			"equipmenttypeFormModal":equipmentTypeFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.equipmentTypeFormModel.show = true;
//				this.$refs.equipmenttypeFormModal.init("create");
//			},
//			doSaveEquipmentType : function(data) {
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
