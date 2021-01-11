define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
//    var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
    var detailPanel = require("./detail-xl");
    //编辑弹框页面bip (big-info-panel) Legacy模式
//  var detailPanel = require("./detail-tab-xl");

    //Legacy模式
//	var checkTaskFormModal = require("componentsEx/formModal/checkTaskFormModal");


    var initDataModel = function () {
        return {
            moduleCode:  LIB.ModuleCode.BC_Hal_InsT,
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
//                detailPanelClass : "middle-info-aside"
                detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "tpachecktask/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [{
                        title: "",
                        fieldName: "id",
                        fieldType: "cb",
                    },
                        {
                            //
                            title: this.$t("gb.common.code"),
                            fieldName: "code",
                            fieldType: "link",
                            filterType: "text"
                        },
                        {
                            title: this.$t("gb.common.checkPlanName"),
                            fieldName: "tpaCheckPlan.name",
                            orderName : "checkPlanId",
                            filterType: "text",
                        },
                        // {
                        //     title : this.$t("gb.common.type"),
                        //     orderName:"attr1",
                        //     fieldType:"custom",
                        //     render: function(data){
                        //         return data.attr1 == "100" ? "证书类" : "资料类";
                        //     },
                        //     popFilterEnum : [{id : "100", value: "证书类"},{id : "200", value: "资料类"}],
                        //     filterType : "enum",
                        //     filterName : "criteria.strsValue.attr1"
                        // },
                        {
                            //检查任务序号
                            title: "检查任务序号",
                            fieldName: "num",
                            filterType: "number"
                        },
                        {
                            //检查人
                            title: "检查人",
                            fieldName: "user.name",
                            orderName : "checkerId",
                            filterType: "text",
                            // filterType: "custom",
                            // render:function(data){
                            // 	if(data.checkUser && data.checkUser.name){
                            // 		return data.checkUser.name
                            // 	}
                            // }
                        },
                        {
                            title : this.$t("gb.common.check"),
                            fieldName : "tpaCheckTable.name",
                            orderName : "checkTableId",
                            filterType: "text",
                            // fieldType:"custom",
                            // render: function(data){
                            // 	if(data.checkTable && data.checkTable.name){
                            // 		return data.checkTable.name;
                            // 	}
                            // }
                            // filterType : "text",
                            // filterName : "criteria.strValue.checktableName"
                        },
                        {
                            //任务状态 默认0未到期 1待执行 2按期执行 3超期执行 4未执行
                            title:this.$t("gb.common.state"),
                            fieldType : "custom",
                            orderName : "status",
                            filterType: "enum",
                            render : function(data){
                                return LIB.getDataDic("check_status",data.status);
                            },
                            filterName : "criteria.intsValue.status",
                            popFilterEnum : LIB.getDataDicList("check_status"),
                            // fieldType:"custom",
                            // render: function(data){
                            //
                            //     // if(data.status == 0){
                            //     //     return "未到期";
                            //     // }else if(data.status == 1){
                            //     //     return "待执行";
                            //     // }else if(data.status == 2){
                            //     //     return "按期执行";
                            //     // }else if(data.status == 3){
                            //     //     return "超期执行";
                            //     // }else if(data.status == 4){
                            //     //     return "未执行";
                            //     // }
                            // }
                        },
                        {
                            //开始时间
                            title: this.$t("gb.common.startTime"),
                            fieldName: "startDate",
                            filterType: "date"
                        },
                        {
                            //结束时间
                            title: this.$t("gb.common.endTime"),
                            fieldName: "endDate",
                            filterType: "date"
                        },
                        {
                            title: "设备设施",
                            orderName: "tpaboatequipment.id",
                            fieldName: "tpaBoatEquipment.name",
                            filterType: "text",
                            filterName: "criteria.strValue.tpaBoatEquipmentName"
                        },

                        //  LIB.tableMgr.column.company,
                        //  LIB.tableMgr.column.company,
                        // {
                        // 	//实际完成时间
                        // 	title: "实际完成时间",
                        // 	fieldName: "checkDate",
                        // 	filterType: "date"
                        // },
                        // {
                        // 	//是否禁用，0未发布，1发布
                        // 	title: "是否禁用，0未发布，1发布",
                        // 	fieldName: "disable",
                        // 	filterType: "text"
                        // },
                        // {
                        // 	//任务序号
                        // 	title: "任务序号",
                        // 	fieldName: "num",
                        // 	filterType: "text"
                        // },
                        // {
                        // 	//任务状态 默认0未到期 1待执行 2按期执行 3超期执行 4未执行
                        // 	title: "任务状态",
                        // 	fieldName: "status",
                        // 	filterType: "text"
                        // },
//					{
//						//修改日期
//						title: "修改日期",
//						fieldName: "modifyDate",
//						filterType: "date"
//					},
//					{
//						//创建日期
//						title: "创建日期",
//						fieldName: "createDate",
//						filterType: "date"
//					},
                    ],
                    defaultFilterValue : {"criteria.orderValue" : {fieldName : "tpacheckplan.modify_date desc,user.username asc,e.num", orderType : "0"}},
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/tpachecktask/importExcel"
            },
            exportModel : {
                url: "/tpachecktask/exportExcel"
            },
            isLateCheckAllowed : false,
            isLateWorkPlanExecute : false,
            isLatePollingPlanExecute : false,
            showPlanType : false,
            //Legacy模式
