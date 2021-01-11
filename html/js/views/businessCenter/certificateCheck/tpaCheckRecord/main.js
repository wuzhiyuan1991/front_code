define(function(require){
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var detailComponent = require("./detail-xl");
    var editComponent = require("./edit");
    //Vue数据模型
    var dataModel = function(){
        return{
            moduleCode : LIB.ModuleCode.BC_Hal_InsR,
            tableModel:LIB.Opts.extendMainTableOpt(
                {
                    url : "tpacheckrecord/list{/curPage}{/pageSize}",
                    selectedDatas:[],
                    columns:[ {
                        title : "",
                        fieldName : "id",
                        fieldType : "cb",
                    }, {
                        //title : "编码",
                        title: this.$t("gb.common.code"),
                        fieldName : "code",
                        width:'200px',
                        orderName:"code",
                        fieldType : "link",
                        filterType : "text"
                    }, {
                        title : this.$t("gb.common.inspectTask"),
                        fieldName:"tpaCheckTask.num",
                        filterType: "text",
                        orderName:"tpachecktask.num",
                        fieldType:"custom",
                        render: function(data){
                            if(data.tpaCheckPlan){
                                var  str = data.tpaCheckPlan.name;
                                if(data.tpaCheckTask && data.tpaCheckTask.num){
                                    str += '-';
                                    str += data.tpaCheckTask.num;
                                }
                                return str ;
                            }
                        },
                        filterName : "criteria.strValue.checkplanName"
                    }, {
                        title :this.$t("gb.common.checkUser"),
                        orderName:"user.username",
                        fieldName:"checkUser.username",
                        //fieldType:"custom",
                        //render: function(data){
                        //	if(data.checkUser){
                        //		return data.checkUser.username;
                        //	}
                        //},
                        filterType : "text",
                        filterName : "criteria.strValue.username"
                    },
                        //     {
                        //     title : this.$t("gb.common.subjectObj"),
                        //     fieldName:"checkObject.name",
                        //     // fieldType:"custom",
                        //     // render: function(data){
                        //     //     if(data.checkObject){
                        //     //         return data.checkObject.name;
                        //     //     }
                        //     // },
                        //     // filterType : "text",
                        //     // filterName : "criteria.strValue.checkobjectName"
                        // },
                        // {
                        //     title : this.$t("gb.common.type"),
                        //     orderName:"type",
                        //     fieldType:"custom",
                        //     render: function(data){
                        //         return LIB.getDataDic("checkTable_type",data.type);
                        //     },
                        //     popFilterEnum : LIB.getDataDicList("checkTable_type"),
                        //     filterType : "enum",
                        //     filterName : "criteria.strsValue.type"
                        // },
                        // {
                        //     title : this.$t("gb.common.type"),
                        //     orderName:"type",
                        //     fieldType:"custom",
                        //     render: function(data){
                        //         return data.type == "100" ? "证书类" : "资料类";
                        //     },
                        //     popFilterEnum : [{id : "100", value: "证书类"},{id : "200", value: "资料类"}],
                        //     filterType : "enum",
                        //     filterName : "criteria.strsValue.type"
                        // },
                        {
                            title : this.$t("gb.common.checkTime"),
                            fieldName : "checkDate",
                            filterType : "date"
                        },{
                            title : '检查开始时间',
                            fieldName : "checkBeginDate",
                            filterType : "date"
                        },{
                            title : '检查结束时间',
                            fieldName : "checkEndDate",
                            filterType : "date"
                        },{
                            title : this.$t("gb.common.CheckTableName"),
                            fieldName:"tpaCheckTable.name",
                            filterType: "text",
                            orderName:"tpachecktable.name",
                            // fieldType:"custom",
                            // render: function(data){
                            //     if(data.checkTable){
                            //         return data.checkTable.name;
                            //     }
                            // },
                            filterType : "text",
                            filterName : "criteria.strValue.checktableName"
                        },  {
                            title :this.$t("bc.hal.source"),
                            orderName : "checkSource",
                            fieldName : "checkSource",
                            render: function(data){
                                return LIB.getDataDic("checkSource",data.checkSource);
                            },
                            popFilterEnum : LIB.getDataDicList("checkSource"),
                            filterType : "enum",
                            filterName : "criteria.strsValue.checkSource"
                        }, {
                            title : this.$t("gb.common.state")+'('+this.$t("hag.hazv.qualify")+'/'+this.$t("hag.hazv.unqualify")+')',
                            width:"200px",
                            fieldName:"checkResultDetail",
                            filterType : "text",
                        }, {
                            title :this.$t("bd.ria.result"),
                            orderName : "checkResult",
                            fieldName : "checkResult",
                            filterType : "enum",
                            filterName : "criteria.strsValue.checkResult",
                            popFilterEnum : LIB.getDataDicList("checkResult"),
                            render: function(data){
                                return LIB.getDataDic("checkResult",data.checkResult);
                            }
                        },{
                            title : this.$t("gb.common.taskStartTime"),
                            orderName:"tpachecktask.start_date",
                            fieldName:"tpaCheckTask.startDate",
                            filterType: "date",
                            filterName : "taskStartDate"
                            // fieldType:"custom",
                            // render: function(data){
                            //     if(data.checkTask && data.checkTask.startDate){
                            //         return data.checkTask.startDate;
                            //     }
                            // },
                        }, {
                            title : this.$t("gb.common.taskEndTime"),
                            orderName:"tpachecktask.end_date",
                            fieldName:"tpaCheckTask.endDate",
                            filterType: "date",
                            filterName : "taskEndDate"
                            // fieldType:"custom",
                            // render: function(data){
                            //     if(data.checkTask && data.checkTask.endDate){
                            //         return data.checkTask.endDate;
                            //     }
                            // },
                        },
                        {
                            title: "设备设施",
                            orderName: "tpaboatequipment.id",
                            fieldName: "tpaBoatEquipment.name",
                            filterType: "text",
                            filterName: "criteria.strValue.tpaBoatEquipmentName"
                        },
                        {
                            title: "评价",
                            orderName: "attr1",
                            fieldType:"custom",
                            render: function(data){
                                var _estimate = data.attr1;
                                if (_estimate == "1") {
                                    _estimate = "好评";
                                } else if (_estimate == "2") {
                                    _estimate = "中评";
                                } else if (_estimate == "3") {
                                    _estimate = "差评";
                                } else {
                                    _estimate = "";
                                }
                                return _estimate;
                            },
                            popFilterEnum : [{id : "1", value: "好评"},{id : "2", value: "中评"},{id : "3", value: "差评"}],
                            filterType : "enum",
                            filterName : "criteria.strsValue.attr1"
                        },
                    ]
                }
            ),
            //控制全部分类组件显示
            mainModel : {
                //显示分类
                showCategory : false,
                showHeaderTools:false,
                //当前grid所选中的行
                selectedRow : []
            },
            editModel : {
                //控制编辑组件显示
                title : "新增",
                //显示编辑弹框
                show : false,
                //编辑模式操作类型
                type : "create",
                id: null
            },
            detailModel : {
                //控制右侧滑出组件显示
                show : false
            },
            // exportModel : {
            //     url: "/tpacheckrecord/exportExcel",
            //     singleUrl : "/tpacheckrecord/{id}/exportExcel"
            // },
            exportShipsPdf: {
                url: '/tpacheckrecord/exportPdf/ships',
                singleUrl: '/tpacheckrecord/{id}/exportPdf/ships'
            },
            exportShipShorePdf: {
                url: '/tpacheckrecord/exportPdf/shipShore',
                singleUrl: '/tpacheckrecord/{id}/exportPdf/shipShore'
            },
            checkModel : {
                doCheckFirst : false,
                checkTaskId : null
            },
            id : null,
        }
    };


    //使用Vue方式，对页面进行事件和数据绑定
    /**
     *  请统一使用以下顺序配置Vue参数，方便codeview
     *	el
     template
     components
     componentName
     props
     data
     computed
     watch
     methods
     events
     vue组件声明周期方法
     created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
     **/
    var tpl = LIB.renderHTML(require("text!./main.html"));
    var vm = LIB.VueEx.extend({
        template:tpl,
        data:dataModel,
        components : {
            "detailcomponent":detailComponent,
            "editcomponent" : editComponent
        },
        methods:{
            doCategoryChange : function(obj) {
//            	if(obj.categoryType == "xxx") {
//            	}
            },
            doAdd:function(){
                this.editModel.show = true;
                this.editModel.type = "create";
                this.editModel.id = null;
                this.$broadcast('ev_editReload',"create", null);
            },
            doUpdate:function () {
                var rows = this.tableModel.selectedDatas;
                if(rows.length > 1){
                    LIB.Msg.warning("无法批量修改数据");
                    return;
                }

                var row = rows[0];
                /*if (row.checkResult == 0){
                 LIB.Msg.warning("asdasdasdaqwe");
                 return;
                 }*/
                //判断该检查记录下的检查项的检查结果
                this.editModel.show = true;
                this.editModel.type = "update";
                this.editModel.id = row.id;
                this.$broadcast('ev_editReload',"update", row.id);
            },
            doTableCellClick:function(data) {
                if(data.cell.fieldName == "code") {
                    this.showDetail(data.entry.data);
                }else{
                    this.detailModel.show = false;
                }
            },
            //显示详情
            showDetail:function(row){
                this.detailModel.show = true;
                this.$broadcast('ev_detailReload',null,row.id,row);
            },
            //显示全部分类
            doShowCategory:function(){
                this.mainModel.showCategory = !this.mainModel.showCategory;
            },
            //导出pdf
            doExportPdf:function(type){
                var rows = this.tableModel.selectedDatas;
                if(rows.length > 1){
                    LIB.Msg.warning("无法批量操作数据");
                    return;
                }
                //判断是否是资料类的计划
                if (rows[0].tpaCheckPlan.type != 200) {
                    LIB.Msg.warning("改检查记录关联的是非资料类检查计划，不能导出!");
                    return;
                }
                var _this = this;
                LIB.Modal.confirm({
                    title : '导出数据?',
                    onOk : function() {
                        if(rows[0].tpaCheckTable.attr1 == "1") {
                            window.open(_this.exportShipShorePdf.singleUrl.replace("\{id\}", rows[0].id));
                        } else {
                            window.open(_this.exportShipsPdf.singleUrl.replace("\{id\}", rows[0].id));
                        }
                    }
                });
            }
        },
        //响应子组件$dispatch的event
        events : {
            //detail框点击关闭后事件处理
            "ev_detailColsed" : function(){
                this.editModel.show = false;
            },
            "ev_detailCreate" : function () {
                this.editModel.show = false;
                this.emitMainTableEvent("do_update_row_data", {opType:"add"});
            }
        },
        ready : function() {
            //if(this.checkModel.doCheckFirst){
            //    this.editModel.show = true;
            //    this.editModel.type = "check";
            //    this.editModel.id = null;
            //    this.$broadcast('ev_editReload',"check", this.checkModel.checkTaskId);
            //}
        },
        route: {
            activate: function (transition) {

                this.checkModel.doCheckFirst = false;
                var queryObj = transition.to.query;
                if(queryObj.method ) {
                    if(queryObj.checkTaskId && queryObj.method == "check") {

                        //TODO 以后改成用vuex做,暂时的解决方案
                        if(!!window.isClickCheckTaskExecutBtn) {
                            this.checkModel.checkTaskId = queryObj.checkTaskId;
                            //this.checkModel.doCheckFirst = true;
                            this.editModel.show = true;
                            this.editModel.type = "check";
                            this.editModel.id = null;
                            this.$broadcast('ev_editReload',"check", this.checkModel.checkTaskId);
                            window.isClickCheckTaskExecutBtn = false;
                        }

                    }else if(queryObj.id && queryObj.method == "detail"){
                        this.detailModel.show = true;
                        this.$broadcast('ev_detailReload',null,queryObj.id);
                    }
                }
                transition.next();
            }
        }
    });


    return vm;
});