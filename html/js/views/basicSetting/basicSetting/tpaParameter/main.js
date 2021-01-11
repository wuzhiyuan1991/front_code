define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //查看弹框页面
    var viewDetail = require("./dialog/detail");
    
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    //数据模型
    var newVO = function () {
        return {
            configJson: null,
            type: "SYSTEM_ENV"
        }
    };
    //图片上传后回调方法声明
    var uploadEvents = {
        uploadModel: function (file, rs) {
            this.mainModel.iconName = file.name;
            this.icon = LIB.convertPicPath(rs.content.id );
            this.iconImg = true;
        },
        logoModel: function (file, rs) {
            this.mainModel.logoName = file.name;
            this.logo = LIB.convertPicPath(rs.content.id);
            this.logoImg = true;
        },
        lgModel: function (file, rs) {
            this.mainModel.lgName = file.name;
            this.lgImg = LIB.convertPicPath(rs.content.id,'watermark'+'/4');
            this.backBoxImg = true;
        },
        bgModel: function (file, rs) {
            this.mainModel.bgName = file.name;
            this.bgImg = LIB.convertPicPath(rs.content.id,'watermark'+'/0');
            this.backgroundImg = true;
        }
    };
    //初始化页面控件
    var dataModel = {
        moduleCode: LIB.ModuleCode.BS_BaC_ComI,
        mainModel: {
            configJson: null,
            type: "SYSTEM_ENV",
            vo: newVO(),
            title: null,
            iconName: null,
            logoName: null,
            lgName: null,
            bgName: null,
            uploadModel: [],
            logoModel: [],
            lgModel: [],
            bgModel: [],
            showCompanyInfo: true,
            showIndustryInfo: false,
            ShowBusinessInfo:false,
            skin:null,
        },
        //0是不合格，1是合格 2是不涉及
        checkList:{
            //默认选项
            defaultResultValue:null,
            checkResult:{
                notRefer:null,
                illegal:{
                    //是否强制提交文字描述 0：否 1：是
                    description:1,
                    //是否强制拍照
                    photoForce:null,
                    //是否强制录视频
                    videoForce:null
                },
                legal:{
                    //是否强制提交文字描述 0：否 1：是
                    description:null,
                    //是否强制拍照
                    photoForce:null,
                    //是否强制录视频
                    videoForce:null
                }
            },
            checkTaskSet:{
                isLateCheckAllowed:0,
                isLateWorkPlanExecute:0,
                isLatePollingPlanExecute:0
            },
            radomObserSet:{
                //是否强制选择所属公司/部门
                region:null
            },
            dailyInspection:{
                //日常检查选择顺序
                selectOrder:null
            },
            //隐患治理
            poolGovern:{
                //是否可以修改验证人-默认可以修改
                verifyUser:null
            },
            reportFunction:{
                //统计数据包含下属机构
                isDataContain:null
            },
            //证书过期通知人
            certExpireNoticeReceiver:{
            		id:null,
            		code:null,
            		name:null,
            		compId:null,
            		orgId:null,
            		mobile:null
            },
        },
        checkResult:{
            notRefer:false,
            illegal:{
                //是否强制提交文字描述 0：否 1：是
                description:true,
                //是否强制拍照
                photoForce:true,
                //是否强制录视频
                videoForce:true
            },
            legal:{
                //是否强制提交文字描述 0：否 1：是
                description:false,
                //是否强制拍照
                photoForce:false,
                //是否强制录视频
                videoForce:false
            }
        },
        checkTaskSet:{
        	isLateCheckAllowed:false,
            isLateWorkPlanExecute:false,
            isLatePollingPlanExecute:false
        },
        radomObserSet:{
            //是否强制选择所属公司/部门
            region:null
        },
        dailyInspection:{
            //日常检查选择顺序
            selectOrder:"2"
        },
        //隐患治理
        poolGovern:{
            //是否可以修改验证人-默认可以修改
            verifyUser:true
        },
        reportFunction:{
            //统计数据包含下属机构
            isDataContain:null
        },
        //证书过期 通知人
        certExpireNoticeReceiver:{
        		id:null,
        		code:null,
        		name:null,
        		compId:null,
        		orgId:null,
        		mobile:null
        },
        noReferCheckDisable:true,
        illegalCheckDisable:false,
        legalCheckDisable:false,
        defaultChoose:{
            illegal:{
                bol:false,
                value:0
            },
            legal:{
                bol:false,
                value:1
            },
            notRefer:{
                bol:false,
                value:2
            }
        },
        viewDetail : {
            //控制编辑组件显示
            title : "详情",
            //显示编辑弹框
            show : false,
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
            //回调函数绑定 //默认可省略
            events: {
                onSuccessUpload: uploadEvents.uploadModel
            }
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
            //回调函数绑定 //默认可省略
            events: {
                onSuccessUpload: uploadEvents.logoModel
            }
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
            //回调函数绑定 //默认可省略
            events: {
                onSuccessUpload: uploadEvents.lgModel
            }
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
            //回调函数绑定 //默认可省略
            events: {
                onSuccessUpload: uploadEvents.bgModel
            }
        },
        //图片是否存在
        iconImg: false,
        logoImg: false,
        backBoxImg: false,
        backgroundImg: false,
        isUploadPic: true,
        //图片id
        fileIdInfo: null,
        fileIdUrl: null,
        //显示图片地址
        icon: null,
        logo: null,
        lgImg: null,
        bgImg: null,
        watermark:'',
        obj:null,
        //显示图片
        showImg:null,
        isShowItem:false,
        isShowCheckTask:false,
        isShowRadomObser:false,
        isShowDailyInspection:false,
        isShowPoolGovern:false,
        isShowReportFunction:false,
        isShowBoatCertificate:false,
        obj1:null,
        showPlanType : false,
        selectModal : {
			showUserSelectModal:{
				visible:false,
				filterData:null
			}
		},
    };
    //使用Vue方式，对页面进行事件和数据绑定
    var vm = LIB.Vue.extend({
    	mixins : [LIB.VueMixin.dataDic],
        template: require("text!./main.html"),
        components : {
        	"userSelectModal":userSelectModal,
            "viewDetail":viewDetail
        },
        data: function () {
            return dataModel
        },
        methods: {
            logoUploadModel: function (data) {
                this.mainModel.logoName = data.file.name;
                this.logo = LIB.convertPicPath(data.rs.content.id);
                this.logoImg = true;
            },
            lgUploadModel: function (data) {
                this.mainModel.lgName = data.file.name;
                this.lgImg = LIB.convertPicPath(data.rs.content.id,'watermark'+'/4');
                this.backBoxImg = true;
            },
            bgUploadModel: function (data) {
                this.mainModel.bgName = data.file.name;
                this.bgImg = LIB.convertPicPath(data.rs.content.id,'watermark'+'/0');
                this.backgroundImg = true;
            },
            doShowCompanyInfo: function () {
                var _this = this;
                _this.mainModel.showCompanyInfo = true;
                _this.mainModel.showIndustryInfo = false;
                _this.mainModel.ShowBusinessInfo = false;
            },
            doShowIndustryInfo: function () {
                var _this = this;
                _this.mainModel.showCompanyInfo = false;
                _this.mainModel.showIndustryInfo = true;
                _this.mainModel.showContactMethod = false;
                _this.mainModel.ShowBusinessInfo = false;
            },
            doShowUserSelectModal : function(param) {
				this.selectModal.showUserSelectModal.visible = true;
			},
			doSaveUsers : function(selectedDatas) {
	             if (selectedDatas) {
	            	 this.certExpireNoticeReceiver.id = selectedDatas[0].id;
	            	 this.certExpireNoticeReceiver.code = selectedDatas[0].code;
	            	 this.certExpireNoticeReceiver.name = selectedDatas[0].name;
	            	 this.certExpireNoticeReceiver.compId = selectedDatas[0].compId;
	            	 this.certExpireNoticeReceiver.orgId = selectedDatas[0].orgId;
	            	 this.certExpireNoticeReceiver.mobile = selectedDatas[0].mobile;
	             }
			},
            doShowBusinessInfo:function(){
                var _this  = this;
                api.get({type:"BUSINESS_SET"}).then(function (data) {
                    _this.obj1 = data.body;
                    if(_this.obj1 != 'E30000'){
                        //var str =  JSON.parse(_this.obj1);
                        _.deepExtend(_this.checkList, _this.obj1);
                        _this.checkResult.notRefer = _this.checkList.checkResult.notRefer  ? true : false;
                        _this.checkResult.illegal.description = true;
                        _this.checkResult.illegal.photoForce = _this.checkList.checkResult.illegal.photoForce ? true :false;
                        _this.checkResult.illegal.videoForce = _this.checkList.checkResult.illegal.videoForce ? true :false;
                        _this.checkResult.legal.description = _this.checkList.checkResult.legal.description ? true :false;
                        _this.checkResult.legal.photoForce = _this.checkList.checkResult.legal.photoForce ? true :false;
                        _this.checkResult.legal.videoForce = _this.checkList.checkResult.legal.videoForce ? true : false;
                        if(_this.checkResult.notRefer){
                            if(_this.checkList.defaultResultValue == _this.defaultChoose.illegal.value){
                                _this.defaultChoose.illegal.bol = true;
                            }else if( _this.checkList.defaultResultValue == _this.defaultChoose.legal.value){
                                _this.defaultChoose.legal.bol = true;
                            }else if(_this.checkList.defaultResultValue == _this.defaultChoose.notRefer.value){
                                _this.defaultChoose.notRefer.bol = true;
                            };
                            _this.noReferCheckDisable = false;
                        }else{
                            if(_this.checkList.defaultResultValue == _this.defaultChoose.illegal.value){
                                _this.defaultChoose.illegal.bol = true;
                            }else if( _this.checkList.defaultResultValue == _this.defaultChoose.legal.value){
                                _this.defaultChoose.legal.bol = true;
                            };
                            _this.noReferCheckDisable = true;

                        }
                        _this.checkTaskSet.isLateCheckAllowed = _this.checkList.checkTaskSet.isLateCheckAllowed  ? true : false;
                        _this.checkTaskSet.isLateWorkPlanExecute = _this.checkList.checkTaskSet.isLateWorkPlanExecute  ? true : false;
                        _this.checkTaskSet.isLatePollingPlanExecute = _this.checkList.checkTaskSet.isLatePollingPlanExecute  ? true : false;
                        _this.radomObserSet.region = _this.checkList.radomObserSet.region  ? true : false;
                        _this.dailyInspection.selectOrder = _this.checkList.dailyInspection.selectOrder ? _this.checkList.dailyInspection.selectOrder : "2";
                        _this.poolGovern.verifyUser = 0 != _this.checkList.poolGovern.verifyUser ? true : false;
                        _this.reportFunction.isDataContain = _this.checkList.reportFunction.isDataContain  ? true : false;
                        
                        _.deepExtend(_this.certExpireNoticeReceiver, _this.checkList.certExpireNoticeReceiver);
                    }
                });
                _this.mainModel.showCompanyInfo = false;
                _this.mainModel.showIndustryInfo = false;
                _this.mainModel.ShowBusinessInfo = true;
            },
            doClick:function(type){
                //$(".ivu-modal-close").css('display','none');
                if(type==1){
                    //$(".parameterCheck").show();
                    $(".application button").css("background","#00467d").css("border","1px solid #00467d");
                    this.showImg = "images/theme/66.png";
                    this.mainModel.skin="skin_blue";
                }
                if(type==2){
                    $(".application button").css("background","#343d46").css("border","1px solid #343d46");
                    this.showImg = "images/theme/55.png";
                    this.mainModel.skin="skin_black";
                }
                if(type==3){
                    $(".application button").css("background","#63ab3b").css("border","1px solid #63ab3b");
                    this.showImg = "images/theme/11.png";
                    this.mainModel.skin="skin_greenGrass";               }
                if(type==4){
                    $(".application button").css("background","#00a892").css("border","1px solid #00a892");
                    this.showImg = "images/theme/22.png";
                    this.mainModel.skin="skin_green";
                }
                if(type==5){
                    $(".application button").css("background","#d47146").css("border","1px solid #d47146");
                    this.showImg = "images/theme/33.png";
                    this.mainModel.skin="skin_red";
                }
                if(type==6){
                    $(".application button").css("background","#5e35b1").css("border","1px solid #5e35b1");
                    this.showImg = "images/theme/44.png";
                    this.mainModel.skin = "skin_purple";
                }
                this.viewDetail.show = true;
            },
            application:function(){
                this.viewDetail.show = false;
                //var _this = this;
                //var skin = this.mainModel.skin;
                var _vo = this.mainModel.vo;
                var _this = this;
                var configJson = {
                    skin:_this.mainModel.skin,
                    title: _this.mainModel.title,
                    iconName: _this.mainModel.iconName,
                    logoName: _this.mainModel.logoName,
                    lgName: _this.mainModel.lgName,
                    bgName: _this.mainModel.bgName,
                    icon: _this.icon,
                    logo: _this.logo,
                    lgImg: _this.lgImg,
                    bgImg: _this.bgImg
                };
                //this.mainModel.skin = JSON.stringify(skin);
                _vo.configJson = JSON.stringify(configJson);
                if(_this.obj=="E30000"){
                    api.save(_vo).then(function (data) {
                        LIB.Msg.info("新增成功！");
                        _this.obj = null;
                    });
                    window.location.reload();
                }else {
                    api.update(_vo).then(function (data) {
                        LIB.Msg.info("修改成功！");
                        window.location.reload();
                    });
                }
                //if(_this.obj=="E30000"){
                //    api.save({attr1:"SKIN_TYPE",configJson:skin}).then(function (data) {
                //    });
                //}
                //else{
                //    api.update({attr1:"SKIN_TYPE",configJson:skin}).then(function (data) {
                //        LIB.Msg.info("修改皮肤成功！");
                //    });
                //}

            },
            save: function () {;
                var _vo = this.mainModel.vo;
                var _this = this;
                var configJson = {
                    skin:_this.mainModel.skin,
                    title: _this.mainModel.title,
                    iconName: _this.mainModel.iconName,
                    logoName: _this.mainModel.logoName,
                    lgName: _this.mainModel.lgName,
                    bgName: _this.mainModel.bgName,
                    icon: _this.icon,
                    logo: _this.logo,
                    lgImg: _this.lgImg,
                    bgImg: _this.bgImg
                };
                _vo.configJson = JSON.stringify(configJson);
                if(_this.obj=="E30000"){
                    api.save(_vo).then(function (data) {
                        LIB.Msg.info("新增成功！");
                        _this.obj = null;
                    });
                }else {
                    api.update(_vo).then(function (data) {
                        // console.log(configJson);
                         LIB.Msg.info("修改成功！");
                    });
                }
            },
            //勾选不涉及，对应的默认值才能勾选，否则disabled
            checkedChange:function(checked,value){
                var _this  = this;
                if(_this.checkResult.notRefer){
                    _this.noReferCheckDisable = false;
                }else{
                    _this.noReferCheckDisable = true;
                    _this.defaultChoose.notRefer.bol = false;
                }
            },
            //默认勾选不涉及，其他勾选不了
            defaultChange1:function(checked,value){
                var _this = this;
               if(_this.defaultChoose.notRefer.bol){
                   _this.defaultChoose.illegal.bol = false;
                   _this.defaultChoose.legal.bol = false;

               }
            },
            //默认勾选不合格，其他勾选不了
            defaultChange2:function(checked,value){
                var _this = this;
                if(_this.defaultChoose.illegal.bol){
                    _this.defaultChoose.notRefer.bol = false;
                    _this.defaultChoose.legal.bol = false;
                }
            },
            //默认勾选合格，其他勾选不了
            defaultChange3:function(checked,value){
                var _this = this;
                if(_this.defaultChoose.legal.bol){
                    _this.defaultChoose.notRefer.bol = false;
                    _this.defaultChoose.illegal.bol = false;
                }
            },
            //保存业务设置
            saveBusiness:function(){
                var _this = this;
                if(_this.defaultChoose.illegal.bol){
                    _this.checkList.defaultResultValue = _this.defaultChoose.illegal.value;
                }else if(_this.defaultChoose.legal.bol){
                    _this.checkList.defaultResultValue = _this.defaultChoose.legal.value;
                }else if(_this.defaultChoose.notRefer.bol){
                    _this.checkList.defaultResultValue = _this.defaultChoose.notRefer.value;
                }else{
                    _this.checkList.defaultResultValue = null;
                };
                _this.checkList.checkResult.notRefer = _this.checkResult.notRefer ? 1 :0;
                _this.checkList.checkResult.illegal.description = _this.checkResult.illegal.description ? 1 :0;
                _this.checkList.checkResult.illegal.photoForce = _this.checkResult.illegal.photoForce ? 1 :0;
                _this.checkList.checkResult.illegal.videoForce = _this.checkResult.illegal.videoForce ? 1 :0;
                _this.checkList.checkResult.legal.description = _this.checkResult.legal.description ? 1 :0;
                _this.checkList.checkResult.legal.photoForce = _this.checkResult.legal.photoForce ? 1 :0;
                _this.checkList.checkResult.legal.videoForce = _this.checkResult.legal.videoForce  ? 1 :0;

                _this.checkList.checkTaskSet.isLateCheckAllowed = _this.checkTaskSet.isLateCheckAllowed ? 1 :0;
                _this.checkList.checkTaskSet.isLateWorkPlanExecute = _this.checkTaskSet.isLateWorkPlanExecute ? 1 :0;
                _this.checkList.checkTaskSet.isLatePollingPlanExecute = _this.checkTaskSet.isLatePollingPlanExecute ? 1 :0;
                _this.checkList.radomObserSet.region = _this.radomObserSet.region ? 1 :0;
                _this.checkList.dailyInspection.selectOrder = _this.dailyInspection.selectOrder;
                _this.checkList.poolGovern.verifyUser = _this.poolGovern.verifyUser ? 1 : 0;
                _this.checkList.reportFunction.isDataContain = _this.reportFunction.isDataContain ? 1 :0;
                
                _this.checkList.certExpireNoticeReceiver = _this.certExpireNoticeReceiver;
                if(_this.obj1=="E30000"){
                    api.save({type:"BUSINESS_SET",configJson:JSON.stringify(_this.checkList)}).then(function (data) {
                        LIB.Msg.info("保存成功！");
                        _this.obj1 = null;
                    });
                }else {
                    api.update({type:"BUSINESS_SET",configJson:JSON.stringify(_this.checkList)}).then(function (data) {
                       LIB.Msg.info("修改成功！");
                    });
                }
            }
        },
        ready: function () {
            var _vo = this.mainModel.vo;
            var _this = this;
            this.showPlanType = LIB.setting.fieldSetting["BC_Hal_InsP"] ? true : false;
            api.get({type:_vo.type}).then(function (data) {
                _this.obj = data.body;
                if(_this.obj != 'E30000'){
                    //var str =  JSON.parse(obj);
                    var str = _this.obj;
                    _.deepExtend(_this.mainModel, str);
                    //alert(this.mainModel.skin);
                    //alert(str.skin);
                    var infoImg = {iconImg:"images/loginBox.png",logoImg:"images/loginBox.png",backBoxImg:"images/loginBox.png",bgImg:"images/loginBox.png"};
                    var obtainImg ={iconImg:str.icon,logoImg:str.logo,backBoxImg:str.lgImg,bgImg:str.bgImg};
                    _.defaults(obtainImg,infoImg);
                    _this.icon=str.icon;
                    _this.logo=str.logo;
                    _this.lgImg=str.lgImg;
                    _this.bgImg=str.bgImg;
                    //if (str.icon == null) {
                    //    _this.iconImg = false;
                    //} else {
                    //    _this.iconImg = true;
                    //    _this.icon=str.icon;
                    //}
                    //if (str.logo == null) {
                    //    _this.ParaShowIm1 = false;
                    //} else {
                    //    _this.logoImg = true;
                    //    _this.logo=str.logo;
                    //}
                    //if (str.lgImg == null) {
                    //    _this.ParaShowIm2 = false;
                    //} else {
                    //    _this.backBoxImg = true;
                    //    _this.lgImg=str.lgImg;
                    //}
                    //if (str.bgImg == null) {
                    //    this.ParaShowIm3 = false;
                    //} else {
                    //    _this.backgroundImg = true;
                    //    _this.bgImg=str.bgImg;
                    //}
                }
            });
            //api.get({type:"BUSINESS_SET"}).then(function (data) {
            //    _this.obj1 = data.body;
            //    if(_this.obj1 != 'E30000'){
            //        //var str =  JSON.parse(_this.obj1);
            //        _.deepExtend(_this.checkList, _this.obj1);
            //        _this.checkResult.notRefer = _this.checkList.checkResult.notRefer  ? true : false;
            //        _this.checkResult.illegal.description = true;
            //        _this.checkResult.illegal.photoForce = _this.checkList.checkResult.illegal.photoForce ? true :false;
            //        _this.checkResult.illegal.videoForce = _this.checkList.checkResult.illegal.videoForce ? true :false;
            //        _this.checkResult.legal.description = _this.checkList.checkResult.legal.description ? true :false;
            //        _this.checkResult.legal.photoForce = _this.checkList.checkResult.legal.photoForce ? true :false;
            //        _this.checkResult.legal.videoForce = _this.checkList.checkResult.legal.videoForce ? true : false;
            //        if(_this.checkResult.notRefer){
            //            if(_this.checkList.defaultResultValue == _this.defaultChoose.illegal.value){
            //                _this.defaultChoose.illegal.bol = true;
            //            }else if( _this.checkList.defaultResultValue == _this.defaultChoose.legal.value){
            //                _this.defaultChoose.legal.bol = true;
            //            }else if(_this.checkList.defaultResultValue == _this.defaultChoose.notRefer.value){
            //                _this.defaultChoose.notRefer.bol = true;
            //            };
            //            _this.noReferCheckDisable = false;
            //        }else{
            //            if(_this.checkList.defaultResultValue == _this.defaultChoose.illegal.value){
            //                _this.defaultChoose.illegal.bol = true;
            //            }else if( _this.checkList.defaultResultValue == _this.defaultChoose.legal.value){
            //                _this.defaultChoose.legal.bol = true;
            //            };
            //            _this.noReferCheckDisable = true;
            //
            //        }
            //        _this.checkTaskSet.isLateCheckAllowed = _this.checkList.checkTaskSet.isLateCheckAllowed  ? true : false;
            //        _this.checkTaskSet.isLateWorkPlanExecute = _this.checkList.checkTaskSet.isLateWorkPlanExecute  ? true : false;
            //        _this.checkTaskSet.isLatePollingPlanExecute = _this.checkList.checkTaskSet.isLatePollingPlanExecute  ? true : false;
            //        _this.radomObserSet.region = _this.checkList.radomObserSet.region  ? true : false;
            //        _this.dailyInspection.selectOrder = _this.checkList.dailyInspection.selectOrder ? _this.checkList.dailyInspection.selectOrder : "2";
            //        _this.reportFunction.isDataContain = _this.checkList.reportFunction.isDataContain  ? true : false;
            //    }
            //});
        }
    });
    return vm;
});
