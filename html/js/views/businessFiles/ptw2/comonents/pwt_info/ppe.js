define(function (require) {
    var Vue = require("vue");
    var LIB=require("lib");
    var template = require("text!./ppe.html");
    var api=require("../../api");
    return Vue.extend({
        template: template,
        components:{
        },
        props:{
            model:{
                type:Object,
                required:true,
            }
        },
        computed:{
            // geliffList:function () {
                //     return  this.model.ptwCardStuffs.filter(function (item) {
                //         return  item.type==5;
                //     })
                // },

        },
        data: function () {
            return {
                load:false,
                ppeList:[],
                enablePPEs:[],
            }
        },
        init:function(){
           var  _this=this;
           api.getPPETypes().then(function (data) {
               _this.ppeList=data;
            })
        },
        methods: {
            gotoMore:function () {
                var router = LIB.ctxPath("/html/main.html#!");
                var routerPart="/ptw/catalog?type=2";
                window.open(router + routerPart);
            },
            doPPEChange:function(item){
                var indexOf=this.enablePPEs.indexOf(item.id);
                if(item.enable){
                    if(indexOf===-1){
                        this.enablePPEs.push(item.id)
                    }
                }
                else if(indexOf>-1){
                    this.enablePPEs.splice(indexOf,1);
                    this.model.ptwCardStuffs=this.model.ptwCardStuffs.filter(function (stuff) {
                        return  !(stuff.type==6&&stuff.ppeCatalogId==item.id);
                    })
                }
                this.model.ppeCatalogSetting=this.enablePPEs.join(",");

            },
            getPPEItems:function(data){
                return  this.model.ptwCardStuffs.filter(function (item) {
                    return  item.type==6&&item.ppeCatalogId==data.id;
                })
            },
            doCustomContent:function(type,ppeCatalogId, enable){
                if(enable)
                this.$emit("on-custom-content",{type:type,ppeCatalogId:ppeCatalogId});
            },
            setEnable:function () {
                var _this=this;
                _this.enablePPEs=[];
                _this.ppeList.forEach(function (item) {
                    if(_this.model.ppeCatalogSetting){
                        Vue.set(item,'enable',!!_this.model.ppeCatalogSetting.match(new RegExp(item.id)));
                        if(item.enable){
                            _this.enablePPEs.push(item.id);
                        }
                    }
                    else{
                        Vue.set(item,'enable',false)
                    }
                    return item;
                });
            }

        },
        watch:{
            'model.ppeCatalogSetting':function (val) {
                this.setEnable();
            }
        }
    })
})
