define(function (require) {
    var LIB = require("lib");
    var Vue = require("vue");
    var template = require("text!./modalFormSafetyEvalution.html");
    var api = require("../../vuex/api");
    var model = require("../../model");
    return Vue.extend({
        template: template,
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
        components: {},
        props: {
            visible: Boolean,
            model: Object,
            title: String,
        },
        data: function () {
            return {
                enum: model.enum,
                load: false,
                type: "", //edit,add模式
                dataType: "other",//数据类型 'common'公共 other:"私有"
                typeName: {
                    add: "新增",
                    edit: "修改",
                    view: "详细信息",
                },
                valiRules: {
                    "evaluateDate": [LIB.formRuleMgr.require("评价时间")], //评价时间
                    "evaluateReason": [LIB.formRuleMgr.length(100)], //评价原因
                    "trusteeUnit": [LIB.formRuleMgr.require("委托单位"), LIB.formRuleMgr.length(100)], //委托单位
                    "trusteeCorp": [LIB.formRuleMgr.length(50)], //委托单位法人
                    "trusteeCorpMobile": [LIB.formRuleMgr.length(50)], //法人电话
                    "trusteeLinkman": [LIB.formRuleMgr.length(50)], //委托单位联系人
                    "trusteeLinkmanMobile": [LIB.formRuleMgr.length(50)], //联系人电话
                    // "mrsName": [LIB.formRuleMgr.require("安全评价单位")], //重大危险源名称
                    // "riskLevel":  [LIB.formRuleMgr.length(100)],//重大危险源等级
                    "controlProcedure": [LIB.formRuleMgr.length(100)], //危险源控制程序
                    "remark": [LIB.formRuleMgr.length(200)], //备注
                    "evaluateUnit": [LIB.formRuleMgr.require("安全评价单位")], //安全评价单位
                    "reportNumber": [LIB.formRuleMgr.length(100)], //评价报告书编号

                },
                emptyRules: {},
                uploadModel: {
                    //安全评价报告
                    "SE1": {
                        params: {
                            recordId: null,
                            dataType: 'SE1',
                            fileType: 'SE'
                        },
                        filters: {
                            max_file_size: '100mb',
                            mime_types: [{
                                title: "files",
                                extensions: "pdf,doc,docx,xls,xlsx,ppt,pptx,zip,rar,txt,mp4,avi,flv,3gp"
                            }]
                        },
                        events: {
                            onSuccessUpload: true,
                        }
                    },
                    //其他附件(外部评审记录等信息）
                    "SE2": {
                        params: {
                            recordId: null,
                            dataType: 'SE2', ////其他附件(外部评审记录等信息
                            fileType: 'SE'
                        },
                        filters: {
                            max_file_size: '100mb',
                            mime_types: [{
                                title: "files",
                                extensions: "pdf,doc,docx,xls,xlsx,ppt,pptx,zip,rar,txt,mp4,avi,flv,3gp"
                            }]
                        },
                        events: {
                            onSuccessUpload: true,
                        }
                    },
                    //备案附件
                    "SE3": {
                        params: {
                            recordId: null,
                            dataType: 'SE3', ////其他附件(外部评审记录等信息
                            fileType: 'SE'
                        },
                        filters: {
                            max_file_size: '100mb',
                            mime_types: [{
                                title: "files",
                                extensions: "pdf,doc,docx,xls,xlsx,ppt,pptx,zip,rar,txt,mp4,avi,flv,3gp"
                            }]
                        },
                        events: {
                            onSuccessUpload: true,
                        }
                    },
                    //预案备案附件
                    "SE4": {
                        params: {
                            recordId: null,
                            dataType: 'SE4',
                            fileType: 'SE'
                        },
                        filters: {
                            max_file_size: '100mb',
                            mime_types: [{
                                title: "files",
                                extensions: "pdf,doc,docx,xls,xlsx,ppt,pptx,zip,rar,txt,mp4,avi,flv,3gp"
                            }]
                        },
                        events: {
                            onSuccessUpload: true,
                        }
                    }

                },
                fileModel:{
                    "SE1":[],
                    "SE2":[],
                    "SE3":[],
                    "SE4":[],
                },
                currentUploadModel:{
                    params:{},
                    filters:{
                        max_file_size: '100mb',
                        mime_types: [{
                            title: "files",
                            extensions: "pdf,doc,docx,xls,xlsx,ppt,pptx,zip,rar,txt,mp4,avi,flv,3gp"
                        }]
                    },
                    events: {
                        onSuccessUpload: true,
                    },
                    checkFiles:function () {

                    }
                },
                uploadKey:"",
            }
        },
        computed: {
            rules: function () {
                return this.type === "view" ? this.emptyRules : this.valiRules;
            },
            readOnly: function () {
                return this.type === "view";
            },
            isCommon: function () {
                return this.dataType === "common";
            }
            // recordId: function () {//这个计算变量没用，只要用来设置params.recordId
            //     this.setRecordId();
            //     return this.model.id;
            // }
        },
        methods: {
            show: function (title) {
                this.title = title;
                this.visible = true;
            },
            init: function (dataType, type, model, name) {
                this.model =JSON.parse(JSON.stringify(model));
                this.type = type;
                this.title = this.typeName[type];
                this.visible = true;
                this.dataType = dataType;
                if (name) {
                    this.model.mrsName = name;
                }
            },
            _resolveModel: function (model) {
                model.mrsId = this.$parent.model.id;
                return model;
            },
            doSave: _.debounce(function () {
                var id = this.$parent.model.id;
                if (this.dataType === 'common') {
                    id = '9999999999';
                }
                var _this = this;
                this.$refs.form.validate(function (vali) {
                    if (vali) {
                    var saveFun = _this.type === "edit" ? api.updateMrsSafetyEvaluation : api.saveMrsSafetyEvaluation;
                    saveFun({
                        id: id
                    }, _this._resolveModel(_this.model))
                        .then(function (res) {
                            LIB.Msg.success("保存成功", 1);
                            _this.$emit("on-success", _this.model);
                            _this.doCancel();
                        });
                }
            })
            }, 100),
            doCancel: function () {
                this.visible = false;
                this.load = false;
            },
            uploadClicked: function (key) {
                var _this=this;
                this.uploadKey=key;
                var uploadModel=this.uploadModel[key];
                //这里不能用对象替换，必须要保证指针相同， 数据引用一样  //todo ,应该修改 pluupload-vue.js 不应该初始化 就决定的参数对象 ，
                _.deepExtend(this.currentUploadModel.params,uploadModel.params);
                this.currentUploadModel.params.recordId = this.model.id;
                this.currentUploadModel.filters=uploadModel.filters;
                if(key!=="SE1"){
                    this.currentUploadModel.checkFiles=function (files) {
                        var max=5-_this.fileModel[key].length;
                        if(files.length>max){
                            LIB.Msg.error("文件总数不超过5个");
                            return false;
                        }
                    }
                }
                else{
                    this.currentUploadModel.checkFiles=function () {
                        
                    }
                }
                this.$refs.uploader.$el.firstElementChild.click();

            },
            doUploadBefore: function () {
                LIB.globalLoader.show();
            },
            convertFilePath: function(file) {
              return LIB.convertFilePath(LIB.convertFileData(file));
            },
            doUploadSuccess: function (param) {
                var con = param.rs.content;
                this.fileModel[this.uploadKey].push(con);
                LIB.globalLoader.hide();
                this.$emit("on-success", "upload");
            },
            onUploadComplete: function () {
                LIB.globalLoader.hide();
            },
            doDeleteFile: function (fileId, index, array) {
                var _this = this;
                LIB.Modal.confirm({
                    title: '确定删除?',
                    onOk: function () {
                        api.deleteFile(null, [fileId]).then(function (data) {
                            if (data.data && data.error != '0') {
                                return;
                            } else {
                                array.splice(index, 1);
                                LIB.Msg.success("删除成功");
                                _this.$emit("on-success", "upload");
                            }
                        })
                    }
                });
            },
            _initFile:function () {
                var _this=this;
                for (var key in this.fileModel){
                    this.fileModel[key]=[];
                }
                this.model.files.forEach(function (item) {
                    _this.fileModel[item.dataType].push(item);
                })
            }
        },
        created: function () {

        },
        watch: {
            visible: function (val) {
                if (val && !this.load) {
                    this._initFile();
                    this.load = true;
                }
                if (!val && this.load) {
                    this.load = false;
                }
            },
            'model':function (val) {
                // this._initFile();
            }
        }
    })
})