define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require('../../vuex/api');
    var tpl = require("text!./areaFormModal.html");
    var dominationAreaSelectModal = require("componentsEx/selectTableModal/dominationAreaSelectModal");

    var newVO = function () {
        return {
            id: '',
            name: '',
            orderNo: '',
            orgId: '',
            compId: '',
            dominationArea: {id: '', name: ''}
        }
    };
    var initDataModel = function () {
        return {
            //控制全部分类组件显示
            mainModel: {
                title: "编辑巡检区域",
                vo: newVO(),
                rules: {
                    "code": [LIB.formRuleMgr.length()],
                    "name": [
                        LIB.formRuleMgr.require("巡检区域名称"),
                        LIB.formRuleMgr.length(100)
                    ],
                    "compId": [
                        LIB.formRuleMgr.require("所属公司")
                    ],
                    "orgId": [
                        LIB.formRuleMgr.require("所属部门")
                    ],
                    "dominationArea.id": [
                        LIB.formRuleMgr.require("属地")
                    ]
                }
            },
            dominationAreaSelectModel: {
                visible: false,
                filterData: {orgId: null}
            },
            isUpdate:false,
            enableDeptFilter: false,//是否启用部门过滤
        }
    };

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
        template: tpl,
        components: {
            "dominationareaSelectModal": dominationAreaSelectModal,
        },
        data: initDataModel,
        props: {
            visible: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            "visible": function (nVal) {
                  if(!nVal) {
                      this.mainModel.vo = newVO();
                  }
            },
            //"mainModel.vo.compId": function () {
            //    if(this.isInit) {
            //        this.isInit = false;
            //        return;
            //    }
            //    this.mainModel.vo.orgId = '';
            //    this.mainModel.vo.dominationArea= {id: '', name: ''};
            //},
            "mainModel.vo.orgId": function () {
                if(this.isInit) {
                    this.isInit = false;
                    return;
                }
                this.mainModel.vo.dominationArea= {id: '', name: ''};
            },
        },
        methods: {
            _doCreate: function () {
                var _this = this;
                api.createRiCheckAreaTpl({id: this.tableId}, this.mainModel.vo).then(function () {
                    _this.$emit("do-save", true);
                    _this.visible = false;
                    LIB.Msg.success("保存成功");
                })
            },
            _doUpdate: function () {
                var _this = this;
                api.updateRiCheckAreaTpl(this.mainModel.vo).then(function () {
                    _this.$emit("do-save", false);
                    _this.visible = false;
                    LIB.Msg.success("保存成功");
                })
            },
            doSave: function () {
                var _this = this;
                this.$refs.ruleform.validate(function (valid) {
                    if(valid) {
                        // this.vo.checkTableId = this.tableId;
                        if (_this.actionType === 'add') {
                            _this._doCreate();
                        } else if (_this.actionType === 'update') {
                            _this._doUpdate();
                        }
                    }

                })

            },
            doShowSelectModal: function () {
                this.dominationAreaSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
                this.dominationAreaSelectModel.visible = true;
            },
            doSaveDominationArea: function (selectDatas) {
                var area = selectDatas[0];
                this.mainModel.vo.dominationArea = {
                    id: area.id,
                    name: area.name
                };
            },
            doAddArea: function () {
                this.$emit("on-create")
            }
        },
        events: {
            'do-route-area': function (type, tableId, obj) {
                var _this = this;
                // todo 不知道这个变量有什么用，watch里面的orgId 被注释
                this.isInit = true;
                this.isUpdate = false;
                this.actionType = type;
                this.mainModel.vo = newVO();
                this.tableId = tableId;
                this.enableDeptFilter = obj.enableDeptFilter;
                if(type === 'add') {
                    this.mainModel.vo.compId = obj.compId;
                    this.$nextTick(function () {
                        _this.mainModel.vo.orgId = obj.orgId;
                    });
                    this.mainModel.vo.orderNo = obj.orderNo;
                } else if(type === 'update') {
                    _.extend(this.mainModel.vo, obj);
                    this.$nextTick(function () {
                        _this.mainModel.vo.orgId = obj.orgId;
                    });
                    this.isUpdate = true;
                    // this.mainModel.vo.dominationArea =
                }
            }
        },
        init: function () {
        }
    });

    return vm;
});
