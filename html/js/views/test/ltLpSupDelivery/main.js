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
//	var ltLpSupDeliveryFormModal = require("componentsEx/formModal/ltLpSupDeliveryFormModal");

    
    var initDataModel = function () {
        return {
            moduleCode: "ltLpSupDelivery",
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
	                url: "ltlpsupdelivery/list{/curPage}{/pageSize}",
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
                        title: "用品型号",
                        fieldName: "sup.model",
                        orderName: "ltLpSup.model",
                        filterType: "text",
                    },
					{
						//领用日期
						title: "领用日期",
						fieldName: "receiverDate",
						filterType: "date",
						fieldType: "custom",
						render: function (data) {
							return LIB.formatYMD(data.receiverDate);
						}
					},
					{
						//领用数量
						title: "领用数量",
						fieldName: "quantity",
						filterType: "number",
                        fieldType : "custom",
                        render: function(data){
                            if(data.quantity){
                                return data.quantity + _.propertyOf(data)("sup.unit");
                            }
                        }
					},
					 LIB.tableMgr.column.company,
					 LIB.tableMgr.column.dept,
					 // LIB.tableMgr.column.modifyDate,
					 LIB.tableMgr.column.createDate,

	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/ltlpsupdelivery/importExcel"
            },
            exportModel : {
                url: "/ltlpsupdelivery/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				ltLpSupDeliveryFormModel : {
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
//			"ltlpsupdeliveryFormModal":ltLpSupDeliveryFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.ltLpSupDeliveryFormModel.show = true;
//				this.$refs.ltlpsupdeliveryFormModal.init("create");
//			},
//			doSaveLtLpSupDelivery : function(data) {
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
