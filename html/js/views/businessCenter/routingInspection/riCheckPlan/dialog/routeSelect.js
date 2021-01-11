define(function (require) {

    var LIB = require('lib');
    var checkTableSelectModal = require("componentsEx/selectTableModal/riCheckTableSelectModal");

    var template = require("text!./routeSelect.html");
    var api = require("../vuex/api");


    var defaultModel ='';

    var opts = {
        template: template,
        components: {
            "checkTableSelectModal": checkTableSelectModal
        },
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            planId: {
                type: String,
                default: ''
            },
            orgId: {
                type: String,
                default: ''
            }
        },
        data: function () {
            return  {
                tableList: [],
                mainModel: {
                    title: '设置巡检线路',
                    selectedDatas: []
                },
                checkTableSelectModel: {
                    visible: false,
                    filterData:{}
                },
                vo: {
                    checkTable: {id: '', name: ''},
                    riCheckTypes: []
                },
                checkTypes: [],
                checkedAreaIndex: 0,
                areas: [],
                checkedArea: null,
                tabKey: '1',
                filterCheckedAreaIndex: 0,
                filterAreas: null,
                filterCheckedArea: null,
                cacheKeyWord: '',
                keyWord: '',
                showSearchInput: false,
                showLoading: false,
                totalNum: 0,
                checkedNum: 0,
                enableDeptFilter: false,//是否启用部门过滤
            };
        },
        watch: {
            'areas': function() {
                this._caculateTotalNum();
                this._caculateCheckedNum();
            },
            visible: function (nVal) {
                if (!nVal) {
                    this.reset();
                }
            },
            $router: function(val) {
                console.log('路由变化')
                console.log(val)

            }






        },

  


        methods: {
            doClose: function () {
                this.visible = false;
            },
            init: function () {
                this.keyWord = '';
                this.cacheKeyWord = '';
                this.tabKey = '1';
                this.checkedAreaIndex = 0;
                var enableDeptFilter = LIB.getBusinessSetByNamePath("routingInspection.enableDeptFilter");
                this.enableDeptFilter = (!!enableDeptFilter && enableDeptFilter.result == 2);
                this._getTypes();
                if(this.checkTableId) {
                    this._getCheckTableSet()
                }
            },
            reset: function () {
                this.keyWord = '';
                this.cacheKeyWord = '';
                this.checkedAreaIndex = 0;
                this.areas = [];
                this.checkedArea = null;
                this.vo = {
                    checkTable: {id: '', name: ''},
                    riCheckTypes: []
                };
            },

            // 选择巡检类型，要根据选择的巡检类型自动勾选有该类型的巡检内容
            doChangeCheckType: function () {
                var types = this.vo.riCheckTypes;
                this.tabKey = '1';
                var num;
                _.forEach(this.areas, function (area) {
                    _.forEach(area.riCheckPoints, function (point) {
                        point.isChecked = false;
                        num = 0;
                        _.forEach(point.riCheckPointItemRels, function (item) {
                            item.isChecked = false;

                            if(_.isEmpty(types)) {
                                item.isChecked = true;
                                num++;
                            }else{
                                _.forEach(item.riCheckItem.riCheckTypes, function (type) {
                                    if(_.includes(types, type.id)) {
                                        item.isChecked = true;
                                        num++;
                                        return false;
                                    }
                                })
                            }

                        });

                        if(num === point.riCheckPointItemRels.length) {
                            point.isChecked = true;
                        }

                    })
                });

                this._caculateCheckedNum();
            },

            showSelectModal: function () {
                this.checkTableSelectModel.visible = true;
                this.checkTableSelectModel.filterData = {orgId : (this.enableDeptFilter ? this.orgId : null)};
                
                // this._getCheckTable()

            },
            doSaveCheckTable: function (items) {
                this.checkedIds = [];
                this.checkedAreaIndex = 0;
                this.checkTableSelectModel.visible = false;
                this.vo.checkTable.id = items[0].id;
                this.vo.checkTable.name = items[0].name;
                this.tabKey = '1';
                this.vo.riCheckTypes = [];
                this._getCheckTable(1);
            },
            doSelectArea: function (index) {
                this.checkedAreaIndex = index;
                this.checkedArea = this.areas[this.checkedAreaIndex];
            },

            displayCheckType: function(item){
                var arr = _.map(item.riCheckTypes, function (val) {
                    return val.name
                })
                return arr.join(",")
            },
            displayCheckResult: function(item){
                var results = _.get(item, "riCheckResults");
                var str = '';
                if(_.isArray(results)) {
                    var right = _.find(results, function (val) {
                        return val.isRight === '1';
                    });
                    var error = _.find(results, function (val) {
                        return val.isRight === '0';
                    });
                    str = str + right.name ? (right.name + '，') : '';
                    str += (error.name || '');
                }
                return str
            },
            displayIsQualifiedRemarkWrite: function(item){
                var isQualifiedRemarkWrite = _.get(item, "isQualifiedRemarkWrite", "0");
                return LIB.getDataDic("is_qualified_remark_write", isQualifiedRemarkWrite);
            },
            displayPointName: function (point) {
                if(point.refType === '1') {
                    return point.riCheckPointTpl.name
                } else if(point.refType === '2') {
                    return point.equipment.name
                } else if (point.refType === '3') {
                    return _.get(point, "equipment.name") + "-" + _.get(point, "equipmentItem.name")
                }
            },

            toggleAll: function (point) {
                _.forEach(point.riCheckPointItemRels, function (item) {
                    item.isChecked = point.isChecked;
                })
                this._caculateCheckedNum();
            },
            toggleOne: function (point) {
                var num = 0;
                _.forEach(point.riCheckPointItemRels, function (item) {
                    if(item.isChecked) {
                        num++;
                    }
                });
                if(num === point.riCheckPointItemRels.length) {
                    point.isChecked = true
                } else {
                    point.isChecked = false
                }
                this._caculateCheckedNum();
            },
            _caculateTotalNum: function() {
                var totalNum = 0;
                _.forEach(this.areas, function (area) {
                    _.forEach(area.riCheckPoints, function (point) {
                        _.forEach(point.riCheckPointItemRels, function () {
                            totalNum ++;
                        })
                    })
                })
                this.totalNum = totalNum;
            },
            _caculateCheckedNum: function() {
                var checkedNum = 0;
                _.forEach(this.areas, function (area) {
                    _.forEach(area.riCheckPoints, function (point) {
                        _.forEach(point.riCheckPointItemRels, function (item) {
                            if(item.isChecked) {
                                checkedNum ++;
                            }
                        })
                    })
                })
                this.checkedNum = checkedNum;
            },
            // 保存
            _doSave: function (params) {
                var _this = this;
                api.saveCheckItems({id: this.planId, tableId: this.vo.checkTable.id}, params).then(function (res) {
                    LIB.Msg.success("保存成功");
                    _this.$emit("do-save", {checkTable: _this.vo.checkTable})
                })
            },
            doSave: function () {
                var params = [],
                    types = [];
                var _this = this;
                var obj;

                var tableId = this.vo.checkTable.id;
                if(!tableId) {
                    return LIB.Msg.error("请选择巡检表以及巡检内容");
                }

                _.forEach(this.areas, function (area) {
                    _.forEach(area.riCheckPoints, function (point) {
                        _.forEach(point.riCheckPointItemRels, function (item) {
                            if(item.isChecked) {
                                if(_.isArray(item.riCheckItem.riCheckTypes)) {
                                    _.forEach(item.riCheckItem.riCheckTypes, function (val) {
                                        types.push(_.get(val, "name"));
                                    })
                                }
                                obj = {
                                    checkPlanId: _this.planId, // 巡检计划id
                                    checkTableId: _this.vo.checkTable.id, // 巡检表id
                                    checkAreaTplId: area.checkAreaTplId, // 巡检区域id
                                    checkAreaOrderNo: area.orderNo, //巡检区域序号
                                    checkPointOrderNo: point.orderNo, // 巡检点序号
                                    checkItemId: item.checkItemId, // 巡检项id
                                    checkItemOrderNo: item.orderNo, // 巡检项顺序
                                    checkPointRefType: point.refType,
                                    checkPointRefId: point.refType !== '3' ? point.refId : '',
                                    checkPointRefItemId: point.refType === '3' ? point.refItemId : ''
                                };
                                // if(point.refType === "1") {
                                //     obj.checkPointRefId = point.riCheckPointTpl.id
                                // } else if(point.refType === "2") {
                                //     obj.checkPointRefId = point.equipment.id;
                                // } else if(point.refType === "3") {
                                //     obj.checkPointRefItemId = point.equipmentItem.id;
                                // }
                                params.push(obj)
                            }
                        })
                    })
                });
                if(params.length === 0) {
                    return LIB.Msg.error("请选择巡检内容");
                }
                types = _.uniq(_.compact(types))
                if(types.length > 1) {
                    var typeStr = types.join("，");
                    LIB.Modal.confirm({
                        title: '当前制定的巡检计划对应的巡检内容，包含了多种巡检类型，分别是 ' + typeStr + '，确定是否合适?',
                        onOk: function () {
                            _this._doSave(params);
                        }
                    });
                } else {
                    this._doSave(params);
                }
            },

            // 获取巡检区域列表
            _getCheckTable: function (mark) {
                this.showLoading = true;
                if (this.hideLoadingTimer) {
                    clearTimeout(this.hideLoadingTimer);
                }
                var _this = this;
                var num = 0;
                api.queryCheckTable({id: this.vo.checkTable.id}).then(function (res) {
                    var areas = [];
                    var num;
                    _.forEach(res.data.riCheckAreas, function (area) {
                        if(!_this.enableDeptFilter || (area.riCheckAreaTpl && area.riCheckAreaTpl.orgId == _this.orgId) ) {
                            var points = [];
                            _.forEach(area.riCheckPoints, function (point) {
                                if(!_this.enableDeptFilter || (point.riCheckPointTpl && point.riCheckPointTpl.orgId == _this.orgId) || (point.equipment && point.equipment.orgId == _this.orgId)) {
                                    point.isChecked = false;
                                    num = 0;
                                    _.forEach(point.riCheckPointItemRels, function (item) {
                                        if (mark === 1) {
                                            item.isChecked = true;
                                            num++;
                                        }
                                        else if(_.includes(_this.checkedIds, item.id)) {
                                            item.isChecked = true;
                                            num++;
                                        } else {
                                            item.isChecked = false;
                                        }
                                    });
                                    if(num === point.riCheckPointItemRels.length) {
                                        point.isChecked = true;
                                    }
                                    points.push(point);
                                }
                            })
                            area.riCheckPoints = points;
                            areas.push(area);
                        }
                    });
                    _this.areas = areas;
                    _this.checkedArea = _this.areas[_this.checkedAreaIndex];
                    _this.showLoading = false;
                });
                this.hideLoadingTimer = setTimeout(function () {
                    _this.showLoading = false;
                }, 10000);
            },

            // 获取巡检类型
            _getTypes: function () {
                var _this = this;
                api.queryCheckTypes({curPage:1, pageSize: 100, disable: 0}).then(function (res) {
                    _this.checkTypes = res.data.list;
                })
            },

            // 获取之前已选择巡检表的内容，和后端约定：返回数据中已选巡检内容会有isChecked（1已选，0未选）字段
            _getCheckTableSet: function () {
                var _this = this;
                api.queryCheckTableSet({id: this.planId, tableId: this.vo.checkTable.id}).then(function (res) {
                    var areas = [];
                    var num;
                    _.forEach(res.data.riCheckAreas, function (area) {
                        if(!_this.enableDeptFilter || (area.riCheckAreaTpl && area.riCheckAreaTpl.orgId == _this.orgId)) {
                            _.forEach(area.riCheckPoints, function (point) {
                                if(!_this.enableDeptFilter || (point.riCheckPointTpl && point.riCheckPointTpl.orgId == _this.orgId) || (point.equipment && point.equipment.orgId == _this.orgId)) {
                                    point.isChecked = false;
                                    num = 0;
                                    _.forEach(point.riCheckPointItemRels, function (item) {
                                        if (item.isChecked === '1') {
                                            item.isChecked = true;
                                            num++;
                                        } else {
                                            item.isChecked = false;
                                        }
                                    })
                                    if(num === point.riCheckPointItemRels.length) {
                                        point.isChecked = true;
                                    }
                                }
                            })
                            areas.push(area);
                        }
                    });
                    _this.areas = areas;
                    _this.checkedArea = _this.areas[_this.checkedAreaIndex];
                    _this._caculateCheckedNum();
                })
            },


            doChangeTab: function (e) {
                var key = _.get(e.target, "dataset.key") || '1';

                // 计算已选择的区域和项
                if(key === '2') {
                    this._filterCheckedData();
                }
                this.tabKey = key;
            },
            doSelectFilterArea : function (index) {
                this.filterCheckedAreaIndex = index;
                this.filterCheckedArea = this.filterAreas[index];
            },

            // 过滤出已选择的数据
            _filterCheckedData: function () {
                var _this = this;
                this.filterCheckedAreaIndex = 0;

                var _d = _.map(this.areas, function (area) {
                    return {
                        name: area.riCheckAreaTpl.name,
                        riCheckPoints: area.riCheckPoints
                    }
                });

                _d = _.forEach(_d, function (item) {
                    item.riCheckPoints = _.map(item.riCheckPoints, function (point) {
                        return {
                            name: _this.displayPointName(point),
                            checkItems: _.map(point.riCheckPointItemRels, function(rel){
                                return {
                                    isChecked: rel.isChecked,
                                    item: rel.riCheckItem
                                }
                            })
                        }
                    })
                });

                // 过滤巡检区域
                _d = _.filter(_d, function (item) {

                    // 过滤巡检点
                    item.riCheckPoints = _.filter(item.riCheckPoints, function (point) {
                        var items = [];
                        for(var i = 0; i < point.checkItems.length; i++) {
                            if(point.checkItems[i].isChecked) {
                                items.push(point.checkItems[i].item)
                            }
                        }
                        point.checkItems = items;
                        return point.checkItems.length;
                    });

                    return item.riCheckPoints.length;
                });

                this.filterAreas = _d;

                this.filterCheckedArea = this.filterAreas[0]
            },

            openNewTab: function () {
                if(!this.vo.checkTable.id) {
                    return LIB.Msg.warning("请选择巡检表")
                }
                window.open("/html/main.html#!/riCheckTableTabPage?id=" + this.vo.checkTable.id)
            },

            // 刷新前缓存已选择数据的id， 刷新后需要自动勾选对应的数据
            _beforeDoRefresh: function () {
                var _this = this;
                this.checkedIds = []; // 缓存已选的巡检内容的id
                _.forEach(this.areas, function (area) {
                    _.forEach(area.riCheckPoints, function (point) {
                        _.forEach(point.riCheckPointItemRels, function (item) {
                            if(item.isChecked) {
                                _this.checkedIds.push(item.id);
                            }
                        })
                    })
                });
            },
            doRefresh: function () {
                this._beforeDoRefresh();
                this.tabKey = '1';
                this.checkedAreaIndex = 0;
                if(this.vo.checkTable.id) {
                    this._getCheckTable()
                }
            },

            toggleSearchInput: function () {
                this.showSearchInput = !this.showSearchInput;
                if(!this.showSearchInput) {
                    this.keyWord = '';
                    this.cacheKeyWord = '';
                }
            },
            setFilterValue: function () {
                this.keyWord = this.cacheKeyWord;
            },
            _filterKw: function (item, k) {
                var _item = item.riCheckItem;
                if(_.includes(_item.name, k)) {
                    return true;
                }
                if(_.includes(_item.checkBasis, k)) {
                    return true;
                }
                var isResult = _.find(_item.riCheckResults, function (val) {
                    return val.name.indexOf(k) > -1;
                });
                if(isResult) {
                    return true;
                }
                var isType = _.find(_item.riCheckTypes, function (val) {
                    return val.name.indexOf(k) > -1;
                });
                if(isType) {
                    return true;
                }
                return false;
            }
        },
        filters: {
            filterKw: function (value, k) {
                k = _.trim(k);
                var _this = this;
                if (!k || _.isEmpty(value)) {
                    return value;
                }
                return _.filter(value, function (item) {
                    return _this._filterKw(item, k);
                })
            }
        },
        events: {
            "do-select-ri-table": function (checkTableId, checkTableName) {
                this.checkTableId = checkTableId;
                this.vo.checkTable = {
                    id: checkTableId,
                    name: checkTableName
                };
                this.init();
            }
        }
    };

    var component = LIB.Vue.extend(opts);
    return component;
});