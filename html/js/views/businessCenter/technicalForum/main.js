define(function (require) {
  //基础js
  var LIB = require('lib')
  var api = require('./vuex/api')
  var tpl = LIB.renderHTML(require('text!./main.html'))
  //编辑弹框页面fip (few-info-panel)
  var detailPanel = require('./detail')
  //编辑弹框页面bip (big-info-panel)
  	// var detailPanel = require("./detail-xl");
  //导入
  // var allClassificationSuper = require("componentsEx/allClassificationSuper");

  var initDataModel = function () {
    return {
      moduleCode: 'techArticle',
      //控制全部分类组件显示
      successMsg: null,
      faildMsg: null,
      showHeaderTools: false,
       // 回复
    relpyModal: {
      show: false
    },
      mainModel: {
        showHeaderTools: false,
        //当前grid所选中的行
        selectedRow: [],
        detailPanelClass: 'middle-info-aside'
        //				detailPanelClass : "large-info-aside"
      },
      // isShowIdentificationButton:false,
      tableModel: LIB.Opts.extendMainTableOpt({
        reply:null,
        url: 'techarticle/list{/curPage}{/pageSize}',
        selectedDatas: [],
        columns: [
          LIB.tableMgr.column.cb,
          LIB.tableMgr.column.code,
          // {
          //   title: '编码',
          //   fieldName: "code",
          //   fieldType: "link",
          //   fieldType: "custom",
          //   render: function (data) {
          //    return  data.createDate
              
          //   },
          // },
          {
            title: '标题名称',
            fieldName: 'title',
            filterType: 'text',
            width: 300
          },
          {
            //发布人
            title: '发布人',
            fieldName: 'user.name',
            filterType: 'text',
            width: 100
          },

          {
            //状态 0:未发布,1:已发布
            title: '状态',
            fieldName: 'state',
            fieldType: 'custom',
            popFilterEnum: LIB.getDataDicList('iem_exercise_scheme_status'),
            render: function (data) {
              return LIB.getDataDic('iem_exercise_scheme_status', data.state)
            },
            width: 100
          },
          LIB.tableMgr.column.company,
          LIB.tableMgr.column.dept,
          // {
          //   title: '所属公司',
          //   fieldName: 'company',
          //   filterType: 'text',
          //   render: function (data) {
          //     return data.company
          //   },
          //   width: 200
          // },
          // {
          //   title: '所属部门',
          //   fieldName: 'dept',
          //   filterType: 'text',
          //   render: function (data) {
          //     return data.dept
          //   },
          //   width: 200
          // },
          {
            title: '发布时间',
            fieldName: 'publishDate',
            filterType: 'date'
          },
          {
            title: '最后回复时间',
            fieldName: 'lastReplyDate',
            filterType: 'date'
          },

          {
            title: '查看',
            fieldName: 'viewTime',
            filterType: 'number',
            width: 90
          },
          {
            title: '回复',
            fieldName: 'replyTime',
            filterType: 'number',
            width: 90
          }
        ],
        defaultFilterValue: {
          'criteria.strValue': { myUserIdForState: '1' },
          "criteria.orderValue": {fieldName: "publishDate", orderType: "1"},
          // "orgId" : LIB.user.orgId
          // "state" : 1
        }
        // defaultFilterValue: {"criteria.strValue": { authorId: LIB.user.id},'criteria.intValue':{state:0}}
      }),
      detailModel: {
        show: false
      },
      uploadModel: {
        url: '/techarticle/importExcel'
      },
      exportModel: {
        url: '/techarticle/exportExcel'
      },
      // templete : {
      //     url: "/techarticle/file/down"
      // },
      importProgress: {
        show: false
      },
      isCheckKind: false,
      publishSuccessModel: {
        id: null,
        visible: false,
        title: '发布成功'
      }
    }
  }

  var vm = LIB.VueEx.extend({
    mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
    template: tpl,
    data: initDataModel,

    components: {
      detailPanel: detailPanel,
      // 'allClassificationSuper':allClassificationSuper
    },
    computed: {
      isSuper: function () {
        // var rows = this.tableModel.selectedDatas
        // var createBy = _.get(rows, '[0].createBy')
        // return LIB.user.id === 'createBy'
        //只有超管才有权限删除所有
        return LIB.user.id === '9999999999'
      },
      isState: function () {
        var rows = this.tableModel.selectedDatas
        var iState = _.get(rows, '[0].state')
        if (iState == 0) {
          return true
        } else {
          return false
        }
      }
    },
    watch: {
      'relpyModal.show': function (val) {
        if (val) {
          setTimeout(this.doLoadKindEditor, 0)
        }
      }
    },
    methods: {
      afterInit: function () {
       
        setTimeout(this.doLoadKindEditor, 0)
    },
    afterInitData: function (param) {
        setTimeout(this.doLoadKindEditor, 0)
    },
    // 顶部回复
    doReply:function() {
      this.relpyModal.show=true

    },
    // 关闭
    doClosePage:function() {
      this.relpyModal.show=false
    },
    // 回复
    doSaveData: function () {
      var _this = this
      var reply1 = $('#reply')
        .val()
        .replace(/&nbsp;/g, '')
        .trim()
      if (reply1.length == 0) {
        LIB.Msg.info('回复内容不能为空')
        return
      }
      _this.tableModel.reply = reply1.replace(/<br\s*\/?>/gi, '\r\n')
      api
        .saveArticleReply(
          { id: _this.tableModel.selectedDatas[0].id },
          { content: _this.tableModel.reply }
        )
        .then(function () {
          KindEditor.html($('#reply'), ' ')
          _this.tableModel.replyTime =
            Number(_this.tableModel.replyTime) + 1
          _this.$dispatch('ev_dtUpdate')
          LIB.Msg.info('回复成功')
          reply1=''
        })
        _this.tableModel.reply=''
      this.relpyModal.show = false
    },
      // 多选
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
      doConfirm: function () {
        this.publishSuccessModel.visible = false
      },
      doDelete: function () {
        // var loadingModel = new LIB.Msg.circleLoading();
        var _this = this;
        var rows = _this.tableModel.selectedDatas;
        // var deleteIds = _.map(this.tableModel.selectedDatas, function (row) {
        //   return {"id":row.id}
        // });
       
        // var techKeyWords = _.map(this.tableModel.selectedDatas, function (row) {
        //   return {"techKeyWords":row.techKeyWords}
        // });
        var deleteIds = _.map(this.tableModel.selectedDatas, function (row) {
          return {"id":row.id,"techKeyWords":row.techKeyWords}
        });
       
        if (rows.length > 1) {
          LIB.Modal.confirm({
            title: '删除选中数据?',
            onOk: function () {
              _this.$api.deleteTecharticle(null, deleteIds).then(function () {
               
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
                "id":rows[0].id,
                "techKeyWords":rows[0].techKeyWords

              }
              ).then(function (data) {
               
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
      // 查看全部
      doTableCellClick: function (data) {
        if (!!this.showDetail && data.cell.fieldName == 'code') {
          this.showDetail(data.entry.data)
        } else {
          !!this.detailModel && (this.detailModel.show = false)
        }
      },
      doLoadKindEditor: function () {
        /**
         * 内容编辑器
         * @param id 文本域ID
         * @param width 编辑器的宽
         * @param height 编辑器的高
         * @param keImageUploadUrl 上传图片服务的URL
         */
        KindEditor.create("textarea[name='kindEditor']", {
          height: '500px',
          resizeType: 1,
          filterMode: false, //true时过滤HTML代码，false时允许输入任何代码。
          allowPreviewEmoticons: false,
          allowImageUpload: false,
          syncType: 'form',
          // uploadJson = K.undef(self.uploadJson, self.basePath + '/file/upload'),
          // fileManagerJson = K.undef(self.fileManagerJson, self.basePath + 'php/file_manager_json.php'),
          urlType: 'domain', //absolute
          newlineTag: 'p', //回车换行br|p
          allowFileManager: false,
          allowMediaUpload: false,
          formatUploadUrl: false,
          items: [
            'source',
            '|',
            'fontname',
            'fontsize',
            '|',
            'forecolor',
            'hilitecolor',
            'bold',
            'italic',
            'underline',
            'removeformat',
            '|',
            'justifyleft',
            'justifycenter',
            'justifyright',
            'insertorderedlist',
            'insertunorderedlist',
            '|',
            'emoticons',
            'image',
          ],
          
          afterBlur: function () {
            this.sync() //焦点问题，这里不写会出问题.同步KindEditor的值到textarea文本框
          }
         
        })
        
      },
    },
    events: {},
    init: function () {
      this.$api = api
    }
  })

  return vm
})
