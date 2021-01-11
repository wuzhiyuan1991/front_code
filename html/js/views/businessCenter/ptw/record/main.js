define(function (require) {
  //基础js
  var LIB = require('lib');
  var api = require("../todo/vuex/api");
  var commonApi = require("../api");
  var tpl = LIB.renderHTML(require("text!./main.html"));
  //编辑弹框页面fip (few-info-panel)
  // var detailPanel = require("./detail");      //修改 detailPanelClass : "middle-info-aside"
  //编辑弹框页面bip (big-info-panel)
  //	var detailPanel = require("./detail-xl");   //修改 detailPanelClass : "large-info-aside"
  //编辑弹框页面bip (big-info-panel) Legacy模式
  var detailPanel = require("../todo/detail-tab-xl"); //修改 detailPanelClass : "large-info-aside"
  var contactPtw = require("../components/modalPtwFill/contactPtw/contactPtw");

  var model = require("../model");
  var workCardApi = require("../workCard/vuex/api");
  var preview = require("../todo/dialog/preview");


  var concatMemberSelectModal = require("componentsEx/selectTableModal/concatorMemberSelectModal");

  //Legacy模式
  //	var ptwWorkCardFormModal = require("componentsEx/formModal/ptwWorkCardFormModal");

  // LIB.registerDataDic("iptw_work_card_enable_reservation", [
  // 	["0","否"],
  // 	["1","是"]
  // ]);
  //
  // LIB.registerDataDic("iptw_work_card_audit_result", [
  // 	["1","通过"],
  // 	["2","不通过"]
  // ]);


  var initDataModel = function () {
    return {
      concatorShow: false,
      moduleCode: "ptwWorkCardRecord",
      //控制全部分类组件显示
      mainModel: {
        vo: null,
        previewShow: false,
        showHeaderTools: false,
        //当前grid所选中的行
        selectedRow: [],
        // detailPanelClass : "middle-info-aside"
        detailPanelClass: "large-info-aside record-dialog",
        showDeleteResult: false,
        successMsg: null,
        faildMsg: null,
      },
      tableModel: LIB.Opts.extendMainTableOpt({
        // url: "ptwworkcard/list{/curPage}{/pageSize}?status=10", // 测试用 已完成的状态
        url: "ptwworkcard/list{/curPage}{/pageSize}",

        selectedDatas: [],
        // defaultFilterValue: {'criteria.intValue.todo':1},
        columns: [
          LIB.tableMgr.column.cb,
          LIB.tableMgr.column.code,
          LIB.tableMgr.column.company,
          {
            title: "作业类型",
            fieldName: "workCatalog.name",
            orderName: "workCatalog.name",
            filterType: "text",
            render: function (data) {
              if (data.workCatalog) {
                return data.workCatalog.name;
              }
              return '';
            },
            width: "130"
          },
          {
            title: "作业级别",
            fieldName: "workLevel.name",
            orderName: "workLevel.name",
            filterType: "text",
            width: "130"
          },
          {
            title: "作业申请人",
            fieldName: "applicant.name",
            orderName: "applicant.name",
            filterType: "text",
            width: "118"
          },
          {
            title: "状态",
            fieldName: "status",
            orderName: "status",
            filterType: "enum",
            fieldType: "custom",
            filterName: "criteria.intsValue.status",
            width: '85',
            popFilterEnum: LIB.getDataDicList("iptw_work_status"),
            render: function (data) {
              if (data.status) {
                return LIB.getDataDic('iptw_work_status', data.status)
              }
            },
          },
          {
            title: "作业内容",
            fieldName: "workContent",
            orderName: "workContent",
            filterType: "text",
            width: 270,
            render: function (data) {
              if (data.workPermit) {
                return data.workPermit.workContent
              }
              return data.workContent;
            },
          },
          {
            title: "作业地点",
            fieldName: "workPlace",
            orderName: "workPlace",
            filterType: "text",
            width: 270,
            render: function (data) {
              if (data.workPermit) {
                return data.workPermit.workPlace
              }
              return data.workPlace;
            },
          },
          {
            title: "作业所在的设备",
            fieldName: "workEquipment",
            orderName: "workEquipment",
            filterType: "text",
            width: 270,
            render: function (data) {
              if (data.workPermit) {
                return data.workPermit.workEquipment
              }
              return data.workEquipment;
            },
          },
          LIB.tableMgr.column.createDate,
        ]
      }),
      detailModel: {
        show: false
      },
      uploadModel: {
        url: "/ptwworkcard/importExcel"
      },
      exportModel: {
        url: "/ptwworkcard/exportExcel",
        withColumnCfgParam: true
      },
      isCheckKind: false
      //Legacy模式
      //			formModel : {
      //				ptwWorkCardFormModel : {
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
    watch: {
      "tableModel.selectedDatas": function (val) {
        this.mainModel.vo = val[0];
        this.checkAuthoriser();
      }
    },
    components: {
      "detailPanel": detailPanel,
      //Legacy模式
      //			"ptwworkcardFormModal":ptwWorkCardFormModal,
      contactPtw: contactPtw,
      preview: preview,
      concatMemberSelectModal: concatMemberSelectModal
    },
    methods: {
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
      concatorShowFun: function () {
        this.concatorShow = true;
      },
      checkAuthoriser: function () {
        var _this = this;
        this.deelBtnShow = false;
        if (!this.tableModel.selectedDatas[0]) return;
        if (this.tableModel.selectedDatas[0].status == 3) this.deelBtnShow = true;
        if (this.tableModel.selectedDatas[0].status == 2) this.deelBtnShow = true;
        if (((this.tableModel.selectedDatas[0].attr1 == 1 && this.tableModel.selectedDatas[0].status == 5) || this.tableModel.selectedDatas[0].status == 6)) {
          api.checkAuthoriser({
            id: this.tableModel.selectedDatas[0].id
          }).then(function (res) {
            _this.deelBtnShow = res.data && res.data.cloudFiles && res.data.cloudFiles.length > 0;
            _this.mainModel.workPersonnel = res.data;
          })
        }
      },
      doConcatPtw: function () {
        this.$refs.contactPtw.init(this.tableModel.selectedDatas[0]);
      },
      //Legacy模式
      //			doAdd : function(data) {
      //				this.formModel.ptwWorkCardFormModel.show = true;
      //				this.$refs.ptwworkcardFormModal.init("create");
      //			},
      //			doSavePtwWorkCard : function(data) {
      //				this.doSave(data);
      //			}
      showPreview: function (vo, permit) {
        this.$refs.preview.init(vo, permit);
        this.mainModel.previewShow = true;
      },
      gotoPreview: function () {
        var _this = this;
        api.getWorkCardDetail({
          id: this.mainModel.vo.id
        }).then(function (item) {
          var vo = item.data;
          workCardApi.tplDetail(_this.mainModel.vo.workPermit.cardTplId).then(function (model1) {
            workCardApi.getWorkPermit(_this.mainModel.vo.workPermit.id).then(function (permit1) {
                commonApi.getCatalogList({'criteria.intsValue':JSON.stringify({type:[6,7,8,9,10]})}).then(function (pro) {
                    var promise = {};
                    pro.forEach(function (item) {
                        if((item.type == 10 || item.type==8 || item.type==9) && item.enableCommitment==1)
                            promise[item.type] = item.content || item.name;
                        else if(item.type != 10 && item.type!=8 && item.type!=9){
                            promise[item.type] = item.content || item.name;
                        }
                    });

                    permit1.promiseList = promise;
                    model.getViewData(permit1, model1);
                    _this.showPreview(vo, permit1);
                });

            });
          })
        });
      },

      showPreview: function (vo, permit) {
        this.$refs.preview.init(vo, permit);
        this.mainModel.previewShow = true;
      },
      doStop: function () {
          var loadingModel = new LIB.Msg.circleLoading();
          var _this = this;
          var rows = _this.tableModel.selectedDatas;
          var deleteIds = _.map(this.tableModel.selectedDatas, function (row) {
              return row.id
          });

          LIB.Modal.confirm({
              title: '中止选中数据?',
              onOk: function () {
                  api.updateStatusStopIds(null, deleteIds).then(function (res) {
                      var data = res.data;
                      if (data.length > 0) {
                          _this.mainModel.showDeleteResult = true;
                          _this.mainModel.successMsg = '已成功中止记录' + (rows.length - data.length) + '条';
                          _this.mainModel.faildMsg = '失败中止记录' + data.length + '条';
                      } else {
                          LIB.Msg.info("已中止" + rows.length + "条数据！");
                      }
                      _this.refreshMainTableData();
                  });
              }
          });

      },
      doDelete: function () {
        var loadingModel = new LIB.Msg.circleLoading();
        var _this = this;
        var rows = _this.tableModel.selectedDatas;
        var deleteIds = _.map(this.tableModel.selectedDatas, function (row) {
          return row.id
        });
        if (rows.length > 1) {
          LIB.Modal.confirm({
            title: '删除选中数据?',
            onOk: function () {
              api.deleteByIds(null, deleteIds).then(function (res) {
                var data = res.data;
                if (data.length > 0) {
                  _this.mainModel.showDeleteResult = true;
                  _this.mainModel.successMsg = '已成功删除记录' + (rows.length - data.length) + '条';
                  _this.mainModel.faildMsg = '删除失败记录' + data.length + '条';
                } else {
                  LIB.Msg.info("已删除" + rows.length + "条数据！");
                }
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
              _this.$api.remove(null, rows[0]).then(function (data) {
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
    },
    events: {},
    init: function () {
      api.__auth__ = {
        "create": "7080004001", //发起作业
        'delete': '7080004003', //删除
        'deal': '7080004007', //处理
        'relate': '7080004008', //关联作业
        'preview': '7080004009', //预览
      };
      this.$api = api;
    }
  });

  return vm;
});