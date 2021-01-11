define(function(require){
    var LIB = require('lib');
    //数据模型
    var tpl = require("text!./selectType.html");

    //初始化数据模型
    var newVO = function() {
        return {
            //1:直接 2:预约 3:混合
            type:"2"
        }
    };

    //Vue数据
    var dataModel = {
        modify:true,
        mainModel : {
            vo : newVO(),
            title:"请选择发起作业的方式",
        },
        cb:null,//回调
        visible:false,
    };

    var detail = LIB.Vue.extend({
        template: tpl,
        data:function(){
            return dataModel;
        },
        methods:{
            init:function (cb) {
                this.cb=cb;
                _.extend(this.mainModel.vo,newVO());
                this.visible=true;
            },
            doSave:function () {
                if(this.cb){
                    this.cb.call(this.$parent,this.mainModel.vo.type,this);
                }
                this.$emit("on-success",this.mainModel.vo.type);
            },
            doClose:function () {
                this.visible=false;
            }
        }
    });

    return detail;
});