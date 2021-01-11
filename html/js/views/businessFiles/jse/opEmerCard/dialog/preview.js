define(function (require) {
    var LIB = require('lib');
    var api = require("../vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./preview.html");

    //Vue组件
    /**
     *  请统一使用以下顺序配置Vue参数，方便codeview
     *     el
     template
     components
     componentName
     props
     data
     computed
     watch
     methods
     _XXX                //内部方法
     doXXX                //事件响应方法
     beforeInit        //初始化之前回调
     afterInit            //初始化之后回调
     afterInitData        //请求 查询 接口后回调
     afterInitFileData  //请求 查询文件列表 接口后回调
     beforeDoSave        //请求 新增/更新 接口前回调，返回false时不进行保存操作
     afterFormValidate    //表单rule的校验通过后回调，，返回false时不进行保存操作
     buildSaveData        //请求 新增/更新 接口前回调，重新构造接口的参数
     afterDoSave        //请求 新增/更新 接口后回调
     beforeDoDelete        //请求 删除 接口前回调
     afterDoDelete        //请求 删除 接口后回调
     events
     vue组件声明周期方法
     init/created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
     **/
    var detail = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
        template: tpl,
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            id: {
                type: String,
                default: ''
            }
        },
        data: function () {
            return {
                vo: null,
                items: null
            };
        },
        watch: {
            visible: function (val) {
                if (val && this.id) {
                    this._init();
                }
            }
        },
        methods: {
            doClose: function () {
                this.visible = false;
            },
            doPrint: function () {
                window.print();
            },
            _init: function () {
                this._getVO();
                this._getItems();
            },
            _getVO: function () {
                var _this = this;
                api.get({id: this.id}).then(function (res) {
                    _this.vo = _.pick(res.data, ["name", "code", "attr1"]);
                })
            },
            _getItems: function () {
                var _this = this;
                this.items = null;
                api.getGroupAndItem({id: this.id}).then(function (res) {
                    var groups = _.map(res.data.OpEmerStep, function (item) {
                        return {
                            id: item.id,
                            name: item.name,
                            orderNo: item.orderNo
                        }
                    });
                    var items = _.map(res.data.OpEmerStepItem, function (item) {
                        return {
                            stepId: item.stepId,
                            orderNo: item.orderNo,
                            content: item.content && item.content.replace(/[\r\n]/g, '<br/>'),
                            principal: item.principal
                        }
                    });
                    _this._convertData(groups, items);
                })
            },
            _convertData: function (groups, items) {
                // 组按orderNo排序
                var _groups = _.sortBy(groups, function (group) {
                    return parseInt(group.orderNo);
                });
                // 项按stepId分组
                var _items = _.groupBy(items, "stepId");
                // 项按orderNo排序, 并将项添加到对应的组中
                _.forEach(_groups, function (group) {
                    group.items = _.sortBy(_items[group.id], function (item) {
                        return parseInt(item.orderNo);
                    });
                });

                this.items = _groups;
            }

        },
        events: {},
        init: function () {
            this.$api = api;
        }
    });

    return detail;
});