define(function (require) {
    var LIB = require("lib");
    var Vue = require("vue");
    var template = require("text!./treeNode.html");


    var opts = {
        template: template,
        props: {
            edit: {
                type: [Boolean],
                default: false
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
            idAttr: {
                type: String,
                default: "id"
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
            defaultOpen: {
                type: Boolean,
                default: true
            },
            //控制选择父节点 勾选子节点功能 报表查询需要
            parentNode: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            },
            dataQuery: {
                type: String,
                default: ''
            },
            // 部门接口 bug 2796
            // 选择公司的时候 勾选公司节点，级联选择下属部门
            // 选择部门的时候 勾选部门，只能单选，不可级联选择下属子部门
            department: {
                type: Boolean,
                default: false
            },
            //bug 2796
            type: {
                type: String,
                default: "type"
            },
            layer: {
                type: Number,
                default: 0
            },
            //显示自定义的图标 （公司跟部门）
            customIco: {
                type: Boolean,
                default: false
            },
            customFunc: {
                type: Function,
                default: function () {
                    return '';
                }
            },
            // 展开的层级，默认两级
            openDeep: {
                type: Number,
                default: 2
            },
            openStatus:{
                type: Number,
                default: 10
            },
            openBtnClick:{
                type: Number,
                default: 0
            }

        },
        data: function () {
            return {
                checked: false,
                open: true,
                openStatus1:10
            }
        },
        computed: {
            ulStyle: function () {
                return {
                    paddingLeft: (this.layer - 1) * 16 + 'px'
                }
            },
            isFolder: function () {
                return this.model.hasChildren;
            },
            displayLabelValue: function () {
//		    	console.log("this.displayAttr = " + this.displayAttr);
                return this.model[this.displayAttr] || "";
            },
            //idAttr 设置一个变量用来控制id
            isShow: function () {
                return this.model[this.idAttr] && this.model[this.idAttr] != '-1';
            },
            treeClasses: function () {
                var obj = {};
                obj['bold'] = this.isFolder;
                obj['custom-vi-tree-item-selected'] = this.showChecked;
                obj["custom-vi-tree-item-select-down"] = this.edit;
                return [obj];
            },
            selected: function () {
                return this.disabled;
            },

        },
        watch: {
            openBtnClick:function (val) {
                if(val >0){
                    this.open = true;
                }else{
                    if(this.openStatus > 1){
                        this.open = false;
                    }
                }
                // this.open = !this.open;
                // console.log("jinali le ")
                // if (this.layer > this.openDeep) {
                //     this.open = false;
                // } else {
                //     this.open = this.defaultOpen;
                // }
            },
            checked: function (val) {
                //this.parentModel
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
                if (val) {

                } else {
                    if (this.$parent && this.$parent.$data) {
//						  this.$parent.$data.checked = false;
                    }
                }
                //添加class判断  checkbox不显示this.showCheckbox(为外部维护)为false
                if (this.showCheckbox) {
                    this.showChecked = false;
                }
                else {
                    this.showChecked = this.checked;
                }

            },
        },
        methods: {
            doAddNode: function () {
                this.$dispatch("on-add-node", {data: this.model, parentData: this.parentModel}, this.addChildWithType);
//				 var obj = {id:"123",name: 'new stuff'}
//				 this.addChildWithType(obj);
            },
            doEditNode: function () {
                this.$dispatch("on-edit-node", {data: this.model, parentData: this.parentModel});
            },
            doDelNode: function () {
                var parentChildren = this.parentModel.children;
                parentChildren.splice(parentChildren.indexOf(this.model), 1);
                this.$dispatch("on-del-node", {data: this.model, parentData: this.parentModel});
            },


            /**
             * 点击叶子节点的checkbox
             */
            _clickLeafNodeCheckbox: function () {
                var arr = [];
                if (this.department) {

                    arr = _.filter(this.parentModel.children, function (item) {
                        return item.disabled;
                    });

                    if (arr.length === this.parentModel.children.length) {
                        this.$dispatch("ev_parentModel", this.model, true);
                    }

                } else {
                    if (this.parentModel.children) {

                        arr = _.filter(this.parentModel.children, function (item) {
                            return item.disabled;
                        });

                        if (arr.length === this.parentModel.children.length) {
                            this.$dispatch("ev_parentModel", this.model, true);
                        } else {
                            //选择子节点的情况下 去循环父节点
                            this.$dispatch("ev_parentModel", this.model, false);
                        }
                    }
                }

                this.$dispatch("ev_treeNode_clicked", {data: this.model});
            },

            /**
             * checkbox事件
             */
            clickCheckbox: function () {
                var _this = this;
                this.model.disabled = !this.model.disabled;

                if (!this.parentNode) {
                    this.$dispatch("ev_treeNode_clicked", {data: this.model});
                    return;
                }

                if(this.isFolder) {
                    //判断是要增加全选功能跟 选择的是否是父节点
                    if (this.department) {
                        //新增一个选择部门的判断
                        if (this.model.children && this.model.type !== "2") {
                            //递归方法
                            this.postArray(this.model.children, this.model.disabled);
                        }
                        this.$dispatch("ev_treeNode_clicked", {data: this.model});

                    } else {
                        //树新增一个选择父元素全选子节点功能

                        // 如果子节点过多，嵌套过深， 会导致卡顿
                        if(this.model.len > 500) {
                            LIB.Msg.warning("该节点下有过多数据，请选择其子级");
                            this.model.disabled = false;
                            setTimeout(function () {
                                _this.$refs.checkbox.checked = false;
                            }, 20);
                            return;
                        }
                        if (this.model.hasChildren) {

                            // 如果children为空，则去本地缓存取
                            // tip: 暂时只对人员有效
                            if(_.isEmpty(this.model.children)) {
                                this.model.children = window.PERSON_TREE_DATA[this.model[this.idAttr]];
                            }
                            this.getArray(this.model.children, this.model.disabled);
                        }
                        this.$dispatch("ev_treeNode_clicked", {data: this.model});
                    }
                } else {
                    this._clickLeafNodeCheckbox();
                }
            },

            /**
             * toggle事件
             */
            clickToggle: function () {

                //当节点是父节点（有子节点）时
                if (this.isFolder) {
                    // 如果children为空，则去本地缓存取
                    // tip: 暂时只对人员有效
                    if (_.isEmpty(this.model.children)) {
                        this.model.children = window.PERSON_TREE_DATA[this.model[this.idAttr]];
                        // Vue.set(this.model, 'children', window.PERSON_TREE_DATA[this.model[this.idAttr]]);
                    }

                    // 切换打开/收起
                    this.open = !this.open;

                    return;
                }

                // 当节点是子节点（不再有子节点）时，切换选中事件
                this.model.disabled = !this.model.disabled;

                if (!this.parentNode) {
                    this.$dispatch("ev_treeNode_clicked", {data: this.model});
                    return;
                }

                this._clickLeafNodeCheckbox();
            },

            /**
             * 事件代理
             * @param event 事件对象
             */
            doClickNode: function (event) {
                var target = event.target,
                    parentNode = target.parentNode;

                if (target.nodeName.toUpperCase() === 'INPUT') {
                    this.clickCheckbox();
                } else if (target.dataset.type === 'toggle' || parentNode.dataset.type === 'toggle') {
                    this.clickToggle();
                }
            },
            getArray: function (data, checked) {
                var _this = this;
                _.each(data, function (item) {
                    item.disabled = checked;
                    _this.$dispatch("ev_treeNode_clicked", {data: item});
                    // if (item.children && item.children.length > 0) {
                    if(item.hasChildren) {

                        // 如果children为空，则去本地缓存取
                        // tip: 暂时只对人员有效
                        if(_.isEmpty(item.children)) {
                            item.children = window.PERSON_TREE_DATA[item[_this.idAttr]];
                        }
                        _this.getArray(item.children, checked)
                    }
                });
            },
            //选择部门的特殊方法 2796
            postArray: function (data, checked) {
                for (var i in data) {
                    if (data[i]) {
                        data[i].disabled = checked;
                        this.$dispatch("ev_treeNode_clicked", {data: data[i]});
                        if (data[i].children && data[i].children.length > 0) {
                            this.getArray(data[i].children, checked)
                        }
                    }
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

            /*
            //参数 e : model， type : 0 表示checkbox点击的事件， 1 表示span 显示label点击的事件
            toggle: function (e, type) {
                //flag作为一个控制器 只有在选择的时候 采取取得他的父元素
                this.flag = true;
                if (this.isFolder) {
                    //只有当点击span 显示的label时才 收起或展开子节点
                    if (_.isEmpty(this.model.children)) {
                        this.model.children = window.PERSON_TREE_DATA[this.model[this.idAttr]];
                        // Vue.set(this.model, 'children', window.PERSON_TREE_DATA[this.model[this.idAttr]]);
                    }
                    if (type === 1) {
                        this.open = !this.open;
                    } else {
                        //this.checked = !this.checked;
                        e.disabled = !e.disabled
                    }
                } else {
                    //this.checked = !this.checked;
                    e.disabled = !e.disabled

                }

                // 1.父节点 + checkbox  2. 子节点

                //当点击的是父节点的 span 显示的label时， 不发送选中事件
                if (!(this.isFolder && type === 1)) {
                    //判断是要增加全选功能跟 选择的是否是父节点
                    if (this.parentNode && this.isFolder && !this.department) {
                        this.$dispatch("ev_treeNode_clicked", {data: this.model});
                        //树新增一个选择父元素全选子节点功能
                        if (this.model.children) {
                            var checked = e.disabled;
                            //递归方法
                            this.getArray(this.model.children, checked);
                        }
                    } else if (this.parentNode && !this.isFolder && !this.department) {
                        //要循环所有的子节点 判断是否全部选中 如果这是最后一个选中 就要把父节点 全部选中
                        if (this.parentModel.children) {
                            var arr = [];
                            var _this = this;
                            _.each(_this.parentModel.children, function (item) {
                                if (item.disabled == true) {
                                    //添加到arr中 在去对比arr跟this.parentModel.children的长度是否相等 如果是  就执行
                                    arr.push(item)
                                }
                            })
                            if (arr.length === _this.parentModel.children.length) {
                                _this.$dispatch("ev_parentModel", _this.model, true);
                            } else {
                                //选择子节点的情况下 去循环父节点
                                _this.$dispatch("ev_parentModel", _this.model, false);
                            }
                            this.$dispatch("ev_treeNode_clicked", {data: this.model});
                        }
                        //this.$dispatch("ev_treeNode_clicked", {data:this.model});
                    } else if (this.department && this.isFolder && this.parentNode) {
                        this.$dispatch("ev_treeNode_clicked", {data: this.model});
                        //新增一个选择部门的判断
                        if (this.model.children && e.type !== "2") {
                            var checked = e.disabled;
                            //递归方法
                            this.postArray(this.model.children, checked);
                        }
                    } else if (this.department && !this.isFolder && this.parentNode) {
                        var arr = [];
                        var _this = this;
                        _.each(_this.parentModel.children, function (item) {
                            if (item.disabled == true) {
                                //添加到arr中 在去对比arr跟this.parentModel.children的长度是否相等 如果是  就执行
                                arr.push(item)
                            }
                        })
                        if (arr.length === _this.parentModel.children.length) {
                            _this.$dispatch("ev_parentModel", _this.model, true);
                        } else {
                            //选择子节点的情况下 去循环父节点
                            //_this.$dispatch("ev_parentModel",_this.model,false);
                            this.$dispatch("ev_treeNode_clicked", {data: this.model});
                        }
                        this.$dispatch("ev_treeNode_clicked", {data: this.model});
                    }
                    else {
                        this.$dispatch("ev_treeNode_clicked", {data: this.model});
                    }

                }
            },
            //checkbox不存在的情况下 点击整行树节点展开或者隐藏
            doClickToggle: function ($event) {
                //this.showCheckbox 是用来判断是否显示checkbox   isFolder 是用来判断是否含有子节点
                if (!this.showCheckbox && this.isFolder) {
                    this.toggle($event, 1);
                }
            }
            */
        },
        events: {
            "ev_selectedDatas_changed": function (data) {
                var _this = this;
                if (_this.model) {
                    //假如data为空 checked就不选中 报表管理 清空数据需要
                    if (data && data.length === 0) {
                        _this.model.disabled = false
                    }
                    _.each(data, function (item) {
                        if (item && item[_this.idAttr] === _this.model[_this.idAttr]) {
                            //如果是子节点， 或者单选模式下的父节点， 则设置选中
                            if (!_this.isFolder || (_this.singleSelect && _this.isFolder)) {
                                //使用$nextTick，防止部分情况 页面不更新的情况
                                _this.$nextTick(function () {
                                    _this.model.disabled = true
                                });
                            }
                        } else {
                            _this.model.disabled = false
                        }
                    });
                    return true;
                }
            },
            "ev_open_true":function (val) {
                var _this = this;
                _this.open = !_this.open;
            }
        },
        ready: function () {
            if (this.layer > this.openDeep) {
                this.open = false;
            } else {
                this.open = this.defaultOpen;
            }
        }
    };

    var component = Vue.extend(opts);
    Vue.component('select-tree-node', component);

});