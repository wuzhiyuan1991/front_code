define(function (require) {
    var Vue = require("vue");
    var template = require("text!./main.html");
    return Vue.extend({
        template: template,
        props:{
            values:Array,
            overflowHover:{
                type:Boolean,
                default: true,
            },
            fieldName:{
                type:String,
                default:"name"
            },
            placeholder:{
                type:String,
                default:""
            },
            customRemoveItem:Boolean,
        },
        data: function () {
            return {
                showMore:false,
            }
        },
        computed:{
            copySyle:function () {
                return {
                    "zIndex":this.showMore?1:-1,
                }
            }
        },
        methods: {
            getTagName:function(tag){
                var keys=this.fieldName.split('.');
                var name=tag;
                keys.forEach(function (item) {
                    name=name[item];
                });
                return name;
            },
            doClick:function(){
                this.$emit("click");
            },
            doRemoveItem:function (index) {
                this.$emit("removeitem",index,this.values[index]);
                if(!this.customRemoveItem) {
                    this.values.splice(index, 1);
                }
            },
            setShowMore:function () {
                var _this = this;
                if(this.overflowHover){
                    this.$nextTick(function () {
                        if(_this.values && _this.values.length>0 && _this.$el && _this.$el.nextElementSibling){
                            var copy=$(_this.$el.nextElementSibling).find(".ivu-select-selection-copy");
                            _this.showMore=copy.height()>27*2-1;
                        }
                        else{
                            _this.showMore=false;
                        }
                    })
                }
            },
        },
        watch:{
            values:function () {
                this.setShowMore();
            }
        },
        created:function () {
            this.setShowMore();
        }
    })
})