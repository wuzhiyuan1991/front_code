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
	                url: "svrandomcheckrecord/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//内容
						title: "内容",
						fieldName: "content",
						keywordFilterName: "criteria.strValue.keyWordValue_content",
					},
					{
						//来源 0:手机检查,1:web录入,2:其他
						title: "来源",
						fieldName: "checkSource",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("icpe_sv_random_check_record_check_source"),
						render: function (data) {
							return LIB.getDataDic("icpe_sv_random_check_record_check_source", data.checkSource);
						},
						keywordFilterName: "criteria.strValue.keyWordValue_checkSource",
					},
					{
						title: "检查依据",
						fieldName: "legalRegulation.name",
						keywordFilterName: "criteria.strValue.keyWordValue_legalRegulation_name"
					},
					{
						title: "安全监督随机检查表",
						fieldName: "svRandomCheckTable.name",
						keywordFilterName: "criteria.strValue.keyWordValue_svRandomCheckTable_name"
					},
					{
						title: "执行人",
						fieldName: "checker.name",
						keywordFilterName: "criteria.strValue.keyWordValue_checker_name"
					},
//					{
//						//状态 1:待审核,2:已转隐患,3:被否决
//						title: "状态",
//						fieldName: "status",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("icpe_sv_random_check_record_status"),
//						render: function (data) {
//							return LIB.getDataDic("icpe_sv_random_check_record_status", data.status);
//						}
//						keywordFilterName: "criteria.strValue.keyWordValue_status",
//					},
//					 LIB.tableMgr.ksColumn.company,
//					 LIB.tableMgr.ksColumn.dept,
////					{
//						//审核时间
//						title: "审核时间",
//						fieldName: "auditDate",
//						keywordFilterName: "criteria.strValue.keyWordValue_auditDate",
//					},
//					{
//						//检查时间
//						title: "检查时间",
//						fieldName: "checkDate",
//						keywordFilterName: "criteria.strValue.keyWordValue_checkDate",
//					},
//					{
//						//关闭时间
//						title: "关闭时间",
//						fieldName: "closeDate",
//						keywordFilterName: "criteria.strValue.keyWordValue_closeDate",
//					},
//					{
//						//附件类型 文字:1006,图片:1007,视频:1008
//						title: "附件类型",
//						fieldName: "contentType",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("icpe_sv_random_check_record_content_type"),
//						render: function (data) {
//							return LIB.getDataDic("icpe_sv_random_check_record_content_type", data.contentType);
//						}
//						keywordFilterName: "criteria.strValue.keyWordValue_contentType",
//					},
//					{
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
		name:"svRandomCheckRecordSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});