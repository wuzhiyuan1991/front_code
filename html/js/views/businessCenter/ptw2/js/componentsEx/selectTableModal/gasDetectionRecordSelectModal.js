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
	                url: "gasdetectionrecord/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//检测地点
						title: "检测地点",
						fieldName: "detectSite",
						keywordFilterName: "criteria.strValue.keyWordValue_detectSite"
					},
					{
						//检测时间
						title: "检测时间",
						fieldName: "detectTime",
						keywordFilterName: "criteria.strValue.keyWordValue_detectTime"
					},
					{
						title: "签名",
						fieldName: "cloudFile.name",
						keywordFilterName: "criteria.strValue.keyWordValue_cloudFile_name"
					},
					{
						title: "作业许可",
						fieldName: "workPermit.name",
						keywordFilterName: "criteria.strValue.keyWordValue_workPermit_name"
					},
//					{
//						//检测类型 1:作业前,2:作业中
//						title: "检测类型",
//						fieldName: "type",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_gas_detection_record_type"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_gas_detection_record_type", data.type);
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
		name:"gasdetectionrecordSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});