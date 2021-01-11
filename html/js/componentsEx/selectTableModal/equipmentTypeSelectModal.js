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
	                url: "equipmenttype/list{/curPage}{/pageSize}",
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
						//设备设施类型名
						title: "设备设施类型名",
						fieldName: "name",
					},
//					{
//						//是否禁用 0:正常,1:删除
//						title: "是否禁用",
//						fieldName: "disable",
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
	                defaultFilterValue : {"disable":"0","criteria.orderValue" : {fieldName : "modifyDate", orderType : "1"}},
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
		name:"equipmentTypeSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
//	var component = LIB.Vue.extend(opts);
//	LIB.Vue.component('checkplan-select-modal', component);
});