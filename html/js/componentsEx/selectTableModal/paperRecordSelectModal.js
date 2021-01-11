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
	                url: "paperrecord/list{/curPage}{/pageSize}",
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
						//正确率
						title: "正确率",
						fieldName: "accuracy",
					},
					{
						//正确题数
						title: "正确题数",
						fieldName: "correctNum",
					},
//					{
//						//禁用标识， 1:已禁用，0：未禁用，null:未禁用
//						title: "禁用标识，",
//						fieldName: "disable",
//					},
//					{
//						//客观题得分
//						title: "客观题得分",
//						fieldName: "objectiveScore",
//					},
//					{
//						//试卷名字
//						title: "试卷名字",
//						fieldName: "paperName",
//					},
//					{
//						//考试题数
//						title: "考试题数",
//						fieldName: "qstCount",
//					},
//					{
//						//0为默认完成，1为未考完
//						title: "0为默认完成，1为未考完",
//						fieldName: "status",
//					},
//					{
//						//主观题得分（手动）
//						title: "主观题得分（手动）",
//						fieldName: "subjectiveScore",
//					},
//					{
//						//该用户考试所用时间单位是秒
//						title: "该用户考试所用时间单位是秒",
//						fieldName: "testTime",
//					},
//					{
//						//用户的分
//						title: "用户的分",
//						fieldName: "userScore",
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
		name:"paperRecordSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
//	var component = LIB.Vue.extend(opts);
//	LIB.Vue.component('checkplan-select-modal', component);
});