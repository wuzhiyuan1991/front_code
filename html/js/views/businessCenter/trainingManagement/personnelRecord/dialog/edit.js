define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var tpl = require("text!./edit.html");

    var newVO = function () {
        return {
        	id:null,
            name: null,
            mobile: null,
            email: null,
            leaderId: null,
            orgId: null,
            code: null,
            userDetail: {
                id:null,
                idcard: null,
                nativePlace: null,
                address: null,
                education: null,
                sex: null,
                maritalStatushuan: null
            },
            remarks: null,
            userList: [],
            deptList: [],
            //公司id 用来做桥接
            orgIdData:null,
            //部门id
            perId:null,
            compId:null
        }
    };

    //数据模型
    var dataModel = {
        mainModel: {
            vo: newVO(),
            //当前的操作类型， create：创建， update ：更新， 影响'保存'按钮的事件处理
            opType: "",
            educationList: [
                {
                    value: "0",
                    label: "高中"
                },
                {
                    value: "1",
                    label: "本科"
                },
                {
                    value: "2",
                    label: "研究生"
                },
                {
                    value: "3",
                    label: "博士"
                },
                {
                    value: "4",
                    label: "其他"
                }
            ],
            maritalList: [
                {
                    value: "0",
                    label: "未婚"
                },
                {
                    value: "1",
                    label: "已婚"
                }
            ],
            sexList: [
                {
                    value: "0",
                    label: "女"
                },
                {
                    value: "1",
                    label: "男"
                }
            ],
            selectedDatas: []
        },
        rules: {
            code: [
                {required: true, message: '请输入公司编码'},
                LIB.formRuleMgr.length(20, 1)
                //{ min: 1, max: 10, message: '长度在 1 到 20 个字符'}
            ],
            name: [
                {required: true, message: '请输入用户名'},
                LIB.formRuleMgr.length(30,1)
                //{ min: 1, max: 30, message: '长度在 1 到 30 个字符'}
            ],
            mobile: [
                {required: true, message: '请输入手机号'},
                {required: true, message: '联系电话格式错误'}
            ],
            email: [
                {required: true, message: '请输入邮箱'},
                {type: 'email', required: true, message: '电子邮箱格式错误'}
            ],
//            orgId: [
//                {required: true, message: '请选择所属公司'}
//            ],
//            perId: [
//                {required: true, message: '请选择所属部门'}
//            ],
            
			compId:[{ required: true, message: '请选择所属公司'}],
			orgId: [{required: true, message: '请选择所属部门'}],
			
            idcard: [
                {type: 'card', message: '身份证号码格式错误'}
            ],
            nativePlace: [
                //{required: false, message: '请输入籍贯'},
                LIB.formRuleMgr.length(20,1)
                //{ min: 1, max: 20, message: '长度在 1 到 20 个字符'}
            ],
            address: [
                //{required: false, message: '请输入现居住地'},
                LIB.formRuleMgr.length(20,1)
                //{ min: 1, max: 20, message: '长度在 1 到 20 个字符'}
            ]
        },
        leaderData : null,

    };

    //声明detail组件
    var detail = LIB.Vue.extend({
        template: tpl,
        data: function () {
            return dataModel;
        },

        watch:{
            //检测属性变化
            orgIdData:function(){
                //if(this.mainModel.vo.orgIdData && dataModel.mainModel.opType == "create"){
                //    this.$refs.personnel.init(this.mainModel.vo.orgIdData);
                //}else if(this.mainModel.vo.orgIdData && dataModel.mainModel.opType == "update"){
                //    this.$refs.personnel.init(this.mainModel.vo.orgIdData);
                //}
             },
             'mainModel.vo.leaderId':function(){
                //临时leaderId值
                if (this.mainModel.vo.leaderId == this.mainModel.vo.id){
                    this.mainModel.vo.leaderId = this.mainModel.leaderData;
                    LIB.Msg.info("上级领导不能选择为自己！");
                }
             }
        },
        methods: {
            doSave: function () {
                var _this = this;
                var callback = function (res) {
                    //_this.$dispatch("ev_editFinshed",_this.mainModel.vo);
                    _this.$emit("do-edit-finshed",_this.mainModel.vo);
                    LIB.Msg.info("保存成功");
                }
                //防止保存的时候 清空公司问题
                //_this.mainModel.vo.orgId = _this.mainModel.vo.orgIdData;
                
                //防止idcard为空字符创时的校验
                this.mainModel.vo.userDetail.idcard = this.mainModel.vo.userDetail.idcard == "" ? null : this.mainModel.vo.userDetail.idcard;
                
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        ////如果有部门就传部门
                        //if(_this.mainModel.vo.perId){
                        //    _this.mainModel.vo.orgId = _this.mainModel.vo.perId;
                        //}
                        if (_this.mainModel.opType == "create") {
                            //api.validateMobile({mobile: _this.mainModel.vo.mobile}).then(function (res) {
                            //    if (res.data == 'success') {
                            //        api.create(_.omit(_this.mainModel.vo,"orgIdData","perId","deptList", "userList", "password")).then(callback);
                            //    } else {
                            //        LIB.Msg.info("该手机号已经存在！");
                            //    }
                            //})
                            if(_this.mainModel.vo.username){
                                _this.mainModel.vo.username = _this.mainModel.vo.name;
                            }
                            api.create(_.omit(_this.mainModel.vo,"orgIdData","perId","deptList", "userList", "password")).then(callback);
                        } else {
                            var updateUserVO = _.omit(_this.mainModel.vo, "orgIdData","perId","org", "deptList", "userList", "password","username");
                            var userDetail = updateUserVO.userDetail;
                            if(_.every(userDetail, function(item) { return item == null;})) {
                            	delete updateUserVO.userDetail;
                            }
                            api.update(updateUserVO).then(function(){
                                var org = {name:""};
                                var leader = {username:''};
                                //用来更新数据
                                var data ={
                                    org:  _.find(_this.mainModel.vo.deptList, {id: _this.mainModel.vo.orgId}),
                                    leader: _.find(_this.mainModel.vo.userList, {id: _this.mainModel.vo.leaderId}),
                                    username:_this.mainModel.vo.username,
                                    leaderId:_this.mainModel.vo.leaderId
                                }
                                var updateLeader = _.find(_this.mainModel.vo.userList, {id: _this.mainModel.vo.leaderId});
                                updateUserVO.leader = null;
                                if(updateLeader) {
                                    updateUserVO.leader = {id:updateLeader.id, username:updateLeader.name};
                                }
                                var updateOrg = _.find(_this.mainModel.vo.userList, {id: _this.mainModel.vo.orgId});
                                updateUserVO.org = updateOrg;
                                data = updateUserVO;
                               // _this.$dispatch("ev_editUpdate",data);
                                _this.$emit("do-edit-update",data);
                            });
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
                //因为路由keep-alive的原因  bug 2972
                this.$refs.activate.init();
                //注意！ events中使用 绑定的data， 需要通过全局对象直接引用， 而methods中可以直接通过this引用到data
                var _data = dataModel.mainModel;
                var _vo = dataModel.mainModel.vo;
                this.$refs.ruleform.resetFields();
                //清空数据
                _.extend(_vo, newVO());
                this.mainModel.selectedDatas= new Array();
                //存在nVal则是update
                api.listTree().then(function (res) {
                    _vo.userList = res.data;
                });
                api.listDept().then(function (res) {
                    _vo.deptList = res.data;
                });
                if (nVal != null) {
                    _data.opType = "update";
                    api.get({id: nVal}).then(function (res) {
                        //初始化数据
                        _.deepExtend(_vo, res.data);
                        dataModel.mainModel.selectedDatas.push({"id":res.data.leaderId});
                        _data.leaderData = res.data.leaderId;
                        ////公司id的桥接变量
                        //_vo.orgIdData= res.data.org.parentId;
                        ////公司id
                        //_vo.orgId = res.data.org.parentId;
                        ////部门id
                        //_vo.perId = res.data.orgId;
                    });
                } else {
                    _data.opType = "create";
                }

            }
        }
    });

    return detail;
});