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
	                url: "systembusinessset/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 // LIB.tableMgr.ksColumn.code,
					{
						title: "类别",
						fieldName: "attr5",
						filterType: "text"
					},
					{
						//配置名称
						title: "配置名称",
						fieldName: "name",
						keywordFilterName: "criteria.strValue.keyWordValue_name"
					},
					// {
					// 	//是否为默认配置
					// 	title: "是否为默认配置",
					// 	fieldName: "isDefault",
					// 	keywordFilterName: "criteria.strValue.keyWordValue_isDefault"
					// },
//					 LIB.tableMgr.ksColumn.company,
//					 LIB.tableMgr.ksColumn.dept,
					{
						//描述
						title: "描述",
						fieldName: "description",
						keywordFilterName: "criteria.strValue.keyWordValue_description"
					}
//					{
//						//配置值
//						title: "配置值",
//						fieldName: "result",
//						keywordFilterName: "criteria.strValue.keyWordValue_result"
//					},
//					{
//						//是否可以修改
//						title: "是否可以修改",
//						fieldName: "unmodified",
//						keywordFilterName: "criteria.strValue.keyWordValue_unmodified"
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
		name:"systembusinesssetSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});