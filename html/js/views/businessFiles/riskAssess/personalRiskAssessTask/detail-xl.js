define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail-xl.html");
    var itemFormModal = require("./dialog/itemFormModal");
    var taskTableModal = require("./dialog/taskTableModal");
    var videoHelper = require("tools/videoHelper");

    var completeList = [
        {
            id: '',
            name: '全部'
        },
        {
            id: '2',
            name: '已办'
        },
        {
            id: '1',
            name: '未办'
        }
    ];
    //初始化数据模型
    var newVO = function () {
        return {
            id: null,
            //
            code: null,
            //禁用标识 0未禁用，1已禁用
            disable: "0",
            //所属公司id
            compId: null,
            //所属部门id
            orgId: null,
            //完成时间
            completeDate: null,
            //1:班组级,2:工段级,3:车间级,4:厂级,5公司级
            controlRank: null,
            //结束时间
            endDate: null,
            //1:未完成,2:已完成
            isComplete: null,
            //是否已读 0:未读,1:已读
            isRead: null,
            //开始时间
            startDate: null,
            //执行记录
            riskAssessRecord: {id: '', name: ''},
            //安全风险研判
            riskAssess: {id: '', name: ''},
            //负责人
            user: {id: '', name: '', orgId: ''},
        }
    };
    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            opType: 'view',
            isReadOnly: true,
            title: "",

            //验证规则
            rules: {}
        },
        tableModel: {
            riskAssessGroupTableModel: {
                columns: [
                    {
                        title: "研判项",
                        fieldName: "content"
                    },
                    {
                        title: "标准",
                        fieldName: "standard",
                        width: "300px"
                    },
                    {
                        title: "落实结果",
                        fieldName: "result",
                        width: "300px"
                    },
                    {
                        title: "检查情况",
                        fieldName: "checkResult",
                        width: "100px",
                        render: function (data) {
                            var o = {
                                "0": "不符合",
                                "1": "符合",
                                "2": "不涉及"
                            };
                            return data.checkResult ? o[data.checkResult] : ""
                        }
                    },
                    {
                        title: '附件',
                        render: function (data) {
                            var result = '';
                            var files = _.filter(data.cloudFiles, function (item) {
                                return !_.includes(['AQZRZ3', 'AQZRZ7', 'FXYP3'], item.dataType);
                            });
                            _.forEach(files, function (item) {
                                result += '<div class="lite-table-file-row" data-action="VIEWFILE" data-id="' + item.id + '" title="' + item.orginalName + '">' + item.orginalName +'</div>';
                            });
                            return result;
                        },
                        event: true,
                        width: "150px"
                    }
                ]
            },
            underlingModel: {
                columns: [
                    {
                        title: "人员",
                        fieldName: "user.name",
                        width: "160px"
                    },
                    {
                        title: "部门",
                        render: function (data) {
                            return LIB.getDataDic('org', data.orgId)['deptName']
                        },
                        width: "160px"
                    },
                    {
                        title: "岗位",
                        render: function (data) {
                            return _.pluck(data.positions, "name").join("、")
                        }
                    },
                    {
                        title: "完成时间",
                        fieldName: "completeDate",
                        width: "150px"
                    },
                    {
                        title: "风险数",
                        fieldName: "attr1",
                        width: "60px"
                    },
                    {
                        title: "考核任务状态",
                        render: function (data) {
                            return data.isComplete === '2' ? '<a href="javascript:;" data-action="VIEWCOMPLETE" style="color: blue;">已办</a>' : '未办'
                        },
                        event: true,
                        width: "100px"
                    }
                ]
            }
        },
        formModel: {
            itemFormModel: {
                visible: false
            },
            taskViewModel: {
                visible: false
            }
        },
        activeTabId: '1',
        cloudFiles: null,
        images: null,
        groups: null,
        tabs: [
            {
                id: '1',
                name: "明细内容"
            },
            {
                id: '2',
                name: '下属上报'
            }
        ],
        userList: null,
        checkedUserIndex: 0,
        completeList: completeList,
        checkedCompleteIndex: 0,
        currentUnderlingList: null,
        showUnderlingTable: true,
        playModel:{
            title : "视频播放",
            show : false,
            id: null
        },
        audioModel: {
            visible: false,
            path: null
        }
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
     beforeInit        //初始化之前回调
     afterInit            //初始化之后回调
     afterInitData        //请求 查询 接口后回调
     afterInitFileData  //请求 查询文件列表 接口后回调
     beforeDoSave        //请求 新增/更新 接口前回调，返回false时不进行保存操作
     afterFormValidate    //表单rule的校验通过后回调，，返回false时不进行保存操作
     buildSaveData        //请求 新增/更新 接口前回调，重新构造接口的参数
     afterDoSave        //请求 新增/更新 接口后回调
     beforeDoDelete        //请求 删除 接口前回调
     afterDoDelete        //请求 删除 接口后回调
     events
     vue组件声明周期方法
     init/created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
     **/
    var detail = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.detailPanel],
        template: tpl,
        components: {
            "itemFormModal": itemFormModal,
            "taskTableModal": taskTableModal
        },
        data: function () {
            return dataModel;
        },
        computed: {
            tableTools: function () {
                return (this.mainModel.vo.isComplete === '1' && !this.mainModel.isReadOnly) ? ["update"] : [];
            },
            displayYearText: function () {
                return this.mainModel.vo.startDate.substr(0, 16) + " ~ " + this.mainModel.vo.endDate.substr(0, 16);
            }
        },
        methods: {
            newVO: newVO,
            doExecute: function () {
                var _this = this;
                // api.getTaskList({id: this.mainModel.vo.commitmentId}).then(function (res) {
                //     var params = {
                //         group: res.data.CommitmentGroup,
                //         item: res.data.CommitmentItem
                //     };
                //     _this._normalizeGroupData(params);
                // });
                this.mainModel.isReadOnly = false;
            },
            doTabClick: function (id) {
                this.activeTabId = id;
            },
            onTaskClicked: function (item, e) {
                if(e.target.dataset && e.target.dataset.action === 'VIEWCOMPLETE') {
                    this.formModel.taskViewModel.visible = true;
                    this.$refs.taskTableModal.init(item.id)
                }
            },
            doSelectComplete: function (index) {
                this.checkedCompleteIndex = index;
                this._setCurrentTaskList();
            },
            doSelectUser: function (index) {
                this.checkedUserIndex = index;
                this._setCurrentTaskList();
            },
            _setCurrentTaskList: function () {
                var list = this.allUnderlingList;
                var c = this.completeList[this.checkedCompleteIndex];
                var u = this.userList[this.checkedUserIndex]
                if (c.id) {
                    list = _.filter(list, "isComplete", c.id)
                }
                if (u.id) {
                    list = _.filter(list, "userId", u.id)
                }
                this.currentUnderlingList = list;
            },

            doUpdateItem: function (row) {
                this.formModel.itemFormModel.visible = true;
                this.$refs.itemFormModal.init(row);
            },
            doSaveItem: function (row) {
                this.formModel.itemFormModel.visible = false;
                var group = _.find(this.groups, "id", row.groupId);
                var item = _.find(group.items, "id", row.id);
                _.extend(item, row);
            },

            _getUnderlingList: function () {
                var _this = this;
                api.getUnderlingList({userId: this.mainModel.vo.userId,riskAssessId:this.mainModel.vo.riskAssessId}).then(function (res) {
                    _this.showUnderlingTable = !_.isEmpty(res.data);
                    var users = _.map(res.data, function (item) {
                        return {
                            id: item.user.id,
                            name: item.user.name
                        }
                    });
                    _this.userList = [{id: '', name: '全部'}].concat(_.uniq(users, 'id'));

                    _this.allUnderlingList = res.data;
                    _this.currentUnderlingList = res.data;
                })
            },
            
            _getGroupList: function () {
                var _this = this;
                api.getGroupList({id: this.mainModel.vo.riskAssessId}).then(function (res) {
                    var params = {
                        group: res.data.RiskAssessGroup,
                        item: res.data.RiskAssessItem
                    };
                    _this._normalizeGroupData(params);
                })
            },
            _getRecordGroupList: function () {
                var _this = this;
                api.getRecordGroupList({id: this.mainModel.vo.id}).then(function (res) {
                    _this._normalizeGroupData(res.data);
                })
            },
            _normalizeGroupData: function (data) {
                var taskId = this.mainModel.vo.id;
                var container = this.$els.container;
                var top = container.scrollTop;
                var groups = _.map(data.group, function (item) {
                    return {
                        id: item.id,
                        name: item.name,
                        orderNo: item.orderNo
                    }
                });
                var items = _.map(data.item, function (item) {
                    return {
                        riskAssessId: item.riskAssessId,
                        riskAssessTaskId: taskId,
                        content: item.content,
                        groupId: item.groupId,
                        groupName: _.get(item, "riskAssessGroup.name"),
                        groupOrderNo: _.get(item, "riskAssessGroup.orderNo"),
                        id: item.id,
                        orderNo: item.orderNo,
                        result: item.result,
                        checkResult: item.checkResult,
                        standard: item.standard,
                        evaluate: item.evaluate,
                        cloudFiles: item.cloudFiles || []
                    }
                });
                this._convertData(groups, items);
                this.$nextTick(function () {
                    container.scrollTop = top;
                });
            },
            _convertData: function (groups, items) {
                // 组按orderNo排序
                var _groups = _.sortBy(groups, function (group) {
                    return parseInt(group.orderNo);
                });
                // 项按stepId分组
                var _items = _.groupBy(items, "groupId");
                // 项按orderNo排序, 并将项添加到对应的组中
                _.forEach(_groups, function (group) {
                    group.items = _.sortBy(_items[group.id], function (item) {
                        return parseInt(item.orderNo);
                    });
                });

                this.groups = _groups;
            },
            onRowClicked: function (item, e) {
                var el = e.target;
                var action = _.get(el, "dataset.action");
                if (action !== 'VIEWFILE') {
                    return;
                }
                var files = item.cloudFiles;
                var fileId = el.dataset.id;
                var index = _.findIndex(files, "id", fileId);

                this.doClickFile(index, files);
            },

            doClickFile: function (index, fileList) {
                var files = fileList || this.cloudFiles;
                var file = files[index];
                var _this = this;
                var images;
                // 如果是图片
                if (_.includes(['AQZRZ2', 'AQZRZ6', 'FXYP2'], file.dataType)) {

                    this.playModel.show=true;
                    setTimeout(function() {
                        videoHelper.create("player",file.id);
                    }, 50);

                } else if (_.includes(['AQZRZ4', 'AQZRZ8', 'FXYP4'], file.dataType)) {
                    this.audioModel.path = file.ctxPath;
                    this.audioModel.visible = true;
                }
                else if (_.includes(['png', 'jpg', 'jpeg'], file.ext)) {
                    images = _.filter(files, function (item) {
                        return _.includes(['png', 'jpg', 'jpeg'], item.ext) && !_.includes(['AQZRZ3', 'AQZRZ7', 'FXYP3'], item.dataType)
                    });
                    this.images = _.map(images, function (content) {
                        return {
                            fileId: content.id,
                            name: content.orginalName,
                            fileExt: content.ext
                        }
                    });

                    setTimeout(function () {
                        _this.$refs.imageViewer.view(_.findIndex(images, "id", file.id));
                    }, 100);
                } else {
                    window.open("/file/down/" + file.id)
                }
            },
            beforeInit: function () {
                this.cloudFiles = null;
                this.groups = null;
                this.activeTabId = '1';
                this.checkedUserIndex = 0;
                this.checkedCompleteIndex = 0;
                this.showUnderlingTable = true;
            },
            afterInitData: function () {
                var _this = this;
                api.listFile({recordId: this.mainModel.vo.riskAssessId}).then(function (res) {
                    _this.cloudFiles = res.data;
                });
                this._getUnderlingList();

                if (this.mainModel.vo.isComplete === '1') {
                    this._getGroupList();
                } else if (this.mainModel.vo.isComplete === '2') {
                    this._getRecordGroupList();
                }
            },
            afterDoCancel: function () {
                // this.groups = null;
                this.mainModel.isReadOnly = true;
                if (this.mainModel.vo.isComplete === '1') {
                    this._getGroupList();
                } else if (this.mainModel.vo.isComplete === '2') {
                    this._getRecordGroupList();
                }
            },
            doSave: function () {
                var _this = this;
                var items = _.reduce(this.groups, function (result, item) {
                    result = result.concat(item.items)
                    return result;
                }, []);

                var someUnCheck = _.some(items, function (item) {
                    return !item.checkResult;
                });

                if (someUnCheck) {
                    return LIB.Msg.error("有研判项未填写检查情况");
                }

                var taskId = this.mainModel.vo.id;
                var params = {
                    riskAssessId: this.mainModel.vo.riskAssessId,
                    riskAssessTaskId: taskId,
                    compId: this.mainModel.vo.compId,
                    orgId: this.mainModel.vo.orgId,
                    userId: this.mainModel.vo.userId,
                    completeDate: new Date().Format('yyyy-MM-dd hh:mm:ss'),
                    riskAssessRecordDetails: _.map(items, function (item) {
                        return {
                            id: item.recordId,
                            riskAssessId: item.riskAssessId,
                            riskAssessTaskId: item.riskAssessTaskId,
                            itemContent: item.content,
                            groupId: item.groupId,
                            groupName: item.groupName,
                            groupOrderNo: item.groupOrderNo,
                            itemId: item.id,
                            itemOrderNo: item.orderNo,
                            itemResult: item.result,
                            itemScore: item.score,
                            itemStandard: item.standard,
                            actualScore: item.actualScore,
                            evaluate: item.evaluate,
                            checkResult: item.checkResult,
                            problem: item.problem,
                            latentDefect: item.latentDefect,
                            suggestStep: item.suggestStep
                        }
                    })
                };
                api.saveRecords(params).then(function () {
                    _this.mainModel.isReadOnly = true;
                    _this.$dispatch("ev_dtUpdate");
                    _this.mainModel.vo.isComplete = '2';
                })
            }
        },
        events: {},
        init: function () {
            this.$api = api;
        }
    });

    return detail;
});