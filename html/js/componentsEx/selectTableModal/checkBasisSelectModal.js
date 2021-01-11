define(function(require) {

	var LIB = require('lib');
	var code = 	{
		//
		title: "编码",
		fieldName: "code",
		width: 180,
		pathCode: LIB.ModuleCode.BD_RiA_InsB,
	}
		
	if (LIB.setting.useCheckInsteadOfCodeAsLink) {
		code = {
			title: "",
			fieldName: "code",
			width:60,
			pathCode: LIB.ModuleCode.BD_RiA_InsB,
			render: function () {
				return '<div style="color: #33a6ff;cursor: pointer;">查 看</div>'
			}
		}
	}
	var initDataModel = function () {
        return {
        	mainModel:{
				title:"添加检查依据",
				selectedDatas:[]
			},
            tableModel: (
	            {
	                url: "checkbasis/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [{
	                    title: "",
	                    fieldName: "id",
	                    fieldType: "cb",
	                }, 
					code,
					{
						title:"检查依据分类",
						fieldType:"custom",
						render: function(data){if(data.checkBasisType){return data.checkBasisType.name;
						}},
                        width: 180
					},
					{
						//章节名称
						title: "章节名称",
						fieldName: "name",
                        width: 420
					},
					// LIB.tableMgr.column.company,
//					 LIB.tableMgr.column.company,
////					{
//						//内容
//						title: "内容",
//						fieldName: "content",
//					},
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
					//filterColumn:["criteria.strValue.code","criteria.strValue.name","criteria.strValue.content"],
					//filterColumn:["criteria.strValue.name", "criteria.strValue.custom","criteria.strValue.code"],
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
		name:"checkBasisSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
//	var component = LIB.Vue.extend(opts);
//	LIB.Vue.component('checkplan-select-modal', component);
});