define(function (require) {
    var Vue = require("vue");
    var LIB=require("lib");
    var template = require("text!./license-issue.html");
    var commonApi=require("../../api");
    var model=require("../../model");
    var api=require("../../cardTpl/vuex/api");
    var modalSetOrder=require("../dialog/setLicensePersonOrder");
    var multiInputSelect = require("componentsEx/multiInputSelector/main");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var rolesModel = require("./dialog/rolesModel");
    var apix = require("../../sign/vuex/api")



    return Vue.extend({
        template: template,
        components: {
            multiInputSelect: multiInputSelect,
            modalSetOrder: modalSetOrder,
            userSelectModal: userSelectModal,
            rolesModel:rolesModel
        },
        props: {
            model: {
                type: Object,
                required: true,
            },
            type: {
                type: String,
                default: "1",
            },
            needInfo: {
                type: Boolean,
                default: true,
            }

        },
        computed: {},
        data: function () {
            return {
                selRoleList: [],//可选取的角色列表
                tplRoleList: [],//模板选择的角色类表
                fixedRole: [],//预设固定角色
                showUserSelectModal: false,
                handlingUsers: null,
                showRolesModel:false
            }
        },
        created: function () {
           // this.getSignCatalogs();
        },
        methods: {
            doCustomContent:function(type, id){
                this.$emit("on-custom-content",{type:'4', securitySignCatalogId: id, realType:'10'});
            },
            getStuffList: function (id) {
                var list =  this.model.ptwCardStuffs.filter(function (item) {
                    return  item.type==10 && (item.cardSignRoleId == id);
                });
                return list;
            },
            doSaveRoles:function (item) {
                var _this = this;
                apix.create(item).then(function(res) {
                    LIB.Msg.info("保存成功");
                    item.id = res.data.id;
                    _this.getSignCatalogs(false, _this.doAddRole);
                    _this.$dispatch("updateRoles2");
                });
            },
            doShowRoles:function () {
                // this.$dispatch('doRolesModel', "license")
                this.showRolesModel = true;
            },
            doChangeOrder:function(val){
                if(val==0){
                    this.tplRoleList.forEach(function(item){
                        item.signStep="1";
                    })
                }
            },
            getSignCatalogs:function (val, callback) {
                var _this = this;
                _this.selRoleList = [];
                _this.fixedRole = [];
                api.getEnableSignCatalogs().then(function (res) {
                    //这列需要去掉作业申请人，可批准人
                    if (res.data || res.data.length > 0) {
                        for (var i = 0; i < res.data.length; i++) {
                            var item = res.data[i];
                            if (item.disable == '0') {
                                // if (item.signerType == 3) {
                                //     _this.selRoleList.push(item);
                                // } else if (item.signerType == 1 || item.signerType == 2) {
                                //     _this.fixedRole.push(item);
                                // }
                                if (item.signerType == 3 || item.signerType == 1 ) {
                                    _this.selRoleList.push(item);
                                } else if (item.signerType == 1 || item.signerType == 2) {
                                    _this.fixedRole.push(item);
                                }
                            }
                        }
                    }
                    _this.fixedRole=_this.fixedRole.map(function (item) {
                        return {
                            type: _this.type,
                            signStep: item.signerType,
                            // ptwCardTpl : {id:_this.model.id, name:_this.model.name},
                            signCatalog: item,
                            users: [],
                        }
                    });
                    if(val){
                        _this.initTplRole();
                    }
                    if(callback){
                        callback(_this.selRoleList[_this.selRoleList.length-1]);
                    }
                });
            },
            initTplRole: function () {
                var _this = this;
                this.tplRoleList = [];
                var roleList = this.model.ptwCardSignRoles.filter(function (item) {
                    return item.type == "1";
                });
                if (roleList && roleList.length > 0) {
                    this.tplRoleList = roleList
                } else {
                    this.tplRoleList = this.fixedRole.concat();
                    this.tplRoleList.forEach(function (item) {
                        item.users = [];
                    })
                }
                this.model.signRole=this.tplRoleList;
                this.tplRoleList.forEach(function (item) {
                    Vue.set(item, "show", true);
                });
                this.sortStep();
                this.updateGasRoles();
            },
            showCloseRole: function (item) {
                return item.signStep != 1 && item.signStep != this.tplRoleList.slice(-1)[0].signStep;
            },
            //设置签发次序
            doSetSignOrder: function () {
                var _this=this;
                var _data=JSON.parse(JSON.stringify(_this.tplRoleList));
                _this.$refs.setOrder.init(_data,function (data) {
                    _this.model.signRole=_this.tplRoleList=data;
                });
            },

            getUUId:function (item) {
                var _this = this;
                api.getUUID().then(function(res){
                    var group={};
                    group.id = res.data;
                    _this.doAddRole(item, res.data);
                });
            },

            doAddRole: function (item, id) {
                if(!id){
                    return this.getUUId(item);
                }
                //判断是否可以复选
                var _this = this;
                if (item.isMultiple == "0") {
                    var hasbeen = this.tplRoleList.some(function (role) {
                        return item.id == role.signCatalogId;
                    })
                    if (hasbeen) {
                        LIB.Msg.error("此签发人不可重复配置");
                        return;
                    }
                }
                var last = this.tplRoleList.slice(-1)[0];

                var users = [];
                // if(item.signerType=='1') users = [{id:LIB.user.id, name: LIB.user.name}]

                // this.tplRoleList.push(model.ptwCardSignRole({
                //         signStep:last&&this.model.enableSignOrder==1?(parseInt(last.signStep)+1+""):"1",
                //         // ptwCardTpl : {id:_this.model.id, name:_this.model.name},
                //         signCatalog: item,
                //         show: true,
                //         users: users,
                //         signCatalogId: item.id,
                //         type: _this.type,
                //     }));
                this.tplRoleList.push({
                    signStep:last&&this.model.enableSignOrder==1?(parseInt(last.signStep)+1+""):"1",
                    // ptwCardTpl : {id:_this.model.id, name:_this.model.name},
                    // signCatalog: {id:item.id, name:item.name, enableCommitment:item.enableCommitment, signerType:item.signerType},
                    signCatalog:item,
                    show: true,
                    users: [],
                    signCatalogId: item.id,
                    type: _this.type,
                    enableCtrlMeasureVerification: '0',
                    enableCardModification: '0',
                    id:id
                });
                this.sortStep();
                LIB.Msg.info("已添加" + item.name);
            },

            updateGasRoles: function () {
                this.$dispatch('updateGasRoles', this.tplRoleList)
            },

            sortStep:function () {
                var i=0, step=1, oldStep=null;
                for (i;i<this.tplRoleList.length;i++){
                    var item=this.tplRoleList[i];

                    if(item.signStep==oldStep){
                        item.signStep=step-1+"";
                        continue;
                    }
                    oldStep=item.signStep;//存储old,相同情况下不加1step;
                    item.signStep=step+"";
                    step++;//step++
                }

                return ;
                var i=1;
                this.tplRoleList.forEach(function (item) {
                    item.signStep = i;
                    i++;
                });
            },
            doRemoveRole: function (index) {
                var delindex = index;
                index++;
                // for (index; index < this.tplRoleList.length; index++) {
                //     var item = this.tplRoleList[index];
                //     if(parseInt(item.signStep) - 1 >0)
                //         item.signStep = parseInt(item.signStep) - 1 + "";
                //     else item.signStep = '1';
                // }
                var item = this.tplRoleList.splice(delindex, 1);

                this.model.ptwCardStuffs = _.reject(this.model.ptwCardStuffs, function (opt) {
                    return opt.type == '10' && opt.cardSignRoleId == item[0].id
                });

                LIB.Msg.info("已删除" + item[0].signCatalog.name);
                this.sortStep();
            },
            doAddUser: function (users) {
                this.handlingUsers = users;
                this.showUserSelectModal = true;
            },
            doSaveUser: function (users) {
                var ownUsers = this.handlingUsers;
                users.forEach(function (user) {
                    var hasUser = ownUsers.some(function (item) {
                        return item.id == user.id;
                    });
                    if (!hasUser) {
                        ownUsers.push({id: user.id, name: user.name});
                    }
                })
            },
            gotoSign: function () {
                var router = LIB.ctxPath("/html/main.html#!");
                var routerPart = "/ptw/sign";
                window.open(router + routerPart);
            },
            gotoDic: function () {
                var router = LIB.ctxPath("/html/main.html#!");
                var routerPart = "/ptw/sign";
                window.open(router + routerPart);
            },

        },
        watch: {
            // 'model':function (val) {
            //     console.log("model",arguments);
            //     this.initTplRole();
            // },
            // 'model.id': function (val) {
            //     console.log("model.id",arguments);
            //     if(val){
            //         this.initTplRole();
            //     }
            // },
            "tplRoleList": function (val, old) {
                // if(val.length != old.length)
                this.updateGasRoles();
            }
        },
        events: {
            'initData': function () { //不采用监听model的模式初始化。
                this.getSignCatalogs(true);
            },
            'updateData1' : function () {
                this.getSignCatalogs(false, this.doAddRole);
            },
            'updateRolesList1':function () {
                this.getSignCatalogs(false);
            }
        }
    })
})
