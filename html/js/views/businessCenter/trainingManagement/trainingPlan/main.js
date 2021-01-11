define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
//    var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
    var detailPanel = require("./detail-xl");

    var initDataModel = function () {
        return {
            moduleCode: "trainPlan",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
//                detailPanelClass : "middle-info-aside"
                detailPanelClass: "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "trainplan/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "cb",
                        },
                        {
                            //唯一标识
                            title: "编码",
                            fieldName: "code",
                            fieldType: "link",
                            filterType: "text",
                            width: 220
                        },
                        {
                            //课程名称
                            title: "课程名称",
                            fieldName: "course.name",
                            filterType: "text",
                            width: 240
                        },
                        {
                            //title : "培训方式",
                            title: this.$t("bd.trm.trainingMode"),
                            fieldType: "custom",
                            render: function (data) {
                                return LIB.getDataDic("course_type", _.propertyOf(data.course)("type"));
                            },
                            filterType: "enum",
                            filterName: "criteria.intsValue.courseType",
                            orderName: "course.type",
                            popFilterEnum: LIB.getDataDicList("course_type"),
                            width: 100
                        },
                        {
                            //培训人数
                            title: "培训人数",
                            fieldName: "trainerNum",
                            filterType: "number",
                            width: 100
                        },
                        {
                            //培训开始时间
                            title: "培训开始时间",
                            fieldName: "startTime",
                            filterType: "date",
                            width: 180
                        },
                        {
                            //培训结束时间
                            title: "培训结束时间",
                            fieldName: "endTime",
                            filterType: "date",
                            width: 180
                        },

                        //LIB.tableMgr.column.company,

                        {
                            title: "允许考试时间（开始）",
                            fieldName: "exam.examDate",
                            filterType: "date",
                            filterName: "examTime",
                            width: 180
                        },
                        {
                            title: "允许考试时间（结束）",
                            fieldName: "exam.entryDeadline",
                            filterType: "date",
                            filterName: "entryDeadline",
                            width: 180
                        },
                        {
                            title: this.$t("gb.common.state"),
                            fieldName: "status",
                            fieldType: "custom",
                            render: function (data) {
                                return LIB.getDataDic("train_plan_status", data.status);
                            },
                            filterType: "enum",
                            filterName: "criteria.intsValue.status",
                            popFilterEnum: LIB.getDataDicList("train_plan_status"),
                            width: 100
                        },
                        {
                            title: "发布人",
                            fieldName: "publisher.username",
                            filterType: "text",
                            filterName: "publisher.name",
                            width: 180
                        },
                        {
                            //发布时间
                            title: "发布时间",
                            fieldType: "custom",
                            filterType: "date",
                            filterName: "publishTime",
                            render: function (data) {
                                if (data.status == 1) {
                                    return data.modifyDate;
                                }
                            },
                            orderName: "publish_time",
                            width: 180
                        }
                    ],
                    defaultFilterValue: {"criteria.intsValue.courseType": [1]}
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/trainPlan/importExcel"
            },
            exportModel: {
                url: "/trainPlan/exportExcel"
            }
        };
    }

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel
        },
        methods: {
            doUpdate: function() {
                var rows = this.tableModel.selectedDatas;
                var row = rows[0];
                if(row.status === '1') {
                    LIB.Msg.warning("【已发布】状态不能编辑,请重新选择!");
                    return;
                }
                
                this.showDetail(row, { opType: "update" });
            },

            //发布
            doPublish: function () {
                var _this = this;
                var rows = this.tableModel.selectedDatas;
                if (rows.length === 0) {
                    LIB.Msg.warning("请选择数据!");
                    return;
                }
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量发布数据");
                    return;
                }
                if(rows[0].status == '1') {
                    LIB.Msg.warning("【已发布】状态不能发布,请重新选择!");
                    return;
                }
                LIB.Modal.confirm({
                    title: '发布选中数据?',
                    onOk: function () {

                        //var ids = _.map(rows,function(row){return row.id});
                        var vo = rows[0];
                        api.publish(vo).then(function (res) {
                            vo.status = "1";
                            LIB.Msg.info("已发布!");
                            _this.refreshMainTable();
                            //_this.emitMainTableEvent("do_update_row_data", {opType:"update", value: rows});
                        });

                    }
                });
            },
            //取消发布
            doCancelPublish: function () {
                var _this = this;
                var rows = this.tableModel.selectedDatas;
                if (rows.length == 0) {
                    LIB.Msg.warning("请选择数据!");
                    return;
                }
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量取消发布");
                    return;
                }
                if (rows[0].isOver == true) {
                    LIB.Msg.warning("超过结束时间,不能取消");
                    return;
                }
                if(rows[0].status !== '1') {
                    LIB.Msg.warning("【未发布/已取消】状态不能取消,请重新选择!");
                    return;
                }
                if (rows[0].startTime <= new Date().Format("yyyy-MM-dd 00:00:00")) {
                    LIB.Msg.warning("培训已开始不能取消,请重新选择!");
                    return;
                }
                LIB.Modal.confirm({
                    title: '取消发布选中数据?',
                    onOk: function () {
                        var vo = rows[0];

                        api.cancelPublish(vo).then(function (res) {
                            vo.status = "2";
                            LIB.Msg.info("取消成功!");
                            _this.refreshMainTable();
                        });
                    }
                });
            },
            beforeDoDelete: function () {
                //var row = this.tableModel.selectedDatas[0];
                //if(row.status === '2') {
                //    LIB.Msg.warning("已取消的计划不能删除");
                //    return false;
                //}
                //if(row.status === '1') {
                //    LIB.Msg.warning("已发布的计划不能删除");
                //    return false;
                //}
                return true
            }
        },
        events: {},
        init: function () {
            this.$api = api;
        }
    });

    return vm;
});
