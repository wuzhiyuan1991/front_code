define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");      //修改 detailPanelClass : "middle-info-aside"
    //编辑弹框页面bip (big-info-panel)
	var detailPanel = require("./detail-xl");   //修改 detailPanelClass : "large-info-aside"
	var dateUtils = require("../../../../tools/dateUtils");
    //编辑弹框页面bip (big-info-panel) Legacy模式
//  var detailPanel = require("./detail-tab-xl");//修改 detailPanelClass : "large-info-aside"
    
	//Legacy模式
//	var iraRiskJudgmentFormModal = require("componentsEx/formModal/iraRiskJudgmentFormModal");

	var importProgress = require("componentsEx/importProgress/main");

	var now = new Date().Format("yyyy-MM-dd hh:mm:ss");

    var initDataModel = function () {
        return {
            moduleCode: "iraRiskJudgment",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                // detailPanelClass : "middle-info-aside"
				detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
				{
					url: "irariskjudgment/list{/curPage}{/pageSize}",
					selectedDatas: [],
					columns: [
						LIB.tableMgr.column.cb,
						LIB.tableMgr.column.code,
						{
							//作业分类
							title: "作业分类",
							fieldName: "operationType",
							fieldType: "custom",
							render: function (data) {
								if (data.iraRiskJudgmentOptypeVos) {
									return _.pluck(data.iraRiskJudgmentOptypeVos, "name").join("、")
								}
							}
						},
						{
							//作业名称
							title: "作业名称",
							fieldName: "operationName",
							filterType: "text"
						},
						{
							title: "作业区域",
							fieldName: "dominationAreaName",
							fieldType: "custom",
							render: function (data) {
								if (data.dominationAreas) {
									return _.pluck(data.dominationAreas, "name").join("、")
								}
							}
						},
						{
							title: "风险等级",
							fieldName: "riskLevel",
							fieldType: "custom",
							filterType: "enum",
							filterName: "criteria.intsValue.riskLevel",
							popFilterEnum : LIB.getDataDicList("risk_level_result"),
							render: function (data) {
								if (data.riskLevel) {
									var resultColor = LIB.getDataDic("risk_level_result_color", data.riskLevel);
									return "<span style='background:" + resultColor + ";color:" + resultColor + ";margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" + LIB.getDataDic("risk_level_result", data.riskLevel);
								} else {
									return "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" + "无";
								}

							},
						},
						{
							//作业开始时间
							title: "作业开始时间",
							fieldName: "operationStartDate",
							filterType: "date",
							fieldType: "custom",
							render: function (data) {
								return LIB.formatYMD(data.operationStartDate);
							}
						},
						{
							//作业结束时间
							title: "作业结束时间",
							fieldName: "operationEndDate",
							filterType: "date",
							fieldType: "custom",
							render: function (data) {
								return LIB.formatYMD(data.operationEndDate);
							}
						},
						{
							//风险研判内容
							title: "存在风险",
							fieldName: "content",
							filterType: "text"
						},
						{
							title: "控制措施",
							fieldName: "controls",
							filterType: "text"
						},
						{
							//状态0-待执行；1-已结束
							title: "状态",
							fieldName: "status",
							fieldType: "custom",
							render: function (data) {
								if(data.operationStartDate != null && data.operationEndDate != null && data.status != null){
									if (data.status == 0 && data.operationStartDate < now && data.operationEndDate > now) {
										data.status = 1;//执行中
									}
									if (data.operationEndDate < now) {
										data.status = 2;//已结束
									}
								}
								return LIB.getDataDic("ira_risk_judgm_status",data.status);
							},
						},
						LIB.tableMgr.column.company,
						LIB.tableMgr.column.dept,
					],
					defaultFilterValue: {
						"criteria.dateValue" : {
							startOperationStartDate:dateUtils.getMonthFirstDay().Format("yyyy-MM-dd 00:00:00"),
							endOperationStartDate:dateUtils.getMonthLastDay().Format("yyyy-MM-dd 23:59:59")
						}
					}
				}
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/irariskjudgment/importExcel"
            },
            exportModel : {
                url: "/irariskjudgment/exportExcel",
                withColumnCfgParam: true
            },
			templete : {
				url: "/irariskjudgment/file/down"
			},
			importProgress:{
				show: false
			},
			filterTabId:"all",
			//Legacy模式
//			formModel : {
//				iraRiskJudgmentFormModel : {
//					show : false,
//				}
//			}
			defaultDate:new Date()
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
			"importprogress":importProgress
			//Legacy模式
//			"irariskjudgmentFormModal":iraRiskJudgmentFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.iraRiskJudgmentFormModel.show = true;
//				this.$refs.irariskjudgmentFormModal.init("create");
//			},
//			doSaveIraRiskJudgment : function(data) {
//				this.doSave(data);
//			}
			doImport:function(){
				var _this=this;
				_this.importProgress.show = true;
			},
			changeQryMonth:function(month){
				var data = {};
				if(month){
					data["criteria.dateValue"] = {
						startOperationStartDate:month+'-01 00:00:00',
						endOperationStartDate:dateUtils.getMonthLastDay(new Date(month+'-20 23:59:59')).Format("yyyy-MM-dd 23:59:59")
					};
				}else{
					data["criteria.dateValue"] = {};
				}
				this.$refs.mainTable.doQuery(data);
			},
			doFilterByStatus:function (status) {
				this.filterTabId = status;
				this._normalizeFilterParam(status);
			},
			_normalizeFilterParam: function (status) {
				var params = [];
				params.push({
					value : {
						columnFilterName : "criteria.strValue.filterFlag",
						columnFilterValue : status
					},
					type : "save"
				});
				this.$refs.mainTable.doQueryByFilter(params);
			},
        },
        events: {
        },
        init: function(){
        	this.$api = api;
        },
		ready: function() {
			var _this = this;
			if(this.$route.query.method === 'select') {
				if(this.$route.query.code && this.$route.query.date) {
					var codeColumn = this.tableModel.columns.filter(function (item) {
						return item.fieldName === "code";
					});
					if(codeColumn.length === 1) {
						this.$refs.mainTable.doOkActionInFilterPoptip(null, codeColumn[0], this.$route.query.code);
						this.$nextTick(function () {
							_this.defaultDate = (new Date(this.$route.query.date)).Format("yyyy-MM");
							this.changeQryMonth(_this.defaultDate);
						});

					}
				}
			}
		},
    });

    return vm;
});
