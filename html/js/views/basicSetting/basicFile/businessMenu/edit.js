define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    //vue数据
    var newVO = function () {
        return {
            id: null,
            attr2:1,//设备设施分类即将过期提醒时间
            name: null,
            parentId: '',
            code: null,
            insertPointObjId: null,
            orderNo: null,
            systemId: null
        }
    };

    var rules = {
        name: [
            {required: true, message: '请输入名称'},
            LIB.formRuleMgr.length(200, 1)
        ]
    };

    //vue数据 配置url地址 拉取数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            isTopLevel: false,
            opType: 'create'
        },
        options:{
            category: null,
            method: null,
            isTop: false
        },
        showParent: true, // 是否显示父级列表： 检查依据分类只有一级，不显示父级选择框
        parentList: null, // 父级分类列表
        selectedDatas: [],
        orderList: null // 排序位置列表
    };
    var vm = LIB.VueEx.extend({
        template: require("text!./edit.html"),
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            list: {
                type: Array,
                default: function () {
                    return []
                }
            }
        },
        computed: {
            rules: function () {
                if(this.mainModel.opType === 'create') {
                    return rules;
                }
                return _.assign(_.cloneDeep(rules), {code: LIB.formRuleMgr.codeRule()})
            },
            allowEmpty: function () {
                return this.mainModel.opType !== 'create';
            }
        },
        data: function () {
            return dataModel;
        },
        watch: {
            visible: function (val) {
                var _this = this;
                if(val) {
                    setTimeout(function() {
                        _this._setParentList();
                        _this._setOrderList();
                    }, 200);
                }
                else {
                    this._reset();
                }
            }
        },
        methods: {
            _reset: function () {
                this.options = {
                    category: null,
                    method: null,
                    isTop: false
                };
                this.mainModel.isTopLevel = false;
                this.mainModel.vo = newVO();
                this.parentList = null;
            },
            /**
             * 设置父级列表数据 更新某个节点时需要移除将该节点以及该节点的子节点
             * @private
             */
            _setParentList: function () {
                if (this.mainModel.opType === 'update') {
                    var id = this.mainModel.vo.id;
                    this.parentList = _.filter(this.list, function (item) {
                        return item.id !== id && item.parentId !== id;
                    })
                } else {
                    this.parentList = this.list
                }
                this.selectedDatas = [{id: this.mainModel.vo.parentId}];
            },
            /**
             * 设置排序位置列表数据
             * @param pid 父级节点id
             * @private
             */
            _setOrderList: function (pid) {
                var orderList = null;
                var parentId = pid || this.mainModel.vo.parentId;
                var id = this.mainModel.vo.id;
                // var orderNo = this.mainModel.vo.orderNo;
                if(parentId) {
                    orderList = _.filter(this.list, function (item) {
                        return item.parentId === parentId;
                    });
                } else {
                    orderList = _.filter(this.list, function (item) {
                        return !item.parentId;
                    });
                }
                orderList = _.sortBy(orderList, function (item) {
                    return item.orderNo ? parseInt(item.orderNo) : 0;
                });
                var index = _.findIndex(orderList, function (item) {
                    return item.id === id
                });
                var prevItem = index > 0 ? orderList[index - 1] : null;
                if(prevItem) {
                    orderList.splice(index, 1);
                    this.mainModel.vo.insertPointObjId = prevItem.id;
                }

                this.orderList = orderList;

                if(!_.isArray(orderList) || orderList.length === 0) {
                    this.mainModel.vo.insertPointObjId = '';
                }
            },
            _getURL: function () {
                var addTopLevelURLs = {
                    riskType: api.createRiskType,
                    hazardFactor: api.createHazardFactor,
                    checkBasisType: api.createCheckBasisType,
                    tableType: api.createTableType,
                    equipmentType: api.createEquipmentType,
                    industryCategory: api.createIndustryCategory,
                    courseCategory: api.createCourseCategory,
                    certificationSubject: api.createCertificationSubject,
                    checkObjectCatalog: api.createCheckObjectCatalog,
                    checkObjectCatalogClassify: api.createCheckObjectCatalogClassify,
                    certType: api.createCertType
                };
                var addSubLevelURLs = {
                    riskType: api.createRiskType,
                    hazardFactor: api.createHazardFactor,
                    checkBasisType: api.createCheckBasisType,
                    tableType: api.createTableType,
                    equipmentType: api.createEquipmentType,
                    industryCategory: api.createIndustryCategory,
                    courseCategory: api.createCourseCategory,
                    certificationSubject: api.createCertificationSubject,
                    checkObjectCatalog: api.createCheckObjectCatalog,
                    checkObjectCatalogClassify: api.createCheckObjectCatalogClassify,
                    certType: api.createCertType
                };
                var updateSubLevelURLs = {
                    riskType: api.updateRiskType,
                    hazardFactor: api.updateHazardFactor,
                    checkBasisType: api.updateCheckBasisType,
                    tableType: api.updateTableType,
                    equipmentType: api.updateEquipmentType,
                    industryCategory: api.updateIndustryCategory,
                    courseCategory: api.updateCourseCategory,
                    certificationSubject: api.updateCertificationSubject,
                    checkObjectCatalog: api.updateCheckObjectCatalog,
                    checkObjectCatalogClassify: api.updateCheckObjectCatalogClassify,
                    certType: api.updateCertType
                };
                // 添加一级节点
                if(this.options.isTop) {
                    return addTopLevelURLs[this.options.category];
                }

                // 添加子级节点
                if(this.options.method === 'add') {
                    return addSubLevelURLs[this.options.category];
                }

                // 更新子级节点
                return updateSubLevelURLs[this.options.category];
            },

            _buildParams: function () {
                if(this.mainModel.vo.insertPointObjId) {
                    this.mainModel.vo.attr1 = this.mainModel.vo.insertPointObjId;
                    this.mainModel.vo.orderNo = '';
                } else {
                    this.mainModel.vo.attr1 = '';
                }

                if(!this.mainModel.vo.parentId) {
                    this.mainModel.vo.parentId = null;
                    this.mainModel.vo["criteria"] = {
                        strValue: {parentId_empty: '1'}
                    };
                }
                this.mainModel.vo.bizType = this.$route.query.bizType;
                // 添加一级节点
                if (this.options.isTop) {
                    if(this.options.category === 'checkBasisType') {
                        return {
                            name: dataModel.mainModel.vo.name,
                            code: dataModel.mainModel.vo.code,
                            orderNo: dataModel.mainModel.vo.orderNo
                        }
                    }
                    return _.omit(this.mainModel.vo, ["id", "children", "open"]);
                }

                // 添加子级节点
                if (this.options.method === 'add') {
                    if(this.options.category === 'checkBasisType') {
                        return {
                            name: dataModel.mainModel.vo.name,
                            code: dataModel.mainModel.vo.code,
                            orderNo: dataModel.mainModel.vo.orderNo
                        }
                    }
                    return _.omit(this.mainModel.vo, ["id", "children", "open"]);
                }

                // 更新子级节点
                return _.omit(this.mainModel.vo, ["children", "open"]);
            },
            _getCallback: function () {
                var _this = this;

                // 添加一级节点的回调函数
                var addTopLevelCallback = function (res) {
                    _this.mainModel.vo.id = res.data.id;
                    LIB.Msg.info("添加成功");
                    _this.$emit("do-add-top", dataModel.mainModel, _this.options.category);
                };

                // 添加子节点的回调函数
                var addSubLevelCallback = function (res) {
                    _this.mainModel.vo.id = res.data.id;
                    LIB.Msg.info("添加成功");
                    _this.$emit("do-update", dataModel.mainModel, "add", _this.options.category);
                };

                // 更新一级节点的回调函数
                var updateSubLevelCallback = function () {
                    LIB.Msg.info("修改成功");
                    _this.$emit("do-update", dataModel.mainModel, "update", _this.options.category);
                };

                if(this.options.isTop) {
                    return addTopLevelCallback;
                }

                if(this.options.method === 'add') {
                    return addSubLevelCallback;
                }
                return updateSubLevelCallback;
            },
            doSave: function () {

                var apiURL = this._getURL();
                var params = this._buildParams();
                var callback = this._getCallback();
                var parentId = params.parentId;
                if(!parentId){
                    parentId = '';
                }
                if(this.mainModel.opType === 'update' && this.lastParentId != parentId) {
                    params.orderNo = 1e8;
                }
                var _this = this;
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        apiURL(null, params).then(callback)
                    }
                })
            },
            // 父级节点改变后调用
            doChangeParent: function (id) {
                this.mainModel.vo.orderNo = '';
                this._setOrderList(id);
            }
        },
        ready: function () {
            this.options = {
                category: null,
                method: null,
                isTop: false
            };
        },
        events: {
            "ev_detailReload": function (data, category, method, systemId) {
                this.showParent = true;
                if (category === 'checkBasisType') {
                    this.showParent = false
                }

                this.orderList = null;
                this.lastParentId = '';
                var _vo = dataModel.mainModel.vo;

                this.options = {
                    category: category,
                    method: method,
                    isTop: false
                };
                this.mainModel.isTopLevel = false;
                //清空数据
                _.extend(_vo, newVO());

                if (method === "add") {
                    dataModel.mainModel.vo.parentId = data.data.id;
                    this.mainModel.opType = 'create';
                } else if (method === "update") {

                    //修改一级分类
                    if(data.parentData.id === '-1') {
                        this.mainModel.isTopLevel = true;
                    } else {
                        this.mainModel.isTopLevel = false;
                    }
                    _.deepExtend(_vo, data.data);
                    this.mainModel.opType = 'update';
                    this.lastParentId = _vo.parentId;
                }
                this.mainModel.vo.systemId=systemId || null;

            },
            /**
             * 点击头部添加按钮，默认添加一级属性
             * @param {String} category 类型
             */
            "ev_topAdd": function (category, systemId) {
                this.showParent = true;

                if(category === 'checkBasisType') {
                    this.showParent = false
                }
                this.orderList = null;
                this.lastParentId = '';

                var _vo = dataModel.mainModel.vo;
                this.mainModel.opType = 'create';
                this.options = {
                    category: category,
                    method: '',
                    isTop: true
                };
                this.mainModel.isTopLevel = true;
                //清空数据
                _.extend(_vo, newVO());

                this.mainModel.vo.systemId=systemId || null;

                if (category === "equipmentType") {
                    if (!this.mainModel.vo.orderNo) {
                        this.mainModel.vo.orderNo = 1;
                    }
                }
            }
        }
    });
    return vm;
});