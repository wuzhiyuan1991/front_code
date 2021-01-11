define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var tpl = require("text!./edit-func-menu.html");
    var linked=require("./minix_linkedmodual");
    var loading = new LIB.Msg.circleLoading();
    var newVO = function () {
        return {
            roleId: null,
            data: [],
            selectAll: false,
            menuList: [],
            compId:null
        }
    };

    //数据模型
    var dataModel = {
        mainModel: {
            vo: newVO(),
            disabled: false,
            roleIds: [],
            type: null
        },
        webAuthList: null,
        appAuthList: null,
        viewMode: 'web',
        appSelectAll: false,
        isAppEnable: false
    };

    //声明detail组件
    /**
     *  请统一使用以下顺序配置Vue参数， 方便codeview
     *    el
     template
     components
     componentName
     props
     data
     computed
     watch
     methods
     events
     vue组件声明周期方法
     created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
     **/
    var detail = LIB.Vue.extend({
        template: tpl,
        mixins:[linked],
        data: function () {
            return dataModel;
        },
        methods: {
            contentResize:function(event){
            },
            changeViewMode: function (mode) {
                if (this.viewMode === mode) {
                    return;
                }
                this.viewMode = mode;
                // if(mode==="app"&&!this.selLinkedApp.modualsHeight.length){ app展示不要模块联动
                //     this._computedHeight(this.selLinkedApp);
                // }
            },
            doSave: function () {
                var _this = this;
                var _vo  = this.mainModel.vo;
                var authList = [];
                _.each(_this.mainModel.vo.menuList,function(menu){
                    if(menu.isChecked && (menu.menuLevel === '3' || menu.attr1 === "/home/index")){
                        authList.push({type:0,relId:menu.id});
                    }
                    if(menu.menuLevel === '3' ){
                        _.each(menu.funcAuthList,function(auth){
                            if(auth.isChecked){
                                var funcAuth = {type:1,relId:auth.id};
                                authList.push(funcAuth);
                            }
                        });
                    }
                });


                var appList = _.filter(this.appAuthListCache, "isChecked", true);

                var appParam = _.filter(appList, "menuLevel", "2");
                appList = _.map(appParam, function (item) {
                    return {
                        type: 0,
                        relId: item.id
                    }
                });

                var params = {
                    roleAuthorityRels: authList,
                    roleAppAuthorityRels: appList
                };
                api.distributionMenuAndFuncByComp({compId:_vo.compId}, params).then(function () {
                    _this.$emit("do-edit-func-and-menu-finshed");
                    LIB.Msg.info("保存成功");
                });
            },
            doSaveBatch: function () {
                var _this = this;
                var _vo = this.mainModel.vo;
                var authList = [];
                _.each(_vo.menuList, function (menu) {
                    if (menu.isChecked && (menu.menuLevel === '3' || menu.attr1 === "/home/index")) {
                        authList.push({type: 0, relId: menu.id});
                    }
                    if (menu.menuLevel === '3') {
                        _.each(menu.funcAuthList, function (auth) {
                            if (auth.isChecked) {
                                var funcAuth = {type: 1, relId: auth.id};
                                authList.push(funcAuth);
                            }
                        });
                    }
                });

                var appList = _.filter(this.appAuthListCache, "isChecked", true);

                var appParam = _.filter(appList, "menuLevel", "2");
                appList = _.map(appParam, function (item) {
                    return {
                        type: 0,
                        relId: item.id
                    }
                });

                var params = {
                    roleAuthorityRels: authList,
                    roleAppAuthorityRels: appList
                };

                api.updateBatch({type: dataModel.mainModel.type, compIds: JSON.stringify(_this.mainModel.roleIds)}, params).then(function () {
                    _this.$emit("do-edit-func-and-menu-finshed");
                    LIB.Msg.info("保存成功");
                });
            },

            // 菜单的展开收起
            doChangeModule: function (first,index) {
                first.open = !first.open;
                this._recomputeItemHeight(first,index);
            },

            // 全选的
            _changeAllChecked: function () {
                var selectAll = this.mainModel.vo.selectAll;
                loading.show();
                _.forEach(this.mainModel.vo.menuList, function (menu) {
                    menu.isChecked = selectAll;
                    if (menu.menuLevel === '3') {
                        menu.allChecked = selectAll;
                        _.forEach(menu.funcAuthList, function (auth) {
                            auth.isChecked = selectAll;
                        })
                    }
                })
                setTimeout(function () {
                    loading.hide();
                },850)
            },

            _changeAppAllChecked: function () {
                var selectAll = this.appSelectAll;
                _.forEach(this.appAuthListCache, function (menu) {
                    menu.isChecked = selectAll;
                })
            },

            // 3级菜单, 当取消勾选时 清空功能权限
            _changeMenu3Checked: function (item) {
                var isChecked = item.isChecked;
                // if (!isChecked) {
                    item.allChecked = isChecked;
                    _.forEach(item.funcAuthList, function (auth) {
                        auth.isChecked = isChecked;
                    })
                // }
            },

            // id 0： 全选 、 1： 一级 、 2： 二级 、 3： 三级、 4： 三级全选 、 5： 功能权限 、 10： APP全选
            changeChecked: function (id, item, parent, grandParent) {
                if (id === 0) {
                    return this._changeAllChecked();
                }

                if (id === 10) {
                    return this._changeAppAllChecked();
                }

                var _this = this;
                var isChecked = item.isChecked;
                if (id === 1) {
                    _.forEach(item.children, function (v) {
                        v.isChecked = isChecked;
                        _.forEach(v.children, function (c) {
                            c.isChecked = isChecked;
                            _this._changeMenu3Checked(c);
                        })
                    })
                } else if (id === 2) {
                    _.forEach(item.children, function (c) {
                        c.isChecked = isChecked;
                        _this._changeMenu3Checked(c);
                    });
                    parent.isChecked = _.some(parent.children, "isChecked", true);
                } else if (id === 3) {
                    this._changeMenu3Checked(item);
                    parent.isChecked = _.some(parent.children, "isChecked", true);
                    grandParent.isChecked = _.some(grandParent.children, "isChecked", true);
                } else if (id === 4) {
                    _.forEach(item.funcAuthList, function (v) {
                        v.isChecked = item.allChecked;
                    })
                } else if (id === 5) {
                    item.allChecked = _.every(item.funcAuthList, "isChecked", true);
                }
            },

            // 单个权限设置
            _initWeb: function (compId) {
                LIB.globalLoader.show();

                var _vo = this.mainModel.vo;
                var _this = this;
                //清空数据
                _.extend(_vo, newVO());
                _vo.compId = compId;

                //获取菜单功能全部数据
                api.listMenu({compId: compId, attr3: 0}).then(function (res) {
                    var items = res.data;
                    if (_.isArray(items)) {
                        items = _.map(items, function (item) {
                            return {
                                id: item.id,
                                name: item.name,
                                menuLevel: item.menuLevel,
                                parentId: item.parentId,
                                attr1: item.attr1,
                                funcAuthList: item.funcAuthList
                            }
                        });
                        _this._getFunctionsByCompId(compId, items)
                    }
                });


            },

            _getFunctionsByCompId: function (compId, menus) {
                var _this = this;
                api.getFuncByCompId({compId: compId}).then(function (res) {
                    if (_.isArray(res.data)) {
                        _this._normalizeSingleData(menus, res.data);
                    }else{
                        _this._normalizeSingleData(menus, []);
                    }
                    LIB.globalLoader.hide();
                })
            },

            _normalizeSingleData: function (menus, features) {

                // 获取已有功能和权限的ID数组
                var featureIds = _.pluck(features, "relId");

                // 判断角色是否拥有功能和权限，并且判断三级菜单是否全选
                _.forEach(menus, function (menu) {
                    if (menu.menuLevel === '1') {
                        menu.open = true;
                    }
                    menu.isChecked = _.includes(featureIds, menu.id);
                    _.forEach(menu.funcAuthList, function (item) {
                        item.isChecked = _.includes(featureIds, item.id)
                    });
                    menu.allChecked = false;
                    if (_.isArray(menu.funcAuthList)) {
                        menu.allChecked = _.every(menu.funcAuthList, 'isChecked', true);
                    }
                });

                this.mainModel.vo.menuList = menus;
                var groupMenus = _.groupBy(menus, "parentId");

                // 将数据组成树形结构，并判断二级菜单是否选择
                _.forEach(menus, function (menu) {
                    menu.children = groupMenus[menu.id];
                    if (menu.menuLevel === '2' && _.isArray(menu.children)) {
                        menu.isChecked = _.some(menu.children, 'isChecked', true)
                    }
                });

                // 判断一级菜单是否选择
                var menuList = _.filter(menus, "menuLevel", "1");
                _.forEach(menuList, function (menu) {
                    menu.isChecked = _.some(menu.children, 'isChecked', true);
                });
                this.webAuthList = menuList;


                // 判断全选是否选择
                this.mainModel.vo.selectAll = _.every(menuList, 'isChecked', true);
                this._computedHeight(this.selLinked);
            },

            _initApp: function (compId) {
                var _this = this;
                api.getAppAllList().then(function (res) {
                    var items = res.data;
                    if (_.isArray(items)) {
                        api.getAppMenuList({compId: compId}).then(function (res2) {
                            var authList = res2.data || [];
                            _this._normalizeAppData(items, authList);
                        })
                    }
                });

            },
            _normalizeAppData: function (items, authList) {
                var group = _.groupBy(items, "parentId");
                var ids = _.pluck(authList, "relId");

                _.forEach(items, function (item) {
                    item.open = true;
                    item.isChecked = _.includes(ids, item.id);
                    item.children = group[item.id];
                });
                this.appAuthListCache = items;

                var level1List = _.filter(items, "menuLevel", "1");
                _.forEach(level1List, function (item) {
                    item.isChecked = _.some(item.children, "isChecked", true);
                });
                this.appAuthList = level1List;
                this.appSelectAll = _.every(items, "isChecked", true);


            },

            // 批量权限设置
            _initBatch: function (ids, type) {
                LIB.globalLoader.show();
                var _this = this;

                this.batchDeleteMode = (type === 2);

                var _vo = this.mainModel.vo;
                this.mainModel.roleIds = ids;
                this.mainModel.type = type;

                //清空数据
                _.extend(_vo, newVO());

                //获取菜单功能全部数据
                api.listAllMenu().then(function (res) {
                    if(_.isArray(res.data)) {
                        _this._normalizeBatchData(res.data);
                    }
                });

                if (this.isAppEnable) {
                    api.getAppAllList().then(function (res) {
                        var items = res.data;
                        if (_.isArray(items))  {
                            _this._normalizeAppData(items, [])
                        }
                    });
                }


                this.mainModel.disabled = true;
            },
            _normalizeBatchData: function (data) {
                var items = _.map(data, function (item) {
                    return {
                        id: item.id,
                        parentId: item.parentId,
                        name: item.name,
                        menuLevel: item.menuLevel,
                        funcAuthList: _.map(item.funcAuthList, function (func) {
                            return {
                                id: func.id,
                                name: func.name,
                                parentId: func.parentId
                            }
                        })
                    }
                });
                var groupData = _.groupBy(items, "parentId");

                _.forEach(items, function (item) {
                    item.isChecked = false;
                    item.children = groupData[item.id];

                    if (item.menuLevel === '1') {
                        item.open = true;
                    } else if (item.menuLevel === '3') {
                        item.allChecked = false;
                    }

                    _.forEach(item.funcAuthList, function (func) {
                        func.isChecked = false;
                    });
                });

                this.mainModel.vo.menuList = items;
                this.webAuthList = _.filter(items, "menuLevel", "1");
                this._computedHeight(this.selLinked);
                //这里置另便于重新加载
                LIB.globalLoader.hide();
            },

            getAppSetEnable: function () {
                var _this = this;
                api.getAppSetEnable().then(function (res) {
                    _this.isAppEnable = (res.data == '1');
                })
            },
            _init: function () {
                this.viewMode = 'web';
                this.appAuthList = null;
                this.appSelectAll = false;
            },
            //这里是模块联动 的方法， minix 到js里面去了 芳区其他地方调用，
            //若很多建议封装成组件   data 没有 暂时么有 minix sellinked 参考


        },
        events: {
            //edit框数据加载
            "ev_editFuncAndMenuReload": function (compId) {
                this._init();
                this.mainModel.disabled = false;
                this._initWeb(compId);
                if (this.isAppEnable) {
                    this._initApp(compId);
                }
            },
            "ev_editFuncAndMenuBatch": function (rows, type) {
                this._init();
                var ids = _.pluck(rows, "id");
                this.selLinked.modualsHeight=[];
                this.selLinkedApp.modualsHeight=[];
                this._initBatch(ids, type);
            }
        },
        ready: function () {
            this.getAppSetEnable();

        },
    
    });

    return detail;
});