define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //查看弹框页面
    var viewDetail = require("./dialog/detail");
    var morePanel = require("./dialog/morePanel");
    var deptSelectModal = require("componentsEx/selectTableModal/deptSelectModal");
    var roleSelectModal = require("componentsEx/selectTableModal/roleSelectModal");
    var scrollMixins=require("./scrollMixins");
    var companySelectModel = require("componentsEx/selectTableModal/companySelectModel");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var label = require("./labelTools")
    var editFuncAndMenuComponent = require("./dialog/edit-func-menu");
    var getRadomObserChildren = function () {
        return [
            {
                attr1: "radomObserSet.enableAnonymity.users2ViewAnonymity",
                attr2: "1",
                attr5: "随机观察",
                children: [],
                compId: "9999999999",
                createBy: "9999999999",
                deleteFlag: "0",
                description: "",
                isDefault: "1",
                name: "users2ViewAnonymity",
                orgId: "9999999999",
                parentId: "fnkax73rqr",
                content: ""
            },
            {
                attr1: "radomObserSet.enableAnonymity.roles2ViewAnonymity",
                attr2: "1",
                attr5: "随机观察",
                children: [],
                compId: "9999999999",
                createBy: "9999999999",
                deleteFlag: "0",
                description: "",
                isDefault: "1",
                name: "roles2ViewAnonymity",
                orgId: "9999999999",
                parentId: "fnkax73rqr",
                content: ""
            }
        ]
    };

    //数据模型
    var COMPID = '9999999999';
    var newVO = function () {
        return {
            configJson: null,
            type: "SYSTEM_ENV"
        }
    };
    var modelNameMap = {
    	common:{modelName:'commonModel',title:"通用"},
        checkResult:{modelName:'checkResultModal',title:"检查记录"},
        checkTaskSet:{modelName:'checkTaskSetModel',title:"检查任务"},
        radomObserSet: {modelName:'radomObserSetModel',title:"随机观察"},
        dailyInspection:{modelName: 'dailyInspectionModel',title:"非计划检查"},
        poolGovern:{modelName: 'poolGovernModel',title:"隐患治理"},
        training:{modelName: 'trainingModel',title:"培训管理"},
        reportFunction: {modelName:'reportFunctionModel',title:"巡检管理"},
        asmtTaskSet: {modelName:'asmtTaskSetModel',title:"报表功能"},
        deptForSupervisePoint: {modelName:'deptForSupervisePointModel',title:"自评任务"},
        checkSubmit:{modelName: 'checkSubmitModel',title:"重点监管部门"},
        amstResult:{modelName: 'amstResultModel',title:"检查表整体提交确认"},
        checkItem:{modelName: 'checkItemModel',title:"检查项"},
        tableBatchHandle:{modelName:'tableBatchHandleModel',title:"领导力评分模式"},
        routingInspection:{modelName: 'routingInspectionModel',title:"列表批量处理记录数量最大值"},
        riskjudgmenttask:{modelName:'riskJudgmentTaskModel',title:"风险研判"},
        incentiveMechanism:{modelName: 'incentiveMechanismModel',title:"激励机制"},
        emer:{modelName:'emerModel',title:"应急管理"},
        safetyAudit:{modelName: 'safetyAuditModel',title:"安全审核"},
        ptw:{modelName: "ptwModel",title:"作业许可证"},
        dutyManagement:{modelName: 'dutyMaModel',title:"值班管理"},
        // opCard:{modelName:"opCardModel",title:"一票两卡"},
    };
    //初始化页面控件
    var dataModel = {
        modelNameMap:modelNameMap,
        defaultIconImage: "/html/images/favicon.ico",
        defaultLogoImage: "/html/images/sw-logo.jpg",
        defaultLgImage: "/html/images/login.png",
        // defaultBgImage: "/html/images/bg.jpg",
        defaultBgImage: "/html/images/loginBg.jpg",
        moduleCode: LIB.ModuleCode.BS_BaC_ComI,
        tabIndex: 0,
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
        viewDetail: {
            //控制编辑组件显示
            title: "详情",
            //显示编辑弹框
            show: false,
            id: null
        },
        uploadModel: {
            //文件过滤器，默认只能上传图片，可不配
            filters: {
                max_file_size: '10kb',
                mime_types: [{title: "favicon", extensions: "ico"}]
            },
            params: {
                recordId: null,
                dataType: 'ENV1',
                fileType: 'E'
            },
        },
        logoModel: {
            //文件过滤器，默认只能上传图片，可不配
            filters: {
                max_file_size: '10kb',
                mime_types: [{title: "favicon"}]
            },
            params: {
                recordId: null,
                dataType: 'ENV1',
                fileType: 'E'
            },
        },
        lgModel: {
            //文件过滤器，默认只能上传图片，可不配
            filters: {
                max_file_size: '10kb',
                mime_types: [{title: "favicon"}]
            },
            params: {
                recordId: null,
                dataType: 'ENV1',
                fileType: 'E'
            },
        },
        bgModel: {
            //文件过滤器，默认只能上传图片，可不配
            filters: {
                max_file_size: '10kb',
                mime_types: [{title: "favicon"}]
            },
            params: {
                recordId: null,
                dataType: 'ENV1',
                fileType: 'E'
            },
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
        dutyMaModel: {
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
        ptwModel: {
            vo: {
                children: null
            },
            show: false
        },
        opCardModel:{
            vo: {
                children: null
            },
            show: false
        },
        deptForSupervisePointModel: {
            show: false,
            tableModel: {
                url: 'supervisepointdept/list{/curPage}{/pageSize}',
                urlDelete: 'supervisepointdept',
                columns: [{
                    title: "部门编码",
                    width:200,
                    fieldName: "organization.code"
                }, {
                    title: "部门名称",
                    width:200,
                    fieldName: "organization.name"
                }, {
                    title: "操作",
                    fieldType: "tool",
                    toolType: "del"
                }],
                data:[]
            },
            deptSelectModel:{
                show: false
            }
        },
        checkSubmitModel: {
            vo: {
                children: null
            },
            show: false
        },
        checkItemModel: {
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
        companySelectModel: {
            filterData:null,
            list:[],
            num:0,
            show:false
        },
        radomObser :{
            columns0: [{
                title: "名称",
                fieldName: "name"
            },
                LIB.tableMgr.column.company,
                LIB.tableMgr.column.dept,
            ],
            columns1:[
                {
                    title: "名称",
                    fieldName: "name"
                },
                LIB.tableMgr.column.company,
            ],
            columns2:[
                {
                    title: "",
                    render:function (row) {
                        return row.description;
                    },
                    width:"100px"
                },
                {
                    title: "启用",
                    render:function (data) {
                        if(data.enable.unmodified === '1'){
                            return label.checkDisTrue;
                        }
                        if(data.enable.result == '2'){
                            return label.checkTrue;
                        }else{
                            return label.checkFalse;
                        }
                    },
                    event: true,
                    width:"100px"
                },
                {
                    title: "必填",
                    render:function (data) {
                        if(data.require.unmodified === '1'){
                            return label.checkDisTrue;
                        }
                        if(data.require.result == '2'){
                            return label.checkTrue;
                        }else{
                            return label.checkFalse;
                        }
                    },
                    event: true,
                    width:"100px"
                },
            ],
            list0:[],
            list1:[],
            cure: 'person',
            compId:null,
            personList: [],
            roleList: [],

            settingList: []
        },
        userSelectModel :{
            type:null,
            show:false
        },
        poolGovern:{
            columns: [
                {
                    title: "",
                    render:function (data) {
                        return data.description;
                    },
                    width:"100px"
                },
                {
                    title: "启用",
                    render:function (row) {
                        if(row.unmodified === '1'){
                            return label.checkDisTrue;
                        }
                        if(row.enable.result === '2'){
                            return label.checkTrue;
                        } else {
                            return label.checkFalse;
                        }
                    },
                    event: true,
                    width:"70px"
                },
                {
                    title: "必填",
                    render:function (row) {
                        if(row.unmodified === '1'){
                            return label.checkDisTrue;
                        }
                        if (row.enable.result !== '2') {
                            return label.checkDisTrue;
                        }
                        if(row.require.result === '2'){
                            return label.checkTrue;
                        } else {
                            return label.checkFalse;
                        }
                    },
                    event: true,
                    width:"70px"
                },
                {
                    title: "字段类型",
                    render:function (row) {
                        return row.remark;
                    },
                    width:"70px"
                },
            ],
        },
        roleSelectModel: {
            show: false
        },
        chooiseFuncAndMenuModel: {
            //控制组件显示
            title: "菜单功能权限-全局默认权限",
            //显示编辑弹框
            show: false
        },
    };
    //使用Vue方式，对页面进行事件和数据绑定
    var vm = LIB.Vue.extend({
        template: require("text!./main.html"),
        mixins:[scrollMixins],
        components: {
            "viewDetail": viewDetail,
            "morePanel": morePanel,
            "deptSelectModal": deptSelectModal,
            "companySelectModel": companySelectModel,
            "user-select-modal": userSelectModal,
            "roleSelectModal" : roleSelectModal,
            'editFuncAndMenuComponent': editFuncAndMenuComponent
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
            doMenuAndFunc: function (e) {
                
                e.preventDefault()
                
                this.chooiseFuncAndMenuModel.show = true;
                // this.chooiseFuncAndMenuModel.title = "菜单功能权限 - " + row.name;
                // this.chooiseFuncAndMenuModel.id = null;
                this.$broadcast('ev_editFuncAndMenuReload', 'default');
            },
            doEditFuncAndMenuFinished: function () {
                this.chooiseFuncAndMenuModel.show = false;
            },
            // 改变状态
            changeTableListStatusa: function(row, event, rowIndex, index) {
                var theKey = rowIndex == 1 ? 'enable' : 'require'
                row[theKey].result =  row[theKey].result === '2' ? '1' : '2'
                if (theKey === 'enable' && row[theKey].result === '1') {
                    row['require'].result = '1'
                 }
                
            },
            onRadomObserSetModelClicked: function (obj, e, index, num) {
                var list = this.fiflterEnableRequireTableData('radomObser.settingList');
                var checkObj = _.find(list, function (item) {
                    return item.description == '检查对象';
                });
                var areaObj = _.find(list, function (item) {
                    return item.description == '属地';
                });

                if(obj.description == '部门' || obj.description == '操作' || obj.description == '问题类型' || (obj.description=='检查对象' && areaObj.enable.result!='2')){
                    return ;
                }
                if(index == 1){
                    if(obj.enable.result == '2') obj.enable.result = '1';
                    else obj.enable.result = '2';
                    if(obj.enable.result != '2') obj.require.result = '1'
                    if(obj.description == '属地' && obj.enable.result == '1'){
                        checkObj.enable.result = '1';
                        checkObj.require.result = '1';
                    }
                }else if(index == 2){
                    if(obj.enable.result == '2'){
                        if(obj.require.result == '2') obj.require.result = '1';
                        else obj.require.result = '2';
                    }
                }
            },
            onDeleteRadomObserPerson: function (item) {
                var obj = _.find(this.radomObserSetModel.vo.children, function (item) {
                    return item.description == 'enableAnonymity'
                });
                if(this.radomObser.cure == 'person'){
                    var index = 0;
                }else{
                    var index = 1;
                }
                if(obj.children[index]){
                    var str = obj.children[index].content.split(',');
                    if(str.indexOf(item.id)>-1)
                        str.splice(str.indexOf(item.id), 1);
                    obj.children[index].content = str.join(',');
                    var list = [];
                    var tempList = this.radomObser['list'+index];
                    _.each(tempList, function (items) {
                        if(items.id != item.id){
                            list.push(items);
                        }
                    });
                    if(index == 0) this.radomObser.list0 = list;
                    else this.radomObser.list1 = list;
                    this.saveBusiness('radomObserSet', '删除成功');
                }
            },
            getCureList: function (str) {
                this.radomObser.cure = str;
                // var obj = _.find(this.radomObserSetModel.vo.children, function (item) {
                //     return item.name == 'enableAnonymity'
                // });
                // if(obj && obj.children && obj.children.length>0){
                //     if(str == 'person' && obj.children[0].content){
                //         var list = obj.children[0].content.split(',');
                //         if(list.length>0)
                //             this.getUsers(list)
                //     }else if(str == 'role' && obj.children[1].content){
                //         var list = obj.children[1].content.split(',');
                //         if(list.length>0)
                //             this.getRoles(list)
                //     }
                // }
            },
            doSaveContent: function (arr) {
                var _this = this;
                if(this.userSelectModel.type == 'radomObser'){
                    var obj = _.find(this.radomObserSetModel.vo.children, function (item) {
                        return item.name == 'enableAnonymity'
                    });
                    if(obj){
                        if(this.radomObser.cure=='person'){
                            var list = _.pluck(_this.radomObser.list0, "id");
                            _.each(arr, function (item) {
                                if(list.indexOf(item.id)==-1) _this.radomObser.list0.push(item);
                            });
                            obj.children[0].content = _.pluck(_this.radomObser.list0, "id").join(",");
                        }else{
                            // obj.children[1].content = _.pluck(arr, "id").join(",");
                            // this.radomObser.list1 = arr;
                            var list = _.pluck(_this.radomObser.list1, "id");
                            _.each(arr, function (item) {
                                if(list.indexOf(item.id)==-1) _this.radomObser.list1.push(item);
                            });
                            obj.children[1].content = _.pluck(_this.radomObser.list1, "id").join(",");
                        }
                        this.saveBusiness('radomObserSet');
                    }
                }
            },
            doSaveUsersSelect: function (datas) {
                  // 随机观察
                if(this.userSelectModel.type == 'radomObser') {
                    this.doSaveContent(datas);
                }
            },
            doAddRadomObser: function () {
                if(this.radomObser.cure == 'person') this.userSelectModel.show = true;
                else this.roleSelectModel.show = true;
                this.userSelectModel.type = 'radomObser';
            },
            doShowCompanySelectModel: function () {
                this.companySelectModel.show=true;
                var excludeIds = [];
                if(this.companySelectModel.list.length > 0){
                    excludeIds = _.map(this.companySelectModel.list,"id");
                }
                this.companySelectModel.filterData = {"criteria.strsValue": JSON.stringify({excludeIds: excludeIds})};
            },
            doSaveCompany: function (val) {
                var _this = this;
                if(!this.companySelectModel.list){
                    this.companySelectModel.list = [];
                }
                _.each(val,function(item){
                    var obj = _.pick(item,["id","name"]);
                    _this.companySelectModel.list.push(obj);
                });
            },

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
                this.logo = LIB.convertImagePath(LIB.convertFileData(data.rs.content), "0");
            },
            convertImage: function(data) {
              if(data.indexOf("/") > -1) {
                  return data;
              }else {
                  return LIB.convertImagePath({fileId: data}, "0");
              }
            },
            iconUploadModel: function (data) {
                this.mainModel.iconName = data.file.name;
                this.icon = data.rs.content.id;
            },
            lgUploadModel: function (data) {
                this.mainModel.lgName = data.file.name;
                this.lgImg = LIB.convertImagePath(LIB.convertFileData(data.rs.content), "0");
            },
            bgUploadModel: function (data) {
                this.mainModel.bgName = data.file.name;
                this.bgImg = LIB.convertImagePath(LIB.convertFileData(data.rs.content), "0");
            },
            apkUploadModel: function (data) {
                this.apkImg = LIB.convertImagePath(LIB.convertFileData(data.rs.content), "0");
            },
            iosUploadModel: function (data) {
                this.iosImg = LIB.convertImagePath(LIB.convertFileData(data.rs.content), "0");
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
                    case 6: this.icon = this.defaultIconImage;
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
                        LIB.Msg.info("修改成功！");
                    });
                }
            },
            // 系统参数end

            // 主题设置start ----------------------------------------------
            doClick: function (type) {
                //$(".ivu-modal-close").css('display','none');
                if (type == 1) {
                    //$(".parameterCheck").show();
                    $(".application button").css("background", "#00467d").css("border", "1px solid #00467d");
                    this.showImg = "images/theme/66.png";
                    this.mainModel.skin = "skin_blue";
                }
                if (type == 2) {
                    $(".application button").css("background", "#343d46").css("border", "1px solid #343d46");
                    this.showImg = "images/theme/55.png";
                    this.mainModel.skin = "skin_black";
                }
                if (type == 3) {
                    $(".application button").css("background", "#63ab3b").css("border", "1px solid #63ab3b");
                    this.showImg = "images/theme/11.png";
                    this.mainModel.skin = "skin_greenGrass";
                }
                if (type == 4) {
                    $(".application button").css("background", "#00a892").css("border", "1px solid #00a892");
                    this.showImg = "images/theme/22.png";
                    this.mainModel.skin = "skin_green";
                }
                if (type == 5) {
                    $(".application button").css("background", "#d47146").css("border", "1px solid #d47146");
                    this.showImg = "images/theme/33.png";
                    this.mainModel.skin = "skin_red";
                }
                if (type == 6) {
                    $(".application button").css("background", "#5e35b1").css("border", "1px solid #5e35b1");
                    this.showImg = "images/theme/44.png";
                    this.mainModel.skin = "skin_purple";
                }
                this.viewDetail.show = true;
            },
            application: function () {
                this.viewDetail.show = false;
                //var _this = this;
                //var skin = this.mainModel.skin;
                var _vo = this.mainModel.vo;
                var _this = this;
                var configJson = {
                    skin: _this.mainModel.skin,
                    title: _this.mainModel.title,
                    iconName: _this.mainModel.iconName,
                    logoName: _this.mainModel.logoName,
                    lgName: _this.mainModel.lgName,
                    bgName: _this.mainModel.bgName,
                    iosname: _this.mainModel.iosname,
                    apkImg: _this.apkImg,
                    iosImg: _this.iosImg,
                    icon: _this.icon,
                    logo: _this.logo,
                    lgImg: _this.lgImg,
                    bgImg: _this.bgImg
                };
                //this.mainModel.skin = JSON.stringify(skin);
                _vo.configJson = JSON.stringify(configJson);
                if (_this.obj === "E30000") {
                    api.save(_vo).then(function (data) {
                        LIB.Msg.info("新增成功！");
                        _this.obj = null;
                    });
                    window.location.reload();
                } else {
                    api.update(_vo).then(function (data) {
                        LIB.Msg.info("修改成功！");
                        window.location.reload();
                    });
                }
            },
            // 主题设置end

            // 业务参数start -----------------------------------------------
            /*
            1. cb ；是回调函数， 这里主要用初始化， promiseAll
            */
            toggleSetItem: function (name,cb) {
                if(!cb){//当没有cb 的是表示渲染完成，之后改变了高度，scorllModel 需要重新计算
                    var index=0;
                    for (keyname in this.modelNameMap){
                       if(name===keyname){break};
                       index++;
                    }
                    this.recomputeItemHeight(index);
                }
                this[modelNameMap[name].modelName].show = !this[modelNameMap[name].modelName].show;
                if(this[modelNameMap[name].modelName].show) {
                    this.getBusinessSet(name, this.checkResultModal.compId,cb);
                }
            },

            findByName: function (arr, name) {
                return _.find(arr, function (item) {
                    return item.name == name;
                }) || {}
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
            getBusinessSet: function (name, compId,cb) {
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

                    _this[modelNameMap[name].modelName].vo = res.data;

                    // 报表功能  有json字符串  需转化为 数组
                    if(modelNameMap[name].modelName == 'reportFunctionModel'){
                        _this.companySelectModel.list = [];
                        var obj = _.find(_this[modelNameMap[name].modelName].vo.children,function (item) {
                            return item.name == 'statCompSet'
                        });
                        if(obj.content && obj.content.length>1){
                            var content = JSON.parse(obj.content);
                            _this.companySelectModel.list = content.comp;
                            _this.companySelectModel.num = content.num;
                        }
                    }
                    // 随机观察
                    if(modelNameMap[name].modelName == 'radomObserSetModel'){
                        _this.radomObser.list = [];
                        if(res.data && res.data.children){
                            var obj = _.find(res.data.children, function (item) {
                                return item.name == 'enableAnonymity';
                            });
                            if(obj && obj.children && obj.children.length>0){
                                if(obj && obj.children && obj.children.length>0){
                                    if(obj.children[0].content && obj.children[0].content.length>2) _this.getUsers(obj.children[0].content.split(','));
                                    if(!obj.children[0].content) obj.children[0].content = '';
                                    if(obj.children[1] && obj.children[1].content && obj.children[1].content.length>2) _this.getRoles(obj.children[1].content.split(','));
                                    if(obj.children[1] && !obj.children[1].content) obj.children[1].content = '';
                                }
                            }
                        }
                        _this.radomObser.settingList = res.data.children;

                    }

                    if(cb&& cb instanceof Function){
                        cb(res.data);
                    }
                });
            },

            saveBusiness: function (name, str) {
                var _this = this;
                var params = this[modelNameMap[name].modelName].vo;

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
                    // json 串处理
                    var obj = numLimit = _.find(params.children, function (item) {
                        return item.name === 'statCompSet';
                    });
                    var content = {};
                    content.num = this.companySelectModel.num;
                    content.comp = this.companySelectModel.list;
                    obj.content = JSON.stringify(content);
                }
                api.saveBusinessSet(params).then(function () {
                    var message = str?str:"保存成功";
                    LIB.Msg.info(message);
                    var tb=window.localStorage.getItem("org_data_level");
                    window.localStorage.setItem("org_data_level",parseInt(tb)+1);
                });
            },
            clearAll: function () {
                api.clearAll().then(function () {})
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
                if(item.name== 'defaultAuth'&&  item.result== '1'){
                    var params = {
                        roleAuthorityRels: [],
                        roleAppAuthorityRels: []
                    };
                    api.distributionMenuAndFunc({id:'default'}, params).then(function () {
                      
                        LIB.Msg.info("取消全局默认权限成功");
                    });
                }
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
            //显示重点监管部门选择弹框
            doShowDeptSelectModel:function(){
                this.deptForSupervisePointModel.deptSelectModel.show = true;
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
            },
            getUsers: function(userIds) {
                var _this = this;
                api.queryUsers({"criteria.strsValue" : JSON.stringify({userIds:userIds})}).then(function(res){
                    if(res && res.data) {
                        _this.radomObser.list0 = res.data.list;
                        return res.data.list;
                    }
                })
            },
            getRoles: function(roleIds) {
                var _this = this;
                api.queryRoles({"criteria.strsValue" : JSON.stringify({ids:roleIds})}).then(function(res){
                    if(res && res.data) {
                        _this.radomObser.list1 = res.data.list;
                        return res.data.list;
                    }
                })
            },
            radomObserChangeCompId: function (compId) {
                this.radomObserSetModel.compId = compId;
                this.initEnableAnonymityChildren(compId)
            },
            initEnableAnonymityChildren: function (compId) {
                var _this = this;
                this.radomObser.list0 = [];
                this.radomObser.list1 = [];
                 var obj = _.find(this.radomObserSetModel.vo.children, function (item) {
                    return item.name == "enableAnonymity";
                });
                if(obj) {
                    var children1 = LIB.getBusinessSetByNamePath("radomObserSet.enableAnonymity.users2ViewAnonymity", compId);
                    var children2 = LIB.getBusinessSetByNamePath("radomObserSet.enableAnonymity.roles2ViewAnonymity", compId);
                    if(children1){
                        obj.children = [];
                        if(!_.isEmpty(children1) && children1.content.length>2) _this.getUsers(children1.content.split(','));
                        if(_.isEmpty(children1))  children1 = this.initChildren(obj, compId, getRadomObserChildren()[0]);
                        if(!_.isEmpty(children1) && !children1.content) children1.content = '';

                        if(!_.isEmpty(children2) && children2.content.length>2) _this.getRoles(children2.content.split(','));
                        if(_.isEmpty(children2))  children2 = this.initChildren(obj, compId, getRadomObserChildren()[1]);
                        if(!_.isEmpty(children2) && !children2.content) children2.content = '';

                        obj.children.push(children1, children2);
                    }else {
                        obj.children = [];
                        var children = getRadomObserChildren();
                        this.initChildren(obj, compId, children[0]);
                        this.initChildren(obj, compId, children[1]);
                        obj.children = [].concat(children);
                    }
                }
            },
            initChildren: function (parent, compId , child) {
                child.compId = compId;
                child.parentId = parent.id;
                child.content = '';
                child.orgId = compId;
                return child;
            },
            // 业务参数end
            /**
            * @Description 萃取启用/必填类型的表格数据
            **/
            fiflterEnableRequireTableData: function (keys) {
                var children = this
                keys.split && keys.split('.').forEach(function (key) {
                    children = children[key] 
                })
                var poolGovernModelSpecial = [];
                var tableData = _.filter(children,function (item) {
                    return item.showType === '1';
                })
                var tableDataGroup = _.groupBy(tableData, "description");
                _.each(tableDataGroup,function (arr) {
                    var rowData = {};
                    _.each(arr,function (item) {
                        rowData.description = item.description;
                        if(item.content){
                            rowData.remark = item.content;
                        }
                        if(item.attr3 === '启用'){
                            rowData.enable = item;
                        }else if(item.attr3 === '必填'){
                            rowData.require = item;
                        }
                    })
                    poolGovernModelSpecial.push(rowData);
                })
                return poolGovernModelSpecial;
            },
        },
        watch: {
            'checkResultModal.compId': function (val) {
                this.getBusinessSet('checkResult', val);
            },
            'radomObserSetModel.compId': function (val) {
                this.radomObserChangeCompId(val);
            },
            'tabIndex':function (val) {
                var _this=this;
                if(this.loadBusiness){return};
              if(val===1){
                    var promiseArr=[]
                    for (name in modelNameMap){
                        var promise=new Promise(function (resolve) {
                            _this.toggleSetItem(name,resolve);
                        })
                        promiseArr.push(promise);
                    }
                        Promise.all(promiseArr).then(function () {
                        _this.loadBusiness=true;
                        _this.$nextTick(function () {
                            _this.initScroll({
                                target:".param-business",//scroll height 滚动区域高度
                                rightSelector:".scrollRight",//右边容器的选择器
                                //rightItemSelector:".anchor-box",//右边内容的item 选择器
                                rightItemSelector:".simple-card",
                                leftSelector:".scrollLeft",//
                                leftItemSelector:".anchor-item",//左边
                                activeClass:"active",
                                correctHeight:-20,//向下纠正-3个像素
                            })
                        })
                    })

              }
            }
        },
        events: {
            "ev_dtClose": function() {
                this.checkResultModal.visible = false;
            }
        },
        ready: function () {
            this.checkResultModal.compId = LIB.user.compId || COMPID;
            var _vo = this.mainModel.vo;
            var _this = this;
            this.showPlanType = !!LIB.setting.fieldSetting["BC_Hal_InsP"];
            api.get({type: _vo.type}).then(function (data) {
                _this.obj = data.body;
                if (_this.obj !== 'E30000') {
                    var str = _this.obj;
                    _.deepExtend(_this.mainModel, str);
                    var infoImg = {
                        icon: _this.defaultIconImage,
                        logo: _this.defaultLogoImage,
                        lgImg: _this.defaultLgImage,
                        bgImg: _this.defaultBgImage,
                        apkImg: _this.defaultLgImage,
                        iosImg: _this.defaultLgImage
                    };
                    var obtainImg = {icon: str.icon, logo: str.logo, lgImg: str.lgImg, bgImg: str.bgImg, apkImg:str.apkImg, iosImg: str.iosImg};
                    _.defaults(obtainImg, infoImg);
                    _this.icon = obtainImg.icon;
                    _this.logo = obtainImg.logo;
                    _this.lgImg = obtainImg.lgImg;
                    _this.bgImg = obtainImg.bgImg;
                    _this.apkImg = obtainImg.apkImg;
                    _this.iosImg = obtainImg.iosImg;
                }
            });
        },
        created:function () {


        }
    });
    return vm;
});
