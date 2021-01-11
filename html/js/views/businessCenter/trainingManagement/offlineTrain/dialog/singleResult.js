define(function (require) {
    //基础js
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var template = LIB.renderHTML(require("text!./singleResult.html"));

    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var certTypeSelectModal = require("componentsEx/selectTableModal/certTypeSelectModal");

    var newVO = function () {
        return {
            id: '',
            trainDate: null,
            status: '2',
            user: {id: null}
        }
    };

    var newCertVO = function() {
        return {
            id : null,
            //唯一标识
            code : null,
            //证书状态 0:无证,1:有效,2:失效
            status : null,
            //禁用标识 0未禁用，1已禁用
            disable : "0",
            //所属公司id
            compId : null,
            //所属部门id
            orgId : null,
            //发证机构
            certifyingAuthority : null,
            //生效日期
            effectiveDate : null,
            //失效日期
            expiryDate : null,
            //证件编号
            idNumber : null,
            //是否需要复审 0:不要,1:需要
            isRecheckRequired : '0',
            //领证日期
            issueDate : null,
            //作业类别
            jobClass : null,
            //操作项目
            jobContent : null,
            //提前提醒复审的月数
            noticeMonthsInAdvance : null,
            //复审周期（月）
            retrialCycle : null,
            //持有人
            user : {id:'', name:''},
            //关联课程
            course : {id:'', name:''},
            //证书类型
            certType : {id:'', name:''},
            certTypeId: null,
            //证书复审记录
            certRetrials : [],
            //证书文件
            cloudFiles : [],
            //证书复审被提醒人
            users : [],
            trainTaskId: null,
            //备注
            remark:null
        }
    };

    var dataModel = function () {
        return {
            mainModel: {
                title: '上报培训结果',
                vo: newVO(),
                certVo: newCertVO(),
                rules: {
                    "trainDate": [
                        LIB.formRuleMgr.require("通过时间")
                    ],
                    "status": [LIB.formRuleMgr.require("培训结果")]
                },
                certRules: {
                    "isRecheckRequired" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
                    "noticeMonthsInAdvance" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
                    "retrialCycle" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
                    "user.id" : [LIB.formRuleMgr.require("证书持有人")],
                    "certType.id" : [LIB.formRuleMgr.require("证书类型")],
                    "idNumber" : [LIB.formRuleMgr.require("证书编号"), LIB.formRuleMgr.length(100)],
                    "jobClass" : [LIB.formRuleMgr.require("作业类别"), LIB.formRuleMgr.length(100)],
                    "jobContent" : [LIB.formRuleMgr.require("操作项目"), LIB.formRuleMgr.length(100)],
                    "issueDate" : [LIB.formRuleMgr.require("领证日期")],
                    "effectiveDate" : [LIB.formRuleMgr.require("生效日期")],
                    "expiryDate" : [LIB.formRuleMgr.require("生效日期")],
                    "certifyingAuthority" : [LIB.formRuleMgr.length(100)],
                    "cloudFiles": [{required: true, type: "array", message: "请上传证书照片"}]
                }
            },
            selectModel : {
                userSelectModel : {
                    visible : false,
                    filterData : {orgId : null}
                },
                certTypeSelectModel : {
                    visible : false,
                    filterData : {orgId : null}
                }
            },
            uploadModel: {
                params: {
                    recordId: null,
                    dataType: 'O1',
                    fileType: 'O'
                },
                filters: {
                    max_file_size: '10mb',
                    mime_types: [{ title: "files", extensions: "png,jpg,jpeg,gif" }]
                }
            },
            isFillCertInformation: false, // 是否填写证书信息
            isCertRequired: false, // 课程是否需要取证
            currentAction: 'SETRESULT',
            images: null
        }
    };

    var SETRESULT = 'SETRESULT';
    var SETCERTIFICATE = 'SETCERTIFICATE';

    var opts = {
        mixins : [LIB.VueMixin.dataDic],
        template: template,
        components : {
            "userSelectModal": userSelectModal,
            "certtypeSelectModal": certTypeSelectModal
        },
        props: {
            visible: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            checkRequiredList: function () {
                return this.getDataDicList('itm_cert_is_recheck_required');
            },
            showVoForm: function () {
                return this.currentAction === SETRESULT;
            },
            showCertVoForm: function () {
                return this.isFillCertInformation || this.currentAction === SETCERTIFICATE;
            },

        },
        data: dataModel,
        methods: {
            init: function (id, data, action) {
                this.currentAction = action;
                this.mainModel.title = action === SETRESULT ? '上报培训结果' : '添加证书';

                this.isFillCertInformation = false;
                this.id = id; // 缓存计划id

                this.mainModel.vo = newVO();
                this.mainModel.vo.id = data.id;
                this.mainModel.vo.user.id = data.userId;
                this.mainModel.vo.status = data.status === '1' ? '1' : '2';
                this.mainModel.vo.trainDate = data.trainDate || null;

                this.isCertRequired = data.course.isCertRequired === '1'; // 课程是否需要取证

                if (action === SETRESULT && !this.isCertRequired) {
                    return;
                }
                this.mainModel.certVo = newCertVO();
                this.initCert(data);
            },

            // 创建证书时初始化证书VO
            _initCertVo: function () {
                this.mainModel.certVo = newCertVO();

                this.mainModel.certVo.course = this._certCourse;
                this.mainModel.certVo.user = this._certUser;
                this.mainModel.certVo.id = this.newCertId;
                this.uploadModel.params.recordId = this.newCertId;
                this.mainModel.certVo.retrialCycle = this._certCourse.recheckCycle;
                this.mainModel.certVo.trainTaskId = this.mainModel.vo.id;
                this.mainModel.certVo.compId = this._certUser.compId;
                this.mainModel.certVo.orgId = this._certUser.orgId;
            },

            initCert: function (data) {
                var _this = this;
                // var action = this.currentAction;
                this.oldCertId = _.get(data, "cert.id");
                this._certCourse = _.pick(data.course, ['id', 'name', 'recheckCycle']);
                this._certUser = _.pick(data.user, ['id', 'name', 'compId', 'orgId']);

                if (this.oldCertId) {
                    this.uploadModel.params.recordId = this.oldCertId;
                    api.queryCertById({id: this.oldCertId}).then(function (res) {
                        _.deepExtend(_this.mainModel.certVo, res.data);
                    });
                } else {
                    api.getUUID().then(function (res) {
                        _this.newCertId = res.data;
                        _this.uploadModel.params.recordId = res.data;
                        if (_this.currentAction === SETCERTIFICATE) {
                            _this._initCertVo();
                        }
                    });
                }

            },
            changeStatus: function (value) {
                if (value === '1') {
                    this.isFillCertInformation = false;
                } else {
                    this.mainModel.vo.trainDate = new Date().Format("yyyy-MM-dd 00:00:00");
                }
            },
            doSave : function() {

                if (this.currentAction === SETCERTIFICATE) {
                    return this._doSaveCert();
                }

                var _this = this;
                var vo = this.mainModel.vo;
                var param;
                this.$refs.ruleform.validate(function(valid) {
                    if (!valid) {
                        return;
                    }
                    param = {
                        id: vo.id,
                        trainDate: vo.trainDate,
                        status: vo.status,
                        user: vo.user
                    };
                    if (!_this.isFillCertInformation) {
                        _this._doSaveRequest(param);
                        return;
                    }
                    _this.$refs.certruleform.validate(function (valid2) {
                        if (!valid2) {
                            return;
                        }
                        param.cert = _this._normalizeCertVo();
                        _this._doSaveRequest(param);
                    })

                });
            },
            _doSaveCert: function () {
                var _this = this;
                this.$refs.certruleform.validate(function (valid2) {
                    if (!valid2) {
                        return;
                    }

                    var param = _this._normalizeCertVo();

                    if (!!_this.oldCertId) {
                        api.updateCert(param).then(function () {
                            LIB.Msg.success("保存成功");
                            _this.$emit("pass-single");
                        })
                    } else {
                        api.saveCert(param).then(function (res) {
                            LIB.Msg.success("保存成功");
                            _this.$emit("pass-single");
                        });
                    }

                })
            },
            _doSaveRequest: function (param) {
                var _this = this;
                api.updateTrainTasks({id : this.id}, [param]).then(function() {
                    _this.$emit("pass-single");
                });
            },
            _normalizeCertVo: function () {
                var param = _.cloneDeep(this.mainModel.certVo);
                if (!_.endsWith(param.effectiveDate, "00:00:00")) {
                    param.effectiveDate = param.effectiveDate + " 00:00:00";
                }
                if (!_.endsWith(param.expiryDate, "00:00:00")) {
                    param.expiryDate = param.expiryDate + " 00:00:00";
                }
                if (!_.endsWith(param.issueDate, "00:00:00")) {
                    param.issueDate = param.issueDate + " 00:00:00";
                }
                return param;
            },


            // 改变时需要清空之前填写的内容
            changeCertInformation: function (checked) {
                if (checked && !this.oldCertId) {
                    this._initCertVo();
                }
            },

            uploadClicked: function () {
                this.$refs.uploader.$el.firstElementChild.click();
            },
            doUploadBefore: function () {
                LIB.globalLoader.show();
            },
            doUploadSuccess: function (param) {
                var con = param.rs.content;
                this.mainModel.certVo.cloudFiles.push(con);
                LIB.globalLoader.hide();
            },
            onUploadComplete: function () {
                LIB.globalLoader.hide();
            },
            removeFile: function (fileId, index) {
                var _this = this;
                LIB.Modal.confirm({
                    title: "确定删除文件？",
                    onOk: function() {
                        api.deleteFile(null, [fileId]).then(function () {
                            _this.mainModel.certVo.cloudFiles.splice(index, 1);
                        })
                    }
                });
            },
            doViewImages: function (index) {
                var images = this.mainModel.certVo.cloudFiles;
                this.images = _.map(images, function (content) {
                    return {
                        fileId: content.id,
                        name: content.orginalName,
                        fileExt: content.ext
                    }
                });
                var _this = this;
                setTimeout(function () {
                    _this.$refs.imageViewer.view(index);
                }, 100);
            },


            doShowUserSelectModal : function() {
                this.selectModel.userSelectModel.visible = true;
                //this.selectModel.userSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
            },
            doSaveUsers : function(selectedDatas) {
                var rows = _.map(selectedDatas, function (row) {
                    return {
                        id: row.id,
                        name: row.name
                    }
                });
                this.mainModel.certVo.users = rows;
            },

            doShowCertTypeSelectModal : function() {
                this.selectModel.certTypeSelectModel.visible = true;
            },
            doSaveCertType : function(selectedDatas) {
                if (!_.isArray(selectedDatas) || _.isEmpty(selectedDatas)) {
                    return;
                }
                var row = selectedDatas[0];
                this.mainModel.certVo.certType = row;
                this.mainModel.certVo.certTypeId = row.id;
            },
        }
    };

    return opts;
});