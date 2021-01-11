define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail.html");
    var examPointSelectModal = require("componentsEx/selectTableModal/examPointSelectModal");
//	var courseSelectModal = require("componentsEx/selectTableModal/courseSelectModal");
    //选择知识点
    require("componentsEx/treeModal/treeModal");

    //富文本编辑框
    require("libs/kindeditor/kindeditor");


    var options = [{opt: "A", content: ""}, {opt: "B", content: ""}, {opt: "C", content: ""}, {opt: "D", content: ""}];
    //初始化数据模型
    var newVO = function () {
        return {
            //主键
            id: null,
            //
            compId: null,
            code: null,
            //试题内容
            content: null,
            //题型 1:单选题,2:多选题,3:判断题
            type: null,
            //试题类型 1:考题,2:练习题
			useType : '1',
            //选项
            //opts : [],
            //知识点
            //examPoints : [],
            //createDate:null,
            //正确选项
            answer: "",
            opts: _.cloneDeep(options),
            analysis: null,
            //课程
            courses: [],
        }
    };
    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            opType: 'view',
            isReadOnly: true,
            title: "",
            examPointsList: [],//知识点
            //qstTypeList :[
            //	{type:"1",name:"单选题"},
            //	{type:"2",name:"多选题"},
            //	{type:"3",name:"判断题"}
            //],
            rules: {
                // "code":[LIB.formRuleMgr.require("编码")],
                "compId": [{required: true, message: '请选择所属公司'}],
                "content": [LIB.formRuleMgr.require("试题内容")],
                "type": [{required: true, message: '请选择题型'}],
                "useType": [{required: true, message: '请选择试题类型'}],
                answer: [
                    {required: true, message: '请选择答案'}
                ]
            }
        },
        tableModel: {
            examPointTableModel: {
                url: "question/exampoints/list/{curPage}/{pageSize}",
                columns: [{
                    title: "编码",
                    fieldName: "code"
                }, {
                    title: "名称",
                    fieldName: "name",
                }, {
                    title: "",
                    fieldType: "tool",
                    toolType: "del"
                }]
            },
//			courseTableModel : {
//				url : "question/courses/list/{curPage}/{pageSize}",
//				columns : [{
//					title : "编码",
//					fieldName : "code",
//					keywordFilterName: "criteria.strValue.keyWordValue_code"
//				},{
//					title : "名称",
//					fieldName : "name",
//					keywordFilterName: "criteria.strValue.keyWordValue_name"
//				},{
//					title : "",
//					fieldType : "tool",
//					toolType : "del"
//				}]
//			},
        },
        formModel: {
            optFormModel: {
                show: false,
                queryUrl: "question/{id}/opt/{optId}"
            },
        },
        selectModel: {
            examPointSelectModel: {
                visible: false
            },
//			courseSelectModel : {
//				visible : false,
//				filterData : {orgId : null}
//			},
        },
        examPointModel: {
            visible: false,
            examPointModelData: null,
            title: "选择知识点"

        },
        selectedCategory: [],
        //知识点
        createDate: null,
        showCreateDate: true
    };
    //Vue组件
    /**
     *  请统一使用以下顺序配置Vue参数，方便codeview
     *    el
     template
     components
     componentName
     props
     data
     computed
     watch
     methods
     events
     vue组件声明周期方法
     created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
     **/
    var detail = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.detailPanel],
        template: tpl,
        components: {
            "exampointSelectModal": examPointSelectModal
        },
        data: function () {
            return dataModel;
        },
        watch: {
            'mainModel.vo.type': function (val, oldVal) {
                if (this.mainModel.opType === "create") {
                    this.mainModel.vo.answer = "";
                }
                if (val == 3) {
                    this.mainModel.vo.opts = this.mainModel.vo.opts.slice(0, 2);
                    if (this.mainModel.opType === "create") {
                        this.doChangeAnswer("A");
                    }
                } else {
                    this.mainModel.vo.opts = _.cloneDeep(options);
                }
            },
            'mainModel.vo.opts': function (val, oldVal) {
                //是为了防止出现多次监听请求
                if (val && val.length > 0 && val[0].id) {
                    setTimeout(this.doLoadKindEditor(), 3000);
                } else if (this.mainModel.opType == "create") {
                    setTimeout(this.doLoadKindEditor(), 3000);
                }
            }
        },
        methods: {
            newVO: newVO,
            doShowExamPointSelectModal: function () {
                var _this = this;
                _this.examPointModel.visible = true;
                api.queryExampoint().then(function (res) {
                    _this.examPointModel.examPointModelData = res.body
                })
            },
            doSaveExamPoints: function (selectedDatas) {
                if (selectedDatas) {
                    dataModel.mainModel.vo.examPoints = selectedDatas;
                    var param = _.map(selectedDatas, function (data) {
                        return {id: data.id}
                    });
                    var _this = this;
                    api.saveExamPoints({id: dataModel.mainModel.vo.id}, param).then(function () {
                        _this.refreshTableData(_this.$refs.exampointTable);
                        _this.$dispatch("ev_dtUpdate");
                    });
                }
            },
            afterDoEdit: function () {
                var _this = this;
                setTimeout(_this.doLoadKindEditor(), 3000);
                api.queryOpts({id: _this.mainModel.vo.id}).then(function (res) {
                    _this.mainModel.vo.opts = res.data;
                })
            },

            doRemoveExamPoints: function (item) {
                if (!this.hasPermission('4020003011')) {
                    LIB.Msg.warning("你没有此权限!");
                    return;
                }
                var _this = this;
                var data = item.entry.data;
                api.removeExamPoints({id: this.mainModel.vo.id}, [{id: data.id}]).then(function () {
                    _this.$refs.exampointTable.doRefresh();
                    _this.$dispatch("ev_dtUpdate");
                });
            },
            //保存成功执行
            afterDoSave: function (_pass, obj) {
                //保存成功时候 不显示创建时间
                this.showCreateDate = false;
            },
            //保存时候执行
            beforeDoSave: function () {
                var _this = this;
                //题型不为判断题的时候
                if (this.mainModel.vo.type != 3) {
                    var flag = false;
                    //判断试题是否为空
                    _.each(_this.mainModel.vo.opts, function (opt) {
                        opt.content = $("#editor" + opt.opt).val();
                        if (_.isString(opt.content)) {
                            opt.content = opt.content.replace(/&nbsp;/g, '').trim();
                        }
                        if (!opt.content) {
                            LIB.Msg.warning("选项内容不能为空");
                            flag = true;
                        }
                    });
                    if (flag) {
                        return false;
                    }
                    if (_this.mainModel.opType === "update") {
                        var arr = [];
                        _.each(_this.mainModel.vo.opts, function (item) {
                            var opt = {
                                opt: item.opt,
                                content: item.content,
                                id: item.id,
                            }
                            arr.push(opt);
                        })
                        _this.mainModel.vo.opts = arr;
                    }

                } else {
                    if (_this.mainModel.opType == "update") {
                        var arr = [];
                        _.each(_this.mainModel.vo.opts, function (item) {
                            var opt = {
                                opt: item.opt,
                                id: item.id,
                            }
                            arr.push(opt);
                        })
                        _this.mainModel.vo.opts = arr;
                    }
                }
            },
            //点击详情执行
            afterInitData: function () {
                var _this = this;
                this.createDate = _this.mainModel.vo.createDate;
                this.$refs.exampointTable.doQuery({id: this.mainModel.vo.id});
                //获取关联的试题
                api.queryOpts({id: _this.mainModel.vo.id}).then(function (res) {
                    _this.mainModel.vo.opts = res.data;
                })
            },
            beforeInit: function () {
                this.mainModel.vo.opts = [];
                this.showCreateDate = true;
                if (this.mainModel.opType === "create") {
                    this.mainModel.vo.opts = _.cloneDeep(options);
                }
                this.$refs.exampointTable.doClearData();
            },
            doAddOpt: function () {
                var n = this.mainModel.vo.opts.length;
                var optName = String.fromCharCode(65 + n);
                this.mainModel.vo.opts.push({opt: optName, content: ""});
            },
            doCheckAswer: function (opt) {
                if (this.mainModel.vo.answer != null && this.mainModel.vo.answer.indexOf(opt) > -1) {
                    return true;
                } else {
                    return false;
                }
            },
            showRemoveIcon: function (index) {
                if (!this.mainModel.vo.type) {
                    return false;
                }
                var length = this.mainModel.vo.opts.length;
                if (this.mainModel.vo.type === '1') {
                    return length > 2 && (index === length - 1)
                } else if (this.mainModel.vo.type === '2') {
                    return length > 3 && (index === length - 1)
                }
                return false;
            },
            removeLatScore: function (index) {
                if (!this.mainModel.vo.type) {
                    return LIB.Msg.warning("请选择题型");
                }

                //判断删除的是否在正确答案中 如果在则更新正确答案
                if (this.mainModel.vo.answer.indexOf(this.mainModel.vo.opts[index].opt) > -1) {
                    this.mainModel.vo.answer = this.mainModel.vo.answer.replace(this.mainModel.vo.opts[index].opt, "");
                }
                this.mainModel.vo.opts.splice(index, 1);

            },
            doDelete: function () {
                var _vo = this.mainModel.vo;
                var _this = this;
                LIB.Modal.confirm({
                    title: '删除当前数据?',
                    onOk: function () {
                        _this.mainModel.vo.opts = [];
                        _this.$api.remove(null, _vo).then(function () {
                            _this.afterDoDelete();
                            _this.$dispatch("ev_dtDelete");
                            LIB.Msg.info("删除成功");
                        });
                    }
                });
            },
            doChangeAnswer: function (opt) {
                if (this.mainModel.vo.answer.indexOf(opt) > -1) {
                    if (this.mainModel.vo.type == 1 || this.mainModel.vo.type == 3) {
                        return;
                    } else {
                        this.mainModel.vo.answer = this.mainModel.vo.answer.replace(opt, "");
                    }
                } else {
                    if (this.mainModel.vo.type == 1 || this.mainModel.vo.type == 3) {
                        this.mainModel.vo.answer = opt;
                    } else {
                        this.mainModel.vo.answer += opt;
                        this.mainModel.vo.answer = this.mainModel.vo.answer.split("").sort().join("");
                    }
                }
            },
            doLoadKindEditor: function () {
                KindEditor.create("textarea[name='kindEditor']", {
                    resizeType: 1,
                    filterMode: false,//true时过滤HTML代码，false时允许输入任何代码。
                    allowPreviewEmoticons: false,
                    allowUpload: false,//允许上传
                    allowImageUpload: false,
                    syncType: 'form',
                    urlType: 'domain',//absolute
                    newlineTag: 'br',//回车换行br|p
                    allowFileManager: false,
                    allowMediaUpload: false,
                    formatUploadUrl: false,
                    items: [
                        'source', '|', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
                        'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
                        'insertunorderedlist', '|', 'emoticons', 'image', 'link', 'plainpaste', 'media'],
                    afterBlur: function () {
                        this.sync();
                    }
                });
            },
        },
        events: {},
        init: function () {
            this.$api = api;
        }
    });

    return detail;
});