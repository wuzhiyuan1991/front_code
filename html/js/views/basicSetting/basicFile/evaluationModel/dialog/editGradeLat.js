define(function (require) {
    var LIB = require('lib');
    var api = require("../vuex/api");
    //页面
    var tpl = require("text!./editGradeLat.html");
    //初始化数据模型
    var newVO = function () {
        return {
            id: null,
            code: null,
            name: null,
            riskModel: {
                id: null
            },
            latScores: [],
            gradeExtend: [],
            criteria: {
                strsValue: {
                    delLatScores: [],
                    delGradeExtends: []
                }
            }
        }
    };
    //Vue数据
    var dataModel = {
        //当前操作类型
        operationType: 'view',
        isDataReferenced:true,
        mainModel: {
            vo: newVO()
        },
        extendModel: {
            show: true,
        },
        //表单校验规则
        ruleModel: {
            name: [
                {required: true, message: '请输入维度名称'},
                LIB.formRuleMgr.length(400)
            ],
            latScore: {
                //纬度评分
                score: [
                    {type: 'number', required: true,min: 0.1, message: '请输入不低于0.1的评分'},
                    {validator: function(rule, value, callback) {
                        var r = /^\d+(.\d)?$/g;
                        var isRight = r.test(value);
                        if(!isRight) {
                            return callback(new Error("分数最大保留1位小数"))
                        }
                        return callback();
                    }}
                ],
                //程度描述
                name: [
                    {required: true, message: '请输入程度'},
                    LIB.formRuleMgr.length(400)
                    //{ max: 20, message: '长度不能超过 20个字符'}
                ]
            },
            latExt: {
                //纬度扩展信息简述
                name: [
                    {required: true, message: '请输入简述'},
                    //{ max: 20, message: '长度不能超过 20个字符'}
                    LIB.formRuleMgr.length(1000)
                ],
                //纬度扩展信息详述
                description: [
                    LIB.formRuleMgr.length(1000)
                    //{ max: 100, message: '长度不能超过 100个字符'}
                ]
            }
        }
    };
    var detail = LIB.Vue.extend({
        template: tpl,
        data: function () {
            return dataModel;
        },
        computed: {
            //是否只读
            isReadOnly: function () {
                return this.operationType === "view";
            },
            showDeleteIcon: function() {
                return !(this.isReadOnly || this.isDataReferenced);
            },
            showContent: function () {
                return this.extendModel.show && _.isArray(this.mainModel.vo.gradeExtend) && !_.isEmpty(this.mainModel.vo.gradeExtend);
            },
            trStyle: function () {
                var o = {
                    borderBottom: "1px dashed #ddd"
                };
                return this.isReadOnly ? o : null;
            }
        },
        methods: {
            //保存数据
            doSave: function () {
                var _this = this;
                var formData = _.clone(this.mainModel.vo);
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        api.saveGradeLat(null, formData).then(function (res) {
                            LIB.Msg.info("保存成功");
                            //_this.$dispatch("ev_editGradeLatFinshed");
                            _this.$emit("do-edit-grade-lat-finshed");
                        });
                    }
                });
            },
            //添加评定纬度行
            addLatScore: function () {
                this.mainModel.vo.latScores.push({name: '', score: 0});
                _.each(_.values(this.mainModel.vo.gradeExtend), function (ext) {
                    ext.scoreExtend.push({name: ''});
                });
            },
            //移除评定纬度行
            removeLatScore: function (index) {
                var _vo = this.mainModel.vo;
                var latScores = _vo.latScores;
                var delLatScore = latScores[index];
                //添加删除列表
                delLatScore.id && this.mainModel.vo.criteria.strsValue.delLatScores.push(delLatScore.id);
                latScores.splice(index, 1);
                _.each(_.values(_vo.gradeExtend), function (ext) {
                    ext.scoreExtend.splice(index, 1);
                });
            },
            //添加扩展说明页签
            addExtend: function () {
                var exts = this.mainModel.vo.gradeExtend;
                var scoreExts = _.map(this.mainModel.vo.latScores, function (lat) {
                    return {name: '', description: ''};
                });
                exts.push({name: '描述' + (exts.length+1), scoreExtend: scoreExts});
            },
            //移除扩展说明页签
            removeExtend: function (tab, index) {
                var _vo = this.mainModel.vo;
                var delGradeExtend = _vo.gradeExtend[index];
                //添加删除列表
                delGradeExtend.id && this.mainModel.vo.criteria.strsValue.delGradeExtends.push(delGradeExtend.id);
                this.mainModel.vo.gradeExtend.splice(index, 1);
            }
        },
        events: {
            //页面更新获取新数据
            'ev_loadGradeLat': function (operationType, param) {
                this.operationType = operationType;
                this.isDataReferenced = param.isDataReferenced;
                var latId = param.latId;
                var riskModelId = param.riskModelId;
                var _data = this.mainModel;
                var _vo = _data.vo;
                //清空数据
                this.$refs.ruleform.resetFields();
                _.extend(_vo, newVO());
                this.mainModel.vo.riskModel.id = riskModelId;
                if (_.contains(["view", "update"], this.operationType)) {
                    api.getGradeLat({id: latId}).then(function (res) {
                        _.deepExtend(_vo, res.data);
                    });
                }
            }
        }
    });
    return detail;
});