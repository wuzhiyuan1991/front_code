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
                detailPanelClass : "middle-info-aside"
//				detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "user/list{/curPage}{/pageSize}/?type=0",
                    selectedDatas: [],
                    columns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "cb",
                        },
                        {
                            title: this.$t("gb.common.code"),
                            fieldName: "code",
                            fieldType: "link",
                            filterType: "text",
                            width: 160
                        },
                        {
                            title:this.$t("bd.trm.fullName"),
                            fieldName: "name",
                            orderName: "username",
                            filterType: "text",
                            width: 100
                        },
                        // LIB.tableMgr.column.company,
                        (function () {
                            var companyOld = LIB.tableMgr.column.company;
                            var company = _.cloneDeep(companyOld);

                            var render = companyOld.render;
                            var isHasCompMenu = false;
                            _.each(BASE.setting.menuList, function (item) {
                                if(item.routerPath && item.routerPath.indexOf('organizationalInstitution/CompanyFi') > -1){
                                    isHasCompMenu = true;
                                }
                            });
                            if(isHasCompMenu){
                                company.render = function (data) {
                                    var str = '';
                                    var comp =  LIB.getDataDic("org", data.compId);
                                    str += '<a style="color:#33a6ff;" target="_blank" href="main.html#!/basicSetting/organizationalInstitution/CompanyFi?method=detail&id='+data.compId+'&code='+comp.code+'">'+render(data)+'</a>'
                                    return str;
                                };
                                company.renderHead = function () {
                                    var titleStr='';
                                    var comp =  LIB.getDataDic("org", LIB.user.compId);
                                    // titleStr = '<a target="_blank" href="main.html#!/basicSetting/organizationalInstitution/CompanyFi?method=select&code='+comp.code+'&id='+LIB.user.compId+'">所属公司</a>'
                                    titleStr = '<a style="color:#666;border-bottom:1px solid #666;padding-bottom:1px;" target="_blank" href="main.html#!/basicSetting/organizationalInstitution/CompanyFi">所属公司</a>'

                                    return  titleStr;
                                };
                                company.tipRender = function (data) {
                                    var name = ' ';
                                    if(LIB.getDataDic("org", data.compId)){
                                        name = LIB.getDataDic("org", data.compId)["compName"]
                                    }
                                    return name;
                                };
                            }
                            return company;
                        })(),
                        // LIB.tableMgr.column.dept,
                        (function () {
                            var dept = LIB.tableMgr.column.dept;
                            var company = _.cloneDeep(dept);
                            var render = dept.render;
                            var isHasCompMenu = false;
                            _.each(BASE.setting.menuList, function (item) {
                                if(item.routerPath && item.routerPath.indexOf('organizationalInstitution/DepartmentalFi') > -1){
                                    isHasCompMenu = true;
                                }
                            });
                            if(isHasCompMenu){

                                company.render = function (data) {
                                    var str = '';
                                    var deptInfo = name = LIB.getDataDic("org", data.orgId);
                                    var disname = deptInfo.deptName?deptInfo.deptName:'';
                                    if(disname)
                                        str += '<a style="color:#33a6ff;" target="_blank" href="main.html#!/basicSetting/organizationalInstitution/DepartmentalFi?method=detail&id='+deptInfo.id+'&code='+deptInfo.code+'">'+disname+'</a>'
                                    return str;
                                };
                                company.tipRender = function (data) {
                                    var deptInfo = name = LIB.getDataDic("org", data.orgId);
                                    var disname = deptInfo.deptName?deptInfo.deptName:'';
                                    return disname;
                                };
                                company.renderHead = function () {
                                    return  '<a style="color:#666;border-bottom:1px solid #666;padding-bottom:1px;" target="_blank" href="main.html#!/basicSetting/organizationalInstitution/DepartmentalFi">所属部门</a>';
                                };
                            }

                            return company;
                        })(),

                        {
                            title: this.$t('bd.trm.loginName'),
                            fieldName: "loginName",
                            filterType: "text",
                            width: 160
                        },
                        {
                            title: this.$t("das.oniu.mobile"),
                            fieldName: "mobile",
                            filterType: "text",
                            width: 160
                        },
                        (function () {
                            return {
                                // title: this.$t("ori.perm.leader"),
                                title: '上级领导',
                                orderName: "leader_id",
                                fieldType: "custom",
                                filterType: "text",
                                filterName : "criteria.strValue.leaderName",
                                render: function (data) {
                                    if (data.leader) {
                                        return  '<a style="color:#33a6ff;" target="_blank" href="main.html#!/basicSetting/organizationalInstitution/PersonnelFi?method=detail&id='+data.leader.id+'&code='+data.leader.code+'">'+data.leader.username+'</a>';
                                    }
                                },
                                tipRender:function (data) {
                                    if (data.leader) {
                                        return data.leader.username;
                                    }
                                },

                                width: 100
                            }
                        })(),
                        {
                            title:this.$t("gb.common.state"),
                            orderName: "disable",
                            fieldType: "custom",
                            filterType: "enum",
                            filterName: "criteria.intsValue.disable",
                            popFilterEnum : LIB.getDataDicList("start_up"),
                            render: function (data) {
                                var text;
                                if (data.disable == 0) {
                                    text = "在职";
                                }
                                else {
                                    text = "离职"
                                }
                                if(data.disable === '0') {
                                    return '<i class="ivu-icon ivu-icon-checkmark-round" style="font-weight: bold;color: #aacd03;margin-right: 5px;"></i>' + text
                                } else {
                                    return '<i class="ivu-icon ivu-icon-close-round" style="font-weight: bold;color: #f03;margin-right: 5px;"></i>' + text
                                }
                            },
                            width: 100
                        },
                        {
                            title:this.$t("ori.perm.positName"),
                            fieldType:"custom",
                            filterType: "text",
                            filterName: "criteria.strValue.posiName",
                            sortable :false,
                            render: function(data){
                                if(data.positionList){
                                    var posNames = "";
                                    data.positionList.forEach(function (e) {
                                        if(e.postType == 0 && e.name){
                                            posNames += (e.name + " , ");
                                        }
                                    });
                                    posNames = posNames.substr(0, posNames.length - 2);
                                    return posNames;

                                }
                            },
                            width : 280
                        },
                        (function () {
                            var isHasCompMenu = false;
                            _.each(BASE.setting.menuList, function (item) {
                                if(item.routerPath && item.routerPath.indexOf('organizationalInstitution/HseRole') > -1){
                                    isHasCompMenu = true;
                                }
                            });
                            return {
                                // title:this.$t("bs.orl.securityRoleName"),
                                title:'安全角色',
                                fieldType:"custom",
                                filterType: "text",
                                filterName: "criteria.strValue.hseRoleName",
                                sortable :false,
                                render: function(data){
                                    var roleNames = "";
                                    var codes = ''
                                    if(data.positionList){
                                        data.positionList.forEach(function (e) {
                                            if(e.postType == 1 && e.name){
                                                roleNames += (e.name + " , ");
                                                codes += e.code +','
                                            }
                                        });
                                        roleNames = roleNames.substr(0, roleNames.length - 2);
                                        codes = codes.substr(0, codes.length - 1);
                                        if(isHasCompMenu){
                                            return  '<a style="color:#33a6ff;" target="_blank" href="main.html#!/basicSetting/organizationalInstitution/HseRole?'+'codes='+codes+'">'+roleNames+'</a>';
                                        }
                                        return roleNames;
                                    }
                                },
                                tipRender:function (data) {
                                    var roleNames = "";
                                    if(data.positionList) {
                                        data.positionList.forEach(function (e) {
                                            if (e.postType == 1 && e.name) {
                                                roleNames += (e.name + " , ");
                                            }
                                        });
                                        roleNames = roleNames.substr(0, roleNames.length - 2);
                                        return roleNames;
                                    }
                                },
                                renderHead :function () {
                                    if(isHasCompMenu){
                                        return  '<a style="color:#666;border-bottom:1px solid #666;padding-bottom:1px;" target="_blank" href="main.html#!/basicSetting/organizationalInstitution/HseRole">安全角色</a>';
                                    }
                                    return '安全角色';
                                },
                                width : 280
                            }
                        })(),
                        // {
                        //     //人脸图片路径
                        //     title: "人脸图像",
                        //     fieldName: "filePath",
                        //     render: function (data) {
                        //         if (data.cloudFiles) {
                        //             if (data.cloudFiles.length>0) {
                        //                 var img = LIB.convertFilePath(LIB.convertFileData(data.cloudFiles[0]))
                        //                 return '<img class="faceImg" style="height:30px;width:auto;cursor:pointer" src="' + img + '"/>'
                        //             }
                                   
                        //         } else {
                        //             return '<img   style="height:30px;width:auto" src="images/default.png"/>'
                        //         }
                        //     },
                        // }
                    ],
                    // defaultFilterValue : {"criteria.intsValue": {"disable":["0"]}}
                    // defaultFilterValue : {"criteria.intsValue": {"type":["0"]}}
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
        computed:{
            isAdmin:function(){
              return  LIB.user.id == '9999999999'
            }
        },
        methods: {
            doUpdateAtrr5:function(){
                var rows = this.tableModel.selectedDatas;
                api.update(null,{id:rows[0].id,attr5:1,compId:rows[0].compId,orgId:rows[0].orgId}).then(function(){
                    LIB.Msg.success('初始化成功')
                })
            },
            doTableCellClick: function (data) {
                var target = data.event.target
                if (target && target.classList.contains("faceImg")) {
                    $('.viewer-close').off('click')

                    this.images = _.map([data.entry.data.cloudFile], function (content) {
                        return LIB.convertFileData(content);
                    });
                    var _this = this;
                    setTimeout(function () {
                        _this.$refs.imageViewer.view(0);
                        $('.viewer-close').on('click',function () {
                           
                            _this.images = []
                        })
                    }, 100);



                } else if (data.cell.colId == 1) {
                    this.showDetail(data.entry.data)
                }

            },
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
        ready: function () {
            if(this.$route.query.code){
                for(var i=0; i<this.filterConditions.length; i++){
                    if(this.filterConditions[i].columnFilterName == 'code'){
                        this.filterConditions[i].displayTitle = '编码'
                        break;
                    }
                }
            }

            var column = _.find(this.tableModel.columns, function (c) {
                return c.orderName === 'disable';
            });
            this.$refs.mainTable.doOkActionInFilterPoptip(null, column, ['0']);
            if(this.$route.query.id){
                this.filterConditions.push(
                    {
                        columnFilterName: "criteria.strsValue.userIds",
                        columnFilterValue:  [this.$route.query.id],
                        displayTitle: '姓名',
                        displayValue: this.$route.query.name
                    });
                var params = [];
                //大类型
                params.push({
                    value: {
                        columnFilterName: "criteria.strsValue.userIds",
                        columnFilterValue:  [this.$route.query.id]
                    },
                    type: "save"
                });
                this.$refs.mainTable.doQueryByFilter(params);
            }
        }
    });

    return vm;
});
