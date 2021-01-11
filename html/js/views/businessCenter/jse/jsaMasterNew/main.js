define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
	var detailPanel = require("./detail-xl");
    LIB.registerDataDic("jsa_master_is_publish", [
        ["0","未派送任务"],
        ["1","已派送任务"],
        ["2","已失效"]
    ]);

    LIB.registerDataDic("jsa_master_status", [
        ["0","待提交"],
        ["1","待审核"],
        ["2","已审核"]
    ]);

    var initDataModel = function () {
        return {
            moduleCode: "jsaMasterNew",
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
	                url: "jsamasternew/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					{
						title: 'JSA编号',
						fieldName: "code",
						width: 270,
						orderName: "code",
						fieldType: "link",
						filterType: "text"
					},
					{
						title: "票/卡名称",
						fieldName: "opCard.name",
						orderName: "opCard.name",
						filterType: "text",
                        render: function (data) {
                            return _.get(data, "opCard.attr1", "") + " - " + _.get(data, "opCard.name", "")
                        },
                        width: 300
					},
					LIB.tableMgr.column.company,
					LIB.tableMgr.column.dept,
					{
						title: "作业单位",
						fieldName: "construction",
						filterType: "text"
					},
					{
						//作业内容
						title: "作业内容",
						fieldName: "taskContent",
						filterType: "text",
                        width: 300
					},
					{
						//分析小组组长
						title: "分析组长",
						fieldName: "analyseLeader",
						filterType: "text"
					},
                    {
						title: "分析人员",
						fieldName: "analysePerson",
						filterType: "text"
					},
                    {
						//作业日期
						title: "作业日期",
						fieldName: "workDate",
						filterType: "date",
                        render: function (data) {
                            var d = _.get(data, "workDate", "");
                            return d.substr(0, 10)
                        }
					},
                    {
                        title: "审核状态",
                        fieldName: "status",
                        orderName: "status",
                        filterName: "criteria.intsValue.status",
                        filterType: "enum",
                        fieldType: "custom",
                        popFilterEnum: LIB.getDataDicList("jsa_master_status"),
                        render: function (data) {
                            return LIB.getDataDic("jsa_master_status", data.status);
                        }
                    },
                    {
						title: "状态",
						fieldName: "isPublish",
						orderName: "isPublish",
						filterName: "criteria.intsValue.isPublish",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("jsa_master_is_publish"),
						render: function (data) {
							return LIB.getDataDic("jsa_master_is_publish", data.isPublish);
						}
					},
                    {
                        title: "创建人",
                        fieldName: "user.username",
                        filterType: "text"
                    },
                    // LIB.tableMgr.column.disable,

					// {
					// 	//专家点评
					// 	title: "专家点评",
					// 	fieldName: "commentExpert",
					// 	filterType: "text"
					// },

//					{
//						//管理处点评
//						title: "管理处点评",
//						fieldName: "commentGlc",
//						filterType: "text"
//					},
//					{
//						//公司点评
//						title: "公司点评",
//						fieldName: "commentGongsi",
//						filterType: "text"
//					},

//					{
//						//是否承包商作业；0:否,1:是
//						title: "是否承包商作业；0:否,1:是",
//						fieldName: "contractor",
//						filterType: "text"
//					},
//					{
//						//表明是否复制页面传来的数据，非空时为复制页面传来的值
//						title: "表明是否复制页面传来的数据，非空时为复制页面传来的值",
//						fieldName: "copy",
//						filterType: "text"
//					},
//					{
//						//是否为交叉作业
//						title: "是否为交叉作业",
//						fieldName: "crossTask",
//						filterType: "text"
//					},
//					{
//						//
//						title: "",
//						fieldName: "isflag",
//						filterType: "text"
//					},
//					{
//						//步骤json
//						title: "步骤json",
//						fieldName: "jsonstr",
//						filterType: "text"
//					},
//					{
//						//是否为新的工作任务 0--已做过的任务；  1--新任务
//						title: "是否为新的工作任务",
//						fieldName: "newTask",
//						filterType: "text"
//					},
//					{
//						//是否需要许可证
//						title: "是否需要许可证",
//						fieldName: "permit",
//						filterType: "text"
//					},
//					{
//						//是否有特种作业人员资质证明
//						title: "是否有特种作业人员资质证明",
//						fieldName: "qualification",
//						filterType: "text"
//					},
//					{
//						//是否参考库
//						title: "是否参考库",
//						fieldName: "reference",
//						filterType: "text"
//					},
//					 LIB.tableMgr.column.remark,
////					{
//						//步骤中最高风险级别的分值
//						title: "步骤中最高风险级别的分值",
//						fieldName: "riskScore",
//						filterType: "number"
//					},
//					{
//						//是否分享
//						title: "是否分享",
//						fieldName: "share",
//						filterType: "text"
//					},
//					{
//						//是否有相关操作规程
//						title: "是否有相关操作规程",
//						fieldName: "specification",
//						filterType: "text"
//					},
//					{
//						//作业许可证号（如有）
//						title: "作业许可证号（如有）",
//						fieldName: "taskLicense",
//						filterType: "text"
//					},
//					{
//						//提交类型
//						title: "提交类型",
//						fieldName: "updatetype",
//						filterType: "text"
//					},
//					{
//						//作业位置
//						title: "作业位置",
//						fieldName: "workPlace",
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
                url: "/jsamasternew/importExcel"
            },
            exportModel : {
                url: "/jsamasternew/{id}/exportExcel",
                withColumnCfgParam: true
            },
            auditObj: {
                visible: false
            },
        };
    };

    var vm = LIB.VueEx.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
    	template: tpl,
        components: {
            "detailPanel": detailPanel,
        },
        computed: {
            showSubmit: function () {
                return _.get(this.tableModel.selectedDatas, '[0].status') === '0';
            },
            showAudit: function () {
                return _.get(this.tableModel.selectedDatas, '[0].status') === '1';
            },
            showQuit: function () {
                return _.get(this.tableModel.selectedDatas, '[0].status') === '2' && _.get(this.tableModel.selectedDatas, '[0].isPublish') !== '2';
            },
            showInvalid:function () {
                return _.get(this.tableModel.selectedDatas, '[0].isPublish') === '1';
            },
            showExport:function () {
                return _.get(this.tableModel.selectedDatas, '[0].isPublish') === '1';
            }
        },
        data: initDataModel,

        methods: {
            doUpdate: function() {
                var rows = this.tableModel.selectedDatas;
                if (!_.isEmpty(rows)) {
                    var row = rows[0];
                    if(row.status !== '0') {
                        LIB.Msg.warning("只能编辑待提交的数据");
                        return;
                    }
                    this.showDetail(rows[0], { opType: "update" });
                }
            },
            doSubmit: function () {
                var _this = this;
                var id = _.get(this.tableModel.selectedDatas, '[0].id');

                api.submit({id: id}).then(function (res) {
                    _this.refreshMainTable();
                    LIB.Msg.success("提交成功");
                })

            },
            doAudit: function () {
                this.auditObj.visible = true;
            },
            doPass: function (val) {
                var _this = this;
                var id = _.get(this.tableModel.selectedDatas, '[0].id');
                api.audit({id: id, status: val}).then(function (res) {
                    _this.refreshMainTable();
                    LIB.Msg.success("审核操作成功");
                    _this.auditObj.visible = false;
                })
            },
            doQuit: function () {
                var _this = this;
                var isPublish = _.get(this.tableModel.selectedDatas, '[0].isPublish');
                if (isPublish === '1') {
                    LIB.Msg.warning("已派送的数据无法弃审");
                    return;
                }
                var id = _.get(this.tableModel.selectedDatas, '[0].id');
                api.quit({id: id}).then(function (res) {
                    _this.refreshMainTable();
                    LIB.Msg.success("弃审成功");
                })
            },
            // 派送任务
            doSendTask: function () {
                var _this = this;
                var isPublish = _.get(this.tableModel.selectedDatas, '[0].isPublish');
                if (isPublish === '1') {
                    LIB.Msg.warning("该数据已派送过");
                    return;
                }
                var id = _.get(this.tableModel.selectedDatas, '[0].id');
                api.sendTask({id:id}).then(function () {
                    LIB.Msg.success("派送成功");
                    _this.refreshMainTable();
                })
            },
            doAdd4Copy: function() {
                var rows = this.tableModel.selectedDatas;
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量复制");
                    return;
                }
                if (!_.isEmpty(rows)) {
                    if(rows[0].orgId != LIB.user.orgId) {
                        LIB.Msg.warning("当前登录人不允许复制使用其他部门的JSA记录");
                        return;
                    }
                    this.showDetail(rows[0], { opType: "update", action: "copy" });
                }
            },
            doInvalid:function () {
                var _this = this;
                var id = _.get(this.tableModel.selectedDatas, '[0].id');
                api.invalid({id:id}).then(function () {
                    LIB.Msg.success("已失效!");
                    _this.refreshMainTable();
                })
            },
            _doCreateWidthCard: function (type, cardId) {
                this.doAdd();
                this.$nextTick(function () {
                    this.$broadcast("ev_create_by_card")
                })
            },
            doExportExcel: function () {
                var rows = this.tableModel.selectedDatas;
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量操作数据");
                    return;
                }
                var _this = this;
                LIB.Modal.confirm({
                    title: '导出数据?',
                    onOk: function () {
                        api.get({id: rows[0].id}).then(function (res) {
                            var data = res.data;
                            if (data) {
                                if (data.opRecord) {
                                    window.open(_this.exportModel.url.replace("\{id\}", rows[0].id));
                                } else {
                                    LIB.Msg.warning("派发的JSA任务对应的票卡操作还未执行完成，没有产生作业记录");
                                    return;
                                }
                            } else {
                                LIB.Msg.warning("JSA工作安全分析不存在");
                                return;
                            }
                        });
                    }
                });
            },
        },
        events: {
        },
        ready: function () {
            this.$refs.categorySelector.setDisplayTitle({type: "org", value: LIB.user.orgId});
            if (!LIB.user.compId) {
                this.mainModel.showTempSetting = false;
            }
            //首页跳转时根据首页对应搜索条件查询
            if (this.$route.query.method === "filterByUser") {
                var checkerColumn = {
                    title: "创建人id",
                    fieldName: "createBy"
                };
                if (!!checkerColumn) {
                    this.$refs.mainTable.doOkActionInFilterPoptip(null, checkerColumn, LIB.user.id);
                }
                var statusColumn = _.find(this.tableModel.columns, function (item) {
                    return item.fieldName === "isPublish";
                });
                if(!!statusColumn && !!this.$route.query.state) {
                    if(this.$route.query.state == 1) {
                        this.$refs.mainTable.doOkActionInFilterPoptip(null, statusColumn, ['1']);
                    }
                }
            }
        },
        init: function(){
        	this.$api = api;
        },
        route: {
            data: function (transition) {
                var from = transition.from,
                    query = transition.to.query;

                var paths = [
                    '/jse/businessFiles/opStdCard',
                    '/jse/businessFiles/opMaintCard'
                ];
                if (_.includes(paths, from.path) && query.method === 'create' && query.cardId && query.type) {
                    this._doCreateWidthCard(query.cardId, query.type);
                }
            }
        }
    });

    return vm;
});
