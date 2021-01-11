define(function (require) {
  //基础js
  var LIB = require('lib')
  var api = require('./vuex/api')
  var tpl = LIB.renderHTML(require('text!./main.html'))
  var detailPanel = require('./detail')

  var initDataModel = function () {
    return {
      moduleCode: 'techKeyWord',
      //控制全部分类组件显示
      showHeaderTools: false,
      mainModel: {
        showHeaderTools: false,
        //当前grid所选中的行
        selectedRow: [],
        showDeleteResult:false,
        successMsg:null,
				faildMsg:null,
        detailPanelClass: 'middle-info-aside'
        //				detailPanelClass : "large-info-aside"
      },
      // isShowIdentificationButton:false,
      tableModel: LIB.Opts.extendMainTableOpt({
        url: 'techkeyword/list{/curPage}{/pageSize}',
        selectedDatas: [],
        columns: [
          LIB.tableMgr.column.cb,
          LIB.tableMgr.column.code,

          {
            title: '关键字',
            fieldName: 'keyword',
            filterType: 'text',
            width: 650
          },

          LIB.tableMgr.column.disable,

          {
            title: '创建时间',
            fieldName: 'createDate',
            filterType: 'date',
            width: 300
          },
          {
            title: '修改时间',
            fieldName: 'modifyDate',
            filterType: 'date',
            width: 300
          }
        ]
        // defaultFilterValue: {
        //   'criteria.strValue': { myUserIdForState: '1' }
        //   // "state" : 1
        // }
        // defaultFilterValue: {"criteria.strValue": { authorId: LIB.user.id},'criteria.intValue':{state:0}}
      }),
      detailModel: {
        show: false
      },
      uploadModel: {
        url: '/techkeyword/importExcel'
      },
      exportModel: {
        url: '/techkeyword/exportExcel',
        withColumnCfgParam: true
      },
      // templete : {
      //     url: "/techarticle/file/down"
      // },
      importProgress: {
        show: false
      },
      isCheckKind: false
    }
  }

  var vm = LIB.VueEx.extend({
    mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
    template: tpl,
    data: initDataModel,

    components: {
      detailPanel: detailPanel
      // "importprogress":importProgress
    },

    methods: {
      // 多选
      checkSelect: function (val) {
        this.tableModel.isSingleCheck = !this.isCheckKind
        if (!this.isCheckKind) {
          this.tableModel.selectedDatas = []
          this.$refs.mainTable.isSingleCheck = this.tableModel.isSingleCheck
          this.$refs.mainTable.checkAll = false
          this.$refs.mainTable.setAllCheckBoxValues(false)
          this.$refs.mainTable.doClearData();
          this.$refs.mainTable.doQuery();
          return
        }
        this.$refs.mainTable.isSingleCheck = this.tableModel.isSingleCheck
      },

      doConfirm: function () {
        this.publishSuccessModel.visible = false
      },
      doDelete: function () {
        var _this = this;
        var selectedDatas = this.tableModel.selectedDatas;
        var arr = [];
        _.each(_this.tableModel.selectedDatas, function (item) {
          arr.push({id:item.id});
        });
				if(selectedDatas.length  == 1){
          LIB.Modal.confirm({
            title: '删除选中数据?',
            onOk: function () {
              _this.$api.deleteTechkeyword(null,arr).then(function (data) {
                if (data.body == '1') {
                  _this.mainModel.showHeaderTools = false
                  _this.emitMainTableEvent('do_update_row_data', {
                    opType: 'remove',
                    value: _this.tableModel.selectedDatas
                  })
                  LIB.Msg.success('删除成功')
                 
                  return
                } else {
                  LIB.Msg.warning('记录被引用无法删除')
                }
              })
            }
          })
				}else{
					LIB.Modal.confirm({
						title: '确定删除数据?',
						onOk: function() {
							api.deleteTechkeyword(null, arr).then(function(res) {
								_this.$refs.mainTable.doClearData();
								_this.$refs.mainTable.doQuery();
								if ((selectedDatas.length - res.data) > 0) {
									_this.mainModel.showDeleteResult = true;
									_this.mainModel.successMsg = '成功删除' + res.data + '条';
									_this.mainModel.faildMsg = '删除失败' + (selectedDatas.length - res.data) + '条';
								} else {
									LIB.Msg.info("已删除" + res.data + "条数据！");
								}

							});
						}
					});

				}
      },
      // 查看全部
      doTableCellClick: function (data) {
        if (!!this.showDetail && data.cell.fieldName == 'code') {
          this.showDetail(data.entry.data)
        } else {
          !!this.detailModel && (this.detailModel.show = false)
        }
      }
    },
    events: {},
    init: function () {
      this.$api = api
    },
    ready: function () {
      var column = _.find(this.tableModel.columns, function (c) {

        return c.fieldName === 'disable'
      })
      this.$refs.mainTable.doOkActionInFilterPoptip(null, column, ['0'])
    }
  })

  return vm
})
