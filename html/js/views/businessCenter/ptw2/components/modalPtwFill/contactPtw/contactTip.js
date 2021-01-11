define(function (require) {
    var Vue = require("vue");
    var LIB = require("lib");
    var template = require("text!./contactTip.html");
    var api = require("../../../workCard/vuex/api");
    var modalContactPtw=require("./contactPtw")
    return Vue.extend({
        template: template,
        components: {
            modalContactPtw:modalContactPtw,
        },
        props: {
            workCard:Object,
        },
        data: function () {
            return {
                tableModel:{
                    contactPtw:LIB.Opts.extendDetailTableOpt({
                        columns: [
                            {
                                title: "序号",
                                fieldType: "sequence",
                                width: 70,
                            },
                            {
                                title:"作业类型",
                                render:function(data){
                                    if(data){
                                        return  data.workCatalog?data.workCatalog.name+(data.workLevel?data.workLevel.name:''):"";
                                    }
                                },
                            },
                            {
                                fieldType: "custom",
                                title: "作业票",
                                render:function (data) {
                                    if(data.relCard){
                                        // return "<a>"+data.code+"（"+ data.workContent +"）</a>"
                                        var routerPart="/html/main.html#!/ptw/businessCenter/ptwRecord?method=detail&id=";
                                        var content=data.relCard&&data.relCard.code?(data.relCard.code+"("+data.relCard.workContent +")"):"";
                                        return "<a target='_blank' href='"+routerPart+data.relCard.id+"'>"+content+"</a>";
                                    }
                                    return  "";
                                },
                                tipRender:function (data) {
                                    var content=data.relCard&&data.relCard.code?(data.relCard.code+"("+data.relCard.workContent +")"):"";
                                    return content;
                                }

                            },
                            // {
                            //     title: "",
                            //     fieldType: "tool",
                            //     toolType: "del"
                            // }
                            ],
                        values:[],
                    })
                }
            }
        },
        created:function(){
            this.loadContactData();
        },
        methods:{
            doSetContact:function(){
                this.$refs.contactPtw.init(this.workCard);
            },
            loadContactData:function () {
                var _this=this;
                if(this.workCard&&this.workCard.id) {
                    api.queryWorkCardRelations({id: this.workCard.id}).then(function (res) {
                        _this.tableModel.contactPtw.values = res.data;
                    })
                }
            },
            doSuccess:function () {
                this.loadContactData();
            }

        },
        watch:{
            'workCard.id':function (val) {
                if(val){
                  this.loadContactData();
                }
            }
        }

    })
})