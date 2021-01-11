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
	                url: "opstdstepitem/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//序号
						title: "序号",
						fieldName: "orderNo",
						keywordFilterName: "criteria.strValue.keyWordValue_orderNo",
					},
					{
						//操作内容
						title: "操作内容",
						fieldName: "content",
						keywordFilterName: "criteria.strValue.keyWordValue_content",
					},
					{
						title: "操作票操作步骤",
						fieldName: "opStdStep.name",
						keywordFilterName: "criteria.strValue.keyWordValue_opStdStep_name"
					},
//					{
//						//控制措施
//						title: "控制措施",
//						fieldName: "ctrlMethod",
//						keywordFilterName: "criteria.strValue.keyWordValue_ctrlMethod",
//					},
//					{
//						//风险
//						title: "风险",
//						fieldName: "risk",
//						keywordFilterName: "criteria.strValue.keyWordValue_risk",
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
		name:"opStdStepItemSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});