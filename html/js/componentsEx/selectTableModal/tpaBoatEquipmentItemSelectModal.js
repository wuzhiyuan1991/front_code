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
	                url: "tpaboatequipmentitem/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [{
	                    title: "",
	                    fieldName: "id",
	                    fieldType: "cb",
	                }, 
					{
						//编码
						title: "编码",
						fieldName: "code",
					},
					{
						//设备设施子件名称
						title: "设备设施子件名称",
						fieldName: "name",
					},
					{
						//序列号
						title: "序列号",
						fieldName: "serialNumber",
					},
//					{
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
//						//保修期(月)
//						title: "保修期(月)",
//						fieldName: "warranty",
//					},
//					{
//						//保修终止日期 根据保修期自动算出保修终止日期
//						title: "保修终止日期",
//						fieldName: "warrantyPeriod",
//					},
//					{
//						//修改日期
//						title: "修改日期",
//						fieldName: "modifyDate",
//					},
//					{
//						//创建日期
//						title: "创建日期",
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
		name:"tpaBoatEquipmentItemSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
//	var component = LIB.Vue.extend(opts);
//	LIB.Vue.component('checkplan-select-modal', component);
});