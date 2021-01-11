define(function (require) {
  //基础js
  var LIB = require('lib');
  var api = require("./vuex/api");
  //右侧滑出详细页
  var detailComponent = require("./detail-xl");
  //导入
  var importProgress = require("componentsEx/importProgress/main");

  var checkTableSelectModal = require("componentsEx/selectTableModal/checkTableSelectModal");

  //Vue数据模型
  var dataModel = function () {
    return {
      moduleCode: LIB.ModuleCode.BD_HaI_CheL,
      categoryModel: {
        config: [{
          NodeEdit: true,
          title: "业务分类",
          url: "checktabletype/list",
          type: "business"
        }]
      },
      editResult: false,
      tableModel: LIB.Opts.extendMainTableOpt({
        url: "checktable/list{/curPage}{/pageSize}",
        selectedDatas: [],
        columns: [
          LIB.tableMgr.column.cb,
          LIB.tableMgr.column.code,
          {
            //title : "检查表名称",
            title: this.$t("gb.common.CheckTableName"),
            orderName: "name",
            fieldName: "name",
            filterType: "text",
            width: 200
          },
          {
            //title : "适用属地",
            title: '适用属地',
            orderName: "dominationarea.id",
            fieldName: "dominationNames",
            filterName: "criteria.strValue.dominationNames",
            filterType: "text",
            width: 300,
            render: function (row) {
              if (row.isAllDomination === '1') {
                return '所有属地'
              }
              return row.dominationNames
            }
          }, {
            //title : "分类",
            title: this.$t("bd.hal.checkTableClass"),
            orderName: "checktabletype.name",
            fieldName: "checkTableType.name",
            //fieldType:"custom",
            //render: function(data){
            //	if(data.checkTableType){
            //		return data.checkTableType.name;
            //	}
            //},
            filterType: "text",
            filterName: "criteria.strValue.checkTableTypeName",
            width: 160
          }, {
            //title : "类型",
            title: this.$t("gb.common.type"),
            orderName: "type",
            fieldType: "custom",
            render: function (data) {
              return LIB.getDataDic("checkTable_type", data.type);
            },
            popFilterEnum: LIB.getDataDicList("checkTable_type"),
            filterType: "enum",
            filterName: "criteria.strsValue.type",
            width: 120
          },
          LIB.tableMgr.column.disable,
          LIB.tableMgr.column.company,
          {
            title: "风险点类型",
            orderName: "checkObjType",
            fieldType: "custom",
            render: function (data) {
              return LIB.getDataDic("check_obj_risk_type", data.checkObjType);
            },
            popFilterEnum: LIB.getDataDicList("check_obj_risk_type"),
            filterType: "enum",
            filterName: "criteria.strsValue.checkObjType",
            width: 150
          },
          LIB.tableMgr.column.createDate,
          LIB.tableMgr.column.modifyDate
        ],
        defaultFilterValue: {}
      }),
      //控制全部分类组件显示
      mainModel: {
        //显示分类
        showCategory: false,
        showHeaderTools: false,
        //当前grid所选中的行
        selectedRow: [],
        showBatchCopyResult: false,
        successMsg: null,
        faildMsg: null,
        failedReason: [],
      },
      detailModel: {
        //控制编辑组件显示
        title: "新增",
        //显示编辑弹框
        show: false,
        //编辑模式操作类型
        type: "create",
        id: null
      },
      batchCopyModel: {
        title: "批量复制",
        show: false,
        compId: null,
        rules: {
          "compId": [{
            required: true,
            message: '请选择所属公司'
          }],
        }
      },
      selectModel: {
        checkTableSelectModel: {
          visible: false
        }
      },
      uploadModel: {
        url: "/checktable/importExcel"
      },
      exportModel: {
        url: "/checktable/exportExcel"
      },
      templete: {
        url: "/checktable/file/down"
      },
      importProgress: {
        show: false
      },
      isEmer: false,
      isCheckKind: false,
    }

  };


  //使用Vue方式，对页面进行事件和数据绑定
  /**
   *  请统一使用以下顺序配置Vue参数，方便codeview
   *    el
   template
   components
   componentName
   props
   data
   computed
   watch
   methods
   events
   vue组件声明周期方法
   created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
   **/
  var tpl = LIB.renderHTML(require("text!./main.html"));
  var vm = LIB.VueEx.extend({
    template: tpl,
    data: dataModel,
    components: {
      "detailcomponent": detailComponent,
      "importprogress": importProgress,
      "checkTableSelectModal": checkTableSelectModal
    },
    methods: {
      checkSelect: function (val) {

        this.tableModel.isSingleCheck = !this.isCheckKind;
        if (!this.isCheckKind) {
          this.tableModel.selectedDatas = [];
          this.$refs.mainTable.doClearData();
          this.$refs.mainTable.doQuery();
        }

        this.$refs.mainTable.isSingleCheck = this.tableModel.isSingleCheck;
      },
      doShowCheckTableSelectModal: function () {
        this.selectModel.checkTableSelectModel.visible = true;
      },
      doSaveEmerTables: function (selectedDatas) {
        if (selectedDatas) {
          var _this = this;
          var data = _.map(selectedDatas, function (table) {
            return {
              checkTable: {
                id: table.id
              }
            };
          });
          this.$api.addToEmer(data).then(function (res) {
            _this.refreshMainTable();
          });
        }
      },
      doRemoveFromEmer: function () {
        var _this = this;
        var rows = _this.tableModel.selectedDatas;
        if (rows.length > 1) {
          LIB.Msg.warning("无法批量移除数据");
          return
        }
        var ids = _.map(rows, function (table) {
          return table.id;
        });
        this.$api.removeFromEmer(null, ids).then(function (res) {
          _this.refreshMainTable();
        });
      },
      doImport: function () {
        this.importProgress.show = true;
      },
      //根据分类查询
      doCategoryChange: function (obj) {
        //根据业务分类查询
        var data = {};
        data.columnFilterName = "checkTableTypeId";
        data.columnFilterValue = obj.nodeId;
        this.emitMainTableEvent("do_query_by_filter", {
          type: "save",
          value: data
        });

      },
      doEnableDisable: function () {
        var _this = this;
        var rows = _this.tableModel.selectedDatas;
        if (rows.length > 1) {
          LIB.Msg.warning("无法批量启用停用数据");
          return
        }
        var updateIds = rows[0].id,
          disable = rows[0].disable;
        //0启用，1禁用
        if (disable == 0) {
          api.batchDisable(null, [updateIds]).then(function (res) {
            // _.each(rows, function (row) {
            //     row.disable = '1';
            // });
            // _this.emitMainTableEvent("do_update_row_data", {opType: "update", value: rows});
            _this.refreshMainTable();
            LIB.Msg.info("停用成功!");
          });
        } else {
          api.batchEnable(null, [updateIds]).then(function (res) {
            // _.each(rows, function (row) {
            //     row.disable = '0';
            // });
            // _this.emitMainTableEvent("do_update_row_data", {opType: "update", value: rows});
            _this.refreshMainTable();
            LIB.Msg.info("启用成功!");
          });
        }
      },
      initData: function () {
        var bizType = this.$route.query.bizType;
        if (this.$route.query.bizType) {
          bizType = this.$route.query.bizType;
        }
        if (bizType) {
          this.templete.url = "/checktable/file/down" + "?bizType=" + bizType;
          this.uploadModel.url = "/checktable/importExcel" + "?bizType=" + bizType;

        }
        var params = [];
        //大类型
        params.push({
          value: {
            columnFilterName: "bizType",
            columnFilterValue: bizType
          },
          type: "save"
        });

        if (!this.$refs.mainTable.defaultFilterValue["criteria.intValue"]) {
          this.$refs.mainTable.defaultFilterValue["criteria.intValue"] = {};
        }
        if (!this.$refs.mainTable.defaultFilterValue["criteria.strsValue"]) {
          this.$refs.mainTable.defaultFilterValue["criteria.strsValue"] = {};
        }
        if (!this.$refs.mainTable.defaultFilterValue["criteria.strValue"]) {
          this.$refs.mainTable.defaultFilterValue["criteria.strValue"] = {};
        }
        _.set(this.$refs.mainTable.defaultFilterValue["criteria.intValue"], "isEmer", 0);

        var tableType = this.$route.query.tableType;
        tableType = tableType || "null";
        if (this.$route.path.indexOf("/randomInspection") == 0 || tableType == "01") {
          delete this.$refs.mainTable.defaultFilterValue["criteria.intValue"].isEmer;
          _.set(this.$refs.mainTable.defaultFilterValue["criteria.strsValue"], "type", ['0', '2']);
        } else if (this.$route.path.indexOf("/emer") == 0 || tableType == "11") {
          if (this.$route.path.indexOf("/emer") == 0) {
            _.set(this.$refs.mainTable.defaultFilterValue["criteria.intValue"], "isEmer", 1);
          } else {
            delete this.$refs.mainTable.defaultFilterValue["criteria.intValue"].isEmer;
          }
          _.set(this.$refs.mainTable.defaultFilterValue["criteria.strsValue"], "type", ['0', '1', '2']);
        } else if (bizType == 'inspect' && tableType && !_.isEmpty(LIB.getDataDic("icpe_check_table_type", tableType))) { //西部管道：工艺参数巡检表 || 现场巡检表
          delete this.$refs.mainTable.defaultFilterValue["criteria.intValue"].isEmer;
          var ids = LIB.getDataDic("icpe_check_table_type", tableType).split(",");
          _.set(this.$refs.mainTable.defaultFilterValue["criteria.strsValue"], "checkTableTypeIds", ids);
          _.set(this.$refs.mainTable.defaultFilterValue["criteria.strsValue"], "type", ['1', '2']);
        } else {
          delete this.$refs.mainTable.defaultFilterValue["criteria.intValue"].isEmer;

          delete this.$refs.mainTable.defaultFilterValue["criteria.strsValue"].checkTableTypeIds;
          _.set(this.$refs.mainTable.defaultFilterValue["criteria.strsValue"], "type", ['1', '2']);
        }

        this.$refs.mainTable.doQueryByFilter(params);
      },
      doAdd4BatchCopy: function () {
        var rows = this.tableModel.selectedDatas;
        var max = LIB.getBusinessSetByNamePath("tableBatchHandle.dataNumLimit").result
        if (max < rows.length) {
          LIB.Msg.warning("一次最多只能复制" + max + "条！");
          return;
        }
        this.batchCopyModel.compId = null;
        this.batchCopyModel.show = true;
      },
      doCopyBatch: function () {
        var _this = this;
        this.$refs.ruleform.validate(function (valid) {
          if (valid) {
            var rows = _this.tableModel.selectedDatas;
            var compId = _this.batchCopyModel.compId;
            var data = _.map(rows, function (table) {
              return {
                id: table.id,
                compId: compId
              };
            });
            api.copyBatch(null, data).then(function (res) {
              var data = res.data;
              if (data.length > 0) {
                _this.mainModel.showBatchCopyResult = true;
                _this.mainModel.successMsg = '已成功复制检查表' + (rows.length - data.length) + '条';
                _this.mainModel.faildMsg = '复制失败' + data.length + '条，具体原因如下：';
                _this.mainModel.failedReason = data;
              } else {
                LIB.Msg.info("批量复制成功！");
              }
              _this.refreshMainTable();
            });
            _this.batchCopyModel.show = false;
          }

        })
      },
    },
    //响应子组件$dispatch的event
    events: {},
    init: function () {
      var tableType = this.$route.query.tableType;
      tableType = tableType || "null";
      if (this.$route.path.indexOf("/randomInspection") == 0 || tableType == "01") {
        LIB.registerDataDic("checkTable_type", [
          ["0", "非计划检查"],
          ["2", "通用"]
        ]);
      } else if (this.$route.path.indexOf("/emer") == 0 || tableType == "11") {
        LIB.registerDataDic("checkTable_type", [
          ["0", "非计划检查"],
          ["1", "计划检查"],
          ["2", "通用"]
        ]);
      } else {
        LIB.registerDataDic("checkTable_type", [
          ["1", "计划检查"],
          ["2", "通用"]
        ]);
      }

      if (this.$route.path.indexOf("/randomInspection") == 0) {
        api.__auth__ = {
          create: '2010003001',
          'import': '2010003004',
          'export': '2010003005',
          edit: '2010003002',
          'delete': '2010003003',
          'copy': '2010003010',
          enable: '2010003021'
        };
      } else if (this.$route.path.indexOf("/emer") == 0) {
        api.__auth__ = {
          addToEmer: '9020007007',
          removeFromEmer: '9020007003',
          create: '9020007001',
          'import': '9020007004',
          'export': '9020007005',
          edit: '9020007002',
          'delete': 'xxx',
          'copy': '9020007010',
          enable: '9020007021'
        };
      } else {
        api.__auth__ = {
          create: '2010003001',
          'import': '2010003004',
          'export': '2010003005',
          edit: '2010003002',
          'delete': '2010003003',
          'copy': '2010003010',
          enable: '2010003021'
        };
      }
      this.$api = api;

    },
    ready: function () {
      this.isEmer = false;
      if (this.$route.path.indexOf("/emer") == 0) {
        this.isEmer = true;
      }
    },
    attached: function () {
      var tableType = this.$route.query.tableType;
      tableType = tableType || "null";
      if (this.$route.path.indexOf("/randomInspection") == 0 || tableType == "01") {
        LIB.registerDataDic("checkTable_type", [
          ["0", "非计划检查"],
          ["2", "通用"]
        ]);
      } else if (this.$route.path.indexOf("/emer") == 0 || tableType == "11") {
        LIB.registerDataDic("checkTable_type", [
          ["0", "非计划检查"],
          ["1", "计划检查"],
          ["2", "通用"]
        ]);
      } else {
        LIB.registerDataDic("checkTable_type", [
          ["1", "计划检查"],
          ["2", "通用"]
        ]);
      }

    }
  });

  return vm;
});