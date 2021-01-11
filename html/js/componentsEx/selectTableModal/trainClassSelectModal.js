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
	                url: "trainclass/list{/curPage}{/pageSize}",
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
						//报名截止日期
						title: "报名截止日期",
						fieldName: "applyDeadline",
					},
					{
						//审核培训记录时间
						title: "审核培训记录时间",
						fieldName: "auditTime",
					},
//					{
//						//禁用标识， 1:已禁用，0：未禁用，null:未禁用
//						title: "禁用标识，",
//						fieldName: "disable",
//					},
//					{
//						//选修人数限制
//						title: "选修人数限制",
//						fieldName: "electiveLimit",
//					},
//					{
//						//已报名选修学员数（冗余）
//						title: "已报名选修学员数（冗余）",
//						fieldName: "electiveParticipants",
//					},
//					{
//						//结束时间
//						title: "结束时间",
//						fieldName: "endTime",
//					},
//					{
//						//培训人数（必修）
//						title: "培训人数（必修）",
//						fieldName: "participantLimit",
//					},
//					{
//						//报名人数（冗余）
//						title: "报名人数（冗余）",
//						fieldName: "participants",
//					},
//					{
//						//培训地点
//						title: "培训地点",
//						fieldName: "place",
//					},
//					{
//						//开始时间
//						title: "开始时间",
//						fieldName: "startTime",
//					},
//					{
//						//培训状态 1报名中 2报名结束 3培训中 4培训结束 5审批完成
//						title: "培训状态",
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
		name:"trainClassSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
//	var component = LIB.Vue.extend(opts);
//	LIB.Vue.component('checkplan-select-modal', component);
});