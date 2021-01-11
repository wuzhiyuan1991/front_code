define(function(require) {
    require("jscolor");
    var Vue = require("vue");

    var template = require("text!./color.html");

    var opts = {
        template :  template,
        props: {
            // 当前颜色值
            value: {
                type: String,
                required: true
            },
            // 默认颜色
            defaultColor: {
                type: String,
                default: '#000'
            },
            // 禁用状态
            disabled: {
                type: Boolean,
                default: false
            },
            index: {
                type: Number,
                default: 0
            }
        },
        data:function(){
            return {
                // 面板打开状态
                openStatus: false,
                // 鼠标经过的颜色块
                hoveColor: null,
                // 主题颜色
                tColor: [
                    {
                        color: '#fff',
                        name: '白色'
                    },
                    {
                        color: '#000',
                        name: '黑色'
                    },
                    {
                        color: '#e7e6e6',
                        name: '灰色-25%'
                    },
                    {
                        color: '#44546a',
                        name: '蓝灰'
                    },
                    {
                        color: '#4472c4',
                        name: '蓝色'
                    },
                    {
                        color: '#ed7d31',
                        name: '橙色'
                    },
                    {
                        color: '#a5a5a5',
                        name: '灰色-50%'
                    },
                    {
                        color: '#ffc000',
                        name: '金色'
                    },
                    {
                        color: '#5b9bd5',
                        name: '蓝色'
                    },
                    {
                        color: '#70ad47',
                        name: '绿色'
                    }
                ],
                // 颜色面板
                colorConfig: [
                    ['#7f7f7f', '#f2f2f2', '白色'],
                    ['#0c0c0c', '#7f7f7f', '黑色'],
                    ['#171616', '#d0cece', '灰色-25%'],
                    ['#222a35', '#d6dce4', '蓝-灰'],
                    ['#1f3864', '#d9e2f3', '蓝色'],
                    ['#833c0b', '#fbe5d5', '橙色'],
                    ['#525252', '#ffe294', '灰色-50%'],
                    ['#7f6000', '#fff2cb', '金色'],
                    ['#1e4e79', '#deebf6', '蓝色'],
                    ['#375623', '#e2efd9', '绿色']
                ],
                // 标准颜色
                bColor: [
                    {
                        color: '#c21401',
                        name: '深红'
                    },
                    {
                        color: '#ff1e02',
                        name: '红色'
                    },
                    {
                        color: '#ffc12a',
                        name: '橙色'
                    },
                    {
                        color: '#ffff3a',
                        name: '黄色'
                    },
                    {
                        color: '#90cf5b',
                        name: '浅绿'
                    },
                    {
                        color: '#00af57',
                        name: '绿色'
                    },
                    {
                        color: '#00afee',
                        name: '浅蓝'
                    },
                    {
                        color: '#0071be',
                        name: '蓝色'
                    },
                    {
                        color: '#00215f',
                        name: '深蓝'
                    },
                    {
                        color: '#72349d',
                        name: '紫色'
                    }
                ],
                html5Color: this.value
            }
        },
        computed: {
            // 显示面板颜色
            showPanelColor: function () {
                if (this.hoveColor) {
                    return this.hoveColor
                } else {
                    return this.showColor
                }
            },
            // 显示颜色
            showColor: function () {
                if (this.value) {
                    return "#" + this.value
                } else {
                    return this.defaultColor
                }
            },
            // 颜色面板
            colorPanel: function () {
                var colorArr = [], color = null;
                for (var i = 0, len = this.colorConfig.length; i < len; i++) {
                    color = this.colorConfig[i];
                    colorArr.push(this.gradient(color[1], color[0], 5, color[2]))
                }
                return colorArr
            }
        },

        methods: {
            close: function () {
                this.openStatus = false;
                document.removeEventListener('click', this.close);
            },
            open: function (e) {
                var _this = this;
                if(this.openStatus) {
                    return;
                }
                this.openStatus = !this.disabled;
                setTimeout(function () {
                    document.addEventListener('click', _this.close);
                }, 50)

            },
            triggerHtml5Color: function () {
                // this.$refs.html5Color.click()
                var _this = this;
                this.close();
                setTimeout(function () {
                    _this.picker.show();
                }, 50)
            },
            // 更新组件的值 value
            updateValue: function  (value) {
                if(value.indexOf("#") > -1) {
                    value = value.substring(1)
                }
                this.value = value;
                this.$emit('input', value);
                this.$emit('change', value);
                this.openStatus = false;
            },
            // 设置默认颜色
            handleDefaultColor: function  () {
                this.updateValue(this.defaultColor)
            },
            // 格式化 hex 颜色值
            parseColor: function  (hexStr) {
                if (hexStr.length === 4) {
                    hexStr = '#' + hexStr[1] + hexStr[1] + hexStr[2] + hexStr[2] + hexStr[3] + hexStr[3]
                } else {
                    return hexStr
                }
            },
            // RGB 颜色 转 HEX 颜色
            rgbToHex: function  (r, g, b) {
                var hex = ((r << 16) | (g << 8) | b).toString(16);
                return '#' + new Array(Math.abs(hex.length - 7)).join('0') + hex
            },
            // HEX 转 RGB 颜色
            hexToRgb: function  (hex) {
                hex = this.parseColor(hex);
                var rgb = [];
                for (var i = 1; i < 7; i += 2) {
                    rgb.push(parseInt('0x' + hex.slice(i, i + 2)))
                }
                return rgb
            },
            // 计算渐变过渡颜色
            gradient: function  (startColor, endColor, step, name) {
                // 讲 hex 转换为 rgb
                var sColor = this.hexToRgb(startColor);
                var eColor = this.hexToRgb(endColor);
                // 计算R\G\B每一步的差值
                var rStep = (eColor[0] - sColor[0]) / step;
                var gStep = (eColor[1] - sColor[1]) / step;
                var bStep = (eColor[2] - sColor[2]) / step;
                var gradientColorArr = [];
                // 计算每一步的hex值
                for (var i = 0; i < step; i++) {
                    gradientColorArr.push(
                        {
                            color: this.rgbToHex(parseInt(rStep * i + sColor[0]), parseInt(gStep * i + sColor[1]), parseInt(bStep * i + sColor[2])),
                            name: name + ',深色' + 10 * (i + 1) + '%'
                        }
                    )
                }
                return gradientColorArr
            },
            stopPropagation: function (e) {
                e.stopPropagation();
            },
            calcBoxPosition: function () {
                if(this.index > 2) {
                    this.$box.style.bottom = "0";
                } else {
                    this.$box.style.top = "-1px";
                }
            }
        },
        ready:function(){
            // 点击页面上其他地方，关闭弹窗
            var _this = this;
            this.$box = this.$els.box;
            this.calcBoxPosition();
            this.picker = new jscolor(this.$els.jsColor,{
                valueElement:null,
                styleElement:null,
                zIndex:1052,
                closable:true,
                closeText:'关闭',
                value:_this.value,
                showOnClick: false,
                onFineChange : function(){
                    _this.updateValue(this.toString());
                }
            });
        }
    };

    var component = Vue.extend(opts);
    Vue.component('color-picker', component);

    return component;
});