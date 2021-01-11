define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));

    // 弹出层
    var exercisePlanSelectModal = require("componentsEx/selectTableModal/exercisePlanSelectModal");
	var exerciseScheme = require("./dialog/exerciseSchemeSelectModel");

    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");      //修改 detailPanelClass : "middle-info-aside"
    var detailPanel = require("./detail-xl");
    // var detailPanel = require("./detail-tab-xl");
    var initDataModel = function () {
        return {

            moduleCode: "exerciseSchemeeee",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                // detailPanelClass : "middle-info-aside"
				detailPanelClass : "large-info-aside",
                isNewCopy: null, // 是否新增复制的标志
            },
            tableModel: LIB.Opts.extendMainTableOpt(
	            {
	                url: "exercisescheme/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					{
						//状态 0:未发布,1:已发布
						title: "状态",
						fieldName: "status",
						orderName: "status",
						filterName: "criteria.intsValue.status",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iem_exercise_scheme_status"),
						render: function (data) {
							return LIB.getDataDic("iem_exercise_scheme_status", data.status);
						}
					},
					{
						//演练时间
						title: "演练时间",
						fieldName: "exerciseDate",
						filterType: "date",
						render:function (data) {
							var str = '';
							if(data.exerciseDate){
								str = (data.exerciseDate+'').substr(0,16);
							}
							return str;
                        }
					},
					{
						//演练时长（时）
						title: "演练时长",
						fieldName: "hour",
						filterType: "number",
						render:function (data) {
							var str = '';
							if(data.hour){
								str += data.hour + "小时"
							}
                            if(data.minute){
                                str += data.minute + "分钟"
                            }
                            return str;
                        }
					},
					{
						//演练地点
						title: "演练地点",
						fieldName: "exerciseAddress",
						filterType: "text"
					},
					{
						//演练科目类型
						title: "演练科目类型",
						fieldName: "subjectType",
						filterType: "text",
                        // render:function (data) {
                        //     if(data.subjectType){
                        //         var str = data.subjectType.split(",");
                        //         var arr = [];
                        //         _.each(str,function (item) {
                        //             arr.push(LIB.getDataDic("emer_exercise_subjects_type",item))
                        //         });
                        //         return arr.join("，");
                        //     }
                        // }
					},
					{
						//预案类型 1:综合应急预案,2:专项应急预案,3:现场处置方案
						title: "演练类型",
						fieldName: "exercisePlan.emerPlanType",
						orderName: "exercisePlan.emerPlanType",
						filterName: "criteria.intsValue.emerPlanType",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iem_emer_plan_type"),
						render: function (data) {
							if(data.exercisePlan){
                                return LIB.getDataDic("iem_emer_plan_type", data.exercisePlan.emerPlanType);
                            }
                            return '';
						}
					},
					{
						//演练科目
						title: "演练科目",
						fieldName: "subjects",
						filterType: "text"
					},
					{
						//演练形式 1:桌面推演,2:现场演习
						title: "演练形式",
						fieldName: "form",
						orderName: "form",
						filterName: "criteria.intsValue.form",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iem_exercise_scheme_form"),
						render: function (data) {
							return LIB.getDataDic("iem_exercise_scheme_form", data.form);
						}
					},
					// {
					// 	//演练参加人员职责
					// 	title: "演练参加人员职责",
					// 	fieldName: "participantDuty",
					// 	filterType: "text"
					// },

					// {
					// 	//注意事项
					// 	title: "注意事项",
					// 	fieldName: "announcements",
					// 	filterType: "text"
					// },
					// {
					// 	//场景概述
					// 	title: "场景概述",
					// 	fieldName: "scenarioOverview",
					// 	filterType: "text"
					// },
					 // LIB.tableMgr.column.disable,

					// {
					// 	//演练实施步骤
					// 	title: "演练实施步骤",
					// 	fieldName: "executionStep",
					// 	filterType: "text"
					// },
					// {
					// 	title: "演练计划",
					// 	fieldName: "exercisePlan.name",
					// 	orderName: "exercisePlan.name",
					// 	filterType: "text",
					// },

//					{
//						//应急演练组织机构
//						title: "应急演练组织机构",
//						fieldName: "exerciseOrgan",
//						filterType: "text"
//					},


//					{
//						//
//						title: "",
//						fieldName: "purpose",
//						filterType: "text"
//					},
//					 LIB.tableMgr.column.company,
// 					 LIB.tableMgr.column.dept,

//					{
//						//演练时长（分）
//						title: "演练时长（分）",
//						fieldName: "minute",
//						filterType: "number"
//					},
//					{
//						//备注
//						title: "备注",
//						fieldName: "remarks",
//						filterType: "text"
//					},
//					 LIB.tableMgr.column.modifyDate,
////					 LIB.tableMgr.column.createDate,
//
	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/exercisescheme/importExcel"
            },
            exportModel : {
                url: "/exercisescheme/exportExcel",
                withColumnCfgParam: true
            },
            selectModel : {
                exercisePlanSelectModel : {
                    visible : false,
                    filterData : {orgId : null}
                },
				exerciseSchemeSelectModel: {
                	visible:false,
					filterDaata:{orgId: null}
				}
            },
            exercisePlan:null
			//Legacy模式
//			formModel : {
//				exerciseSchemeFormModel : {
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
//			"exerciseschemeFormModal":exerciseSchemeFormModal,
            "exerciseplanSelectModal":exercisePlanSelectModal,
			"exerciseScheme":exerciseScheme
        },
        methods: {
            confirmEnd: function () {
                var _this = this;

                var param = {
                    id: this.tableModel.selectedDatas[0].id,
                    orgId: LIB.user.orgId,
                    compId: LIB.user.compId
                };
                LIB.Modal.confirm({
                    title: "该方案对应的应急演练已经实施结束，确认？",
                    onOk: function () {
                        api.implement(param).then(function (res) {
							LIB.Msg.info("保存成功");
							_this.tableModel.selectedDatas[0].status = '2';
							//_this.$refs.mainTable.doUpdateRowData(  _this.tableModel.selectedDatas[0]);

                        })
                    }
                })
            },
            doShowexerciseSchemeLists : function () {
				this.selectModel.exerciseSchemeSelectModel.visible = true;
            },
            doSaveExerciseScheme : function (selectedDatas) {
                if (selectedDatas) {
                    if (!_.isEmpty(selectedDatas)) {
                        this.showDetail(selectedDatas[0], { opType: "update", action: "copy" });
                        this.mainModel.isNewCopy = true;
                    }
                }
            },
            //显示详情面板
            showDetail: function(row, opts) {
                var opType = (opts && opts.opType) ? opts.opType : "view";
                //this.$broadcast('ev_dtReload', "view", row.id);
                this.$broadcast('ev_dtReload', opType, row.id, row, opts);
                this.detailModel.show = true;
                this.mainModel.isNewCopy = false;
            },
            doShowExercisePlanSelectModal : function() {
                this.selectModel.exercisePlanSelectModel.visible = true;
				this.selectModel.exercisePlanSelectModel.filterData = {status: 1};
            },
            doSaveExercisePlan : function(selectedDatas) {
                if (selectedDatas) {
                	var _this = this;
                    this.exercisePlan = selectedDatas[0];
                    this.$nextTick(function () {
                        _this.doAdd();
                    });
                }
            },
            doPublish:function () {
                var _this = this;

                var param = {
                    id:this.tableModel.selectedDatas[0].id,
                    orgId:LIB.user.orgId,
                    compId:LIB.user.compId
                };
                api.publish(param).then(function (res) {
                    LIB.Msg.info("发布成功");
                    _this.refreshMainTable();
                    // _this.doDeleteTool();
                })
            },

        },
        events: {
        },
        init: function(){
        	this.$api = api;
        },
		route: {
			activate: function (transition) {
				var _this = this;
				var queryObj = transition.to.query;
				if (queryObj.method) {
					if (queryObj.exercisePlanId && queryObj.method === "create") {
						//TODO 以后改成用vuex做,暂时的解决方案
						if (!!window.isClickCreateSchemeBtn) {
							window.isClickCreateSchemeBtn = false;
							api.getExercisePlan({id:queryObj.exercisePlanId}).then(function(res){
								_this.exercisePlan = res.data;
								_this.$nextTick(function () {
									_this.doAdd();
								});
							})
						}
					}
				}
				transition.next();
			}
		}
    });

    return vm;
});
