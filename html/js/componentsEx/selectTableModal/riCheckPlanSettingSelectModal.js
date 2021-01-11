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
	                url: "richeckplansetting/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//结束时间
						title: "结束时间",
						fieldName: "endTime",
						keywordFilterName: "criteria.strValue.keyWordValue_endTime",
					},
					{
						//频率类型 1天 2周 3月 4季度 5自定义
						title: "频率类型",
						fieldName: "frequencyType",
						keywordFilterName: "criteria.strValue.keyWordValue_frequencyType",
					},
//					{
//						//是否重复 0执行一次 1执行多次
//						title: "是否重复",
//						fieldName: "isRepeatable",
//						keywordFilterName: "criteria.strValue.keyWordValue_isRepeatable",
//					},
//					{
//						//是否包含周末 0不包含 1包含（frequency_type=1时生效）
//						title: "是否包含周末",
//						fieldName: "isWeekendInculed",
//						keywordFilterName: "criteria.strValue.keyWordValue_isWeekendInculed",
//					},
//					{
//						//时间间隔
//						title: "时间间隔",
//						fieldName: "period",
//						keywordFilterName: "criteria.strValue.keyWordValue_period",
//					},
//					{
//						//开始时间
//						title: "开始时间",
//						fieldName: "startTime",
//						keywordFilterName: "criteria.strValue.keyWordValue_startTime",
//					},
//					{
//						//间隔单位 1分钟 2小时 3天 4周 5月 6季度
//						title: "间隔单位",
//						fieldName: "unit",
//						keywordFilterName: "criteria.strValue.keyWordValue_unit",
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
		name:"riCheckPlanSettingSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});