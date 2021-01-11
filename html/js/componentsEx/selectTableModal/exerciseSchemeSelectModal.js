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
	                url: "{POJO-lowerCase}/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//状态 0:未发布,1:已发布
						title: "状态",
						fieldName: "status",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iem_exercise_scheme_status"),
						render: function (data) {
							return LIB.getDataDic("iem_exercise_scheme_status", data.status);
						},
						keywordFilterName: "criteria.strValue.keyWordValue_status"
					},
					{
						//注意事项
						title: "注意事项",
						fieldName: "announcements",
						keywordFilterName: "criteria.strValue.keyWordValue_announcements"
					},
					{
						title: "演练计划",
						fieldName: "exercisePlan.name",
						keywordFilterName: "criteria.strValue.keyWordValue_exercisePlan_name"
					},
//					{
//						//场景概述
//						title: "场景概述",
//						fieldName: "scenarioOverview",
//						keywordFilterName: "criteria.strValue.keyWordValue_scenarioOverview"
//					},
//					{
//						//演练地点
//						title: "演练地点",
//						fieldName: "exerciseAddress",
//						keywordFilterName: "criteria.strValue.keyWordValue_exerciseAddress"
//					},
//					{
//						//演练参加人员职责
//						title: "演练参加人员职责",
//						fieldName: "participantDuty",
//						keywordFilterName: "criteria.strValue.keyWordValue_participantDuty"
//					},
//					{
//						//演练实施步骤
//						title: "演练实施步骤",
//						fieldName: "executionStep",
//						keywordFilterName: "criteria.strValue.keyWordValue_executionStep"
//					},
//					{
//						//演练科目
//						title: "演练科目",
//						fieldName: "subjects",
//						keywordFilterName: "criteria.strValue.keyWordValue_subjects"
//					},
//					{
//						//应急演练组织机构
//						title: "应急演练组织机构",
//						fieldName: "exerciseOrgan",
//						keywordFilterName: "criteria.strValue.keyWordValue_exerciseOrgan"
//					},
//					{
//						//演练科目类型
//						title: "演练科目类型",
//						fieldName: "subjectType",
//						keywordFilterName: "criteria.strValue.keyWordValue_subjectType"
//					},
//					{
//						//演练时间
//						title: "演练时间",
//						fieldName: "exerciseDate",
//						keywordFilterName: "criteria.strValue.keyWordValue_exerciseDate"
//					},
//					{
//						//
//						title: "",
//						fieldName: "purpose",
//						keywordFilterName: "criteria.strValue.keyWordValue_purpose"
//					},
//					 LIB.tableMgr.ksColumn.company,
//					 LIB.tableMgr.ksColumn.dept,
////					{
//						//演练时长（时）
//						title: "演练时长（时）",
//						fieldName: "hour",
//						keywordFilterName: "criteria.strValue.keyWordValue_hour"
//					},
//					{
//						//演练时长（分）
//						title: "演练时长（分）",
//						fieldName: "minute",
//						keywordFilterName: "criteria.strValue.keyWordValue_minute"
//					},
//					{
//						//备注
//						title: "备注",
//						fieldName: "remarks",
//						keywordFilterName: "criteria.strValue.keyWordValue_remarks"
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
		name:"exerciseschemeSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});