
define(function(require){
    //基础js
    var LIB = require('lib');
    var api = require('./vuex/api');
    var tpl = LIB.renderHTML(require("text!./main.html"))
    var newVO = function () {
        return {
            id: null,
            //name: null,
            content: null,
            orgId: null,
            checkBasisTypeId: null,
            rightPictures: [],
            wrongPictures: [],
            referenceMaterials: [],
            typeList: [],
            checkBasisType:{},
            psdTipList1:[],
            psdTipList2:[],
            userVO:{
                password:null
            },
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
                miniLength:null,//最小长度
                effecTime:null,//有效时间
                retryLimit:null,//重试次数限制
                lockingTime:null,//锁定时间
                letter:null,//字母
                number:null,//数字
                caseLetter:null,//大小写字母
                specialCharacter:null,//字母和数字以外的特殊字符
            }
        }
    };
    var newIpVo = function () {
        return {
            name:null,
            address:null
        }
    };
    var newEnvConfVo = function () {
        return {
            // ip :null,
            enable:null,
            enableIpList:[],
            // delIpList:[]
        }
    };
    //Vue数据模型
    var dataModel ={
            moduleCode : LIB.ModuleCode.BS_DaS_MaiL,
            //控制全部分类组件显示
            mainModel : {
                vo: newVO(),
                ipVo: newIpVo(),
                envVo: newEnvConfVo(),
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
                lengthList:[
                    {
                        value: "1",
                        label: "6个字符"
                    },
                    {
                        value: "2",
                        label: "8个字符"
                    },
                    {
                        value: "3",
                        label: "10个字符"
                    },
                    {
                        value: "4",
                        label: "无限制"
                    }
                ],
                timeList:[
                    {
                        value: "1",
                        label: "30天"
                    },
                    {
                        value: "2",
                        label: "60天"
                    },
                    {
                        value: "3",
                        label: "90天"
                    },
                    {
                        value: "4",
                        label: "180天"
                    },
                    {
                        value: "5",
                        label: "1年"
                    },
                    {
                        value: "6",
                        label: "无限制"
                    }
                ],
                limitList:[
                    {
                        value: "1",
                        label: "3"
                    },
                    {
                        value: "2",
                        label: "5"
                    },
                    {
                        value: "3",
                        label: "10"
                    },
                    {
                        value: "4",
                        label: "无限制"
                    }
                ],
                lockingList:[
                    {
                        value: "1",
                        label: "10分钟"
                    },
                    {
                        value: "2",
                        label: "30分钟"
                    },
                    {
                        value: "3",
                        label: "60分钟"
                    },
                    {
                        value: "4",
                        label: "永远"
                    }
                ]

            },
            ruleModel:{
                name:[
                    { required: true, message: '请输入名称'}
                ],
                address:[
                    { required: true, message: '请输入IP地址'}
                ]
            },
            addAbleIndex: -1,
            editAbleIndex: 1,
            ruleType : 'view',
            isShowItem:false,
            isShowItem1:false,
            isShowItem2:false,
            ipList:[],
            psdTip:"",
            obj:null,
            isRed:false
    };
    var vm = LIB.VueEx.extend({
        template:tpl,
        data:function(){
            return dataModel;
        },
        methods:{
            //是否只读
            isReadOnly:function(index){
                return index !== this.addAbleIndex;
            },
            doChangePsd:function(){
                var _this = this;
                var password = this.mainModel.vo.userVO.password;
                //用来判断是否满足长度限制条件
                var flag = false;
                //用于判断是否满足内容限制条件
                var i = 0;
                //判断密码的长度，不符合标准则提示
                if(_this.obj == 'E30000'){
                    if(!password){//判断密码是否为空
                        _this.isRed = true;
                        _this.psdTip = "重置失败，密码不能为空";
                        flag = false;
                        return false;
                    }else{
                        _this.isRed = false;
                        _this.psdTip = "正在重置...";
                        api.reset(_.omit(_this.mainModel.vo.userVO)).then(function(res){
                            _this.psdTip = "重置成功";
                        })
                    }
                }else{
                    _.each(_this.mainModel.lengthArr,function(item,index){
                        if(item.value == _this.mainModel.vo.passwordDetail.miniLength ){
                            if(!password){//判断密码是否为空
                                if(!isNaN(item.number)){
                                    _this.psdTip = "重置失败，密码最小长度为"+ item.number + "位" ;
                                    _this.isRed = true;
                                    flag = false;
                                    return false;
                                }else{
                                    _this.psdTip = "重置失败，密码不能为空";
                                    _this.isRed = true;
                                    flag = false;
                                    return false;
                                }
                            }else{
                                if(password.length < item.number){
                                    _this.psdTip = "重置失败，密码最小长度为"+ item.number + "位" ;
                                    _this.isRed = true;
                                    flag = false;
                                    return false;
                                }else{
                                    flag = true;
                                }
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
                    if(this.mainModel.vo.psdTipList2.length > 1){
                        var tips = "";
                        i = 0;
                        _.each(_this.mainModel.vo.psdTipList2,function(ele,index){
                            if(index == 0){
                                tips = "重置失败，密码必须包含"
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
                                _this.psdTip = tips;
                                _this.isRed = true;
                                return false;
                            }
                        })
                    }else if(this.mainModel.vo.psdTipList2.length == 1){//当内容限制只有一个时
                        if(!password.match(new RegExp(_this.mainModel.vo.psdTipList2[0].reg))){
                            _this.psdTip = "重置失败，密码必须包含" + _this.mainModel.vo.psdTipList2[0].content;
                            _this.isRed = true;
                            return false;
                        }
                    }
                    //满足长度限制条件和密码内容限制的条件
                    if( flag){
                        if(!i){
                            _this.isRed = false;
                            _this.psdTip = "正在重置...";
                            api.reset(_.omit(_this.mainModel.vo.userVO)).then(function(res){
                                _this.psdTip = "重置成功";
                            })
                        }
                    }else{
                        return false
                    }
                }
            },
           /* 新增IP限制*/
            addRule:function(){
                this.addAbleIndex =  this.mainModel.envVo.enableIpList.length;
                this.mainModel.envVo.enableIpList.push({name:''});
            },
            blur:function(){
                var _this=this;
                var envVo=_this.mainModel.envVo;
                this.$refs.ruleform.validate(function (valid){
                    if (valid) {
                        api.update({type:"ENABLE_IP",configJson:JSON.stringify(envVo)}).then(function (){
                            _this.addAbleIndex =-1;
                            LIB.Msg.info("保存成功");
                        });
                    }
                });
            },
            /* 修改IP限制*/
            editRule:function(){
                var _this=this;
                var envVo=_this.mainModel.envVo;
                _this.addAbleIndex =0;
            },
            /* 删除IP限制*/
            delRule:function(index){
                this.mainModel.envVo.enableIpList.splice(index,1);
                api.update({type:"ENABLE_IP",configJson:JSON.stringify(this.mainModel.envVo)}).then(function () {
                    LIB.Msg.info("删除成功");
                });
            },
            doSavePsd:function(){
                var _this  = this;
                _this.mainModel.vo.passwordDetail.letter =  _this.mainModel.vo.limiting[0].checked ? 1: 0;
                _this.mainModel.vo.passwordDetail.number =  _this.mainModel.vo.limiting[1].checked ? 1: 0;
                _this.mainModel.vo.passwordDetail.caseLetter =  _this.mainModel.vo.limiting[2].checked ? 1: 0;
                _this.mainModel.vo.passwordDetail.specialCharacter =  _this.mainModel.vo.limiting[3].checked ? 1: 0;
                if(_this.obj=="E30000"){
                    api.save({type:"PSD_RULE",configJson:JSON.stringify(this.mainModel.vo.passwordDetail)}).then(function (data) {
                        LIB.Msg.info("新增成功！");
                        _this.obj = null;
                    });
                }else {
                    api.update({type:"PSD_RULE",configJson:JSON.stringify(this.mainModel.vo.passwordDetail)}).then(function (data) {
                        LIB.Msg.info("修改成功！");
                    });
                }
            },
            //IP启用停用
            checkedChange:function(checked,value){
                var _this=this;
                var envVo=_this.mainModel.envVo;
                if(_this.mainModel.envVo.enable){
                    api.update({type:"ENABLE_IP",configJson:JSON.stringify(envVo)}).then(function (){
                        _this.addAbleIndex =-1;
                        LIB.Msg.info("启用成功");
                    });
                }else{
                    api.update({type:"ENABLE_IP",configJson:JSON.stringify(envVo)}).then(function (){
                        _this.addAbleIndex =-1;
                        LIB.Msg.info("停用成功");
                    });
                }
            },
        },
        //events : {
        //    //edit框点击保存后事件处理
        //    "ev_editFinshed" : function(ruleType,data) {
        //        this.ruleType = ruleType;
        //    },
        //    //edit框点击取消后事件处理
        //    "ev_editCanceled" : function() {
        //    }
        //},
        ready: function () {
            var _this = this;
            api.get({type:"ENABLE_IP"}).then(function (data) {
                if(data.body){
                    // enable:null,
                        // enableIpList:[],
                    // _.deepExtend(_this.mainModel.envVo, data.body);
                    _this.mainModel.envVo.enableIpList = data.body.enableIpList;
                    _this.mainModel.envVo.enable = data.body.enable;
                }
            });
            api.get({type:"PSD_RULE"}).then(function(data){
                _this.obj = data.body;
                if(_this.obj != 'E30000'){
                   // var str =  JSON.parse(_this.obj);
                    var str = _this.obj;
                    _.deepExtend(_this.mainModel.vo.passwordDetail, str);
                    _this.mainModel.vo.limiting[0].checked=  _this.mainModel.vo.passwordDetail.letter ? true : false;
                    _this.mainModel.vo.limiting[1].checked =  _this.mainModel.vo.passwordDetail.number ? true : false;
                    _this.mainModel.vo.limiting[2].checked =  _this.mainModel.vo.passwordDetail.caseLetter ? true : false;
                    _this.mainModel.vo.limiting[3].checked =  _this.mainModel.vo.passwordDetail.specialCharacter ? true : false;
                }
            })
        }
    });
    return vm;
});