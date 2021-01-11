define(function (require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    var dataObj = require("../data");
    var overView = require("../../../businessCenter/hiddenDanger/riskMapOverview/main");
    var api = require('../vuex/api');

    var that = null;

    //首页效果
    var component = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic],
        template: template,
        components: {
            overView:overView
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
                imgSrc:'',
                list:[],
                comInfo:{},
                gradeLatRanges:[],
                gradeOnePic:''
            }
        },
        methods: {
            colorClick:function (arr) {
                var _this = this;
                var _d = this._filterData();
                var list = _.cloneDeep(_d);

                _.each(list, function (item) {
                    item.riskFormulaBean = {
                        dominationAreaId:item.areas,
                        leve:item.level,
                    };
                    if(item.riskLevel && item.riskLevel>0 && item.riskLevel<6 && _this.gradeLatRanges && _this.gradeLatRanges.length>0){
                        item.riskFormulaBean.riskColor = _this.getColor(item.riskLevel)
                    }
                    item.orgName = item.name;
                    item.points = [{x:item.x, y:item.y}];

                    // 点的坐标
                    if(item.px){
                        item.points.push({x:item.px, y:item.py});
                    }

                    // item.points = [{x: "113.117586", y: "23.025364"}]
                });

                var l =_.filter(list, function (item) {
                   return _.find(arr,function (arrItem) {
                       return arrItem.level == item.riskLevel && !arrItem.risk;
                   })
                });

                this.list = l;
            },
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
                    LIB.Msg.success("动态风险刷新成功，数据生成时间：" + new Date().Format("yyyy-MM-dd hh:mm:ss"));
                })
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
                var _d;
                _d = _.filter(data, "level", "3");
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

            go:function (val1, val2, val3) {
                this.imgSrc = val3.imgSrc;
                this.drawOrgId = val3.drawOrgId;
                this.$emit('go', val3);
            },


            _init: function () {
                var _this = this;

                var params = {
                    code: 'risk_map_setting',
                    lookupitemCode: 'mock_risk_data_map_config'
                };
                api.getSetting(params).then(function (res) {
                    var data=null;
                    try{
                        data = JSON.parse(res.data.content);
                    }catch (e){}
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

            getColor:function (val) {
                  var a = '';
                  for (var i=0; i<this.gradeLatRanges.length; i++){
                      if(val == this.gradeLatRanges[i].attr1){
                          a = this.gradeLatRanges[i].colorMark
                      }
                  }
                  return a;
            },

            _zoomEnd: function (zoom) {
                var _this = this;
                var _d = this._filterData();
                var list = _.cloneDeep(_d);

                _.each(list, function (item) {
                    item.riskFormulaBean = {
                        dominationAreaId:item.areas,
                        leve:item.level,
                    };
                    if(item.riskLevel && item.riskLevel>0 && item.riskLevel<6 && _this.gradeLatRanges && _this.gradeLatRanges.length>0){
                        item.riskFormulaBean.riskColor = _this.getColor(item.riskLevel)
                    }
                    item.orgName = item.name;
                    item.points = [{x:item.x, y:item.y}];

                    // 点的坐标
                    if(item.px){
                        item.points.push({x:item.px, y:item.py});
                    }

                    // item.points = [{x: "113.117586", y: "23.025364"}]
                });
                this.list = list
                this._renderLevel(zoom, _d);
            },
            _renderLevel: function (zoom, _d) {
                this._renderLevel3(_d)
            },

            _renderLevel3: function (_d) {
                var _this = this;
                _.forEach(_d, function (item, index) {
                    // var point = new BMap.Point(item.x, item.y);
                    //
                    // var parentName = _.find(_this.baseList, "id", item.parentId).name;
                    // var overlay = new Overlay.RectOverlay(point, item, parentName);
                    // map.addOverlay(overlay);
                });
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
                    _this.gradeLatRanges = gradeLatRanges;
                    _this._zoomEnd(19)

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

                    // _this.detailComponent.setParameters(_colors, _names, risks, _this.mainModel.riskPojos);
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

                    if(item.defalutLevel && !item.isClick){
                        item.riskLevel = item.defalutLevel;
                    }
                    else if (item.level === '1') {
                        item.riskLevel = _this._calculateMaxLevel(level3Arr[item.id]);
                    }
                });
                this._zoomEnd(19);
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
                    _this.comInfo = data1;
                    _this.initData(data1, data2);
                })
            },

            // 将 lookup 中的数据格式化
            initData: function (companyArr, departmentArr) {
                var compId1 = _.get(companyArr, "[0].orgId");
                this.pictureId = _.get(companyArr, "[0].nextPictureId");
                this.compId = compId1;
                var _this = this;
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
                        orgId:item.orgId,
                        pictureId:item.pictureId,
                        nextPictureId:item.pictureId
                    }
                });
                this.gradeOnePic = companyArr[0].imgSrc;
                var arr2 = _.map(departmentArr, function (item) {
                    return {
                        conf:item.conf || null ,
                        drawOrgId:item.drawOrgId,
                        name: item.orgName,
                        id: item.drawOrgId,
                        parentId: item.orgId,
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
                this._getRiskModelByCompId(compId1);

            },
            getSetting:function (val) {
                var params = {
                    code: 'risk_map_setting',
                    lookupitemCode: 'mock_risk_data_level2_001'
                };
                // api.getSetting(params).then(function (res) {
                //     var data = res.data;
                //     // _this._renderImage('images/risk_map/'+data.value);
                // });
            }
        },

        ready: function () {
            that = this;
            this.levelFilters = ['1', '2', '3', '4'];
            this.detailComponent = this.$refs.detailComponent;
            // this._init();
            // this.getSetting()
        },
        created: function () {
            this._getLookUpData();
        }
    });
    return component;
});
