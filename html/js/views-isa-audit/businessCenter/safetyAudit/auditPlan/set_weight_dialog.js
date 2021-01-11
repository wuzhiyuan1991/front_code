define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = require("text!./set_weight_dialog.html");
    //编辑弹框页面fip (few-info-panel)
    return LIB.Vue.extend({
        template: tpl,
        data: function () {
            return {
                load: false,
                show: false,
                //下面是父组件init 传过来的初始化的
                factors:[],
                id:undefined,
            }
        },

        methods: {
            init: function (id,data) {
                var _this=this;
                if (this.load === false) {
                    this.load = true;
                }
                //this.factors=data;
                //从api 重新获取
                this.id=id;
                this.$api.queryAuditWeights({id:id}).then(function(data) {
                    _this.factors=data;
                    _this.show=true;
                })
            },
            confirm:function(){
                var  _this=this;
                var presentAll = this.factors.reduce(function (a,b) {
                    return a + parseFloat(parseFloat(b.weight).toFixed(2));
                },0);
                if(presentAll!==100){
                    LIB.Msg.warning("权重之和必须等于100");
                    return false;
                }
                var saveData=this.factors.map(function (item) {
                    return {
                        id:item.id,
                        weight:item.weight,
                        auditTableId:item.auditTableId,
                        auditElement:{id:item.auditElement.id,name:item.auditElement.name},
                        attr1:item.attr1?1:2
                    }
                });
              this.$api.saveAuditWeights({id: this.id}, saveData).then(function () {
                  LIB.Msg.info("配置成功");
                  _this.$emit("success");
                  _this.show=false;
              })
            },
            cancel:function () {
                this.show=false;
               // this.factors=[];
            }
        },
        init:function () {
            this.$api=api;
        },


    })

})