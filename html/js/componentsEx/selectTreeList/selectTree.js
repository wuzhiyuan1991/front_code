define(function (require) {

    var Vue = require("vue");
    /*
     serchFilterable:控制搜索是否显示 默认为false
     serchPlaceholder:搜索框的占位 默认为请输入搜索内容
     dataQuery:为搜索的数据
     handleClick：为清空数据方法
     department:为2796 bug的 选择部门接口
     */
    var opts = {
        template: '<div class="tree-list">' +
        '<div style="height: 40px;background: #fff;">' +
        '<div  v-if ="serchFilterable" class="treeSerch">' +
        '<iv-input ' +
        ':value.sync="dataQuery" ' +
        'size="small" ' +
        ':icon="icon" ' +
        ':placeholder="serchPlaceholder" ' +
        '@on-click="handleClick"></iv-input></div></div>' +
        '<select-tree-node :open-btn-click="openstatus" :open-status="0" :open-deep="openDeep" :layer="0" :custom-ico="customIco" :show-fix-ico="showFixIco" :custom-func="customFunc" :single-select="singleSelect" :department="department" :type="type" :data-query.sync="dataQuery" :show-checkbox="showCheckbox" :model="model1" :allow-parent-checked="allowParentChecked" :display-attr="displayAttr" :edit="edit":parent-node="parentNode" :id-attr="idAttr" :selected-datas="selectedDatas"></select-tree-node></div>',
        props: {
            openstatus:{
                type: Number,
                default: 2
            },
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
            parentNode: {
                type: Boolean,
                default: false
            },
            flag: {
                type: Boolean,
                default: false
            },
            isArry: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            serchPlaceholder: {
                type: String,
                'default': '请输入'
            },
            dataQuery: {
                type: String,
                default: ""
            },
            serchFilterable: {
                type: Boolean,
                default: false
            },
            department: {
                type: Boolean,
                default: false
            },
            type: {
                type: String,
                default: "type"
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
            //右边框是否显示图标
            showFixIco: {
                type: Boolean,
                default: false
            },
            // 展开的层级，默认两级
            openDeep: {
                type: Number,
                default: 2
            },
            modelType: {
                type: String,
                default: ''
            },
            backupsFlag: { // 数据备份开关，源数据更新后需要重新备份
                type: Boolean,
                default: true
            }
        },
        data: function () {
            return {
                opennew:0,
//		      open: true,
//		      checked : true,
                //备份树形结果数据
                backupsTreeModel: [],
                //开关 用来控制只有第一次备份是生效
                // backupsFlag: true

            }
        },

        computed: {
            model1: function () {
                var _this = this;
                if (this.model) {
                    if (this.model instanceof Array) {
                        this.refreshModel();
                    }

                    this.$nextTick(function () {
                        _this.$broadcast("ev_selectedDatas_changed", this.selectedDatas);
                    });

                    return this.model;
                } else {
                    return {};
                }
            },
            icon: function () {
                return this.dataQuery === "" ? 'ios-search' : 'ios-close';
            }
        },
        watch: {
            selectedDatas: function (val) {
                this.$broadcast("ev_selectedDatas_changed", this.selectedDatas);
            },
            dataQuery: function (nVal) {
                // 过滤不包含最小级别的父级
                var types = {
                    'equip': '4',
                    'equipitem': '5',
                    'dep': '2'
                };
                var type = _.get(types, this.modelType);

                var str = _.trim(nVal);
                if (str.length > 0) {
                    var _this = this;
                    var arr = [];
                    _.each(this.backupsTreeModel, function (item) {
                        var _text = _.get(item, _this.displayAttr, "");
                        if (_text.indexOf(str) > -1 && (!type || type === item.type)) {
                            arr.push(item);
                        }
                    });
                    _.each(arr, function (_item) {
                        //查询搜索出来的数据的上级公司
                        _this.doParentIdAll(_item[_this.pidAttr], arr);
                    });
                    _this.model = arr;
                    _this.backupsFlag = false;
                    //_this.refreshModel();
                } else {
                    this.model = this.backupsTreeModel;
                    //this.refreshModel();
                }
            }
        },
        methods: {
            changeopen:function () {
                this.opennew+=1;
                this.$dispatch("ev_open_true");
            },
            doParentIdAll: function (parentId, arr) {
                var _this = this;
                var tmp = _.filter(this.backupsTreeModel, function (data) {
                    return data[_this.idAttr] == parentId;
                });
                if (!_.isEmpty(tmp)) {

                    // _.each(tmp, function (_item) {
                    //     _this.doParentIdAll(_item[_this.pidAttr], tmp);
                    // });
                    ///去重
                    _.each(tmp, function (item) {
                        _.each(arr, function (data, index) {
                            if (item[_this.idAttr] == data[_this.idAttr]) {
                                arr.splice(index, 1);
                                return false
                            }
                        })
                        arr.push(item);
                    })
                    _this.doParentIdAll(tmp[_this.pidAttr], tmp);
                }
            },
            //清空数据
            handleClick: function () {
                if (this.dataQuery === "") return;
                this.dataQuery = "";
            },
            //重新根据prop数据源构造tree的数据源
            refreshModel: function () {
                var _this = this;
                if (this.model instanceof Array && this.model.length > 0) {
                    if (this.backupsFlag) {
                        this.backupsTreeModel = this.model;
                    }
                    var newModel = [];
                    _.each(this.model, function (item) {
                        newModel.push(_.extend({}, item));
                    });
                    this.model = newModel;

                    var pidAttr = this.pidAttr;
                    var idAttr = this.idAttr;
                    // var type = this.type;
                    var displayAttr = this.displayAttr;
                    var pidObjMap = _.groupBy(this.model, pidAttr);

                    var idArr = _.pluck(newModel, idAttr);
                    var pidArr = _.pluck(newModel, pidAttr);
                    // var typeAttr = _.pluck(newModel, type);

                    var rootPids = _.difference(pidArr, idArr);

                    //构造属性结构
                    _.each(this.model, function (item) {
                        var id = item[idAttr];
                        Vue.set(item, 'disabled', false);
                        item.hasChildren = false;
                        if (pidObjMap[id]) {
                            if (!item.children) {
                                Vue.set(item, 'children', []);
                            }
//							  item.children = item.children || [];
//						      item.children.push(pidObjMap[id]);
                            item.children = item.children.concat(pidObjMap[id]);
                            item.hasChildren = true;
                            item.len = 0;
                        }
                    });
                    var rootDatas = _.filter(this.model, function (item) {
                        //parentId不存在， 或者parentId不存在在所有数据的id，则该数据为rootNode
                        return !item[pidAttr] || _.contains(rootPids, item[pidAttr]);
                    });


                    // 人员长度大于500时，清除2级以下的数据，需要的时候再动态加载
                    if(this.modelType === 'per' && this.model.length > 500) {
                        window.PERSON_TREE_DATA = pidObjMap;

                        // 获取有子级的一级数据
                        var _parentNodes = _.filter(rootDatas, function (item) {
                            return item.hasChildren;
                        });

                        // 计算父级数据长度
                        _.each(_parentNodes, function (node) {
                            _this.calcChildrenLength(node, pidObjMap);
                        });

                        _.each(rootDatas, function (item) {
                            _.each(item.children, function (sub) {
                                sub.children = [];
                            })
                        });
                    } else {
                        window.PERSON_TREE_DATA = null;
                    }

                    var root = {id: "-1"};
                    Vue.set(root, 'children', rootDatas);
                    root[displayAttr] = "全部";

                    this.model = root;

                } else {
                    this.model = {};
                }
            },

            calcChildrenLength: function(rNode){
                var len = 0,
                    nodeArr = [];

                function recursion(node) {

                    // 判断当前节点是否有子级，如果没有的函数返回，不往下执行
                    if(!node.hasChildren) {
                        return;
                    }

                    // 向上级节点数组中加入当前节点
                    nodeArr.push(node);

                    // 获取当前节点子级的长度
                    len = node.children.length;

                    // 所有父级的长度加上当前节点子级的长度
                    _.each(nodeArr, function (vNode) {
                        vNode.len += len;
                    });

                    // 循环当前节点的子级
                    _.each(node.children, function (cn) {
                        // 如果有子级, 递归
                        if(cn.hasChildren) {
                            recursion(cn);
                        }
                    });

                    // 删除上级节点数组的最后一个元素
                    nodeArr.pop();
                }
                recursion(rNode);
            },
            //递归循环 取得子节点的所有上级节点
            // TODO: 可能可以通过pidObjMap消除递归, 待验证
            getArray: function (data, name, isChecked) {
                if (data) {
                    for (var i in data) {
                        if (data[i][this.idAttr] == name) {
                            data[i].disabled = isChecked;
                            this.isArry.unshift(data[i]);
                            this.clearSelect(this.isArry[0], isChecked);
                            if (this.isArry[0][this.pidAttr]) {
                                this.getArray(this.model.children, this.isArry[0][this.pidAttr], isChecked);
                            }
                            break;
                        } else {
                            this.getArray(data[i].children, name, isChecked);
                        }
                    }
                }
            },
            //清除上级菜单节点
            clearSelect: function (obj, isChecked) {
                var _this = this;
                if (isChecked) {
                    this.selectedDatas.push(obj);
                } else {
                    for (var i = 0; i < this.selectedDatas.length; i++) {
                        var item = this.selectedDatas[i];
                        if (item[_this.idAttr] === obj[_this.idAttr]) {
                            this.selectedDatas.splice(i, 1);
                            break;
                        }
                    }
                }
            }
        },
        events: {
            "ev_treeNode_clicked": function (obj) {
                var _this = this;
                if (this.parentNode) {
                    /*有一种情况 就是开始选择子节点 在选择父节点
                     这段代码的作用 就是清空之前子节点选择的数据 在把父节点选择的数据丢进去*/
                    for (var i = 0; i < this.selectedDatas.length; i++) {
                        var data = this.selectedDatas[i];
                        if (data[_this.idAttr] === obj.data[_this.idAttr]) {
                            this.selectedDatas.splice(i, 1);
                            this.selectedDatas.push(obj.data);
                        }
                    }
                }
                if (this.singleSelect) {
                    this.selectedDatas = [];
                    this.selectedDatas.push(obj.data);
                    this.$broadcast("ev_selectedDatas_changed", this.selectedDatas);
                } else {
                    if (!obj.data.disabled) {
                        for (var i = 0; i < this.selectedDatas.length; i++) {
                            var item = this.selectedDatas[i];

                            if (item[_this.idAttr] === obj.data[_this.idAttr]) {
                                this.selectedDatas.splice(i, 1);
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


//				  this.$broadcast("ev_selectedDatas_changed", this.selectedDatas);
                this.$emit("on-tree-node-click", obj);

            },
            //取得点击的父元素id 在去循环上一层级
            ev_parentModel: function (data, isChecked) {
                this.getArray(this.model.children, data[this.pidAttr], isChecked);
                //while(this.flag && this.isArry[0][this.pidAttr]){ debugger;
                //	this.getArray(this.model.children,this.isArry[0][this.pidAttr], isChecked);
                //}
            },
            //清空搜索数据
            "on-del-treeData": function () {
                //清空搜索框数据
                this.handleClick();
            }
        },
        created: function () {
//		  beforeCompiled :function() {
            if (this.singleSelect && this.selectedDatas) {
                this.selectedDatas.splice(1, this.selectedDatas.length);
            }

            this.refreshModel();
// 			  if(this.model instanceof Array) {
//
// //				this.model = _.deepExtend([], this.model);
// 				var newModel = [];
// 				_.each(this.model, function(item){
// 					newModel.push(_.extend({}, item));
// 				});
// 				this.model = newModel;
//
//
// 			    var pidAttr = this.pidAttr;
// 			    var idAttr = this.idAttr;
// 			    var displayAttr = this.displayAttr;
// 				var pidObjMap = _.groupBy(this.model, pidAttr);
//
// 				//构造属性结构
// 				_.each(this.model, function(item){
// 					var id = item[idAttr];
// 					if(pidObjMap[id]){
// 						item.children = item.children || [];
// //						item.children.push(pidObjMap[id]);
// 						item.children = item.children.concat(pidObjMap[id]);
// 					}
// 				});
// 				var rootDatas = _.filter(this.model, function(item){
// 					return !item[pidAttr];
// 				});
//
// 				var root = {children : rootDatas};
// 				root[displayAttr] = "全部";
// 				this.model = root;
// 			  }
        },

        ready: function () {
            this.$broadcast("ev_selectedDatas_changed", this.selectedDatas);
            this.$emit("on_tree_data_ready", this.model1);
        }
    };


    var component = Vue.extend(opts);
    Vue.component('select-tree', component);

});