define(function (require) {
    //基础js
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var template = LIB.renderHTML(require("text!./passBatch.html"));

    var components = {
        "user-select-modal": require("componentsEx/selectTableModal/trainUserSelectModal"),
    };

    var newVO = function () {
        return {
            trainDate:null,
            users:[]
        }
    };

    var dataModel = function () {
        return {
            mainModel: {
                title: '添加通过员工',
                vo: newVO(),
                rules: {
                    "trainDate": [
                        LIB.formRuleMgr.require("通过时间")
                    ],
                    "users": [
                        {   required:true,
                            validator: function (rule, value, callback) {
                                if(value.length > 0) {
                                    return callback();
                                }else {
                                    return callback(new Error('请选择通过员工'))
                                }
                            }
                        }
                    ],
                }
            },
            selectModel : {
                userSelectModel : {
                    visible : false,
                    filterData : {orgId : null}
                },
            },
        }
    };

    var opts = {
        template: template,
        components: components,
        props: {
            id: {
                type: String
            },
            visible: {
                type: Boolean,
                default: false
            }
        },
        data: dataModel,
        watch: {
            "visible": function (val) {
                if(val) {
                    this._init();
                }
            },
        },
        methods: {
            _init: function () {
                this.mainModel.vo = newVO();
            },
            doShowUserSelectModal : function() {
                this.selectModel.userSelectModel.visible = true;
                this.selectModel.userSelectModel.filterData = {id : this.id};
            },
            doSaveUsers: function (selectedDatas) {
                if (selectedDatas) {
                    this.mainModel.vo.users = _.map(selectedDatas, function(item){
                        return {id:item.id, name:item.user.name};
                    }).concat();
                }
            },
            doClearInput: function () {
                this.mainModel.vo.users = [];
            },
            doSave : function() {
                var _this = this;
                this.$refs.ruleform.validate(function(valid) {
                    if (valid) {
                        var param = _.map(_this.mainModel.vo.users, function(data){return {id : data.id, trainDate:_this.mainModel.vo.trainDate}});
                        api.updateTrainTasks({id : _this.id}, param).then(function() {
                            _this.$dispatch("ev_pass_batch");
                        });
                    }
                });
            },

        }
    };

    return opts;
});