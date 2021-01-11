define(function(require){
    var LIB = require('lib');
    //数据模型
    var tpl = require("text!./item.html");
    var api = require("views/businessFiles/leadership/asmtTable/vuex/api");
    var asmtBasisSelectModal = require("componentsEx/selectTableModal/asmtBasisSelectModal");
    //初始化数据模型
    var newVO = function() {
        return {
            //ID
            id : null,
            //编码
            code : null,
            //自评名称
            name : null,
            //自评分值
            score : null,
            //公司id
            compId : null,
            //组织id
            orgId : null,
            //自评项来源标识 2手动生成
            category : null,
            //是否禁用 0启用,1禁用
            disable : null,
            //分组名称
            groupName : null,
            //组排序
            groupOrderNo : null,
            //是否被使用 0未使用,1已使用 暂时不用
            isUse : null,
            //项排序
            itemOrderNo : null,
            //备注
            remarks : null,
            //类型 0行为类,1状态类,2管理类 暂时不用
            type : null,
            //修改日期
            modifyDate : null,
            //创建日期
            createDate : null,
            //自评依据
            asmtBasisList : [{id:'', name:''}],
            //自评表
            asmtTable : {id:'', name:''},
        }
    };


    //Vue数据
    var dataModel = {
        mainModel : {
            vo : newVO(),
            opType : '',
            isReadOnly : false,
            title:"编辑自评项",
            rules:{
                "name" : [
                    LIB.formRuleMgr.require("自评项"),
                    LIB.formRuleMgr.length(200)
                ],
                "score": [
                    LIB.formRuleMgr.require("分数"),
                    LIB.formRuleMgr.length(),
                    {
                        validator: function(rule, value, callback) {
                            var r = /^[0-9]*[1-9][0-9]*$/g;
                            var isNegative = r.test(value);
                            if(!isNegative) {
                                return callback(new Error("分数必须是正整数"))
                            }
                            if(value > 9999) {
                                return callback(new Error("分数最大为9999"))
                            }
                            return callback();
                        }
                    }
                ]
            }
        },
        selectModel: {
            visible: false
        }
    };

    var group = LIB.Vue.extend({
        mixins : [LIB.VueMixin.dataDic],
        template: tpl,
        components: {
            asmtBasisSelectModal: asmtBasisSelectModal
        },
        props: {
            visible: {
                type: Boolean,
                default: false
            }
        },
        watch : {
            // visible : function(val) {
            //     //当隐藏组件时清空当前数据
            //     if(!val) {
            //         _.deepExtend(this.mainModel.vo, this.newVO());
            //         this.mainModel.opType = "create";
            //     }
            // }
        },
        data:function(){
            return dataModel;
        },
        methods:{
            newVO : newVO,
            doShowAsmtBasisSelectModal: function () {
                this.selectModel.visible = true;
            },
            doSaveAsmtBasis: function (data) {
                this.mainModel.vo.asmtBasisList = data;
            },
            doSave : function() {
                var _this = this;
                this.$refs.ruleform.validate(function (valid){
                    if (valid) {
                        var data = _.assign({}, _this.mainModel.vo);
                        if (_this.mainModel.opType === "create") {
                            _this.$emit("do-save", data);
                        } else if (_this.mainModel.opType === "update") {
                            _this.$emit("do-update", data);
                        }
                        _this.visible = false;
                    }
                });
            },
            changeView:function(opType) {
                this.mainModel.opType = opType;
                if(_.contains(["view","update"], opType)) {
                    this.mainModel.title = this.$tc("gb.common.detail");
                    // this.mainModel.isReadOnly = true;
                } else if(opType === "create"){
                    this.mainModel.title = this.$tc("gb.common.add");
                    // this.mainModel.isReadOnly = false;
                }
            },
            //查看/更新 记录前先初始化视图
            init:function(opType, nVal) {
                this.beforeInit && this.beforeInit();
                this.mainModel.opType = opType;
                this.mainModel.vo = newVO();
                //清空数据
                // _.deepExtend(this.mainModel.vo, this.newVO());

                //重置表单校验
                this.$refs.ruleform.resetFields();

                this.changeView(opType);

                if(_.contains(["view","update"], opType)) {
                    _.deepExtend(this.mainModel.vo, nVal);
                }
            }
        },
        ready:function(){

        }
    });

    return group;
});