define(function(require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./approvalSetting.html");

    var approvalFormModal = require("./approvalFormModal");


    //Vue数据
    var dataModel = {
        mainModel: {
            opType: 'view',
            isReadOnly: true
        },
        approvalFormModel: {
            visible: false
        },
        enableProcess: false,
        columns: [
            // {
            //     title: "审批节点"
            // },
            {
                title: "审批节点名称",
                fieldName: "name"
            },
            {
                title: "签署方式",
                render: function (data) {
                    var m = {
                        '1': '或签',
                        '2': '会签'
                    };
                    return m[data.signWay]
                }
            }
        ],
        values: []
    };
    //Vue组件
    /**
     *  请统一使用以下顺序配置Vue参数，方便codeview
     *	el
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
        mixins: [LIB.VueMixin.dataDic],
        template: tpl,
        components: {
            approvalFormModal: approvalFormModal
        },
        props: {
            type: {
                type: String,
                default: ''
            },
            hasAuth: {
                type: Boolean,
                default: false
            }
        },
        data: function() {
            return dataModel;
        },
        computed: {
            tools: function () {
                return this.hasAuth ? ['update', 'del'] : ['update'];
            },
        },
        methods: {
            doClose: function() {
                this.$dispatch("ev_dtClose2");
            },
            toggleEnable: function (checked) {
                var val = checked ? '1' : '0';
                this.lookup.value = val;
                api.updateLookupItem({id: this.lookup.lookupId}, this.lookup).then(function (res) {
                    LIB.Msg.success("修改成功");
                })
            },


            doAddProcess: function () {
                var _this = this;

                if (this.auditingExist) {
                    LIB.Modal.confirm({
                        title: '还有正在审核中的数据，确定新增审核节点？',
                        onOk: function() {
                            _this.approvalFormModel.visible = true;
                            _this.$refs.formModal.init("create", _this.values.length)
                        }
                    });
                    return;
                }

                this.approvalFormModel.visible = true;
                this.$refs.formModal.init("create", this.values.length)
            },
            doSavedProcess: function (exit) {
                if(exit == 'exit') {
                    this.approvalFormModel.visible = false;
                }
                this._getList();
            },
            doUpdateProcess: function (item) {
                var _this = this;

                if (this.auditingExist) {
                    LIB.Modal.confirm({
                        title: '还有正在审核中的数据，确定修改审核流程？',
                        onOk: function() {
                            _this.approvalFormModel.visible = true;
                            _this.$refs.formModal.init("update", item.id);
                        }
                    });
                    return;
                }

                this.approvalFormModel.visible = true;
                this.$refs.formModal.init("update", item.id);
            },
            doDeleteProcess: function (item) {
                var title = this.auditingExist ? '还有正在审核中的数据，确定删除审核节点？' : '确定删除数据？';
                var _this = this;
                LIB.Modal.confirm({
                    title: title,
                    onOk: function() {
                        api.remove(null, {id: item.id}).then(function() {
                            LIB.Msg.info("删除成功");
                            _this._getList();
                        });
                    }
                });
            },

            _getList: function () {
                var _this = this;

                api.list({curPage: 1, pageSize: 999, type: this.type}).then(function (res) {
                    _this.values = res.data.list;
                })
            },
            _queryLookupItem: function () {
                var _this = this;

                api.queryLookupItem().then(function (res) {
                    _this.lookup = _.find(_.get(res.data, "[0].lookupItems"), "name", _this.type);
                    _this.enableProcess = (_.get(_this.lookup, "value") === '1');
                })
            },
            // 查询是否有正则审核中的数据
            _checkAuditingExist: function () {
                var _this = this;
                api.checkAuditingExist({type: this.type}).then(function (res) {
                    _this.auditingExist = res.data;
                })
            },
            _init: function () {
                this.enableProcess = false;
                this._queryLookupItem();
                this._getList();
                this._checkAuditingExist();
            }
        },
        events: {
            "ev_dtReload2": function () {
                this._init();
            }
        },
        init: function () {
            this.$api = api;
        }
    });

    return detail;
});
