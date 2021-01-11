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
	                url: "radomobser/list{/curPage}{/pageSize}",
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
					{
						//内容
						title: "内容",
						fieldName: "content",
					},
					{
						//来源 0:手机检查  1：web录入 2 其他
						title: "来源",
						fieldName: "checkSource",
					},
//					{
//						//状态   1:待审核 2:已转隐患 3:被否决
//						title: "状态",
//						fieldName: "status",
//					},
//					 LIB.tableMgr.column.company,
////					 LIB.tableMgr.column.company,
////					{
//						//审核时间
//						title: "审核时间",
//						fieldName: "auditDate",
//					},
//					{
//						//检查时间
//						title: "检查时间",
//						fieldName: "checkDate",
//					},
//					{
//						//关闭时间
//						title: "关闭时间",
//						fieldName: "closeDate",
//					},
//					{
//						//附件类型 文字：1006 图片：1007 视频：1008
//						title: "附件类型",
//						fieldName: "contentType",
//					},
//					{
//						//是否禁用，0启用，1禁用
//						title: "是否禁用，0启用，1禁用",
//						fieldName: "disable",
//					},
//					{
//						//点赞数
//						title: "点赞数",
//						fieldName: "praises",
//					},
//					{
//						//发布者姓名
//						title: "发布者姓名",
//						fieldName: "publisherName",
//					},
//					{
//						//备注
//						title: "备注",
//						fieldName: "remarks",
//					},
//					{
//						//评论数
//						title: "评论数",
//						fieldName: "reviews",
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
					filterColumn:["criteria.strValue.code","criteria.strValue.content","criteria.strValue.publisherName","criteria.strValue.remarks"],
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
		name:"radomObserSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
//	var component = LIB.Vue.extend(opts);
//	LIB.Vue.component('checkplan-select-modal', component);
});