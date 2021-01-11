define(function (require) {

    var LIB = require('lib');
    var tpl = require("text!./addGroup.html");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var multiInputSelect = require("componentsEx/multiInputSelector/main");
    var api = require("../vuex/api");
    var newVO = function () {
        return {
            id: null,

            cultivateDate: null,
            //禁用标识 0未禁用，1已禁用
            result: null,
            trainee: null

        }
    };
    var initDataModel = {
        mainModel: {
            vo: newVO(),
            title: "新增",
            rules: {
                'trainee.id': LIB.formRuleMgr.require("受培训人"),
                'cultivateDate': LIB.formRuleMgr.require("培训日期"),

                "result": [
                    {
                        validator: function (rule, val, callback) {

                            
                            if (val != 0 && val != 1) {
                                callback(new Error("请选择评估结果"))
                            } else {
                                callback()
                            }

                        }
                    }
                ],


            }
        },
        userSelectModel: {
            show: false,
            filterData: {}
        },
        rules: {

        },
        user: []
    };


    var opts = {
        template: tpl,
        data: function () {
            var data = initDataModel;
            return data;
        },
        components: {
            "userSelectModal": userSelectModal,
            'multiInputSelect': multiInputSelect
        },
        // watch: {
        //     visible: function (val) {
        //         if (!val) {

        //           }
        //     },

        // },
        props: {
            visible: {
                type: Boolean,
                default: false
            },

        },
        computed: {

        },
        methods: {
            dochange: function (val) {
                val == true ? this.mainModel.vo.mocRiskResult = 1 : this.mainModel.vo.mocRiskResult = 0
            },
            doShowSelectUserModal: function () {
                this.userSelectModel.show = true;
            },
            doCancel: function () {
                this.visible = false;
            },
            doSave: function () {
                var _this = this

                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        _this.$emit('do-save', _this.mainModel.vo, _this.mainModel.title)
                        _this.visible = false
                    }
                })
            },
            doSaveSelect: function (val) {
                this.mainModel.vo.trainee = val[0]
            },
        },
        events: {
            doCeateGroup: function (group) {

                this.visible = true
                this.mainModel.title = '新增'
                this.mainModel.vo.id = null
                this.mainModel.vo.trainee = { id: null, name: null }
                this.mainModel.vo.cultivateDate = null
                this.mainModel.vo.result = null
                this.mainModel.vo.code = null
            },
            doUpdateGroup: function (group) {
                this.visible = true
                this.mainModel.title = '编辑'
                this.mainModel.vo = newVO()
                _.extend(this.mainModel.vo, group)
            },
        },
    };

    var component = LIB.Vue.extend(opts);
    return component;

});