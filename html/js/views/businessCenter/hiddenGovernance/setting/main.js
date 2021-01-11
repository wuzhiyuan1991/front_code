define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("./vuex/api");
    //右侧滑出详细页
    var detailComponent = require("./detail");
    //编辑弹框页面
    var editComponent = require("./dialog/edit");

    //Vue数据模型
    var dataModel = function(){
        return{

            moduleCode : LIB.ModuleCode.BC_HaT_ProS,
            tableModel:  LIB.Opts.extendMainTableOpt(
                  {
                url: "process/list{/curPage}{/pageSize}",
                selectedDatas: [],
                columns: [{
                    title: "",
                    fieldName: "id",
                    fieldType: "cb",
                },{
                    title: "编号",
                    fieldName: "code",
                    fieldType: "link",
                    filterType: "text"
                }, {
                    title: "类型",
                    //fieldName: "attr2",
                    fieldType: "custom",
                    render: function (data) {
                        return "隐患登记";
                    }
                }, {
                    title: "角色名称",
                    fieldName: "name",
                    filterName: "criteria.strValue.title",
                    filterType: "text"
                },
                    {
                        title: "审核对象",
                        fieldType: "custom",
                        filterType: "enum",
                        filterName: "criteria.intsValue.processType",
                        popFilterEnum: LIB.getDataDicList("process_type"),
                        render: function (data) {
                            return LIB.getDataDic("process_type", data.processType);
                        }
                    },
                    //    {
                //    title: "可以指定后续整改人",
                //    fieldType: "custom",
                //    filterType: "enum",
                //    filterName: "criteria.intsValue.reformerFlag",
                //    popFilterEnum: LIB.getDataDicList("reformer_flag"),
                //    render: function (data) {
                //        return LIB.getDataDic("reformer_flag",data.reformerFlag);
                //    }
                //},
                //    {
                //    title: this.$t("gb.common.state"),
                //    orderName: "disable", //排序字段
                //    fieldName: "disable",
                //    filterType: "enum",
                //    filterName: "criteria.strsValue.disable"
                //}
                ],
            }
            ),
            //控制全部分类组件显示
            mainModel: {
                //显示分类
                showCategory: false,
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: []
            },
            editModel: {
                //控制编辑组件显示
                title: "新增",
                //显示编辑弹框
                show: false,
                //编辑模式操作类型
                type: "create",
                id: null
            },
            conditionModel: {
                //控制编辑组件显示
                title: "条件",
                //显示编辑弹框
                show: false,
            },
            detailModel: {
                //控制右侧滑出组件显示
                show: false
            },
            exportModel : {
                url: "/pool/exportExcel"
            }
        }
    };


    //使用Vue方式，对页面进行事件和数据绑定
    /**
     *  请统一使用以下顺序配置Vue参数，方便codeview
     *    el
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
        template: tpl,
        components: {
            "detail-component": detailComponent,
            "edit-component": editComponent
        },
        data:dataModel,
        methods: {
            doCategoryChange: function (obj) {
//            	if(obj.categoryType == "xxx") {
//            	}
            },
            doTableCellClick: function (data) {
                if (data.cell.fieldName == "code") {
                    this.showDetail(data.entry.data);
                }else{
                    this.detailModel.show = false;
                }
            },
            //显示详情
            showDetail: function (row) {
                this.detailModel.show = true;
                this.$broadcast('ev_detailReload', row.id,row);

            },
            //显示全部分类
            doShowCategory: function () {
                this.mainModel.showCategory = !this.mainModel.showCategory;
            },
            doEnable:function(){
                var _this = this;
                var rows = this.tableModel.selectedDatas;
                var ids = [];
                var i=0;
                _.map(rows,function(e){
                    i++;
                    if(e.disable == 1){
                        ids.push(e.id);
                    }
                    //循环遍历完
                    if(i == rows.length){
                        if( ids.length > 0){
                            api.batchUpdate({disable:0},ids).then(function(res){
                                _.each(rows, function(row){
                                    row.disable = 0;
                                });
                                _this.emitMainTableEvent("do_update_row_data", {opType:"update", value: rows});
                                LIB.Msg.info("已启用!");
                            });
                        }else{
                            LIB.Msg.info("已启用!");
                        }
                    }
                });
            },
            doDisable:function(){
                var _this = this;
                var rows = this.tableModel.selectedDatas;
                var ids = [];
                var i=0;
                _.map(rows,function(e){
                    i++;
                    if(e.disable == 0){
                        ids.push(e.id);
                    }
                    //循环遍历完
                    if(i == rows.length){
                        if( ids.length > 0){
                            api.batchUpdate({disable:1},ids).then(function(res){
                                _.each(rows, function(row){
                                    row.disable = 1;
                                });

                                _this.emitMainTableEvent("do_update_row_data", {opType:"update", value: rows});
                                LIB.Msg.info("已停用!");
                            });
                        }else{
                            LIB.Msg.info("已停用!");
                        }
                    }
                });
            },
            //新增
            doAdd: function () {
                //var rows = this.tableModel.selectedDatas;
                //if (rows.length > 1) {
                //    LIB.Msg.warning("无法批量操作数据");
                //    return;
                //}
                //var row = rows[0];
                //this.editModel.show = true;
                //this.$broadcast('ev_editReload',null);
                this.detailModel.show = true;
                this.$broadcast('ev_detailReload',null,"add");
            },
            //新增
            doContition: function () {
                this.conditionModel.show = true;
                this.$broadcast('ev_editReload',null);
            },
            doUpdate:function(){
                var rows = this.tableModel.selectedDatas;
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量操作数据");
                    return;
                }
                var row = rows[0];
               // this.editModel.show = true;
                this.editModel.title = "修改";
                this.editModel.type = "update";
                this.detailModel.show = true;
                this.$broadcast('ev_detailReload',row.id,"update");
                //this.$broadcast('ev_editReload',row.id);
            },
            //删除方法
            doDelete: function () {
                var _this = this;
                var deleteIds = _.map(this.tableModel.selectedDatas, function (row) {
                    return row.id
                });
                LIB.Modal.confirm({
                    title: '删除选中数据?',
                    onOk: function () {
                        api.delete(null, deleteIds).then(function (data) {
                            if (data.data && data.error != '0') {
                                LIB.Msg.warning("删除失败");
                                return;
                            } else {
                                LIB.Msg.success("删除成功");
                                _this.emitMainTableEvent("do_update_row_data", {
                                    opType: "remove",
                                    value: _this.tableModel.selectedDatas
                                });
                            }
                        });
                    }
                });
            },
        },
        //响应子组件$dispatch的event
        events: {
            //edit框点击保存后事件处理
            "ev_editFinshed": function (data,type) {
                //this.emitMainTableEvent("do_update_row_data", {opType: "add"});
                this.emitMainTableEvent("do_update_row_data", { opType: type,value:data});
                this.editModel.show = false;
            },
            //edit框点击保存后事件处理
            "ev_editUpdate": function (data) {
                this.emitMainTableEvent("do_update_row_data", {opType: "update",value:data});
                this.editModel.show = false;
            },
            //edit框点击取消后事件处理
            "ev_editCanceled": function () {
                this.editModel.show = false;
            },
            //detail框点击关闭后事件处理
            "ev_detailColsed": function () {
                this.emitMainTableEvent("do_update_row_data", {opType: "remove", value: this.tableModel.selectedDatas});
                this.detailModel.show = false;
            },
        }
    });

    return vm;
});