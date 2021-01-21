define("app/app", function (require) {
    var LIB = require('lib');
    var helper = require('../components/base-table/tableHelper')
    //注册mixin
    _.extend(LIB.VueMixin, {
        mainPanel: require("common/framework/mixin/mainPanel"),
        mainLegacyPanel: require("common/framework/mixin/mainLegacyPanel"),

        detailPanel: require("common/framework/mixin/detailPanel"),
        detailTabXlPanel: require("common/framework/mixin/detailTabXlPanel"),

        selectorTableModal: require("common/framework/mixin/selectModal"),
        formModal: require("common/framework/mixin/formModal"),
        safetyAudit: require("common/framework/mixin/safetyAudit"),
    });


    //初始化公共组件
    require('./mgr/componentMgr');

    //api接口
    var api = require('./vuex/api');



    //引入注册组件
    var menuHeaderOpts = require("./menuHeader");
    // 路由配置文件

    var routerCfg = require("app/vue-router/config");
    // 资源配置文件
    var resourceCfg = require("app/vue-resource/config");
    //初始化资源配置
    resourceCfg.init();


    //引入当前vue模板
    var template = require('text!app/app.html');
    var appNotice = require("./appNotice");


    var Vuex = require("vueX");
    var storeApp = require("./vuex/store");
    var actions = require("./vuex/actions");

    // 翻译
    var VueI18n = require('libs/vue-i18n.min');

    // var i18nLang = require('../../lang/i18n_cn');
    var i18nLang = require('../../lang/i18n_en');

    window.localStorage.setItem('i18n', JSON.stringify(i18nLang))

    // // 隐患定期排查

    // // var BC_Hal_InsP_Lang = require('../../lang/BC_Hal_InsP_cn');
    // var BC_Hal_InsP_Lang = require('../../lang/BC_Hal_InsP_en');
    // window.localStorage.setItem('tb_code_BC_Hal_InsP', JSON.stringify(BC_Hal_InsP_Lang))
    // // 隐患定期排查

    // // 隐患随机排查
    // // var BC_Hal_InsNR_Lang = require('../../lang/BC_Hal_InsNR__cn');
    // var BC_Hal_InsNR_Lang = require('../../lang/BC_Hal_InsNR_en');
    // window.localStorage.setItem('tb_code_BC_Hal_InsNR', JSON.stringify(BC_Hal_InsNR_Lang))

    // //    检查项
    // // var BD_HaI_CheI_Lang = require('../../lang/BD_HaI_CheI_cn');
    // var rBD_HaI_CheI_Lang = require('../../lang/BD_HaI_CheI_en');
    // window.localStorage.setItem('tb_code_BD_HaI_CheI', JSON.stringify(rBD_HaI_CheI_Lang))

    // //    检查项

    // // 检查表
    // // var BD_HaI_CheL_Lang = require('../../lang/BD_HaI_CheL_cn');
    // var rBD_HaI_CheL_Lang = require('../../lang/BD_HaI_CheL_en');
    // window.localStorage.setItem('tb_code_BD_HaI_CheL', JSON.stringify(rBD_HaI_CheL_Lang))
    // // 检查表
    // // 隐患随机排查



    // // var dataDic_Lang = require('../../lang/dataDic_cn');
    // var dataDic_Lang = require('../../lang/dataDic_en');
    // window.localStorage.setItem('dataDic', JSON.stringify(dataDic_Lang))

    // console.log(window.location.href)



    // setTimeout(() => {
    //     // window.history.replaceState(
    //     //     "",
    //     //     "",
    //     //     window.location.href
    //     // );
    //     location.reload();
    // }, 1000);


    LIB.Vue.use(VueI18n);
    LIB.Vue.config.lang = 'cn';
    var locales = {
        cn: {}
    };
    var cnLocale = locales.cn;
    var i18nCache = _.propertyOf(window)("cache.i18n")
    _.each(i18nCache, function (item) {
        cnLocale[item.code] = item.zhValue;
    });
    Object.keys(locales).forEach(function (lang) {
        LIB.Vue.locale(lang, locales[lang]);
    });




    // 翻译


    //插入模板到dom树
    document.getElementById("content").innerHTML = template;





    var startRouter = function (menuList) {
        //var headerMenuData=transData(headerMenuData, "id", "parentId", 'children');
        var headerMenuData = routerCfg.restructureData(menuList, "id", "parentId", 'children');

        var displayHeaderMenuData = headerMenuData;

        var searchModelFunc = function () {
            var obj = {
                params: "",
                code: "",
                searchList: [{
                    code: "BC_Hal_InsP",
                    path: "/hiddenDanger/businessCenter/inspectionPlan",
                    name: "检查计划",
                },
                {
                    code: "BC_Hal_InsR",
                    path: "/hiddenDanger/businessCenter/checkRecord",
                    name: "检查记录",
                },
                {
                    code: "BC_HaG_HazT",
                    path: "/hiddenGovernance/businessCenter/total",
                    name: "隐患总表",
                },
                {
                    code: "BC_TrM_TraR",
                    path: "/businessCenter/trainingManagement/trainingRecord",
                    name: "培训记录",
                },
                {
                    code: "BC_RiA_Hazl",
                    path: "/riskAssessment/businessFiles/riskAssessment",
                    name: "危害辨识",
                },
                {
                    code: "BD_HaI_CheL",
                    path: "/hiddenDanger/businessFiles/checkList",
                    name: "检查表",
                },
                {
                    code: "BD_HaI_CheI",
                    path: "/hiddenDanger/businessFiles/checkItem",
                    name: "检查项",
                },
                {
                    code: "BD_RiA_InsM",
                    path: "/expertSupport/businessFiles/checkMethod",
                    name: "检查方法",
                },
                {
                    code: "BD_RiA_InsB",
                    path: "/expertSupport/businessFiles/inspectionBasis",
                    name: "检查依据",
                },
                {
                    code: "BD_RiA_IncC",
                    path: "/expertSupport/businessFiles/accidentCase",
                    name: "事故案例",
                },
                ]
            };


            //过滤有权限的菜单, 才可以进行搜索, attr1 是 浏览器路由地址， attr2 是js组件路径 
            var allPath = _.chain(menuList).filter(function (item) { return !!item.attr2; }).map("attr1").value();
            obj.searchList = _.filter(obj.searchList, function (item) { return _.contains(allPath, item.path); });
            obj.searchMap = _.indexBy(obj.searchList, "code");

            return obj;
        }

        var dataModel = {
            rightSlidePanelName: '',

            formModal: {
                curFormModal: {
                    show: false,
                    title: ""
                },
                menuConfigFormModal: {
                    show: false,
                    title: "菜单配置"
                }
            },

            collapseSideBar: false,
            logocur: false,
            headerMenuData: displayHeaderMenuData,
            showLeftSider: false,
            searchShow: false,
            searchModel: searchModelFunc(),
            detailPersonInfoModel: {
                show: false
            },
            detailContactsModel: {
                show: false
            },
            //detailWorkbenchModel: {
            //    show: false
            //},
            detailScheduleModel: {
                show: false
            },
            detailMailListModel: {
                show: false
            },
            detailGroupModel: {
                show: false
            },
            menuConfigModal: {
                show: false,
                title: "菜单配置"
            },
            headerFaceUrl: null,
            headerFace: null,
            //是否显示自定义头像
            headerShowImg: false,
            //是否显示右上角下拉菜单模块
            ShowMenuList: false,
            headerStyle: null,
            workState: null,
        };


        var lazyLoadComponent = { "personalInfoDetail": 0, "menuConfig": 0 };

        // 定义路由实例
        var poptip = require("components/directives/poptip");
        var App = LIB.Vue.extend({
            data: function () {
                return dataModel
            },
            components: {
                'menu-header': menuHeaderOpts,
                "personalInfoDetail": function (resolve, reject) {
                    var _this = this;
                    require(['app/views/personalInfo/detail'], function (data) {
                        resolve(data);
                        lazyLoadComponent["personalInfoDetail"] = 1;
                        _this.doShowPersonInfoDetail();

                    });
                },
                'app-notice': appNotice
            },
            directives: {
                poptip: poptip
            },
            computed: {
                classes: function () {
                    var obj = {};
                    obj['sidebar-collapse'] = this.collapseSideBar;
                    return [
                        "wrap", "sidebar-mini", obj
                    ];
                },
                styleObj: function () {
                    var obj = {
                        'color': 'rgb(255, 255, 255)',
                        'border-radius': '10px',
                        'font-size': '1px',
                        'margin-bottom': '-25px',
                        'margin-right': '-25px',
                        'z-index': '999',
                    };
                    if (this.workState === '1') {
                        obj.backgroundColor = "#aacd03";
                    } else {
                        obj.backgroundColor = "#f03";
                    }
                    return obj;
                },
                showWorkState: function () {
                    return LIB.user.username != 'sysadmin' && LIB.user.username != 'superadmin' && LIB.getBusinessSetStateByNamePath("common.enableUserWorkState");
                }
            },
            methods: {
                doDisplay: function () {
                    this.headerStyle = {
                        visibility: 'visible'
                    };
                },
                doClickHeader: function () {
                    LIB.asideMgr.hideAll();
                },
                doToggle: function () {
                    this.collapseSideBar = !this.collapseSideBar;
                    this.logocur = !this.logocur;
                    if (helper.isIE()) {
                        var ev = document.createEvent("CustomEvent");
                        ev.initCustomEvent("collapseSidebar", false, false, this.collapseSideBar);
                    } else {
                        var ev = new CustomEvent("collapseSidebar", {
                            "detail": this.collapseSideBar
                        })
                    }
                    helper.setSidebarState(this.collapseSideBar);
                    document.dispatchEvent(ev);
                },
                doSearch: function () {
                    this.$refs.searchList.hideMenu();
                    LIB.asideMgr.hideAll();
                    if (this.searchModel.code && this.searchShow && this.searchModel.params) {
                        var searchObj = this.searchModel.searchMap[this.searchModel.code];
                        var curSearchPath = searchObj.path;
                        //路由跳转
                        this.$router.go(curSearchPath);
                        //构造搜索对象，并执行搜索
                        var searchData = {};
                        searchData.value = { displayName: "关键字", filterName: "criteria.strValue.keyWordValue", filterValue: this.searchModel.params };
                        searchData.code = this.searchModel.code;
                        this.updateSearchKey(searchData);
                    }
                    this.searchShow = true;
                },
                //组止冒泡
                doCurrentTarget: function (e) {
                    e.stopPropagation();
                },
                //右滑窗
                doShowPersonInfoDetail: function () {

                    this.rightSlidePanelName = "personalInfoDetail";

                    if (lazyLoadComponent["personalInfoDetail"] > 0) {
                        this.detailPersonInfoModel.show = !this.detailPersonInfoModel.show;
                        LIB.asideMgr.hideAll();
                        this.$broadcast('ev_detailDataReload');
                    }

                },
                doDownLoad: function (downloadNumber) {
                    this.$broadcast('ev_download', downloadNumber)
                },
                //点击退出系统
                doLogout: function () {
                    LIB.Modal.confirm({
                        title: '确定退出登录?',
                        onOk: function () {
                            var logoutActionUrl = window.localStorage.getItem("logoutActionUrl");//自定义登出地址
                            if (!logoutActionUrl) {
                                api.logout().then(function (data) {
                                    if (data.status == 200) {
                                        document.location = LIB.ctxPath();
                                    }
                                }, function () {//如果session失效，则直接跳转到登录页
                                    document.location = LIB.ctxPath();
                                });
                            } else {
                                $.ajax({
                                    url: LIB.ctxPath() + logoutActionUrl,
                                    async: false,
                                    success: function (res) {
                                        //如果自定义的登出逻辑异常了， 则返回的安全眼默认的登出页面 /logout, 则调用默认登出逻辑
                                        if (res.content == "/logout") {
                                            api.logout().then(function (data) {
                                                if (data.status == 200) {
                                                    document.location = LIB.ctxPath();
                                                }
                                            }, function () {//如果session失效，则直接跳转到登录页
                                                document.location = LIB.ctxPath();
                                            });
                                        } else { //调用自定义的登出逻辑
                                            document.location = res.content;
                                        }
                                    }, error: function () {
                                        document.location = LIB.ctxPath();
                                    }
                                });

                            }
                        }
                    });
                },
                doMenuDown: function () {
                    this.ShowMenuList = true
                },
                doMenuUp: function () {
                    this.ShowMenuList = false
                },
                //点击联系人工作台
                contacts: function () {
                    this.detailContactsModel.show = !this.detailContactsModel.show;
                    LIB.asideMgr.hideAll();
                    this.$broadcast('ev_detailContactsReload');
                },
                ////点击联系人日程
                //workbench: function() {
                //    this.detailWorkbenchModel.show = !this.detailWorkbenchModel.show;
                //    LIB.asideMgr.hideAll();
                //},
                //点击联系人知识库
                schedule: function () {
                    this.detailScheduleModel.show = !this.detailScheduleModel.show;
                    LIB.asideMgr.hideAll();
                    this.$broadcast('ev_detailScheduleReload');
                },
                //点击通讯录
                mailList: function () {
                    this.detailMailListModel.show = !this.detailMailListModel.show;
                    LIB.asideMgr.hideAll();
                    this.$broadcast('ev_detailMailListReload');
                },
                //点击群组
                group: function () {
                    var name = LIB.user.mobile;
                    var password = LIB.user.password;
                    if (LIB.user.attr4 == 1) {
                        window.open(LIB.ctxPath("/html/js/app/views/webim/main.html?name=" + name + "&password=" + password));
                    } else {
                        LIB.Msg.warning("请注册环信账号");

                    }

                },
                jump: function (params) {
                    this.setGoToInfoData(params)
                },
                //菜单配置关闭
                doMenuFinshed: function () {
                    // this.menuConfigModal.show = false;

                    this.formModal.curFormModal = this.formModal.menuConfigFormModal;

                    if (lazyLoadComponent["menuConfig"] > 0) {
                        this.formModal.curFormModal.show = !this.formModal.curFormModal.show;
                        // LIB.asideMgr.hideAll();
                        // this.$broadcast('ev_detailDataReload');
                    }
                },
                /**
                 * 隐藏左上角logo的路由配置
                 */
                toggleShowLeftSider: function () {
                    var path = this.$route.path;
                    var hiddenList = [
                        '/allotAudit',
                        '/confirmAudit',
                        '/gradeAudit',
                        '/auditTableInfo',
                        '/workflowCondition',
                        '/workflowNode',
                        '/riCheckTableTabPage',
                        '/isaAllotAudit',
                        '/isaConfirmAudit',
                        '/isaGradeAudit',
                        '/isaAuditTableInfo',
                        '/viewLawsText'

                    ];
                    var needHidden = hiddenList.some(function (item) {
                        return path.indexOf(item) === 0
                    });
                    if (needHidden) {
                        this.showLeftSider = false;
                    } else {
                        this.showLeftSider = true;
                    }
                },
                getCurUserInfo: function () {
                    var _this = this;
                    $.ajax({
                        url: "/user/" + LIB.user.id,
                        success: function (res) {
                            if (res.content) {
                                _this.workState = res.content.workState;
                            }
                        }
                    });
                },
            },
            events: {
                "ev_detailColsed": function () {
                    //this.detailPersonInfoModel.show = false;
                    this.doLogout();
                },
                "ev_download": function (downloadNumber) {
                    //this.detailPersonInfoModel.show = false;
                    this.doDownLoad(downloadNumber);
                },
                "ev_detailShutDown": function () {
                    this.detailPersonInfoModel.show = false;
                    //this.detailContactsModel.show =false;
                },
                "ev_headerFace": function (data) {
                    this.headerFace = data;
                },
                "ev_menuConfig": function () {
                    this.menuConfigModal.show = true;
                    this.$broadcast('ev_editMenuReload');
                    //this.$emit("doMenu")
                },
                "ev_fileReload": function (name) {
                    this.$broadcast('ev_homeReload', name);
                },
                "ev_workState": function (workState) {
                    this.workState = workState;
                }
            },
            watch: {
                headerFace: function () {
                    if (this.headerFace) {
                        this.headerShowImg = true;
                        if (LIB.isURL(this.headerFace.face)) {
                            this.headerFaceUrl = this.headerFace.face;
                        } else {
                            this.headerFaceUrl = LIB.convertPicPath(this.headerFace.faceid);
                        }
                    } else {
                        this.headerShowImg = false;
                    }
                },
                path: function (val) {
                    var that = this;
                    if (val) {
                        // LIB.asideMgr.hideAll();
                        // _.delay(function() {
                        // that.$router.go(val);
                        // }, 350)
                        var extra = "";
                        if (!_.isEmpty(this.pathExtra)) {
                            extra = LIB.urlEncode(this.pathExtra);
                        }
                        if (this['checktaskIsBegin']) {//检查任务未开始时，添加参数
                            window.open('/html/main.html#!' + val + '?method=' + this.pathMethod + '&id=' + this.pathId + '&checktaskIsBegin=0' + "&code=" + this.pathCode + extra);
                        } else {
                            window.open('/html/main.html#!' + val + '?method=' + this.pathMethod + '&id=' + this.pathId + "&code=" + this.pathCode + extra);
                        }

                        this.clearGoToInfoData()
                    }
                },
                '$route.path': function (val) {
                    var _this = this;
                    setTimeout(function () {
                        _this.toggleShowLeftSider();
                    }, 100);
                }
            },
            ready: function () {

                if (!!window.logoImgUrl) {
                    var logoUrl = window.logoImgUrl;
                    var imgLogoUrl = logoUrl.replace("scale", "grep");
                    document.getElementById("saiWeiLogo").src = imgLogoUrl;
                }

                var _this = this;
                helper.registerJump(_.bind(this.jump, _this));
                //延迟100毫秒加载，增加动画效果和异步数据加载
                var ticket = setTimeout(function () {
                    // _this.showLeftSider = false;
                    _this.toggleShowLeftSider();
                    clearTimeout(ticket);
                }, 100);

                //点击其他地方隐藏搜索
                document.addEventListener('click', function (e) {
                    if (e.target) {
                        _this.searchShow = false;
                    }
                });

                //点击滚动条时触发点击事件
                document.addEventListener('mousedown', function (e) {
                    var overlapHeight = (e.target.scrollHeight - e.target.clientHeight);
                    var offsetVerticalScrollerBar = (e.target.scrollWidth - e.offsetX);
                    var clsList = e.target.classList,
                        parentClsList = e.target.parentNode.classList;
                    if (
                        overlapHeight > 0 &&
                        offsetVerticalScrollerBar < 1 &&
                        !clsList.contains("ivu-select-dropdown") &&
                        !clsList.contains("ivu-picker-panel-sidebar") &&  // 报表时间区选择组件
                        !clsList.contains("ivu-cascader-menu") && // 报表统计项目
                        !clsList.contains("ivu-time-picker-cells-list") && // 时间选择器
                        !parentClsList.contains("navBarlist") &&
                        !clsList.contains("ivu-transfer-list-body-box") && // 报表对象选择弹窗
                        !clsList.contains("table-ivu-dropdown-menu") &&
                        !clsList.contains("ivu-select-dropdown-list") // 所属公司 下拉框组件
                    ) {
                        var ev = document.createEvent('MouseEvent');
                        ev.initEvent('click', false, false);
                        document.dispatchEvent(ev);
                    }
                });

                //给select一个默认值
                _this.searchModel.code = "BC_Hal_InsP";
                if (LIB.user.faceid) {
                    _this.headerShowImg = true;
                    if (LIB.isURL(LIB.user.face)) {
                        _this.headerFaceUrl = LIB.user.face;
                    } else {
                        _this.headerFaceUrl = LIB.convertPicPath(LIB.user.faceid);
                    }
                } else {
                    _this.headerShowImg = false;
                }
                this.getCurUserInfo();

            },

            /*************************************************************************/
            //vuex模型层，用于提供事件响应处理
            store: storeApp,
            /*************************************************************************/
            //vuex 提供数据和事件响应
            vuex: {
                getters: {
                    searchKey: function (store) {
                        return store.search.searchKey;
                    },
                    path: function (store) {
                        return store.search.goToInfoData.opt.path;
                    },
                    pathMethod: function (store) {
                        return store.search.goToInfoData.opt.method;
                    },
                    pathId: function (store) {
                        return store.search.goToInfoData.vo.id;
                    },
                    'checktaskIsBegin': function (store) {
                        return store.search.goToInfoData.vo['checktaskIsBegin'];
                    },
                    pathCode: function (store) {
                        return store.search.goToInfoData.vo.code;
                    },
                    pathExtra: function (store) {
                        return store.search.goToInfoData.extra;
                    },
                    poptipData: function (store) {
                        return JSON.stringify(store.search.poptipData);
                    }
                },
                actions: {
                    updateSearchKey: actions.updateSearchKey,
                    setGoToInfoData: actions.updateGoToInfoData,
                    clearGoToInfoData: actions.clearGoToInfoData
                }
            },
            init: function () {
                var _this = this;
                _.each(LIB.tableMgr.column, function (item) {
                    if (item.title.startsWith('this.')) {
                        item.title = eval(item.title.replace('this.', '_this.'));
                    }
                })
                _.each(LIB.tableMgr.ksColumn, function (item) {
                    if (item.title.startsWith('this.')) {
                        item.title = eval(item.title.replace('this.', '_this.'));
                    }
                })
            }

        });


        routerCfg.init(headerMenuData, App, '#app-main-panel');
    }
    startRouter(LIB.setting.menuList);



});
