define(function (require) {
    //基础js
    var LIB = require('lib');
    var BASE = require('base');
    var api = require("./vuex/api");
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");

    var initDataModel = function () {
        return {
            moduleCode: "user",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                showCategory: false,
                editRow:null,
                // detailPanelClass : "middle-info-aside"
                detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "traintask/personnelRecord/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "cb",
                        },
                        {
                            title: "编码",
                            fieldName: "code",
                            fieldType: "link",
                            filterType: "text",
                            width: 220
                        },
                        {
                            title: "姓名",
                            fieldName: "username",
                            filterType: "text",
                            width: 220
                        },
                        {
                            title: "性别",
                            fieldName: "sex",
                            fieldType: "custom",
                            filterType: "enum",
                            filterName: "criteria.intsValue.sex",
                            orderName :"userdetail.sex",
                            popFilterEnum : LIB.getDataDicList("sex"),
                            width: 100,
                            render: function (data) {
                                return LIB.getDataDic("sex",data.sex);
                            },
                        },
                        {
                            title: "年龄",
                            fieldName: "age",
                            sortable :false,
                            width: 160
                        },
                        {
                            title:"岗位",
                            fieldType:"custom",
                            filterType: "text",
                            sortable :false,
                            render: function(data){
                                var e = "";
                                if(data.positionList){
                                    data.positionList.forEach(function(item){
                                        if(item.postType === '0'){
                                            e += e===''? item.name : "；" + item.name;
                                        }
                                    })
                                }
                                return e;
                            },
                            width : 280
                        },
                        {
                            title: "手机号",
                            fieldName: "mobile",
                            filterType: "text",
                            width: 160
                        },
                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.dept,
                        {
                            title: "被派工次数",
                            fieldName: "total",
                            filterType: "text",
                            filterName: "criteria.intValue.total",
                            orderName :"alltask.total",
                            width: 160
                        },
                        {
                            title: "派工完成数",
                            fieldName: "done",
                            filterType: "text",
                            filterName: "criteria.intValue.done",
                            orderName :"donetask.done",
                            width: 160
                        },
                        ]
                }
            ),
            editModel: {
                //控制编辑组件显示
                title: "新增",
                //显示编辑弹框
                show: false,
                //编辑模式操作类型
                type: "create",
                id: null
            },
            detailModel: {
                //控制右侧滑出组件显示
                show: false
            },
            resetPsd: {
                //控制组件的显示
                title:"重置密码",
                //显示编辑弹框
                show:false,
                id:null
            },
            uploadModel: {
                url: "/user/importExcel",
            },
            exportModel : {
                url: "/user/exportExcel"
            },
            templete : {
                url : "/user/file/down"
            },
            importProgress:{
                show: false
            },
            copyModel: {
                visible: false,
                title: "复制",
                isNeedCopyRole: false,
                isNeedCopyPosition: false,
                isNeedCopyHse: false
            }

        };
    }
    var tpl = LIB.renderHTML(require("text!./main.html"));
    var vm = LIB.VueEx.extend({
        mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
        },
        methods: {
            toggleOrg: function () {
                this.showOrg = !this.showOrg;
            },
            //显示全部分类
            doShowCategory: function () {
                this.mainModel.showCategory = !this.mainModel.showCategory;
            },
            doImport:function(){
                var _this=this;
                _this.importProgress.show = true;
            },
            doEntLeaveOff:function(){
                var _this = this;
                var rows = this.tableModel.selectedDatas;
                if(rows.length>1){
                    LIB.Msg.warning("无法批量修改数据");
                    return;
                }
                var updateIds = rows[0].id,disable = rows[0].disable;
                if(disable==0){
                    api.updateDisable([updateIds]).then(function (res) {
                        _.each(rows, function (row) {
                            row.disable = 1;
                        });
                        _this.emitMainTableEvent("do_query_by_filter", {opType: "update", value: rows});
                        LIB.Msg.info("离职成功!");
                    });
                }else{
                    api.updateStartup([updateIds]).then(function (res) {
                        _.each(rows, function (row) {
                            row.disable = 0;
                        });
                        _this.emitMainTableEvent("do_query_by_filter", {opType: "update", value: rows});
                        LIB.Msg.info("复职成功!");
                    });
                }
            },
            //导出方法
            doExport: function () {
                LIB.doExportFile("/user/exportExcel");
            },

            //重置密码
            doChangePsd:function(){
                var rows = this.tableModel.selectedDatas;
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量修改数据");
                    return;
                }
                var row = rows[0];
                this.resetPsd.show = true;
                this.resetPsd.title = "重置密码";
                this.resetPsd.id = row.id;
                this.$broadcast('ev_editReload_psd', row.mobile);
            },
            // 下载二维码
            doDownloadQrCode:function () {
                window.location.href=LIB.ctxPath("/user/download/"+this.tableModel.selectedDatas[0].code);
            },
            doEditFinshed:function(data){
                var opType = data.id ? "update" : "add";
                this.emitMainTableEvent("do_update_row_data", {opType: opType, value: data});
                // this.refreshMainTable();
                this.editModel.show = false;
            },
            //重置密码
            doPsdFinshed:function(data){
                this.emitMainTableEvent("do_update_row_data", {value: data});
                this.resetPsd.show = false;
            },
            doAdd4Copy2: function () {
                this.copyModel.isNeedCopyRole = false;
                this.copyModel.isNeedCopyPosition = false;
                this.copyModel.isNeedCopyHse = false;
                this.copyModel.visible = true;
            },
            doSaveCopy: function () {
                this.$broadcast("ev_set_copy_parameter", this.copyModel.isNeedCopyRole, this.copyModel.isNeedCopyPosition, this.copyModel.isNeedCopyHse);
                this.copyModel.visible = false;
                this.doAdd4Copy();
            }
        },
        init: function(){
            this.$api = api;
        },
        ready: function () {

        }
    });
    return vm;
});
