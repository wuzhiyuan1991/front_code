define(function(require) {
	var LIB = require('lib');
	var template = require("text!./checkTableSelectModal.html");

	var initDataModel = function () {

        return {
        	mainModel:{
				title:"选择",
				selectedDatas:[]
			},
            tableModel: (
	            {
	                url: "checktable/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [{
						title:"",
						fieldName:"id",
						fieldType:"radio"
					},
						{
							title:"工作表名称",
							fieldName:"name",
							width: 200,
						},
						_.omit(LIB.tableMgr.column.company, "filterType"),
						{
							title:"分类",
							fieldType:"custom",
							render: function(data){
								if(data.checkTableType){
									return data.checkTableType.name;
								}
							},
                            width: 180
						},
						{
							title:"类型",
							fieldType:"custom",
							render: function(data){
                                return LIB.getDataDic("checkTable_type",data.type);
							},
                            filterName : "criteria.intsValue.type",
                            width: 140
						},
						{
							title:"创建时间",
							fieldName:"createDate",
                            width: 180
						}
						// ,
						// {
						// 	title:"状态",
						// 	fieldType:"custom",
						// 	width: 100,
						// 	render: function(data){
                         //        return LIB.getDataDic("disable",data.disable);
						// 	},
                         //    filterName : "criteria.intsValue.disable"
						// }
	                ],
                    defaultFilterValue:{"criteria.orderValue" : {fieldName : "modifyDate", orderType : "1"}},
	                resetTriggerFlag:false
	            }
            )
        };
    }
	
	var opts = {
		template: template,
		name:"checkTableSelectTableModal",
		mixins : [LIB.VueMixin.selectorTableModal],
		data:function(){
			var data = initDataModel();
			data.tableModel.defaultFilterValue.bizType = this.$route.query.bizType;
			return data;
		},
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
//	var component = LIB.Vue.extend(opts);
//	LIB.Vue.component('checkplan-select-modal', component);
});