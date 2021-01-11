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
	                url: "jsadetailnew/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					{
						//步骤号
						title: "步骤号",
						fieldName: "step",
						keywordFilterName: "criteria.strValue.keyWordValue_step",
					},
					{
						//步骤描述
						title: "步骤描述",
						fieldName: "stepDesc",
						keywordFilterName: "criteria.strValue.keyWordValue_stepDesc",
					},
					{
						//残余风险是否可接受 0:否,1:是
						title: "残余风险是否可接受",
						fieldName: "riskAccept",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("jsa_detail_new_risk_accept"),
						render: function (data) {
							return LIB.getDataDic("jsa_detail_new_risk_accept", data.riskAccept);
						},
						keywordFilterName: "criteria.strValue.keyWordValue_riskAccept",
					},
					{
						title: "JSA",
						fieldName: "jsaMasterNew.name",
						keywordFilterName: "criteria.strValue.keyWordValue_jsaMasterNew_name"
					},
//					 LIB.tableMgr.ksColumn.company,
//					 LIB.tableMgr.ksColumn.dept,
////					{
//						//控制措施
//						title: "控制措施",
//						fieldName: "currentControl",
//						keywordFilterName: "criteria.strValue.keyWordValue_currentControl",
//					},
//					{
//						//严重性
//						title: "严重性",
//						fieldName: "degree",
//						keywordFilterName: "criteria.strValue.keyWordValue_degree",
//					},
//					{
//						//危害描述
//						title: "危害描述",
//						fieldName: "harmDesc",
//						keywordFilterName: "criteria.strValue.keyWordValue_harmDesc",
//					},
//					{
//						//改进措施
//						title: "改进措施",
//						fieldName: "improveControl",
//						keywordFilterName: "criteria.strValue.keyWordValue_improveControl",
//					},
//					{
//						//
//						title: "",
//						fieldName: "isflag",
//						keywordFilterName: "criteria.strValue.keyWordValue_isflag",
//					},
//					{
//						//作业阶段 0:作业前,1:作业中,2:作业后
//						title: "作业阶段",
//						fieldName: "phase",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("jsa_detail_new_phase"),
//						render: function (data) {
//							return LIB.getDataDic("jsa_detail_new_phase", data.phase);
//						}
//						keywordFilterName: "criteria.strValue.keyWordValue_phase",
//					},
//					{
//						//可能性
//						title: "可能性",
//						fieldName: "possiblity",
//						keywordFilterName: "criteria.strValue.keyWordValue_possiblity",
//					},
//					{
//						//后果及影响
//						title: "后果及影响",
//						fieldName: "result",
//						keywordFilterName: "criteria.strValue.keyWordValue_result",
//					},
//					{
//						//风险分值
//						title: "风险分值",
//						fieldName: "riskScore",
//						keywordFilterName: "criteria.strValue.keyWordValue_riskScore",
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
		name:"jsaDetailNewSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});