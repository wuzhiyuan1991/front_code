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
	                url: "tpacheckrecord/list{/curPage}{/pageSize}",
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
						//检查结果详情 如10/10,10条合格,10条不合格
						title: "检查结果详情",
						fieldName: "checkResultDetail",
					},
					{
						//检查结果 0:不合格,1:合格
						title: "检查结果",
						fieldName: "checkResult",
					},
//					{
//						//检查时间
//						title: "检查时间",
//						fieldName: "checkDate",
//					},
//					 LIB.tableMgr.column.company,
////					 LIB.tableMgr.column.company,
////					{
//						//检查开始时间
//						title: "检查开始时间",
//						fieldName: "checkBeginDate",
//					},
//					{
//						//检查结束时间
//						title: "检查结束时间",
//						fieldName: "checkEndDate",
//					},
//					{
//						//来源 0:手机检查,1:web录入
//						title: "来源",
//						fieldName: "checkSource",
//					},
//					{
//						//是否禁用 0启用,1禁用
//						title: "是否禁用",
//						fieldName: "disable",
//					},
//					{
//						//是否为抽检数据,即抽检人做的记录  0-否(默认) 1-是
//						title: "是否为抽检数据,即抽检人做的记录",
//						fieldName: "isRandom",
//					},
//					{
//						//备注
//						title: "备注",
//						fieldName: "remarks",
//					},
//					{
//						//检查类型 1日常检查 2计划检查
//						title: "检查类型",
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
		name:"tpaCheckRecordSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
//	var component = LIB.Vue.extend(opts);
//	LIB.Vue.component('checkplan-select-modal', component);
});