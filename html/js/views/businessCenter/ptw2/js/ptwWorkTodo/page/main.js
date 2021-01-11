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
//	var ptwWorkTodoFormModal = require("componentsEx/formModal/ptwWorkTodoFormModal");

	LIB.registerDataDic("iptw_work_todo_type", [
		["1","作业评审"],
		["2","填写作业票"],
		["3","隔离实施"],
		["4","作业前气体检测"],
		["5","措施落实"],
		["6","作业会签"],
		["7","作业批准"],
		["8","安全教育"],
		["9","作业中气体检测"],
		["10","作业监控"],
		["11","隔离解除"],
		["12","作业关闭"]
	]);

	LIB.registerDataDic("iptw_work_todo_status", [
		["0","待执行"],
		["1","已执行"]
	]);

    
    var initDataModel = function () {
        return {
            moduleCode: "ptwWorkTodo",
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
	                url: "ptwworktodo/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					 LIB.tableMgr.column.disable,
					{
						//待办类型 1:作业评审,2:填写作业票,3:隔离实施,4:作业前气体检测,5:措施落实,6:作业会签,7:作业批准,8:安全教育,9:作业中气体检测,10:作业监控,11:隔离解除,12:作业关闭
						title: "待办类型",
						fieldName: "type",
						orderName: "type",
						filterName: "criteria.intsValue.type",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iptw_work_todo_type"),
						render: function (data) {
							return LIB.getDataDic("iptw_work_todo_type", data.type);
						}
					},
					{
						//完成时间
						title: "完成时间",
						fieldName: "completeTime",
						filterType: "date"
//						fieldType: "custom",
//						render: function (data) {
//							return LIB.formatYMD(data.completeTime);
//						}
					},
					{
						//状态 0:待执行,1:已执行
						title: "状态",
						fieldName: "status",
						orderName: "status",
						filterName: "criteria.intsValue.status",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iptw_work_todo_status"),
						render: function (data) {
							return LIB.getDataDic("iptw_work_todo_status", data.status);
						}
					},
					 LIB.tableMgr.column.modifyDate,
					 LIB.tableMgr.column.createDate,

	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/ptwworktodo/importExcel"
            },
            exportModel : {
                url: "/ptwworktodo/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				ptwWorkTodoFormModel : {
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
//			"ptwworktodoFormModal":ptwWorkTodoFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.ptwWorkTodoFormModel.show = true;
//				this.$refs.ptwworktodoFormModal.init("create");
//			},
//			doSavePtwWorkTodo : function(data) {
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
