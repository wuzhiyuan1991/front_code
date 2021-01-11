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
	                url: "oprecord/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//作业开始时间
						title: "作业开始时间",
						fieldName: "startTime",
						keywordFilterName: "criteria.strValue.keyWordValue_startTime",
					},
					 LIB.tableMgr.ksColumn.company,
//					 LIB.tableMgr.ksColumn.dept,
					{
						title: "卡票",
						fieldName: "opCard.name",
						keywordFilterName: "criteria.strValue.keyWordValue_opCard_name"
					},
//					{
//						//作业结束时间
//						title: "作业结束时间",
//						fieldName: "endTime",
//						keywordFilterName: "criteria.strValue.keyWordValue_endTime",
//					},
//					{
//						//记录类型 1:操作票作业记录,2:维检修作业记录
//						title: "记录类型",
//						fieldName: "type",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("jse_op_record_type"),
//						render: function (data) {
//							return LIB.getDataDic("jse_op_record_type", data.type);
//						}
//						keywordFilterName: "criteria.strValue.keyWordValue_type",
//					},
//					{
//						//作业全部设备号
//						title: "作业全部设备号",
//						fieldName: "equipNos",
//						keywordFilterName: "criteria.strValue.keyWordValue_equipNos",
//					},
//					{
//						//操作地点
//						title: "操作地点",
//						fieldName: "site",
//						keywordFilterName: "criteria.strValue.keyWordValue_site",
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
		name:"opRecordSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});