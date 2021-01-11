define(function (require) {
    var LIB = require('lib');
    var api = require("../vuex/api");
    var template = require("text!./detail.html");
    var helper = require("./common");

    var normalizeCheckObjTypes = function () {
        var _checkObjTypes = LIB.getDataDicList("check_obj_risk_type");
        var res = [],
            item;
        _.forEach(_checkObjTypes, function (type) {
            item = {
                id: type.id,
                name: type.value,
                num: 0
            };
            res.push(item)
        });
        return res;
    };

    var focusTypes = helper.focusTypes;

    var home = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
        template: template,
        computed: {
            fillLength: function () {
                var len;
                if(_.isArray(this.checkTableItems)) {
                    len = this.checkTableItems.length;
                    return len < 10 ? 10- len : 0;
                }
                return 10;
            },
            fillLength2: function () {
                var len;
                if(_.isArray(this.checkTables)) {
                    len = this.checkTables.length;
                    return len < 11 ? 11- len : 0;
                }
                return 11;
            }
        },
        data: function () {
            return {
                visible: false,
                dominationAreas: null, // 属地列表
                riskTypes: null, // 风险点类型
                focusTypes: focusTypes, // 重点关注类型
                checkTables: null,
                checkTableItems: null,
                staticRisks: null, // 静态风险数量列表
                dynamicRisks: null, // 动态风险数量列表
                staticRisk: '1', // 固有风险
                dynamicRisk: '1', // 动态风险


                dateRange: [],
                dateRanges: helper.dateRanges,
                chartOpt:{
                    series :[]
                },
                dominationAreaUserName: '', // 属地负责人
                cache: {
                    orgId: '',
                    dominationAreaId: '',
                    checkTableId: '',
                    focusTypeIndex: -1,
                    areaIndex: -1, // 弹框属地的索引值
                    riskPointIndex: -1,
                    checkTableIndex: -1,
                    staticIndex: -1,
                    dynamicIndex: -1,
                    riskPointTypeId: '', // 当前选择的风险点类型id
                    focusTypeId: '',
                    staticId: '',
                    dynamicId: ''
                },
                riskType: 'static',
                dateRangeId: '1',
                isDateQuerying: false,
                showCustomDateRange: false,
                checkedDominationArea: {id: '', name: ''}, // 选中的属地对象
                staticLevel: '-1', // 静态风险等级
                dynamicRiskLevel: '-1', // 动态风险等级
                showOrgId: '', // 部门ID //显示部门信息（ orgId 已经用于后台判断数据唯一性， 不能用来显示部门信息）
                temporaryMode: '0', // 0 固定风险 10 临时风险
            };
        },
        methods: {

            changeTemporaryMode: function (mode) {
                this.cache.riskPointIndex = -1;
                this.cache.focusTypeIndex = -1;
                this.cache.staticIndex = -1;
                this.cache.dynamicIndex = -1;

                this.cache.riskPointTypeId = '';
                this.cache.dynamicId = '';
                this.cache.staticId = '';
                this.cache.focusTypeId = '';

                this.cache.checkTableIndex = 0;
                this.dateRangeId = '1';

                this.temporaryMode = mode;
                this._setCurrentCheckTables();
            },
            // 切换属地， 需要清空检查表数据， 表格数据或者echarts数据
            doChangeArea: function (id) {
                // if(this.checkedDominationArea.id === id) {
                //     return;
                // }
                // this.cache.areaIndex = index;

                this.cache.riskPointIndex = 0;
                this.cache.checkTableIndex = 0;

                this.checkedDominationArea = {
                    id: id,
                    // name: area.name
                };

                this._getCheckTables(id);
                this._getDominationUser(id);
            },

            // 风险色块的颜色
            doRenderBgColor: function (riskLevel) {
                return helper.doRenderBgColor(riskLevel, this.riskColorMap);
            },

            // 显示风险等级名称
            doRenderLevelName: function (riskLevel) {
                riskLevel = riskLevel || '1';
                return this.riskNames[riskLevel];
            },

            doRefresh: function () {
                this.dateRangeId = '1';
                this.buildOptions([]);
                this._init(this.dominationAreas);
            },

            /**
             * 点击固有风险项过滤
             * @param index
             * @param level
             */
            doClickStaticRisk: function (index, level) {

                this.cache.checkTableIndex = 0;
                this.dateRangeId = '1';
                this.cache.dynamicId = '';
                this.cache.dynamicIndex = -1;

                if(index === this.cache.staticIndex) {
                    this.cache.staticIndex = -1;
                    this.cache.staticId = '';
                } else {
                    this.cache.staticIndex = index;
                    this.cache.staticId = level;
                }

                this.checkTables = this._calcCheckTables();

                if(this.checkTables && this.checkTables.length > 0) {
                    this.cache.checkTableId = this.checkTables[0].id;
                    this._getTableOrChartData();
                } else {
                    this._clearRightData();
                }
            },

            // 计算当前应该显示的checkTables
            _calcCheckTables: function () {
                return helper.getFilteredCheckTables(this.cache, this.currentCheckTables);
            },


            /**
             * 点击动态风险项过滤
             * @param index
             * @param level
             */
            doClickDynamicRisk: function (index, level) {

                this.cache.checkTableIndex = 0;
                this.dateRangeId = '1';
                this.cache.staticId = '';
                this.cache.staticIndex = -1;

                if(index === this.cache.dynamicIndex) {
                    this.cache.dynamicIndex = -1;
                    this.cache.dynamicId = '';
                } else {
                    this.cache.dynamicIndex = index;
                    this.cache.dynamicId = level;
                }

                this.checkTables = this._calcCheckTables();

                if(this.checkTables && this.checkTables.length > 0) {
                    this.cache.checkTableId = this.checkTables[0].id;
                    this._getTableOrChartData();
                } else {
                    this._clearRightData();
                }
            },

            /**
             *  切换检查表，请求表格或者图表数据
             * @param index
             * @param id 检查表id
             */
            doClickCheckTable: function (index, id) {
                if(this.cache.checkTableIndex === index) {
                    return;
                }
                this.dateRangeId = '1';
                this.cache.checkTableIndex = index;
                this.cache.checkTableId = id;
                this._getTableOrChartData(id);
            },

            /**
             * 切换风险类型,
             * @param type
             */
            doChangeRiskType: function (type) {

                this.dateRangeId = '1';
                this.riskType = type;

                if(type === 'dynamic') {
                    this.buildOptions([]);
                }

                this._getTableOrChartData();
            },


            /**
             * 计算箭头的方向
             * 比较 固有 和 动态的 ，如果下降了，就显示 下降的箭头，如果 没有变化， 就显示 平级 的箭头
             * @param level1 动态风险
             * @param level2 固有风险
             */
            doCalcTrendIcon: function (level1, level2) {
                var obj = {};
                if(level1 > level2) {
                    obj.transform = "rotate(-45deg)";
                }
                else if(level1 < level2) {
                    obj.transform = "rotate(45deg)";
                }
                return obj;
            },

            doChangeDateRange: function (id){
                var startDate,
                    endDate;
                if(id === '7') {
                    if(!this.dateRange[0] || !this.dateRange[1]) {
                        return LIB.Msg.warning("请选择时间范围");
                    }
                    if(this.dateRange[1] - this.dateRange[0] > 3600 * 24 * 365 * 1000) {
                        return LIB.Msg.warning("时间范围需小于等于一年");
                    }
                    this.dateRangeId = id;
                    startDate = this.dateRange[0].Format("yyyy-MM-dd 00:00:00");
                    endDate = this.dateRange[1].Format("yyyy-MM-dd 23:59:59");
                } else {
                    this.dateRangeId = id;
                    var findWhere = _.findWhere(dateRanges, {id:id});
                    if (id !== '1') {
                        startDate = findWhere.param.startDate.Format("yyyy-MM-dd 00:00:00");
                        endDate = findWhere.param.endDate.Format("yyyy-MM-dd 23:59:59");
                    }
                }

                if(this.riskTypes.length === 0) {
                    return;
                }

                var obj = {
                    checkTableId: this.cache.checkTableId,
                    count: id === '1' ? 10 : 9999,
                    startDate: startDate,
                    endDate:endDate
                };
                this._getChartData(obj);
            },
            doShowCustomDateRange: function () {
                this.showCustomDateRange = true;
            },

            close: function () {
                this.visible = false;
                this.orgId = '';
                this.checkTableId = '';
                this.checkTableItems = [];
                this.checkTables = [];
                this.riskTypes = normalizeCheckObjTypes();
                this.dynamicRiskLevel = '-1';
            },

            /**
             * 切换检查表类型（风险点类型）
             * @param index
             * @param id 风险点类型
             */
            doClickRiskPointType: function (index, id) {

                this.cache.focusTypeIndex = -1;
                this.cache.staticIndex = -1;
                this.cache.dynamicIndex = -1;

                this.cache.dynamicId = '';
                this.cache.staticId = '';
                this.cache.focusTypeId = '';

                this.cache.checkTableIndex = 0;
                this.dateRangeId = '1';

                if(this.cache.riskPointIndex === index) {
                    this.cache.riskPointIndex = -1;
                    this.cache.riskPointTypeId = '';
                    this.checkTables = this._calcCheckTables();
                } else {
                    this.cache.riskPointTypeId = id;
                    this.cache.riskPointIndex = index;
                    // 给检查表列表重新赋值
                    this.checkTables = _.filter(this.currentCheckTables, function (item) {
                        return item.checkObjType === id;
                    });
                }

                this._calculateCounts();

                if(this.checkTables && this.checkTables.length > 0) {
                    this.cache.checkTableId = this.checkTables[0].id;
                    this._getTableOrChartData();
                } else {
                    this._clearRightData();
                }

            },

            /**
             * 切换重点关注类型
             * @param index
             * @param id
             */
            doClickFocusType: function (index, id) {

                this.cache.checkTableIndex = 0;

                this.cache.staticIndex = -1;
                this.cache.dynamicIndex = -1;
                this.cache.dynamicId = '';
                this.cache.staticId = '';

                this.dateRangeId = '1';

                if(index === this.cache.focusTypeIndex) {
                    this.cache.focusTypeIndex = -1;
                    this.cache.focusTypeId = '';
                } else {
                    this.cache.focusTypeIndex = index;
                    this.cache.focusTypeId = id;
                }

                this.checkTables = this._calcCheckTables();

                this._calculateCounts(1);

                if(this.checkTables && this.checkTables.length > 0) {
                    this.cache.checkTableId = this.checkTables[0].id;
                    this._getTableOrChartData();
                } else {
                    this._clearRightData();
                }
            },
            /**
             * 清空右侧数据
             */
            _clearRightData: function () {
                this.cache.checkTableId = '';
                if(this.riskType === 'static') {
                    this.checkTableItems = [];
                } else {
                    this.buildOptions([]);
                }
            },

            // 组合折线图配置
            buildOptions: function (data) {
                var opt = helper.buildOptions(data, this.dateRangeId, this.riskNames, this.riskPojos);
                this.chartOpt = opt;
                if(this.$refs.lineChart) {
                    this.$refs.lineChart.hideLoading();
                }
            },




            // 获取属地列表, 返回的数据只包含id和name， 并没有包含风险等级等其他数据， 所以每次打开弹窗只请求一次
            _getDominationAreas: function (orgId, areaId) {
                var _this = this;
                api.getStaticAreaList({drawOrgId: orgId}).then(function (res) {
                    _this.dominationAreas = res.data;
                    _this._init(res.data);
                });
            },
            _init: function (items) {
                // 初始化数据
                this.cache.areaIndex = 0;
                this.cache.checkTableIndex = 0;
                this.cache.riskPointIndex = -1;
                this.cache.focusTypeIndex = -1;

                this.checkTables = [];
                this.checkTableItems = [];
                this.riskTypes = normalizeCheckObjTypes();

                if(items.length > 0) {
                    var _da = items[0];
                    // this._checkedDominationArea = _da;
                    this.cache.dominationAreaId = _da.id;
                    this._getCheckTables(_da.id);
                    this._getDominationUser(_da.id);
                    this.checkedDominationArea = _da;
                }

                _.forEach(this.focusTypes, function (item) {
                    item.level = '1';
                });
            },

            // 获取属地负责人
            _getDominationUser: function(id){
                var _this = this;
                var params = {dominationId: id};
                api.getUser(params).then(function (res) {
                    _this.dominationAreaUserName = _.get(res, 'data[0].name', '');
                })
            },

            // 获取检查表
            _getCheckTables: function (id) {
                this.isDateQuerying = true;
                var _this = this;

                api.getStaticCheckTables({dominationAreaId: id, compId: this.compId}).then(function (res) {
                    _this._normalizeCheckTablesData(res.data);
                });

                this._getStaticRiskLevel(id);
            },

            _normalizeCheckTablesData: function (items) {
                if(!items) {
                    this.dynamicRiskLevel = '1';
                    this.isDateQuerying = false;
                    return;
                }

                if(!items.checkTables || items.checkTables.length === 0) {
                    this.dynamicRiskLevel = '1';
                    this.isDateQuerying = false;
                    return;
                }

                var checkTables = items.checkTables;

                // 检查表可能没有dynamicLevel值
                _.forEach(checkTables, function (item) {
                    item.dynamicLevel = item.dynamicLevel || item.level
                });

                // 排序
                checkTables = checkTables.sort(function (a, b) {
                    return b.level - a.level;
                });

                // 缓存所有检查表数据
                this.sealedChecktables = checkTables;
                this._setCurrentCheckTables();
            },

            _setCurrentCheckTables: function () {
                this._clearRightData();

                var temporaryMode = this.temporaryMode;
                var checkTables = _.filter(this.sealedChecktables, function (item) {
                    return item.isTemporary === temporaryMode && item.isTemporaryEnable === temporaryMode;
                });

                this.currentCheckTables = _.clone(checkTables);
                this.checkTables = _.clone(checkTables);
                this.dynamicRiskLevel = helper.calculateDynamicRiskLevel(checkTables);

                var objTypeGroups = _.groupBy(checkTables, "checkObjType");
                var _group;

                this.cache.riskPointTypeId = '';

                _.forEach(this.riskTypes, function (type) {
                    _group = objTypeGroups[type.id];
                    type.num = _group ? _group.length : 0;
                });

                this._calculateCounts();

                if (checkTables.length > 0) {
                    this.cache.checkTableIndex = 0;
                    this.cache.checkTableId = this.checkTables[0].id;
                    this._getTableOrChartData();
                }
            },

            _calculateCounts: function (f) {
                if (!f) {
                    // 计算重点关注类型数量
                    helper.calculateFocusTypesCount(this.checkTables, this.focusTypes);
                }

                // 计算固有风险数量
                this.staticRisk =  helper.calculateStaticRiskCount(this.checkTables, this.staticRisks, this.staticRisk);

                // 计算动态风险数量
                this.dynamicRisk =  helper.calculateDynamicRiskCount(this.checkTables, this.dynamicRisks, this.dynamicRisk);
            },

            _getTableOrChartData: function () {
                if (this.riskType === 'static') {
                    this._getCheckTableItems();
                } else {
                    this.$nextTick(function () {
                        this._getChartData({
                            checkTableId: this.cache.checkTableId,
                            count: 10
                        })
                    })
                }
            },

            _getCheckTableItems: function () {
                var _this = this;
                api.getCheckItems({
                    checkTableId: this.cache.checkTableId,
                    dominationAreaId: this.cache.dominationAreaId
                }).then(function (res) {
                    var items = _.isArray(res.data) ? res.data : [];
                    // 按照风险等级从高到低排序
                    _this.checkTableItems = items.sort(function (a, b) {
                        return b.attr2 - a.attr2
                    });
                    _this.isDateQuerying = false;
                })
            },

            _getChartData: function (obj) {
                var _this = this;
                this.$refs.lineChart.resize();
                this.$refs.lineChart.clear();
                this.$refs.lineChart.showLoading();
                api.getChartData({
                    checkTableId: obj.checkTableId,
                    dominationAreaId: this.cache.dominationAreaId,
                    count: obj.count,
                    startDate: obj.startDate,
                    endDate: obj.endDate
                }).then(function (res) {
                    if (res.data && res.data.length > 0) {
                        var data = res.data.reverse();
                        _this._updateRiskLevel(data);
                        _this.buildOptions(data);
                    } else {
                        _this.buildOptions([]);
                    }
                    _this.isDateQuerying = false;
                })
            },

            /**
             * 更新父级风险等级
             * 因为风险点数据在前面获得， 在获得图表数据之前， 可能会有新的检查数据产生， 所以获得图表数据之后，需要更新风险点风险等级
             * 更新风险点风险等级之后，需要对比属地风险等级，如果风险点风险等级高，则更新属地风险等级
             * 更新属地风险等级之后，需要对比动态风险等级，如果属地风险等级高，则更新动态风险等级
             * @private
             */
            _updateRiskLevel: function(data) {

                // 获取最新的风险等级
                var latestLevel = _.last(data).level;

                // 获取风险点当前风险等级
                var checkTable = this.checkTables[this.cache.checkTableIndex];

                if(!checkTable){
                    return;
                }

                var checkTableLevel = checkTable.level;

                if (latestLevel === checkTableLevel) {
                    return;
                }

                // 更新检查表动态风险等级
                var _c = _.cloneDeep(checkTable);
                _c.dynamicLevel = latestLevel;
                this.checkTables.splice(this.cache.checkTableIndex, 1, _c);

                // 更新检查表缓存数据
                var index = _.findIndex(this.sealedChecktables, function (item) {
                    return item.id === _c.id
                });
                this.sealedChecktables.splice(index, 1, _c);

                // 更新动态风险等级
                if(latestLevel > this.dynamicRisk) {
                    this.dynamicRisk = latestLevel;
                }

                // 获取属地风险等级
                var area = this.dominationAreas[this.cache.areaIndex],
                    areaLevel = area.level;

                if (parseInt(areaLevel) >= parseInt(latestLevel)) {
                    return;
                }

                // 更新属地风险等级

                var _a = _.cloneDeep(area);
                _a.level = latestLevel;
                this.dominationAreas.splice(this.cache.areaIndex, 1, _a);

                // 更新所选属地数据

                var _ca = _.cloneDeep(this.checkedDominationArea);
                _ca.level = latestLevel;
                this.checkedDominationArea = _ca;

                // 更新动态风险
                if (parseInt(this.dynamicRiskLevel) < parseInt(latestLevel)) {
                    this.dynamicRiskLevel = latestLevel || '1';
                }

            },


            // 获取属地风险等级数据 只可能是静态的， 动态是根据检查表计算出来的
            _getStaticRiskLevel: function(id){
                var _this = this;
                api.getStaticRiskLevel({drawOrgId: this.orgId}).then(function (res) {
                    var items = res.data;
                    var group = _.groupBy(items, 'dominationAreaId');

                    // 更新属地的风险等级数据， 更新选择属地的详情信息
                    _this.dominationAreas = _.map(_this.dominationAreas, function (item) {
                        return {
                            id: item.id,
                            name: item.name,
                            level: _.get(group[item.id], '[0].level', '1')
                        }
                    });
                    _this.staticLevel = _.find(_this.dominationAreas, "id", id).level;
                })
            },

            init: function (data) {
                this.compId = data.compId;
                this._getDominationAreas(data.drawOrgId, data.areaId);
                this.staticLevel = data.staticLevel;
                this.showOrgId = data.showOrgId;
                this.orgId = data.drawOrgId;
                this.visible = true;
                this.dateRangeId = '1';
                this.showCustomDateRange = false;
                this.temporaryMode = '0';

                this.currentCheckTables = [];

                _.forEach(this.staticRisks, function (item) {
                    item.num = 0;
                })
                _.forEach(this.dynamicRisks, function (item) {
                    item.num = 0;
                })
            },
            setParameters: function (colors, names, risks, riskPojos) {
                this.riskColorMap = colors;
                this.riskNames = names;
                this.staticRisks = _.cloneDeep(risks);
                this.dynamicRisks =_.cloneDeep(risks);
                this.riskPojos = riskPojos;
            }
        }
    });
    return home;
});
