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
	                url: "ptwworkhistory/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//操作类型 1:作业预约,2:作业审核,3:填写作业票,4:能量隔离,5:作业前气体检测,6:措施落实,7:作业会签,8:安全教育,9:作业中气体检测,10:作业监控,11:能量隔离解除,12:作业关闭
						title: "操作类型",
						fieldName: "operationType",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iptw_work_history_operation_type"),
						render: function (data) {
							return LIB.getDataDic("iptw_work_history_operation_type", data.operationType);
						},
						keywordFilterName: "criteria.strValue.keyWordValue_operationType"
					},
					{
						//操作时间
						title: "操作时间",
						fieldName: "operateTime",
						keywordFilterName: "criteria.strValue.keyWordValue_operateTime"
					},
					{
						title: "操作人",
						fieldName: "operator.name",
						keywordFilterName: "criteria.strValue.keyWordValue_operator_name"
					},
					{
						title: "作业票",
						fieldName: "workCard.name",
						keywordFilterName: "criteria.strValue.keyWordValue_workCard_name"
					},
//					{
//						//操作时作业状态  1:作业预约,2:作业评审,3:填报作业票,4:现场落实,5:作业会签,6:作业批准,7:作业监测,8:待关闭,9:作业取消,10:作业完成,11:已否决
//						title: "操作时作业状态",
//						fieldName: "workStatus",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_work_status"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_work_status", data.workStatus);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_workStatus"
//					},
//					{
//						//隔离类型 1:工艺隔离,2:机械隔离,3:电气隔离,4:系统屏蔽
//						title: "隔离类型",
//						fieldName: "isolationType",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_work_history_isolation_type"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_work_history_isolation_type", data.isolationType);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_isolationType"
//					},
//					{
//						//作业结果 1:作业取消,2:作业完成,3:作业续签
//						title: "作业结果",
//						fieldName: "resultType",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_work_history_result_type"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_work_history_result_type", data.resultType);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_resultType"
//					},
//					{
//						//会签类型 1:作业申请人,2:作业负责人,3:作业监护人,4:生产单位现场负责人,5:主管部门负责人,6:安全部门负责人,7:相关方负责人,8:许可批准人
//						title: "会签类型",
//						fieldName: "signType",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_work_history_sign_type"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_work_history_sign_type", data.signType);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_signType"
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
		name:"ptwworkhistorySelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});