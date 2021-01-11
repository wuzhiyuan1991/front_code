define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var detailComponent = require("./detail");
    //vue数据 配置url地址 拉取数据
    var dataModel = {
        moduleCode: LIB.ModuleCode.BS_BaC_MenM,
        //table组件的写法
        updateModel: {
            //显示弹框
            show: false,
            title: "修改",
            id: null
        },
        mainModel: {
            data: null,
            //控制展开
            showHide: false,
            //修改name
            treeGridName: null,
            innerAddFun: {
                type: Function
            },
            treedata: null,
        },
        assistFunc: function (item) {
            if (item.code || item.disable) {
                return '<span style="display: inline-block;width: 180px;cursor: default;">' + (item.code || '') + '</span><span style="cursor: default;display: inline-block;">' + (item.disable === '0' ? '启用' : '停用') + '</span>';
            }
            return '';
        },
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
        methods: {
            //全部显示
            treeShowList: function () {
                this.$refs.treegrid.$children[0].doShowNode();
            },
            //全部隐藏
            treeHide: function () {
                this.$refs.treegrid.$children[0].doHideNode();
            },
            //新增
            doAddNode: function (value, innerAddFun) {
                var item = value.data;
                if (item.menuLevel !== '3') {
                    LIB.Msg.warning("只有三级菜单才能新增权限码");
                    return;
                }
                this.mainModel.innerAddFun = innerAddFun;
                this.updateModel.title = "新增";
                this.$broadcast('ev_detailReload', item, "add");
                this.updateModel.show = true;
            },
            //修改
            doEditNode: function (value) {
                var item = value.data;
                if (!item.code) {
                    return LIB.Msg.warning("只有权限码能修改");
                }
                this.updateModel.title = "修改";
                this.mainModel.treeGridName = value;
                this.$broadcast('ev_detailReload', item, "update");
                this.updateModel.show = true;
            },
            //删除
            doDelNode: function (value) {
                var data = value.data;
                if (!data.code) {
                    return LIB.Msg.warning("只有权限码能删除");
                }
                var id = data.id;
                api.del(null, [id]).then(function () {
                    LIB.Msg.info("删除成功");
                    value.parentChildren.splice(value.parentChildren.indexOf(value.data), 1);
                })
            },

            doTreeDataReady: function (data) {
                this.mainModel.treedata = data;
            },
            //获取数据
            retrieveData: function () {
                var _this = this;
                api.list().then(function (res) {
                    _.each(res.data, function (menu) {
                        if (menu.funcAuthList) {
                            _.each(menu.funcAuthList, function (auth) {
                                auth.menuCode = auth.parentId;
                                auth.parentId = menu.id;
                                res.data.push(auth);
                            });
                        }

                    });
                    _this.mainModel.data = res.data;
                })
            },
            doUpdate: function (value, flag) {
                var _this = this;
                if (flag === "add") {
                    // var obj = {
                    //     id: value.vo.id,
                    //     name: value.vo.name,
                    //     code: value.vo.code,
                    //     disable: value.vo.disable
                    // };
                    // this.mainModel.innerAddFun(obj);
                    _.forEach(value, function (item) {
                        _this.mainModel.innerAddFun({
                            id: item.id,
                            name: item.name,
                            code: item.code,
                            disable: item.disable
                        })
                    })
                } else {
                    //this.updateModel.show = false;
                    this.mainModel.treeGridName.data.name = value.name;
                    this.mainModel.treeGridName.data.code = value.code;
                    this.mainModel.treeGridName.data.disable = value.disable;
                }
                this.updateModel.show = false;
            }

        },
        ready: function () {
            this.retrieveData();
        }
    });
    return vm;
});