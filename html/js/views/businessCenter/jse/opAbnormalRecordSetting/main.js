define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //查看弹框页面
    //数据模型
    var COMPID = '9999999999';
    var newVO = function () {
        return {
            configJson: null,
            type: "SYSTEM_ENV"
        }
    };
    var modelNameMap = {
    	common:'commonModel',
        checkResult: 'checkResultModal',
        checkTaskSet: 'checkTaskSetModel',
        radomObserSet: 'radomObserSetModel',
        dailyInspection: 'dailyInspectionModel',
        poolGovern: 'poolGovernModel',
        training: 'trainingModel',
        reportFunction: 'reportFunctionModel',
        asmtTaskSet: 'asmtTaskSetModel',
        checkSubmit: 'checkSubmitModel',
        amstResult: 'amstResultModel',
        tableBatchHandle:'tableBatchHandleModel',
        routingInspection: 'routingInspectionModel',
        riskjudgmenttask:'riskJudgmentTaskModel',
        incentiveMechanism: 'incentiveMechanismModel',
        emer:'emerModel',
        safetyAudit: 'safetyAuditModel',
        opAbnormalRecord:'opAbnormalRecordModel'
    };
    //初始化页面控件
    var dataModel = {
        defaultLogoImage: "/html/images/sw-logo.jpg",
        defaultLgImage: "/html/images/login.png",
        defaultBgImage: "/html/images/bg.jpg",
        moduleCode: LIB.ModuleCode.BS_BaC_ComI,
        tabIndex: 1,
        versions: null,
        mainModel: {
            configJson: null,
            type: "SYSTEM_ENV",
            vo: newVO(),
            title: null,
            slogan:null,
            iconName: null,
            iosname:null,
            logoName: null,
            lgName: null,
            bgName: null,
            uploadModel: [],
            logoModel: [],
            lgModel: [],
            bgModel: [],
            skin: null,
        },

        //图片id
        fileIdInfo: null,
        fileIdUrl: null,
        //显示图片地址
        icon: null,
        logo: null,
        lgImg: null,
        bgImg: null,
        apkImg: null,
        iosImg:null,
        watermark: '',
        obj: null,
        //显示图片
        showImg: null,
        obj1: null,
        showPlanType: false,
        commonModel: {
            vo: {
                children: null
            },
            show: false,
        },
        routingInspectionModel: {
            vo: {
                children: null
            },
            show: false,
        },
        checkResultModal: {
            vo: {
                children: null
            },
            compId: '',
            show: false,
            visible: false
        },
        checkTaskSetModel: {
            vo: {
                children: null
            },
            show: false
        },
        incentiveMechanismModel : {
            vo: {
                children: null
            },
            show: false
        },
        emerModel: {
            vo: {
                children: null
            },
            show: false
        },
        radomObserSetModel: {
            vo: {
                children: null
            },
            show: false
        },
        dailyInspectionModel: {
            vo: {
                children: null
            },
            show: false
        },
        poolGovernModel: {
            vo: {
                children: null
            },
            show: false
        },
        trainingModel: {
            vo: {
                children: null
            },
            show: false
        },
        reportFunctionModel: {
            vo: {
                children: null
            },
            show: false
        },
        asmtTaskSetModel: {
            vo: {
                children: null
            },
            show: false
        },
        tableBatchHandleModel: {
            vo: {
                children: null
            },
            show: false
        },
        safetyAuditModel: {
            vo: {
                children: null
            },
            show: false
        },
        checkSubmitModel: {
            vo: {
                children: null
            },
            show: false
        },
        illegalRecordModel:{
            vo: {
                children: null
            },
            show: false
        },
        opAbnormalRecordModel:{
            vo: {
                children: null
            },
            show: false
        },
        amstResultModel: {
            vo: {
                children: null
            },
            show: false
        },
        riskJudgmentTaskModel:{
            vo: {
                children: null
            },
            show: false
        },
    };
    //使用Vue方式，对页面进行事件和数据绑定
    var vm = LIB.Vue.extend({
        template: require("text!./main.html"),
        components: {
        },
        computed: {
            isSuperAdmin: function () {
                return LIB.user.id === '9999999999';
            }
        },
        data: function () {
            return dataModel
        },
        methods: {
            changeTabIndex: function (index) {
                this.tabIndex = index;
                if (index === 3) {
                    this._queryVersions();
                }
            },

            // 版本信息start ----------------------------------------------
            _queryVersions: function () {
                var _this = this;
                var defaultDescription = '无更新说明';
                if (_.isArray(this.versions)) {
                    return;
                }
                api.queryVersions().then(function (res) {
                    _this.versions = _.map(res.data, function (v) {
                        return {
                            date: v.versionDate ? v.versionDate.substr(0, 16) : '',
                            description: v.description || defaultDescription,
                            serialNo: v.serialNo,
                            show: true
                        }
                    })
                })
            },
            // 版本信息end ----------------------------------------------

            // 系统参数start ---------------------------------------------
            logoUploadModel: function (data) {
                this.mainModel.logoName = data.file.name;
                this.logo = LIB.convertPicPath(data.rs.content.id);
                this.logoImg = true;
            },
            lgUploadModel: function (data) {
                this.mainModel.lgName = data.file.name;
                this.lgImg = LIB.convertPicPath(data.rs.content.id, '4');
                this.backBoxImg = true;
            },
            bgUploadModel: function (data) {
                this.mainModel.bgName = data.file.name;
                this.bgImg = LIB.convertPicPath(data.rs.content.id, '0');
                this.backgroundImg = true;
            },
            apkUploadModel: function (data) {
                this.apkImg = LIB.convertPicPath(data.rs.content.id, '0');
            },
            iosUploadModel: function (data) {
                this.iosImg = LIB.convertPicPath(data.rs.content.id, '0');
            },
            doDeleteImg: function (t) {
                switch (t){
                    case 1: this.logo = this.defaultLogoImage;
                        break;
                    case 2: this.lgImg = this.defaultLgImage;
                        break;
                    case 3: this.bgImg = this.defaultBgImage;
                        break;
                    case 4: this.apkImg = '';
                        break;
                    case 5: this.iosImg = '';
                        break;
                }
            },
            
            save: function () {
                var _vo = this.mainModel.vo;
                var _this = this;
                var configJson = {
                    skin: _this.mainModel.skin,
                    title: _this.mainModel.title,
                    slogan: _this.mainModel.slogan,
                    iconName: _this.mainModel.iconName,
                    logoName: _this.mainModel.logoName,
                    lgName: _this.mainModel.lgName,
                    bgName: _this.mainModel.bgName,
                    iosname: _this.mainModel.iosname,
                    icon: _this.icon,
                    logo: _this.logo,
                    lgImg: _this.lgImg,
                    bgImg: _this.bgImg,
                    apkImg: _this.apkImg,
                    iosImg:_this.iosImg
                };
                _vo.configJson = JSON.stringify(configJson);
                if (_this.obj === "E30000") {
                    api.save(_vo).then(function (data) {
                        LIB.Msg.info("新增成功！");
                        _this.obj = null;
                    });
                } else {
                    api.update(_vo).then(function (data) {
                        // console.log(configJson);
                        LIB.Msg.info("修改成功！");
                    });
                }
            },
            // 系统参数end

            // 业务参数start -----------------------------------------------
            toggleSetItem: function (name) {
                this[modelNameMap[name]].show = !this[modelNameMap[name]].show;
                if(this[modelNameMap[name]].show) {
                    this.getBusinessSet(name, this.checkResultModal.compId);
                }
            },
            /**
             *
             * @param type 类型
             *      检查记录：checkResult
             *      检查任务：checkTaskSet
             *      随机观察：radomObserSet
             *      非计划检查：dailyInspection
             *      隐患治理：poolGovern
             *      报表功能：reportFunction
             *      自评任务：asmtTaskSet
             * @param compId 公司Id
             */
            getBusinessSet: function (name, compId) {
                var _this = this;
                var param = {
                    name: name
                };
                if(name === 'checkResult') {
                    param.compId = compId;
                } else {
                    param.compId = COMPID;
                }
                api.getParameters(param).then(function (res) {
                    _this[modelNameMap[name]].vo = res.data;
                });
            },
            saveBusiness: function (name) {
                var params = this[modelNameMap[name]].vo;

                // 安全审核需要
                if(name === 'safetyAudit'){
                    var children = params.children;
                    var trueObj = _.find(children, function (item) {
                        return item.result === '2'
                    });
                    if(!trueObj){
                        LIB.Msg.warning("至少勾选一个选项");
                        return
                    }
                }

                // 自评任务需要验证
                if(name === 'asmtTaskSet') {
                    var errorResult = _.find(params.children, function (item) {
                        var temp = parseInt(item.result);
                        return (item.name === 'auditDateLimit' || item.name === 'asmtDateLimit') && (temp < 1 || temp > 999);
                    });
                    if (errorResult) {
                        LIB.Msg.warning(errorResult.description + "须在1-999之间");
                        return;
                    }
                }
                if (name === 'reportFunction' || name === 'tableBatchHandle') {
                    var numLimit = _.find(params.children, function (item) {
                        return item.name === 'dataNumLimit';
                    })
                    var num = Number(numLimit.result);
                    if (!num || num < 1) {
                        return LIB.Msg.warning(numLimit.description + "必须大于0");
                    }
                }
                api.saveBusinessSet(params).then(function () {
                    LIB.Msg.info("保存成功");
                    var tb=window.localStorage.getItem("org_data_level");
                    window.localStorage.setItem("org_data_level",parseInt(tb)+1);
                });
            },
            checkItemChange: function (item, type) {
                /**
                 *  result: 1 未选 3 选择 2 半选
                 *  isDefault: 1：否，  2： 是
                 */
                //不涉及
                if(type === 'noRefer') {
                    //1. 先保存选择结果
                    var selectResult = item.isDefault === '1' ? '2' : '1';
                    //2. 只能单选所以先，清空所有选项
                    _.each(this.checkResultModal.vo.children, function (v) {
                        v.isDefault = '1';
                    });
                    //3. 设置结果
                    item.isDefault = selectResult;
                } else {
                    item.result = item.result === '1' ? '3' : '1';
                }
            },
            notCheckItemChange: function (item) {
                // result: 1-否, 2-是
                item.result = item.result === '1' ? '2' : '1';
            },
            changeAsmtRequired: function (item) {
                var _o;
                if (item.name === 'isAsmtScore') {
                    item.result = item.result === '1' ? '0' : '1';
                    return;
                }
                if (item.name === 'asmtPic') {
                    _o = _.find(this.asmtTaskSetModel.vo.children, function (item) {
                        return item.name === 'asmtText';
                    });
                    if (item.result === '1' && _o.result === '0') {
                       LIB.Msg.warning("个人自评时图片和文字至少需要一项")
                    } else {
                        item.result = item.result === '1' ? '0' : '1';
                    }
                } else if (item.name === 'asmtText') {
                    _o = _.find(this.asmtTaskSetModel.vo.children, function (item) {
                        return item.name === 'asmtPic';
                    });
                    if (item.result === '1' && _o.result === '0') {
                        LIB.Msg.warning("个人自评时图片和文字至少需要一项")
                    } else {
                        item.result = item.result === '1' ? '0' : '1';
                    }
                }
            },
            changeAsmtWeight: function (event) {
                var value = event.target.valueAsNumber || 0;
                var asmtWeight = _.find(this.asmtTaskSetModel.vo.children, function (item) {
                    return item.name === 'asmtWeight';
                });
                var auditWeight = _.find(this.asmtTaskSetModel.vo.children, function (item) {
                    return item.name === 'auditWeight';
                });
                var _v = value;
                if (value <= 0 ) {
                    asmtWeight.result = 0;
                    _v = 0;
                } else if (value > 100) {
                    asmtWeight.result = 100;
                    _v = 100;
                }

                auditWeight.result = 100 - _v;
            },
            changeAuditWeight: function () {
                var value = event.target.valueAsNumber || 0;
                var asmtWeight = _.find(this.asmtTaskSetModel.vo.children, function (item) {
                    return item.name === 'asmtWeight';
                });
                var auditWeight = _.find(this.asmtTaskSetModel.vo.children, function (item) {
                    return item.name === 'auditWeight';
                });
                var _v = value;
                if (value <= 0 ) {
                    auditWeight.result = 0;
                    _v = 0;
                } else if (value > 100) {
                    auditWeight.result = 100;
                    _v = 100;
                }

                asmtWeight.result = 100 - _v;
            },
            moreSettingClick: function (description, item) {
                this.$broadcast('ev_dtReload', description, item, this.checkResultModal.compId);
                this.checkResultModal.visible = true;
            },
            //保存重点监管部门
            doSaveDeptsForSupervisePoint:function(selectedDatas){
                var _this = this;
                var formData = _.map(selectedDatas, function(data){
                    return {organization:{id:data.id}};
                });
                api.addSupervisePointDept(formData).then(function(rep){
                    _this.doRefreshDeptsForSupervisePoint();
                    LIB.Msg.info("添加成功");
                });
            },
            doRefreshDeptsForSupervisePoint:function(){
                this.$refs.deptSupervisePointTable.doRefresh();
            }
            // 业务参数end
        },
        watch: {
        },
        events: {
            "ev_dtClose": function() {
                this.checkResultModal.visible = false;
            }
        },
        ready: function () {
            this.toggleSetItem("opAbnormalRecord");
            // this.checkResultModal.compId = LIB.user.compId || COMPID;
            // var _vo = this.mainModel.vo;
            // var _this = this;
            // this.showPlanType = !!LIB.setting.fieldSetting["BC_Hal_InsP"];
            // api.get({type: _vo.type}).then(function (data) {
            //     _this.obj = data.body;
            //     if (_this.obj !== 'E30000') {
            //         var str = _this.obj;
            //         _.deepExtend(_this.mainModel, str);
            //         var infoImg = {
            //             iconImg: "images/loginBox.png",
            //             logoImg: "images/loginBox.png",
            //             backBoxImg: "images/loginBox.png",
            //             bgImg: "images/loginBox.png",
            //             apkImg: "images/loginBox.png",
            //             iosImg: "images/loginBox.png"
            //         };
            //         var obtainImg = {iconImg: str.icon, logoImg: str.logo, backBoxImg: str.lgImg, bgImg: str.bgImg};
            //         _.defaults(obtainImg, infoImg);
            //         _this.icon = str.icon;
            //         _this.logo = str.logo;
            //         _this.lgImg = str.lgImg;
            //         _this.bgImg = str.bgImg;
            //         _this.apkImg = str.apkImg;
            //         _this.iosImg = str.iosImg;
            //     }
            // });
        }
    });
    return vm;
});