//			formModel : {
//				checkTaskFormModel : {
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
//			"checktaskFormModal":checkTaskFormModal,

        },
        methods: {
            //Legacy模式
//			doAdd : function(data) {
//				this.formModel.checkTaskFormModel.show = true;
//				this.$refs.checktaskFormModal.init("create");
//			},
//			doSaveCheckTask : function(data) {
//				this.doSave(data);
//			}
            doMakeCheckRecord : function(row) {
                var _this = this;
                var deleteIds = _.map(this.tableModel.selectedDatas, function (row) {
                    return row.id;
                });
                if (deleteIds.length > 1) {
                    LIB.Msg.warning("无法批量执行");
                    return;
                }
                if(this.tableModel.selectedDatas[0].status == 0){
                    LIB.Msg.warning("当前任务未到时间，无法执行!");
                    return false;
                }
                if(this.tableModel.selectedDatas[0].status == 2 || this.tableModel.selectedDatas[0].status == 3){
                    LIB.Msg.warning("当前任务已执行，无法再次执行!");
                    return false;
                }
                this.showPlanType = LIB.setting.fieldSetting["BC_Hal_InsP"] ? true : false;
                if (this.showPlanType){
                    if (this.tableModel.selectedDatas[0].status == 4 && !this.isLateWorkPlanExecute && this.tableModel.selectedDatas[0].checkPlan.planType == 1) {
                        LIB.Msg.warning("当前任务已过期，无法执行!");
                        return false;
                    }
                    if (this.tableModel.selectedDatas[0].status == 4 && !this.isLatePollingPlanExecute && this.tableModel.selectedDatas[0].checkPlan.planType == 2) {
                        LIB.Msg.warning("当前任务已过期，无法执行!");
                        return false;
                    }
                } else {
                    if (this.tableModel.selectedDatas[0].status == 4 && !this.isLateCheckAllowed) {
                        LIB.Msg.warning("当前任务已过期，无法执行!");
                        return false;
                    }
                }
                if (deleteIds.length == 1) {

                    //TODO 以后改成用vuex做,暂时的解决方案
                    window.isClickCheckTaskExecutBtn = true;

                    var routerPart="/certificateCheck/businessCenter/tpaCheckRecord?method=check&checkTaskId="+deleteIds[0];
                    this.$router.go(routerPart);
                }
            }

        },
        events: {
        },
        ready: function(){
            this.$api = api;
            var _this = this;
            if(!!window.isClickCheckTaskExecutBtn) {
                this.detailModel.show = true;
                this.$broadcast('ev_dtReload', null, this.detailModel.id);
                window.isClickCheckTaskExecutBtn = false;
            }
            api.getEnvconfig({type:"BUSINESS_SET"}).then(function(res){
                if(res.body !='E30000' && res.body.checkTaskSet) {
                    _this.isLateCheckAllowed = res.body.checkTaskSet.isLateCheckAllowed  ? true : false;
                    _this.isLateWorkPlanExecute = res.body.checkTaskSet.isLateWorkPlanExecute  ? true : false;
                    _this.isLatePollingPlanExecute = res.body.checkTaskSet.isLatePollingPlanExecute  ? true : false;
                }
            });
        },
        route: {
            activate: function (transition) {
                var queryObj = transition.to.query;
                if(queryObj.id && queryObj.method == "detail" && queryObj.opt == "isClickCheckTaskExecutBtn"){
                    this.detailModel.id = queryObj.id;
                }
                transition.next();
            }
        }
    });

    return vm;
});
