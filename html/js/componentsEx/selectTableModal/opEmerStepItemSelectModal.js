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
	                url: "opemerstepitem/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//负责人
						title: "负责人",
						fieldName: "principal",
						keywordFilterName: "criteria.strValue.keyWordValue_principal",
					},
					{
						//序号
						title: "序号",
						fieldName: "orderNo",
						keywordFilterName: "criteria.strValue.keyWordValue_orderNo",
					},
					{
						title: "应急处置步骤",
						fieldName: "opEmerStep.name",
						keywordFilterName: "criteria.strValue.keyWordValue_opEmerStep_name"
					},
//					{
//						//现场处置
//						title: "现场处置",
//						fieldName: "content",
//						keywordFilterName: "criteria.strValue.keyWordValue_content",
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
		name:"opEmerStepItemSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});