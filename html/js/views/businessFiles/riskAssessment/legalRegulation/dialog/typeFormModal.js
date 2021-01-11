define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("../vuex/api");
    //vue数据
    var newVO = function () {
        return {
            id: null,
            name: null,
            parentId: '',
            code: null,
            insertPointObjId: null,
            orderNo: null,
            type: null
        };
    };

    var rules = {
        name: [
            {required: true, message: '请输入名称'},
            LIB.formRuleMgr.length(200, 1)
        ],
        parentId: [LIB.formRuleMgr.allowStrEmpty]
    };

    //vue数据 配置url地址 拉取数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            isTopLevel: false,
            opType: 'create'
        },
        parentList: null, // 父级分类列表
        selectedDatas: [],
        orderList: null // 排序位置列表
    };
    var vm = LIB.VueEx.extend({
        template: require("text!./typeFormModal.html"),
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
                if(id) {
                    var index = _.findIndex(orderList, "id", id);
                    orderList.splice(index, 1);
                    var prevItem = index > 0 ? orderList[index - 1] : null;
                    if(prevItem) {
                        this.mainModel.vo.insertPointObjId = prevItem.id;
                    }
                }

                this.orderList = orderList;

                if(!_.isArray(orderList) || orderList.length === 0) {
                    this.mainModel.vo.insertPointObjId = '';
                }
            },
            _getURL: function () {

                // 添加子级节点
                if(this.mainModel.opType === 'create') {
                    return api.createLegalType;
                }

                // 更新子级节点
                return api.updateLegalType;
            },

            _buildParams: function () {

                if(!this.mainModel.vo.parentId) {
                    this.mainModel.vo.parentId = null;
                    this.mainModel.vo["criteria"] = {
                        strValue: {parentId_empty: '1'}
                    };
                }

                if(this.mainModel.vo.insertPointObjId) {
                    if(!this.mainModel.vo["criteria"]) {
                        this.mainModel.vo["criteria"] = {};
                    }
                    if(!this.mainModel.vo["criteria"].strValue) {
                        this.mainModel.vo["criteria"].strValue = {};
                    }
                    this.mainModel.vo["criteria"].strValue.insertPointObjId = this.mainModel.vo.insertPointObjId;
                    this.mainModel.vo.orderNo = '';
                }

                // 添加子级节点
                if (this.mainModel.opType === 'create') {
                    return _.omit(this.mainModel.vo, ["id", "children", "open"]);
                }

                // 更新子级节点
                return _.omit(this.mainModel.vo, ["children", "open"]);
            },
            _getCallback: function () {
                var _this = this;

                // 添加子节点的回调函数
                var createCallback = function (res) {
                    _this.mainModel.vo.id = res.data.id;
                    LIB.Msg.info("添加成功");
                    _this.$emit("do-save", "create");
                };

                // 更新一级节点的回调函数
                var updateCallback = function () {
                    LIB.Msg.info("修改成功");
                    _this.$emit("do-save", "update");
                };

                if(this.mainModel.opType === 'create') {
                    return createCallback;
                }
                return updateCallback;
            },
            doSave: function () {

                var apiURL = this._getURL();
                var params = this._buildParams();
                var callback = this._getCallback();
                if(this.mainModel.opType === 'update' && this.lastParentId !== params.parentId) {
                    params.orderNo = 1e8;
                }

                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        apiURL(null, params).then(callback);
                    }
                });
            },
            // 父级节点改变后调用
            doChangeParent: function (id) {
                this.mainModel.vo.orderNo = '';
                this._setOrderList(id);
            }
        },
        events: {
            "ev_le_regulation": function (action, data) {
                this.orderList = null;
                this.lastParentId = '';
                var _vo = dataModel.mainModel.vo;
                _.extend(_vo, newVO());
                if (action === 'create') {
                    this.mainModel.vo.parentId = data.id;
                    this.mainModel.opType = 'create';
                } else if (action === 'update') {
                    _.deepExtend(_vo, data);
                    this.mainModel.opType = 'update';
                    this.lastParentId = _vo.parentId;
                }
            }
        }
    });
    return vm;
});