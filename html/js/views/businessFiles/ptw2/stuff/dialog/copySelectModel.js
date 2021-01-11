define(function (require) {
    var Vue = require("vue");
    var LIB = require('lib');
    var template = require("text!./copySelectModel.html");
    return Vue.extend({
        template: template,

        data: function () {
            return {
                selAll:false,
                visible:false,
                list:[],
                title:'复制新增',
                visible:false
            }
        },
        props: {

        },
        methods: {
            initData:function(list, title){
                this.list = list.map(function (item) {
                    return {
                        id:item.id,
                        name:item.name,
                        attr1:'0'
                    }
                });
                this.title = "复制新增" + title;
                this.visible = true;
            },

            doChangeAll:function(checked){
                if(checked){
                    for (var i=0;i<this.list.length;i++){
                        var item=this.list[i];
                        item.attr1="1";
                    }
                }
                else{
                    for (var i=0;i<this.list.length;i++){
                        var item=this.list[i];
                        item.attr1="0";
                    }
                }
            },
            doSave:function(){
                var list = this.list.filter(function (item) {
                    return item.attr1 == '1';
                });
                console.log(list);
                if(list && list.length==0){
                    return LIB.Msg.error("请选择复制的项")
                }
                this.$emit("on-do-save",list);
                this.visible = false;
            },
            doCancel: function () {
                this.visible = false;
            }
        },
    })
})
