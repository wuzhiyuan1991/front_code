define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");      //修改 detailPanelClass : "middle-info-aside"
    //编辑弹框页面bip (big-info-panel)
    var detailPanel = require("./detail-xl");   //修改 detailPanelClass : "large-info-aside"
    //编辑弹框页面bip (big-info-panel) Legacy模式
//  var detailPanel = require("./detail-tab-xl");//修改 detailPanelClass : "large-info-aside"
    
	//Legacy模式
//	var selfEvaluationTaskFormModal = require("componentsEx/formModal/selfEvaluationTaskFormModal");
    var sumMixin = require("../mixin/sumMixin");

	LIB.registerDataDic("iem_self_evaluation_task_status", [
		["0","未提交"],
		["1","待签名"],
        ["2","已提交"]
	]);

    LIB.registerDataDic("iem_exercise_plan_form", [
        ["1","桌面推演"],
        ["2","现场演习"],
        ["3","自行拟定"]
    ]);

    LIB.registerDataDic("iem_exercise_plan_emer_plan_type", [
        ["1","综合应急预案"],
        ["2","专项应急预案"],
        ["3","现场处置方案"]
    ]);

    
    var initDataModel = function () {
        return {
            moduleCode: "selfEvaluationTask",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass : "middle-info-aside"
                // detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
	            {
	                url: "selfevaluationtask/list{/curPage}{/pageSize}",
	                selectedDatas: [],
                    defaultFilterValue : {"criteria.intsValue.status":["1","2","0"]},
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
                    {
                        //演练时间
                        title: "演练时间",
                        fieldName: "exerciseScheme.exerciseDate",
                        filterName:"exerciseTime",
                        filterType: "date"
                    },
                    {
                        //演练时长
                        title: "演练时长",
                        filterName:"criteria.strValue.exercisePeriod",
                        filterType: "text",
                        fieldType: "custom",
                        render: function(data) {
                            var text = "";
                            if(data.exerciseScheme) {
                                if(data.exerciseScheme.hour > 0) {
                                    text += data.exerciseScheme.hour + "小时";
                                }
                                if(data.exerciseScheme.minute > 0) {
                                    text += data.exerciseScheme.minute + "分钟";
                                }
                            }
                            return text;
                        }
                    },
                    {
                        //演练地点
                        title: "演练地点",
                        fieldName: "exerciseScheme.exerciseAddress",
                        filterType: "text",
                    },
                    {
                        //演练科目类型
                        title: "演练科目类型",
                        fieldName: "exerciseScheme.subjectType",
                        filterType: "text"
                    },
                    {
                        //预案类型 1:综合应急预案,2:专项应急预案,3:现场处置方案
                        title: "演练类型",
                        fieldName: "exercisePlan.emerPlanType",
                        orderName: "exercisePlan.emerPlanType",
                        filterName: "criteria.intsValue.emerPlanType",
                        filterType: "enum",
                        fieldType: "custom",
                        popFilterEnum: LIB.getDataDicList("iem_exercise_plan_emer_plan_type"),
                        render: function (data) {
                            if(data.exercisePlan) {
                                return LIB.getDataDic("iem_exercise_plan_emer_plan_type", data.exercisePlan.emerPlanType);
                            }
                        }
                    },
                    {
						//演练科目
						title: "演练科目",
						fieldName: "exerciseScheme.subjects",
						filterType: "text"
					},
                    {
                        //演练形式 1:桌面推演,2:现场演习,3:自行拟定
                        title: "演练形式",
                        fieldName: "exerciseScheme.form",
                        filterName: "criteria.intsValue.exerciseForm",
                        filterType: "enum",
                        fieldType: "custom",
                        popFilterEnum: LIB.getDataDicList("iem_exercise_plan_form"),
                        render: function (data) {
                            if(data.exerciseScheme) {
                                return LIB.getDataDic("iem_exercise_plan_form", data.exerciseScheme.form);
                            }
                        }
                    },
					{
						//状态 0:未提交,1:待签名,2:已提交
						title: "自评任务状态",
						fieldName: "status",
						orderName: "status",
						filterName: "criteria.intsValue.status",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iem_self_evaluation_task_status"),
						render: function (data) {
							return LIB.getDataDic("iem_self_evaluation_task_status", data.status);
						}
					},
	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/selfevaluationtask/importExcel"
            },
            exportModel : {
                url: "/selfevaluationtask/exportExcel",
                withColumnCfgParam: true
            },

            filterTabId:"3", // 右上角导航栏
			//Legacy模式
//			formModel : {
//				selfEvaluationTaskFormModel : {
//					show : false,
//				}
//			}
            filterTabId: '0',
            todoMap: {
                "0" : null,
                "1" : null,
                "2" : null,
                "3" : null,
            }

        };
    }

    var vm = LIB.VueEx.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel, sumMixin],
		//Legacy模式
//		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainLegacyPanel],
    	template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
			//Legacy模式
//			"selfevaluationtaskFormModal":selfEvaluationTaskFormModal,
            
        },
        methods: {
            doFilterBySpecial: function (val) {
                this.filterTabId =  val;
                this._getUndoCount();
                this._normalizeFilterParam(val);
            },
            _normalizeFilterParam: function (val) {

                if(val == 3){
                    var status = ['1', '2', '0'];
                }else{
                    var status = [(val+'')];
                }

                var params = [
                    {
                        value : {
                            columnFilterName : "criteria.intsValue.status",
                            columnFilterValue :  status
                        },
                        type : "save"
                    }
                ];

                this.$refs.mainTable.doQueryByFilter(params);
            },
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.selfEvaluationTaskFormModel.show = true;
//				this.$refs.selfevaluationtaskFormModal.init("create");
//			},
//			doSaveSelfEvaluationTask : function(data) {
//				this.doSave(data);
//			}
            doFilterBySpecial: function (v) {
                this.filterTabId = (v || '0');
                this._normalizeFilterParam(v);
            },
            _normalizeFilterParam: function (v) {
                var params = [];
                if (v) {
                    params.push({
                        value : {
                            columnFilterName : 'status',
                            columnFilterValue : v
                        },
                        type : "save"
                    })
                } else {
                    params.push({
                        type: "remove",
                        value: {
                            columnFilterName: 'status'
                        }
                    })
                }
                this.$refs.mainTable.doQueryByFilter(params);
            },
            _getUndoCount: function () {
                var _this = this;
                api.getUndoCount().then(function (res) {
                    if(res.data) {
                        _.extend(_this.todoMap, res.data);
                    }
                })
            },
            afterDoDetailUpdate: function () {
                this.onTableDataLoaded();
                this._getUndoCount();
            }

        },
        events: {
        },
        created: function () {
            this._getUndoCount();
        },
        init: function(){
        	this.$api = api;
        },
        ready: function () {
            this.doFilterBySpecial('0');
        }
    });

    return vm;
});
