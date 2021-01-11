define(function (require) {

    var hexToRgb = function(hex) {
        var color = [], rgb = [];

        hex = hex.replace(/#/,"");

        if (hex.length === 3) { // 处理 "#abc" 成 "#aabbcc"
            var tmp = [];
            for (var i = 0; i < 3; i++) {
                tmp.push(hex.charAt(i) + hex.charAt(i));
            }
            hex = tmp.join("");
        }

        for (var i = 0; i < 3; i++) {
            color[i] = "0x" + hex.substr(i * 2, 2);
            rgb.push(parseInt(Number(color[i])));
        }
        return rgb.join(",") + ",";
        // return "rgb(" + rgb.join(",") + ")";
    };
    /**
     * 风险地图
     * @param canvas
     * @param opts
     * @param title
     * @param legends 图例
     * @constructor
     */
    var RM = function (canvas, opts, legends, title, colorMap) {
        this.opts = opts.data;
        this.config = opts.config;
        this.backOpts = opts.data;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.children = []; // 缓存子区域, 用来之后判断事件发生在哪个子区域内
        this._legends = [];
        this.activeChild = null; // 当前活动的子区域
        this._listeners = {}; // 监听事件集合
        this.timer = null;  // 定时器
        this.title = title;
        this.image = null;
        this.legends = legends;
        this.width = 0;
        this.height = 0;

        var ret = {};
        _.forEach(colorMap, function (v, k) {
            ret[k] = hexToRgb(v);
        });
        this.colorMap = ret;
        // this.bindEvent();
    };

    /**
     * 外面点击了图例， 显示或者隐藏某一风险等级的区域
     * @param {Object} obj 
     */
    RM.prototype.onLegendClick = function (obj) {

        var data = _.groupBy(this.backOpts, 'level');
        var opts = [];

        if(obj.include && data[obj.level]) {
            opts = this.opts.concat(data[obj.level]);
        } else {
            opts = _.filter(this.opts, function (item) {  
                return item.level !== obj.level;
            })
        }

        var param = {
            data: opts,
            config: this.config
        };
        this.updateOpts(param);
    }

    // 图例点击事件
    RM.prototype.legendClicked = function (legend) {
        legend.click(this.ctx);

        var data = _.groupBy(this.backOpts, 'level');
        var opts = [];

        _.forEach(this._legends, function (item) {
            if (item.isInclude && data[item.level]) {
                opts = opts.concat(data[item.level]);
            }
        });

        var param = {
            data: opts,
            config: this.config
        };
        this.updateOpts(param);
    };

    /**
     * 绑定事件(mouseover, click), 未使用
     */
    RM.prototype.bindEvent = function () {
        var _this = this;

        // click事件
        this.canvas.addEventListener('click', function (e) {
            var poly = _.find(_this.children, function (item) {
                return item.isIncludePoint(e.offsetX, e.offsetY);
            });

            var legend  =_.find(_this._legends, function (item) {
                return item.isIn(e.offsetX, e.offsetY)
            });

            if(legend) {
                _this.legendClicked(legend);
            }

            if (poly) {
                if (_this._listeners[e.type] instanceof Array) {
                    var listeners = _this._listeners[e.type];
                    for (var i = 0, len = listeners.length; i < len; i++) {
                        listeners[i](poly);
                    }
                }
            }

        }, false);

        this.canvas.addEventListener('mousemove', _.debounce(function (e) {

            // 判断是否在某个区域内
            var poly = _.find(_this.children, function (item) {
                return item.isIncludePoint(e.offsetX, e.offsetY);
            });
            var legend  =_.find(_this._legends, function (item) {
                return item.isIn(e.offsetX, e.offsetY)
            });

            if(legend) {
                _this.canvas.style.cursor = "pointer";
                return;
            }

            // mouse enter
            if (poly) {
                if (_this.activeChild) {
                    _this.activeChild.active = false;
                }
                poly.active = true;

                if (!_this.activeChild || _this.activeChild !== poly) {
                    _this.mouseEnter(poly);
                }
            }

            else {
                if (_this.activeChild) {
                    _this.mouseOut(poly);
                }
            }

            _this.activeChild = poly;
        }, 16.7), false)
    };

    RM.prototype.onclick = function (x, y) {
        var _this = this;
        var poly = _.find(_this.children, function (item) {
            return item.isIncludePoint(x, y);
        });

        // var legend  =_.find(_this._legends, function (item) {
        //     return item.isIn(x, y)
        // });

        // if(legend) {
        //     _this.legendClicked(legend);
        //     return;
        // }

        if (poly) {
            if (_this._listeners['click'] instanceof Array) {
                var listeners = _this._listeners['click'];
                for (var i = 0, len = listeners.length; i < len; i++) {
                    listeners[i](poly);
                }
            }
        }
    };
    

    RM.prototype.onmousemove = function (x, y) {
        var _this = this;
        // 判断是否在某个区域内
        var poly = _.find(_this.children, function (item) {
            return item.isIncludePoint(x, y);
        });
        var legend  =_.find(_this._legends, function (item) {
            return item.isIn(x, y)
        });

        if(legend) {
            return legend;
        }

        // mouse enter
        if (poly) {
            if (_this.activeChild) {
                _this.activeChild.active = false;
            }
            poly.active = true;

            if (!_this.activeChild || _this.activeChild !== poly) {
                _this.mouseEnter(poly);
            }
        }

        else {
            if (_this.activeChild) {
                _this.mouseOut(poly);
            }
        }

        _this.activeChild = poly;
        return poly;
    };

    /**
     * 绑定事件
     * @param type 事件类型
     * @param fn 回调函数
     */
    RM.prototype.addListener = function (type, fn) {
        if (!this._listeners.hasOwnProperty(type)) {
            this._listeners[type] = [];
        }

        this._listeners[type].push(fn);
    };


    /**
     * 鼠标移入某个子区域内
     * @param poly 子区域
     */
    RM.prototype.mouseEnter = function (poly) {
        for (var i = 0, polygon; polygon = this.children[i++];) {
            // polygon.stroke(this.ctx, poly.areaGroupId);
            polygon.stroke(this.ctx, poly.areaId);
        }
        if (this._listeners['mouseenter'] instanceof Array) {
            var listeners = this._listeners['mouseenter'];
            for (var i = 0, len = listeners.length; i < len; i++) {
                listeners[i](poly);
            }
        }

    };

    /**
     * 鼠标移出子区域
     * @param poly 子区域
     */
    RM.prototype.mouseOut = function (poly) {
        this.activeChild.active = false;
        for (var i = 0, polygon; polygon = this.children[i++];) {
            polygon.stroke(this.ctx, -1);
        }
        if (this._listeners['mouseout'] instanceof Array) {
            var listeners = this._listeners['mouseout'];
            for (var i = 0, len = listeners.length; i < len; i++) {
                listeners[i](poly);
            }
        }
    };

    RM.prototype.cacheOpts = function (opts, type) {
        this.cache = {
            opts: opts,
            type: type
        }
    };

    /**
     * 加载图片(未使用: 获取图片后根据图片大小计算canvas的高度)
     * @param imgURL
     */
    RM.prototype.loadImage = function (imgURL) {
        var _this = this;
        var image = new Image();
        image.onload = function () {
            _this.image = image;
            // var width = 1920;
            // var imgWidth = image.width,
            //     imgHeight = image.height;
            // var height = Math.floor(width / imgWidth * imgHeight);
            //
            // _this.canvas.height = height;
            _this.canvas.height = image.height;
            _this.canvas.width = image.width;
            _this.canvas.parentNode.style.height = image.height + 'px';
            _this.canvas.parentNode.style.width = image.width + 'px';

            _this.height = image.height;
            _this.width = image.width;
            _this.afterLoadImage()

        };
        image.src = imgURL;
    };


    RM.prototype.afterLoadImage = function () {
        this.drawConstant();
        this.drawRiskArea();
        if(this.cache) {
            this.updateOpts(this.cache.opts, this.cache.type);
            this.cache = null;
        }
    };

    /**
     * 绘制不变的部分
     */
    RM.prototype.drawConstant = function () {
        this.drawBackgroundImage();
        this.drawText(this.title, 25, this.height - 25);
        // this.drawLegend();
    };

    /**
     * 绘制背景图片
     */
    RM.prototype.drawBackgroundImage = function () {
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
    };


    /**
     * 绘制文字
     * @param text
     * @param x
     * @param y
     * @param color
     * @param font
     */
    RM.prototype.drawText = function (text, x, y, color, font) {
        this.ctx.fillStyle = color || "#fff";
        this.ctx.font = font || "24px serif";
        this.ctx.fillText(text, x, y);
    };

    /**
     * 首次绘制风险区域
     * 绘制后将区域实例保存到children数组中,并且开启定时器
     */
    RM.prototype.drawRiskArea = function () {
        if (this.timer) {
            clearInterval(this.timer);
        }
        var _this = this;
        this.children = [];
        if (!(this.opts instanceof Array)) {
            return;
        }

        for (var i = 0, opt; opt = this.opts[i++];) {
            var polygon = new Polygon(opt, this.colorMap);
            polygon.draw(this.ctx);
            this.children.push(polygon);
        }

        // if(this.config.isTwinkle === '1') {
        //     this.timer = setInterval(function () {
        //         _this.update();
        //     }, 1000);
        // }

    };


    RM.prototype.repaintLegend = function () {
        for (var i = 0, legend; legend = this._legends[i++];) {
            legend.draw(this.ctx);
        }
    };

    /**
     * 绘制图例，绘制在canvas上
     */
    RM.prototype.drawLegend = function () {
        var s = 25,
            opt = null;

        if(this._legends.length === this.legends.length) {
            this.repaintLegend();
            return;
        }
        this._legends = [];
        for (var i = 0, legend; legend = this.legends[i++];) {

            opt = {
                x: s,
                y: 20,
                color: legend.color,
                label: legend.label,
                level: legend.level
            };

            var _legend = new Legend(opt);
            var p = _legend.draw(this.ctx);
            this._legends.push(_legend);
            s += p.x;
        }
    };


    /**
     * 绘制圆角矩形
     * @param x
     * @param y
     * @param width 宽度
     * @param height 高度
     * @param radius 半径
     */
    RM.prototype.drawRoundRectPath = function (x, y, width, height, radius) {

        this.ctx.beginPath();

        this.ctx.moveTo(x, y);

        //从右下角顺时针绘制，弧度从0到1/2PI
        this.ctx.arc(width - radius, height - radius, radius, 0, Math.PI / 2);

        //矩形下边线
        this.ctx.lineTo(radius, height);

        //左下角圆弧，弧度从1/2PI到PI
        this.ctx.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);

        //矩形左边线
        this.ctx.lineTo(0, radius);

        //左上角圆弧，弧度从PI到3/2PI
        this.ctx.arc(radius, radius, radius, Math.PI, Math.PI * 3 / 2);

        //上边线
        this.ctx.lineTo(width - radius, 0);

        //右上角圆弧
        this.ctx.arc(width - radius, radius, radius, Math.PI * 3 / 2, Math.PI * 2);

        //右边线
        this.ctx.lineTo(width, height - radius);
        this.ctx.closePath();
    };

    /**
     * 更新; 清空后重新绘制
     * @param opts
     */
    RM.prototype.update = function () {
        var groupId = '',
            i = 0,
            polygon = null;
        if (this.activeChild) {
            groupId = this.activeChild.areaGroupId;
        }
        this.clear();

        this.drawConstant();

        this.drawRiskArea();

        // for (i = 0, polygon = null; polygon = this.children[i++];) {
        //     polygon.blink(this.ctx);
        // }
        // for (i = 0, polygon = null; polygon = this.children[i++];) {
        //     polygon.stroke(this.ctx, groupId);
        // }
    };

    /**
     * 重大风险和较大风险需要闪烁
     */
    RM.prototype.blink = function () {
        this.clear();

        for (var i = 0, polygon; polygon = this.children[i++];) {
            polygon.blink(this.ctx);
        }
    };

    RM.prototype.clear = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };

    /**
     * 更新配置数据
     * @param opts
     */
    RM.prototype.updateOpts = function (opts, type) {
        if (this.timer) {
            clearInterval(this.timer);
        }
        if(type === "out") {
            this.backOpts = opts.data;
        }
        this.clear();
        this.drawConstant();
        this.children = [];
        this.activeChild = null;
        this.opts = opts.data;
        this.config = opts.config;
        this.drawRiskArea();
    };

    RM.prototype.drawDownloadInfo = function (text) {

        // 右下角时间
        this.ctx.textBaseline = "bottom";
        var now = new Date().Format("yyyy-MM-dd hh:mm:ss");
        this.ctx.font = "24px serif";
        var timeWidth = this.ctx.measureText(now).width;

        this.drawText(now, this.width - timeWidth - 25, 930);

        // 右上角风险类型
        this.ctx.font = "16px serif";
        var w = this.ctx.measureText(text).width;

        this.ctx.beginPath();
        this.ctx.fillStyle = "#33adea";
        this.ctx.fillRect(this.width - w - 65, 20, w + 40, 28);

        this.ctx.textBaseline = "top";
        this.drawText(text, this.width - w - 45, 26, "#fff", "16px serif");
        this.ctx.closePath();
    };

    /**
     * 将canvas下载为图片
     * @param filename
     */
    RM.prototype.download = function (filename, name) {
        var _this = this;
        this.timer && clearInterval(this.timer);

        this.drawDownloadInfo(name);
        this.drawLegend();

        var img = this.canvas.toDataURL('image/jpeg');
        if(img) {
            var downLinkEl = document.createElement('a');
            downLinkEl.href = img;
            downLinkEl.download = filename;
            document.body.appendChild(downLinkEl);
            downLinkEl.click();
            document.body.removeChild(downLinkEl);
        }
        this.update();
        // this.timer = setInterval(function () {
        //     _this.update();
        // }, 1000);
    };

    /**
     * 多边形
     * @param {Object} option {points: [{x, y}, ...], color: '', ...}
     * @constructor
     */
    function Polygon(option, colorMap) {
        for (var k in option) {
            this[k] = option[k];
        }
        this.opacityValue = 0.3; // 透明值
        this.active = false; // 是否是活动对象
        this.colorMap = colorMap;

        _.forEach(this.points, function (item) {
            item.x = parseInt(item.x);
            item.y = parseInt(item.y);
        })
    }

    Polygon.prototype.draw = function (ctx) {
        var font = (this.font && this.font) || {};
        var firstPoint = this.points[0];
        ctx.beginPath();
        ctx.moveTo(firstPoint.x, firstPoint.y);

        for (var j = 1, point; point = this.points[j++];) {
            ctx.lineTo(point.x, point.y);
        }

        ctx.closePath();

        ctx.fillStyle = 'rgba(' + this.colorMap[this.level] + this.opacityValue + ')';
        ctx.fill();

        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = font.fontColor || "#fff";
        ctx.font = font.fontStyle || "900 24px Arial";
        ctx.textAlign = "left";

        var lines = this.name.split('\\n');
        var lineHeight = 30;
        if(font.fontCenter && font.fontCenter=='1'){
            deelFontposition(ctx, this, lines, font.fontStyle || "900 24px Arial");
        } else{
            for (var i = 0; i<lines.length; i++) {
                ctx.fillText(lines[i], firstPoint.x + 15, firstPoint.y - 5 - (lines.length - 1 - i) * lineHeight);
            }
        }

        // ctx.fillText(this.name, firstPoint.x + 15, firstPoint.y - 5);

        ctx.strokeStyle = 'rgba(' + this.colorMap[this.level] + '1)';
        ctx.lineWidth = 3;
        ctx.stroke();

    };

    function deelFontposition(ctx, that, lines, font) {
        var fontSize = parseInt(font.split(' ')[1]) || 16;
        var maxx = _.max( that.points, function (item) {
            return item.x;
        }).x;
        var maxy = _.max( that.points, function (item) {
            return item.y;
        }).y;
        var minx = _.min( that.points, function (item) {
            return item.x;
        }).x;
        var miny = _.min( that.points, function (item) {
            return item.y;
        }).y;
        var width = maxx - minx;
        var height = maxy - miny;
        for (var i = 0; i<lines.length; i++) {
            var ll = lines[i].length;
            var lineArr =  lines[i].split("，");

            var offset = parseInt(width - lines[i].length * fontSize)/2;
            offset = offset>0?offset:0;

            height = height - (lineArr.length - 1)*fontSize;

            for(var j=0; j<lineArr.length; j++){
                var fontSize =fontSize || 12;
                ctx.fillText(lineArr[j],  minx + offset, parseInt(height/2) + miny + 5 + j*fontSize);
            }
        }
    }

    Polygon.prototype.blink = function (ctx) {

        if (this.level === '3' || this.level === '4') {
            this.opacityValue = (this.opacityValue === 0.3 ? 0.5 : 0.3);
        }
        this.draw(ctx);

    };

    /**
     * 绘制线条
     * @param ctx
     * @param groupId
     * @param style
     */
    Polygon.prototype.stroke = function (ctx, areaId) {
        var style = '#fff';
        if (this.areaId !== areaId) {
            style = 'rgba(' + this.colorMap[this.level] + '1)';
        }

        var firstPoint = this.points[0];

        ctx.strokeStyle = style;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(firstPoint.x, firstPoint.y);

        for (var i = 1, point; point = this.points[i++];) {
            ctx.lineTo(point.x, point.y);
        }

        ctx.closePath();

        ctx.stroke();

    };
    /**
     * 判断事件是否发生在区域内
     * 射线法, 选取以需要判断点为起点并与x轴平行的射线
     * @param x
     * @param y
     * @return {boolean}
     */
    Polygon.prototype.isIncludePoint = function (x, y) {

        var isIn = false;

        for (var i = 0, l = this.points.length, j = l - 1; i < l; j = i, i++) {

            var sx = this.points[i].x,
                sy = this.points[i].y,
                tx = this.points[j].x,
                ty = this.points[j].y;

            // 点与多边形顶点重合
            if ((sx === x && sy === y) || (tx === x && ty === y)) {
                return true;
            }

            // 判断线段两端点是否在射线两侧
            if ((sy < y && ty >= y) || (sy >= y && ty < y)) {
                // 线段上与射线 Y 坐标相同的点的 X 坐标
                var px = sx + (y - sy) * (tx - sx) / (ty - sy);

                // 点在多边形的边上
                if (px === x) {
                    return true;
                }

                // 射线穿过多边形的边界
                if (px > x) {
                    isIn = !isIn
                }
            }
        }

        return isIn;
    };


    /**
     * 绘制文字
     * @param text
     * @param x
     * @param y
     * @constructor
     */
    function Text(text, x, y) {
        this.text = text;
        this.x = x;
        this.y = y;
    }

    Text.prototype.draw = function () {

    };


    /**
     * 图例
     * @param option
     * @constructor
     */
    function Legend(option) {
        this.isInclude = true;
        for (var k in option) {
            this[k] = option[k];
        }
        this.width = 0;
        this.height = 14;
        this.p1 = 5;
        this.p2 = 15;
        this.rectWidth = 14; // 方块的长度
        this.bakColor = "#aaa";
    }

    Legend.prototype.click = function (ctx) {
        this.isInclude = !this.isInclude;
        var color = this.color;
        this.color = this.bakColor;
        this.bakColor = color;
        this.draw(ctx);
    };

    Legend.prototype.draw = function (ctx) {

        ctx.textBaseline = "top";

        // 绘制方块
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.rectWidth, this.rectWidth);
        ctx.fillStyle = this.color;
        ctx.fill();

        // 绘制文字
        var x = this.x + this.p1 + this.rectWidth;

        this.drawText(ctx, this.label, x, this.y, '#000', '700 14px serif');

        ctx.closePath();

        this.width = this.p1 + this.rectWidth + ctx.measureText(this.label).width;

        return {
            x: this.width + this.p2,
            y: this.y
        }
    };

    /**
     * 绘制文字
     * @param text
     * @param x
     * @param y
     * @param color
     * @param font
     */
    Legend.prototype.drawText = function (ctx, text, x, y, color, font) {
        ctx.fillStyle = color || "#fff";
        ctx.font = font || "24px serif";
        ctx.fillText(text, x, y);
    };

    /**
     * 判断事件是否在legend内
     * @param x
     * @param y
     * @return {boolean}
     */
    Legend.prototype.isIn = function (x, y) {
        return this.x < x &&
            this.x + this.width > x &&
            this.y < y &&
            this.y + this.height > y;
    };

    return RM;
});
