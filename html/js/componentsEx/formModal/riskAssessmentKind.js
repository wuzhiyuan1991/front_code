define(function(require){
    var LIB = require('lib');
    //数据模型
    var tpl = require("text!./riskAssessmentKind.html");

    //初始化数据模型
    var newVO = function() {
        return {
            //
            name : null,
            id: null

        }
    };


    //Vue数据
    var dataModel = {
        mainModel : {
            vo : newVO(),
            opType : 'create',
            isReadOnly : false,
            title:"添加",
            name:'名称',
            //验证规则
            rules:{
                "name" : [LIB.formRuleMgr.length(100), LIB.formRuleMgr.require("名称")],
            },
            emptyRules:{}
        },

    };

    var detail = LIB.Vue.extend({
        mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
        template: tpl,
        watch: {

        },

        components : {

        },
        data:function(){
            return dataModel;
        },
        methods:{
            newVO : newVO,
            init: function (obj) {
                if(!obj){
                    this.mainModel.opType = 'create';
                    _.extend(this.mainModel.vo, newVO());
                } else{
                    this.mainModel.opType = 'update';
                    _.extend(this.mainModel.vo, obj);
                }

            },
            doSave : function() {
                //当beforeDoSave方法明确返回false时,不继续执行doSave方法, 返回undefine和true都会执行后续方法
                if(this.beforeDoSave() === false) {
                    return;
                }

                var _this = this;
                this.$refs.ruleform.validate(function (valid){
                    if (valid) {

                        var data = {};

                        var _vo = _this.buildSaveData() || _this.mainModel.vo;

                        _.deepExtend(data, _vo);

                        //_.deepExtend(_this.mainModel.vo, newVO());
                        if(_this.autoHide) {
                            _this.visible = false;
                        }

                        if (_this.mainModel.opType === "create") {
                            _this.$emit("do-save", data);
                        } else if (_this.mainModel.opType === "update") {
                            data = _this._checkEmptyValue(data);
                            _this.$emit("do-update", data);
                        }
                    }
                });
            },
        }
    });

    return detail;
});