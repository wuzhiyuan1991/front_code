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
	                url: "tpaequipment/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [{
	                    title: "",
	                    fieldName: "id",
	                    fieldType: "cb",
	                }, 
					{
						//设备编号
						title: "设备编号",
						fieldName: "code",
					},
					{
						//设备设施名称
						title: "设备设施名称",
						fieldName: "name",
					},
					 LIB.tableMgr.column.company,
//					 LIB.tableMgr.column.company,
////					{
//						//是否禁用 0启用，1禁用
//						title: "是否禁用",
//						fieldName: "disable",
//					},
//					{
//						//报废日期
//						title: "报废日期",
//						fieldName: "retirementDate",
//					},
//					{
//						//设备设施状态 0再用,1停用,2报废
//						title: "设备设施状态",
//						fieldName: "state",
//					},
//					{
//						//设备型号
//						title: "设备型号",
//						fieldName: "version",
//					},
//					{
//						//保修期(月)
//						title: "保修期(月)",
//						fieldName: "warranty",
//					},
//					{
//						//保修终止日期 根据保修期自动算出
//						title: "保修终止日期",
//						fieldName: "warrantyPeriod",
//					},
//					{
//						//设备更新日期
//						title: "设备更新日期",
//						fieldName: "modifyDate",
//					},
//					{
//						//设备登记日期
//						title: "设备登记日期",
//						fieldName: "createDate",
//					},
	                ],

	                defaultFilterValue : {"criteria.orderValue" : {fieldName : "modifyDate", orderType : "1"}},
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
		name:"tpaEquipmentSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
//	var component = LIB.Vue.extend(opts);
//	LIB.Vue.component('checkplan-select-modal', component);
});