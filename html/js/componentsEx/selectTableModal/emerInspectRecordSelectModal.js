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
						//检验检测量
						title: "检验检测量",
						fieldName: "inspectQuantity",
						keywordFilterName: "criteria.strValue.keyWordValue_inspectQuantity"
					},
					{
						//检验/检测内容
						title: "检验/检测内容",
						fieldName: "inspectionContent",
						keywordFilterName: "criteria.strValue.keyWordValue_inspectionContent"
					},
					{
						title: "应急物资",
						fieldName: "emerResource.name",
						keywordFilterName: "criteria.strValue.keyWordValue_emerResource_name"
					},
//					{
//						//检验/检测机构
//						title: "检验/检测机构",
//						fieldName: "inspectOrgan",
//						keywordFilterName: "criteria.strValue.keyWordValue_inspectOrgan"
//					},
//					{
//						//检验检测时间
//						title: "检验检测时间",
//						fieldName: "inspectTime",
//						keywordFilterName: "criteria.strValue.keyWordValue_inspectTime"
//					},
//					{
//						//检验/检测人员
//						title: "检验/检测人员",
//						fieldName: "inspectors",
//						keywordFilterName: "criteria.strValue.keyWordValue_inspectors"
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
		name:"emerinspectrecordSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});