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
//	var riskJudgmentFormModal = require("componentsEx/formModal/riskJudgmentFormModal");

    
    var initDataModel = function () {
        return {
            isShowDeps:false,
            moduleCode: "riskJudgment",
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
	                url: "riskjudgment/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					 LIB.tableMgr.column.company,
                     LIB.tableMgr.column.disable,
                    {
                        //制定时间
                        title: "制定时间",
                        fieldName: "formulateDate",
                        filterType: "date"
                    },
                     LIB.tableMgr.column.modifyDate,
					 LIB.tableMgr.column.remark,
	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/riskjudgment/importExcel"
            },
            exportModel : {
                url: "/riskjudgment/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				riskJudgmentFormModel : {
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
//			"riskjudgmentFormModal":riskJudgmentFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.riskJudgmentFormModel.show = true;
//				this.$refs.riskjudgmentFormModal.init("create");
//			},
//			doSaveRiskJudgment : function(data) {
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
