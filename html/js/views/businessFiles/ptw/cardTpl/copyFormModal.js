define(function(require){
    var LIB = require('lib');
    var tpl = require("text!./copyFormModal.html");

    //初始化数据模型
    var newVO = function() {
        return {
            id : null,
            //字段名称
            name : null,
            orgId: LIB.user.orgId,
            compId: LIB.user.compId
        }
    };

    //Vue数据
    var dataModel = {
        modify:true,
        index:0,
        listModel:{
            show: false,
            list:[]
        },
        mainModel : {
            vo : newVO(),
            opType : 'add',
            isReadOnly : false,
            title:"复制模板",
            //验证规则
            rules:{
                "code" : [LIB.formRuleMgr.length(255)],
                "name" : [LIB.formRuleMgr.require("新模板名称"),
                    LIB.formRuleMgr.length(200)
                ],
            }
        },
    };

    var detail = LIB.Vue.extend({
        mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
        template: tpl,
        data:function(){
            return dataModel;
        },
        methods:{
            newVO: newVO,
            init: function (item) {
                this.mainModel.vo = newVO();
                this.mainModel.vo.name = item.name + "（复制）";
                this.mainModel.vo.id = item.id;
            },
            doSave:function () {
                var _this = this;
                this.$refs.ruleform.validate(function (valid){
                    if (valid) {
                        _this.visible = false;
                        _this.$emit("do-save", _this.mainModel.vo);
                    }
                });
            }
        }
    });

    return detail;
});