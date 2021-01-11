define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"))
    //右侧滑出详细页
    var detailComponent = require("./detail");
    //新增滑窗
    //var editComponent = require("./edit");
    var editOrgComponent = require("./dialog/edit");
    //Vue数据模型
    var dataModel = function () {
        return {
            //控制全部分类组件显示
            moduleCode: LIB.ModuleCode.BS_BaC_MaiC,
            mainModel: {
                //显示分类
                showCategory: false,
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                defaultRow: null
            },
            editModel: {
                //控制右侧滑出组件显示
                show: false
            },
            editOrgModel: {
                //控制编辑组件显示
                title: "新增",
                //显示编辑弹框
                show: false,
                //编辑模式操作类型
                type: "create",
                id: null
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "mailconfig/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "cb",
                        },
                        {
                            title: this.$t("bs.bac.accountName"),
                            fieldName: "mailAccname",
                            fieldType: "custom",
                            filterType: "text",
                            triggerRowSelected: false,
                            render: function (data) {
                                return "<span class='text-link'>" + data.mailAccname + "<span>";
                            },
                            width: 160
                        },
                        {
                            title: this.$t("bs.bac.mailName"),
                            fieldName: "mailUsername",
                            filterType: "text",
                            width: 200
                        },
                        {
                            title: this.$t("bs.bac.mailAdress"),
                            fieldName: "mailAddress",
                            filterType: "text",
                            width: 180
                        },
                        {
                            title: this.$t("bs.bac.server"),
                            fieldName: "mailServer",
                            filterType: "text",
                            width: 180
                        },
                        {
                            title: this.$t("gb.common.state"),
                            fieldName: "disable",
                            fieldType: "custom",
                            filterType: "enum",
                            filterName: "criteria.intsValue.disable",
                            popFilterEnum: LIB.getDataDicList("disable"),
                            render: function (data) {
                                return LIB.getDataDic("disable",data.disable);
                            },
                            width: 80
                        }
                    ]
                }
            ),
            uploadModel: {
                url: "/mailconfig/importExcel"
            },
            exportModel : {
                url: "/mailconfig/exportExcel",
                withColumnCfgParam: true
            },
            detailModel: {
                //控制编辑组件显示
                title: "新增",
                //显示编辑弹框
                show: false,
                //编辑模式操作类型
                type: "create",
                id: null
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
    var vm = LIB.VueEx.extend({
        //el: "#myPage",
        mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        template: tpl,
        components: {
            "detailcomponent": detailComponent,
            "editorgcomponent": editOrgComponent
            //"editcomponent": editComponent
        },
        data: dataModel,
        methods: {
            doTableCellClick: function (data) {
                if (data.cell.fieldName == "mailAccname") {
                    this.showDetail(data.entry.data);
                } else {
                    this.detailModel.show = false;
                }
            },
            doLoadTableData: function (data) {
                var _this = this;
                _.each(data, function (t) {
                    if (t.attr5 == "1") {
                        _this.mainModel.defaultRow = t;
                        t.mailAccname = t.mailAccname + "(默认)";
                    }
                });
            },
            //显示全部分类
            doShowCategory: function () {
                this.mainModel.showCategory = !this.mainModel.showCategory;
            },
            doEnableDisable:function(){
                var _this = this;
                var rows = _this.tableModel.selectedDatas;
                if(rows.length>1){
                    LIB.Msg.warning("无法批量启用停用数据");
                    return
                }
                var updateIds = rows[0].id,disable = rows[0].disable;
                //0启用，1禁用
                if(disable==0){
                    api.updateDisable([updateIds]).then(function (res) {
                        _.each(rows, function(row){
                            row.disable = 1;
                        });
                        _this.emitMainTableEvent("do_update_row_data", {opType:"update", value: rows});
                        LIB.Msg.info("停用成功!");
                    });
                }else{
                    api.updateStartup([updateIds]).then(function (res) {
                        _.each(rows, function(row){
                            row.disable = 0;
                        });
                        _this.emitMainTableEvent("do_update_row_data", {opType:"update", value: rows});
                        LIB.Msg.info("启用成功!");
                    });
                }
            },
            doDefault: function () {
                var _this = this;
                var rows = this.tableModel.selectedDatas;
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量设置默认邮箱");
                    return;
                }
                var row = rows[0];
                if (row.disable == 1) {
                    LIB.Msg.warning("禁用状态无法设置为默认邮箱");
                    return;
                }
                api.updateDefault({id: row.id, attr5: 1}).then(function () {
                    row.attr5 = 1;
                    row.mailAccname = row.mailAccname + "(默认)";
                    _this.emitMainTableEvent("do_update_row_data", {opType: "update", value: row});
                    _this.mainModel.defaultRow.attr5 = 0;
                    _this.mainModel.defaultRow.mailAccname = _this.mainModel.defaultRow.mailAccname.substring(0, _this.mainModel.defaultRow.mailAccname.length - 4);
                    _this.emitMainTableEvent("do_update_row_data", {
                        opType: "update",
                        value: _this.mainModel.defaultRow
                    });
                    _this.mainModel.defaultRow = row;
                    LIB.Msg.info("设为默认邮箱成功!");
                });
            },
            doRelEnt: function () {
                var rows = this.tableModel.selectedDatas;
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量设置关联公司");
                    return;
                }
                var row = rows[0];
                this.editOrgModel.show = true;
                this.editOrgModel.title = "设置关联公司";
                this.editOrgModel.id = row.id;
                this.$broadcast('ev_editAffiliates', row.id);
            },
            doFinshed:function(data){
                var opType = data.id ? "update" : "add";
                this.emitMainTableEvent("do_update_row_data", {opType: opType, value: data});
                this.editModel.show = false;
            },
            doCancel:function(){
                this.editModel.show = false;
                this.editOrgModel.show = false;
            },
            doDetailCancel:function(){
                this.detailModel.show = false;
            },
            doModifyState:function(){
                this.emitMainTableEvent("do_update_row_data", {opType: "add"});
            },
            doDetailDelete:function(){
                this.emitMainTableEvent("do_update_row_data", {opType: "remove", value: this.tableModel.selectedDatas});
                this.detailModel.show = false;
            },
            doEditFinshed:function(){
                this.editOrgModel.show = false;
            },
        },

        init: function(){
            this.$api = api;
        }
    });
    //初始化grid

    return vm;

});