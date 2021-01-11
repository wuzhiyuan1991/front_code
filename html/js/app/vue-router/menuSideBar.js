define(function (require) {
    var LIB = require("lib");
    var template = require("text!./menuSideBar.html");

    var opts = {
        template: template,
        props: {
            //菜单数据源
            values: {
                type: Array,
                default: function () {
                    return []
                }
            },
            currentRouterPath: {
                type: String
            },
            menu: {
                type: Object,
                default: function () {
                    return {}
                }
            }
        },
        data: function () {
            return {
                //菜单是否展开
                itemShow: '',
                subMenuShow: '',
                menuItemName: '',
                showClass: true, // 原本展开添加收缩
                onLoading: false,
                //控制菜单配置按钮是否显示
                showMenuConfig: false,
                menuConfigList: null
            }
        },
        watch: {
            currentRouterPath: function (val) {
                if (!_.isEmpty(val)) {
                    this.showMenu();
                }
                if (val === "/home/index" || val === "/homeInfo") {
                    this.showMenuConfig = false
                }
            },
            values: function (val) {
                console.log(val);
            }
        },
        methods: {
            toggle: function (item, expand) {
                this.itemShow = item;
                if (this.menuItemName == '') {
                    this.showClass = true;
                    this.menuItemName = item.name;
                } else {
                    if (this.menuItemName === item.name && this.showClass && !expand) {
                        this.showClass = false;
                    } else {
                        this.menuItemName = item.name;
                        this.showClass = true;
                    }
                }
            },
            doSubMenuItemClick: function (submenu) {
                if (submenu.tpaUrl && _.startsWith(submenu.tpaUrl, "http")) {
                    localStorage.setItem('iframeCallback', submenu.callBackContent);
                    this.$router.go(submenu.attr1 + "?src=" + submenu.tpaUrl);
                    return;
                }
                if (!this.onLoading) {
                    this.subMenuShow = submenu;
                    if (this.$router._currentRoute.path !== submenu.routerPath) {
                        this.onLoading = true;
                        if (LIB.asideMgr.hasVisibleOne()) {
                            LIB.asideMgr.hideAll();
                            this._doSubMenuItemClickDelayLoading(this, submenu);
                        } else {
                            this.$router.go(submenu.routerPath);
                            var _this = this;
                            setTimeout(function () {
                                _this.onLoading = false;
                            }, 400);
                        }
                    }
                }
            },
            _doSubMenuItemClickDelayLoading: _.debounce(function (_this, submenu, callBack) {
                _this.$router.go(submenu.routerPath);
                _this.onLoading = false;
            }, 400),

            //获取路由路径 展开菜单
            //router 为路由片段
            showMenu: function () {
                var _this = this;
                _.each(_this.values, function (subItemFirst) {
                    _.each(subItemFirst.children, function (subItemSecond) {
                        if (subItemSecond.routerPath === _this.currentRouterPath
                            || _.startsWith(_this.currentRouterPath, subItemSecond.routerPath)) {
                            //这里是取的他的父元素
                            _this.toggle(subItemFirst, true);
                            // _this.doSubMenuItemClick(subItemSecond);
                            _this.subMenuShow = subItemSecond;
                        }
                    });
                });
            }

        },
        ready: function () {
            // 菜单配置设置权限
            if (LIB.user.homeMenu) {
                var homeMenu = LIB.user.homeMenu.split(",");
                var menuList = LIB.LIB_BASE.setting.menuList;
                var homeMenuList = [];//3级菜单数组
                _.each(menuList, function (item) {
                    if (homeMenu.indexOf(item.id) > -1) {
                        homeMenuList.push(item);
                    }
                });
                //通过homeMenuList 获取 父级
                //var group = _.groupBy(homeMenuList,'parentId');
                //_.each(menuList,function(item){
                //    _.each(group,function(arr,key){
                //        if(item.id == key){
                //            var obj = _.extend({},item,{children:arr});
                //            addMenuList.push(obj);
                //        }
                //    });
                //});
                //this.menuConfigList = (_.indexBy(menuData,'attr1'))['/home'].children.concat(addMenuList);
                this.menuConfigList = homeMenuList;
            }
        }

    };

    return LIB.Vue.extend(opts);
});
