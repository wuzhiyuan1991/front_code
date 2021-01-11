define(function (require) {

    var LIB = require('lib');
    require("vue");

    var template = require("text!./main.html");

    var opts = {
        template: template,
        props: {
            recordId:String,
            title: {
                type: String,
                default: ''
            },
            remark: {
                type: String,
                default: "参考资料"
            },
            data: {
                type: Array,
                "default" : function(){return [];}
            },
            config:{
                type:Object,
                "default" : function(){return [];}
            },
            readonly: {
                type: Boolean,
                default: false
            },
            class:{
                type: String,
                default: null
            },
            limitFile:{
                type: Boolean,
                default: true
            },
        },
        computed: {
            params : function () {
                if(this.config.params) {
                    return this.config.params;
                }
                return {
                    recordId: null,
                    dataType: null,
                    fileType: null
                };
                // return {
                //     recordId: null,
                //     dataType: null,
                //     fileType: null
                // };
            },
            filters : function () {
                var defaultFilters = {
                    max_file_size: '10mb',
                    mime_types: [{title: "files", extensions: "png,jpg,jpeg,mp4,avi,flv,3gp,pdf,doc,docx,xls,xlsx,ppt,pptx,zip,rar,txt"}],
                    limit_file_num: this.limitFile
                }
                if(this.config.filters) {
                    _.defaults(this.config.filters, defaultFilters);
                    return this.config.filters;
                }
                return defaultFilters;
            },
            fileType : function() {
                return this.filters.mime_types[0].extensions;
            },
            fileMaxSize : function() {
                return this.filters.max_file_size;
            },
            limitFileNum: function() {
                return this.filters.limit_file_num;
            },
            maxFileNum:function(){
                return this.filters.max_file_num||9;
            },
            showAddFile:function(){
                return !this.readonly && (this.limitFileNum===false||this.data.length<this.maxFileNum);
            }
        },
        methods: {
            convertFileUrl: function(pic) {
              if(pic.attr5 == 'OSS') {
                  return pic.ctxPath;
              } else {
                  return "/file/down/" + (pic.fileId||pic.id);
              }
            },
            doDeleteFile: function (fileId, index) {
                var _this = this;
                LIB.Modal.confirm({
                    title: '确定删除?',
                    onOk: function () {
                        this.$resource("file").delete("file", [fileId]).then(function (data) {
                            if (data.data && data.error != '0') {
                                return;
                            }
                            _this.data.splice(index, 1);
                            LIB.Msg.success("删除成功");

                        })
                    }
                });
            },

            /**
             * 上传文件成功回调
             * @param data
             */
            referMater: function (data) {
                this.data.push({
                    fileId: data.rs.content.id,
                    ctxPath: data.rs.content.ctxPath,
                    attr5: data.rs.content.attr5,
                    orginalName: data.rs.content.orginalName,
                    fileExt: data.rs.content.ext
                });
            },

            renderIcon: function (ext) {
                var cls = {
                    doc: "doc-icon",
                    docx: "doc-icon",
                    pdf: "pdf-icon",
                    xlsx: "excel-icon",
                    xls: "excel-icon",
                    ppt: "ppt-icon",
                    pptx: "ppt-icon",
                    png: "img-icon",
                    jpg: "img-icon",
                    jpeg: "img-icon",
                    gif: "img-icon"
                };
                return cls[ext] || 'oth-icon';
            }
        },
        ready: function () {
        }
    };

    var component = LIB.Vue.extend(opts);
    LIB.Vue.component('file-list-simple-card', component);
});