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
				url: "exam/list{/curPage}{/pageSize}",
				selectedDatas: [],
				columns: [{
					title: "",
					fieldName: "id",
					fieldType: "cb",
				},
//					{
//						//唯一标识
//						title: "唯一标识",
//						fieldName: "code",
//					},
//						_.omit(LIB.tableMgr.column.company, "filterType"),
					//LIB.tableMgr.column.company,
					//LIB.tableMgr.column.company,
					{
						//唯一标识
						title: "试卷名称",
						fieldName: "examPaper.name",
						keywordFilterName: "criteria.strValue.keyWordValue_paperName",
						width: 150
					},
					{
						// title : "测试时间",
						title: "考试时长",
						fieldName: "examPaper.replyTime",
						fieldType: "custom",
						render: function (data) {
							if (data.examPaper) {
								return data.examPaper.replyTime + "分钟";
							}

						},
						width: 100
					},
					{
						//试卷总分
						title: "试卷总分",
						fieldName: "examPaper.score",
						fieldType: "custom",
						render: function (data) {
							if (data.examPaper) {
								return data.examPaper.score + "分";
							}
						},
						width: 100
					},
					{
						//考试开始时间
						title: "允许考试时间（开始）",
						fieldName: "examDate",
						width: 180
					},
					{
						//考试截止时间
						title: "允许考试时间（结束）",
						fieldName: "entryDeadline",
						width: 180
					},
//					{
//						//禁用标识， 1:已禁用，0：未禁用，null:未禁用
//						title: "禁用标识，",
//						fieldName: "disable",
//					},
//					{
//						//考试时间
//						title: "考试时间",
//						fieldName: "examDate",
//					},
//					{
//						//考试地点
//						title: "考试地点",
//						fieldName: "place",
//					},
//					{
//						//备注
//						title: "备注",
//						fieldName: "remarks",
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
		name:"examSelectTableModal"
	};

	var component = LIB.Vue.extend(opts);
	return component;
//	var component = LIB.Vue.extend(opts);
//	LIB.Vue.component('checkplan-select-modal', component);
});