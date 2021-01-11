define(function (require) {
    var LIB = require('lib');
    var videoHelper = require("tools/videoHelper");
    //数据模型
    var api = require("../vuex/api");
    var tpl = require("text!./edit.html");
    //弹框
    //风险评估模型
    var riskModel = require("views/basicSetting/basicFile/evaluationModel/dialog/riskModel");

    var dominationAreaSelectModal = require("componentsEx/selectTableModal/dominationAreaSelectModal");
    var checkObjectSelectModal = require("componentsEx/checkObjSelectModal/main");
//    var checkBasisSelectModal = require("componentsEx/checkBasisSelectModal/checkBasisSelectModal");

    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var dependencyTree = require("../../hiddenDanger/inspectionPlan/dialog/dependencyTree");



    tpl = LIB.renderHTML(tpl);

    var map = {
        "enum": require('text!componentsEx/template/enum.html')
    };
    var columsCfg = LIB.setting.fieldSetting["BC_HaG_HazR"] ? LIB.setting.fieldSetting["BC_HaG_HazR"] : [];
    var columsCfg1 = columsCfg;
    columsCfg = _.groupBy(columsCfg, "formItemGroup");
    var customTpl = LIB.formRenderMgr.renderHtml(map, columsCfg);
    tpl = tpl.replace('$hook', customTpl);
    var newVO = function () {
        return LIB.dataRenderMgr.renderVO({
            id: null,
            attr2: null,//erp工单号
            type: null,
            danger: null,
            problem: null,
            riskLevel: null,
            riskModelId: null,
            pictures: [],
            videos: [],
            //公司id
            compId: null,
            //部門id
            orgId: null,
            user: {id: null, name: null},
            latentDefect: null,
            dominationAreaId: '',
            dominationArea: {id: '', name: ''},
            checkObj: {id: '', name: '', checkType: ''},
//            legalRegulationId: null,
//            legalRegulation: {id: '', name: ''},
            specialty: '',
            hiddenDangerType:null,
            problemFinder: null,
            bizType:null,
            problemReason:null,
            principalOrgId: null, // 负责人部门id
            principalId: null,  //负责人id
            principalName: null, //负责人名字
            userPrincipal: {id:null,name:null},
            riskJudgementType: null, // 风险判断类型
            firstLevel: null,
            secondLevel: null,
            lowOldBadLevel :null,
            hseType:null,
            discoveryChannel:null
        }, columsCfg1);
    };

    //图片上传后回调方法声明
    var uploadEvents = {
        //图片
        pictures: function (param) {
            var rs = param.rs;
            dataModel.mainModel.vo.pictures.push(LIB.convertFileData(rs.content));
        },
        //视频
        videos: function (param) {
            var rs = param.rs;
            dataModel.mainModel.vo.videos.push(LIB.convertFileData(rs.content));
        },
        //视频第一帧
        videoPics: function (param) {
            var rs = param.rs;
            dataModel.mainModel.vo.videoPics.push(LIB.convertFileData(rs.content));
        }
    }
    //数据模型

    var dataModel = {
        mainModel: {
            enableDiscoveryChannel: false, // 是否启用发现渠道
            enableRespOrgId: false,
            vo: newVO(),
            //当前的操作类型， create：创建， update ：更新， 影响'保存'按钮的事件处理
            opType: "",
            //来源是否为检查记录
            isFromRecord: false,
            //检查项类型
            checkItemTypes: LIB.getDataDicList("pool_type"),
            // infoSourceList:LIB.getDataDicList("info_source"),
            // professionList:LIB.getDataDicList("profession"),
            // systemElementList:LIB.getDataDicList("system_element")
            showUserSelectModal: false,
            riskJudgementTypeList: [],
            riskLevelMapList:[],
            poolBizSourceType:LIB.getDataDicList('pool_biz_source_type'),
            enableHSEType:false
        },
        //图片
        pictures: {
            params: {
                recordId: null,
                dataType: 'E1',

            },
            filters: {
                max_file_size: '10mb',
                mime_types: [{title: "files", extensions: "png,jpg,jpeg"}]
                //},
                //events: {
                //    onSuccessUpload: uploadEvents.pictures
            }
        },
        //视频
        videos: {
            params: {
                recordId: null,
                dataType: 'E2'
            },
            filters: {
                max_file_size: '10mb',
                mime_types: [{title: "files", extensions: "mp4,avi,flv,3gp"}]
                //},
                //events: {
                //    onSuccessUpload: uploadEvents.videos
            }
        },
        //视频第一帧
        videoPics: {
            params: {
                recordId: null,
                dataType: 'E3'
            },
            filters: {
                max_file_size: '10mb',
                mime_types: [{title: "files", extensions: "png,jpg,jpeg"}]
            },
            events: {
                onSuccessUpload: uploadEvents.videos
            }
        },
        //选择受检对象
        checkObjectModel: {
            //显示弹框
            show: false,
            title: "选择受检对象",
            id: null
        },
        riskModel: {
            id: null,
            opts: [],
            result: null
        },
        playModel: {
            title: "视频播放",
            show: false,
            id: null
        },
        picModel: {
            title: "图片显示",
            show: false,
            id: null
        },
        selectModel: {
            disabled: false,
            dominationAreaSelectModel: {
                visible: false,
                filterData: {orgId: null}
            },
            checkObjSelectModel: {
                visible: false
            }
        },
        selectUserModel: {
            disabled: true
        },
//        checkBasis: {
//            visible: false,
//            filterData: null
//        },
        rules: {},
        checkObjectSelectModel: {
            visible: false
        },
        showSpecialty: false,
        isErpDisable: true,//是否禁用ERP工单整改
        isShowXBGDField:false,

    };
    //初始化上传组件RecordId参数
    var initUploadorRecordId = function (recordId) {
        dataModel.pictures.params.recordId = recordId;
        dataModel.videos.params.recordId = recordId;
        dataModel.videoPics.params.recordId = recordId;
    }
    //声明detail组件
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
        mixins: [LIB.VueMixin.dataDic],
        template: tpl,
        components: {
            'risk-model': riskModel,
            dominationareaSelectModal: dominationAreaSelectModal,
            'check-object-select-modal': checkObjectSelectModal,
            "userSelectModal": userSelectModal,
            "dependencyTree": dependencyTree
//            checkBasisSelectModal: checkBasisSelectModal
        },
        data: function () {
            var _this = this
            var renderRules = _.bind(LIB.dataRenderMgr.renderRules, this, columsCfg);
            var rules = renderRules({
                type: [
                    {required: true, message: '请选择隐患类型'}
                ],
                problem: [
                    {required: true, message: '请输入问题描述'},
                    LIB.formRuleMgr.length(500, 1)
                ],
                discoveryChannel: [
                    {required: true, message: '请输入发现渠道'},
                    LIB.formRuleMgr.length(200, 1)
                ],
                hiddenDangerType:[LIB.formRuleMgr.allowIntEmpty],
                compId: [
                    {required: true, message: '请选择所属公司'}
                ],
                orgId: [
                    {required: true, message: '请选择所属部门'},
                    {
                        validator: function (rule, value, callback) {
                            var error = [];
                            if (dataModel.mainModel.vo.orgId === dataModel.mainModel.vo.compId) {
                                error.push("请选择所属部门");
                            }
                            callback(error);
                        }
                    }
                ],
                "dominationArea.id": [
                    {required: true, message: '请选择属地'}
                ],
                specialty: [
                    {required: true, message: '请选择专业'}
                ],
                "hseType": [LIB.formRuleMgr.require("HSE类型"),
                    LIB.formRuleMgr.length()
                ],
                firstLevel:[LIB.formRuleMgr.allowIntEmpty],
                secondLevel:[LIB.formRuleMgr.allowIntEmpty],
                lowOldBadLevel:[LIB.formRuleMgr.allowIntEmpty],
                riskJudgementType:[LIB.formRuleMgr.allowIntEmpty],
            });

            dataModel.rules = _.extend(rules, dataModel.rules);
            return dataModel
        },
        computed: {
            //是否为修改操作
            isUpdateOpType: function () {
                return "update" === this.mainModel.opType;
            }
        },
        watch: {
            "mainModel.vo.orgId": function (nVal) {
                if(this.isModalSet || this.isInit) {
                    this.isModalSet = false;
                    this.isInit = false;
                    return;
                }

                if(nVal && this.mainModel.vo.compId != nVal) {
                    this._setDominationArea();
                }
            },
            "riskModel": function (val) {
                if (!val) return;
                var obj = _.find(this.mainModel.riskLevelMapList, function (item) {
                    return item.value == val.result;
                });

                this.mainModel.riskJudgementTypeList = [];

                if(obj){
                    if(obj.content == '10')
                        this.mainModel.riskJudgementTypeList = LIB.getDataDicList('pool_low_risk')
                    if(obj.content == '20')
                        this.mainModel.riskJudgementTypeList = LIB.getDataDicList('pool_medium_risk')
                    if(obj.content == '30')
                        this.mainModel.riskJudgementTypeList = LIB.getDataDicList('pool_high_risk')
                }

            }
        },
        methods: {
//        	doShowLegalRegulationSelectModal: function () {
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
            doDetailCreate:function () {
                this._getFormConfig() // 新增和编辑时更新表单配置参数
            },
            doDetailUpdate:function () {
                this._getFormConfig() // 新增和编辑时更新表单配置参数
            },
            getRiskJudgementTypeList:function (model) {
                var _this = this;
                if(_this.mainModel.riskLevelMapList.length> 0) return ;
                api.getRiskLevelMapList().then(function (res) {
                    _this.mainModel.riskLevelMapList = res.data[0].lookupItems;

                    var obj = _.find(_this.mainModel.riskLevelMapList, function (item) {
                        return item.value == _this.riskModel.result;
                    });
                    if(obj){
                        if(obj.content == '10')
                            this.mainModel.riskJudgementTypeList = LIB.getDataDicList('pool_low_risk')
                        if(obj.content == '20')
                            this.mainModel.riskJudgementTypeList = LIB.getDataDicList('pool_medium_risk')
                        if(obj.content == '30')
                            this.mainModel.riskJudgementTypeList = LIB.getDataDicList('pool_high_risk')
                    }

                })
            },

            doSaveUser : function(selectedDatas) {
                if (selectedDatas) {
                    this.mainModel.vo.userPrincipal = selectedDatas[0];
                    this.mainModel.vo.principalOrgId =  selectedDatas[0].orgId // 负责人部门id
                    this.mainModel.vo.principalId= selectedDatas[0].id  //负责人id
                    this.mainModel.vo.principalName= selectedDatas[0].name //负责人名字
                }
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
                    } else {
                        _this.mainModel.vo.dominationArea = {
                            id: "",
                            name: ""
                        }
                    }
                });
            },
            doSave: function () {
                var _this = this;
                if (!this.riskModel) {
                    this.riskModel = {
                        id: null
                    }
                }

                this.mainModel.vo.riskLevel = JSON.stringify(this.riskModel);
                this.mainModel.vo.riskModelId = this.riskModel.id;
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        //由于详情接口返回的数据，在新增时，未清理干净。特指定具体修改表单提交参数
                        var params = _.pick(_this.mainModel.vo, ['id', 'attr2', 'user','compId'
                            ,'orgId','dominationArea','checkObj','problem','latentDefect','danger'
                            ,'type','riskLevel','riskModelId', 'specialty',"legalRegulationId","hiddenDangerType","problemFinder","bizType","problemReason",
                            "principalOrgId", "principalId", "principalName", "firstLevel", "secondLevel","lowOldBadLevel", "riskJudgementType","checkBasis","hseType",
                            "discoveryChannel"
                        ]);
                        params.criteria = {
                            intValue: {},
                            strValue: {}
                        };
                        // if(!_this.mainModel.vo.firstLevel){
                        //     params.criteria.intValue['firstLevel_empty'] = 1;
                        // }
                        // if(!_this.mainModel.vo.secondLevel){
                        //     params.criteria.intValue['secondLevel_empty'] = 1;
                        // }
                        // if(!_this.mainModel.vo.lowOldBadLevel){
                        //     params.criteria.intValue['lowOldBadLevel_empty'] = 1;
                        // }

                        if(!_this.mainModel.vo.userPrincipal.id){
                            params.criteria.strValue['principalOrgId_empty'] = '1';
                            params.criteria.strValue['principalId_empty'] = '1';
                            params.criteria.strValue['principalName_empty'] = '1';
                            params.principalOrgId = null;
                            params.principalId = null;
                            params.principalName = null;
                        }
                        // if(!_this.mainModel.vo.riskJudgementType){
                        //     params.criteria.intValue['riskJudgementType_empty'] = 1;
                        //     _this.mainModel.vo.riskJudgementType = '';
                        // }

                        if (_this.mainModel.opType === "create") {
                            api.create(params).then(function (res) {
                                    _this.$dispatch("ev_editFinshed");
                                    LIB.Msg.info("保存成功");
                                    _this.mainModel.vo.compId = '';
                            });
                        } else {
                            delete _this.mainModel.vo.riskModel;

                            params = _this._checkEmptyValue(params);
                            api.update(params).then(function (res) {
                                _this.$dispatch("ev_editUpdate", _this.mainModel.vo);
                                LIB.Msg.info("修改成功");
                                _this.mainModel.vo.compId = '';
                            });
                        }
                    } else {
                        return false;
                    }
                });

            },
            // 处理某些值前端传空值，后端不能正确删除的问题
            // 需要在rules对应的字段中加入LIB.formRuleMgr.allowIntEmpty或者LIB.formRuleMgr.allowStrEmpty
            _checkEmptyValue: function (_vo) {
                var vo = _vo || this.mainModel.vo;
                var beforeEditVo = this.mainModel.beforeEditVo;

                if(this.mainModel.opType !== 'update') {
                    return vo;
                }

                var rules = this.rules;

                function _setValue(key, type) {
                    if(_.get(beforeEditVo, key) == _.get(vo, key) || _.get(vo, key)) {
                        return;
                    }
                    var _val = type === 'int' ? 1 : '1';

                    if (_.includes(key, ".")) {
                        key = key.replace(/\.(\w)/g, function (match, $1) {
                            return $1.toUpperCase()
                        });
                    }

                    var _key = 'criteria.' + type + 'Value.' + key + '_empty';
                    _.set(vo, _key, _val);
                }

                _.forOwn(rules, function (rule, key) {
                    if (_.isArray(rule)) {
                        _.forEach(rule, function (prop) {
                            if (_.has(prop, 'allowEmptyType')) {
                                _setValue(key, _.get(prop, 'allowEmptyType'));
                            }
                        })
                    }
                });

                return vo;
            },
            /**
             * 
             */
            _getFormConfig: function ()  {
                this.mainModel.enableHSEType = LIB.getBusinessSetStateByNamePath("radomObserSet.enableHSEType") || null
                this.mainModel.enableDiscoveryChannel = LIB.getBusinessSetStateByNamePath("poolGovern.enableDiscoveryChannel");
                var requireDiscoveryChannel = LIB.getBusinessSetStateByNamePath("poolGovern.requireDiscoveryChannel") || null
                // this.mainModel.enableRespOrgId = LIB.getBusinessSetStateByNamePath("poolGovern.enableRespOrgId") || null
                // var requireRespOrgId = LIB.getBusinessSetStateByNamePath("poolGovern.requireRespOrgId") || null
                if(this.mainModel.enableDiscoveryChannel){
                    this.$set('rules.discoveryChannel', [
                      {required: requireDiscoveryChannel, message: '请输入发现渠道'},
                         LIB.formRuleMgr.length(200, 1)
                     ])
                } 
                // if (this.mainModel.enableRespOrgId){
                //     this.$set('rules.equipment', [
                //         {required: requireRespOrgId, message: '请选择治理部门'},
                //     ])
                // }
            },
            doCancel: function () {
                this.$dispatch("ev_editCanceled");
            },
            selectCheckObject: function () {
                this.checkObjectModel.show = true;
                this.$broadcast('ev_hdCheckObjectReload', this.mainModel.vo.id);
            },
            doVideosSuccessUpload: uploadEvents.videos,
            doPicSuccessUpload: uploadEvents.pictures,
            doPic: function (fileId) {
                this.picModel.show = true;
                this.picModel.id = fileId;
            },
            doDeleteFile: function (fileId, index, arrays) {
                var ids = [];
                ids[0] = fileId;

                LIB.Modal.confirm({
                    title: '删除选中数据?',
                    onOk: function () {
                        api._deleteFile(null, ids).then(function (data) {
                            if (data.data && data.error != '0') {
                                LIB.Msg.warning("删除失败");
                            } else {
                                arrays.splice(index, 1);
                                LIB.Msg.success("删除成功");
                            }
                        });
                    }
                });
            },
            doPlay: function (video) {
                this.playModel.show = true;
                setTimeout(function () {
                    videoHelper.create("player", video);
                }, 50);
            },
            convertPicPath: LIB.convertPicPath,
            convertPath: LIB.convertPath,
            doShowDominationAreaSelectModal: function () {
                if(!this.mainModel.vo.orgId) {
                    return LIB.Msg.warning("请先选中所属部门");
                }
                this.selectModel.dominationAreaSelectModel.filterData = {orgId: this.mainModel.vo.orgId};
                this.selectModel.dominationAreaSelectModel.visible = true;
            },
            doClearDominationArea: function () {
                this.mainModel.vo.dominationArea = {};
                this.mainModel.vo.dominationAreaId =null;
            },
            doSaveDominationArea: function (selectedDatas) {
                var item = selectedDatas[0];
                if(!item) {
                    this.mainModel.vo.dominationArea = {};
                    this.mainModel.vo.dominationAreaId =null;
                    this.selectModel.dominationAreaSelectModel.visible=false;
                    return ;
                }
                // if(item.id === this.mainModel.vo.dominationArea.id) {
                //     return;
                // }
                this.mainModel.vo.dominationArea = selectedDatas[0];
                this.mainModel.vo.dominationAreaId = selectedDatas[0].id;
                // window.changeMarkObj.hasDominationAreaChanged = true;
                this.selectModel.dominationAreaSelectModel.visible=false
            },
            doShowCheckObjSelectModal: function () {
                this.checkObjectSelectModel.visible = true;
            },
            doSaveCheckObject: function (data, type) {
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
                        this.mainModel.vo.dominationArea = data.checkObj.dominationArea;

                        this.mainModel.vo.dominationAreaId = data.checkObj.dominationArea.id;

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
            _updateShowSpecialty: function () {
                var _this = this;
                api.getShowSpecialtyConfig().then(function (res) {
                    var result = _.get(res, "data.result", '1');
                    _this.showSpecialty = (result === '2');
                })
            },
            _init: function (nVal) {
                var bizType = this.$route.query.bizType;
                if(bizType){
                    var splice = bizType.split(",");
                    this.mainModel.poolBizSourceType = _.filter(LIB.getDataDicList("pool_biz_source_type"),function(it){
                        return _.contains(splice,it.id)
                    });
                    this.$set('rules.bizType', [ {required: true, message: '请输入业务来源'} ])
                }else{
                    this.mainModel.poolBizSourceType = LIB.getDataDicList("pool_biz_source_type");
                    this.$set('rules.bizType', [ ])
                }
                this._updateShowSpecialty();

                var _this = this;
                //注意！ events中使用 绑定的data， 需要通过全局对象直接引用， 而methods中可以直接通过this引用到data
                var _data = dataModel.mainModel;
                var _vo = dataModel.mainModel.vo;
                this.$refs.ruleform.resetFields();

                this.getRiskJudgementTypeList(); //获取配置

                dataModel.riskModel = {
                    id: null,
                    opts: [],
                    result: null
                };
                //清空数据
                _.extend(_vo, newVO());
                _data.isFromRecord = false;
                //存在nVal则是update
                if (!!nVal) {
                    _data.opType = "update";
                    initUploadorRecordId(nVal);
                    api.get({id: nVal}).then(function (res) {
                        _this.isInit = true;

                        //初始化数据
                        _.deepExtend(_vo, res.data);
                        // _vo.checkObjectName = res.data.checkObject.name;
                        dataModel.riskModel = JSON.parse(_vo.riskLevel);

                        //如果检查项类型存在,下拉框禁用
                        // if(_vo.type){
                        //     dataModel.selectModel.disabled=true;
                        // }
                        //手动登记/随机观察可以编辑，检查记录下拉禁用
                        if (_vo.sourceType == 1) {
                            dataModel.selectModel.disabled = true;
                            _data.isFromRecord = true;
                        }

                        // 初始化负责人
                        _vo.userPrincipal = {id:_vo.principalId, name:_vo.principalName};

                        //初始化图片
                        api.listFile({recordId: nVal}).then(function (res) {
                            _vo.pictures = [];
                            _vo.videos = [];
                            var fileData = res.data;
                            //初始化图片数据
                            _.each(fileData, function (pic) {
                                if (pic.dataType === "E1") {
                                    _vo.pictures.push(LIB.convertFileData(pic));
                                } else if (pic.dataType === "E2") {
                                    _vo.videos.push(LIB.convertFileData(pic));
                                }
                            });
                        });

                        if(_vo.sourceType == 0) {
                            api.getViolation({relId: _vo.id, relType:0}).then(function (res) {
                                _vo.legalRegulation = _.get(res, "data[0].legalRegulation", {});
                            })
                        }else if(_vo.sourceType == 1) {
                            api.getViolation({relId: _vo.sourceId, relType:1}).then(function (res) {
                                _vo.legalRegulation = _.get(res, "data[0].legalRegulation", {});
                            })
                        }else if(_vo.sourceType == 2) {
                            api.getViolation({relId: _vo.sourceId, relType:2}).then(function (res) {
                                _vo.legalRegulation = _.get(res, "data[0].legalRegulation", {});
                            })
                        }
                    });
                    _this.mainModel.vo.legalRegulation = {id:null,name:null};
//                    api.getViolation({relId: nVal, relType:0}).then(function (res) {
//                        _this.mainModel.vo.legalRegulation = _.get(res, "data[0].legalRegulation", {});
//                    })
                }
                else {
                    this.isInit = false;
                    _data.opType = "create";
                    //如果检查项类型存在,下拉框禁用
                    dataModel.selectModel.disabled = false;
                    _vo.user = LIB.user.id === "9999999999" ? {} : LIB.user;
                    api.getUUID().then(function (res) {
                        _vo.id = res.data;
                        initUploadorRecordId(res.data);
                    });
                    this.mainModel.vo.compId = LIB.user.compId;
                }

                api.queryErpSet().then(function(res){
                    if(res.data) {
                        _this.isErpDisable = (res.data.result == "1");
                    }
                });
                this.isShowXBGDField = LIB.getBusinessSetStateByNamePath('poolGovern.isShowXBGDField');
            }
        },
        events: {
            //edit框数据加载
            "ev_editReload": function (nVal) {
                this._init(nVal);
            },
            //edit框数据加载(解决与其他弹窗冲突)
            "ev_editReload_pool": function (nVal) {
                this._init(nVal);
            },
            //selectCheckTable框点击保存后事件处理
            "ev_editCheckObjectFinshed": function (obj) {
                this.checkObjectModel.show = false;
                //注意！ events中使用 绑定的data， 需要通过全局对象直接引用， 而methods中可以直接通过this引用到data
                var _vo = dataModel.mainModel.vo;

                ////初始化数据
                //_vo.checkObjectId = obj.checkObjectId;
                //_vo.checkObjectName = obj.checkObjectName;
            },
            "ev_editCheckObjectCancel": function () {
                this.checkObjectModel.show = false;
            }
        },
        ready: function () {
            this.setOrgMethod = 1;
            this.isModalSet = false;
            // 页面进入获取配置参数
            this._getFormConfig()
        }
    });

    return detail;
});