define(function (require) {
  var LIB = require('lib')
  //数据模型
  var api = require('../vuex/api')
  var mainOpt = require('./main-opt')
  //右侧滑出详细页
  var detailComponent = require('../detail')
  //回转风险库弹框页面
  var riskComponent = require('./dialog/risk-modal')

  //编辑弹框页面
  var editComponent = require('../dialog/edit')

  var exportTemplate = require('componentsEx/exportTemplate/index')
  var printModal = require('./dialog/preivew')
  //导入
  var importProgress = require('componentsEx/importProgress/main')

  var riskIdentifiContMeasuresSelectModal = require('componentsEx/selectTableModal/riskIdentifiContMeasuresSelectModal')
  var riskIdentificationFormModal = require('componentsEx/formModal/riskIdentificationFormModal')

  var companyBusinessSetState = LIB.getCompanyBusinessSetState()

  LIB.registerDataDic('ira_risk_identification_control_unit', [
    ['1', '基层单位'],
    ['2', '二级单位'],
    ['3', '公司机关']
  ])

  LIB.registerDataDic('ira_risk_identification_existence_state', [
    ['1', '正常'],
    ['2', '异常'],
    ['3', '紧急']
  ])

  LIB.registerDataDic('ira_risk_identification_existence_tense', [
    ['1', '过去'],
    ['2', '现在'],
    ['3', '将来']
  ])

  var filterStatusArray = [
    {
      id: 10,
      name: '超期未提交'
    },
    {
      id: 11,
      name: '超期未审批'
    },
    {
      id: 12,
      name: '超期未整改'
    },
    {
      id: 13,
      name: '超期未验证'
    }
  ]
  //Vue数据模型
  var dataModel = function () {
    var _this = this
    var columsCfg = LIB.setting.fieldSetting['BC_HaG_HazT']
      ? LIB.setting.fieldSetting['BC_HaG_HazT']
      : []
    var renderTableModel = _.bind(
      LIB.tableRenderMgr.renderModel,
      _this,
      columsCfg
    )
    return {
      moduleCode: LIB.ModuleCode.BC_HaG_HazT,
      tableModel: LIB.Opts.extendMainTableOpt(
        renderTableModel({
          url: 'pool/list{/curPage}{/pageSize}',
          selectedDatas: [],
          isSingleCheck: false,
          columns: [
            {
              title: '',
              fieldName: 'id',
              fieldType: 'cb'
            },
            {
              //title: "编号",
              title: this.$t('gb.common.code'),
              fieldName: 'title',
              width: 180,
              fieldType: 'link',
              filterName: 'title',
              filterType: 'text'
            },
            //    {
            //    //title: "受检对象",
            //    title: this.$t("gb.common.subjectObj"),
            //    orderName:"checkObject.name",
            //    fieldName : "checkObject.name",
            //    filterType: "text",
            //    filterName : "criteria.strValue.name",
            //},
            LIB.tableMgr.column.company,
            LIB.tableMgr.column.dept,
            {
              title: '属地',
              fieldName: 'dominationArea.name',
              orderName: 'dominationAreaId',
              filterType: 'text'
            },
            {
              title: '检查对象',
              fieldName: 'checkObj.name',
              orderName: 'ifnull(e.check_object_id,e.equipment_id)',
              filterType: 'text'
            },
            {
              title: this.$t('gb.common.checkUser'),
              orderName: 'attr1',
              fieldName: 'user.name',
              filterType: 'text',
              filterName: 'criteria.strValue.checkUserName',
              width: 100
            },
            {
              title: this.$t('gb.common.problemFinder'),
              fieldName: 'problemFinder',
              filterType: 'text',
              filterName: 'criteria.strValue.problemFinder'
            },
            // {
            //     //title: "信息来源",
            //     title: this.$t("gb.common.infoSource"),
            //     orderName: "infoSource",
            //     fieldType: "custom",
            //     filterType: "enum",
            //     filterName: "criteria.intsValue.infoSource",
            //     popFilterEnum: LIB.getDataDicList("info_source"),
            //     render: function (data) {
            //         return LIB.getDataDic("info_source", data.infoSource);
            //     }
            // }, {
            //     //title: "体系要素",
            //     title: this.$t("gb.common.systemElement"),
            //     orderName: "systemElement",
            //     fieldType: "custom",
            //     filterType: "enum",
            //     filterName: "criteria.intsValue.systemElement",
            //     popFilterEnum: LIB.getDataDicList("system_element"),
            //     render: function (data) {
            //         return LIB.getDataDic("system_element", data.systemElement);
            //     }
            // },{
            //     //title: "专业",
            //     title: this.$t("gb.common.profession"),
            //     orderName: "profession",
            //     fieldType: "custom",
            //     filterType: "enum",
            //     filterName: "criteria.intsValue.profession",
            //     popFilterEnum: LIB.getDataDicList("profession"),
            //     render: function (data) {
            //         return LIB.getDataDic("profession", data.profession);
            //     }
            // },
            {
              //title: "问题描述",
              title: this.$t('gb.common.problemDesc'),
              fieldName: 'problem',
              filterName: 'criteria.strValue.problem',
              filterType: 'text',
              renderClass: 'textarea',
              width: 320
            },
            {
              title: this.$t('gb.common.latentDefect'),
              fieldName: 'latentDefect',
              filterType: 'text',
              width: 180
            },
            {
              //title: "建议措施",
              title: this.$t('gb.common.recMeasure'),
              fieldName: 'danger',
              filterName: 'criteria.strValue.danger',
              filterType: 'text',
              renderClass: 'textarea',
              width: 320
            },
            {
              //title: "登记日期",
              title: this.$t('bc.hal.registratDate'),
              fieldName: 'registerDate',
              filterType: 'date',
              width: 180
            },
            {
              //title: "隐患等级",
              title: this.$t('hag.hazc.hiddenGrade'),
              orderName: 'type',
              fieldType: 'custom',
              filterType: 'enum',
              filterName: 'criteria.strsValue.riskType',
              popFilterEnum: LIB.getDataDicList('risk_type'),
              render: function (data) {
                return LIB.getDataDic('risk_type', data.riskType)
              },
              width: 120
            },
            {
              //title: "风险等级",
              title: this.$t('gb.common.riskGrade'),
              orderName: 'riskLevel',
              fieldType: 'custom',
              filterType: 'text',
              showTip: false,
              filterName: 'criteria.strValue.riskLevel',
              render: function (data) {
                if (data.riskLevel) {
                  var riskLevel = JSON.parse(data.riskLevel)
                  var resultColor = _.propertyOf(JSON.parse(data.riskModel))(
                    'resultColor'
                  )
                  if (riskLevel && riskLevel.result) {
                    //return riskLevel.result;
                    if (resultColor) {
                      return (
                        "<span style='background:#" +
                        resultColor +
                        ';color:#' +
                        resultColor +
                        ";margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" +
                        riskLevel.result
                      )
                    } else {
                      return (
                        "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" +
                        riskLevel.result
                      )
                    }
                  } else {
                    return (
                      "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" +
                      '无'
                    )
                    //return "无";
                  }
                } else if (data.riskLevelResult) {
                  var resultColor = LIB.getDataDic(
                    'risk_level_result_color',
                    data.riskLevelResult
                  )
                  return (
                    "<span style='background:" +
                    resultColor +
                    ';color:' +
                    resultColor +
                    ";margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" +
                    LIB.getDataDic('risk_level_result', data.riskLevelResult)
                  )
                } else {
                  return (
                    "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" +
                    '无'
                  )
                  //return "无";
                }
              },
              width: 120
            },
            {
              title: this.$t('gb.common.state'),
              orderName: 'status',
              fieldType: 'custom',
              filterType: 'enum',
              filterName: 'criteria.intsValue.status',
              popFilterEnum: LIB.getDataDicList('pool_status'),
              render: function (data) {
                return LIB.getDataDic('pool_status', data.status)
              },
              width: 120
            },
            {
              title: '整改状态',
              sortable: false,
              width: 120,
              filterType: 'enum',
              filterName: 'criteria.intsValue.reformStatus',
              popFilterEnum: LIB.getDataDicList('pool_reform_status'),
              render: function (data) {
                var maxDealDate
                var dealDate
                if (data && data.lastReform) {
                  if (data.lastReform.maxDealDate) {
                    maxDealDate = new Date(data.lastReform.maxDealDate)
                  }
                  if (data.lastReform.dealDate) {
                    dealDate = new Date(data.lastReform.dealDate)
                  }
                } else {
                  return (
                    "<span style='background:#F5F5F5;color:#F5F5F5;margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" +
                    '其他'
                  )
                }
                var status = data.status
                var now = new Date()
                if (status === '2' && maxDealDate) {
                  //待整改
                  if (now > maxDealDate) {
                    return (
                      "<span style='background:red;color:red;margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" +
                      '逾期未整改'
                    )
                  } else {
                    return (
                      "<span style='background:#F5F5F5;color:#F5F5F5;margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" +
                      '其他'
                    )
                  }
                } else if (
                  (status === '3' || status === '100') &&
                  maxDealDate
                ) {
                  //待验证 //验证合格
                  if (dealDate > maxDealDate) {
                    return (
                      "<span style='background:yellow;color:yellow;margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" +
                      '逾期整改'
                    )
                  } else {
                    return (
                      "<span style='background:#0F0;color:#0F0;margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" +
                      '期限内整改'
                    )
                  }
                } else {
                  return (
                    "<span style='background:#F5F5F5;color:#F5F5F5;margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" +
                    '其他'
                  )
                }
              }
            },
            {
              title: '来源',
              orderName: 'sourceType',
              fieldType: 'custom',
              filterType: 'enum',
              filterName: 'criteria.intsValue.sourceType',
              popFilterEnum: LIB.getDataDicList('pool_sourceType').filter(
                function (item) {
                  return item.id != 6 //过滤掉 id:6 "风险研判"
                }
              ),
              render: function (data) {
                return LIB.getDataDic('pool_sourceType', data.sourceType)
              },
              width: 100
            },
            {
              title: '整改类型',
              orderName: 'reformType',
              fieldType: 'custom',
              filterType: 'enum',
              filterName: 'criteria.strsValue.reformType',
              popFilterEnum: LIB.getDataDicList('pool_reformType'),
              render: function (data) {
                return LIB.getDataDic('pool_reformType', data.reformType)
              },
              width: 100
            },
            {
              title: this.$t('gb.common.businessSource'),
              orderName: 'bizType',
              fieldType: 'custom',
              filterType: 'enum',
              filterName: 'criteria.intsValue.bizType',
              popFilterEnum: LIB.getDataDicList('pool_biz_source_type'),
              render: function (data) {
                return LIB.getDataDic('pool_biz_source_type', data.bizType)
              },
              width: 100
            },
            {
              //title: "类型",
              title: this.$t('gb.common.type'),
              orderName: 'type',
              fieldType: 'custom',
              filterType: 'enum',
              filterName: 'criteria.intsValue.type',
              popFilterEnum: LIB.getDataDicList('pool_type'),
              render: function (data) {
                return LIB.getDataDic('pool_type', data.type)
              },
              width: 80
            },
            {
              title: '审批人',
              fieldName: 'auditorName',
              filterName: 'criteria.strValue.auditorName',
              filterType: 'text',
              renderClass: 'textarea',
              width: 100
            }
          ],
          defaultFilterValue: {
            'criteria.orderValue': {
              fieldName: 'registerDate',
              orderType: '1'
            },
            orgId: LIB.user.orgId == '9999999999' ? '' : LIB.user.orgId
          }
        })
      ),
      //控制全部分类组件显示
      mainModel: {
        //显示分类
        showCategory: false,
        showHeaderTools: false,
        //当前grid所选中的行
        selectedRow: [],
        showTempSetting: true,
        bizType: null
      },
      riskModel: {
        //控制编辑组件显示
        title: '回转风险库',
        //显示编辑弹框
        show: false,
        //编辑模式操作类型
        type: 'create',
        id: null
      },
      exportModel1: {
        //显示编辑弹框
        show: false,
        value: 1
      },
      detailModel: {
        //控制右侧滑出组件显示
        show: false
      },
      poolId: null,
      exportModel: {
        url: '/pool/exportExcel'
        // url1: "/file/down"
      },
      filterTabId: 'todo',
      uploadModel: {
        url: '/pool/importExcel?type=1'
      },
      templete: {
        url: '/pool/file/down?type=1'
      },

      templateModel: {
        visible: false
      },
      filterModel: {
        checkedExpiredStatus: '',
        filterStatusArray: filterStatusArray
      },
      cloumsInit: null,
      // hasOtherRoute:false,//是否有多个路由
      selectModel: {
        measuresSelectModal: {
          visible: false,
          filterData: { bizType: 3 }
        }
      },
      formModel: {
        riskIdentificationFormModel: {
          show: false
        }
      },
      importProgress: {
        show: false,
        maxFileSize: '500mb'
      },
      editModel: {
        //控制编辑组件显示
        title: '新增',
        //显示编辑弹框
        show: false,
        //编辑模式操作类型
        type: 'create',
        id: null
      },
      showRiskIdentiButton: false,
      isXBGDMenu: false,
      downNumber: null
    }
  }

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
  var tpl = LIB.renderHTML(require('text!./main.html'))
  var vm = LIB.VueEx.extend({
    mixins: [LIB.VueMixin.auth, LIB.VueMixin.mainPanel, mainOpt],
    template: tpl,
    components: {
      'detail-component': detailComponent,
      'risk-component': riskComponent,
      'export-template': exportTemplate,
      'print-modal': printModal,
      measuresSelectModal: riskIdentifiContMeasuresSelectModal,
      riskidentificationFormModal: riskIdentificationFormModal,
      'print-modal': printModal,
      'edit-component': editComponent
    },
    data: dataModel,
    computed: {
      createOrUpdatePool: function () {
        var path = _.last(this.$route.path.split('?')[0].split('/'))
        if (path === 'outTotal' || path === 'specialTotal') {
          return true
        }
        return false
      },
      excludeImportAuth: function () {
        var exclude = ['routeCheckTotal', 'daliyJobTotal', 'riskAnalyzeTotal']
        var path = _.last(this.$route.path.split('?')[0].split('/'))
        if (_.contains(exclude, path)) {
          return true
        }
        return false
      }
    },
    methods: {
      doSaveExport: function (val) {
        LIB.globalLoader.show()
        function httpRequest(paramObj, fun, errFun) {
          var xmlhttp = null;
          /*创建XMLHttpRequest对象，
           *老版本的 Internet Explorer（IE5 和 IE6）使用 ActiveX 对象：new ActiveXObject("Microsoft.XMLHTTP")
           * */
          if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
          } else if (window.ActiveXObject) {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
          }
          /*判断是否支持请求*/
          if (xmlhttp == null) {
            alert('你的浏览器不支持XMLHttp');
            return;
          }
          /*请求方式，并且转换为大写*/
          var httpType = (paramObj.type || 'GET').toUpperCase();
          /*数据类型*/
          var dataType = paramObj.dataType || 'json';
          /*请求接口*/
          var httpUrl = paramObj.httpUrl || '';
          /*是否异步请求*/
          var async = paramObj.async || true;
          /*请求参数--post请求参数格式为：foo=bar&lorem=ipsum*/
          var paramData = paramObj.data || [];
          var requestData = '';
          for (var name in paramData) {
            requestData += name + '=' + paramData[name] + '&';
          }
          requestData = requestData == '' ? '' : requestData.substring(0, requestData.length - 1);

          /*请求接收*/
          xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
              /*成功回调函数*/
              fun(xmlhttp.responseText);
            } else {
              /*失败回调函数*/
              errFun;
            }
          }

          /*接口连接，先判断连接类型是post还是get*/
          if (httpType == 'GET') {
            xmlhttp.open("GET", httpUrl, async);
            xmlhttp.send(null);
          } else if (httpType == 'POST') {
            xmlhttp.open("POST", httpUrl, async);
            //发送合适的请求头信息
            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xmlhttp.send(requestData);
          }
        }

        var _this = this
        var url = '/pool/synExportExcel/' + val + _this._getExportURL()
        url = url.replace('/pool/exportExcel', "")
        /*请求参数*/
        var paramObj = {
          httpUrl: url,
          type: 'GET'
        }
        /*请求调用*/
        httpRequest(
          paramObj,
          function () {
            api.getNumber().then(function (res) {
              _this.downNumber = res.data
              _this.$dispatch('ev_download', res.data)
              // _this.$emit('downNumber', _this.downNumber)
              LIB.globalLoader.hide()
              $('#down-load').css({ display: 'block' })
            })
          }
        )


        // api.exportExcel().then(function () {
        //   api.getNumber({ status: '1' }).then(function (res) {
        //     _this.downNumber = res.data
        //     _this.$emit('downNumber', _this.downNumber)
        //     $('#down-load').css({ display: 'block' })
        //   })
        // })
        this.exportModel1.show = false
      },
      doCancelExport: function () {
        this.exportModel1.show = false
      },
      doExportExcel: function () {
        var _this = this
        _this.exportModel1.show = true

        // LIB.Modal.confirm({
        //     title: '导出数据?',
        //     onOk: function () {
        //         $('#down-load').css({display:'block'})
        //         window.open(_this.exportModel.url);
        //     }
        // });
      },
      doCondtionGroupItemRemoveAction: function (data) {
        this.$refs.mainTable.$emit('do_query_by_filter', {
          type: 'remove',
          value: data.item
        })
        if (this.$route.query.method === 'filterByCheckRecord') {
          this.$refs.mainTable.$emit('do_query_by_filter', {
            type: 'remove',
            value: { columnFilterName: 'criteria.strValue.checkRecordDetailId' }
          })
        }

        //清空全局搜索的数据
        if (
          this.validGlobalSearchData() &&
          this.searchData.value.filterName == data.item.columnFilterName
        ) {
          this.updateGlobalSearchData({ code: this.searchData.code })
        }
      },
      //新增方法
      doAdd: function () {
        this.editModel.show = true
        this.editModel.title = '新增'
        this.editModel.type = 'create'
        this.$broadcast('ev_editReload_pool', null)
      },
      //修改方法
      doUpdate: function (row) {
        if (!row || !_.isString(row.id)) {
          var rows = this.tableModel.selectedDatas
          if (rows.length > 1) {
            LIB.Msg.warning('无法批量修改数据')
            return
          }
          row = rows[0]
        }
        if (row.status != '0') {
          LIB.Msg.warning('只能修改待提交数据')
          return
        }
        this.editModel.show = true
        this.editModel.title = '修改'
        this.editModel.type = 'update'
        this.editModel.id = row.id
        this.mainModel.editRow = row
        this.$broadcast('ev_editReload_pool', row.id)
      },
      doImport: function () {
        var url = '/pool/importExcel?type=1'
        if (this.$route.query.bizType) {
          url =
            '/pool/importExcel?type=1&bizType=' +
            this.$route.query.bizType.split(',')[0]
        }
        this.$broadcast('ev_update_url', url)
        this.importProgress.show = true
      },
      //显示详情
      showDetail: function (row) {
        this.detailModel.show = true
        this.$broadcast('ev_detailDataReload', row.id, 1)
        this.$broadcast('ev_detailButton')
      },
      doFilterBySpecial: function (v) {
        this.filterTabId = 'todo' + (v || '')
        this._normalizeFilterParam(v)
      },
      _normalizeFilterParam: function (v) {
        var params = []
        var name = 'criteria.strValue.todo'
        if (v) {
          params.push({
            value: {
              columnFilterName: name,
              columnFilterValue: v
            },
            type: 'save'
          })
          params.push({
            value: {
              columnFilterName: 'orgId',
              columnFilterValue: LIB.user.compId
            },
            type: 'save'
          })
        } else {
          params.push({
            type: 'remove',
            value: {
              columnFilterName: name
            }
          })
        }
        this.$refs.mainTable.doQueryByFilter(params)
      },
      showTemplateSetting: function () {
        this.templateModel.visible = true
      },
      doDelete: function () {
        if (this.beforeDoDelete() == false) {
          return
        }
        var _this = this
        var deleteIds = _.map(_this.tableModel.selectedDatas, function (row) {
          return row.id
        })
        var batchNum = this.tableModel.selectedDatas.length
        api.getTableBatchHandleSetting().then(function (res) {
          var numer = _.get(res.data, 'result')
          if (batchNum > numer) {
            LIB.Msg.warning(
              '您已选中的记录数是' + batchNum + ',限额数是' + numer
            )
          } else {
            LIB.Modal.confirm({
              title: '已选中' + batchNum + '条数据,确定删除数据?',
              onOk: function () {
                api.deleteByIds(null, deleteIds).then(function (res) {
                  _this.emitMainTableEvent('do_update_row_data', {
                    opType: 'remove',
                    value: _this.tableModel.selectedDatas
                  })
                  LIB.Msg.info(res.data + '条记录已经删除成功')
                })
              }
            })
          }
        })
      },
      doCreateExport: function () {
        var _this = this
        if (_this.tableModel.selectedDatas.length > 1) {
          var checkedCompanyIsOne = true
          var _tempCompId = undefined
          for (var i = 0; i < _this.tableModel.selectedDatas.length; i++) {
            var compid = _this.tableModel.selectedDatas[i].compId
            if (_tempCompId && _tempCompId != compid) {
              checkedCompanyIsOne = false
              break
            } else if (!_tempCompId) {
              _tempCompId = compid
            }
          }
          if (!checkedCompanyIsOne) {
            LIB.Msg.warning('所选数据的受检公司必须相同')
            return
          }
        }
        var rowIds = _.map(_this.tableModel.selectedDatas, function (row) {
          return row.id
        })
        LIB.globalLoader.show()
        api.createReport({ ids: rowIds }).then(function (res) {
          LIB.globalLoader.hide()
          _this.$refs.printModal.init(res.data)
        })
      },

      initData: function () {
        this.showRiskIdentiButton = false
        this.isXBGDMenu = false
        var path = _.last(this.$route.path.split('?')[0].split('/'))
        //临时用这个区分西部管道
        if (
          path === 'routeCheckTotal' ||
          path === 'daliyJobTotal' ||
          path === 'riskAnalyzeTotal' ||
          path === 'outTotal' ||
          path === 'specialTotal'
        ) {
          this.templete.url = '/pool/file/down?type=100' //西部管道
          this.isXBGDMenu = true
          if (path === 'outTotal' || path === 'specialTotal') {
            this.showRiskIdentiButton = true
          }
        } else {
          this.templete.url = '/pool/file/down?type=1'
        }
        var bizType = this.$route.query.bizType
        var splice = []
        var column = _.find(this.tableModel.columns, function (item) {
          return item.title === '业务来源'
        })
        column.popFilterEnum = LIB.getDataDicList('pool_biz_source_type')
        if (bizType) {
          splice = bizType.split(',')
          column.popFilterEnum = _.filter(
            LIB.getDataDicList('pool_biz_source_type'),
            function (it) {
              return _.contains(splice, it.id)
            }
          )
        }
        this.$refs.mainTable.refreshColumns()
        var params = []
        //大类型
        params.push({
          value: {
            columnFilterName: 'criteria.strsValue',
            columnFilterValue: { bizType: splice }
          },
          type: 'save'
        })
        this.$refs.mainTable.doQueryByFilter(params)
      },
      initFilterBoxData: function () {
        this.filterModel.checkedExpiredTypeId = ''
        this.filterModel.checkedExpiredStatus = ''
      },
      doChangeExpiredtatusFilter: function (id) {
        this.filterModel.checkedExpiredStatus = id
      },
      _normalizeExpiryStatusFilterData: function () {
        if (!this.filterModel.checkedExpiredStatus) {
          return null
        }
        var param = {
          value: {
            columnFilterName: 'criteria.intValue',
            columnName: 'status',
            columnFilterValue: { status: this.filterModel.checkedExpiredStatus }
          },
          type: 'save'
        }
        var displayMap = {
          displayTitle: '',
          displayValue: '',
          columnFilterName: 'status',
          columnFilterValue: 1
        }

        displayMap.displayValue = _.find(
          filterStatusArray,
          'id',
          this.filterModel.checkedExpiredStatus
        ).name
        return {
          param: param,
          displayMap: displayMap
        }
      },
      doFilterFromBox: function () {
        var params = []
        var status = this._normalizeExpiryStatusFilterData()
        if (!status) {
          return LIB.Msg.warning('请选择过滤条件')
        }
        if (status) {
          params.push(status.param)
          this.doAddDisplayFilterValue(status.displayMap)
        }

        this.$refs.mainTable.doQueryByFilter(params)
        this.doFilterBoxClose()
      },
      doFilterBoxClose: function () {
        this.$refs.filterBox.handleClose()
      },
      doRiskIdenti: function () {
        //查询改隐患是否已关联
        var _this = this
        var rows = this.tableModel.selectedDatas
        if (rows.length > 1) {
          LIB.Msg.warning('无法批量操作数据')
          return
        }
        api.queryIsRiskIdenti({ id: rows[0].id }).then(function (res) {
          if (res.data) {
            // var router = LIB.ctxPath("/html/main.html#!");
            // var routerPart = "/riskAssessment/businessFiles/riskIdentification?bizType=2&keepUrlParam=true&method=doAdd&poolId="+rows[0].id;
            // window.open(router + routerPart);
            _this.doShowRiskIdentificationFormModel()
          } else {
            LIB.Msg.warning('该隐患已关联控制措施')
            return
          }
        })
      },
      doShowRiskIdentificationFormModel: function () {
        this.formModel.riskIdentificationFormModel.show = true
        this.$broadcast('ev_editReload', null)
      },
      doSaveRiskIdentification: function () {
        LIB.Msg.info('保存成功')
        this.formModel.riskIdentificationFormModel.show = false
      },
      doSaveMeasures: function (data) {
        var _this = this
        var rows = this.tableModel.selectedDatas
        var obj = { refId: rows[0].id, riskIdentiContId: data[0].id, type: 2 }
        api.saveIsRiskIdentiMeasures(null, obj).then(function (res) {
          _this.selectModel.measuresSelectModal.visible = false
          LIB.Msg.info('保存成功')
        })
      },
      doSyncMajorDanger: function () {
        var rows = this.tableModel.selectedDatas
        if (rows.length < 1) {
          LIB.Msg.info('请选择需要操作的数据')
          return
        }
        var ids = _.map(rows, 'id')
        api.syncMajorDanger(ids).then(function () {
          LIB.Msg.info('操作成功')
        })
      }
    },
    events: {
      //edit框点击保存后事件处理
      ev_editFinshed: function () {
        this.mainModel.showHeaderTools = false
        this.editModel.show = false
        this.emitMainTableEvent('do_update_row_data', { opType: 'add' })
      },
      //edit框修改点击保存后事件处理
      ev_editUpdate: function (data) {
        this.mainModel.showHeaderTools = false
        this.editModel.show = false
        this.emitMainTableEvent('do_update_row_data', { opType: 'add' })
      },
      //edit框点击取消后事件处理
      ev_editCanceled: function () {
        this.editModel.show = false
      }
    },
    created: function () {
      var _this = this
      var isShowEquName =
        companyBusinessSetState['poolGovern.isShowEquName'] == null
          ? false
          : companyBusinessSetState['poolGovern.isShowEquName'].result === '2'
      if (isShowEquName) {
        var length = _this.tableModel.columns.length
        var columns1 = _this.tableModel.columns.slice(0, 6)
        var columns2 = _this.tableModel.columns.slice(6, length)
        columns1.push({
          title: '设备名称',
          fieldName: 'equName',
          filterType: 'text',
          width: 100
        })
        _this.tableModel.columns = columns1.concat(columns2)
      }

      var enableHSEType =
        companyBusinessSetState['poolGovern.enableHSEType'] == null
          ? false
          : companyBusinessSetState['poolGovern.enableHSEType'].result === '2'
      if (enableHSEType) {
        _this.tableModel.columns.push({
          title: 'HSE类型',
          fieldName: 'hseType',
          orderName: 'hseType',
          fieldType: 'custom',
          filterType: 'enum',
          filterName: 'criteria.intsValue.hseType',
          popFilterEnum: LIB.getDataDicList('random_observe_hse_type'),
          render: function (data) {
            return LIB.getDataDic('random_observe_hse_type', data.hseType)
          },
          width: 100
        })
      }
    },
    ready: function () {
      if (!LIB.user.compId) {
        this.mainModel.showTempSetting = false
      }
      //首页跳转时根据首页对应搜索条件查询
      if (this.$route.query.method === 'filterByUser') {
        this.doFilterBySpecial('1')
        this.$refs.categorySelector.setDisplayTitle({
          type: 'org',
          value: LIB.user.compId
        }) //此处不能默认显示本部门，否则显示的数据与首页工作任务数据条数不对应
      } else {
        this.$refs.categorySelector.setDisplayTitle({
          type: 'org',
          value: LIB.user.orgId
        })
      }
      if (this.$route.query.method === 'filterByCheckRecord') {
        var data = {
          columnFilterName: 'criteria.strValue.sourceId',
          displayTitle: '检查项',
          displayValue: this.$route.query.name
        }
        this.$refs.condtionGroup.values = [data]
        this.filterConditions = this.$refs.condtionGroup.values
        var params = []
        //大类型
        this.$refs.categorySelector.setDisplayTitle({
          type: 'org',
          value: this.$route.query.compId
        })
        params.push({
          value: {
            columnFilterName: 'criteria.strValue.checkRecordDetailId',
            columnFilterValue: this.$route.query.id
          },
          type: 'save'
        })
        params.push({
          value: {
            columnFilterName: 'orgId',
            columnFilterValue: this.$route.query.compId
          },
          type: 'save'
        })
        this.$refs.mainTable.doQueryByFilter(params)
      }
      var _this = this

      var enableCheckLevel =
        companyBusinessSetState['common.enableCheckLevel'] == null
          ? false
          : companyBusinessSetState['common.enableCheckLevel'].result === '2'
      if (enableCheckLevel) {
        _this.tableModel.columns.push({
          title: '检查级别',
          fieldName: 'checkLevel',
          orderName: 'checkLevel',
          fieldType: 'custom',
          filterType: 'enum',
          filterName: 'criteria.intsValue.checkLevel',
          popFilterEnum: LIB.getDataDicList('checkLevel'),
          render: function (data) {
            return LIB.getDataDic('checkLevel', data.checkLevel)
          },
          width: 100
        })
      }

      var isShowXBGDField =
        companyBusinessSetState['poolGovern.isShowXBGDField'] == null
          ? false
          : companyBusinessSetState['poolGovern.isShowXBGDField'].result === '2'
      if (isShowXBGDField) {
        var dataDicList1 = LIB.getDataDicList('pool_high_risk')
        var dataDicList2 = LIB.getDataDicList('pool_medium_risk')
        var dataDicList3 = LIB.getDataDicList('pool_low_risk')
        var arr = []
        _.each(dataDicList1, function (item) {
          arr.push([item.id, item.value])
        })
        _.each(dataDicList2, function (item) {
          arr.push([item.id, item.value])
        })
        _.each(dataDicList3, function (item) {
          arr.push([item.id, item.value])
        })
        LIB.registerDataDic('pool_judgement_type', arr)

        _this.tableModel.columns.push(
          {
            title: '检查依据',
            fieldName: 'checkBasis',
            filterType: 'text',
            width: 100
          },
          {
            title: '一级分类',
            fieldName: 'firstLevel',
            orderName: 'firstLevel',
            fieldType: 'custom',
            filterType: 'enum',
            filterName: 'criteria.intsValue.firstLevel',
            popFilterEnum: LIB.getDataDicList('pool_first_level'),
            render: function (data) {
              return LIB.getDataDic('pool_first_level', data.firstLevel)
            },
            width: 100
          },
          {
            title: '二级分类',
            fieldName: 'secondLevel',
            orderName: 'secondLevel',
            fieldType: 'custom',
            filterType: 'enum',
            filterName: 'criteria.intsValue.secondLevel',
            popFilterEnum: LIB.getDataDicList('pool_second_level'),
            render: function (data) {
              return LIB.getDataDic('pool_second_level', data.secondLevel)
            },
            width: 100
          },
          {
            title: '低老坏分类',
            fieldName: 'lowOldBadLevel',
            orderName: 'lowOldBadLevel',
            fieldType: 'custom',
            filterType: 'enum',
            filterName: 'criteria.intsValue.lowOldBadLevel',
            popFilterEnum: LIB.getDataDicList('pool_low_old_bad_level'),
            render: function (data) {
              return LIB.getDataDic(
                'pool_low_old_bad_level',
                data.lowOldBadLevel
              )
            },
            width: 100
          },
          {
            title: '责任人',
            fieldName: 'principalName',
            filterType: 'text',
            width: 100
          },
          {
            title: '责任部门/单位',
            filterName: 'criteria.strValue.principalOrgName',
            orderName: 'principalOrgId',
            filterType: 'text',
            fieldType: 'custom',
            render: function (data) {
              if (data.principalOrgId) {
                return LIB.getDataDic('org', data.principalOrgId)['deptName']
              }
            },
            width: 140
          },
          {
            title: '风险判定类型',
            fieldName: 'riskJudgementType',
            orderName: 'riskJudgementType',
            fieldType: 'custom',
            filterType: 'enum',
            filterName: 'criteria.intsValue.riskJudgementType',
            popFilterEnum: LIB.getDataDicList('pool_judgement_type'),
            render: function (data) {
              return LIB.getDataDic(
                'pool_judgement_type',
                data.riskJudgementType
              )
            },
            width: 140
          }
        )
      }
    },
    init: function () {
      this.$api = api
    }
  })

  return vm
})
