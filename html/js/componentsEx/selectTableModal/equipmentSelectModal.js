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
	                url: "equipment/list{/curPage}{/pageSize}",
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
						width: 180
					},
					{
						//设备设施名称
						title: "设备设施名称",
						fieldName: "name",
                        width: 180
					},
					{
						title: "设备设施分类",
						fieldName: "equipmentType.name",
                        width: 160
					},
					_.omit(LIB.tableMgr.column.company, "filterType"),
					_.omit(LIB.tableMgr.column.dept, "filterType"),
					{
						title: "属地",
						fieldName: "dominationArea.name"
					},
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
	                defaultFilterValue : {"state":"0", "criteria.orderValue" : {fieldName : "modifyDate", orderType : "1"}},
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
		name:"equipmentSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
//	var component = LIB.Vue.extend(opts);
//	LIB.Vue.component('checkplan-select-modal', component);
});