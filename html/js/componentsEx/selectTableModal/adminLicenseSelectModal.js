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
	                url: "adminlicense/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//许可名称
						title: "许可名称",
						fieldName: "name",
						keywordFilterName: "criteria.strValue.keyWordValue_name"
					},
					 LIB.tableMgr.ksColumn.company,
//					 LIB.tableMgr.ksColumn.dept,
//					{
//						//许可（适用）对象
//						title: "许可（适用）对象",
//						fieldName: "applicable",
//						keywordFilterName: "criteria.strValue.keyWordValue_applicable"
//					},
//					{
//						//许可证件 1:许可证/执照,2:资格证/资质证,3:批准文件/证明文件,10:其它行政许可证件
//						title: "许可证件",
//						fieldName: "cert",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("icm_admin_lic_cert"),
//						render: function (data) {
//							return LIB.getDataDic("icm_admin_lic_cert", data.cert);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_cert"
//					},
//					{
//						//许可内容
//						title: "许可内容",
//						fieldName: "content",
//						keywordFilterName: "criteria.strValue.keyWordValue_content"
//					},
//					{
//						//许可截止日期
//						title: "许可截止日期",
//						fieldName: "endDate",
//						keywordFilterName: "criteria.strValue.keyWordValue_endDate"
//					},
//					{
//						//许可机关
//						title: "许可机关",
//						fieldName: "government",
//						keywordFilterName: "criteria.strValue.keyWordValue_government"
//					},
//					{
//						//许可文号
//						title: "许可文号",
//						fieldName: "number",
//						keywordFilterName: "criteria.strValue.keyWordValue_number"
//					},
//					{
//						//许可决定日期
//						title: "许可决定日期",
//						fieldName: "startDate",
//						keywordFilterName: "criteria.strValue.keyWordValue_startDate"
//					},
//					{
//						//状态 1:初次申请,2:变更申请,3:延续申请,4:审查,5:批复,6:修订,7:废弃,10:其他
//						title: "状态",
//						fieldName: "status",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("icm_admin_lic_status"),
//						render: function (data) {
//							return LIB.getDataDic("icm_admin_lic_status", data.status);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_status"
//					},
//					{
//						//类别 1:普通,2:特许,3:认可,4:核准,5:登记,10:其他
//						title: "类别",
//						fieldName: "type",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("icm_admin_lic_type"),
//						render: function (data) {
//							return LIB.getDataDic("icm_admin_lic_type", data.type);
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
		name:"adminlicenseSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});