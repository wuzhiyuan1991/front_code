define(function (require) {
    var LIB = require('lib');
    var api = require("../vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./m-preview.html");

    var principalTypes = {
        '1': '检修作业人员',
        '2': '检修负责人',
        '3': '监护人'
    };

    var detail = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
        template: tpl,
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            id: {
                type: String,
                default: ''
            }
        },
        watch: {
            visible: function (val) {
                if (val) {
                    this._init();
                }
            }
        },
        data: function () {
            return {
                vo: null,
                items: null,
                opSign: '', // 操作人签名
                suSign: '', // 监护人签名
                prSign: '', // 责任人签名
                opSignTime: null,
                suSignTime: null,
                prSignTime: null
            };
        },
        methods: {
            doClose: function () {
                this.visible = false;
            },
            doPrint: function () {
                window.print();
            },
            _init: function () {
                this._getVO();
            },
            _getVO: function () {
                var _this = this;
                api.queryMRecord({id: this.id}).then(function (res) {
                    _this.equipments = res.data.equip;
                    api.get({id: _this.id}).then(function (res) {
                        _this.normalizeVo(res.data);
                        _this._getItems();
                        _this._getSign();
                    });
                });
            },
            normalizeVo: function (vo) {
                this.vo = {
                    attr1: vo.opCard.attr1,
                    code: vo.opCard.code,
                    name: vo.opCard.name,
                    equipment: this.equipments.join("、"),
                    operators: _.pluck(vo.operators, 'name').join('、'),
                    principals: _.pluck(vo.principals, 'name').join('、'),
                    supervisors: _.pluck(vo.supervisors, 'name').join('、'),
                    startTime: vo.startTime,
                    endTime: vo.endTime,
                    cardId: vo.opCard.id,
                    id: vo.id,
                    content: vo.opCard.content,
                    equipName: vo.opCard.equipName,
                    orderNumber:vo.orderNumber,
                    noticeNumber:vo.noticeNumber,
                    faceSignName1:vo.faceSignName1,
                    faceSignName2:vo.faceSignName2,
                    faceSignName3:vo.faceSignName3,
                    createDate:vo.createDate
                };
            },
            _getItems: function () {
                var _this = this;
                api.queryMRecord({id: this.id}).then(function (res) {
                    var groups = _.map(res.data.step, function (item) {
                        return {
                            id: item.id,
                            name: item.name,
                            orderNo: item.orderNo
                        }
                    });
                    var items = res.data.item;
                    _this._convertData(groups, items);
                })
            },
            _convertData: function (groups, items) {
                var _this = this;
                // 组按orderNo排序
                var _groups = _.sortBy(groups, function (group) {
                    return parseInt(group.orderNo);
                });
                // 项按stepId分组
                var _items = _.groupBy(items, "stepId");

                // 项按orderNo排序, 并将项添加到对应的组中
                _.forEach(_groups, function (group, i) {
                    var gi = _.sortBy(_items[group.id], function (item) {
                        return parseInt(item.orderNo);
                    });
                    gi = _.map(gi, function (item, j) {
                        return {
                            content: item.content.replace(/[\r\n]/g, '<br/>'),
                            num: i + _.padLeft(j + 1, 2, '0'),
                            userNames: _this._getPainText(item.opMaintStepItemPrinTypes),
                            icons: item.isOpConfirmed === '1' ? _this._setIcons(item.opMaintStepItemPrinTypes) : '<span style="color: red;">不涉及</span>'
                        }
                    });
                    group.items = gi;
                });

                this.items = _groups;
            },
            _setIcons: function (items) {
                var res = '';
                var icon = '<i class="ivu-icon ivu-icon-ios-checkmark-outline" style="font-size:22px; color: orange;margin-right: 5px;" ></i><br>';

                _.forEach(items, function () {
                    res += icon
                });
                return res;
            },
            _getPainText: function (data) {
                var types = _.map(data, function (item) {
                    return item.principalType;
                });
                return _.map(types, function (item) {
                    return principalTypes[item]
                }).join('<br>');
            },
            _getSign: function () {
                var _this = this;
                console.log(this.vo)
                _this.opSignTime = _this._setSignTime(this.vo.createDate);
                _this.suSignTime = _this._setSignTime(this.vo.createDate);
                _this.prSignTime = _this._setSignTime(this.vo.createDate);
                api.listFile({ recordId: this.vo.id }).then(function(res) {
                    _this.opSign = [];
                    _this.suSign = [];
                    _this.prSign = [];
                    var files = res.data;
                    _.forEach(files, function (file) {
                        if (file.dataType === 'X4') {
                            _this.opSign.push(LIB.convertPicPath(file.id, 'scale'));
                            // _this.opSignTime = _this._setSignTime(file.createDate);
                        } else if (file.dataType === 'X5') {
                            _this.suSign.push(LIB.convertPicPath(file.id, 'scale'));
                            // _this.suSignTime = _this._setSignTime(file.createDate);
                        } else if (file.dataType === 'X6') {
                            _this.prSign.push(LIB.convertPicPath(file.id, 'scale'));
                            // _this.prSignTime = _this._setSignTime(file.createDate);
                        }
                    })
                })
            },
            _setSignTime: function (dateStr) {
                return {
                    y: dateStr.substr(0, 4),
                    M: dateStr.substr(5, 2),
                    d: dateStr.substr(8, 2),
                    h: dateStr.substr(11, 2),
                    m: dateStr.substr(14, 2)
                }
            }
        },
        events: {},
        init: function () {
            this.$api = api;
        }
    });

    return detail;
});