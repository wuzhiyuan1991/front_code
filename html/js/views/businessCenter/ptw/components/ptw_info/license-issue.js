
define(function (require) {
    var Vue = require("vue");
    var LIB=require("lib");
    var template = require("text!./license-issue.html");
    var api=require("../../api");
    var model=require("../../model");
    var propMixins=require("./mixins");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    return Vue.extend({
        mixins:[propMixins],
        template: template,
        components:{
            "userSelectModal":userSelectModal,
        },
        computed:{

        },
        data: function () {
            return {
                signRoles: [],
                handlingRole:null,
                userSelectModel:{
                    show:false,
                }
            }
        },
        created:function(){
            this.initData();
        },
        methods: {
            changeTpl:function(){
                var _this=this;
                this.$nextTick(function () {
                    _this.initData(true);
                })
            },
            isApplyPerson:function(signRole){
                return ["1"].indexOf(signRole.signCatalog.signerType)>-1;
            },
            initData:function(changeTpl){
                var _this=this;

                if(!this.model.ptwCardSignRoles){
                    return;
                }
                //显示是从模板得到 ptwCardSignRoles 里面的人员必须和以选择人员一致
                //保存的时候 是保存 workPersonnels 实际存在temp
                var signRoles=this.model.ptwCardSignRoles.filter(function (item) {
                    return item.type=="1";
                });
                //已经选中的人员 也表示选择的 role
                var hasPersonels=this.permitModel.workPersonnels.filter(function (item) {
                    return item.type=="1";
                })||[];
                if(!changeTpl&&hasPersonels.length>0){
                    signRoles=hasPersonels;
                }
                else{
                    // var applyRole=signRoles.filter(function (item) {
                    //     return item.signCatalog.signerType ==1
                    // })[0]
                    // if(!applyRole.users||applyRole.users.length===0){
                    //     applyRole.users.push({id:LIB.user.id,name:LIB.user.name})
                    // }
                }
                _.each(signRoles,function (item) {
                    if(item.signCatalog.signerType ==1 && item.users.length==0){
                        item.users = [];
                        item.users.push({id:LIB.user.id, name:LIB.user.name});
                    }
                })
                this.permitModel.signRoles=this.signRoles=signRoles;
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
                    });
                    if(!hasUser){
                        ownUsers.push({id:user.id,name:user.name});
                    }
                })
            },
            doRemoveUser:function (userIndex,item) {
                item.users.splice(userIndex,1);
            }

        },
        watch:{
            'permitModel':function(){
                this.initData();
            },
        }
    })
})

