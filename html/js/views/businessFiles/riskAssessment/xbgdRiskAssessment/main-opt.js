define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var vm = {
        methods: {
            doSaveRiskAssessment : function(obj,type) {
                this.refreshMainTable();
                this.editModel.show = false;
                if(type == 'update'){
                    this.$broadcast('ev_dtReload', "view", obj.id, obj);
                }
            },
            doCategoryChange : function(obj) {
                var data = {};
                var _this  = this;
                //条件 后台搜索的 属性
                data.columnFilterName = "riskTypeId";
                //条件 后台搜索的 值
                data.columnFilterValue = obj.nodeId;
                //this.emitMainTableEvent("do_query_by_filter", {type:"save", value: data});
                _this.refreshMainTable();
            },
            // 新增方法
            doAdd : function() {
                this.editModel.show = true;
                this.editModel.title = "新增";
                this.editModel.type = "create";
                this.editModel.id = null;
                this.$broadcast('ev_editReload', null);
            },
            // 修改方法
            doUpdate : function() {
                var rows = this.tableModel.selectedDatas;
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量修改数据");
                    return;
                }
                var row = rows[0];
                if (row.state == 2){
                    LIB.Msg.warning("未通过的数据不能修改");
                    return;
                }
                //增加权限判断
                    this.editModel.show = true;
                    this.editModel.title = "修改";
                    this.editModel.type = "update";
                    this.editModel.id = row.id;
                    this.$broadcast('ev_editReload', row.id);
            },
            // 审核
            doAudit : function() {
                var _this = this;
                var rows = this.tableModel.selectedDatas;
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量审核");
                    return;
                }
                var row = rows[0];
                var ids = [];
                ids.push(row.id);
                if (row.state == 0) {
                    LIB.Msg.warning("该条记录已审核");
                } else if (row.state == 2) {
                    LIB.Msg.warning("该条记录已审核且不通过，无法再次审核");
                }else {
                    this.auditModal.show=true;
                }
            },
            //弃审
            doNotAudit : function () {
                var _this=this;
                var rows = this.tableModel.selectedDatas;
                var vo = rows[0];
                if (vo.state == '0' && vo.markup == '0') {
                    LIB.Modal.confirm({
                        title: '弃审该条数据?',
                        onOk: function () {
                            api.auditPending(vo).then(function (data) {
                                if (data.data && data.error != '0') {
                                    return;
                                } else {
                                    LIB.Msg.info("弃审成功");
                                    _.each(rows, function (row) {
                                        row.state = 1;
                                    });
                                    //_this.emitMainTableEvent("do_update_row_data", {opType: "update", value: rows});
                                    _this.refreshMainTable();
                                }
                            });
                        }
                    });
                }else {
                    LIB.Msg.info("隐患转风险的记录且状态为已评估，才能弃审！");
                    return;
                }
            },
            //通过
            doPass : function () {
                var _this = this;
                var rows = this.tableModel.selectedDatas;
                var vo = rows[0];
                api.auditPassed(vo).then(function(res) {
                    if (res.data && res.data.error != '0') {
                        return;
                    } else {
                        _.each(rows, function(row){
                            row.state = 0;
                        });
                        //_this.emitMainTableEvent("do_update_row_data",{opType:"update", value: rows});
                        _this.refreshMainTable();
                        LIB.Msg.info("审核通过");
                    }
                });
                this.auditModal.show=false;
            },
            //未通过
            doNotPass : function () {
                var _this = this;
                var rows = this.tableModel.selectedDatas;
                var vo = rows[0];
                api.auditRejected(vo).then(function(res) {
                    if (res.data && res.data.error != '0') {
                        return;
                    } else {
                        _.each(rows, function(row){
                            row.state = 2;
                        });
                        //_this.emitMainTableEvent("do_update_row_data",{opType:"update", value: rows});
                        _this.refreshMainTable();
                        LIB.Msg.info("审核不通过");
                    }
                });
                this.auditModal.show=false;
            },
            //关闭
            doCloseAudit :function () {
                this.auditModal.show=false;
            },
            //筛选
            doClickAll:function(name,index,level){
                var _this = this;
                // this.filter[name] = index;
                _.each(_this.filterList,function(item){
                    if(name == item.interName){
                        item.filter = index;
                    }
                })
                if(index!=-1){
                    if(name == 'riskLevel'){
                        this.filterTable.filterData[name] = level;
                    }else{
                        this.filterTable.filterData[name] = index;
                    }

                }else{
                    this.filterTable.filterData[name] = null;
                }
                var tableFilterDatas = [];
                var filterData = this.filterTable.filterData;
                if(filterData) {
                    for(key in filterData) {
                        var value = filterData[key];
                        if(value != undefined && value != null) {
                            var tableFilterData = {
                                type :"save",
                                value : {
                                    columnFilterName : key,
                                    columnFilterValue : value
                                }
                            };
                            tableFilterDatas.push(tableFilterData);
                        }
                    }
                }
                this.$refs.mainTable.doCleanRefresh(tableFilterDatas);
            },
            doCloseDetail:function(){
                this.detailModel.show = false;
            },
            doShow:function(){
                this.mainModel.showFilter = !this.mainModel.showFilter;
                if(this.mainModel.showFilter){
                    this.mainModel.operate = '收起';
                    this.height = 'calc(100% - 240px)';
                }else{
                    this.mainModel.operate = '展开';
                    this.height = 'calc(100% - 60px)';
                }
            },
            handleScroll:function(){

            },
            //详情页的编辑
            doShowEditModal : function(id){
                this.editModel.show = true;
                this.editModel.title = "修改";
                this.editModel.type = "update";
                this.editModel.id = id;
                this.$broadcast('ev_editReload', id);
            },
            initData: function () {
                this.mainModel.bizType = this.$route.query.bizType;
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
            },
        },
        ready: function(){
        }
    };

    return vm;
});
