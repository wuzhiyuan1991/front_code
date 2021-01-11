define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail.html");
    var testComponent = require("./dialog/test");
    //初始化数据模型
    var newVO = function () {
        return {
            id: null,
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
            mailSmtpIden: null,
            mailSsl: null,
            mailSmtpSsl: null,
            mailSmtpPwd: null,
            attr5: null,
            code: null,
            createDate: null,
            disable: null,
            modifyDate: null,
            org: null,
            mailOrgId:null
        }
    };
    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            isReadOnly:true
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
            mailPort: [
                {type: "number", message: '请输入正确端口－数字'},
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
            ],

        },
        emptyRules:{},
        testModel: {
            //控制编辑组件显示
            title: "新增",
            //显示编辑弹框
            show: false
        },
        //桥接变量 防止iv-chbox组件报错
        mailSmtpIden:null,
        mailSsl:null,
        mailSame:null,
        mailSmtpSsl:null
    };
    //启用停用状态
    var states = {
        "0":"启用",
        "1":"停用"
    }
    //Vue组件
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
    var detail = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth,LIB.VueMixin.detailPanel],
        template: tpl,
        components: {
            "testmailcomponent": testComponent
        },
        data: function () {
            return dataModel;
        },
        computed:{
            disableLable:function(){
                return this.mainModel.vo.disable == '0' ? '启用' : '停用';
            },
            showDisableLable:function(){
                return this.mainModel.vo.disable == '1' ? '启用' : '停用';
            },
            disableLableIcon:function(){
                return this.mainModel.vo.disable == '1' ? 'ios-checkmark-outline' : 'ios-minus-outline';
            }
        },
        methods: {
            newVO : newVO,
            //详情页，点击取消方法
            doCancel:function(){
            	var _this = this;
            	if(_this.mainModel.vo.id) {
            		api.get({id : _this.mainModel.vo.id}).then(function(res){
            			var data = res.data;
            			_this.mainModel.vo = newVO();
            			_.deepExtend(_this.mainModel.vo, data);
            		});
            	}
            	_this.mainModel.isReadOnly = true;
            	_this.afterInitData && _this.afterInitData();
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
            doSave: function () {
                var _this = this;
                var callback = function (res) {
                    // _this.$dispatch("ev_editFinshed",_this.mainModel.vo);
                    _this.$emit("do-finshed",_this.mainModel.vo);
                    _this.mainModel.opType = "update";
                    _this.mainModel.isReadOnly = true;
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
            doEnableDisable:function(){
                var _this = this;
                var updateIds = this.mainModel.vo.id;
                var disable = this.mainModel.vo.disable;
                //0启用，1禁用
                if(disable==0){
                    api.updateDisable([updateIds]).then(function (res) {
                        var diable ="1";
                        LIB.Msg.info("已停用!");
                        dataModel.mainModel.vo.disable = diable;
                        //_this.$dispatch("ev_detailModifyState",dataModel.mainModel.vo);
                        _this.$emit("do-modify-state",dataModel.mainModel.vo)
                    });
                }else{
                    api.updateStartup([updateIds]).then(function (res) {
                        var diable ="0";
                        LIB.Msg.info("已启用!");
                        dataModel.mainModel.vo.disable = diable;
                       // _this.$dispatch("ev_detailModifyState",dataModel.mainModel.vo);
                        _this.$emit("do-modify-state",dataModel.mainModel.vo)
                    });
                }
            },
            doDelete: function () {
				var _this = this;
                var param = {id:_this.mainModel.vo.id}
                api.del(null, param).then(function (res) {
                    _this.$emit("do-detail-delete");
                    LIB.Msg.info("删除成功!");
                });
            },
            doClose:function () {
                //this.$dispatch("ev_detailClosed");
                this.$emit("do-detail-cancel");
            },
            doTestCanceled:function(){
                this.testModel.show = false;
            },
            doDelOrg:function () {
                var _this = this;
                _this.mainModel.vo.mailOrgId = "";
                api.clearOrg({id:this.mainModel.vo.id}).then(function (res) {
                    _this.mainModel.vo.mailOrgId = null;
                    LIB.Msg.info("删除成功!");
                })
            },
            afterInitData:function(){
                var mainModel = dataModel.mainModel;
                if (mainModel.vo.mailSmtpSsl == "1") {
                    this.mailSmtpSsl = true;
                }else{
                    this.mailSmtpSsl = false;
                }
                if (mainModel.vo.mailSsl == "1") {
                    this.mailSsl = true;
                }else{
                    this.mailSsl = false;
                }
                if (mainModel.vo.mailSame == "1") {
                    this.mailSame = true;
                }else{
                    this.mailSame = false;
                }
                if (mainModel.vo.mailSmtpIden == "1") {
                    this.mailSmtpIden = true;
                }else{
                    this.mailSmtpIden = false;
                }
            }
        },
        init: function(){
            this.$api = api;
        }
    });

    return detail;
});