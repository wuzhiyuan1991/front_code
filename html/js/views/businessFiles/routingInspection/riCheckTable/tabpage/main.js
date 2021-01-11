define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("../vuex/api");
    var tpl = require("text!./main.html");

    var areaSelectModal = require("./dialog/areaSelectModal"); // 新增、修改巡检区域
    var itemFormModal = require("./dialog/itemFormModal");
    var areaFormModal = require("./dialog/areaFormModal");
    var pointSelectModal = require("./dialog/pointSelectModal");
    var pointFormModal = require("./dialog/pointFormModal");

    var columns = [
        {
            title: "巡检内容",
            fieldName: 'riCheckItem.name',
            width: "300px"
        },
        {
            title: "巡查评判标准",
            // fieldName: 'riCheckItem.checkBasis',
            render: function (data) {
                var str = _.get(data, 'riCheckItem.checkBasis');
                return str.replace(/[\r\n]/g, '<br/>');
            }
        },
        {
            title: "巡检类型",
            width: "200px",
            render: function (data) {
                var types = _.get(data, "riCheckItem.riCheckTypes");
                var arr = [];
                if(_.isArray(types)) {
                    arr = _.map(types, function (val) {
                        return val.name
                    })
                }
                return arr.join("，")
            }
        },
        {
            title: "巡检结果",
            width: "200px",
            render: function (data) {
                var attr2 = _.get(data, "riCheckItem.attr2", "");
                if(attr2 === '6'){
                    return "";
                }
                var results = _.get(data, "riCheckItem.riCheckResults");
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
            }
        },
        {
            title:'合格填写描述',
            width: "90px",
            render: function (data) {
                var attr2 = _.get(data, "riCheckItem.attr2", "");
                if(attr2 === '6'){
                    return "";
                }
                var isQualifiedRemarkWrite = _.get(data, "riCheckItem.isQualifiedRemarkWrite", "0");
                var text = LIB.getDataDic("is_qualified_remark_write", isQualifiedRemarkWrite);
                return '<div class="text-center">' + text + '</div>';
            },
        }
    ];

    var newPointVO = function () {
        return {
            id: '',
            name: '',
            refId: '',
            //关联类型 1:自身,2:设备设施
            refType : '1',
            //巡检区域
            // riCheckArea : {id:'', name:''},
            riCheckItems: []
        }
    };

    var initDataModel = function () {
        return {
            mainModel: {
                tableId: ''
            },
            tableModel: {
                columns: columns,
            },
            areaSelectModel: {
                visible: false,
                filterData: null
            },
            areaFormModel: {
                visible: false
            },
            pointFormModel: {
                visible: false
            },
            itemFormModel: {
                visible: false
            },
            pointSelectModel: {
                visible: false,
                filterData: null
            },
            areas: [],
            checkedAreaIndex: -1,
            checkedArea: null,
            pointVo: newPointVO(),
            showEdit: false,
            tools:[],
            tableCompId: null,
            tableOrgId:null,
            points: [], // 巡检点
            enableDeptFilter: false,//是否启用部门过滤
        }
    };

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
        template: tpl,
        data: initDataModel,
        components: {
            "areaSelectModal": areaSelectModal,
            "areaFormModal": areaFormModal,
            "itemFormModal": itemFormModal,
            "pointFormModal": pointFormModal,
            "pointSelectModal": pointSelectModal
        },
        watch: {
            'showEdit': function(value) {
                if(value) {
                    this.tools = ['del', 'update', 'move'];
                }else{
                    this.tools = [];
                }
            }
        },
        methods: {
            _getTable: function() {
                var _this = this;
                this.showEdit = false;
                api.get({id: this.mainModel.tableId}).then(function(res){
                    if(res.data) {
                        _this.tableCompId = res.data.compId;
                        _this.tableOrgId = res.data.orgId;
                        if(res.data.status == 0 && _this.hasAuth("edit")) {
                            _this.showEdit = true;
                        }
                    }
                });
            },
            // 获取巡检区域列表
            _getAreas: function (obj) {
                var _this = this;
                var checkLast = _.get(obj, "checkLast");
                api.queryRiCheckAreaTpls({id: this.mainModel.tableId}).then(function (res) {
                    _this.areas = res.data;
                    if(checkLast) {
                        _this.checkedAreaIndex = res.data.length - 1;
                    }
                    _this.checkedArea = _this.areas[_this.checkedAreaIndex];
                    _this._getPoints();
                })
            },
            // 获取巡检点列表
            _getPoints: function () {
                var _this = this;
                var id = _.get(this.checkedArea, "id");
                if(!id) {
                    this.points = [];
                    return;
                }
                api.queryRiCheckPointTpls({id: id}).then(function (res) {
                    _this._convertPoints(res.data);
                })
            },
            /**
             * 简化巡检点数据
             * @param items
             * @private
             */
            _convertPoints: function (items) {
                if(!_.isArray(items)) {
                    this.points = [];
                }

                var _getPointName =  function (point) {
                    if(point.refType === '1') {
                        return point.riCheckPointTpl.name
                    } else if(point.refType === '2') {
                        return _.get(point, "equipment.name", "")
                    } else if (point.refType === '3') {
                        return _.get(point, "equipment.name", "") + "-" + _.get(point, "equipmentItem.name", "")
                    }
                };

                var res = _.map(items, function (item) {
                    return {
                        id: item.id,
                        name: _getPointName(item),
                        orderNo: item.orderNo,
                        refId: item.refId,
                        refType: item.refType,
                        checkItems: item.riCheckPointItemRels,
                        equipmentItemId: _.get(item, "equipmentItem.id"),
                        keyWord: '',
                        _keyWord: '',
                        showInput: false
                    }
                });

                this.points = res;
            },

            // 巡检区域操作
            // 添加巡检区域，弹出选择区域弹框
            doAddArea: function () {
                this.areaSelectModel.visible = true;
                this.areaSelectModel.filterData = {orgId: (this.enableDeptFilter ? this.tableOrgId : null)};
            },
            // 添加巡检区域，弹出创建区域弹框
            doCreateArea: function () {
                this.areaSelectModel.visible = false;
                this.$broadcast('do-route-area', 'add', this.mainModel.tableId, {
                    compId: this.tableCompId,
                    orgId: this.tableOrgId,
                    orderNo: this.areas.length + 1,
                    enableDeptFilter: this.enableDeptFilter
                });
                this.areaFormModel.visible = true;
            },
            // 修改巡检区域，弹出创建区域弹框
            doEditArea: function () {
                this.$broadcast(
                    'do-route-area',
                    'update',
                    this.mainModel.tableId,
                    _.omit(this.checkedArea.riCheckAreaTpl, ['createDate', 'createBy'])
                );
                this.areaFormModel.visible = true;
            },
            _doDeleteArea: function () {
                var _this = this;
                api.removeRiCheckAreas({id: this.mainModel.tableId}, [{id: this.checkedArea.id}]).then(function () {
                    _this.checkedAreaIndex = 0;
                    _this._getAreas();
                    _this._updateLocalStorage();
                })
            },
            doDeleteArea: function () {
                var _this = this;
                // 检查区域下面是否有巡检点
                if(_.isEmpty(this.points)){
                    this._doDeleteArea();
                } else {
                    LIB.Modal.confirm({
                        title: '当前巡检区域包含巡检点及对应巡检项，删除操作会一并删除相关内容，确认是否删除?',
                        onOk: function() {
                            _this._doDeleteArea()
                        }
                    });
                }

            },

            // 添加或者新增巡检区域后刷新巡检区域列表
            // 需求：选定新添加的区域（新添加的巡检区域在列表最后）
            doRefreshAreas: function (isCheckLast) {
                this._getAreas({checkLast: isCheckLast});
                this._updateLocalStorage();
            },
            doSelectArea: function (index) {
                this.checkedAreaIndex = index;
                this.checkedArea = this.areas[index];
                this._getPoints();
            },

            doMoveArea: function (offset) {
                if(offset === -1 && this.checkedAreaIndex === 0) {
                    return;
                }
                if(offset === 1 && this.checkedAreaIndex === this.areas.length - 1) {
                    return;
                }
                var _this = this;
                var param = {};
                _.set(param, "criteria.strValue.checkAreaTplId", this.checkedArea.riCheckAreaTpl.id);
                _.set(param, "criteria.intValue.offset", offset);
                api.saveRiCheckAreaTplOrderNo({id : this.mainModel.tableId}, param).then(function() {
                    _this._updateLocalStorage();
                    // 向上
                    if(offset === -1) {
                        _this._doAreaUp();
                    } else if (offset === 1) {
                        _this._doAreaDown();
                    }
                });
            },
            // 区域上移
            _doAreaUp: function () {
                var _arr = this.areas.splice(this.checkedAreaIndex, 1);
                this.areas.splice(this.checkedAreaIndex - 1, 0, _arr[0]);
                this.checkedAreaIndex = this.checkedAreaIndex - 1;
            },
            // 区域下移
            _doAreaDown: function () {

                var _arr = this.areas.splice(this.checkedAreaIndex, 1);
                this.areas.splice(this.checkedAreaIndex + 1, 0, _arr[0]);
                this.checkedAreaIndex = this.checkedAreaIndex + 1;

            },


            // 巡检点操作
            doRefreshPoints: function () {
                this.itemFormModel.visible = false;
                this._getPoints();
            },
            doAddPoint: function () {
                this.pointSelectModel.visible = false;
                this.$broadcast(
                    "do-check-point",
                    "create",
                    {id: this.checkedArea.id, tplId: this.checkedArea.checkAreaTplId}
                );
                this.pointFormModel.visible = true;
            },
            doDeletePoint: function (id) {
                var _this = this;
                LIB.Modal.confirm({
                    title: '确定删除数据?',
                    onOk: function() {
                        api.removeRiCheckPoints({id: _this.checkedArea.id}, [{id: id}]).then(function () {
                            LIB.Msg.success("删除成功");
                            _this._getPoints();
                        })
                    }
                });

            },
            doMovePoint: function (offset, index, point) {
                var _this = this;
                var param = {};
                _.set(param, "criteria.strValue.refId", point.refId);
                _.set(param, "criteria.intValue.offset", offset);
                api.saveRiCheckPointTplOrderNo({id : this.checkedArea.id}, param).then(function() {
                    _this._getPoints();
                });
            },
            doShowPointSelectModal: function (type, id) {
                this.pointSelectModel.visible = true;
                var obj = {
                    areaTplId: _.get(this.checkedArea, "riCheckAreaTpl.id"),
                    areaId: _.get(this.checkedArea, "id"),
                    pointId: id,
                    dominationAreaId: _.get(this.checkedArea, "riCheckAreaTpl.dominationAreaId")
                };
                var checkedIds = _.map(this.points, function (point) {
                    if(point.refType === '1' || point.refType === '2') {
                        return point.refId
                    } else if(point.refType === '3') {
                        return point.equipmentItemId
                    } else {
                        return '';
                    }
                });
                this.$broadcast("do-select-point", type, obj, checkedIds);
            },
            toggleItemInput: function (point, isShow) {
                point.showInput = isShow;
                if(!isShow) {
                    point.keyWord = '';
                    point._keyWord = '';
                }
            },
            setFilterValue: function (val, index) {
                this.points[index].keyWord = val;
            },
            _filterCheckItem: function (item, k) {
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
            },

            // 巡检内容操作
            doAddItem: function (pointId, pointType) {
                this.$broadcast('do-point-item', 'create', pointId, pointType);
                this.itemFormModel.visible = true;
            },
            doUpdateItem: function (item) {
                var pointId = item.checkPointId;
                var pointType = item.riCheckPoint.refType;
                this.$broadcast('do-point-item', 'update', pointId, pointType, item.riCheckItem);
                this.itemFormModel.visible = true;
            },
            doDeleteItem: function (item) {
                var _this = this;
                var pointId = item.checkPointId;
                var id = item.riCheckItem.id;
                LIB.Modal.confirm({
                    title: '确定删除数据?',
                    onOk: function() {
                        api.removeRiCheckItems({id: pointId}, [{id: id}]).then(function () {
                            LIB.Msg.success("删除成功");
                            _this._getPoints();
                        })
                    }
                });

            },
            doMoveItem: function (data) {
                var _this = this;
                var checkItemId = data.item.checkItemId;
                var checkPointId = data.item.checkPointId;
                var param = {};
                _.set(param, "criteria.strValue.checkItemId", checkItemId);
                _.set(param, "criteria.intValue.offset", data.offset);
                api.saveRiCheckItemOrderNo({id : checkPointId}, param).then(function() {
                    _this._getPoints();
                });
            },
            doClosePage: function () {
                window.close();
            },
            _updateLocalStorage: function () {
                window.localStorage.setItem("riCheckTableChangeTime", Date.now() + '');
            }
        },
        events: {},
        filters: {
            filterItem: function (value, k) {
                k = _.trim(k);
                var _this = this;
                if (!k || _.isEmpty(value)) {
                    return value;
                }
                return _.filter(value, function (item) {
                    return _this._filterCheckItem(item, k);
                })
            }
        },
        init: function () {
            this.$api = api;
        },
        ready: function () {
            this.checkedAreaIndex = 0;
            this.mainModel.tableId = this.$route.query.id;
            var enableDeptFilter = LIB.getBusinessSetByNamePath("routingInspection.enableDeptFilter");
            this.enableDeptFilter = (!!enableDeptFilter && enableDeptFilter.result == 2);
            this._getTable();
            this._getAreas();
        }
    });

    return vm;
});
