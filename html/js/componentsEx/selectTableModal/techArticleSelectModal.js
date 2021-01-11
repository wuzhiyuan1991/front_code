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
	                url: "techarticle/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					 LIB.tableMgr.ksColumn.company,
//					 LIB.tableMgr.ksColumn.dept,
					{
						title: "作者",
						fieldName: "user.name",
						keywordFilterName: "criteria.strValue.keyWordValue_user_name"
					},
//					{
//						//
//						title: "",
//						fieldName: "content",
//						keywordFilterName: "criteria.strValue.keyWordValue_content"
//					},
//					{
//						//关键词
//						title: "关键词",
//						fieldName: "keyword",
//						keywordFilterName: "criteria.strValue.keyWordValue_keyword"
//					},
//					{
//						//发布时间
//						title: "发布时间",
//						fieldName: "lastReplyDate",
//						keywordFilterName: "criteria.strValue.keyWordValue_lastReplyDate"
//					},
//					{
//						//发布时间
//						title: "发布时间",
//						fieldName: "publishDate",
//						keywordFilterName: "criteria.strValue.keyWordValue_publishDate"
//					},
//					{
//						//回复次数
//						title: "回复次数",
//						fieldName: "replyTime",
//						keywordFilterName: "criteria.strValue.keyWordValue_replyTime"
//					},
//					{
//						//发布状态 0：未发布，1：已发布
//						title: "发布状态",
//						fieldName: "state",
//						keywordFilterName: "criteria.strValue.keyWordValue_state"
//					},
//					{
//						//帖子标题
//						title: "帖子标题",
//						fieldName: "title",
//						keywordFilterName: "criteria.strValue.keyWordValue_title"
//					},
//					{
//						//查看次数
//						title: "查看次数",
//						fieldName: "viewTime",
//						keywordFilterName: "criteria.strValue.keyWordValue_viewTime"
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
		name:"techarticleSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});