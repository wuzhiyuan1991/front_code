define(function(require){
    var LIB = require('lib');
    //数据模型
    var tpl = require("text!./ptwBlindPlateFormModal.html");
    // var ptwWorkPermitSelectModal = require("componentsEx/selectTableModal/ptwWorkPermitSelectModal");

    //初始化数据模型
    var newVO = function() {
        return {
            //编码
            code : null,
            //盲板编号
            number : null,
            //盲板规格
            specification : null,
            //盲板材质
            texture : null,
            //压力
            pressure : null,
            //温度
            temperature : null,
            //介质
            medium : null,
            //设备管道名称
            pipeName : null,
            //启用/禁用 0:启用,1:禁用
            disable : "0",
            //作业许可
            // workPermit : {id:'', name:''},
            //操作明细
            // blindPlateOperations : [],
        }
    };

    //Vue数据
    var dataModel = {
        mainModel : {
            vo : newVO(),
            opType : 'create',
            isReadOnly : false,
            title:"添加",

            //验证规则
            rules:{
                "code" : [LIB.formRuleMgr.length(255)],
                "number" : [LIB.formRuleMgr.require("盲板编号"),
                    LIB.formRuleMgr.length(200)
                ],
                "specification" : [LIB.formRuleMgr.require("盲板规格"),
                    LIB.formRuleMgr.length(200)
                ],
                "texture" : [LIB.formRuleMgr.require("盲板材质"),
                    LIB.formRuleMgr.length(200)
                ],
                "pressure" : LIB.formRuleMgr.range(0, 10000000, 2).concat(LIB.formRuleMgr.require("压力")),
                // "temperature" : LIB.formRuleMgr.range(0, 10000000, 1).concat(LIB.formRuleMgr.require("温度")),
                temperature: [LIB.formRuleMgr.require("温度"), { validator: function (rule, value, callback) {
                   if(isNaN(value)){
                    return callback(new Error('请输入1~100之间的整数或1位小数'))
                   }
                    if(value>100 ||value<1){
                        return callback(new Error('请输入1~100之间的整数或1位小数'))
                    }
                    if(value.indexOf('.')){
                        var arr = value.split('.');
                        if(arr[1] && arr[1].length>1){
                            return callback(new Error('请输入1~100之间的整数或1位小数'))
                        };
                    }
                    return callback()
                }}],
                "medium" : [LIB.formRuleMgr.require("介质"),
                    LIB.formRuleMgr.length(200)
                ],
                "pipeName" : [LIB.formRuleMgr.require("设备管道名称"),
                    LIB.formRuleMgr.length(200)
                ],
                "disable" :LIB.formRuleMgr.require("状态"),
                "workPermit.id" : [LIB.formRuleMgr.require("作业许可")],
            },
            emptyRules:{}
        },
        selectModel : {
            workPermitSelectModel : {
                visible : false,
                filterData : {orgId : null}
            },
        },

    };

    var detail = LIB.Vue.extend({
        mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
        template: tpl,
        components : {
            // "ptwworkpermitSelectModal":ptwWorkPermitSelectModal,

        },
        data:function(){
            return dataModel;
        },
        methods:{
            initData: function (data) {
                this.mainModel.vo = new newVO();
                if(data)
                    _.extend(this.mainModel.vo, data);
            },
            newVO : newVO,
            doShowWorkPermitSelectModal : function() {
                this.selectModel.workPermitSelectModel.visible = true;
                //this.selectModel.workPermitSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
            },
            doSaveWorkPermit : function(selectedDatas) {
                if (selectedDatas) {
                    this.mainModel.vo.workPermit = selectedDatas[0];
                }
            },

        }
    });

    return detail;
});