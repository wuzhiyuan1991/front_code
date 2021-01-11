define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
//    var detailPanel = require("./detail");
    //导入
    var importProgress = require("componentsEx/importProgress/main");
    //编辑弹框页面bip (big-info-panel)
	var detailPanel = require("./detail-xl");

    var initDataModel = function () {
        return {
            moduleCode: "course",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
//                detailPanelClass: "middle-info-aside"
				detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "course/list{/curPage}{/pageSize}?_bizModule=courseCenter",
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
                            // 培训要求
                            title: this.$t('bd.trm.require'),
                            fieldType: "custom",
                            render: function (data) {
                                return LIB.getDataDic("training_requirement", data.requirement);
                            },
                            filterType: "enum",
                            filterName: "criteria.intsValue.requirement",
                            orderName: "requirement",
                            popFilterEnum: LIB.getDataDicList("training_requirement"),
                            width: 100
                        },
                        {
    						//培训学时
    						title: this.$t("bd.trm.trainingHours"),
    						fieldName: "trainHour",
    						render: function(data){
    							if(data.trainHour) {
    							    return parseFloat(data.trainHour) + "小时"
                                }
                                return ''
    						},
    						filterType: "number"
    					},
                        // {
                        //     //title : "培训方式",
                        //     title: this.$t("bd.trm.trainingMode"),
                        //     fieldType: "custom",
                        //     render: function (data) {
                        //         return LIB.getDataDic("course_type", data.type);
                        //     },
                        //     filterType: "enum",
                        //     filterName: "criteria.intsValue.type",
                        //     orderName: "type",
                        //     popFilterEnum: LIB.getDataDicList("course_type"),
                        //     width: 100
                        // },
                        // {
                        //     //复培频率 以年为单位 0表示一次性
                        //     title: "复培周期",
                        //     fieldName: "frequence",
                        //     fieldType: "custom",
                        //     filterType: "text",
                        //     render: function (data) {
                        //         if (data.frequence != null && data.frequence != 0) {
                        //             return data.frequence.substr(0, data.frequence.length - 2) + "个月";
                        //         } else if (data.frequence == 0) {
                        //             return "无需复培"
                        //         } else {
                        //             return "";
                        //         }
                        //     },
                        //     filterName: "criteria.strValue.frequence",
                        //     width: 120
                        // },
                        // {
                        //     title: this.$t("gb.common.state"),
                        //     fieldType: "custom",
                        //     render: function (data) {
                        //         return LIB.getDataDic("course_disable", data.disable);
                        //     },
                        //     filterType: "enum",
                        //     filterName: "criteria.intsValue.disable",
                        //     orderName: "type",
                        //     popFilterEnum: LIB.getDataDicList("course_disable"),
                        //     width: 100
                        // },
                        {
                            //创建日期
                            title: "创建时间",
                            fieldName: "createDate",
                            filterType: "date",
                            width: 180
                        },
                    ]
                }
            ),
            detailModel: {
                show: false
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
            }
        };
    }

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
            "importprogress": importProgress
        },
        methods: {
            doAddToTask : function() {
				var _this = this;
				var rows = this.tableModel.selectedDatas;
				if (rows.length > 1) {
                    LIB.Msg.warning("无法批量添加");
                    return;
                }
                var vo = rows[0];
                
                LIB.Modal.confirm({
                    title: '确定添加任务?',
                    onOk: function () {
                        api.createTrainTask({
                            course: {id:vo.id}
                        }).then(function (res) {
                            LIB.Msg.info("添加成功!");
                            _this.refreshMainTable();
                        });

                    }
                });
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
        },
        events: {},
        init: function () {
            this.$api = api;
        }
    });

    return vm;
});
