define(function (require) {
    //基础js
    var LIB = require('lib');
    var BASE = require('base');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"))
    //数据模型
    //导入
    var importProgress = require("componentsEx/importProgress/main");
    //编辑弹框页面
    var editComponent = require("./dialog/edit");
    //右侧滑出详细页
    var detailComponent = require("./detail");
    var editPosComponent = require("./dialog/edit-pos");
    //var gridSel = "#jqxgrid";
    //Vue数据模型
    var initDataModel = function(){
        return{
            //moduleCode: LIB.ModuleCode.BS_OrI_PosM,
            moduleCode: 'BS_OrI_HseM',
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "position/list{/curPage}{/pageSize}",
                    selectedDatas: [],

                    columns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "cb"

                        },
                        {
                            //title:'编码',
                            title: this.$t("gb.common.code"),
                            fieldName: "code",
                            fieldType: "link",
                            filterType: "text",
                            width: 160
                        },
                        {
                            //title:'角色名称',
                            title: this.$t("bs.orl.securityRoleName"),
                            fieldName: "name",
                            filterType: "text",
                            width: 160
                        },
                        {
                            //title:'安全职责',
                            title: this.$t("bc.hal.safeRespon"),
                            fieldName: "remarks",
                            filterType: "text",
                            width: 320
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
                        LIB.tableMgr.column.disable,
                    ],

                    defaultFilterValue:{"postType":"1"}
                }
            ),
            //控制全部分类组件显示
            mainModel: {
                //显示分类
                showCategory: false,
                showHeaderTools: false,
                editRow:null
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
            detailModel: {
                //控制右侧滑出组件显示
                show: false
            },
            chooisePosModel: {
                //控制组件显示
                title: "岗位分配",
                //显示编辑弹框
                show: false
            },
            exportModel : {
                url: "/position/exportExcel/hse"
            },
            uploadModel: {
                url: "/position/importExcel/hse",
            },
            templete : {
                url : "/position/hse/file/down"
            },
            importProgress:{
                show: false
            },
            copyModel: {
                visible: false,
                title: "复制",
                isNeedCopyUser: false
            }
        }
    };

    var vm = LIB.VueEx.extend({
        template: tpl,
        mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        data:initDataModel,
        components: {
            "editcomponent": editComponent,
            "editposcomponent": editPosComponent,
            "detailcomponent": detailComponent,
            "importprogress":importProgress
        },
        methods: {
            doCategoryChange: function (obj) {
            },
            //显示全部分类
            doShowCategory: function () {
                this.mainModel.showCategory = !this.mainModel.showCategory;
            },
            doImport:function(){
                var _this=this;
                _this.importProgress.show = true;
            },
            doSuccessUpload: function (data) {
                if(data.rs.content) {
                    LIB.Msg.info("导入数据部分成功,失败数据:\n" + data.rs.content.join(";\n"));
                } else {
                    LIB.Msg.info("导入数据成功");
                }
                this.refreshMainTable();
            },
            doEditFinshed:function(data){
                var opType = data.id ? "update" : "add";
                this.emitMainTableEvent("do_update_row_data", {opType: opType, value: data});
                this.editModel.show = false;
            },
            doEditPosFinshed:function(data){
                //更新数据
                this.emitMainTableEvent("do_update_row_data", {opType: "update", value: data});
                this.chooisePosModel.show = false;
            },
            doAdd4Copy2: function () {
                this.copyModel.isNeedCopyUser = false;
                this.copyModel.visible = true;
            },
            doSaveCopy: function () {
                this.$broadcast("ev_set_copy_parameter", this.copyModel.isNeedCopyUser);
                this.copyModel.visible = false;
                this.doAdd4Copy();
            }
        },

        init: function(){
            this.$api = api;
        },
        ready: function () {
            if(this.$route.query.codes){
                var data = {
                    columnFilterName: "criteria.strValue.codes",
                    displayTitle: "编码",
                    displayValue: this.$route.query.codes,
                }
                this.$refs.condtionGroup.values = [data];
                return ;
            }
            var column = _.find(this.tableModel.columns, function (c) {
                return c.fieldName === 'disable';
            });
            this.$refs.mainTable.doOkActionInFilterPoptip(null, column, ['0']);
        },
        route: {
            activate: function(transition) {
                if(this.$route.query.codes){

                    var params = [
                        {
                            value : {
                                columnFilterName : "criteria.strValue.codes",
                                columnFilterValue :  this.$route.query.codes,
                            },
                            type : "save"
                        },
                    ];
                    this.$refs.mainTable && this.$refs.mainTable.doQueryByFilter(params); // 内部

                    return transition.next();
                }

                !this.initData ? this.refreshMainTable() : this.initData();

                transition.next();
                //恢复由keep-alive 导致的 页面表现形式和绑定只不一样的情况
                this.$nextTick(function () {
                    if($(".slideright-transition.aside.right:visible").length>0){
                        this.detailModel.show=true;
                    }
                })
            },
        },
        watch: {}
    });

    return vm;
});