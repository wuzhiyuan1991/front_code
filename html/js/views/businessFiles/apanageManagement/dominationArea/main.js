define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    var BASE = require('base');
    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
    var detailPanel = require("./detail-xl");
    //导入
    var importProgress = require("componentsEx/importProgress/main");

    var initDataModel = function () {
        return {
            moduleCode: "dominationArea",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                // detailPanelClass : "middle-info-aside"
                detailPanelClass: "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "dominationarea/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                        {
                            //名称
                            title: "属地名称",
                            fieldName: "name",
                            // keywordFilterName: "criteria.strValue.keyWordValue_name",
                            filterType: "text"
                        },
                        {
                            title: "属地简称",
                            fieldName: "abbreviate",
                            filterType: "text"
                        },
                        // LIB.tableMgr.column.company,
                        // LIB.tableMgr.column.dept,
                        (function () {
                            var companyOld = LIB.tableMgr.column.company;
                            var company = _.cloneDeep(companyOld);

                            var render = companyOld.render;
                            var isHasCompMenu = false;
                            _.each(BASE.setting.menuList, function (item) {
                                if (item.routerPath && item.routerPath.indexOf('organizationalInstitution/CompanyFi') > -1) {
                                    isHasCompMenu = true;
                                }
                            });
                            if (isHasCompMenu) {
                                company.render = function (data) {
                                    var str = '';
                                    var comp = LIB.getDataDic("org", data.compId);
                                    str += '<a style="color:#33a6ff;" target="_blank" href="main.html#!/basicSetting/organizationalInstitution/CompanyFi?method=detail&id=' + data.compId + '&code=' + comp.code + '">' + render(data) + '</a>'
                                    return str;
                                };
                                company.renderHead = function () {
                                    var titleStr = '';
                                    var comp = LIB.getDataDic("org", LIB.user.compId);
                                    // titleStr = '<a target="_blank" href="main.html#!/basicSetting/organizationalInstitution/CompanyFi?method=select&code='+comp.code+'&id='+LIB.user.compId+'">所属公司</a>'
                                    titleStr = '<a style="color:#666;border-bottom:1px solid #666;padding-bottom:1px;" target="_blank" href="main.html#!/basicSetting/organizationalInstitution/CompanyFi">所属公司</a>'

                                    return titleStr;
                                };
                                company.tipRender = function (data) {
                                    var name = ' ';
                                    if (LIB.getDataDic("org", data.compId)) {
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
                                if (item.routerPath && item.routerPath.indexOf('organizationalInstitution/DepartmentalFi') > -1) {
                                    isHasCompMenu = true;
                                }
                            });
                            if (isHasCompMenu) {

                                company.render = function (data) {
                                    var str = '';
                                    var deptInfo = name = LIB.getDataDic("org", data.orgId);
                                    var disname = deptInfo.deptName ? deptInfo.deptName : '';
                                    if (disname)
                                        str += '<a style="color:#33a6ff;" target="_blank" href="main.html#!/basicSetting/organizationalInstitution/DepartmentalFi?method=detail&id=' + deptInfo.id + '&code=' + deptInfo.code + '">' + disname + '</a>'
                                    return str;
                                };
                                company.tipRender = function (data) {
                                    var deptInfo = name = LIB.getDataDic("org", data.orgId);
                                    var disname = deptInfo.deptName ? deptInfo.deptName : '';
                                    return disname;
                                };
                                company.renderHead = function () {
                                    return '<a style="color:#666;border-bottom:1px solid #666;padding-bottom:1px;" target="_blank" href="main.html#!/basicSetting/organizationalInstitution/DepartmentalFi">所属部门</a>';
                                };
                            }

                            return company;
                        })(),
                        LIB.tableMgr.column.disable,
                        LIB.tableMgr.column.remark
                    ]
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/dominationarea/importExcel"
            },
            exportModel: {
                visible: false,
                title: '导出',
                exportType: "0"
            },
            templete: {
                url: "/dominationarea/file/down"
            },
            importProgress: {
                show: false
            }

        };
    }

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
            "importprogress": importProgress

        },
        methods: {
            doImport: function () {
                var _this = this;
                _this.importProgress.show = true;
            },
            doExportExcel: function () {
                this.exportModel.exportType = "0";
                this.exportModel.visible = true;
            },
            _getExportURL: function () {
                var queryStr = LIB.urlEncode(this.$refs.mainTable.getCriteria());
                var originColumns = _.get(this.tableModel, "columns");
                var columns = window.localStorage.getItem("tb_code_" + this.moduleCode);
                var ret = [];

                if (columns) {
                    columns = JSON.parse(columns);
                    columns = _.filter(columns, function (col) {
                        return col.visible;
                    });
                    var _colsObj = _.indexBy(originColumns, 'title');
                    _.forEach(columns, function (col) {
                        var title = col.title;
                        var obj = _colsObj[title];
                        if (!title || title === "cb" || title === "radio") {
                            return;
                        }
                        if (!_.isPlainObject(obj) || obj.fieldType === 'tool') {
                            return;
                        }
                        ret.push({
                            title: col.title,
                            field: obj.dataDicKey || obj.fieldName
                        })
                    });
                } else {
                    ret = _.filter(originColumns, function (c) {
                        return c.title && c.title !== "cb" && c.title !== "radio" && c.fieldType !== 'tool';
                    })
                    ret = _.map(ret, function (column) {
                        return {
                            title: column.title,
                            field: column.dataDicKey || column.fieldName
                        }
                    });
                }
                var criteria = this.$refs.mainTable.getCriteria();
                if (!!criteria) {
                    var strValue = !!criteria['criteria.strValue'] ? JSON.parse(criteria['criteria.strValue']) : {};
                    _.extend(strValue, { _config: JSON.stringify(ret) });
                    var str = encodeURIComponent(JSON.stringify(strValue));
                    delete criteria['criteria.strValue'];
                    queryStr = LIB.urlEncode(criteria) + '&criteria.strValue=' + str;
                }
                return queryStr.replace("&", "?")
            },
            doExport: function () {
                this.exportModel.visible = false;
                var url = "/dominationarea/exportExcel/" + this.exportModel.exportType + this._getExportURL();
                window.open(url);
            },
            changeExportType: function () {
                this.exportModel.exportType = this.exportModel.exportType == "0" ? "1" : "0";
            }
        },
        events: {
        },
        init: function () {
            this.$api = api;
        },
        ready: function () {
            var column = _.find(this.tableModel.columns, function (c) {
                return c.fieldName === 'disable';
            });

            var showDominationAreaParent = LIB.getBusinessSetStateByNamePath("common.dominationAreaSetParentId");
            if (showDominationAreaParent) {
                this.tableModel.columns.push({
                    title: "上级属地",
                    fieldName: "attr1",
                });
            }
            this.$refs.mainTable.doOkActionInFilterPoptip(null, column, ['0']);
        }
    });

    return vm;
});
