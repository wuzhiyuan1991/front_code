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
	                url: "tpacheckplan/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [{
	                    title: "",
	                    fieldName: "id",
	                    fieldType: "cb",
	                }, 
					{
						//编码
						title: "编码",
						fieldName: "code",
					},
					{
						//计划名
						title: "计划名",
						fieldName: "name",
					},
					{
						//计划类型 0:无意义，1::工作计划 ，2:巡检计划
						title: "计划类型",
						fieldName: "planType",
					},
//					{
//						//结束时间
//						title: "结束时间",
//						fieldName: "endDate",
//					},
//					{
//						//开始时间
//						title: "开始时间",
//						fieldName: "startDate",
//					},
//					 LIB.tableMgr.column.company,
////					 LIB.tableMgr.column.company,
////					{
//						//频率类型 0执行一次 1重复执行
//						title: "频率类型",
//						fieldName: "checkType",
//					},
//					{
//						//是否禁用 0启用,1禁用
//						title: "是否禁用",
//						fieldName: "disable",
//					},
//					{
//						//检查频率
//						title: "检查频率",
//						fieldName: "frequency",
//					},
//					{
//						//检查频率类型
//						title: "检查频率类型",
//						fieldName: "frequencyType",
//					},
//					{
//						//备注
//						title: "备注",
//						fieldName: "remarks",
//					},
//					{
//						//专业 1设备工艺 2自控 3通信 4压缩机 5安全环保 6综合文控 7物资 8应急 9车辆 10电气 11线路 12阴保
//						title: "专业",
//						fieldName: "specialty",
//					},
//					{
//						//检查计划类型 10 证书类 20资料类
//						title: "检查计划类型",
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
		name:"tpaCheckPlanSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
//	var component = LIB.Vue.extend(opts);
//	LIB.Vue.component('checkplan-select-modal', component);
});