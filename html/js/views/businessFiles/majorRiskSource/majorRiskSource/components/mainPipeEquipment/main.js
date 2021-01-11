define(function (require) {
    var Vue = require("vue");
    var template = require("text!./main.html");
    var tabEquipment=require("./tabEquipment");
    var tabPipe=require("./tabPipe");
    var tabRecord=require("./tabRecord");
    return Vue.extend({
        template: template,
        components:{
            tabEquipment:tabEquipment,
            tabPipe:tabPipe,
            tabRecord:tabRecord,
        },
        props:{
            data:[Array,Object],
            model:Object,
        },
        data: function () {
            return {
                tabs:['设备','管道'],
                checkedTabIndex:0,
            }
        },
        computed:{
        },
        methods: {
            doChangeTab:function(index){
                this.checkedTabIndex=index;
            }
        }

    })
});
