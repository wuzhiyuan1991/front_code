define(function (require) {
    var Vue = require("vue");
    var template = require("text!./main.html");
    var LIB=require("lib");
    var component= Vue.extend({
        template: template,
        props:{
            columns:{
               type:Array,
                required:true,
            },
            values:{
                type:Array,
                required:true,
            }
        },
        data: function () {
            return {

            }
        },
        computed:{
            columnsStyle:function(){
                if(this.columns.length===0){return []}
                else{
                  var m=   this.columns.map(function(item){
                        if(!item.width){
                          return "width:150px;"
                        }
                        else if(item.width==='auto'){
                            return "";
                        }
                        else if(item.width==='flex'){
                            return "flex-grow:1;"
                        }
                        else{
                            return "width:"+item.width+";";
                        }
                    })
                }
                return m;
            },
            titles:function(){
               return  this.columns.map(function(item){
                    return  item.title;
                })
            }
        },
        init:function(){

        },
        methods: {
            init:function(){

            },
            getBorderRedStyle:function (item, col) {
                if(col.require && item[col.fieldName]){
                    return true;
                }
            },
            doAddRow:function () {
               this.$emit("on-add-row",this.values);
            },
            delItem:function(index,item){
                if(!item.id){
                    this.values.splice(index,1);
                }
                this.$emit("on-del",index,itme.this.values)
            },
            doSave:function(){

                this.$emit("on-save",this.values);
            }
        }
    });
    Vue.component("lite-new-table",component);
    return component;
})