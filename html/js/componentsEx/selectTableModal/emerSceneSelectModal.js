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
	                url: "emercard/emerscenes/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//处置卡名称
						title: "处置卡名称",
						fieldName: "name",
						keywordFilterName: "criteria.strValue.keyWordValue_name"
					},
					{
						//事故可能引发的次生、衍生事故
						title: "事故可能引发的次生、衍生事故",
						fieldName: "derivativeEvents",
						keywordFilterName: "criteria.strValue.keyWordValue_derivativeEvents"
					},
					{
						title: "应急处置卡",
						fieldName: "emerCard.name",
						keywordFilterName: "criteria.strValue.keyWordValue_emerCard_name"
					},
//					{
//						//事故发生的可能时间，事故的危害严重程度及其影响范围
//						title: "事故发生的可能时间，事故的危害严重程度及其影响范围",
//						fieldName: "timeAndInfluence",
//						keywordFilterName: "criteria.strValue.keyWordValue_timeAndInfluence"
//					},
//					{
//						//事故类型
//						title: "事故类型",
//						fieldName: "accidentType",
//						keywordFilterName: "criteria.strValue.keyWordValue_accidentType"
//					},
//					{
//						//事故前可能出现的征兆
//						title: "事故前可能出现的征兆",
//						fieldName: "sign",
//						keywordFilterName: "criteria.strValue.keyWordValue_sign"
//					},
//					{
//						//事故发生的区域、地点或装置的名称
//						title: "事故发生的区域、地点或装置的名称",
//						fieldName: "accidentScene",
//						keywordFilterName: "criteria.strValue.keyWordValue_accidentScene"
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
		name:"emersceneSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});