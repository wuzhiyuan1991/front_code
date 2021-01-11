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
						//预案名称
						title: "预案名称",
						fieldName: "name",
						keywordFilterName: "criteria.strValue.keyWordValue_name"
					},
					{
						//步骤 1:方案编制,2:内部评审,3:外部审核,4:法人批准,5:政府备案,6:发布实施
						title: "步骤",
						fieldName: "step",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iem_emer_plan_history_step"),
						render: function (data) {
							return LIB.getDataDic("iem_emer_plan_history_step", data.step);
						},
						keywordFilterName: "criteria.strValue.keyWordValue_step"
					},
					{
						title: "预案版本",
						fieldName: "emerPlanVersion.name",
						keywordFilterName: "criteria.strValue.keyWordValue_emerPlanVersion_name"
					},
//					{
//						//操作时间
//						title: "操作时间",
//						fieldName: "operateTime",
//						keywordFilterName: "criteria.strValue.keyWordValue_operateTime"
//					},
//					{
//						//参与人员
//						title: "参与人员",
//						fieldName: "participant",
//						keywordFilterName: "criteria.strValue.keyWordValue_participant"
//					},
//					{
//						//备注描述
//						title: "备注描述",
//						fieldName: "remark",
//						keywordFilterName: "criteria.strValue.keyWordValue_remark"
//					},
//					{
//						//处理结果 1:未通过,2:通过,3:回退
//						title: "处理结果",
//						fieldName: "result",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iem_emer_plan_history_result"),
//						render: function (data) {
//							return LIB.getDataDic("iem_emer_plan_history_result", data.result);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_result"
//					},
//					{
//						//修订频率
//						title: "修订频率",
//						fieldName: "reviseFrequence",
//						keywordFilterName: "criteria.strValue.keyWordValue_reviseFrequence"
//					},
//					{
//						//修订理由(枚举值用英文逗号拼接）
//						title: "修订理由(枚举值用英文逗号拼接）",
//						fieldName: "reviseReason",
//						keywordFilterName: "criteria.strValue.keyWordValue_reviseReason"
//					},
//					{
//						//修订类型 1:定期修订,2:不定期修订
//						title: "修订类型",
//						fieldName: "reviseType",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iem_emer_plan_history_revise_type"),
//						render: function (data) {
//							return LIB.getDataDic("iem_emer_plan_history_revise_type", data.reviseType);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_reviseType"
//					},
//					{
//						//回退节点 1:方案编制,2:内部评审,3:外部审核,4:法人批准,5:政府备案
//						title: "回退节点",
//						fieldName: "rollbackStep",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iem_emer_plan_history_rollback_step"),
//						render: function (data) {
//							return LIB.getDataDic("iem_emer_plan_history_rollback_step", data.rollbackStep);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_rollbackStep"
//					},
//					{
//						//预案类型 1:综合应急预案,2:专项应急预案,3:现场处置方案
//						title: "预案类型",
//						fieldName: "type",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iem_emer_plan_history_type"),
//						render: function (data) {
//							return LIB.getDataDic("iem_emer_plan_history_type", data.type);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_type"
//					},
//					{
//						//版本号
//						title: "版本号",
//						fieldName: "verNo",
//						keywordFilterName: "criteria.strValue.keyWordValue_verNo"
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
		name:"emerplanhistorySelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});