
define(function (require) {
    var Vue = require("vue");
    var LIB=require("lib");
    var template = require("text!./license-issue-close.html");
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
        props:{
            model:{
                type:Object,
                required:true,
            },
            type:{
                type:String,
                required:true,
            }

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
            // this.initData();
        },
        methods: {
            isApplyPerson:function(signRole){
                return ["1"].indexOf(signRole.signCatalog.signerType)>-1;
            },
            initData:function(){
                var _this=this;
                if(!this.model.ptwCardSignRoles){
                    return;
                }
                //显示是从模板得到 ptwCardSignRoles 里面的人员必须和以选择人员一致
                //保存的时候 是保存 workPersonnels 实际存在temp
                var signRoles=this.model.ptwCardSignRoles.filter(function (item) {
                    return item.type==_this.type;
                });
                //已经选中的人员 也表示选择的 role
                var personType={
                    "2":"8",//作业完成
                    "3":"9",//作业取消
                    "4":"10",//作业延期或续签
                }
                var hasPersonels=this.permitModel.workPersonnels.filter(function (item) {
                    return item.type==personType[_this.type];
                })||[];
                if(hasPersonels.length>0){
                    signRoles=hasPersonels;
                }
                // else{
                //     if(!signRoles[0].users||signRoles[0].users.length===0){
                //         signRoles[0].users.push({id:LIB.user.id,name:LIB.user.name})
                //     }
                // }
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
                    })
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
            'permitModel.id':function(val){
                if(val){
                this.initData();}
            },
            'model.id':function (val) {
                if(val){
                    this.initData();}
            }
        }
    })
})

