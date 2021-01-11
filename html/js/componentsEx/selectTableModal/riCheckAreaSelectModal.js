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
	                url: "richeckarea/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//巡检区域名称
						title: "巡检区域名称",
						fieldName: "name",
						keywordFilterName: "criteria.strValue.keyWordValue_name",
					},
					{
						//关联类型 1:自身,2:属地
						title: "关联类型",
						fieldName: "refType",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iri_check_area_ref_type"),
						render: function (data) {
							return LIB.getDataDic("iri_check_area_ref_type", data.refType);
						},
						keywordFilterName: "criteria.strValue.keyWordValue_refType"
					},
					{
						title: "巡检表",
						fieldName: "riCheckTable.name",
						keywordFilterName: "criteria.strValue.keyWordValue_riCheckTable_name"
					},
//					{
//						//序号
//						title: "序号",
//						fieldName: "orderNo",
//						keywordFilterName: "criteria.strValue.keyWordValue_orderNo",
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
		name:"riCheckAreaSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});