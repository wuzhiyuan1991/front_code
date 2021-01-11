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
	                url: "ptwcatalog/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//(级别/指标）名称/承诺岗位
						title: "(级别/指标）名称/承诺岗位",
						fieldName: "name",
						keywordFilterName: "criteria.strValue.keyWordValue_name"
					},
					{
						//字典类型 1:作业类型,2:作业分级,3:个人防护设备,4:气体检测指标,5:岗位会签承诺
						title: "字典类型",
						fieldName: "type",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iptw_catalog_type"),
						render: function (data) {
							return LIB.getDataDic("iptw_catalog_type", data.type);
						},
						keywordFilterName: "criteria.strValue.keyWordValue_type"
					},
					{
						title: "父级类型",
						fieldName: "parent.name",
						keywordFilterName: "criteria.strValue.keyWordValue_parent_name"
					},
//					{
//						//分级依据/标准范围/承诺内容
//						title: "分级依据/标准范围/承诺内容",
//						fieldName: "content",
//						keywordFilterName: "criteria.strValue.keyWordValue_content"
//					},
//					{
//						//作业级别
//						title: "作业级别",
//						fieldName: "level",
//						keywordFilterName: "criteria.strValue.keyWordValue_level"
//					},
//					{
//						//单位（气体检测指标）
//						title: "单位（气体检测指标）",
//						fieldName: "unit",
//						keywordFilterName: "criteria.strValue.keyWordValue_unit"
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
		name:"ptwcatalogSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});