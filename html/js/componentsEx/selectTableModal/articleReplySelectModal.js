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
	                url: "articlereply/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					 LIB.tableMgr.ksColumn.company,
//					 LIB.tableMgr.ksColumn.dept,
					{
						title: "帖子",
						fieldName: "techArticle.name",
						keywordFilterName: "criteria.strValue.keyWordValue_techArticle_name"
					},
//					{
//						//回复内容
//						title: "回复内容",
//						fieldName: "content",
//						keywordFilterName: "criteria.strValue.keyWordValue_content"
//					},
//					{
//						//本回复的上级回复id
//						title: "本回复的上级回复",
//						fieldName: "replyFor",
//						keywordFilterName: "criteria.strValue.keyWordValue_replyFor"
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
		name:"articlereplySelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});