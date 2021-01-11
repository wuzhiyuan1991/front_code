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
	                url: "trainapply/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [{
	                    title: "",
	                    fieldName: "id",
	                    fieldType: "cb",
	                }, 
					{
						//唯一标识
						title: "唯一标识",
						fieldName: "code",
					},
					{
						//
						title: "",
						fieldName: "applyDate",
					},
					{
						//报名方式 0学员报名 1管理员录入
						title: "报名方式",
						fieldName: "applyType",
					},
//					{
//						//禁用标识， 1:已禁用，0：未禁用，null:未禁用
//						title: "禁用标识，",
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
		name:"trainApplySelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
//	var component = LIB.Vue.extend(opts);
//	LIB.Vue.component('checkplan-select-modal', component);
});