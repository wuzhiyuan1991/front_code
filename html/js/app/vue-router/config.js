define(function (require) {
    var LIB = require('lib');
    //引入注册组件
    var routerContent = require("./routerContent");

    LIB.Vue.use(LIB.VueRouter);
    var router = new LIB.VueRouter();

    //路由访问记录，用来通过计算一级路由地址到二级路由地址的映射历史
    //例如 访问顺序为  a/a1 、 b/b1， 当再访问 a 时会自动跳转到 a/a1
    //每一个一级路由都会映射最近访问的二级路由地址
    var routerHistory = {};
    var lastTranstionTime = 0;
    var homePage = LIB.getBusinessSetStateByNamePath("common.enableRptSummaryAsHomePage")? "/home/reportManagement/home" : "/home/work";
    //设置全局路由配置
    var initGlobalSetting = function () {

        // 别名映射对象的格式应该为 { fromPath: toPath, ... } 。路径中可以包含动态片段。
        router.alias({

            // 匹配 /a 时就像是匹配 /a/b/c
            //			'/' : '/foo'
            //			'' : '/foo',

            // 别名可以包含动态片段
            // 而且重定向片段必须匹配
            //			'/user/:userId' : '/user/profile/:userId'
        });
        //
        router.redirect({

            // 重定向 /a 到 /b
            '/': homePage,

            "/home": homePage,
            // 重定向可以包含动态片段
            // 而且重定向片段必须匹配
            '/user/:userId': '/profile/:userId',

            //			"/home" : {
            //				component: asynLoadComponentFunc('views/home/main')
            //			}

            // 重定向任意未匹配路径到 /home
            //			'*' : '/'
        });

        // 此钩子函数一个类型为切换对象的参数。
        router.beforeEach(function (transition) {
            var curTime = Date.now();
            var toFirstRouterPath = transition.to.path;
            //如果跳转的一级路由不为空， 并且存在一级路由的路由记录
            if (!_.isEmpty(toFirstRouterPath) && routerHistory[toFirstRouterPath]) {

                //计算一级路由地址
                var fromFirstRouterPath = transition.from.path;
                var splitIndex = transition.to.path.substr(1, 9999).indexOf("/");
                if (splitIndex != -1) {
                    fromFirstRouterPath = transition.from.path.substr(0, splitIndex);
                }

                //如果上一次点击的一级路由不为空， 并且和当前跳转的一级路由不同，则跳转到上一次一级路由映射的二级路由
                if (!_.isEmpty(fromFirstRouterPath) && fromFirstRouterPath != toFirstRouterPath) {
                    transition.redirect(routerHistory[toFirstRouterPath]);
                }

            }

            var menu = _.find(LIB.setting.menuList, function (item) {
                return item.attr1 === transition.to.path;
            });
            if (!menu) {
                transition.next();
                return;
            }
            if (!menu.attr2) {
                transition.next();
                lastTranstionTime = 0;
                return;
            }

            if (transition.to.path === '/forbidden') {
                transition.abort();
            } else {
                if (curTime - lastTranstionTime < 100) {
                    transition.abort();
                } else {
                    transition.next();
                }
            }
            lastTranstionTime = curTime;
        });

        // 此钩子函数一个类型为切换对象的参数，但是你只能访问此参数的 to 和 from 属性,
        // 这两个属性都是路由对象。在这个后置钩子函数里不能调用任何切换函数。
        router.afterEach(function (transition) {
            document.body.scrollTop = 0;
            var path = transition.to.path;
            var firstRouterPath = transition.to.path.substr(0, path.substr(1, 9999).indexOf("/") + 1);

            if (!_.isEmpty(firstRouterPath)) {
                //一级路由对二级路由的历史保存需要去掉二级路由的url参数,防止参数串扰,参数中包含keepUrlParam=true则保留
                if (path.indexOf("?") != -1 && path.indexOf("keepUrlParam=true") == -1) {
                    path = path.substring(0, path.indexOf("?"));
                }
                routerHistory[firstRouterPath] = path;
            }
        })


    };

    //初始化用户菜单路由配置
    var initCfg = function (menuData) {
        //异步加载组件
        var asynLoadComponentFunc = function (path) {
            return function (resolve) {
                require([path], function (vueComponent) {
                    resolve(vueComponent);
                });
            };
        };


        var routerCfg = {};

        _.each(menuData, function (item) {

            var subRoutesCfg = {};
            var routerPath = item.routerPath || "nullPath";

            //左侧一级菜单
            _.each(item.children, function (subItemFirst) {

                //					//如果存在二级路由路径 和 组件路径, 则配置
                if (subItemFirst.attr1 && subItemFirst.attr2) {

                    var subRouterPath = subItemFirst.routerPath || "nullPath";

                    //如果路由路径上设置了父路径，则去除父路径
                    subRouterPath = subRouterPath.replace(routerPath, "");

                    var componentPath = subItemFirst.componentPath || "nullPath";


                    //设置二级路由参数
                    subRoutesCfg[subRouterPath] = {
                        component: asynLoadComponentFunc(componentPath)
                    }

                }

                //左侧二级菜单
                _.each(subItemFirst.children, function (subItemSecond) {

                    //var subRouterPath = subItemSecond.path || "nullPath";
                    if (subItemSecond.routerPath) {
                        var _routerIndex = subItemSecond.routerPath.indexOf("?");
                        var _routerPath = _routerIndex > -1 ? subItemSecond.routerPath.substring(0, _routerIndex) : subItemSecond.routerPath;
                    }
                    var subRouterFullPath = _routerPath || "nullPath";

                    //一级菜单的默认二级路由
                    var subRouterPath4FirstRouterDefault = subItemSecond.routerPath;

                    //如果路由路径上设置了父路径，则去除父路径
                    var subRouterPath = subRouterFullPath.replace(routerPath, "");

                    var subRouterPathWithoutHead = subRouterPath.replace(routerPath, "");

                    var componentPath = subItemSecond.componentPath || "nullPath";

                    //设置二级路由参数
                    subRoutesCfg[subRouterPath] = {
                        component: asynLoadComponentFunc(componentPath)
                    };

                    //增加第一个二级路由地址为 一级路由的默认跳转地址
                    if (routerPath !== "nullPath" && subRouterFullPath !== "nullPath" && !routerHistory[routerPath]) {
                        //home比较特殊，hardcode到 /home/index
                        if (item.routerPath === "/home") {
                            subRouterFullPath = "/home/index";
                        }
                        //如果一级菜单有路由地址,则使用一级菜单的默认地址
                        if (item.attr2) {
                            subRouterFullPath = item.attr2;
                        }

                        routerHistory[item.routerPath] = subRouterPath4FirstRouterDefault;//subRouterFullPath;
                    }
                });
            });

            //设置一级路由参数
            routerCfg[routerPath] = {
                component: routerContent.initComponent(item), // item为含一级路由树结构对象
                subRoutes: subRoutesCfg
            };
        });

        //增加默认的组件测试页面
        var defaultTestCfg = {
            //"/jsa": { // 工作安全分析
            //    component: asynLoadComponentFunc('views/businessCenter/ptw/jsa/main')
            //},
            "/createCustomPaper": { // 策略组卷
                component: asynLoadComponentFunc('views/businessFiles/trainingManagement/customPaper/main')
            },
            "/riCheckTableTabPage": { // 巡检表巡检路线设置
                component: asynLoadComponentFunc('views/businessFiles/routingInspection/riCheckTable/tabpage/main')
            },
            "/riskMapSetting": {
                component: asynLoadComponentFunc('views/businessCenter/hiddenDanger/riskMap/setting')
            },
            "/courseEvaluationView": {
                component: asynLoadComponentFunc('views/businessFiles/trainingManagement/courseEvaluation/main')
            },
            "/courseEvaluation": {
                component: asynLoadComponentFunc('views/businessCenter/trainingManagement/evaluation/main')
            },
            "/test": {
                component: asynLoadComponentFunc('demo/componentDemo')
            },
            "/homeInfo": {
                component: asynLoadComponentFunc('views/home/main')
            },
            "/businessMenu": { //行业分类
                component: asynLoadComponentFunc('views-itm/basicSetting/businessMenu/main')
            },
            "/category": { //业务分类
                component: asynLoadComponentFunc('views-itm/basicSetting/businessMenu/main')
            },
            // 安全审查审查表详情
            "/auditTableInfo": {
                component: asynLoadComponentFunc('views-audit/tabs/table/main')
            },
            // 安全审查审核
            "/allotAudit": {
                component: asynLoadComponentFunc('views-audit/tabs/allot/main')
            },
            // 安全审查打分
            "/gradeAudit": {
                component: asynLoadComponentFunc('views-audit/tabs/grade/main')
            },
            // 安全审查确认
            "/confirmAudit": {
                component: asynLoadComponentFunc('views-audit/tabs/confirm/main')
            },
            // 流程条件
            "/workflowCondition": {
                component: asynLoadComponentFunc('views/businessCenter/hiddenGovernance/condition/main')
            },
            // 流程节点
            "/workflowNode": {
                component: asynLoadComponentFunc('views/businessCenter/hiddenGovernance/process/main')
            },
            //菜单分类
            "/tpaBusinessMenu": {
                component: asynLoadComponentFunc('views/basicSetting/basicFile/tpaBusinessMenu/main')
            },
            //tpa参数设置
            "/tpaParameter": {
                component: asynLoadComponentFunc('views/basicSetting/basicSetting/tpaParameter/main')
            },
            //businessSet参数设置
            "/businessSet": {
                component: asynLoadComponentFunc('views/basicSetting/systemSetting/businessSet/main')
            },

            // 安全审查审查表详情
            "/isaAuditTableInfo": {
                component: asynLoadComponentFunc('views-isa-audit/tabs/table/main')
            },
            // 安全审查审核
            "/isaAllotAudit": {
                component: asynLoadComponentFunc('views-isa-audit/tabs/allot/main')
            },
            // 安全审查打分
            "/isaGradeAudit": {
                component: asynLoadComponentFunc('views-isa-audit/tabs/grade/main')
            },
            // 安全审查确认
            "/isaConfirmAudit": {
                component: asynLoadComponentFunc('views-isa-audit/tabs/confirm/main')
            },
            "/viewLawsText": {
                component: asynLoadComponentFunc('componentsEx/lawDialog/lawDialog')
            },
            //技术论坛
            "/techForum": {
                component: asynLoadComponentFunc('views/businessCenter/forum/forum/main')
            }
        };

        var testNav = require("./testNav");

        _.each(_.keys(testNav), function (key) {
            defaultTestCfg[key] = {component: asynLoadComponentFunc(testNav[key])}
        });


        // 如果没有勾选首页菜单 则取第一个路由的第一个子路由
        if(routerCfg["/home"]) {
            var subHomeMenus = _.keys(routerCfg["/home"]["subRoutes"]);
            if(_.contains(subHomeMenus, "/index") && !_.contains(subHomeMenus, "/work")) {
                router.redirect({
                    '/': "/home/index",
                    "/home": "/home/index"
                });
            }
        } else {
            var _key = _.keys(routerCfg)[0];
            if(_key) {
                var _subKey = _.keys(routerCfg[_key]["subRoutes"])[0];
                router.redirect({
                    '/': _key + _subKey,
                    "/home": _key + _subKey
                });
            } else {
                LIB.Msg.warning("该角色未授权，请联系管理员", 10);
                return;
            }
        }
        // var subHomeMenus = _.keys(routerCfg["/home"]["subRoutes"]);
        // if (_.contains(subHomeMenus, "/index") && !_.contains(subHomeMenus, "/work")) {
        //     router.redirect({
        //         '/': "/home/index",
        //         "/home": "/home/index",
        //     });
        // }

        routerCfg = _.extend(routerCfg, defaultTestCfg);

        return routerCfg;
    };

    return {

        //参数参考 https://github.com/vuejs/vue-router/blob/1.0/docs/zh-cn/api/start.md
        //创建一个 App 的实例并且挂载到元素 el
        init: function (menuData, App, el) {

            initGlobalSetting();

            var routerCfg = initCfg(menuData);

            router.map(routerCfg);

            //设置默认路由为/foo， 当访问main.html 时会自动跳转到 main.html#!/foo
            //			router.go("/foo");

            router.start(App, el, function () {
            })

        },
        restructureData: routerContent.restructureData

    };

})
