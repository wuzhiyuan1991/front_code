define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
	var detailPanel = require("./detail-xl");
    //编辑弹框页面bip (big-info-panel) Legacy模式
//  var detailPanel = require("./detail-tab-xl");
    
	//Legacy模式
//	var riskJudgmentTaskFormModal = require("componentsEx/formModal/riskJudgmentTaskFormModal");

    
    var initDataModel = function () {
        return {
            isShowDeps:false,

            moduleCode: "riskJudgmentTask",
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
	                url: "riskjudgmenttask/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 	LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                        {
                            title: "研判人",
                            fieldName: "user.name",
                            orderName: "user.username",
                            filterType: "text",
                        },
                        {
                            title: "研判层级",
                            fieldName: "levelName",
                            filterType: "text"
                        },
					 	LIB.tableMgr.column.company,
                        {
                            title: "研判负责单位",
                            fieldName: "unitName",
                            filterType: "text"
                        },
                        {
                            //额定完成时间
                            title: "额定完成时间",
                            fieldName: "ratedCompleteDate",
                            filterType: "date"
                        },
                        {
                            //完成时间
                            title: "实际完成时间",
                            fieldName: "completeDate",
                            filterType: "date"
                        },
						{
							title: "状态",
							fieldName: "isComplete",
                            fieldType: "custom",
                            popFilterEnum: LIB.getDataDicList("isr_is_complete"),
                            render: function (data) {
                                return LIB.getDataDic("isr_is_complete", data.isComplete);
                            }
						},
                        // {
                        //     title: "下属上报汇总(已完成/总数)",
                        //     fieldName: "num",
                        //     render: function (data) {
                        //         var reportNum = 0;
                        //         if (data.reportNum) {
                        //             reportNum = data.reportNum;
                        //         }
                        //         return reportNum + "/" + data.subordinateNum;
                        //     }
                        // },
					// {
					// 	//风险数
					// 	title: "风险数",
					// 	fieldName: "riskNum",
					// 	filterType: "number"
					// },
//					{
//						//下属Ids
//						title: "下属Ids",
//						fieldName: "subordinateIds",
//						filterType: "text"
//					},
//					{
//						//下级数量
//						title: "下级数量",
//						fieldName: "subordinateNum",
//						filterType: "number"
//					},
//					 LIB.tableMgr.column.modifyDate,
////					 LIB.tableMgr.column.createDate,
//
	                ],
                    defaultFilterValue : {"user.id" : LIB.user.id}
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/riskjudgmenttask/importExcel"
            },
            exportModel : {
                url: "/riskjudgmenttask/exportExcel",
                withColumnCfgParam: true
            },
            filterTabId: 'isComplete1',
            unfinished : 0,
			//Legacy模式
//			formModel : {
//				riskJudgmentTaskFormModel : {
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
//			"riskjudgmenttaskFormModal":riskJudgmentTaskFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.riskJudgmentTaskFormModel.show = true;
//				this.$refs.riskjudgmenttaskFormModal.init("create");
//			},
//			doSaveRiskJudgmentTask : function(data) {
//				this.doSave(data);
//			}
            doFilterBySpecial: function (type, v) {
                this.filterTabId = type + v;
                this._normalizeFilterParam(type, v);
            },
            _normalizeFilterParam: function (type, v) {
                var params = [
                    {
                        value : {
                            columnFilterName : type,
                            columnFilterValue : v
                        },
                        type : "save"
                    }
                ];
                this.$refs.mainTable.doQueryByFilter(params);
            },
            _getCount: function () {
                var _this = this;
                api.getCount().then(function (res) {
                    _this.unfinished = res.data;
                })
            },
            afterDoDetailUpdate: function () {
                this._getCount();
            }
        },
        events: {
        },
        init: function(){
        	this.$api = api;
        },
        attached: function () {
            this._getCount();
        },
        ready: function () {
            this._normalizeFilterParam('isComplete', '1');
        }
    });

    return vm;
});
