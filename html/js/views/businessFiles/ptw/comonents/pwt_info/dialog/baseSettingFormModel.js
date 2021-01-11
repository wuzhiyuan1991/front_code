define(function(require){
    var LIB = require('lib');
    var formItemRow=require("../form-item-row");

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
        ["9","人员或承包商"],
        ["10","值集类型"],
        ["11","布尔类型"]
    ]);

    LIB.registerDataDic("iptw_card_column_setting_is_inherent", [
        ["0","否"],
        ["1","是"]
    ]);

    LIB.registerDataDic("iptw_card_column_setting_is_disable", [
        ["0","启用"],
        ["1","停用"]
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
            value:null   //值
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
                "value": [
                    {validator:function(rule, value, callback){
                        if(!value || value.length==0) return callback(new Error('请定制值集'))
                        return callback();
                    }}
                ]
                // "ptwCardTpl.id" : [LIB.formRuleMgr.allowStrEmpty],
            }
        },
    };

    var detail = LIB.Vue.extend({
        mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
        template: tpl,
        components: {
            "formItemRow":formItemRow
        },
        props:{
            visible:{
                type:Boolean,
                default: false
            }
        },
        watch:{
            "mainModel.vo.disable":function (val) {
                if(this.codeMap(this.mainModel.vo, "require")){
                    // this.mainModel.vo.isRequired = val=='0'?'1':'0';
                }
            }
        },
        data:function(){
            return dataModel;
        },
        methods:{
            newVO : newVO,
            doDelListAll: function () {
                this.listModel.list.splice(0);
            },
            doDelListItem: function (item, index) {
                this.listModel.list.splice(index, 1);
            },
            doEditList: function (item, name) {
                item.name = name;
            },
            doSaveList: function (datas) {
                var _this = this;
                _.each(datas, function (item) {
                    if(item && item.name && item.name.trim()){
                        var obj = _.find(_this.listModel.list, 'name', item.name);
                        if(!obj) _this.listModel.list.push(item);
                    }
                })
            },
            codeMap : function (obj, str) {
                var defArr = ['createBy','code', 'name', 'workCatalog', 'applUnitId', 'workUnitId', 'workPlace', 'workContent', 'worker', 'permitTime'];
                var disArr = ['createBy', 'code', 'name', 'workCatalog', 'applUnitId', 'workUnitId', 'workPlace', 'workContent', 'worker', 'permitTime','jsaMasterId', 'safetyEducator', 'supervisior', 'mainEquipment', 'specialWorker', 'operatingType'];

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
                this.listModel.list =[];
                _.extend(this.mainModel.vo, this.newVO());
                if(item) _.extend(this.mainModel.vo, item);
                if(this.mainModel.vo.isInherent == '1'){this.mainModel.vo.dataType = '0'}
                this.mainModel.opType = opt;
                this.index = index;
                if(this.mainModel.vo.dataType == '10'){
                    this.listModel.list = _.map(this.mainModel.vo.value, function (item) {
                        return {
                            name: item.content,
                            id: '',
                            result: '1'
                        }
                    })
                }
            },
            doSave:function () {
                var _this = this;
                if(_this.mainModel.vo.isInherent!='1'){
                    _this.mainModel.vo.oldName = this.mainModel.vo.name;
                }

                if(_this.mainModel.vo.dataType == '10'){
                    _this.mainModel.vo.value = _.map(this.listModel.list, function (item) {
                        return {
                            content: item.name,
                            result: '1'
                        }
                    })
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