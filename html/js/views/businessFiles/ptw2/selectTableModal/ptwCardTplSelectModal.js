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
	                url: "ptwcardtpl/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					 LIB.tableMgr.ksColumn.company,
//					 LIB.tableMgr.ksColumn.dept,
					{
						title: "作业类型",
						fieldName: "workCatalog.name",
						keywordFilterName: "criteria.strValue.keyWordValue_workCatalog_name"
					},
//					{
//						//字段启用禁用设置(json)
//						title: "字段启用禁用设置(json)",
//						fieldName: "columnSetting",
//						keywordFilterName: "criteria.strValue.keyWordValue_columnSetting"
//					},
//					{
//						//是否启用气体检测 0:否,1:是
//						title: "是否启用气体检测",
//						fieldName: "gasDetection",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_card_tpl_gas_detection"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_card_tpl_gas_detection", data.gasDetection);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_gasDetection"
//					},
//					{
//						//能量隔离启用禁用设置(json)
//						title: "能量隔离启用禁用设置(json)",
//						fieldName: "isolationSetting",
//						keywordFilterName: "criteria.strValue.keyWordValue_isolationSetting"
//					},
//					{
//						//个人防护启用禁用设置(json)
//						title: "个人防护启用禁用设置(json)",
//						fieldName: "ppeCatalogSetting",
//						keywordFilterName: "criteria.strValue.keyWordValue_ppeCatalogSetting"
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
		name:"ptwcardtplSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});