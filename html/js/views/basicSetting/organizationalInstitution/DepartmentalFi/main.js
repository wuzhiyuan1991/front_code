define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    var BASE = require('base')
    //导入
    var importProgress = require("componentsEx/importProgress/main");
    var detailPanel = require("./edit");

    var isHasCompMenu = false;

    //数据模型
    var ModualAllView=require("../CompanyFi/dialog/company_chart");
    //右侧滑出详细页
    //var detailComponent = require("./detail");
    //var gridSel = "#jqxgrid";
    //Vue数据模型
    var initDataModel = function(){
       return{
           modualCompanychart:{show:false,title:"总览图"},
           moduleCode: LIB.ModuleCode.BS_OrI_DepD,
           tableModel: LIB.Opts.extendMainTableOpt(
               {
                   url: "dept/list{/curPage}{/pageSize}?type=2",
                   //url: "organization/list{/curPage}{/pageSize}",
                   selectedDatas: [],

                   columns: [
                       {
                           title: "",
                           fieldName: "id",
                           fieldType: "cb",

                       }, {
                           title: this.$t("gb.common.code"),
                           fieldName: "code",
                           fieldType: "link",
                           filterType: "text",
                           width: 160
                       },
                       {
                           title: this.$t("bs.orl.departName"),
                           fieldName: "name",
                           filterType: "text",
                           width: 160
                       },
                       // LIB.tableMgr.column.company,
                       (function () {
                           var companyOld = LIB.tableMgr.column.company;
                           var company = _.cloneDeep(companyOld);

                           var render = company.render;
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
                       (function () {
                           var deptByParentId = LIB.tableMgr.column.deptByParentId;
                           var company = _.cloneDeep(deptByParentId);
                           var render = company.render;
                           // var isHasCompMenu = _.some(function (item) {
                           //     return item.routerPath.indexOf('/basicSetting/organizationalInstitution/CompanyFi') > -1;
                           // });
                           company.render = function (data) {
                               var str = '';
                               var disname = render(data)?render(data):'';
                               if(data.parent)
                                   str += '<a style="color:#33a6ff;" target="_blank" href="main.html#!/basicSetting/organizationalInstitution/DepartmentalFi?method=detail&id='+data.parent.id+'&code='+data.parent.code+'">'+disname+'</a>'
                               return str;
                           };
                           company.tipRender = function (data) {
                               var name = ' ';
                               if(LIB.getDataDic("org", data.parentId)){
                                   name = LIB.getDataDic("org", data.parentId)["deptName"]
                               }
                               return name;
                           };
                           company.renderHead = function () {
                               var titleStr='';
                               var comp =  LIB.getDataDic("org", LIB.user.orgId);
                               if(comp.code){
                                   titleStr = '<a style="color:#666;border-bottom:1px solid #666;padding-bottom:1px;" target="_blank" href="main.html#!/basicSetting/organizationalInstitution/DepartmentalFi?method=select&code='+comp.code+'&id='+LIB.user.orgId+'">所属部门</a>'
                               }else{
                                   titleStr = '所属部门'
                               }
                               return  '所属部门';
                           };

                           return company;
                       })(),
                       LIB.tableMgr.column.disable,
                       {
                           title: this.$t("bs.bac.contactNumber") ,
                           fieldName: "phone",
                           filterType: "text",
                           width: 160
                       }
                       ,
                       {
                           title : "操作",
                           fieldType : "tool",
                           toolType : "move"
                       }
                   ],
                   defaultFilterValue : {"criteria.orderValue" : {fieldName : "orderNo", orderType : "0"}}
               }
           ),
           //控制全部分类组件显示
           mainModel: {
               //显示分类
               showCategory: false,
               showHeaderTools: false,
               editRow:null,
               detailPanelClass : "middle-info-aside"
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
               url: "/dept/importExcel",
           },
           exportModel : {
               url: "/dept/exportExcel"
           },
           templete : {
               url: "/dept/file/down"
           },
           importProgress:{
               show: false
           }
       }
    };

    var vm = LIB.VueEx.extend({
        template:tpl,
        mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        data:initDataModel,
        components: {
            "detailPanel": detailPanel,
            "importprogress":importProgress,
            "modual-companychart":ModualAllView,
        },
        watch:{
            "editModel.show":function(val){
                if(!val){
                   this.$refs.resetmodal.reset();
                }
            },
        },
        methods: {
            companyChange:function(pms){
                this.companyId=pms.nodeId;
            },
            doAllView:function() {
                window.open("allview.html?type=2&id="+this.companyId);
            },
            doMoveRow: function(item) {
                var _this = this;
                var data = item.entry.data;
                var param = {
                    id : data.id,
                    parentId: data.parentId
                };
                _.set(param, "criteria.intValue.offset", item.offset);
                api.order(null, param).then(function() {
                    _this.$refs.mainTable.doRefresh('noScrollToTop');
                });
            },
            //显示全部分类
            doShowCategory: function () {
                this.mainModel.showCategory = !this.mainModel.showCategory;
            },
            doImport:function(){
                var _this=this;
                _this.importProgress.show = true;
            },
            doEditFinshed:function(data){
                var opType = data.id ? "update" : "add";
                this.refreshMainTableData();
                this.editModel.show = false;
            },
            afterDoDetailCreate:function () {
                this.$refs.categorySelector.refreshOrgList();
            },
            afterDoDetailUpdate:function () {
                this.$refs.categorySelector.refreshOrgList();
            },
            afterDoDetailDelete:function () {
                this.$refs.categorySelector.refreshOrgList();
            },
            afterDoDelete: function(vo) {
                LIB.updateOrgCache(vo, {type : "delete"});
                this.$refs.categorySelector.refreshOrgList();
            },
            //通过组织结构过滤当前table的数据
            doOrgCategoryChange: function(obj) {
                //obj.categoryType
                var data = {};
                //条件 标题
                data.displayTitle = "";
                //条件 内容
                data.displayValue = "";
                //条件 后台搜索的 属性
                data.columnFilterName = "orgId";
                //条件 后台搜索的 值
                if (obj.categoryType === "org" && obj.topNodeId === obj.nodeId) {
                    //如果是根据当前最大组织机构过滤时,则不传参数,后台默认处理
                    data.columnFilterValue = null;
                } else {
                    data.columnFilterValue = obj.nodeId;
                }

                this._cacheSelectOrg = obj;

                this.emitMainTableEvent("do_query_by_filter", { type: "save", value: data });
            },
            // 操作后需要根据所选公司id刷新table
            refreshMainTable: function () {
                if(this._cacheSelectOrg) {
                    this.doOrgCategoryChange(this._cacheSelectOrg);
                } else {
                    this.emitMainTableEvent("do_query_by_filter");
                }
            },
            doEnableDisable: function (dataCallback, handler) {
                var _this = this;
                var rows = _this.tableModel.selectedDatas;
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量操作");
                    return
                }
                var data = rows[0];
                var disable = (data.disable == "0") ? "1" : "0";
                var param = _.extend({disable: disable}, _.pick(data, "id", "orgId"));

                if (disable == "1") {//停用判断
                    api.countChildrenOrg({id:data.id}).then(function (res) {
                        var val = res.data;
                        if (val > 0) {
                            LIB.Modal.confirm({
                                title: data.name+'有子部门，请确认是否要停用？',
                                onOk: function () {
                                    _this.updateDisable(param,disable);
                                }
                            });
                        } else {
                            _this.updateDisable(param,disable);
                        }
                    })
                } else {
                    _this.updateDisable(param,disable);
                }
            },
            updateDisable:function(param,disable) {
                var _this = this;
                api.updateDisable(null, param).then(function (res) {
                    _this.refreshMainTable();
                    LIB.Msg.info((disable == "0") ? "启用成功" : "停用成功");
                });
            }
        },
        init: function () {
            this.$api = api;
        },
        ready: function () {
            if(this.$route.query.code) {
                var data = {
                    columnFilterName: "code",
                    columnFilterValue:this.$route.query.code,
                    displayTitle: "编码",
                    displayValue: this.$route.query.code,
                }

                for(var i=0; i<this.filterConditions.length; i++){
                    if(this.filterConditions[i].columnFilterName == 'code'){
                        this.filterConditions[i].displayTitle = '编码'
                        break;
                    }
                }
                // this.doAddDisplayFilterValue(data);
            };
            var column = _.find(this.tableModel.columns, function (c) {
                return c.fieldName === 'disable';
            });
            this.$refs.mainTable.doOkActionInFilterPoptip(null, column, ['0']);
        }
    });

    return vm;
});