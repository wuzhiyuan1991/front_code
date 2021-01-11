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
	                url: "process/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [{
	                    title: "",
	                    fieldName: "id",
	                    fieldType: "cb",
	                }, 
					{
						//用户编码
						title: "用户编码",
						fieldName: "code",
					},
					{
						//工作流名称
						title: "流程角色名称",
						fieldName: "name",
					},
					//{
					//	//工作流名称
					//	title: "工作流名称",
					//	fieldName: "activitiModeler.name",
					//},
					 //LIB.tableMgr.column.company,
//					 LIB.tableMgr.column.company,
////					{
//						//工作流描述
//						title: "工作流描述",
//						fieldName: "description",
//					},
//					{
//						//是否禁用，0启用，1禁用
//						title: "是否禁用，0启用，1禁用",
//						fieldName: "disable",
//					},
//					{
//						//工作流key
//						title: "工作流key",
//						fieldName: "modelerKey",
//					},
//					{
//						//更新日期
//						title: "更新日期",
//						fieldName: "modifyDate",
//					},
//					{
//						//创建日期
//						title: "创建日期",
//						fieldName: "createDate",
//					},
	                ],
					filterColumn:["criteria.strValue.code","criteria.strValue.name","criteria.strValue.description","criteria.strValue.key"],
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
		name:"activitiRoleModelerSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
//	var component = LIB.Vue.extend(opts);
//	LIB.Vue.component('checkplan-select-modal', component);
});