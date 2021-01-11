define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
	var detailPanel = require("./detail-xl");

	require('base').setting.dataDic["iri_check_record_check_result"] = {
		"0":"不合格",
		"1":"合格"
	};

	require('base').setting.dataDic["iri_check_record_check_source"] = {
		"0":"手机检查",
		"1":"web录入"
	};

    
    var initDataModel = function () {
        return {
            moduleCode: "riCheckRecord",
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
	                url: "richeckrecord/list{/curPage}{/pageSize}?type=2",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
                        {
                            title: "巡检任务",
                            fieldName: "riCheckTask.name",
                            orderName: "riCheckTask.name",
                            filterType: "text",
                        },
                        {
                            title: "巡检表",
                            fieldName: "riCheckTable.name",
                            orderName: "riCheckTable.name",
                            filterType: "text",
                        },
                        {
                            title: "任务开始时间",
                            fieldName: "riCheckTask.startDate",
                            orderName: "riCheckTask.startDate",
                            filterName: "riCheckTaskStartDate",
                            filterType: "date"
                        },
                        {
                            title: "任务结束时间",
                            fieldName: "riCheckTask.endDate",
                            orderName: "riCheckTask.endDate",
                            filterName: "riCheckTaskEndDate",
                            filterType: "date"
                        },
                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.dept,
                        {
                            title: "检查人",
                            fieldName: "user.name",
                            orderName: "user.username",
                            filterType: "text",
                        },
                        {
                            //检查开始时间
                            title: "检查开始时间",
                            fieldName: "checkBeginDate",
                            filterType: "date"
                        },
                        {
                            //检查结束时间
                            title: "检查结束时间",
                            fieldName: "checkEndDate",
                            filterType: "date"
                        },
                        {
                        	//检查结果详情 如10/10,10条合格,10条不合格
                            title: '状态(总数/不合格数)',
                            renderHead: function () {
                                return '<div>状态</div><div style="font-size: 12px;">(总数/不合格数)</div>'
                            },
                        	fieldName: "checkResultDetail",
                        	filterType: "text"
                        },
                        {
                        	//检查结果 0:不合格,1:合格
                        	title: "结果",
                        	fieldName: "checkResult",
                        	orderName: "checkResult",
                        	filterName: "criteria.intsValue.checkResult",
                        	filterType: "enum",
                        	fieldType: "custom",
                        	popFilterEnum: LIB.getDataDicList("checkResult"),
                        	render: function (data) {
                        		var checkResult = data.checkResult;
                        		var list = LIB.getDataDicList("checkResult");
                                var text = _.get(_.find(list, "id", checkResult), "value", "不涉及");
                                return '<div class="check-result-' + checkResult +'">'+ text +'</div>';
                        	}
                        },
                        //  LIB.tableMgr.column.disable,
                        // {
                        // 	//检查时间
                        // 	title: "检查时间",
                        // 	fieldName: "checkDate",
                        // 	filterType: "date"
                        // },
                        // {
                        // 	title: "巡检计划",
                        // 	fieldName: "riCheckPlan.name",
                        // 	orderName: "riCheckPlan.name",
                        // 	filterType: "text",
                        // },
	                ],
                    defaultFilterValue: {"criteria.orderValue":
                            {fieldName: "checkEndDate", orderType: "1"},
                        "orgId": LIB.user.orgId,
                        "type" : 2,
	                }
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/riCheckRecord/importExcel"
            },
            exportModel : {
            	 url: "/richeckrecord/exportExcel"
            },
            exportDetailModel : {
                url: "/richeckrecord/{id}/exportExcel"
            }
        };
    }

    var vm = LIB.VueEx.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
    	template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel
            
        },
        methods: {
            doExportExcelDetail: function () {
                var rows = this.tableModel.selectedDatas;
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量操作数据");
                    return;
                }
                var _this = this;
                LIB.Modal.confirm({
                    title: '导出数据?',
                    onOk: function () {
                        window.open(_this.exportDetailModel.url.replace("\{id\}", rows[0].id));
                    }
                });
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
        },
        ready: function () {
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
