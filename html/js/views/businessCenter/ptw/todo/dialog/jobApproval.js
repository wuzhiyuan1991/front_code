define(function(require){
    var LIB = require('lib');
    //数据模型
    var tpl = require("text!./jobApproval.html");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");

    //初始化数据模型
    var newVO = function() {
        return {
            //评审结果
            auditResult:2,
            //评审意见
            auditOpinion : null,
            principals:null,
            attr2: null
        }
    };

    //Vue数据
    var dataModel = {
        modify:true,
        mainModel : {
            vo : newVO(),
            opType : 'create',
            isReadOnly : false,
            title:"作业预约审批",
            //验证规则
            rules:{
                "auditResult":[LIB.formRuleMgr.require("评审结果")],
                "auditOpinion":[LIB.formRuleMgr.length(200)],
            },
        },
        showUserSelectModal: {
            show: false,
            type:'audit',
            select:true
        },
    };

    var detail = LIB.Vue.extend({
        mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
        template: tpl,
        components:{
            "userSelectModal":userSelectModal,
        },
        props:{
            id:{
                type:String,
                default:null
            }
        },
        watch:{
            visible:function (val) {
                val && this.afterInitData();
            },
            id:function (val) {
                this.this.mainModel.vo.auditOpinion = null;
            }
        },
        data:function(){
            return dataModel;
        },
        methods:{
            newVO : newVO,
            removeAttr2: function (data) {
                this.mainModel.vo.principals = _.reject(this.mainModel.vo.principals, function (item) {
                    return item.id == data.id;
                })
                this.mainModel.vo.attr2 = _.pluck(this.mainModel.vo.principals, 'id').join(',');
            },
            showUser: function (type) {
                this.showUserSelectModal.show = true;
                this.showUserSelectModal.type = type;
                type=='audit'?this.showUserSelectModal.select=true: this.showUserSelectModal.select=false;
            },
            doSaveUser: function (selectedDatas) {
                 this.mainModel.vo.principals = selectedDatas || [];
                 this.mainModel.vo.attr2 = _.pluck(this.mainModel.vo.principals, 'id').join(',')
            },
            beforeInit:function () {
                this.mainModel.vo = this.newVO();
            },
            afterInitData:function () {
                this.mainModel.vo.auditResult = '2';
                this.mainModel.vo.auditOpinion = null;
            },
            // doSave : function() {
            //     //当beforeDoSave方法明确返回false时,不继续执行doSave方法, 返回undefine和true都会执行后续方法
            //     if(this.beforeDoSave() === false) {
            //         return;
            //     }
            //     var _this = this;
            //     this.$refs.ruleform.validate(function (valid){
            //         if (valid) {
            //             var data = {};
            //
            //             var _vo = _this.buildSaveData() || _this.mainModel.vo;
            //
            //             _.deepExtend(data, _vo);
            //
            //             //_.deepExtend(_this.mainModel.vo, newVO());
            //             if(_this.autoHide) {
            //                 _this.visible = false;
            //             }
            //             if (_this.mainModel.opType === "create") {
            //                 _this.$emit("do-save", data);
            //             } else if (_this.mainModel.opType === "update") {
            //                 data = _this._checkEmptyValue(data);
            //                 _this.$emit("do-update", data);
            //             }
            //         }
            //     });
            // },
        }
    });

    return detail;
});