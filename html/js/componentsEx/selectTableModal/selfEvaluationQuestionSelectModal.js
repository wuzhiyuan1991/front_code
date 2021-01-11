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
						//自评内容
						title: "自评内容",
						fieldName: "content",
						keywordFilterName: "criteria.strValue.keyWordValue_content"
					},
					{
						//题型 1:单选,2:多选,3:问答
						title: "题型",
						fieldName: "type",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iem_self_evaluation_question_type"),
						render: function (data) {
							return LIB.getDataDic("iem_self_evaluation_question_type", data.type);
						},
						keywordFilterName: "criteria.strValue.keyWordValue_type"
					},
					{
						title: "演练方案",
						fieldName: "exerciseScheme.name",
						keywordFilterName: "criteria.strValue.keyWordValue_exerciseScheme_name"
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
		name:"selfevaluationquestionSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});