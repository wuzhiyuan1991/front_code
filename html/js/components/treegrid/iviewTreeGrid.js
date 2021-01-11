define(function (require) {

    var Vue = require("vue");

    var opts = {
        template: '<ul class="treegrid"><iv-tree-grid-node :layer="0" :assist="assist" :assist-func="assistFunc" ' +
        ':single-select="singleSelect" :show-checkbox="showCheckbox" :model="convertedModel" :render-edit-excess="renderEditExcess" ' +
        ':allow-parent-checked="allowParentChecked" :display-attr="displayAttr" :selected-datas="selectedDatas" ' +
        ':has-add-permission="hasAddPermission" ' +
        ':has-edit-permission="hasEditPermission" ' +
        ':has-del-permission="hasDelPermission" ' +
        ':edit="edit" :add-level="addLevel" :default-open-layer="defaultOpenLayer" :open="open"' + ':menu-show="menuShow" ' + ' :auth-mgr-show="authMgrShow"></iv-tree-grid-node></ul>',
        props: {
            edit: {
                type: [Boolean],
                default: false
            },
            model: {
                type: [Object, Array],
                require: true
            },
            singleSelect: {
                type: Boolean,
                default: false
            },
            selectedDatas: {
                type: Array
            },
            idAttr: {
                type: String,
                default: "id"
            },
            pidAttr: {
                type: String,
                default: "pid"
            },
            displayAttr: {
                type: String,
                default: "name"
            },
            //是否允许folder选中
            allowParentChecked: {
                type: Boolean,
                default: false
            },
            showCheckbox: {
                type: Boolean,
                default: true
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
            //菜单管理 特殊
            menuShow: {
                type: Boolean,
                default: true
            },
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
            // 编辑权限
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
            },
            sortKey: {
                type: String,
                default: ''
            }
        },
        data: function () {
            return {
                convertedModel: {}
            }
        },

        computed: {
            // convertedModel: function() {
            //     var _this = this;
            //
            //     if (this.model) {
            //         if (this.model instanceof Array) {
            //
            //             this.convertModel();
            //
            //             this.$nextTick(function() {
            //                 _this.$broadcast("ev_selectedDatas_changed", this.selectedDatas);
            //             });
            //             return this.model;
            //         }
            //
            //         this.$nextTick(function() {
            //             _this.$broadcast("ev_selectedDatas_changed", this.selectedDatas);
            //         });
            //         return this.model;
            //     } else {
            //         return {};
            //     }
            // }
        },
        watch: {
            selectedDatas: function (val) {
                this.$broadcast("ev_selectedDatas_changed", this.selectedDatas);
            },
            model: function (val) {
                if (_.isArray(val)) {
                    this.convertModel();
                }
            }
        },
        methods: {
            _sortChildren: function (items) {
                var _this = this;
                return res = _.sortBy(items, function (item) {
                    var order =  item[_this.sortKey] ? parseInt(item[_this.sortKey]) : 0;
                    return order;
                })
            },

            //重新根据prop数据源构造tree的数据源
            convertModel: function () {
                var items = [];
                var _this = this;

                if (!_.isArray(this.model)) {
                    return
                }

                // var newModel = this.model;
                _.each(this.model, function (item) {
                    items.push(_.extend({}, item));
                });
                // this.model = newModel;
                var pidAttr = this.pidAttr,
                    idAttr = this.idAttr,
                    displayAttr = this.displayAttr;

                var pidObjMap = _.groupBy(items, pidAttr),
                    idArr = _.pluck(items, idAttr),
                    pidArr = _.pluck(items, pidAttr);

                var rootPids = _.difference(pidArr, idArr);

                //构造属性结构
                _.each(items, function (item) {
                    var id = item[idAttr];

                    Vue.set(item, 'open', _this.open);

                    //数据权限模块需要
                    if (_this.authMgrShow) {
                        if (item.optsMgr) {
                            Vue.set(item, 'menuFuncMgr', true);
                        } else {
                            Vue.set(item, 'menuFuncMgr', false);
                        }
                    }

                    if (pidObjMap[id]) {
                        if (!item.children) {
                            Vue.set(item, 'children', []);
                        }
                        item.children = item.children.concat(pidObjMap[id]);
                        if(_this.sortKey) {
                            item.children = _this._sortChildren(item.children);
                        }
                    }
                });

                var rootDatas = _.filter(items, function (item) {
                    //parentId不存在， 或者parentId不存在在所有数据的id，则该数据为rootNode
                    return !item[pidAttr] || _.contains(rootPids, item[pidAttr]);
                });

                //parentModel的原因 所以多添加一个层级
                var root = {id: "-1"};
                root[displayAttr] = "全部";

                var business = {id: "1", index: false};
                if (this.addLevel == 0) {
                    Vue.set(root, 'children', rootDatas);
                } else if (this.addLevel == 1) {
                    business.id = null;
                    business[displayAttr] = "检查项检查分类";
                    Vue.set(business, 'children', rootDatas);
                    Vue.set(root, 'children', [business]);
                } else if (this.addLevel == 2) {
                    Vue.set(root, 'children', rootDatas);
                } else {
                    business[displayAttr] = "检查表检查分类";
                    Vue.set(business, 'children', rootDatas);
                    Vue.set(root, 'children', [business]);
                }
                this.convertedModel = root;

                this.$emit("on_tree_data_ready", this.model);

                this.$nextTick(function () {
                    _this.$broadcast("ev_selectedDatas_changed", this.selectedDatas);
                });
            }
        },
        events: {
            "ev_treeNode_clicked": function (obj) {

                if (this.singleSelect) {
                    this.selectedDatas = [];
                    this.selectedDatas.push(obj.data);

                    this.$broadcast("ev_selectedDatas_changed", this.selectedDatas);
                } else {
                    if (!obj.checked) {
                        var _this = this;
                        for (var i = 0; i < this.selectedDatas.length; i++) {
                            var item = this.selectedDatas[i];
                            if (item.id == obj.data.id) {
                                this.selectedDatas.splice(i, 1)
                                break;
                            }
                        }
                    } else {
                        this.selectedDatas.push(obj.data);
                    }
                }


                //先判断父组件是i-select
                // todo...

                //发送给select组件使用
                this.$dispatch('on-select-selected', obj.data[this.idAttr]);


                this.$emit("on-tree-node-click", obj);

            },
            "ev_treeNode_selected": function (id) {
                this.$broadcast("ev_selected_changed", id);
            }
        },
        created: function () {
            if (this.singleSelect && this.selectedDatas) {
                this.selectedDatas.splice(1);
            }

            // this.convertModel();

        },
        ready: function () {
            this.$broadcast("ev_selectedDatas_changed", this.selectedDatas);
        }
    };


    var component = Vue.extend(opts);
    Vue.component('iv-tree-grid', component);

});
