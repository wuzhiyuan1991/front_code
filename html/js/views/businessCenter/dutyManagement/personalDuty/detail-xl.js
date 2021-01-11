define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	var editor = require("./dialog/processmodal");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	var riDutyRecordGroupFormModal = require("componentsEx/formModal/riDutyRecordGroupFormModal");
	
	var modalSuccession = require("./modal/modal-succession");
	var modalShiftOver = require("./modal/modal-shift-over");
	var modalAddEditProduct = require("./modal/modal-add-edit-product");
	var modalAddEditTelfax = require("./modal/modal-add-edit-telfax");
	var modalAddEditReportrecord = require("./modal/modal-add-edit-reportrecord");
	// var modalExportInfo = require("./modal/modal-export-info");
	var modelMaintainAddEdit = require("./modal/model-maintain-add-edit");
	var modelValveparamAddEdit = require("./modal/model-valveparam-add-edit");

	var processModal = require('./dialog/processmodal');
	
	// 交班内容
	var shiftHandContentParam = function() {
		return {
			id: null,
			dutyRecordId: null,
			equipmStatus: "1",
			equipmStatusVal: null,
			fireEquipm: "1",
			fireEquipmVal: null,
			posiHygiene: "1",
			posiHygieneVal: null,
			toolDatum: "1",
			toolDatumVal: null,
			workingParam: "1",
			workingParamVal: null
		}
	}
	
	LIB.registerDataDic("dutyClasses", [
		["1", "应急值班"],
		["2", "常规值班"],
		["3", "待班"]
	]);
	
	// 初始化数据
	var newVO = function() {
		return {
            id : null,
			code : null,
			name : null,
			// 0: 未禁用, 1: 已禁用
			disable : "0",
			orgId: null,
			compId: null,
			dutyClasses: '1',
			startDate: null,
			endDate: null,
			dutyProductionRecords: null,
			dutyCallsFaxes: null,
			dutyValvechamberRecords: null,
			createUser: null,
			receiveUser: null,
			selectModelType: null,
			
			phone : null,
			//本班流程
			process : null,
			//生产记事
			events : null,
			//阀室看护工汇报阀室情况记录
			record : null,
			//接班时间
			receiveDate : null,
			//状态 1:值班中,2:待接班,3:值班结束
			status : null,
			//交班时间
			submitDate : null,
            processTemplates: null
		}
	};
	// Vue数据
	var dataModel = {
		tempClass: null,
		btnsModel: {
		    show: false
		},
		btnsModelShiftHandover: {
		    show: false
		},
		mainModel : {
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:"",
			
			//验证规则
	        rules:{
				"code" : [LIB.formRuleMgr.length(100)],
				"name" : [LIB.formRuleMgr.require("计划名"),
						  LIB.formRuleMgr.length(100)
				],
				"startDate" : [LIB.formRuleMgr.require("开始时间")],
				"disable" :LIB.formRuleMgr.require("状态"),
				"phone" : [LIB.formRuleMgr.require(""),
						  LIB.formRuleMgr.length(500)
				],
				"process" : [LIB.formRuleMgr.require("本班流程"),
						  LIB.formRuleMgr.length(1000)
				],
				"events" : [LIB.formRuleMgr.require("生产记事"),
						  LIB.formRuleMgr.length(1000)
				],
				"record" : [LIB.formRuleMgr.require("阀室看护工汇报阀室情况记录"),
						  LIB.formRuleMgr.length(100)
				],
				"endDate" : [LIB.formRuleMgr.require("结束时间")],
				"compId" : [LIB.formRuleMgr.require("所属公司")],
				"orgId" : [LIB.formRuleMgr.length(10)],
				"receiveDate" : [LIB.formRuleMgr.allowStrEmpty],
				"status" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"submitDate" : [LIB.formRuleMgr.allowStrEmpty],
	        }
		},
		tableModel : {
			// ============================== 模拟数据 ==============================
			handoverRecords: [
				{
					xh: "1",
					op: "交班",
					opperson: "张三",
					time: "2020-09-12 20:39",
					yj: "--",
				},
				{
					xh: "2",
					op: "接班",
					opperson: "李四",
					time: "2020-09-12 22:03",
					yj: "不同意接班，接班意见：描述**********************************************",
				},
			],
			// ============================== 结束模拟数据 ==============================
			
			// 阀室参数记录
			veparamTable: LIB.Opts.extendDetailTableOpt({
				// url : "dutyrecord/{id}{/dutyRecordItem}",
				// url : "dutyrecord/personal/list{/curPage}{/pageSize}",
				columnsBody: [],
				recordsNums: [],
				columns: [
				{
					title: "阀室号",
					fieldName: "number",
					width: 100
				},
				{
					title: " 天气、其他内容",
					fieldName: "weather",
					width: 180
				},
				// {
				// 	title: "序号",
				// 	fieldType: "sequence",
				// 	width: 80
				// },
				{
					title: "序号",
					fieldName: "sortIndex",
					width: 80
				},
				{
					title: "汇报时间",
					fieldName: "reportTime",
					width: 150,
					render: function(data) {
						if(data.reportTime) {
							return data.reportTime.slice(0, 16);
						}
					}
				},
				{
					title: "温度",
					fieldName: "temperature",
					width: 110
				},
				{
					title: "压力",
					fieldName: "pressure",
					width: 110
				},
				{
					title: "气缸压力",
					fieldName: "cylinderPressure",
					width: 110
				},
				{
					title: "电池电压",
					fieldName: "batteryPressure",
					width: 110
				},
				{
					title: "直流电压",
					fieldName: "directVoltage",
					width: 110
				},
				{
					title : "操作",
					fieldType : "tool",
					toolType : "edit, del",
					width: 100
				}]
			}),
			
			// 维护检修
			maintainTable: LIB.Opts.extendDetailTableOpt({
				columnsBody: [],
				columns: [
					{
						title: "时间",
						fieldName: "time",
						width: 300,
						render: function(data) {
							var startTime = data.startTime;
							var endTime = data.endTime;
							if(data.startTime && data.endTime) { return startTime.slice(0, 16) + " - " + endTime.slice(0, 16) }
						}
					},
					{
						title: "操作维护检修工作记录",
						fieldName: "workRecord",
					},
					{
						title: "作业人员",
						fieldName: "users",
						render: function(data) {
							if(data.workers && data.workers.length>0){
								return data.workers.join('<br>');
							}
							var users = "";
							 _.each(data.users, function(v){
								 users += (v.username + ", ") || "";
							 })
							 users = users.substr(0, users.length - 2);
							 return users;
						}
					},
					{
						title : "操作",
						fieldType : "tool",
						toolType : "edit, del",
						width: 150
					},
				],
			}),
			
			// 生产记事
			dutyRecord: [],
			
			// 工艺站场巡检
			stationInspectTable: [],
			
			// 交班内容
			shiftHandoverContent: shiftHandContentParam(),
			tempShiftHandoverContent: {
				workingParamVal: null,
				toolDatumVal: null,
				fireEquipmVal: null,
				posiHygieneVal: null,
				equipmStatusVal: null
			},
			
			shiftHandoverRecordTable: LIB.Opts.extendDetailTableOpt({
				// url : "ridutyrecord/ridutyrecordgroups/list/{curPage}/{pageSize}?criteria.orderValue.fieldName=orderNo&criteria.orderValue.orderType=0",
				columnsBody: [],
				columns: [
					{
					    title: "序号",
					    fieldType: "sequence",
					    width: 80,
					},
					{
						title: "操作",
						fieldName: "type",
						render: function(data) {
							var type = data.type
							switch (type) {
							    case "1":
							        return "交班"
							    case "2":
							         return "接班"
							    default: 
							        return ""
							} 
						}
					},
					{
						title: "操作人",
						fieldName: "operationUser",
					},
					{
						title: "时间",
						fieldName: "createDate",
					},
					{
						title: "意见",
						fieldName: "reamrk",
					}
				],
			}),
		},
		
		formModel : {
			riDutyRecordGroupFormModel : {
				show : false,
				hiddenFields : ["dutyRecordId"],
				// queryUrl : "ridutyrecord/{id}/ridutyrecordgroup/{riDutyRecordGroupId}"
			},
			rowMaintainModel: {
			    show : false,
			    hiddenFields : ["cardId"],
			    // queryUrl : "opstdstep/{id}/opstdstepitem/{opstdstepitemId}"
			},
			rowValveparamFormModel: {
			    show : false,
			    hiddenFields : ["cardId"],
			    // queryUrl : "opstdstep/{id}/opstdstepitem/{opstdstepitemId}"
			},
			
			// 生产记事 弹框
			addEditProductForm: {
			    show : false,
			    hiddenFields : ["cardId"],
			},
			
			// 重要电话及传真 弹框
			addEditTelfaxForm: {
			    show : false,
			    hiddenFields : ["cardId"],
			},
			
			// 阀室看汇报记录 弹框
			addEditReportrecordForm: {
			    show : false,
			    hiddenFields : ["cardId"],
			}
		},
		cardModel : {
			riDutyRecordGroupCardModel : {
				showContent : true
			},
		},
		selectModel : {},
		editor: {
			show: true
		},
        processModel: {
			show: false
		}
	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth,LIB.VueMixin.detailPanel],
		template: tpl,
		components: {
			'editor': editor,
			"ridutyrecordgroupFormModal": riDutyRecordGroupFormModal,
			"modalSuccession": modalSuccession,
			"modalShiftOver": modalShiftOver,
			"modalAddEditProduct": modalAddEditProduct,
			"modalAddEditTelfax": modalAddEditTelfax,
			"modalAddEditReportrecord": modalAddEditReportrecord,
			// "modalExportInfo": modalExportInfo,
			"modelMaintainAddEdit": modelMaintainAddEdit,
			"modelValveparamAddEdit": modelValveparamAddEdit,
			"processModal": processModal
        },
		data:function(){
			return dataModel;
		},

		methods: {
			newVO : newVO,
			getRecodsUsers: function(recordsUsers){
				if(recordsUsers) {
					return _.pluck(recordsUsers, "name").join(",")
				}
			},
			beforeInit: function() {
				this.$refs.valveparamTable.doClearData();
				this.$refs.maintainTable.doClearData();
			},

			updateColumnsTable: function () {
                if(this.mainModel.vo.status != 1){
                    var obj = _.find(this.tableModel.veparamTable.columns, function (item) {
                        return item.fieldType == 'tool'
                    });
                    if(obj){
                        obj.toolType = '';
                        this.$refs.valveparamTable.refreshColumns();
                    }

                    var obj = _.find(this.tableModel.maintainTable.columns, function (item) {
                        return item.fieldType == 'tool'
                    });
                    if(obj){
                        obj.toolType = '';
                        this.$refs.maintainTable.refreshColumns();
                    }
                }else{
                    var obj = _.find(this.tableModel.veparamTable.columns, function (item) {
                        return item.fieldType == 'tool'
                    });
                    if(obj){
                        obj.toolType = 'edit, del';
                        this.$refs.valveparamTable.refreshColumns();
                    }
                    var obj = _.find(this.tableModel.maintainTable.columns, function (item) {
                        return item.fieldType == 'tool'
                    });
                    if(obj){
                        obj.toolType = 'edit, del';
                        this.$refs.maintainTable.refreshColumns();
                    }
                }
            },
			
			afterInitData: function() {
				// this.$refs.valveparamTable.doQuery({id: this.mainModel.vo.id});
				// this.getDutyInfo();
                this.updateColumnsTable();
				this.showVeparamTable();
				this.showMaintainTable();
				this.stationInspectTable();
				this.shiftHandoverContent();
				this.shiftHandoverRecordTable()
			},
			
			doShowRiDutyRecordGroupFormModal4Create : function(param) {
				this.formModel.riDutyRecordGroupFormModel.show = true;
				this.$refs.ridutyrecordgroupFormModal.init("create");
			},
			doSaveRiDutyRecordGroup: function(data) {
				if (data) {
					var _this = this;
					api.saveRiDutyRecordGroup({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.ridutyrecordgroupTable);
					});
				}
			},
			doUpdateRiDutyRecordGroup : function(data) {
				if (data) {
					var _this = this;
					api.updateRiDutyRecordGroup({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.ridutyrecordgroupTable);
					});
				}
			},
			doRemoveRiDutyRecordGroups : function(item) {
				var _this = this;
				var data = item.entry.data;
				api.removeRiDutyRecordGroups({id : this.mainModel.vo.id}, [{id : data.id}]).then(function() {
					_this.$refs.ridutyrecordgroupTable.doRefresh();
				});
			},
			doMoveRiDutyRecordGroups : function(item) {
				var _this = this;
				var data = item.entry.data;
				var param = {
					id: data.id,
					dutyRecordId : dataModel.mainModel.vo.id
				};
				_.set(param, "criteria.intValue.offset", item.offset);
				api.moveRiDutyRecordGroups({id : this.mainModel.vo.id}, param).then(function() {
					_this.$refs.ridutyrecordgroupTable.doRefresh();
				});
			},
			
			// 值班记录
			editDutyInfo: function() {
				this.tempClass = this.mainModel.vo.dutyClasses;
				this.btnsModel.show = true;
			},
			getDutyInfo: function() {
				var _this = this;
				api.getDutyInfoApi({ id: this.mainModel.vo.id }).then(function(res) {
					_this.tableModel.dutyRecord = res.data;
			    })
			},
			saveDutyInfo: function(data) {
				if (data) {
					var _this = this;
					api.saveDutyInfoApi({
						id: this.mainModel.vo.id,
						dutyClasses: this.mainModel.vo.dutyClasses,
						orgId: this.mainModel.vo.orgId
					}).then(function() {
						LIB.Msg.info("保存成功");
						_this.btnsModel.show = false;
						// _this.refreshTableData(_this.$refs.checkitemTable);
					});
				}
			},
			cancelDutyInfo: function(data) {
                this.mainModel.vo.dutyClasses = this.tempClass
                this.btnsModel.show = false;
			},
			
			// 编辑保存 生产记事
			saveProductRecord: function() {
				var _this = this;
				var param = this.tableModel.shiftHandoverContent;
				if(param.id) {
					api.addProductRecordApi(null, param).then(function(res) {
						LIB.Msg.info("保存成功");
						_this.refreshDutyRecord();
						_this.btnsModel.show = false;
					});
				} else {
					this.addProductRecord(param);
					_this.refreshDutyRecord();
				}
			},
			
			// 生产记事 增、删、改
			addProductRecord: function(data) {
				this.formModel.addEditProductForm.show = true;
				this.$refs.addEditProductTpl.init(null, this.mainModel.vo.id);
			},
			
			editProductRecord: function(param) {
				this.formModel.addEditProductForm.show = true;
				this.$refs.addEditProductTpl.init(param, this.mainModel.vo.id);
			},
			
			delProductRecord: function(item) {
				var _this = this;
				LIB.Modal.confirm({
				    title: "删除当前数据?",
				    onOk: function() {
				        api.delProductRecordApi(null, { id: item.id, orgId: _this.mainModel.vo.orgId }).then(function() {
				            LIB.Msg.success("删除成功");
							// api.getDutyInfoApi({id: this.mainModel.vo.id}).then(function(res){
							// 	_.extend(_this.mainModel.vo, res.data);
							// });
							_this.refreshDutyRecord();
				        })
				    }
				});
			},
			
			// 编辑保存 重要电话及传真
			telfaxTplSave: function() {
				var _this = this;
				var param = this.tableModel.shiftHandoverContent;
				if(param.id) {
					api.addTelFaxApi(null, param).then(function(res) {
						LIB.Msg.info("保存成功");
						_this.refreshDutyRecord();
						_this.btnsModel.show = false;
					});
				} else {
					this.addTelfax(param);
					_this.refreshDutyRecord();
				}
			},
			
			// 重要电话及传真 增、删、改
			addTelfax: function(data) {
				this.formModel.addEditTelfaxForm.show = true;
				this.$refs.addEditTelfaxTpl.init(null, this.mainModel.vo.id);
			},
			
			editTelfax: function(param) {
				this.formModel.addEditTelfaxForm.show = true;
				this.$refs.addEditTelfaxTpl.init(param, this.mainModel.vo.id);
			},
			
			delTelfax: function(item) {
				var _this = this;
				LIB.Modal.confirm({
				    title: "删除当前数据?",
				    onOk: function() {
				        api.delTelFaxApi(null, { id: item.id, orgId: _this.mainModel.vo.orgId }).then(function() {
				            LIB.Msg.success("删除成功");
							_this.refreshDutyRecord();
				        });
				    }
				});
			},
			
			// 编辑保存 阀室汇报记录
			reportrecordTplSave: function() {
				var _this = this;
				var param = this.tableModel.shiftHandoverContent;
				if(param.id) {
					api.addReportRecordApi(null, param).then(function(res) {
						LIB.Msg.info("保存成功");
						_this.refreshDutyRecord();
						_this.btnsModel.show = false;
					});
				} else {
					this.addReportrecord(param);
					_this.refreshDutyRecord();
				}
			},
			
			// 阀室汇报记录 增、删、改
			addReportrecord: function(data) {
				this.formModel.addEditReportrecordForm.show = true;
				this.$refs.addEditReportrecordTpl.init(null, this.mainModel.vo.id);
			},
			
			editReportrecord: function(param) {
				this.formModel.addEditReportrecordForm.show = true;
				this.$refs.addEditReportrecordTpl.init(param, this.mainModel.vo.id);
			},
			
			delportrecord: function(item) {
				var _this = this;
				LIB.Modal.confirm({
				    title: "删除当前数据?",
				    onOk: function() {
				        api.delReportRecordApi(null, { id: item.id, orgId: _this.mainModel.vo.orgId }).then(function() {
				            LIB.Msg.success("删除成功");
							_this.refreshDutyRecord();
				        });
				    }
				});
			},
			
			// 保存 刷新值班记录
			refreshDutyRecord: function() {
				var _this= this;
				api.getDutyInfoApi({id: this.mainModel.vo.id}).then(function(res) {
					_this.mainModel.vo.dutyProductionRecords = [];
					_this.mainModel.vo.dutyCallsFaxes = [];
					_this.mainModel.vo.dutyValvechamberRecords = [];
                    _this.mainModel.vo.processTemplates = [];

                    _this.mainModel.vo.dutyProductionRecords = res.data.dutyProductionRecords;
					_this.mainModel.vo.dutyCallsFaxes = res.data.dutyCallsFaxes;
					_this.mainModel.vo.dutyValvechamberRecords = res.data.dutyValvechamberRecords
                    _this.mainModel.vo.processTemplates = res.data.processTemplates

					// _.extend(_this.mainModel.vo, res.data);
				})
			},
			
			// 阀室参数记录
			addRowValveparam: function(data) {
				// this._groupId = data.entry.id;
			    this.formModel.rowValveparamFormModel.show = true;
			    // this.$refs.modelValveparamAddEditTpl.init("create");
			    this.$refs.modelValveparamAddEditTpl.init(null, this.mainModel.vo.id, this.tableModel.veparamTable.recordsNums);
			},
			editRowValveparam: function(param) {
			    this.formModel.rowValveparamFormModel.show = true;
			    // this.$refs.modelValveparamAddEditTpl.init("update", {id: param.entry.data.stepId, opstdstepitemId: param.entry.data.id});
			    this.$refs.modelValveparamAddEditTpl.init(param, this.mainModel.vo.id, this.tableModel.veparamTable.recordsNums);
			},
			createRefresh: function() {
				this.$refs.valveparamTable.doClearData();
				this.showVeparamTable();
			},
			updateRefresh: function() {
				this.$refs.valveparamTable.doClearData();
				this.showVeparamTable();
			},
			delRowValveparam: function(item) {
			    var _this = this;
			    var data = item.entry.data;
			    LIB.Modal.confirm({
			        title: '删除当前数据?',
			        onOk: function() {
			            api.delVeparamApi(null, {id : data.id, orgId: data.orgId}).then(function() {
			                LIB.Msg.success("删除成功");
							// _this.$refs.valveparamTable.doClearData();
							_this.showVeparamTable();
			            });
			        }
			    });
			},
			
			// 维护检修
			addRowMaintain: function(data) {
				// this._groupId = data.entry.id;
			    this.formModel.rowMaintainModel.show = true;
			    this.$refs.modelMaintainAddEditTpl.init(null, this.mainModel.vo.id);
			},
			editRowMaintain: function(param) {
                var data = param.entry.data;
                if(data.attr == false || data.attr == 'false') { LIB.Msg.info('关联读取系统中的“操作票/检维修卡”操作记录，只能查看，不能编辑或删除')  ; return;}
                this.formModel.rowMaintainModel.show = true;
                this.$refs.modelMaintainAddEditTpl.init(param, this.mainModel.vo.id);
			},
			createRefreshMaintain: function() {
				this.$refs.maintainTable.doClearData();
				this.showMaintainTable();
			},
			updateRefreshMaintain: function() {
				this.$refs.maintainTable.doClearData();
				this.showMaintainTable();
			},
			delRowMaintain: function(item) {
			    var _this = this;
			    var data = item.entry.data;
			    if(data.attr == false || data.attr == 'false') {
                    LIB.Msg.info('关联读取系统中的“操作票/检维修卡”操作记录，只能查看，不能编辑或删除');
                    return ;
				}
			    LIB.Modal.confirm({
			        title: '删除当前数据?',
			        onOk: function() {
			            api.delMaintainApi(null, {id : data.id, orgId: data.orgId}).then(function() {
			                LIB.Msg.success("删除成功");
							_this.showMaintainTable();
			            });
			        }
			    });
			},
			
			// 阀室参数记录
			showVeparamTable: function() {
				var _this = this;
				api.veparamTableApi({
					id: this.mainModel.vo.id,
					// "criteria.orderValue": JSON.stringify({orderType: "1", fieldName: "number"}) 
				}).then(function(res) {
					// LIB.Msg.info("");
					
					var index = 1;
					var data = res.data.ValveRecords;
					// data = _.sortBy(data, function(item) { return item.number });
					for (var i = 0; i < data.length; i++) {
						var item = data[i];
						if (data[i - 1] && data[i - 1].number == data[i].number) {
							item.sortIndex = ++index;
						} else {
							index = 1;
							item.sortIndex = 1;
						}
					};
					
					_this.tableModel.veparamTable.columnsBody = data;
					_this.tableModel.veparamTable.recordsNums = res.data.RecordsNums;
					// _this.refreshTableData(_this.$refs.checkitemTable);
				});
			},
			
			// 维护检修
			showMaintainTable: function(data) {
				var _this = this;
				api.maintainTableApi({
					id: this.mainModel.vo.id,
					"criteria.orderValue": JSON.stringify({ orderType: "1", fieldName: "start-time" })
				}).then(function(res) {
					_this.tableModel.maintainTable.columnsBody = res.data;
				});
			},

			// 工艺站场巡检
			stationInspectTable: function(data) {
				var _this = this;
				api.stationInspectApi({
					id: this.mainModel.vo.id,
                    orderType: "1"
				}).then(function(res) {
					_this.tableModel.stationInspectTable = res.data;
				});
			},
			
			refreshStationInspectTable: function(){
				this.stationInspectTable();
			},
			
			// 查询 交班内容
			shiftHandoverContent: function(data) {
				var _this = this;
				api.shiftHandoverContentApi({
					id: this.mainModel.vo.id,
				}).then(function(res) {
					if(res.data[0] != null && res.data[0] != undefined && res.data[0] != "") {
						_.extend(_this.tableModel.shiftHandoverContent, res.data[0]);
					} else {
						_this.tableModel.shiftHandoverContent = shiftHandContentParam();
					}
				});
			},
			
			// 编辑保存 交班内容
			editShiftHandoverContent: function(data) {
				this.tableModel.tempShiftHandoverContent = _.clone(this.tableModel.shiftHandoverContent)
				this.btnsModelShiftHandover.show = true;
			},
			
			saveShiftHandoverContent: function() {
				var _this = this;
				var param = this.tableModel.shiftHandoverContent;
				
				// 校验单选框是否选中
				if(param.workingParam == "" || param.workingParam == null || param.workingParam == undefined) {
					LIB.Msg.info("请选择运行参数");
					return false;
				} else if (param.toolDatum == "" || param.toolDatum == null || param.toolDatum == undefined) {
					LIB.Msg.info("请选择工具资料");
					return false;
				} else if (param.fireEquipm == "" || param.fireEquipm == null || param.fireEquipm == undefined) {
					LIB.Msg.info("请选择消防器材");
					return false;
				} else if (param.posiHygiene == "" || param.posiHygiene == null || param.posiHygiene == undefined) {
					LIB.Msg.info("请选择岗位卫生");
					return false;
				} else if (param.equipmStatus == "" || param.equipmStatus == null || param.equipmStatus == undefined) {
					LIB.Msg.info("请选择设备状态");
					return false;
				}
				
				// 校验异常表单是否为空
				if(param.workingParam == 2 && (param.workingParamVal == "" || param.workingParamVal == null || param.workingParamVal == undefined)) {
					LIB.Msg.info("请输入异常运行参数");
					return false;
				} else if (param.toolDatum == 2 && (param.toolDatumVal == "" || param.toolDatumVal == null || param.toolDatumVal == undefined)) {
					LIB.Msg.info("请输入缺失工具资料");
					return false;
				} else if (param.fireEquipm == 2 && (param.fireEquipmVal == "" || param.fireEquipmVal == null || param.fireEquipmVal == undefined)) {
					LIB.Msg.info("请输入不合格消防器材");
					return false;
				} else if (param.posiHygiene == 2 && (param.posiHygieneVal == "" || param.posiHygieneVal == null || param.posiHygieneVal == undefined)) {
					LIB.Msg.info("请输入不整洁岗位卫生");
					return false;
				} else if (param.equipmStatus == 2 && (param.equipmStatusVal == "" || param.equipmStatusVal == null || param.equipmStatusVal == undefined)) {
					LIB.Msg.info("请输入异常设备状态");
					return false;
				}
				
				if(param.workingParamVal && param.workingParamVal.length > 200) { 
					LIB.Msg.info("请输入200字以内运行参数说明"); 
					return false;
				} else if (param.toolDatumVal && param.toolDatumVal.length > 200) { 
					LIB.Msg.info("请输入200字以内工具资料说明"); 
					return false; 
				} else if (param.fireEquipmVal && param.fireEquipmVal.length > 200) { 
					LIB.Msg.info("请输入200字以内消防器材说明"); 
					return false;
				} else if (param.posiHygieneVal && param.posiHygieneVal.length > 200) {
					LIB.Msg.info("请输入200字以内岗位卫生说明"); 
					return false;
				} else if (param.equipmStatusVal && param.equipmStatusVal.length > 200) { 
					LIB.Msg.info("请输入200字以内设备状态说明"); 
					return false; 
				};
				
				if(param.id) {
					api.editShiftHandoverContentApi(null, param).then(function(res) {
						LIB.Msg.info("保存成功");
						_this.shiftHandoverContent();
						_this.btnsModelShiftHandover.show = false;
					});
				} else {
					this.addShiftHandoverContent(param)
				}
			},
			
			cancelShiftHandoverContent: function(data) {
				_.extend(this.tableModel.shiftHandoverContent, this.tableModel.tempShiftHandoverContent)
				this.btnsModelShiftHandover.show = false;
			},
			
			// 增加 交班内容
			addShiftHandoverContent: function(param) {
				var _this = this;
				var param = this.tableModel.shiftHandoverContent;
				param.dutyRecordId = this.mainModel.vo.id;
				api.addShiftHandoverContentApi(null, param).then(function(res) {
					LIB.Msg.info("保存成功");
					_this.shiftHandoverContent();
					_this.btnsModelShiftHandover.show = false;
				});
			},
			
			shiftHandoverRecordTable: function(data) {
				var _this = this;
				api.shiftHandoverRecordApi({
					id: this.mainModel.vo.id,
				}).then(function(res) {
					
					_this.tableModel.shiftHandoverRecordTable.columnsBody = res.data;
				});
			},
            delDialog: function (item) {
				var _this = this;
				api.doDelProcess(null, {id: item.id, orgId: this.mainModel.vo.orgId}).then(function (res) {
					LIB.Msg.info('删除成功');
                    _this.refreshDutyRecord();
                })
            },
			doUpdateDialog: function (data) {
                var _this = this
				this.processModel.show = true;
				this.$nextTick(function(){
					_this.$refs.processModal.init(data);
				})
            },
            doAddLastDialog: function () {
				var _this = this;
				api.getLastProcess({id: this.mainModel.vo.id}).then(function (res) {
					if(res.data){
						LIB.Modal.confirm({
							title:'是否覆盖流程图',
							onOk: function () {
								api.toGetLastProcess(null, {id:_this.mainModel.vo.id}).then(function (res) {
									LIB.Msg.info('保存成功');
                                    _this.refreshDutyRecord();
                                })
                            }
						})
					}
                })
            },
			doAddDialog: function() {
				var _this = this
				this.processModel.show = true;
				this.$nextTick(function(){
					_this.$refs.processModal.init({
						id: null,
						type: null,
						name: null,
						source: '2',
						content: JSON.stringify({lines:[],nodes:[]}),
						img: null,
						compId: _this.mainModel.vo.compId,
						recordId: _this.mainModel.vo.id,
						//组织id
						orgId: _this.mainModel.vo.orgId,
					});
				})
			},
            doSaveProcess: function (data) {
				var _this = this;
				if(data.id){
					api.doUpdateProcess({id:this.mainModel.vo.id}, data).then(function (res) {
						LIB.Msg.info('保存成功');
						_this.refreshDutyRecord();
                    })
				}else{
                    api.doCreateProcess({id:this.mainModel.vo.id}, data).then(function (res) {
                        LIB.Msg.info('保存成功');
                        _this.refreshDutyRecord();
                    })
				}
            },
			
			// 显示接班弹框
			succession: function(data) {
				this.$refs.successionTpl.show(this.mainModel.vo);
			},
			
			// 显示交班弹框
			shiftOver: function() {
				this.$refs.shiftOverTpl.show(this.mainModel.vo);
			},
			
			// exportInfo: function(data) {
			// 	this.$refs.exportInfoTpl.show();
			// },
			exportInfo: function(){
				var id = this.mainModel.vo.id;
				LIB.Modal.confirm({
					title: '按页签的先后顺序，导出pdf文件?',
					onOk: function () {
						window.open('/ptwjsamaster/' + id + '/ptwjsadetails/export');
					}
				});
			},
			
			closeDetailModal: function() { this.doClose() }
		},
	
		init: function() {
			this.$api = api;
		},

		ready: function () {
			this.$on('do-save', this.mainModel.vo)
        }
	});
	return detail;
});