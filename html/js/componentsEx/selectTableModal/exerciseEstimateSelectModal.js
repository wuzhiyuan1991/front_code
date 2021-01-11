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
	                url: "{POJO-lowerCase}/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//预案或方案要求
						title: "预案或方案要求",
						fieldName: "demand",
						keywordFilterName: "criteria.strValue.keyWordValue_demand"
					},
					{
						//演练时间（默认演练方案时间）
						title: "演练时间（默认演练方案时间）",
						fieldName: "exerciseDate",
						keywordFilterName: "criteria.strValue.keyWordValue_exerciseDate"
					},
					{
						title: "评估人",
						fieldName: "user.name",
						keywordFilterName: "criteria.strValue.keyWordValue_user_name"
					},
					{
						title: "演练方案",
						fieldName: "exerciseScheme.name",
						keywordFilterName: "criteria.strValue.keyWordValue_exerciseScheme_name"
					},
//					{
//						//评估项目(默认为演练方案的演练科目)
//						title: "评估项目(默认为演练方案的演练科目)",
//						fieldName: "subjects",
//						keywordFilterName: "criteria.strValue.keyWordValue_subjects"
//					},
//					 LIB.tableMgr.ksColumn.modifyDate,
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
		name:"exerciseestimateSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});