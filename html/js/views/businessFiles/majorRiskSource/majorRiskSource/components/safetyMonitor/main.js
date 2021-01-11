define(function (require) {
    var Vue = require("vue");
    var template = require("text!./main.html");
    var tabInfo = require("./tabInfo");
    // var tabRecord = require("./../mainPipeEquipment/tabRecord"); /原来是可以和主要管道设备那边共一个的
    //由于要加一个页签需要吧他分离出来
    var tabRecord=require("./tabRecord");
    var api = require("../../vuex/api");
    return Vue.extend({
        template: template,
        components: {
            tabInfo: tabInfo,
            tabRecord: tabRecord,
        },
        props: {
            model: Object,
        },
        data: function () {
            return {
                load:true,
                tabs: ['基本信息', '维护记录'],
                checkedTabIndex: 0,
                data: {
                    info: [],
                }
            }
        },
        methods: {
            doChangeTab:function(index) {
                this.checkedTabIndex = index;
            },
            loadMonitor: function () {
                var _this = this;
                api.queryMrsEquipments(this.model.id, "3").then(function (res) {
                    _this.data.info = res.data || [];
                })
            },
        },
        created:function(){
            //this.loadMonitor();
        },
        // watch: {
        //     'model.id': function (val) {
        //         if(!val)return ;
        //         var _this=this;
        //         if(this.load){
        //             this.loadMonitor();
        //             // this.$nextTick(function () {
        //             //     _this.loadMonitor();
        //             //     _this.load=true;
        //             // })
        //         }
        //         else{
        //             this.loadMonitor();
        //             this.load=true;
        //         }
        //
        //     }
        // }

    })
});
