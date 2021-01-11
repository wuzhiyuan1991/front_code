define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");


    //编辑弹框页面
    var detailComponent = require("./detail");
    //vue数据 配置url地址 拉取数据
    var dataModel = {
        moduleCode: 'BS_BaC_MenAPPM',
        //table组件的写法
        url: "menu/list",
        updataModel: {
            //显示弹框
            show: false,
            title: "修改",
            id: null
        },
        addModel: {
            //显示弹框
            show: false,
            title: "修改",
            id: null
        },
        data: null,
        selectedDatas: [],
        //控制展开
        showHide: false,
        //修改name
        treeGridName: null,
        innerAddFun: {
            type: Function
        },
        treedata: null
    };
    var vm = LIB.VueEx.extend({
        //引入html页面
        template: require("text!./main.html"),
        components: {
            "detailcomponent": detailComponent
        },
        data: function () {
            return dataModel;
        },
        computed: {
            isSuperAdmin: function () {
                return LIB.user.id === '9999999999';
            }
        },
        methods: {
            doForce: function () {
                api.removeAllCache(null).then(function() {
                    LIB.Msg.info("清除缓存成功, 请重新登录");
                });
            },

            //全部显示
            treeShowList: function () {
                //this.showHide=true;
                this.$refs.treegrid.$children[0].doShowNode(function () {
                })
            },
            //全部隐藏
            treeHide: function () {
                this.$refs.treegrid.$children[0].doHideNode(function () {
                })
            },
            createTopMenu: function () {
                this.innerAddFun = null;
                this.addModel.title = "新增";
                var orderList = _.filter(this.data, "menuLevel", "1");
                this.$broadcast('ev_detailReload', null, "add", orderList);
                this.addModel.show = true;
            },
            //新增
            doAddNode: function (value, innerAddFun) {
                this.innerAddFun = innerAddFun;
                this.addModel.title = "新增";
                this.$broadcast('ev_detailReload', value, "add", value.data.children);
                this.addModel.show = true;
            },
            _getOrderList: function (parent, id) {
                var childrenList = parent.children;
                return _.cloneDeep(childrenList);
            },
            //修改
            doEditNode: function (value) {
                if (this.hasPermission('1010010002')) {
                    var orderList = this._getOrderList(value.parentData, value.data.id);
                    this.addModel.title = "修改";
                    this.treeGridName = value;
                    //value.data.name += "modify"
                    this.$broadcast('ev_detailReload', value, "updata", orderList);
                    this.addModel.show = true;
                }
                else {
                    LIB.Msg.info("你没有此权限！");
                }
            },
            //删除
            doDelNode: function (value) {
                var id = value.data.id;
                var children = _.filter(this.data, "parentId", id);
                if (!_.isEmpty(children)) {
                    return LIB.Msg.error("请先删除子菜单");
                }
                var _this = this;
                var callback = function (res) {
                    LIB.Msg.info("删除成功");
                    value.parentChildren.splice(value.parentChildren.indexOf(value.data), 1);
                };
                LIB.Modal.confirm({
                    title: '确定删除数据?',
                    onOk: function() {
                        api.del(null, {id:id}).then(callback)
                    }
                });
            },

            doTreeDataReady: function (data) {
                this.treedata = data;
            },
            //获取数据
            retrieveData: function () {
                var _this = this;
                api.list().then(function (res) {
                    _this.data = res.data;
                })
            },
            doupdata: function (value, flag) {
                this.addModel.show = false;
                var vo = value.vo;
                if (flag === "add") {
                    this.retrieveData();
                    return;
                    // if (!this.innerAddFun) {
                    //     this.retrieveData();
                    //     return;
                    // }
                    var obj = {
                        id: vo.id,
                        name: vo.name,
                        attr2: vo.attr2,
                        attr1: vo.attr1,
                        remarks: vo.remarks,
                        attr5: vo.attr5,
                        menuLevel: vo.menuLevel,
                        parentId: vo.parentId
                    };
                    this.innerAddFun(obj);
                } else {
                    //this.addModel.show = false;
                    this.treeGridName.data.name = vo.name;
                    this.treeGridName.data.attr2 = vo.attr2;
                    this.treeGridName.data.attr1 = vo.attr1;
                    this.treeGridName.data.remarks = vo.remarks;
                    this.treeGridName.data.disable = vo.disable;
                    this.treeGridName.data.attr5 = vo.attr5;
                    this.retrieveData();
                }
            }
        },
        ready: function () {
            this.retrieveData();
        }
    });
    return vm;
});