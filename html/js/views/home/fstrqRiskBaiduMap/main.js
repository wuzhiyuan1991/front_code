define(function (require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    var Overlay = require("./helper");
    var detailModal = require("./dialog/detail");
    var dataObj = require("./data");
    var api = require("./vuex/api");
    var riskArea = require("./riskMapArea/main");

    var centerCity = dataObj.centerCity;
    var boundaryName = dataObj.boundary;

    var dominationAreaNames = ["官窑调压站","乐平调压站","杏坛门站","沙口调压站","罗村调压站","名城LNG储配站","西樵调压站","狮山调压站",
        "西南调压站","西线阀室","新城调压站","北滘调压站","桂城调压站","大良调压站","芦苞门站","西江调压站"];

    var that = null;

    //首页效果
    var component = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic],
        template: template,
        components: {
            detailModal: detailModal,
            riskArea:riskArea
        },
        data: function () {
            return {
                mainModel: {
                    riskPojos: null
                },
                riskType: 'dynamic',
                treeData: null,
                allChecked: true,
                keyWord: '',
                allOpen: false,
                showPicMap:true,
                pictureId:'',
                picId:'',
                compId:null,
                drawOrgId:null,
                maxValue:{},
                objArr:{},
                imgSrc:''
            }
        },
        methods: {
            refreshData: function () {
                var _this = this;
                if (this.riskType === 'static') {
                    return LIB.Msg.success("数据刷新成功");
                }
                api.refreshDynamicData({pictureId: this.pictureId}).then(function (res) {
                    var data = res.data.data;
                    this.objArr = {};
                    _.each(data, function (items) {
                        if(!this.objArr[items.drawOrgId]){
                            objArr[items.drawOrgId] = {arr:[]};
                            this.objArr[items.drawOrgId].arr.push(items);
                        }else{
                            this.objArr[items.drawOrgId].arr.push(items)
                        }
                    });

                    this.maxValue = {};
                    for(var item in this.objArr){
                        this.maxValue[item] =  _.max(this.objArr[item].arr,function (params) {
                            return params.riskFormulaBean.level;
                        });
                    }
                    _this._updateRiskLevel(res.data.data);
                    // LIB.Msg.success("动态风险刷新成功，数据生成时间：" + new Date().Format("yyyy-MM-dd hh:mm:ss"));
                })
            },
            filterByKeyWord: function () {
                this._renderLevel(null, this._filterData());
                this._normalizeTreeData();
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
                this._normalizeTreeData();

                var _d = this._filterData();
                this._renderLevel(null, _d);
            },
            filterAllBySelect: function () {
                var data = this.baseList;
                var nVal = this.allChecked;
                _.forEach(data, function (item) {
                    item.checked = nVal;
                });
                this._renderLevel(null, this._filterData());
            },
            filterBySelect: function (item) {
                var data = this.baseList;
                var children = _.filter(data, "parentId", item.id);
                _.forEach(children, function (v) {
                    v.checked = item.checked;
                    var c = _.filter(data, "parentId", v.id);
                    if (c.length > 0) {
                        _.forEach(c, function (b) {
                            b.checked = item.checked;
                        });
                    }
                });
                this.allChecked = _.every(data, "checked", true);
                var _d = this._filterData();
                this._renderLevel(null, _d);
            },
            _filterData: function () {
                var data = this.baseList;
                var _this = this;
                var zoom = this.map.getZoom();
                var _d;
                if (zoom === dataObj.zoomLevelMap["1"]) {
                    _d = _.filter(data, "level", "1");
                } else if (zoom === dataObj.zoomLevelMap["2"]) {
                    _d = _.filter(data, "level", "2");
                } else {
                    _d = _.filter(data, "level", "3");
                }
                _d = _.filter(_d, function (item) {
                    return _.includes(_this.levelFilters, item.riskLevel) && item.checked && item.name.indexOf(_this.keyWord) > -1;
                });
                return _d;
            },
            doRenderBgColor: function (riskLevel) {
                riskLevel = riskLevel || '1';
                var colorMap = this.riskColorMap;
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
            },
            doZoom: function(action) {
                if (action === 'in') {
                    this.map.setZoom(this.map.getZoom() + 1)
                } else if (action === 'out') {
                    this.map.setZoom(this.map.getZoom() - 1)
                }
            },

            _getBoundaries: function () {
                var _this = this;
                var name = boundaryName;
                var boundary = new BMap.Boundary();
                this.boundaries = null;
                boundary.get(name, function(rs) {
                    _this.boundaries = rs.boundaries;
                    _this._fillBoundary();
                });
            },
            _fillBoundary: function () {
                if (!this.boundaries) {
                    return;
                }
                var count = this.boundaries.length; //行政区域的点有多少个
                if (count === 0) {
                    return ;
                }
                var pointArray = [];
                for (var i = 0; i < count; i++) {
                    var ply = new BMap.Polygon(
                        this.boundaries[i],
                        {
                            strokeWeight: 1,
                            strokeColor: "#aaaaaa",
                            fillColor: "#4caf50",
                            fillOpacity: 0.3
                        }
                    ); //建立多边形覆盖物
                    this.map.addOverlay(ply);  //添加覆盖物
                    pointArray = pointArray.concat(ply.getPath());
                }
            },

            _init: function () {
                var _this = this;

                var params = {
                    code: 'risk_map_setting',
                    lookupitemCode: 'mock_risk_data_map_config'
                };
                api.getSetting(params).then(function (res) {debugger
                    var data = JSON.parse(res.data.content);
                    // 百度地图API功能
                    var map = new BMap.Map("allmap", {
                        minZoom: dataObj.minZoom,
                        maxZoom: dataObj.maxZoom,
                        enableMapClick: false
                    });

                    // 创建Map实例
                    dataObj.centerCity = data.city;
                    var p = data.point;
                    if (p.x && p.y) {
                        var point = new BMap.Point(p.x,p.y);
                        map.centerAndZoom(point, dataObj.minZoom);  // 初始化地图,设置中心点坐标和地图级别
                    } else {
                        map.centerAndZoom(centerCity, dataObj.minZoom);  // 初始化地图,设置中心点坐标和地图级别
                    }

                    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
                    _this.map = map;
                    map.addEventListener("zoomend", function () {
                        var zoom = _this.getZoom();
                        _this._zoomEnd(zoom);
                    });
                    _this._getBoundaries();
                });
            },

            _normalizeTreeData: function () {
                var _this = this;
                var data = this.baseList;
                _.forEach(data, function (item) {
                    if (item.level !== '3') {
                        item.show = false;
                    }
                    item.children = null;
                });
                var f = _.filter(data, function (item) {
                    return _.includes(_this.levelFilters, item.riskLevel) && item.name.indexOf(_this.keyWord) > -1;
                });

                var g = _.groupBy(f, "parentId");
                var result = [];
                _.forEach(g, function (v, k) {
                    var p = _.find(f, "id", k);
                    if (!p) {
                        result = result.concat(v);
                    } else {
                        p.children = v;
                    }
                });
                this.treeData = result;
            },
            _zoomEnd: function (zoom) {
                var _d = this._filterData();
                this._renderLevel(zoom, _d);
            },
            _renderLevel: function (zoom, _d) {
                var z = zoom || this.map.getZoom();
                this.map.clearOverlays();

                if (z === dataObj.zoomLevelMap["1"]) {
                    this._renderLevel1(_d)
                } else if (z === dataObj.zoomLevelMap["2"]) {
                    this._renderLevel2(_d)
                } else {
                    this._renderLevel3(_d)
                }
                this._fillBoundary();
            },
            _renderLevel1: function (_d) {
                var map = this.map;
                _.forEach(_d, function (item) {
                    var point = new BMap.Point(item.x, item.y);
                    var overlay = new Overlay.CircleOverlay(point, item);
                    map.addOverlay(overlay);
                    var realPoint=new BMap.Point(item.realX, item.realY);
                    overlay.addEventListener("click", function (e) {
                        map.setCenter(realPoint);
                        map.setZoom(dataObj.zoomLevelMap["2"] || dataObj.zoomLevelMap["3"]);
                    });
                });
            },
            _renderLevel2: function (_d) {
                var map = this.map;
                _.forEach(_d, function (item) {
                    var point = new BMap.Point(item.x, item.y);
                    var overlay = new Overlay.CircleOverlay(point, item);
                    map.addOverlay(overlay);
                    var realPoint=new BMap.Point(item.realX, item.realY);
                    overlay.addEventListener("click", function (e) {
                        map.setCenter(realPoint);
                        map.setZoom(dataObj.zoomLevelMap["3"]);
                    });
                });
            },
            _renderLevel3: function (_d) {
                var _this = this;
                var map = this.map;
                _.forEach(_d, function (item, index) {
                    var point = new BMap.Point(item.x, item.y);

                    var parentName = _.find(_this.baseList, "id", item.parentId).name;
                    var overlay = new Overlay.RectOverlay(point, item, parentName);
                    map.addOverlay(overlay);
                    overlay.addEventListener("click", _this._overlayClicked);
                });
            },

            _overlayClicked: function (e) {
                e.stopPropagation();
                var el = e.target.closest(".bdm-overlay-rect");
                var id = el.dataset.id;
                var item = _.find(this.baseList, "id", id);

                this.drawOrgId = item.id;
                var _this = this;
                // var temp = -1;
                // var text = el.innerText.split(" ").join('').split("\n").join(''); //特别骚操作
                // for(var i=0;i<dominationAreaNames.length; i++){
                //     if(dominationAreaNames[i] == text){
                //         temp = i;
                //     }
                // }

                // this.detailComponent.init({
                //     drawOrgId: item.id,
                //     areaId: item.areaId,
                //     compId: item.parentId,
                //     // staticLevel: data.riskFormulaBean.level,
                //     showOrgId: item.id,
                //     staticLevel: item.riskLevel
                // });
                if (item.isClick == 1) { //等于1  才能点击进入下一级
                    this.picId = item.pictureId;
                    this.imgSrc = item.imgSrc;
                    this.$nextTick(function () {
                        _this.showPicMap = !this.showPicMap;
                    });
                }
            },


            // 获取风险评估模型，颜色和文字需要根据返回的结果对应显示
            _getRiskModelByCompId: function(compId) {
                if (!compId) {
                    return LIB.Msg.error("风险地图数据配置错误");
                }
                var _this = this;
                api.getRiskModelByCompId({compId: compId}).then(function (res) {
                    var gradeLatRanges = _.get(res, "data.gradeLatRanges");
                    if (!_.isArray(gradeLatRanges) || _.isEmpty(gradeLatRanges)) {
                        LIB.Msg.error("请先启用一个风险评估模型");
                        return;
                    }

                    var ret = _.map(gradeLatRanges, function (item) {
                        return {
                            id: item.id,
                            level: item.attr1,
                            label: item.level,
                            color: "#" + item.colorMark
                        }
                    });
                    var _names = {};
                    var _colors = {};
                    _.forEach(ret, function (item) {
                        _names[item.level] = item.label;
                        _colors[item.level] = item.color;
                    });
                    _this.mainModel.riskPojos = _.sortBy(ret, function (item) {
                        return -(parseInt(item.level))
                    });
                    _this.riskNames = _names;
                    _this.riskColorMap = _colors;
                    Overlay.setColorMap(_colors);

                    var _static = _.map(ret, function (item) {
                        return {
                            id: item.id,
                            level: item.level,
                            num: 0,
                            name: item.label
                        }
                    });
                    var risks = _.sortBy(_static, function (item) {
                        return -(parseInt(item.level))
                    });

                    _this.levelFilters = _.pluck(ret, "level");

                    _this.detailComponent.setParameters(_colors, _names, risks, _this.mainModel.riskPojos);
                    _this._getDynamicData();
                })
            },
            _getDynamicData: function () {
                var _this = this;
                api.getDynamicData().then(function (res) {
                    var data;
                    try {
                        data = JSON.parse(res.data.content);
                    } catch (e) {
                        // LIB.Msg.error("数据错误")
                        _this.refreshData();
                    }
                    if (!data) {
                        return;
                    }
                    this.objArr = {};
                    _.each(data, function (items) {
                        if(!this.objArr[items.drawOrgId]){
                            objArr[items.drawOrgId] = {arr:[]};
                            this.objArr[items.drawOrgId].arr.push(items);
                        }else{
                            this.objArr[items.drawOrgId].arr.push(items)
                        }
                    });

                    this.maxValue = {};
                    for(var item in this.objArr){
                        this.maxValue[item] =  _.max(this.objArr[item].arr,function (params) {
                            return params.riskFormulaBean.level;
                        });
                    }
                    _this._updateRiskLevel(data);
                })
            },

            _updateRiskLevel: function (data) {
                var _this = this;
                var items = _.map(data, function (item) {
                    return {
                        id: item.drawOrgId,
                        riskLevel: _.get(item, "riskFormulaBean.level", "3")
                    }
                });

                var itemGroup = _.groupBy(items, "id");
                _.forEach(_this.baseList, function (item) {
                    item.riskLevel = _this._calculateMaxLevel(itemGroup[item.id]);
                });

                var level3Arr = _.groupBy(_this.baseList, "parentId");
                _.forEach(_this.baseList, function (item) {
                    if(item.defalutLevel){
                        item.riskLevel = item.defalutLevel;

                    }
                    else if (item.level === '1') {
                        item.riskLevel = _this._calculateMaxLevel(level3Arr[item.id]);
                    }
                });

                this._zoomEnd(_this.map.getZoom());
                this._normalizeTreeData();

            },
            _calculateMaxLevel: function (arr) {
                if (!_.isArray(arr) || _.isEmpty(arr)) {
                    return '1'
                }
                if (arr.length === 1) {
                    return _.get(arr, "[0].riskLevel", "1");
                }
                var levels = _.pluck(arr, "riskLevel");
                return _.max(levels);
            },

            // 从 lookup 中获取配置数据
            _getLookUpData: function () {
                var _this = this;
                api.getLookUpData().then(function (res) {
                    var items = _.flatten(_.map(res.data, function (item) {
                        return item.lookupItems
                    }));

                    var comp = _.find(items, "code", "mock_risk_data_level1");
                    var org = _.find(items, "code", "mock_risk_data_level2_001");
                    var data1, data2;
                    try {
                        data1 = JSON.parse(comp.content);
                        data2 = JSON.parse(org.content);
                    } catch (e) {
                        LIB.Msg.error("风险地图数据配置错误");
                    }

                    _this.initData(data1, data2);
                })
            },

            // 将 lookup 中的数据格式化
            initData: function (companyArr, departmentArr) {
                var compId1 = _.get(companyArr, "[0].orgId");
                this.pictureId = _.get(companyArr, "[0].nextPictureId");
                this._getRiskModelByCompId(compId1);
                this.compId = compId1;
                var arr1 = _.map(companyArr, function (item) {
                    return {
                        name: item.orgName,
                        id: item.orgId,
                        level: '1',
                        riskLevel: '-1',
                        x: item.points[0].x,
                        y: item.points[0].y,
                        realX: item.points[0].realX||item.points[0].x,
                        realY: item.points[0].realY||item.points[0].y,
                        checked: true,
                        pictureId:item.pictureId
                    }
                });

                var arr2 = _.map(departmentArr, function (item) {
                    return {
                        name: item.orgName,
                        id: item.drawOrgId,
                        parentId: item.orgId,
                        level: '3',
                        riskLevel: "-1",
                        x: item.points[0].x,
                        y: item.points[0].y,
                        realX: item.points[0].realX||item.points[0].x,
                        realY: item.points[0].realY||item.points[0].y,
                        areaId: item.dominationAreaIds[0],
                        checked: true,
                        defalutLevel:item.defalutLevel,
                        pictureId:item.pictureId,
                        imgSrc:item.imgSrc,
                        isClick:item.isClick,
                    }
                });
                this.baseList = arr1.concat(arr2);
                this._normalizeTreeData();
            },
            getSetting:function (val) {
                var params = {
                    code: 'risk_map_setting',
                    lookupitemCode: 'mock_risk_data_level2_001'
                };
                api.getSetting(params).then(function (res) {
                    var data = res.data;
                    // _this._renderImage('images/risk_map/'+data.value);
                });
            }
        },
        ready: function () {
            that = this;
            this.levelFilters = ['1', '2', '3', '4'];
            this.detailComponent = this.$refs.detailComponent;
            this._init();
            // this.getSetting()
        },
        created: function () {
            this._getLookUpData();
        }
    });
    return component;
});
