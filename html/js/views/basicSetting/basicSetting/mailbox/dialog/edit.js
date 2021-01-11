define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var tpl = require("text!./edit.html");

    var newVO = function () {
        return {
            id: null
        }
    };

    //数据模型
    var dataModel = {
        mainModel: {
            vo: newVO(),
            //当前的操作类型， create：创建， update ：更新， 影响'保存'按钮的事件处理
            opType: "",
            data: [],
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
                var callback = function (res) {
                    //_this.$dispatch("ev_editFinshed",_this.mainModel.selectedDatas[0].id);
                    _this.$emit("do-edit-finshed");
                    LIB.Msg.info("保存成功");
                    _this.mainModel.selectedDatas = [];
                }
                if(!_this.mainModel.selectedDatas[0].id){
                    LIB.Msg.info("请至少关联一家公司!");
                    return;
                }
                api.updateCompany({mailOrgId: _this.mainModel.selectedDatas[0].id, id: _this.mainModel.vo.id}).then(callback);
                //this.$dispatch("ev_editCanceled");
                this.$emit("do-cancel");
            },
            //doCancel: function () {
            //    this.$dispatch("ev_editCanceled");
            //}
        },
        events: {
            //edit框数据加载
            "ev_editAffiliates": function (nVal) {
                //注意！ events中使用 绑定的data， 需要通过全局对象直接引用， 而methods中可以直接通过this引用到data
                var _mainModel = dataModel.mainModel;
                var orgId = null;
                //清空数据
                _.extend(_mainModel.vo, newVO());
                _mainModel.vo.id = nVal;
                _mainModel.selectedDatas = [];
                //清空树数据 解决选中打开闪烁问题
                _mainModel.data=[];
                if (nVal != null) {
                    api.get({id: nVal}).then(function (res) {
                        //初始化数据
                        _mainModel.selectedDatas = [{id: res.data.mailOrgId}];
                    });
                }

                api.listOrg({type:1}).then(function (res1) {
                    _mainModel.data = res1.data;
                });

                //存在nVal则是update
                //setTimeout(function(){
                //    api.listOrg({type:1}).then(function (res) {
                //        _mainModel.data = res.data; debugger
                //    });
                //
                //},1000)
            }
        }
    });
    return detail;
});