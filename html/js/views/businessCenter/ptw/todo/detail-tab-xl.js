define(function (require) {
  var LIB = require('lib');
  var api = require("./vuex/api");
  //右侧滑出详细页
  var tpl = require("text!./detail-tab-xl.html");
  var advance = require("./dialog/advance");
  var jobApproval = require('./dialog/jobApproval');
  // var jobSign = require('./dialog/jobSign');
  var fillPtwModal = require('../components/modalPtwFill/index');
  var model = require("../model");
  var objModel = model;
  var workCardApi = require("../workCard/vuex/api");
  var orderInfo = require("./dialog/orderInfo");
  var selTplModal = require("../components/modal-sel-cardtpl");
  var ptwInfo = require("./dialog/ptwInfo");
  var modelContactPtw = require("../components/modalPtwFill/contactPtw/contactPtw");
  var contactTip = require("../components/modalPtwFill/contactPtw/contactTip");


  //初始化数据模型
  var newVO = function () {
    return {
      attr1: null,
      id: null,
      //编码
      code: null,
      // 作业票名称
      name: null,
      //作业开始时间
      workStartTime: null,
      //启用/禁用 0:启用,1:禁用
      disable: "0",
      //作业地点
      workPlace: null,
      //作业结束时间
      workEndTime: null,
      //是否启用预约机制 0:否,1:是
      enableReservation: null,
      //作业内容
      workContent: null,
      //公司Id
      compId: null,
      //部门Id
      orgId: null,
      //评审意见
      auditOpinion: null,
      //评审结果 0:未评审,1:不通过,2:通过
      auditResult: null,
      //评审时间
      auditTime: null,
      //作业状态  1:作业预约,2:作业评审,3:填报作业票,4:现场落实,5:作业会签,6:作业批准,7:作业监测,8:待关闭,9:作业取消,10:作业完成,11:已否决
      status: null,
      //作业所在设备
      workEquipment: null,
      //作业类型
      workCatalog: {
        id: '',
        name: ''
      },
      //评审人
      auditor: {
        id: '',
        name: ''
      },
      //作业许可
      workPermits: [],
      //作业许可历史
      workHistories: [],
      applicant: {
        id: '',
        name: ''
      },
      workLevel: {
        id: '',
        name: ''
      },
      createDate: null,
      prodUnitId: null,
      lastPermitId: null,
      superviseRecords: [],
      gasDetectionRecords: [],
      cardTpl: null,
      renewedWorkPermits: [],
      // 作业票模板id
      cardTplId: null,
      // 作业票模板代码
      cardTplCode: null,
      cardTplName: null,
      realStartTime: null,
      realEndTime: null,
        principals: null
    }
  };
  //Vue数据
  var dataModel = {
    showPtwInfo: false,
    showOrder: false,
    selTplModal: {
      show: false,
    },
    mainModel: {
      vo: newVO(),
      opType: 'view',
      isReadOnly: true,
      title: "",
      //验证规则
      rules: {},
      versionPermitId: "",
      versionPermitList: []
    },
    tableModel: {},
    formModel: {
      jobApprovalFormModel: {
        show: false,
      },
      jobSignFormModel: {
        show: false,
        btnShow: true
      },
      orderInfo: {
        show: false
      }
    },
    cardModel: {
      emerSceneCardModel: {
        showContent: true
      },
      emerContactCardModel: {
        showContent: true
      },
      emerStepCardModel: {
        showContent: true
      },
      emerDutyCardModel: {
        showContent: true
      },
    },
    selectModel: {
      dominationAreaSelectModel: {
        visible: false,
        filterData: {
          orgId: null
        }
      },
    },
    stopModel: {
      show: false,
      value: null,
      rules: {
        "value": [LIB.formRuleMgr.require("中止理由"),
          LIB.formRuleMgr.length(500),

        ],
      }
    },
    selTplModel: {
      disabled: false,
    }

    //无需附件上传请删除此段代码
    /*
     fileModel:{
         default : {
             cfg: {
                 params: {
                     recordId: null,
                     dataType: 'XXX1', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
                     fileType: 'XX'    // 文件类型标识，需要根据数据库的注释进行对应的修改
                 }
             },
            data : []
         }
     }
     */

  };
  //Vue组件
  /**
   *  请统一使用以下顺序配置Vue参数，方便codeview
   *     el
   template
   components
   componentName
   props
   data
   computed
   watch
   methods
   _XXX                //内部方法
   doXXX                //事件响应方法
   beforeInit            //初始化之前回调
   afterInit            //初始化之后回调
   afterInitData        //请求 查询 接口后回调
   afterInitFileData   //请求 查询文件列表 接口后回调
   beforeDoSave        //请求 新增/更新 接口前回调，返回false时不进行保存操作
   afterFormValidate    //表单rule的校验通过后回调，，返回false时不进行保存操作
   buildSaveData        //请求 新增/更新 接口前回调，重新构造接口的参数
   afterDoSave            //请求 新增/更新 接口后回调
   beforeDoDelete        //请求 删除 接口前回调
   afterDoDelete        //请求 删除 接口后回调
   events
   vue组件声明周期方法
   init/created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
   **/
  var detail = LIB.Vue.extend({
    mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.detailTabXlPanel],
    template: tpl,
    components: {
      "advance": advance,
      "jobApproval": jobApproval,
      // "jobSign": jobSign,
      "fillPtwModal": fillPtwModal,
      "orderInfo1": orderInfo,
      "selTplModal": selTplModal,
      "ptwInfo": ptwInfo,
      "modelContactPtw": modelContactPtw,
      "contactTip": contactTip,
    },
    props: {
      isShowBtn: {
        type: Boolean,
        default: true
      }
    },
    computed: {
        getAttr2User: function () {
          if(this.mainModel.vo.principals){
            return _.pluck(this.mainModel.vo.principals, 'name').join('，');
          }
        },
        getItemList: function () {
        if (this.mainModel.vo.attr1 === '1' && this.mainModel.vo.enableReservation === '1') {
          return [{
              name: "作业预约",
              index: 1,
              num: 1
            },
            {
              name: "作业审核",
              index: 2,
              num: 2
            },
            {
              name: "申请作业票",
              index: 3,
              num: 3
            },
            {
              name: "现场核对",
              index: 4,
              num: 4
            },
            {
              name: "作业会签",
              index: 5,
              num: 5
            },
            {
              name: "作业批准",
              index: 6,
              num: 6
            },
            {
              name: "作业监测",
              index: 7,
              num: 6
            },
            {
              name: "作业关闭",
              index: 8,
              num: 7
            },
          ]
        } else if (this.mainModel.vo.attr1 === '1' && this.mainModel.vo.enableReservation === '0') {
          return [{
              name: "作业预约",
              index: 1,
              num: 1
            },
            {
              name: "作业审核",
              index: 2,
              num: 1
            },
            {
              name: "申请作业票",
              index: 1,
              num: 1
            },
            {
              name: "现场核对",
              index: 4,
              num: 2
            },
            {
              name: "作业会签",
              index: 5,
              num: 3
            },
            {
              name: "作业批准",
              index: 6,
              num: 4
            },
            {
              name: "作业监测",
              index: 7,
              num: 4
            },
            {
              name: "作业关闭",
              index: 8,
              num: 5
            },
          ]
        }
        if (this.mainModel.vo.attr1 === '0' && this.mainModel.vo.enableReservation === '1') {
          return [{
              name: "作业预约",
              index: 1,
              num: 1
            },
            {
              name: "作业审核",
              index: 2,
              num: 2
            },
            {
              name: "申请作业票",
              index: 3,
              num: 3
            },
            {
              name: "现场核对",
              index: 4,
              num: 4
            },
            {
              name: "作业会签",
              index: 5,
              num: 5
            },
            {
              name: "作业批准",
              index: 6,
              num: 6
            },
            {
              name: "作业监测",
              index: 7,
              num: 7
            },
            {
              name: "作业关闭",
              index: 8,
              num: 8
            },
          ]
        } else if (this.mainModel.vo.attr1 === '0' && this.mainModel.vo.enableReservation === '0') {
          return [{
              name: "作业预约",
              index: 1,
              num: 1
            },
            {
              name: "作业审核",
              index: 2,
              num: 1
            },
            {
              name: "申请作业票",
              index: 1,
              num: 1
            },
            {
              name: "现场核对",
              index: 4,
              num: 2
            },
            {
              name: "作业会签",
              index: 5,
              num: 3
            },
            {
              name: "作业批准",
              index: 6,
              num: 4
            },
            {
              name: "作业监测",
              index: 7,
              num: 5
            },
            {
              name: "作业关闭",
              index: 8,
              num: 6
            },
          ]
        }

      }
    },
    data: function () {
      return dataModel;
    },
    methods: {
      showTips: function () {
        if (this.mainModel.vo.status == '12')
          LIB.Msg.info("中止理由 : " + this.mainModel.vo.suspendReason, 3);
      },
      doUpdateStatusStop: function () {
        var _this = this;
        this.$refs.ruleform.validate(function (valid) {
          if (valid) {
            LIB.Modal.confirm({
              title: '确定中止?',
              onOk: function () {
                api.updateStatusStop({
                  id: _this.mainModel.vo.id,
                  suspendReason: _this.stopModel.value
                }).then(function (res) {
                  LIB.Msg.info("保存成功");
                  _this.mainModel.vo.suspendReason = _this.stopModel.value;
                  _this.mainModel.vo.status = '12';
                  _this.stopModel.show = false
                  _this.$dispatch("ev_dtUpdate");
                  // _this.$dispatch("ev_dtClose");
                })
              }
            })
          }
        })


      },
      showStopModel: function () {
        this.stopModel.value = '';
        if (this.mainModel.vo && this.mainModel.vo.applicant && this.mainModel.vo.applicant.id == LIB.user.id) {
          this.stopModel.show = true;
        } else {
          LIB.Msg.info('只有作业申请人才可以“中止”操作');
        }
      },
      refreshMainTableData: function () {
        this.init('view', this.mainModel.vo.id);
        this.$broadcast('reFreshInfo');
      },
      doContactSuccess: function () {
        if (this.$refs.contactTip) this.$refs.contactTip.loadContactData();
      },
      doSetContact: function () {
        this.$refs.contactPtw.init(this.mainModel.vo);
      },
      doDelete: function () {
        //当beforeDoDelete方法明确返回false时,不继续执行doDelete方法, 返回undefine和true都会执行后续方法
        if (this.beforeDoDelete() === false) {
          return;
        }
        var _vo = {
          id: this.mainModel.vo.id,
          orgId: LIB.user.orgId
        };
        var _this = this;
        LIB.Modal.confirm({
          title: '删除当前数据?',
          onOk: function () {
            _this.$api.remove(null, _vo).then(function () {
              _this.afterDoDelete(_vo);
              _this.$dispatch("ev_dtDelete");
              LIB.Msg.info("删除成功");
            });
          }
        });
      },
      //doFillSubmit:function(){
      //	var _this=this;
      //	var data=model.getPermitDetail(this.fillPtw.permitModel);
      //		workCardApi.submitWorkPermit(data).then(function (result) {
      //			LIB.Msg.success("保存成功");
      //			_this.fillPtw.show=false;
      //	})
      //	},
      newVO: newVO,

      showOrderInfo: function () {
        this.$refs.orderInfo.showFn();
        this.formModel.orderInfo.show = true;
      },

      showApprovalModel: function (vo) {
        if (vo) {
          this.mainModel.vo = vo;
        }

        this.$dispatch('ev_doAddPtw', this.mainModel.vo);
        return;

        var _this = this;
        if ((this.mainModel.vo.attr1 == 1 ) || this.mainModel.vo.status == 6) {
          _this.formModel.jobSignFormModel.show = true;
        } else if(this.mainModel.vo.status == 5 && this.mainModel.vo.workPermit && this.mainModel.vo.workPermit.serialNum=='1'){
           this.$dispatch('ev_showAuthorize', this.mainModel.vo);
        } else if (_this.mainModel.vo.status == 3) {
          //==================填报处理=================
          if (!_this.mainModel.vo.workPermit || !_this.mainModel.vo.workPermit.cardTplId) {
            _this.$refs.modalSelTpl.init({
              workLevelId: _this.mainModel.vo.workLevelId,
              workCatalogId: _this.mainModel.vo.workCatalog.id,
              disabled: true,
            });
            // _this.selTplModal.show=true;
          } else {
            _this.initPermitData();
          }
        } else if (_this.mainModel.vo.status == 2) {
          this.formModel.jobApprovalFormModel.show = true;
        }
      },
      doSelectedTpl: function (item) {
        var _this = this;
        if (!this.mainModel.vo.workPermit.cardTpl) {
          this.mainModel.vo.workPermit.cardTpl = {
            id: ""
          };
        }
        this.mainModel.vo.workPermit.cardTpl.id = item.tplId;
        _.extend(this.mainModel.vo.workPermit, {
          cardTplId: item.tplId,
          workCatalog: {
            id: item.workCardCatalogId
          },
          workLevelId: item.workLevelId,
        });
        this.seledTpl = item;
        _this.initPermitData();
      },
      initPermitData: function () {
        var _this = this;
        LIB.globalLoader.show();

        workCardApi.tplDetail(_this.mainModel.vo.workPermit.cardTplId).then(function (model) {
          workCardApi.getWorkPermit(_this.mainModel.vo.workPermit.id).then(function (permitModel) {
            if (_this.seledTpl) {
              _.extend(permitModel, _this.mainModel.vo.workPermit);
              _this.seledTpl = null;
            } else {
              objModel.setOther(model, permitModel)
            }
            objModel.permitHandler(permitModel);
            // if (permitModel.selworkPersonnels["1"].length === 0) {
            //     permitModel.selworkPersonnels["1"].push({
            //         user: {id: LIB.user.id, name: LIB.user.name},
            //         type: "1"
            //     });
            // }
            _this.$refs.ptwFill.init(model, permitModel, _this.mainModel.vo.enableReservation);
            // _.extend(_this.fillPtw, {
            //     model: model,
            //     permitModel: permitModel,
            //     show: true,z
            // });
            LIB.globalLoader.hide();

          })
        })
      },
      doSaveSign: function (obj) {
        var _this = this;
        // obj.PtwWorkPersonne = {
        //    auditResult:obj.auditResult,
        //    signOpinion:obj.signOpinion
        // };
        api.saveAuthorize({
          id: this.mainModel.vo.id
        }, obj).then(function (res) {
          LIB.Msg.info("提交成功");
          _this.$dispatch("ev_dtUpdate");
          _this.$dispatch("ev_dtClose");
        });
      },

      doSaveStatus: function (obj) {
        var _this = this;
        obj.id = this.mainModel.vo.id;

        api.updateResult(obj).then(function (res) {
          LIB.Msg.info("提交成功");
          _this.$dispatch("ev_dtUpdate");
          _this.$dispatch("ev_dtClose");
        });
      },

      getStyle: function (item) {
        if (item.index <= parseInt(this.mainModel.vo.status)) {
          return 'background:#33a6ff;'
        }
        return "background:#fff;color:#ddd;border: 1px solid #ddd;font-weight:400;"
      },

      /**
       *
       * @param gi groupIndex 6个为一组，组的序号，从0开始
       * @param item 每一个检查点
       * @return {Array}
       */
      calcClass: function (gi, item) {
        var splitLength = 6;

        var res = [];
        var _cls;

        // 1.长度为1时去掉线
        if (item.total === 1) {
          res.push('line-zero');
          return res;
        }
        // 2.第一个去掉左半边的线
        if (item.index === 1) {
          res.push('half-right');
          return res;
        }
        // 3.最后一项 根据行数判断去掉左半边还是右半边的线
        if (item.index === this.getItemList.length) {
          // _cls = gi % 2 === 0 ? 'half-left' : 'half-right';
          _cls = 'half-left'
          res.push(_cls);
          return res;
        }
        // 4. 其他不是行首或者行尾的
        if (item.index % splitLength !== 0) {
          return res;
        }
        // 5. 其他事行首或者行尾的需要加转折线
        var results = {
          "0": 'odd-end', // 奇数行最后一个
          "1": "even-end" // 偶数行最后一个
        };
        var key = '' + (gi % 2);
        if (item.index < item.total) {
          res.push(results[key]);
        }
        return res;
      },
      calcItemClass: function (item) {
        if (item.isBond) {
          return ['sq'];
        } else {
          return ['unbound', 'sq'];
        }
      },
      queryWorkhistoriesList: function () {

      },

      afterInit: function () {
        if (this.mainModel.vo && this.mainModel.vo.lastPermitId) {
          this.mainModel.vo.lastPermitId = null;
        }
        LIB.globalLoader.show();
      },

      afterInitData: function () {
        LIB.globalLoader.hide();
        // this.mainModel.vo.attr1='1'
        var _this = this;
        if (this.isShowBtn && ((this.mainModel.vo.attr1 == 1 && this.mainModel.vo.status == 5) || this.mainModel.vo.status == 6)) {
          api.checkAuthoriser({
            id: this.mainModel.vo.id
          }).then(function (res) {
            _this.formModel.jobSignFormModel.btnShow = res.data;
          })
        }

        if (this.mainModel.vo.status >= 3) { //表示已经填报了
          //更新关联数据 bug16274
          this.$nextTick(function () {
            if (_this.$refs.contactTip) _this.$refs.contactTip.loadContactData();
          });

          api.queryWorkPermits({
            id: _this.mainModel.vo.id
          }).then(function (res) {
            _this.mainModel.versionPermitList = res.data;
            if (res.data[0]) {
              _this.$nextTick(function () {
                if (res.data[0].id === _this.mainModel.versionPermitId) {} else {
                  _this.mainModel.versionPermitId = res.data[0].id;
                }
              });
            }
          })
        }
        var vo = this.mainModel.vo;
        this.showOrder = vo.status < 3 || (vo.status == 12 && !vo.workPermit) || (vo.status == 11 || !vo.workPermit.cardTplId && vo.enableReservation);
        this.showPtwInfo = !this.showOrder;
      },
      beforeInit: function () {
        this.formModel.jobSignFormModel.btnShow = true;
        this.queryWorkhistoriesList();
      },
      refreshPwtInfoView: function () {
        this.$refs.ptwInfoView.refresh();
      },
      doPreview: function () {
        var vo = this.mainModel.vo;
        // this.$refs.ptwInfoView.showPreview();
        if (this.mainModel.vo.status == 11) {
          LIB.Msg.info("作业票已否决");
          return;
        }

        if (this.mainModel.vo.status == 3 && !vo.workPermit.cardTplId && vo.enableReservation) {
          LIB.Msg.info("还未选择作业票模板");
          return;
        }

        if (this.mainModel.vo.status < 3 || (this.mainModel.vo.status == 11 || !vo.workPermit.cardTplId && vo.enableReservation)) {
          LIB.Msg.info("作业票还在申请待审批状态");
          return;
        }

        var obj = _.extend({}, this.$refs.ptwInfoView.permitModel);
        var list = this.$refs.ptwInfoView.permitModel.workStuffs.filter(function (item) {
          return item.type == 3;
        });
        this.$emit("show-preview", this.mainModel.vo, obj);
      },
      openModelWicket: function () {
        if (this.mainModel.vo.cardTplId && this.mainModel.vo.cardTplCode) {
          var newWindowURL = location.origin + location.pathname + '#!/ptw/card/' + '?method=detail&id=' + this.mainModel.vo.cardTplId + '&code=' + this.mainModel.vo.cardTplCode
          window.open(newWindowURL)
        }
      },
      isShowPwtRealTime: function () {
        if (parseInt(this.mainModel.vo.status) < 7) {
          return false
        }

        if (!this.mainModel.vo.realStartTime && !this.mainModel.vo.realEndTime) {
          return false
        }
        return true
      }
    },
    watch: {
      // 'mainModel.versionPermitId':function (val) {
      //     if(val){
      //         this.$refs.ptwInfoView.init();
      //     }
      // },
      'mainModel.vo.lastPermitId': function (val) {
        if (val) {
          this.$refs.ptwInfoView.init();
        }
      }
    },
    filters: {
      switchStatusToWord: function (status) {
        if (status && status.length) {
          return LIB.getDataDic('iptw_work_status', status)
        } else {
          return ''
        }
      },
      isCompleteWork: function (realEndTime) {
        // 任务完成的状态
        var finishStatus = ['8', '9', '10', '11', '12']
        if (finishStatus.indexOf(this.mainModel.vo.status) === -1) {
          return '(未结束)'
        } else {
          realEndTime = realEndTime.split(':')
          realEndTime.splice(-1, 1)
          return realEndTime.join(':')
        }

      },
      sliceInvalidDate: function (date) {
        if(date){
          var splitDate = date.split(':')
          splitDate.splice(-1, 1)
          return splitDate.join(':')
        }
        return ''
      }
    },
    events: {
      "ev_dtDeal": function (vo) {
        this.showApprovalModel(vo);
      },
      'get_ModelName': function (cardTpl) {
        this.mainModel.vo.cardTplName = cardTpl.name
        this.mainModel.vo.cardTplId = cardTpl.id
        this.mainModel.vo.cardTplCode = cardTpl.code
      }
    },
    init: function () {
      if (this.$route.path.indexOf("/ptwTodo") > -1) {
        api.__auth__ = {
          "create": "7080002001", //发起作业
          'delete': '7080002003', //删除
          'deal': '7080002007', //处理
          'relate': '7080002008', //关联作业
          'preview': '7080002009', //预览
        };
      } else if (this.$route.path.indexOf("/ptwFinish") > -1) {
        api.__auth__ = {
          "create": "7080003001", //发起作业
          'delete': '7080003003', //删除
          'deal': '7080003007', //处理
          'relate': '7080003008', //关联作业
          'preview': '7080003009', //预览
        };
      } else if (this.$route.path.indexOf("/ptwRecord") > -1) {
        api.__auth__ = {
          "create": "7080004001", //发起作业
          'delete': '7080004003', //删除
          'deal': '7080004007', //处理
          'relate': '7080004008', //关联作业
          'preview': '7080004009', //预览
        };
      }
      this.$api = api;
    }
  });

  return detail;
});