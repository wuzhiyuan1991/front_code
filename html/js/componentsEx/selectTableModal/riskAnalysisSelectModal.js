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
						//事故类型
						title: "事故类型",
						fieldName: "accidentPattern",
						keywordFilterName: "criteria.strValue.keyWordValue_accidentPattern"
					},
					{
						//可能发生的次生/衍生事故
						title: "可能发生的次生/衍生事故",
						fieldName: "possibleDerivativeAccidents",
						keywordFilterName: "criteria.strValue.keyWordValue_possibleDerivativeAccidents"
					},
					{
						title: "演练方案",
						fieldName: "exerciseScheme.name",
						keywordFilterName: "criteria.strValue.keyWordValue_exerciseScheme_name"
					},
//					{
//						//可能发生的装置
//						title: "可能发生的装置",
//						fieldName: "possibleEquipments",
//						keywordFilterName: "criteria.strValue.keyWordValue_possibleEquipments"
//					},
//					{
//						//可能发生的地点
//						title: "可能发生的地点",
//						fieldName: "possibleLocations",
//						keywordFilterName: "criteria.strValue.keyWordValue_possibleLocations"
//					},
//					{
//						//可能发生的场景
//						title: "可能发生的场景",
//						fieldName: "possibleScenarios",
//						keywordFilterName: "criteria.strValue.keyWordValue_possibleScenarios"
//					},
//					{
//						//可能发生的征兆
//						title: "可能发生的征兆",
//						fieldName: "possibleSigns",
//						keywordFilterName: "criteria.strValue.keyWordValue_possibleSigns"
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
		name:"riskanalysisSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});