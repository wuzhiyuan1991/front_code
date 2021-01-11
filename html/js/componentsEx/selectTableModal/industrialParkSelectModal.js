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
	                url: "industrialpark/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//园区名称
						title: "园区名称",
						fieldName: "name",
						keywordFilterName: "criteria.strValue.keyWordValue_name"
					},
					 LIB.tableMgr.ksColumn.company,
//					 LIB.tableMgr.ksColumn.dept,
//					{
//						//坐标
//						title: "坐标",
//						fieldName: "location",
//						keywordFilterName: "criteria.strValue.keyWordValue_location"
//					},
//					{
//						//备注
//						title: "备注",
//						fieldName: "remark",
//						keywordFilterName: "criteria.strValue.keyWordValue_remark"
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
		name:"industrialparkSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});