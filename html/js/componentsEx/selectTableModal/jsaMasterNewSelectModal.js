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
	                url: "jsamasternew/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//分析人员，可以以逗号或者是其他字符分割
						title: "分析人员，可以以逗号或者是其他字符分割",
						fieldName: "analysePerson",
						keywordFilterName: "criteria.strValue.keyWordValue_analysePerson",
					},
					{
						//作业日期
						title: "作业日期",
						fieldName: "workDate",
						keywordFilterName: "criteria.strValue.keyWordValue_workDate",
					},
					{
						title: "票卡",
						fieldName: "opCard.name",
						keywordFilterName: "criteria.strValue.keyWordValue_opCard_name"
					},
//					{
//						//分析小组组长
//						title: "分析小组组长",
//						fieldName: "analyseLeader",
//						keywordFilterName: "criteria.strValue.keyWordValue_analyseLeader",
//					},
//					{
//						//作业内容
//						title: "作业内容",
//						fieldName: "taskContent",
//						keywordFilterName: "criteria.strValue.keyWordValue_taskContent",
//					},
//					 LIB.tableMgr.ksColumn.company,
//					 LIB.tableMgr.ksColumn.dept,
////					{
//						//审核时间（已审核状态独有）
//						title: "审核时间（已审核状态独有）",
//						fieldName: "auditDate",
//						keywordFilterName: "criteria.strValue.keyWordValue_auditDate",
//					},
//					{
//						//专家点评
//						title: "专家点评",
//						fieldName: "commentExpert",
//						keywordFilterName: "criteria.strValue.keyWordValue_commentExpert",
//					},
//					{
//						//管理处点评
//						title: "管理处点评",
//						fieldName: "commentGlc",
//						keywordFilterName: "criteria.strValue.keyWordValue_commentGlc",
//					},
//					{
//						//公司点评
//						title: "公司点评",
//						fieldName: "commentGongsi",
//						keywordFilterName: "criteria.strValue.keyWordValue_commentGongsi",
//					},
//					{
//						//施工单位，可手填
//						title: "施工单位，可手填",
//						fieldName: "construction",
//						keywordFilterName: "criteria.strValue.keyWordValue_construction",
//					},
//					{
//						//是否承包商作业；0:否,1:是
//						title: "是否承包商作业；0:否,1:是",
//						fieldName: "contractor",
//						keywordFilterName: "criteria.strValue.keyWordValue_contractor",
//					},
//					{
//						//表明是否复制页面传来的数据，非空时为复制页面传来的值
//						title: "表明是否复制页面传来的数据，非空时为复制页面传来的值",
//						fieldName: "copy",
//						keywordFilterName: "criteria.strValue.keyWordValue_copy",
//					},
//					{
//						//是否为交叉作业
//						title: "是否为交叉作业",
//						fieldName: "crossTask",
//						keywordFilterName: "criteria.strValue.keyWordValue_crossTask",
//					},
//					{
//						//
//						title: "",
//						fieldName: "isflag",
//						keywordFilterName: "criteria.strValue.keyWordValue_isflag",
//					},
//					{
//						//步骤json
//						title: "步骤json",
//						fieldName: "jsonstr",
//						keywordFilterName: "criteria.strValue.keyWordValue_jsonstr",
//					},
//					{
//						//是否为新的工作任务 0--已做过的任务；  1--新任务
//						title: "是否为新的工作任务",
//						fieldName: "newTask",
//						keywordFilterName: "criteria.strValue.keyWordValue_newTask",
//					},
//					{
//						//是否需要许可证
//						title: "是否需要许可证",
//						fieldName: "permit",
//						keywordFilterName: "criteria.strValue.keyWordValue_permit",
//					},
//					{
//						//是否有特种作业人员资质证明
//						title: "是否有特种作业人员资质证明",
//						fieldName: "qualification",
//						keywordFilterName: "criteria.strValue.keyWordValue_qualification",
//					},
//					{
//						//是否参考库
//						title: "是否参考库",
//						fieldName: "reference",
//						keywordFilterName: "criteria.strValue.keyWordValue_reference",
//					},
//					{
//						//备注
//						title: "备注",
//						fieldName: "remark",
//						keywordFilterName: "criteria.strValue.keyWordValue_remark",
//					},
//					{
//						//步骤中最高风险级别的分值
//						title: "步骤中最高风险级别的分值",
//						fieldName: "riskScore",
//						keywordFilterName: "criteria.strValue.keyWordValue_riskScore",
//					},
//					{
//						//是否分享
//						title: "是否分享",
//						fieldName: "share",
//						keywordFilterName: "criteria.strValue.keyWordValue_share",
//					},
//					{
//						//是否有相关操作规程
//						title: "是否有相关操作规程",
//						fieldName: "specification",
//						keywordFilterName: "criteria.strValue.keyWordValue_specification",
//					},
//					{
//						//审核状态 0:待提交,1:待审核,2:已审核
//						title: "审核状态",
//						fieldName: "status",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("jsa_master_new_status"),
//						render: function (data) {
//							return LIB.getDataDic("jsa_master_new_status", data.status);
//						}
//						keywordFilterName: "criteria.strValue.keyWordValue_status",
//					},
//					{
//						//作业许可证号（如有）
//						title: "作业许可证号（如有）",
//						fieldName: "taskLicense",
//						keywordFilterName: "criteria.strValue.keyWordValue_taskLicense",
//					},
//					{
//						//提交类型
//						title: "提交类型",
//						fieldName: "updatetype",
//						keywordFilterName: "criteria.strValue.keyWordValue_updatetype",
//					},
//					{
//						//作业位置
//						title: "作业位置",
//						fieldName: "workPlace",
//						keywordFilterName: "criteria.strValue.keyWordValue_workPlace",
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
		name:"jsaMasterNewSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});