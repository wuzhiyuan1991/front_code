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
    //	var ltLpSupFormModal = require("componentsEx/formModal/ltLpSupFormModal");
    var dateUtils = require("./dateUtils");

    var initDataModel = function () {
        var current = new Date();
        var currYear = current.getFullYear();
        var times = {
            prevWeek: new Date(currYear, current.getMonth(), current.getDate() - 7),
            prevMonth: new Date(currYear, current.getMonth() - 1),
            prevQuarter: new Date(currYear, current.getMonth() - 3),
            prevYear: new Date(currYear - 1, current.getMonth())
        };
        return {
            datePickModel: {
                options: {
                    shortcuts: [
                        {
                            text: '本周', value: function () {
                                return [dateUtils.getWeekFirstDay(current), dateUtils.getWeekLastDay(current)];
                            }
                        },
                        {
                            text: '本月', value: function () {
                                return [dateUtils.getMonthFirstDay(current), dateUtils.getMonthLastDay(current)];
                            }
                        },
                        {
                            text: '本季度', value: function () {
                                return [dateUtils.getQuarterFirstDay(current), dateUtils.getQuarterLastDay(current)];
                            }
                        },
                        {
                            text: '本年', value: function () {
                                return [dateUtils.getYearFirstDay(current), dateUtils.getYearLastDay(current)];
                            }
                        },
                        {
                            text: '上周', value: function () {
                                return [dateUtils.getWeekFirstDay(times.prevWeek), dateUtils.getWeekLastDay(times.prevWeek)];
                            }
                        },
                        {
                            text: '上月', value: function () {
                                return [dateUtils.getMonthFirstDay(times.prevMonth), dateUtils.getMonthLastDay(times.prevMonth)];
                            }
                        },
                        {
                            text: '上季度', value: function () {
                                return [dateUtils.getQuarterFirstDay(times.prevQuarter), dateUtils.getQuarterLastDay(times.prevQuarter)];
                            }
                        },
                        {
                            text: '去年', value: function () {
                                return [dateUtils.getYearFirstDay(times.prevYear), dateUtils.getYearLastDay(times.prevYear)];
                            }
                        }
                    ]
                }
            },
            dateRange: [dateUtils.getMonthFirstDay(current), dateUtils.getMonthLastDay(current)],
            moduleCode: "sWs",

            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass: "middle-info-aside"
                //				detailPanelClass : "large-info-aside"
            },
            tableModel:
            {
                // url: "",
                values:[],
                selectedDatas: [],
                columns: [
                    {
                        title: "点位",
                        width: 150,
                        fieldName: "position",

                    },
                    {
                        title: "污染物名称",
                        width: 300,
                        fieldName: "attr4",

                    },
                    {
                        title: "污染物排放量/t",
                        width: 300,
                        fieldName: "waterQuantity",

                    },
                    {
						title: "所属公司",
						fieldType: "custom",
						render: function(data) {
							
								return LIB.tableMgr.rebuildOrgName(data.compId, 'comp');
							
						},
						// filterType: "text",
						// filterName: "criteria.strValue.compName",
						fieldName: "compId",
                        width: 150,
                       
					},
                ],
                defaultFilterValue: {
                    startDate: dateUtils.getMonthFirstDay(current).Format("yyyy-MM-dd hh:mm:ss"),
                    closeDate: dateUtils.getMonthLastDay(current).Format("yyyy-MM-dd hh:mm:ss"),
                }
            }
            ,
            detailModel: {
                show: false
            },

            exportModel: {
                url: "/wastewaterequirecord/exportCountWasteWaterComposition",
                withColumnCfgParam: true
            },
            compId: ''


        };
    }

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        //Legacy模式
        //		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainLegacyPanel],
        template: tpl,
        data: initDataModel,
        components: {
            // "detailPanel": detailPanel,


        },
        watch: {
            dateRange: function (val) {
                // this.$refs.mainTable.doQuery({
                //     startDate: val[0].Format("yyyy-MM-dd hh:mm:ss"),
                //     closeDate: val[1].Format("yyyy-MM-dd hh:mm:ss"),
                //     orgId: this.compId
                // })
                var _this = this
                if (this.dateRange.length<2) {
                    return
                }
                api.queryData({
                    curPage:1,
                    pageSize:20,
                    startDate: this.dateRange[0].Format("yyyy-MM-dd hh:mm:ss"),
                    closeDate: this.dateRange[1].Format("yyyy-MM-dd hh:mm:ss"),
                    orgId: this.compId
                }).then(function(res){
                    
                    if (res.data.length>0) {
                        _this.tableModel.values=res.data
                    }else{
                        _this.tableModel.values=[]
                    }
                })
            }
        },
        methods: {
            initData:function(){
                var _this = this
                if (this.dateRange.length<2) {
                    return
                }
                api.queryData({
                    curPage:1,
                    pageSize:20,
                    startDate: this.dateRange[0].Format("yyyy-MM-dd hh:mm:ss"),
                    closeDate: this.dateRange[1].Format("yyyy-MM-dd hh:mm:ss"),
                    orgId: this.compId
                }).then(function(res){
                    if (res.data.length>0) {
                        _this.tableModel.values=res.data
                    }else{
                        _this.tableModel.values=[]
                    }
                })
              
            },
            doCompanyChange: function (val) {


                this.compId = val.nodeId
                var _this = this
                // this.$nextTick(function () {

                //     _this.$refs.mainTable.doQuery({ orgId: this.compId })

                // })
                if (this.dateRange.length<2) {
                    return
                }
                api.queryData({
                    curPage:1,
                    pageSize:20,
                    startDate: this.dateRange[0].Format("yyyy-MM-dd hh:mm:ss"),
                    closeDate: this.dateRange[1].Format("yyyy-MM-dd hh:mm:ss"),
                    orgId: this.compId
                }).then(function(res){
                    if (res.data.length>0) {
                        _this.tableModel.values=res.data
                    }else{
                        _this.tableModel.values=[]
                    }
                })


            },
            doOrgCategoryChange:function(){

            },
            doDownFile: function () {
                window.open(this.importModel.templeteUrl);
            },
        },
        events: {
        },
        init: function () {
            this.$api = api;
        },
        ready:function(){
            this.tableModel.columns[3].visible=true
            this.$refs.mainTable.refreshColumns()
        }
    });

    return vm;
});
