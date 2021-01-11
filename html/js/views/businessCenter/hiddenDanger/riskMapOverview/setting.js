define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    var template = require("text!./setting.html");


    //首页效果
    var component = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
        template: template,
        components: {},
        data: function () {
            return {
                showBox: false,
                vo: {
                    orgId: '',
                    x: '',
                    y: '',
                    nextPictureId: ''
                }
            };
        },
        methods: {
            _loadImage: function () {
                var _this = this;
                var ctx = this.canvas.getContext('2d');
                var image = new Image();
                image.onload = function () {
                    ctx.drawImage(image, 0, 0, _this.canvas.width, _this.canvas.height);
                    _this.draw();
                    // _this.bindEvent();
                };
                image.src = "images/risk_map/overview.jpg";
            },
            draw: function () {
                var _this = this;
                if (!this.markImage) {
                    this.markImage = new Image();
                    this.markImage.onload = function () {
                        _this.draw();
                    };
                    this.markImage.src = "images/risk_map/mark.png";
                    return;
                }
                for (var i = 0, opt; opt = this.opts[i++];) {
                    this._drawMark(opt);
                }
                this._toggleMaskMouseMove(true);
            },
            bindEvent: function () {
                var _this = this;
                this.canvas.addEventListener('click', function (e) {
                    var inRect = _this.findRect(e.offsetX, e.offsetY);
                    if (inRect && inRect.nextPictureId) {
                        // _this.$router.go({path: '/home/riskMap', query: {pictureId: inRect.nextPictureId}});
                        _this.$emit("go", inRect.nextPictureId);
                    }
                }, false);

                this.canvas.addEventListener('mousemove', _.debounce(function (e) {

                    if(_this.move.isMoving) {
                        return;
                    }

                    var inRect = _this.findRect(e.offsetX, e.offsetY);
                    if (inRect) {
                        _this.canvas.style.cursor = "pointer";
                        inRect.box.style.borderColor = "#fff";
                    } else {
                        _this.canvas.style.cursor = "default";
                    }
                }, 10), false)
            },

            /**
             * 是否在标注图标内
             * @param x
             * @param y
             */
            findRect: function (x, y) {
                _.forEach(this.opts, function (item) {
                    item.box.style.borderColor = "transparent";
                });

                return _.find(this.opts, function (item) {
                    return ((item.x < x) &&
                        (item.x + item.width + 10 > x) &&
                        (item.y < y) &&
                        (item.y + item.height > y)) ||
                        ((item.tx < x) &&
                            (item.tx + item.tw > x) &&
                            (item.ty < y) &&
                            (item.ty + item.th > y));
                })
            },
            _drawText: function (opt, x, y) {

                // this.ctx.fillStyle = "#fff";
                // this.ctx.font = "900 38px 'Microsoft YaHei'";
                // var width = this.ctx.measureText(opt.name).width;
                //
                // opt.tx = x - width / 2;
                // opt.ty = y - 15;
                // opt.tw = width;
                // opt.th = 40;
                //
                // this.ctx.fillText(opt.name, x - width / 2, y - 15);
                //
                // this.ctx.lineWidth = 2;
                // this.ctx.strokeStyle = "#000";
                // this.ctx.strokeText(opt.name, x - width / 2, y - 15);

                // 40:比box高度大一点的一个值; 5:偏移值
                var top = y,
                    left = x + 35;

                // 创建显示文字的box
                var box = document.createElement("div"),
                    text = document.createElement("div");

                box.className = "sw-risk-overview-b";
                text.className = "sw-risk-overview-t";
                box.style.top = top + "px";
                box.style.left = left + "px";
                box.style.backgroundColor = "#fff";
                text.innerText = opt.name;

                box.dataset.nextPictureId = opt.nextPictureId;
                text.dataset.nextPictureId = opt.nextPictureId;

                box.appendChild(text);
                this.$els.box.appendChild(box);

                opt.tx = left;
                opt.ty = top;
                opt.th = 36;
                opt.tw = parseInt(getComputedStyle(box).width);

                opt.box = box;
            },
            /**
             * 绘制坐标标记
             * @param opt
             * @private
             */
            _drawMark: function (opt) {

                // 计算坐标, 确保mark图片的最下端在给定的坐标点上
                var width = this.markImage.width,
                    height = this.markImage.height;

                var x = opt.point.x - width / 2,
                    y = opt.point.y - height;

                opt.x = x;
                opt.y = y;
                opt.width = width;
                opt.height = height;

                this.ctx.drawImage(this.markImage, x, y, width, height);

                this._drawText(opt, x, y)
            },
            getData: function () {
                var _this = this;
                var params = {
                    code: 'risk_map_setting',
                    lookupitemCode: 'mock_risk_data_level1'
                };
                this.$api.getSetting(params).then(function (res) {

                    _this.updateData = res.data;
                    var setting = JSON.parse(res.data.content);

                    _.forEach(setting, function (item) {
                        item.point = {
                            x: parseInt(item.points[0].x),
                            y: parseInt(item.points[0].y)
                        };
                        item.name = _this.getDataDic("org", item.orgId).csn;
                    });

                    _this.opts = setting;
                    _this._loadImage();
                })
            },
            onBoxClick: function (ev) {
                var target = ev.target;

                if (target.classList.contains("sw-risk-overview-b") ||
                    target.parentNode.classList.contains("sw-risk-overview-b")) {
                    // this.$router.go({path: '/home/riskMap', query: {pictureId: target.dataset.nextPictureId}});
                    // this.$emit("go", target.dataset.nextPictureId);
                }
            },
            onmousedown: function (ev) {
                // 记录鼠标按下的坐标
                this.move.px = ev.offsetX;
                this.move.py = ev.offsetY;
                var _this = this;
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

                var onmouseup = function () {
                    _this.move.isMoving = false;
                    document.removeEventListener('mouseup', onmouseup);
                    _this.$mask.removeEventListener('mousemove', onmousemove);
                };
                _this.$mask.addEventListener('mousemove', onmousemove, false);
                document.addEventListener('mouseup', onmouseup, false);
                ev.preventDefault();
            },
            _initMoveParam: function () {
                this.$container = this.$els.container;
                this.$box = this.$els.box;
                this.$mask = this.$els.mask;
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
            onMaskClick: function (ev) {
                var x = ev.offsetX,
                    y = ev.offsetY,
                    ox = x - this.move.offsetX,
                    oy = y - this.move.offsetY;

                var inRect = this.findRect(ox, oy);

                if (inRect && inRect.nextPictureId) {
                    this.showBox = true;
                    this.vo.orgId = inRect.orgId;
                    this.vo.x = inRect.point.x;
                    this.vo.y = inRect.point.y;
                    this.vo.nextPictureId = inRect.nextPictureId;
                    // _this.$router.go({path: '/home/riskMap', query: {pictureId: inRect.nextPictureId}});
                    // this.$emit("go", inRect.nextPictureId);
                }
            },
            onMaskMouseMove: function (ev) {

            },
            _toggleMaskMouseMove: function (flag) {
                var _this = this;
                var onMaskMouseMove = _.debounce(function (ev) {
                    var x = ev.offsetX,
                        y = ev.offsetY,
                        ox = x - _this.move.offsetX,
                        oy = y - _this.move.offsetY;
                    var inRect = _this.findRect(ox, oy);
                    if (inRect) {
                        _this.$mask.style.cursor = "pointer";
                        inRect.box.style.borderColor = "#fff";
                    } else {
                        _this.$mask.style.cursor = "default";
                    }
                }, 10);

                if(flag) {
                    this.$mask.addEventListener('mousemove', onMaskMouseMove, false)
                } else {
                    this.$mask.removeEventListener('mousemove', onMaskMouseMove, false)
                }
            },
            _updateOpts: function () {
                var vo = this.vo;
                var _this = this;

                // 清空canvas
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

                // 清空文字
                var ds = this.$el.querySelectorAll(".sw-risk-overview-b");
                _.forEach(ds, function (el) {
                    _this.$els.box.removeChild(el)
                });

                _.find(this.opts, function (item) {
                    if(item.nextPictureId === vo.nextPictureId) {
                        item.point.x = vo.x;
                        item.point.y = vo.y;
                        item.orgId = vo.orgId;
                        item.name = _this.getDataDic("org", vo.orgId).csn;
                        return true;
                    }
                });
                this._loadImage();
            },
            doSave: function () {
                var content = JSON.parse(this.updateData.content);

                var _this = this;

                _.forEach(content, function (item) {
                    if(item.nextPictureId === _this.vo.nextPictureId) {
                        item.orgId = _this.vo.orgId;
                        item.drawOrgId = _this.vo.orgId;
                        item.orgName = _this.getDataDic("org", _this.vo.orgId).compName;
                        item.points[0].x = _this.vo.x;
                        item.points[0].y = _this.vo.y;
                    }
                });
                this.updateData.content = JSON.stringify(content);

                this.$api.updateSetting(this.updateData).then(function () {
                    _this.showBox = false;
                    _this._updateOpts();
                })

                // 将公司信息写入详情配置中
                this._updateOrgInfo();
            },
            _updateOrgInfo: function(){
                var _this = this;
                var params = {
                    code: 'risk_map_setting',
                    lookupitemCode: 'mock_risk_data_level2_001'
                };
                this.$api.getSetting(params).then(function (res) {
                    var data = res.data;
                    var content = JSON.parse(data.content);
                    _.forEach(content, function (item) {
                        item.orgId = _this.vo.orgId;
                        item.orgName = _this.getDataDic("org", _this.vo.orgId).compName;
                        item.drawOrgId = '';
                        item.areaGroupId = '';
                        item.dominationAreaIds = [];
                    })
                    data.content = JSON.stringify(content);

                    // 前端请求有请求频率限制,后端接口有调用频率限制, 延迟1秒, 防止请求未发出
                    setTimeout(function () {
                        _this._saveOrgInfo(data);
                    }, 1000)
                })
            },
            _saveOrgInfo: function (data) {
                this.$api.updateSetting(data).then(function () {
                    LIB.Msg.success("保存成功");
                })
            },
            doGoTo: function () {
                this.$emit("go", this.vo.nextPictureId);
            }
        },
        //初始化
        ready: function () {
            this.canvas = this.$els.canvas;
            this.ctx = this.canvas.getContext('2d');
            this.getData();
            this.markImage = null;
            this._initMoveParam();
        },
        init: function () {
            this.$api = api;
            this.__auth__ = this.$api.__auth__;
        }
    });
    return component;
});
