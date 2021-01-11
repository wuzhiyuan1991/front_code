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
	                url: "riskassessment/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [{
	                    title: "",
	                    fieldName: "id",
	                    fieldType: "cb",
	                }, 
					{
						//
						title: "",
						fieldName: "code",
					},
						_.omit(LIB.tableMgr.column.company, "filterType"),
					 //LIB.tableMgr.column.company,
					 //LIB.tableMgr.column.company,
//					{
//						//检查频次
//						title: "检查频次",
//						fieldName: "checkFrequency",
//					},
//					{
//						//管控层级
//						title: "管控层级",
//						fieldName: "controlHierarchy",
//					},
//					{
//						//控制措施
//						title: "控制措施",
//						fieldName: "controlMeasures",
//					},
//					{
//						//是否禁用，0启用，1禁用
//						title: "是否禁用，0启用，1禁用",
//						fieldName: "disable",
//					},
//					{
//						//'危害辨识来源标识 0 隐患回转 1 自建记录
//						title: "'危害辨识来源标识",
//						fieldName: "markup",
//					},
//					{
//						//风险等级
//						title: "风险等级",
//						fieldName: "riskLevel",
//					},
//					{
//						//风险等级模型
//						title: "风险等级模型",
//						fieldName: "riskModel",
//					},
//					{
//						//场景
//						title: "场景",
//						fieldName: "scene",
//					},
//					{
//						//状态（0已评估，1未评估,2未通过）
//						title: "状态（0已评估，1未评估,2未通过）",
//						fieldName: "state",
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
					filterColumn:["criteria.strValue.code","criteria.strValue.checkFrequency","criteria.strValue.controlHierarchy","criteria.strValue.controlMeasures","criteria.strValue.riskLevel","criteria.strValue.riskModel","criteria.strValue.scene"],
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
		name:"riskAssessmentSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
//	var component = LIB.Vue.extend(opts);
//	LIB.Vue.component('checkplan-select-modal', component);
});