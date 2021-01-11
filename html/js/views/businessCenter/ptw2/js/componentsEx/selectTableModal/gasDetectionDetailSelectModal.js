define(function(require) {

	var LIB = require('lib');
	
	var initDataModel = function () {
        return {
        	mainModel:{
				title:"选择",
				selectedDatas:[]
			},
            tableModel: (
	            {
	                url: "gasdetectiondetail/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//数值
						title: "数值",
						fieldName: "value",
						keywordFilterName: "criteria.strValue.keyWordValue_value"
					},
					{
						//气体检测指标类型 1:有毒有害气体或蒸汽,2:可燃气体或蒸汽,3:氧气
						title: "气体检测指标类型",
						fieldName: "gasType",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iptw_gas_detection_detail_gas_type"),
						render: function (data) {
							return LIB.getDataDic("iptw_gas_detection_detail_gas_type", data.gasType);
						},
						keywordFilterName: "criteria.strValue.keyWordValue_gasType"
					},
					{
						title: "气体类型",
						fieldName: "gasCatalog.name",
						keywordFilterName: "criteria.strValue.keyWordValue_gasCatalog_name"
					},
					{
						title: "气体检测记录",
						fieldName: "gasDetectionRecord.name",
						keywordFilterName: "criteria.strValue.keyWordValue_gasDetectionRecord_name"
					},
//					 LIB.tableMgr.ksColumn.modifyDate,
////					 LIB.tableMgr.ksColumn.createDate,
//
	                ],

	                defaultFilterValue : {
	                	"criteria.orderValue" : {fieldName : "modifyDate", orderType : "1"},
						"disable" : 0
	                },
	                resetTriggerFlag:false
	            }
            )
        };
    }
	
	var opts = {
		mixins : [LIB.VueMixin.selectorTableModal],
		data:function(){
			var data = initDataModel();
			return data;
		},
		name:"gasdetectiondetailSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});