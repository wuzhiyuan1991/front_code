define(function(require) {

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
            triggerParentEvent: {
                type: Boolean,
                default: false
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
                default: function() { return []; }
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
            dataQuery: {
                type: String,
                default: ''
            },
            layer: {
                type: Number,
                default: 0
            },
            showIcon: {
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
            showCount: {
                type: Boolean,
                default: false
            },
            displayFunc: {
                type: Function
            },
            defaultOpenLayer: { // 默认展开层数
                type: Number,
                default: 2
            },
            beforeClickHandle:{
                type:Function
            },
            showIconPlus:{
                type:Boolean,
                default: false
            }
        },
        data: function() {
            return {
                checked: false,
                open: true
            }
        },
        computed: {
            isShowCheckbox: function () {
                if (this.model.showCheckbox === false) {
                    return false
                } else if (this.model.showCheckbox === true) {
                    return true
                } else {
                    return this.showCheckbox
                }
            },
            ulStyle: function() {
                var padding = 0;
                if (this.isShowCheckbox) {
                    padding = (this.layer - 1) * 16
                } else {
                    padding = (this.layer - 1) * 13 + 8
                }
                return {
                    paddingLeft: padding + 'px'
                }
            },
            isFolder: function() {
                return this.model.children &&
                    this.model.children.length > 0

            },
            displayLabelValue: function() {
                if(this.showCount) {
                    return this.displayFunc(this.model);
                }
                //		    	console.log("this.displayAttr = " + this.displayAttr);
                return this.model[this.displayAttr] || "";
            },
            //idAttr 设置一个变量用来控制id
            isShow: function() {
                return this.model[this.idAttr] && this.model[this.idAttr] != '-1';
            },
            treeClasses: function() {
                var obj = {};
                obj['bold'] = this.isFolder;
                obj['custom-vi-tree-item-selected'] = this.showChecked;
                obj["custom-vi-tree-item-select-down"] = this.edit;
                return [obj];
            },
            checkboxDisable: function () {
                return (!this.allowParentChecked && (this.isFolder && this.singleSelect))
            }
        },
        watch: {
            checked: function(val) {
                //更新所有children选中的状态
                if (this.$children) {
                    //非单选则选中所有子节点
                    if (!this.singleSelect) {
                        _.each(this.$children, function(child) {
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
                if (this.isShowCheckbox) {
                    this.showChecked = false;
                } else {
                    this.showChecked = this.checked;
                }
            },
        },
        methods: {
            doAddNode: function() {
                this.$dispatch("on-add-node", { data: this.model, parentData: this.parentModel }, this.addChildWithType);
                //				 var obj = {id:"123",name: 'new stuff'}
                //				 this.addChildWithType(obj);
            },
            doEditNode: function() {
                this.$dispatch("on-edit-node", { data: this.model, parentData: this.parentModel });
            },
            doDelNode: function() {
                var parentChildren = this.parentModel.children;
                parentChildren.splice(parentChildren.indexOf(this.model), 1);
                this.$dispatch("on-del-node", { data: this.model, parentData: this.parentModel });
            },
            /**
             *
             * @param event 事件对象
             */
            origin_doNodeClick: function(event) {
                var target = event.target;


                // 点击展开/收起图标
                if(target.dataset.type === 'icon') {
                    this.open = !this.open;
                    return;
                }

                // 点击checkbox
                if (target.nodeName.toUpperCase() === 'INPUT') {
                    this.checked = !this.checked;
                    this.$dispatch("ev_treeNode_clicked", { data: this.model, checked: this.checked });
                    return;
                }

                /**
                 * 点击其他地方
                 * @condition this.isFolder 是否是父级目录(是否有子级)
                 * @condition this.triggerParentEvent 父级是否绑定事件，只对父级有效
                 * @condition this.showCheckbox 是否显示checkbox
                 *
                 * this.triggerParentEvent 与 this.showCheckbox 目前是互斥的
                 *
                 * !isFolder时，只可能是 选中与不选中
                 */

                if(this.isFolder) {
                    if(this.triggerParentEvent) {
                        this.checked = !this.checked;
                        this.$dispatch("ev_treeNode_clicked", { data: this.model, checked: this.checked });
                    } else {
                        this.open = !this.open;
                    }
                } else {
                    this.checked = !this.checked;
                    this.$dispatch("ev_treeNode_clicked", { data: this.model, checked: this.checked });
                }

                /*
                if (this.isFolder) {
                    //只有当点击span 显示的label时才 收起或展开子节点
                    if (type == 1 && !this.triggerParentEvent) {
                        this.open = !this.open;
                    }
                    this.checked = !this.checked;

                } else {
                    this.checked = !this.checked;
                    //			    this.$dispatch("ev_treeNode_clicked", {data:this.model, checked: this.checked});

                    //			    this.refreshCheckedStatus();

                    //			    if(this.checked) {
                    //			    	this.selectedDatas.push(this.model);
                    //			    } else {
                    //			    	this.selectedDatas = [];
                    //			    }
                }
                当点击的是父节点的 span 显示的label时， 不发送选中事件
                if (this.triggerParentEvent) {
                    this.$dispatch("ev_treeNode_clicked", { data: this.model, checked: this.checked });
                } else if (!(this.isFolder && type == 1 && this.showCheckbox)) {
                    this.$dispatch("ev_treeNode_clicked", { data: this.model, checked: this.checked });
                }
                */

            },
            doNodeClick:function(event){
                //litao 目的是为了在切换之前 加一个判断条件是否切换挡墙树  具体可参考grade/main.html 页面
                if(this.beforeClickHandle){
                        //这里找到原来的this对象
                        var originThis;
                        function getOriginThis(obj) {
                            if(obj.$parent.beforeClickHandle&&obj.$parent.keyBeforeClickHandle){
                                originThis=obj.$parent;
                            }
                            else{
                                getOriginThis(obj.$parent);
                            }
                        }
                        getOriginThis(this);
                        var b=this.beforeClickHandle.call(originThis,this);
                        if(typeof b==="function"){//如果b返回的是方方法，需要手动自己判断是否要调用接下里的代码
                            b.call(originThis,this.origin_doNodeClick,this,event);
                        }
                        else if(b===false){//当b 返回的是一个boolen值的时候且为false 的时候，中断逻辑。否则，按照正常逻辑运行
                            return ;
                        }
                        else{
                            this.origin_doNodeClick(event);
                        }

                }
                else{
                    this.origin_doNodeClick(event);
                }
            },
            addChildWithType: function(newObj) {
                if (!this.isFolder) {
                    Vue.set(this.model, 'children', []);
                    this.addChild(newObj);
                } else {
                    this.addChild(newObj);
                }
                this.open = true;
            },
            addChild: function(newObj) {
                this.model.children.push(newObj);
            }
        },
        events: {
            "ev_selectedDatas_changed": function(data) {
                var _this = this;
                if (_this.model) {
                    //假如data为空 checked就不选中
                    if (data && data.length === 0) {
                        _this.checked = false;
                    }
                    _.each(data, function(item) {
                        if (item && item[_this.idAttr] === _this.model[_this.idAttr]) {
                            //如果是子节点， 或者单选模式下的父节点， 则设置选中
                            if (!_this.isFolder || (_this.singleSelect && _this.isFolder)) {
                                //使用$nextTick，防止部分情况 页面不更新的情况
                                _this.$nextTick(function() {
                                    _this.checked = true;
                                });
                            }
                        } else {
                            _this.checked = false;
                        }
                    })
                    return true;
                }
            }
        },
        ready: function() {
            if(this.layer > this.defaultOpenLayer) {
                this.open = false;
            } else {
                this.open = this.defaultOpen;
            }
        }
    };


    var component = Vue.extend(opts);
    Vue.component('iv-tree-node', component);


});
