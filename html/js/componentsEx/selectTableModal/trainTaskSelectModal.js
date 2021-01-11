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
	                url: "traintask/list{/curPage}{/pageSize}",
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
						//禁用标识， 1:已禁用，0：未禁用，null:未禁用
						title: "禁用标识，",
						fieldName: "disable",
					},
					{
						//复培时间 培训时间加上课程复培周期
						title: "复培时间",
						fieldName: "expiredDate",
					},
//					{
//						//学习进度
//						title: "学习进度",
//						fieldName: "percent",
//					},
//					{
//						//分数
//						title: "分数",
//						fieldName: "score",
//					},
//					{
//						//来源 1矩阵任务 2非矩阵任务
//						title: "来源",
//						fieldName: "source",
//					},
//					{
//						//培训状态  0 未开始 1未通过 2通过 3通过（已复培）
//						title: "培训状态",
//						fieldName: "status",
//					},
//					{
//						//培训时间
//						title: "培训时间",
//						fieldName: "trainDate",
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
		name:"trainTaskSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
//	var component = LIB.Vue.extend(opts);
//	LIB.Vue.component('checkplan-select-modal', component);
});