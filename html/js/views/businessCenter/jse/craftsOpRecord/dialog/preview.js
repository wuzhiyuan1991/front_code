define(function (require) {
  var LIB = require('lib');
  var api = require("../vuex/api");
  //右侧滑出详细页
  var tpl = require("text!./preview.html");

  //Vue数据
  var dataModel = {
    vo: null,
    items: null,
    auditorSignatures: [],
    operatorSignatures: [],
    supervisorSignatures: [],
    operatorSignFileMap: {},
    craftsProcesses: [],
  };
  //Vue组件
  /**
   *  请统一使用以下顺序配置Vue参数，方便codeview
   *	 el
   template
   components
   componentName
   props
   data
   computed
   watch
   methods
   _XXX    			//内部方法
   doXXX 				//事件响应方法
   beforeInit 		//初始化之前回调
   afterInit			//初始化之后回调
   afterInitData		//请求 查询 接口后回调
   afterInitFileData  //请求 查询文件列表 接口后回调
   beforeDoSave		//请求 新增/更新 接口前回调，返回false时不进行保存操作
   afterFormValidate	//表单rule的校验通过后回调，，返回false时不进行保存操作
   buildSaveData		//请求 新增/更新 接口前回调，重新构造接口的参数
   afterDoSave		//请求 新增/更新 接口后回调
   beforeDoDelete		//请求 删除 接口前回调
   afterDoDelete		//请求 删除 接口后回调
   events
   vue组件声明周期方法
   init/created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
   **/
  var detail = LIB.Vue.extend({
    mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
    template: tpl,
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      id: {
        type: String,
        default: ''
      }
    },
    data: function () {
      return dataModel;
    },
    watch: {
      visible: function (val) {
        if (val && this.id) {
          this._init();
        }
      }
    },
    computed: {
      orgName: function () {
        return this.getDataDic('org', this.vo.orgId)['deptName'];
      }
    },
    methods: {
      calcClass: function (item) {
        if (item.isGroup) {
          return "font-bold";
        }
        return "";
      },
      doClose: function () {
        this.visible = false;
      },
      doPrint: function () {
        window.print();
      },
      _init: function () {
        this.auditorSignatures = [];
        this.operatorSignatures = [];
        this.supervisorSignatures = [];
        this.operatorSignFileMap = {};
        this._getVO();
      },
      _getVO: function () {
        var _this = this;
        _this.vo = {};
        api.get({
          id: this.id
        }).then(function (res) {
          if (res.data) {
            _this.vo = res.data;
            if (res.data.publishTime) {
              _this.vo.firstLineDate = new Date(res.data.publishTime).Format("yyyy年MM月dd日");
            }
            if (_this.vo.opTaskUserRels) {
              _this._getSignature();
            }
            _this._getItems();
            _this.getCraftsProcesses();
          }
        })
      },
      getCraftsProcesses: function () {
        var _this = this;
        api.queryOpCraftsProcesses({
          pageNo: 1,
          pageSize: 999,
          id: this.id
        }).then(function (res) {
          _this.craftsProcesses = res.data.list || [{}];
          while (_this.craftsProcesses.length < 4) {
            _this.craftsProcesses.push({});
          }
        });
      },
      _getItems: function () {
        var _this = this;
        this.items = null;
        api.getGroupAndItem({
          id: this.id
        }).then(function (res) {
          var groups = _.map(res.data.OpTaskStep, function (item) {
            return {
              id: item.id,
              name: item.name,
              orderNo: item.orderNo
            }
          });
          var items = _.map(res.data.OpTaskStepItem, function (item) {
            return {
              stepId: item.stepId,
              orderNo: item.orderNo,
              risk: item.risk && item.risk.replace(/[\r\n]/g, '<br/>'),
              content: item.content && item.content.replace(/[\r\n]/g, '<br/>'),
              operatorId: item.operatorId,
              operateTime: item.operateTime ? new Date(item.operateTime).Format("hh时mm分") : ""
            }
          });
          _this._convertData(groups, items);
        })
      },
      _getSignature: function () {
        var _this = this;
        var recordIdUserIdMap = {}; //附件id和用户id的对应关系
        var recordIds = _.map(this.vo.opTaskUserRels, function (rel) {
          recordIdUserIdMap[rel.id] = rel.userId; //附件id取的是任务与用户关联关系的id
          return rel.id;
        });
        var operatorIdFilesMap = {}; //用户id与操作人签名文件的对应关系
        api.listFile({
          'criteria.strsValue': JSON.stringify({
            recordId: recordIds
          })
        }).then(function (res) {
          _.each(res.data, function (pic) {
            if (pic.dataType === "X33") { //审核人签名
              _this.auditorSignatures.push(LIB.convertPicPath(pic.id, 'scale'));
            } else if (pic.dataType === "X4") { //操作人签名
              var userId = recordIdUserIdMap[pic.recordId];
              var files = [LIB.convertPicPath(pic.id, 'scale')];
              operatorIdFilesMap[userId] = files;
              _this.operatorSignatures.push(LIB.convertPicPath(pic.id, 'scale'));
            } else if (pic.dataType === "X5") { //监护人签名
              _this.supervisorSignatures.push(LIB.convertPicPath(pic.id, 'scale'));
            }
          });
          _this.operatorSignFileMap = operatorIdFilesMap;
        });
      },
      getOperatorSignFiles: function (operatorId) {
        if (!operatorId) {
          return [];
        }
        return this.operatorSignFileMap[operatorId];
      },
      _convertData: function (groups, items) {
        // 组按orderNo排序
        var _groups = _.sortBy(groups, function (group) {
          return parseInt(group.orderNo);
        });
        // 项按stepId分组
        var _items = _.groupBy(items, "stepId");
        // 项按orderNo排序, 并将项添加到对应的组中
        _.forEach(_groups, function (group) {
          group.items = _.sortBy(_items[group.id], function (item) {
            return parseInt(item.orderNo);
          });
        });
        var data = [];
        _.forEach(_groups, function (group) {
          data.push({
            content: group.name,
            isGroup: true
          });
          data = data.concat(group.items);
        });
        this.items = data;
      }
    },
    events: {},
    init: function () {
      this.$api = api;
    }
  });

  return detail;
});