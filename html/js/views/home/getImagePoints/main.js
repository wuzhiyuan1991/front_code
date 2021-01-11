define(function (require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    var api = require("../vuex/api");
    var dominationAreaSelectModal = require("componentsEx/selectTableModal/dominationAreaSelectModal");

    function Point(x, y) {
        this.x = x;
        this.y = y;
        this.i = Point.index++;
        this.el = this._createDiv();
    }
    Point.index = 0;
    Point.prototype._createDiv = function () {
        var div = document.createElement("div");
        div.classList.add("risk-point-div");
        div.style.left = this.x - 5 + "px";
        div.style.top = this.y - 5 + "px";
        return div;
    };

    var newVO = function () {
        return {
            pictureId: '',
            areaId: '',
            areaName: '',
            drawOrgId: '',
            areaGroupId: '',
            orgId: '',
            orgName: '',
            dominationAreaIds: '',
            points: ''
        }
    };
    //首页效果
    var component = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic],
        template: template,
        components: {
            dominationareaSelectModal: dominationAreaSelectModal
        },
        data: function () {
            return {
                showResultBox: false,
                vo: newVO(),
                stringResult: '',
                dominationAreaSelectModel: {
                    visible: false,
                    filterData: {orgId: null}
                },
                dominationArea: {id: '', name: ''},
                showUseInfo: false,
                endResultString: '',
                showResultModal: false
            }
        },
        computed: {
            pointsString: function () {
                if (_.isArray(this.vo.points)) {
                    return JSON.stringify(this.vo.points);
                }
                return '';
            },
            dominationAreaIdsString: function () {
                if (_.isArray(this.vo.dominationAreaIds)) {
                    return JSON.stringify(this.vo.dominationAreaIds);
                }
                return '';
            }
        },

        methods: {
            doShowDominationAreaSelectModal: function () {
                if(!this.vo.drawOrgId) {
                    return LIB.Msg.warning("请先选中所属部门");
                }
                this.dominationAreaSelectModel.filterData = {orgId: this.vo.drawOrgId};
                this.dominationAreaSelectModel.visible = true;
            },
            doSaveDominationArea: function (selectedDatas) {
                var item = selectedDatas[0];
                this.dominationArea = item;
                this.vo.areaGroupId = item.id;
                this.vo.dominationAreaIds = [item.id];
                window.changeMarkObj.hasDominationAreaChanged = true;
            },
            onmousedown: function (ev) {
                if (!ev.shiftKey)  {
                    return true;
                }
                var cache = this.moveCache;
                var _this = this;
                // 记录鼠标按下的坐标
                cache.px = ev.offsetX;
                cache.py = ev.offsetY;
                this.mouseDownX = ev.offsetX;
                this.mouseDownY = ev.offsetY;

                var onmousemove = _.throttle(function(ev) {
                    cache.isMoving = true;
                    var ox = ev.offsetX - cache.px,
                        oy = ev.offsetY - cache.py;

                    cache.offsetX += ox;
                    cache.offsetY += oy;

                    // 判断边界
                    if(cache.offsetX > 0) {
                        cache.offsetX = 0;
                    }
                    if(cache.offsetY > 0) {
                        cache.offsetY = 0;
                    }
                    if(cache.offsetX < cache.maxOffsetX) {
                        cache.offsetX = cache.maxOffsetX;
                    }
                    if(cache.offsetY < cache.maxOffsetY) {
                        cache.offsetY = cache.maxOffsetY;
                    }
                    _this.boxEl.style.transform = "translate3d(" + cache.offsetX + "px," + cache.offsetY + "px, 0)";

                    cache.px = ev.offsetX;
                    cache.py = ev.offsetY;
                }, 30);

                var onmouseup = function (ev) {
                    _this.mouseUpX = ev.offsetX;
                    _this.mouseUpY = ev.offsetY;

                    _this.maskEl.removeEventListener('mouseup', onmouseup);
                    _this.maskEl.removeEventListener('mousemove', onmousemove);
                };
                _this.maskEl.addEventListener('mousemove', onmousemove, false);
                _this.maskEl.addEventListener('mouseup', onmouseup, false);
                ev.preventDefault();
            },
            onMaskClick: function (ev) {
                if (this.moveCache.isMoving) {
                    this.moveCache.isMoving = false;
                    return;
                }

                var el = ev.target;
                if (el.classList.contains("risk-point-div")) {
                    if (ev.ctrlKey) {
                        this._editArea(el);
                    } else {
                        this._beginMovePoint(el);
                    }
                }
                if (!this.drawing) {
                    return;
                }
                var x = ev.offsetX - this.moveCache.offsetX;
                var y = ev.offsetY - this.moveCache.offsetY;

                var point = new Point(ev.offsetX, ev.offsetY);
                this.maskEl.appendChild(point.el);

                this.points.push(point);

                if (this.isFirstPoint) {
                    this.ctx.moveTo(x, y);
                    this.isFirstPoint = false;
                } else {
                    this.ctx.lineTo(x, y);
                    this.ctx.stroke();
                }
            },
            _editArea: function (el) {
                var area = _.find(this.areaCache, function (area) {
                    return _.some(area.points, "el", el)
                });

                this.vo = area;
                this.showResultBox = true;
            },
            _pointMoveListener: function (e) {
                var keyCode = e.keyCode;
                var point = this.movingPoint;
                if (!point) {
                    return;
                }
                if (!_.includes([37, 38, 39, 40], keyCode)) {
                    document.removeEventListener("keydown", this._pointMoveListener);
                    return;
                }
                if (keyCode === 38) { // up
                    point.y -= 1;
                } else if (keyCode === 40) { // down
                    point.y += 1;
                } else if (keyCode === 37) { // left
                    point.x -= 1;
                } else if (keyCode === 39) { // right
                    point.x += 1;
                }
                point.el.style.left = point.x - 5 + "px";
                point.el.style.top = point.y - 5 + "px";
                this._reDraw();
            },
            _beginMovePoint: function (el) {
                if (this.drawing) {
                    return;
                }
                var point;
                _.forEach(this.areaCache, function (area) {
                    point =  _.find(area.points, "el", el);
                    if (point) {
                        return false;
                    }
                });
                if (!point) {
                    return;
                }
                this.movingPoint = point;
                document.addEventListener("keydown", this._pointMoveListener)
            },

            _reDraw: function () {
                var ctx = this.ctx;
                var points = this.points;
                var offsetX = this.moveCache.offsetX,
                    offsetY = this.moveCache.offsetY;
                // this.drawEnd();
                this.ctx.clearRect(0, 0, this.imageWidth, this.imageHeight);
                this.ctx.drawImage(this.image, 0, 0, this.imageWidth, this.imageHeight);

                _.forEach(this.areaCache, function (item) {
                    var points = item.points;
                    ctx.beginPath();
                    ctx.moveTo(points[0].x - offsetX, points[0].y - offsetY);
                    for (var i = 1; i < points.length; i++) {
                        ctx.lineTo(points[i].x - offsetX, points[i].y - offsetY)
                    }
                    ctx.closePath();
                    ctx.stroke();
                });

            },
            _renderImage: function (src) {
                var image = new Image();
                var _this = this;
                image.onload = function () {
                    var height = image.height;
                    var width  = image.width;
                    _this.canvasEl.height = height;
                    _this.canvasEl.width = width;
                    _this.canvasEl.parentNode.style.height = height + 'px';
                    _this.canvasEl.parentNode.style.width = width + 'px';
                    _this.imageHeight = height;
                    _this.imageWidth = width;
                    _this.ctx.drawImage(image, 0, 0, width, height);
                    _this.image = image;
                    var cStyle = getComputedStyle(_this.containerEl, null),
                        bStyle = getComputedStyle(_this.boxEl, null);
                    _this.moveCache.maxOffsetX = Math.min(0, parseInt(cStyle.width) - parseInt(bStyle.width)); // x轴最大偏移量
                    _this.moveCache.maxOffsetY = Math.min(0, parseInt(cStyle.height) - parseInt(bStyle.height)); // y轴最大偏移量
                };
                image.src = src;
            },
            drawStart: function () {
                if (this.drawing) {
                    return;
                }
                // this.drawClear();
                this.ctx.beginPath();
                this.ctx.lineWidth = 3;
                this.ctx.lineJoin = "round";
                this.isFirstPoint = true; // 是否是当前区域的第一个点
                this.drawing = true; // 是否在描点
                this.points = []; // 当前区域描点数据
                Point.index = 0;

                if (this.currentArea) {
                    this.currentArea = _.extend({}, newVO(), this.currentArea);
                    this.currentArea.points = null;
                } else {
                    this.currentArea = newVO(); // 上一个区域数据
                }

            },
            drawEnd: function (e) {
                e && e.stopPropagation();
                this.ctx.closePath();
                this.ctx.stroke();
                this.drawing = false;
                this.currentArea.points = this.points;
                this.areaCache.push(this.currentArea);
            },
            drawClear: function () {
                this.areaCache = [];
                this.points = null;
                this.maskEl.innerHTML = '';
                this.drawing = false;
                this.ctx.clearRect(0, 0, this.imageWidth, this.imageHeight);
                this.ctx.drawImage(this.image, 0, 0, this.imageWidth, this.imageHeight);
            },
            output: function () {
                // this.stringResult = '';
                var offsetX = this.moveCache.offsetX,
                    offsetY = this.moveCache.offsetY;
                // var ps = _.map(this.points, function (item) {
                //     return {
                //         x: item.x - offsetX,
                //         y: item.y - offsetY
                //     }
                // });
                // this.showResultBox = true;
                // this.vo.points = ps;

                var res = _.map(this.areaCache, function (area) {
                    var points = _.map(area.points, function (point) {
                        return {
                            x: point.x - offsetX,
                            y: point.y - offsetY
                        }
                    });
                    return _.extend({}, area, {points: points})
                });
                this.showResultModal = true;
                this.endResultString = JSON.stringify(res);
            },
            doSave: function () {
                this.vo.orgName = this.getDataDic('org', this.vo.orgId)['compName'];
                this.stringResult = JSON.stringify(this.vo);
            },
            howToUse: function () {
                this.showUseInfo = true;
            }
        },
        ready: function () {
            var _this = this;
            this.canvasEl = this.$els.canvas;
            this.maskEl = this.$els.mask;
            this.ctx = this.canvasEl.getContext('2d');
            this.containerEl = this.$els.container;
            this.boxEl = this.$els.box;
            this.moveCache = {
                isMoving: false, // 是否拖动标志位
                offsetX: 0, // x轴偏移量 以左上角为原点
                offsetY: 0, // y轴偏移量 以左上角为原点
                maxOffsetX: 0, // x轴最大偏移量
                maxOffsetY: 0, // y轴最大偏移量
                px: 0, // 鼠标当前x坐标
                py: 0  // 鼠标当前y坐标
            };
            this.areaCache = []; // 缓存多个区域数据
            // var params = {
            //     code: 'risk_map_setting',
            //     lookupitemCode: 'mock_risk_data_level2_001'
            // };
            var params = {
                code: 'risk_map_setting',
                lookupitemCode: 'mock_risk_data_level2_001'
            };
            // _this._renderImage('images/risk_map/fstrq_risk_map.jpg');
            // return;
            api.getSetting(params).then(function (res) {
                var data = res.data;
                _this._renderImage(data.value);
            });
        }
    });
    return component;
});
