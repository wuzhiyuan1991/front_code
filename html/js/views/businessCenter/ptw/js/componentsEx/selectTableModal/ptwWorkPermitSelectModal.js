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
	                url: "ptwworkpermit/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//作业时限结束时间
						title: "作业时限结束时间",
						fieldName: "permitEndTime",
						keywordFilterName: "criteria.strValue.keyWordValue_permitEndTime"
					},
					{
						//作业时限开始时间
						title: "作业时限开始时间",
						fieldName: "permitStartTime",
						keywordFilterName: "criteria.strValue.keyWordValue_permitStartTime"
					},
					{
						title: "授权气体检测员",
						fieldName: "gasInspector.name",
						keywordFilterName: "criteria.strValue.keyWordValue_gasInspector_name"
					},
					{
						title: "作业类型",
						fieldName: "workCatalog.name",
						keywordFilterName: "criteria.strValue.keyWordValue_workCatalog_name"
					},
					{
						title: "作业票模板",
						fieldName: "cardTpl.name",
						keywordFilterName: "criteria.strValue.keyWordValue_cardTpl_name"
					},
					{
						title: "作业票",
						fieldName: "workCard.name",
						keywordFilterName: "criteria.strValue.keyWordValue_workCard_name"
					},
					{
						title: "工作安全分析",
						fieldName: "jsaMaster.name",
						keywordFilterName: "criteria.strValue.keyWordValue_jsaMaster_name"
					},
