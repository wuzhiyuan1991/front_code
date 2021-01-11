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
	                url: "emergroup/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//组别/单位名称
						title: "组别/单位名称",
						fieldName: "name",
						keywordFilterName: "criteria.strValue.keyWordValue_name"
					},
					{
						//类型 1:内部应急组,2:外部应急单位
						title: "类型",
						fieldName: "type",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iem_emer_group_type"),
						render: function (data) {
							return LIB.getDataDic("iem_emer_group_type", data.type);
						},
						keywordFilterName: "criteria.strValue.keyWordValue_type"
					},
//					 LIB.tableMgr.ksColumn.company,
//					 LIB.tableMgr.ksColumn.dept,
////					{
//						//单位地址
//						title: "单位地址",
//						fieldName: "address",
//						keywordFilterName: "criteria.strValue.keyWordValue_address"
//					},
//					{
//						//职责/备注
//						title: "职责/备注",
//						fieldName: "remarks",
//						keywordFilterName: "criteria.strValue.keyWordValue_remarks"
//					},
//					 LIB.tableMgr.ksColumn.modifyDate,
////					 LIB.tableMgr.ksColumn.createDate,
//
	                ],

	                defaultFilterValue : {
	                	"criteria.orderValue" : {fieldName : "modifyDate", orderType : "1"},
						"disable" : 0
	                },
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
		name:"emerGroupSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});