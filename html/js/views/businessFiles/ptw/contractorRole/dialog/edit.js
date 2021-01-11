define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var tpl = require("text!./edit.html");

    var newVO = function () {
        return {
            id: null,
            name: null,
            code: null

        }
    };

    //数据模型
    var dataModel = {
        mainModel: {
            vo: newVO(),
            //当前的操作类型， create：创建， update ：更新， 影响'保存'按钮的事件处理
            opType: "",
        },
        rules: {
            name: [
                {required: true, message: '请输入角色名称'},
                LIB.formRuleMgr.length(30,1)
                //{ min: 1, max: 30, message: '长度在 1 到 30 个字符'}
            ],
            //br 4009
             code: LIB.formRuleMgr.code("权限编码"),
        }

    };

    //声明detail组件
    var detail = LIB.Vue.extend({
        template: tpl,
        data: function () {
            return dataModel;
        },
        methods: {
            doSave: function () {
                var _this = this;
                var callback = function (res) {
                    //_this.$dispatch("ev_editFinshed", _this.mainModel.vo);
                    _this.$emit("do-edit-finshed", _this.mainModel.vo);
                    LIB.Msg.info("保存成功");
                }
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        if (_this.mainModel.opType == "create") {
                            api.create(_.omit(_this.mainModel.vo, "id", "posList")).then(callback);
                        } else {
                            api.update(_.omit(_this.mainModel.vo, "posList")).then(callback);
                        }
                    } else {
                        return false;
                    }
                })
            },
            //doCancel: function () {
            //    this.$dispatch("ev_editCanceled");
            //},
            convertPicPath: LIB.convertPicPath
        },
        events: {
            //edit框数据加载
            "ev_editReload": function (nVal) {
                //注意！ events中使用 绑定的data， 需要通过全局对象直接引用， 而methods中可以直接通过this引用到data
                var _data = dataModel.mainModel;
                var _vo = dataModel.mainModel.vo;
                this.$refs.ruleform.resetFields();
                //清空数据
                _.extend(_vo, newVO());
                //存在nVal则是update

                if (nVal != null) {
                    _data.opType = "update";
                    api.get({id: nVal}).then(function (res) {
                        //初始化数据
                        _.deepExtend(_vo, res.data);
                    });
                } else {
                    _data.opType = "create";
                }
            }
        }
    });

    return detail;
});