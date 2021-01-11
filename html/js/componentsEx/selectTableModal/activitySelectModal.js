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
	                url: "activity/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
						{
							title: "",
							fieldName: "id1",
							fieldType: "cb",
						},
						{
							//编码
							title: "姓名",
							fieldName: "name",
						},
						{
							//
							title: "时间",
							fieldName: "createDate",
						},
						{
							//
							title: "",
							fieldName: "type",
						},
						{
							//任务名称
							title: "内容",
							fieldName: "content",

						}
//					{
//						//是否禁用，0启用，1禁用
//						title: "是否禁用，0启用，1禁用",
//						fieldName: "disable",
//					},
//					{
//						//
//						title: "",
//						fieldName: "state",
//					},
//					{
//						//时间
//						title: "时间",
//						fieldName: "time",
//					},
//					{
//						//类型
//						title: "类型",
//						fieldName: "type",
//					},
//					{
//						//
//						title: "",
//						fieldName: "username",
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
					filterColumn:["criteria.strValue.code","criteria.strValue.name","criteria.strValue.content","criteria.strValue.username"],
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
		name:"activitySelectTableModal"
	};

	var component = LIB.Vue.extend(opts);
	return component;
//	var component = LIB.Vue.extend(opts);
//	LIB.Vue.component('checkplan-select-modal', component);
});