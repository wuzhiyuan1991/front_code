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
      moduleCode: "legalRegulation",
      //控制全部分类组件显示
      mainModel: {
        showHeaderTools: false,
        //当前grid所选中的行
        selectedRow: [],
        detailPanelClass: "middle-info-aside"
        //detailPanelClass : "large-info-aside"
      },
      tableModel: LIB.Opts.extendMainTableOpt({
        url: "legalregulation/list{/curPage}{/pageSize}",
        selectedDatas: [],
        columns: [
          LIB.tableMgr.column.cb,
          _.extend(_.clone(LIB.tableMgr.column.code), {
            width: 110
          }),
          {
            title: "分类",
            orderName: "legalRegulationType.name",
            fieldName: "attr4",
            filterName: "legalRegulationType.name",
            filterType: "text",
            width: 300,
            'renderClass': "textarea",
          },
          {
            title: "依据内容",
            fieldName: "name",
            width: 500,
            filterType: "text",
            'renderClass': "textarea",
          },
          {
            title: "关键字",
            fieldName: "keyword",
            filterType: "text",
          },
          {
            title: "标签",
            fieldName: "label",
            filterType: "text",
          },
          {
            title: "解读",
            fieldName: "interpretation",
            filterType: "text",
          },
          {
            title: "适用行业",
            fieldName: "industryApply",
            filterType: "text",
          },
          LIB.tableMgr.column.disable,
          LIB.tableMgr.column.modifyDate,
          LIB.tableMgr.column.createDate
        ],
        defaultFilterValue: {
          "criteria.orderValue": {
            fieldName: "orderNo",
            orderType: "0"
          }
        }
      }),
      detailModel: {
        show: false
      },
      uploadModel: {
        url: "/legalregulation/importExcel"
      },
      exportModel: {
        url: "/legalregulation/exportExcel"
      },
      templete: {
        url: "/legalregulation/file/down"
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
      treeSelectData1: null
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
    methods: {
      //删除table的数据
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
      doAdd: function () {
        if (!this.typeId) {
          LIB.Msg.error("请选择检查依据分类");
          return;
        }

        this.$broadcast('ev_dtReload', "create");
        this.detailModel.show = true;
      },
      doTreeNodeClick: function (data) {
        var typeId = _.get(this.treeSelectData, "[0].id");
        this.treeSelectData1 = this.treeSelectData[0];

        this.typeId = typeId;
        var params = [{
          type: "save",
          value: {
            columnFilterName: "criteria.strValue",
            columnFilterValue: {
              typeId: typeId
            }
          }
        }];
        this.$refs.mainTable.doCleanRefresh(params);
      },
      doCreateType: function () {
        var parentId = _.get(this.treeSelectData, "[0].id");
        this.typeForm.visible = true;
        this.$broadcast("ev_le_regulation", "create", {
          id: parentId
        });
      },
      doUpdateType: function () {
        var data = _.find(this.legalTypes, "id", _.get(this.treeSelectData, "[0].id"));

        if (!data) {
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

        LIB.Modal.confirm({
          title: '删除当前数据将会删除所有下级数据，是否确认?',
          onOk: function () {
            api.removeLegalType(null, {
              id: id
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
        api.queryLegalTypes().then(function (res) {
          _this.legalTypes = res.data.list;
        });
      }
    },
    events: {},
    init: function () {
      if (this.$route.path.indexOf("/expertSupport") > -1) {
        api.__auth__ = {
          'create': '2010011001',
         'edit':   '2010011002',
         'delete': '2010011003',
         'import': '2010011004',
         'export': '2010011005',
         'createType': '2010012001',
         'editType':   '2010012002',
         'deleteType': '2010012003',
        };
      } else if (this.$route.path.indexOf("/sLawCom") > -1) {
        api.__auth__ = {
          'create': '9320003001',
          'edit':   '9320003002',
          'delete': '9320003003',
          'import': '9320003004',
          'export': '9320003005',
          'createType': '9320003006',
          'editType':   '9320003007',
          'deleteType': '9320003008',
        };
      } 
      this.$api = api;
      
    },
    ready: function () {
      this._getLegalTypes();
    }
  });

  return vm;
});