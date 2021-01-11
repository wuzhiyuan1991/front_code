define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var tpl = require("text!./edit-menu.html");

    var newVO = function () {
        return {
            roleList: [],
            roleId: null,
            list: [],
            keys: [],
            data: [],
            authList: [],
            type:"0"
        }
    };

    //数据模型
    var dataModel = {
        mainModel: {
            vo: newVO(),
            rList: [],
            rLength: 0,
            roleLength: 0,
            selectedDatas: []
        }
    };

    //声明detail组件
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
        template: tpl,
        data: function () {
            return dataModel;
        },
        methods: {
            doSave: function () {
                var _this = this;
                var _vo  = this.mainModel.vo;
                var callback = function (res) {
                   // _this.$dispatch("ev_editMenuFinshed");
                    _this.$emit("do-edit-menu-finshed");

                    LIB.Msg.info("保存成功");
                };
                _this.mainModel.vo.authList = [];
                _.each(_this.mainModel.selectedDatas, function (r) {
                    _this.mainModel.vo.authList.push(r.id);
                });
                api.distributionMenu(_.pick(_vo,"authList","roleId","type")).then(callback);
            },
            //doCancel: function () {
            //    this.$dispatch("ev_editRoleCanceled");
            //},
            doChangeGroup: function () {
                alert(1);
            },
            doAddData: function (mId, aId, value) {
                alert(mId + "============================" + aId + "====================" + value);
            }
        },
        events: {
            //edit框数据加载
            "ev_editMenuReload": function (nVal) {
                //注意！ events中使用 绑定的data， 需要通过全局对象直接引用， 而methods中可以直接通过this引用到data
                var _vo = dataModel.mainModel.vo;
                var _model = dataModel.mainModel;
                _model.selectedDatas = [];
                //清空数据
                _.extend(_vo, newVO());

                _vo.roleId = nVal;

                //存在nVal则是update
                api.listMenu({disable:0}).then(function (data) {
                    _vo.data = data.body;
                });

                api.getFunc({roleId: nVal,type:"0"}).then(function (res) {
                    _.each(res.data,function (auth) {
                        _model.selectedDatas.push({id:auth.relId});
                    });

                })


            }
        }
    });

    return detail;
});