define(function (require) {
    var LIB = require('lib');
    var api = require("./riskMapArea/vuex/api");
    var RM = require('./riskMapArea/helper');
    var template = require("text!./main-xbgd.html");

    var initRiskType = 'dynamic';
    var now = new Date().Format("yyyy-MM-dd hh:mm:ss");

    var dataModel = {
        riskType: 'static', // 切换静、动态风险
        modalModel: {
            deptName: '',
            riskPojos: null
        },
        w:0, //主界面宽度
        btnsStyle:'',
        oldLevel:[],
        tableModel: {
            visible: false,
            list: [],
            cureList:[],
            state: 'all',
            levelList: [],
            columns:[
                {
                    //作业分类
                    title: "作业分类",
                    fieldName: "operationType",
                    render: function (data) {
                        if (data.iraRiskJudgmentOptypeVos) {
                            return _.pluck(data.iraRiskJudgmentOptypeVos, "name").join("、")
                        }
                    },
                },
                {
                    //作业名称
                    title: "作业名称",
                    fieldName: "operationName",
                },
                {
                    title: "作业区域",
                    fieldName: "dominationAreaName",
                    fieldType: "custom",
                    render: function (data) {
                        if (data.dominationAreas) {
                            return _.pluck(data.dominationAreas, "name").join("、")
                        }
                    }
                },
                {
                    title: "风险等级",
                    fieldName: "riskLevel",
                    render: function (data) {
                        if (data.riskLevel) {
                            var resultColor = LIB.getDataDic("risk_level_result_color", data.riskLevel);
                            return "<span style='background:" + resultColor + ";color:" + resultColor + ";margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" + LIB.getDataDic("risk_level_result", data.riskLevel);
                        } else {
                            return "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" + "无";
                        }

                    },
                },
                {
                    //作业开始时间
                    title: "作业开始时间",
                    fieldName: "operationStartDate",
                    render: function (data) {
                        return LIB.formatYMD(data.operationStartDate);
                    }
                },
                {
                    //作业结束时间
                    title: "作业结束时间",
                    fieldName: "operationEndDate",
                    render: function (data) {
                        return LIB.formatYMD(data.operationEndDate);
                    }
                },
                {
                    title: "存在风险",
                    fieldName: "content",
                },
                {
                    title: "控制措施",
                    fieldName: "controls",
                },
                {
                    //状态0-待执行；1-已结束
                    title: "状态",
                    fieldName: "status",
                    render: function (data) {
                        if(data.operationStartDate != null && data.operationEndDate != null && data.status != null){
                            if (data.status == 0 && data.operationStartDate < now && data.operationEndDate > now) {
                                data.status = 1;//执行中
                            }
                            if (data.operationEndDate < now) {
                                data.status = 2;//已结束
                            }
                        }
                        return LIB.getDataDic("ira_risk_judgm_status",data.status);
                    },
                },
            ]
        },
        tableModel2:{
            levelList:[],
            list:[],
            cureList:[],
            columns: [
                {
                    //设备编号
                    title: '设备编号',
                    fieldName: "code",
                    width: 160
                },
                {
                    //设备设施名称
                    title: '设备设施名称',
                    fieldName: "name",
                    width: 200
                },
                {
                    //工艺编号
                    title: "工艺编号",
                    fieldName: "technicsNo",
                    width: 200
                },
                {
                    title: "设备类型",
                    fieldName: "equipmentType.name",
                    width: 160,
                    'renderClass': "textarea",
                    render: function (data) {
                        if(data && data.equipmentType){
                            if(data.equipmentType.attr4){
                                return data.equipmentType.attr4;
                            }else {
                                return data.equipmentType.name
                            }
                        }else{
                            return "";
                        }
                    },
                },
                {
                    title: "风险等级",
                    fieldName: "riskLevel",
                    render: function (data) {
                        if (data.color) {
                            return "<span style='background:" + data.color + ";color:" + data.color + ";margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" + data.label;
                        } else {
                            return "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" + "无";
                        }
                    },
                },
                _.extend(_.clone(LIB.tableMgr.column.company),{ filterType: null}) ,
                _.extend(_.clone(LIB.tableMgr.column.dept),{ filterType: null}) ,
                {
                    title: "属地",
                    fieldName: "dominationArea.name",
                    filterName: "criteria.strValue.dominationAreaName",
                    filterType: "text"
                },
                // {
                //     title: this.$t("bd.hal.equipmentNumber"),
                //     fieldName: "version",
                //     filterType: "text",
                //     width: 160
                // },
                // {
                //     title: "负责人",
                //     fieldName: "user.username",
                //     filterType: "text",
                //     filterName: "criteria.strValue.userName",
                //     width: 100
                // },
                {
                    //设备登记日期
                    title: "设备登记日期",
                    fieldName: "createDate",
                    width: 180
                },
                /*LIB.tableMgr.column.company,
                LIB.tableMgr.column.dept,*/

                /*{
                    //是否禁用 0启用，1禁用
                    //title: "是否禁用",
                    title: this.$t("gb.common.state"),
                    fieldName: "disable",
                    filterType: "enum",
                    filterName: "criteria.intsValue.disable"
                },*/
                // {
                //     //保修期(月)
                //     title: "保修期(月)",
                //     fieldName: "warranty",
                //     width: 120
                // },
                // {
                //     //报废日期
                //     title: "报废日期",
                //     fieldName: "retirementDate",
                // },
                {
                    //设备设施状态 0再用,1停用,2报废
                    title: "设备状态",
                    fieldName: "state",
                    render: function (data) {
                        return LIB.getDataDic("stateData",data.state);
                    },
                    width: 100
                },
                {
                    //设备设施状态 0再用,1停用,2报废
                    title: "ABC分级",
                    fieldName: "level",
                    width: 100
                },
                {
                    //设备设施状态 0再用,1停用,2报废
                    title: "专业",
                    fieldName: "speciality",
                    width: 100
                },
                /*{
                    //保修终止日期 根据保修期自动算出
                    title: "保修终止日期",
                    fieldName: "warrantyPeriod",
                    filterType: "date"
                },*/
//					{
//						//设备更新日期
//						title: "设备更新日期",
//						fieldName: "modifyDate",
//						filterType: "date"
//					},
            ]
        },
    };


    //首页效果
    var home = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
        template: template,

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
            orgName:{
                type:String,
                default:''
            },
            orgId:{
                type:String,
                default:''
            },
            imgSrc:{
                type:String,
                default:''
            },
            conf:{
                type: Object,
                default: null
            },
            maxValue:{
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

            _getDynamicData: function () {
                var _this = this;
                this.getSetting();
                return;

            },
            doChangeMode: function (t) {
                var text;
                if (t === 'static') {
                    // this._getStaticRisk();
                    this._getPoints();
                } else {
                    this._getDominationAreas(this.drawOrgId)
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

                var cw = this.$els.container.offsetWidth;
                var iw =this.$els.imgOne.offsetWidth;
                if(this.$els.imgOne.offsetWidth){
                    if(cw>iw){
                        this.btnsStyle = 'left:' + (iw-250) + 'px';
                    }else{
                        this.btnsStyle = 'right:' + 50 + 'px';
                    }
                }

                // 线条粗细 文字大小 配置
                RM.prototype.fontStyle = {
                    "fontSize": "18",
                    "fontWeight": 600,
                    "lineWidth": 1,
                    "fontColor": "#F7F7F7",
                    "labelSize": 22,
                    "labelColor": "#fff",
                    "labelWeight": 600,
                    "opacity": 0.6
                }
                if(this.orgName){
                    var deptName = this.orgName;
                }

                this.riskMap = new RM(this.canvas, opts, this.modalModel.riskPojos, ' ', this.riskColorMap);
                var image = this.imageURL || 'images/risk_map/map.jpg';
                // var image = 'images/risk_map/map.jpg';
                this.riskMap.loadImage(image);
                this.riskMap.addListener('click', this._click);

                this._toggleMaskMouseMove(true);
            },

            getLevelColor: function (item) {
                var resultColor = LIB.getDataDic("risk_level_result_color", item.id);
                if(item.checked){
                    return {
                        'background': resultColor
                    }
                }
                else{
                    return {'background': "#ddd"}
                }

            },
            getLevelColor2: function (item) {
                var resultColor = item.color;

                if(item.checked){
                    return {
                        // 'background': "#"+resultColor
                        'background': ""+resultColor
                    }
                }
                else{
                    return {'background': "#ddd"}
                }

            },
            changelevelList: function (item) {
                item.checked = !item.checked;
                this.deelRiskLevel();
            },
            changelevelList2: function (item) {
                item.checked = !item.checked;
                this.deelRiskLevel2();
            },
            deelRiskLevel: function () {
                var _this = this;
                this.tableModel.cureList = this.tableModel.list;
                var arr =  this.tableModel.cureList;

                var levelList =this.tableModel.levelList;
              _.each(levelList, function (item) {
                  if(!item.checked){
                      arr = _.reject(arr, function (opt) {
                          return opt.riskLevel == item.id;
                      });
                  }
              });
                this.tableModel.cureList = [];
                this.$nextTick(function () {
                    _this.tableModel.cureList = arr;
                })
            },

            deelRiskLevel2: function () {
                var _this = this;
                this.tableModel2.cureList = this.tableModel2.list;
                var arr =  this.tableModel2.cureList;
                arr = [];
                var levelList =this.tableModel2.levelList;
                _.each(levelList, function (item) {
                    if(item.checked && _this.tableModel2.list[item.id]){
                        _.each(_this.tableModel2.list[item.id], function (opt) {
                            _.extend(opt,{color:item.color,label: item.value})
                        });
                        arr = arr.concat(_this.tableModel2.list[item.id])
                    }
                });
                this.tableModel2.cureList = [];
                this.$nextTick(function () {
                    _this.tableModel2.cureList = arr;
                })
            },

            getLevelNum2: function (opt) {
                // var list = _.filter(this.tableModel.list, function (item) {
                //     return item.riskLevel == opt.id;
                // }) || [];
                var list = this.tableModel2.list[opt.id];
                if(list)
                    return list.length ;
                return '0';
            },

            getLevelNum: function (opt) {
                var list = _.filter(this.tableModel.list, function (item) {
                    return item.riskLevel == opt.id;
                }) || [];
                return list.length;
            },

            // * 点击事件监听函数
            _click: function (data) {
                var _this = this;
                if(this.riskType === 'static'){
                    api.riskstaticxbgd({ids: data.dominationAreaIds.join(",")}).then(function (res) {
                        _this.tableModel2.list = res.data;
                        // var levelList = Object.keys(res.data || {});
                        // _this.tableModel2.levelList = _.map(levelList, function (item) {
                        //     if(item){
                        //         var color = item.split('/');
                        //     }
                        //     if(color)
                        //     return {id: item, value: color[0], checked:true, color: color[1]}
                        // });
                        _this.tableModel2.levelList = _.map(_this.modalModel.riskPojos, function (item) {
                            return {id: item.level, value: item.label, checked:true, color: item.color}
                        });

                        _this.deelRiskLevel2();
                        _this.tableModel.visible = true;
                    })
                }else{
                    api.riskdynamicxbgd({ids: data.dominationAreaIds.join(",")}).then(function (res) {
                        _this.tableModel.list = res.data;
                        _this.tableModel.cureList = _this.tableModel.list;

                        var levelList = LIB.getDataDicList("risk_level_result")
                        _this.tableModel.levelList = _.map(levelList, function (item) {
                            return {id: item.id, value: item.value, checked:true}
                        });
                        _this.deelRiskLevel();
                        _this.tableModel.visible = true;

                    })
                }

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
                // 西部管道切换了接口
api.getNewStaticRisk().then(function (res) {
    var arr = res.data;
    var arrNew=[],opdataarr=[];
    _.each( arr,function (area)  {
        opdataarr.push({
            areaId: area.areaId,
            points: area.points,
            name:  area.orgName?area.orgName:'',
            isNotClick:area.isNotClick,
            level: area.riskFormulaBean && area.riskFormulaBean.level,
            areaGroupId:area.areaGroupId,
            dominationAreaIds: area.dominationAreaIds
        });
        arrNew.push({
            areaId: area.areaId,
            points: area.points,
            name:  area.orgName?area.orgName:'',
            isNotClick:area.isNotClick,
            level: area.riskFormulaBean && area.riskFormulaBean.level,
            areaGroupId:area.areaGroupId,
            dominationAreaIds: area.dominationAreaIds
        });
    });
    _this.riskData = {};
    _this.opts = arrNew;
    _this.riskData.data = opdataarr;
    _this._afterGetData();
});
                return ;
                api.getSetting(params).then(function (res) {
                    // LIB.Msg.success("动态风险刷新成功，数据生成时间：" + new Date().Format("yyyy-MM-dd hh:mm:ss"));
                    LIB.Msg.success('已经切换为静态风险');

                    var index = 0;

                    var arrNew = [];
                    var opdataarr = [];
                    var arr = JSON.parse(res.data.content);

                    _.each( arr,function (area)  {
                        arrNew.push({
                            areaId: area.areaId,
                            points: area.points,
                            name:  area.orgName?area.orgName:'',
                            level: area.level?area.level:'1',
                            isNotClick:area.isNotClick,
                            areaGroupId:area.areaGroupId,
                            dominationAreaIds: area.dominationAreaIds
                        });
                        opdataarr.push({
                            areaId: area.areaId,
                            points: area.points,
                            name:  area.orgName?area.orgName:'',
                            isNotClick:area.isNotClick,
                            level: area.level?area.level:'1',
                            areaGroupId:area.areaGroupId,
                            dominationAreaIds: area.dominationAreaIds
                        })
                    });
                    _this.riskData = {};
                    _this.opts = arrNew;
                    _this.riskData.data = opdataarr;
                    _this._afterGetData();
                    // _this._afterGetData();
                });
            },

            // 获取静态风险数据
            _getStaticRisk: function () {
                var _this = this;
                this.isLoading = true;
                this.$api.getStaticSetting({pictureId: this.pictureId, drawOrgId:this.drawOrgId}).then(function (res) {
                    var data = res.data;
                    _.each(_this.opts, function (item) {
                        var obj =  _.find(data,function (dataItem) {
                            return item.areaId == dataItem.dominationAreaId;
                        })
                        if(obj){
                            item.level = obj.level;
                        }
                    });
                    LIB.Msg.success("已经切换为固有风险");
                    // _this.riskData = res.data;
                    _this._afterGetData();
                })
            },

            // 处理地图数据后更新画布
            _afterGetData: function () {
                var _this = this;
                if(!this.opts || !this.riskData) {
                    return;
                }
                var area = null;

                _.forEach(this.riskData.data, function (item, index) {
                    var obj = _.find(_this.opts, function (opt) {
                        return  opt.areaId == item.areaId;
                    });
                    if(obj && item){
                        area = item.areaId;
                        item.name = item.name;
                        item.points = item.points;
                        item.level = isLarge(item.level, obj.level);
                        // item.level = item.level;
                    }else if (item){
                        area = item.areaId;
                        item.name = item.name;
                        item.points = item.points;
                        item.level = item.level;
                    }

                });

                this.updateOpts(this.riskData);
                this.isLoading = false;

                function isLarge(val1, val2) {
                    if(!val2 && !val1) return 1;
                    if(!val2 && val1) return val1;
                    if(!val1 && val2) return val2;
                    if(val1 && val2) {
                        if(val1 > val2) return val1;
                        else return val2;
                    }
                }
            },

            getRiskFormulaBeanLevel: function (item) {
                if(item.riskFormulaBean && item.riskFormulaBean.level>=0){
                    return parseInt(item.riskFormulaBean.level);
                }else{
                    return 1;
                }
            },

            _getDominationAreas: function (orgId, areaId) {
                var _this = this;
                api.getDominationLookUp().then(function (res) {
                    LIB.Msg.info("已经切换为动态风险")
                    var arr = res.data;
                    var arrNew=[],opdataarr=[];
                    _.each( arr,function (area)  {
                        opdataarr.push({
                            areaId: area.areaId,
                            points: area.points,
                            name:  area.orgName?area.orgName:'',
                            isNotClick:area.isNotClick,
                            // level: _this.getRiskFormulaBeanLevel(area),
                            level: parseInt(area.riskFormulaBean && area.riskFormulaBean.level),
                            areaGroupId:area.areaGroupId,
                            dominationAreaIds: area.dominationAreaIds
                        })
                    });
                    _this.riskData = {};
                    _this.riskData.data = opdataarr;
                    _this.$nextTick()
                    _this._afterGetData();
                });
            },
            renderPictureLegend: function (color) {
                return {
                    'background': color
                }
            },

            // 获取风险评估模型，颜色和文字需要根据返回的结果对应显示
            _getRiskModelByCompId: function() {
                var _this = this;
                var _names = {};
                var _colors = {};
                var params = {
                    code: 'risk_map_setting',
                    lookupitemCode: 'mock_risk_data_level_label'
                };
                api.getSetting(params).then(function (res) {
                    var gradeLatRanges = JSON.parse(res.data.content);
                    if (!_.isArray(gradeLatRanges) || _.isEmpty(gradeLatRanges)) {
                        LIB.Msg.error("请先启用一个风险评估模型");
                        return;
                    }
                    var ret = _.map(gradeLatRanges, function (item) {
                        return {
                            level: item.level,
                            label: item.content,
                            color: "#" + item.color
                        }
                    });
                    _this.modalModel.riskPojos = ret;

                    _.each(ret, function (item) {
                        _names[item.level] = item.label;
                        _colors[item.level] = item.color;
                    });
                    _this.riskNames = _names;
                    _this.riskColorMap = _colors;

                    return ;
                })
            },
        },

        init: function () {
            this.$api = api;
            this.__auth__ = this.$api.__auth__;
        },
        created: function () {
            var _this = this;
            // this.imageURL = 'images/risk_map/fstrq_risk_map.jpg';
            this.imageURL =  this.imgSrc?(LIB.ctxPath(this.imgSrc))  : 'images/risk_map/xbgd_ymsyz_risk_map_l.jpg';

            this.hasLeaved = true;
        },
        //初始化
        ready: function () {
            var o = document.getElementById("riskMap");
            this.w = o.clientWidth||o.offsetWidth;
            this._initMoveParam();

            this.isLoading = false;
            this.canvas = this.$els.canvas;
        },
        attached: function () {
            var _this = this;
            // this._getRiskModelByCompId()
            this._getRiskModelByCompId();
            this.riskType = 'static';
            setTimeout(function () {
                _this._getPoints();
            },150)
        },
        detached: function () {
            this.hasLeaved = true;
        }
    });
    return home;
});
