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
        staticName:'风险底图'
    };


    //首页效果
    var home = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
        template: template,
        components: {
            detailModal: detailModal
        },
        props: {
            optionObj: {
                type: Object,
                default: null
            },
            pictureId: {
                type: String,
                default: ''
            },
            showReturn: {
                type: String,  //1: 厦门象屿
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
                    LIB.Msg.success("动态风险刷新成功，数据生成时间：" + new Date().Format("yyyy-MM-dd hh:mm:ss"));
                    _this._afterGetData();
                })
            },
            _getDynamicData: function () {
                var _this = this;
                if(this.showReturn == '1'){
                    api.queryRiskAreaDynamic({pictureId: this.pictureId}).then(function (res) {
                        var data;
                        data = res.data.data;
                        if (!data) {//没有数据则默认显示静态风险
                            _this._getStaticRisk();
                            return;
                        }
                        LIB.Msg.success("已切换为动态风险" , 5);
                        if (!_this.riskData) {
                            _this.riskData = {};
                        }
                        _this.riskData.data = data;
                        _this._afterGetData();
                    });
                }else{
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
                }
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
                // if(!this.riskMap) {
                //     this.init(opts);
                //     return;
                // }
                this.init(opts);
                if(this.riskMap.image) {
                    this.riskMap.updateOpts(opts, 'out');
                } else {
                    this.riskMap.cacheOpts(opts, 'out');
                }
            },

            // 初始化画布
            init: function (opts) {
                if(this.optionObj){
                    this.riskMap = new RM(this.canvas, opts, this.modalModel.riskPojos, this.optionObj.name + '风险地图', this.riskColorMap);
                }else{
                    this.riskMap = new RM(this.canvas, opts, this.modalModel.riskPojos, this.orgName + '风险地图', this.riskColorMap);
                }
                // this.riskMap.loadImage('images/risk_map/map.jpg');
                if(this.$route.query.imgSrc){
                    this.imageURL = unescape(this.$route.query.imgSrc);
                }
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
            _getPoints: function (cb) {
                var _this = this;
                this.$api.getPoints({pictureId: this.pictureId}).then(function (res) {
                    window.localStorage.setItem('riskMap_' + _this.pictureId, JSON.stringify(res.data));
                    _this.opts = res.data;
                    _this._afterGetData();
                    if(cb) cb();
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
                this.orgName = this.riskData.data[0].orgName;

                var areas = _.groupBy(this.opts, 'areaId');
                var area = null;

                _.forEach(this.riskData.data, function (item) {
                    if(areas[item.areaId]){
                        area = areas[item.areaId]?areas[item.areaId][0]:null;
                        item.name = item.areaName;
                        item.points = area.points;
                        item.level = _.get(item, 'riskFormulaBean.level', '1');
                    }

                });
                this.updateOpts(this.riskData);
                this.isLoading = false;

            },


            // * 点击事件监听函数
            _click: function (data) {

                if(this.move.isMoving) {
                    return;
                }

                this.modalModel.deptName = data.name;

                this.detailComponent.init({
                    drawOrgId: data.drawOrgId,
                    areaId: data.areaId,
                    compId: data.orgId,
                    staticLevel: data.riskFormulaBean.level,
                    showOrgId: data.areaGroupId,
                    riskType : this.riskType,
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


            // 获取风险评估模型，颜色和文字需要根据返回的结果对应显示
            _getRiskModelByCompId: function() {
                var _this = this;
                api.getRiskModelByCompId({compId: this.$route.query.orgId}).then(function (res) {
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

            // 获取风险评估模型，颜色和文字需要根据返回的结果对应显示
            _queryRiskConfigList: function() {
                var _this = this;
                api.queryRiskConfigList().then(function (res) {
                    if(res.data){
                        var list = _.filter(res.data, function (item) {
                            return item.type == '1';
                        })
                        var gradeLatRanges = list;
                        if (!_.isArray(gradeLatRanges) || _.isEmpty(gradeLatRanges)) {
                            LIB.Msg.error("请先启用一个风险评估模型");
                            return;
                        }
                        var ret = _.map(gradeLatRanges, function (item) {
                            return {
                                id: item.id,
                                level: item.value,
                                label: item.name,
                                color: "#" + item.color
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
                        _this.detailComponent.setParameters(_colors, _names, risks, _this.modalModel.riskPojos);
                        _this._afterGetRiskModel();
                    }

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
                    this.legends = _.toArray(this.$el.querySelectorAll(".sw-risk-overview-legend-item"));
                })
            }
        },

        init: function () {
            this.$api = api;
            this.__auth__ = this.$api.__auth__;
        },
        created: function () {
            this.hasLeaved = true;

            // 这里判断  特殊url参数
            if(this.$route.query.notDefaultTemp){
                if(this.$route.query.pictureId) this.pictureId = this.$route.query.pictureId;
                if(this.$route.query.imgSrc) this.optionObj.imgSrc = unescape(this.$route.query.imgSrc);
            }

            // 获取本地有缓存的风险地图配置项
            if(window.localStorage.getItem("riskMap_" + this.pictureId)) {
                this.opts = JSON.parse(window.localStorage.getItem("riskMap_" + this.pictureId));
            }
            var _this = this;

            if(this.showReturn =='1'){
                 _this.imageURL = _this.optionObj.imgSrc
            }else {
                // 获取背景图片
                api.getMapImage().then(function (res) {
                    _this.imageURL = 'images/risk_map/' + (res.data || 'map.jpg');
                })
            }
        },
        //初始化
        ready: function () {
            this._initMoveParam();
            if(!this.opts) {
                this._getPoints();
            }
            this.isLoading = false;
            this.canvas = this.$els.canvas;

            // this._getStaticRisk();

            this.detailComponent = this.$refs.detailComponent;

            if(this.showReturn == '1'){
                this.staticName = '静态风险';
            }
        },
        attached: function () {
            if(this.$route.query.notDefaultTemp){
                // this.opts = null;
                // this._getPoints();
                var _this = this;
                if(_this.$route.query.pictureId) _this.pictureId = _this.$route.query.pictureId;
                return  new Promise(function(resolve){
                    _this._getPoints(resolve)
                }).then(function () {
                    _this._initMoveParam();
                    if(_this.showReturn == '1') _this._queryRiskConfigList();
                    else _this._getRiskModelByCompId();
                })
                return ;
            }


            this._initMoveParam();
            if(this.showReturn == '1') this._queryRiskConfigList();
            else this._getRiskModelByCompId();
        },
        detached: function () {
            this.hasLeaved = true;
        }
    });
    return home;
});
