define(function(require) {

	var LIB = require('lib');
	var code = {
		//
		title: "编码",
		fieldName: "code",
		pathCode: LIB.ModuleCode.BD_RiA_InsM,
	}
		
	if (LIB.setting.useCheckInsteadOfCodeAsLink) {
		code = {
			title: "",
			fieldName: "code",
			width:60,
			pathCode: LIB.ModuleCode.BD_RiA_InsM,
			render: function () {
				return '<div style="color: #33a6ff;cursor: pointer;">查 看</div>'
			}
		}
	}
	var initDataModel = function () {
        return {
        	mainModel:{
				title:"添加检查方法",
				selectedDatas:[]
			},
            tableModel: (
	            {
	                url: "checkmethod/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					LIB.tableMgr.ksColumn.cb,
					code,
					{
						//方法名称
						title: "检查方法名称",
						fieldName: "name",
                        width: 200
					},
					// LIB.tableMgr.column.company,
//					 LIB.tableMgr.column.company,
					{
						//内容
						title: "内容",
						fieldName: "content",
                        width: 380
					},
//					{
//						//是否禁用，0启用，1禁用
//						title: "是否禁用，0启用，1禁用",
//						fieldName: "disable",
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
		name:"checkMethodSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
//	var component = LIB.Vue.extend(opts);
//	LIB.Vue.component('checkplan-select-modal', component);
});