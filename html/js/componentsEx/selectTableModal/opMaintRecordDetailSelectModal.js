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
	                url: "opmaintrecorddetail/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//工序名称
						title: "工序名称",
						fieldName: "stepName",
						keywordFilterName: "criteria.strValue.keyWordValue_stepName",
					},
					{
						//设备号
						title: "设备号",
						fieldName: "equipNo",
						keywordFilterName: "criteria.strValue.keyWordValue_equipNo",
					},
					{
						title: "作业记录",
						fieldName: "opRecord.name",
						keywordFilterName: "criteria.strValue.keyWordValue_opRecord_name"
					},
//					{
//						//操作内容
//						title: "操作内容",
//						fieldName: "itemContent",
//						keywordFilterName: "criteria.strValue.keyWordValue_itemContent",
//					},
//					{
//						//工序明细序号
//						title: "工序明细序号",
//						fieldName: "itemOrderNo",
//						keywordFilterName: "criteria.strValue.keyWordValue_itemOrderNo",
//					},
//					{
//						//工序序号
//						title: "工序序号",
//						fieldName: "stepOrderNo",
//						keywordFilterName: "criteria.strValue.keyWordValue_stepOrderNo",
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
		name:"opMaintRecordDetailSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});