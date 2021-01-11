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
	                url: "tpacheckitem/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [{
	                    title: "",
	                    fieldName: "id",
	                    fieldType: "cb",
	                }, 
					{
						//角色编码
						title: "角色编码",
						fieldName: "code",
					},
					{
						//检查项名称
						title: "检查项名称",
						fieldName: "name",
					},
					 LIB.tableMgr.column.company,
//					 LIB.tableMgr.column.company,
////					{
//						//发证日期
//						title: "发证日期",
//						fieldName: "awardDate",
//					},
//					{
//						//检查项来源标识 0转隐患生成,1危害辨识生成,2手动生成
//						title: "检查项来源标识",
//						fieldName: "category",
//					},
//					{
//						//是否禁用 0启用,1禁用
//						title: "是否禁用",
//						fieldName: "disable",
//					},
//					{
//						//是否被使用 0未使用,1已使用
//						title: "是否被使用",
//						fieldName: "isUse",
//					},
//					{
//						//证书类别 10船舶证书类 20人员证书类 30资料类
//						title: "证书类别",
//						fieldName: "itemType",
//					},
//					{
//						//中间校验
//						title: "中间校验",
//						fieldName: "periodDate",
//					},
//					{
//						//备注
//						title: "备注",
//						fieldName: "remarks",
//					},
//					{
//						//类型 0行为类,1状态类,2管理类
//						title: "类型",
//						fieldName: "type",
//					},
//					{
//						//有效日期
//						title: "有效日期",
//						fieldName: "validDate",
//					},
//					{
//						//年度检验
//						title: "年度检验",
//						fieldName: "yearDate",
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
		name:"tpaCheckItemSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
//	var component = LIB.Vue.extend(opts);
//	LIB.Vue.component('checkplan-select-modal', component);
});