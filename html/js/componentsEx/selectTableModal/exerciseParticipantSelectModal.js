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
						//姓名
						title: "姓名",
						fieldName: "name",
						keywordFilterName: "criteria.strValue.keyWordValue_name"
					},
					{
						//是否内部人员 1:内部人员,0:外部人员
						title: "是否内部人员",
						fieldName: "isInsider",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iem_exercise_participant_is_insider"),
						render: function (data) {
							return LIB.getDataDic("iem_exercise_participant_is_insider", data.isInsider);
						},
						keywordFilterName: "criteria.strValue.keyWordValue_isInsider"
					},
					{
						title: "内部人员",
						fieldName: "user.name",
						keywordFilterName: "criteria.strValue.keyWordValue_user_name"
					},
					{
						title: "演练方案",
						fieldName: "exerciseScheme.name",
						keywordFilterName: "criteria.strValue.keyWordValue_exerciseScheme_name"
					},
//					{
//						//人员类型 1:演练负责人,2:参演人员,3:评价人员,4:观摩人员
//						title: "人员类型",
//						fieldName: "type",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iem_exercise_participant_type"),
//						render: function (data) {
//							return LIB.getDataDic("iem_exercise_participant_type", data.type);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_type"
//					},
//					{
//						//联系方式
//						title: "联系方式",
//						fieldName: "mobile",
//						keywordFilterName: "criteria.strValue.keyWordValue_mobile"
//					},
//					{
//						//机构
//						title: "机构",
//						fieldName: "organization",
//						keywordFilterName: "criteria.strValue.keyWordValue_organization"
//					},
//					{
//						//职务
//						title: "职务",
//						fieldName: "position",
//						keywordFilterName: "criteria.strValue.keyWordValue_position"
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
		name:"exerciseparticipantSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});