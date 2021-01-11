define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");
    var copyComponent = require("./dialog/copy");
    //导入
    var importProgress = require("componentsEx/importProgress/main");
    //编辑弹框页面bip (big-info-panel)
//	var detailPanel = require("./detail-xl");

    var courseSelectModal = require("componentsEx/selectTableModal/courseSelectModal");

    var isEmer = 0;

    var initDataModel = function () {
        return {
            moduleCode: "courseManage",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                // detailPanelClass: "middle-info-aside"
				detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "course/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "cb",
                        },
                        {
                            //唯一标识
                            title: this.$t("gb.common.code"),
                            fieldName: "code",
                            fieldType: "link",
                            filterType: "text",
                            width: 160
                        },
                        {
                            //课程名称
                            title: "课程名称",
                            fieldName: "name",
                            filterType: "text",
                            width: 240
                        },
                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.dept,
                        //{
                        //	//类型 1法定 2知识 3技能
                        //	title: "课程类型",
                        //	fieldName: "category",
                        //	filterType: "text"
                        //},
                        {
                            //title : "课程类型",
                            title: this.$t("bd.trm.coursetType"),
                            fieldName: "attr1",
                            filterType: "text",
                            orderName: "attr1",
                            width: 200
                        },
                        {
                            //title : "培训方式",
                            title: this.$t("bd.trm.trainingMode"),
                            fieldType: "custom",
                            render: function (data) {
                                return LIB.getDataDic("course_type", data.type);
                            },
                            filterType: "enum",
                            filterName: "criteria.intsValue.type",
                            orderName: "type",
                            popFilterEnum: LIB.getDataDicList("course_type"),
                            width: 100
                        },
                        {
                            //复培频率 以年为单位 0表示一次性
                            title: "复培周期",
                            fieldName: "frequence",
                            fieldType: "custom",
                            filterType: "text",
                            render: function (data) {
                                if (data.frequence != null && data.frequence != 0) {
                                    return data.frequence.substr(0, data.frequence.length - 2) + "个月";
                                } else if (data.frequence == 0) {
                                    return "无需复培"
                                } else {
                                    return "";
                                }
                            },
                            filterName: "criteria.strValue.frequence",
                            width: 120
                        },
                        {
                            title: this.$t("gb.common.state"),
                            fieldType: "custom",
                        //     render: function (data) {
                        //     return LIB.getDataDic("course_disable", data.disable);
                        // },
                            render: function (data) {
                                var text = LIB.getDataDic("course_disable", data.disable);
                                if(data.disable === '0') {
                                    return '<i class="ivu-icon ivu-icon-checkmark-round" style="font-weight: bold;color: #aacd03;margin-right: 5px;"></i>' + text
                                } else {
                                    return '<i class="ivu-icon ivu-icon-close-round" style="font-weight: bold;color: #f03;margin-right: 5px;"></i>' + text
                                }
                            },
                            filterType: "enum",
                            filterName: "criteria.intsValue.disable",
                            orderName: "disable",
                            popFilterEnum: LIB.getDataDicList("course_disable"),
                            width: 100
                        },
//					{
//						//语言 0中文 1英语
//						title: "语言",
//						fieldName: "language",
//						filterType: "text"
//					},
//					{
//						//启用多频率提醒距离培训开始的天数
//						title: "启用多频率提醒距离培训开始的天数",
//						fieldName: "lastRemindDays",
//						filterType: "text"
//					},
//					{
//						//多频率提醒的频率 天为单位
//						title: "多频率提醒的频率",
//						fieldName: "lastRemindFrequence",
//						filterType: "text"
//					},
//					{
//						//三级安全教育  1班组级 2车间级 3厂级
//						title: "三级安全教育",
//						fieldName: "level",
//						filterType: "text"
//					},
//					{
//						//学习条件
//						title: "学习条件",
//						fieldName: "precondition",
//						filterType: "text"
//					},
//					{
//						//培训目的
//						title: "培训目的",
//						fieldName: "purpose",
//						filterType: "text"
//					},
//					{
//						//备注
//						title: "备注",
//						fieldName: "remark",
//						filterType: "text"
//					},
//					{
//						//提前提醒天数
//						title: "提前提醒天数",
//						fieldName: "remindDays",
//						filterType: "text"
//					},
//					{
//						//提醒标识 0不提醒 1普通提醒 2多频率提醒
//						title: "提醒标识",
//						fieldName: "remindType",
//						filterType: "text"
//					},
//					{
//						//所有关联分类id
//						title: "所有关联分类id",
//						fieldName: "subjectLink",
//						filterType: "text"
//					},
//					{
//						//培训课时
//						title: "培训课时",
//						fieldName: "trainHour",
//						filterType: "text"
//					},
//					{
//						//授课类型 1自学 2教学 3实操
//						title: "授课类型",
//						fieldName: "type",
//						filterType: "text"
//					},
//					{
//						//修改日期
//						title: "修改日期",
//						fieldName: "modifyDate",
//						filterType: "date"
//					},
                        {
                            //创建日期
                            title: "创建时间",
                            fieldName: "createDate",
                            filterType: "date",
                            width: 180
                        },
                    ],
                    defaultFilterValue : {"criteria.orderValue" : {fieldName : "createDate", orderType : "1"}, "criteria.intValue": {isEmer: isEmer}}
                }
            ),
            detailModel: {
                show: false
            },
            copyModel: {
                //控制组件的显示
                title:"复制课程",
                //显示编辑弹框
                show:false,
                id:null
            },
            uploadModel: {
                url: "/course/importExcel"
            },
            exportModel: {
                url: "/course/exportExcel"
            },
            templete: {
                url: "/course/file/down"
            },
            importProgress: {
                show: false
            },
            selectModel: {
                courseSelectModel: {
                    visible: false
                }
            },
            isEmer: false
        };
    };

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
            "importprogress": importProgress,
            "copyComponent":copyComponent,
            "courseSelectModal" : courseSelectModal
        },
        computed: {
            showCopyBtn: function () {
                return LIB.user.id === '9999999999';
            }
        },
        methods: {
            doShowCourseSelectModal: function () {
                this.selectModel.courseSelectModel.visible = true;
            },
            doSaveEmerCourses: function(selectedDatas) {
                if (selectedDatas) {
                    var _this = this;
                    var data = _.map(selectedDatas, function(course){
                        return {course: {id:course.id}};
                    });
                    this.$api.addToEmer(data).then(function(res){
                        _this.refreshMainTable();
                    });
                }
            },
            doRemoveFromEmer: function() {
                var _this = this;
                var rows = _this.tableModel.selectedDatas;
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量移除数据");
                    return
                }
                var ids = _.map(rows, function(table){
                    return table.id;
                });
                this.$api.removeFromEmer(null, ids).then(function(res){
                    _this.refreshMainTable();
                });
            },
            doImport: function () {
                var _this = this;
                this.importProgress.show = true;
            },
            doPublish: function () {
            	var _this = this;
                var rows = this.tableModel.selectedDatas;
                if (rows.length === 0) {
                    LIB.Msg.warning("请选择课程!");
                    return;
                }
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量上架课程");
                    return;
                }
                if(rows[0].disable == "0") {
                    LIB.Msg.warning("课程已上架,请重新选择!");
                    return;
                }
                LIB.Modal.confirm({
                    title: '上架选中课程?',
                    onOk: function () {

                        var vo = rows[0];
                        api.publish(vo).then(function (res) {
                            vo.disable = "0";
                            LIB.Msg.info("上架成功!");
                            _this.refreshMainTable();
                        });

                    }
                });
            },
            doDisable: function () {
            	var _this = this;
                var rows = this.tableModel.selectedDatas;
                if (rows.length === 0) {
                    LIB.Msg.warning("请选择课程!");
                    return;
                }
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量下架课程");
                    return;
                }
                if(rows[0].disable == "1") {
                    LIB.Msg.warning("课程已下架,请重新选择!");
                    return;
                }
                LIB.Modal.confirm({
                    title: '下架选中课程?',
                    onOk: function () {

                        var vo = rows[0];
                        api.disable(vo).then(function (res) {
                            vo.disable = "1";
                            LIB.Msg.info("下架成功!");
                            _this.refreshMainTable();
                        });

                    }
                });
            },
            doCopyModelShow:function () {
                var rows = this.tableModel.selectedDatas;
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量复制数据");
                    return;
                }
                var row = rows[0];
                this.copyModel.show = true;
                this.$broadcast('ev_editReload_copy',row.id);
            },
            doCopyFinished:function () {
                // var _this = this;
                // api.copy({courseId:data.id,destCompId:data.destCompId,destOrgId:data.destOrgId}).then(function () {
                //     LIB.Msg.info("复制成功");
                //     _this.copyModel.show = false;
                //     _this.refreshMainTable();
                // })
                LIB.Msg.info("复制成功");
                this.refreshMainTable();
                this.copyModel.show = false;
            }
        },
        events: {},
        init: function () {
            isEmer = 0;
            if(this.$route.path.indexOf("/emer") == 0) {
                this.$api = require("../../emerMa/course/vuex/api");
                isEmer = 1;
            } else{
                this.$api = api;
            }
        },
        ready: function() {
            this.isEmer = false;
            if(this.$route.path.indexOf("/emer") == 0) {
                this.isEmer = true;
            }
        }
    });

    return vm;
});
