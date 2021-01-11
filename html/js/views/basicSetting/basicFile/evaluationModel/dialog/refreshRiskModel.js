define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var tpl = require("text!./refreshRiskModel.html");
    var riskModel = require("views/basicSetting/basicFile/evaluationModel/dialog/riskModel");
    //数据模型
    var dataModel = {
        isDataReferenced: true,
        mainModel: {
            id: null,
            gradeLatRanges: [],
        },
        selectModel: {
            riskModel: {
                visible: false
            }
        },
        activeTab: 1,
        countObj: null
    };
    var detail = LIB.Vue.extend({
        template: tpl,
        components: {
            'riskModel': riskModel,
        },
        data: function () {
            return dataModel;
        },
        methods: {
            //保存
            doSave: function () {
                var _this = this;
                var latranges = [];
                _.each(_this.mainModel.gradeLatRanges, function (latrange) {
                    if (latrange.riskModelVo) {
                        var _riskModelVo = _.pick(latrange, "id", "riskModelVo");
                        _riskModelVo.oldRiskModelId = latrange.riskModel.id;
                        latranges.push(_riskModelVo);
                    }
                });
                if (latranges.length < _this.mainModel.gradeLatRanges.length) {
                    return LIB.Msg.error("请填写所有等级对应的【变更后-风险评估模型(风险等级)】");
                }
                api.updateReferencedRiskModel({id: _this.mainModel.id}, latranges).then(function (res) {
                    LIB.Msg.info("修改成功");
                    _this.$emit("do-edit-referenced-finshed");
                });
            },
            changeTab: function (index) {
                this.activeTab = index;
            },
            _getCount: function (param) {
                var _this = this;
                var params = {
                    compId: this.compId,
                    riskModelId: this.mainModel.id
                };
                // api.getCount(params).then(function (res) {
                    var o = {};
                    _.forEach(param, function (v) {
                         o[v.name] = v.count;
                    });
                    _this.countObj = o;
                // })
            },
            _init: function (param) {
                this.activeTab = 1;
                this.countObj = null;
                this._getCount(param);
            }
        },
        events: {
            'ev_loadHistoryRange': function (param, id, compId) {
                var _this = this;
                this.compId = compId;
                _this.mainModel.gradeLatRanges = [];
                _this.mainModel.id = id;
                _.each(param.riskModel, function (model) {
                    if (model.gradeLatRanges) {
                        _.each(model.gradeLatRanges, function (range) {
                            var riskModel = {id: model.id, name: model.name};
                            range.riskModel = riskModel;
                            _this.mainModel.gradeLatRanges.push(range);
                        });
                    }
                });
                this._init(param.listResult);
            }
        }
    });
    return detail;
});