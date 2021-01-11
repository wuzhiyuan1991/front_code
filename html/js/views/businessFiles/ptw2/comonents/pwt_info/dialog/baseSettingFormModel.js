define(function(require){
    var LIB = require('lib');
    //数据模型
    var tpl = require("text!./baseSettingFormModel.html");

    LIB.registerDataDic("iptw_card_column_setting_is_required", [
        ["0","否"],
        ["1","是"]
    ]);

    LIB.registerDataDic("iptw_card_column_setting_data_type", [
        ["1","文本"],
        ["2","文本(多行)"],
        ["3","整数"],
        ["4","小数"],
        ["5","日期时间"],
        ["6","日期时间(区间)"],
        ["7","人员"],
        ["8","承包商"],
        ["9","人员或承包商"]
    ]);

    LIB.registerDataDic("iptw_card_column_setting_is_inherent", [
        ["0","否"],
        ["1","是"]
    ]);

    //初始化数据模型
    var newVO = function() {
        return {
            id : null,
            //编码
            code : null,
            //字段名称
            name : null,
            //是否必填项 0:否,1:是
            isRequired : '0',
            //数据类型 1:文本,2:文本(多行),3:整数,4:小数,5:日期时间,6:日期时间(区间),7:人员,8:承包商,9:人员或承包商
            dataType : '1',
            //是否固化字段 0:否,1:是
            isInherent : '0',
            //字段原名称
            oldName : null,
            //启用/禁用 0:启用,1:禁用
            disable : "0",
            //作业票模板
            ptwCardTpl : {id:'', name:''},
        }
    };

    //Vue数据
    var dataModel = {
        modify:true,
        index:0,
        mainModel : {
            vo : newVO(),
            opType : 'add',
            isReadOnly : false,
            title:"详情",

            //验证规则
            rules:{
                "code" : [LIB.formRuleMgr.length(255)],
                "name" : [LIB.formRuleMgr.require("字段名称"),
                    LIB.formRuleMgr.length(100)
                ],
                "isRequired" : [LIB.formRuleMgr.require("是否必填项")],
                "dataType" : [LIB.formRuleMgr.require("数据类型")],
                "isInherent" : [LIB.formRuleMgr.require("是否固化字段")],
                "oldName" : [LIB.formRuleMgr.require("字段原名称"),
                    LIB.formRuleMgr.length(100)
                ],
                "disable" :LIB.formRuleMgr.require("状态"),
                // "ptwCardTpl.id" : [LIB.formRuleMgr.allowStrEmpty],
            }
        },
    };

    var detail = LIB.Vue.extend({
        mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
        template: tpl,
        props:{
            visible:{
                type:Boolean,
                default: false
            }
        },
        watch:{

        },
        data:function(){
            return dataModel;
        },
        methods:{
            newVO : newVO,
            codeMap : function (obj, str) {
                var defArr = ['code', 'name', 'workCatalog', 'applUnitId', 'workUnitId', 'workPlace', 'workContent', 'worker', 'permitTime'];
                var disArr = ['code', 'name', 'workCatalog', 'applUnitId', 'workUnitId', 'workPlace', 'workContent', 'worker', 'permitTime','jsaMasterId', 'safetyEducator', 'supervisior']

                if(str == 'require'){
                    if(disArr.indexOf(obj.code)>-1){
                        return true;
                    }else{
                        return false;
                    }
                }
                if(defArr.indexOf(obj.code)>-1){
                    return true;
                }else{
                    return false;
                }
            },

            init: function (item, opt, index) {
                this.mainModel.vo = this.newVO();
                if(item) _.extend(this.mainModel.vo, item);
                if(this.mainModel.vo.isInherent == '1'){this.mainModel.vo.dataType = '0'}
                this.mainModel.opType = opt;
                this.index = index;
            },
            doSave:function () {
                var _this = this;
                if(_this.mainModel.vo.isInherent!='1'){
                    _this.mainModel.vo.oldName = this.mainModel.vo.name;
                }
                this.$refs.ruleform.validate(function (valid){
                    if (valid) {
                        if(_this.mainModel.opType == 'add') _this.$emit("do-save", _this.mainModel.vo);
                        else if(_this.mainModel.opType == 'update') _this.$emit("do-update", _this.mainModel.vo, _this.index);
                    }
                });

            }
        }
    });

    return detail;
});