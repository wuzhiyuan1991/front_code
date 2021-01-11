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
	                url: "tpachecktask/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [{
	                    title: "",
	                    fieldName: "id",
	                    fieldType: "cb",
	                }, 
					{
						//
						title: "",
						fieldName: "code",
					},
					{
						//结束时间
						title: "结束时间",
						fieldName: "endDate",
					},
					{
						//开始时间
						title: "开始时间",
						fieldName: "startDate",
					},
//					 LIB.tableMgr.column.company,
////					 LIB.tableMgr.column.company,
////					{
//						//实际完成时间
//						title: "实际完成时间",
//						fieldName: "checkDate",
//					},
//					{
//						//是否禁用 0未发布，1发布
//						title: "是否禁用",
//						fieldName: "disable",
//					},
//					{
//						//任务序号
//						title: "任务序号",
//						fieldName: "num",
//					},
//					{
//						//任务状态 默认0未到期 1待执行 2按期执行 3超期执行 4未执行
//						title: "任务状态",
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
		name:"tpaCheckTaskSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
//	var component = LIB.Vue.extend(opts);
//	LIB.Vue.component('checkplan-select-modal', component);
});