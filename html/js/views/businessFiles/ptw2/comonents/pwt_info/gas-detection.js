define(function (require) {
    var Vue = require("vue");
    var LIB=require("lib");
    var template = require("text!./gas-detection.html");
    var api=require("../../api");
    var model=require("../../model");
    return Vue.extend({
        template: template,
        components:{
        },
        props:{
            model:{
                type:Object,
                required:true,
            }
        },
        computed:{

        },
        data: function () {
            return {
                gasTypeList:[],
                tableModel:{
                    preCheckRecord:LIB.Opts.extendMainTableOpt({
                        selectedDatas:[],
                        values:[],
                        columns:[
                            {
                                title: '气体类型',
                                fieldName: "name",
                            },
                            {
                                title: '项目',
                                fieldName: "unit",
                                type:'text',
                            },
                            {
                                title: '单位',
                                fieldName: "content",
                            },
                            {
                                title: '数值',
                                fieldName: "content",
                            },
                        ],
                    }),
                    checkingRecord:LIB.Opts.extendMainTableOpt({
                        selectedDatas:[],
                        values:[],
                        columns:[
                            {
                                title: '气体类型',
                                fieldName: "name",
                            },
                            {
                                title: '项目',
                                fieldName: "unit",
                                type:'text',
                            },
                            {
                                title: '单位',
                                fieldName: "content",
                            },
                            {
                                title: '数值',
                                fieldName: "content",
                            },
                        ],
                    })
                }
            }
        },
        created:function(){
            var  _this=this;
            var temp=[];
            for (key in model.gasType){
                temp.push({
                    type:key,
                    name:model.gasType[key],
                })
            }
            this.gasTypeList=temp;
        },
        methods: {
            getGasItems:function(data){
                return  this.model.ptwCardStuffs.filter(function (item) {
                    return  item.gasType==data.type;
                })
            },
            doCustomContent:function(type){
                this.$emit("on-custom-content",{type:4,gasType:type});
            }
        }
    })
})
