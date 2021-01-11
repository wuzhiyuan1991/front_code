define(function (require) {
    var LIB = require("lib");
    var template = require("text!./routerContent.html");
    var menuSideBar = require("./menuSideBar");
    var mCustomScrollbar = require("libs/jquery.mCustomScrollbar.min");

    var initOpts = function (menuData, menu) {
        var dataModel = function () {
            return {
                //一级路由左侧菜单数据源
                menu: menu,
                headerMenuData: menuData,//item.submenu
                currentRouterPath: null
            }
        };

        var opts = {
            template: template,
            components: {'menu-side-bar': menuSideBar},
            data: dataModel,
            ready: function () {
                this.$sidebar = $(".main-sidebar");
                this.buildScrollBar();
                this.registerScrollBarListener();
            },
            route: {
                activate: function (transition) {
                    //路由跳转后，需要展开menuSideBar的所选值
                    this.currentRouterPath = transition.to.path;
                    transition.next();
                },
                //此处不能注释， 空的canReuse方法可以 在二级路由切换时 触发  activate
                canReuse: function (transition) {
                }

            },
            methods: {
                doSideBarClick: function () {
                    LIB.asideMgr.hideAll();
                },
                buildScrollBar: function () {
                    this.$sidebar.mCustomScrollbar({
                        axis: "y", // horizontal scrollbar
                        theme: "minimal-dark",
                        mouseWheel: {
                            enable: true
                        },
                        scrollInertia: 60
                    });
                },
                registerScrollBarListener: function () {
                    var _this = this;

                    function destroyMc() {
                        this.$sidebar.mCustomScrollbar("destroy");
                    }

                    document.addEventListener("collapseSidebar", function (e) {
                        if (e.detail) {
                            _.throttle(destroyMc, 100);
                        } else {
                            _this.buildScrollBar();
                        }
                    });
                }
            }
        };
        return opts;
    };
    //菜单数据重组
    var restructureData = function (menuArr, idFieldName, pidFieldName, childrenFieldName) {
        //var menuData = [], hash = {}, id = idStr, pid = pidStr, children = chindrenStr, i = 0, j = 0, len = a.length;
        ////先取得所有的pid
        //_.each(a,function(i,index){
        //	hash[a[index][id]] = a[index];
        //});
        //
        //_.each(a,function(j,index){
        //	var aVal = a[index], hashVP = hash[aVal[pid]];
        //	if(hashVP){
        //		!hashVP[children] && (hashVP[children] = []);
        //		hashVP[children].push(aVal);
        //
        //	}else{
        //		menuData.push(aVal);
        //	}
        //});

        var menuData = [];

        var idMap = _.indexBy(menuArr, idFieldName);
        _.each(menuArr, function (data) {
            var parentMenu = idMap[data[pidFieldName]];
            if (parentMenu) {
                parentMenu[childrenFieldName] = parentMenu[childrenFieldName] || [];
                parentMenu[childrenFieldName].push(data);
            } else if (data.menuLevel == 1) { //确保是一级菜单
                menuData.push(data);
            }
        });


        //链接数据映射
        _.each(menuData, function (item) {

            //一级路由路径
            item.routerPath = item.attr1;

            _.each(item.children, function (subItemFirst) {

                //如果存在二级路由路径 和 组件路径, 则配置
                if (subItemFirst.attr1 && subItemFirst.attr2) {
                    //二级路由路径
                    subItemFirst.routerPath = subItemFirst.attr1;
                    //组件路径
                    subItemFirst.componentPath = subItemFirst.attr2;
                }


                _.each(subItemFirst.children, function (subItemSecond) {
                    //二级路由路径
                    subItemSecond.routerPath = subItemSecond.attr1;
                    //组件路径
                    subItemSecond.componentPath = subItemSecond.attr2;
                })
            })
        });


        var res = [];
        // 对一级菜单进行排序
        if(LIB.setting.menuConfig) {
            var sortArr = _.pluck(LIB.setting.menuConfig, 'id');
                // _menus = _.groupBy(menuData, 'id');

            var index = -1;
            _.forEach(sortArr, function (id) {
                // if(_menus[id]) {
                //     res.push(_menus[id][0])
                // }
                index = _.findIndex(menuData, function (item) {
                    return item.id === id;
                });
                if(index > -1) {
                    res = res.concat(menuData.splice(index, 1))
                }
            });

            res = res.concat(menuData);

            return res;
        }

        return menuData;

    };

    var initComponent = function (menuData) {
        //暂时不显示 /home下二级路由的目录
        var displayMenuData = _.filter(menuData.children, function (item) {
            //存在一级非路由菜单 || 一级菜单路由菜单不是 /home开头
            return !item.routerPath || item.routerPath.indexOf("/home") !== 0;
        });
        return LIB.Vue.extend(initOpts(displayMenuData, _.omit(menuData, 'children')));
    };

    return {
        initOpts: initOpts,
        initComponent: initComponent,
        restructureData: restructureData
    };
})
