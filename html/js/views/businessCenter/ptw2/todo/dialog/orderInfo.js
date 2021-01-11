define(function(require){
    var LIB = require('lib');
    //数据模型
    var tpl = require("text!./orderInfo.html");

    //初始化数据模型
    var newVO = function() {
        return {
            //评审结果
            signResult:1,
            //评审意见
            signOpinion : null,
        }
    };

    //Vue数据
    var dataModel = {
        modify:true,
        mainModel : {
            vo : newVO(),
            opType : 'create',
            isReadOnly : true,
            title:"作业批转人会签",
            //验证规则
            rules:{
                "signResult":[LIB.formRuleMgr.require("评审结果")],
                "signOpinion":[LIB.formRuleMgr.length(10)],
            },
            userName:LIB.user.name
        },
    };

    var detail = LIB.Vue.extend({
        mixins : [LIB.VueMixin.dataDic],

        template: tpl,
        props:{
            model:{
                type:Object,
                default:null
            },
            visible:{
                type:Boolean,
                default:true
            }
        },
        watch:{
           model:function (val) {
           }
        },
        data:function(){
            return dataModel;
        },
        methods:{
            newVO : newVO,

            beforeInit:function () {
                this.mainModel.vo = this.newVO();
            },
            afterInitData:function () {
                this.mainModel.vo.auditResult = 2;
            },

        }
    });

    return detail;
});