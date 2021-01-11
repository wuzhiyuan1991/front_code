define(function (require) {
    require("http://api.map.baidu.com/getscript?v=3.0&ak=ZjeNT2GfetESSxg3ynE0pmRmWn730NGp&services=&t=20190123102315");

    var LIB = require('lib');
    var template = require("text!./main.html");

    var centerPoint = new BMap.Point(113.271368,23.136106);
    var boundaryName = '广东省';
    var boundaryNames = [
        '广州市',
        '佛山市',
        // '东莞市',
        // '潮州市',
        // '惠州市',
        '清远市',
        // '云浮市',
        // '中山市',
        // '汕头市',
        // '肇庆市',
        // '江门市',
        // '珠海市',
        '韶关市',
        // '开平市',
        // '阳江市',
        // '揭阳市'
    ];
    //首页效果
    var component = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic],
        template: template,
        data: function () {
            return {
                result: [],
                showResultModal: false,
                mapZoomLevel: 0
            }
        },
        computed: {
            resultString: function () {
                return JSON.stringify(this.result);
            }
        },
        methods: {
            clear: function () {
                this.result = [];
                this.polygons = [];
                this.map.clearOverlays();
                this._fillBoundary();
            },
            generatePolygon: function () {
                var cp = this.map.getCenter();
                var zoom = this.mapZoomLevel;
                var offset = zoom > 12 ? 0.001 * (20 - zoom) : 0.03 * (20 - zoom),
                    lat = cp.lat,
                    lng = cp.lng;
                var polygon = new BMap.Polygon(
                    [
                        new BMap.Point(lng - offset, lat - offset),
                        new BMap.Point(lng + offset, lat - offset),
                        new BMap.Point(lng + offset, lat + offset),
                        new BMap.Point(lng - offset, lat + offset)
                    ],
                    {
                        strokeColor:"blue",
                        strokeWeight:2,
                        strokeOpacity:0.5
                    }
                );  //创建多边形
                this.map.addOverlay(polygon);   //增加多边形
                polygon.enableEditing();
                this.polygons.push(polygon);
            },
            showResult: function () {
                this.result = [];
                for (var i = 0, p; p = this.polygons[i++];) {
                    this._getPoints(p.getPath());
                }
                this.showResultModal = true;
            },
            _getPoints: function (points) {
                var result = [];
                _.forEach(points, function (point) {
                    result.push([point.lng, point.lat].join(","))
                });
                this.result.push(result.join(";"));
            },
            _init: function () {
                var _this = this;
                // 百度地图API功能
                var map = new BMap.Map("allmap", {minZoom: 8, maxZoom: 19, enableMapClick: false });    // 创建Map实例
                map.centerAndZoom(centerPoint, 9);  // 初始化地图,设置中心点坐标和地图级别
                map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放

                this.mapZoomLevel = 9;
                this.map = map;
                // this._getBoundaries();
                this.polygons = [];
                this.result = [];
                map.addEventListener("zoomend", function() {
                    _this.mapZoomLevel = map.getZoom();
                });
                for(var i = 0; i < boundaryNames.length; i++) {
                    this._getBoundaries(boundaryNames[i]);
                }
            },
            _getBoundaries: function (boundaryName) {
                var _this = this;
                var boundary = new BMap.Boundary();
                this.boundaries = null;
                boundary.get(boundaryName, function(rs) {
                    _this.boundaries = rs.boundaries;
                    _this._fillBoundary();
                });
            },
            getRandomColor: function(){
                return (function(m,s,c){
                    return (c ? arguments.callee(m,s,c-1) : '#') +
                        s[m.floor(m.random() * 16)]
                })(Math,'0123456789abcdef',5)
            },
            _fillBoundary: function () {
                if (!this.boundaries) {
                    return;
                }
                var count = this.boundaries.length; //行政区域的点有多少个
                if (count === 0) {
                    return ;
                }
                var color = this.getRandomColor();
                for (var i = 0; i < count; i++) {
                    var ply = new BMap.Polygon(
                        this.boundaries[i],
                        {
                            strokeWeight: 1,
                            strokeColor: "#000",
                            fillColor: color,
                            fillOpacity: 0.3
                        }
                    ); //建立多边形覆盖物
                    this.map.addOverlay(ply);  //添加覆盖物
                }
            }
        },
        ready: function () {
            this._init();
        }
    });
    return component;
});
