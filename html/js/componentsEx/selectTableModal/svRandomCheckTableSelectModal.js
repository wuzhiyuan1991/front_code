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
	                url: "svrandomchecktable/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//记录表名
						title: "记录表名",
						fieldName: "name",
						keywordFilterName: "criteria.strValue.keyWordValue_name",
					},
					{
						//内容
						title: "内容",
						fieldName: "content",
						keywordFilterName: "criteria.strValue.keyWordValue_content",
					},
//					{
//						//来源 0:手机检查,1:web录入,2 其他
//						title: "来源",
//						fieldName: "checkSource",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("icpe_sv_random_check_table_check_source"),
//						render: function (data) {
//							return LIB.getDataDic("icpe_sv_random_check_table_check_source", data.checkSource);
//						}
//						keywordFilterName: "criteria.strValue.keyWordValue_checkSource",
//					},
//					{
//						//状态 1:待审核,2:已转隐患,3:被否决
//						title: "状态",
//						fieldName: "status",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("icpe_sv_random_check_table_status"),
//						render: function (data) {
//							return LIB.getDataDic("icpe_sv_random_check_table_status", data.status);
//						}
//						keywordFilterName: "criteria.strValue.keyWordValue_status",
//					},
//					 LIB.tableMgr.ksColumn.company,
//					 LIB.tableMgr.ksColumn.dept,
////					{
//						//备注
//						title: "备注",
//						fieldName: "remarks",
//						keywordFilterName: "criteria.strValue.keyWordValue_remarks",
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
		name:"svRandomCheckTableSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});