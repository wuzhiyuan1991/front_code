define(function (require) {
    var Vue = require("vue");
    var template = require("text!./edit-text.html");
    return Vue.extend({
        template: template,
        data: function () {
            return {
                visible:false,
                modalTitle:"编辑",
                text:"",
                textName:"",
                model:null,
                hasCB:false,
                key:"",
            }
        },
        methods: {
            initCB:function(textName,text,cb){
               this.textName=textName;
               this.text=text;
               this.visible=true;
               this.cb=cb;
               this.hasCB=true;
            },
            init:function(textName,key,model){
                this.textName=textName;
                this.text=model[key];
                this.visible=true;
                this.hasCB=false;
                this.model=model;
                this.key=key;
            },
            doClose:function () {
                this.visible=false;
            },
            doSave:function () {
                if(this.hasCB){
                    this.cb(this.text);
                }
                else{
                    this.model[this.key]=this.text;
                }
                this.visible=false;
            }
        }
    })
})
