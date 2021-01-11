define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    var template = require("text!./main.html");

    var opts = [
        // {
        //     point: {"x" : 732, "y" : 822},
        //     name: '中化云龙',
        //     areaId: 'C01',
        //     color: '#f00'
        // },
        // {
        //     point: {"x" : 1000, "y" : 700},
        //     name: '中化智胜',
        //     areaId: 'C02',
        //     color: '#f90'
        // },
        // {
        //     point: {"x" : 1200, "y" : 120},
        //     areaId: 'C03',
        //     color: '#f90',
        //     pictureId: "1212"
        // }
    ];

    var dataModel = {
        riskPojos: [
            {

                riskLabel: "重大",
                riskColor: "#FF0000"
            },
            {

                riskLabel: "较大",
                riskColor: "#FF9900"
            },
            {

                riskLabel: "一般",
                riskColor: "#FFFF00"
            },
            {

                riskLabel: "低",
                riskColor: "#0033CC"
            }
        ]
    };


    //首页效果
    var component = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
        template: template,
        components: {},
        props:{
            pojos:{
                type:Array,
                default:null
            },
            mapType:{
                type:String,
                default:null
            },
            list:{
                type:Array,
                default:null
            },
            pic:{
                type:String,
                default:null
            }

        },
        data: function () {
            return dataModel;
        },
        methods: {
            colorClick:function (item) {
                if(!item.risk){
                    item.risk = 1;
                    if(!item.oldColor){
                        item.oldColor = item.color;
                    }
                    item.color ="#ddd"
                }else{
                    item.risk = 0;
                    item.color = item.oldColor;
                }
                this.$emit("color-click", this.pojos)
            },
            refreshData:function () {
                _.each(this.pojos, function (item) {
                   if(item.oldColor) item.color =  item.oldColor;
                   item.risk = 0;
                });
              this.$emit("refresh-data");
            },
            _loadImage: function () {
                var _this = this;

                $(".sw-risk-overview-b").remove();

                var ctx = this.canvas.getContext('2d');
                var image = new Image();
                image.onload = function () {
                    ctx.drawImage(image, 0, 0, _this.canvas.width, _this.canvas.height);
                    _this.draw();
                    // _this.bindEvent();
                };
                if(this.pic){
                    // image.src = "images/risk_map/overview.jpg";
                    image.src = LIB.ctxPath(this.pic);
                    // image.src = "http://fstrq.demo.safeye.com.cn/get/uploads/2019-12-11/finy3seplb.jpg"
                }else{
                    image.src = "images/risk_map/overview.jpg";
                }


                var border =  _this.$els.container;
                this.$nextTick(function (item) {
                    _this.$els.box.style.transform = "translate3d(" +(0-parseInt((1920-border.clientWidth)/2))+ "px," + (0-parseInt((1080-border.clientHeight)/2)) + "px, 0)";

                })

            },
            renderPictureLegend: function (item) {
                return {
                    'background': item.riskColor
                }
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
                        _this.$emit("go", inRect.nextPictureId,'', inRect);
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

            _drawTextType1: function (opt, x, y) {
                var top = y,
                    left = x ;

                // 创建显示文字的box
                var box = document.createElement("div"),
                    text = document.createElement("div");

                box.className = "sw-risk-overview-b";
                text.className = "sw-risk-overview-t";

                box.style.padding = '3px'
                text.style.background = 'none';
                text.style.fontSize = '15px';
                text.style.padding='0';
                text.style.fontWeight='600';
                // if(opt.riskLevel == 2 || opt.riskLevel == 4 || opt.riskLevel == 5) text.style.color = "#fff";
                box.style.top = top + "px";
                box.style.left = left + "px";
                box.style.backgroundColor = "#" + opt.riskFormulaBean.riskColor;
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
                box.style.backgroundColor = "#" + opt.riskFormulaBean.riskColor;
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

                var x = opt.point.x - width / 2,width, height
                    y = opt.point.y - height;

                opt.x = x;
                opt.y = y;
                opt.width = width;
                opt.height = height;
                if(this.mapType == 1){
                    this._drawTextType1(opt, x, y);
                    var img = '';
                    if(opt.riskLevel>0){
                        img = document.getElementById("icon"+opt.riskLevel);
                        if(opt.coordinatePoint){
                            var px=opt.coordinatePoint.x, py=opt.coordinatePoint.y;
                            this.ctx.drawImage(img, px-15, py-30, 30, 30);
                        }
                    }
                }else{
                    this.ctx.drawImage(this.markImage, x, y, width, height);
                    this._drawText(opt, x, y)
                }

            },
            getDataByList:function () {
                var _this = this;
                _.forEach(this.list, function (item) {
                    item.point = {
                        x: parseInt(item.points[0].x),
                        y: parseInt(item.points[0].y)
                    };

                    // 标记的坐标
                    if(item.points[1]){
                        item.coordinatePoint = {
                            x: parseInt(item.points[1].x),
                            y: parseInt(item.points[1].y)
                        };
                    }

                    // item.name = _this.getDataDic("org", item.orgId).orgName;
                });
                _this.opts = this.list;
                _this._loadImage();
            },
            getData: function () {
                var _this = this;
                this.$api.get().then(function (res) {
                    _.forEach(res.data, function (item) {
                        item.point = {
                            x: parseInt(item.points[0].x),
                            y: parseInt(item.points[0].y)
                        };
                        item.name = _this.getDataDic("org", item.orgId).csn;
                    });
                    _this.opts = res.data;
                    _this._loadImage();
                })
            },
            onBoxClick: function (ev) {
                var target = ev.target;

                if (target.classList.contains("sw-risk-overview-b") ||
                    target.parentNode.classList.contains("sw-risk-overview-b")) {
                    // this.$router.go({path: '/home/riskMap', query: {pictureId: target.dataset.nextPictureId}});
                    this.$emit("go", target.dataset.nextPictureId, '',target.dataset);
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

                var border = this.$els.container;

                var cStyle = getComputedStyle(this.$container, null),
                    bStyle = getComputedStyle(this.$box, null);

                this.move = {
                    isMoving: false, // 是否拖动标志位
                    offsetX: 0-parseInt((1920-border.clientWidth)/2), // x轴偏移量 以左上角为原点
                    offsetY: 0-parseInt((1080-border.clientHeight)/2), // y轴偏移量 以左上角为原点
                    maxOffsetX: parseInt(cStyle.width) - parseInt(bStyle.width), // x轴最大偏移量
                    maxOffsetY: parseInt(cStyle.height) - parseInt(bStyle.height), // y轴最大偏移量
                    // maxOffsetY:-250,
                    px: 0, // 鼠标当前x坐标
                    py: 0  // 鼠标当前y坐标
                };
                // if(this.mapType == 1){
                //     this.move.offsetX = -parseInt((this.move.maxOffsetX)/2);
                //     this.move.offsetY = -parseInt((this.move.maxOffsetY)/2);
                //     this.findRect(this.move.offsetX, this.move.offsetY);
                // }

            },
            onMaskClick: function (ev) {
                var x = ev.offsetX,
                    y = ev.offsetY,
                    ox = x - this.move.offsetX,
                    oy = y - this.move.offsetY;

                var inRect = this.findRect(ox, oy);
                if (inRect && inRect.nextPictureId) {
                    // _this.$router.go({path: '/home/riskMap', query: {pictureId: inRect.nextPictureId}});
                    this.$emit("go", inRect.nextPictureId, inRect.orgId, inRect);
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
            }
        },
        watch: {
              list:function (val) {
                  if(val && val.length>0){
                      this.getDataByList();
                  }
              }
        },
        //初始化
        ready: function () {
            this.canvas = this.$els.canvas;
            this.ctx = this.canvas.getContext('2d');
            if(this.mapType){
                // this.getDataByList();
                this.markImage = null;
                this._initMoveParam();
            }else{
                this.getData();
                this.markImage = null;
                this._initMoveParam();
            }
        },
        init: function () {
            this.$api = api;
            this.__auth__ = this.$api.__auth__;
        }
    });
    return component;
});
