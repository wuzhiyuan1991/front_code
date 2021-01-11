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
	                url: "richeckresult/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//巡检结果名称
						title: "巡检结果名称",
						fieldName: "name",
						keywordFilterName: "criteria.strValue.keyWordValue_name",
					},
					{
						//是否正确 0:错误,1:正确
						title: "是否正确",
						fieldName: "isRight",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iri_check_result_is_right"),
						render: function (data) {
							return LIB.getDataDic("iri_check_result_is_right", data.isRight);
						},
						keywordFilterName: "criteria.strValue.keyWordValue_isRight"
					},
//					{
//						//是否默认选项 0:否,1:是
//						title: "是否默认选项",
//						fieldName: "isDefault",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iri_check_result_is_default"),
//						render: function (data) {
//							return LIB.getDataDic("iri_check_result_is_default", data.isDefault);
//						}
//						keywordFilterName: "criteria.strValue.keyWordValue_isDefault",
//					},
//					{
//						//序号
//						title: "序号",
//						fieldName: "orderNo",
//						keywordFilterName: "criteria.strValue.keyWordValue_orderNo",
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
		name:"riCheckResultSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});