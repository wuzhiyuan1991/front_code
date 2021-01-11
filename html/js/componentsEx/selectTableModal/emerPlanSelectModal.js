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
						//评审状态 1:方案编制,2:内部评审,3:外部审核,4:法人批准,5:政府备案,6:发布实施,10:已发布
						title: "评审状态",
						fieldName: "status",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iem_emer_plan_status"),
						render: function (data) {
							return LIB.getDataDic("iem_emer_plan_status", data.status);
						},
						keywordFilterName: "criteria.strValue.keyWordValue_status"
					},
//					{
//						//预案类型 1:综合应急预案,2:专项应急预案,3:现场处置方案
//						title: "预案类型",
//						fieldName: "type",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iem_emer_plan_type"),
//						render: function (data) {
//							return LIB.getDataDic("iem_emer_plan_type", data.type);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_type"
//					},
//					{
//						//版本号
//						title: "版本号",
//						fieldName: "verNo",
//						keywordFilterName: "criteria.strValue.keyWordValue_verNo"
//					},
//					{
//						//是否为初始版本 0:否,1:是
//						title: "是否为初始版本",
//						fieldName: "isInitial",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iem_emer_plan_is_initial"),
//						render: function (data) {
//							return LIB.getDataDic("iem_emer_plan_is_initial", data.isInitial);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_isInitial"
//					},
//					{
//						//修订频率
//						title: "修订频率",
//						fieldName: "reviseFrequence",
//						keywordFilterName: "criteria.strValue.keyWordValue_reviseFrequence"
//					},
//					 LIB.tableMgr.ksColumn.company,
//					 LIB.tableMgr.ksColumn.dept,
////					{
//						//备注
//						title: "备注",
//						fieldName: "remark",
//						keywordFilterName: "criteria.strValue.keyWordValue_remark"
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
		name:"emerplanSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});