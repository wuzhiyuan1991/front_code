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
//	var ltOhHazardsFormModal = require("componentsEx/formModal/ltOhHazardsFormModal");

    
    var initDataModel = function () {
        return {
            moduleCode: "ltOhHazards",
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
	                url: "ltohhazards/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					{
						//设备/工艺/工序
						title: "设备/工艺/工序",
						fieldName: "name",
						filterType: "text"
					},
					{
						//可能导致的职业病
						title: "可能导致的职业病",
						fieldName: "diseases",
						filterType: "text"
					},
					{
						//危害因素
						title: "危害因素",
						fieldName: "factors",
						filterType: "text"
					},
					{
						//种类
						title: "种类",
						fieldName: "factorsType",
						filterType: "text"
					},
					{
						//资金投入
						title: "资金投入(元)",
						fieldName: "invest",
						filterType: "number"
					},
                    LIB.tableMgr.column.company,
                    LIB.tableMgr.column.dept,
//					{
//						//防护设施及用品
//						title: "防护设施及用品",
//						fieldName: "protectFac",
//						filterType: "text"
//					},
//					 LIB.tableMgr.column.modifyDate,
////					 LIB.tableMgr.column.createDate,
//
	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/ltohhazards/importExcel"
            },
            exportModel : {
                url: "/ltohhazards/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				ltOhHazardsFormModel : {
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
//			"ltohhazardsFormModal":ltOhHazardsFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.ltOhHazardsFormModel.show = true;
//				this.$refs.ltohhazardsFormModal.init("create");
//			},
//			doSaveLtOhHazards : function(data) {
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
