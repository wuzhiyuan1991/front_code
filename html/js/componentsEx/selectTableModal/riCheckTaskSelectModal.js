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
	                url: "richecktask/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//巡检任务名称
						title: "巡检任务名称",
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
						title: "巡检计划",
						fieldName: "riCheckPlan.name",
						keywordFilterName: "criteria.strValue.keyWordValue_riCheckPlan_name"
					},
					{
						title: "巡检表",
						fieldName: "riCheckTable.name",
						keywordFilterName: "criteria.strValue.keyWordValue_riCheckTable_name"
					},
					{
						title: "检查人",
						fieldName: "user.name",
						keywordFilterName: "criteria.strValue.keyWordValue_user_name"
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
//						//实际完成时间
//						title: "实际完成时间",
//						fieldName: "checkDate",
//						keywordFilterName: "criteria.strValue.keyWordValue_checkDate",
//					},
//					{
//						//任务序号
//						title: "任务序号",
//						fieldName: "num",
//						keywordFilterName: "criteria.strValue.keyWordValue_num",
//					},
//					{
//						//任务状态 0:未到期,1:,待执行,2:按期执行,3:超期执行,4:未执行,5:已失效
//						title: "任务状态",
//						fieldName: "status",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iri_check_task_status"),
//						render: function (data) {
//							return LIB.getDataDic("iri_check_task_status", data.status);
//						}
//						keywordFilterName: "criteria.strValue.keyWordValue_status",
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
		name:"riCheckTaskSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});