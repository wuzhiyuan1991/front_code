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
//	var ptwWorkCardFormModal = require("componentsEx/formModal/ptwWorkCardFormModal");

	LIB.registerDataDic("iptw_work_card_enable_reservation", [
		["0","否"],
		["1","是"]
	]);

	LIB.registerDataDic("iptw_work_card_audit_result", [
		["0","未评审"],
		["1","不通过"],
		["2","通过"]
	]);

	LIB.registerDataDic("iptw_work_card_status", [
		["1","作业预约"],
		["2","作业评审"],
		["3","填报作业票"],
		["4","现场落实"],
		["5","作业会签"],
		["6","作业批准"],
		["7","作业监测"],
		["8","待关闭"],
		["9","作业取消"],
		["10","作业完成"],
		["11","已否决"]
	]);

    
    var initDataModel = function () {
        return {
            moduleCode: "ptwWorkCard",
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
	                url: "ptwworkcard/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					{
						//作业开始时间
						title: "作业开始时间",
						fieldName: "workStartTime",
						filterType: "date"
//						fieldType: "custom",
//						render: function (data) {
//							return LIB.formatYMD(data.workStartTime);
//						}
					},
					 LIB.tableMgr.column.disable,
					{
						//作业地点
						title: "作业地点",
						fieldName: "workPlace",
						filterType: "text"
					},
					{
						//作业结束时间
						title: "作业结束时间",
						fieldName: "workEndTime",
						filterType: "date"
//						fieldType: "custom",
//						render: function (data) {
//							return LIB.formatYMD(data.workEndTime);
//						}
					},
					{
						//是否启用预约机制 0:否,1:是
						title: "是否启用预约机制",
						fieldName: "enableReservation",
						orderName: "enableReservation",
						filterName: "criteria.intsValue.enableReservation",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iptw_work_card_enable_reservation"),
						render: function (data) {
							return LIB.getDataDic("iptw_work_card_enable_reservation", data.enableReservation);
						}
					},
					{
						//作业内容
						title: "作业内容",
						fieldName: "workContent",
						filterType: "text"
					},
					 LIB.tableMgr.column.company,
					 LIB.tableMgr.column.dept,
					{
						title: "作业类型",
						fieldName: "workCatalog.name",
						orderName: "ptwCatalog.name",
						filterType: "text",
					},
					{
						title: "评审人",
						fieldName: "auditor.name",
						orderName: "user.username",
						filterType: "text",
					},
//					{
//						//评审意见
//						title: "评审意见",
//						fieldName: "auditOpinion",
//						filterType: "text"
//					},
//					{
//						//评审结果 0:未评审,1:不通过,2:通过
//						title: "评审结果",
//						fieldName: "auditResult",
//						orderName: "auditResult",
//						filterName: "criteria.intsValue.auditResult",
//						filterType: "enum",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_work_card_audit_result"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_work_card_audit_result", data.auditResult);
//						}
//					},
//					{
//						//评审时间
//						title: "评审时间",
//						fieldName: "auditTime",
//						filterType: "date"
////						fieldType: "custom",
////						render: function (data) {
////							return LIB.formatYMD(data.auditTime);
////						}
//					},
//					{
//						//作业状态  1:作业预约,2:作业评审,3:填报作业票,4:现场落实,5:作业会签,6:作业批准,7:作业监测,8:待关闭,9:作业取消,10:作业完成,11:已否决
//						title: "作业状态",
//						fieldName: "status",
//						orderName: "status",
//						filterName: "criteria.intsValue.status",
//						filterType: "enum",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iptw_work_card_status"),
//						render: function (data) {
//							return LIB.getDataDic("iptw_work_card_status", data.status);
//						}
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
                url: "/ptwworkcard/importExcel"
            },
            exportModel : {
                url: "/ptwworkcard/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				ptwWorkCardFormModel : {
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
//			"ptwworkcardFormModal":ptwWorkCardFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.ptwWorkCardFormModel.show = true;
//				this.$refs.ptwworkcardFormModal.init("create");
//			},
//			doSavePtwWorkCard : function(data) {
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
