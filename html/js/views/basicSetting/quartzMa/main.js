define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");


    var initDataModel = function () {
        return {
            moduleCode: "quartzMa",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass: "middle-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "quartz/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [{
                        title: "",
                        fieldName: "id",
                        fieldType: "cb",
                    },
                        {
                            title: "任务名称",
                            fieldName: "quartzJobName",
                            fieldType: "link",
                            width: 200
                        },
                        {
                            title: "任务描述",
                            fieldName: "description",
                            width: 320
                        },
                        {
                            title: "cron表达式",
                            fieldName: "cron",
                            width: 160
                        },
                        {
                            title: "任务状态",
                            fieldName: "triggerState",
                            width: 120
                        },
                        {
                            title: "创建时间",
                            fieldName: "startDate",
                            width: 180
                        },
                        {
                            title: "上一次执行时间",
                            fieldName: "previousFireDate",
                            width: 180
                        },
                        {
                            title: "下一次执行时间",
                            fieldName: "nextFireDate",
                            width: 180
                        },
                        {
                            title: "时间间隔",
                            render: function (data) {
                                var last = new Date(data.previousFireDate);
                                var next = new Date(data.nextFireDate);
                                var minute = 1000 * 60,
                                    hour = minute * 60,
                                    day = hour * 24;
                                var diff = next - last;
                                var rd = Math.floor(diff / day);
                                diff = diff % day;
                                var rh = Math.floor(diff / hour);
                                diff = diff % hour;
                                var rm = Math.floor(diff / minute);
                                diff = diff % minute;

                                var str = '';
                                if (rd > 0) {
                                    str += rd + '天'
                                }
                                if (rh > 0) {
                                    str += rh + '小时'
                                }
                                if (rm > 0) {
                                    str += rm + '分钟'
                                }
                                if (diff > 0) {
                                    str += diff + '秒'
                                }
                                return str;
                            }
                        }
                    ]
                }
            ),
            detailModel: {
                show: false
            },
        };
    }

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,

        },
        methods: {
            //点击列为quartzJobName时,显示该列的详情
            doTableCellClick: function (data) {
                if (!!this.showDetail && data.cell.fieldName == "quartzJobName") {
                    this.showDetail(data.entry.data);
                } else {
                    (!!this.detailModel) && (this.detailModel.show = false);
                }
            },
            //显示详情面板
            showDetail: function (row) {
                this.$broadcast('ev_dtReload', row);
                this.detailModel.show = true;
            },
            doPause: function () {
                var _this = this;
                var ids = _.map(_this.tableModel.selectedDatas, function (row) {
                    return row.id
                });
                if (ids.length > 1) {
                    LIB.Msg.warning("无法批量暂停任务");
                    return;
                }
                var _vo = this.tableModel.selectedDatas[0];
                if (_vo.triggerState == 'PASUED') {
                    LIB.Msg.warning("该任务已是暂停状态");
                    return;
                }

                _this.$api.pause(null, _vo).then(function () {
                    _this.doDetailUpdate();
                    LIB.Msg.info("暂停成功");
                });

            },
            doResume: function () {
                var _this = this;
                var ids = _.map(_this.tableModel.selectedDatas, function (row) {
                    return row.id
                });
                if (ids.length > 1) {
                    LIB.Msg.warning("无法批量恢复任务");
                    return;
                }
                var _vo = this.tableModel.selectedDatas[0];
                if (_vo.triggerState == 'NORMAL') {
                    LIB.Msg.warning("该任务已是正常状态");
                    return;
                }
                LIB.Modal.confirm({
                    title: '确定恢复该任务?',
                    onOk: function () {
                        _this.$api.resume(null, _vo).then(function () {
                            _this.doDetailUpdate();
                            LIB.Msg.info("恢复成功");
                        });
                    }
                });
            },
            doDelete: function () {
                var _this = this;
                var ids = _.map(_this.tableModel.selectedDatas, function (row) {
                    return row.id
                });
                if (ids.length > 1) {
                    LIB.Msg.warning("无法批量删除任务");
                    return;
                }
                var _vo = this.tableModel.selectedDatas[0];
                LIB.Modal.confirm({
                    title: '任务一旦删除，重启服务器才能恢复，确定删除该任务?',
                    onOk: function () {
                        _this.$api._delete(null, _vo).then(function () {
                            _this.doDetailUpdate();
                            LIB.Msg.info("删除成功");
                        });
                    }
                });
            },
        },
        events: {},
        ready: function () {
            this.$api = api;
        }
    });

    return vm;
});
