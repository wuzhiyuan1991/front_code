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
	                url: "tableitemrel/list/group{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 //LIB.tableMgr.ksColumn.code,
					{
						//标签名称
						title: "检查表编码",
						fieldName: "checkTable.code",
						keywordFilterName: "criteria.strValue.keyWordValue_checkTableCode"
					},
					{
						//标签名称
						title: "检查表",
						fieldName: "checkTable.name",
						keywordFilterName: "criteria.strValue.keyWordValue_checkTableName"
					},
					{
						//标签标识
						title: "分组名",
						fieldName: "groupName",
						keywordFilterName: "criteria.strValue.keyWordValue_groupName"
					},
//					 LIB.tableMgr.ksColumn.modifyDate,
////					 LIB.tableMgr.ksColumn.createDate,
//
	                ],

	                defaultFilterValue : {
	                	"criteria.orderValue" : {fieldName : "checkTableId", orderType : "1"},
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
		name:"tableItemRelSelectModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});