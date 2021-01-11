define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
//	var detailPanel = require("./detail-xl");
    //编辑弹框页面bip (big-info-panel) Legacy模式
//  var detailPanel = require("./detail-tab-xl");
    
	//Legacy模式
//	var todoFormModal = require("componentsEx/formModal/todoFormModal");

	LIB.registerDataDic("system_todo_check_obj_type", [
		["1","属地"],
		["2","设备设施"],
		["1001","重大危险源"],
		["1002","重点化学品"],
		["1003","重点化学工艺"]
	]);

	LIB.registerDataDic("system_todo_data_type", [
		["1","工作流数据"],
		["2","检查计划数据"],
        ["3","巡检数据"],
        ["4","临时工作数据"]
	]);

    LIB.registerDataDic("system_todo_is_complete", [
        ["1","工作流数据"],
        ["2","检查计划数据"],
        ["3","巡检数据"],
        ["4","临时工作数据"]
    ]);

    var initDataModel = function () {
        return {
            moduleCode: "todo",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                // detailPanelClass : "middle-info-aside"
//				detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
	            {
	                url: "todo/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					{
						//事项名称
						title: "事项名称",
						fieldName: "name",
						filterType: "text"
					},
					{
						//事项内容
						title: "事项内容",
						fieldName: "content",
						filterType: "text"
					},
					 LIB.tableMgr.column.company,
					{
						//数据类型 1:工作流数据,2:检查计划数据
						title: "数据类型",
						fieldName: "dataType",
						orderName: "dataType",
						filterName: "criteria.intsValue.dataType",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("system_todo_data_type"),
						render: function (data) {
							return LIB.getDataDic("system_todo_data_type", data.dataType);
						}
					},
					{
						title: "关联信息",
						fieldName: "info",
                        sortable :false,
                        render: function (data) {
                            var res = '';
                            switch(data.dataType) {
                                case '1':
                                    res = data.poolTitle;
                                    break;
                                case '2':
                                    res = data.checkPlanName;
                                    break;
                                case '3':
                                	res = data.riCheckTaskName;
                                	break;
                                case '4':
                                    res = data.ritmpCheckPlanName;
                                    break;
                        	default: '';
                            }
                            return res;
                        }
					},
					{
						title: "发起人",
						fieldName: "createUserName",
                        sortable :false,
                        render: function (data) {
							if (data.createrId && data.createrId === '9999999999') {
								return '9999999999';
							} else {
								return data.createUserName;
							}
                        }
					},
					{
						title: "接收人",
						fieldName: "receiverUserName",
					},
					{
						//截止日期
						title: "截止日期",
						fieldName: "deadLine",
						filterType: "date"
					},
	                ],
                    defaultFilterValue: { "isComplete": 0 }
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/todo/importExcel"
            },
            exportModel : {
                url: "/todo/exportExcel",
                withColumnCfgParam: true
            },
			//Legacy模式
//			formModel : {
//				todoFormModel : {
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
            // "detailPanel": detailPanel,
			//Legacy模式
//			"todoFormModal":todoFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.todoFormModel.show = true;
//				this.$refs.todoFormModal.init("create");
//			},
//			doSaveTodo : function(data) {
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
