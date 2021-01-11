define(function(require){
    var LIB = require('lib');
    //数据模型
    var tpl = require("text!./itemFormModal.html");
    var api = require("../vuex/api");
    var riskModel = require("views/basicSetting/basicFile/evaluationModel/dialog/riskModel");
    //初始化数据模型
    var newVO = function() {
        return {
            //ID
            id : null,
            //
            code : null,
            //工作内容名称
            name : null,
            //类型 0 行为类   1 状态类  2 管理类
            type : '0',
            //
            compId : null,
            //组织id
            orgId : null,
            //工作内容来源标识 0转隐患生成 1危害辨识生成  2手动生成
            // category : null,
            //是否禁用，0启用，1禁用
            disable : "0",
            //是否被使用 0：未使用 1已使用
            isUse : null,
            //备注
            remarks : null,
            //修改日期
            modifyDate : null,
            //创建日期
            createDate : null,
            //检查分类
            riskType : {id:'', name:''},
            //检查方法
            checkMethods : [],
            riskTypeId:null

        }
    };

    //风险等级模型选择对象
    var newRiskModel = function () {
        return {
            id: null,
            opts: [],
            latId: null,
            result: null
        };
    };
    //Vue数据
    var dataModel = {
        mainModel : {
            vo : newVO(),
            opType : '',
            isReadOnly : false,
            title:"新增",
            showRisktypeSelectModal : false,
            riskModel : newRiskModel,
            typeList:[{id:"0",name:"行为类"},{id:"1",name:"状态类"},{id:"2",name:"管理类"}],
            //验证规则
            rules:{
                //"code":[LIB.formRuleMgr.require("编码")]
                "code" : [LIB.formRuleMgr.require(""),
                    LIB.formRuleMgr.length()
                ],
                "name" : [
                    LIB.formRuleMgr.require("工作内容名称"),
                    LIB.formRuleMgr.length(300, 0)
                ],
                "riskModel" : [
                    { required: true, validator: function (rule, value, callback) {
                        var errors = [];
                        var riskModel = JSON.parse(value);
                        if (_.isNull(riskModel) || _.isNull(_.propertyOf(riskModel)("id"))) {
                            errors.push("请选择风险等级");
                        }
                        callback(errors);
                    }
                    }
                ],
                "type" : [LIB.formRuleMgr.require("类型"),
                    LIB.formRuleMgr.length()
                ],
                "compId" : [{required: true, message: '请选择所属公司'},
                    LIB.formRuleMgr.length()
                ]
            },
            emptyRules:{}

        },
        riskTypeList:[],
        selectedDatas:[],
        riskTypeId:null,
        riskTypeName:null,
    };

    var detail = LIB.Vue.extend({
        mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
        template: tpl,
        components : {
            'riskModel':riskModel,
        },
        data:function(){
            return dataModel;
        },
        methods:{
            newVO : newVO,
            beforeDoSave:function(){
                this.mainModel.vo.riskModel = JSON.stringify(this.mainModel.riskModel);
                if(this.selectedDatas.length > 0){
                    this.mainModel.vo.riskType.name = this.selectedDatas[0].name;
                }
            },
            beforeInit:function(){
                this.selectedDatas=[];
                this.mainModel.riskModel = newRiskModel();
                this.mainModel.opType = 'create';
                api.checkItemType().then(function(res){
                    dataModel.riskTypeList = res.data;
                });
            },
            afterInitData: function (data) {
                if(this.mainModel.vo.riskModel) {
                    this.mainModel.riskModel = JSON.parse(this.mainModel.vo.riskModel);
                }
            }
        },
        ready:function(){

        }
    });

    return detail;
});