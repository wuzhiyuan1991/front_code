define(function (require) {
    var Vue = require("vue");
    var LIB=require("lib");
    var template = require("text!./work-close.html");
    var api=require("../../api");
    var propMixins=require("./mixins");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var multiInputSelect = require("componentsEx/multiInputSelector/main");

    return Vue.extend({
        mixins:[propMixins],
        template: template,
        components:{
            multiInputSelect:multiInputSelect,
            userSelectModal:userSelectModal,
        },
        computed:{
            cancelReasonList:function(){
                return  this.model.ptwCardStuffs.filter(function (item) {
                    return  item.type==7
                })
            },
            getFinishDeclare: function () {
                var str  = '';
                if(this.model && this.model.comments && this.model.comments["7"]){
                    return this.model.comments["7"];
                }
                if(this.permitModel&& this.permitModel.workTpl && this.permitModel.workTpl.comments && this.permitModel.workTpl.comments["7"]){
                    return this.permitModel.workTpl.comments["7"];
                }
            },
            getCancelDeclare: function () {
                var str  = '';
                if(this.model && this.model.comments && this.model.comments["6"]){
                    return this.model.comments["6"];
                }
                if(this.permitModel && this.permitModel.workTpl && this.permitModel.workTpl.comments && this.permitModel.workTpl.comments["6"]){
                    return this.permitModel.workTpl.comments["6"];
                }
            }
        },
        data: function () {
            return {
                checkbox:{
                    delay:false,
                    renew:false,
                },
                tab:{
                    selectedIndex:0
                },
                extensionTypeList:[{value:"1",name:"小时"},{value:"2",name:"天"}],
                handlingRole:null,
                userSelectModel:{
                    show:false,
                }
            }
        },
        created:function(){
            this.initData();
        },
        methods:{
            doShowLicenseToClose: function () {
                var _this = this;
                LIB.Modal.confirm({
                        title: '引用“作业签发”角色人员作为“作业关闭”（包括作业完成、取消和延期）角色人员<br>按照角色名称来匹配，如果满足（名称相同），则自动把“作业签发”角色的人员带入自动填充到“作业关闭”角色人员；（如果已经设置人员，当前操作会覆盖）',
                        onOk: function () {
                            for(var key in _this.permitModel.closeRole) {
                                var closeRoles = _this.permitModel.closeRole[key];
                                _.each(closeRoles, function (closeRole) {
                                    var obj = _.find(_this.permitModel.signRoles, function (signRoles) {
                                        if(closeRole.signCatalog &&  closeRole.signCatalog)
                                            return signRoles.signCatalog.id == closeRole.signCatalog.id;
                                    });
                                    if(obj && obj.users.length>0) closeRole.users = [].concat(obj.users);
                                })
                            }

                            return ;
                            _.each( _this.permitModel.closeRole, function (closeRole) {
                                // var arr = _.pluck(_.filter(_this.permitModel.signRoles, function (signRoles) {
                                //     if(signRoles.signCatalog &&  closeRole.signCatalog)
                                //         return signRoles.signCatalog.id == closeRole.signCatalog.id;
                                // }), 'users');

                            })
                        }
                })
            },
            deelApply: function (item) {
                if(item.signCatalog && item.signCatalog.signerType == '1'){
                    // item.users = [];
                    // item.users.push({id:LIB.user.id, name:LIB.user.name});
                    return LIB.user.name;
                }
            },

            deelcloseRole: function (arr) {
                _.each(arr, function (items) {
                    _.each(items, function (item) {
                        if(item.signCatalog && item.signCatalog.signerType==1){
                            item.users = [];
                            item.users.push({id:LIB.user.id, name:LIB.user.username})
                        }
                    })
                })
            },

            initData:function(){
                if(this.permitModel.closeRole) this.deelcloseRole(this.permitModel.closeRole);

               if(this.permitModel.extensionType=="2"){
                   this.checkbox.delay=true;
                   this.checkbox.renew=false;
               }
               else if(this.permitModel.extensionType=="1"){
                   this.checkbox.renew=true;
                   this.checkbox.delay=false;
               }
               else{
                   this.checkbox.delay=false;
                   this.checkbox.renew=false;
               }
            },
            doShowSelectUserModal:function(item){
                this.handlingRole=item;
                this.userSelectModel.show=true;
            },
            doSaveUser:function (users) {
                var ownUsers=this.handlingRole.users;
                users.forEach(function (user) {
                    var hasUser=ownUsers.some(function (item) {
                        return  item.id==user.id;
                    })
                    if(!hasUser){
                        ownUsers.push({id:user.id,name:user.name});
                    }
                })
            },

        },
        watch:{
            'model.id':function(val){
                this.initData();
            },
        }
    })
})
