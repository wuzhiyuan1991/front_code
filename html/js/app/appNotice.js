define(function (require) {
    var LIB = require("lib");
    var Vue = require("vue");
    var template = require("text!./appNotice.html");
    var api = require("./vuex/api");

    var hzList = {
        '1': '每日',
        '2': '每月',
        '3': '每季',
        '4': '每年',
        '5': '每半年',
        '6': '每周',
        '7': '无频次'
    };


    var opts = {
        template: template,
        props: {
            title: {
                type: String,
                default: ''
            }
        },
        computed: {

        },
        data: function () {
            return {
                notices: []
            }
        },
        methods: {
            removeNotice: function (key) {
                var notices = this.notices;

                for (var i = 0; i < notices.length; i++) {
                    if (notices[i].key === key) {
                        this.notices.splice(i, 1);
                        break;
                    }
                }
            },

            _getAuditTasks: function () {
                var _this = this;
                api.getAuditTask().then(function (res) {
                    var data = res.data;
                    if (!_.isArray(data) || _.isEmpty(data)) {
                        return;
                    }
                    data = _.map(data, function (item) {
                        return {
                            planId: item.auditTask.auditPlanId,
                            planName: item.auditTask.auditPlanName,
                            taskId: item.auditTaskId,
                            elementId: item.auditElementId,
                            frequencyType: item.frequencyType,
                            id: item.id,
                            name: item.name,
                            done: false
                        }
                    });
                    data = _.groupBy(data, "frequencyType");
                    var ret = [];
                    _.forEach(data, function (v, k) {
                        ret.push({
                            title: (hzList[k] || '') + "安全体系管理任务",
                            key: k,
                            children: v
                        })
                    });
                    _this.notices = ret;
                })
            },
            toAuditGrade: function (plan) {
                window.open("/html/main.html#!/gradeAudit?id=" + plan.planId + "&tId=" + plan.taskId);
            },
            done: function (item) {
                item.done = !item.done;
            }
        },
        ready: function () {
            var path = this.$route.path;
            if (path === "/home/work") {
                this._getAuditTasks();
            }
        }
    };
    return opts;
});
