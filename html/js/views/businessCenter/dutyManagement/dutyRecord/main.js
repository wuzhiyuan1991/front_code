define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
	var detailPanel = require("../pastDuty/detail-xl");
    //编辑弹框页面bip (big-info-panel) Legacy模式
	//  var detailPanel = require("./detail-tab-xl");
	var modalAdd = require("./modal-add");
	//Legacy模式
	//	var riDutyRecordFormModal = require("componentsEx/formModal/riDutyRecordFormModal");

	LIB.registerDataDic("duty_status", [
		["1","值班中"],
		["2","待接班"],
		["3","值班结束"]
	]);

    var initDataModel = function () {
        return {
            moduleCode: "personalDuty",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                // detailPanelClass : "middle-info-aside"
				detailPanelClass : "large-info-aside",
                dutyStatistics: {ForTheSuccession: null, InTheDuty: null,over: null}

            },
            tableModel: LIB.Opts.extendMainTableOpt(
	            {
	                url: "dutyrecord/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					 LIB.tableMgr.column.company,
					 (function(){
						var obj = _.clone(LIB.tableMgr.column.dept);
						obj.width = '300px';
						return obj;
					 })(),
					//  {
					//  	title: "所属公司",
					//  	fieldName: "compId",
					//  	filterType: "text"
					//  },
					// {
					// 	title: "所属部门",
					// 	fieldName: "orgId",
					// 	filterType: "text"
					// },
					{
						title: "状态",
						fieldName: "status",
						filterName: "criteria.intsValue.status",
						filterType: "enum",
						render:function(data){
							return LIB.getDataDic('duty_status',data.status)
						},
						popFilterEnum: LIB.getDataDicList("duty_status"),
					},
					{
						title: "值班日期",
						fieldName: "dateDuty",
						filterType: "date",
						render: function (data) {
							if(data.dateDuty)
							return data.dateDuty.slice(0,10)
                        }
					},
					// {
					// 	title: "交班人",
					// 	fieldName: "createUser.username",
					// 	filterType: "text"
					// },
					// {
					// 	title: "交班时间",
					// 	fieldName: "submitDate",
					// 	filterType: "date"
					// },
					// {
					// 	title: "接班人",
					// 	fieldName: "receiveUser.username",
					// 	filterType: "text"
					// },
					// {
					// 	title: "接班时间",
					// 	fieldName: "receiveDate",
					// 	filterType: "date"
					// },
					LIB.tableMgr.column.dept,
					 // LIB.tableMgr.column.modifyDate,
					 // LIB.tableMgr.column.createDate,
	                ],
					defaultFilterValue : {'criteria.orderValue':{orderType:'1', fieldName:'e.date_duty desc,e.org_id'}},
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                // url: "/ridutyrecord/importExcel"
            },
            exportModel: {
                url: "/dutyrecord/exportExcel",
                withColumnCfgParam: true
			},
			// Legacy模式
//			formModel : {
//				riDutyRecordFormModel : {
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
			'modalAdd': modalAdd
			//Legacy模式
//			"ridutyrecordFormModal":riDutyRecordFormModal,
        },
        methods: {
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.riDutyRecordFormModel.show = true;
//				this.$refs.ridutyrecordFormModal.init("create");
//			},
//			doSaveRiDutyRecord : function(data) {
//				this.doSave(data);
//			}

            mainEdit: function() {
                if (this.beforeDoUpdate() === false) {
                    return;
                }
                var rows = this.tableModel.selectedDatas;
                if (!_.isEmpty(rows)) {
                    this.showDetail(rows[0], { opType: "update" });
                }
            },
			tableCellClick: function(data) {
				if (!!this.showDetail && data.cell.fieldName == "code") {
					// this.showDetail(data.entry.data);
					this.showDetail(data.entry.data, { opType: "update" });
				} else {
					(!!this.detailModel) && (this.detailModel.show = false);
				}
			},
			doAdd: function(data) {
				this.$refs.selTpl.show();
			},
			mainDelete: function(selectId, index, array) {
			    var _this = this;
				var selectId = this.tableModel.selectedDatas[0].id;
			    LIB.Modal.confirm({
			        title: '确定删除?',
			        onOk: function() {
			            api.deleteRiDutyRecordGroups(null, {id: selectId, orgId:_this.tableModel.selectedDatas[0].orgId }).then(function(data) {
			                if (data.data && data.error != '0') {
			                    return;
			                } else {
			                    // array.splice(index, 1);
			                    LIB.Msg.success("删除成功");
								_this.$refs.mainTable.doRefresh();
			                }
			            })
			        }
			    });
			},
			modalAddSave: function (data) {
				data.workCatalogId=data.workCatalog.id;
				data.workLevelId=data.workLevel?data.workLevel.id:undefined;
				this.$broadcast('ev_dtReload', "create",null,data);
				this.detailModel.show = true;
			},
			// doSavePtwCardTpl : function(data) {
			// 	this.doSave(data);
			// }
			refreshMainTabel: function() {
				var _this = this;
				// _this.refreshMainTableData();
				_this.$refs.mainTable.doRefresh();
			},

            doDataLoaded: function () {
				this.dutyStatistics();
            },

			dutyStatistics: function() {
				var _this = this;
                // var queryStr = LIB.urlEncode(this.$refs.mainTable.getCriteria());
// console.log(this.$refs.mainTable.getCriteria(), queryStr)
                api.dutyStatisticsApi(this.$refs.mainTable.getCriteria()).then(function(res) {
					_this.mainModel.dutyStatistics.ForTheSuccession = res.data.STATUS_TWO  || 0;
                    _this.mainModel.dutyStatistics.InTheDuty = res.data.STATUS_ONE || 0;
                    _this.mainModel.dutyStatistics.over = res.data.STATUS_THREE  || 0;

                })
			},
        },
        init: function(){
        	this.$api = api;
        },
		// s
    });
    return vm;
});