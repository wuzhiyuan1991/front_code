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
	                url: "papertopic/list{/curPage}{/pageSize}",
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
						//名称
						title: "名称",
						fieldName: "name",
					},
					{
						//禁用标识， 1:已禁用，0：未禁用，null:未禁用
						title: "禁用标识，",
						fieldName: "disable",
					},
//					{
//						//数量
//						title: "数量",
//						fieldName: "num",
//					},
//					{
//						//每题的分数
//						title: "每题的分数",
//						fieldName: "score",
//					},
//					{
//						//说明
//						title: "说明",
//						fieldName: "title",
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
		name:"paperTopicSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
//	var component = LIB.Vue.extend(opts);
//	LIB.Vue.component('checkplan-select-modal', component);
});