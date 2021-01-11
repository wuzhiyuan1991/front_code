define(function (require) {
    var LIB = require('lib');
    var template = require("text!./setPoint.html");
    var Overlay = require("./helper");
    var detailModal = require("./dialog/detail");
    var dataObj = require("./data");
    var api = require("./vuex/api");
    var riskArea = require("./riskMapArea/main");
var editModel = require('./dialog/edit')
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
            riskArea:riskArea,
            editModel:editModel
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
                orgId:null,
                drawOrgId:null,
                maxValue:{},
                objArr:{},
                imgSrc:'',
                orgName:'',
                markerList:[],
                visible:false,
                tempPoint:{
                    name:'',
                    flag:false,
                },
                oldList:null,
                oldListItem:null,
                baseListItem:null,
                oldId:null,
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

                    _this._updateRiskLevel(res.data.data);
                    LIB.Msg.success("动态风险刷新成功，数据生成时间：" + new Date().Format("yyyy-MM-dd hh:mm:ss"));
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
                    // lookupitemCode: 'mock_risk_data_level2_001'
                };
                api.getSetting(params).then(function (res) {
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
                    map.addEventListener("click", _this.addPoint);
                    map.addEventListener("zoomend", function () {
                        var zoom = _this.map.getZoom();
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

            markerMove:function () {
                _.each(this.markerList, function (item) {
                    item.enableDragging();
                })
            },
            markerStopMove:function () {
                _.each(this.markerList, function (item) {
                    item.disableDragging();
                })
            },
            _renderLevel3: function (_d) {
                var _this = this;
                var map = this.map;
                _this.markerList = [];
                _.forEach(_d, function (item, index) {
                    var point = new BMap.Point(item.x, item.y);
                    var myIcon = new BMap.Icon("images/risk_map/icon/biaoji.png", new BMap.Size(32,32));
                    var  marker = new BMap.Marker(point, {icon:myIcon});// 创建标注
                    marker.drawOrgId = item.drawOrgId;
                    marker.name = item.name;
                    map.addOverlay(marker);

                    //添加标签
                    var label = new BMap.Label(item.name,{offset:new BMap.Size(20,-10)});
                    label.setStyle({
                        color : "#666", //字体颜色
                        fontSize : "14px",//字体大小 　　
                        backgroundColor : _this.getRiskColor(item.riskLevel), //文本标注背景颜色　
                        border :"0",
                        fontWeight :"bold" //字体加粗
                    });
                    marker.setLabel(label);

                    // 绑定删除事件
                    var removeMarker = function(e,ee,marker,aa){
                        _this.removeMarker(e,marker, aa);
                    };
                    var markerMenu=new BMap.ContextMenu();
                    markerMenu.addItem(new BMap.MenuItem('删除',removeMarker.bind(marker, item)));
                    marker.addContextMenu(markerMenu);

                    // 绑定点击事件
                    marker.addEventListener("click", function (e) {
                        _this._clickMark(e, item, marker);
                    });

                    // 拖拽事件
                    marker.addEventListener("dragend", function (e) {
                        _this.drawEnd(e, item, marker);
                    });
                    _this.markerList.push(marker);
                });
            },

            drawEnd:function (e, item, marker) {
                var obj = _.find(this.oldList,'drawOrgId',marker.drawOrgId);
                if(obj) {
                    obj.points[0] = {x:marker.getPosition().lng, y:marker.getPosition().lat};
                }
                var obj = _.find(this.baseList,'drawOrgId',marker.drawOrgId);
                if(obj) {
                    obj.x = marker.getPosition().lng;
                    obj.y = marker.getPosition().lat;
                }

            },

            doShowAddModel:function () {
                this.visible = true;
                this.$refs.editModel.init();
            },
            // 删除坐标
            removeMarker:function (e, item, marker) {
                var index = -1;
                for(var i=0; i<this.baseList.length; i++){
                    if(this.baseList[i].drawOrgId == marker.drawOrgId){
                        index = i;
                        this.baseList.splice(index, 1);
                    }
                }
                for(var i=0; i<this.oldList.length; i++){
                    if(this.oldList[i].drawOrgId == marker.drawOrgId){
                        index = i;
                        this.oldList.splice(index, 1);
                    }
                }
                for(var i=0; i<this.markerList.length; i++){
                    if(this.markerList[i].drawOrgId == marker.drawOrgId){
                        index = i;
                        this.markerList.splice(index, 1);
                    }
                }

                this.map.removeOverlay(marker);
            },
            // 更新坐标
            upDateMark:function (val) {
                // 更新老列表
                var marker = _.find(this.oldList,"drawOrgId",val.drawOrgId);
                if(marker){
                    marker.orgId = val.compId;
                    marker.name = val.name;
                    marker.drawOrgId = val.drawOrgId;
                    marker.areaGroupId = val.orgId;
                };
                var baseItem = _.find(this.baseList,"drawOrgId",val.drawOrgId);
                if(baseItem){
                    baseItem.orgId = val.compId;
                    baseItem.name = val.name;
                    baseItem.drawOrgId = val.drawOrgId;
                    baseItem.areaGroupId = val.orgId;
                }
            },
            doUpdatePoint:function (obj) {
                var marker = _.find(this.markerList,"drawOrgId",obj.drawOrgId);
                if(marker){
                    var label = marker.getLabel()
                    label.setContent(obj.name);
                };
                this.upDateMark(obj);
            },

            updateAllPoint:function () {

                if(!this.oldId) return;
                var params = {
                    id:this.oldId,
                    content: JSON.stringify(this.oldList),
                    lookup:{id:this.lookupId}
                }
                api.updateLookUp(params).then(function (res) {
                    LIB.Msg.success("保存成功");
                })
            },

            doAddPoint:function (val, oldListObj, baseListObj) {
                this.tempPoint.name = val.name;
                this.tempPoint.orgId = val.compId;
                this.tempPoint.drawOrgId = val.drawOrgId;
                this.tempPoint.areaGroupId = val.orgId;
                this.oldListItem = oldListObj;
                this.baseListItem = baseListObj;
                this.tempPoint.flag = true; // 是否插入的标志
            },
            // 点击地图 插入坐标
            addPoint:function (e) {
                if(!this.tempPoint.flag) return;
                var map = this.map;
                this.tempPoint.flag = false;
                var point = new BMap.Point(e.point.lng, e.point.lat);
                var _this = this;
                var myIcon = new BMap.Icon("images/risk_map/icon/biaoji.png", new BMap.Size(32,32));
                var  marker = new BMap.Marker(point, {icon:myIcon});// 创建标注
                map.addOverlay(marker);

                var label = new BMap.Label(this.tempPoint.name,{offset:new BMap.Size(20,-10)});
                label.setStyle({
                    color : "#666", //字体颜色
                    fontSize : "14px",//字体大小 　　
                    backgroundColor : _this.getRiskColor(1), //文本标注背景颜色　
                    border :"0",
                    fontWeight :"bold" //字体加粗
                });
                marker.setLabel(label);
                marker.drawOrgId = this.tempPoint.drawOrgId;

                var baseItme = _this.baseListItem;
                _this.markerList.push(marker);

                _this.baseListItem.x = e.point.lng;
                _this.baseListItem.y = e.point.lat;
                _this.baseList.push(_this.baseListItem);

                _this.oldListItem.points[0] = {x:e.point.lng,y:e.point.lat}
                _this.oldList.push(_this.oldListItem);

                marker.addEventListener("click", function (e) {
                    _this._clickMark(e,baseItme , marker);
                });
                // 拖拽事件
                marker.addEventListener("dragend", function (e) {
                    _this.drawEnd(e, baseItme, marker);
                });
                // 绑定删除事件
                var removeMarker = function(e,ee,marker,aa){
                    _this.removeMarker(e,marker, aa);
                };
                var markerMenu=new BMap.ContextMenu();
                markerMenu.addItem(new BMap.MenuItem('删除',removeMarker.bind(marker, baseItme)));
                marker.addContextMenu(markerMenu);
            },

            getRiskColor:function(level){
                var color = "#fff";
                  for(var i=0; i<this.mainModel.riskPojos.length; i++){
                      if(level == this.mainModel.riskPojos[i].level){
                          color = this.mainModel.riskPojos[i].color;
                      }
                  }
                  return color;
            },

            _clickMark: function (e, item, marker) {
                var _this = this;
                // marker.setLabel(label);
                var label = marker.getLabel()
                // label.setContent("00");
                // console.log(label.content, this.oldList, marker);
                this.visible = true;
                this.$refs.editModel.init(item);
            },

            _overlayClicked: function (e) {
                return;
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
                    if(org.id){
                        _this.oldId = org.id;
                        _this.lookupId = org.lookupId;
                    }
                    var data1, data2;
                    try {
                        data1 = JSON.parse(comp.content);
                        data2 = JSON.parse(org.content);
                    } catch (e) {
                        LIB.Msg.error("风险地图数据配置错误");
                    }

                    _this.oldList = data2;

                    _this.initData(data1, data2);
                })
            },

            // 将 lookup 中的数据格式化
            initData: function (companyArr, departmentArr) {
                var _this = this;
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
                        conf:item.conf || null ,
                        drawOrgId:item.drawOrgId,
                        name: item.orgName,
                        id: item.drawOrgId,
                        parentId: item.orgId,
                        areaGroupId:item.areaGroupId,
                        level: '3',
                        riskLevel: "-1",
                        x: item.points[0].x,
                        y: item.points[0].y,
                        px:item.points[1]?item.points[1].x:null,
                        py:item.points[1]?item.points[1].y:null,
                        realX: item.points[0].realX||item.points[0].x,
                        realY: item.points[0].realY||item.points[0].y,
                        areaId: item.dominationAreaIds[0],
                        checked: true,
                        defalutLevel:item.defalutLevel,
                        pictureId:item.pictureId,
                        imgSrc:item.imgSrc,
                        isClick:item.isClick,
                        orgId:item.orgId,
                        nextPictureId:item.pictureId,
                        compId:_this.compId
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
