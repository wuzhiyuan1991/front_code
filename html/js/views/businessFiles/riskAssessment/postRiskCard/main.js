define(function (require) {
    //基础js
    var LIB = require('lib');
    var BASE = require('base');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"))
    //右侧滑出详细页
    var detailComponent = require("./detail");
    //Vue数据模型
    var dataModel = function(){
        return{
            moduleCode: LIB.ModuleCode.BS_OrI_PosM,
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
                            title: this.$t("gb.common.code"),
                            fieldName: "code",
                            fieldType: "link",
                            filterType: "text",
                            width: 160
                        },
                        {
                            title: this.$t("ori.perm.positName"),
                            fieldName: "name",
                            filterType: "text" ,
                            width: 160
                        },
                        {
                            title: this.$t("ori.perm.responsibilities"),
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
                        //LIB.tableMgr.column.disable,
                        // _.extend(_.extend({}, LIB.tableMgr.column.dept), {orderName: "organizationId"}), //为了排序时兼容没有compId的页面
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
                            company.orderName =  "organizationId";
                            return company;
                        })(),
                    ],
                    defaultFilterValue: { "criteria.strValue.relType": 'riskcard'}
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
            uploadModel: {
                url: "/position/importExcel/position"
            },
            exportModel : {
                url: "/position/exportExcel/position"
            },

        }
    };

    var vm = LIB.VueEx.extend({
        template: tpl,
        mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        data:dataModel,
        components: {
            "detailcomponent": detailComponent,
        },
        methods: {

        },

        init: function () {
            this.$api = api;
        },
        ready: function () {

        },
        watch: {}
    });

    return vm;
});