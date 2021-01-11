define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("../../vuex/api");
    var tpl = require("text!./approval.html");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var multiSelectInput = require("../../assign/dialog/multiSelectInput");

    var newVO = function () {
        return {
            id: null,
            status: null,
            users: null,
            remark: null
        }
    };

    var mapUsers = function(users){
        return _.map(users,function(user){
                        return {id:user.id, name:user.name};
                    });
    };
    //去重合并用户列表
    var concatUsers = function(target, source){
        _.each(source, function(u1){
            if(!_.some(target, function(u2){return u1.id === u2.id;})){
                target.push(u1);
            }
        });
    };

    //数据模型
    var dataModel = {
        mainModel: {
            vo: newVO(),
            //当前的操作类型， create：创建， update ：更新， 影响'保存'按钮的事件处理
            opType: "",
            status: LIB.getDataDicList("pool_approval_status")
        },
        selectModal:{
            //是否允许修改下一环节操作者
            enableUpdateUsers:false,
            userSelectModel:{
                visible:false,
                users:null
            }
        },
        //验证规则
        rules: {
            status: [
                {required: true, message: '请选择审批结果'}
            ],
            remark: [
                {required: true, message: '请输入审批意见'},
                LIB.formRuleMgr.length(500,1)
                //{min: 1, max: 500, message: '长度在 1 到 500 个字符'}
            ]
        },
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
        components: {
            "userSelectModal":userSelectModal,
            "multiSelectInput":multiSelectInput
        },
        data: function () {
            return dataModel;
        },
        watch:{
            'mainModel.vo.status':function(newVal){
                var settings = _.find(this.mainModel.status, function(s){return newVal == s.id});
                if(settings && settings.taskSettings && settings.taskSettings.enableUpdate){
                    this.selectModal.enableUpdateUsers = true;
                    this.selectModal.userSelectModel.users = mapUsers(settings.taskSettings.users);
                }else{
                    this.selectModal.enableUpdateUsers = false;
                }
            }
        },
        methods: {
            doSelectUsers:function(){
                this.selectModal.userSelectModel.visible = true;
            },
            doSaveUser:function(selectedDatas){
                if (selectedDatas) {
                    concatUsers(this.selectModal.userSelectModel.users, selectedDatas);
                }
            },
            doSave: function () {
                var _this = this;
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        var formData = _.pick(_this.mainModel.vo, "id", "status", "remark");
                        formData.transferId = _.map(_this.selectModal.userSelectModel.users,function(user){
                            return user.id;
                        }).join(",");
                        api.approval(null, formData).then(function (res) {
                            if (res.data && res.error != '0') {
                                LIB.Msg.warning("审核失败");
                                return;
                            } else {
                                _this.$dispatch("ev_approvalFinshed", _this.mainModel.vo);
                                LIB.Msg.info("审核成功");
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            doCancel: function () {
                this.$dispatch("ev_approvalCanceled");
            },
            convertPicPath: LIB.convertPicPath
        },
        events: {
            //框数据加载
            "ev_approvalReload": function (nVal) {
                //注意！ events中使用 绑定的data， 需要通过全局对象直接引用， 而methods中可以直接通过this引用到data
                //清空数据
                _.extend(dataModel.mainModel.vo, newVO());
                dataModel.mainModel.vo.id = nVal;
                dataModel.mainModel.status = [];
                api.approvalStatus({"id":nVal}).then(function(res){
                    dataModel.mainModel.status = res.data;
                });
            }
        },
        ready:function(){
            var _this = this;
            //设置审批用户校验规则
            this.rules.users = [
                {required: true, validator:function(rule,value,callback){
                    if(_this.selectModal.enableUpdateUsers && _.isEmpty(_this.selectModal.userSelectModel.users)){
                        callback("下一环节审批人不能为空");
                    }else{
                        callback();
                    }
                }}
            ];
        }
    });

    return detail;
});