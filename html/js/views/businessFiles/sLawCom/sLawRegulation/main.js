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
      moduleCode: "slawRe",
      //控制全部分类组件显示
      mainModel: {
        showHeaderTools: false,
        //当前grid所选中的行
        selectedRow: [],
        detailPanelClass: "middle-info-aside"
        //detailPanelClass : "large-info-aside"
      },
      tableModel: LIB.Opts.extendMainTableOpt({
        url: "irllegalregulation/list{/curPage}{/pageSize}",
        selectedDatas: [],
        columns: [
          LIB.tableMgr.column.cb,
          _.extend(_.clone(LIB.tableMgr.column.code), {
            width: 110
          }),
          {
            title: "分类",
            fieldName: "irlLegalRegulationType.name",
            orderName: "irlLegalRegulationType.name",
            filterType: "text",
          },
          {
            title: "名称",
            fieldName: "name",
            width: 300,
            filterType: "text",
            'renderClass': "textarea",
          },
          {
            //编号
            title: "编号",
            fieldName: "identifier",
            filterType: "text"
          },
          {
            title: "发布机关",
            fieldName: "office",
            filterType: "text",
          },
          {
            //颁布时间
            title: "颁布时间",
            fieldName: "publishDate",
            filterType: "date",
            fieldType: "custom",
            render: function (data) {
              return LIB.formatYMD(data.publishDate)
            }
          },
          {
            //实施时间
            title: "实施时间",
            fieldName: "effectiveDate",
            filterType: "date",
            fieldType: "custom",
            render: function (data) {
              return LIB.formatYMD(data.effectiveDate)
            }
          },


          {
            //关键字
            title: "关键字",
            fieldName: "keyword",
            filterType: "text"
          },
          {
            //标签
            title: "标签",
            fieldName: "label",
            filterType: "text"
          },
          {
            //解读
            title: "解读",
            fieldName: "interpretation",
            filterType: "text"
          },
          {
            //适用行业
            title: "适用行业",
            fieldName: "industryApply",
            filterType: "text"
          },

          // LIB.tableMgr.column.disable,
          // LIB.tableMgr.column.modifyDate,
          // LIB.tableMgr.column.createDate
        ],
        defaultFilterValue: {
          "criteria.orderValue": {
            fieldName: "orderNo",
            orderType: "0"
          }
        }
      }),
      irllegalregulation: {},
      detailModel: {
        show: false
      },
      uploadModel: {
        url: "/irllegalregulation/importExcel"
      },
      exportModel: {
        url: "/irllegalregulation/exportExcel",
        withColumnCfgParam: true
      },
      templete: {
        url: "/irllegalregulation/importExcelTpl/down"
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
      treeSelectData: function (val) {
        if (val.length > 0) {
          this.$refs.mainTable.doQuery({ 'irlLegalRegulationType.id': val[0].id })
          this.irllegalregulation = val[0]
          this.typeId = this.irllegalregulation.id
        } else {
          this.$refs.mainTable.doQuery()
          this.irllegalregulation = {}
        }
      }
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
        var parentId = _.get(this.treeSelectData, "[0].id");
        this.typeForm.visible = true;
        this.$broadcast("ev_le_regulation", "create", {
          id: parentId
        });
      },
      doUpdateType: function () {
        var data = _.find(this.legalTypes, "id", _.get(this.treeSelectData, "[0].id"));

        if (this.treeSelectData.length == 0) {
          LIB.Msg.warning("请选择法律法规");
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
        if (this.treeSelectData.length == 0) {
          LIB.Msg.warning("请选择法律法规");
          return;
        }
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
          if (res.data.length > 0) {
            _this.legalTypes = res.data;
            _this.treeSelectData = [res.data[0]]
          } else {
            _this.legalTypes = []
          }
        });
      },
      doAddCreate: function () {
        if (this.treeSelectData.length == 0) {
          LIB.Msg.warning("请选择法律法规");
          return;
        }
        this.doAdd()
      },

    },
    events: {},
    init: function () {
      this.$api = api;
    },
    ready: function () {
      this._getLegalTypes();
    }
  });

  return vm;
});