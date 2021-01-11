/**
 * Created by yyt on 2016/11/2.
 */
define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./edit.html");
    var testComponent = require("./dialog/test");

    //初始化数据模型
    var newVO = function () {
        return {
            mailAccname: null,
            mailServer: null,
            mailPort: null,
            mailUsername: null,
            mailAddress: null,
            mailSmtpServer: null,
            mailSmtpName: null,
            mailProt: null,
            mailPwd: null,
            mailName: null,
            mailSmtpPort: null,
            mailSame: null,
            mailSmtpIden: false,
            mailSsl: null,
            mailSmtpSsl: null,
            mailSmtpPwd: null,
            id: null,
            attr5: null,
            code: null,
            createDate: null,
            disable: null,
            modifyDate: null,
            mailOrgId: null
        }
    };
    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            opType: "",
            addShow:false,
            isReadOnly:false
        },
        testModel: {
            //控制编辑组件显示
            title: "新增",
            //显示编辑弹框
            show: false
        },
        rules: {
        	mailUsername: [
                {required: true, message: '请输入账户名'},
                LIB.formRuleMgr.length(25,1)
                //{ min: 1, max: 25, message: '长度在 1 到 25 个字符'}
            ],
            mailServer: [  //type可不写，默认为string，同一字段非string类型需多次配置type
                {required: true, message: '请输入服务器'},
                LIB.formRuleMgr.length(25,1)
                //{ min: 1, max: 25, message: '长度在 1 到 20 个字符'}
            ],
            mailAccname: [
                {required: true, message: '请输入用户名'},
                LIB.formRuleMgr.length(25,1)
                //{ min: 1, max: 20, message: '长度在 1 到 20 个字符'}
            ],
            mailAddress: [
                {required: true, message: '请输入邮件地址'},
                {type:'email', message: '请输入正确邮件地址'}
            ],
            mailSmtpServer: [
                {required: true, message: '请输入SMTP服务器'},
                LIB.formRuleMgr.length(25,1)
                //{ min: 1, max: 25, message: '长度在 1 到 20 个字符'}
            ],
            mailSmtpName: [
                {required: true, message: '请输入SMTP用户名'},
                LIB.formRuleMgr.length(25,1)
                //{ min: 1, max: 25, message: '长度在 1 到 25 个字符'}
            ],
            mailPwd: [
                {required: true, message: '请输入密码'},
                LIB.formRuleMgr.length(25,1)
                //{ min: 1, max: 25, message: '长度在 1 到 25 个字符'}
            ],
            mailName: [
                {required: true, message: '请输入邮件名称'},
                LIB.formRuleMgr.length(25,1)
                //{ min: 1, max: 25, message: '长度在 1 到 20 个字符'}
            ],
            //mailPort: [
            //    {type:'integer', message: '端口号类型不匹配'}
            //],
            mailSmtpPort: [
                {type:'integer', message: 'SMTP端口类型不匹配'}
            ]
        },
        emptyRules:{},
        mailSmtpSsl:null,
        mailSsl:null,
        mailSame:null,
        mailSmtpIden:null
    };
    //Vue组件
    var edit = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth,LIB.VueMixin.detailPanel],
        template: tpl,
        components: {
            "testmailcomponent": testComponent
        },
        data: function () {
            return dataModel;
        },
        methods: {
            //详情页，点击取消方法
            doCancel:function(){
                var _this = this;
                if(_this.mainModel.vo.id) {
                    api.get({id : _this.mainModel.vo.id}).then(function(res){
                        var data = res.data;
                        _.deepExtend(_this.mainModel.vo, data);
                    });
                }
                _this.mainModel.isReadOnly = true;
            },
            doSave: function () {
                var _this = this;
                var callback = function (res) {
                   // _this.$dispatch("ev_editFinshed",_this.mainModel.vo);
                    _this.$emit("do-finshed",_this.mainModel.vo);
                    LIB.Msg.info("保存成功");
                }

                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        if (_this.mailSmtpSsl) {
                            _this.mainModel.vo.mailSmtpSsl = 1;
                        } else {
                            _this.mainModel.vo.mailSmtpSsl = 0;
                        }
                        if (_this.mailSsl) {
                            _this.mainModel.vo.mailSsl = 1;
                        } else {
                            _this.mainModel.vo.mailSsl = 0;
                        }
                        if (_this.mailSame) {
                            _this.mainModel.vo.mailSame = 1;
                        } else {
                            _this.mainModel.vo.mailSame = 0;
                        }
                        if (_this.mailSmtpIden) {
                            _this.mainModel.vo.mailSmtpIden = 1;
                        } else {
                            _this.mainModel.vo.mailSmtpIden = 0;
                        }
                        if (_this.mainModel.opType == "create") {
                            api.create(_.omit(_this.mainModel.vo, "")).then(callback);
                        } else {
                            api.update(_.omit(_this.mainModel.vo, "")).then(callback);
                        }
                    } else {
                        return false;
                    }})
            },
            doClose: function () {
                //this.$dispatch("ev_editCanceled");
                this.$emit("do-cancel");
                //this.testModel.show = false;
            },
            doTest: function () {
                var status = -1;
                var _this = this;
                this.testModel.show = true;
                this.testModel.title = "邮箱测试";
                api.test(_.omit(this.mainModel.vo, "mailSmtpIden", "mailSame", "mailSsl", "mailSmtpSsl")).then(function (res) {
                    status = res.data;
                });
                setTimeout(function () {
                    _this.$broadcast('ev_editEmail', status);
                }, 3000);
            },
            doTestCanceled:function(){
                this.testModel.show = false;
            },
        },
        events: {
            //edit框数据加载
            //"ev_editCanceled": function () {
            //    this.testModel.show = false;
            //},
            "ev_editReload": function (nVal) {
                var _vo = dataModel.mainModel.vo;
                var _data = dataModel.mainModel;
                this.$refs.ruleform.resetFields();
                //清空数据
                _.extend(_vo, newVO());
                if (nVal != null) {
                    _data.opType = "update";
                    api.get({id: nVal}).then(function (res) {
                        //初始化数据
                        _.deepExtend(_vo, res.data);

                        if (_vo.mailSmtpSsl == "1") {
                            _vo.mailSmtpSsl = true;
                        }else{
                            _vo.mailSmtpSsl = false;
                        }
                        if (_vo.mailSsl == "1") {
                            _vo.mailSsl = true;
                        }else{
                            _vo.mailSsl = false;
                        }
                        if (_vo.mailSame == "1") {
                            _vo.mailSame = true;
                        }else{
                            _vo.mailSame = false;
                        }
                        if (_vo.mailSmtpIden == "1") {
                            _vo.mailSmtpIden = true;
                        }else{
                            _vo.mailSmtpIden = false;
                        }
                    });
                    this.mainModel.addShow = false;
                } else {
                    _data.opType = "create";
                    _vo.mailSmtpSsl = false;
                    _vo.mailSsl = false;
                    _vo.mailSame = false;
                    _vo.mailSmtpIden = false;
                    this.mainModel.addShow = true;
                }
            }

        },
        ready:function(){
            if(this.mainModel.isReadOnly = false) {
                this.placeholder="";
            }
        }

    });

    return edit;
});