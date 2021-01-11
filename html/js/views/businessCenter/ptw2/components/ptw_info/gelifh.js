define(function (require) {
    var Vue = require("vue");
    var LIB=require("lib");
    var template = require("text!./gelifh.html");
    var commonApi=require("../../api");
    var propMixins=require("./mixins");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    return Vue.extend({
        mixins:[propMixins],
        template: template,
        components:{
            "userSelectModal":userSelectModal,
        },
        data:function(){
            return {
                showUserSelectModal:false,
                userKeyName:undefined,
                type:undefined,
                process:{},
                mechanical:{},
                electric:{},
                systemMask:{},
                geliffList:[],
            }
        },
        computed:{
            // //隔离类型 1:工艺隔离,2:机械隔离,3:电气隔离,4:系统屏蔽
            // process:function () {
            //     return  _.findWhere(this.permitModel.workIsolations,{type:"1"});
            // },
            // mechanical:function () {
            //     return  _.findWhere(this.permitModel.workIsolations,{type:"2"});
            // },
            // electric:function(){
            //     return  _.findWhere(this.permitModel.workIsolations,{type:"3"});
            // },
            // systemMask:function(){
            //     return  _.findWhere(this.permitModel.workIsolations,{type:"4"});
            // },
            // geliffList:function () {
            //     return  this.model.ptwCardStuffs.filter(function (item) {
            //         return  item.type==5;
            //     })
            // },
        },
        created:function(){
           // this.initData();
        },
        methods: {
            initData:function(){
                this.process=  _.findWhere(this.permitModel.workIsolations,{type:"1"});
                this.mechanical=  _.findWhere(this.permitModel.workIsolations,{type:"2"});
                this.electric=  _.findWhere(this.permitModel.workIsolations,{type:"3"});
                this.systemMask=  _.findWhere(this.permitModel.workIsolations,{type:"4"});
                // this.geliffList=this.model.workStuffs.filter(function (item) {
                //                 return  item.type==5;
                // })
            },
            changeTpl:function(){
                var _this=this;
                this.$nextTick(function () {
                    _this.initData();
                })
            },
            showSelectUser:function(type,userKeyName,workIsolationkey){
                this.type=type+"";
                this.userKeyName=userKeyName;
                this.showUserSelectModal=true;
                this.workIsolationkey=workIsolationkey||['','process','mechanical','electric','systemMask'][type];
            },
            doSaveUser:function(datas){
                if(datas){
                    var data=datas[0];
                    var item= this[this.workIsolationkey];  //_.findWhere(this.permitModel.workIsolations,{type:this.type});
                    if(!item){
                        var item={type:this.type};
                        Vue.set(this,this.workIsolationkey,item);
                        this.permitModel.workIsolations.push(item);
                    }
                    Vue.set(item,this.userKeyName,{id:data.id,name:data.name});
                    if(this.userKeyName==="isolator"&&(!item.disisolator||!item.disisolator.id)){
                        Vue.set(item,"disisolator",{id:data.id,name:data.name});
                    }
                }
            },
            changeEnable:function (event,type) {
                var checked =event.target.checked;
                if(checked===true){return}
                var item=_.findWhere(this.permitModel.workIsolations,{type:type});
                if(item){
                item.isolator={};
                item.disisolator={};
                }

            }
        },
        watch:{
            'permitModel':function(){
                this.initData();
            },
        }

    })
})
