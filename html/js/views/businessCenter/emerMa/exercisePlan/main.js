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
//	var exercisePlanFormModal = require("componentsEx/formModal/exercisePlanFormModal");

    var initDataModel = function () {
        return {
            moduleCode: "exercisePlan",
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
	                url: "exerciseplan/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					{
						//计划年份
						title: "计划年份",
						fieldName: "year",
						filterType: "number"
					},
					{
						//预案类型 1:综合应急预案,2:专项应急预案,3:现场处置方案
						title: "预案类型",
						fieldName: "emerPlanType",
						orderName: "emerPlanType",
						filterName: "criteria.intsValue.emerPlanType",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iem_emer_plan_type"),
						render: function (data) {
							return LIB.getDataDic("iem_emer_plan_type", data.emerPlanType);
						}
					},
					{
						//预案所在部门
						title: "演练组织机构",
						fieldName: "emerPlanDept",
						filterType: "text"
					},
					{
						//演练科目
						title: "演练科目",
						fieldName: "subjects",
						filterType: "text"
					},
					{
						//演练形式 1:桌面推演,2:现场演习,3:自行拟定
						title: "演练形式",
						fieldName: "form",
						orderName: "form",
						filterName: "criteria.intsValue.form",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iem_exercise_plan_form"),
						render: function (data) {
							return LIB.getDataDic("iem_exercise_plan_form", data.form);
						}
					},
					{
						//演练时间
						title: "演练日期",
						fieldName: "exerciseStartDate",
						filterType: "date",
						render:function (data) {
							if(data.exerciseStartDate){
								return data.exerciseStartDate.toString().slice(0,10)
							}
                        }
					},
					{
						//演练时间
						title: "演练实施截止日期",
						fieldName: "exerciseEndDate",
						filterType: "date",
                        render:function (data) {
                            if(data.exerciseEndDate){
                                return data.exerciseEndDate.toString().slice(0,10)
                            }
                        }
					},
					{
						title: "演练地点",
						fieldName: "specificAddress",
						filterType: "text",
						render:function (data) {
							var a = '';
							if(data.dominationArea && data.dominationArea.name) a =data.dominationArea.name;
							return a + data.specificAddress;
                        }
					},
					{
						//参演部门/岗位
						title: "参演部门/岗位",
						fieldName: "participant",
						filterType: "text"
					},
					{
						//演练科目类型
						title: "演练科目类型",
						fieldName: "subjectType",
						// filterType: "text"
                        filterName: "criteria.intsValue.subjectType",
                        filterType: "enum",
                        fieldType: "custom",
                        popFilterEnum: LIB.getDataDicList("emer_exercise_subjects_type"),
						render:function (data) {
							var str = '';
							if(data.subjectType && data.subjectType.length>0){
                                for(var i=0;i<data.subjectType.length;i++){
                                    str += LIB.getDataDic("emer_exercise_subjects_type",data.subjectType[i]);
                                    if(i<data.subjectType.length-1){
                                        str+= ','
                                    }
                                }
							}

							return str
                        },
						width:240
					},
					{
						title: "演练负责人",
						fieldName: "userNames",
						orderName: "user.id",
						filterName: "criteria.strValue.username",
						filterType: "text"
					},
					{
						//参演人数（人）
						title: "参演人数（人）",
						fieldName: "participantNumber",
						filterType: "number"
					},
					{
						//状态 0:未发布,1:已发布,2:已失效
						title: "状态",
						fieldName: "status",
						orderName: "status",
						filterName: "criteria.intsValue.status",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iem_exercise_plan_status"),
						render: function (data) {
							return LIB.getDataDic("iem_exercise_plan_status", data.status);
						}
					},
	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/exerciseplan/importExcel"
            },
            exportModel : {
                url: "/exerciseplan/exportExcel",
                withColumnCfgParam: true
            },
			publishSuccessModel: {
				id : null,
				visible: false,
				title: "发布成功"
			},
			//Legacy模式
//			formModel : {
//				exercisePlanFormModel : {
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
//			"exerciseplanFormModal":exercisePlanFormModal,
            
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.exercisePlanFormModel.show = true;
//				this.$refs.exerciseplanFormModal.init("create");
//			},
//			doSaveExercisePlan : function(data) {
//				this.doSave(data);
//			}
			doPublish: function() {
				var _this = this;
				var rows = this.tableModel.selectedDatas;
				if (rows.length == 0) {
					LIB.Msg.warning("请选择数据!");
					return;
				}
				if (rows.length > 1) {
					LIB.Msg.warning("无法批量发布数据");
					return;
				}
				if(rows[0].status != 0) {
					LIB.Msg.warning("当前状态不能发布,请重新选择!");
					return;
				}
				api.publish({id: rows[0].id, orgId:rows[0].orgId}).then(function (res) {
					_this.refreshMainTable();
					_this.publishSuccessModel.visible = true;
					_this.publishSuccessModel.id = rows[0].id;
				});
			},
			doConfirm: function() {
				this.publishSuccessModel.visible = false;
			},
			doCreateScheme: function() {
				window.isClickCreateSchemeBtn = true;
				var routerPart = "/emer/businessCenter/exerciseScheme?method=create&exercisePlanId=" + this.publishSuccessModel.id;
				this.$router.go(routerPart);
				this.publishSuccessModel.visible = false;
				this.publishSuccessModel.id = null;
			},
			doInvalid: function() {
				var _this = this;
				var rows = this.tableModel.selectedDatas;
				if (rows.length == 0) {
					LIB.Msg.warning("请选择数据!");
					return;
				}
				if (rows.length > 1) {
					LIB.Msg.warning("无法批量失效数据");
					return;
				}
				if(rows[0].status != 1) {
					LIB.Msg.warning("当前状态不能失效,请重新选择!");
					return;
				}
				api.invalid({id: rows[0].id, orgId:rows[0].orgId}).then(function (res) {
					_this.refreshMainTable();
					LIB.Msg.info("已失效!");
				});
			},
			//删除table的数据
			doDelete: function() {

				//当beforeDoDelete方法明确返回false时,不继续执行doDelete方法, 返回undefine和true都会执行后续方法
				if (this.beforeDoDelete() == false) {
					return;
				}

				var allowMulti = !!this.tableModel.allowMultiDelete;
				var _this = this;
				// var deleteIds = _.map(this.tableModel.selectedDatas, function (row) {
				//     return row.id
				// });
				if (!allowMulti && this.tableModel.selectedDatas.length > 1) {
					LIB.Msg.warning("一次只能删除一条数据");
					return;
				}
				var _vo = this.tableModel.selectedDatas[0];
				var title = "确定删除数据?";
				if(_vo.status === "1"){
					title = "删除已发布的“演练计划”会删除该计划对应的“演练方案”及方案相关的所有数据，" + title;
				}
				LIB.Modal.confirm({
					title: title,
					onOk: function() {
						_this.$api.remove(null, _vo).then(function() {
							_this.afterDoDelete(_vo);
							_this.emitMainTableEvent("do_update_row_data", {
								opType: "remove",
								value: _this.tableModel.selectedDatas
							});
							LIB.Msg.info("删除成功");
						});
					}
				});
			},

        },
        events: {
        },
        init: function(){
        	this.$api = api;
        }
    });

    return vm;
});
