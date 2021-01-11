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
	                url: "coursestudyhistory/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [{
	                    title: "",
	                    fieldName: "id",
	                    fieldType: "cb",
	                }, 
					{
						//唯一标识
						title: "唯一标识",
						fieldName: "code",
					},
					{
						//课程名称
						title: "课程名称",
						fieldName: "courseName",
					},
					{
						//playercount小于20时记录,备注观看的时间，叠加
						title: "playercount小于20时记录,备注观看的时间，叠加",
						fieldName: "databack",
					},
//					{
//						//禁用标识， 1:已禁用，0：未禁用，null:未禁用
//						title: "禁用标识，",
//						fieldName: "disable",
//					},
//					{
//						//节点名称
//						title: "节点名称",
//						fieldName: "kpointName",
//					},
//					{
//						//观看次数,累加
//						title: "观看次数,累加",
//						fieldName: "playCount",
//					},
//					{
//						//视频/音频学习进度 0学习中 1考试中 2已完成
//						title: "视频/音频学习进度",
//						fieldName: "status",
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
		name:"courseStudyhistorySelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
//	var component = LIB.Vue.extend(opts);
//	LIB.Vue.component('checkplan-select-modal', component);
});