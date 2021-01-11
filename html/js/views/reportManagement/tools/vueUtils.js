define(function (require) {
    var LIB = require("lib");
    var dateUtils = require("./dateUtils");
    var qryInfoApi = require("./vuex/qryInfoApi");
    var components = {
        'cascader': require('components/cascader/iviewCascader'),
        'obj-select': require("../reportDynamic/dialog/objSelect"),
        'qry-info-edit': require("../reportDynamic/dialog/qryInfoEdit"),
        'check-record-details': require("../reportDynamic/dialog/checkRecordDetails"),
        'echart-component': require("./chartUtils/chartFactory")
    };
    var mixins = {
        components: components,
        data: function () {
            var current = new Date();
            var currYear = current.getFullYear();
            var times = {
                prevWeek: new Date(currYear, current.getMonth(), current.getDate()-7),
                prevMonth: new Date(currYear, current.getMonth()-1),
                prevQuarter: new Date(currYear, current.getMonth()-3),
                prevYear: new Date(currYear-1, current.getMonth())
            };
            return {
                limit: null,
                qryInfoId: null,
                queryInfoType: null,
                datePickModel: {
                    options: {
                        shortcuts: [
                            {
                                text: '本周',
                                value: function () {
                                    //var current = new Date();
                                    return [dateUtils.getWeekFirstDay(current), dateUtils.getWeekLastDay(current)];
                                }
                            },
                            {
                                text: '本月',
                                value: function () {
                                    //var current = new Date();
                                    return [dateUtils.getMonthFirstDay(current), dateUtils.getMonthLastDay(current)];
                                }
                            },
                            {
                                text: '本季度',
                                value: function () {
                                    //var current = new Date();
                                    return [dateUtils.getQuarterFirstDay(current), dateUtils.getQuarterLastDay(current)];
                                }
                            },
                            {
                                text: '本年',
                                value: function () {
                                    //var current = new Date();
                                    return [dateUtils.getYearFirstDay(current), dateUtils.getYearLastDay(current)];
                                }
                            },
                            {text: '上周',value: function() {return [dateUtils.getWeekFirstDay(times.prevWeek), dateUtils.getWeekLastDay(times.prevWeek)];}},
                            {text: '上月',value: function() {return [dateUtils.getMonthFirstDay(times.prevMonth), dateUtils.getMonthLastDay(times.prevMonth)];}},
                            {text: '上季度',value: function() {return [dateUtils.getQuarterFirstDay(times.prevQuarter), dateUtils.getQuarterLastDay(times.prevQuarter)];}},
                            {text: '去年',value: function() {return [dateUtils.getYearFirstDay(times.prevYear), dateUtils.getYearLastDay(times.prevYear)];}}
                        ]
                    }
                }
            };
        },
        computed: {
            qryInfoDetails: function () {
                //清空数据判断类型
                if (typeof(this.qryParam.dateRange) == "object" && this.qryParam.dateRange[0] !== null) {
                    var dateRange = this.qryParam.dateRange;
                    var items = _.extend([], this.qryParam.item);
                    var qryParam = _.omit(this.qryParam, "dateRange", "objRange", "item");
                    if (dateRange.length == 2) {
                        qryParam.beginDate = dateRange[0].Format("yyyy-MM-dd hh:mm:ss");
                        qryParam.endDate = dateRange[1].Format("yyyy-MM-dd hh:mm:ss");
                    }
                    var objs = "";
                    _.each(this.qryParam.objRange, function (obj, i) {
                        if (i > 0) {
                            objs = objs.concat(",");
                        }
                        objs = objs.concat(obj.key);
                    });
                    //对象范围
                    qryParam.objRange = objs;
                    //统计项目
                    qryParam.item = items.shift();
                    qryParam.indicators = items.join("-");
                    return qryParam;
                } else {
                    return {};
                }
            },
        },
        methods: {
            setHomeOfCover: function (node, formData) {
                var _this = this;
                LIB.Modal.confirm({
                    title: '首页报表已配置满额，是否覆盖之前的配置?',
                    onOk: function () {
                        qryInfoApi.setHomeOfCover(null, formData).then(function () {
                            _this.loadQryInfoList();
                            LIB.Msg.info("操作成功");
                        });
                    }
                });
            },
            loadQryInfoList: function () {
            },
            setHome: function (type, node) {
                var _this = this;
                var data = node;
                var currentStar = !data.star;
                //var limitNum = 3;
                //if(currentStar && starNum >= limitNum){
                //	LIB.Msg.error("首页报表已配置满额（最多"+limitNum+"个）");
                //	return;
                //}
                var formData = {
                    type: type,
                    schemeId: data.id
                };
                LIB.Modal.confirm({
                    title: currentStar ? '配置到报表首页?' : '取消报表首页配置?',
                    onOk: function () {
                        //qryInfoApi.setHome({id:data.id},currentStar).then(function(){
                        //	data.star = currentStar;
                        //	LIB.Msg.info("操作成功");
                        //});
                        qryInfoApi.setHomeOfCommon({state: currentStar}, formData).then(function (res) {
                            if (res.data) {
                                _this.loadQryInfoList();
                                LIB.Msg.info("操作成功");
                            } else {//配置数量已达上限，是否覆盖配置
                                //需要延迟执行，不然嵌套的提示框组件会被一起关闭
                                setTimeout(function () {
                                    _this.setHomeOfCover(node, formData);
                                }, 500);
                            }
                        });
                    }
                });
            },
            doTreeDel: function (node) {
                var treeData = this.qryModel.list;
                LIB.Modal.confirm({
                    title: '删除当前数据?',
                    onOk: function () {
                        qryInfoApi.delByIds(null, [node.data.id]).then(function () {
                            var i = _.findIndex(treeData, function (d) {
                                return d.id === node.data.id;
                            });
                            treeData.splice(i, 1);
                            LIB.Msg.info("删除成功");
                        });
                    }
                });
            },
            loadQryParam: function (qryInfo) {
                var data = _.propertyOf(qryInfo)("data");
                var details = _.propertyOf(data)("details");
                if (undefined === details) {
                    return;
                }
                this.qryInfoId = data.id;
                var _this = this;
                qryInfoApi.get({id: data.id}).then(function (res) {
                    var d = res.data;
                    _this.queryInfoType = d.type;
                    var param = _.clone(d.details);
                    _this.title = d.name;
                    var qryParam = _this.qryParam;

                    var item = [];
                    item.push(param.item);
                    if (param.indicators) {
                        item = item.concat(param.indicators.split("-"));
                    }
                    qryParam.item = item;
                    //统计方法
                    qryParam.method = param.method;

                    if("containRandomData" in param) {
                        qryParam.containRandomData = param.containRandomData === '1';
                    }
                    if("containResignedData" in param) {
                        qryParam.containResignedData = param.containResignedData === '1';
                    }
                    _this.$nextTick(function () {
                        qryParam.typeOfRange = param.typeOfRange;
                        var beginDate = (param.beginDate).replace(/-/g, "/");
                        var endDate = (param.endDate).replace(/-/g, "/");
                        qryParam.dateRange = [new Date(beginDate), new Date(endDate)];
                        _this.$nextTick(function () {
                            if (!_.isNull(param.objRange) && "" != _.trim(param.objRange)) {
                                qryParam.objRange = JSON.parse(param.objRange);
                            } else {
                                qryParam.objRange = [];
                            }
                            //查询绝对值
                            _this._doQry();
                        });
                    });
                });

            },
            changeMethod: function (val) {
                this.qryParam.method = val;
            },
            doQry: function () {
                this.changeMethod(null);
                this._doQry();
            },
            _doQry: function () {
                var _this = this;
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        var qryParam = _.deepExtend({}, _this.qryParam);
                        var chartComp = _this.$refs.echart;
                        chartComp.doQry(qryParam);
                    }
                });
            }
        }
    }
    return mixins;
});