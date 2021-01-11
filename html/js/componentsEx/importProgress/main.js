/**
 * Created by yyt on 2017/5/20.
 */
define(function (require) {
    var Vue = require("vue");
    var LIB = require('lib');
    var template = '<Modal :visible.sync="importModel" :title="title" width="520" :footer-hide="true">' +
        '<import-component :update-drection="updateDrection" :create-drection="createDrection" :max-file-size="maxFileSize" :init-fun="initFun" :confirm-url="confirmUrl" :url="url" :is-show-import-mode="isShowImportMode" :helper-url="helperUrl" :templete-url="templeteUrl" @do-down-file="doDownFile" v-ref:imc></import-component>' +
        '</Modal>';
    var opts = {
        template: template,
        props: {
            initFun:{
                default: null
            },
            importModel: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: "导入"
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
            confirmUrl: {
                type: String,
                default: null
            },
            maxFileSize: {
                type: String
            },
            isShowImportMode:{
                type:Boolean,
                default:false
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
        data: function data() {
            return {};
        },
        components: {},
        watch: {
            "importModel": function (nVal) {
                if (nVal) {
                    this.$broadcast("ev_refresh");
                } else {
                    this.$refs.imc.hideComponent();
                }
            }
        },
        methods: {
            uploadAport: function () {
                this.importModel = true;
            },
            doDownFile: function () {
                this.$emit("do-down-file");
            }
        },
        events: {
            "ev_editClosed": function () {
                this.editModel.show = false;
            },
            "ev_editCanceled": function () {
                this.importModel = false;
                this.importingModel = false;
            },
            "ev_importShow": function () {
                this.importingModel = true;
            },
            "ev_importCanceled": function () {
                this.$dispatch("ev_main");
            }
        }
    };
    var component = Vue.extend(opts);
    Vue.component('import-progress', component);
});