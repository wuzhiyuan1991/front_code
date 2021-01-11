define(function (require) {
    var LIB = require('lib');
    var template = require("text!./main-fs.html");
    var riskArea = require("./riskMapArea/main");
    var overView = require('./riskMapOverview/main')

    var dominationAreaNames = ["官窑调压站","乐平调压站","杏坛门站","沙口调压站","罗村调压站","名城LNG储配站","西樵调压站","狮山调压站",
        "西南调压站","西线阀室","新城调压站","北滘调压站","桂城调压站","大良调压站","芦苞门站","西江调压站"];

    var that = null;

    //首页效果
    var component = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic],
        template: template,
        components: {
            riskArea:riskArea,
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
                conf:null, // 配置二级图  文字大小粗细
                orgId:null,
                orgName:null,
            }
        },
        methods: {
            go:function (obj) {
                var _this = this;
                if(obj.isClick){
                    this.drawOrgId = obj.drawOrgId;
                    this.picId = obj.pictureId;
                    this.imgSrc = obj.imgSrc;
                    this.compId = obj.compId;
                    this.conf = obj.conf;
                    this.orgId = obj.orgId;
                    this.orgName = obj.name;
                    setTimeout(function () {
                        _this.showPicMap = !_this.showPicMap;
                    },200)

                }
            }
        },
        init:function () {
        }

    });
    return component;
});
