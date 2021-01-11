define(function(require) {

	var LIB = require('lib');
	
	var initDataModel = function () {
        return {
        	mainModel:{
				title:"选择课程",
				selectedDatas:[]
			},
            tableModel: (
	            {
	                url: "course/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [{
	                    title: "",
	                    fieldName: "id",
	                    fieldType: "cb",
	                }, 
					{
						//唯一标识
						title: "编码",
						fieldName: "code",
					},
					{
						//课程名称
						title: "课程名称",
						fieldName: "name",
					},
//					{
//						//title : "培训方式",
//						title: "培训方式",
//						fieldType : "custom",
//						render : function(data){
//							return LIB.getDataDic("course_type",data.type);
//						}
//					},
						_.omit(LIB.tableMgr.column.company, "filterType"),
					{
						//课程名称
						title: "课程类型",
						fieldName: "attr1",
					},
					{
						//课程名称
						title: "培训方式",
                        fieldType: "custom",
                        render: function (data) {
                            return LIB.getDataDic("course_type", data.type);
                        },
					},
                        {
                            //创建日期
                            title: "创建时间",
                            fieldName: "createDate",
                        },
					 //LIB.tableMgr.column.company,
//					 LIB.tableMgr.column.company,
////					{
//						//类型 1法定 2知识 3技能
//						title: "类型",
//						fieldName: "category",
//					},
//					{
//						//课程简介
//						title: "课程简介",
//						fieldName: "description",
//					},
//					{
//						//禁用标识， 1:已禁用，0：未禁用，null:未禁用
//						title: "禁用标识，",
//						fieldName: "disable",
//					},
//					{
//						//培训效果 1了解 2掌握 3精通 4取证
//						title: "培训效果",
//						fieldName: "effect",
//					},
//					{
//						//复培频率 以年为单位 0表示一次性
//						title: "复培频率",
//						fieldName: "frequence",
//					},
//					{
//						//语言 0中文 1英语
//						title: "语言",
//						fieldName: "language",
//					},
//					{
//						//启用多频率提醒距离培训开始的天数
//						title: "启用多频率提醒距离培训开始的天数",
//						fieldName: "lastRemindDays",
//					},
//					{
//						//多频率提醒的频率 天为单位
//						title: "多频率提醒的频率",
//						fieldName: "lastRemindFrequence",
//					},
//					{
//						//三级安全教育  1班组级 2车间级 3厂级
//						title: "三级安全教育",
//						fieldName: "level",
//					},
//					{
//						//学习条件
//						title: "学习条件",
//						fieldName: "precondition",
//					},
//					{
//						//培训目的
//						title: "培训目的",
//						fieldName: "purpose",
//					},
//					{
//						//备注
//						title: "备注",
//						fieldName: "remark",
//					},
//					{
//						//提前提醒天数
//						title: "提前提醒天数",
//						fieldName: "remindDays",
//					},
//					{
//						//提醒标识 0不提醒 1普通提醒 2多频率提醒
//						title: "提醒标识",
//						fieldName: "remindType",
//					},
//					{
//						//所有关联分类id
//						title: "所有关联分类id",
//						fieldName: "subjectLink",
//					},
//					{
//						//培训课时
//						title: "培训课时",
//						fieldName: "trainHour",
//					},
//					{
//						//授课类型 1自学 2教学 3实操
//						title: "授课类型",
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
		name:"courseSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
//	var component = LIB.Vue.extend(opts);
//	LIB.Vue.component('checkplan-select-modal', component);
});