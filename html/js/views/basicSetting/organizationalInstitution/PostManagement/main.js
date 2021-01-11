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
  var dataModel = function () {
    return {
      moduleCode: LIB.ModuleCode.BS_OrI_PosM,
      tableModel: LIB.Opts.extendMainTableOpt({
        url: "position/list{/curPage}{/pageSize}",
        selectedDatas: [],
        columns: [{
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
            filterType: "text",
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
          LIB.tableMgr.column.disable,
          // _.extend(_.extend({}, LIB.tableMgr.column.dept), {orderName: "organizationId"}), //为了排序时兼容没有compId的页面
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
            company.orderName = "organizationId";
            return company;
          })(),
        ],
        defaultFilterValue: {
          "postType": "0"
        }
      }),
      //控制全部分类组件显示
      mainModel: {
        //显示分类
        showCategory: false,
        showHeaderTools: false,
        editRow: null
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
      uploadModel: {
        url: "/position/importExcel/position"
      },
      exportModel: {
        url: "/position/exportExcel/position"
      },
      templete: {
        url: "/position/file/down"
      },
      importProgress: {
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
    mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
    data: dataModel,
    components: {
      "editcomponent": editComponent,
      "editposcomponent": editPosComponent,
      "detailcomponent": detailComponent,
      "importprogress": importProgress
    },
    methods: {
      doCategoryChange: function (obj) {
        //            	if(obj.categoryType == "xxx") {
        //            	}
      },
      doImport: function () {
        var _this = this;
        _this.importProgress.show = true;
      },
      doAlotPos: function () {
        var rows = this.tableModel.selectedDatas;
        if (rows.length > 1) {
          LIB.Msg.warning("无法批量修改数据");
          return;
        }
        var row = rows[0];
        if (row.organizationId == null) {
          LIB.Msg.warning("请先为该岗位分配组织机构");
          return;
        }
        this.chooisePosModel.show = true;
        this.chooisePosModel.title = "岗位分配";
        this.chooisePosModel.id = null;
        this.$broadcast('ev_editPosReload', row.id);
      },
      doEmitFinshed: function (data) {
        var opType = data.id ? "update" : "add";
        this.emitMainTableEvent("do_update_row_data", {
          opType: opType,
          value: data
        });
        this.editModel.show = false;
      },
      doEditPosFinshed: function () {
        //更新数据
        this.emitMainTableEvent("do_update_row_data", {
          opType: "update",
          value: data
        });
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

    init: function () {
      this.$api = api;
    },
    ready: function () {
      var column = _.find(this.tableModel.columns, function (c) {
        return c.fieldName === 'disable';
      });
      this.$refs.mainTable.doOkActionInFilterPoptip(null, column, ['0']);
    },
    watch: {}
  });

  return vm;
});