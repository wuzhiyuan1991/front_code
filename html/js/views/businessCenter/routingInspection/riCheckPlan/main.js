define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
	var detailPanel = require("./detail-xl");
    var sumMixin = require("../mixin/sumMixin");

	require('base').setting.dataDic["iri_check_plan_check_in_order"] = {
		"0":"否",
		"1":"是"
	};

	require('base').setting.dataDic["iri_check_plan_check_type"] = {
		"0":"执行一次",
		"1":"重复执行"
	};

    LIB.registerDataDic("ri_check_plan_status", [
        ["0", "待提交"],
        ["1", "待审核"],
        ["2", "已审核"]
    ]);

    var initDataModel = function () {
        return {
            moduleCode: "riCheckPlan",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                // detailPanelClass : "middle-info-aside"
				detailPanelClass : "large-info-aside",
                showTempSetting: true
            },
            tableModel: LIB.Opts.extendMainTableOpt(
	            {
	                url: "richeckplan/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					{
						//计划名
						title: "巡检计划名称",
						fieldName: "name",
						filterType: "text"
					},
					{
						title: "巡检表",
						fieldName: "riCheckTable.name",
						orderName: "riCheckTable.name",
						filterType: "text",
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
                        //审核状态 0:待提交,1:待审核,2:已审核
                        title: "审核状态",
                        fieldName: "status",
                        orderName: "status",
                        filterName: "criteria.intsValue.status",
                        filterType: "enum",
                        fieldType: "custom",
                        popFilterEnum: LIB.getDataDicList("ri_check_plan_status"),
                        render: function (data) {
                            return LIB.getDataDic("ri_check_plan_status", data.status);
                        }
                    },
					{
						title: this.$t("gb.common.state"),
						orderName: "disable",
						fieldType: "custom",
						render: function(data) {
							return LIB.getDataDic("isPublished", data.disable);
						},
						popFilterEnum: LIB.getDataDicList("isPublished"),
						filterType: "enum",
						filterName: "criteria.intsValue.disable",
						width: 100
					},
					// {
					// 	//是否按秩序执行检查 0:否,1:是
					// 	title: "是否按秩序执行检查",
					// 	fieldName: "checkInOrder",
					// 	orderName: "checkInOrder",
					// 	filterName: "criteria.intsValue.checkInOrder",
					// 	filterType: "enum",
					// 	fieldType: "custom",
					// 	popFilterEnum: LIB.getDataDicList("iri_check_plan_check_in_order"),
					// 	render: function (data) {
					// 		return LIB.getDataDic("iri_check_plan_check_in_order", data.checkInOrder);
					// 	}
					// },
					// {
					// 	//频率类型 0:执行一次,1:重复执行
					// 	title: "频率类型",
					// 	fieldName: "checkType",
					// 	orderName: "checkType",
					// 	filterName: "criteria.intsValue.checkType",
					// 	filterType: "enum",
					// 	fieldType: "custom",
					// 	popFilterEnum: LIB.getDataDicList("iri_check_plan_check_type"),
					// 	render: function (data) {
					// 		return LIB.getDataDic("iri_check_plan_check_type", data.checkType);
					// 	}
					// },
					// {
					// 	title: "巡检计划配置",
					// 	fieldName: "riCheckPlanSetting.name",
					// 	orderName: "riCheckPlanSetting.name",
					// 	filterType: "text",
					// },
//					{
//						//备注
//						title: "备注",
//						fieldName: "remarks",
//						filterType: "text"
//					},
//					 LIB.tableMgr.column.modifyDate,
////					 LIB.tableMgr.column.createDate,
//
	                ],
                    defaultFilterValue : {"orgId" : LIB.user.orgId}
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/riCheckPlan/importExcel"
            },
            exportModel : {
            	 url: "/riCheckPlan/exportExcel"
            },
            auditObj: {
                visible: false
            },
        };
    }

    var vm = LIB.VueEx.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel, sumMixin],
    	template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel
        },
        computed: {
            showSubmit: function () {
                return _.get(this.tableModel.selectedDatas, '[0].status') === '0';
            },
            showAudit: function () {
                return _.get(this.tableModel.selectedDatas, '[0].status') === '1';
            },
            showQuit: function () {
                return _.get(this.tableModel.selectedDatas, '[0].status') === '2';
            }
        },
        methods: {
            //删除
            beforeDoDelete: function() {
                if (this.tableModel.selectedDatas.length > 1) {
                    LIB.Msg.warning("一次只能删除一条数据");
                    return false;
                }
            },
            doInvalid : function () {
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

                //判断是否已发布
                if (_.some(rows, function(row) { return row.disable == 0; })) {
                    LIB.Msg.warning("【未发布】状态不能失效,请重新选择!");
                } else if(_.some(rows, function(row) { return row.disable == 2; })) {
                    LIB.Msg.warning("【已失效】状态不能失效,请重新选择!");
                } else {
                    api.invalid(null, _.pick(rows[0],"id","disable")).then(function(res) {
                        _.each(rows, function(row) {
                            row.disable = 2;
                        });
                        LIB.Msg.info("已失效!");
                        _this.emitMainTableEvent("do_update_row_data", { opType: "update", value: rows });
                    });
                }

            },
            //发布
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

                if(rows[0].disable !== '0') {
                    LIB.Msg.warning("只能发布未发布的数据");
                    return;
                }
                if(rows[0].status !== '2') {
                    LIB.Msg.warning("只能发布审核通过的数据");
                    return;
                }
                //为了获取关联人员的长度
                api.get({ id: rows[0].id }).then(function(res) {
                    if (res.body.users.length == 0) {
                        LIB.Msg.warning("请添加人员!");
                    } else if (res.body) {

                        //判断是否已发布
                        if (_.some(rows, function(row) { return row.disable == 1; })) {
                            LIB.Msg.warning("【已发布】状态不能发布,请重新选择!");
                        } else if(_.some(rows, function(row) { return row.disable == 2; })) {
                            LIB.Msg.warning("【已失效】状态不能发布,请重新选择!");
                        } else {
                            var ids = _.map(rows, function(row) { return row.id });
                            api.publish(null, ids).then(function(res) {
                                _.each(rows, function(row) {
                                    row.disable = 1;
                                });
                                LIB.Msg.info("已发布!");
                                // _this.emitMainTableEvent("do_update_row_data", { opType: "update", value: rows });
                                _this.refreshMainTable();
                            });
                        }

                    }
                })
            },
            doUpdate: function() {
                var rows = this.tableModel.selectedDatas;
                if (!_.isEmpty(rows)) {
                    var row = rows[0];
                    if(row.disable !== '0' || row.status !== '0') {
                        LIB.Msg.warning("只能编辑待提交的数据");
                        return;
                    }
                    this.showDetail(rows[0], { opType: "update" });
                }
            },
            doSubmit: function () {
                var _this = this;
                var rows = this.tableModel.selectedDatas;
                if(rows[0].disable !== '0') {
                    LIB.Msg.warning("只能提交未发布的数据");
                    return;
                }
                var id = _.get(this.tableModel.selectedDatas, '[0].id');

                api.submitRiCheckPlan({id: id}).then(function (res) {
                    _this.refreshMainTable();
                    LIB.Msg.success("提交成功");
                })

            },
            doAudit: function () {
                var rows = this.tableModel.selectedDatas;
                if(rows[0].disable !== '0') {
                    LIB.Msg.warning("只能审核未发布的数据");
                    return;
                }
                this.auditObj.visible = true;
            },
            doQuit: function () {
                var _this = this;
                var rows = this.tableModel.selectedDatas;
                if(rows[0].disable !== '0') {
                    LIB.Msg.warning("只能弃审未发布的数据");
                    return;
                }
                var id = _.get(rows, '[0].id');
                api.quitRiCheckPlan({id: id}).then(function (res) {
                    _this.refreshMainTable();
                    LIB.Msg.success("弃审成功");
                })
            },
            doPass: function (val) {
                var _this = this;
                var id = _.get(this.tableModel.selectedDatas, '[0].id');
                api.auditRiCheckPlan({id: id, status: val}).then(function (res) {
                    _this.refreshMainTable();
                    LIB.Msg.success("审核操作成功");
                    _this.auditObj.visible = false;
                })
            },
            initData: function () {
                this.mainModel.bizType = this.$route.query.bizType;
                if(this.mainModel.bizType){
                    var params = [];
                    //大类型
                    params.push({
                        value : {
                            columnFilterName : "bizType",
                            columnFilterValue : this.mainModel.bizType
                        },
                        type : "save"
                    });
                    this.$refs.mainTable.doQueryByFilter(params);
                }


            },
        },
        events: {
            "ev_dtPublish": function () {
                this.refreshMainTable();
                this.detailModel.show = false;
            }
        },
        ready: function () {
            this.onTableDataLoaded();
            this.$refs.categorySelector.setDisplayTitle({type: "org", value: LIB.user.orgId});
            if (!LIB.user.compId) {
                this.mainModel.showTempSetting = false;
            }
        },
        init: function(){
        	this.$api = api;
        }
    });

    return vm;
});
