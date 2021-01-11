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
	                url: "opmaintstepitem/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//序号
						title: "序号",
						fieldName: "orderNo",
						keywordFilterName: "criteria.strValue.keyWordValue_orderNo",
					},
					{
						//操作内容
						title: "操作内容",
						fieldName: "content",
						keywordFilterName: "criteria.strValue.keyWordValue_content",
					},
					{
						title: "维检修工序",
						fieldName: "opMaintStep.name",
						keywordFilterName: "criteria.strValue.keyWordValue_opMaintStep_name"
					},
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
		name:"opMaintStepItemSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});