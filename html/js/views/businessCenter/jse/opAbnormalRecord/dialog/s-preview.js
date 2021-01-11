define(function(require){
    var LIB = require('lib');
    var api = require("../vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./s-preview.html");

    var detail = LIB.Vue.extend({
        mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth],
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
        data: function(){
            return {
                vo: null,
                items: null,
                opSign: null, // 操作人签名
                suSign: null, // 监护人签名
                prSign: null, // 责任人签名
                beginSignPic: null, // 审批人操作前
                afterSignPic: null, // 审批人操作后
            }
        },
        watch: {
            visible: function (val) {
                if(val) {
                    this._init();
                }
            }
        },
        computed: {
            orgName: function () {
                return this.getDataDic('org', this.vo.orgId)['deptName'];
            },
            showEquipment:function () {
                var _this = this;
                var _vo = _this.vo;
                if (_vo && _vo.specialityType === '3') {
                    return true;
                }
                return false;
            }
        },
        methods:{
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
                api.get({id: _this.id}).then(function (res) {
                    _this.normalizeVo(res.data);
                    _this._getItems();
                    _this._getSign();
                });
            },
            normalizeVo: function (vo) {
                var createDate = vo.createDate;
                this.vo = {
                    attr1: vo.opCard.attr1,
                    content: vo.opCard.content,
                    code: vo.opCard.code,
                    name: vo.opCard.name,
                    operators: _.pluck(vo.operators, 'name').join('、'),
                    principals: _.pluck(vo.principals, 'name').join('、'),
                    supervisors: _.pluck(vo.supervisors, 'name').join('、'),
                    startTime: vo.startTime,
                    endTime: vo.endTime,
                    cardId: vo.opCard.id,
                    specialityType: vo.opCard.specialityType,
                    id: vo.id,
                    site: vo.site,
                    orgName: this.getDataDic('org', vo.orgId)['deptName'],
                    year: createDate.substr(0, 4),
                    month: createDate.substr(5, 2),
                    date: createDate.substr(8, 2),
                    equipName: vo.equipName,
                    equipNos: vo.equipNos
                }
            },
            _getItems: function () {
                var _this = this;
                api.querySRecord({id: this.id}).then(function (res) {
                    var groups = _.map(res.data.step, function (item) {
                        return {
                            id: item.id,
                            name: item.name,
                            orderNo: item.orderNo
                        }
                    });
                    var items = _.map(res.data.item, function (item) {
                        return {
                            stepId: item.stepId,
                            orderNo: item.orderNo,
                            risk: item.risk.replace(/[\r\n]/g, '<br/>'),
                            content: item.content.replace(/[\r\n]/g, '<br/>'),
                            ctrlMethod: item.ctrlMethod.replace(/[\r\n]/g, '<br/>'),
                            icons: item.isOpConfirmed === '1' ? '<i class="ivu-icon ivu-icon-ios-checkmark-outline" style="font-size:22px; color: orange;margin-right: 5px;" ></i>' : '<span style="color: red;">不涉及</span>'
                        }
                    });
                    _this._convertData(groups, items);
                })
            },
            _convertData: function (groups, items) {
                // 组按orderNo排序
                var _groups = _.sortBy(groups, function (group) {
                    return parseInt(group.orderNo);
                });
                // 项按stepId分组
                var _items = _.groupBy(items, "stepId");
                // 项按orderNo排序, 并将项添加到对应的组中
                _.forEach(_groups, function (group) {
                    group.items = _.sortBy(_items[group.id], function (item) {
                        return parseInt(item.orderNo);
                    });
                });

                this.items = _groups;
            },
            _getSign: function () {
                var _this = this;

                api.listFile({ recordId: this.vo.id }).then(function(res) {
                    _this.opSign = [];
                    _this.suSign = [];
                    _this.prSign = [];
                    _this.beginSignPic = [];
                    _this.afterSignPic = [];
                    var files = res.data;
                    // "X4";//操作人
                    // "X5";//监护人
                    // "X6";//责任人
                    _.forEach(files, function (file) {
                        if (file.dataType === 'X4') {
                            _this.opSign.push(LIB.convertPicPath(file.id, 'scale'));
                        } else if (file.dataType === 'X5') {
                            _this.suSign.push(LIB.convertPicPath(file.id, 'scale'));
                        } else if (file.dataType === 'X6') {
                            _this.prSign.push(LIB.convertPicPath(file.id, 'scale'));
                        } else if (file.dataType === 'X7') {
                            _this.beginSignPic.push(LIB.convertPicPath(file.id, 'scale'));
                        } else if (file.dataType === 'X8') {
                            _this.afterSignPic.push(LIB.convertPicPath(file.id, 'scale'));
                        }
                    })
                })
            }
        },
        events : {
        },
        init: function(){
            this.$api = api;
        }
    });

    return detail;
});