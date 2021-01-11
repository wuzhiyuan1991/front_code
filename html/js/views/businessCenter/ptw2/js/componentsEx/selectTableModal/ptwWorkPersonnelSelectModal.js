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
	                url: "ptwworkpersonnel/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//人员类型 1:作业申请人,2:作业负责人,3:作业监护人,4:生产单位现场负责人,5:主管部门负责人,6:安全部门负责人,7:相关方负责人,8:许可批准人,9:安全教育人,10:作业人员
						title: "人员类型",
						fieldName: "type",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iptw_work_personnel_type"),
						render: function (data) {
							return LIB.getDataDic("iptw_work_personnel_type", data.type);
						},
						keywordFilterName: "criteria.strValue.keyWordValue_type"
					},
					{
						//作业完成意见（限作业申请人）
						title: "作业完成意见（限作业申请人）",
						fieldName: "completionOpinion",
						keywordFilterName: "criteria.strValue.keyWordValue_completionOpinion"
					},
					{
						title: "作业许可",
						fieldName: "workPermit.name",
						keywordFilterName: "criteria.strValue.keyWordValue_workPermit_name"
					},
					{
						title: "人员",
						fieldName: "user.name",
						keywordFilterName: "criteria.strValue.keyWordValue_user_name"
					},
//					{
//						//会签意见
//						title: "会签意见",
//						fieldName: "signOpinion",
//						keywordFilterName: "criteria.strValue.keyWordValue_signOpinion"
//					},
//					{
//						//会签结果 1:通过,2:否决
//						title: "会签结果",
//						fieldName: "signResult",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_work_personnel_sign_result"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_work_personnel_sign_result", data.signResult);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_signResult"
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
		name:"ptwworkpersonnelSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});