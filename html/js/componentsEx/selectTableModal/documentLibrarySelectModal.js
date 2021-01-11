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
	                url: "documentlibrary/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//文件夹名
						title: "文件夹名",
						fieldName: "name",
						keywordFilterName: "criteria.strValue.keyWordValue_name"
					},
					 // LIB.tableMgr.ksColumn.company,
//					 LIB.tableMgr.ksColumn.dept,
//					{
//						//类型 1:文件夹,2:文件
//						title: "类型",
//						fieldName: "type",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("system_document_library_type"),
//						render: function (data) {
//							return LIB.getDataDic("system_document_library_type", data.type);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_type"
//					},
//					{
//						//dataType:1:公开文件,2:已审核,10:待审核,11:已驳回
//						title: "dataType:1:公开文件,2:已审核,10:待审核,11:已驳回",
//						fieldName: "dataType",
//						keywordFilterName: "criteria.strValue.keyWordValue_dataType"
//					},
//					{
//						//文件大小
//						title: "文件大小",
//						fieldName: "fileSize",
//						keywordFilterName: "criteria.strValue.keyWordValue_fileSize"
//					},
					 LIB.tableMgr.ksColumn.modifyDate,
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
		name:"documentLibrarySelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});