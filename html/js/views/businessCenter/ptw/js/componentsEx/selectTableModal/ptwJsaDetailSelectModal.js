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
	                url: "ptwjsadetail/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					{
						//步骤描述
						title: "步骤描述",
						fieldName: "stepDesc",
						keywordFilterName: "criteria.strValue.keyWordValue_stepDesc"
					},
					{
						//残余风险是否可接受 0:否,1:是
						title: "残余风险是否可接受",
						fieldName: "riskAccept",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iptw_jsa_detail_risk_accept"),
						render: function (data) {
							return LIB.getDataDic("iptw_jsa_detail_risk_accept", data.riskAccept);
						},
						keywordFilterName: "criteria.strValue.keyWordValue_riskAccept"
					},
					{
						//控制措施
						title: "控制措施",
						fieldName: "currentControl",
						keywordFilterName: "criteria.strValue.keyWordValue_currentControl"
					},
					{
						title: "工作安全分析",
						fieldName: "ptwJsaMaster.name",
						keywordFilterName: "criteria.strValue.keyWordValue_ptwJsaMaster_name"
					},
//					{
//						//严重性
//						title: "严重性",
//						fieldName: "degree",
//						keywordFilterName: "criteria.strValue.keyWordValue_degree"
//					},
//					{
//						//危害描述
//						title: "危害描述",
//						fieldName: "harmDesc",
//						keywordFilterName: "criteria.strValue.keyWordValue_harmDesc"
//					},
//					{
//						//改进措施
//						title: "改进措施",
//						fieldName: "improveControl",
//						keywordFilterName: "criteria.strValue.keyWordValue_improveControl"
//					},
//					{
//						//作业阶段 0:作业前,1:作业中,2:作业后
//						title: "作业阶段",
//						fieldName: "phase",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_jsa_detail_phase"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_jsa_detail_phase", data.phase);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_phase"
//					},
//					{
//						//可能性
//						title: "可能性",
//						fieldName: "possiblity",
//						keywordFilterName: "criteria.strValue.keyWordValue_possiblity"
//					},
//					{
//						//后果及影响
//						title: "后果及影响",
//						fieldName: "result",
//						keywordFilterName: "criteria.strValue.keyWordValue_result"
//					},
//					{
//						//风险等级评估模型
//						title: "风险等级评估模型",
//						fieldName: "riskModel",
//						keywordFilterName: "criteria.strValue.keyWordValue_riskModel"
//					},
//					{
//						//风险分值
//						title: "风险分值",
//						fieldName: "riskScore",
//						keywordFilterName: "criteria.strValue.keyWordValue_riskScore"
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
		name:"ptwjsadetailSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});