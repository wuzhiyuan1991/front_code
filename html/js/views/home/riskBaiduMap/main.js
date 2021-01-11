define(function (require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    var Overlay = require("./helper");

    function getQueryVariable(variable) {
        var url = window.location.href;
        var query = url.substr(url.indexOf("?") + 1);
        var vars = query.split("&");
        for (var i =0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] === variable){return pair[1];}
        }
        return false;
    }
    var name = getQueryVariable("name");
    var dataObj;
    if (name === 'dcjt') {
        dataObj = require("./data-dcjt");
    } else {
        dataObj = require("./data-ycqp");
    }


    var originData = dataObj.stations;
    originData = _.forEach(originData, function (item) {
        item.checked = true;
        item.show = false;
    });

    var centerCity = dataObj.centerCity;
    var boundaryName = dataObj.boundary;
    var dateRanges = dataObj.dataRanges;
    var risks = dataObj.risks;
    var dynamicRisks = dataObj.dynamicRisks;
    var tables = dataObj.tables;
    var checkItems = dataObj.checkItems;

    var normalizeCheckObjTypes = function () {
        var _checkObjTypes = LIB.getDataDicList("check_obj_risk_type");
        var res = [],
            item;
        _.forEach(_checkObjTypes, function (type) {
            item = {
                id: type.id,
                name: type.value,
                num: type.id === '6' ? 10 : 0
            };
            res.push(item)
        });
        return res;
    };
    //首页效果
    var component = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic],
        template: template,
        data: function () {
            return {
                focusTypes: [
                    {
                        id: '1001',
                        level: '1',
                        name: '重大危险源',
                        num: 0
                    },
                    {
                        id: '1002',
                        level: '1',
                        name: '重点化学品',
                        num: 0
                    },
                    {
                        id: '1003',
                        level: '1',
                        name: '重点化学工艺',
                        num: 0
                    }
                ],
                riskType: 'static',
                checkTables: tables,
                dynamicRisks: dynamicRisks,
                staticRisks: risks,
                riskTypes: normalizeCheckObjTypes(),
                dominationAreas: [],
                checkTableItems: null,
                riskModel: {
                    show: false,
                    name: '',
                    parentName: '',
                    userName: '',
                    dynamicLevel: '1',
                    riskPojos: dataObj.riskPojos
                },
                cache: {
                    focusTypeIndex: -1,
                    areaIndex: -1, // 弹框属地的索引值
                    riskPointIndex: -1,
                    checkTableIndex: -1,
                    staticIndex: -1,
                    dynamicIndex: -1
                },
                dateRangeId: 0,
                chartOpt: {
                    series :[]
                },
                treeData: null,
                staticRiskLevel: '1',
                allChecked: true,
                showCustomDateRange: false,
                keyWord: '',
                allOpen: false,
                showParentName: true,
                showShortName: true,
                dataZoomLevel: 1
            }
        },
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
        methods: {
            refreshData: function () {
                LIB.Msg.success("数据刷新成功");
            },

            // -------------------数据过滤----------------------

            /**
             * this.levelFilters 图例过滤  风险等级过滤
             * this.keyWord  属性菜单文字过滤
             * 通过以上两个条件过滤后的数据，并将结果缓存为 this.currentData
             */
            _getFilteredData: function (stations) {
                var _this = this;
                var items = _.filter(stations, function (item) {
                    return _.includes(_this.levelFilters, item.riskLevel) && item.name.indexOf(_this.keyWord) > -1;
                });
                var groupItems = _.groupBy(items, "level");
                var level1 = groupItems["1"] || [];
                var level2 = groupItems["2"] || [];
                var level3 = groupItems["3"] || [];

                // 补充二级
                var level3ParentIds = _.uniq(_.pluck(level3, "parentId"));
                var level2Ids = _.pluck(level2, "id");
                _.forEach(level3ParentIds, function (id) {
                    if (!_.includes(level2Ids, id)) {
                        level2.push(_.find(stations, "id", id))
                    }
                });

                // 补充一级
                var level2ParentIds = _.uniq(_.pluck(level2, "parentId"));
                var level1Ids = _.pluck(level1, "id");
                _.forEach(level2ParentIds, function (id) {
                    if (!_.includes(level1Ids, id)) {
                        level1.push(_.find(stations, "id", id))
                    }
                });

                return level1.concat(level2, level3);
            },
            _getCurrentData: function () {
                this.currentData = this._getFilteredData(originData);
            },
            _setTreeData: function (arrayData, isShow) {
                var data = arrayData || this.currentData;
                // 这里缓存树形组件的数据，用于多选框过滤
                this.cacheTreeArrayData = data;
                this.allOpen = isShow;
                _.forEach(data, function (item) {
                    if (item.level !== '3') {
                        item.show = isShow;
                    }
                    item.children = null;
                });

                var g = _.groupBy(data, "parentId");
                var result = [];
                _.forEach(g, function (v, k) {
                    var p = _.find(data, "id", k);
                    if (!p) {
                        result = result.concat(v);
                    } else {
                        p.children = _.sortBy(v, "id");
                    }
                });
                this.treeData = result;
            },

            _filterDataAndRender: function () {
                this._getCurrentData();
                if (!this.filterByClickRegion) {
                    this._setTreeData(null, true);
                    this._renderLevel();
                    return;
                }
                this._filterTreeData(this.cacheClickedRegionId);

            },
            filterByKeyWord: function () {
                this._filterDataAndRender();
            },

            filterByLevel: function (e) {
                var el = e.target.closest(".sw-risk-overview-legend-item");
                var level = el.dataset.level;
                if (el.classList.contains("without")) {
                    el.classList.remove("without");
                    this.levelFilters.push(level);
                } else {
                    el.classList.add("without");
                    _.remove(this.levelFilters, function (n) {
                        return n === level;
                    });
                }
                this._filterDataAndRender();
            },

            filterAllBySelect: function () {
                var nVal = this.allChecked;
                _.forEach(this.cacheTreeArrayData, function (item) {
                    item.checked = nVal;
                });
                this._renderLevel(this.cacheTreeArrayData);
            },
            filterBySelect: function (item) {
                var checked = item.checked;
                var data = this.cacheTreeArrayData;

                var children = _.filter(data, "parentId", item.id);
                _.forEach(children, function (v) {
                    v.checked = checked;
                    var c = _.filter(data, "parentId", v.id);
                    if (c.length > 0) {
                        _.forEach(c, function (b) {
                            b.checked = checked;
                        });
                    }
                });

                this.allChecked = _.every(data, "checked", true);
                this._renderLevel(this.cacheTreeArrayData);
            },


            // -----------------------树形组件操作--------------------------
            showAll: function () {
                this.filterByClickRegion = false;
                this._setTreeData(null, true);
                this._renderLevel();
            },
            toggleAllTree: function () {
                var open = this.allOpen = !this.allOpen;
                _.forEach(this.treeData, function (item) {
                    item.show = open;
                    _.forEach(item.children, function (v) {
                        v.show = open;
                    })
                })
            },
            toggleTree: function (item) {
                item.show = !item.show;
            },
            clickedTreeNode: function (item) {
                var point = new BMap.Point(item.x, item.y);
                this.map.setCenter(point);
                if (item.level === '1') {
                    this.map.setZoom(dataObj.zoomLevelMap["1"]);
                } else if (item.level === '2') {
                    this.map.setZoom(dataObj.zoomLevelMap["2"]);
                } else {
                    this.map.setZoom(dataObj.zoomLevelMap["3"]);
                }
                this.dataZoomLevel = Number(item.level);
                this._renderLevel(this.cacheTreeArrayData);
            },


            doZoom: function(action) {
                var level = this.dataZoomLevel;
                var zlm = dataObj.zoomLevelMap;
                if (action === 'in' && level < 3) {
                    level = level + 1;
                    this.map.setZoom(zlm[level])
                } else if (action === 'out' && level > 1) {
                    level = level - 1;
                    this.map.setZoom(zlm[level])
                } else {
                    return;
                }
                this._getCurrentData();
                this.filterByClickRegion = false; // 是否点击大区或区域过滤数据
                this.dataZoomLevel = level;
                _.forEach(this.currentData, function (v) {
                    v.checked = true
                });
                this.allChecked = true;
                this._setTreeData(null, true);
                this._renderLevel();
            },



            _init: function () {
                var _this = this;
                // 百度地图API功能
                var map = new BMap.Map("allmap", {minZoom: dataObj.minZoom, maxZoom: dataObj.maxZoom, enableMapClick: false });    // 创建Map实例
                map.centerAndZoom(centerCity, 8);  // 初始化地图,设置中心点坐标和地图级别
                map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放

                this.map = map;
                this.riskColorMap = Overlay.colorMap;

                var zoomEndListener = function () {
                    if (_this.filterByClickRegion) {
                        _this._filterDataAndRender();
                    } else {
                        _this._renderLevel();
                    }
                    // map.removeEventListener("zoomend", zoomEndListener);
                };
                map.addEventListener("zoomend", zoomEndListener);

                // 监听1级区域点击事件
                map.addEventListener("click", function (e) {
                    if (e.overlay) {
                        var polygons = _this.level1Polygons.concat(_this.level2Polygons);
                        var o = _.find(polygons, function (item) {
                            return item.polygon === e.overlay || item.label === e.overlay;
                        });
                        if (o && o.id) {
                            if (_this.dataZoomLevel === 1) {
                                _this._level1Clicked(o.id);
                            } else if (_this.dataZoomLevel === 2) {
                                _this._level2Clicked(o.id);
                            }
                        }
                    }
                });

                this.currentData = originData;
                this._setTreeData(null, false);

                this._getBoundaries();
            },


            _getBoundaries: function () {
                var _this = this;
                var name = boundaryName;
                var boundary = new BMap.Boundary();
                this.boundaries = null;
                boundary.get(name, function(rs) {
                    _this.boundaries = rs.boundaries;
                    // _this._fillBoundary();
                });
            },
            _fillBoundary: function (level) {
                if (!this.boundaries) {
                    return;
                }
                var count = this.boundaries.length; //行政区域的点有多少个
                if (count === 0) {
                    return ;
                }
                var pointArray = [];
                var opacity = (level === 2 ? 0.9 : 0.3);
                var fillColor = (level === 2 ? "#d9d9d9" : "#4caf50");
                for (var i = 0; i < count; i++) {
                    var ply = new BMap.Polygon(
                        this.boundaries[i],
                        {
                            strokeWeight: 1,
                            strokeColor: "#aaaaaa",
                            fillColor: fillColor,
                            fillOpacity: opacity
                        }
                    ); //建立多边形覆盖物
                    this.map.addOverlay(ply);  //添加覆盖物
                    pointArray = pointArray.concat(ply.getPath());
                }
            },

            changeLevel3Text: function () {
                if (this.dataZoomLevel === 3) {
                    this._filterDataAndRender();
                }
            },
            _renderLevel: function (data) {
                var arrData = data || this.currentData;
                var _d = _.filter(arrData, "checked", true);
                var z = this.map.getZoom();
                this.map.clearOverlays();

                if (this.dataZoomLevel === 1) {
                    _d = _.filter(_d, "level", "1");
                    this._renderLevel1(_d)
                } else if (this.dataZoomLevel === 2) {
                    _d = _.filter(_d, "level", "2");
                    this._fillBoundary(2);
                    this._renderLevel2(_d);
                } else {
                    _d = _.filter(_d, "level", "3");
                    this._fillBoundary(3);
                    this._renderLevel3(_d);
                }
            },

            _filterTreeData: function (id) {
                this.cacheClickedRegionId = id;
                // 当前当前点击的元素
                var item = _.find(this.currentData, "id", id);
                // 获取子级元素
                var arr1 = _.filter(this.currentData, "parentId", id);
                var arr2;
                if (item.parentId) {
                    // 如果有父级，说明是二级，获取父级元素
                    arr2 = _.filter(this.currentData, "id", item.parentId);
                } else {
                    // 如果没有父级，说明是一级，则获取子子级元素
                    var ids = _.pluck(arr1, "id");
                    arr2 = _.filter(this.currentData, function(item) {
                        return _.includes(ids, item.parentId)
                    });
                }

                var result = arr1.concat(item, arr2);

                this._setTreeData(result, true);
                this._renderLevel(result);
            },
            // 设置自绘区域的文字标签
            _getLabel: function (point, text, offset, fontSize) {
                fontSize = fontSize || 50;
                if (!_.isPlainObject(offset)) {
                    offset = {x: 0, y: 0};
                }
                var label = new BMap.Label(text, {
                    position: point,
                    offset: new BMap.Size(offset.x, offset.y)
                });  // 创建文本标注对象
                label.setStyle({
                    color : "#fff",
                    fontSize : fontSize + "px",
                    height : "30px",
                    lineHeight : "30px",
                    fontFamily:"微软雅黑",
                    backgroundColor: "transparent",
                    borderColor: "transparent"
                });
                return label;
            },

            _renderLevel1: function (_d) {
                this.level1Polygons = [];
                var map = this.map;
                var zoom = map.getZoom();
                var colorMap = this.riskColorMap;
                var polygonDatas = dataObj.polygonDatas;
                if (!polygonDatas || _.isEmpty(polygonDatas)) {
                    return;
                }
                var ids = _.pluck(_d, "id");
                var data = _.filter(polygonDatas, function (item) {
                    return _.includes(ids, item.id)
                });

                for (var i = 0; i < data.length; i++) {
                    var item = _.find(_d, "id", data[i].id);
                    var ply = new BMap.Polygon(
                        data[i].points,
                        {
                            strokeWeight: 2,
                            strokeColor: colorMap[item.riskLevel],
                            fillColor: colorMap[item.riskLevel],
                            fillOpacity: 0.9
                        }
                    );
                    map.addOverlay(ply);  //添加覆盖物

                    var label = this._getLabel(new BMap.Point(item.x, item.y), item.name, data[i].labelOffset);
                    if (zoom >= dataObj.zoomLevelMap['1']) {
                        map.addOverlay(label);
                    }
                    this.level1Polygons.push({
                        id: item.id,
                        polygon: ply,
                        label: label
                    })
                }
            },
            _level1Clicked: function (id) {
                this.filterByClickRegion = true;
                var stations = dataObj.stations;
                var item = _.find(stations, "id", id);
                this.map.setCenter(new BMap.Point(item.x, item.y));
                this.map.setZoom(dataObj.zoomLevelMap["2"]);
                this.dataZoomLevel = 2;
                this._filterTreeData(id);
            },
            _renderLevel2: function (_d) {
                var defaultOffset = {x: 0, y: 0};
                this.level2Polygons = [];
                var map = this.map;
                var zoom = map.getZoom();
                var colorMap = this.riskColorMap;
                var polygonDatas = dataObj.polygonDatas;
                if (!polygonDatas || _.isEmpty(polygonDatas)) {
                    return;
                }
                var ids = _.pluck(_d, "id");
                var data = _.filter(polygonDatas, function (item) {
                    return _.includes(ids, item.id)
                });

                for (var i = 0; i < data.length; i++) {
                    var item = _.find(_d, "id", data[i].id);
                    var ply = new BMap.Polygon(
                        data[i].points,
                        {
                            strokeWeight: 2,
                            strokeColor: "#fff",
                            fillColor: colorMap[item.riskLevel],
                            fillOpacity: 0.9
                        }
                    );
                    var fontSize = data[i].fontSize || 40;
                    var labelOffset = data[i].labelOffset || defaultOffset;
                    var label = this._getLabel(new BMap.Point(item.x, item.y), item.name, labelOffset, fontSize);

                    map.addOverlay(ply);  //添加覆盖物

                    if (zoom >= dataObj.zoomLevelMap['2']) {
                        map.addOverlay(label);
                    }
                    this.level2Polygons.push({
                        id: item.id,
                        polygon: ply,
                        label: label
                    })
                }
            },
            _level2Clicked: function (id) {
                this.filterByClickRegion = true;
                var stations = dataObj.stations;
                var item = _.find(stations, "id", id);
                this.map.setCenter(new BMap.Point(item.x, item.y));
                this.map.setZoom(dataObj.zoomLevelMap["3"]);
                this.dataZoomLevel = 3;
                this._filterTreeData(id);
            },
            _renderLevel3: function (_d) {
                var showParentName = this.showParentName;
                var showShortName = this.showShortName;
                var _this = this;
                var map = this.map;
                _.forEach(_d, function (item) {
                    var point = new BMap.Point(item.x, item.y);
                    var parentName = _.find(originData, "id", item.parentId).name;
                    var nameArr = item.name.split(/[(（]/);
                    var name = nameArr[0];
                    var shortName = nameArr[1].slice(0, -1);
                    var text = name;
                    if (showParentName) {
                        text = parentName + "-" + name;
                    }
                    if (showShortName) {
                        text = text + "(" + shortName + ")"
                    }
                    var overlay = new Overlay.RectOverlay(point, item, text);
                    map.addOverlay(overlay);
                    overlay.addEventListener("click", _this._level3Clicked);
                });
            },

            _level3Clicked: function (e) {
                e.stopPropagation();
                var el = e.target.closest(".bdm-overlay-rect");
                var id = el.dataset.id;
                var item = _.find(originData, "id", id);
                var parent = _.find(originData, "id", item.parentId);
                this.riskModel.name = item.name;
                var parentName = parent.name.substr(0, parent.name.length - 1);
                this.riskModel.parentName = parentName;
                this.riskModel.userName = parentName;
                this.riskModel.dynamicLevel = item.riskLevel;
                this.riskModel.show = true;

                this.cache.checkTableIndex = 0;
                this.riskType = 'static';
                this.checkTableItems = _.filter(checkItems, "parentId", "1");

                if (this.level3Id === id) {
                    return;
                }
                this.level3Id = id;
                var _l = Number(item.riskLevel);
                _.forEach(this.checkTables, function (table, i) {
                    if (i === 0) {
                        table.dynamicLevel = _l + '';
                    } else {
                        table.dynamicLevel = Math.floor(Math.random() * _l) + 1 + '';
                    }
                })

                var count = _.countBy(this.checkTables, function (item) {
                    return item.dynamicLevel;
                })
                _.forEach(this.dynamicRisks, function (item) {
                    item.num = count[item.level] || 0;
                })
            },


            closeModal: function () {
                this.riskModel.show = false;
            },

            doClickCheckTable: function (index, id) {
                if(this.cache.checkTableIndex === index) {
                    return;
                }
                var _id = id === '2' ? '2' : '1';
                if (id > 5) {
                    _id = '7'
                }
                this.checkTableItems = _.filter(checkItems, "parentId", _id);

                this.dateRangeId = '1';
                this.cache.checkTableIndex = index;
            },
            doChangeRiskType: function (type) {

                this.dateRangeId = '1';
                this.riskType = type;
                if(type === 'dynamic') {
                    this.$nextTick(function () {
                        this.$refs.lineChart.resize();
                        this.buildOptions(dataObj.chartData);
                    })
                }
            },
            doClickRiskPointType: function () {

            },
            doClickFocusType: function () {

            },
            doClickStaticRisk: function () {
                
            },
            doClickDynamicRisk: function () {

            },
            doShowCustomDateRange: function () {
                this.showCustomDateRange = true;
            },
            doCalcTrendIcon: function (level1, level2) {
                level1 = level1 || '1';
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
                this.dateRangeId = id;
            },
            doRenderLevelName: function (riskLevel) {
                var riskNames = {
                    '1': '低',
                    '2': '中',
                    '3': '高'
                };
                riskLevel = riskLevel || '1';
                return riskNames[riskLevel];
            },
            doRenderBgColor: function (riskLevel) {
                riskLevel = riskLevel || '1';
                var colorMap = Overlay.colorMap;
                var bgColor = colorMap[riskLevel];
                var obj = {
                    backgroundColor: bgColor,
                    color: "#fff"
                };
                return obj;
            },
            renderPictureLegend: function (color) {
                return {
                    'background': color
                }
            },
            buildOptions: function (data) {
                var riskNames = {
                    '1': '低风险',
                    '2': '中风险',
                    '3': '高风险'
                };
                var opt = {
                    animationDuration: 500,
                    title: {
                        show: false
                    },
                    color: ['#3398DB'],
                    tooltip : {
                        trigger: 'axis',
                        formatter: function (arr) {
                            var obj = arr[0];
                            if(obj.name && obj.value) {
                                return obj.name + '<br />' + riskNames[obj.value];
                            }
                        }
                    },
                    grid: {
                        left: 0,
                        right: '4%',
                        bottom: 10,
                        top: 20,
                        containLabel: true
                    },
                    yAxis : {
                        type : 'value',
                        min: 0,
                        max: 3,
                        axisLabel: {
                            formatter: function (value) {
                                return riskNames[value];
                            }
                        }
                    },
                    series : [
                        {
                            type:'line',
                            data: _.pluck(data, 'level'),
                            symbol: 'circle',
                            symbolSize: 10,
                            smooth: true,
                            label: {
                                normal: {
                                    textStyle: {
                                        color: '#fff'
                                    }
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: function (data) {
                                        return Overlay.colorMap[data.value]
                                    }
                                }
                            },
                            lineStyle: {
                                normal: {
                                    color: '#35aae1'
                                }
                            }
                        }
                    ]
                };


                opt.xAxis = {
                    type : 'category',
                    data : _.pluck(data, 'date'),
                    axisLabel: {
                        interval: 0,
                        formatter: function(val){
                            if(!val) {
                                return '';
                            }
                            var strs = val.split(' '); //字符串数组
                            return strs[0].substr(5) + '\n' + strs[1].substr(0, 5);
                        }
                    }
                };

                this.chartOpt = opt;
            },
        },
        ready: function () {
            this.levelFilters = ["1", "2", "3"]; // 风险等级过滤池
            this.dataZoomLevel = 1; // 数据缩放层级 1-3
            this.filterByClickRegion = false; // 是否点击大区或区域过滤数据
            // this.cacheClickedRegionId 缓存点击的区域的ID
            this._init();
        }
    });
    return component;
});
