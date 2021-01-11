define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var tpl = require("text!./convert.html");
    var actions = require("app/vuex/actions");

    var newVO = function () {
        return {
            id: null,
            auditResult: null,
            remarks:null,
            operationType:null
        }
    };

    //数据模型
    var dataModel = {
        mainModel: {
            vo: newVO(),
            isReadOnly: true
        },
        //验证规则
        rules: {
            auditResult: [{required: true, message: '请选择审批结果'}],
            remarks: [LIB.formRuleMgr.length(500, 0)],
        },
        hasPoolAuditAccess: false,
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
        mixins: [LIB.VueMixin.dataDic],
        template: tpl,
        components: {
        },
        data: function () {
            return dataModel;
        },
        methods: {
            doClose: function(){
                this.$dispatch("ev_convertColsed");
            },
            doSave: function (flag) {
                var _this = this;
                var _vo = this.mainModel.vo;
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        api.audit(_.pick(_vo, "id", "auditResult", "remarks")).then(function (res) {
                            if(flag == '1' && !!res.data && !!res.data.id) {
                                var opt = {
                                    path:  LIB.PathCode["BC_HG_AG"],
                                    method: 'select',
                                };
                                var param = {
                                    id: res.data.id,
                                    code: res.data.title,
                                }
                                var extra = {status: res.data.status,action:'audit'};
                                _this.setGoToInfoData({
                                    opt: opt,
                                    vo: param,
                                    extra: extra
                                });
                            }
                            _this.$emit("do-convert-finshed");
                            LIB.Msg.info("审批成功");
                        });
                    }
                });
            },
        },
        events: {
            //convert框数据加载
            "ev_convertReload": function (obj) {
                var _this = this;
                dataModel.mainModel.vo = newVO();
                //清空验证
                this.$refs.ruleform.resetFields();
                this.mainModel.isReadOnly = true;
                //注意！ events中使用 绑定的data， 需要通过全局对象直接引用， 而methods中可以直接通过this引用到data
                var _vo = dataModel.mainModel.vo;
                //清空数据
                _.deepExtend(_vo, obj);

                api.checkPoolAuditor({id: obj.id}).then(function(res){
                    if(res.data) {
                        _this.hasPoolAuditAccess = true;
                    }
                });
            }
        },
        vuex: {
            actions: {
                setGoToInfoData: actions.updateGoToInfoData
            }
        }
    });

    return detail;
});