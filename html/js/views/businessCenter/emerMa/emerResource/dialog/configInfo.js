define(function(require){
    var LIB = require('lib');
    //数据模型
    var tpl = require("text!./configInfo.html");
    var api = require("../vuex/api");

    //初始化数据模型
    var newVO = function () {
        return {
            isHazardousChemicalEnterprise:'',
            enterpriseScale:'',
            hazardLevel:''
        }
    };

    var detail = LIB.Vue.extend({
        computed:{
            getList:function () {
                var arr = this.getDataDicList('iem_emer_plan_status');
                var list = [];
                var _this = this;
                if(parseInt(this.vo.type) === 3){
                    _.each(arr, function (item, index) {
                        if(index !== 3 && index!==4 && index < parseInt(_this.vo.status)){
                            list.push(item);
                        }
                    })
                }else{
                    _.each(arr, function (item, index) {
                        if(index < parseInt(_this.vo.status)){
                            list.push(item);
                        }
                    })
                }
                return list;
            }
        },
        mixins : [LIB.VueMixin.dataDic],
        template: tpl,
        components:{
        },
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            vo:{
                type:Object,
                // default:''
            },
            orgId:{
                type:String,
                default:''
            }
        },
        watch:{
            visible:function(val){
                val && this._init()
            }
        },

        data:function(){
            return {
                nodeFlag: {

                }, // 编辑框相关插入操作记录
                mainModel : {
                    title:"详情",
                    vo:newVO(),
                    isReadOnly:true,
                    rules:{
                        "isHazardousChemicalEnterprise" : [LIB.formRuleMgr.require("危化品企业"),
                            LIB.formRuleMgr.length(50)
                        ],
                        "enterpriseScale" : [LIB.formRuleMgr.require("企业规模"),
                            LIB.formRuleMgr.length(50)
                        ],
                        "hazardLevel" : [LIB.formRuleMgr.require("危险源级别"),
                            LIB.formRuleMgr.length(50)
                        ],
                    }
                },
                /*  isHazardousChemicalEnterprise：是否为危化品企业 0:否,1:是
                    *  enterpriseScale：企业规模 1:300人以下或营收2000万以下,2:300人以上或营收2000万以上,3:1000人以上或营收40000万以上
                    *  hazardLevel：危险源级别 1:一级危化品重大危险源,2:二级危化品重大危险源,3:三级危化品重大危险源,4:四级危化品重大危险源
                    *  compId: 公司id
                    ***/
                isHazardousChemicalEnterprise:[
                    {id:'0',value:"否"},
                    {id:'1',value:"是"},
                ],
                enterpriseScale:[
                    {id:'1',value:"300人以下或营收2000万以下"},
                    {id:'2',value:"300人以上或营收2000万以上"},
                    {id:'3',value:"1000人以上或营收40000万以上"}
                ],
                hazardLevel:[
                    {id:'1',value:"一级危化品重大危险源"},
                    {id:'2',value:"二级危化品重大危险源"},
                    {id:'3',value:"三级危化品重大危险源"},
                    {id:'4',value:"四级危化品重大危险源"}
                ],


            };
        },

        methods:{
            doClose:function () {
                this.visible =  false;
            },
            getOperateTime:function (val) {
                var str  = (val + "").substr(0, 16);
                return str;
            },
            //    获取文件
            //    this.getFileList(this.uploadModel.params.recordId);
            _init:function () {
                var param = '';
                var _this = this;

                this.mainModel.vo = newVO();
                api.getEnterpriseGradeByCompId({compId:this.orgId}).then(function (res) {
                    if(res.data){
                        _this.mainModel.vo = res.data;
                    }
                });
            },
            doSaveInfo:function () {
                var _this = this;
                this.$refs.ruleform.validate(function (val) {
                    if(val){
                        _this.mainModel.vo.compId = _this.orgId;
                        api.createEnterpriseGrade(_this.mainModel.vo).then(function (res) {
                            _this.visible = false;
                            _this.$emit("change");
                        })
                    }
                })
            },

            doClose:function () {
                this.visible = false;
            },
            doShowCargoPoint:function () {
                this.selectModel.cargoPointSelectModel.filterData.id = this.id;
                this.selectModel.cargoPointSelectModel.visible = true;
            },

            getUUId:function () {
                api.getUUID().then(function(res){
                    var group={};
                    group.id = res.data;

                });
            },


        },
        init: function(){
            this.$api = api;
        }

    });

    return detail;
});