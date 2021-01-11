define(function (require) {
  //基础js
  var LIB = require('lib');
  var api = require("./vuex/api");
  var tpl = LIB.renderHTML(require("text!./main.html"));
  //编辑弹框页面fip (few-info-panel)
  var detailPanel = require("./detail");
  var typeFormModal = require("./dialog/typeFormModal");
  //编辑弹框页面bip (big-info-panel)
  //var detailPanel = require("./detail-xl");
  var initDataModel = function () {
    return {
      moduleCode: "sOrg",
      //控制全部分类组件显示
      mainModel: {
        showHeaderTools: false,
        //当前grid所选中的行
        selectedRow: [],
        detailPanelClass: "middle-info-aside"
        //detailPanelClass : "large-info-aside"
      },
      tableModel: LIB.Opts.extendMainTableOpt({
        url: "securityagencyrole/list{/curPage}{/pageSize}",
        selectedDatas: [],
        columns: [
          LIB.tableMgr.column.cb,
          _.extend(_.clone(LIB.tableMgr.column.code), {
            width: 110
          }),
          {
            title: "安全机构",
            fieldName: "securityAgency.name",

            filterType: "text",
            width: 150,
            'renderClass': "textarea",
          },
          {
            title: "成员",
            fieldName: "user.name",
            width: 300,
            filterType: "text",

          },
          {
            //角色名字
            title: "角色名字",
            fieldName: "rolename",
            filterType: "text",
          },
          {
            //职责内容
            title: "职责内容",
            fieldName: "content",
            filterType: "text"
          },
          LIB.tableMgr.column.company,
          LIB.tableMgr.column.dept,

        ],
        // defaultFilterValue: {
        //   "criteria.orderValue": {
        //     fieldName: "orderNo",
        //     orderType: "0"
        //   }
        // }
      }),
      detailModel: {
        show: false
      },
      uploadModel: {
        url: "/securityagencyrole/importExcel"
      },
      exportModel: {
        url: "/securityagencyrole/exportExcel",
        withColumnCfgParam: true
      },
      templete: {
        url: "/securityagencyrole/importExcelTpl/down"
      },
      importProgress: {
        show: false
      },
      legalTypes: null,
      treeSelectData: [],
      typeForm: {
        visible: false
      },
      typeId: null,
      compId: null,
      treeSelectData1: null,
      securityagency: {}
    };
  };

  var vm = LIB.VueEx.extend({
    mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
    template: tpl,
    data: initDataModel,
    components: {
      "detailPanel": detailPanel,
      "typeFormModal": typeFormModal
    },
    watch: {
      compId: function (val) {
        this._getLegalTypes();
      },
      treeSelectData: function (val) {

        if (val.length > 0) {
          this.$refs.mainTable.doQuery({ 'securityAgency.id': val[0].id })
          this.securityagency = val[0]
        } else {
          this.$refs.mainTable.doClearData()
          this.securityagency = {}
        }
      }
    },
    methods: {
      //删除table的数据
      doAllView: function () {
        window.open("orgMgr.html?id="+this.compId);
      },
      doDelete: function () {

        //当beforeDoDelete方法明确返回false时,不继续执行doDelete方法, 返回undefine和true都会执行后续方法
        if (this.beforeDoDelete() == false) {
          return;
        }

        var allowMulti = !!this.tableModel.allowMultiDelete;
        var _this = this;
        // var deleteIds = _.map(this.tableModel.selectedDatas, function (row) {
        //     return row.id
        // });
        if (!allowMulti && this.tableModel.selectedDatas.length > 1) {
          LIB.Msg.warning("一次只能删除一条数据");
          return;
        }
        var _vo = this.tableModel.selectedDatas[0];
        var obj = {
          id: _vo.id
        }
        LIB.Modal.confirm({
          title: '确定删除数据?',
          onOk: function () {
            _this.$api.remove(null, obj).then(function () {
              _this.afterDoDelete(_vo);
              _this.emitMainTableEvent("do_update_row_data", {
                opType: "remove",
                value: _this.tableModel.selectedDatas
              });
              LIB.Msg.info("删除成功");
            });
          }
        });
      },
      doImport: function () {
        this.importProgress.show = true;
      },
      // doAdd: function () {
      //   if (!this.typeId) {
      //     LIB.Msg.error("请选择检查依据分类");
      //     return;
      //   }
      //
      //   this.$broadcast('ev_dtReload', "create");
      //   this.detailModel.show = true;
      // },
      doTreeNodeClick: function (data) {
        // var typeId = _.get(this.treeSelectData, "[0].id");
        // this.treeSelectData1 = this.treeSelectData[0];
        //
        // this.typeId = typeId;
        // var params = [{
        //   type: "save",
        //   value: {
        //     columnFilterName: "criteria.strValue",
        //     columnFilterValue: {
        //       typeId: typeId
        //     }
        //   }
        // }];
        // this.$refs.mainTable.doCleanRefresh(params);
      },
      doCreateType: function () {
        var parentId = ''
        if (this.treeSelectData.length > 0) {
          parentId = _.get(this.treeSelectData, "[0].id");
        }
        this.typeForm.visible = true;
        this.$broadcast("ev_le_regulation", "create", {
          id: parentId
        });
      },
      doUpdateType: function () {
        var data = _.find(this.legalTypes, "id", _.get(this.treeSelectData, "[0].id"));

        if (this.treeSelectData.length == 0) {
          LIB.Msg.warning("请选择安全机构");
          return;
        }
        this.typeForm.visible = true;
        this.$broadcast("ev_le_regulation", "update", data);
      },
      doSaveType: function () {
        this._getLegalTypes();
        this.typeForm.visible = false;
      },
      doDeleteType: function () {
        var _this = this;
        var id = _.get(this.treeSelectData, "[0].id");
        var orgId = _.get(this.treeSelectData, "[0].orgId");
        if (this.treeSelectData.length == 0) {
          LIB.Msg.warning("请选择安全机构");
          return;
        }
        LIB.Modal.confirm({
          title: '删除当前数据将会删除所有下级数据，是否确认?',
          onOk: function () {
            api.removeLegalType(null, {
              id: id,orgId:orgId
            }).then(function () {
              LIB.Msg.success("删除成功");
              _this._getLegalTypes();
              _this.$refs.mainTable.doCleanRefresh();
            });
          }
        });
      },
      _getLegalTypes: function () {
        var _this = this;
        api.queryLegalTypes({ compId: this.compId }).then(function (res) {


          if (res.data.length > 0) {
            _this.legalTypes = res.data;
            _this.treeSelectData = [res.data[0]]
          } else {
            _this.legalTypes = []
            _this.treeSelectData =[]
          }

        });
      },
      doCompanyChange: function (val) {
        
        if (val.nodeVal=='所有公司') {
          this.compId = LIB.user.compId
          return
        }
        this.compId = val.nodeId
      },
      doOrgCategoryChange: function (val) {

      },
      doAddCreate: function () {
        if (this.treeSelectData.length == 0) {
          LIB.Msg.warning("请选择安全机构");
          return;
        }
        this.doAdd()
      },
      doPreview: function () {

      },
   
    },
    events: {},
    init: function () {
      this.$api = api;
    },
    ready: function () {
      // this._getLegalTypes();
    }
  });

  return vm;
});