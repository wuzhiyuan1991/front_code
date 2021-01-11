define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
//	var detailPanel = require("./detail-xl");

    var initDataModel = function () {
        return {
            moduleCode: "errorRecord",
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
                    url: "errorrecord/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [{
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
                            width: 160
                        },
                        {

                            title: "试题内容",
                            fieldName: "question.content",
                            filterType: "text",
                            width: 800
                        },
                        {
                            // title : "题型",
                            title: this.$t('bd.trm.questInfo'),
                            fieldType: "custom",
                            render: function (data) {
                                return LIB.getDataDic("question_type", _.propertyOf(data.question)("type"));
                            },
                            filterType: "enum",
                            filterName: "criteria.intsValue.type",
                            popFilterEnum: LIB.getDataDicList("question_type"),
                            orderName: "question.type",
                            width: 120
                        },
                        //{
                        //	//用户答案
                        //	title: "用户答案",
                        //	fieldName: "userAnswer",
                        //	filterType: "text"
                        //},
                        {
                            title: "答题时间",
                            fieldName: "createDate",
                            filterType: "date",
                            width: 180
                        },
                        {
                            title: "知识点",
                            fieldName: "examPoints",
                            filterType: "text",
                            filterName: "criteria.strValue.examPointName",
                            width:240
                        },
                        //{
                        //	//创建日期
                        //	title: "创建日期",
                        //	fieldName: "createDate",
                        //	filterType: "date"
                        //},
                    ]
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/errorRecord/importExcel"
            },
            exportModel: {
                url: "/errorRecord/exportExcel"
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
        	doExercise: function () {
            	window.open(LIB.ctxPath("/front/errorrecord/exercise"));
            },
        },
        events: {},
        init: function () {
            this.$api = api;
        }
    });

    return vm;
});
