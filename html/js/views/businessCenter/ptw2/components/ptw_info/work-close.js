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
            initData:function(){
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
