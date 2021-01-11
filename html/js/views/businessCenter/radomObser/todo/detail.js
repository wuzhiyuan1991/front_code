define(function (require) {
    var LIB = require('lib');
    var api = require("../vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail.html");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var checkObjectSelectModal = require("componentsEx/checkObjSelectModal/main");
    var dominationAreaSelectModal = require("componentsEx/selectTableModal/dominationAreaSelectModal");

//    var checkBasisSelectModal = require("componentsEx/checkBasisSelectModal/checkBasisSelectModal");
    //初始化数据模型
    var newVO = function () {
        return {
            //id
            id: null,
            //
            code: null,
            //内容
            content: null,
            //来源 0:手机检查  1：web录入 2 其他
            checkSource: 1,
            //状态   0:待提交 1:待审核 2:已转隐患 3:被否决 4:已分享
            status: '0',
            //
            compId: null,
            //组织id
            orgId: null,
            //审核时间
            auditDate: null,
            //检查时间
            checkDate: null,
            //关闭时间
            closeDate: null,
            //是否禁用，0启用，1禁用
            disable: null,
            //点赞数
            praises: null,
            //发布者姓名
            publisherName: null,
            //备注
            remarks: null,
            //评论数
            reviews: null,
            //修改日期
            modifyDate: null,
            //创建日期
            createDate: null,
            //受检对象
            checkObj: {id: '', name: '', checkType: ''},
            //检查人
            user: {id: null, name: null},
            dominationAreaId: '',
            dominationArea: {id: '', name: ''},
            //问题类型, 0:行为类, 1:状态类, 2:管理类
            checkItemType:null,
            //整改类型 0-立即整改,1-正常整改
            reformType:null,
            //1.随机观察 2.领导力分享 3.随机观察分享
            type: null,
            //操作类型 1隐患问题-现场整改 2隐患问题-上报属地 3行为事件-分享
            operationType:null,
            checkLevel:null,
            hseType:null,
//            legalRegulationId: null,
//            legalRegulation: {id: '', name: ''}
        }
    };
    //Vue数据
    var dataModel = {
        mainModel: {
            businessLists:[],
            enableCheckLevel: false,
            enableHSEType: false,
            vo: newVO(),
            opType: 'view',
            isReadOnly: true,
            title: "",
            showUserSelectModal: false,
            showEquipmentSelectModal: false,

            endTime:null,  // 结束时间

            //验证规则
            rules: {
                //"code":[LIB.formRuleMgr.require("编码")]
                "code": [LIB.formRuleMgr.require(""),
                    LIB.formRuleMgr.length()
                ],
                compId: [
                    {required: true, message: '请选择所属公司'},
                ],
                orgId: [
                    {   required: true,
                        validator: function (rule, value, callback) {
                            var error = [];
                            if ((!value || value == dataModel.mainModel.vo.compId)) {
                                // if ((!value || value == dataModel.mainModel.vo.compId) && (dataModel.isDeptRequired || dataModel.mainModel.vo.operationType == 1)) {
                                error.push("请选择所属部门");
                            }
                            callback(error);
                        }
                    }
                ],
                "checkObj.id": [{required: true, message: '请选择检查对象'},],
                checkLevel: [{required: true, message: '请选择检查级别'},],
                "content": [LIB.formRuleMgr.require("描述"),
                    LIB.formRuleMgr.length(500)
                ],
                "checkSource": [LIB.formRuleMgr.require("来源"),
                    LIB.formRuleMgr.length()
                ],
                "user.name": [LIB.formRuleMgr.require("检查人"),
                    LIB.formRuleMgr.length()
                ],
                dominationAreaId:[
                    {required: true, message: '请选择属地'}
                ],
                "createDate": [LIB.formRuleMgr.require("检查时间"),
                    LIB.formRuleMgr.length()
                ],
                "checkItemType": [
                    {message: '请选择问题类型',required: true},
                    LIB.formRuleMgr.length()
                ],
                "operationType": [
                    {message: '请选择操作类型',required: true},
                    LIB.formRuleMgr.length()
                ],
                "hseType": [
                    {message: '请选择HSE类型',required: true},
                    LIB.formRuleMgr.length()
                ],
                "status": [LIB.formRuleMgr.require("状态"),
                    LIB.formRuleMgr.length()
                ],
                "auditDate": [LIB.formRuleMgr.length()],
                "checkDate": [LIB.formRuleMgr.require("检查时间"),
                    LIB.formRuleMgr.length()],
                "closeDate": [LIB.formRuleMgr.length()],
                "disable": [LIB.formRuleMgr.length()],
                "praises": [LIB.formRuleMgr.length()],
                "publisherName": [LIB.formRuleMgr.length()],
                "remarks": [LIB.formRuleMgr.length()],
                "reviews": [LIB.formRuleMgr.length()],
                "modifyDate": [LIB.formRuleMgr.length()],
            },
            emptyRules: {}
        },
        tableModel: {},
        formModel: {},
        selectModel: {
            dominationAreaSelectModel: {
                visible: false,
                filterData: {orgId: null}
            },
        },
        checkObjectSelectModel: {
            visible: false
        },
        fileModel: {
            pic: {
                cfg: {
                    params: {
                        recordId: null,
                        dataType: 'B1',
                        fileType: 'B',
                    },
                    filters: {
                        max_file_size: '10mb',
                        mime_types: [{title: "files", extensions: "png,jpg,jpeg"}]
                    },
                },
                data: []
            },
            video: {
                cfg: {
                    params: {
                        recordId: null,
                        dataType: 'B2',
                        fileType: 'B',
                    },
                    filters: {
                        max_file_size: '10mb',
                        mime_types: [{title: "video", extensions: "mp4"}]
                    },
                },
                data: []
            },
        },
        isUploadPic: true,
        isDeptRequired:false,
//        checkBasis: {
//            visible: false,
//            filterData: null
//        }
    };

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
    var detail = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.detailPanel],
        template: tpl,
        components: {
            "userSelectModal": userSelectModal,
            checkObjectSelectModal: checkObjectSelectModal,
            dominationareaSelectModal: dominationAreaSelectModal,
//            checkBasisSelectModal: checkBasisSelectModal
        },
        data: function () {
            return dataModel;
        },
        watch: {
            "mainModel.vo.orgId": function (nVal) {
                if(this.isModalSet || this.mainModel.isReadOnly) {
                    this.isModalSet = false;
                    return;
                }

                // 选择部门后需要自动选择该部门下的第一个属地
                if(nVal && this.mainModel.vo.compId != nVal) {
                    this._setDominationArea();
                } else {
                    this.mainModel.vo.dominationAreaId = "";
                }
            }
        },
        methods: {
            newVO: newVO,
//            doShowLegalRegulationSelectModal: function () {
//                this.checkBasis.visible = true;
//            },
//            doSaveLegalRegulations: function (data) {
//                var o = data[0];
//                if (!_.isPlainObject(o)) {
//                    return;
//                }
//                this.mainModel.vo.legalRegulationId = o.id;
//                this.mainModel.vo.legalRegulation = o;
//            },
            doSubmit: function() {
                this.$emit("do-submit", this.mainModel.vo);
            },
            doAudit: function() {
                this.$emit("do-convert", this.mainModel.vo);
            },
            _setDominationArea: function () {
                var _this = this;
                api.getDominationAreaList({orgId: this.mainModel.vo.orgId}).then(function (res) {
                    if(res.data.list && res.data.list.length > 0) {
                        var item = res.data.list[0];
                        _this.mainModel.vo.dominationArea = {
                            id: item.id,
                            name: item.name
                        }
                    }else {
                        _this.mainModel.vo.dominationArea = {
                            id: "",
                            name: ""
                        }
                    }
                });
            },
            doClearInput: function () {
                this.mainModel.vo.equipmentId = null;
            },
            doShowUserSelectModal: function () {
                this.mainModel.showUserSelectModal = true;
            },

            doShowEquipmentSelectModel: function () {
                this.mainModel.showEquipmentSelectModal = true;
                this.selectModel.equipmentSelectModel.filterData = {orgId: this.mainModel.vo.orgId};
            },
            doSaveEquipment: function (selectedDatas) {
                if (selectedDatas) {
                    var equipment = selectedDatas[0];
                    this.mainModel.vo.equipmentId = equipment.id;
                    this.mainModel.vo.equipment.name = equipment.name;
                    this.mainModel.vo.equipment.id = equipment.id;
                }
            },

            // beforeDoDelete: function () {
            //     if (this.mainModel.vo.status == 3) {
            //         LIB.Msg.warning("已被否决的记录不可以删除!");
            //         return false;
            //     }
            // },

            doSaveUser: function (selectedDatas) {
                if (selectedDatas) {
                    var user = selectedDatas[0];
                    this.mainModel.vo.user.id = user.id;
                    this.mainModel.vo.user.name = user.name;
                    this.mainModel.vo.user.username = user.name;
                }
            },
            afterInitData: function () {
                var id = this.mainModel.vo.id,
                    _vo = this.mainModel.vo;
                var type = this.mainModel.vo.type;
                var reformType = this.mainModel.vo.reformType;
                var operationType = null;
                if(type == 1) {
                    if(reformType == 1) {
                        operationType = "2";
                    }else if(reformType == 0) {
                        operationType = "1";
                    }
                }else if(type == 3) {
                    operationType = "3";
                }
                this.mainModel.vo.operationType = operationType;
            },
            beforeDoSave: function() {
                //转换字段
                if(this.mainModel.vo.operationType == 1) {
                    this.mainModel.vo.type = 1;
                    this.mainModel.vo.reformType = 0;
                }else if(this.mainModel.vo.operationType == 2) {
                    this.mainModel.vo.type = 1;
                    this.mainModel.vo.reformType = 1;
                }else if(this.mainModel.vo.operationType == 3) {
                    this.mainModel.vo.type = 3;
                    this.mainModel.vo.reformType = null;
                }
            },
            buildSaveData: function () {
                return _.omit(this.mainModel.vo, ['equipment', 'equipmentId']);
            },
            afterInit: function (transferVo, opt) {
                if (opt.opType == "create") {
                    this.mainModel.vo.compId = LIB.user.compId;
                }
            },
            doShowDominationAreaSelectModal: function () {
                if(!this.mainModel.vo.orgId) {
                    return LIB.Msg.warning("请先选中所属部门");
                }
                this.selectModel.dominationAreaSelectModel.filterData = {orgId: this.mainModel.vo.orgId};
                this.selectModel.dominationAreaSelectModel.visible = true;
            },
            doSaveDominationArea: function (selectedDatas) {
                var item = selectedDatas[0];
                if(item.id === this.mainModel.vo.dominationArea.id) {
                    return;
                }
                this.mainModel.vo.dominationArea = selectedDatas[0];
                this.mainModel.vo.dominationAreaId = selectedDatas[0].id;
                window.changeMarkObj.hasDominationAreaChanged = true;
            },
            doShowCheckObjSelectModal: function () {
                if(this.mainModel.isReadOnly) {
                    return;
                }
                this.checkObjectSelectModel.visible = true;
            },
            /**
             * 选择检查对象后需要反向给公司、部门、属地赋值
             * 由于上级变化需要清空下级的值，所以此时必须使用$nextTick顺序的赋值，方能保证各个值正确
             * @param data
             */
            doSaveCheckObject: function (data) {
                this.mainModel.vo.compId = data.checkObj.compId;
                this.$nextTick(function () {
                    this.isModalSet = true;
                    if(this.mainModel.vo.orgId === data.checkObj.orgId) {
                        this.isModalSet = false;
                    } else {
                        this.mainModel.vo.orgId = data.checkObj.orgId;
                    }

                    var type = data.checkObjType;
                    this.$nextTick(function () {
                        if(data.checkObj.dominationArea){
                            this.mainModel.vo.dominationArea = data.checkObj.dominationArea;
                            this.mainModel.vo.dominationAreaId = data.checkObj.dominationArea.id;
                            this.mainModel.vo.dominationAfdoShowCheckObjSelectModalreaId = _.propertyOf(data.checkObj)("dominationArea.id");
                        }
                        this.$nextTick(function () {
                            this.mainModel.vo.checkObj = {
                                id: data.checkObj.id,
                                name: data.checkObj.name,
                                checkType: type
                            };
                        })
                    });

                });

                this.checkObjectSelectModel.visible = false;
            },
            getRandomObserveConfig: function() {
                var _this = this;
                api.getRandomObserveConfig().then(function (res) {
                    debugger
                    if(res.data)
                    _this.isDeptRequired = (res.data.result === '1' ? false : true);
                })
            },
            findByName: function ( name) {
                var arr = this.mainModel.businessLists;
                return _.find(arr, function (item) {
                    return item.name == name;
                }) || {}
            },
            findByNameResult: function (name) {
                var arr = this.mainModel.businessLists;
                var obj = _.find(arr, function (item) {
                    return item.name == name && item.result == '2';
                });
                return  !!obj || false;
            },
            getBusinessSetting: function () {
                var _this = this;

                api.getBusinessSetting().then(function (res) {
                    _this.mainModel.businessLists = res.data.children;
                    _this.initRule();
                })
            },
            initRule: function () {
                this.mainModel.rules.checkLevel[0].required = !!this.findByNameResult('requireCheckLevel');
                this.mainModel.rules.operationType[0].required = !!this.findByNameResult('requireOperationType');
                this.mainModel.rules.checkItemType[0].required = !!this.findByNameResult('requireCheckItemType');
                this.mainModel.rules.hseType[0].required = !!this.findByNameResult('requireHSEType');
                this.mainModel.rules.dominationAreaId[0].required = !!this.findByNameResult('requireArea');
                this.mainModel.rules['checkObj.id'][0].required = !!this.findByNameResult('requireCheckObj');
            }

        },
        init: function () {
            this.$api = api;
            this.isModalSet = false;
        },
        ready: function () {
            this.mainModel.endTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
            this.getRandomObserveConfig();
            // this.mainModel.enableCheckLevel = LIB.getBusinessSetByNamePath('common.enableCheckLevel').result === '2';

            this.getBusinessSetting();

        }
    });

    return detail;
});