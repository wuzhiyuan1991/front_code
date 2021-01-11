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
	                url: "lookupitem/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [{
	                    title: "",
	                    fieldName: "id",
	                    fieldType: "cb"
	                }, 
					{
						//编码
						title: "编码",
						fieldName: "code"
					},
					{
						//名称
						title: "名称",
						fieldName: "name"
					},
					// {
					// 	//是否禁用，0启用，1禁用
					// 	title: "是否禁用，0启用，1禁用",
					// 	fieldName: "disable",
					// },
//					{
//						//国际化code
//						title: "国际化code",
//						fieldName: "i18nCode",
//					},
//					{
//						//数据字典code
//						title: "数据字典code",
//						fieldName: "lookupCode",
//					},
					{
						//备注
						title: "备注",
						fieldName: "remarks"
					},
					{
						//类型
						title: "类型",
						fieldName: "type"
					},
					{
						//值
						title: "值",
						fieldName: "value"
					}
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
					filterColumn:["criteria.strValue.code","criteria.strValue.name","criteria.strValue.i18nCode","criteria.strValue.lookupCode","criteria.strValue.type"],
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
		name:"lookupItemSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
//	var component = LIB.Vue.extend(opts);
//	LIB.Vue.component('checkplan-select-modal', component);
});