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
	                url: "trainplan/list{/curPage}{/pageSize}",
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
						//计划名称
						title: "计划名称",
						fieldName: "name",
					},
						_.omit(LIB.tableMgr.column.company, "filterType"),
					 //LIB.tableMgr.column.company,
//					 LIB.tableMgr.column.company,
////					{
//						//培训总人数
//						title: "培训总人数",
//						fieldName: "allowSum",
//					},
//					{
//						//已添加班次数
//						title: "已添加班次数",
//						fieldName: "classNum",
//					},
//					{
//						//禁用标识， 1:已禁用，0：未禁用，null:未禁用
//						title: "禁用标识，",
//						fieldName: "disable",
//					},
//					{
//						//培训结束时间
//						title: "培训结束时间",
//						fieldName: "endTime",
//					},
//					{
//						//剩余培训总人数（培训总人数-各班级人数限制的总和，冗余）
//						title: "剩余培训总人数（培训总人数-各班级人数限制的总和，冗余）",
//						fieldName: "restSum",
//					},
//					{
//						//培训开始时间
//						title: "培训开始时间",
//						fieldName: "startTime",
//					},
//					{
//						//状态 0未发布 1已发布
//						title: "状态",
//						fieldName: "status",
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
		name:"trainPlanSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
//	var component = LIB.Vue.extend(opts);
//	LIB.Vue.component('checkplan-select-modal', component);
});