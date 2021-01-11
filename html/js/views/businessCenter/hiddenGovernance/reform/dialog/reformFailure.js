define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("../../vuex/api");
    var tpl = require("text!./reformFailure.html");
    var newVO = function () {
        return {
            remark: null
        }
    };
    var dataModel = {
        mainModel : {
            vo:new newVO()
        },
        rules : {
            remark : [{required: true, message: '请输入受阻原因'},LIB.formRuleMgr.length(500,1)]
        }
    }

    var detail = LIB.Vue.extend({
        template:tpl,
        props:{
            poolId:String
        },
        data:function(){
            return dataModel;
        },
        watch:{
            poolId:function(){
                this.mainModel.vo = new newVO();
            }
        },
        methods:{
            doSave:function(){
                var _this = this;
                this.$refs.ruleform.validate(function (valid) {
                    if(valid){
                        var formData = {'id': _this.poolId, "remark":_this.mainModel.vo.remark };
                        api.reformFail(null, formData).then(function (res) {
                            if (!res.data || res.data.error == "0") {
                                LIB.Msg.info("上报成功");
                                _this.$emit("on-success");
                            } else {
                                LIB.Msg.info("上报失败");
                                _this.$emit("on-failure");
                            }
                        })
                    }
                });
            },
        }
    });
    return detail;
});