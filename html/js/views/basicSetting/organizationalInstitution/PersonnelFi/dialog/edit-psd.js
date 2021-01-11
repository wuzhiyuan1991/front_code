define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var tpl = require("text!./edit-psd.html");
    var base64 = require('base64');

    var newVO = function () {
        return {
            id:null,
            username: null,
            mobile: null,
            email: null,
            leaderId: null,
            orgId: null,
            code: null,
            loginName:null,
            userVO:{
                loginName:null,
                password:null
           },
            password:null,
            psdTipList1:[],
            psdTipList2:[],
            limiting:[
                {
                    checked:false,
                    content:"字母",
                    reg: '[a-zA-Z]+'
                },
                {
                    checked:false,
                    content:"数字",
                    reg: '[0-9]+'
                },
                {
                    checked:false,
                    content:"大小写字母",
                    reg: '(?=.*[A-Z].*)(?=.*[a-z].*)',
                },
                {
                    checked:false,
                    content:"特殊字符",
                    reg: '[~!@#$%^.&*]+'
                },
            ],
            passwordDetail:{
                miniLength:null,
                effecTime:null,
                retryLimit:null,
                lockingTime:null,
                letter:null,
                number:null,
                caseLetter:null,
                specialCharacter:null
            }
        }
    };

    //数据模型
    var dataModel = {
        mainModel: {
            type: 'single',
            vo: newVO(),
            lengthArr:[
                {
                    value: "1",
                    number: "6"
                },
                {
                    value: "2",
                    number: "8"
                },
                {
                    value: "3",
                    number: "10"
                },
                {
                    value: "4",
                    number: "无限制"
                }
            ],
        },
        rules: {
            password: [
                {required: true, message: '请输入密码'}
            ]
        },
        tipContent:null,
        isShow:true,
        obj:null,
        alwaysSee:true,
        tpsName:null

    };

    //声明detail组件
    var detail = LIB.Vue.extend({
        template: tpl,
        props: {
            userType: Number
        },
        data: function () {
            return dataModel;
        },
        methods: {
            //确定
            doOk: function () {
                var _this = this;
                var callback = function (res) {
                    //_this.$dispatch("ev_psdFinshed",_this.mainModel.vo);
                    _this.$emit("do-psd-finshed", _this.mainModel.vo);
                    LIB.Msg.info("保存成功");
                };
                _this.mainModel.vo.userVO.password = _this.mainModel.vo.password;
                var password = _this.mainModel.vo.password;
                //用来判断是否满足长度限制条件
                var flag = false;
                //用于判断是否满足内容限制条件
                var i = 0;
                //判断密码的长度，不符合标准则提示
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        var jsonPassword = {
                            mobile:_this.mainModel.vo.userVO.mobile,
                            resetPwd: password,
                        }
                        var json_str = JSON.stringify(jsonPassword);
                        var resetPassword = Base64.encode(json_str);

                        if (_this.obj == 'E30000') {
                            if (dataModel.mainModel.type == 'batch') {

                            } else {
                                api.reset({key:resetPassword}).then(callback);
                            }
                        } else {
                            // var str =  JSON.parse(_this.obj);
                            _.deepExtend(_this.mainModel.vo.passwordDetail, _this.obj);
                            _this.mainModel.vo.limiting[0].checked = _this.mainModel.vo.passwordDetail.letter ? true : false;
                            _this.mainModel.vo.limiting[1].checked = _this.mainModel.vo.passwordDetail.number ? true : false;
                            _this.mainModel.vo.limiting[2].checked = _this.mainModel.vo.passwordDetail.caseLetter ? true : false;
                            _this.mainModel.vo.limiting[3].checked = _this.mainModel.vo.passwordDetail.specialCharacter ? true : false;
                            _.each(_this.mainModel.lengthArr, function (item, index) {
                                if (item.value == _this.mainModel.vo.passwordDetail.miniLength) {
                                    if (password.length < item.number) {
                                        _this.tipContent = "设置失败，密码最小长度为" + item.number + "位";
                                        LIB.Msg.info(_this.tipContent);
                                        flag = false;
                                        return false;
                                    } else {
                                        flag = true;
                                    }
                                } else {
                                    flag = true;
                                }
                            });
                            //密码长度不符合，则不继续判断
                            if (!flag) {
                                return false;
                            }
                            //避免“大小写字母”和“字母”重复添加
                            if (_this.mainModel.vo.limiting[0].checked && _this.mainModel.vo.limiting[2].checked) {
                                //push之前先请空，避免之前还存在元素
                                _this.mainModel.vo.psdTipList1 = [];
                                _.each(_this.mainModel.vo.limiting, function (val, index) {
                                    if (index != 0) {
                                        _this.mainModel.vo.psdTipList1.push(val);
                                    }
                                });
                            } else {
                                _this.mainModel.vo.psdTipList1 = [];
                                _.each(_this.mainModel.vo.limiting, function (val, index) {
                                    _this.mainModel.vo.psdTipList1.push(val);
                                });
                            }
                            ;
                            //把密码限制条件push到一个数组
                            _this.mainModel.vo.psdTipList2 = [];
                            _.each(_this.mainModel.vo.psdTipList1, function (val, index) {
                                if (val.checked) {
                                    _this.mainModel.vo.psdTipList2.push(val);
                                }
                            });
                            //错误提示的字符串拼接添加规则
                            if (_this.mainModel.vo.psdTipList2.length > 1) {
                                var tips = "";
                                i = 0;
                                _.each(_this.mainModel.vo.psdTipList2, function (ele, index) {
                                    if (index == 0) {
                                        tips = "设置失败，密码必须包含"
                                        tips += ele.content;
                                    } else if (index == _this.mainModel.vo.psdTipList2.length - 1) {
                                        tips += '及' + ele.content;
                                    } else {
                                        tips += '、' + ele.content;
                                    }
                                });
                                //正则验证
                                _.each(_this.mainModel.vo.psdTipList2, function (ele) {
                                    if (!password.match(new RegExp(ele.reg))) {
                                        i++;
                                        _this.tipContent = tips;
                                        LIB.Msg.info(_this.tipContent);
                                        return false;
                                    }
                                })
                            } else if (_this.mainModel.vo.psdTipList2.length == 1) {//当内容限制只有一个时
                                if (!password.match(new RegExp(_this.mainModel.vo.psdTipList2[0].reg))) {
                                    _this.tipContent = "设置失败，密码必须包含" + _this.mainModel.vo.psdTipList2[0].content;
                                    LIB.Msg.info(_this.tipContent);
                                    return false;
                                }
                            }
                            //满足长度限制条件和密码内容限制的条件
                            if (flag) {
                                if (!i) {
                                    if (dataModel.mainModel.type == 'batch') {
                                        api.resetBatch({key:resetPassword,type:_this.userType}).then(callback);
                                    }
                                    if (dataModel.mainModel.type == 'single') {
                                        api.reset({key:resetPassword,type:_this.userType}).then(callback);
                                    }
                                }
                            } else {
                                return false;
                            }
                        }
                    } else {
                        return false;
                    }
                })
            },
            doChange:function(data){
                //miniLength代表最小长度 letter 必须包含字母 number必须包含数字 caseLetter包含大小写字母
                //specialCharacter必须包含字母和数字以外的特殊字符
                if(data.miniLength=="1"){
                    this.tpsName = "最小长度6个字符"
                }else if(data.miniLength=="2"){
                    this.tpsName = "最小长度8个字符"
                }else if(data.miniLength=="3"){
                    this.tpsName = "最小长度10个字符"
                }else if(data.miniLength=="4"){
                    this.tpsName = "无限制"
                }
                if(data.letter==1){
                    this.tpsName =this.tpsName + ",必须包含字母"
                }
                if(data.number==1){
                    this.tpsName =this.tpsName + ",必须包含数字"
                }
                if(data.caseLetter==1){
                    this.tpsName =this.tpsName + ",必须包含大小写字母"
                }
                if(data.specialCharacter==1){
                    this.tpsName =this.tpsName + ",必须包含字母和数字以外的特殊字符"
                }
            },
        },
        events: {
            //edit框数据加载
            "ev_editReload_psd": function (nVal) {
                //注意！ events中使用 绑定的data， 需要通过全局对象直接引用， 而methods中可以直接通过this引用到data
                var _data = dataModel.mainModel;
                _data.type = 'single';
                var _vo = dataModel.mainModel.vo;
                this.$refs.ruleform.resetFields();
                var _this = this;
                api.getPsd({type:"PSD_RULE"}).then(function(data){
                    _this.obj = data.body;
                    _this.doChange(_this.obj);
                })
                //清空数据
                _.extend(_vo, newVO());
                _vo.userVO.mobile = nVal;
            },
            "ev_editReload_psd_batch": function (nVal) {
                dataModel.mainModel.type = 'batch';
                //注意！ events中使用 绑定的data， 需要通过全局对象直接引用， 而methods中可以直接通过this引用到data
                this.$refs.ruleform.resetFields();
                var _this = this;
                api.getPsd({type:"PSD_RULE"}).then(function(data){
                    _this.obj = data.body;
                    _this.doChange(_this.obj);
                })
                //清空数据
                _.extend(dataModel.mainModel.vo, newVO());
            },

        },
        ready: function () {

        }
    });

    return detail;
});