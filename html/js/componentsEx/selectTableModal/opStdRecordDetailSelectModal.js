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
	                url: "opstdrecorddetail/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//步骤名称
						title: "步骤名称",
						fieldName: "stepName",
						keywordFilterName: "criteria.strValue.keyWordValue_stepName",
					},
					{
						//操作内容
						title: "操作内容",
						fieldName: "itemContent",
						keywordFilterName: "criteria.strValue.keyWordValue_itemContent",
					},
					{
						title: "作业记录",
						fieldName: "opRecord.name",
						keywordFilterName: "criteria.strValue.keyWordValue_opRecord_name"
					},
//					{
//						//操作明细序号
//						title: "操作明细序号",
//						fieldName: "itemOrderNo",
//						keywordFilterName: "criteria.strValue.keyWordValue_itemOrderNo",
//					},
//					{
//						//操作步骤序号
//						title: "操作步骤序号",
//						fieldName: "stepOrderNo",
//						keywordFilterName: "criteria.strValue.keyWordValue_stepOrderNo",
//					},
//					{
//						//控制措施
//						title: "控制措施",
//						fieldName: "itemCtrlMethod",
//						keywordFilterName: "criteria.strValue.keyWordValue_itemCtrlMethod",
//					},
//					{
//						//风险
//						title: "风险",
//						fieldName: "itemRisk",
//						keywordFilterName: "criteria.strValue.keyWordValue_itemRisk",
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
		name:"opStdRecordDetailSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});