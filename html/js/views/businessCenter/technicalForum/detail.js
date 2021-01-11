define(function (require) {
  var LIB = require('lib')
  var api = require('./vuex/api')
  var circleLoading = new LIB.Msg.circleLoading();
  //右侧滑出详细页
  var tpl = require('text!./detail.html')
  var userSelectModal = require('componentsEx/selectTableModal/userSelectModal')
  var articleReplyFormModal = require('componentsEx/formModal/articleReplyFormModal')
  require('libs/kindeditor/kindeditor')

  //初始化数据模型
  var newVO = function () {
    return {
      id: null,
      //编码
      code: null,
      //禁用标识 0:启用,1:禁用
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

      //验证规则
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
        viewTime: LIB.formRuleMgr
          .range(0, 100)
          .concat(LIB.formRuleMgr.allowIntEmpty),
        'user.id': [LIB.formRuleMgr.allowStrEmpty]
      }
    },
    Id:LIB.user.id,
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
    bigImgShow:false,
    images:'',
    //关键字
    keywordSelectModal: {
      show: false
    },
    isShow: true,
    // 保存的关键字
      //关键词
      keyword: '',
    getkeyword: [],
    keywordsMore: [],
    keywordsSure: [],
    tableModel: {
      articleReplyTableModel: LIB.Opts.extendDetailTableOpt({
        url: 'techarticle/articlereplies/list/{curPage}/{pageSize}',
        selectedDatas: [],
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
        ],
        
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

    data: function () {
      return dataModel
    },
    computed: {
      isCreator: function () {
        var createBy = this.mainModel.vo.createBy;
        return LIB.user.id === createBy
      },
      isSuper: function () {
        
        return LIB.user.id === '9999999999'
      },
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
      // 显示回复
      doSelectRelpy: function () {
        var _this = this
        _this.moreRelpyModel = true
        _this.isShow = true
        _this.faceUrl = LIB.convertPicPath(LIB.user.faceid);
        circleLoading.show();
        api
          .selectAndCountById({ id: _this.mainModel.vo.id })
          .then(function (res) {
            _this.mainModel.vo.articleReplies = res.body.articleReplies
            circleLoading.hide();
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
        if (this.mainModel.opType == 'create') {
          setTimeout(this.doLoadKindEditor, 0)
        }
        var _this = this
        this.moreRelpyModel = false
        this.isShow = false
        KindEditor.html($('#reply-data1'), ' ')
        // api.getkeyword().then(function (res) {
        //   // console.log(res)
        //   // _this.keywordsMore = []
        //   _this.mainModel.vo.techKeyWords=[];
        //   _.each(res.data, function (item) {
        //     // _this.keywordsMore = []
        //     _this.mainModel.vo.techKeyWords.push({
        //       clicked: false,
        //       val: item
        //     })
        //   })
        //  
        // })
        
      },
      afterInitData: function (param) {
        // console.log(param);
        // console.log(this.mainModel.vo);
        if (param.state == 0) {
          setTimeout(this.doLoadKindEditor, 0)
        }
        this.keywordsSure=this.mainModel.vo.techKeyWords
        // this.mainModel.vo.detail = param
        // this.$refs.articlereplyTable.doQuery({ id: this.mainModel.vo.id })
      },
      // beforeInitData: function () {
      //   _this=this
      
      // },
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
          allowUpload: false, //允许上传
          allowImageUpload: false,
          syncType: 'form',
          // uploadJson = K.undef(self.uploadJson, self.basePath + 'php/upload_json.php'),
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
     
     
      // 取消
      doReviseCancel: function () {
        this.$dispatch('ev_dtClose')
      },
      doClose: function () {
        // this.$dispatch('ev_dtUpdate') // 不要刷新
        this.$dispatch('ev_dtClose')
        $('#content-detail img').removeAttr("style")
      },
      
      doreplyData: function () {
        this.relpyModal.show = true
      },
      // 关闭回复弹框
      doClosePage: function () {
        var _this=this
        this.relpyModal.show = false
      },
     
      doSaveData: function () {
        var _this = this
        
        var reply1 = $('#reply-data')
          .val()
          .replace(/&nbsp;/g, '')
          .trim()
          if(reply1.length==''){
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
     
    },
  //   ready: function () {
  //     this.imageBox = this.$els.imageBox;
  //     this.viewer = new Viewer(this.imageBox, {
  //         navbar: false,
  //         transition: false,
  //         zoomRatio: 0.2,
  //         minZoomRatio: 0.3,
  //         maxZoomRatio: 5,
  //         fullscreen: false,
  //         url: function(image) {
  //             var src = image.dataset.src || image.src.replace("scale", "watermark");
  //             return src;
  //         }
  //     });

  //     if(this.updateNum === 0 && _.isArray(this.images)) {
  //         if(this.images.length > 0 && this.images.length != this.files.length) {
  //             this.normalize();
  //         }
  //         this.$nextTick(function () {
  //             this.viewer.update();
  //         });

  //     }
  //     // this.imageBox.addEventListener("hide", this._distroyImg);
  // },
    
    events: {
     
    },
   
    init: function (model) {
      
      this.$api = api
     
    }
   
  })

  return detail
})
