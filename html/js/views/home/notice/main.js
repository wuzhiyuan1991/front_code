define(function (require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    var actions = require("../vuex/actions");
    var api = require("./vuex/api");

    var noticeItem = require("./notice");
    
    var newVO = function () {
        return {
            id: '',
            code: '',
            title: '',
            content: '',
            compId: '',
            day: '',
            failureDate: ''
        }
    };
    var dataModel = {
        notices: [],
        logs: [],
        mainModel: {
            vo: newVO(),
            showForm: false,
            rules: {
                "title": [
                    LIB.formRuleMgr.require("标题"),
                    LIB.formRuleMgr.length(30, 0)
                ],
                "content": [
                    LIB.formRuleMgr.require("内容"),
                    LIB.formRuleMgr.length(500, 0)
                ],
                "compId": [
                    LIB.formRuleMgr.require("所属公司"),
                    LIB.formRuleMgr.length()
                ],
                "day": [
                    LIB.formRuleMgr.require("保留天数"),
                    LIB.formRuleMgr.length(5),
                    {type: 'positiveInteger', message: '只能输入正整数'}
                    // {
                    //     validator: function(rule, value, callback) {
                    //         var r = /^[0-9]*[1-9][0-9]*$/g;
                    //         var isNegative = r.test(value);
                    //         return isNegative ? callback() : callback(new Error("保留天数必须是正整数"));
                    //     }
                    // }
                ]
            },
            file: {
                id: ''
            }
        },
        pageModel: {
            curPage: 1,
            isLastPage: true
        },
        fileModel: {
            params:{
                recordId : null,
                dataType : 'CC1',
                fileType : 'CC'
            },
            filters:{
                max_file_size: '20mb'
            }
        }
    };

    //首页效果
    var home = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
        template: template,
        components: {
            noticeItem:noticeItem
        },
        data: function () {
            return dataModel;
        },

        methods: {
            newVO: newVO,
            doDelete: function (item) {
                var _this = this;
                LIB.Modal.confirm({
                    title: '删除当前通知?',
                    onOk: function() {
                        _this.$api.remove(null, item).then(function () {
                            LIB.Msg.info("删除成功");
                            _this.pageModel.curPage = 1;
                            _this.getNotices();
                            _this.getLogs();
                        })
                    }
                });

            },
            doUploadSuccess: function (data) {
                this.mainModel.file = {
                    id: data.rs.content.id,
                    name: data.file.name
                };
                LIB.Msg.info("上传成功");
            },
            doDeleteFile: function() {
                var _this = this;
                this.$api.deleteFile(null, [this.mainModel.file.id]).then(function () {
                    _this.mainModel.file = {id : ''};
                })
            },
            addNotice: function () {
                var _this = this;
                this.mainModel.vo = newVO();
                this.mainModel.vo.compId = LIB.user.compId;
                this.mainModel.showForm = true;
                this.$api.getUUID().then(function (res) {
                    _this.mainModel.vo.id = res.data;
                    _this.fileModel.params.recordId = res.data;
                })
            },
            hideForm: function () {
                this.mainModel.showForm = false;
                this.$refs.ruleform.resetFields();
                this.mainModel.vo.id = '';
                this.fileModel.params.recordId = '';
                this.mainModel.file = {id: ''};
            },
            doSave: function () {
                var _this = this;
                var vo = this.mainModel.vo;
                this.$refs.ruleform.validate(function(valid) {
                    if(valid) {
                        var today = new Date();
                        vo.failureDate = new Date(today.setDate(today.getDate() + parseInt(vo.day))).Format("yyyy-MM-dd hh:mm:ss");
                        var _vo = _.omit(vo, 'day');
                        _this.$api.create(_vo).then(function (res) {
                            _this.pageModel.curPage = 1;
                            LIB.Msg.info("发布成功");
                            _this.getNotices();
                            _this.getLogs();
                            _this.mainModel.showForm = false;
                            _this.mainModel.vo = _this.newVO();
                            _this.mainModel.file = {id: ''};
                        })
                    }
                })
            },
            getNotices: function () {
                var _this = this;
                var params = {
                    curPage: this.pageModel.curPage,
                    pageSize: 20
                };
                this.$api.list(params).then(function (res) {
                    if(_this.pageModel.curPage === 1) {
                        _this.notices = res.data.list;
                    } else {
                        _this.notices = _this.notices.concat(res.data.list);
                    }
                    _this.pageModel.isLastPage = res.data.isLastPage;
                })
            },
            getLogs: function () {
                var _this = this;
                var params = {
                    curPage: 1,
                    pageSize: 20
                };
                this.$api.listLogs(params).then(function (res) {
                    _this.logs = res.data.list;
                })
            },
            onScroll: function (event) {
                var el = event.target;
                if(el.scrollHeight - (el.scrollTop +  el.clientHeight) < 50 ) {
                    if(!this.pageModel.isLastPage) {
                        this.pageModel.curPage += 1;
                        this.getNotices();
                        this.pageModel.isLastPage = true;
                    }
                }
            }
        },
        events: {

        },
        //初始化
        ready: function () {
            this.getNotices();
            this.getLogs();
        },
        init: function () {
            this.$api = api;
            this.__auth__ = this.$api.__auth__;
        }
    });
    return home;
});
