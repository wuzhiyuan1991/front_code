define(function (require) {
    var LIB = require("lib");
    var Vue = require("vue");
    var template = require("text!./setLicensePersonOrder.html");
    return Vue.extend({
        template: template,
        // mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
        data: function () {
            return {
                title: "调整签发人签发顺序",
                load: false,
                visible: false,
                roleList:[],
                callBack:null,
            }
        },
        methods: {
            init: function (roleList,callBack) {
                this.visible = true;
                this.roleList=roleList;
                this.callback=callBack;
            },
            doSave: function () {
                var i=1;
                var maxStep=this.roleList.length;
                var minStep=1;
                for (i;i<this.roleList.length;i++){
                    var item=this.roleList[i];
                    var signStep=parseInt(item.signStep);
                    if(signStep<minStep||signStep>maxStep){
                        LIB.Msg.error("签发顺序值请在"+minStep+"到"+maxStep+"之间");
                        return;
                    }
                }
                this.roleList.sort(function (a,b) {
                    return a.signStep-b.signStep;
                })
                var i=0;
                var step=1,oldStep=null;

                // for (i;i<this.roleList.length;i++){
                //     var item=this.roleList[i];
                //     if(item.signStep==oldStep){
                //         LIB.Msg.error("有重复的签发顺序")
                //        return
                //     }
                //     oldStep=item.signStep;//存储old,相同情况下不加1step;
                // }

                for (i;i<this.roleList.length;i++){
                   var item=this.roleList[i];
                   if(item.signStep==oldStep){
                       item.signStep=step-1+"";
                       continue;
                   }
                    if(item.signStep==oldStep){
                        item.signStep=step-1+"";
                        continue;
                    }
                    oldStep=item.signStep;//存储old,相同情况下不加1step;
                    item.signStep=step+"";
                    step++;//step++
                }
                this.visible=false;
                this.callback(this.roleList);
            },
            doCancel: function () {
                this.visible = false;
            },
            disabledRole:function(item){
                return  item.signCatalog.signerType!=3;
            },
        },
        watch: {
            visible: function (val) {
                if (val && !this.load) {
                    this.load = true;
                } else {
                    this.load = false;
                }
            }
        }

    });

})