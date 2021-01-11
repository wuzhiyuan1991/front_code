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
//	var workPlanFormModal = require("componentsEx/formModal/workPlanFormModal");

    
    var initDataModel = function () {
        return {
            moduleCode: "workPlan",
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
	                url: "workplan/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					{
						//计划名
						title: "工作计划名称",
						fieldName: "name",
						filterType: "text"
					},
                    LIB.tableMgr.column.company,
                    LIB.tableMgr.column.dept,
                        {
                            title: "创建人",
                            fieldName: "user.name",
                            orderName: "createUserId",
                            filterType: "text"
                        },
                    {
                        //开始时间
                        title: "开始时间",
                        fieldName: "startDate",
                        filterType: "date"
                    },
					{
						//结束时间
						title: "结束时间",
						fieldName: "endDate",
						filterType: "date"
					},
					{
						//备注
						title: "备注",
						fieldName: "remarks",
						filterType: "text"
					},
	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/workplan/importExcel"
            },
            exportModel : {
                url: "/workplan/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				workPlanFormModel : {
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
//			"workplanFormModal":workPlanFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.workPlanFormModel.show = true;
//				this.$refs.workplanFormModal.init("create");
//			},
//			doSaveWorkPlan : function(data) {
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
