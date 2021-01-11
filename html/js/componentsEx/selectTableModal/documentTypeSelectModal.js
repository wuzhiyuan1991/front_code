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
	                url: "documentclassification/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//证书类型
						title: "证书类型",
						fieldName: "name",
						keywordFilterName: "criteria.strValue.keyWordValue_name",
						width: 600
					},
					// {
					// 	//级别 0为顶级分类
					// 	title: "级别",
					// 	fieldName: "level",
					// 	keywordFilterName: "criteria.strValue.keyWordValue_level"
					// },
					// {
					// 	title: "父级证书类型",
					// 	fieldName: "parent.name",
					// 	keywordFilterName: "criteria.strValue.keyWordValue_parent_name"
					// },
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
		name:"documentTypeSelectModal",
		
	};

	
	var component = LIB.Vue.extend(opts);
	return component;
});