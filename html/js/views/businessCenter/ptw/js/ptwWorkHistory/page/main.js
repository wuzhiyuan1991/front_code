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
//	var ptwWorkHistoryFormModal = require("componentsEx/formModal/ptwWorkHistoryFormModal");

	LIB.registerDataDic("iptw_work_history_operation_type", [
		["1","作业预约"],
		["2","作业审核"],
		["3","填写作业票"],
		["4","能量隔离"],
		["5","作业前气体检测"],
		["6","措施落实"],
		["7","作业会签"],
		["8","作业批准"],
		["9","安全教育"],
		["10","作业中气体检测"],
		["11","作业监控"],
		["12","能量隔离解除"],
		["13","作业关闭签字"],
		["14","作业关闭"]
	]);

	LIB.registerDataDic("iptw_work_history_isolation_type", [
		["1","工艺隔离"],
		["2","机械隔离"],
		["3","电气隔离"],
		["4","系统屏蔽"]
	]);

	LIB.registerDataDic("iptw_work_history_result_type", [
		["1","作业完成"],
		["2","作业取消"],
		["3","作业续签"]
	]);

	LIB.registerDataDic("iptw_work_history_sign_type", [
		["1","作业申请人"],
		["2","作业负责人"],
		["3","作业监护人"],
		["4","生产单位现场负责人"],
		["5","主管部门负责人"],
		["6","安全部门负责人"],
		["7","相关方负责人"],
		["8","许可批准人"]
	]);

    
    var initDataModel = function () {
        return {
            moduleCode: "ptwWorkHistory",
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
	                url: "ptwworkhistory/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					{
						//操作类型 1:作业预约,2:作业审核,3:填写作业票,4:能量隔离,5:作业前气体检测,6:措施落实,7:作业会签,8:作业批准,9:安全教育,10:作业中气体检测,11:作业监控,12:能量隔离解除,13:作业关闭签字,14:作业关闭
						title: "操作类型",
						fieldName: "operationType",
						orderName: "operationType",
						filterName: "criteria.intsValue.operationType",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iptw_work_history_operation_type"),
						render: function (data) {
							return LIB.getDataDic("iptw_work_history_operation_type", data.operationType);
						}
					},
					 LIB.tableMgr.column.disable,
					{
						//操作时间
						title: "操作时间",
						fieldName: "operateTime",
						filterType: "date"
//						fieldType: "custom",
//						render: function (data) {
//							return LIB.formatYMD(data.operateTime);
//						}
					},
					{
						//操作时作业状态  1:作业预约,2:待审核,3:待填报,4:待核对,5:待会签,6:待批准,7:作业中,8:待关闭,9:已取消,10:已完成,11:已否决
						title: "操作时作业状态",
						fieldName: "workStatus",
						orderName: "workStatus",
						filterName: "criteria.intsValue.workStatus",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iptw_work_status"),
						render: function (data) {
							return LIB.getDataDic("iptw_work_status", data.workStatus);
						}
					},
					{
						//隔离类型 1:工艺隔离,2:机械隔离,3:电气隔离,4:系统屏蔽
						title: "隔离类型",
						fieldName: "isolationType",
						orderName: "isolationType",
						filterName: "criteria.intsValue.isolationType",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iptw_work_history_isolation_type"),
						render: function (data) {
							return LIB.getDataDic("iptw_work_history_isolation_type", data.isolationType);
						}
					},
					{
						//作业结果 1:作业完成,2:作业取消,3:作业续签
						title: "作业结果",
						fieldName: "resultType",
						orderName: "resultType",
						filterName: "criteria.intsValue.resultType",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iptw_work_history_result_type"),
						render: function (data) {
							return LIB.getDataDic("iptw_work_history_result_type", data.resultType);
						}
					},
					{
						//会签类型 1:作业申请人,2:作业负责人,3:作业监护人,4:生产单位现场负责人,5:主管部门负责人,6:安全部门负责人,7:相关方负责人,8:许可批准人
						title: "会签类型",
						fieldName: "signType",
						orderName: "signType",
						filterName: "criteria.intsValue.signType",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iptw_work_history_sign_type"),
						render: function (data) {
							return LIB.getDataDic("iptw_work_history_sign_type", data.signType);
						}
					},
					 LIB.tableMgr.column.modifyDate,
					{
						title: "操作人",
						fieldName: "operator.name",
						orderName: "user.username",
						filterType: "text",
					},
					{
						title: "隔离信息",
						fieldName: "workIsolation.name",
						orderName: "ptwWorkIsolation.name",
						filterType: "text",
					},
					{
						title: "作业票",
						fieldName: "workCard.name",
						orderName: "ptwWorkCard.name",
						filterType: "text",
					},
					{
						title: "作业许可",
						fieldName: "workPermit.name",
						orderName: "ptwWorkPermit.name",
						filterType: "text",
					},
					{
						title: "会签信息",
						fieldName: "workPersonnel.name",
						orderName: "ptwWorkPersonnel.name",
						filterType: "text",
					},
//					 LIB.tableMgr.column.createDate,
//
	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/ptwworkhistory/importExcel"
            },
            exportModel : {
                url: "/ptwworkhistory/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				ptwWorkHistoryFormModel : {
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
//			"ptwworkhistoryFormModal":ptwWorkHistoryFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.ptwWorkHistoryFormModel.show = true;
//				this.$refs.ptwworkhistoryFormModal.init("create");
//			},
//			doSavePtwWorkHistory : function(data) {
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
