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
//	var gasDetectionDetailFormModal = require("componentsEx/formModal/gasDetectionDetailFormModal");

	LIB.registerDataDic("iptw_gas_detection_detail_gas_type", [
		["1","有毒有害气体或蒸汽"],
		["2","可燃气体或蒸汽"],
		["3","氧气"]
	]);

    
    var initDataModel = function () {
        return {
            moduleCode: "gasDetectionDetail",
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
	                url: "gasdetectiondetail/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					{
						//数值
						title: "数值",
						fieldName: "value",
						filterType: "text"
					},
					{
						//气体检测指标类型 1:有毒有害气体或蒸汽,2:可燃气体或蒸汽,3:氧气
						title: "气体检测指标类型",
						fieldName: "gasType",
						orderName: "gasType",
						filterName: "criteria.intsValue.gasType",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iptw_gas_detection_detail_gas_type"),
						render: function (data) {
							return LIB.getDataDic("iptw_gas_detection_detail_gas_type", data.gasType);
						}
					},
					 LIB.tableMgr.column.disable,
					 LIB.tableMgr.column.modifyDate,
					 LIB.tableMgr.column.createDate,

	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/gasdetectiondetail/importExcel"
            },
            exportModel : {
                url: "/gasdetectiondetail/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				gasDetectionDetailFormModel : {
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
//			"gasdetectiondetailFormModal":gasDetectionDetailFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.gasDetectionDetailFormModel.show = true;
//				this.$refs.gasdetectiondetailFormModal.init("create");
//			},
//			doSaveGasDetectionDetail : function(data) {
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
