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
						//选项内容
						title: "选项内容",
						fieldName: "content",
						keywordFilterName: "criteria.strValue.keyWordValue_content"
					},
					 LIB.tableMgr.ksColumn.modifyDate,
					{
						title: "自评问卷问题",
						fieldName: "selfEvaluationQuestion.name",
						keywordFilterName: "criteria.strValue.keyWordValue_selfEvaluationQuestion_name"
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
		name:"selfevaluationoptSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});