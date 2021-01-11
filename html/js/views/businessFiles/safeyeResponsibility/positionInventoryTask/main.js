define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
	var detailPanel = require("./detail-xl");

	LIB.registerDataDic("isr_position_inventory_task_frequencyType", [
		["1","天"],
		["2","月"],
		["3","旬"],
		["4","季度"],
		["5","半年"],
		["6","年(默认年)"]
	]);

	LIB.registerDataDic("isr_position_inventory_task_is_read", [
		["0","未读"],
		["1","已读"]
	]);


    var initDataModel = function () {
        return {
            moduleCode: "positionInventoryTask",
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
	                url: "positioninventorytask/list{/curPage}{/pageSize}",
	                selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                        {
                            title: "考核人",
                            fieldName: "user.name",
                            orderName: "user.username",
                            filterType: "text",
                        },
                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.dept,
                        {
                            title: "岗位",
                            render: function (data) {
                                return _.pluck(data.positions, "name").join("、");
                            }
                        },
                        {
                            //年份
                            title: "考核年份",
                            fieldName: "year",
                            filterType: "text",
                            render: function (data) {
                                return data.year ? data.year.substr(0, 4) + "年" : "";
                            },
                            filterCustom:function (pms,query) {
                                var obj={};
                                if('criteria.dateValue'  in query){
                                    obj=JSON.parse(query["criteria.dateValue"])
                                }
                                obj.startYear=pms+"-01-01";
                                obj.endYear= pms+"-12-31 23:59:59";
                                query["criteria.dateValue"]=JSON.stringify(obj);
                            },
                            filterCondition:function (pms,query) {
                                if(!/^\d{4}$/.test(pms)){
                                    return "请输入一个年份";
                                }
                            }
                        },
                        {
                            //周期 1:天,2:月,3:旬,4:季度,5:半年,6:年(默认年)
                            title: "周期",
                            fieldName: "frequencyType",
                            orderName: "frequencyType",
                            filterName: "criteria.intsValue.frequencyType",
                            filterType: "enum",
                            fieldType: "custom",
                            popFilterEnum: LIB.getDataDicList("isr_position_inventory_frequencyType"),
                            render: function (data) {
                                return LIB.getDataDic("isr_position_inventory_frequencyType", data.frequencyType);
                            }
                        },
                        {
                            //当前期数
                            title: "考核期数",
                            fieldName: "num",
                            render: function (data) {
                                return data.num + "/" + data.total
                            }
                        },
                        {
                            //得分
                            title: "得分",
                            fieldName: "score",
                            filterType: "text"
                        },

                        {
                            //开始时间
                            title: "考核开始时间",
                            fieldName: "startDate",
                            filterType: "date"
                        },
                        {
                            //结束时间
                            title: "考核结束时间",
                            fieldName: "endDate",
                            filterType: "date"
                        },
                        {
                            //完成时间
                            title: "完成时间",
                            fieldName: "completeDate",
                            filterType: "date"
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
                        //     popFilterEnum: LIB.getDataDicList("isr_position_inventory_task_is_read"),
                        //     render: function (data) {
                        //         return LIB.getDataDic("isr_position_inventory_task_is_read", data.isRead);
                        //     }
                        // },
                    ],
                    defaultFilterValue: {"criteria.intsValue": {positioninventoryStatus: [4]}}
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/positioninventorytask/importExcel"
            },
            exportModel : {
                url: "/positioninventorytask/exportExcel",
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
            "detailPanel": detailPanel
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
