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
	                url: "question/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [{
	                    title: "",
	                    fieldName: "id",
	                    fieldType: "cb",
	                }, 
					{
						//唯一标识
						title: "编码",
						fieldName: "code",
                        width: 160
					},
					_.extend(_.omit(LIB.tableMgr.column.company, "filterType"), {width: 200}),
					 //LIB.tableMgr.column.company,
					 //LIB.tableMgr.column.company,
//					{
//						//正确率
//						title: "正确率",
//						fieldName: "accuracy",
//					},
//					{
//						//试题解析
//						title: "试题解析",
//						fieldName: "analysis",
//					},
					{
						//正确选项
						title: "正确选项",
						fieldName: "answer",
                        width: 100
					},
					{
						//试题内容
						title: "试题内容",
						fieldName: "content",
                        width: 320
					},
//					{
//						//禁用标识， 1:已禁用，0：未禁用，null:未禁用
//						title: "禁用标识，",
//						fieldName: "disable",
//					},
//					{
//						//该试题被做错过多少次
//						title: "该试题被做错过多少次",
//						fieldName: "errorTime",
//					},
//					{
//						//标志
//						title: "标志",
//						fieldName: "flag",
//					},
//					{
//						//该试题被做正确过多少道
//						title: "该试题被做正确过多少道",
//						fieldName: "rightTime",
//					},
//					{
//						//做过的次数
//						title: "做过的次数",
//						fieldName: "time",
//					},
//					{
//						//试题类型 1单选题 2多选题 3判断题 4不定项题
//						title: "试题类型",
//						fieldName: "type",
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
		name:"questionSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
//	var component = LIB.Vue.extend(opts);
//	LIB.Vue.component('checkplan-select-modal', component);
});