define(function (require) {
  //基础js
  var LIB = require('lib');
  var api = require("./vuex/api");
  //右侧滑出详细页
  var editComponent = require("./detail-xl");
  //导入
  var importProgress = require("componentsEx/importProgress/main");
  //Vue数据模型
  var dataModel = function () {
    if (LIB.setting.useCheckInsteadOfCodeAsLink) {
      LIB.tableMgr.column.code = {
        title: "  ",
        width: '80px',
        fieldType: "custom",
        fieldName: 'code',
        fixed: true,
        render: function () {
          return '<div style="color: #33a6ff;cursor: pointer;">查 看</div>'
        }
      }
    }
    return {
      moduleCode: LIB.ModuleCode.BC_Hal_InsR,
      tableModel: LIB.Opts.extendMainTableOpt({
        url: "checktaskgroup/list{/curPage}{/pageSize}?type=1",
        selectedDatas: [],
        columns: [{
            //隐患描述
            title: "",
            width: 60,
            visible: false
          },
          LIB.tableMgr.column.cb,
          LIB.tableMgr.column.code,
          {
            title: "检查任务",
            filterType: "text",
            fieldName: "groupName",
            render: function (data) {
              return data.groupName + "#" + data.num;
            },
            width: 240
          },
          {
            title: "检查对象",
            filterType: "text",
            filterName: "criteria.strValue.checkObjName",
            sortable: false,
            render: function (data) {
              if (data.checkPlan) {
                // return _.pluck(data.checkPlan.checkObjectTableBeans, 'checkObjName').join(', ')
                var list = _.pluck(data.checkPlan.checkObjects, 'name');
                list = _.union(list).join("，")
                return list;
              }

            },
            width: 240
          },
          {
            title: this.$t("gb.common.check"),
            filterType: "text",
            filterName: "criteria.strValue.checkTableName",
            sortable: false,
            render: function (data) {
              if (data.checkPlan) {
                // return _.pluck(data.checkPlan.checkObjectTableBeans, 'checkTableName').join(', ');
                var list = _.pluck(data.checkPlan.checkTables, 'name');
                list = list.filter(function (item) {
                  return item && item != '' && item != null && item != undefined
                });
                return list.join("，");
              }
            },
            width: 240
          },
          {
            title: this.$t("gb.common.checkUser"),
            orderName: "checkerId",
            //fieldName: "checkUser.username",
            filterType: "text",
            filterName: "criteria.strValue.checkUserName",
            width: 120,
            render: function (data) {
              if (data.checkUser) {
                return data.checkUser.username;
              } else if (data.checkerNames) {
                return data.checkerNames;
              }
            },
          },
          {
            title: this.$t("gb.common.state") + '(' + this.$t("hag.hazv.qualify") + '/' + this.$t("hag.hazv.unqualify") + ')',
            width: 200,
            fieldName: "checkResultDetail",
            //filterType: "text",
          },
          {
            title: this.$t("bd.ria.result"),
            //orderName: "checkResult",
            sortable: false,
            fieldName: "checkResult",
            filterType: "enum",
            filterName: "criteria.strsValue.checkResult",
            popFilterEnum: LIB.getDataDicList("checkResult"),
            render: function (data) {
              return LIB.getDataDic("checkResult", data.checkResult);
            },
            width: 100
          },
          {
            //开始时间
            title: this.$t("gb.common.startTime"),
            fieldName: "startDate",
            filterType: "date",
            width: 180
          },
          {
            //结束时间
            title: this.$t("gb.common.endTime"),
            fieldName: "endDate",
            filterType: "date",
            width: 180
          },
          {
            // 备注列
            title: this.$t("gb.common.remarks"),
            fieldName: "remarks",
            filterType: "text",
            filterName: "criteria.strValue.remarks",
            sortable: false,
            width: '400px',
            render: function (row, index) {
              if (!row.checkRecords || !row.checkRecords.length) return ''
              return row.checkRecords[0].remarks
            },
            tipRender: function (row) {
              if (!row.checkRecords || !row.checkRecords.length) return false
              return row.checkRecords.map(function (item, index) {
                return item.remarks.replace(/[\r\n]/g, "")
              }).join('\n')
            },
            renderClass: 'table-remarks'
          }
        ],
        defaultFilterValue: {
          "criteria.intsValue.status": [2, 3]
        }
      }),
      //控制全部分类组件显示
      mainModel: {
        //显示分类
        showCategory: false,
        showHeaderTools: false,
        //当前grid所选中的行
        selectedRow: [],
        bizType:'default'
      },
      detailModel: {
        //控制右侧滑出组件显示
        show: false,
      },
      exportModel: {
        url: "/checktaskgroup/exportExcel",
        singleUrl: "/checktaskgroup/{id}/exportPdf"
      },
      id: null,
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
    mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
    template: tpl,
    data: dataModel,
    components: {
      "editcomponent": editComponent
    },
    methods: {
      doCategoryChange: function (obj) {},
      //显示全部分类
      doShowCategory: function () {
        this.mainModel.showCategory = !this.mainModel.showCategory;
      },
      initData: function () {
                if (this.$route.query.bizType) {
                    this.mainModel.bizType = this.$route.query.bizType;
                }

        var params = [];

        //大类型
        params.push({
          value: {
            columnFilterName: "bizType",
            columnFilterValue: this.mainModel.bizType
          },
          type: "save"
        });

        this.$refs.mainTable.doQueryByFilter(params);

      }
    },
    events: {},
    init: function () {
      this.$api = api;
    },
    ready: function () {
      var _this = this;
      this.$nextTick(function () {
        $('.table-fixed-left-body').hide()
        $('.table-fixed-left').hide()
      })
      if (LIB.getBusinessSetByNamePath('common.enableCheckLevel').result === '2') {
        _this.tableModel.columns.push({
          title: "检查级别",
          fieldName: "checkLevel",
          orderName: "checkLevel",
          fieldType: "custom",
          filterType: "enum",
          filterName: "criteria.intsValue.checkLevel",
          popFilterEnum: LIB.getDataDicList("checkLevel"),
          render: function (data) {
            return LIB.getDataDic("checkLevel", data.checkLevel);
          },
          width: 100
        });
      }
    },
    route: {
      activate: function (transition) {
        var queryObj = transition.to.query;
        if (queryObj.method) {
          if (queryObj.checkTaskId && queryObj.method === "check") {
            //TODO 以后改成用vuex做,暂时的解决方案
            if (!!window.isClickCheckTaskExecutBtn) {
              this.$broadcast('ev_dtReload', "check", queryObj.checkTaskId);
              window.isClickCheckTaskExecutBtn = false;
              this.detailModel.show = true;
            }

          } else if (queryObj.id && queryObj.method === "detail") {
            this.detailModel.show = true;
            this.$broadcast('ev_detailReload', null, queryObj.id);
          }
        }
        transition.next();
      }
    },
  });


  return vm;
});