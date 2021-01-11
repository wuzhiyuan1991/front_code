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
	                url: "emerresource/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					{
						//名称
						title: "名称",
						fieldName: "name",
						keywordFilterName: "criteria.strValue.keyWordValue_name"
					},
//					{
//						//存储地点
//						title: "存储地点",
//						fieldName: "location",
//						keywordFilterName: "criteria.strValue.keyWordValue_location"
//					},
					{
						//数量
						title: "数量",
						fieldName: "quantity",
						keywordFilterName: "criteria.strValue.keyWordValue_quantity"
					},
					{
						//单位
						title: "单位",
						fieldName: "unit",
						keywordFilterName: "criteria.strValue.keyWordValue_unit"
					},

					{
						//分类 1:作业场所配备,2:个人防护装备,3:救援车辆配备,4:救援物资配备
						title: "资源分类",
						fieldName: "type",
						fieldType: "custom",
						render: function (data) {
							return LIB.getDataDic("iem_emer_resource_type", data.type);
						},
						keywordFilterName: "criteria.strValue.keyWordValue_type"
					},
					{
						title: "属地",
						fieldName: "dominationArea.name",
					},
					{
						//状态 0:在用,1:停用,2:报废
						title: "状态",
						fieldName: "status",
						fieldType: "custom",
						render: function (data) {
							return LIB.getDataDic("iem_emer_resource_status", data.status);
						},
						keywordFilterName: "criteria.strValue.keyWordValue_status"
					},
//					{
//						//联系电话
//						title: "联系电话",
//						fieldName: "contactNumber",
//						keywordFilterName: "criteria.strValue.keyWordValue_contactNumber"
//					},
//					{
//						//
//						title: "",
//						fieldName: "remark",
//						keywordFilterName: "criteria.strValue.keyWordValue_remark"
//					},
//					{
//						//技术要求或功能要求
//						title: "技术要求或功能要求",
//						fieldName: "reqirement",
//						keywordFilterName: "criteria.strValue.keyWordValue_reqirement"
//					},
//					{
//						//抢险救援物资种类 1:侦检,2:警戒,3:灭火,4:通信,5:救生,6:破拆,7:堵漏,8:输转,9:洗消,10:排烟,11:照明,12:其他
//						title: "抢险救援物资种类",
//						fieldName: "rescueSupplyCategory",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iem_emer_resource_rescue_supply_category"),
//						render: function (data) {
//							return LIB.getDataDic("iem_emer_resource_rescue_supply_category", data.rescueSupplyCategory);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_rescueSupplyCategory"
//					},
//					{
//						//抢险救援车辆种类 1:灭火抢险救援车,2:举高抢险救援车,3:专勤抢险救援车,4:后勤抢险救援车
//						title: "抢险救援车辆种类",
//						fieldName: "rescueVehicleCategory",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iem_emer_resource_rescue_vehicle_category"),
//						render: function (data) {
//							return LIB.getDataDic("iem_emer_resource_rescue_vehicle_category", data.rescueVehicleCategory);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_rescueVehicleCategory"
//					},
//					{
//						//规格型号
//						title: "规格型号",
//						fieldName: "specification",
//						keywordFilterName: "criteria.strValue.keyWordValue_specification"
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
		name:"emerresourceSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});