define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");      //修改 detailPanelClass : "middle-info-aside"
    //编辑弹框页面bip (big-info-panel)
//	var detailPanel = require("./detail-xl");   //修改 detailPanelClass : "large-info-aside"
    //编辑弹框页面bip (big-info-panel) Legacy模式
//  var detailPanel = require("./detail-tab-xl");//修改 detailPanelClass : "large-info-aside"
    
	//Legacy模式
//	var ptwWorkPermitFormModal = require("componentsEx/formModal/ptwWorkPermitFormModal");

	LIB.registerDataDic("iptw_work_permit_enable_dept_prin", [
		["0","不需要"],
		["1","需要"]
	]);

	LIB.registerDataDic("iptw_work_permit_enable_electric_isolation", [
		["0","否"],
		["1","是"]
	]);

	LIB.registerDataDic("iptw_work_permit_enable_gas_detection", [
		["0","否"],
		["1","是"]
	]);

	LIB.registerDataDic("iptw_work_permit_enable_mechanical_isolation", [
		["0","否"],
		["1","是"]
	]);

	LIB.registerDataDic("iptw_work_permit_enable_process_isolation", [
		["0","否"],
		["1","是"]
	]);

	LIB.registerDataDic("iptw_work_permit_enable_prod_prin", [
		["0","不需要"],
		["1","需要"]
	]);

	LIB.registerDataDic("iptw_work_permit_enable_rel_pin", [
		["0","不需要"],
		["1","需要"]
	]);

	LIB.registerDataDic("iptw_work_permit_enable_safety_educator", [
		["0","不需要"],
		["1","需要"]
	]);

	LIB.registerDataDic("iptw_work_permit_enable_security_prin", [
		["0","不需要"],
		["1","需要"]
	]);

	LIB.registerDataDic("iptw_work_permit_enable_supervisor", [
		["0","否"],
		["1","是"]
	]);

	LIB.registerDataDic("iptw_work_permit_enable_system_mask", [
		["0","否"],
		["1","是"]
	]);

	LIB.registerDataDic("iptw_work_permit_gas_check_type", [
		["1","定期检查"],
		["2","持续检查"]
	]);

	LIB.registerDataDic("iptw_work_permit_result", [
		["1","作业取消"],
		["2","作业完成"],
		["3","作业续签"]
	]);

	LIB.registerDataDic("iptw_work_permit_status", [
		["1","申请作业票"],
		["2","现场落实"],
		["3","作业会签"],
		["4","作业批准"],
		["5","作业监测"],
		["6","待关闭"],
		["7","作业取消"],
		["8","作业完成"],
		["9","作业续签"],
		["10","被否决"]
	]);

    
    var initDataModel = function () {
        return {
            moduleCode: "ptwWorkPermit",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass : "middle-info-aside"
//				detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
	            {
	                url: "ptwworkpermit/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					 LIB.tableMgr.column.disable,
					{
						//作业时限结束时间
						title: "作业时限结束时间",
						fieldName: "permitEndTime",
						filterType: "date"
//						fieldType: "custom",
//						render: function (data) {
//							return LIB.formatYMD(data.permitEndTime);
//						}
					},
					{
						//作业时限开始时间
						title: "作业时限开始时间",
						fieldName: "permitStartTime",
						filterType: "date"
//						fieldType: "custom",
//						render: function (data) {
//							return LIB.formatYMD(data.permitStartTime);
//						}
					},
					{
						//作业地点
						title: "作业地点",
						fieldName: "workPlace",
						filterType: "text"
					},
					{
						//作业内容
						title: "作业内容",
						fieldName: "workContent",
						filterType: "text"
					},
					{
						//是否需要主管部门负责人 0:不需要,1:需要
						title: "是否需要主管部门负责人",
						fieldName: "enableDeptPrin",
						orderName: "enableDeptPrin",
						filterName: "criteria.intsValue.enableDeptPrin",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iptw_work_permit_enable_dept_prin"),
						render: function (data) {
							return LIB.getDataDic("iptw_work_permit_enable_dept_prin", data.enableDeptPrin);
						}
					},
					{
						//是否启用电气隔离 0:否,1:是
						title: "是否启用电气隔离",
						fieldName: "enableElectricIsolation",
						orderName: "enableElectricIsolation",
						filterName: "criteria.intsValue.enableElectricIsolation",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iptw_work_permit_enable_electric_isolation"),
						render: function (data) {
							return LIB.getDataDic("iptw_work_permit_enable_electric_isolation", data.enableElectricIsolation);
						}
					},
					{
						//是否启用气体检测 0:否,1:是
						title: "是否启用气体检测",
						fieldName: "enableGasDetection",
						orderName: "enableGasDetection",
						filterName: "criteria.intsValue.enableGasDetection",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iptw_work_permit_enable_gas_detection"),
						render: function (data) {
							return LIB.getDataDic("iptw_work_permit_enable_gas_detection", data.enableGasDetection);
						}
					},
					{
						title: "授权气体检测员",
						fieldName: "gasInspector.name",
						orderName: "user.username",
						filterType: "text",
					},
					{
						title: "作业类型",
						fieldName: "workCatalog.name",
						orderName: "ptwCatalog.name",
						filterType: "text",
					},
					{
						title: "作业票模板",
						fieldName: "cardTpl.name",
						orderName: "ptwCardTpl.name",
						filterType: "text",
					},
					{
						title: "作业票",
						fieldName: "workCard.name",
						orderName: "ptwWorkCard.name",
						filterType: "text",
					},
					{
						title: "工作安全分析",
						fieldName: "jsaMaster.name",
						orderName: "ptwJsaMaster.name",
						filterType: "text",
					},
//					{
//						//是否启用机械隔离 0:否,1:是
//						title: "是否启用机械隔离",
//						fieldName: "enableMechanicalIsolation",
//						orderName: "enableMechanicalIsolation",
//						filterName: "criteria.intsValue.enableMechanicalIsolation",
//						filterType: "enum",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_work_permit_enable_mechanical_isolation"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_work_permit_enable_mechanical_isolation", data.enableMechanicalIsolation);
//						}
//					},
//					{
//						//是否启用工艺隔离 0:否,1:是
//						title: "是否启用工艺隔离",
//						fieldName: "enableProcessIsolation",
//						orderName: "enableProcessIsolation",
//						filterName: "criteria.intsValue.enableProcessIsolation",
//						filterType: "enum",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_work_permit_enable_process_isolation"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_work_permit_enable_process_isolation", data.enableProcessIsolation);
//						}
//					},
//					{
//						//是否需要生产单位现场负责人 0:不需要,1:需要
//						title: "是否需要生产单位现场负责人",
//						fieldName: "enableProdPrin",
//						orderName: "enableProdPrin",
//						filterName: "criteria.intsValue.enableProdPrin",
//						filterType: "enum",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_work_permit_enable_prod_prin"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_work_permit_enable_prod_prin", data.enableProdPrin);
//						}
//					},
//					{
//						//是否需要相关方负责人 0:不需要,1:需要
//						title: "是否需要相关方负责人",
//						fieldName: "enableRelPin",
//						orderName: "enableRelPin",
//						filterName: "criteria.intsValue.enableRelPin",
//						filterType: "enum",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_work_permit_enable_rel_pin"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_work_permit_enable_rel_pin", data.enableRelPin);
//						}
//					},
//					{
//						//是否需要安全教育人  0:不需要,1:需要
//						title: "是否需要安全教育人",
//						fieldName: "enableSafetyEducator",
//						orderName: "enableSafetyEducator",
//						filterName: "criteria.intsValue.enableSafetyEducator",
//						filterType: "enum",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_work_permit_enable_safety_educator"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_work_permit_enable_safety_educator", data.enableSafetyEducator);
//						}
//					},
//					{
//						//是否需要安全部门负责人 0:不需要,1:需要
//						title: "是否需要安全部门负责人",
//						fieldName: "enableSecurityPrin",
//						orderName: "enableSecurityPrin",
//						filterName: "criteria.intsValue.enableSecurityPrin",
//						filterType: "enum",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_work_permit_enable_security_prin"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_work_permit_enable_security_prin", data.enableSecurityPrin);
//						}
//					},
//					{
//						//是否需要监护人员 0:否,1:是
//						title: "是否需要监护人员",
//						fieldName: "enableSupervisor",
//						orderName: "enableSupervisor",
//						filterName: "criteria.intsValue.enableSupervisor",
//						filterType: "enum",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_work_permit_enable_supervisor"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_work_permit_enable_supervisor", data.enableSupervisor);
//						}
//					},
//					{
//						//是否启用系统屏蔽 0:否,1:是
//						title: "是否启用系统屏蔽",
//						fieldName: "enableSystemMask",
//						orderName: "enableSystemMask",
//						filterName: "criteria.intsValue.enableSystemMask",
//						filterType: "enum",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_work_permit_enable_system_mask"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_work_permit_enable_system_mask", data.enableSystemMask);
//						}
//					},
//					{
//						//作业中气体检测模式 1:定期检查,2:持续检查
//						title: "作业中气体检测模式",
//						fieldName: "gasCheckType",
//						orderName: "gasCheckType",
//						filterName: "criteria.intsValue.gasCheckType",
//						filterType: "enum",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_work_permit_gas_check_type"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_work_permit_gas_check_type", data.gasCheckType);
//						}
//					},
//					{
//						//许可证编号
//						title: "许可证编号",
//						fieldName: "permitCode",
//						filterType: "text"
//					},
//					{
//						//启用的个人防护设备类型id串
//						title: "启用的个人防护设备类型id串",
//						fieldName: "ppeCatalogSetting",
//						filterType: "text"
//					},
//					 LIB.tableMgr.column.remark,
////					{
//						//作业结果 1:作业取消,2:作业完成,3:作业续签
//						title: "作业结果",
//						fieldName: "result",
//						orderName: "result",
//						filterName: "criteria.intsValue.result",
//						filterType: "enum",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_work_permit_result"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_work_permit_result", data.result);
//						}
//					},
//					{
//						//序号（续签时重置，重新填报时更新）
//						title: "序号（续签时重置，重新填报时更新）",
//						fieldName: "serialNum",
//						filterType: "number"
//					},
//					{
//						//状态 1:填报作业票,2:现场落实,3:作业会签,4:作业批准,5:作业监测,6:待关闭,7:作业取消,8:作业完成,9:作业续签,10:被否决
//						title: "状态",
//						fieldName: "status",
//						orderName: "status",
//						filterName: "criteria.intsValue.status",
//						filterType: "enum",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_work_permit_status"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_work_permit_status", data.status);
//						}
//					},
//					{
//						//作业许可有效期结束时间
//						title: "作业许可有效期结束时间",
//						fieldName: "validityEndTime",
//						filterType: "date"
////						fieldType: "custom",
////						render: function (data) {
////							return LIB.formatYMD(data.validityEndTime);
////						}
//					},
//					{
//						//作业许可有效期开始时间
//						title: "作业许可有效期开始时间",
//						fieldName: "validityStartTime",
//						filterType: "date"
////						fieldType: "custom",
////						render: function (data) {
////							return LIB.formatYMD(data.validityStartTime);
////						}
//					},
//					{
//						//版本号（续签时更新）
//						title: "版本号（续签时更新）",
//						fieldName: "versionNum",
//						filterType: "number"
//					},
//					{
//						//作业所在设备
//						title: "作业所在设备",
//						fieldName: "workEquipment",
//						filterType: "text"
//					},
//					 LIB.tableMgr.column.modifyDate,
////					 LIB.tableMgr.column.createDate,
//
	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/ptwworkpermit/importExcel"
            },
            exportModel : {
                url: "/ptwworkpermit/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				ptwWorkPermitFormModel : {
//					show : false,
//				}
//			}

        };
    }

    var vm = LIB.VueEx.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
		//Legacy模式
//		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainLegacyPanel],
    	template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
			//Legacy模式
//			"ptwworkpermitFormModal":ptwWorkPermitFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.ptwWorkPermitFormModel.show = true;
//				this.$refs.ptwworkpermitFormModal.init("create");
//			},
//			doSavePtwWorkPermit : function(data) {
//				this.doSave(data);
//			}

        },
        events: {
        },
        init: function(){
        	this.$api = api;
        }
    });

    return vm;
});
