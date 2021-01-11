define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    var circleLoading = new LIB.Msg.circleLoading();
    function tabHead() {
        return {
            riskLevel: {
                count: 0,
                list: [
                    { count: 0 },
                    { count: 0 },
                    { count: 0 },
                    { count: 0 },
                    { count: 0 }
                ]
            },
            contral: {
                count: 0,
                list: [
                    { count: 0 },
                    { count: 0 },
                    { count: 0 },
                ]
            },
            standard: {
                count: 0,
                list: [
                    { count: 0 },
                    { count: 0 },
                    { count: 0 },
                ]
            },
            hiddenDangerType: {
                count: 0
            },
            hiddenDangerLevel: {
                count: 0
            },
            emergencyPlan: {
                count: 0
            }
        };
    }

    var initDataModel = function () {
        return {
            showLoading: false,
            titleList: [],
            checkedPointIndex: '',
            lists: [],
            newList: [],

            searchVo: {
                checkObjType: '',
                compId: '',
                riskPoint: '',
            },
            checkObjTypeList: [],
            defaultOpenLayer: 2,
            searchInfoList: {},
            complist: [],
            domlist: [],
            typelist: [],
            pointlist: [],
            obj: {},
            id: {},
            tabHead: {
                riskLevel: {
                    count: 0,
                    list: [
                        { count: 0 },
                        { count: 0 },
                        { count: 0 },
                        { count: 0 },
                        { count: 0 }
                    ]
                },
                contral: {
                    count: 0,
                    list: [
                        { count: 0 },
                        { count: 0 },
                        { count: 0 },
                    ]
                },
                standard: {
                    count: 0,
                    list: [
                        { count: 0 },
                        { count: 0 },
                        { count: 0 },
                    ]
                },
                hiddenDangerType: {
                    count: 0
                },
                hiddenDangerLevel: {
                    count: 0
                },
                emergencyPlan: {
                    count: 0
                }
            }
        }
    };

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.LIB_BASE.getDataDicList],
        template: tpl,
        data: initDataModel,
        components: {

        },
        computed: {
            pointlistLength: function () {
                return pointlist.length || 0;
            }
        },
        watch: {
            "searchVo.compId": function (val) {

                this.doCompChange(val);
            },
            id: function (val) {
                if (!val) {
                    this.pointlist = [];
                    this.searchVo.riskPoint = '';
                }
            }
        },
        methods: {
            getClass: function (index) {
                if (index == this.checkedPointIndex) {
                    return 'leftPointLi-active'
                }
                return 'leftPointLi';
            },
            getStyle: function (item) {
                return "color:#000;background:#" + item.resultColor;
            },
            itemType: function (val) {
                if (val == 0) {
                    return "否";
                }
                return "是";
            },

            emergencyPlan: function (data) {
                if (data) {
                    return "应急措施方案"
                }
                return '';
            },

            getDicRiskLevel: function (data) {
                return LIB.getDataDic("risk_type", data);
                return;
            },
            getDicRiskType: function (data) {
                return LIB.getDataDic("hidden_danger_type", data);
            },
            doImport: function () {
                this.importProgress.show = true;
            },
            getCheckRiskTypeList: function () {
                this.checkObjTypeList = LIB.getDataDicList('check_obj_risk_type');
            },
            getCheckRiskType: function (data) {
                return LIB.getDataDic("check_obj_risk_type", data);
            },
            getRowspan: function (items) {
                var length = 0;

                return length;
            },
            getPointRowspan: function (items) {
                var length = 0;
                _.each(items, function (item) {
                    length += item.length;
                })
                return length;
            },
            getDimension: function (item, index) {
                if (item) {
                    var obj = item;
                    if (obj.gradeLatScores) {
                        if (obj.gradeLatScores[index]) {
                            return obj.gradeLatScores[index].score;
                        }
                    }
                    return '';
                }
                return '';
            },
            getAllScore: function (item) {
                if (item) {
                    var obj = item;
                    var score = 0;
                    var plus = 0;
                    if (item.formula.indexOf("*") != -1) {
                        plus = 1;
                        score = 1;
                    }
                    if (obj.gradeLatScores) {
                        for (var i = 0; i < obj.gradeLatScores.length; i++) {
                            if (obj.gradeLatScores[i]) {
                                if (plus == 1) {
                                    score = score * parseFloat(obj.gradeLatScores[i].score) || 1;
                                } else {
                                    score += parseFloat(obj.gradeLatScores[i].score) || 1;
                                }

                            }
                        }
                    }
                    return score.toFixed(1);
                }
                return 0;
            },
            doPointSelect: function (val, index) {
                circleLoading.show();
                this.searchVo.riskPoint = val;
                this.checkedPointIndex = index;
                this.doSearch();
            },

            getGradeList: function (id) {
                var _this = this;
                var params = {
                    "riskModel.id": id,
                    deleteFlag: 0
                }
                api.riskModelGradeList(params).then(function (res) {
                    _this.titleList = res.data;
                })
            },

            getAllScroceCount: function (item) {
                var score = 0;
                var  plus = 0
                if (item.riskModelObj && item.riskModelObj.gradeLatScores) {
                    if(item.riskModelObj.formula.indexOf("*")!=-1){
                        plus = 1;
                        score=1;
                    }
                    for (var j = 0; j < item.riskModelObj.gradeLatScores.length; j++) {
                        if (item.riskModelObj.gradeLatScores[j]) {
                            if(plus==1){
                                score =score * parseFloat(item.riskModelObj.gradeLatScores[j].score);
                            }else{
                                score+= parseFloat(item.riskModelObj.gradeLatScores[j].score);
                            }
                        }
                    }
                }
                return score;
            },

            doSearch: function (callback) {
                var _this = this;
                var item = {};
                var riskModel = null;

                // if(!this.id){
                //     LIB.Msg.error("请选择属地");
                //     return;
                // }
                if (!this.searchVo.compId) {
                    LIB.Msg.error("请选择公司");
                    return;
                }

                if (this.searchVo.riskPoint == '') {
                    this.checkedPointIndex = -1;
                }

                _.each(_this.domlist, function (items) {
                    if (items.id == _this.id) {
                        item = items;
                    }
                });
                var param = {
                    checkObjType: _this.searchVo.checkObjType,
                    compId: _this.searchVo.compId,
                    dominationAreaId: item.id,
                    riskPoint: _this.searchVo.riskPoint,
                    size: 5001
                };
                this.newList = [];
                $('#risktbody').html('')
                //LIB.globalLoader.show();
                api.queryRiskList(param).then(function (res) {
                    //LIB.globalLoader.hide();
                    var list = res.data;
                    _this.tabHead = tabHead();
                    var templist = list;
                    if (templist && templist.length > 5000) {
                        LIB.Msg.info('加载数据过多，只能加载前5000条数据', 10);
                        templist.pop();
                    }

                    // 初始化
                    var domIndex = 0, typeArrIndex = 0, pointArrIndex = 0, topScoreIndex = 0, levelIndex = 0;
                    if (templist[0]) {
                        templist[0].dominationAreaObj = { name: templist[0].dominationArea.name, rowspan: 1 };
                        templist[0].checkObjTypeObj = { name: templist[0].checkObjType, rowspan: 1 };
                        templist[0].riskPointObj = { name: templist[0].riskPoint, rowspan: 1 };
                        templist[0].levelCount = 1;
                        if (templist[0].riskModel) {
                            templist[0].riskModelObj = JSON.parse(templist[0].riskModel);
                        }
                        var topScout = {};
                        var score = _this.getAllScroceCount(templist[0])
                        topScout.count = score;
                        topScout.result = templist[0].riskModelObj.result;
                        topScout.resultColor = templist[0].riskModelObj.resultColor;
                        topScout.rowspan = 1;
                        templist[0].topScout = topScout;

                        if (templist[0].riskModelObj.gradeLatScores && templist[0].riskModelObj.gradeLatScores.length > 0) {
                            if (_this.tabHead.riskLevel.count < templist[0].riskModelObj.gradeLatScores.length) {
                                _this.tabHead.riskLevel.count = templist[0].riskModelObj.gradeLatScores.length;
                            }
                        }

                    }


                    for (var i = 1; i < templist.length; i++) {
                        var item = templist[i];
                        item.riskModelObj = {};
                        if (item.riskModel) {
                            item.riskModelObj = JSON.parse(item.riskModel);
                            riskModel = item.riskModelObj;
                        }

                        // 隐藏项  风险等级
                        if (item.riskModelObj.gradeLatScores && item.riskModelObj.gradeLatScores.length > 0) {
                            if (_this.tabHead.riskLevel.count < item.riskModelObj.gradeLatScores.length) {
                                _this.tabHead.riskLevel.count = item.riskModelObj.gradeLatScores.length;
                            }
                        }
                        // 控制措施
                        if (item.controlMeasures) {
                            _this.tabHead.contral.list[0].count = 1;
                        }
                        if (item.typeOfCtrlMeas) {
                            _this.tabHead.contral.list[1].count = 1;
                        }
                        if (item.hierOfCtrlMeas) {
                            _this.tabHead.contral.list[2].count = 1;
                        }
                        // 管控标准
                        if (item.checkItem && item.checkItem.name) {
                            _this.tabHead.standard.list[0].count = 1;
                        }
                        // if(item.checkItem && !isNaN(item.checkItem.vetoItem)){
                        //     _this.tabHead.standard.list[1].count = 1;
                        // }
                        if (item.checkItem && item.checkItem.type) {
                            _this.tabHead.standard.list[2].count = 1;
                        }
                        if (item.hiddenDangerType) {
                            _this.tabHead.hiddenDangerType.count = 1;
                        }
                        if (item.hiddenDangerLevel) {
                            _this.tabHead.hiddenDangerLevel.count = 1;
                        }
                        if (item.emergencyPlan) {
                            _this.tabHead.emergencyPlan.count = 1;
                        }


                        // 处理合并项
                        var oldItem = templist[domIndex];
                        if (item.dominationArea.id == oldItem.dominationArea.id) {
                            oldItem.dominationAreaObj.rowspan++;
                            // item.dominationAreaObj = {name:item.dominationArea.name, rowspan:0};
                        } else {
                            item.dominationAreaObj = { name: item.dominationArea.name, rowspan: 1 };
                            domIndex = i;
                        }

                        var rowSpan = oldItem.dominationAreaObj.rowspan;
                        // 属地
                        var oldItem = templist[typeArrIndex];
                        if (item.dominationArea.id == oldItem.dominationArea.id && oldItem.checkObjTypeObj.rowspan < rowSpan) {
                            oldItem.checkObjTypeObj.rowspan++;
                            // item.checkObjTypeObj = {name:item.checkObjType, rowspan:0};
                        } else {
                            item.checkObjTypeObj = { name: item.checkObjType, rowspan: 1 };
                            typeArrIndex = i;
                        }

                        var rowSpan = oldItem.checkObjTypeObj.rowspan;
                        // 风险点
                        var oldItem = templist[pointArrIndex];
                        if (item.riskPoint == oldItem.riskPoint && oldItem.riskPointObj.rowspan < rowSpan) {
                            oldItem.riskPointObj.rowspan++;
                            oldItem.topScout.rowspan++;
                            // topScout.count = score;
                        } else {
                            item.riskPointObj = { name: item.riskPoint, rowspan: 1 };
                            item.topScout = { count: _this.getAllScroceCount(item), result: item.riskModelObj.result, rowspan: 1, resultColor: item.riskModelObj.resultColor };
                            topScoreIndex = i;
                            pointArrIndex = i;
                        }

                        // 分数
                        var oldItem = templist[topScoreIndex];
                        var score = _this.getAllScroceCount(item);
                        
                        if (oldItem.topScout.count < score) {
                            oldItem.topScout.count = score;
                            oldItem.topScout.result = item.riskModelObj.result;
                            oldItem.topScout.resultColor = item.riskModelObj.resultColor;
                        }

                        // 等级
                        var oldItem = templist[levelIndex];
                        if (item.levelOfControl == oldItem.levelOfControl) {
                            oldItem.levelCount++;
                        } else {
                            item.levelCount = 1;
                            levelIndex = i;
                        }
                    };
                    // 控制措施
                    _.each(_this.tabHead.contral.list, function (item, index) {
                        if (item.count > 0) {
                            _this.tabHead.contral.count += 1;
                        }
                    });
                    // 管控标准
                    _.each(_this.tabHead.standard.list, function (item, index) {
                        if (item.count > 0) {
                            _this.tabHead.standard.count += 1;
                        }
                    });

                    // _.each(domArr, function (domItem) {
                    //     var countDom = 0;
                    //     var ifFirstDom = 0;
                    //     _.each(typeArr, function (typeItem) {
                    //         var countType = 0;
                    //         var ifFirstType = 0;
                    //         _.each(pointArr, function (pointItem) {
                    //             var countPoint = 0;
                    //             var ifFirstPoint = 0;
                    //             var topScout = {count:0, result:''};
                    //             _.each(templist, function (item) {
                    //                 if(item.riskPoint == pointItem && item.checkObjType == typeItem && item.dominationArea.id == domItem){
                    //                     var score = 0;
                    //                     if(item.riskModelObj.gradeLatScores){
                    //                         for(var i=0; i<item.riskModelObj.gradeLatScores.length; i++){
                    //                             if(item.riskModelObj.gradeLatScores[i]){
                    //                                 score+= parseFloat(item.riskModelObj.gradeLatScores[i].score);
                    //                             }
                    //                         }
                    //                     }
                    //                     if(topScout.count < score){
                    //                         topScout.count = score;
                    //                         topScout.result = item.riskModelObj.result;
                    //                         topScout.resultColor = item.riskModelObj.resultColor;
                    //                     }
                    //                     countPoint++;
                    //                 }
                    //                 if(item.checkObjType == typeItem && item.dominationArea.id == domItem){
                    //                     countType++;
                    //                 }
                    //                 if( item.dominationArea.id == domItem ){
                    //                     countDom++;
                    //                 }
                    //             });
                    //             _.each(templist, function (item) {
                    //                 if(item.riskPoint == pointItem && item.checkObjType == typeItem && item.dominationArea.id == domItem && ifFirstPoint ==0 ){
                    //                     item.riskPointObj = {name:item.riskPoint, rowspan:countPoint};
                    //                     item.topScout = topScout;
                    //                     item.topScout.rowspan = countPoint;
                    //                     ifFirstPoint = 1;
                    //                 }
                    //                 if(item.checkObjType == typeItem && item.dominationArea.id == domItem && ifFirstType ==0){
                    //                     item.checkObjTypeObj = {name:item.checkObjType, rowspan:countType};
                    //                     ifFirstType = 1;
                    //                 }
                    //                 if(item.dominationArea.id == domItem && ifFirstDom ==0){
                    //                     item.dominationAreaObj = {name:item.dominationArea.name, rowspan:countDom};
                    //                     ifFirstDom = 1;
                    //                 }
                    //             });
                    //         })
                    //     })
                    // });
                    // var name = '';
                    // for(var i=0; i<templist.length;i++){
                    //     if(name!=templist[i].levelOfControl){
                    //         name = templist[i].levelOfControl;
                    //         levelIndex = i;
                    //         templist[levelIndex].levelCount = 1;
                    //         continue;
                    //     }
                    //     templist[levelIndex].levelCount++;
                    // }
                    _.each(templist, function (item) {
                        var str = '<tr>'
                        if (item.dominationAreaObj) {
                            str += '<td  rowspan="' + item.dominationAreaObj.rowspan + '" >' + item.dominationAreaObj.name + '</td>'
                        }
                        if (item.checkObjTypeObj) {
                            str += '<td rowspan="' + item.checkObjTypeObj.rowspan + '" style="color:red;">' + _this.getCheckRiskType(item.checkObjTypeObj.name) + '</td>'
                        }
                        if (item.riskPointObj) {
                            str += '<td  class="td180"  rowspan="' + item.riskPointObj.rowspan + '"  style="color:red;font-size: 16px;font-weight: 600;">' + item.riskPointObj.name + '</td>'
                        }
                        str += ' <td   >' + item.hazardFactor.name + '</td> <td colspan="4" class="td400" style="text-align: left" >' + item.scene+'</td>'
                        if (_this.tabHead.riskLevel.count > 0) {
                            str += '<td class="td80"  >' + _this.getDimension(item.riskModelObj, 0) + '</td>'
                        }
                         if (_this.tabHead.riskLevel.count > 1) {
                            str += '<td class="td80"  >' + _this.getDimension(item.riskModelObj, 1) + '</td>'
                        }
                         if (_this.tabHead.riskLevel.count > 2) {
                            str += '<td class="td80"  >' + _this.getDimension(item.riskModelObj, 2) + '</td>'
                        }
                         if (_this.tabHead.riskLevel.count > 3) {
                            str += '<td class="td80"  >' + _this.getDimension(item.riskModelObj, 3) + '</td>'
                        } 
                        if (_this.tabHead.riskLevel.count > 4) {
                            str += '<td class="td80"  >' + _this.getDimension(item.riskModelObj, 4) + '</td>'
                        }
                        str += ' <td class="td80"  >' + _this.getAllScore(item.riskModelObj) + '</td> <td  class="td120" style="' + _this.getStyle(item.riskModelObj) + '" >' + item.riskModelObj.result + '</td> '
                        if (item.topScout) {
                            
                            str += '<td class="td120" style="' + _this.getStyle(item.topScout) + '"  rowspan="' + item.topScout.rowspan + '">' + item.topScout.result + '</td>'
                        }
                        if (_this.tabHead.contral.list[0].count > 0) {
                            if (item.controlMeasures) {
                                str += '<td  class="td400" style="text-align: left" colspan="2" >'+item.controlMeasures+'</td>'
                            }else{
                                str += '<td  class="td400" style="text-align: left" colspan="2" ></td>'
                            }
                           
                        }
                        if (_this.tabHead.contral.list[1].count >0) {
                            str += ' <td  class="td120">'+_this.getDataDic('type_of_ctrl_meas',item.typeOfCtrlMeas)+'</td>'
                        }
                        if (_this.tabHead.contral.list[2].count >0) {
                            str += ' <td  class="td120">'+_this.getDataDic('hier_of_ctrl_meas',item.hierOfCtrlMeas)+' </td>'
                        }
                        if (_this.tabHead.standard.list[0].count>0) {
                            
                            if (item.checkItem) {
                                str += '<td class="td400" style="text-align: left"  colspan="4">'+item.checkItem.name+'</td>'
                            }else{
                                str += '<td class="td400" style="text-align: left"  colspan="4"></td>'
                            }
                            
                        }
                        if (_this.tabHead.standard.list[2].count>0) {
                            str += '<td  > '+_this.getDataDic('pool_type',item.checkItem.type)+'</td>'
                        }
                        if (item.levelCount) {
                            str += '<td style="background: #92D050;color:#000099;" rowspan="'+item.levelCount+'">'+_this.getDataDic('level_of_control',item.levelOfControl)+'</td>'
                        }
                        if (_this.tabHead.emergencyPlan.count>0) {
                            str += ' <td  >'+_this.emergencyPlan(item.emergencyPlan)+'</td>'
                        }
                        if (_this.tabHead.hiddenDangerType.count>0) {
                            str += '<td  >'+_this.getDicRiskType(item.hiddenDangerType)+'</td>'
                        }
                        if (_this.tabHead.hiddenDangerLevel.count>0) {
                            str += '<td  >'+_this.getDicRiskLevel(item.hiddenDangerLevel)+'</td>'
                            // str += '<td  >'+item.hiddenDangerLevel+'</td>'
                        }
                        str += '</tr>'
                        $('#risktbody').append(str)
                    })
           
                   
                        circleLoading.hide();
                   

                    if (riskModel && riskModel.id) {
                        _this.getGradeList(riskModel.id);
                    }

                });

            },
            doTypeChange: function (val) {
                var _this = this;
                _this.pointlist = [];
                this.checkedPointIndex = '';
                _.each(this.searchInfoList.riskPoint, function (item) {
                    if (item.check_obj_type == val) {
                        _this.pointlist.push(item);
                    }
                })
            },
            doCompChange: function (id) {
                var _this = this;
                _this.domlist = [];
                _this.typelist = [];
                _this.id = '';
                _this.searchVo.checkObjType = '';
                _this.searchVo.riskPoint = '';
                _this.pointlist = [];
                _this.checkedPointIndex = '';

                var result = _.filter(LIB.setting.orgList, function (data) {
                    return data.compId == id
                });
                
                _.each(_.clone( _this.searchInfoList.dominationArea), function (item) {
                    if (id == item.compId && item.disable == '0') {
                       
                            item.parentId = "_" +item.orgId
                        
                      
                        _this.domlist.push(item);
                    }
                });
                var result2 = []
                _.each(result, function (item) {
                    if (item.id.indexOf("_")<0) {
                        item.id = "_" + item.id
                    }
                   
                  
                    var arr = _.filter(_this.domlist, function (domin) {
                      
                        return domin.parentId == item.id 
                    })
                    if (arr.length > 0) {
                        result2.push(item)
                    }
                })
                // var result3 = []
                
                _.each(result2,function(item){
                    if (item.parentId.indexOf("_")<0) {
                        item.parentId = "_" + item.parentId
                    }
                   
                    if (item.hasOwnProperty('parentId')) {
                        var arr = _.filter(result,function(x){
                            return x.id== item.parentId
                        })
                       
                        if (arr.length > 0) {
                            result2.push(arr[0])
                        }
                    }
                })
                result2 = _.uniq(result2,'id')
                _this.domlist = _this.domlist.concat(result2)

                // var domlist = []
                // _.each(_this.domlist, function (item) {

                //     if (item.orgId) {
                //         var arr = _.filter(_this.domlist, function (list) {
                //             return list.id == item.parentId
                //         })
                //         if (arr.length > 0) {
                //             domlist.push(item)
                //         }
                //     } else {
                //         domlist.push(item)
                //     }
                // })
                // _this.domlist = domlist
            },
            selectSame: function () {
                this.id = '';
            },
            doDomChange: function (id) {
                var _this = this;
                _this.typelist = [];
                _this.searchVo.riskPoint = '';
                _this.pointlist = [];

                _this.newList = [];
                $('#risktbody').html('')
                // _this.$nextTick(function(){
                //     _this.refresh=false
                //     // _this.refresh=true

                // })
                _this.checkedPointIndex = '';
                // var items = _.find(_this.domlist,function (items) {
                //                 if(items.id == id){
                //                     return items;
                //                 }
                //             });
                //
                //
                // _.each(_this.searchInfoList.checkObjType, function (item) {
                //     if(items.id == item.domination_area_id){
                //         _this.typelist.push(item);
                //     }
                // });
                // if(!this.id) return ;
                LIB.globalLoader.show();
                api.queryRiskPoint({ dominationAreaId: this.id, compId: this.searchVo.compId }).then(function (res) {

                    _this.pointlist = res.data
                    LIB.globalLoader.hide();

                })
            }
        },
        init: function () {
            this.$api = api;
        },
        ready: function () {
            var _this = this;
            this.getCheckRiskTypeList();
            // this.complist = _.filter(LIB.setting.orgList, function (item) {
            //     return item.type == "1";
            // });
            api.queryRiskassessmentDistinct().then(function (res) {
                _this.searchInfoList = res.data;
                _this.complist = _this.searchInfoList.comp;
            })
        }
    });

    return vm;
});
