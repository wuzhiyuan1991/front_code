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
	                url: "riskidentificontmeasures/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 // LIB.tableMgr.ksColumn.code,
					{
						//措施
						title: "控制措施",
						fieldName: "name",
						keywordFilterName: "criteria.strValue.keyWordValue_name"
					},
					// {
					// 	title: "危害辨识",
					// 	fieldName: "riskIdentification.name",
					// 	keywordFilterName: "criteria.strValue.keyWordValue_riskIdentification_name"
					// },
//					{
//						//措施类型 1:技术措施,2:管理措施
//						title: "措施类型",
//						fieldName: "type",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("ira_risk_identi_controlmeasures_type"),
//						render: function (data) {
//							return LIB.getDataDic("ira_risk_identi_controlmeasures_type", data.type);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_type"
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
		name:"riskidentificontmeasuresSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});