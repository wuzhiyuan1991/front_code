define(function (require) {
    var template = require("text!./index.html");
    var LIB = require('lib');
    var Vue = require('vue');
    var api = require("./api");

    var component = {
        template: template,
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: ''
            }
        },
        data: function () {
            return {
                selectColumns: [],
                canSelectColumns: [],
                canSelectFillLength: 0,
                selectFillLength: 0
            }
        },
        computed: {
            tableWidth: function () {
                var width = 0;
                _.each(this.selectColumns, function (column) {
                    width += parseInt(column.cellWidth);
                });
                return width;
            }
        },
        watch: {
            visible: function (val) {
                if(val) {
                    this.init();
                }
            }
        },
        methods: {
            beforeDoSave: function () {
                var _this = this;
                var errorItem = _.find(this.selectColumns, function (item) {
                    return !_this.isNormalInteger(item.width)
                });
                if(typeof errorItem !== 'undefined') {
                    LIB.Msg.warning('列宽必须是大于等于50的正整数');
                    return false;
                }
                return true;
            },
            doSave: function () {
                var _this= this;
                if(this.beforeDoSave() === false) {
                    return;
                }
                var params = _.map(this.selectColumns, function (item, index) {
                    return {
                        cellWidth: item.cellWidth,
                        fieldName: item.fieldName,
                        excelName: item.excelName,
                        field: item.field,
                        tableName: item.tableName,
                        childField: item.childField,
                        orderNo: index + 1,
                        isEnum: item.isEnum,
                        isLookupCode: item.isLookupCode
                    }
                });
                api.save({compId: LIB.user.compId}, params).then(function (res) {
                    LIB.Msg.success("保存成功");
                    _this.visible = false;
                });
            },
            remove: function (index, item) {
                this.selectColumns.splice(index, 1);
                item.isSelect = false;
                this.canSelectColumns.push(item);
                this.calcFillLength();
            },
            add: function (index, item) {
                this.canSelectColumns.splice(index, 1);
                item.isSelect = true;
                if(!item.excelName) {
                    Vue.set(item, 'excelName', item.fieldName);
                }
                item.cellWidth = item.cellWidth || 150;
                this.selectColumns.push(item);
                this.calcFillLength();
            },
            moveUp: function (index, item) {
                if (index === 0) {
                    return;
                }
                this.selectColumns.splice(index, 1);
                this.selectColumns.splice(index - 1, 0, item);
            },
            moveDown: function (index, item) {
                if (index + 1 === this.selectColumns.length) {
                    return;
                }
                this.selectColumns.splice(index, 1);
                this.selectColumns.splice(index + 1, 0, item);
            },
            verifyWidth: function (item) {
                if (!this.isNormalInteger(item.width)) {
                    LIB.Msg.warning('列宽必须是大于等于50的正整数');
                }
            },
            isNormalInteger: function (str) {
                if (_.isEmpty(str)) {
                    return true;
                }
                var n = Math.floor(Number(str));
                return String(n) === str && n >= 50;
            },
            calcFillLength: function () {
                this.canSelectFillLength = this._maxLength - this.canSelectColumns.length;
                this.selectFillLength = this._maxLength - this.selectColumns.length;
            },
            init: function () {
                var _this = this;

                api.getBizExcelList({tableName: 'pool', compId: LIB.user.compId}).then(function (res) {

                    var fields = _.pluck(res.data, 'fieldName');
                    _this.selectColumns = res.data;

                    api.getDataExcelList({tableName: 'pool'}).then(function (res) {

                        _this._maxLength = res.data.length;
                        if(fields.length > 0) {
                            _.forEachRight(res.data, function (item, index) {
                                if(_.includes(fields, item.fieldName)) {
                                    res.data.splice(index, 1);
                                }
                            })
                        }
                        _this.canSelectColumns = res.data;
                        _this.calcFillLength();

                    });
                })
            }
        },
        ready: function () {}
    };

    return component;
});