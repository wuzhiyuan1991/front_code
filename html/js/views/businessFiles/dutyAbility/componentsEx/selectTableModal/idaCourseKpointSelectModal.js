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
	                url: "idacoursekpoint/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//节点名称
						title: "节点名称",
						fieldName: "name",
						keywordFilterName: "criteria.strValue.keyWordValue_name"
					},
					{
						//文本
						title: "文本",
						fieldName: "content",
						keywordFilterName: "criteria.strValue.keyWordValue_content"
					},
//					{
//						//课件类型 1视频 2图片 3word 4excel 5ppt 6pdf
//						title: "课件类型",
//						fieldName: "fileType",
//						keywordFilterName: "criteria.strValue.keyWordValue_fileType"
//					},
//					{
//						//是否可以试听 1免费,2收费
//						title: "是否可以试听",
//						fieldName: "isFree",
//						keywordFilterName: "criteria.strValue.keyWordValue_isFree"
//					},
//					{
//						//节点类型 0章,1节
//						title: "节点类型",
//						fieldName: "kpointType",
//						keywordFilterName: "criteria.strValue.keyWordValue_kpointType"
//					},
//					{
//						//直播开始时间
//						title: "直播开始时间",
//						fieldName: "liveBeginTime",
//						keywordFilterName: "criteria.strValue.keyWordValue_liveBeginTime"
//					},
//					{
//						//直播结束时间
//						title: "直播结束时间",
//						fieldName: "liveEndTime",
//						keywordFilterName: "criteria.strValue.keyWordValue_liveEndTime"
//					},
//					{
//						//直播地址
//						title: "直播地址",
//						fieldName: "liveUrl",
//						keywordFilterName: "criteria.strValue.keyWordValue_liveUrl"
//					},
//					{
//						//页数
//						title: "页数",
//						fieldName: "pageCount",
//						keywordFilterName: "criteria.strValue.keyWordValue_pageCount"
//					},
//					{
//						//课后作业版本号 更新次数
//						title: "课后作业版本号",
//						fieldName: "paperVersion",
//						keywordFilterName: "criteria.strValue.keyWordValue_paperVersion"
//					},
//					{
//						//播放次数
//						title: "播放次数",
//						fieldName: "playCount",
//						keywordFilterName: "criteria.strValue.keyWordValue_playCount"
//					},
//					{
//						//播放时间
//						title: "播放时间",
//						fieldName: "playTime",
//						keywordFilterName: "criteria.strValue.keyWordValue_playTime"
//					},
//					{
//						//视频类型
//						title: "视频类型",
//						fieldName: "videoType",
//						keywordFilterName: "criteria.strValue.keyWordValue_videoType"
//					},
//					{
//						//视频地址
//						title: "视频地址",
//						fieldName: "videoUrl",
//						keywordFilterName: "criteria.strValue.keyWordValue_videoUrl"
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
		name:"idacoursekpointSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});