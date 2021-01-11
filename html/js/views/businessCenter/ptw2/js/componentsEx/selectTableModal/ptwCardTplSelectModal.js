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
					{
						//作业票模板名称
						title: "作业票模板名称",
						fieldName: "name",
						keywordFilterName: "criteria.strValue.keyWordValue_name"
					},
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
//						//是否需要主管部门负责人 0:不需要,1:需要
//						title: "是否需要主管部门负责人",
//						fieldName: "enableDeptPrin",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_card_tpl_enable_dept_prin"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_card_tpl_enable_dept_prin", data.enableDeptPrin);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_enableDeptPrin"
//					},
//					{
//						//是否启用电气隔离 0:否,1:是
//						title: "是否启用电气隔离",
//						fieldName: "enableElectricIsolation",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_card_tpl_enable_electric_isolation"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_card_tpl_enable_electric_isolation", data.enableElectricIsolation);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_enableElectricIsolation"
//					},
//					{
//						//是否启用气体检测 0:否,1:是
//						title: "是否启用气体检测",
//						fieldName: "enableGasDetection",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_card_tpl_enable_gas_detection"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_card_tpl_enable_gas_detection", data.enableGasDetection);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_enableGasDetection"
//					},
//					{
//						//是否启用机械隔离 0:否,1:是
//						title: "是否启用机械隔离",
//						fieldName: "enableMechanicalIsolation",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_card_tpl_enable_mechanical_isolation"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_card_tpl_enable_mechanical_isolation", data.enableMechanicalIsolation);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_enableMechanicalIsolation"
//					},
//					{
//						//是否启用工艺隔离 0:否,1:是
//						title: "是否启用工艺隔离",
//						fieldName: "enableProcessIsolation",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_card_tpl_enable_process_isolation"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_card_tpl_enable_process_isolation", data.enableProcessIsolation);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_enableProcessIsolation"
//					},
//					{
//						//是否需要生产单位现场负责人 0:不需要,1:需要
//						title: "是否需要生产单位现场负责人",
//						fieldName: "enableProdPrin",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_card_tpl_enable_prod_prin"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_card_tpl_enable_prod_prin", data.enableProdPrin);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_enableProdPrin"
//					},
//					{
//						//是否需要相关方负责人 0:不需要,1:需要
//						title: "是否需要相关方负责人",
//						fieldName: "enableRelPin",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_card_tpl_enable_rel_pin"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_card_tpl_enable_rel_pin", data.enableRelPin);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_enableRelPin"
//					},
//					{
//						//是否需要安全教育人  0:不需要,1:需要
//						title: "是否需要安全教育人",
//						fieldName: "enableSafetyEducator",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_card_tpl_enable_safety_educator"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_card_tpl_enable_safety_educator", data.enableSafetyEducator);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_enableSafetyEducator"
//					},
//					{
//						//是否需要安全部门负责人 0:不需要,1:需要
//						title: "是否需要安全部门负责人",
//						fieldName: "enableSecurityPrin",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_card_tpl_enable_security_prin"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_card_tpl_enable_security_prin", data.enableSecurityPrin);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_enableSecurityPrin"
//					},
//					{
//						//是否需要监护人员 0:不需要,1:需要
//						title: "是否需要监护人员",
//						fieldName: "enableSupervisor",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_card_tpl_enable_supervisor"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_card_tpl_enable_supervisor", data.enableSupervisor);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_enableSupervisor"
//					},
//					{
//						//是否启用系统屏蔽 0:否,1:是
//						title: "是否启用系统屏蔽",
//						fieldName: "enableSystemMask",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_card_tpl_enable_system_mask"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_card_tpl_enable_system_mask", data.enableSystemMask);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_enableSystemMask"
//					},
//					{
//						//启用的个人防护设备类型id串
//						title: "启用的个人防护设备类型id串",
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