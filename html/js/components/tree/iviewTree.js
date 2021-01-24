define(function(require) {

    var Vue = require("vue");
    var lang = require("../utils/lang")
    /*
     serchFilterable:控制搜索是否显示 默认为false
     serchPlaceholder:搜索框的占位 默认为请输入搜索内容
     dataQuery:为搜索的数据
     handleClick：为清空数据方法
     */
    var opts = {
        template: '<div class="ive-tree">' +
            '<div  v-if ="serchFilterable" style="margin: 5px 0 10px;">' +
            '<iv-input ' +
            ':value.sync="dataQuery" ' +
            'size="small" ' +
            ':icon="icon" ' +
            ':placeholder="serchPlaceholder" ' +
            ':autofocus="true"' +
            '@on-click="handleClick" style="padding: 0;"></iv-input></div><ul>' +
            '<iv-tree-node :show-icon-plus="showIconPlus" :show-icon="showIcon" :default-open-layer="defaultOpenLayer" :show-count="showCount" :display-func="displayFunc" :layer="0" :assist="assist" :assist-func="assistFunc" :single-select="singleSelect" :show-checkbox="showCheckbox"  :data-query.sync="dataQuery" :model="model1" :allow-parent-checked="allowParentChecked" :trigger-parent-event="triggerParentEvent" :display-attr="displayAttr" :edit="edit" :default-open="open" :id-attr="idAttr" :selected-datas="selectedDatas" :before-click-handle="beforeClickHandle"></iv-tree-node></ul></div>',
        props: {
            showIconPlus: {
                type: Boolean,
                default: false
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
            // 是否触发父元素选中事件
            triggerParentEvent: {
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
            serchPlaceholder: {
                type: String,
                'default': lang('gb.common.import.pesc')
            },
            dataQuery: {
                type: String,
                default: ""
            },
            serchFilterable: {
                type: Boolean,
                default: false
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
                type:Function,
            }
        },
        data: function() {
            return {
                //		      open: true,
                //		      checked : true,
                //备份树形结果数据
                backupsTreeModel: [],
                //开关 用来控制只有第一次备份是生效
                backupsFlag: true
            }
        },
        //filters: {
        //    discount: function(value,val) {debugger
        //        if(String(value[name]).toLowerCase().indexOf(val) > -1){
        //            return value;
        //        }
        //
        //    }
        //},
        computed: {
            model1: function() {
                if (this.model) {
                    if (this.model instanceof Array) {

                        this.refreshModel();

                        var _this = this;
                        this.$nextTick(function() {
                            _this.$broadcast("ev_selectedDatas_changed", this.selectedDatas);
                        })
                        return this.model;
                    }

                    var _this = this;
                    this.$nextTick(function() {
                        if (_.isArray(this.$children))  {
                            _this.$broadcast("ev_selectedDatas_changed", this.selectedDatas);
                        }
                    })
                    return this.model;
                } else {
                    return {};
                }
            },
            icon: function() {
                return this.dataQuery === "" ? 'ios-search' : 'ios-close';
            }
        },
        watch: {
            selectedDatas: function(val) {
                this.$broadcast("ev_selectedDatas_changed", this.selectedDatas);
            },
            dataQuery: function(nVal) {
                if (nVal && nVal.length > 0) {
                    var _this = this;
                    var arr = [];
                    _.each(this.backupsTreeModel, function(item) {
                        if (item[_this.displayAttr].indexOf(nVal) > -1) {
                            arr.push(item);
                        }
                    })
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

            },
        },
        methods: {
            doParentIdAll:function(parentId,arr){
                var _this = this;
                var tmp = _.filter(this.backupsTreeModel, function (data) {
                    return data[_this.idAttr] == parentId;
                });
                if(!_.isEmpty(tmp)) {
                   /* _.each(tmp, function (_item) {
                        _this.doParentIdAll(_item.parentId, tmp);
                    });*/
                    //去重
                    _.each(tmp, function (item) {
                        _.each(arr,function(data,index){
                            if(item[_this.idAttr] == data[_this.idAttr]){
                                arr.splice(index,1);
                                return false
                            }
                        })
                        arr.push(item);
                    })
                    _this.doParentIdAll(tmp[_this.pidAttr], tmp);
                }
            },
            //清空数据
            handleClick: function() {
                if (this.dataQuery === "") return;
                this.dataQuery = "";
            },
            //重新根据prop数据源构造tree的数据源
            refreshModel: function() {
                if (this.model instanceof Array) {
                    if (this.backupsFlag) {
                        this.backupsTreeModel = this.model;
                    }
                    var newModel = [];
                    _.each(this.model, function(item) {
                        newModel.push(_.extend({}, item));
                    });
                    this.model = newModel;

                    var pidAttr = this.pidAttr;
                    var idAttr = this.idAttr;
                    var displayAttr = this.displayAttr;
                    var pidObjMap = _.groupBy(this.model, pidAttr);

                    var idArr = _.pluck(newModel, idAttr);
                    var pidArr = _.pluck(newModel, pidAttr);

                    var rootPids = _.difference(pidArr, idArr);

                    //构造属性结构
                    _.each(this.model, function(item) {
                        var id = item[idAttr];
                        if (pidObjMap[id]) {
                            if (!item.children) {
                                Vue.set(item, 'children', []);
                            }
                            //							  item.children = item.children || [];
                            //						item.children.push(pidObjMap[id]);
                            item.children = item.children.concat(pidObjMap[id]);
                        }
                    });

                    var rootDatas = _.filter(this.model, function(item) {
                        //parentId不存在， 或者parentId不存在在所有数据的id，则该数据为rootNode
                        return !item[pidAttr] || _.contains(rootPids, item[pidAttr]);
                    });

                    var root = { id: "-1" };
                    Vue.set(root, 'children', rootDatas);
                    root[displayAttr] = "全部";
                    this.model = root;
                }
            }

        },
        events: {
            "ev_treeNode_clicked": function(obj) {
                if (this.singleSelect) {
                    this.selectedDatas = [];
                    if(obj.checked) {
                        this.selectedDatas.push(obj.data);
                        this.$broadcast("ev_selectedDatas_changed", this.selectedDatas);
                    }

                } else {
                    if (!obj.checked) {
                        var _this = this;
                        for (var i = 0; i < this.selectedDatas.length; i++) {
                            var item = this.selectedDatas[i];
                            if (item[_this.idAttr] == obj.data[_this.idAttr]) {
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


                //				  this.$broadcast("ev_selectedDatas_changed", this.selectedDatas);
                this.$emit("on-tree-node-click", obj);

            },
            "ev_dropdown_tree": function() {
                this.handleClick();
            }
        },
        created: function() {
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
        ready: function() {
            this.$broadcast("ev_selectedDatas_changed", this.selectedDatas);
            this.$emit("on_tree_data_ready", this.model1);
        }
    };


    var component = Vue.extend(opts);
    Vue.component('iv-tree', component);

});
