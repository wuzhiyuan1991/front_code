define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var tpl = require("text!./copy.html");
    var newVO = function () {
        return {
            id: null,
            destCompId: null,
            destOrgId: null,
        }
    };

    //数据模型
    var dataModel = {
        mainModel: {
            vo: newVO(),
        },
        rules: {
            destCompId: [
                {required: true, message: '请选择公司'}
            ]
        },
        copyPercent: 0,
        showPercent: false
    };

    //声明detail组件
    var detail = LIB.Vue.extend({
        template: tpl,
        data: function () {
            return dataModel;
        },
        methods: {
            //确定
            doOk: function () {
                this._startPercent();
                var _this = this;
                var vo = _this.mainModel.vo;
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        if (_.isNull(vo.destOrgId)) {
                            vo.destOrgId = vo.destCompId;
                        }
                        api.copy({courseId: vo.id, destCompId: vo.destCompId, destOrgId: vo.destOrgId}).then(function () {
                            _this._endPercent();
                        })
                    }
                });
            },
            _percentAutoGrow: function () {
                if (this.copyPercent < 50) {
                    this.copyPercent += 4
                } else if (this.copyPercent < 75) {
                    this.copyPercent += 3
                } else if (this.copyPercent < 96) {
                    this.copyPercent += 2
                } else {
                    clearInterval(this.timer);
                }
            },
            _startPercent: function () {
                this.copyPercent = 0;
                this.showPercent = true;
                this.timer = setInterval(this._percentAutoGrow, 300)
            },
            _endPercent: function () {
                var _this = this;
                clearInterval(this.timer);
                this.copyPercent = 100;
                setTimeout(function () {
                    _this.$emit("do-copy-finished");
                    _this.showPercent = false;
                }, 300)
            },
            _init: function (nVal) {
                var _vo = dataModel.mainModel.vo;
                this.$refs.ruleform.resetFields();
                _.extend(_vo, newVO());
                _vo.id = nVal;
                this.copyPercent = 0;
            }
        },
        events: {
            //edit框数据加载
            "ev_editReload_copy": function (nVal) {
                this._init(nVal);
            }
        },
        ready: function () {
        }
    });
    return detail;
});