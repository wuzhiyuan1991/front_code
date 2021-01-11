define(function (require) {
    var Vue = require("vue");
    var template= require("text!./base-according.html");
    var component=Vue.extend({
        template:template,
        props:{
            values:{
                type:Array,
                required:true
            },
            nameField:{
                type:String,
                default:"name"
            },
            border:{
                type:Boolean,
                default:true
            },
            currentIndex:{
                type:Number,
            },
            width:{
                type:[Number,String],
                default:170,
            },
            borderRight:{
                default:true
            },
            firstTextAlign:{
                type:String,
                default:"left",
            }


        },
        data:function () {
            return {
                selectedIndex:0,
            }
        },
        computed:{
            boxClass:function(){
                if(this.borderRight){
                    return 'border-t-l-b-right'
                }
                if(this.border){
                    // if(this.borderRight)
                        // return "base-border";
                    return ''
                }
            },
        },
        methods:{
            getStyle:function(index,item){
                if(index===0&&this.firstTextAlign){
                    return {
                        'textAlign':this.firstTextAlign
                    }
                }
            },
            getName:function (item) {
            if(typeof(item)==="string"){
                return item;
            }
            else{
                return item[this.nameField]
                }
            },
            doSelectItem:function (index,item) {
                this.selectedIndex=index;
                this.currentIndex=index;
                this.$emit("on-selected",index,item)
            }
        },
        created:function(){
           if(this.currentIndex!==undefined){
               this.selectedIndex=this.currentIndex;
           }

        },
        watch:{
            'currentIndex':function (val) {
                this.selectedIndex=val;
            }
        }
    });
    Vue.component('base-according', component);
});