define(function(require) {
    //基础js
    var LIB = require('lib');
    var tpl = LIB.renderHTML(require("text!./main.html"))
        //Vue数据模型
    var dataModel = function() {
        return {
            moduleCode: LIB.ModuleCode.BS_DaS_OnlU,
            tableModel: LIB.Opts.extendMainTableOpt({
                url: "logonline/list{/curPage}{/pageSize}",
                selectedDatas: [],
                columns: [
                    {
                        title: "",
                        fieldName: "sessionId",
                        fieldType: "cb",
                    },
                    {
                        title: this.$t("bd.trm.fullName"),
                        fieldName: "user.username",
                        filterType: "text",
                        filterName: "username",
                        width: 160
                            //fieldType: "custom",
                            //render: function (data) {
                            //    if (data.user) {
                            //        return data.user.username;
                            //    }
                            //}
                    },
                    {
                        title: this.$t("das.oniu.mobile"),
                        fieldName: "user.mobile",
                        filterType: "text",
                        filterName: "mobile",
                        width: 160
                            //fieldType: "custom",
                            //render: function (data) {
                            //    if (data.user) {
                            //        return data.user.mobile;
                            //    }
                            //}
                    },
                    {
                        title: this.$t("das.oniu.mail"),
                        fieldName: "user.email",
                        filterType: "text",
                        filterName: "email",
                        width: 200
                            //fieldType: "custom",
                            //render: function (data) {
                            //    if (data.user) {
                            //        return data.user.email;
                            //    }
                            //}
                    },
                    {
                        title: this.$t("das.oniu.loginCthd"),
                        fieldName: "loginType",
                        fieldType: "custom",
                        filterType: "enum",
                        filterName: "criteria.intsValue.loginType",
                        popFilterEnum: LIB.getDataDicList("login_type"),
                        dataDicKey: "login_type",
                        render: function(data) {
                            return LIB.getDataDic("login_type", data.loginType);
                            // if (data.loginType == "0") {
                            //     return "网页";
                            // } else {
                            //     return "手机";
                            // }
                        },
                        width: 100
                    },
                    {
                        title: this.$t("das.oniu.loginAddr"),
                        fieldName: "user.lastLoginQth",
                        filterType: "text",
                        filterName: "lastLoginQth",
                        width: 240
                            // fieldType: "custom",
                            //render: function (data) {
                            //    if (data.user) {
                            //        return data.user.lastLoginQth;
                            //    }
                            //}
                    },
                    {
                        title: this.$t("das.oniu.loginIp"),
                        fieldName: "user.lastLoginIp",
                        filterType: "text",
                        filterName: "lastLoginIp",
                        width: 160
                            //fieldType: "custom",
                            //render: function (data) {
                            //    if (data.user) {
                            //        return data.user.lastLoginIp;
                            //    }
                            //}
                    },
                    {
                        title: this.$t("das.oniu.loginTime"),
                        fieldName: "user.lastLoginDate",
                        filterType: "date",
                        filterName: "lastLoginDate",
                        width: 180
                            //fieldType: "custom",
                            //render: function (data) {
                            //    if (data.user) {
                            //        return data.user.modifyDate;
                            //    }
                            //}
                    }
                ]
            }),
            //控制全部分类组件显示
            mainModel: {
                //显示分类
                showCategory: false,
                showHeaderTools: false,
            },
            exportModel : {
                url: "/logonline/exportExcel",
                withColumnCfgParam: true
            },
            visible: false,
            items: null
        }

    };

    var vm = LIB.VueEx.extend({
        template: tpl,
        data: dataModel,
        computed: {
            superAdmin: function () {
                return LIB.user.id === '9999999999'
            }
        },
        methods: {
            // doTableCellClick: function (data) {}
            doShowData: function () {
                this.visible = true;
            },
            onDataLoaded: function (values) {
                this.items = _.map(values, function (v) {
                    return "error,0,JSESSIONID," + v.sessionId
                })
            }
        },
        //响应子组件$dispatch的event
        events: {}
    });
    return vm;
});