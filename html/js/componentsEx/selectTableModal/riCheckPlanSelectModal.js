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
	                url: "richeckplan/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//计划名
						title: "计划名",
						fieldName: "name",
						keywordFilterName: "criteria.strValue.keyWordValue_name",
					},
					{
						//结束时间
						title: "结束时间",
						fieldName: "endDate",
						keywordFilterName: "criteria.strValue.keyWordValue_endDate",
					},
					{
						title: "巡检计划配置",
						fieldName: "riCheckPlanSetting.name",
						keywordFilterName: "criteria.strValue.keyWordValue_riCheckPlanSetting_name"
					},
					{
						title: "巡检表",
						fieldName: "riCheckTable.name",
						keywordFilterName: "criteria.strValue.keyWordValue_riCheckTable_name"
					},
//					{
//						//开始时间
//						title: "开始时间",
//						fieldName: "startDate",
//						keywordFilterName: "criteria.strValue.keyWordValue_startDate",
//					},
//					 LIB.tableMgr.ksColumn.company,
//					 LIB.tableMgr.ksColumn.dept,
////					{
//						//是否按秩序执行检查 0:否,1:是
//						title: "是否按秩序执行检查",
//						fieldName: "checkInOrder",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iri_check_plan_check_in_order"),
//						render: function (data) {
//							return LIB.getDataDic("iri_check_plan_check_in_order", data.checkInOrder);
//						}
//						keywordFilterName: "criteria.strValue.keyWordValue_checkInOrder",
//					},
//					{
//						//频率类型 0:执行一次,1:重复执行
//						title: "频率类型",
//						fieldName: "checkType",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iri_check_plan_check_type"),
//						render: function (data) {
//							return LIB.getDataDic("iri_check_plan_check_type", data.checkType);
//						}
//						keywordFilterName: "criteria.strValue.keyWordValue_checkType",
//					},
//					{
//						//备注
//						title: "备注",
//						fieldName: "remarks",
//						keywordFilterName: "criteria.strValue.keyWordValue_remarks",
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
		name:"riCheckPlanSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});