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
	                url: "idadutyability/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//履职能力要求
						title: "履职能力要求",
						fieldName: "ability",
						keywordFilterName: "criteria.strValue.keyWordValue_ability"
					},
					{
						//分组
						title: "分组",
						fieldName: "group",
						keywordFilterName: "criteria.strValue.keyWordValue_group"
					},
					{
						title: "章节",
						fieldName: "idaCourseKpoint.name",
						keywordFilterName: "criteria.strValue.keyWordValue_idaCourseKpoint_name"
					},
					{
						title: "岗位分类",
						fieldName: "idaDutySubject.name",
						keywordFilterName: "criteria.strValue.keyWordValue_idaDutySubject_name"
					},
//					{
//						//职责描述
//						title: "职责描述",
//						fieldName: "duty",
//						keywordFilterName: "criteria.strValue.keyWordValue_duty"
//					},
//					 LIB.tableMgr.ksColumn.company,
//					 LIB.tableMgr.ksColumn.dept,
////					 LIB.tableMgr.ksColumn.modifyDate,
////					 LIB.tableMgr.ksColumn.createDate,
//
	                ],

	                defaultFilterValue : {
	                	"criteria.orderValue" : {fieldName : "modifyDate", orderType : "1"},
						"disable" : 0
	                },
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
		name:"idadutyabilitySelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});