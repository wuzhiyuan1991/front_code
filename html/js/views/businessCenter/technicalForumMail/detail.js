define(function (require) {
  var LIB = require('lib')
  var api = require('./vuex/api')
  var circleLoading = new LIB.Msg.circleLoading()
  //右侧滑出详细页
  var tpl = require('text!./detail.html')
  var userSelectModal = require('componentsEx/selectTableModal/userSelectModal')
  var articleReplyFormModal = require('componentsEx/formModal/articleReplyFormModal')
  var baseUrl = require('base')

  require('libs/kindeditor/kindeditor')

  //初始化数据模型
  var newVO = function () {
    return {
      id: null,
      //编码
      code: null,
      //禁用标识 0:禁用,1:启用
      // disable: '0',
      //公司Id
      compId: null,
      //部门Id
      orgId: null,
      // 发布的内容
      content: null,
      key: '',
      techKeyWords: [],

      //发布时间
      lastReplyDate: null,
      //发布时间
      publishDate: null,
      curPage: 1,
      pageSize: 3,
      //回复次数
      replyTime: null,
      //发布状态 0：未发布，1：已发布
      state: null,
      //帖子标题
      title: null,
      //查看次数
      viewTime: null,

      //作者
      user: { id: '', name: '' },
      //回复
      articleReplies: [],
      // 单个回复
      reply: '',
      createBy: null
    }
  }
  //Vue数据
  var dataModel = {
    mainModel: {
      vo: newVO(),
      opType: 'view',
      isReadOnly: true,
      title: '发表帖子',
      // filterColumn:['compId'],
      // filterColumn:['orgId'],

      // //验证规则
      rules: {
        code: [LIB.formRuleMgr.length(255)],
        disable: LIB.formRuleMgr.require('状态'),
        compId: [LIB.formRuleMgr.require('公司')],
        orgId: [LIB.formRuleMgr.length(10)],
        content: [LIB.formRuleMgr.length(65535)],
        keyword: [LIB.formRuleMgr.length(4000)],
        lastReplyDate: [LIB.formRuleMgr.allowStrEmpty],
        publishDate: [LIB.formRuleMgr.allowStrEmpty],
        replyTime: LIB.formRuleMgr
          .range(0, 100)
          .concat(LIB.formRuleMgr.allowIntEmpty),
        state: [LIB.formRuleMgr.length(10)],
        title: [LIB.formRuleMgr.length(50), LIB.formRuleMgr.require('标题')],
        // title: [LIB.formRuleMgr.length(50), LIB.formRuleMgr.require('标题')],
        viewTime: LIB.formRuleMgr
          .range(0, 100)
          .concat(LIB.formRuleMgr.allowIntEmpty),
        'user.id': [LIB.formRuleMgr.allowStrEmpty]
      }
    },
    Id: LIB.user.id,
    //图片文件
    faceFile: null,
    //图片访问路径
    faceUrl: null,
    // 回复
    relpyModal: {
      show: false
    },
    // 详细回复
    moreRelpyModel: false,
    //关键字
    keywordSelectModal: {
      show: false
    },
    isShow: true,
    // 保存的关键字
    //关键词
    keyword: '',
    images:'',
    getkeyword: [],
    keywordsMore: [],
    keywordsSure: [], // 外面的关键字
    keywordsOk: [], // 里面的关键字
    tableModel: {
      articleReplyTableModel: LIB.Opts.extendDetailTableOpt({
        url: 'techarticle/articlereplies/list/{curPage}/{pageSize}',
        columns: [
          LIB.tableMgr.ksColumn.code,
          {
            title: '名称',
            fieldName: 'name',
            keywordFilterName: 'criteria.strValue.keyWordValue_name'
          },
          {
            title: '',
            fieldType: 'tool',
            toolType: 'edit,del'
          }
        ]
      })
    },
    formModel: {
      articleReplyFormModel: {
        show: false,
        hiddenFields: ['articleId'],
        queryUrl: 'techarticle/{id}/articlereply/{articleReplyId}'
      }
    },
    selectModel: {
      userSelectModel: {
        visible: false,
        filterData: { orgId: null }
      }
    }
    //  //文件暂传关闭

    //   params: {
    //     recordId: LIB.user.id,
    //     dataType: 's2',
    //     fileType: 'JSLT'
    //   },
    //   filters: {
    //     max_file_size: '400mb',
    //     mime_types: [{
    //       title: "files",
    //       extensions: "mp4,avi,flv,3gp"
    //     }]
    //     },
    //   events: {
    //      onSuccessUpload: uploadEvents.videos
    // }
  }
  //Vue组件
  /**
	 *  请统一使用以下顺序配置Vue参数，方便codeview
	 *	el
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
  var detail = LIB.Vue.extend({
    mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.detailPanel],
    template: tpl,
    components: {
      userSelectModal: userSelectModal,
      articlereplyFormModal: articleReplyFormModal
    },
    watch: {
      'relpyModal.show': function (val) {
        if (val) {
          setTimeout(this.doLoadKindEditor, 0)
        }
      },
      'mainModel.vo.techKeyWords': function (val) {},
      images: function (nVal) {
        if(_.isArray(nVal) && this.viewer) {
            this.normalize();
            this.$nextTick(function () {
                this.viewer.update();
                this.updateNum++;
            })
        }
    }
    },

    computed: {
      isCreator: function () {
        var createBy = this.mainModel.vo.createBy
        return LIB.user.id === createBy
      }
    },
    data: function () {
      return dataModel
    },

    methods: {
      normalize: function () {
        try {
            var images = this.images;
            this.files = _.map(images, function (image) {
                var fileId=image.fileId||image.id;
                return {
                    fileId:fileId,//直接显示图片id
                    fileExt: image.fileExt,
                    fullSrc: image.attr5 === '5' || image.attr5 == 'OSS' ? image.fullSrc || image.ctxPath : '',
                    attr5: image.attr5
                }
            })
        }
        catch (e) {
            
        }
    },
      doViewImages:function(e){
        _this=this
       var targetImg=e.target.localName
      if(targetImg=='img'){
        // this.bigImgShow=true
      
       this.images=[{attr5:'5', fullSrc: e.target.src}]
      // this.images= LIB.convertFileData();
       setTimeout(function () {
        _this.$refs.imageViewer.view();}, 100);
        $('.ul-lite-box').css({
          display:'none'
        })
      }
      },  
      doKeyWords: function (index) {
        var _this = this
        _this.keywordsSure.splice(index, 1)
        return
        // Array.prototype.indexOfS = function(v) {
        //   for (var i = 0; i < this.length; i++) {
        //   if (this[i] == v) return i;
        //   }
        //   return -1;
        //   };
        //   Array.prototype.removeS = function(v) {
        //     var index = this.indexOfS(v);
        //     if (index > -1) {
        //     this.splice(index, 1);
        //     }
        //     };
        //     _this.keywordsSure.removeS(_this.keywordsSure[index])
      },
      // 内部选择关键字
      doKeyWords1: function (index) {
        var _this = this
        if (_this.mainModel.vo.techKeyWords[index].clicked == true) {
          var arr1 = _this.keywordsOk
          var noRepeat = function (arr1, arr2) {
            return arr1.filter(function (e) {
              return arr2.indexOf(e) == -1
            })
          }
          var arr2 = []
          arr2.push(_this.mainModel.vo.techKeyWords[index].val)
          _this.keywordsOk = noRepeat(arr1, arr2)
          // _this.keywordsOk.pop(_this.mainModel.vo.techKeyWords[index].val)
          _this.mainModel.vo.techKeyWords[index].clicked = false
        } else {
          _this.keywordsOk.push(_this.mainModel.vo.techKeyWords[index].val)
          _this.mainModel.vo.techKeyWords[index].clicked = true
        }
      },
      // 保存关键字
      doSaveKeyWord: function () {
        _this = this
        // 拆分校验
        var keyIndex = _this.keyword.replace(/，/gi, ',').split(',')
        
        for (var i = 0; i < keyIndex.length; i++) {
          keyIndex[i] = keyIndex[i].trim()
          for ( var y = 0 ; y < _this.mainModel.vo.techKeyWords.length ; y++ ){
           if(keyIndex[i]==_this.mainModel.vo.techKeyWords[y].val.keyword){
            LIB.Msg.warning('输入的关键字'+_this.mainModel.vo.techKeyWords[y].val.keyword+'已存在,请重新输入!')
           
            return
           }
            };
          if (keyIndex[i].length > 20) {
            LIB.Msg.warning('关键字长度在1到20字符')
            // _this.keyword = ''
            _this.keywordsOk = []
            var arr = _this.keywordsSure
            var brr = keyIndex

            for (var x = 0; x < brr.length; x++) {
              for (var j = 0; j < arr.length; j++) {
                if (arr[j] === brr[x]) {
                  arr.splice(j, 1)
                  j--
                }
              }
            }
            return
          }
        }
        if (_this.keyword != '') {
          keyIndex = keyIndex.filter(function (s) {
            return s && s.trim()
          }) // 数组去空值
          keyIndex.forEach(function (item, index) {
            _this.keywordsOk.push({
              keyword: keyIndex[index]
            })
          })
        }
        _this.keywordsSure = _this.keywordsSure.concat(_this.keywordsOk)
        function deWeight () {
          for (var n = 0; n < _this.keywordsSure.length - 1; n++) {
            for (var m = n + 1; m < _this.keywordsSure.length; m++) {
              if (
                _this.keywordsSure[n].keyword == _this.keywordsSure[m].keyword
              ) {
                _this.keywordsSure.splice(m, 1)
                //因为数组长度减小1，所以直接 m++ 会漏掉一个元素，所以要 m--
                m--
              }
            }
          }
          return _this.keywordsSure
        }
        _this.keywordsSure = deWeight()
        _this.keyword = ''
        _this.keywordsOk = []
        _this.keywordSelectModal.show = false
        $('#keymask').css({ display: 'none' })
      },
      // 显示回复
      doSelectRelpy: function () {
        var _this = this
        _this.moreRelpyModel = true
        _this.isShow = true
        _this.faceUrl = LIB.convertPicPath(LIB.user.faceid)
        circleLoading.show()
        api
          .selectAndCountById({ id: _this.mainModel.vo.id })
          .then(function (res) {
            _this.mainModel.vo.articleReplies = res.body.articleReplies
            circleLoading.hide()
          })
      },
      getFaceid: function (val) {
        return LIB.convertPicPath(val)
      },
      getOrgName: function (val) {
        var org = this.getDataDic('org', val)
        // console.log(org)
        return org.deptName
      },
      getCompName: function (val) {
        return this.getDataDic('org', val).compName
      },

      newVO: newVO,
      afterInit: function () {
        var _this = this
        // _this.$dispatch('ev_dtUpdate')
        if (this.mainModel.opType == 'create') {
          setTimeout(this.doLoadKindEditor, 0)
          KindEditor.html($('#reply-data1'), ' ')
          _this.keywordsSure = []
          $('#keymask').css({ display: 'none' })
        }
        this.moreRelpyModel = false
        this.isShow = false
      },
      afterInitData: function (param) {
        if (this.mainModel.vo.state == 0) {
          setTimeout(this.doLoadKindEditor, 0)
        }
        this.keywordsSure = this.mainModel.vo.techKeyWords
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
          allowPreviewEmoticons: true,
          allowImageUpload: false,
          syncType: 'form',
          // uploadJson :'http://192.168.99.126:8082' + '/file/upload',
          // fileManagerJson : 'http://192.168.99.126:8082' + '/file/upload',
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
            'image'
          ],

          afterBlur: function () {
            this.sync() //焦点问题，这里不写会出问题.同步KindEditor的值到textarea文本框
          }
        })
      },

      //新增方法,滑出新增页面
      // 保存文章待发布
      doSaveForum: function () {
        // 当beforeDoSave方法明确返回false时,不继续执行doSave方法, 返回undefine和true都会执行后续方法
        if (this.beforeDoSave() === false) {
          return
        }
        var _this = this
        var _data = this.mainModel
        // console.log($('#reply-data1').val())
        _this.mainModel.vo.content = $('#reply-data1')
          .val()
          .trim()
        //    var zipbase64= _this.mainModel.vo.content.split('"')[1]

        //    if(zipbase64.length/1024 > 100) { //大于1M，进行压缩上传
        //     LIB.Msg.warning('图片太大了!')
        // }
        if (
          !this.mainModel.vo.content ||
          _this.mainModel.vo.title == null ||
          _this.mainModel.vo.title == ''
        ) {
          LIB.Msg.warning('标题和内容不能为空')
          return
        }

        if (this.mainModel.vo.title.length > 50) {
          LIB.Msg.warning('标题长度在1到50字符')
          return
        }
        _data.vo.content = _data.vo.content.replace(/embed/, 'iframe')
        this.$refs.ruleform.validate(function (valid) {
          if (valid) {
            if (_data.vo.id == null || _this.mainModel.opType === 'create') {
              api
                .create({
                  content: _data.vo.content,
                  title: _data.vo.title,
                  techKeyWords: _this.keywordsSure
                })
                .then(function (res) {
                  LIB.Msg.info('保存成功')
                  setTimeout(_this.doLoadKindEditor, 0)
                  _data.vo.id = res.data.id
                  _this._getResultCodeByRequest(res.data.id)
                  _this.afterDoSave(res.body)
                  if (_this.fileModel) {
                    _.each(_this.fileModel, function (item) {
                      item.cfg &&
                        item.cfg.params &&
                        (item.cfg.params.recordId = _data.vo.id)
                    })
                  }
                  _this.init('view', _data.vo.id)
                  _this.$dispatch('ev_dtCreate')
                  _this.storeBeforeEditVo()
                })
            } else {
              if (LIB.user.id !== _data.vo.createBy) {
                LIB.Msg.warning('操作错误')
                return
              } else {
                _vo = _this._checkEmptyValue(_data.vo)
                // _vo.techKeyWords = []
                // 去重

                // function filterRepeatStr (str) {
                //   var ar2 = str.split(',')
                //   var array = new Array()
                //   var j = 0
                //   for (var i = 0; i < ar2.length; i++) {
                //     if (
                //       (array == '' ||
                //         array.toString().match(new RegExp(ar2[i], 'g')) ==
                //           null) &&
                //       ar2[i] != ''
                //     ) {
                //       array[j] = ar2[i]
                //       array.sort()
                //       j++
                //     }
                //   }
                //   return array.toString()
                // }
                _vo.techKeyWords = _this.keywordsSure
                api.updateById(_vo).then(function (res) {
                  LIB.Msg.info('保存成功')
                  $('#keymask').css({ display: 'block' })
                  _this.afterDoSave(res.body)
                  _this.changeView('view')
                  _this.$dispatch('ev_dtUpdate')
                  _this.storeBeforeEditVo()
                  _this.init('view', _this.mainModel.vo.id)
                })
              }
            }
          } else {
            return false
          }
        })
        if (_data.vo.state == null) {
          _this.keywordsSure = []
          if (_data.vo.state == null || _data.vo.state != 0) {
            KindEditor.html($('#reply-data1'), ' ')
          }
        }
      },
      // 取消
      doReviseCancel: function () {
        this.$dispatch('ev_dtClose')
        $('#keymask').css({ display: 'block' })
      },

      doClose: function () {
        this.$dispatch('ev_dtClose')
      },
      doEdit: function () {
        $('#keymask').css({ display: 'none' })
        if (this.beforeDoEdit() === false) {
          return
        }

        setTimeout(this.doLoadKindEditor, 0)
        this.mainModel.opType = 'update'
        this.mainModel.isReadOnly = false
        this.changeView('update')
        this.storeBeforeEditVo()
        this.afterDoEdit && this.afterDoEdit()
      },
      // 取消新增
      doCancel: function () {
        this.recoverBeforeEditVo()
        this.mainModel.action = 'view'
        this.changeView('view')
        this.afterDoCancel && this.afterDoCancel()
        var _this = this
        var key1 = _this.mainModel.vo.keyword.replace(/，/gi, ',')
        if (_this.keywordsSure.length != 0) {
          _this.keywordsSure = key1.split(',')
        }
        KindEditor.html($('#reply-data1'), _this.mainModel.vo.content)
        $('#keymask').css({ display: 'block' })
      },

      // 发布
      doPublish: function () {
        var _this = this
        if ($('#reply-data1').val() == '' || _this.mainModel.vo.title == '') {
          LIB.Msg.error('请填写标题与内容')
        } else if (_this.mainModel.vo.state == null) {
          LIB.Msg.warning('请先保存再发表')
        } else {
          LIB.Modal.confirm({
            title: '确定发布?',
            onOk: function () {
              api
                .publishArticle({
                  id: _this.mainModel.vo.id
                })
                .then(function () {
                  LIB.Msg.success('发布成功')
                  _this.mainModel.vo.state = 1
                  _this.mainModel.vo.disable = 0
                  _this.mainModel.vo.publishDate = new Date()
                  _this.mainModel.vo.content = _this.mainModel.vo.content
                    .replace(/&nbsp;/g, '')
                    .trim()
                  _this.mainModel.vo.content = _this.mainModel.vo.content.replace(
                    /<br\s*\/?>/gi,
                    '\r\n'
                  )
                  // _this.afterDoSave()
                  _this.keywordsSure = []
                  _this.changeView('view')
                  _this.$dispatch('ev_dtUpdate')
                  _this.$dispatch('ev_dtClose')
                })
            }
          })
        }
      },
      doreplyData: function () {
        this.relpyModal.show = true
      },
      // 关闭回复弹框
      doClosePage: function () {
        this.relpyModal.show = false
      },
      // 关闭关键字弹框
      doClosePage1: function () {
        var _this = this
        _this.keywordsOk = []
        this.keywordSelectModal.show = false
      },
      // 上传回复信息
      doSaveData: function () {
        var _this = this

        var reply1 = $('#reply-data')
          .val()
          .replace(/&nbsp;/g, '')
          .trim()
        if (reply1.length == '') {
          LIB.Msg.info('回复内容不能为空')
          return
        }
        _this.mainModel.vo.reply = reply1.replace(/<br\s*\/?>/gi, '\r\n')
        api
          .saveArticleReply(
            { id: _this.mainModel.vo.id },
            { content: _this.mainModel.vo.reply }
          )
          .then(function () {
            KindEditor.html($('#reply-data'), ' ')
            _this.mainModel.vo.replyTime =
              Number(_this.mainModel.vo.replyTime) + 1
            _this.doSelectRelpy()
            _this.$dispatch('ev_dtUpdate')
            LIB.Msg.info('回复成功')
          })
        this.relpyModal.show = false
      },
      //关键字选择按钮
      doSelect: function () {
        var _this = this
        _this.keyword = ''
        _this.keywordSelectModal.show = true
        api.getkeyword({
          disable:0
        }).then(function (res) {
          _this.mainModel.vo.techKeyWords = []
          _.each(res.data, function (item) {
            _this.mainModel.vo.techKeyWords.push({
              clicked: false,
              val: item
            })
          })
          _this.$dispatch('ev_dtUpdate')
        })
      }
    },
    events: {},
    init: function () {
      this.$api = api
    }
  })

  return detail
})
