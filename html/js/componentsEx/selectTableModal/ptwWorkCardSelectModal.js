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
	                url: "ptwworkcard/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//作业开始时间
						title: "作业开始时间",
						fieldName: "workStartTime",
						keywordFilterName: "criteria.strValue.keyWordValue_workStartTime"
					},
					{
						//作业区域/地点
						title: "作业内容",
						fieldName: "workContent",
						keywordFilterName: "criteria.strValue.keyWordValue_workContent"
					},
					{
						title: "作业类型",
						fieldName: "workCatalog.name",
						keywordFilterName: "criteria.strValue.keyWordValue_workCatalog_name"
					},
					{
						title: "评审人",
						fieldName: "auditor.name",
						keywordFilterName: "criteria.strValue.keyWordValue_auditor_name"
					},
//					{
//						//作业结束时间
//						title: "作业结束时间",
//						fieldName: "workEndTime",
//						keywordFilterName: "criteria.strValue.keyWordValue_workEndTime"
//					},
//					{
//						//是否启用预约机制 0:否,1:是
//						title: "是否启用预约机制",
//						fieldName: "enableReservation",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_work_card_enable_reservation"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_work_card_enable_reservation", data.enableReservation);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_enableReservation"
//					},
//					{
//						//作业内容
//						title: "作业内容",
//						fieldName: "workContent",
//						keywordFilterName: "criteria.strValue.keyWordValue_workContent"
//					},
//					 LIB.tableMgr.ksColumn.company,
//					 LIB.tableMgr.ksColumn.dept,
////					{
//						//评审意见
//						title: "评审意见",
//						fieldName: "auditOpinion",
//						keywordFilterName: "criteria.strValue.keyWordValue_auditOpinion"
//					},
//					{
//						//评审结果 0:未评审,1:不通过,2:通过
//						title: "评审结果",
//						fieldName: "auditResult",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_work_card_audit_result"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_work_card_audit_result", data.auditResult);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_auditResult"
//					},
//					{
//						//评审时间
//						title: "评审时间",
//						fieldName: "auditTime",
//						keywordFilterName: "criteria.strValue.keyWordValue_auditTime"
//					},
//					{
//						//作业状态  1:作业预约,2:作业评审,3:填报作业票,4:现场落实,5:作业会签,6:作业批准,7:开工监测,8:结果确认,9:作业关闭
//						title: "作业状态",
//						fieldName: "status",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_work_card_status"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_work_card_status", data.status);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_status"
//					},
//					{
//						//作业所在设备
//						title: "作业所在设备",
//						fieldName: "workEquipment",
//						keywordFilterName: "criteria.strValue.keyWordValue_workEquipment"
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
		name:"ptwworkcardSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});