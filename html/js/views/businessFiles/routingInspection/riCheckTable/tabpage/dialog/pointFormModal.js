define(function (require) {
    var LIB = require('lib');
    var api = require("../../vuex/api");
    var tpl = require("text!./pointFormModal.html");

    //初始化数据模型
    var newVO = function () {
        return {
            name: '',
            remarks: '',
            riCheckAreaTpl: null,
            refType: '1'
        }
    };

    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            opType: 'create',
            isReadOnly: false,
            title: "添加巡检点",

            //验证规则
            rules: {
                // "code": [LIB.formRuleMgr.length()],
                "name": [
                    LIB.formRuleMgr.require("巡检点"),
                    LIB.formRuleMgr.length(100)
                ],
                "remarks": [
                    LIB.formRuleMgr.length(500)
                ]
            },
            emptyRules: {}
        }
    };

    var detail = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic],
        template: tpl,
        props: {
            visible: {
                type: Boolean,
                default: false
            }
        },
        data: function () {
            return dataModel;
        },
        watch: {
            visible: function (nVal) {
                if(nVal) {

                }
            }
        },
        methods: {
            newVO: newVO,
            doSave : function() {
                var _this = this;
                this.$refs.ruleform.validate(function (valid){
                    if (valid) {
                        api.createRiCheckPointTpl({id: _this.areaId}, _this.mainModel.vo).then(function () {
                            LIB.Msg.success("保存成功");
                            _this.visible = false;
                            _this.$emit("do-save")
                        })
                    }
                });
            },
            _initCreate: function () {
                this.mainModel.vo = newVO();
            },
            _initUpdate: function () {
                
            }
        },
        events: {
            'do-check-point': function (type, obj, item) {
                this.operationtype = type;
                this.areaId = obj.id;
                if(type === 'create') {
                    this._initCreate();
                    this.mainModel.vo.riCheckAreaTpl = {id: obj.tplId};
                } else if(type === 'update') {
                    this._initUpdate(item)
                }
            }
        }
    });

    return detail;
});