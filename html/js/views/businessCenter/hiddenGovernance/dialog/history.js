define(function (require) {
  var LIB = require('lib');
  var Vue = require('vue');
  var api = require("../vuex/api");
  var videoHelper = require("tools/videoHelper");
  //右侧滑出详细页
  var tpl = require("text!./history.html");
  //初始化数据模型
  var newVO = function () {
    return {
      desps: []
    }
  };
  var tasks = [
    'shen_pi', // 审批
    'zhi_pai', // 指派
    'zheng_gai', // 整改
    'yan_zheng', // 验证
    'wei_tuo', //委托
    'deng_ji', //登记
  ];
  //Vue数据
  var dataModel = {
    mainModel: {
      vo: newVO(),
      enableRespOrgId: false
    },
    items: [],
    playModel: {
      title: "视频播放",
      show: false,
      id: null
    },
    picModel: {
      title: "图片显示",
      show: false,
      file: null
    },
    audioModel: {
      visible: false,
      path: null
    }
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
    data: function () {
      return dataModel;
    },
    props: {
      poolId: {
        type: String,
        default: ''
      }
    },
    methods: {
      doClose: function () {
        this.$dispatch("ev_detailColsed");
        LIB.Msg.info("关闭");
      },
      _buildBriefUser: function (users) {
        if (!_.isArray(users) || users.length === 0) {
          return '';
        }
        if (users.length === 1) {
          return users[0].name;
        }
        return users[0].name + '...';
      },
      _buildUsers: function (users) {
        if (!_.isArray(users)) {
          return '';
        }
        return _.pluck(users, 'name').join(",");
      },
      _isShowIcon: function (taskKey) {
        if (!taskKey) {
          return false;
        }
        return _.some(tasks, function (item) {
          return taskKey.indexOf(item) > -1;
        })
      },
      /**
       * 格式化任务的类型
       * 有些任务的taskKey可能有a_/b_等前缀, 在这里格式化
       */
      _formatTaskType: function (item) {
        if (!item.taskKey) {
          return ''
        }
        // 判断提交节点
        //if(item.desp === '提交') {
        //    return 'ti_jiao';
        //}
        // 判断委托节点
        if (item.desp === '委托') {
          return 'wei_tuo';
        }

        // 判断审批/分配/整改/验证节点
        var result = _.find(tasks, function (t) {
          return item.taskKey.indexOf(t) > -1
        });
        if (result) {
          return result;
        }
        return item.taskKey;
      },
      _buildData: function (items) {
        var _this = this;
        this.items = _.map(items, function (item) {
          return {
            hasDelegate: item.hasDelegate,
            isDelegate: item.isDelegate,
            desp: item.desp,
            reason: item.reason,
            date: item.date,
            operationName: item.operationName,
            suggestion: item.suggestion,
            briefUser: item.isDelegate ? _this._buildBriefUser(item.mandators) : _this._buildBriefUser(item.assignees), // 处理人员名称简单显示
            users: _this._buildUsers(item.assignees),
            mandators: _this._buildUsers(item.mandators),
            initialCandidates: _this._buildUsers(item.initialCandidates),
            finalCandidates: _this._buildUsers(item.finalCandidates),
            taskKey: item.taskKey,
            showIcon: _this._isShowIcon(item.taskKey),
            id: item.id,
            open: false,
            operationType: item.operationType, // 操作结果类型
            deadlineDate: item.deadlineDate, // 期限
            _taskType: _this._formatTaskType(item),
            isEnd: item.isEnd,
            needVerify: item.needVerify,
            isErpAssign: item.isErpAssign,
            secondDealCandidates: _this._buildBriefUser(item.secondDealCandidates),
            maxSecondDealDate: item.maxSecondDealDate

          }
        });
      },
      initData: function () {
        var _this = this;
        if (!this.poolId) {
          return;
        }
        this.items = [];

        api.history({
          id: this.poolId
        }).then(function (res) {
          console.log(res.data)
          _this._buildData(res.data);
        })
      },
      doScheduleClicked: function (schedule) {
        if (schedule.relType !== 'OpRecord') {
          return;
        }
        if (!schedule.relId || !schedule.relCode) {
          return;
        }
        LIB.syncHTTPRequest({
          url: '/oprecord/' + schedule.relId
        }, function (data) {
          if (!data) {
            LIB.Msg.error("记录不存在或已经删除");
          } else {
            window.open("/html/main.html#!/jse/businessCenter/opRecord?method=detail&id=" + schedule.relId + "&code=" + schedule.relCode);
          }
        })
      },
      toggleOpen: function (item) {
        var _this = this;
        var tasks = [
          'shen_pi',
          'zhi_pai',
          'zheng_gai',
          'yan_zheng',
          'wei_tuo',
          'deng_ji'
        ];
        if (!item.taskKey) {
          return;
        }
        var _isInTasks = _.some(tasks, function (t) {
          return item.taskKey.indexOf(t) > -1;
        });
        if (!_isInTasks) {
          return;
        }

        item.open = !item.open;

        if (item.hasRequested || item.taskKey.indexOf('shen_pi') > -1 || item.taskKey.indexOf('wei_tuo') > -1) {
          return;
        }
        if (item.taskKey.indexOf('deng_ji') > -1) {
          api.getRegisterInfo({
            poolId: _this.poolId
          }).then(function (res) {
            var result = res.data;
            item.hasRequested = true;
            if (result) {
              _this.appendProperty(item, result);
            }
          });
          return;
        }
        api.getHistoryItem({
          id: item.id
        }).then(function (res) {
          var result = res.data;
          item.hasRequested = true;
          if (result) {
            _this.appendProperty(item, result);
          }
        })
      },
      appendProperty: function (item, result) {
        if (item.taskKey.indexOf('deng_ji') > -1) {
          Vue.set(item, 'problem', result.problem);
          var images = _.filter(result.cloudFiles, function (item) {
            return item.dataType === 'E1'
          });
          var videos = _.filter(result.cloudFiles, function (item) {
            return item.dataType === 'E2'
          });
          var voices = _.filter(result.cloudFiles, function (item) {
            return item.dataType === 'E5'
          });
          Vue.set(item, 'images', images);
          Vue.set(item, 'videos', videos);
          Vue.set(item, 'voices', voices);
          return;
        }
        if (item.taskKey.indexOf('zhi_pai') > -1) {
          Vue.set(item, 'dealName', this._buildUsers(result.deals));
          Vue.set(item, 'maxDealDate', result.maxDealDate);
          Vue.set(item, 'accepterName', this._buildUsers(result.accepters));
          Vue.set(item, 'maxAcceptDate', result.maxAcceptDate);
          Vue.set(item, 'dealDemand', result.dealDemand);
          Vue.set(item, 'rewardNum', result.rewardNum);
          Vue.set(item, 'rewardAmount', result.rewardAmount);
          return;
        }

        if (item.taskKey.indexOf('zheng_gai') > -1) {
          var images = _.filter(result.cloudFiles, function (item) {
            return item.dataType === 'E11'
          });
          var videos = _.filter(result.cloudFiles, function (item) {
            return item.dataType === 'E12'
          });
          var docs = _.filter(result.cloudFiles, function (item) {
            return item.dataType === 'E111'
          });
          Vue.set(item, 'dealStep', result.dealStep);
          Vue.set(item, 'emergencyStep', result.emergencyStep);
          Vue.set(item, 'images', images);
          Vue.set(item, 'videos', videos);
          Vue.set(item, 'docs', docs);
          console.log(item, result)
          // console.log(result.respOrgId, LIB.getDataDic('org', result.respOrgId)['deptName'], this.mainModel.enableRespOrgId)
          Vue.set(item, 'respOrgId', LIB.getDataDic('org', result.respOrgId)['deptName'])
          try {
            Vue.set(item, 'schedule', JSON.parse(result.schedule));
          } catch (e) {
            Vue.set(item, 'schedule', []);
          }
          return;
        }

        if (item.taskKey.indexOf('yan_zheng') > -1) {
          var images = _.filter(result.cloudFiles, function (item) {
            return item.dataType === 'E21'
          });
          var videos = _.filter(result.cloudFiles, function (item) {
            return item.dataType === 'E22'
          });
          var docs = _.filter(result.cloudFiles, function (item) {
            return item.dataType === 'E211'
          });
          Vue.set(item, 'acceptRemark', result.acceptRemark);
          Vue.set(item, 'images', images);
          Vue.set(item, 'videos', videos);
          Vue.set(item, 'docs', docs);
        }
      },
      convertPath: LIB.convertPath,
      convertPicPath: LIB.convertImagePath,
      convertFilePath: function (doc) {
        return LIB.convertFilePath(LIB.convertFileData(doc));
      },
      backgroundStyle: function (file) {
        return "url(" + this.convertPicPath(LIB.convertFileData(file)) + "),url(" + LIB.ctxPath() + "/html/images/default.png)"
      },
      videoBackgroundStyle: function () {
        return "url(" + this.convertPath() + "),url(" + LIB.ctxPath() + "/html/images/default.png)"
      },
      /**
       * operationType
       * 后端返回
       * 1 无法整改 3 整改成功 4 整改受阻、验证不合格、退回个人 11 需要整改 100 验证合格 200 不存在、无需整改 201 线下协调
       * 前端自定义
       *
       */
      _operationTypeBg: function (ot) {
        var obj = {
          '1': 'hidden-cannot-rect',
          '3': 'hidden-complete-rect',
          '4': 'hidden-verify-not',
          '11': 'hidden-need-rect',
          '100': 'hidden-verify',
          '200': 'hidden-neednot-rect'
        };
        return obj[ot];
      },
      calcBackground: function (item) {

        // 判断节点是否完成
        if (!item.date) {
          return 'hidden-processing';
        }
        // 判断是否是结束节点
        if (item.isEnd) {
          return 'hidden-done';
        }

        if (item.operationName) {
          if (item.operationName == '需要整改') {
            return 'hidden-need-rect';
          } else if (item.operationName == '无需整改') {
            return 'hidden-neednot-rect';
          } else if (item.operationName == '核实通过') {
            return 'hidden-need-info-ok';
          } else if (item.operationName == '退回个人') {
            return 'hidden-block-person';
          } else if (item.operationName == '信息核实') {
            return 'hidden-need-info';
          }
        }
        if (item.taskKey.indexOf('yan_zheng') > -1 && item.operationName && item.operationName.includes('不合格')) {
          return 'hidden-verify-not';
        }

        if (item.taskKey.indexOf('yan_zheng') > -1 && item.operationName && item.operationName.includes('合格')) {
          return 'hidden-verify';
        }
        if (item.operationType === '3' && item.taskKey.indexOf('yan_zheng') > -1) {
          return '';
        }

        // 根据operationType判断
        if (item.operationType) {
          // 判断是否是整改受阻, 因为operationType = 4 有多重含义
          if (item.operationType === '4' && item.taskKey.indexOf('zheng_gai') > -1) {
            return 'hidden-block-rect'
          }
          // 退回个人
          if (item.operationType === '4' && item.taskKey.indexOf('shen_pi') > -1) {
            return 'hidden-block-rect'
          }
          // 线下协调
          if (item.operationType === '201' && item.taskKey.indexOf('shen_pi') > -1) {
            return 'hidden-xian-xia-xt'
          }
          return this._operationTypeBg(item.operationType);
        }

        // 判断是否是提交节点
        if (item.desp === '提交') {
          return 'hidden-submit';
        }

        // 判断是否是指派节点
        if (item.taskKey.indexOf('zhi_pai') > -1) {
          return 'hidden-assigned';
        }

        if (item.taskKey.indexOf('wei_tuo') > -1) {
          return 'hidden-delegate';
        }

        return '';
      },
      briefBackground: function (item) {
        if (item.open) {
          return ''
        }
        return this.calcBackground(item);
      },
      doPic: function (file, fileExt) {
        if (fileExt === 'mp4') {
          this.playModel.show = true;
          setTimeout(function () {
            videoHelper.create("player", LIB.convertFileData(file));
          }, 50);
          return;
        }
        this.picModel.show = true;
        this.picModel.file = LIB.convertFileData(file);
      },
      doPlayAudio: function (path) {
        this.audioModel.path = path;
        this.audioModel.visible = true;
      },
      _getFormConfig: function () {
        this.mainModel.enableRespOrgId = LIB.getBusinessSetStateByNamePath("poolGovern.enableRespOrgId");
        // console.log(this.mainModel.respOrgId,  this.mainModel.enableRespOrgId)
      },
    },
    watch: {
      poolId: function (nVal) {
        if (nVal) {
          this.initData()
        }
      }
    },
    ready: function () {
      // this.initData();
      this._getFormConfig()
    },
    events: {
      init: function () {
        this.initData();
      }
    }
  });

  return detail;
});