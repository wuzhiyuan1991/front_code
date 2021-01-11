define(function (require) {
    var Vue = require("vue");
    var LIB=require("lib");
    var template = require("text!./gas-detection.html");
    var model=require("../../model");
    return Vue.extend({
        template: template,
        components:{
        },
        props:{
            model:{
                type:Object,
                required:true,
            },
            selectIndex:{
                default: ''
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
                },
                rolesList: []
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
            changeSigner: function (val) {
                if(val == '1') this.model.enableGasDetection = '1';
            },
            getGasItems:function(data){
                return  this.model.ptwCardStuffs.filter(function (item) {
                    return  item.gasType==data.type;
                })
            },
            doCustomContent:function(type){
                this.$emit("on-custom-content",{type:4,gasType:type});
            },
            upDateList:function (arr) {
                this.rolesList.splice(0);
                var list  = [].concat(arr);
                var _this = this;
                // this.$nextTick(function () {
                //     _this.$set('rolesList', list);
                // });
                this.rolesList.splice(0);
                this.rolesList = this.rolesList.concat(_.map(list, function (item) {
                    return {
                        id: item.id,
                        signCatalog: item.signCatalog
                    }
                }));
                // 找不到选择id 置空
                // if(!_.find(this.roleList, "id", this.model.gasDetectionPersonnelId))
                //     this.model.gasDetectionPersonnelId = '';
            }
        },
        events: {
            "updateGasRolesList":function () {
                this.upDateList(arguments[0])
            }
        }

    });
});
