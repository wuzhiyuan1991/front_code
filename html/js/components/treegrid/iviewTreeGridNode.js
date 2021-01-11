define(function (require) {

    var Vue = require("vue");
    var template = require("text!./iviewTreeGridNode.html");


    var opts = {
        template: template,
        props: {
            edit: {
                type: [Boolean],
                default: false
            },
            grandModel: {
                type: Object,
                default: null
            },
            parentModel: Object,
            model: Object,
            //是否允许folder选中
            allowParentChecked: {
                type: Boolean
            },
            //是否单选
            singleSelect: {
                type: Boolean,
                default: true
            },
            displayAttr: {
                type: String,
                default: "name"
            },
            selectedDatas: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            showCheckbox: {
                type: Boolean,
            },
            showChecked: {
                type: Boolean,
                default: false

            },
            open: {
                type: Boolean,
                default: true
            },
            //业务分类菜单需要 多添加一个层级
            addLevel: {
                type: Number,
                default: 0
            },
            menuShow: {
                type: Boolean,
                default: true
            },
            layer: {
                type: Number,
                default: 0,
            },
            //功能权限管理 内部维护
            menuFuncMgr: {
                type: Boolean,
                default: true
            },
            //功能权限管理
            authMgrShow: {
                type: Boolean,
                default: false
            },
            assist: {
                type: Boolean,
                default: false
            },
            assistFunc: {
                type: Function,
                default: function () {
                    return '';
                }
            },
            // 渲染编辑块点击事件
            renderEditExcess: {
                type: String,
                default: ''
            },
            // // 编辑权限
            hasAddPermission: {
                type: Boolean,
                default: true
            },
            hasEditPermission: {
                type: Boolean,
                default: true
            },
            hasDelPermission: {
                type: Boolean,
                default: true
            },
            defaultOpenLayer: { // 默认展开层数
                type: Number,
                default: 0
            }
        },
        data: function () {
            return {
                checked: false,
                selected: false
                //open:true
            }
        },
        computed: {
            isFolder: function () {
                return this.model.children &&
                    this.model.children.length > 0

            },
            displayLabelValue: function () {
                return this.model[this.displayAttr] || "";
            },
            treeClasses: function () {
                var obj = {};
                obj['bold'] = this.isFolder;
                obj['custom-vi-tree-item-selected'] = this.showChecked;
                obj["custom-vi-tree-item-select-down"] = this.edit;
                obj["checked"] = this.selected;
                return [obj];
            },
            plStyle: function () {
                return {
                    paddingLeft: this.layer * 14 + 'px'
                }
            }
        },
        watch: {
            checked: function (val) {
                //更新所有children选中的状态
                if (this.$children) {
                    //非单选则选中所有子节点
                    if (!this.singleSelect) {
                        _.each(this.$children, function (child) {
                            child.$data.checked = val;
                        });
                    }
                }
                //更新parent状态
                // if (val) {
                //
                // } else {
                //     if (this.$parent && this.$parent.$data) {
                //         //						  this.$parent.$data.checked = false;
                //     }
                // }
                //添加class判断
                if (this.showCheckbox) {
                    this.showChecked = false;
                } else {
                    this.showChecked = this.checked;
                }
            }
        },
        methods: {
            doAssistClicked: function (e, data) {
                this.$dispatch("on-assist-clicked", e, data);
            },
            doAddNode: function () {
                this.$dispatch(
                    "on-add-node",
                    {
                        data: this.model,
                        parentData: this.parentModel
                    },
                    this.addChildWithType
                );
            },
            doEditNode: function () {
                this.$dispatch(
                    "on-edit-node",
                    {
                        data: this.model,
                        parentData: this.parentModel,
                        grandData:this.grandModel
                    }
                );
            },
            doDelNode: function () {
                this.$dispatch(
                    "on-del-node",
                    {
                        data: this.model,
                        parentData: this.parentModel,
                        parentChildren: this.parentModel.children
                    }
                );
            },

            // 外部使用
            doShowNode: function () {
                //this.open = true;
                this._doChildrenOpen(this.model.children, true);
            },

            _doChildrenOpen: function (data, isOpen) {
                var _this = this;
                _.forEach(data, function (item) {
                    if(item) {
                        item.open = isOpen;
                        if(_.isArray(item.children)) {
                            _this._doChildrenOpen(item.children, isOpen)
                        }
                    }
                });
                // for (var i in data) {
                //     if (data[i]) {
                //         data[i].open = type;
                //         if (data[i].children && data[i].children.length > 0) {
                //             this._doChildrenOpen(data[i].children)
                //         }
                //     }
                // }
                //this.open = false;
            },
            doHideNode: function () {
                var _this = this;
                //防止重复点击
                setTimeout(function () {
                    _this._doChildrenOpen(_this.model.children, false);
                }, 50)

            },

            /**
             *
             * @param e 事件对象
             * @param type 事件类型 0:checkbox; 1 span 显示label
             */
            toggle: function (e, type) {
                if (this.isFolder) {
                    //只有当点击span 显示的label时才 收起或展开子节点
                    if (type == 1) {
                        this.open = !this.open;
                    } else {
                        this.checked = !this.checked;
                    }
                } else {
                    this.checked = !this.checked;
                }

                //当点击的是父节点的 span 显示的label时， 不发送选中事件
                if (!(this.isFolder && type == 1)) {
                    this.$dispatch("ev_treeNode_clicked", {data: this.model, checked: this.checked});
                }

            },

            addChildWithType: function (newObj) {
                if (!this.isFolder) {
                    Vue.set(this.model, 'children', []);
                    this.addChild(newObj);
                } else {
                    this.addChild(newObj);
                }
                this.open = true;
            },
            addChild: function (newObj) {
                this.model.children.push(newObj);
            },
            // 编辑块点击，给自定义按钮提供判断
            doEditClicked: function(event, model){
                this.$dispatch("on-click-edit", {
                    event: event,
                    entity: model,
                });
            },
            doClickDiv: function () {
                if(this.selected) {
                    return
                }
                // 向父级组件发送事件, 用于判断背景是否高亮
                this.$dispatch("ev_treeNode_selected", this.model.id);
            },
            _containsById: function (id, data) {
                var _this = this;
                var res = false;
                if(!_.isArray(data.children)) {
                    return res;
                }
                _.forEach(data.children, function (item) {
                    if(item.id === id) {
                        res = true;
                        return false;
                    } else if(_.isArray(item.children)){
                        res = _this._containsById(id, item);
                        if(res) {
                            return false;
                        }
                    }
                });
                return res;
            }
        },
        events: {
            "ev_selectedDatas_changed": function (data) {

                var _this = this;
                if(!this.model) {
                    return false;
                }

                _.each(data, function (item) {
                    if (item && item.id === _this.model.id) {
                        //如果是子节点， 或者单选模式下的父节点， 则设置选中
                        if (!_this.isFolder || (_this.singleSelect && _this.isFolder)) {
                            //使用$nextTick，防止部分情况 页面不更新的情况
                            _this.$nextTick(function () {
                                _this.checked = true;
                            });
                        }
                    } else {
                        _this.checked = false;
                    }
                    // 如果是父节点，并且子节点中包含选中的节点，则展开该节点
                    if(_this.isFolder && _this._containsById(item.id, _this.model)) {
                        // _this.$nextTick(function () {
                            _this.open = true;
                        // });

                        // 高亮修改的节点
                        // _this.$nextTick(function () {
                            _this.$broadcast("ev_selected_changed", item.id);
                        // })
                    }
                });
                return true;
            },

            // 高亮节点
            "ev_selected_changed": function (id) {
                if(this.model.id === id) {
                    this.selected = true;
                } else {
                    this.selected = false;
                }
                return true;
            }
        },
        ready: function () {
            if(this.layer > this.defaultOpenLayer) {
                this.model.open = false;
            } else {
                this.model.open = true;
            }
        }
    };


    var component = Vue.extend(opts);
    Vue.component('iv-tree-grid-node', component);


});
