define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
//	var detailPanel = require("./detail-xl");
    //编辑弹框页面bip (big-info-panel) Legacy模式
//  var detailPanel = require("./detail-tab-xl");
    
	//Legacy模式
//	var auditUnfinishedTaskFormModal = require("componentsEx/formModal/auditUnfinishedTaskFormModal");

	LIB.registerDataDic("audit_unfinished_task_frequency_type", [
		["1","日"],
		["2","月"],
		["3","季"],
		["4","年"],
        ["5","半年"],
        ["6","周"]
	]);

    
    var initDataModel = function () {
        return {
            moduleCode: "auditUnfinishedTask",
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
	                url: "auditunfinishedtask/list{/curPage}{/pageSize}",
	                selectedDatas: [],
                    isSingleCheck:false,
	                columns: [
	                 LIB.tableMgr.column.cb,
                        {
                            title: "计划名称",
                            fieldName: 'auditPlan.name',
                            orderName: "auditPlanId",
                            filterName: "auditPlan.name",
                            fieldType: "link",
                            filterType: "text",
                            fixed:true,
                            width:220
                        },
                        {
                            title: "安全体系名称",
                            fieldName: 'auditTable.name',
                            orderName: "auditTableId",
                            filterName: "auditTable.name",
                            filterType: "text",
                            fixed:true,
                            width:220
                        },
                        {
                            //到期日期
                            title: "到期日期",
                            fieldName: "endDate",
                            fieldType: "link",
                            filterType: "date",
                            fixed:true,
                        },
                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.dept,
                        // {
                        //     title: "企业管理人",
                        //     fieldName: 'scorePeople.name',
                        //     orderName: "scorePeopleId",
                        //     filterName: "scorePeople.username",
                        //     filterType: "text",
                        // },
                        {
                            title: "负责人",
                            fieldName: 'user.name',
                            orderName: "ownerId",
                            filterName: "user.username",
                            filterType: "text",
                        },
	                ],
                    defaultFilterValue : {"criteria.orderValue" : {fieldName : "endDate", orderType : "1"}},
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/auditunfinishedtask/importExcel"
            },
            exportModel : {
                url: "/auditunfinishedtask/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				auditUnfinishedTaskFormModel : {
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
//			"auditunfinishedtaskFormModal":auditUnfinishedTaskFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.auditUnfinishedTaskFormModel.show = true;
//				this.$refs.auditunfinishedtaskFormModal.init("create");
//			},
//			doSaveAuditUnfinishedTask : function(data) {
//				this.doSave(data);
//			}
            doTableCellClick: function(data) {
                if (!!this.showDetail && data.cell.fieldName === "auditPlan.name") {
                    this.showDetail(data.entry.data);
                } else if (!!this.showDetail && data.cell.fieldName === "endDate") {
                    this.showDetail(data.entry.data);
                } else {
                    (!!this.detailModel) && (this.detailModel.show = false);
                }
            },
            doDelete: function() {
                var _this = this;
                var deleteIds = _.map(this.tableModel.selectedDatas, function (row) {
                    return row.id
                });
                LIB.Modal.confirm({
                    title: '确定删除数据?',
                    onOk: function() {
                        api.deleteByIds(null, deleteIds).then(function() {
                            _this.emitMainTableEvent("do_update_row_data", {
                                opType: "remove",
                                value: _this.tableModel.selectedDatas
                            });
                            LIB.Msg.info("删除成功");
                        });
                    }
                });
            },
        },
        events: {
        },
        init: function(){
        	this.$api = api;
        }
    });

    return vm;
});
