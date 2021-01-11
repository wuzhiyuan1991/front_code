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
	                url: "cert/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//证书状态 0:无证,1:有效,2:失效
						title: "证书状态",
						fieldName: "status",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("itm_cert_status"),
						render: function (data) {
							return LIB.getDataDic("itm_cert_status", data.status);
						},
						keywordFilterName: "criteria.strValue.keyWordValue_status"
					},
					 LIB.tableMgr.ksColumn.company,
//					 LIB.tableMgr.ksColumn.dept,
					{
						title: "持有人",
						fieldName: "user.name",
						keywordFilterName: "criteria.strValue.keyWordValue_user_name"
					},
					{
						title: "关联课程",
						fieldName: "course.name",
						keywordFilterName: "criteria.strValue.keyWordValue_course_name"
					},
					{
						title: "证书类型",
						fieldName: "certType.name",
						keywordFilterName: "criteria.strValue.keyWordValue_certType_name"
					},
//					{
//						//发证机构
//						title: "发证机构",
//						fieldName: "certifyingAuthority",
//						keywordFilterName: "criteria.strValue.keyWordValue_certifyingAuthority"
//					},
//					{
//						//生效日期
//						title: "生效日期",
//						fieldName: "effectiveDate",
//						keywordFilterName: "criteria.strValue.keyWordValue_effectiveDate"
//					},
//					{
//						//失效日期
//						title: "失效日期",
//						fieldName: "expiryDate",
//						keywordFilterName: "criteria.strValue.keyWordValue_expiryDate"
//					},
//					{
//						//证件编号
//						title: "证件编号",
//						fieldName: "idNumber",
//						keywordFilterName: "criteria.strValue.keyWordValue_idNumber"
//					},
//					{
//						//是否需要复审 0:不要,1:需要
//						title: "是否需要复审",
//						fieldName: "isRecheckRequired",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("itm_cert_is_recheck_required"),
//						render: function (data) {
//							return LIB.getDataDic("itm_cert_is_recheck_required", data.isRecheckRequired);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_isRecheckRequired"
//					},
//					{
//						//领证日期
//						title: "领证日期",
//						fieldName: "issueDate",
//						keywordFilterName: "criteria.strValue.keyWordValue_issueDate"
//					},
//					{
//						//作业类别
//						title: "作业类别",
//						fieldName: "jobClass",
//						keywordFilterName: "criteria.strValue.keyWordValue_jobClass"
//					},
//					{
//						//操作项目
//						title: "操作项目",
//						fieldName: "jobContent",
//						keywordFilterName: "criteria.strValue.keyWordValue_jobContent"
//					},
//					{
//						//提前提醒复审的月数
//						title: "提前提醒复审的月数",
//						fieldName: "noticeMonthsInAdvance",
//						keywordFilterName: "criteria.strValue.keyWordValue_noticeMonthsInAdvance"
//					},
//					{
//						//复审周期（月）
//						title: "复审周期（月）",
//						fieldName: "retrialCycle",
//						keywordFilterName: "criteria.strValue.keyWordValue_retrialCycle"
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
		name:"certSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});