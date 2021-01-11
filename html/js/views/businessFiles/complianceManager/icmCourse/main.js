define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");      //修改 detailPanelClass : "middle-info-aside"
    //编辑弹框页面bip (big-info-panel)
    //	var detailPanel = require("./detail-xl");   //修改 detailPanelClass : "large-info-aside"
    //编辑弹框页面bip (big-info-panel) Legacy模式
    //  var detailPanel = require("./detail-tab-xl");//修改 detailPanelClass : "large-info-aside"

    //Legacy模式
    //	var icmCourseFormModal = require("componentsEx/formModal/icmCourseFormModal");


    var initDataModel = function () {
        return {
            moduleCode: "icmCourse",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass: "middle-info-aside"
                //				detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "icmcourse/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                        {
                            //课程名称
                            title: "课程名称",
                            fieldName: "name",
                            filterType: "text",
                            width: 450
                        },
                        {
                            title: '视频',
                            width: 100,
                            render: function (data) {
                                if (!data) {
                                    return 
                                }
                                if (data.icmCourseKpoints.length > 0) {
                                    return '<i style="font-size:24px;color:#0075d3;cursor:pointer;margin-left:20px;" class="ivu-icon ivu-icon-android-playstore"></i>'
                                } else {
                                    return '<div style="margin-left:20px;">暂无</div>'
                                }

                            },
                            tipRender:function(){
                                return '视频'
                            }
                        },
                        //  LIB.tableMgr.column.disable,
                        //  LIB.tableMgr.column.company,
                        //  LIB.tableMgr.column.dept,
                        {
                            //课程描述
                            title: "课程简介",
                            fieldName: "description",
                            filterType: "text",
                            width: 300
                        },
                        {
                            //分类
                            title: "课程分类",
                            fieldName: "classification",
                            filterType: "text"
                        },

                        //  LIB.tableMgr.column.modifyDate,
                        //  LIB.tableMgr.column.createDate,

                    ]
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/icmcourse/importExcel"
            },
            exportModel: {
                url: "/icmcourse/exportExcel",
                withColumnCfgParam: true
            },
            //Legacy模式
            //			formModel : {
            //				icmCourseFormModel : {
            //					show : false,
            //				}
            //			}

        };
    }

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        //Legacy模式
        //		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainLegacyPanel],
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
            //Legacy模式
            //			"icmcourseFormModal":icmCourseFormModal,

        },
        methods: {
            doTableCellClick: function (val) {
                if (val.cell.colId == 3&&val.entry.data.icmCourseKpoints.length>0) {
                    window.open(LIB.ctxPath("/icmfront/course/" + val.entry.data.id));
                } else if (val.cell.colId == 1) {
                    this.detailModel.show = true
                    this.showDetail(val.entry.data);
                }
            }

            //Legacy模式
            //			doAdd : function(data) {
            //				this.formModel.icmCourseFormModel.show = true;
            //				this.$refs.icmcourseFormModal.init("create");
            //			},
            //			doSaveIcmCourse : function(data) {
            //				this.doSave(data);
            //			}

        },
        events: {
        },
        init: function () {
            this.$api = api;
        }
    });

    return vm;
});
