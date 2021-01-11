define(function(require){
    var LIB = require('lib');
    //数据模型
    var tpl = require("text!./riskJudgmentTempleteFormModal.html");

    //初始化数据模型
    var newVO = function() {
        return {
            //
            name : null,
            riskJudgmentLevelId:'',
            id:''
        }
    };

    //Vue数据
    var dataModel = {
        mainModel : {
            vo : newVO(),
            opType : 'create',
            isReadOnly : false,
            title:"新增研判书模板",
            name:'模板名称',
            //验证规则
            rules:{
                "name" : [LIB.formRuleMgr.length(100), LIB.formRuleMgr.require("风险研判")],
            },
            emptyRules:{}
        },
        selectModel : {

        },

    };

    var detail = LIB.Vue.extend({
        mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
        template: tpl,
        components : {

        },
        data:function(){
            return dataModel;
        },
        methods:{
            newVO : newVO,

        }
    });

    return detail;
});