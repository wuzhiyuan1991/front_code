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
	                url: "ptwjsamaster/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
						(function () {
							var obj = _.cloneDeep(LIB.tableMgr.ksColumn.code);
							obj.width = 130;
							return obj;
                        })(),

						{
							title: "名称",
							fieldName: "name",
							width:170,
                            keywordFilterName: "criteria.strValue.keyWordValue_name"

                        },
					{
						//分析小组组长
						title: "作业单位",
						fieldName: "constructionOrgName",
                        width:170,
                        keywordFilterName: "criteria.strValue.keyWordValue_constructionOrgName"

                    },
					{
						//作业内容
						title: "作业内容",
						fieldName: "taskContent",
						keywordFilterName: "criteria.strValue.keyWordValue_taskContent",
						width:300
					},
//					{
//						//作业日期
//						title: "作业日期",
//						fieldName: "workDate",
//						keywordFilterName: "criteria.strValue.keyWordValue_workDate"
//					},
//					{
//						//分析人员，可以以逗号或者是其他字符分割
//						title: "分析人员，可以以逗号或者是其他字符分割",
//						fieldName: "analysePerson",
//						keywordFilterName: "criteria.strValue.keyWordValue_analysePerson"
//					},
//					 LIB.tableMgr.ksColumn.company,
//					 LIB.tableMgr.ksColumn.dept,
////					{
//						//施工单位，可手填
//						title: "施工单位，可手填",
//						fieldName: "construction",
//						keywordFilterName: "criteria.strValue.keyWordValue_construction"
//					},
//					{
//						//是否有特种作业人员资质证明 0:否,1:是
//						title: "是否有特种作业人员资质证明",
//						fieldName: "hasQualification",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_jsa_master_has_qualification"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_jsa_master_has_qualification", data.hasQualification);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_hasQualification"
//					},
//					{
//						//是否有相关操作规程 0:否,1:是
//						title: "是否有相关操作规程",
//						fieldName: "hasSpecification",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_jsa_master_has_specification"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_jsa_master_has_specification", data.hasSpecification);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_hasSpecification"
//					},
//					{
//						//是否承包商作业 0:否,1:是
//						title: "是否承包商作业",
//						fieldName: "isContractor",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_jsa_master_is_contractor"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_jsa_master_is_contractor", data.isContractor);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_isContractor"
//					},
//					{
//						//是否为交叉作业 0:否,1:是
//						title: "是否为交叉作业",
//						fieldName: "isCrossOperat",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_jsa_master_is_cross_operat"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_jsa_master_is_cross_operat", data.isCrossOperat);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_isCrossOperat"
//					},
//					{
//						//是否为新的工作任务 0:已做过的任务,1:新任务
//						title: "是否为新的工作任务",
//						fieldName: "isNewTask",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_jsa_master_is_new_task"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_jsa_master_is_new_task", data.isNewTask);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_isNewTask"
//					},
//					{
//						//是否需要许可证 0:否,1:是
//						title: "是否需要许可证",
//						fieldName: "isPermitRequired",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_jsa_master_is_permit_required"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_jsa_master_is_permit_required", data.isPermitRequired);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_isPermitRequired"
//					},
//					{
//						//是否分享 0:未分享,1:已分享
//						title: "是否分享",
//						fieldName: "isShare",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_jsa_master_is_share"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_jsa_master_is_share", data.isShare);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_isShare"
//					},
//					{
//						//是否提交 0:未提交,1:已提交
//						title: "是否提交",
//						fieldName: "isSubmit",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_jsa_master_is_submit"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_jsa_master_is_submit", data.isSubmit);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_isSubmit"
//					},
//					{
//						//关联的档案类型
//						title: "关联的档案类型",
//						fieldName: "relType",
//						keywordFilterName: "criteria.strValue.keyWordValue_relType"
//					},
//					{
//						//备注
//						title: "备注",
//						fieldName: "remark",
//						keywordFilterName: "criteria.strValue.keyWordValue_remark"
//					},
//					{
//						//许可证编号
//						title: "许可证编号",
//						fieldName: "taskLicense",
//						keywordFilterName: "criteria.strValue.keyWordValue_taskLicense"
//					},
//					 LIB.tableMgr.ksColumn.modifyDate,
////					 LIB.tableMgr.ksColumn.createDate,
//
	                ],

	                defaultFilterValue : {
	                	"criteria.orderValue" : {fieldName : "modifyDate", orderType : "1"},
						"isSubmit" : 1
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
		name:"ptwjsamasterSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});