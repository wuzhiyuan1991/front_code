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
        jsonList: [],
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
        computed: {
            getAttr2User: function () {
                if(this.model.principals){
                    return _.pluck(this.model.principals, 'name').join('，');
                }
            },
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
            showFn: function () {
                var jsonList = (this.model.workPermit && this.model.workPermit.attr3) || '';
                if(jsonList) this.jsonList = JSON.parse(jsonList);
                else this.jsonList = []
            },
            findName: function (val) {
                var obj = _.find(this.jsonList, function (item) {
                    return item.oldName == val;
                });
                if(obj) return obj.name;
                return val
            },
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