define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail.html");

    //详情弹框页面
    var baseComponent = require("./dialog/baseInfo");
    //reform弹框页面
    var reformInfoComponent = require("./dialog/reformInfo");
    //审核历史弹框页面
    var historyComponent = require("./dialog/history");
    //编辑弹框页面
    var picComponent = require("./dialog/pic");

    var editInfo = require("./dialog/editInfo");

    //初始化数据模型
    var newVO = function () {
        return {
            id: null,
            createDate: null,
            createBy: null,
            modifyDate: null,
            deleteFlag: null,
            checkObjectId: null,
            checkObject: {
                name: null
            },
            danger: null,
            isRectification: null,
            lastReformId: null,
            principalId: null,
            principalName: null,
            problem: null,
            registerDate: null,
            remark: null,
            riskType: null,
            riskLevel: null,
            sourceType: null,
            status: null,
            title: null,
            transferDate: null,
            transferId: null,
            transferName: null,
            type: null,
            reforms: [],
            cloudFiles: [],
            pictures: [],
            videos: [],
            audios: [],
            latentDefect:null,
            nestedOpCard: '1',
            specialty: null,
            hiddenDangerType:null,
            problemFinder:null,
            causeAnalysis:null,
            rewardAmount:null,
            rewardNum:null,
            verifyDate:null,
            verifierName:null,
            reformType:null,
            riskLevelResult:null,
            riskJudgementType:null,
            bizType:null,
            problemReason:null,
            legalRegulation:{id: '', name: ''},
            firstLevel:null,
            secondLevel:null,
            lowOldBadLevel:null,
            principalOrgId:null,
            rectificationCost:null,
            reform:{unFinishedDesc:null,completionDesc:null,afterPreventive:null},
            hseType:null,
            isMajorDanger:null,
            discoveryChannel: null
        }
    };
    //Vue数据
    var dataModel = function () {
        return {
        mainModel: {
            vo: newVO(),
            showTabs: false,
            opType: 'view',
            editInfoModel:{
                show:false
            }
        },
        //整改标签页
        reformModel: {
            show: false
        },
        buttonShow: {
            //关闭按钮
            closeButton: true,
            //提交按钮
            submitButton: false,
            //删除按钮
            cancelButton: false,
            //编辑按钮
            editButton:false,
            //审批按钮
            auditButton:false,
            //整改按钮
            reformButton:false,
            //整改受阻按钮
            reformFailButton:false,
            //验证按钮
            verifyButton:false,
            //委托按钮
            delegateButton:false
        },
            fileModel: {
                evaluationReport: {
                    cfg: {
                        params:{
                            recordId : null,
                            dataType : 'EZ1',
                            fileType : 'EZ',
                        },
                        filters:{
                            max_file_size: '10mb',
                            mime_types: [{ title: "file", extensions: "pdf,doc,docx,xls,xlsx,ppt,pptx,zip,rar,txt" }]
                        },
                    },
                    data: []
                },
                reformProgram: {
                    cfg: {
                        params:{
                            recordId : null,
                            dataType : 'EZ2',
                            fileType : 'EZ',
                        },
                        filters:{
                            max_file_size: '10mb',
                            mime_types: [{ title: "file", extensions: "pdf,doc,docx,xls,xlsx,ppt,pptx,zip,rar,txt" }]
                        },
                    },
                    data: []
                },
                reviewAcceptanceRecords: {
                    cfg: {
                        params:{
                            recordId : null,
                            dataType : 'EZ3',
                            fileType : 'EZ',
                        },
                        filters:{
                            max_file_size: '10mb',
                            mime_types: [{ title: "file", extensions: "pdf,doc,docx,xls,xlsx,ppt,pptx,zip,rar,txt" }]
                        },
                    },
                    data: []
                },
                riskAssessmenReport: {
                    cfg: {
                        params:{
                            recordId : null,
                            dataType : 'EZ4',
                            fileType : 'EZ',
                        },
                        filters:{
                            max_file_size: '10mb',
                            mime_types: [{ title: "file", extensions: "pdf,doc,docx,xls,xlsx,ppt,pptx,zip,rar,txt" }]
                        },
                    },
                    data: []
                },
            },
        source: null,
        isSwitch:false,
    }};
