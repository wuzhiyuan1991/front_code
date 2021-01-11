define(function (require) {
    var LIB = require('lib');

    var api = require("./vuex/api");

    var base64 = require('base64');

    //右侧滑出详细页
    var tpl = require("text!./detail.html");

    //基本信息
    var basicInformation = require("./tabs/basicInformation");
    //头像设置
    var avatarSettings = require("./tabs/avatarSettings");
    //修改密码
    var changePassword = require("./tabs/changePassword");

    //初始化数据模型
    var newVO = function () {
        return {
            workState:null,
            username: null,
            mobile: null,
            email: null,
            leaderId: null,
            orgId: null,
            userDetail: {
                idcard: null,//身份证号
                nativePlace: null,//籍贯
                address: null,//现居住地
                education: null,
                sex: null,
                maritalStatushuan: null,//婚姻状况
                emergencyTelephone: null,//紧急联系电话
                emergencyPeople: null//紧急联系人
            },
            org: {
                name: null//机构部门
            },
            leader: {
                username: null//上级领导
            },
            remarks: null,//备注
            id:null,
            //照片信息
            pictures: [],
            //部门信息,
            deptList:[],
            //上级领导人信息
            userList:[],
            //用来控制输入框是否显示
            operationType:true,
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
            },
            compId:null
        }
    };

    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            showTabs: false,
            //修改密码
            pwd:{
                oldPwd:"",
                newPwd:"",
                resetPwd:"",
                //验证规则
                validationRules:null
            },
            uploadButton:true,
            //上级领导树
            selectedDatas: [],
            faceFile:null,
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
        //按钮
        buttonModal: {
            //关闭按钮
            closeButton: true,
            //提交按钮
            submitButton: false,
            updateButton:false,
            //修改按钮
            update: true,
            //修改密码按钮
            showPassButton:false
        },
        source: null,
        disabled:false,
        key:null,
        obj:null,
        tipContent:null,
        detailShow:false,
        showModifyPsdTabPane:true,
        enableUserWorkState:false,
    };
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
    var detail = LIB.Vue.extend({
        template: tpl,
        components: {
            "basic-information": basicInformation,
            "avatar-settings": avatarSettings,
            "change-password": changePassword
        },
        data: function () {
            return dataModel;
        },
        computed: {
            showSetTab: function () {
                //return this.mainModel.vo.username === 'sysadmin' || this.mainModel.vo.username === 'superadmin';
                return false;
            },
            styleObj: function () {
                var obj = {
                    color: '#fff',
                    padding: '4px 10px',
                    'font-size': '14px',
                    'margin-left': '5px'
                };
                if(this.mainModel.vo.workState === '1') {
                    obj.backgroundColor = "#aacd03";
                } else {
                    obj.backgroundColor = "#f03";
                }
                return obj;
            },
        },
        methods: {
            //关闭
            doClose: function () {
                this.$dispatch("ev_detailShutDown");
            },
            //保存
            doSave: function () {
                var _this=this;
               //回调
                var callback = function (res) {
                   // _this.$dispatch("ev_detailColsed");
                    LIB.Msg.info("保存成功");
                    //按钮的显示状态
                    _this.buttonModal.update=true;
                    _this.buttonModal.submitButton=false;
                }
                var _vo = _this.mainModel.vo;
                //去掉一些没必要的参数
                api.updateUserinfo(_.omit(_vo,"faceid","pictures","operationType","password","positionList","userList","roleList","deptList")).then(callback)

            },
            //修改
            doUpdate: function () {
                this.buttonModal.updateButton=true;
                this.mainModel.vo.operationType=false;
                this.buttonModal.update=false;
                this.buttonModal.submitButton=true
            },
            //获取点击的时候索引值
            doTabs:function(data){
                this.key = data.key;
                if(this.key==3 || (this.key==2 && this.showSetTab)){
                    this.buttonModal.showPassButton=true;
                    this.buttonModal.submitButton=false;
                    //修改按钮
                    this.buttonModal.update=false;
                    var _this = this;
                    api.getPsd({type:"PSD_RULE"}).then(function(data){
                        _this.obj = data.body;
                        _this.mainModel.pwd.validationRules = _this.obj;
                        _this.$broadcast("ev-change")
                    })
                }
                else{
                    this.buttonModal.showPassButton=false;
                    this.buttonModal.submitButton=true;
                    this.$broadcast("ev_picface",this.mainModel.faceFile);
                    //如果是在保存状态 隐藏修改按钮
                       if(this.buttonModal.submitButton==true && this.buttonModal.updateButton==true){
                           this.buttonModal.update=false
                       }else{
                           this.buttonModal.update=true
                       }
                }
            },
            doPwdSave:function(){
                var _this=this;
                if(_.isEmpty(_this.mainModel.pwd.oldPwd.trim())){
                    LIB.Msg.info("旧密码不能为空");
                    return;
                }
                if(_.isEmpty(_this.mainModel.pwd.newPwd.trim())){
                    LIB.Msg.info("新密码不能为空");
                    return;
                }
                if(_.isEmpty(_this.mainModel.pwd.resetPwd.trim())){
                    LIB.Msg.info("重复密码不能为空");
                    return;
                }
                var _vo=_this.mainModel.pwd;
                //转成json格式
                var jsonPassword={
                    oldPwd:_this.mainModel.pwd.oldPwd,
                    newPwd:_this.mainModel.pwd.newPwd,
                    resetPwd:_this.mainModel.pwd.resetPwd,
                    mobile:LIB.user.mobile
                }
                var json_str = JSON.stringify(jsonPassword);
                var password = _this.mainModel.pwd.newPwd;
                //用来判断是否满足长度限制条件
                var flag = false;
                //用于判断是否满足内容限制条件
                var i = 0;
                if(_vo.newPwd==_vo.resetPwd) {
                    if(_this.obj == 'E30000'){
                        var callback = function (res) {
                            if (res.status == 200) {
                                LIB.Msg.info("修改成功");
                               // _this.$dispatch("ev_detailColsed");
                            }
                        }
                        var  password = Base64.encode(json_str);
                        api.updatePwd({key:password}).then(callback);
                    }else{
                        // var str =  JSON.parse(_this.obj);
                        _.deepExtend(_this.mainModel.vo.passwordDetail, _this.obj);
                        _this.mainModel.vo.limiting[0].checked=  _this.mainModel.vo.passwordDetail.letter ? true : false;
                        _this.mainModel.vo.limiting[1].checked =  _this.mainModel.vo.passwordDetail.number ? true : false;
                        _this.mainModel.vo.limiting[2].checked =  _this.mainModel.vo.passwordDetail.caseLetter ? true : false;
                        _this.mainModel.vo.limiting[3].checked =  _this.mainModel.vo.passwordDetail.specialCharacter ? true : false;
                        _.each(_this.mainModel.lengthArr,function(item,index){
                            if(item.value == _this.mainModel.vo.passwordDetail.miniLength ){
                                if(password.length < item.number){
                                    _this.tipContent = "设置失败，密码最小长度为"+ item.number + "位" ;
                                    LIB.Msg.info( _this.tipContent);
                                    flag = false;
                                    return false;
                                }else{
                                    flag = true;
                                }
                            }else {
                                flag = true;
                            }
                        });
                        //密码长度不符合，则不继续判断
                        if(!flag){
                            return false;
                        }
                        //避免“大小写字母”和“字母”重复添加
                        if(_this.mainModel.vo.limiting[0].checked &&  _this.mainModel.vo.limiting[2].checked){
                            //push之前先请空，避免之前还存在元素
                            _this.mainModel.vo.psdTipList1 = [];
                            _.each(_this.mainModel.vo.limiting,function(val,index){
                                if(index !=0){
                                    _this.mainModel.vo.psdTipList1.push(val);
                                }
                            });
                        }else{
                            _this.mainModel.vo.psdTipList1 = [];
                            _.each(_this.mainModel.vo.limiting,function(val,index){
                                _this.mainModel.vo.psdTipList1.push(val);
                            });
                        };
                        //把密码限制条件push到一个数组
                        _this.mainModel.vo.psdTipList2 = [];
                        _.each(_this.mainModel.vo.psdTipList1,function(val,index){
                            if(val.checked){
                                _this.mainModel.vo.psdTipList2.push(val);
                            }
                        });
                        //错误提示的字符串拼接添加规则
                        if(_this.mainModel.vo.psdTipList2.length > 1){
                            var tips = "";
                            i = 0;
                            _.each(_this.mainModel.vo.psdTipList2,function(ele,index){
                                if(index == 0){
                                    tips = "设置失败，密码必须包含"
                                    tips += ele.content;
                                }else if(index == _this.mainModel.vo.psdTipList2.length-1 ){
                                    tips += '及'+ele.content;
                                }else{
                                    tips += '、'+ele.content;
                                }
                            });
                            //正则验证
                            _.each(_this.mainModel.vo.psdTipList2,function(ele){
                                if(!password.match(new RegExp(ele.reg))){
                                    i++;
                                    _this.tipContent = tips;
                                    LIB.Msg.info( _this.tipContent);
                                    return false;
                                }
                            })
                        }else if(_this.mainModel.vo.psdTipList2.length == 1){//当内容限制只有一个时
                            if(!password.match(new RegExp(_this.mainModel.vo.psdTipList2[0].reg))){
                                _this.tipContent = "设置失败，密码必须包含" + _this.mainModel.vo.psdTipList2[0].content;
                                LIB.Msg.info( _this.tipContent);
                                return false;
                            }
                        }
                        //满足长度限制条件和密码内容限制的条件
                        if( flag){
                            if(!i){
                                var callback = function (res) {
                                    if (res.status == 200) {
                                        LIB.Msg.info("修改成功");
                                       // _this.$dispatch("ev_detailColsed");
                                    }
                                }
                                var  password = Base64.encode(json_str);
                                api.updatePwd({key:password}).then(callback);
                            }
                        }else{
                            return false;
                        }
                    }
                 }else{
                    LIB.Msg.info("新密码和重置密码不一致 请重新输入");
                }
            },
            doUpdateWorkState:function(){
                var _this = this;
                var workState = this.mainModel.vo.workState === '1' ? '0' : '1';
                api.updateWorkState({workState:workState}).then(function(res){
                    _this.mainModel.vo.workState = workState;
                    _this.$dispatch("ev_workState",workState);
                })
            },
            initData: function () {
                this.mainModel.showTabs = false;
                var _vo = this.mainModel.vo;
                //清空数据
                _.extend(_vo, newVO());
                //获取登录人信息
                api.getCurUserInfo({id : LIB.user.id}).then(function(res){
                	var userData = res.data;
                	if(!_.isPlainObject(res.data)) {
                        _.deepExtend(_vo, LIB.user);
                    } else {
                        _.deepExtend(_vo, userData);
                    }
                	dataModel.mainModel.faceFile = {faceid: _vo.faceid, face: _vo.face};
                });

                ////获取部门信息
                api.listDept().then(function (res) {
                    _vo.deptList = res.data;
                });
                //获取上级信息 点击右上角头像，报错 br 5323
                //api.listTree().then(function (res1) {
                //    _vo.userList = res1.data;
                //});
            },
        },
        ready:function(){
            this.showModifyPsdTabPane = LIB.getBusinessSetStateByNamePath("common.showModifyPsdTabPane");
            this.enableUserWorkState = LIB.getBusinessSetStateByNamePath("common.enableUserWorkState");
        },
        events: {
            "ev_detailDataReload": function () {
                this.initData();
                if(this.key==3){
                    this.buttonModal.update=false
                }else{
                    this.buttonModal.update=true;
                }
                this.mainModel.showTabs = true;
                this.buttonModal.submitButton=false;
                //用来清空修改密码预留输入的数据
                this.$broadcast("ev_passWordReload");
                this.detailShow = true;

            },
            "ev_detailFace":function(data){
                this.$dispatch("ev_headerFace",data);
            },
            "ev_workState":function(workState){
                this.$broadcast("ev_workState",workState);
            }
        }
    });

    return detail;
})
;