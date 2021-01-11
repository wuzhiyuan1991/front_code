define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
	var detailPanel = require("./detail-xl");

	LIB.registerDataDic("isr_commitment_task_is_read", [
		["0","未读"],
		["1","已读"]
	]);

    
    var initDataModel = function () {
        return {
            moduleCode: "commitmentTask",
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
	                url: "commitmenttask/list{/curPage}{/pageSize}",
	                selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                        {
                            title: "安全承诺书",
                            fieldName: "commitment.name",
                            orderName: "commitment.name",
                            filterType: "text",
                        },
                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.dept,
                        {
                            title: "负责人",
                            fieldName: "user.name",
                            orderName: "user.username",
                            filterType: "text",
                        },
                        {
                            //完成时间
                            title: "完成时间",
                            fieldName: "completeDate",
                            filterType: "date"
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
                        {
                            //得分
                            title: "得分",
                            fieldName: "score",
                            filterType: "text"
                        },
                        {
                            //1:未完成,2:已完成
                            title: "状态",
                            fieldName: "isComplete",
                            fieldType: "custom",
                            popFilterEnum: LIB.getDataDicList("isr_is_complete"),
                            render: function (data) {
                                return LIB.getDataDic("isr_is_complete", data.isComplete);
                            }
                        },
                        // {
                        //     //是否已读 0:未读,1:已读
                        //     title: "是否已读",
                        //     fieldName: "isRead",
                        //     orderName: "isRead",
                        //     filterName: "criteria.intsValue.isRead",
                        //     filterType: "enum",
                        //     fieldType: "custom",
                        //     popFilterEnum: LIB.getDataDicList("isr_commitment_task_is_read"),
                        //     render: function (data) {
                        //         return LIB.getDataDic("isr_commitment_task_is_read", data.isRead);
                        //     }
                        // },
//
                    ],
                    defaultFilterValue:{"criteria.intsValue": {commitmentStatus: [4]}}
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/commitmenttask/importExcel"
            },
            exportModel : {
                url: "/commitmenttask/exportExcel",
                withColumnCfgParam: true
            },
            filterTabId: 'isComplete1'
        };
    }

    var vm = LIB.VueEx.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
    	template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
        },
        methods: {
            doFilterBySpecial: function (type, v) {
                this.filterTabId = type + v;
                this._normalizeFilterParam(type, v);
            },
            _normalizeFilterParam: function (type, v) {
                var params = [
                    {
                        value : {
                            columnFilterName : type,
                            columnFilterValue : v
                        },
                        type : "save"
                    }
                ];
                this.$refs.mainTable.doQueryByFilter(params);
            }
        },
        events: {
        },
        init: function(){
        	this.$api = api;
        },
        ready: function () {
            this._normalizeFilterParam('isComplete', '1');
        }
    });

    return vm;
});
