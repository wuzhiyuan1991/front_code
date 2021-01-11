define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
	var detailPanel = require("./detail-xl");
    var workPlanDelegateComponent = require("./dialog/workPlanDelegate");
    //编辑弹框页面bip (big-info-panel) Legacy模式
//  var detailPanel = require("./detail-tab-xl");
    
	//Legacy模式
//	var workPlanFormModal = require("componentsEx/formModal/workPlanFormModal");
    LIB.registerDataDic("publish_state", [
        ["0", "未发布"],
        ["1", "已发布"],
    ]);
    
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
                    {
                        title: this.$t("gb.common.state"),
                        orderName: "disable",
                        fieldType: "custom",
                        render: function(data) {
                            // if(data.endDate != null && data.disable != null && data.disable == 1 && data.endDate < new Date().Format("yyyy-MM-dd hh:mm:ss")) {
                            //     data.disable = 3;
                            // }
                            return LIB.getDataDic("publish_state", data.disable);
                        },
                        popFilterEnum: LIB.getDataDicList("publish_state"),
                        filterType: "enum",
                        filterName: "criteria.intsValue.disable",
                        width: 100
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
                    LIB.tableMgr.column.company,
                    LIB.tableMgr.column.dept,
                    {
                        title: "负责人",
                        //fieldName: "checkedUser.name",
                        orderName: "checkedUserId",
                        filterType: "text",
                        fieldType: "custom",
                        render: function(data) {
                            if(data){
                                if(data.assigneUser) {
                                    return data.assigneUser.name;
                                }else{
                                    return data.checkedUser.name;
                                }
                            }
                        },
                    },
                    // {
                    //     title: "创建人",
                    //     fieldName: "user.name",
                    //     orderName: "createUserId",
                    //     filterType: "text"
                    // },
                    //
					// {
					// 	//备注
					// 	title: "备注",
					// 	fieldName: "remarks",
					// 	filterType: "text"
					// },
	                ],
                    defaultFilterValue: {"type": 1},
	            }
            ),
            detailModel: {
                show: false
            },
            delegateModel: {
                title: "委托",
                //显示编辑弹框
                show: false,
                workPlanId: null
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
            "work-plan-delegate-component": workPlanDelegateComponent,
			//Legacy模式
//			"workplanFormModal":workPlanFormModal,
            
        },
        methods: {
            doAdd:function(){
                LIB.globalLoader.show();
                var _this =this
                setTimeout(function(){
                    _this.$broadcast('ev_dtReload', "create");
                _this.detailModel.show = true;
                },200)
                
            },
            doDelegate: function (row) {
                if(!row || !_.isString(row.id)) {
                    var rows = this.tableModel.selectedDatas;
                    if (rows.length > 1) {
                        LIB.Msg.warning("无法批量委托");
                        return;
                    }
                    row = rows[0];
                    if(row.disable != 1){
                        LIB.Msg.warning("只能委托已发布的工作计划");
                        return;
                    }
                    if(row.attr1 && row.attr1 != LIB.user.id){
                        LIB.Msg.warning("只能委托自己的工作计划");
                        return;
                    }else if(!row.attr1 && row.checkedUserId && row.checkedUserId != LIB.user.id){
                        LIB.Msg.warning("只能委托自己的工作计划");
                        return;
                    }
                    this.delegateModel.workPlanId = row.id;
                    this.delegateModel.show = true;
                }

            },
        },
        events: {
            "ev_delegate": function () {
                //重新加载数据
                this.emitMainTableEvent("do_update_row_data", {opType: "add"});
                this.delegateModel.show = false;
            },
        },
        init: function(){
        	this.$api = api;
        }
    });

    return vm;
});
