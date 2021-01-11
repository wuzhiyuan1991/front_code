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
						//预案类型 1:综合应急预案,2:专项应急预案,3:现场处置方案
						title: "预案类型",
						fieldName: "type",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iem_emer_plan_version_type"),
						render: function (data) {
							return LIB.getDataDic("iem_emer_plan_version_type", data.type);
						},
						keywordFilterName: "criteria.strValue.keyWordValue_type"
					},
					{
						title: "应急预案",
						fieldName: "emerPlan.name",
						keywordFilterName: "criteria.strValue.keyWordValue_emerPlan_name"
					},
//					{
//						//版本号
//						title: "版本号",
//						fieldName: "verNo",
//						keywordFilterName: "criteria.strValue.keyWordValue_verNo"
//					},
//					{
//						//修订频率
//						title: "修订频率",
//						fieldName: "reviseFrequence",
//						keywordFilterName: "criteria.strValue.keyWordValue_reviseFrequence"
//					},
//					{
//						//备注
//						title: "备注",
//						fieldName: "remark",
//						keywordFilterName: "criteria.strValue.keyWordValue_remark"
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
//						popFilterEnum: LIB.getDataDicList("iem_emer_plan_version_revise_type"),
//						render: function (data) {
//							return LIB.getDataDic("iem_emer_plan_version_revise_type", data.reviseType);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_reviseType"
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
		name:"emerplanversionSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});