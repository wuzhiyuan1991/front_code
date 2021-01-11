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
	                url: "{POJO-lowerCase}/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//演习前的准备
						title: "演习前的准备",
						fieldName: "preparation",
						keywordFilterName: "criteria.strValue.keyWordValue_preparation"
					},
					{
						//演习的改进建议
						title: "演习的改进建议",
						fieldName: "suggestionSummary",
						keywordFilterName: "criteria.strValue.keyWordValue_suggestionSummary"
					},
					{
						title: "演练总结",
						fieldName: "exerciseScheme.name",
						keywordFilterName: "criteria.strValue.keyWordValue_exerciseScheme_name"
					},
//					{
//						//演习经过简述(默认演练方案的步骤)
//						title: "演习经过简述(默认演练方案的步骤)",
//						fieldName: "processDesc",
//						keywordFilterName: "criteria.strValue.keyWordValue_processDesc"
//					},
//					{
//						//
//						title: "",
//						fieldName: "revelation",
//						keywordFilterName: "criteria.strValue.keyWordValue_revelation"
//					},
//					{
//						//演习的不足之处
//						title: "演习的不足之处",
//						fieldName: "shortcomings",
//						keywordFilterName: "criteria.strValue.keyWordValue_shortcomings"
//					},
//					{
//						//演习的评估情况
//						title: "演习的评估情况",
//						fieldName: "estimateSummary",
//						keywordFilterName: "criteria.strValue.keyWordValue_estimateSummary"
//					},
//					{
//						//备注
//						title: "备注",
//						fieldName: "remarks",
//						keywordFilterName: "criteria.strValue.keyWordValue_remarks"
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
		name:"exercisesummarySelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});