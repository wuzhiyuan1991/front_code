define(function(require) {
    var LIB = require('lib');
    var api = require("../vuex/api");
    var template = require("text!./selectPointModal.html");

    /**
     * 节点是否是被移动节点子节点
     * @param movePoint 被移动节点
     * @param point		 节点
     * @param pointTreeList 节点列表（扁平化数据）
     * @returns {*}
     */
    function isPointParent(movePoint, point, pointTreeList) {
        var pointId = point.parentId; // 选中分类的父节点
        if (pointId && pointId !== movePoint.id) {
            var parentArr = _.filter(pointTreeList, function (item) {
                return pointId && item.id === pointId;
            })
            return isPointParent(movePoint, parentArr[0], pointTreeList);
        } else if (pointId && pointId === movePoint.id){
            return true;
        } else {
            return false;
        }
    }

    var initDataModel = function() {
        return {
            mainModel: {
                model: {
                    type: [Array, Object],
                    default: ''
                },
                title: '移动分类'
            },
            treeModel: {
                data: [],
                selectedDatas: [],
                keyword: '',
                filterData: { id: '' },
                showLoading: false,
            }
        }
    }

    var opts = {
        template: template,
        name: "memberSelectModal",
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            isSingleSelect: {
                type: Boolean,
                default: false
            },
            // 要移动的知识点
            movePoint: {
                type: Object,
                default: function () {
                    return {};
                }
            },
            data: {
                type: Array,
                default: []
            }
        },
        data: initDataModel,
        methods: {
            // doReqPoint: function () {
            //     var _this = this;
            //     this.treeModel.showLoading = true;
            //     api.list().then(function (resp) {
            //         _this.treeModel.showLoading = false;
            //         _this.treeModel.data = resp.body;
            //
            //         // 增加自定义全部知识点节点
            //         _.each(_this.treeModel.data, function (item, index) {
            //             if (!item.parentId) item.parentId = "0";
            //         })
            //         _this.treeModel.data.push({
            //             id: "0",
            //             name: '全部知识点'
            //         })
            //     })
            // },
            doSave: function() {
                var selectedData = this.treeModel.selectedDatas[0];
                if (this.movePoint.id === selectedData.id) {
                    LIB.Msg.error('不能移动到当前分类')
                    return;
                }
                if (isPointParent(this.movePoint, selectedData, this.treeModel.data)) {
                    LIB.Msg.error('不能移动到子分类')
                    return;
                }

                this.$emit('do-save', selectedData);
                this.visible = false;
            },

            init: function() {
                var _this = this;
                // 初始化课程树
                if (_this.treeModel.data.length) {
                    this.$nextTick(function() {
                        this.$els.mtree.scrollTop = 0;
                    });
                    this.treeModel.selectedDatas = [];
                } else {
                    //_this.doReqPoint();
                }
            }
        },
        watch: {
            visible: function(val) {
                if (val) {
                    this.init();
                } else {
                    this.treeModel.keyword = "";
                }
            },
            data: function(val) {
                if (val) {
                    this.treeModel.data = _.clone(val);

                    // 增加自定义全部知识点节点
                    _.each(this.treeModel.data, function (item, index) {
                        if (!item.parentId) item.parentId = "0";
                    })
                    this.treeModel.data.push({
                        id: "0",
                        name: '全部知识点'
                    })
                }
            }
        },
        created: function() {
            this.orgListVersion = 1;
        },
    };
    var component = LIB.Vue.extend(opts);
    LIB.Vue.component('select-point-modal', component);
})