//Vue组件
    /**
     *  请统一使用以下顺序配置Vue参数，方便codeview
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
    var detail = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth,LIB.VueMixin.detailPanel],
        template: tpl,
        components: {
            "base-component": baseComponent,
            "reforminfo-component": reformInfoComponent,
            "history-component": historyComponent,
            "pic-component": picComponent,
            "edit-info":editInfo
        },
        data: dataModel,
        props:{
            fromMyRecords:{
                type:Number,
                default:0
            },
            showDetailButton:{
                type:Boolean,
                default:false
            }
        },
        computed:{
            showMajorDangerTab: function () {
                var path = _.last(this.$route.path.split("?")[0].split("/"));
                return path == 'majorDanger';
            }
        },
        methods: {
            // doClose: function () {
            //     this.$dispatch("ev_detailColsed");
            // },
            doDelete: function () {
                var _this = this;
                var ids = [];
                ids[0] = this.mainModel.vo.id;
                LIB.Modal.confirm({
                    title: '删除选中数据?',
                    onOk: function () {
                        api.delete(null, ids).then(function (data) {
                            if (data.data && data.error != '0') {
                                LIB.Msg.warning("删除失败");
                                return;
                            } else {
                                _this.$dispatch("ev_detailColsed");
                                LIB.Msg.success("删除成功");

                            }
                        });
                    }
                });
            },
            doEditPool: function () {
                this.$emit("do-edit", this.mainModel.vo);
            },
            doSubmitData: function () {
                var _this = this;
                var submitIds = [];
                submitIds[0] = this.mainModel.vo.id;

                LIB.Modal.confirm({
                    title: '提交选中数据?',
                    onOk: function () {
                        api.submit(null, submitIds).then(function (data) {
                            if (data.data && data.error != '0') {
                                LIB.Msg.warning("提交失败");
                                return;
                            } else {
                                _this.$dispatch("ev_detailColsed");
                                LIB.Msg.success("提交成功");
                            }
                        });
                    }
                });
            },
            doDelegate: function () {
                this.$emit("do-delegate", this.mainModel.vo);
            },
            doProcessReform: function () {
                var formType;
                if ("1" == this.mainModel.vo.status) {//审批
                    formType = "1"
                } else {//指派
                    formType = "2"
                }
                this.$emit("do-audit", this.mainModel.vo.id, formType);
            },
            doReform: function() {
                this.$emit("do-reform", this.mainModel.vo);
            },
            doReformFail: function() {
                this.$emit("do-reform-fail", this.mainModel.vo);
            },
            //验证
            doVerify: function () {
                this.$emit("do-verify", this.mainModel.vo);
            },
            initData: function (poolId) {
                if (poolId) {
                    var _this = this;
                    this.mainModel.showTabs = false;
                    var _mainModel = this.mainModel;
                    var _vo = this.mainModel.vo;
                    //清空数据
                    _.extend(_vo, newVO());
                    api.get({id: poolId}).then(function (res) {
                        var data = res.data;
                        if(_this.fileModel) {
                            if(data.id) {
                                _.each(_this.fileModel,function (item) {
                                    item.cfg && item.cfg.params && (item.cfg.params.recordId = data.id);
                                    item.data && (item.data = []);
                                });
                            }
                            //初始化附件 2019-05-15修改成适配多种类型附件
                            api.listFile({recordId: data.id}).then(function (resData) {
                                if (!_this.afterInitFileData && !_.isEmpty(_this.fileModel)) {
                                    var fileTypeMap = {};
                                    _.each(_this.fileModel,function (item) {
                                        _.propertyOf(item)("cfg.params.dataType") && (fileTypeMap[item.cfg.params.dataType] = item);
                                    });

                                    _.each(resData.data, function (file) {
                                        var fm = fileTypeMap[file.dataType];
                                        if(fm) {
                                            fm.data.push(LIB.convertFileData(file));
                                        }
                                    });
                                } else {
                                    _this.afterInitFileData(resData.data);
                                }
                            });
                        }
                        //初始化数据
                        _.deepExtend(_vo, res.data);
                        if (res.data.riskLevel) {
                            var riskModel = JSON.parse(res.data.riskLevel);
                            _vo.riskLevel = riskModel.result;
                        }
                        _vo.pictures = [];
                        _vo.videos = [];
                        _vo.audios = [];

                        //初始化图片数据
                        _.each(_vo.cloudFiles, function (pic) {
                            if (pic.dataType == "E1") {
                                _vo.pictures.push(LIB.convertFileData(pic));
                            } else if (pic.dataType == "E2") {
                                _vo.videos.push(LIB.convertFileData(pic));
                            } else if (pic.dataType === 'E5') {
                                _vo.audios.push(LIB.convertFileData(pic));
                            }
                        });

                        _mainModel.showTabs = true;
                        if(_mainModel.vo.reforms&&_mainModel.vo.reforms.length>0){
                            _this.reformModel.show=true;
                        }else{
                            _this.reformModel.show=false;
                        }
                    });
                }
            },
            //tabs切换
            doTabs:function(){
                //只有点击第一次的才发送init
                if(this.isSwitch){
                    this.$broadcast("init");
                    this.isSwitch = false;
                }
            },
            doEditInfo:function(){
                this.$refs.editInfo.afterInitData(this.mainModel.vo)
                this.mainModel.editInfoModel.show = true;
            },
            convertPicPath: LIB.convertPicPath
        },
        events: {
            //按钮显示控制
            "ev_detailButton": function (button) {
                //默认隐藏除关闭按钮以外的按钮
                var _this = this;
                _.each(_this.buttonShow, function(value, key){
                    if(key != 'closeButton') {
                        _this.buttonShow[key] = false;
                    }
                })
                _.extend(this.buttonShow, button);
            },
            "ev_detailDataReload": function (poolId, source) {
                this.mainModel.opType = 'view';
                this.source = source;
                this.initData(poolId);
                this.isSwitch = true;
            },
            //处理隐患点击保存后事件处理
            "ev_processedReform": function () {
                this.$dispatch("ev_detailColsed");
                this.processReform.poolId = null;
                this.processReform.show = false;
            },
            "ev_reformFinshed": function () {
                this.$dispatch("ev_detailColsed");
                this.reformSuccess.show = false;
                this.reformFail.show = false;
            },
            "ev_reformSave": function () {
                this.reformSuccess.show = false;
                this.reformFail.show = false;
            },
            "ev_delegate": function () {
                this.$dispatch("ev_detailColsed");
                this.delegateModel.show = false;
            },
            //edit框点击取消后事件处理
            "ev_reformCanceled": function () {
                this.reformSuccess.show = false;
                this.reformFail.show = false;
            },
            //verify框点击保存后事件处理
            "ev_verifyFinshed": function () {
                this.$dispatch("ev_detailColsed");
                this.verifyModel.show = false;
            },
            //edit框点击取消后事件处理
            "ev_verifyCanceled": function () {
                this.verifyModel.show = false;
            },
        }
    });

    return detail;
})
;