/**
 * Created by yyt on 2017/5/20.
 */
define(function (require) {
    var LIB = require('lib');
    var Vue = require("vue");
    var tpl = require("text!./import.html");
    var Msg = require("components/iviewMessage");
    //编辑导入页面
    var importingComponent = require("./importing");

    //数据模型
    var dataModel = {
        showImportingModal: false,
        percent: {
            type: Number,
            default: 0
        },
        uploadData: {
            type: Array,
            default: function () {
                return []
            }
        },
        events: {},
        params: { importType: null }
    };
    var opts = {
        template: tpl,
        data: function () {
            return dataModel;
        },
        props: {
            initFun: {
                type: Function,
            },
            url: {
                type: String,
                'default': '/file/upload'
            },
            templeteUrl: {
                type: String,
                'default': null
            },
            helperUrl: {
                type: String,
                default: ''
            },
            isConfirming: {
                type: Boolean,
                default: false
            },
            maxFileSize: {
                type: String
            },
            isShowImportMode: {
                type: Boolean,
                default: false
            },
            createDrection: {
                type: String,
                default:"把当前数据新增加入到系统中"
            },
            updateDrection: {
                type: String,
                default: "依据Excel文件中的所属单位来更新系统中存在的数据"

            }
        },

        computed: {
            showHelperLink: function () {
                return !!this.helperUrl;
            }
        },
        components: {
            "importingcomponent": importingComponent
        },
        methods: {
            importing: function importing() {
                if (this.uploadData.length > 0) {
                    this.showImportingModal = true;
                    this.$broadcast("doUploadStart");
                } else {
                    LIB.Msg.info("请选择文件!")
                }
            },
            // 下载模板
            doExportExcel: function () {
                if (!!this.templeteUrl) {
                    window.open(this.templeteUrl);
                } else {
                    this.$emit("do-down-file");
                }
            },
            downloadHelperDocument: function () {
                if (this.helperUrl) {
                    window.open(this.helperUrl);
                } else {
                    LIB.Msg.error("没有找到帮助文档");
                }
            },
            doUpload: function (up, files) {
                this.uploadData = [];
                this.uploadData.push(files[0]);
            },
            onUploadDone: function (data) {
                if (this.isShowImportMode) {
                    this.params.importType = 1;
                } else {
                    this.params = {};
                }
                if (data.rs.content.length > 0) {
                    Msg.error("导入失败!");
                    this.$broadcast("doClearFiles");
                } else {
                    Msg.info("导入成功!");
                    this.$dispatch("ev_upload_success");
                }
                this.$broadcast("ev_importDone", data.rs);
            },
            onUploadError: function (up, res) {
                var _this = this;
                if (res.error === "E200105") {
                    this.showImportingModal = false;
                    this.isConfirming = true;
                    LIB.Modal.confirm({
                        title: res.message,
                        onOk: function () {
                            _this.showImportingModal = true;
                            _this.$broadcast("doConfirm", up);
                        },
                        onCancel: function () {
                            _this.isConfirming = false;
                            _this.uploadData = [];
                            _this.$broadcast("doClearFiles");
                        }
                    });
                } else {
                    _this.$broadcast("doClearFiles");
                    this.$broadcast("ev_importError");
                    Msg.error("导入失败!");
                }
            },
            onUploadComplete: function (isConfirming) {
                if (!isConfirming) {
                    this.uploadData = [];
                }
            },
            hideComponent: function () {
                this.showImportingModal = false;
            }
        },
        created: function () {
            this.events = {
                onErrorUpload: this.onUploadError,
                onSuccessUpload: this.onUploadDone
            }
        },
        events: {
            "ev_importingCanceled": function () {
                this.showImportingModal = false;
            },
            "ev_main": function () {
                this.importing();
            },
            "ev_refresh": function () {
                this.uploadData = [];
                if (this.isShowImportMode) {
                    this.params.importType = 1;
                } else {
                    this.params.importType = null;
                }
            },
            "ev_update_url": function (url) {
                this.$refs.uploader.setOption("url", url)
            }
        }
    };
    var component = Vue.extend(opts);
    Vue.component('import-component', component);
});