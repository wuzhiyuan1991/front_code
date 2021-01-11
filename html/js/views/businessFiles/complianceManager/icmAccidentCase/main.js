define(function (require) {
  //基础js
  var Vue = require('vue')
  var LIB = require('lib');
  var api = require("./vuex/api");
  var tpl = LIB.renderHTML(require("text!./main.html"));
  var importProgress = require("componentsEx/importProgress/main");
  //编辑弹框页面fip (few-info-panel)
  var detailPanel = require("./detail"); //修改 detailPanelClass : "middle-info-aside"
  //编辑弹框页面bip (big-info-panel)
  //	var detailPanel = require("./detail-xl");   //修改 detailPanelClass : "large-info-aside"
  //编辑弹框页面bip (big-info-panel) Legacy模式
  //  var detailPanel = require("./detail-tab-xl");//修改 detailPanelClass : "large-info-aside"

  //Legacy模式
  //	var icmAccidentCaseFormModal = require("componentsEx/formModal/icmAccidentCaseFormModal");

  var importProgress = require("componentsEx/importProgress/main");
  LIB.registerDataDic("icm_accident_case_nature", [
    ["1", "责任事故"],
    ["0", "非责任事故"]
  ]);
  var initDataModel = function () {
    return {
      moduleCode: "icmAccidentCase",
      //控制全部分类组件显示
      mainModel: {
        showHeaderTools: false,
        //当前grid所选中的行
        selectedRow: [],
        detailPanelClass: "middle-info-aside"
        //				detailPanelClass : "large-info-aside"
      },
      tableModel: LIB.Opts.extendMainTableOpt({
        url: "icmaccidentcase/list{/curPage}{/pageSize}",
        selectedDatas: [],
        columns: [
          LIB.tableMgr.column.cb,
          LIB.tableMgr.column.code,
          {
            //标题
            title: "标题",
            fieldName: "title",
            filterType: "text",
            width: '300px'
          },
          {
            //事故发生日期
            title: "事故发生日期",
            fieldName: "accidentDate",
            filterType: "date",
            width: '130px',
            fieldType: "custom",
            render: function (data) {
              return LIB.formatYMD(data.accidentDate);
            }
          },
          // LIB.tableMgr.column.disable,
          // LIB.tableMgr.column.company,
          // LIB.tableMgr.column.dept,

          // {
          // 	//人员伤亡
          // 	title: "人员伤亡",
          // 	fieldName: "casualties",
          // 	filterType: "text"
          // },
          // {
          // 	//企业声誉
          // 	title: "企业声誉",
          // 	fieldName: "corporateReputation",
          // 	filterType: "text"
          // },
          // {
          // 	//对责任单位的处理建议
          // 	title: "对责任单位的处理建议",
          // 	fieldName: "deptSuggestions",
          // 	filterType: "text"
          // },
          // {
          // 	//事故直接原因
          // 	title: "事故直接原因",
          // 	fieldName: "directCause",
          // 	filterType: "text"
          // },
          //					{
          //						//事故启示和教训
          //						title: "事故启示和教训",
          //						fieldName: "enlightenment",
          //						filterType: "text"
          //					},
          //					{
          //						//环境影响
          //						title: "环境影响",
          //						fieldName: "envirImpact",
          //						filterType: "text"
          //					},
          //					{
          //						//事故间接原因
          //						title: "事故间接原因",
          //						fieldName: "indirectCause",
          //						filterType: "text"
          //					},
          //					{
          //						//整改和防范措施
          //						title: "整改和防范措施",
          //						fieldName: "measures",
          //						filterType: "text"
          //					},
          //					{
          //						//事故性质 1:责任事故,0:非责任事故
          //						title: "事故性质",
          //						fieldName: "nature",
          //						orderName: "nature",
          //						filterName: "criteria.intsValue.nature",
          //						filterType: "enum",
          //						fieldType: "custom",
          //						popFilterEnum: LIB.getDataDicList("icm_accident_case_nature"),
          //						render: function (data) {
          //							return LIB.getDataDic("icm_accident_case_nature", data.nature);
          //						}
          //					},
          //					{
          //						//对责任人员的处理建议
          //						title: "对责任人员的处理建议",
          //						fieldName: "personSuggestions",
          //						filterType: "text"
          //					},
          {
            //事故地点
            title: "事故发生地点",
            fieldName: "place",
            filterType: "text",
            width: '300px'
          },
          {
            //事故经过
            title: "事故经过",
            fieldName: "process",
            filterType: "text",
            width: '500px',
            tipClass: 'center'
          },
          //					{
          //						//财产损失
          //						title: "财产损失",
          //						fieldName: "propertyLoss",
          //						filterType: "text"
          //					},
          //					 LIB.tableMgr.column.remark,

          //					{
          //						//事故类别
          //						title: "事故类别",
          //						fieldName: "type",
          //						filterType: "text"
          //					},
          //					 LIB.tableMgr.column.modifyDate,
          ////					 LIB.tableMgr.column.createDate,
          //
        ]
      }),
      detailModel: {
        show: false
      },
      uploadModel: {
        url: "/icmaccidentcase/importExcel"
      },
      exportModel: {
        url: "/icmaccidentcase/exportExcel",
        withColumnCfgParam: true
      },
      templete: {
        url: "/icmaccidentcase/importExcelTpl/down"
      },
      importProgress: {
        show: false
      },
      isCheckKind: false,
      isHalfCheck: false
      //Legacy模式
      //			formModel : {
      //				icmAccidentCaseFormModel : {
      //					show : false,
      //				}
      //			}

    };
  }

  var vm = LIB.VueEx.extend({
    mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
    //Legacy模式
    //		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainLegacyPanel],
    template: tpl,
    data: initDataModel,
    components: {
      "detailPanel": detailPanel,
      "importprogress": importProgress,
      //Legacy模式
      //			"icmaccidentcaseFormModal":icmAccidentCaseFormModal,

    },
    methods: {
      doImport: function () {
        this.importProgress.show = true;
      },
      checkSelect: function (val) {
        this.tableModel.isSingleCheck = !this.isCheckKind;
        if (!this.isCheckKind) {
          this.tableModel.selectedDatas = [];
          this.$refs.mainTable.isSingleCheck = this.tableModel.isSingleCheck;
          this.$refs.mainTable.checkAll = false;
          this.$refs.mainTable.setAllCheckBoxValues(false);
          // this.$refs.mainTable.doClearData();
          // this.$refs.mainTable.doQuery();
          return;
        }

        this.$refs.mainTable.isSingleCheck = this.tableModel.isSingleCheck;
      },
      doDelete: function () {
        var loadingModel = new LIB.Msg.circleLoading();
        var _this = this;
        var rows = _this.tableModel.selectedDatas;
        var deleteIds = _.map(this.tableModel.selectedDatas, function (row) {
          return {
            id: row.id
          }
        });
        if (rows.length > 1) {
          LIB.Modal.confirm({
            title: '删除选中数据?',
            onOk: function () {
              api.deleteByIdOrIds(null, deleteIds).then(function (res) {

                LIB.Msg.info("已删除" + rows.length + "条数据！");

                _this.emitMainTableEvent("do_update_row_data", {
                  opType: "remove",
                  value: _this.tableModel.selectedDatas
                });
              });
            }
          });
        } else {
          LIB.Modal.confirm({
            title: '删除选中数据?',
            onOk: function () {
              _this.$api.remove(null, {
                id: rows[0].id
              }).then(function (data) {
                if (data.data && data.error != '0') {
                  LIB.Msg.warning("删除失败");
                  return;
                } else {
                  _this.mainModel.showHeaderTools = false;
                  _this.emitMainTableEvent("do_update_row_data", {
                    opType: "remove",
                    value: _this.tableModel.selectedDatas
                  });
                  LIB.Msg.success("删除成功");
                }
              });
            }
          });
        }
      },
      checkSelect: function (val) {

        this.tableModel.isSingleCheck = !this.isCheckKind;
        if (!this.isCheckKind) {
          this.tableModel.selectedDatas = [];
          this.$refs.mainTable.doClearData();
          this.$refs.mainTable.doQuery();
        }

        this.$refs.mainTable.isSingleCheck = this.tableModel.isSingleCheck;
      },
      //Legacy模式
      //			doAdd : function(data) {
      //				this.formModel.icmAccidentCaseFormModel.show = true;
      //				this.$refs.icmaccidentcaseFormModal.init("create");
      //			},
      //			doSaveIcmAccidentCase : function(data) {
      //				this.doSave(data);
      //			}

    },
    events: {},
    init: function () {
      this.$api = api;
    }
  });

  return vm;
});