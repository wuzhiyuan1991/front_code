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
						//客观记录
						title: "客观记录",
						fieldName: "objectiveRecord",
						keywordFilterName: "criteria.strValue.keyWordValue_objectiveRecord"
					},
					{
						//存在问题
						title: "存在问题",
						fieldName: "problem",
						keywordFilterName: "criteria.strValue.keyWordValue_problem"
					},
					{
						title: "演练评估",
						fieldName: "exerciseEstimate.name",
						keywordFilterName: "criteria.strValue.keyWordValue_exerciseEstimate_name"
					},
//					{
//						//评价内容
//						title: "评价内容",
//						fieldName: "content",
//						keywordFilterName: "criteria.strValue.keyWordValue_content"
//					},
//					{
//						//改进建议
//						title: "改进建议",
//						fieldName: "suggestion",
//						keywordFilterName: "criteria.strValue.keyWordValue_suggestion"
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
		name:"exerciseestimatedetailSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});