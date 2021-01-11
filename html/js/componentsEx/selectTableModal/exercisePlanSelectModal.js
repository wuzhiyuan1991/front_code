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
	                url: "exerciseplan/list{/curPage}{/pageSize}?status=1&&disable=0",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//计划年份
						title: "计划年份",
						fieldName: "year",
						keywordFilterName: "criteria.strValue.keyWordValue_year"
					},
					{
						//预案类型 1:综合应急预案,2:专项应急预案,3:现场处置方案
						title: "预案类型",
						fieldName: "emerPlanType",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iem_emer_plan_type"),
						render: function (data) {
							return LIB.getDataDic("iem_emer_plan_type", data.emerPlanType);
						}
					},
					{
						//预案所在部门
						title: "预案所在部门",
						fieldName: "emerPlanDept",
						keywordFilterName: "criteria.strValue.keyWordValue_emerPlanDept"
					},
					{
						//演练科目
						title: "演练科目",
						fieldName: "subjects",
						keywordFilterName: "criteria.strValue.keyWordValue_subjects"
					},
					{
						//演练形式 1:桌面推演,2:现场演习,3:自行拟定
						title: "演练形式",
						fieldName: "form",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iem_exercise_plan_form"),
						render: function (data) {
							return LIB.getDataDic("iem_exercise_plan_form", data.form);
						}
					},
					{
						//演练时间
						title: "演练时间",
						fieldName: "exerciseTime",
						keywordFilterName: "criteria.strValue.keyWordValue_exerciseTime"
					},
					{
						//参演人数（人）
						title: "参演人数（人）",
						fieldName: "participantNumber",
						keywordFilterName: "criteria.strValue.keyWordValue_participantNumber"
					},

					{
						//演练地点(默认取属地地址)
						title: "演练地点",
						fieldName: "specificAddress",
						keywordFilterName: "criteria.strValue.keyWordValue_specificAddress"
					},
					{
						//参演部门/岗位
						title: "参演部门/岗位",
						fieldName: "participant",
						keywordFilterName: "criteria.strValue.keyWordValue_participant"
					},
					{
						//演练科目类型
						title: "演练科目类型",
						fieldName: "subjectType",
						keywordFilterName: "criteria.strValue.keyWordValue_subjectType",
                        render:function (data) {
                            var str = '';
                            if(data.subjectType && data.subjectType.length>0){
                                for(var i=0;i<data.subjectType.length;i++){
									var s =	LIB.getDataDic("emer_exercise_subjects_type",data.subjectType[i]);
                                    str +=s
                                    if(i<data.subjectType.length-1 && s){
                                        str+= ','
                                    }
                                }
                            }

                            return str
                        },
						width:240
					},
					{
						title: "演练负责人",
						fieldName: "userNames",
						keywordFilterName: "criteria.strValue.keyWordValue_username"
					},
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
		name:"exerciseplanSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});