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
	                url: "richeckitemparam/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//单位
						title: "单位",
						fieldName: "unit",
						keywordFilterName: "criteria.strValue.keyWordValue_unit",
					},
					{
						//较大值
						title: "较大值",
						fieldName: "bigValue",
						keywordFilterName: "criteria.strValue.keyWordValue_bigValue",
					},
//					{
//						//最大值
//						title: "最大值",
//						fieldName: "maxValue",
//						keywordFilterName: "criteria.strValue.keyWordValue_maxValue",
//					},
//					{
//						//最小值
//						title: "最小值",
//						fieldName: "minValue",
//						keywordFilterName: "criteria.strValue.keyWordValue_minValue",
//					},
//					{
//						//较小值
//						title: "较小值",
//						fieldName: "smallValue",
//						keywordFilterName: "criteria.strValue.keyWordValue_smallValue",
//					},
//					{
//						//标准值
//						title: "标准值",
//						fieldName: "standardValue",
//						keywordFilterName: "criteria.strValue.keyWordValue_standardValue",
//					},
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
		name:"riCheckItemParamSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});