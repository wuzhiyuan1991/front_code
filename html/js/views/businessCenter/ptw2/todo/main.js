define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    var detailPanel = require("./detail-tab-xl");
    var workCardApi = require("../workCard/vuex/api");
    var model = require("../model");
    var orderModal = require("../components/modalOrder/index");
    var selTplModal = require("../components/modal-sel-cardtpl");
    var ptwFillModal = require("../components/modalPtwFill/index");
    var jobApproval = require('./dialog/jobApproval');
    // var jobSign = require('./dialog/jobSign');
    var notHandelTipModal=require("./dialog/notHandelTip");
    var selectTypeModal = require('./dialog/selectType');
    var objModel = model;
    var contactPtw=require("../components/modalPtwFill/contactPtw/contactPtw");

    var preview = require("./dialog/preview");

    var initDataModel = function () {
        return {
            showNotHandleTip:false,
            moduleCode: "ptwWorkCardTodo1",
            //控制全部分类组件显示
            mainModel: {
                previewShow:false,
                vo: null,
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                // detailPanelClass : "middle-info-aside"
                detailPanelClass: "large-info-aside",
                isOrder: false,
                requiredJSA:false,
                workPersonnel:null,//当前批准人
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "ptwworkcard/list{/curPage}{/pageSize}",
                    // url: "ptwworkcard/list{/curPage}{/pageSize}?status=3", // 测试用

                    selectedDatas: [],
                    defaultFilterValue: {'criteria.intValue.todo': 1},
                    columns: [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                        LIB.tableMgr.column.company,
                        {
                            title: "作业类型",
                            fieldName: "workCatalog.name",
                            orderName: "workCatalog.name",
                            filterType: "text",
                            render: function (data) {
                                if (data.workCatalog) {
                                    return data.workCatalog.name;
                                }
                                return '';
                            },
                            width:"130"
                        },
                        {
                            title: "作业级别",
                            fieldName: "workLevel.name",
                            orderName: "workLevel.name",
                            filterType: "text",
                            width:"130"
                        },
                        {
                            title: "作业申请人",
                            fieldName: "applicant.name",
                            orderName: "applicant.name",
                            filterType: "text",
                            width: "118"
                        },
                        {
                            title: "状态",
                            fieldName: "status",
                            orderName: "status",
                            filterType: "enum",
                            fieldType: "custom",
                            filterName: "criteria.intsValue.status",
                            width: '85',
                            popFilterEnum: LIB.getDataDicList("iptw_work_status"),
                            render: function (data) {
                                if (data.status) {
                                    return LIB.getDataDic('iptw_work_status', data.status)
                                }
                            },
                        },
                        {
                            title: "作业内容",
                            fieldName: "workContent",
                            orderName: "workContent",
                            filterType: "text",
                            width: 270,
                            render: function (data) {
                                if (data.workPermit) {
                                 return    data.workPermit.workContent
                                }
                                  return data.workContent;
                            },
                        },
                        {
                            title: "作业地点",
                            fieldName: "workPlace",
                            orderName: "workPlace",
                            filterType: "text",
                            width: 270,
                            render: function (data) {
                                if (data.workPermit) {
                                    return    data.workPermit.workPlace
                                }
                                return data.workPlace;
                            },
                        },
                        {
                            title: "作业所在的设备",
                            fieldName: "workEquipment",
                            orderName: "workEquipment",
                            filterType: "text",
                            width: 270,
                            render: function (data) {
                                if (data.workPermit) {
                                    return    data.workPermit.workEquipment
                                }
                                return data.workEquipment;
                            },
                        },
                        LIB.tableMgr.column.createDate,
                    ]
                }
            ),
            detailModel: {
                show: false
            },
            orderModel: {
                show: false
            },
            selTplModel: {
                show: false,
            },
            uploadModel: {
                url: "/ptwworkcard/importExcel"
            },
            exportModel: {
                url: "/ptwworkcard/exportExcel",
                withColumnCfgParam: true
            },
            deelBtnShow: false,
            formModel: {
                jobApprovalFormModel: {
                    show: false,
                },
                jobSignFormModel: {
                    show: false,
                    btnShow: true
                },
                orderInfo: {
                    show: false
                },
                selectTypeModal:{
                    show:false,
                }
            },
        };
    }

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
            "orderModal": orderModal,
            "selTplModal": selTplModal,
            "ptwFillModal": ptwFillModal,
            "jobApproval": jobApproval,
            // "jobSign": jobSign,
            notHandelTipModal:notHandelTipModal,
            selectTypeModal:selectTypeModal,
            contactPtw:contactPtw,
            preview: preview
        },
        watch: {
            "tableModel.selectedDatas": function (val) {
                this.mainModel.vo = val[0];
                this.checkAuthoriser();
            }
        },
        methods: {
            doConcatPtw:function(){
                this.$refs.contactPtw.init(this.mainModel.vo);
            },
            doSaveSign: function (obj) {
                var _this = this;
                // obj.PtwWorkPersonne = {
                //    auditResult:obj.auditResult,
                //    signOpinion:obj.signOpinion
                // };
                api.saveAuthorize({id: this.mainModel.vo.id}, obj).then(function (res) {
                    LIB.Msg.info("提交成功");
                    _this.$dispatch("ev_dtUpdate");
                    _this.$dispatch("ev_dtClose");
                });
            },
            //点击处理
            showApprovalModel: function (vo) {
                if (vo) {
                    this.mainModel.vo = vo;
                }
                var _this = this;
                if ((this.mainModel.vo.attr1 == 1 && this.mainModel.vo.status == 5&&this.mainModel.workPersonnel)
                    || this.mainModel.vo.status == 6)
                {//作业批准人签名
                    this.showNotHandleTip=true;
                    // _this.formModel.jobSignFormModel.show = true;
                    //现在不要这里的逻辑了
                } else if (_this.mainModel.vo.status == 3) {
                    //==================填报处理=================
                        if (!_this.mainModel.vo.workPermit || !_this.mainModel.vo.workPermit.cardTplId) {
                        //预约还没有选择模板的
                        _this.$refs.modalSelTpl.init({
                            workLevelId: _this.mainModel.vo.workLevelId,
                            workCatalogId:vo.workCatalog?vo.workCatalog.id:undefined,
                            disabled: true,
                        }, _this.selectedTplOrder);
                        // _this.selTplModal.show=true;
                    } else {
                        _this.initPermitData();
                    }
                } else if (this.mainModel.vo.status == 2) {
                    this.formModel.jobApprovalFormModel.show = true;
                }
                else{
                    //其他都是pc端不能处理的状态
                    this.showNotHandleTip=true;

                }
            },

            gotoDeal: function () {
                this.showApprovalModel(this.tableModel.selectedDatas[0]);
            },
            // 审核回调
            doSaveStatus: function (obj) {
                var _this = this;
                obj.id = this.mainModel.vo.id;

                api.updateResult(obj).then(function (res) {
                    LIB.Msg.info("提交成功");
                    _this.$dispatch("ev_dtUpdate");
                    _this.$dispatch("ev_dtClose");
                });
            },

            checkAuthoriser: function () {
                var _this = this;
                this.deelBtnShow = false;
                if (!this.tableModel.selectedDatas[0]) return;
                if (this.tableModel.selectedDatas[0].status == 3) this.deelBtnShow = true;
                if (this.tableModel.selectedDatas[0].status == 2) this.deelBtnShow = true;
                if (((this.tableModel.selectedDatas[0].attr1 == 1 && this.tableModel.selectedDatas[0].status == 5) || this.tableModel.selectedDatas[0].status == 6)) {
                    api.checkAuthoriser({id: this.tableModel.selectedDatas[0].id}).then(function (res) {
                        _this.deelBtnShow =res.data&&res.data.cloudFiles&&res.data.cloudFiles.length>0;
                        _this.mainModel.workPersonnel=res.data;
                    })
                }
            },
            doAddPtw: function () {
                var _this = this;
                var fun=function(enableReservation,modal){
                    if (enableReservation==2) {
                        _this.orderModel.show = true;
                    } else {
                        _this.$refs.modalSelTpl.init({disabled: false}, function (item) {
                            _this.selectedTplAddPtw(item);
                        })

                    }
                    if(modal){modal.visible=false;}

                }
                 
                if(this.mainModel.enableReservation==3){
                      
                    this.$refs.modalSelectType.init(fun);
                }
                else {
                    fun(this.mainModel.enableReservation);
                }
            },
            //useModel 表示部分数据是否是重模板过来的
            initPermitData: function (useModel) {
                var _this = this;
                _this.$refs.ptwFill.showBox();
                LIB.globalLoader.show();
                workCardApi.tplDetail(_this.mainModel.vo.workPermit.cardTplId).then(function (model) {
                    workCardApi.getWorkPermit(_this.mainModel.vo.workPermit.id).then(function (permitModel) {
                        var initPms={};
                        if (_this.seledTpl) {
                            initPms.seledTpl=true;
                            _.extend(permitModel, _this.mainModel.vo.workPermit);
                            _this.seledTpl = null;
                            objModel.permitHandler(permitModel,model,true);
                        }
                        else{
                            objModel.permitHandler(permitModel,permitModel.workTpl || model,false);
                        }
                        permitModel.pms.requiredJSA=_this.mainModel.requiredJSA;
                        LIB.globalLoader.hide();
                        _this.$refs.ptwFill.init(model, permitModel,
                            _this.mainModel.vo.enableReservation,_this.mainModel.vo,initPms);
                    })
                })
            },
            //预约没有选择模板选了之后的回调
            selectedTplOrder: function (item) {
                var _this = this;
                if (!this.mainModel.vo.workPermit.cardTpl) {
                    this.mainModel.vo.workPermit.cardTpl = {id: ""};
                }
                this.mainModel.vo.workPermit.cardTpl.id = item.tplId;
                _.extend(this.mainModel.vo.workPermit, {
                    cardTplId: item.tplId,
                    workCatalog: {id: item.workCardCatalogId},
                    workLevelId: item.workLevelId,
                });
                this.seledTpl = item;
                _this.initPermitData(true);
            },
            //预约的时候
            clearTplOrder:function(){
                if(this.mainModel.vo){
                    this.mainModel.vo.workPermit.cardTpl={};
                    this.mainModel.vo.workPermit.cardTplId="";
                }
            },
            //发起作业选择模板后
            selectedTplAddPtw:function(item) {
                var _this = this;
                workCardApi.tplDetail(item.tplId).then(function (data) {
                    var _model = model.cardTpl();
                    var permitModel = model.permitDetail();
                    permitModel.pms.requiredJSA=_this.mainModel.requiredJSA;
                    _.extend(_model, data);
                    permitModel.cardTpl.id = item.tplId;
                    permitModel.workCatalog.id = item.workCardCatalogId;
                    permitModel.workLevelId = item.workLevelId;
                    permitModel.enableOperatingType = item.enableOperatingType; // enableSuperviseRecord
                    permitModel.enableSuperviseRecord = item.enableSuperviseRecord;
                    permitModel.enableSafetyEducator = item.enableSafetyEducator;
                    permitModel.extensionType = item.extensionType;
                    permitModel.extensionTime = item.extensionTime;
                    permitModel.extensionUnit = item.extensionUnit;

                    workCardApi.getUUID().then(function (res) {
                        permitModel.id = res.data;
                        objModel.permitHandler(permitModel,_model,true);
                        console.log("直接创建穿过的model",_model);
                        _this.$refs.ptwFill.init(_model, permitModel,null,_this.mainModel.vo,{
                            type:"create"
                        });
                    });
                });
            },
            reloadTable: function () {
                this.refreshMainTable();
            },

            gotoPreview:function () {
                var _this = this;
              api.getWorkCardDetail({id:this.mainModel.vo.id}).then(function (item) {
                  var vo = item.data;
                  workCardApi.tplDetail(_this.mainModel.vo.workPermit.cardTplId).then(function (model1) {
                      workCardApi.getWorkPermit(_this.mainModel.vo.workPermit.id).then(function (permit1) {
                            model.getViewData(permit1, model1);
                            _this.showPreview(vo, permit1);
                      });
                  })
              });
            },

            // doPreview:function () {
            //     this.$refs.ptwInfoView.showPreview();
            // },

            showPreview:function (vo, permit) {
                this.$refs.preview.init(vo, permit);
                this.mainModel.previewShow = true;
            }

        },
        events: {
            "ev_doAddPtw": function (vo) {
                this.showApprovalModel(vo);
            }
        },
        init: function () {
            api.__auth__ = {
                "create": "7080002001",//发起作业
                'delete': '7080002003',//删除
                'deal': '7080002007',//处理
                'relate': '7080002008',//关联作业
                'preview': '7080002009',//预览
            };
            this.$api = api;
        },
        created: function () {
            var enable = LIB.getBusinessSetByNamePath("ptw.enableReservation");
            this.mainModel.isOrder = enable.result == 2;
            this.mainModel.enableReservation=enable.result;
            var requiredJSA =LIB.getBusinessSetByNamePath("ptw.isJsaRequired");
            this.mainModel.requiredJSA= requiredJSA.result == 2;
        }
    });

    return vm;
});
