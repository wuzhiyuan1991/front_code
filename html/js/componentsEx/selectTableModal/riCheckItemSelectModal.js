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
	                url: "richeckitem/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//巡检项名称
						title: "巡检项名称",
						fieldName: "name",
						keywordFilterName: "criteria.strValue.keyWordValue_name",
					},
					{
						//巡检依据
						title: "巡检依据",
						fieldName: "checkBasis",
						keywordFilterName: "criteria.strValue.keyWordValue_checkBasis",
					},
					{
						title: "巡检项参数",
						fieldName: "riCheckItemParam.name",
						keywordFilterName: "criteria.strValue.keyWordValue_riCheckItemParam_name"
					},
//					{
//						//巡检内容
//						title: "巡检内容",
//						fieldName: "content",
//						keywordFilterName: "criteria.strValue.keyWordValue_content",
//					},
//					{
//						//适用设备状态 1:在用,2:备用,3:维修
//						title: "适用设备状态",
//						fieldName: "equipmentStatus",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iri_check_item_equipment_status"),
//						render: function (data) {
//							return LIB.getDataDic("iri_check_item_equipment_status", data.equipmentStatus);
//						}
//						keywordFilterName: "criteria.strValue.keyWordValue_equipmentStatus",
//					},
//					{
//						//是否读取现场参数值 0:不需要,1:需要
//						title: "是否读取现场参数值",
//						fieldName: "isMeterReadingNeeded",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iri_check_item_is_meter_reading_needed"),
//						render: function (data) {
//							return LIB.getDataDic("iri_check_item_is_meter_reading_needed", data.isMeterReadingNeeded);
//						}
//						keywordFilterName: "criteria.strValue.keyWordValue_isMeterReadingNeeded",
//					},
//					{
//						//关联类型 1:自身,2:设备设施
//						title: "关联类型",
//						fieldName: "refType",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iri_check_item_ref_type"),
//						render: function (data) {
//							return LIB.getDataDic("iri_check_item_ref_type", data.refType);
//						}
//						keywordFilterName: "criteria.strValue.keyWordValue_refType",
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
		name:"riCheckItemSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});