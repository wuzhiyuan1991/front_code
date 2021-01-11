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
						//自评答案(选择题为选项id，问答题手填)
						title: "自评答案(选择题为选项id，问答题手填)",
						fieldName: "answer",
						keywordFilterName: "criteria.strValue.keyWordValue_answer"
					},
					 LIB.tableMgr.ksColumn.modifyDate,
					{
						title: "自评问卷问题",
						fieldName: "selfEvaluationQuestion.name",
						keywordFilterName: "criteria.strValue.keyWordValue_selfEvaluationQuestion_name"
					},
					{
						title: "自评任务",
						fieldName: "selfEvaluationTask.name",
						keywordFilterName: "criteria.strValue.keyWordValue_selfEvaluationTask_name"
					},
//					 LIB.tableMgr.ksColumn.createDate,
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
		name:"selfevaluationdetailSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});