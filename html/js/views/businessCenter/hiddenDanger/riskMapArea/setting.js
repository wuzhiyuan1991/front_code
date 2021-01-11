define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    var RM = require('./helper');
    var template = require("text!./setting.html");
    var dominationAreaSelectModal = require("componentsEx/selectTableModal/dominationAreaSelectModal");


    var home = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
        template: template,
        components: {
            "dominationareaSelectModal":dominationAreaSelectModal
        },
        props: {
            pictureId: {
                type: String,
                default: ''
            }
        },
        data: function () {
            return {
                vo: {
                    areaId: '',
                    orgId: '',
                    drawOrgId: '',
                    areaName: '',
                    dominationAreaIds: [],
                    dominationAreas: []
                },
                showBox: false,
                showAreaModal: false,
                filterData: {orgId: ''},
                dominationAreas: []
            };
        },
        methods: {
            // * 开启或者关闭画布拖动事件
            _toggleMaskMouseMove: function (flag) {
                var _this = this;
                var onMaskMouseMove = _.debounce(function (ev) {
                    var x = ev.offsetX,
                        y = ev.offsetY,
                        ox = x - _this.move.offsetX,
                        oy = y - _this.move.offsetY;
                    var inRect = _this.riskMap.onmousemove(ox, oy);
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
                this.riskMap = new RM(this.canvas, opts, [], this.orgName + '风险地图');
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

                this.riskMap.onclick(ox, oy);

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
                // this.$api.getPoints({pictureId: this.pictureId}).then(function (res) {
                //     _this.opts = res.data;
                //     _this._afterGetData();
                // })
                var params = {
                    code: 'risk_map_setting',
                    lookupitemCode: 'mock_risk_data_level2_001'
                };
                this.$api.getSetting(params).then(function (res) {
                    // 缓存最后需要更新提交的数据
                    _this._cacheUpdateData = res.data;
                    _this.opts = JSON.parse(res.data.content);
                    _this._afterGetData();
                })
            },

            // 处理地图数据后更新画布
            _afterGetData: function () {

                this.orgName = this.opts[0].orgName;

                _.forEach(this.opts, function (item) {
                    item.level = '1';
                    item.name = item.areaName;
                });
                var opts = {
                    data: this.opts
                };
                this.updateOpts(opts);
                this.isLoading = false;

            },


            // * 点击事件监听函数
            _click: function (data) {
                if(this.move.isMoving) {
                    return;
                }
                var _this = this;
                this.vo.dominationAreas = [];
                _.forEach(data.dominationAreaIds, function (item) {
                    _this.vo.dominationAreas.push({
                        id: item,
                        name: _this.areaNamesMap[item]
                    })
                });
                this.vo.areaId = data.areaId;
                this.vo.orgId = data.orgId;
                this.vo.drawOrgId = data.drawOrgId;
                this.vo.areaName = data.name;
                this.vo.dominationAreaIds = data.dominationAreaIds;
                this.showBox = true;
            },

            doShowDominationAreaSelectModal : function() {
                if(!this.vo.drawOrgId) {
                    return LIB.Msg.warning("请先选中所属部门");
                }
                this.filterData = {orgId : this.vo.drawOrgId};
                this.showAreaModal = true;
            },
            doSaveDominationArea: function (data) {
                var _items = _.map(data, function (item) {
                    return {
                        id: item.id,
                        name: item.name
                    }
                });
                this.vo.dominationAreas = this.vo.dominationAreas.concat(_items);
            },
            doSave: function () {
                var _this = this,
                    vo = this.vo;
                var content = JSON.parse(this._cacheUpdateData.content);
                
                _.forEach(content, function (item) {
                    if(item.areaId === vo.areaId){
                        item.areaName = vo.areaName;
                        item.drawOrgId = vo.drawOrgId;
                        item.areaGroupId = vo.drawOrgId;
                        item.dominationAreaIds = _.map(vo.dominationAreas, function (item) {
                            return item.id;
                        });
                        return false;
                    }
                });

                this._cacheUpdateData.content = JSON.stringify(content);
                this.$api.updateSetting(this._cacheUpdateData).then(function () {
                    LIB.Msg.success("保存成功");
                    _this.showBox = false;
                    _this.opts = content;
                    _this._afterGetData();
                });
            },
            doBackToOverview: function () {
                // this.$router.go({path: "/home/riskMapOverview"});
                this.$emit("back");
            }
        },

        init: function () {
            this.$api = api;
            this.__auth__ = this.$api.__auth__;

            var _this = this;
            api.getMapImage().then(function (res) {
                _this.imageURL = 'images/risk_map/' + (res.data || 'map.jpg');
            })
        },
        //初始化
        ready: function () {
            var _this = this;
            this.areaNamesMap = null;
            this._initMoveParam();
            if(!this.opts) {
                this._getPoints();
            }
            this.isLoading = false;
            this.canvas = this.$els.canvas;

            // 获取所有的属地名称，后面需要根据这个来显示属地名称
            api.listAreaNames().then(function (res) {
                _this.areaNamesMap = res.data;
            })
        },
        attached: function () {
            if(this.hasLeaved) {
                this.hasLeaved = false;
            }
        },
        detached: function () {
            this.hasLeaved = true;
        }
    });
    return home;
});
