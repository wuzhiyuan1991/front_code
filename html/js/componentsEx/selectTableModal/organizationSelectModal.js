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
	                url: "organization/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//机构名称
						title: "机构名称",
						fieldName: "name",
						keywordFilterName: "criteria.strValue.keyWordValue_name"
					},
					 LIB.tableMgr.ksColumn.company,
//					 LIB.tableMgr.ksColumn.dept,
//					{
//						//公司地址
//						title: "公司地址",
//						fieldName: "address",
//						keywordFilterName: "criteria.strValue.keyWordValue_address"
//					},
//					{
//						//经纬度
//						title: "经纬度",
//						fieldName: "coordinate",
//						keywordFilterName: "criteria.strValue.keyWordValue_coordinate"
//					},
//					{
//						//机构等级
//						title: "机构等级",
//						fieldName: "level",
//						keywordFilterName: "criteria.strValue.keyWordValue_level"
//					},
//					{
//						//机构电话
//						title: "机构电话",
//						fieldName: "phone",
//						keywordFilterName: "criteria.strValue.keyWordValue_phone"
//					},
//					{
//						//备注
//						title: "备注",
//						fieldName: "remarks",
//						keywordFilterName: "criteria.strValue.keyWordValue_remarks"
//					},
//					{
//						//机构类型 1:机构,2:部门
//						title: "机构类型",
//						fieldName: "type",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("system_organization_type"),
//						render: function (data) {
//							return LIB.getDataDic("system_organization_type", data.type);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_type"
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
		name:"organizationSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});