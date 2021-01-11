define(function(require){
    var LIB = require('lib');
    //数据模型
    var tpl = require("text!./group.html");
    var api = require("views/businessFiles/leadership/asmtTable/vuex/api");
    //初始化数据模型
    var newVO = function() {
        return {
            id : null,
            name : null
        }
    };

    //Vue数据
    var dataModel = {
        mainModel : {
            vo : newVO(),
            opType : '',
            isReadOnly : false,
            title:"新增自评项分组",
            rules:{
                "name" : [
                    LIB.formRuleMgr.require("分组名称"),
                    LIB.formRuleMgr.length()
                ]
            }
        }
    };

    var group = LIB.Vue.extend({
        mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
        template: tpl,
        data:function(){
            return dataModel;
        },
        methods:{
            newVO : newVO
        },
        ready:function(){

        }
    });

    return group;
});