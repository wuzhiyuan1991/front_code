define(function (require) {
    //基础js
    var LIB = require('lib');
    var BASE = require('base');
    var api = require("./vuex/api");
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");
    //右侧滑出详细页
    var editRoleComponent = require("./dialog/edit-role");
    var editPosComponent = require("./dialog/edit-pos");
    var editComponent = require("./dialog/edit");
    var editPsdComponent = require("./dialog/edit-psd");
    //导入
    var importProgress = require("componentsEx/importProgress/main");
    LIB.registerDataDic("work_now", [
        ["0","已下班"],
        ["1","在上班"]
    ]);

    var initDataModel = function () {
        return {
            moduleCode: "workPerson1",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                showCategory: false,
                editRow:null,
                detailPanelClass : "middle-info-aside"
//				detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "user/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        // LIB.tableMgr.column.code,
                        {
                            title: '人员编码',
                            fieldName: "code",
                            width: 180,
                            orderName: "code",
                            // fieldType: "link",
                            filterType: "text"
                        },
                        {
                            title:'人员',
                            fieldName: "username",
                            orderName: "username",
                            filterType: "text",
                            width: 100
                        },
                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.dept,
                        {
                            title:'打卡上班时间',
                            fieldName: "workStateTime",
                            // orderName: "username",
                            // filterType: "text",
                            width: 100
                        }
                        // {
                        //     title:'在职',
                        //     orderName: "user.disable",
                        //     fieldType: "custom",
                        //     filterType: "enum",
                        //     filterName: "criteria.intsValue.disable",
                        //     fieldName:'disable',
                        //     popFilterEnum : LIB.getDataDicList("work_now"),
                        //     render: function (data) {
                        //         if(data && data.user && data.user.disable === '0') {
                        //             return '<i class="ivu-icon ivu-icon-checkmark-round" style="font-weight: bold;color: #aacd03;margin-right: 5px;"></i>' + '是';
                        //         } else {
                        //             return '<i class="ivu-icon ivu-icon-close-round" style="font-weight: bold;color: #f03;margin-right: 5px;"></i>' + '否';
                        //         }
                        //     },
                        //     width: 100
                        // },
                        // {
                        //     //人脸图片路径
                        //     title: "人脸注册时间",
                        //     fieldName: "createDate",
                        //     filterType: "date",
                        // },
                        // {
                        //     //人脸图片路径
                        //     title: "人脸图像",
                        //     fieldName: "filePath",
                        //     render: function (data) {
                        //         return '<img style="height:30px;width:auto" src="' + LIB.ctxPath() + '/html/images/default.png"/>'
                        //     },
                        // },
                    ],
                     defaultFilterValue : {"workState":1,"criteria.intsValue": {"disable":["0"]}}
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
                url: "/user/workPerson/exportExcel",
                withColumnCfgParam: true
            },
            templete : {
                url : "/user/file/down"
            },
            importProgress: {
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
            "editcomponent": editComponent,
            "editposcomponent": editPosComponent,
            "editrolecomponent": editRoleComponent,
            "editpsdcomponent":editPsdComponent,
            "detailPanel": detailPanel,
            "importprogress":importProgress
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

            //批量重置密码
            doChangePsdBatch:function(){
                this.resetPsd.show = true;
                this.resetPsd.title = "重置所有用户密码";
                this.$broadcast('ev_editReload_psd_batch');
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
        // ready: function () {
        //     if(this.$route.query.code){
        //         for(var i=0; i<this.filterConditions.length; i++){
        //             if(this.filterConditions[i].columnFilterName == 'code'){
        //                 this.filterConditions[i].displayTitle = '编码'
        //                 break;
        //             }
        //         }
        //     }
        //     var column = _.find(this.tableModel.columns, function (c) {
        //         return c.orderName === 'disable';
        //     });
        //     this.$refs.mainTable.doOkActionInFilterPoptip(null, column, ['0']);
        // }
    });

    return vm;
});
