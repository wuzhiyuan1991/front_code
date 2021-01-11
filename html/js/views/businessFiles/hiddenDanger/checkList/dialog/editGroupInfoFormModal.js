define(function (require) {
    //基础js
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var template = LIB.renderHTML(require("text!./editGroupInfoFormModal.html"));
    var components = {
        dominationAreaSelectModal: require("componentsEx/selectTableModal/dominationAreaSelectModal"),
    };
    var formData = function () {
        return {
            groupId: null,
            groupName: null,
            dominationArea:null,
        }
    };
    var dominationAreaSelectModel = function () {
        return {
            visible: false,
            type: null,
            filterData: null,
        }
    };
    var dataModel = function () {
        return {
            mainModel: {
                vo: new formData(),
                rules: {
                    "groupName": [
                        {required: true, message: "请输入巡检点名称"}
                        ,LIB.formRuleMgr.length(50)
                    ],
                    "dominationAreaId" : [LIB.formRuleMgr.allowStrEmpty],
                },
                selectModel: {
                    //用户列表
                    dominationAreaSelectModel: dominationAreaSelectModel()
                }
            },
        }
    };

    var opts = {
        template: template,
        components: components,
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            groupId: {
                type: String,
                default: null
            },
            groupName: {
                type: String,
                default: null
            },
            dominationArea: {
                type: Object,
                default: null
            },
            compId: {
                type: String,
                default: null
            },
        },
        data: dataModel,
        computed: {},
        watch: {
            visible: function (nVal) {
                if (nVal) {
                    this.init();
                }else{
                    this.mainModel.vo = formData();
                }
            },

        },
        methods: {
            /**
             * 初始化表单数据
             */
            initData: function () {
                this.mainModel.vo = formData();
                this.mainModel.vo.groupId = this.groupId;
                this.mainModel.vo.groupName = this.groupName;
                this.mainModel.vo.dominationArea = this.dominationArea;
                this.mainModel.selectModel.dominationAreaSelectModel = new dominationAreaSelectModel();
            },

            init: function () {
                this.$refs.ruleform.resetFields();
                this.initData();
            },
            doSelectDominationArea: function () {
                var selectModel = this.mainModel.selectModel.dominationAreaSelectModel;
                selectModel.visible = true;
                selectModel.filterData = {compId: this.compId};
            },
            doSaveDominationArea: function (selectedData) {
                if (selectedData) {
                    this.mainModel.vo.dominationArea = selectedData[0];
                }
            },
            doClearDominationArea: function(){
               this.mainModel.vo.dominationArea = {id: null, name: null};
            },
            doSave: function () {
                var _this = this;
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        api.updateGroupInfo(_this.mainModel.vo).then(function (res) {
                            _this.$dispatch("ev_editGroup");
                            LIB.Msg.info("保存成功");
                        });
                    }
                });
            },
        }
    };

    return opts;
});