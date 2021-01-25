define(function (require) {

    var Vue = require("vue");
    var LIB = require('lib');
    var template = require("text!./selectTreeList.html");

    var List = require('components/transfer/iviewList');
    var Operation = require('components/transfer/iviewOperation');
    var prefixCls = 'ivu-transfer';
    var showFixIco;
    var dataModel = {
        titles: [LIB.lang('gb.common.selected')],
        CheckedKeys: [],
        prefixCls: prefixCls,
        //选中的数据
        rightCheckedKeys: [],
        filterable: true,
        modelModel: {
            show: false,
            id: null
        },
        backupsFlag: true,
        openstatus: -2,
        // params:2
    }
    var opts = {
        template: template,
        components: { "List": List, "Operation": Operation },
        props: {
            //select数据源
            selectmodel: {
                type: Array,
            },
            //树的数据源
            treedata: {
                type: [Object, Array],
            },
            //右边的数据
            transferData: {
                type: Array,
                'default': function () {
                    return []
                }
            },
            //操作文案集合，顺序从上至下
            operations: {
                type: Array,
                'default': function () {
                    return []
                }
            },
            //树选择的按钮
            selectedDatas: {
                type: Array,
                'default': function () {
                    return []
                }
            },
            //点击选取树的数据
            clickTree: {
                type: Array,
            },
            //控制器 判断是否选择了树的数据 如果选中在改变穿梭左边按钮的颜色
            left: {
                type: Boolean,
                default: false
            },
            rigth: {
                type: Boolean,
                default: false
            },
            renderFormat: {
                type: Function,
                'default': function (item) {
                    var results = {
                        "1": "<span class='reportCompModalIco reportModalCustomIco' style='margin-left:-14px'></span>" + item.label || item.key,
                        "2": "<span class='reportDeptModalIco reportModalCustomIco' style='margin-left:-14px'></span>" + item.label || item.key,
                        "3": "<span class='reportUserModalIco reportModalCustomIco' style='margin-left:-14px'></span>" + item.label || item.key,
                        "4": "<span class='reportDeviModalIco reportModalCustomIco' style='margin-left:-14px'></span>" + item.label || item.key
                    };
                    if (showFixIco) {
                        return results[item.type];
                    } else {
                        return item.label || item.key;
                    }

                }
            },
            selectedKeys: {
                type: Array,
                'default': function () {
                    return []
                }
            },
            targetKeys: {
                type: Array,
                'default': function () {
                    return []
                }
            },
            //数据源的桥接变量 保存选中的数据
            keydata: {
                type: Array,
                'default': function () {
                    return []
                }
            },
            //筛选
            filterdata: {
                type: Array,
                'default': function () {
                    return []
                }
            },
            visible: {
                type: Boolean,
                default: false
            },
            parentNode: {
                type: Boolean,
                default: false
            },
            dataQuery: {
                type: String,
                default: ''
            },
            serchFilterable: {
                type: Boolean,
                default: false
            },
            modalTitle: {
                type: String,
            },
            department: {
                type: Boolean,
                default: false
            },
            //受检对象的判断
            subjectMatterType: {
                type: Boolean,
                default: false
            },
            //机构的判断
            mechanismType: {
                type: Boolean,
                default: false
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
            params: {
                default: -2
            }
        },
        data: function () {
            return dataModel
        },
        computed: {
            validKeysCount: function () {
                showFixIco = this.showFixIco;
                return this.getValidKeys().length;
                //return this.rightCheckedKeys.length;
            },
            // getName:function () {
            //     if(this.openstatus <= 0){
            //         this.params = -2;
            //         return "展开"
            //     }else{
            //         this.params = 2;
            //         return "收起"
            //     }
            // }
        },
        watch: {
            treedata: function (val) {
                // 子级select-tree数据备份标识
                this.backupsFlag = true;
            },
            //判断是否选择树 如果选择 则中间的穿梭按钮改变颜色
            selectedDatas: function () {
                var _this = this;
                var left = _this.selectedDatas.map(function (data) {
                    if (data.key) {
                        return data.key
                    }
                });
                _this.left = (_.compact(left).length > 0) ? true : false;

            },
            //右侧列表的数据
            rightCheckedKeys: function () {
                var _this = this;
                if (_this.rightCheckedKeys.length > 0) {
                    _this.rigth = true;
                } else {
                    _this.rigth = false;
                }
            },

        },
        methods: {
            changeOpenDeep: function (val) {
                if (this.openstatus >= 0 && val > 0) {
                    this.openstatus = parseInt(this.openstatus) + 2;
                } else if (this.openstatus >= 0 && val == 0) {
                    this.openstatus = - 2;
                } else if (this.openstatus < 0 && val > 0) {
                    this.openstatus = 2;
                } else if (this.openstatus < 0 && val == 0) {
                    this.openstatus = parseInt(this.openstatus) - 2;
                }
                if (this.openstatus > 0) {
                    this.params = -2;
                } else {
                    this.params = 2;
                }
            },

            beforeDoSave: function () {
                if (this.transferData && this.transferData.length == 0) {
                    LIB.Msg.info("当前没有选择任何数据");
                    return false;
                }
                this.doSave();
            },

            //搜索函数
            filterMethod: function (data, query) {
                if (data && data.label) {
                    return data.label.indexOf(query) > -1;
                }
            },
            getValidKeys: function () {
                var _this = this;
                if (_this.transferData) {
                    return _this.transferData.filter(function (data) {
                        return data && !data.disabled && _this.rightCheckedKeys.indexOf(data.key) > -1;
                    }).map(function (data) {
                        return data.key
                    });
                } else {
                    return [];
                }
            },
            domovetoleft: function () {
                var _this = this;
                var selectedKeys = _this.selectedKeys;
                var targetKeys = _this.targetKeys;
                //去掉选中右边的key值
                _this.selectedKeys = _this.transferData.filter(function (data) {
                    return _this.rightCheckedKeys.indexOf(data.key) == -1;
                })
                    .map(function (data) {
                        return data.key;
                    });
                //去掉选中右边的数据源
                _this.filterdata = _this.transferData.filter(function (data) {
                    return _this.rightCheckedKeys.indexOf(data.key) == -1;
                })
                    .map(function (data) {
                        return data;
                    });
                //给数据源赋值 清楚选中状态
                _this.rightCheckedKeys = [];
                _this.transferData = _this.filterdata;
                _this.keydata = _this.filterdata;
            },
            //左边到右边
            domovetoright: function () {
                var datarigth;
                var hash = {};
                var _this = this;
                var errorInfo = [];
                if (!this.mechanismType) {
                    _.each(_this.selectedDatas, function (item) {
                        //去掉父节点
                        if (_.isEmpty(item.children) && !_this.subjectMatterType && !_this.department) {
                            if (item.key && item.label) {
                                datarigth = {
                                    key: item.key,
                                    label: item.label,
                                    type: item.type
                                };
                                _this.keydata.push(datarigth);
                            }
                        } else if (_this.subjectMatterType) {
                            if (item.key && item.label && item.type == "1") {
                                datarigth = {
                                    key: item.key,
                                    label: item.label,
                                    type: item.type
                                };
                                _this.keydata.push(datarigth);
                            }
                            //else if(item.label){
                            //	errorInfo.push(item.label)
                            //}
                            //4745bug
                        } else if (!_this.subjectMatterType && _this.department) {
                            if (item.key && item.label && item.type == "2") {
                                datarigth = {
                                    key: item.key,
                                    label: item.label,
                                    type: item.type
                                }
                                _this.keydata.push(datarigth);
                            }
                        }
                    })
                } else {
                    _.each(_this.selectedDatas, function (item) {
                        //去掉父节点
                        if (item.key && item.label) {
                            datarigth = {
                                key: item.key,
                                label: item.label,
                                type: item.type
                            }
                            _this.keydata.push(datarigth);
                        }
                    })
                }

                //if(errorInfo.length>0){
                //	var info = errorInfo.join(",")
                //	LIB.Msg.error("你选中的" + info +"不是没有受检对象");
                //}
                //对象去重
                _this.keydata = _this.keydata.reduce(function (item, next) {
                    hash[next.key] ? '' : hash[next.key] = true && item.push(next);
                    return item
                }, []);
                _this.transferData = _this.keydata;
            },
            //关闭model时候
            doClose: function () {
                //清空之前选择的数据 初始化 在发事件 关闭modal
                this.transferData = [];
                this.selectedDatas = [];
                this.keydata = [];
                this.visible = false;
                this.openstatus = 2;
                //this.$dispatch('on-modeltree-close');

            },
            doSave: function () {
                //清空之前选择的数据 初始化 在发事件 关闭modal
                this.selectedDatas = [];
                this.keydata = [];
                this.visible = false;
                this.$dispatch('on-modeltree-selected', this.transferData);

            },
        },
        events: {
            "on-del-serchData": function () {
                //清空搜索框数据
                this.$refs.transfer.$children[0].handleClick();
                this.$broadcast('on-del-treeData');
            },
            "on-clear-rigthList": function () {
                this.rightCheckedKeys = [];
            }
        },
        // ready:function () {
        //     var _this = this;
        //     setTimeout(function () {
        //         _this.changeOpenDeep(2)
        //     })
        // }

    };
    var component = Vue.extend(opts);
    Vue.component('select-tree-list', component);
})