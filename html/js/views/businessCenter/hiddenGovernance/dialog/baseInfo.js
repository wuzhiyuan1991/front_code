define(function (require) {
  var LIB = require('lib');
  var videoHelper = require("tools/videoHelper");
  var api = require("../vuex/api");
  //右侧滑出详细页
  var tpl = require("text!./baseInfo.html");
  //初始化数据模型
  var newVO = function () {
    return {
      id: null,
      createDate: null,
      reformType: null,
      createBy: null,
      checkObjectId: null,
      checkObject: {
        name: null
      },
      danger: null,
      isRectification: null,
      lastReformId: null,
      principalId: null,
      problem: null,
      registerDate: null,
      remark: null,
      riskType: null,
      riskLevel: null,
      sourceType: null,
      status: null,
      title: null,
      type: null,
      reformerId: null,
      reformerName: null,
      reformDate: null,
      verifierId: null,
      verifierName: null,
      verifyDate: null,
      cloudFiles: [],
      pictures: [],
      videos: [],
      audios: [],
      latentDefect: null,
      nestedOpCard: '1',
      specialty: '',
      legalRegulation: {
        id: '',
        name: ''
      },
      hiddenDangerType: null,
      causeAnalysis: null,
      rectificationCost: null,
      user: {
        id: '',
        name: ''
      },
      rewardAmount: null,
      rewardNum: null,
      lowOldBadLevel: null,
      secondLevel: null,
      firstLevel: null,
      riskJudgementType: null,
      principalName: null,
      principalOrgId: null,
      riskLevelResult: null,
      problemFinder: null,
      reform: {
        unFinishedDesc: null,
        completionDesc: null,
        afterPreventive: null
      },
      bizType: null,
      problemReason: null,
      hseType: null,
      discoveryChannel: null,
      checkBasis:null
    }
  };
  //来源类型, 0:手动登记, 1:检查记录, 2:随即观察, 3:分享
  var sourceTypeMap = {
    0: '手动登记',
    1: '检查记录',
    2: '随机观察',
    // 3: '分享',//暂时没用到
    4: '巡检记录',
    5: '临时工作记录'
  };
  //Vue数据
  var dataModel = {
    mainModel: {
      vo: newVO(),
      enableDiscoveryChannel: false
    },
    playModel: {
      title: "视频播放",
      show: false,
      id: null
    },
    picModel: {
      title: "图片显示",
      show: false,
      id: null
    },
    audioModel: {
      visible: false,
      path: null
    },
    showOpCard: false,
    isShowXBGDField: false,
    showOtherField: false,
    enableHSEType: false,
  };
  //Vue组件
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
  var detail = LIB.Vue.extend({
    template: tpl,
    props: ['baseData'],
    mixins: [LIB.VueMixin.dataDic],
    data: function () {
      return dataModel;
    },
    computed: {
      sourceType: function () {
        return this.mainModel.vo != null ? LIB.getDataDic("pool_sourceType", this.mainModel.vo.sourceType) : "";
      },
      specialtyText: function () {
        return this.getDataDic('specialty', this.mainModel.vo.specialty);
      },
      showLink: function () { //来源是否显示链接
        return this.mainModel.vo.sourceType == 1 || this.mainModel.vo.sourceType == 2 || this.mainModel.vo.sourceType == 4 || this.mainModel.vo.sourceType == 5;
      },
      riskJudgementTypeName: function () {
        var _this = this;
        var list = [].concat(LIB.getDataDicList('pool_low_risk'), LIB.getDataDicList('pool_medium_risk'), LIB.getDataDicList('pool_high_risk'));
        var obj = _.find(list, function (item) {
          return item.id == _this.mainModel.vo.riskJudgementType
        });
        if (obj) {
          return obj.value;
        }
        return ''
      }
    },
    watch: {
      "baseData": function () {
        this.initData();
      }
    },
    methods: {
      doClose: function () {
        this.$dispatch("ev_detailColsed");
        LIB.Msg.info("关闭");
      },
      doViewSource: function () {
        if (_.isEmpty(this.mainModel.vo.sourceId)) {
          return;
        }
        var router = LIB.ctxPath("/html/main.html#!");
        if (this.mainModel.vo.sourceType == 1) { //跳转到检查记录
          //根据sourceId查询
          api.getCheckRecordBySourceId({
            detailId: this.mainModel.vo.sourceId
          }).then(function (res) {
            var data = res.data;
            if (!!data) {
              if (data.type == 1) {
                if (!!data.checkTask) {
                  var routerPart = "/hiddenDanger/businessCenter/checkRecord?method=detail&id=" + data.checkTask.groupId;
                  window.open(router + routerPart);
                }
              } else {
                var routerPart = "/randomInspection/businessCenter/notPlanCheckRecord?method=detail&id=" + res.data.id + "&code=" + res.data.code;
                window.open(router + routerPart);
              }
            } else {
              LIB.Msg.warning("未找到相关记录，可能已被删除");
            }
          });
        } else if (this.mainModel.vo.sourceType == 2) { //跳转到随手拍记录
          api.getRadomObser({
            id: this.mainModel.vo.sourceId
          }).then(function (res) {
            if (!!res.data) {
              var routerPart = "/randomObserve/businessCenter/total?method=detail&id=" + res.data.id + "&code=" + res.data.code;
              window.open(router + routerPart);
            } else {
              LIB.Msg.warning("未找到相关记录，可能已被删除");
            }
          });
        } else if (this.mainModel.vo.sourceType == 4) { //跳转到巡检记录
          api.getRiCheckRecordBySourceId({
            detailId: this.mainModel.vo.sourceId
          }).then(function (res) {
            if (!!res.data) {
              if (res.data.type === '1') {
                var routerPart = "/routingInspection/businessCenter/riTemporaryCheckRecord?method=detail&id=" + res.data.id + "&code=" + res.data.code;
              } else if (res.data.type === '2') {
                var routerPart = "/routingInspection/businessCenter/riCheckRecord?method=detail&id=" + res.data.id + "&code=" + res.data.code;
              }
              window.open(router + routerPart);
            } else {
              LIB.Msg.warning("未找到相关记录，可能已被删除");
            }
          });
        } else if (this.mainModel.vo.sourceType == 5) { //跳转到临时工作记录
          api.getRiTmpCheckRecordBySourceId({
            detailId: this.mainModel.vo.sourceId
          }).then(function (res) {
            if (!!res.data) {
              var routerPart = "/routingInspection/businessCenter/tmpCheckRecord?method=detail&id=" + res.data.id + "&code=" + res.data.code;
              window.open(router + routerPart);
            } else {
              LIB.Msg.warning("未找到相关记录，可能已被删除");
            }
          });
        }
      },
      initData: function () {
        var _this = this;
        this.isShowXBGDField = LIB.getBusinessSetStateByNamePath('poolGovern.isShowXBGDField');
        this.baseData.pictures = this.baseData.pictures.slice();

        this.mainModel.vo.reform = {
          unFinishedDesc: null,
          completionDesc: null,
          afterPreventive: null
        };
        if (this.baseData) {
          //封装数据
          // this.mainModel.vo = this.baseData;
          _.extend(this.mainModel.vo, this.baseData);
          if (this.baseData.reforms) {
            this.mainModel.vo.reform = this.baseData.reforms[0];
          }
        }
        // api.getShowSpecialtyConfig().then(function (res) {
        //     var result = _.get(res, "data.result", '1');
        //     _this.showOpCard = (result === '2');
        // })

        this.showOpCard = LIB.getBusinessSetStateByNamePath('poolGovern.showOpCard');
        this.showOtherField = LIB.getBusinessSetStateByNamePath('poolGovern.showOtherField');
        this.enableHSEType = LIB.getBusinessSetStateByNamePath("radomObserSet.enableHSEType");
        if (this.baseData.sourceType == 0) {
          api.getViolation({
            relId: this.baseData.id,
            relType: 0
          }).then(function (res) {
            _this.mainModel.vo.legalRegulation = _.get(res, "data[0].legalRegulation", {});
          })
        } else if (this.baseData.sourceType == 1) {
          api.getViolation({
            relId: this.baseData.sourceId,
            relType: 1
          }).then(function (res) {
            _this.mainModel.vo.legalRegulation = _.get(res, "data[0].legalRegulation", {});
          })
        } else if (this.baseData.sourceType == 2) {
          api.getViolation({
            relId: this.baseData.sourceId,
            relType: 2
          }).then(function (res) {
            _this.mainModel.vo.legalRegulation = _.get(res, "data[0].legalRegulation", {});
          })
        }
      },
      doPlay: function (video) {
        this.playModel.show = true;
        setTimeout(function () {
          videoHelper.create("player", video);
        }, 50);
      },
      convertPath: LIB.convertPath,
      doPlayAudio: function (path) {
        this.audioModel.path = path;
        this.audioModel.visible = true;
      },
      _getFormConfig: function () {
        this.mainModel.enableDiscoveryChannel = LIB.getBusinessSetStateByNamePath("poolGovern.enableDiscoveryChannel");
      },
    },
    ready: function () {
      this.initData();
      this._getFormConfig()
    }

  });

  return detail;
});