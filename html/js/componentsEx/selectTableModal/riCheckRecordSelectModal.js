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
	                url: "richeckrecord/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//检查结果详情 如10/10,10条合格,10条不合格
						title: "检查结果详情",
						fieldName: "checkResultDetail",
						keywordFilterName: "criteria.strValue.keyWordValue_checkResultDetail",
					},
					{
						//检查结果 0:不合格,1:合格
						title: "检查结果",
						fieldName: "checkResult",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iri_check_record_check_result"),
						render: function (data) {
							return LIB.getDataDic("iri_check_record_check_result", data.checkResult);
						},
						keywordFilterName: "criteria.strValue.keyWordValue_checkResult",
					},
					{
						title: "检查人",
						fieldName: "user.name",
						keywordFilterName: "criteria.strValue.keyWordValue_user_name"
					},
					{
						title: "巡检表",
						fieldName: "riCheckTable.name",
						keywordFilterName: "criteria.strValue.keyWordValue_riCheckTable_name"
					},
					{
						title: "巡检任务",
						fieldName: "riCheckTask.name",
						keywordFilterName: "criteria.strValue.keyWordValue_riCheckTask_name"
					},
					{
						title: "巡检计划",
						fieldName: "riCheckPlan.name",
						keywordFilterName: "criteria.strValue.keyWordValue_riCheckPlan_name"
					},
//					{
//						//检查时间
//						title: "检查时间",
//						fieldName: "checkDate",
//						keywordFilterName: "criteria.strValue.keyWordValue_checkDate",
//					},
//					 LIB.tableMgr.ksColumn.company,
//					 LIB.tableMgr.ksColumn.dept,
////					{
//						//检查开始时间
//						title: "检查开始时间",
//						fieldName: "checkBeginDate",
//						keywordFilterName: "criteria.strValue.keyWordValue_checkBeginDate",
//					},
//					{
//						//检查结束时间
//						title: "检查结束时间",
//						fieldName: "checkEndDate",
//						keywordFilterName: "criteria.strValue.keyWordValue_checkEndDate",
//					},
//					{
//						//来源 0:手机检查,1:web录入
//						title: "来源",
//						fieldName: "checkSource",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iri_check_record_check_source"),
//						render: function (data) {
//							return LIB.getDataDic("iri_check_record_check_source", data.checkSource);
//						}
//						keywordFilterName: "criteria.strValue.keyWordValue_checkSource",
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
		name:"riCheckRecordSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});