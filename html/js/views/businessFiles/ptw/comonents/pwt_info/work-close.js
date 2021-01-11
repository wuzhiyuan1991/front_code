define(function (require) {
    var Vue = require("vue");
    var LIB=require("lib");
    var template = require("text!./work-close1.html");
    var api=require("../../api");
    var model=require("../../model");
    var signView=require("./license-issue-close");
    return Vue.extend({
        props:{
            model:{
                type:Object,
                required:true,
            }
        },
        template: template,
        components:{
            signView:signView,
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
            }
        },
        methods: {
            doCustomContentRole:function(obj){
                this.$emit("on-custom-content",obj);
            },
            initData:function(){
               if(this.model.extensionType=="2"){
                   this.checkbox.delay=true;
                   this.checkbox.renew=false;
               }
               else if(this.model.extensionType=="1"){
                   this.checkbox.renew=true;
                   this.checkbox.delay=false;
               }
               else{
                   this.checkbox.delay=false;
                   this.checkbox.renew=false;
               }
               this.tab.selectedIndex=0;
            },
            doCustomContent:function(){
                this.$emit("on-custom-content",{type:7});
            },
            gotoDic:function (type) {
                var router = LIB.ctxPath("/html/main.html#!");
                var routerPart="/ptw/shutoff?type="+type;
                window.open(router + routerPart);
            },
            doChangeExtenType:function ($arguments,type) {

                var checked=$arguments[0];
                var key=type==1?"renew":"delay";
                var otherkey="renewdelay".replace(key,"");
                if(checked){
                    this.checkbox[otherkey]=false;
                    this.model.extensionType=type;
                    this.$refs[key].roleReset();
                    this.tab.selectedIndex=type*1+1;
                }
                else{
                    this.$refs[key].roleClear();
                    this.model.extensionType="";
                    this.tab.selectedIndex=0;
                }
            }
        },
        events: {
            'initData': function () { //不采用监听model的模式初始化。
                this.initData();
                this.$broadcast("initData");
            }
        }

    })
})
