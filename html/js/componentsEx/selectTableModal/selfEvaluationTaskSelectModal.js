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
						//状态 0:未提交,1:已提交
						title: "状态",
						fieldName: "status",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iem_self_evaluation_task_status"),
						render: function (data) {
							return LIB.getDataDic("iem_self_evaluation_task_status", data.status);
						},
						keywordFilterName: "criteria.strValue.keyWordValue_status"
					},
					 LIB.tableMgr.ksColumn.company,
//					 LIB.tableMgr.ksColumn.dept,
					{
						title: "自评人",
						fieldName: "user.name",
						keywordFilterName: "criteria.strValue.keyWordValue_user_name"
					},
					{
						title: "演练方案",
						fieldName: "exerciseScheme.name",
						keywordFilterName: "criteria.strValue.keyWordValue_exerciseScheme_name"
					},
//					{
//						//提交时间
//						title: "提交时间",
//						fieldName: "submitTime",
//						keywordFilterName: "criteria.strValue.keyWordValue_submitTime"
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
		name:"selfevaluationtaskSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});