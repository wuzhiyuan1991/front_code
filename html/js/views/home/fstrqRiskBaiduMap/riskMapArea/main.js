define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    var RM = require('./helper');
    var template = require("text!./main.html");

    var detailModal = require("./detail");

    var initRiskType = 'dynamic';

    var dataModel = {
        riskType: 'static', // 切换静、动态风险
        modalModel: {
            deptName: '',
            riskPojos: null
        },
        dominationAreas:[],
        w:0 //主界面宽度
    };


    //首页效果
    var home = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
        template: template,
        components: {
            detailModal: detailModal
        },
        computed:{
              btnPosition:  function () {
                  if(this.w == 0){
                      return 'display:none';
                  }else if(this.w <= 1550){
                      return 'position: absolute;z-index:6;right:50px;top: 20px;'
                  }else if(this.w >1550){
                      return 'position: absolute;z-index:6;left:1470px;top: 20px;'
                  }
              }
        },
        props: {
            imgSrc:{
              type:String,
              default:''
            },
            maxValue:{
                type: Object,
                default: null
            },
            objArr:{
                type: Object,
                default: null
            },
            pictureId: {
                type: String,
                default: ''
            },
            compId:{
                type:String,
                default:''
            },
            drawOrgId:{
                type:String,
                default:''
            }
        },
        data: function () {
            return dataModel;
        },
        methods: {
            doRefreshDynamic: function () {
                var _this = this;
                if (this.riskType === 'static') {
                    return LIB.Msg.success("刷新成功");
                }
                api.refreshDynamicData({pictureId: this.pictureId}).then(function (res) {
                    _this.riskData = res.data;
                    // LIB.Msg.success("动态风险刷新成功，数据生成时间：" + new Date().Format("yyyy-MM-dd hh:mm:ss"));
                    _this._afterGetData();
                })
            },
            getSetting:function (val) {
                var _this = this;
                var params = {
                    code: 'risk_map_setting',
                    lookupitemCode: 'mock_risk_data_level2_001'
                };
                api.getSetting(params).then(function (res) {
                    var data;

                    try {
                        data = JSON.parse(res.data.content);
                    } catch (e) {
                        // LIB.Msg.error("数据错误");
                    }
                    if (!data) {//没有数据则默认显示静态风险
                        _this._getStaticRisk();
                        return;
                    }
                    LIB.Msg.success("数据生成时间：" + res.data.createDate, 5);
                    if (!_this.riskData) {
                        _this.riskData = {};
                    }

                    _this.riskData.data = _.map(data[0].areas, function (area) {

                        var getName = _.find(_this.dominationAreas,function (item) {
                            return area.id == item.id;
                        });
                        if (getName) {
                            return {
                                areaId: area.id,
                                points: area.picPoints,
                                areaName: getName.name,
                            }
                        }
                    });
                    _this._afterGetData();
                });
            },
            _getDynamicData: function () {
                var _this = this;
                this.getSetting();
                return;
                // ceshi
                api.getDynamicData().then(function (res) {
                    var data;
                    try {
                        data = JSON.parse(res.data.content);
                    } catch (e) {
                        // LIB.Msg.error("数据错误");
                    }
                    if (!data) {//没有数据则默认显示静态风险
                        _this._getStaticRisk();
                        return;
                    }
                    LIB.Msg.success("已切换为动态风险，数据生成时间：" + res.data.createDate, 5);
                    if (!_this.riskData) {
                        _this.riskData = {};
                    }
                    _this.riskData.data = data;
                    _this._afterGetData();
                })
            },
            doChangeMode: function (t) {
                var text;
                if (t === 'static') {
                    this._getStaticRisk();
                    text = '已切换为风险底图';
                    LIB.Msg.success(text);
                } else {
                    this._getDynamicData();
                }
                this.riskType = t;
            },

            // 判断是否鼠标事件在某个左上角图例内
            _isInLegend: function (x, y, isClick) {
                // 实际坐标减去容器距离左上角的距离
                var dx = x - 30, 
                    dy = y - 20;
                var res;
                if(!_.isArray(this.legends)) {
                    return res;
                }

                var legend = _.find(this.legends, function (legend) {
                    return dx > legend.offsetLeft && 
                    dx < legend.offsetLeft + legend.offsetWidth && 
                    dy > legend.offsetTop && 
                    dy < legend.offsetTop + legend.offsetHeight;
                });
                if(legend) {
                    res = {
                        level: legend.dataset.level
                    }
                    if(isClick) {
                        if(legend.classList.contains('without')) {
                            legend.classList.remove('without');
                            res.include = true;
                        } else {
                            legend.classList.add('without');
                            res.include = false;
                        }
                    }
                }
                return res;
            },
            // * 开启或者关闭画布拖动事件
            _toggleMaskMouseMove: function (flag) {
                var _this = this;
                var onMaskMouseMove = _.debounce(function (ev) {
                    var x = ev.offsetX,
                        y = ev.offsetY,
                        ox = x - _this.move.offsetX,
                        oy = y - _this.move.offsetY;
                    var inRect = _this._isInLegend(x, y);
                    if(!inRect) {
                        inRect = _this.riskMap.onmousemove(ox, oy);
                    }
                    if (inRect) {
                        _this.$mask.style.cursor = "pointer";
                    } else {
                        _this.$mask.style.cursor = "default";
                    }
                }, 15);

                if(flag) {
                    this.$mask.addEventListener('mousemove', onMaskMouseMove, false)
                } else {
                    this.$mask.removeEventListener('mousemove', onMaskMouseMove, false)
                }
            },

            // * 更新画布的配置
            updateOpts: function (opts) {

                if(!this.riskMap) {
                    this.init(opts);
                    return;
                }
                if(this.riskMap.image) {
                    this.riskMap.updateOpts(opts, 'out');
                } else {
                    this.riskMap.cacheOpts(opts, 'out');
                }
            },

            // 初始化画布
            init: function (opts) {
                // this.riskMap = new RM(this.canvas, opts, this.modalModel.riskPojos, this.orgName + '风险地图', this.riskColorMap);
                this.riskMap = new RM(this.canvas, opts, this.modalModel.riskPojos, LIB.getDataDic('org', this.drawOrgId).deptName + '风险地图', this.riskColorMap);

                // this.riskMap.loadImage('images/risk_map/map.jpg');
                var image = this.imageURL || 'images/risk_map/map.jpg';
                this.riskMap.loadImage(image);
                this.riskMap.addListener('click', this._click);
                this._toggleMaskMouseMove(true);
            },
            onmousedown: function (ev) {
                var _this = this;
                // 记录鼠标按下的坐标
                this.move.px = ev.offsetX;
                this.move.py = ev.offsetY;
                this.mouseDownX = ev.offsetX;
                this.mouseDownY = ev.offsetY;

                this.$container = this.$els.container;
                this.$box = this.$els.box;
                var cStyle = getComputedStyle(this.$container, null),
                    bStyle = getComputedStyle(this.$box, null);

                this.move.maxOffsetX = Math.min(0, parseInt(cStyle.width) - parseInt(bStyle.width));
                this.move.maxOffsetY = Math.min(0, parseInt(cStyle.height) - parseInt(bStyle.height));

                var onmousemove = _.throttle(function(ev) {
                    _this.move.isMoving = true;
                    var ox = ev.offsetX - _this.move.px,
                        oy = ev.offsetY - _this.move.py;

                    _this.move.offsetX += ox;
                    _this.move.offsetY += oy;

                    // 判断边界
                    if(_this.move.offsetX > 0) {
                        _this.move.offsetX = 0;
                    }
                    if(_this.move.offsetY > 0) {
                        _this.move.offsetY = 0;
                    }
                    if(_this.move.offsetX < _this.move.maxOffsetX) {
                        _this.move.offsetX = _this.move.maxOffsetX;
                    }
                    if(_this.move.offsetY < _this.move.maxOffsetY) {
                        _this.move.offsetY = _this.move.maxOffsetY;
                    }

                    _this.$box.style.transform = "translate3d(" + _this.move.offsetX + "px," + _this.move.offsetY + "px, 0)";

                    _this.move.px = ev.offsetX;
                    _this.move.py = ev.offsetY;
                }, 16.7);

                var onmouseup = function (ev) {
                    _this.mouseUpX = ev.offsetX;
                    _this.mouseUpY = ev.offsetY;

                    _this.move.isMoving = false;
                    document.removeEventListener('mouseup', onmouseup);
                    _this.$mask.removeEventListener('mousemove', onmousemove);
                };
                _this.$mask.addEventListener('mousemove', onmousemove, false);
                document.addEventListener('mouseup', onmouseup, false);
                ev.preventDefault();
            },
            // 蒙层点击的绑定事件
            onMaskClick: function (ev) {
                var d = Math.sqrt((this.mouseDownX-this.mouseUpX)*(this.mouseDownX-this.mouseUpX)+(this.mouseDownY-this.mouseUpY)*(this.mouseDownY-this.mouseUpY));
                if(d >= 5) {
                    return;
                }
                var x = ev.offsetX,
                    y = ev.offsetY,
                    ox = x - this.move.offsetX,
                    oy = y - this.move.offsetY;

                var inRect = this._isInLegend(x, y, true);
                if(inRect) {
                    this.riskMap.onLegendClick(inRect);
                } else {
                    this.riskMap.onclick(ox, oy);
                }

            },

            // * 初始化画布拖动的参数
            _initMoveParam: function () {
                this.$mask = this.$els.mask;
                this.$container = this.$els.container;
                this.$box = this.$els.box;
                var cStyle = getComputedStyle(this.$container, null),
                    bStyle = getComputedStyle(this.$box, null);

                this.move = {
                    isMoving: false, // 是否拖动标志位
                    offsetX: 0, // x轴偏移量 以左上角为原点
                    offsetY: 0, // y轴偏移量 以左上角为原点
                    maxOffsetX: parseInt(cStyle.width) - parseInt(bStyle.width), // x轴最大偏移量
                    maxOffsetY: parseInt(cStyle.height) - parseInt(bStyle.height), // y轴最大偏移量
                    px: 0, // 鼠标当前x坐标
                    py: 0  // 鼠标当前y坐标
                };

            },

            // 获取 地图坐标点数据
            _getPoints: function () {
                var _this = this;
                var params = {
                    code: 'risk_map_setting',
                    lookupitemCode: 'mock_risk_data_level2_001'
                };

                api.getSetting(params).then(function (res) {
                    window.localStorage.setItem('riskMap_' + _this.pictureId, JSON.stringify(res.data));
                    var arr = JSON.parse(res.data.content);
                    var arrNew = _.map(arr[0].areas,function (item) {
                        var getName = _.find(_this.dominationAreas,function (area) {
                            return area.id == item.id;
                        });
                        if (getName) {
                            return {
                                areaId: item.id,
                                points: item.picPoints,
                                name: getName,
                                level: getName.level,
                            }
                        }
                    });
                    _this.opts = arrNew;
                    _this._afterGetData();
                });
                return;

                this.$api.getPoints({pictureId: this.pictureId}).then(function (res) {
                    window.localStorage.setItem('riskMap_' + _this.pictureId, JSON.stringify(res.data));
                    _this.opts = res.data;
                    _this._afterGetData();
                })
            },


            // 获取静态风险数据
            _getStaticRisk: function () {
                var _this = this;
                this.isLoading = true;
                this.$api.staticDept({pictureId: this.pictureId}).then(function (res) {
                    _this.riskData = res.data;
                    _this._afterGetData();
                })
            },

            // 处理地图数据后更新画布
            _afterGetData: function () {

                if(!this.opts || !this.riskData) {
                    return;
                }
                if (this.riskData.data[0]) {
                    this.orgName = this.riskData.data[0].orgName;
                }

                var areas = _.groupBy(this.opts, 'areaId');
                var area = null;

                _.forEach(this.riskData.data, function (item, index) {
                    if (item) {
                        area = areas[item.areaId][0];
                        item.name = item.areaName;
                        item.points = area.points;
                        item.level = areas[item.areaId][0].level;
                    }
                });
                this.updateOpts(this.riskData);
                this.isLoading = false;

            },


            // * 点击事件监听函数
            _click: function (data) {
                data.compId = this.compId;
                data.drawOrgId = this.drawOrgId;
                if(this.move.isMoving) {
                    return;
                }
                this.modalModel.deptName = data.name;

                this.detailComponent.init({
                    drawOrgId: data.drawOrgId,
                    areaId: data.areaId,
                    compId: data.compId,
                    // staticLevel: data.riskFormulaBean.level,
                    staticLevel: 1,
                    showOrgId: data.areaGroupId,
                    riskType : this.riskType,
                });
            },

            _getDominationAreas: function (orgId, areaId) {
                var _this = this;
                api.getDetailInfo({drawOrgId: orgId,pictureId:this.pictureId}).then(function (res) {
                    _this.dominationAreas = _.map(res.data, function (item) {
                          return {
                              id:item.dominationAreaId,
                              level:item.level,
                              riskColor:item.riskColor,
                              riskLabel:item.riskLabel,
                              name:item.dominationAreaName
                          }
                    });

                    _this._getPoints();
                });
            },

            renderPictureLegend: function (color) { 
                return {
                    'background': color
                }
            },
            // 下载风险快照
            doDownloadImage: function () {
                var filename = this.orgName,
                    name = this.riskType === 'static' ? '静态风险' : '动态风险',
                    now = new Date().Format("yyyy年MM月dd日hh时mm分");

                filename = filename + "(" + name + ")-[" + now + "].jpg";

                this.riskMap.download(filename, name);
            },
            doBackToOverview: function () {
                // this.$router.go({path: "/home/riskMapOverview"});
                this.$emit("back");
            },

            // 返回
            changeBack:function () {
                this.$emit("change-back")  ;
            },

            // 获取风险评估模型，颜色和文字需要根据返回的结果对应显示
            _getRiskModelByCompId: function() {
                var _this = this;
                api.getRiskModelByCompId({compId: this.compId}).then(function (res) {
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
                    _this.modalModel.riskPojos = _.sortBy(ret, function (item) {
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
                    // var _dynamic = _.map(ret, function (item) {
                    //     return {
                    //         id: item.id,
                    //         level: item.level,
                    //         num: 0,
                    //         name: item.label
                    //     }
                    // });
                    // _this.dynamicRisks = _.sortBy(_dynamic, function (item) {
                    //     return -(parseInt(item.level))
                    // });

                    _this.detailComponent.setParameters(_colors, _names, risks, _this.modalModel.riskPojos);
                    _this._afterGetRiskModel();
                })
            },
            _afterGetRiskModel: function () {
                if(this.hasLeaved) {
                    this.riskType = initRiskType;
                    if (initRiskType === 'static') {
                        this._getStaticRisk();
                    } else {
                        this._getDynamicData();
                    }
                    this.hasLeaved = false;
                }
                this.$nextTick(function () {
                    if(document.getElementById("legendMsak").querySelectorAll(".sw-risk-overview-legend-item")){
                        this.legends = _.toArray(document.getElementById("legendMsak").querySelectorAll(".sw-risk-overview-legend-item"))
                        return ;
                    }
                    // 不知道为什么报错
                    if((this.$el && this.$el.querySelectorAll &&  this.$el.querySelectorAll(".sw-risk-overview-legend-item"))){
                        this.legends = _.toArray(this.$el.container.querySelectorAll(".sw-risk-overview-legend-item"));
                    }
                })
            },
            getDetailInfo: function () {
                api.getDetailInfo({pictureId:this.pictureId, drawOrgId:this.drawOrgId}).then(function (res) {

                })
            }
        },

        init: function () {
            this.$api = api;
            this.__auth__ = this.$api.__auth__;

            // 获取本地有缓存的风险地图配置项
            if(window.localStorage.getItem("riskMap_" + this.pictureId)) {
                this.opts = JSON.parse(window.localStorage.getItem("riskMap_" + this.pictureId));
            }
            var _this = this;

            // _this.imageURL = 'images/risk_map/fstrq_risk_map.jpg';

            // 获取背景图片
            // api.getMapImage().then(function (res) {
            //     _this.imageURL = 'images/risk_map/' + (res.data || 'map.jpg');
            //     // _this.imageURL = 'images/risk_map/fstrq_risk_map.jpg';
            // })

        },
        created: function () {
            // this.imageURL = 'images/risk_map/fstrq_risk_map.jpg';
            this.imageURL =  this.imgSrc?(LIB.ctxPath(this.imgSrc))  : 'images/risk_map/fstrq_risk_map.jpg';
            this.getDetailInfo();

            this.hasLeaved = true;
        },
        //初始化
        ready: function () {
            var o = document.getElementById("riskMap");
             this.w = o.clientWidth||o.offsetWidth;

            this._initMoveParam();
            if(!this.opts) {
                this._getDominationAreas(this.drawOrgId)
                // this._getPoints();
            }
            this.isLoading = false;
            this.canvas = this.$els.canvas;

            // this._getStaticRisk();

            this.detailComponent = this.$refs.detailComponent;
        },
        attached: function () {
            this._getRiskModelByCompId();
        },
        detached: function () {
            this.hasLeaved = true;
        }
    });
    return home;
});