//					{
//						//作业地点
//						title: "作业地点",
//						fieldName: "workPlace",
//						keywordFilterName: "criteria.strValue.keyWordValue_workPlace"
//					},
//					{
//						//作业内容
//						title: "作业内容",
//						fieldName: "workContent",
//						keywordFilterName: "criteria.strValue.keyWordValue_workContent"
//					},
//					{
//						//是否需要主管部门负责人 0:不需要,1:需要
//						title: "是否需要主管部门负责人",
//						fieldName: "enableDeptPrin",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_work_permit_enable_dept_prin"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_work_permit_enable_dept_prin", data.enableDeptPrin);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_enableDeptPrin"
//					},
//					{
//						//是否启用电气隔离 0:否,1:是
//						title: "是否启用电气隔离",
//						fieldName: "enableElectricIsolation",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_work_permit_enable_electric_isolation"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_work_permit_enable_electric_isolation", data.enableElectricIsolation);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_enableElectricIsolation"
//					},
//					{
//						//是否启用气体检测 0:否,1:是
//						title: "是否启用气体检测",
//						fieldName: "enableGasDetection",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_work_permit_enable_gas_detection"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_work_permit_enable_gas_detection", data.enableGasDetection);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_enableGasDetection"
//					},
//					{
//						//是否启用机械隔离 0:否,1:是
//						title: "是否启用机械隔离",
//						fieldName: "enableMechanicalIsolation",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_work_permit_enable_mechanical_isolation"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_work_permit_enable_mechanical_isolation", data.enableMechanicalIsolation);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_enableMechanicalIsolation"
//					},
//					{
//						//是否启用工艺隔离 0:否,1:是
//						title: "是否启用工艺隔离",
//						fieldName: "enableProcessIsolation",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_work_permit_enable_process_isolation"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_work_permit_enable_process_isolation", data.enableProcessIsolation);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_enableProcessIsolation"
//					},
//					{
//						//是否需要生产单位现场负责人 0:不需要,1:需要
//						title: "是否需要生产单位现场负责人",
//						fieldName: "enableProdPrin",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_work_permit_enable_prod_prin"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_work_permit_enable_prod_prin", data.enableProdPrin);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_enableProdPrin"
//					},
//					{
//						//是否需要相关方负责人 0:不需要,1:需要
//						title: "是否需要相关方负责人",
//						fieldName: "enableRelPin",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_work_permit_enable_rel_pin"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_work_permit_enable_rel_pin", data.enableRelPin);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_enableRelPin"
//					},
//					{
//						//是否需要安全教育人  0:不需要,1:需要
//						title: "是否需要安全教育人",
//						fieldName: "enableSafetyEducator",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_work_permit_enable_safety_educator"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_work_permit_enable_safety_educator", data.enableSafetyEducator);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_enableSafetyEducator"
//					},
//					{
//						//是否需要安全部门负责人 0:不需要,1:需要
//						title: "是否需要安全部门负责人",
//						fieldName: "enableSecurityPrin",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_work_permit_enable_security_prin"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_work_permit_enable_security_prin", data.enableSecurityPrin);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_enableSecurityPrin"
//					},
//					{
//						//是否需要监护人员 0:否,1:是
//						title: "是否需要监护人员",
//						fieldName: "enableSupervisor",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_work_permit_enable_supervisor"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_work_permit_enable_supervisor", data.enableSupervisor);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_enableSupervisor"
//					},
//					{
//						//是否启用系统屏蔽 0:否,1:是
//						title: "是否启用系统屏蔽",
//						fieldName: "enableSystemMask",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_work_permit_enable_system_mask"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_work_permit_enable_system_mask", data.enableSystemMask);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_enableSystemMask"
//					},
//					{
//						//作业中气体检测模式 1:定期检查,2:持续检查
//						title: "作业中气体检测模式",
//						fieldName: "gasCheckType",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_work_permit_gas_check_type"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_work_permit_gas_check_type", data.gasCheckType);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_gasCheckType"
//					},
//					{
//						//许可证编号
//						title: "许可证编号",
//						fieldName: "permitCode",
//						keywordFilterName: "criteria.strValue.keyWordValue_permitCode"
//					},
//					{
//						//启用的个人防护设备类型id串
//						title: "启用的个人防护设备类型id串",
//						fieldName: "ppeCatalogSetting",
//						keywordFilterName: "criteria.strValue.keyWordValue_ppeCatalogSetting"
//					},
//					{
//						//备注
//						title: "备注",
//						fieldName: "remark",
//						keywordFilterName: "criteria.strValue.keyWordValue_remark"
//					},
//					{
//						//作业结果 1:作业取消,2:作业完成,3:作业续签
//						title: "作业结果",
//						fieldName: "result",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_work_permit_result"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_work_permit_result", data.result);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_result"
//					},
//					{
//						//序号（续签时重置，重新填报时更新）
//						title: "序号（续签时重置，重新填报时更新）",
//						fieldName: "serialNum",
//						keywordFilterName: "criteria.strValue.keyWordValue_serialNum"
//					},
//					{
//						//状态 1:填报作业票,2:现场落实,3:作业会签,4:作业批准,5:作业监测,6:待关闭,7:作业取消,8:作业完成,9:作业续签,10:被否决
//						title: "状态",
//						fieldName: "status",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_work_permit_status"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_work_permit_status", data.status);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_status"
//					},
//					{
//						//作业许可有效期结束时间
//						title: "作业许可有效期结束时间",
//						fieldName: "validityEndTime",
//						keywordFilterName: "criteria.strValue.keyWordValue_validityEndTime"
//					},
//					{
//						//作业许可有效期开始时间
//						title: "作业许可有效期开始时间",
//						fieldName: "validityStartTime",
//						keywordFilterName: "criteria.strValue.keyWordValue_validityStartTime"
//					},
//					{
//						//版本号（续签时更新）
//						title: "版本号（续签时更新）",
//						fieldName: "versionNum",
//						keywordFilterName: "criteria.strValue.keyWordValue_versionNum"
//					},
//					{
//						//作业所在设备
//						title: "作业所在设备",
//						fieldName: "workEquipment",
//						keywordFilterName: "criteria.strValue.keyWordValue_workEquipment"
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
		name:"ptwworkpermitSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});