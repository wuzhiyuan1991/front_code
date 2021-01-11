define(function(require){
    var LIB = require('lib');
    //数据模型
    var tpl = require("text!./authorizeModal.html");
    var api = require("../vuex/api")
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");

    //初始化数据模型
    var newVO = function() {
        return {
            //评审结果
            auditResult:2,
            //评审意见
            auditOpinion : null,
            principals:[],
            attr2: null,
            relId:null
        }
    };

    //Vue数据
    var dataModel = {
        modify:true,
        mainModel : {
            vo : newVO(),
            opType : 'create',
            isReadOnly : false,
            title:"作业签发委托",
            //验证规则
            rules:{
                "principals": [{type: "array",required:true, message:"请选择委托人"}],
                // "principals":[{type:"array", required: true, validator:function (rule, value, callback) {
                //     if(value.length == 0){
                //         return callback(new Error("请添加请选择委托人"))
                //     }
                //     return callback();
                // }}],
                "relId": [LIB.formRuleMgr.require("签发角色")],
                "auditResult":[LIB.formRuleMgr.length(500)],
                "auditOpinion":[LIB.formRuleMgr.length(200)],
            },
        },
        showUserSelectModal: {
            show: false,
            type:'audit',
            select:true
        },
        selectRoleModel:{
            id:null,
            list: []
        }
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
            },
            vo:{
                type: Object,
                default: null
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
                this.mainModel.vo.principals = [];
                this.selectRoleModel.list = [];
                this.mainModel.vo.relId = null;
                var _this = this;
                api.queryCountersignroles({id: this.vo.lastPermitId}).then(function (res) {
                    console.log(res)
                    _this.selectRoleModel.list = _.map(res.data, function (item) {
                        return {
                            value: item.id,
                            label: item.signCatalog.name
                        }
                    })
                });
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