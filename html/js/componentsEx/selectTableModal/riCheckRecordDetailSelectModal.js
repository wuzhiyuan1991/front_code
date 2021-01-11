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
	                url: "richeckrecorddetail/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//抄数
						title: "抄数",
						fieldName: "checkParamResult",
						keywordFilterName: "criteria.strValue.keyWordValue_checkParamResult",
					},
					{
						//检查结果 0:不合格,1:合格,2:不涉及
						title: "检查结果",
						fieldName: "checkResult",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iri_check_record_detail_check_result"),
						render: function (data) {
							return LIB.getDataDic("iri_check_record_detail_check_result", data.checkResult);
						},
						keywordFilterName: "criteria.strValue.keyWordValue_checkResult"
					},
					{
						title: "巡检记录",
						fieldName: "riCheckRecord.name",
						keywordFilterName: "criteria.strValue.keyWordValue_riCheckRecord_name"
					},
//					{
//						//是否现场立即整改 0否,1是
//						title: "是否现场立即整改",
//						fieldName: "isRectification",
//						keywordFilterName: "criteria.strValue.keyWordValue_isRectification",
//					},
//					{
//						//是否被分享 0:未分享,1:已分享
//						title: "是否被分享",
//						fieldName: "isShared",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iri_check_record_detail_is_shared"),
//						render: function (data) {
//							return LIB.getDataDic("iri_check_record_detail_is_shared", data.isShared);
//						}
//						keywordFilterName: "criteria.strValue.keyWordValue_isShared",
//					},
//					{
//						//项排序
//						title: "项排序",
//						fieldName: "itemOrderNo",
//						keywordFilterName: "criteria.strValue.keyWordValue_itemOrderNo",
//					},
//					{
//						//潜在危害
//						title: "潜在危害",
//						fieldName: "latentDefect",
//						keywordFilterName: "criteria.strValue.keyWordValue_latentDefect",
//					},
//					{
//						//问题描述
//						title: "问题描述",
//						fieldName: "problem",
//						keywordFilterName: "criteria.strValue.keyWordValue_problem",
//					},
//					{
//						//是否立即整改 0-是,1-否
//						title: "是否立即整改",
//						fieldName: "reformType",
//						keywordFilterName: "criteria.strValue.keyWordValue_reformType",
//					},
//					{
//						//备注(临时控制措施)
//						title: "备注(临时控制措施)",
//						fieldName: "remark",
//						keywordFilterName: "criteria.strValue.keyWordValue_remark",
//					},
//					{
//						//分享范围
//						title: "分享范围",
//						fieldName: "shareScope",
//						keywordFilterName: "criteria.strValue.keyWordValue_shareScope",
//					},
//					{
//						//分享类型 文字:1006,图片:1007,视频:1008
//						title: "分享类型",
//						fieldName: "shareType",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iri_check_record_detail_share_type"),
//						render: function (data) {
//							return LIB.getDataDic("iri_check_record_detail_share_type", data.shareType);
//						}
//						keywordFilterName: "criteria.strValue.keyWordValue_shareType",
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
		name:"riCheckRecordDetailSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});