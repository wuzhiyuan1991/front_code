define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    //var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
	var detailPanel = require("./detail-xl");

	var detailPanel2 = require("./dialog/remind");
    //导入
    var importProgress = require("componentsEx/importProgress/main");

    var filterDateArray = [
        {
            id: '2',
            name: '近1个月'
        },
        {
            id: '3',
            name: '近2个月'
        },
        {
            id: '4',
            name: '近3个月'
        },
        {
            id: '5',
            name: '近6个月'
        },
        {
            id: '6',
            name: '近1年'
        },
        {
            id: '7',
            name: '自定义'
        }
    ];
    var initDataModel = function () {
        return {
            moduleCode: "userCert",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                //detailPanelClass : "middle-info-aside"
				detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
	            {
	                url: "cert/list{/curPage}{/pageSize}?possessorType=1",
	                selectedDatas: [],
	                columns: [
	                 	LIB.tableMgr.column.cb,
					 	LIB.tableMgr.column.code,
                        {
                            title: "用户",
                            fieldName: "user.name",
                            orderName: "user.username",
                            filterType: "text",
                        },
                        {
                            title: "证件",
                            fieldName: "certType.name",
                            orderName: "certType.name",
                            filterType: "text",
                        },
                        {
                        	//证件编号
                        	title: "证件编号",
                        	fieldName: "idNumber",
                        	filterType: "text"
                        },
                        {
                            title: "证件对应课程",
                            fieldName: "course.name",
                            orderName: "course.name",
                            filterType: "text",
                        },
						{
							//证书状态 0:无证,1:有效,2:失效
							title: "证件有效",
							fieldName: "status",
							orderName: "status",
							filterName: "criteria.intsValue.status",
							filterType: "enum",
							fieldType: "custom",
							popFilterEnum: LIB.getDataDicList("itm_cert_status"),
							render: function (data) {
							    var text = LIB.getDataDic("itm_cert_status", data.status);
							    var className = data.status === '2' ? 'status-rect-tag-red' : 'status-rect-tag-green';
							    return '<div class="status-rect-tag ' + className + '" style="color: #fff;">' + text +'</div>';
							}
						},
                        {
                            //领证日期
                            title: "领证日期",
                            fieldName: "issueDate",
                            filterType: "date",
                            render: function (data) {
                                return data.issueDate ? data.issueDate.substr(0, 10) : "";
                            }
                        },
                        {
                            //生效日期
                            title: "证书生效日期",
                            fieldName: "effectiveDate",
                            filterType: "date",
                            render: function (data) {
                                return data.effectiveDate ? data.effectiveDate.substr(0, 10) : "";
                            }
                        },
                        {
                            //失效日期
                            title: "证书失效日期",
                            fieldName: "expiryDate",
                            filterType: "date",
                            render: function (data) {
                                return data.expiryDate ? data.expiryDate.substr(0, 10) : "";
                            }
                        },
                        {
                            //发证机构
                            title: "发证机构",
                            fieldName: "certifyingAuthority",
                            filterType: "text"
                        },
                        {
                            //是否需要复审 0:不要,1:需要
                            title: "需要复审",
                            fieldName: "isRecheckRequired",
                            orderName: "isRecheckRequired",
                            filterName: "criteria.intsValue.isRecheckRequired",
                            filterType: "enum",
                            fieldType: "custom",
                            popFilterEnum: LIB.getDataDicList("itm_cert_is_recheck_required"),
                            render: function (data) {
                                return LIB.getDataDic("itm_cert_is_recheck_required", data.isRecheckRequired);
                            }
                        },

					 	LIB.tableMgr.column.company,
					 	LIB.tableMgr.column.dept,
//
//					{
//						//操作项目
//						title: "操作项目",
//						fieldName: "jobContent",
//						filterType: "text"
//					},
//					{
//						//提前提醒复审的月数
//						title: "提前提醒复审的月数",
//						fieldName: "noticeMonthsInAdvance",
//						filterType: "number"
//					},
//					{
//						//复审周期（月）
//						title: "复审周期（月）",
//						fieldName: "retrialCycle",
//						filterType: "number"
//					},
	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            detailModel2: {
                show: false
            },
            uploadModel: {
                url: "/cert/importExcel?type=1"
            },
            exportModel : {
                url: "/cert/1/exportExcel",
                withColumnCfgParam: true
            },
            templete: {
                url: "/cert/file/down?type=1"
            },
            importProgress: {
                show: false
            },
            filterModel: {
                checkedExpiredDateId: '',
                checkedStatusId: '',
                filterDateArray: filterDateArray,
                beginDate: null,
                endDate: null
            }
			//Legacy模式
//			formModel : {
//				certFormModel : {
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
            "detailPanel2": detailPanel2,
            "importprogress": importProgress,
			//Legacy模式
//			"certFormModal":certFormModal,
            
        },
        methods: {
            doImport: function () {
                var _this = this;
                this.importProgress.show = true;
            },
            initFilterBoxData: function () {
                this.filterModel.checkedExpiredDateId = '';
                this.filterModel.checkedStatusId = '';
                this.filterModel.beginDate = null;
                this.filterModel.endDate = null;
            },
            doChangeStatusFilter: function (id) {
                this.filterModel.checkedStatusId = id;
            },
            doChangeExpiredDateFilter: function (id) {
                var now = new Date();
                this.filterModel.checkedExpiredDateId = id;
                if (id === '7') {
                    this.filterModel.beginDate = '';
                    this.filterModel.endDate = now.Format("yyyy-MM-dd 00:00:00");
                    return;
                }

                var monthMap = {
                    '2': 1,
                    '3': 2,
                    '4': 3,
                    '5': 6,
                    '6': 12
                };
                var monthNum = monthMap[id] || 1;
                this.filterModel.beginDate = now.Format("yyyy-MM-dd 00:00:00");
                this.filterModel.endDate = (new Date(now.setMonth(now.getMonth() + monthNum))).Format("yyyy-MM-dd 23:59:59");
            },

            _normalizeExpiryDateFilterData: function () {

                if (!this.filterModel.beginDate && !this.filterModel.endDate) {
                    return null;
                }
                var param = {
                    value : {
                        columnFilterName : "criteria.dateValue",
                        columnName: "expiryDate",
                        columnFilterValue : {startExpiryDate: this.filterModel.beginDate, endExpiryDate: this.filterModel.endDate}
                    },
                    type : "save"
                };
                var displayMap = {
                    displayTitle: '',
                    displayValue: '近一个月',
                    columnFilterName: "expiryDate",
                    columnFilterValue: 1
                };

                displayMap.displayValue = _.find(filterDateArray, "id", this.filterModel.checkedExpiredDateId).name;
                if (this.filterModel.checkedExpiredDateId === '7') {
                    displayMap.displayValue = this.filterModel.beginDate ? (this.filterModel.beginDate + " ~ " + this.filterModel.endDate) : ("截止 " + this.filterModel.endDate);
                }

                return {
                    param: param,
                    displayMap: displayMap
                }
            },
            _normalizeStatusFilterData: function () {
                if (!this.filterModel.checkedStatusId) {
                    return null;
                }
                var param = {
                    value : {
                        columnFilterName : "criteria.intsValue",
                        columnName: "status",
                        columnFilterValue : {status: [this.filterModel.checkedStatusId]}
                    },
                    type : "save"
                };
                var displayMap = {
                    displayTitle: '',
                    displayValue: '有效',
                    columnFilterName: "status",
                    columnFilterValue: 1
                };
                displayMap.displayValue = _.find(this.getDataDicList('itm_cert_status'), "id", this.filterModel.checkedStatusId).value;

                return {
                    param: param,
                    displayMap: displayMap
                }
            },

            doFilterFromBox: function () {

                var params = [];
                var expiryDate = this._normalizeExpiryDateFilterData();
                var status = this._normalizeStatusFilterData();
                if (!expiryDate && !status) {
                    return LIB.Msg.warning("请选择过滤条件");
                }

                if (expiryDate) {
                    params.push(expiryDate.param);
                    this.doAddDisplayFilterValue(expiryDate.displayMap);
                }
                if (status) {
                    params.push(status.param);
                    this.doAddDisplayFilterValue(status.displayMap);
                }

                this.$refs.mainTable.doQueryByFilter(params);
                this.doFilterBoxClose();
            },
            doFilterBoxClose: function () {
                this.$refs.filterBox.handleClose();
            },
            doSetAutoRemind: function () {
                this.detailModel2.show = true;
                this.$broadcast("ev_dtReload2");
            },
            showDetail: function(row, opts) {
                this.detailModel2.show = false;
                var opType = (opts && opts.opType) ? opts.opType : "view";
                //this.$broadcast('ev_dtReload', "view", row.id);
                this.$broadcast('ev_dtReload', opType, row.id, row, opts);
                this.detailModel.show = true;
            },
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.certFormModel.show = true;
//				this.$refs.certFormModal.init("create");
//			},
//			doSaveCert : function(data) {
//				this.doSave(data);
//			}

        },
        events: {
            "ev_dtClose2": function () {
                this.detailModel2.show = false;
            }
        },
        init: function(){
        	this.$api = api;
        }
    });

    return vm;
});
