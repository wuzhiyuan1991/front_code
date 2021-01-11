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
						//维护/保养数量
						title: "维护/保养数量",
						fieldName: "maintQuantity",
						keywordFilterName: "criteria.strValue.keyWordValue_maintQuantity"
					},
					{
						//作业类别 1:内部,2:外部
						title: "作业类别",
						fieldName: "operationType",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iem_maint_record_operation_type"),
						render: function (data) {
							return LIB.getDataDic("iem_maint_record_operation_type", data.operationType);
						},
						keywordFilterName: "criteria.strValue.keyWordValue_operationType"
					},
					{
						title: "应急物资",
						fieldName: "emerResource.name",
						keywordFilterName: "criteria.strValue.keyWordValue_emerResource_name"
					},
//					{
//						//操作内容
//						title: "操作内容",
//						fieldName: "operationContent",
//						keywordFilterName: "criteria.strValue.keyWordValue_operationContent"
//					},
//					{
//						//类别 1:检修抢修,2:维护保养
//						title: "类别",
//						fieldName: "type",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iem_maint_record_type"),
//						render: function (data) {
//							return LIB.getDataDic("iem_maint_record_type", data.type);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_type"
//					},
//					{
//						//维护/保养时间
//						title: "维护/保养时间",
//						fieldName: "maintTime",
//						keywordFilterName: "criteria.strValue.keyWordValue_maintTime"
//					},
//					{
//						//作业操作人员
//						title: "作业操作人员",
//						fieldName: "operators",
//						keywordFilterName: "criteria.strValue.keyWordValue_operators"
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
		name:"emermaintrecordSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});