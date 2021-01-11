define(function (require) {

    var LIB = require('lib');

    var template = require("text!./routeView.html");
    var api = require("../vuex/api");


    var defaultModel = {
        mainModel: {
            title: '查看巡检线路'
        },
        columns: [
            {
                title: '巡检内容',
                fieldName: 'name',
                width: "250px"
            },
            {
                title: '巡查评判标准',
                fieldName: 'checkBasis'
            },
            {
                title: '巡检类型',
                render: function (item) {
                    var types = _.get(item, "riCheckTypes");
                    var arr = _.map(types, function (val) {
                        return val.name
                    });
                    return arr.join(",")
                },
                width: "150px"
            },
            {
                title: '巡检结果',
                event: true,
                render: function (item) {
                    var results = _.get(item, "riCheckResults");
                    var str = '';
                    if(_.isArray(results)) {
                        var right = _.find(results, function (val) {
                            return val.isRight === '1';
                        });
                        var error = _.find(results, function (val) {
                            return val.isRight === '0';
                        });
                        str = str + right.name ? (right.name + '，') : '';
                        str += (error.name || '');
                    }
                    return str

                },
                width: "120px"
            },
            {
                title:'合格填写描述',
                width: "90px",
                render: function (data) {
                    var isQualifiedRemarkWrite = _.get(data, "isQualifiedRemarkWrite", "0");
                    var text = LIB.getDataDic("is_qualified_remark_write", isQualifiedRemarkWrite);
                    return '<div class="text-center">' + text + '</div>';
                }
            }
        ],
        checkTableName: '',
        checkedAreaIndex: 0,
        checkAreas: null,
        checkedArea: null
    };

    var opts = {
        template: template,
        components: {},
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            planId: {
                type: String,
                default: ''
            },
            orgId: {
                type: String,
                default: ''
            }
        },
        data: function () {
            return defaultModel;
        },
        watch: {
            visible: function (nVal) {
                if (!nVal) {
                    this.reset();
                }
            }
        },
        methods: {
            doClose: function () {
                this.visible = false;
            },
            init: function () {
                this.checkedAreaIndex = 0;
                this._getCheckAreas()
            },
            reset: function () {
                this.checkedAreaIndex = 0;
                this.checkAreas = [];
                this.checkedArea = null;
                this.checkTableName = '';
            },

            // 获取巡检区域列表
            _getCheckAreas: function () {
                var _this = this;
                api.queryPlanViewRoute({id: this.planId}).then(function (res) {
                    _this.checkTableName = _.get(res.data, "riCheckTable.name", "");
                    _this._convertData(_.get(res.data, "riCheckTable.riCheckAreaTpls"))
                })
            },
            _convertData: function (items) {
                var _this = this;
                if(!_.isArray(items)) {
                    this.checkedAreaIndex = 0;
                    this.checkAreas = [];
                    this.checkedArea = null;
                }

                var res = [];
                _.each(items, function (item) {
                    if(item.orgId == _this.orgId){
                        var area = {name: item.name, points:[]};
                        _.each(item.riCheckPointTpls, function (point) {
                            if(point.orgId == _this.orgId) {
                                area.points.push({
                                    name: point.name,
                                    items: point.riCheckItems
                                })
                            }
                        })
                        res.push(area);
                    }
                });

                this.checkAreas = res;
                this.checkedArea = res[0]
            },

            doSelectArea: function (index) {
                this.checkedAreaIndex = index;
                this.checkedArea = this.checkAreas[index];
            }
        },
        events: {
            "do-view-ri-table": function () {
                this.init();
            }
        }
    };

    var component = LIB.Vue.extend(opts);
    return component;
});