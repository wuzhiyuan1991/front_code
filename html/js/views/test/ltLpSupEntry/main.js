define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");      //修改 detailPanelClass : "middle-info-aside"
    //编辑弹框页面bip (big-info-panel)
//	var detailPanel = require("./detail-xl");   //修改 detailPanelClass : "large-info-aside"
    //编辑弹框页面bip (big-info-panel) Legacy模式
//  var detailPanel = require("./detail-tab-xl");//修改 detailPanelClass : "large-info-aside"
    
	//Legacy模式
//	var ltLpSupEntryFormModal = require("componentsEx/formModal/ltLpSupEntryFormModal");

    
    var initDataModel = function () {
        return {
            moduleCode: "ltLpSupEntry",
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
	                url: "ltlpsupentry/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					{
						title: "劳保用品",
						fieldName: "sup.name",
						orderName: "ltLpSup.name",
						filterType: "text",
					},
					{
						//供应商
						title: "供应商",
						fieldName: "supplierName",
						filterType: "text"
					},
					{
						//数量
						title: "数量",
						fieldName: "quantity",
						filterType: "number",
                        fieldType : "custom",
                        render: function(data){
                            if(data.quantity){
                                return data.quantity + _.propertyOf(data)("sup.unit");
                            }
                        }
					},
					{
						//物品价值
						title: "物品价值(元)",
						fieldName: "totalAmount",
						filterType: "number"
					},
					{
						//入库日期
						title: "入库日期",
						fieldName: "storageDate",
						filterType: "date",
                        fieldType: "custom",
                        render: function (data) {
                            return LIB.formatYMD(data.storageDate);
                        }
					},
					 LIB.tableMgr.column.company,
					 LIB.tableMgr.column.dept,
					{
						title: "负责人",
						fieldName: "owner.name",
						orderName: "user.username",
						filterType: "text",
					},
					// LIB.tableMgr.column.disable,
//					 LIB.tableMgr.column.modifyDate,
					 LIB.tableMgr.column.createDate,
//
	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/ltlpsupentry/importExcel"
            },
            exportModel : {
                url: "/ltlpsupentry/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				ltLpSupEntryFormModel : {
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
//			"ltlpsupentryFormModal":ltLpSupEntryFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.ltLpSupEntryFormModel.show = true;
//				this.$refs.ltlpsupentryFormModal.init("create");
//			},
//			doSaveLtLpSupEntry : function(data) {
//				this.doSave(data);
//			}

        },
        events: {
        },
        init: function(){
        	this.$api = api;
        }
    });

    return vm;
});
