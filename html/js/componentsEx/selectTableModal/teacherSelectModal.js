define(function(require) {

	var LIB = require('lib');
	
	var initDataModel = function () {
        return {
        	mainModel:{
				title:"选择讲师",
				selectedDatas:[]
			},
            tableModel: (
	            {
	                url: "teacher/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [{
	                    title: "",
	                    fieldName: "id",
	                    fieldType: "cb",
	                }, 
					{
						//唯一标识
						title:"编码",
						fieldName: "code",
						keywordFilterName: "criteria.strValue.keyWordValue_code",
					},
					{
						//教师名称
						title: "讲师名称",
						fieldName: "name",
						keywordFilterName: "criteria.strValue.keyWordValue_name",
					},
					 //LIB.tableMgr.column.company,
//					 LIB.tableMgr.column.company,
////					{
//						//现居地
//						title: "现居地",
//						fieldName: "address",
//					},
//					{
//						//讲师介绍
//						title: "讲师介绍",
//						fieldName: "career",
//					},
//					{
//						//禁用标识， 1:已禁用，0：未禁用，null:未禁用
//						title: "禁用标识，",
//						fieldName: "disable",
//					},
//					{
//						//邮箱
//						title: "邮箱",
//						fieldName: "email",
//					},
//					{
//						//家乡
//						title: "家乡",
//						fieldName: "hometown",
//					},
//					{
//						//兴趣爱好
//						title: "兴趣爱好",
//						fieldName: "interest",
//					},
//					{
//						//手机号码
//						title: "手机号码",
//						fieldName: "mobile",
//					},
//					{
//						//图片路径
//						title: "图片路径",
//						fieldName: "picPath",
//					},
//					{
//						//qq号
//						title: "qq号",
//						fieldName: "qq",
//					},
//					{
//						//性别 0女 1男
//						title: "性别",
//						fieldName: "sex",
//					},
//					{
//						//来源 
//						title: "来源",
//						fieldName: "source",
//					},
//					{
//						//专长
//						title: "专长",
//						fieldName: "speciality",
//					},
//					{
//						//微博
//						title: "微博",
//						fieldName: "weibo",
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
		name:"teacherSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
//	var component = LIB.Vue.extend(opts);
//	LIB.Vue.component('checkplan-select-modal', component);
});