define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require('../vuex/api');
    var tpl = LIB.renderHTML(require("text!./taskList.html"));

    var component = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic],
        template: tpl,
        props: {
            disable: {
                type: String,
                default: '0'
            },
            id: {
                type: String,
                default: ''
            }
        },
        data: function () {
            return {
                statusList: null,
                taskColumns: [
                    {
                        title:"自评任务序号",
                        fieldName: "num",
                        width: 120
                    },
                    {
                        title : "自评人",
                        fieldName : "mbrea.username",
                        width: 150
                    },
                    {
                        title:'开始日期',
                        fieldName: 'startDate',
                        width: 180
                    },
                    {
                        title:'结束日期',
                        fieldName: 'endDate',
                        width: 180
                    },
                    {
                        title: '状态',
                        width: 120,
                        fieldName: 'status',
                        render: function(data) {
                            return LIB.getDataDic("asmt_task_status", data.status);
                        }
                    }
                ],
                preTaskColumns: [
                    {
                        title:"自评任务序号",
                        fieldName: "num",
                        width: 120
                    },
                    {
                        title: "自评人名称",
                        fieldName: "mbrea.username",
                        width: 120
                    },
                    {
                        title : "开始时间",
                        fieldName : "startDate"
                    },
                    {
                        title: "结束时间",
                        fieldName: "endDate"
                    }
                ],
                values: null,
                userId: '',
                statusId: '0',
                users: null
            }
        },
        computed: {
            columns: function () {
                return this.disable === '0' ? this.preTaskColumns : this.taskColumns;
            },
            userEmpty: function () {
                return !this.users || this.users.length === 0;
            }
        },
        methods: {
            changeStatus: function (id) {
                if (this.statusId === id) {
                    return;
                }
                this.statusId = id;
                this.values = _.find(this.statusList, "id", id).items;
            },
            changeUser: function (id) {
                if (this.userId === id) {
                    return;
                }
                this.userId = id;
                this._query();
            },
            _getPreTaskList: function () {
                var _this = this;
                var params = {
                    id: this.id,
                    "criteria.strValue": JSON.stringify({mbreaId: this.userId})
                };
                api.queryPreTaskList(params).then(function (res) {
                    _this._normalize(res.data.list);
                })
            },
            _getTaskList: function () {
                var _this = this;
                var params = {
                    id: this.id,
                    "criteria.strValue": JSON.stringify({mbreaId: this.userId})
                };
                api.queryTaskList(params).then(function (res) {
                    _this._normalize(res.data.list);
                })
            },
            _query: function () {
                if (this.disable === '0') {
                    this._getPreTaskList();
                } else {
                    this._getTaskList();
                }
            },
            _init: function () {
                this.values = null;
                this.statusId = '0';
                if (!_.isArray(this.users) || _.isEmpty(this.users)) {
                    _.forEach(this.statusList, function (s) {
                        s.num = 0;
                        s.items = [];
                    });
                    return;
                }
                this.userId = this.users[0].id;
                this._query();
            },
            _normalize: function (values) {
                if (!_.isArray(values) || _.isEmpty(values)) {
                    return;
                }
                var groups = _.groupBy(values, "status");
                _.forEach(this.statusList, function (status) {
                    status.items = groups[status.id] || [];
                    status.num = status.items.length;
                });
                this.values = _.find(this.statusList, "id", this.statusId).items;
            }
        },
        events: {
            'ev_users_changed': function (users) {
                this.users = users;
                this._init();
            }
        },
        ready: function () {
            var statusList = LIB.getDataDicList("asmt_task_status");
            this.statusList = _.map(statusList, function (s) {
                return {
                    id: s.id,
                    value: s.value,
                    num: 0,
                    items: null
                }
            })
        }
    });

    return component;
});