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
	                url: "position/list{/curPage}{/pageSize}?disable=0",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//岗位名称
						title: "岗位名称",
						fieldName: "name",
						keywordFilterName: "criteria.strValue.keyWordValue_name"
					},
					 LIB.tableMgr.ksColumn.company,
					 LIB.tableMgr.ksColumn.dept,
// 					{
// 						title: "应急组别",
// 						fieldName: "emerGroup.name",
// 						keywordFilterName: "criteria.strValue.keyWordValue_emerGroup_name"
// 					},
//					{
//						//安全角色类别 1:应急管理
//						title: "安全角色类别",
//						fieldName: "hseType",
//						keywordFilterName: "criteria.strValue.keyWordValue_hseType"
//					},
//					{
//						//是否是领导岗位 0:否,1:是
//						title: "是否是领导岗位",
//						fieldName: "isLead",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("system_position_is_lead"),
//						render: function (data) {
//							return LIB.getDataDic("system_position_is_lead", data.isLead);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_isLead"
//					},
//					{
//						//岗位类型 0:普通岗位,1:安全角色
//						title: "岗位类型",
//						fieldName: "postType",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("system_position_post_type"),
//						render: function (data) {
//							return LIB.getDataDic("system_position_post_type", data.postType);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_postType"
//					},
					{
						//备注
						title: "备注",
						fieldName: "remarks",
						keywordFilterName: "criteria.strValue.keyWordValue_remarks"
					},
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
		name:"emerpositionSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});