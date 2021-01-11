define(function (require) {
  var LIB = require('lib');
  var api = require("./vuex/api");
  //右侧滑出详细页
  var tpl = require("text!./detail-xl.html");
  var courseSelectModal = require("componentsEx/selectTableModal/courseSelectModal");
  // var userSelectModal = require("componentsEx/selectTableModal/userWithLatestTaskSelectModal");
  /*	var examPaperSelectModal = require("componentsEx/selectTableModal/examPaperSelectModal");*/
  var userSelectModal = require("./dialog/userSelect");
  var certFormModal = require("./dialog/certFormModal");
  var curUser = null;
  var curUserCached = false;
  //选择知识点
  require("componentsEx/selectTableModal/examPaperSelectModal");
  //初始化数据模型
  var newVO = function () {
    return {
      //培训计划id
      id: null,
      //
      compId: null,
      //培训结束时间
      endTime: null,
      //备注
      remarks: null,
      //培训开始时间
      startTime: null,
      //状态 0未发布,1已发布,2已取消
      status: 0,
      //修改日期
      modifyDate: null,
      //创建日期
      createDate: null,
      //对应课程
      course: {
        id: null,
        name: ''
      },
      //考试计划
      exam: {
        id: null,
        examDate: null,
        entryDeadline: null,
        passLine: null,
        examPaper: {
          id: null,
          name: '',
          score: 0
        }
      },
      //培训人员
      trainTasks: [],
      //是否结束
      isOver: false,
      publisher: null,
    }
  };
  var now = new Date();
  var beginDate = now.Format("yyyy-MM-dd 00:00:00");

  var baseColumns = [{
      title: "姓名",
      fieldName: "user.name",
      keywordFilterName: "criteria.strValue.keyWordValue_name"
    },
    {
      title: "所属公司",
      fieldType: "custom",
      render: function (data) {
        if (data.compId) {
          return LIB.getDataDic("org", data.user.compId)["compName"];
        }
      },
      keywordFilterName: "criteria.strValue.keyWordValue_comp"
    },
    {
      title: "所属部门",
      fieldType: "custom",
      render: function (data) {
        if (data.orgId) {
          return LIB.getDataDic("org", data.user.orgId)["deptName"];
        }
      },
      keywordFilterName: "criteria.strValue.keyWordValue_org"
    },
    {
      title: "岗位",
      fieldType: "custom",
      render: function (data) {
        if (_.propertyOf(data.user)("positionList")) {
          var posNames = "";
          data.user.positionList.forEach(function (e) {
            if (e.postType == 0) {
              posNames += (e.name + "/");
            }
          });
          posNames = posNames.substr(0, posNames.length - 1);
          return posNames;

        }
      },
      keywordFilterName: "criteria.strValue.keyWordValue_position"
    },
    {
      title: "安全角色",
      fieldType: "custom",
      render: function (data) {
        if (_.propertyOf(data.user)("positionList")) {
          var roleNames = "";
          data.user.positionList.forEach(function (e) {
            if (e.postType == 1) {
              roleNames += (e.name + "/");
            }
          });
          roleNames = roleNames.substr(0, roleNames.length - 1);
          return roleNames;

        }
      },
      keywordFilterName: "criteria.strValue.keyWordValue_position"
    },
    {
      //title : "任务类型",
      title: "任务类型",
      fieldType: "custom",
      filterType: "enum",
      dataDicKey: "train_task_type",
      render: function (data) {
        return LIB.getDataDic("train_task_type", data.source);
      },
      keywordFilterName: "criteria.intsValue.keyWordValue_source",
      width: 160
    }
  ];

  var toolColumns = [{
    title: "",
    render: function () {
      return '<a href="javascript:void(0);" data-action="REMOVEUSER"><i class="ivu-icon ivu-icon-trash-a" data-action="REMOVEUSER"></i></a>'
    },
    width: 60
  }];

  var resultColumns = [{
      title: "完成进度",
      fieldType: "custom",
      render: function (data) {
        return data.percent + "%";
      },
      width: 100
    },
    {
      title: "考试交卷时间",
      fieldName: "examSchedule.startTime",
      width: 140
    },
    {
      title: "考试得分",
      fieldName: "custom",
      render: function (data) {
        if (data.score) {
          return parseInt(data.score) + "分";
        } else if (!!data.examSchedule && data.examSchedule.status == 2) {
          return "0分";
        }
      },
      width: 100
    },
    {
      title: "培训结果",
      fieldType: "custom",
      render: function (data) {
        var status = data.status;
        if (data.course.type == 1 && data.status == 2 && data.endTime < data.trainDate) {
          status = '7';
        }
        if (data.course.type == 1 && data.status == 0 && new Date(data.endTime).getTime() < new Date().getTime()) {
          status = '6';
        }

        var item = LIB.getDataDic('train_task_result', status);

        if (status == 2 || status == 7) {
          return "<span style='color:#009900'>" + item + "</span>"
        } else if (status == 1 || status == 3) {
          return "<span style='color:red'>" + item + "</span>"
        } else {
          return "<span style='color:#8c6666'>" + item + "</span>"
        }

      },
      tipRender: function (data) {
        var item = LIB.getDataDic('train_task_result', data.status);
        return item
      },
      width: 150
    }
  ];

  var certificateColumn = [{
    title: "证书",
    render: function (data) {
      if (_.includes(['2', '7'], data.status)) {
        return '<a href="javascript:void(0);" data-action="SETCERTIFICATE">添加证书</a>'
      } else {
        return '';
      }
    }
  }];
  //Vue数据
  var dataModel = {
    mainModel: {
      vo: newVO(),
      opType: 'view',
      isReadOnly: true,
      title: "",

      //验证规则
      rules: {
        "course.id": [{
          required: true,
          message: '请选择课程'
        }],
        "startTime": [{
          required: true,
          message: '请输入开始时间'
        }],
        "endTime": [{
          required: true,
          message: '请输入结束时间'
        }],

        "compId": [{
          required: true,
          message: '请选择所属公司'
        }],
        "exam.examDate": [{
          validator: function (rule, value, callback) {
            if (!!dataModel.mainModel.vo.exam.examPaper.id) {
              if (!!value) {
                var start = new Date(),
                  end = new Date(value);
                if (end <= start) {
                  return callback(new Error("允许考试时间（开始）要大于当前时间"))
                }
                return callback()
              } else {
                return callback(new Error('请输入允许考试时间（开始）'));
              }
            } else {
              return callback();
            }

          }
        }],
        "exam.entryDeadline": [{
          validator: function (rule, value, callback) {
            if (!!dataModel.mainModel.vo.exam.examPaper.id) {
              if (!!value) {
                var start = new Date(),
                  end = new Date(value);
                var examDate = dataModel.mainModel.vo.exam.examDate;
                if (end <= start) {
                  return callback(new Error("允许考试时间（开始）要大于当前时间"))
                } else if (value <= examDate) {
                  return callback(new Error('允许考试时间（结束）要大于允许考试时间（开始）'));
                } else {
                  callback();
                }
              } else {
                return callback(new Error('请输入允许考试时间（结束）'));
              }
            } else {
              return callback();
            }

          }
        }],
        "exam.passLine": [LIB.formRuleMgr.length(),
          {
            validator: function (rule, value, callback) {
              if (!!dataModel.mainModel.vo.exam.examPaper.id) {
                if (value != null) {
                  if (value <= 0) {
                    return callback(new Error('通过分数必须大于0'));
                  }
                  return parseFloat(value) > dataModel.mainModel.vo.exam.examPaper.score ? callback(new Error('通过分数不能大于试卷总分')) : callback();
                } else {
                  return callback(new Error('请输入通过分数'));
                }

              } else {
                return callback();
              }

            }
          }
        ],
        "remarks": [LIB.formRuleMgr.length()],
      },
      emptyRules: {},
      now: (now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate())

    },
    tableModel: {
      userTableModel: {
        url: "trainplan/traintasks/list/{curPage}/{pageSize}",
        columns: [{
            title: "姓名",
            fieldName: "user.name",
            keywordFilterName: "criteria.strValue.keyWordValue_name"
          },
          {
            title: "所属公司",
            fieldType: "custom",
            render: function (data) {
              if (data.compId) {
                return LIB.getDataDic("org", data.user.compId)["compName"];
              }
            },
            keywordFilterName: "criteria.strValue.keyWordValue_comp"
          },
          {
            title: "所属部门",
            fieldType: "custom",
            render: function (data) {
              if (data.orgId) {
                return LIB.getDataDic("org", data.user.orgId)["deptName"];
              }
            },
            keywordFilterName: "criteria.strValue.keyWordValue_org"
          },
          {
            title: "岗位",
            fieldType: "custom",
            render: function (data) {
              if (_.propertyOf(data.user)("positionList")) {
                var posNames = "";
                data.user.positionList.forEach(function (e) {
                  if (e.postType == 0) {
                    posNames += (e.name + "/");
                  }
                });
                posNames = posNames.substr(0, posNames.length - 1);
                return posNames;

              }
            },
            keywordFilterName: "criteria.strValue.keyWordValue_position"
          },
          {
            title: "安全角色",
            fieldType: "custom",
            render: function (data) {
              if (_.propertyOf(data.user)("positionList")) {
                var roleNames = "";
                data.user.positionList.forEach(function (e) {
                  if (e.postType == 1) {
                    roleNames += (e.name + "/");
                  }
                });
                roleNames = roleNames.substr(0, roleNames.length - 1);
                return roleNames;

              }
            },
            keywordFilterName: "criteria.strValue.keyWordValue_position"
          },
          {
            //title : "任务类型",
            title: "任务类型",
            fieldType: "custom",
            filterType: "enum",
            dataDicKey: "train_task_type",
            render: function (data) {
              return LIB.getDataDic("train_task_type", data.source);
            },
            keywordFilterName: "criteria.intsValue.keyWordValue_source",
            width: 160
          },
          {
            title: "",
            fieldType: "tool",
            toolType: "del"
          }
        ],
        defaultFilterValue: {
          "criteria.intValue": {
            includeDisableUser: '0'
          }
        }
      }
    },
    formModel: {
      certFormModel: {
        show: false,
        queryUrl: "cert/{id}"
      }
    },
    cardModel: {
      userCardModel: {
        showContent: true
      }
    },
    selectModel: {
      courseSelectModel: {
        visible: false,
        filterData: {
          orgId: null
        }
      },
      examPaperSelectModel: {
        visible: false,
        filterData: {
          orgId: null
        }
      },
      userSelectModel: {
        visible: false,
        filterData: {
          orgId: null
        }
      }
    },
    beginDate: beginDate,
    tabs: [{
        id: 'all',
        name: '全部'
      },
      {
        id: '0',
        name: '培训中'
      },
      {
        id: '6',
        name: '培训中（逾期）'
      },
      {
        id: '2',
        name: '通过'
      },
      {
        id: '7',
        name: '通过（逾期）'
      },
      {
        id: '1',
        name: '未通过'
      }
    ],
    currentTabId: 'all',
    leaveWorkerSwitch: false
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
    mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.detailPanel],
    template: tpl,
    components: {
      "courseSelectModal": courseSelectModal,
      /*	"exampaperSelectModal":examPaperSelectModal,*/
      "userSelectModal": userSelectModal,
      "certFormModal": certFormModal
    },
    data: function () {
      return dataModel;
    },
    computed: {
      "scoreLabel": function () {
        var label = "通过分数";
        if (this.mainModel.vo.exam.examPaper.score) {
          label += "(总分: " + this.mainModel.vo.exam.examPaper.score + ")"
        }
        return label;
      },
      hasExam: function () {
        return !!_.get(this.mainModel.vo, "exam.examPaper.id");
      },
      hasCourseSelected: function () {
        return !!_.get(this.mainModel.vo, "course.id");
      }
    },
    watch: {
      'mainModel.vo.exam.entryDeadline': function (val, oldVal) {
        if (this.hasExam && !!val) {
          var examDate = new Date(this.mainModel.vo.exam.entryDeadline);
          var replayTime = parseInt(this.mainModel.vo.exam.examPaper.replyTime) + 10;
          examDate.setMinutes(examDate.getMinutes() + replayTime);
          this.mainModel.vo.endTime = examDate.Format("yyyy-MM-dd hh:mm:ss");
        }
      },
      'leaveWorkerSwitch': function (value) {
        var query = {}
        query['criteria.intValue.includeDisableUser'] = value ? '1' : '0'
        this.$refs.userTable.doQuery(query)
      }
    },
    methods: {
      newVO: newVO,
      doTabClick: function (id) {
        this.currentTabId = id;
        var params = [{
          type: "save",
          value: {
            columnFilterName: "id",
            columnFilterValue: this.mainModel.vo.id
          }
        }];

        if (id !== 'all') {
          params.push({
            type: "save",
            value: {
              columnFilterName: "criteria.intsValue.status",
              columnFilterValue: [id]
            }
          })
        }

        this.$refs.userTable.doCleanRefresh(params);
      },
      doShowCertFormModal4Create: function (data) {
        this.formModel.certFormModel.show = true;
        this.$refs.certFormModal.init(data);
      },
      doSaveCert: function (data) {
        this.formModel.certFormModel.show = false;
        this.$refs.userTable.doRefresh();
      },
      clickedTableRow: function (data) {
        var el = data.event.target;
        var action = _.get(el, "dataset.action");
        if (action === 'REMOVEUSER') {
          this.doRemoveTrainTasks(data.entry.data)
        } else if (action === 'SETCERTIFICATE') {
          this.doShowCertFormModal4Create(data.entry.data);
        }
      },
      doPreview: function (data) {
        window.open(LIB.ctxPath("/front/exampaper/preview/" + data[0].id));
      },
      doComptime: function (beginTime, endTime) {
        var beginTimes = beginTime.substring(0, 10).split('-');
        var endTimes = endTime.substring(0, 10).split('-');
        beginTime = beginTimes[1] + '-' + beginTimes[2] + '-' + beginTimes[0] + ' ' + beginTime.substring(10, 19);
        endTime = endTimes[1] + '-' + endTimes[2] + '-' + endTimes[0] + ' ' + endTime.substring(10, 19);
        var time = (Date.parse(endTime) - Date.parse(beginTime)) / 3600 / 1000;
        return time;
      },
      doShowCourseSelectModal: function () {
        this.selectModel.courseSelectModel.visible = true;
        this.selectModel.courseSelectModel.filterData = {
          disable: 0,
          "criteria.intsValue.type": [1]
        };
      },
      doSaveCourse: function (selectedDatas) {
        if (selectedDatas) {
          this.mainModel.vo.course.id = selectedDatas[0].id;
          this.mainModel.vo.course.name = selectedDatas[0].name;
          this.doClearInput();
        }
      },
      doShowExamPaperSelectModal: function () {
        this.selectModel.examPaperSelectModel.visible = true;
        this.selectModel.examPaperSelectModel.filterData = {
          'course.id': this.mainModel.vo.course.id,
          type: 3,
          'criteria.intValue': {
            selectWithQuestion: 1
          }
        };
      },
      doSaveExamPaper: function (selectedDatas) {
        if (selectedDatas) {
          this.mainModel.vo.exam.paperId = selectedDatas[0].id;
          this.mainModel.vo.exam.examPaper.id = selectedDatas[0].id;
          this.mainModel.vo.exam.examPaper.name = selectedDatas[0].name;
          this.mainModel.vo.exam.examPaper.score = selectedDatas[0].score;
          this.mainModel.vo.exam.examPaper.replyTime = selectedDatas[0].replyTime;
        }
      },
      doShowUserSelectModal: function () {
        this.selectModel.userSelectModel.visible = true;
        this.selectModel.userSelectModel.filterData = {
          orgId: LIB.user.orgId,
          courseId: this.mainModel.vo.course.id
        };
      },
      doSaveTrainTasks: function (selectedDatas) {
        if (selectedDatas) {
          var _this = this;
          //					dataModel.mainModel.vo.users = selectedDatas;
          var param = _.map(selectedDatas, function (data) {
            return {
              user: {
                id: data.id
              },
              orgId: data.orgId,
              compId: data.compId
            }
          });

          api.saveTrainTasks({
            id: dataModel.mainModel.vo.id
          }, param).then(function (res) {
            if (!!res && !!res.data) {
              if (!!res.data.id) {
                _this.mainModel.vo.id = res.data.id;
              }
              if (!!res.data.examId) {
                _this.mainModel.vo.exam.id = res.data.examId;
              }
            }
            if (_this.mainModel.vo.status == 2) {
              _this.mainModel.vo.status = '0';
            }
            _this.$refs.userTable.doQuery({
              id: _this.mainModel.vo.id
            });
            _this.$dispatch("ev_dtUpdate");
          });
        }
      },
      doRemoveTrainTasks: function (data) {
        if (this.mainModel.vo.status == 1) {
          LIB.Msg.warning("计划已发布，无法删除人员！");
          return;
        }
        var _this = this;
        api.removeTrainTasks({
          id: this.mainModel.vo.id
        }, [{
          id: data.id,
          userId: data.userId
        }]).then(function (res) {
          LIB.Msg.success("删除成功");
          if (!!res && !!res.data) {
            if (!!res.data.id) {
              _this.mainModel.vo.id = res.data.id;
            }
            if (!!res.data.examId) {
              _this.mainModel.vo.exam.id = res.data.examId;
            }
          }
          if (_this.mainModel.vo.status == 2) {
            _this.mainModel.vo.status = '0';
          }
          _this.$refs.userTable.doQuery({
            id: _this.mainModel.vo.id
          });
          _this.mainModel.vo.trainNum -= 1;
          _this.$dispatch("ev_dtUpdate");
        });
      },
      doPublish: function () {
        var _this = this;
        LIB.Modal.confirm({
          title: '确定发布?',
          onOk: function () {
            api.publish({
              id: _this.mainModel.vo.id
            }).then(function (res) {
              LIB.Msg.success("发布成功");
              _this.mainModel.vo.status = '1';
              _this.mainModel.vo.publisher = {
                username: LIB.user.username
              };
              _this.afterDoSave({
                type: "U"
              });
              _this.changeView("view");
              _this.$dispatch("ev_dtUpdate");
              //_this.isShowLastColumn();
            })
          }
        });
      },
      //取消发布
      doCancelPublish: function () {
        var _this = this;
        LIB.Modal.confirm({
          title: '确定取消发布此计划?',
          onOk: function () {
            if (_this.mainModel.vo.status != 1) {
              LIB.Msg.warning("【未发布/已取消】状态不能取消!");
            } else if (_this.mainModel.vo.isOver) {
              LIB.Msg.warning("培训已结束不能取消,请重新选择!");
            } else {
              api.cancelPublish({
                id: _this.mainModel.vo.id,
                orgId: _this.mainModel.vo.orgId
              }).then(function (res) {
                _this.mainModel.vo.status = "2";
                _this.mainModel.vo.publisher = null;
                LIB.Msg.info("取消成功!");
                _this.afterDoSave({
                  type: "U"
                });
                _this.changeView("view");
                _this.$dispatch("ev_dtUpdate");
                //_this.isShowLastColumn();

              });
            }
          }
        });
      },
      _setTableColumns: function () {
        var status = this.mainModel.vo.status;
        var columns;
        if (status === '1') {
          columns = baseColumns.concat(resultColumns);
          if (_.get(this.mainModel.vo, "course.isCertRequired") === '1' && this.hasAuth('addCert')) {
            columns = columns.concat(certificateColumn);
          }
        } else {
          columns = baseColumns.concat(toolColumns);
        }
        // this.$refs.userTable.refreshColumns();
        this.tableModel.userTableModel.columns = columns;
      },
      afterInit: function () {
        this.currentTabId = 'all';
      },
      afterInitData: function () {
        //如果计划已发布隐藏最后一列tool操作列
        this._setTableColumns();
        var params = [{
          type: "save",
          value: {
            columnFilterName: "id",
            columnFilterValue: this.mainModel.vo.id
          }
        }];
        this.$refs.userTable.doCleanRefresh(params);
        if (this.leaveWorkerSwitch) {
                    this.leaveWorkerSwitch =false
                }
      },
      beforeInit: function () {
        this.$refs.userTable.doClearData();
      },
      doClearInput: function () {
        this.mainModel.vo.exam.examPaper.id = null;
        this.mainModel.vo.exam.examPaper.name = null;
        this.mainModel.vo.exam.examPaper.score = null;
        this.mainModel.vo.exam.examDate = null;
        this.mainModel.vo.exam.passLine = null;
        this.mainModel.vo.exam.paperId = null;
        this.mainModel.vo.exam.entryDeadline = '';
        //this.mainModel.vo.user = {id:null,name:null};
      },
      beforeDoDelete: function () {
        this.mainModel.vo.exam.trainPlan = null;
      },
      doDelete: function () {

        //当beforeDoDelete方法明确返回false时,不继续执行doDelete方法, 返回undefine和true都会执行后续方法
        if (this.beforeDoDelete() === false) {
          return;
        }

        var _vo = this.mainModel.vo;
        var _this = this;
        LIB.Modal.confirm({
          title: '删除当前数据?',
          onOk: function () {
            _this.$api.remove(null, {
              id: _vo.id,
              orgId: _vo.orgId
            }).then(function () {
              _this.afterDoDelete(_vo);
              _this.$dispatch("ev_dtDelete");
              LIB.Msg.info("删除成功");
            });
          }
        });
      },
      afterFormValidate: function () {
        this.mainModel.vo.exam.trainPlan = null;
        this.mainModel.vo.exam.examSchedules = null;
        this.mainModel.vo.trainNum = null;
        //因为有时分秒 所以判断一下结束时间是否小于开始时间
        var endTime = this.doComptime(this.mainModel.vo.startTime, this.mainModel.vo.endTime);
        if (endTime < 0) {
          LIB.Msg.warning("结束时间不能少于开始时间");
          return false;
        }
        if (this.mainModel.vo.exam.examDate) {
          //判断考试时间是否小于开始时间
          var examStarTime = this.doComptime(this.mainModel.vo.startTime, this.mainModel.vo.exam.examDate);
          if (examStarTime < 0) {
            LIB.Msg.warning("考试时间不能少于开始时间");
            return false;
          }
          //判断考试时间是否大于结束时间
          var examEndTime = this.doComptime(this.mainModel.vo.exam.examDate, this.mainModel.vo.endTime);
          if (examEndTime < 0) {
            LIB.Msg.warning("考试时间不能大于结束时间");
            return false;

          }
        }
        return true;
      },
      afterDoSave: function (opt, res) {
        if (!!res) {
          if (!!res.id) {
            this.mainModel.vo.status = '0';
            this.mainModel.vo.id = res.id;
          }
          if (!!res.examId) {
            this.mainModel.vo.exam.id = res.examId;
          }
          this.$refs.userTable.doQuery({
            id: res.id
          });
        }

      }
    },
    init: function () {
      this.$api = api;
    },
    ready: function () {}
  });

  return detail;
});